// Points at the standalone server/ backend (see server/README or the repo
// root README for how to run it). Must be a real running server — this
// can't hit a bare .db file directly from the browser.
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export async function submitRegistration(payload) {
  const res = await fetch(`${API_BASE}/api/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || 'Failed to submit registration.')
  return body
}

export async function fetchRegistrations({ username, password }) {
  const res = await fetch(`${API_BASE}/api/admin/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || 'Login failed.')
  return body.data || []
}
