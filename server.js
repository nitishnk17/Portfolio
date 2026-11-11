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

const { PORT = 8000 } = process.env;
const chatHandler = require('./api/chat.js');
const PUBLIC = new Set(['index.html', 'styles.css', 'script.js', 'chatbot.js', 'chatbot-knowledge.js', 'Nitish_Resume_.pdf']);
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.pdf': 'application/pdf' };

async function chat(req, res) {
    let body = '';
    for await (const chunk of req) {
        body += chunk;
        if (body.length > 100000) return send(res, 413, { error: 'too large' });
    }
    try { req.body = JSON.parse(body); } catch { return send(res, 400, { error: 'bad json' }); }
    // Give the Node response the small Express-style helpers api/chat.js expects.
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (obj) => send(res, res.statusCode, obj);
    chatHandler(req, res);
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
