/**
 * Shared helpers for the CCC 2026 Netlify Functions backend.
 * (Files prefixed with "_" are not deployed as their own endpoints.)
 */
import crypto from 'node:crypto';

// Admin credentials + signing secret. Override these in the Netlify UI
// (Site settings → Environment variables) for production.
// .trim() guards against a stray space / newline accidentally copied into the
// value in the Netlify UI, which is a common cause of "invalid password".
export const ADMIN_USER = (process.env.ADMIN_USER || 'admin').trim();
export const ADMIN_PASS = (process.env.ADMIN_PASS || 'EffexCCC2026!').trim();
const SECRET = (process.env.ADMIN_SECRET || 'effex-ccc-2026-change-this-secret').trim();

// ---- JSON response helper ----
export function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

// ---- Input sanitising ----
export function clean(v, max = 2000) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

// ---- Ticket id ----
export function genTicketId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(10);
  let s = '';
  for (let i = 0; i < 10; i++) s += chars[bytes[i] % chars.length];
  return s;
}

// ---- Stateless signed tokens (HMAC) ----
// Serverless functions don't share memory, so sessions must be self-contained.
export function makeToken(ttlMs = 1000 * 60 * 60 * 8) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + ttlMs })).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof exp === 'number' && exp > Date.now();
  } catch (_) {
    return false;
  }
}

export function bearer(req) {
  const auth = req.headers.get('authorization') || '';
  return auth.replace(/^Bearer\s+/i, '').trim();
}
