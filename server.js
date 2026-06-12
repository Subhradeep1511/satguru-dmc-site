'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.eot':  'application/vnd.ms-fontobject',
  '.md':   'text/plain',
  '.txt':  'text/plain',
  '.pdf':  'application/pdf',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
};

function serve(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const mime = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}

http.createServer((req, res) => {
  // Strip query string and decode
  let url = decodeURIComponent(req.url.split('?')[0]);
  // Remove trailing slash (except root)
  if (url !== '/' && url.endsWith('/')) url = url.slice(0, -1);

  // 1. Try exact file first (covers all assets: css, js, images, fonts…)
  const exact = path.join(ROOT, url);
  if (fs.existsSync(exact) && fs.statSync(exact).isFile()) {
    return serve(res, exact);
  }

  // 2. Named routes
  if (url === '/')                       return serve(res, path.join(ROOT, 'index.html'));
  if (url === '/explore')                return serve(res, path.join(ROOT, 'explore.html'));
  if (url.startsWith('/explore/'))       return serve(res, path.join(ROOT, 'explore', 'index.html'));
  if (url.startsWith('/itinerary/'))     return serve(res, path.join(ROOT, 'itinerary', 'index.html'));

  // 3. Clean URL fallback: /about → about.html, /mice → mice.html, etc.
  const segments = url.split('/').filter(Boolean);
  if (segments.length === 1) {
    const candidate = path.join(ROOT, segments[0] + '.html');
    if (fs.existsSync(candidate)) return serve(res, candidate);
  }

  res.writeHead(404);
  res.end('Page not found');

}).listen(PORT, () => {
  console.log(' INFO  HTML server running at http://localhost:' + PORT);
});
