import { json, ADMIN_USER, ADMIN_PASS, makeToken } from '../lib/shared.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);

  let body;
  try {
    body = await req.json();
  } catch (_) {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const username = (body.username || '').trim();
  const password = (body.password || '').trim();

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return json({ ok: true, token: makeToken() });
  }
  return json({ error: 'Invalid username or password.' }, 401);
};

export const config = { path: '/api/admin/login' };
