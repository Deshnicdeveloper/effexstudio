# CCC 2026 — Registration Backend & Admin Dashboard

Captures Cameroon Creative Convention (CCC) 2026 registrations and powers an
admin dashboard. It runs two ways:

- **On Netlify (production)** — serverless **Netlify Functions** + **Netlify Blobs**
  storage. This is what powers `effexstudio.netlify.app` / `effex-studios.com`.
- **Locally** — a zero-dependency Node server (`server.js`) that stores to
  `data/registrations.json`, handy for quick local testing.

Both expose the **same API** (`/api/register`, `/api/admin/*`), so the website and
dashboard code are identical in both environments.

---

## Admin login

| Field    | Value           |
| -------- | --------------- |
| Username | `admin`         |
| Password | `EffexCCC2026!` |

**Change these in production.** In the Netlify UI go to
**Site settings → Environment variables** and set:

| Variable       | Purpose                                              |
| -------------- | --------------------------------------------------- |
| `ADMIN_USER`   | Admin username                                      |
| `ADMIN_PASS`   | Admin password                                      |
| `ADMIN_SECRET` | Random string used to sign login tokens (any value) |

---

## Deploying to Netlify

Everything is already configured (`netlify.toml`, `netlify/functions/`, and the
`@netlify/blobs` dependency in `package.json`). To deploy:

1. Push this repo to the Git provider connected to your Netlify site.
2. Netlify builds automatically:
   - Publishes the static site from the repo root.
   - Deploys the functions in `netlify/functions/` to `/api/*`.
   - **Netlify Blobs** is enabled automatically — no database or extra setup.
3. (Recommended) Set the `ADMIN_*` environment variables above and redeploy.

Then:

- **Registration form:** `https://<your-site>/convention.html#register`
- **Admin dashboard:** `https://<your-site>/admin/`

> Registrations are stored in Netlify Blobs and **persist across deploys**. They
> are tied to the Netlify site, so `effexstudio.netlify.app` and a custom domain
> (`effex-studios.com`) pointed at the same site share the same data.

---

## Running locally

**Option A — plain Node (file storage):**

```bash
npm start            # http://localhost:3000  (stores to data/registrations.json)
```

**Option B — Netlify Functions + Blobs (mirrors production):**

```bash
npm install
npx netlify dev      # http://localhost:8888  (uses a local Blobs sandbox)
```

---

## What the dashboard does

`/admin/` requires login, then lists registrants:

- Sorted **alphabetically** by full name (case-insensitive).
- **Paginated** — 20 names per page, with search by name / email / phone.
- A **WhatsApp icon** beside each phone opens a pre-filled chat to that number.
- **Click a name** for a detail panel: full reason plus the exact **day and time**
  they registered.
- **Download PDF** exports the complete list with Effex branding.

---

## API

| Method | Endpoint                   | Auth  | Purpose                       |
| ------ | -------------------------- | ----- | ----------------------------- |
| POST   | `/api/register`            | none  | Save a new registration       |
| POST   | `/api/admin/login`         | none  | Get a signed session token    |
| POST   | `/api/admin/logout`        | none  | Acknowledge logout            |
| GET    | `/api/admin/registrations` | token | Paginated, sorted, searchable |

Auth uses a **stateless HMAC-signed Bearer token** (returned at login, valid 8h),
so it works across serverless invocations. The dashboard stores it in
`localStorage`. Each registration record has: `id`, `ticketId`, `fullName`,
`email`, `phone`, `reason`, `createdAt` (ISO timestamp).

### Source layout

```
netlify/
  functions/
    register.mjs             POST /api/register
    admin-login.mjs          POST /api/admin/login
    admin-logout.mjs         POST /api/admin/logout
    admin-registrations.mjs  GET  /api/admin/registrations
  lib/
    shared.mjs               auth tokens + helpers (imported, not a route)
server.js                    local-only Node server (file storage)
netlify.toml                 Netlify build + functions config
```
