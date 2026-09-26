import { createClient } from '@supabase/supabase-js'

// Hardcoded directly (not read from .env) per the project owner's explicit
// request, to sidestep the classic static-site footgun: Vite bakes
// VITE_* env vars in at BUILD time, so setting them in Vercel/Netlify's
// dashboard without triggering a fresh deploy silently does nothing --
// this is very likely what actually broke the PythonAnywhere attempt.
//
// This is the PUBLISHABLE (anon) key, not the secret key -- Supabase
// designs this one to ship inside client bundles. What it's actually
// allowed to do (insert/select on `registrations`) is controlled entirely
// by the Row Level Security policies on the table, not by keeping this
// key hidden. See supabase/schema.sql in this repo for those policies --
// as set up there, the anon key can also SELECT (read) every
// registration, including every member's phone/email. That's a
// deliberate simplification for this project, not an oversight; if that
// changes, tighten the SELECT policy and move admin reads behind a
// server-side function again (see PR #9's approach for reference).
const SUPABASE_URL = 'https://jrgasoehkgwiuhcoxsqh.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_MtkzrNS2W2blb52-KDkUog_HKqAkTYB'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
