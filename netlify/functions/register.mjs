import { getStore } from '@netlify/blobs';
import crypto from 'node:crypto';
import { json, clean, genTicketId } from '../lib/shared.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);

  let body;
  try {
    body = await req.json();
  } catch (_) {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const fullName = clean(body.fullName, 200);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 60);
  const reason = clean(body.reason, 4000);

  if (!fullName || !email || !phone || !reason) {
    return json({ error: 'All fields are required.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Please provide a valid email address.' }, 400);
  }

  const entry = {
    id: crypto.randomUUID(),
    ticketId: genTicketId(),
    fullName,
    email,
    phone,
    reason,
    createdAt: new Date().toISOString(),
  };

  try {
    const store = getStore('registrations');
    // One blob per registration → no read-modify-write races between attendees.
    await store.setJSON(`${entry.createdAt}_${entry.id}`, entry);
  } catch (err) {
    return json({ error: 'Could not save your registration. Please try again.' }, 500);
  }

  return json({ ok: true, ticketId: entry.ticketId, id: entry.id }, 201);
};

export const config = { path: '/api/register' };
