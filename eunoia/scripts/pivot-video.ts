// One-shot: pivot the live DB to "video editing first". Safe to re-run.
// npx tsx scripts/pivot-video.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const ROADMAP = [
  "Video editing | first cash",
  "Data / SEO | more services",
  "Web | bigger projects",
  "Automation | recurring, high-value projects",
  "AI | premium projects",
  "Product management | complete project ownership",
].join("\n");

const VIDEO_SKILLS = [
  ["Premiere Pro", "CLIENT_READY"],
  ["DaVinci Resolve", "PORTFOLIO_READY"],
  ["After Effects", "PORTFOLIO_READY"],
  ["CapCut", "CLIENT_READY"],
  ["Short-form editing", "CLIENT_READY"],
  ["Long-form editing", "PORTFOLIO_READY"],
  ["Colour grading", "PORTFOLIO_READY"],
  ["Sound design", "PORTFOLIO_READY"],
  ["Motion titles", "PORTFOLIO_READY"],
] as const;

const VIDEO_CAPS = [
  ["CUT", "Short-form (Reels, Shorts, TikTok)\nLong-form (YouTube, talks)\nPodcast clips\nAds and promos", "Footage that sits unedited, or edits that lose people in the first three seconds."],
  ["SHAPE", "Storyboarding from raw footage\nPacing and rhythm\nHook-first structure\nCaptions and subtitles", "A message that is clear to you but not to the viewer."],
  ["FINISH", "Colour grading\nSound design and mix\nMotion titles and lower-thirds\nExport for every platform", "Edits that look and sound amateur next to the competition."],
] as const;

const VIDEO_PROJECTS = [
  ["REEL 01", "Short-form sample edit", "A 30-second vertical cut built to hook in the first two seconds.", ["Short-form editing", "CapCut", "Captions"]],
  ["TALK", "Long-form sample edit", "A 10-minute talking-head edit: pacing, B-roll, captions, clean audio.", ["Long-form editing", "Premiere Pro", "Sound design"]],
  ["PROMO", "Product promo sample", "A 45-second promo with motion titles and a graded look.", ["After Effects", "Colour grading", "Motion titles"]],
] as const;

async function main() {
  // 1) profile + settings
  await db.profile.update({
    where: { id: 1 },
    data: {
      headline: "I CUT VIDEO / THAT KEEPS PEOPLE / WATCHING.",
      bio: "EUNΟIA is built as a ladder. Today I edit video — short-form, long-form, promos — because it is the fastest way to deliver real value and earn trust. Each rung funds the next: data and SEO, then web, then automation, then AI, then full product ownership. The portfolio grows in that order, honestly, one shipped skill at a time.",
      availability: "Open for video editing projects",
    },
  });
  await db.siteSettings.update({
    where: { id: 1 },
    data: {
      roadmap: ROADMAP,
      currentStage: 0,
      nowLearning: "DaVinci Resolve colour",
      nowBuilding: "Three sample edits",
      nowExperimenting: "Hook-first short-form structure",
      openFor: "Video editing projects",
    },
  });

  // 2) hide non-video skills publicly (kept in studio), add video skills
  await db.skill.updateMany({ where: { category: { not: "VIDEO" }, status: { in: ["PORTFOLIO_READY", "CLIENT_READY", "ADVANCED"] } }, data: { status: "PRACTICING" } });
  const ids = new Map<string, number>();
  let i = 0;
  for (const [name, status] of VIDEO_SKILLS) {
    const s = await db.skill.upsert({
      where: { slug: slug(name) },
      update: { category: "VIDEO", status, sortOrder: i },
      create: { name, slug: slug(name), category: "VIDEO", status, sortOrder: i },
    });
    ids.set(name, s.id);
    i++;
  }

  // 3) capabilities: non-video → PRIVATE, add video ones
  await db.capability.updateMany({ where: { category: { not: "VIDEO" } }, data: { visibility: "PRIVATE" } });
  i = 0;
  for (const [name, deliverables, whatISolve] of VIDEO_CAPS) {
    await db.capability.upsert({
      where: { slug: slug(name) },
      update: { category: "VIDEO", deliverables, whatISolve, visibility: "PUBLIC", sortOrder: i },
      create: { name, slug: slug(name), category: "VIDEO", deliverables, whatISolve, visibility: "PUBLIC", sortOrder: i },
    });
    i++;
  }

  // 4) concept projects → DRAFT; seed 3 video drafts
  await db.project.updateMany({ where: { status: "PUBLISHED" }, data: { status: "DRAFT", featured: false } });
  const max = (await db.project.aggregate({ _max: { projectNumber: true } }))._max.projectNumber ?? 0;
  let n = max;
  for (const [title, sub, short, sk] of VIDEO_PROJECTS) {
    const s = slug(title);
    const exists = await db.project.findUnique({ where: { slug: s } });
    if (exists) continue;
    n++;
    await db.project.create({
      data: {
        projectNumber: n,
        title,
        slug: s,
        shortDescription: `${sub}. ${short}`,
        problem: "",
        approach: "",
        solution: "",
        result: "SELF-INITIATED SAMPLE — NO CLIENT. Publish when the edit is done.",
        stack: sk.join("\n"),
        projectType: "SELF_INITIATED",
        year: new Date().getFullYear(),
        status: "DRAFT",
        featured: true,
        skills: { create: sk.filter((x) => ids.has(x)).map((x) => ({ skillId: ids.get(x)! })) },
      },
    });
  }

  console.log({
    publicSkills: await db.skill.count({ where: { status: { in: ["PORTFOLIO_READY", "CLIENT_READY", "ADVANCED"] } } }),
    publicCaps: await db.capability.count({ where: { visibility: "PUBLIC" } }),
    publishedProjects: await db.project.count({ where: { status: "PUBLISHED" } }),
    drafts: await db.project.count({ where: { status: "DRAFT" } }),
  });
}

main().finally(() => db.$disconnect());
