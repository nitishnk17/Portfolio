// Vercel serverless proxy for Groq. GROQ_API_KEY is a Vercel environment variable.
// Streams the model's answer back as plain text so the widget can render it live.
const hits = new Map(); // best-effort per-instance limit: 20 requests/minute per IP

function limited(ip) {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
    recent.push(now);
    hits.set(ip, recent);
    return recent.length > 20;
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
    const { GROQ_API_KEY, GROQ_MODEL = 'openai/gpt-oss-120b' } = process.env;
    if (!GROQ_API_KEY) return res.status(500).json({ error: 'not configured' });
    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim() || 'unknown';
    if (limited(ip)) return res.status(429).json({ error: 'rate limited' });

    const { system, messages } = req.body || {};
    if (!Array.isArray(messages) || typeof system !== 'string') return res.status(400).json({ error: 'bad request' });

    let upstream;
    try {
        upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
            signal: AbortSignal.timeout(30000),
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [{ role: 'system', content: system }, ...messages],
                stream: true,
                temperature: 0.4,
                max_completion_tokens: 1500,
                reasoning_effort: 'low'
            })
        });
    } catch (e) {
        return res.status(504).json({ error: 'upstream timeout' });
    }
    if (!upstream.ok) return res.status(upstream.status === 429 ? 429 : 502).json({ error: 'upstream error' });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');

    const decoder = new TextDecoder();
    let buf = '';
    try {
        for await (const chunk of upstream.body) {
            buf += decoder.decode(chunk, { stream: true });
            let nl;
            while ((nl = buf.indexOf('\n')) >= 0) {
                const line = buf.slice(0, nl).trim();
                buf = buf.slice(nl + 1);
                if (!line.startsWith('data:')) continue;
                const data = line.slice(5).trim();
                if (data === '[DONE]') continue;
                try {
                    const token = JSON.parse(data).choices?.[0]?.delta?.content;
                    if (token) res.write(token);
                } catch (e) { /* partial or non-JSON line */ }
            }
        }
    } catch (e) { /* upstream dropped mid-stream; end with what we have */ }
    res.end();
};
