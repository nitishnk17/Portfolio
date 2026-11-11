// Static file server + Groq proxy. The API key stays server-side in .env.
const http = require('http');
const fs = require('fs');
const path = require('path');

try {
    for (const line of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split('\n')) {
        const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
        if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
    }
} catch (e) { /* .env optional if variables are set in the host environment */ }

const { GROQ_API_KEY, GROQ_MODEL = 'openai/gpt-oss-120b', PORT = 8000 } = process.env;
const PUBLIC = new Set(['index.html', 'styles.css', 'script.js', 'chatbot.js', 'chatbot-knowledge.js', 'Nitish_Resume_.pdf']);
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.pdf': 'application/pdf' };

const hits = new Map(); // ip -> [timestamps], 20 requests/minute
function limited(ip) {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
    recent.push(now);
    hits.set(ip, recent);
    return recent.length > 20;
}

async function chat(req, res) {
    if (!GROQ_API_KEY) return send(res, 500, { error: 'not configured' });
    if (limited(req.socket.remoteAddress)) return send(res, 429, { error: 'rate limited' });
    let body = '';
    for await (const chunk of req) {
        body += chunk;
        if (body.length > 100000) return send(res, 413, { error: 'too large' });
    }
    let parsed;
    try { parsed = JSON.parse(body); } catch { return send(res, 400, { error: 'bad json' }); }
    if (!Array.isArray(parsed.messages) || typeof parsed.system !== 'string') return send(res, 400, { error: 'bad request' });
    try {
        const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
            signal: AbortSignal.timeout(20000),
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [{ role: 'system', content: parsed.system }, ...parsed.messages],
                temperature: 0.3,
                max_completion_tokens: 1000,
                reasoning_effort: 'low'
            })
        });
        const data = await r.json();
        if (!r.ok) return send(res, r.status, { error: 'upstream error' });
        send(res, 200, { text: data.choices?.[0]?.message?.content || '' });
    } catch (e) {
        send(res, 504, { error: 'upstream timeout' });
    }
}

function send(res, status, obj) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(obj));
}

http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (req.method === 'POST' && url.pathname === '/api/chat') return chat(req, res);
    const name = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    if (req.method !== 'GET' || !PUBLIC.has(name)) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(name)] });
    fs.createReadStream(path.join(__dirname, name)).pipe(res);
}).listen(PORT, () => console.log(`Portfolio running at http://localhost:${PORT}`));
