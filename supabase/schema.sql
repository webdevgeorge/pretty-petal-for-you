-- ============================================================================
--  Pretty Petal — admin panel schema
--  Run this in the Supabase SQL editor (Dashboard → SQL → New query → Run),
--  or via the Supabase CLI. Safe to re-run (idempotent).
-- ============================================================================

create extension if not exists pgcrypto;  -- gen_random_uuid()

-- ---------------------------------------------------------------------------
--  admins — allowlist of emails permitted to use /admin
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- Is the currently authenticated user an admin? (used by RLS policies)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------------------------------------------------------------------------
--  submissions — contact / order requests left on the site
-- ---------------------------------------------------------------------------
create table if not exists public.submissions (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  email      text not null,
  phone      text not null,
  note       text,
  status     text not null default 'new' check (status in ('new','read','archived'))
);
create index if not exists submissions_created_at_idx on public.submissions (created_at desc);

-- ---------------------------------------------------------------------------
--  qr_codes — each downloadable QR an admin creates
-- ---------------------------------------------------------------------------
create table if not exists public.qr_codes (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  slug            text not null unique,
  name            text not null,
  destination_url text not null,
  is_active       boolean not null default true,
  require_email   boolean not null default false
);

-- ---------------------------------------------------------------------------
--  qr_scans — one row per scan (logged by /qr/[slug] before redirecting)
-- ---------------------------------------------------------------------------
create table if not exists public.qr_scans (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  qr_code_id  uuid not null references public.qr_codes(id) on delete cascade,
  country     text,
  region      text,
  city        text,
  device_type text,
  os          text,
  browser     text,
  user_agent  text,
  referrer    text,
  ip_hash     text,  -- hashed, never the raw IP
  email       text   -- captured via email gate (optional)
);
create index if not exists qr_scans_qr_code_id_idx on public.qr_scans (qr_code_id);
create index if not exists qr_scans_created_at_idx  on public.qr_scans (created_at desc);

-- ---------------------------------------------------------------------------
--  candles — gallery items shown on the site, managed from /admin/candles
-- ---------------------------------------------------------------------------
create table if not exists public.candles (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  description  text,
  tag          text,
  image_url    text not null,
  is_published boolean not null default true,
  sort_order   integer not null default 0
);
create index if not exists candles_sort_idx on public.candles (sort_order, created_at);

-- ============================================================================
--  Row Level Security
--  Public writes (form submit, scan logging) run server-side with the SERVICE
--  ROLE key, which bypasses RLS — so we only grant access to admins here.
-- ============================================================================
alter table public.admins      enable row level security;
alter table public.submissions enable row level security;
alter table public.qr_codes    enable row level security;
alter table public.qr_scans    enable row level security;
alter table public.candles     enable row level security;

drop policy if exists "admins read"            on public.admins;
drop policy if exists "submissions admin read" on public.submissions;
drop policy if exists "submissions admin write" on public.submissions;
drop policy if exists "qr_codes admin all"     on public.qr_codes;
drop policy if exists "qr_scans admin read"    on public.qr_scans;
drop policy if exists "candles public read"    on public.candles;
drop policy if exists "candles admin all"      on public.candles;

create policy "admins read" on public.admins
  for select to authenticated using (public.is_admin());

create policy "submissions admin read" on public.submissions
  for select to authenticated using (public.is_admin());

create policy "submissions admin write" on public.submissions
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "qr_codes admin all" on public.qr_codes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "qr_scans admin read" on public.qr_scans
  for select to authenticated using (public.is_admin());

-- candles are publicly readable when published; only admins can write.
create policy "candles public read" on public.candles
  for select using (is_published = true);

create policy "candles admin all" on public.candles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
--  FINAL STEP — make yourself an admin (replace with your login email):
--    insert into public.admins (email) values ('you@example.com')
--    on conflict (email) do nothing;
-- ============================================================================
