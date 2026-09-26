import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { insertRegistration, getAllRegistrations, checkAdminCredentials } from '../api/_db.js'

const PORT = process.env.PORT || 4000

const app = express()
app.use(cors()) // wide open on purpose — see note above
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Public: anyone can submit a registration.
app.post('/api/registrations', async (req, res) => {
  const { team_name, college, department, year, members, events } = req.body || {}
  if (!team_name || !college || !department || !year || !Array.isArray(members) || !Array.isArray(events)) {
    return res.status(400).json({ error: 'Missing or malformed registration fields.' })
  }
  try {
    const id = await insertRegistration({ team_name, college, department, year, members, events })
    res.status(201).json({ id: String(id) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save registration.' })
  }
})

// Admin: username + password sent with every request, checked against
// the values above. No sessions/tokens — deliberately simple.
app.post('/api/admin/registrations', async (req, res) => {
  const { username, password } = req.body || {}
  if (!checkAdminCredentials(username, password)) {
    return res.status(401).json({ error: 'Invalid credentials.' })
  }
  try {
    res.json({ data: await getAllRegistrations() })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to read registrations.' })
  }
})

app.listen(PORT, () => {
  console.log(`Mechatrox server listening on http://localhost:${PORT}`)
  console.log(`SQLite file: data/mechatrox.db (repo root)`)
})
