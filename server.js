/**
 * Effex / CCC 2026 — Registration Backend
 * ---------------------------------------
 * A tiny, zero-dependency Node.js server that:
 *   1. Serves the existing static website.
 *   2. Accepts convention registrations and stores them in data/registrations.json.
 *   3. Powers an admin dashboard (auth-protected) to view / message registrants.
 *
 * Run:  node server.js   (or `npm start`)
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const DATA_FILE = path.join(DATA_DIR, 'registrations.json');

// Quick admin login. Override with env vars in production.
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'EffexCCC2026!';

// In-memory session tokens (cleared on restart).
const sessions = new Set();

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------
function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

function readRegistrations() {
  ensureStore();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8').trim();
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read registrations:', err.message);
    return [];
  }
}

function writeRegistrations(list) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------
function sendJSON(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    let tooBig = false;
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        // ~1MB guard
        tooBig = true;
        req.destroy();
      }
    });
    req.on('end', () => {
      if (tooBig) return reject(new Error('Payload too large'));
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function isAuthed(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  return token && sessions.has(token);
}

// ---------------------------------------------------------------------------
// Static file serving
// ---------------------------------------------------------------------------
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function serveStatic(req, res, pathname) {
  // Decode + normalize to prevent path traversal.
  let rel = decodeURIComponent(pathname);
  if (rel === '/' || rel === '') rel = '/index.html';
  const safe = path
    .normalize(rel)
    .replace(/^(\.\.[/\\])+/, '')
    .replace(/^[/\\]+/, '');
  let filePath = path.join(ROOT, safe);

  // Never serve the private data store or the server itself as static.
  const blocked = [DATA_FILE, path.join(ROOT, 'server.js')];
  if (blocked.some((b) => path.resolve(filePath) === path.resolve(b))) {
    return sendJSON(res, 403, { error: 'Forbidden' });
  }

  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }
    if (stat.isDirectory()) filePath = path.join(filePath, 'index.html');
    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(content);
    });
  });
}

// ---------------------------------------------------------------------------
// API route handlers
// ---------------------------------------------------------------------------
function cleanStr(v, max = 2000) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

async function handleRegister(req, res) {
  let body;
  try {
    body = await readBody(req);
  } catch (e) {
    return sendJSON(res, 400, { error: e.message });
  }

  const fullName = cleanStr(body.fullName, 200);
  const email = cleanStr(body.email, 200);
  const phone = cleanStr(body.phone, 60);
  const reason = cleanStr(body.reason, 4000);

  if (!fullName || !email || !phone || !reason) {
    return sendJSON(res, 400, { error: 'All fields are required.' });
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return sendJSON(res, 400, { error: 'Please provide a valid email address.' });
  }

  const list = readRegistrations();
  const ticketId = genTicketId();
  const entry = {
    id: crypto.randomUUID(),
    ticketId,
    fullName,
    email,
    phone,
    reason,
    createdAt: new Date().toISOString(),
  };
  list.push(entry);
  writeRegistrations(list);

  return sendJSON(res, 201, { ok: true, ticketId, id: entry.id });
}

function genTicketId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  const bytes = crypto.randomBytes(10);
  for (let i = 0; i < 10; i++) s += chars[bytes[i] % chars.length];
  return s;
}

async function handleLogin(req, res) {
  let body;
  try {
    body = await readBody(req);
  } catch (e) {
    return sendJSON(res, 400, { error: e.message });
  }
  const username = cleanStr(body.username, 100);
  const password = cleanStr(body.password, 200);

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = crypto.randomBytes(24).toString('hex');
    sessions.add(token);
    return sendJSON(res, 200, { ok: true, token });
  }
  return sendJSON(res, 401, { error: 'Invalid username or password.' });
}

function handleLogout(req, res) {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  sessions.delete(token);
  return sendJSON(res, 200, { ok: true });
}

function handleList(req, res, url) {
  if (!isAuthed(req)) return sendJSON(res, 401, { error: 'Unauthorized' });

  const all = readRegistrations();

  // Optional search filter.
  const q = (url.searchParams.get('q') || '').trim().toLowerCase();
  let filtered = all;
  if (q) {
    filtered = all.filter(
      (r) =>
        (r.fullName || '').toLowerCase().includes(q) ||
        (r.email || '').toLowerCase().includes(q) ||
        (r.phone || '').toLowerCase().includes(q)
    );
  }

  // Alphabetical by full name.
  filtered.sort((a, b) =>
    (a.fullName || '').localeCompare(b.fullName || '', undefined, { sensitivity: 'base' })
  );

  const perPage = 20;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  let page = parseInt(url.searchParams.get('page') || '1', 10);
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  const start = (page - 1) * perPage;
  const items = filtered.slice(start, start + perPage);

  return sendJSON(res, 200, {
    ok: true,
    page,
    perPage,
    total,
    totalPages,
    totalAll: all.length,
    items,
  });
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const { pathname } = url;

  // CORS (same-origin by default; kept permissive for flexibility).
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // API routes
  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/register' && req.method === 'POST') return handleRegister(req, res);
    if (pathname === '/api/admin/login' && req.method === 'POST') return handleLogin(req, res);
    if (pathname === '/api/admin/logout' && req.method === 'POST') return handleLogout(req, res);
    if (pathname === '/api/admin/registrations' && req.method === 'GET')
      return handleList(req, res, url);
    return sendJSON(res, 404, { error: 'Not found' });
  }

  // Static files
  if (req.method === 'GET' || req.method === 'HEAD') {
    return serveStatic(req, res, pathname);
  }

  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('405 Method Not Allowed');
});

ensureStore();
server.listen(PORT, () => {
  console.log(`\n  Effex / CCC 2026 backend running`);
  console.log(`  → Site:      http://localhost:${PORT}/`);
  console.log(`  → Dashboard: http://localhost:${PORT}/admin/`);
  console.log(`  → Login:     ${ADMIN_USER} / ${ADMIN_PASS}\n`);
});
