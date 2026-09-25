# Mechatrox server

Standalone backend for the registration form, backed by a local SQLite
`.db` file (`server/data/mechatrox.db`, created automatically on first run).

**This must run as its own always-on process — it will NOT work deployed
as a Netlify/Vercel function.** Serverless functions don't keep local files
between requests, so the `.db` file would reset (or fail to write) on every
invocation. Run it:

- **Locally**, e.g. on a laptop at the event: `npm run dev` inside `server/`
- **On a VPS** (DigitalOcean, a college server, etc.): `npm start` behind pm2/systemd
- **On Railway or Render**: deploy `server/` as a Node service with a
  persistent volume mounted at `server/data` (their default ephemeral disk
  will lose the `.db` file on redeploy)

## Setup

```bash
cd server
npm install
cp .env.example .env   # edit ADMIN_USERNAME / ADMIN_PASSWORD if you want
npm run dev
```

Then point the frontend at it: in the repo root `.env`, set
`VITE_API_BASE_URL=http://localhost:4000` (or wherever you deployed it).

## Endpoints

- `POST /api/registrations` — public, inserts a registration
- `POST /api/admin/registrations` — body `{ username, password }`,
  returns all registrations if they match `ADMIN_USERNAME`/`ADMIN_PASSWORD`

No sessions or tokens — the admin page re-sends username/password with
each request. Deliberately simple, not meant to be a hardened auth system.

## Backing up / inspecting data directly

The `.db` file is a plain SQLite database — open it with any SQLite
client (e.g. `sqlite3 server/data/mechatrox.db "select * from registrations;"`
or DB Browser for SQLite) any time, no server required.
