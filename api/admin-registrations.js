import { checkAdminCredentials, getAllRegistrations } from './_db.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { username, password } = req.body || {}
  if (!checkAdminCredentials(username, password)) {
    res.status(401).json({ error: 'Invalid credentials.' })
    return
  }

  try {
    const data = await getAllRegistrations()
    res.status(200).json({ data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to read registrations.' })
  }
}
