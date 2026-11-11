// Vercel serverless proxy for Gemini. GEMINI_API_KEY is a Vercel environment variable.
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
    const { GEMINI_API_KEY, GEMINI_MODEL = 'gemini-3.8-flash' } = process.env;
    if (!GEMINI_API_KEY) return res.status(500).json({ error: 'not configured' });
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
    if (limited(ip)) return res.status(429).json({ error: 'rate limited' });

    const { systemInstruction, contents } = req.body || {};
    if (!Array.isArray(contents)) return res.status(400).json({ error: 'bad request' });
    try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
            body: JSON.stringify({
                systemInstruction,
                contents,
                generationConfig: { temperature: 0.3, maxOutputTokens: 600 }
            })
        });
        res.status(r.status).json(await r.json());
    } catch (e) {
        res.status(502).json({ error: 'upstream failure' });
    }
};
