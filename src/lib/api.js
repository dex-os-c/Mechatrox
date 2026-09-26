import { supabase } from './supabaseClient'

// Client-side only "auth" -- there's no server left to check this
// server-side (see supabaseClient.js for why). Treat the registrations
// table as effectively public data; this is just a soft gate on the UI,
// not real access control.
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = '2k26'

export async function submitRegistration(payload) {
  const { data, error } = await supabase
    .from('registrations')
    .insert({
      team_name: payload.team_name,
      college: payload.college,
      department: payload.department,
      year: payload.year,
      members: payload.members,
      events: payload.events,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message || 'Failed to submit registration.')
  return { id: data.id }
}

export async function fetchRegistrations({ username, password }) {
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    throw new Error('Invalid credentials.')
  }

  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message || 'Failed to read registrations.')
  return data || []
}
