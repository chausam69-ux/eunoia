# EUNΟIA — Phase 1 Design Spec

Date: 2026-09-12. Target: runnable locally by Mon 2026-09-14.
Source brief: `Eunoia_Phase_1_and_Future_Platform (1).md` (repo root). This spec narrows it to what ships in Phase 1.

## 1. Scope

**Public** (8 routes): `/`, `/work`, `/work/[slug]`, `/lab`, `/lab/[slug]`, `/capabilities`, `/about`, `/start`.

**Studio** (private, single user): `/studio/login`, `/studio` (dashboard), `/studio/projects`, `/studio/projects/new`, `/studio/projects/[id]`, `/studio/lab`, `/studio/lab/new`, `/studio/lab/[id]`, `/studio/skills`, `/studio/capabilities`, `/studio/media`, `/studio/testimonials`, `/studio/inquiries`, `/studio/settings`.

Out of scope: client workspaces (Phase 2), WebGL/3D, sound, AI lead classification, Vercel deploy.

## 2. Stack

- Next.js 15 App Router, TypeScript, Tailwind v4
- Prisma + SQLite (`prisma/dev.db`). Migrate to Postgres later = change `provider`.
- Auth.js v5, Credentials provider, one user. `STUDIO_EMAIL` + `STUDIO_PASSWORD_HASH` (bcrypt) in `.env`. No password table.
- Framer Motion for reveals/transitions. Lucide icons.
- Media: `<input type=file>` → `public/uploads/<uuid>.<ext>` + `media` row. (Not durable on Vercel — swap to blob storage at deploy.)
- Fonts: Space Grotesk (display + body), JetBrains Mono (metadata) via `next/font/google`.

## 3. Structure

```
eunoia/
  prisma/schema.prisma, seed.ts
  src/app/(public)/layout.tsx        # nav, footer, cursor, status bar, corner marks
  src/app/(public)/page.tsx          # homepage
  src/app/(public)/{work,lab,capabilities,about,start}/...
  src/app/studio/login/page.tsx
  src/app/studio/(auth)/layout.tsx   # sidebar, session guard
  src/app/studio/(auth)/{page,projects,lab,skills,capabilities,media,testimonials,inquiries,settings}/...
  src/app/api/auth/[...nextauth]/route.ts
  src/actions/{projects,lab,skills,capabilities,media,testimonials,inquiries,settings}.ts
  src/components/public/*            # Preloader, Nav, MenuOverlay, Hero, NarrativeLadder, Connector,
                                     # ProjectChapter, Cover, Now, Footer, Cursor, Reveal, PageTransition
  src/components/studio/*            # Sidebar, DataTable, Field, StatusBadge, PublishButton
  src/lib/{db,auth,slug,covers}.ts
  middleware.ts                      # /studio/* → login unless session
```

Public pages: Server Components, Prisma direct, filter `status = "PUBLISHED"`. Studio: Server Components + `<form action={serverAction}>`. No REST API besides Auth.js.

## 4. Data model (Prisma)

```
Profile        id, name, headline, bio, locationLabel, availability, email, socialLinks(json), avatarUrl
SiteSettings   id=1, nowLearning, nowBuilding, nowExperimenting, openFor
Skill          id, name, slug(u), category, description, status, featured, sortOrder, timestamps
Project        id, projectNumber, title, slug(u), shortDescription, problem, approach, solution, result,
               projectType, clientName?, isSelfInitiated, year, status, coverMediaId?, liveUrl?, githubUrl?,
               featured, seoTitle?, seoDescription?, publishedAt?, timestamps
ProjectSkill   projectId, skillId  (@@id)
LabEntry       id, title, slug(u), type, summary, content, whatILearned, status, coverMediaId?, demoUrl?,
               githubUrl?, publishedAt?, timestamps
LabEntrySkill  labEntryId, skillId (@@id)
Capability     id, name, slug(u), category, description, whatISolve, deliverables, startingPrice?,
               timeline?, visibility, sortOrder
Media          id, filePath, altText, caption?, type, projectId?, labEntryId?, published, createdAt
Testimonial    id, name, role, company, quote, avatarUrl?, projectId?, permissionToPublish, published
Inquiry        id, name, email, company?, need, improve, budget?, timeline?, message, source, status,
               notes?, nextAction?, timestamps
```

Enums as string columns (SQLite): Project/Lab `status ∈ DRAFT|READY|PUBLISHED|ARCHIVED`; Skill `status ∈ LEARNING|PRACTICING|PORTFOLIO_READY|CLIENT_READY|ADVANCED`; Inquiry `status ∈ NEW|REVIEWING|CONTACTED|QUALIFIED|PROPOSAL|WON|LOST|ARCHIVED`; `projectType ∈ CLIENT|SELF_INITIATED|EXPERIMENT`; category ∈ `DATA|PRODUCT|DIGITAL|GROWTH|AUTOMATION|AI`.

Public skill visibility: only `PORTFOLIO_READY|CLIENT_READY|ADVANCED` render publicly.

Seed: profile (Sandip), settings (Now block from brief §13), ~22 skills, 7 capabilities (brief §11), 8 projects (brief §33, all SELF_INITIATED, PUBLISHED, honest copy, results labelled "SELF-INITIATED CONCEPT — RESULTS ARE SIMULATED"), 8 lab entries (brief §10), 0 inquiries, 0 testimonials.

## 5. Visual system

