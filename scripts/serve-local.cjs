/* Local preview using the same public rewrites and portable form HTTP adapter. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const rules = require('../vercel.json');
const leads = require('../api/leads.js');
const root = path.resolve(__dirname, '../public');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.ttf': 'font/ttf', '.ico': 'image/x-icon', '.mp4': 'video/mp4' };
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/leads') {
    let body = ''; for await (const chunk of req) { body += chunk; if (body.length > 16000) { res.writeHead(413); return res.end(); } }
    req.body = body; req.query = Object.fromEntries(url.searchParams);
    res.status = code => { res.statusCode = code; return res; }; res.json = value => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(value)); };
    try { return await leads(req, res); } catch (_) { res.status(500).json({ ok: false }); return; }
  }
  const redirect = rules.redirects.find(rule => rule.source === url.pathname);
  if (redirect) { res.writeHead(308, { Location: redirect.destination }); return res.end(); }
  const rewrite = rules.rewrites.find(rule => rule.source === url.pathname);
  const target = rewrite ? rewrite.destination : url.pathname;
  let file = path.resolve(root, '.' + target);
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
  const baseHeaders = rules.headers[0].headers;
  baseHeaders.forEach(header => res.setHeader(header.key, header.value));
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log('BEST GYM preview: http://127.0.0.1:' + (process.env.PORT || 4173)));
