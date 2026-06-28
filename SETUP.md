# Admin panel setup (Supabase)

The site works fine without this — but the **`/admin`** panel (analytics, form
submissions, QR codes) needs a free Supabase project. Do these once.

## 1. Create the Supabase project
1. Go to [supabase.com](https://supabase.com) → **New project** (free tier is plenty).
   *(Or provision it from the **Vercel Marketplace** → Storage → Supabase, which
   auto-injects the env vars into your Vercel project.)*
2. Wait for it to finish provisioning.

## 2. Create the database tables
1. In Supabase → **SQL Editor** → **New query**.
2. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and **Run**.
3. At the bottom of that file, run the `insert into public.admins …` line with **your
   own login email** so you're allowed into the admin.

## 3. Create your admin login
Supabase → **Authentication → Users → Add user** → enter the **same email** you put in
the `admins` table, plus a password. (That's the email/password you'll log in with at
`/admin/login`.)

## 4. Set environment variables
Copy these into **`.env.local`** (local dev) and into **Vercel → Settings → Environment
Variables** (production). Values come from Supabase → **Project Settings → API**.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...        # "anon public" key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...            # "service_role" key — SERVER ONLY, keep secret

# Your production site URL (used to build QR target links)
NEXT_PUBLIC_SITE_URL=https://pretty-petal-for-you.vercel.app

# Random string used to hash visitor IPs in scan logs (any long random value)
SCAN_IP_SALT=change-me-to-something-random

# Optional: a Looker Studio "Embed report" URL to show GA4 on the Analytics page
NEXT_PUBLIC_GA_LOOKER_EMBED_URL=
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` bypasses all security rules. It's only ever used in
> server code here (never sent to the browser). Never expose it client-side.

## 5. Restart / redeploy
- Local: stop and re-run `npm run dev`.
- Production: redeploy on Vercel (env-var changes need a new deploy).

## 6. Use it
- Visit **`/admin`** → you'll be sent to **`/admin/login`** → sign in with the email +
  password from step 3.
- **Submissions** — every contact/order form on the site lands here.
- **QR codes** — create one (name + destination), download the PNG/SVG, and every scan
  is logged (location, device) and forwarded to Google Analytics.
- **Analytics** — QR scan stats from your database + (optionally) a Google Analytics
  embed.

## Notes
- **Before printing QR codes**, connect your real domain (`prettypetal.shop`) in Vercel
  and set `NEXT_PUBLIC_SITE_URL` to it — the QR images encode that URL, so it must be the
  final one.
- Privacy: scans store only **coarse location + a hashed IP**, never the raw IP.
