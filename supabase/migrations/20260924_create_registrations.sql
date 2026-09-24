-- Run this once in the Supabase SQL editor (or via `supabase db push`)
-- to create the table the registration form writes to.

create table if not exists public.registrations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  team_name   text not null,
  college     text not null,
  department  text not null,
  year        text not null,
  members     jsonb not null,   -- [{ role, name, mobile, email }, ...]
  events      text[] not null   -- [technical_event_title, nontechnical_event_title]
);

-- Row Level Security: the form uses the PUBLIC/publishable key, so without
-- RLS anyone with that key could read every team's contact info. This
-- policy allows anonymous INSERT only — no SELECT policy is defined, so
-- reads are denied by default for the public key. Read registrations from
-- the Supabase dashboard (Table Editor) or with the secret key on a
-- trusted backend, never from the client.
alter table public.registrations enable row level security;

create policy "Public can submit registrations"
  on public.registrations
  for insert
  to anon
  with check (true);
