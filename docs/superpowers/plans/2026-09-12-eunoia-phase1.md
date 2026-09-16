# EUNΟIA Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship EUNΟIA public portfolio + private `/studio` CMS, runnable locally via `npm run dev`, by 2026-09-14.

**Architecture:** Next.js App Router. Public pages = Server Components reading Prisma/SQLite. Studio = Server Components + Server Actions behind Auth.js credentials middleware. Motion isolated in a handful of client components.

**Tech Stack:** Next.js 15, TypeScript, Tailwind v4, Prisma + SQLite, Auth.js v5, Framer Motion, Zod, Lucide, bcryptjs.

Spec: `docs/superpowers/specs/2026-09-12-eunoia-phase1-design.md`. Project root: `C:\Users\chaus\Desktop\PRO\eunoia`.

---

## Day 1 — Public

### Task 1: Scaffold + tokens
- [ ] `npx create-next-app@latest eunoia --ts --tailwind --app --src-dir --eslint --no-import-alias`
- [ ] Install: `prisma @prisma/client next-auth@beta bcryptjs zod framer-motion lucide-react`; dev: `tsx @types/bcryptjs`
- [ ] `src/app/globals.css`: tokens `--ink --paper --gray --line --accent`, `@theme` fonts, focus ring, reduced-motion base
- [ ] `src/app/layout.tsx`: `next/font/google` Space Grotesk + JetBrains Mono → CSS vars
- [ ] Copy `1765347636410.jpg` → `public/sandip.jpg`
- [ ] Check: `npm run dev` → :3000 renders, fonts loaded (inspect `font-family`)

### Task 2: Prisma schema + seed
- [ ] `prisma/schema.prisma` per spec §4, `provider = "sqlite"`, `url = "file:./dev.db"`
- [ ] `prisma/seed.ts` — profile, settings, 22 skills, 7 capabilities, 8 projects w/ skills, 8 labs
- [ ] `package.json` `"prisma": {"seed": "tsx prisma/seed.ts"}`
- [ ] `src/lib/db.ts` singleton
- [ ] Check: `npx prisma db push && npx prisma db seed` → counts: projects 8, labs 8, skills 22, capabilities 7

### Task 3: Public shell
- [ ] `src/app/(public)/layout.tsx`: skip link, `<Nav/>`, `<main>`, `<Footer/>`, `<Cursor/>`, `<StatusBar/>`, `<PageTransition/>`
- [ ] `components/public/Nav.tsx` (client): wordmark + MENU button → `MenuOverlay` (focus trap, ESC, stagger)
- [ ] `components/public/Footer.tsx`: `[GH] ↗ [LI] ↗ [MAIL] ↗`, founder line
- [ ] `components/public/Cursor.tsx`, `StatusBar.tsx`, `Reveal.tsx`, `PageTransition.tsx`, `SectionHead.tsx`, `Pill.tsx`
- [ ] Check: nav opens/closes with keyboard; cursor absent on touch emulation

### Task 4: Homepage
- [ ] `components/public/Preloader.tsx` — counter roll, curtain, sessionStorage, reduced-motion skip
- [ ] `components/public/Hero.tsx` + `NarrativeLadder.tsx` — sticky 800vh track, ghost word crossfade, corner `+` marks, stamp
- [ ] `components/public/Connector.tsx` — SVG graph desktop / accordion mobile
- [ ] `components/public/ProjectChapter.tsx` + `lib/covers.ts` + `Cover.tsx` (procedural SVG)
- [ ] `components/public/Now.tsx`
- [ ] `src/app/(public)/page.tsx` assembles: Preloader, Hero, Connector, Selected Work (featured, 4), Now, CTA
- [ ] Check: scroll through ladder shows 8 words in order; connector hover swaps list; 375px no horizontal scroll

