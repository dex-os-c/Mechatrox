// On Vercel, the frontend and the /api functions are the same deployment,
// so same-origin ('') just works with no env var needed. Set
// VITE_API_BASE_URL only for local dev when pointing at the standalone
// server/ instead (e.g. http://localhost:4000).
const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

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