```
Fonts     Space Grotesk 500–700 display: uppercase, tracking -0.03em, leading 0.9. Hero clamp(3rem, 11vw, 12rem).
          Space Grotesk 400 body 18px / 1.6. JetBrains Mono 11–12px uppercase tracking 0.15em for metadata.
Palette   --ink #0A0A0A  --paper #F4F2EE  --gray #8A8A86  --line #262626 (dark) / #D9D6D0 (light)
          --accent #FF4D00. Accent = cursor dot, active filter, status marks, hover duotone. Never sole carrier of meaning.
Theme     Public = dark (ink bg). /work/[slug], /lab/[slug], /about body sections + Studio = light (paper bg).
Grid      12 col, 24px gutter, max 1440. Asymmetric: hero cols 1–8, metadata cols 11–12.
Icons     Lucide 1.5px. No emoji.
```

## 6. Signature details (from Awwwards SOTY research: Lusion v3, Igloo Inc, Chungi Folio)

1. **Boot preloader** (Lusion): full-ink screen, `EUNΟIA / 000` mono bottom-left, numerals roll to 100 over ~1s, thin bar center fills, then ink curtain slides up revealing hero. Runs once per session (`sessionStorage`), skipped under `prefers-reduced-motion`.
2. **Section headers** (Lusion): `SELECTED WORK 08 ↘` — title + DB count + diagonal arrow. Used on home, /work, /lab, /capabilities.
3. **Corner crosshairs** (Lusion): four fixed `+` marks at viewport corners, homepage only. `SCROLL TO EXPLORE ↓` bottom-center in hero.
4. **Pill CTA** (Lusion): `● START A PROJECT` — dot scales 1→1.6 on hover, 200ms.
5. **Mono section labels** (Igloo): `////// THE PROBLEM`, `////// THE SYSTEM`. Footer links `[GH] ↗  [LI] ↗  [MAIL] ↗`.
6. **Status bar** (Igloo): fixed bottom-left mono: `EUNΟIA / 001 · INDIA → WORLDWIDE · LOCAL 14:32`. Clock ticks via client component.
7. **Narrative ladder** (Chungi ghost word + brief §5): hero `sticky` inside 800vh scroll track; word PROBLEM→DATA→PRODUCT→DIGITAL→GROWTH→AUTOMATION→AI→RESULT rendered ~40vw outlined stroke behind hero text; `useScroll` progress picks index; crossfade 300ms. Native scroll, no hijack. Reduced motion: static "PROBLEM → RESULT" strip, no sticky track.
8. **Rotating stamp** (Chungi): SVG `<textPath>` circle `INDEPENDENT DIGITAL PRACTICE · EST 2026 ·` rotates 20s linear, hero bottom-right. Paused under reduced motion.
9. **Menu overlay** (Chungi): nav = wordmark left + `MENU` right. Overlay full-screen paper, links huge display type stagger 50ms, `ESC` closes, focus trapped.
10. **Line reveals** (all): headings split by line into `overflow:hidden` wrappers; `translateY(110%)→0`, 600ms `cubic-bezier(.2,.7,.2,1)`, 60ms stagger, `whileInView once`.
11. **Page transition**: ink panel wipes up on route change, 400ms, via `template.tsx` + Framer `AnimatePresence`.
12. **Procedural covers**: `covers.ts` seeds PRNG from slug → SVG: giant outlined project number + dot/line grid pattern + category words. Hover: accent duotone via `mix-blend-mode`. Replaceable by real media from studio.
13. **Connector** (brief §6): desktop inline SVG — PROBLEM center, 6 discipline nodes on ring, lines. Hover/focus node → node + line accent, skill list below swaps. Nodes are `<button>`. Mobile <768: stacked accordion list.
14. **Custom cursor**: 8px accent dot, `mix-blend-mode: difference`, scales 4× over links. Only `(pointer: fine)`.

## 7. Studio UX

Light theme, sidebar (14 links), `max-w-6xl` content. Tables: plain `<table>`, mono headers, status badge (text + color). Forms: visible labels, Zod validation in action, errors under field, `useFormStatus` for pending. Publish/Unpublish/Archive: one button each, server action, `revalidatePath`. Delete: two-step inline (`Delete` → `Confirm delete?` / `Cancel`) — no `confirm()`. Dashboard stats = `count()` queries. Empty states with CTA.

## 8. Start-a-project form

5 steps, one `<form>`, client-side step state, all fields in DOM (inactive steps `hidden`) → single server action → `Inquiry` row, `source="site"`. Confirmation: `RECEIVED. EUNΟIA HAS THE SIGNAL.` Honeypot field for spam. Validated with Zod.

## 9. Accessibility / performance

Semantic landmarks, skip link, heading order, visible focus (2px accent outline offset 4px), 44px targets, form labels, `aria-live` errors, `prefers-reduced-motion` disables preloader/ladder/stamp/cursor/transitions. Fonts via `next/font` (no FOIT). Images via `next/image`. Client JS limited to: Preloader, Nav/Menu, Ladder, Connector, Cursor, StatusBar clock, Reveal, PageTransition, StartForm, studio forms.

## 10. Testing

- `scripts/smoke.ts` (tsx): runs against `npm run dev` on :3000. GET every public route + `/studio/login` → assert 200 + expected text. Submits `/start` form → asserts `Inquiry` count +1.
- Playwright screenshot pass 375 / 768 / 1440 for `/`, `/work`, `/work/northstar`, `/start`, `/studio` before handoff.

## 11. Deploy note (later)

Vercel: swap SQLite → Turso (`@libsql/client` adapter) or Supabase Postgres; uploads → Vercel Blob. Schema unchanged.
