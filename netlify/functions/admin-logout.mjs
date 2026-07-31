import { json } from '../lib/shared.mjs';

// Tokens are stateless (signed), so logout is handled client-side by
// discarding the token. This endpoint just acknowledges the request.
export default async () => json({ ok: true });

export const config = { path: '/api/admin/logout' };