### Task 5: Work + project detail
- [ ] `src/app/(public)/work/page.tsx` — `?cat=` filter via searchParams, server-rendered; filter links are `<a>`
- [ ] `src/app/(public)/work/[slug]/page.tsx` — sections A–F, honesty label, related by shared skills, `generateMetadata`
- [ ] Check: `/work?cat=DATA` and `/work?cat=AUTOMATION` both list Northstar; `/work/northstar` shows SIMULATED label

### Task 6: Lab, Capabilities, About
- [ ] `lab/page.tsx`, `lab/[slug]/page.tsx` (content rendered as paragraphs from `\n\n`)
- [ ] `capabilities/page.tsx` — 7 numbered blocks `01 / UNDERSTAND …`
- [ ] `about/page.tsx` — hero line, portrait `next/image`, story, Now block, CTA
- [ ] Check: all four routes 200, headings h1→h2 order

### Task 7: Start a project
- [ ] `components/public/StartForm.tsx` (client, 5 steps, hidden steps, progress indicator, back button)
- [ ] `actions/inquiries.ts` `createInquiry` — Zod, honeypot, insert, return `{ok}`
- [ ] `start/page.tsx` — confirmation state `RECEIVED. EUNΟIA HAS THE SIGNAL.`
- [ ] Check: submit → `Inquiry` row exists (`npx prisma studio` or sqlite query)

## Day 2 — Studio

### Task 8: Auth
- [ ] `src/lib/auth.ts` — Auth.js Credentials, compare `bcrypt` against `STUDIO_PASSWORD_HASH`, JWT session
- [ ] `src/app/api/auth/[...nextauth]/route.ts`, `middleware.ts` matcher `/studio/:path*` except login
- [ ] `scripts/hash-password.ts` → prints hash; `.env.example`
- [ ] `studio/login/page.tsx`
- [ ] Check: `/studio` unauth → redirect login; correct creds → dashboard; wrong → error under field

### Task 9: Studio shell + dashboard
- [ ] `studio/(auth)/layout.tsx` — sidebar, sign-out
- [ ] `components/studio/{Sidebar,DataTable,Field,StatusBadge,ConfirmDelete,SubmitButton}.tsx`
- [ ] `studio/(auth)/page.tsx` — greeting by hour, 5 counts, recent work, recent inquiries, drafts
- [ ] Check: counts match DB

### Task 10: Projects CRUD
- [ ] `actions/projects.ts` — create/update/setStatus/duplicate/delete (Zod, slugify, revalidate)
- [ ] `studio/(auth)/projects/page.tsx` table; `projects/new/page.tsx`; `projects/[id]/page.tsx` — shared `ProjectForm.tsx` with skills checkbox grid
- [ ] Check: create draft → not on `/work`; publish → appears; unpublish → gone

### Task 11: Lab, Skills, Capabilities CRUD
- [ ] `actions/{lab,skills,capabilities}.ts` + pages (same pattern as Task 10; skills + capabilities inline-edit tables)
- [ ] Check: new skill `LEARNING` hidden publicly; set `PORTFOLIO_READY` → visible in connector list

### Task 12: Media, Testimonials, Inquiries, Settings
- [ ] `actions/media.ts` upload → `public/uploads`, alt required; media grid page; "set as cover" on project form
- [ ] `actions/testimonials.ts` + page (publish only if permission)
- [ ] `actions/inquiries.ts` `updateInquiry` status/notes/nextAction; inquiries table + detail
- [ ] `actions/settings.ts` profile + Now block; settings page
- [ ] Check: upload jpg → shows on project cover; inquiry status change persists; Now text edits show on `/`

### Task 13: Verification pass
- [ ] `scripts/smoke.ts` — fetch all public routes + login, assert 200 + text; run: `npx tsx scripts/smoke.ts`
- [ ] Playwright screenshots 375/768/1440 of `/`, `/work`, `/work/northstar`, `/start`, `/studio`
- [ ] Keyboard pass: Tab through home + menu + start form
- [ ] `npm run build` clean
- [ ] README: setup, env, hash password, seed, deploy note
