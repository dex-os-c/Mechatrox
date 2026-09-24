import { createClient } from '@supabase/supabase-js'

// This is a static frontend with no backend, so we use the PUBLIC/publishable
// key here — it's safe to ship to the browser. Never put the Supabase
// SECRET key in this project; it would end up readable in the built JS
// bundle. Access control for the `registrations` table is enforced by
// Row Level Security policies in Supabase itself (see the migration SQL),
// not by keeping this key private.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = url && key ? createClient(url, key) : null
