// Vercel serverless proxy for Groq. GROQ_API_KEY is a Vercel environment variable.
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
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
    if (limited(ip)) return res.status(429).json({ error: 'rate limited' });

    const { system, messages } = req.body || {};
    if (!Array.isArray(messages) || typeof system !== 'string') return res.status(400).json({ error: 'bad request' });
    try {
        for (let attempt = 0; attempt < 2; attempt++) {
            const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
                signal: AbortSignal.timeout(20000),
                body: JSON.stringify({
                    model: GROQ_MODEL,
                    messages: [{ role: 'system', content: system }, ...messages],
                    temperature: 0.3,
                    max_completion_tokens: 1500,
                    reasoning_effort: 'low'
                })
            });
            const data = await r.json();
            if (!r.ok) return res.status(r.status).json({ error: 'upstream error' });
            const text = data.choices?.[0]?.message?.content;
            if (text) return res.status(200).json({ text }); // empty means reasoning used the whole budget; retry once
        }
        res.status(200).json({ text: '' });
    } catch (e) {
        res.status(504).json({ error: 'upstream timeout' });
    }
};
