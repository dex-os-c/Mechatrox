import { insertRegistration } from './_db.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { team_name, college, department, year, members, events } = req.body || {}
  if (!team_name || !college || !department || !year || !Array.isArray(members) || !Array.isArray(events)) {
    res.status(400).json({ error: 'Missing or malformed registration fields.' })
    return
  }

  try {
    const id = await insertRegistration({ team_name, college, department, year, members, events })
    res.status(201).json({ id: String(id) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save registration.' })
  }
}
