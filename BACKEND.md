# CCC 2026 — Registration Backend & Admin Dashboard

A lightweight, zero-dependency Node.js backend that captures Cameroon Creative
Convention (CCC) 2026 registrations and powers an admin dashboard.

## Run it

```bash
npm start        # or: node server.js
```

Then open:

- **Website:** http://localhost:3000/
- **Registration form:** http://localhost:3000/convention.html#register
- **Admin dashboard:** http://localhost:3000/admin/

The server runs on port `3000` by default (override with `PORT`).

## Admin login (quick credentials)

| Field    | Value           |
| -------- | --------------- |
| Username | `admin`         |
| Password | `EffexCCC2026!` |

Override in production with environment variables:

```bash
ADMIN_USER=myuser ADMIN_PASS='a-strong-password' PORT=8080 node server.js
```

## How it works

- **Registrations** submitted on `convention.html` are `POST`ed to `/api/register`
  and appended to `data/registrations.json` (each entry gets a UUID, a ticket
  number, and an ISO `createdAt` timestamp).
- **The dashboard** (`/admin/`) requires login, then lists registrants:
  - Sorted **alphabetically** by full name.
  - **Paginated** — 20 names per page.
  - **Search** by name, email, or phone.
  - A **WhatsApp icon** beside each phone opens a pre-filled chat to that number.
  - **Click a name** to open a detail panel with the full reason plus the exact
    **day and time** they registered.
  - **Download PDF** exports the complete list with Effex branding (branded
    header band, blue/navy palette, ticket numbers, timestamps, footer).

## Data & API

`data/registrations.json` is the single source of truth (an array of records).
It is never served as a static file.

| Method | Endpoint                       | Auth  | Purpose                          |
| ------ | ------------------------------ | ----- | -------------------------------- |
| POST   | `/api/register`                | none  | Save a new registration          |
| POST   | `/api/admin/login`             | none  | Get a session token              |
| POST   | `/api/admin/logout`            | token | Invalidate the session token     |
| GET    | `/api/admin/registrations`     | token | Paginated, sorted, searchable    |

Auth uses a Bearer token returned at login and held in server memory (cleared on
restart). The dashboard stores it in `localStorage`.
