import { getStore } from '@netlify/blobs';
import { json, verifyToken, bearer } from '../lib/shared.mjs';

export default async (req) => {
  if (!verifyToken(bearer(req))) return json({ error: 'Unauthorized' }, 401);

  const store = getStore('registrations');

  // Collect every registration blob (handles cursor pagination defensively).
  const keys = [];
  let cursor;
  do {
    const res = await store.list(cursor ? { cursor } : undefined);
    for (const b of res.blobs || []) keys.push(b.key);
    cursor = res.cursor;
  } while (cursor);

  const items = (
    await Promise.all(keys.map((k) => store.get(k, { type: 'json' }).catch(() => null)))
  ).filter(Boolean);

  const url = new URL(req.url);

  // Optional search.
  const q = (url.searchParams.get('q') || '').trim().toLowerCase();
  let filtered = items;
  if (q) {
    filtered = items.filter(
      (r) =>
        (r.fullName || '').toLowerCase().includes(q) ||
        (r.email || '').toLowerCase().includes(q) ||
        (r.phone || '').toLowerCase().includes(q)
    );
  }

  // Alphabetical by name.
  filtered.sort((a, b) =>
    (a.fullName || '').localeCompare(b.fullName || '', undefined, { sensitivity: 'base' })
  );

  // Pagination — 20 per page.
  const perPage = 20;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  let page = parseInt(url.searchParams.get('page') || '1', 10);
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  return json({
    ok: true,
    page,
    perPage,
    total,
    totalPages,
    totalAll: items.length,
    items: pageItems,
  });
};

export const config = { path: '/api/admin/registrations' };
