# EUNΟIA — Digital Systems Studio

Public portfolio + private `/studio` CMS. Next.js 16 · TypeScript · Tailwind 4 · Prisma 6 / SQLite · Auth.js 5 · Framer Motion.

## Run locally

```bash
npm install
npx prisma db push        # creates prisma/dev.db
npx prisma db seed        # 8 projects, 8 lab entries, 27 skills, 7 capabilities, profile
npm run dev               # http://localhost:3000
```

## Studio login

1. `npx tsx scripts/hash-password.ts yourpassword` → prints a line for `.env`
2. Paste it as `STUDIO_PASSWORD_HASH='...'` in `.env` (keep the `\$` escapes — Next expands `$` in env files)
3. `STUDIO_EMAIL` in `.env` is the login email
4. Open `/studio`


## Edit content

Everything public is a database row: `/studio/projects`, `/studio/lab`, `/studio/skills`, `/studio/capabilities`, `/studio/media`, `/studio/testimonials`, `/studio/inquiries`, `/studio/settings` (profile + NOW block).

Rules baked in:
- Only `PUBLISHED` projects/labs render publicly.
- Skills with status `LEARNING` / `PRACTICING` stay private; `PORTFOLIO_READY` / `CLIENT_READY` / `ADVANCED` show on the connector, about page and filters.
- Media must be explicitly published. Testimonials publish only with permission ticked.
- A project belongs to many skills → appears under every matching `/work?cat=` filter.

## Checks

```bash
npx tsx scripts/smoke.mts   # all public routes + studio gate (dev server must be running)
npx tsc --noEmit
npx eslint src
npm run build
```

## Deploy (Vercel + Neon + Vercel Blob, all free tier)

1. Vercel → Add New Project → import `chausam69-ux/eunoia` → **Root Directory: `eunoia`**
2. Vercel project → Storage → create **Neon Postgres** (sets `DATABASE_URL`) and **Blob** (sets `BLOB_READ_WRITE_TOKEN`)
3. Environment variables: `AUTH_SECRET` (`openssl rand -base64 32`), `AUTH_TRUST_HOST=true`, `STUDIO_EMAIL`, `STUDIO_PASSWORD_HASH`
4. Deploy. Then once, locally with the Neon URL in `.env`: `npx prisma db push && npx prisma db seed`
5. Media uploads go to Blob; `Media.filePath` stores the public blob URL.

## Design references

Awwwards Sites of the Year research (Lusion v3, Igloo Inc, Chungi Folio) — see `../docs/superpowers/specs/2026-09-12-eunoia-phase1-design.md` §6 for which detail came from where.
