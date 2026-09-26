import { createClient } from '@libsql/client'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Local dev with no Turso env set: falls back to a plain local SQLite
// file at <repo root>/data/mechatrox.db (same file whether you run this
// via `vercel dev` or the standalone server/index.js — path is resolved
// from this module's own location, not process.cwd()). On Vercel itself
// this file path is read-only/ephemeral, so TURSO_DATABASE_URL (+
// TURSO_AUTH_TOKEN) MUST be set there — see server/README.md for how to
// create a free Turso database.
const localFilePath = path.join(__dirname, '..', 'data', 'mechatrox.db')
const url = process.env.TURSO_DATABASE_URL || `file:${localFilePath}`
const authToken = process.env.TURSO_AUTH_TOKEN // undefined is fine for local file mode

export const db = createClient({ url, authToken })

await db.execute(`
  CREATE TABLE IF NOT EXISTS registrations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    team_name   TEXT NOT NULL,
    college     TEXT NOT NULL,
    department  TEXT NOT NULL,
    year        TEXT NOT NULL,
    members     TEXT NOT NULL, -- JSON array: [{ role, name, mobile, email }, ...]
    events      TEXT NOT NULL  -- JSON array of event titles
  );
`)

export async function insertRegistration({ team_name, college, department, year, members, events }) {
  const result = await db.execute({
    sql: `INSERT INTO registrations (team_name, college, department, year, members, events)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [team_name, college, department, year, JSON.stringify(members), JSON.stringify(events)],
  })
  return result.lastInsertRowid
}

export async function getAllRegistrations() {
  const result = await db.execute('SELECT * FROM registrations ORDER BY created_at DESC')
  return result.rows.map((r) => ({
    ...r,
    members: JSON.parse(r.members),
    events: JSON.parse(r.events),
  }))
}

export function checkAdminCredentials(username, password) {
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '2k26'
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}
