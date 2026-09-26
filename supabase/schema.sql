-- Run this once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).

create table if not exists public.registrations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  team_name   text not null,
  college     text not null,
  department  text not null,
  year        text not null,
  members     jsonb not null,
  events      jsonb not null,
  payment_id  text
);

-- Safe to re-run: if the table already existed from before payment_id was
-- added, this adds it now instead of silently no-op'ing like the
-- `create table if not exists` above would.
alter table public.registrations add column if not exists payment_id text;

alter table public.registrations enable row level security;

-- Public INSERT: anyone (the anon/publishable key) can submit a registration.
drop policy if exists "public insert" on public.registrations;
create policy "public insert"
  on public.registrations for insert
  to anon
  with check (true);

-- Public SELECT: per project owner's request ("don't care about security,
-- small project"), the anon key can also read every registration back --
-- this is what lets AdminPage.jsx work with no server component at all.
-- Anyone with the publishable key (which ships in the frontend bundle,
-- so effectively anyone) can read every team's phone number and email.
-- Tighten this later by dropping this policy and moving admin reads
-- behind a server-side function (service_role key) if that's ever a
-- problem -- see PR #9 in the repo history for that exact pattern.
drop policy if exists "public select" on public.registrations;
create policy "public select"
  on public.registrations for select
  to anon
  using (true);
