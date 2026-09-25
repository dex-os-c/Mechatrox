import Database from 'better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'mechatrox.db')

export const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')

db.exec(`
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

export function insertRegistration({ team_name, college, department, year, members, events }) {
  const stmt = db.prepare(`
    INSERT INTO registrations (team_name, college, department, year, members, events)
    VALUES (@team_name, @college, @department, @year, @members, @events)
  `)
  const info = stmt.run({
    team_name, college, department, year,
    members: JSON.stringify(members),
    events: JSON.stringify(events),
  })
  return info.lastInsertRowid
}

export function getAllRegistrations() {
  const rows = db.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all()
  return rows.map((r) => ({
    ...r,
    members: JSON.parse(r.members),
    events: JSON.parse(r.events),
  }))
}
