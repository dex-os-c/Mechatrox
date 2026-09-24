// Deploy with: supabase functions deploy admin-export
//
// This is the ONLY place that ever reads the full `registrations` table.
// The public site can only INSERT (see the migration's RLS policy) —
// reading requires this function, which checks the admin id/password
// itself and then uses the SECRET key (auto-injected by the platform,
// never sent to any browser) to query with RLS bypassed.
import { createClient } from 'npm:@supabase/supabase-js@2'

// NOTE: this is a simple shared id/password, not real user auth — fine
// for a low-stakes single-admin symposium tool, not something to reuse
// for anything more sensitive. Change these before deploying if you want
// a different password.
const ADMIN_ID = 'admin'
const ADMIN_PASSWORD = '2k26'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let body
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const { id, password } = body ?? {}
  if (id !== ADMIN_ID || password !== ADMIN_PASSWORD) {
    return json({ error: 'Invalid credentials' }, 401)
  }

  // New-style Supabase secrets are injected as a JSON map; 'default' is
  // the project's current secret key. (Legacy fallback: SUPABASE_SERVICE_ROLE_KEY.)
  let secretKey
  try {
    secretKey = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}').default
  } catch { /* fall through to legacy below */ }
  secretKey ||= Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  if (!secretKey || !supabaseUrl) {
    return json({ error: 'Server misconfigured: no Supabase secret key available to this function.' }, 500)
  }

  const supabaseAdmin = createClient(supabaseUrl, secretKey)
  const { data, error } = await supabaseAdmin
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return json({ error: error.message }, 500)
  return json({ data })
})
