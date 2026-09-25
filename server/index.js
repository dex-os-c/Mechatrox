import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { insertRegistration, getAllRegistrations } from './db.js'

const PORT = process.env.PORT || 4000
// Simple shared credentials, not per-user auth — matches what was asked
// for (username/password gate, security not a priority here). Set these
// in server/.env for anything beyond the default.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '2k26'

const app = express()
app.use(cors()) // wide open on purpose — see note above
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Public: anyone can submit a registration.
app.post('/api/registrations', (req, res) => {
  const { team_name, college, department, year, members, events } = req.body || {}
  if (!team_name || !college || !department || !year || !Array.isArray(members) || !Array.isArray(events)) {
    return res.status(400).json({ error: 'Missing or malformed registration fields.' })
  }
  try {
    const id = insertRegistration({ team_name, college, department, year, members, events })
    res.status(201).json({ id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save registration.' })
  }
})

// Admin: username + password sent with every request, checked against
// the values above. No sessions/tokens — deliberately simple.
app.post('/api/admin/registrations', (req, res) => {
  const { username, password } = req.body || {}
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials.' })
  }
  try {
    res.json({ data: getAllRegistrations() })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to read registrations.' })
  }
})

app.listen(PORT, () => {
  console.log(`Mechatrox server listening on http://localhost:${PORT}`)
  console.log(`SQLite file: server/data/mechatrox.db`)
})
