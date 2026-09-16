// One-shot: pivot to "data analyst first", remove video entirely. Safe to re-run.
// npx tsx scripts/pivot-data.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const ROADMAP = [
  "Data analysis / SEO | first services",
  "Web | bigger projects",
  "Automation | recurring, high-value projects",
  "AI | premium projects",
  "Product management | complete project ownership",
].join("\n");

async function main() {
  // 1) remove video entirely
  await db.project.deleteMany({ where: { slug: { in: ["reel-01", "talk", "promo"] } } });
  await db.capability.deleteMany({ where: { category: "VIDEO" } });
  await db.skill.deleteMany({ where: { category: "VIDEO" } });

  // 2) profile + settings
  await db.profile.update({
    where: { id: 1 },
    data: {
      headline: "I TURN MESSY DATA / INTO DECISIONS / THAT PAY.",
      bio: "EUNΟIA is built as a ladder. Today I do data analysis and SEO — dashboards, measurement, reports that change what a business does next — because it is where I can deliver real value now. Each rung funds the next: web, then automation, then AI, then full product ownership. The portfolio grows in that order, honestly, one shipped skill at a time.",
      availability: "Open for data analysis and SEO projects",
    },
  });
  await db.siteSettings.update({
    where: { id: 1 },
    data: {
      roadmap: ROADMAP,
      currentStage: 0,
      nowLearning: "Advanced SQL",
      nowBuilding: "Sales intelligence dashboard",
      nowExperimenting: "GA4 funnel exploration",
      openFor: "Data analysis and SEO projects",
    },
  });

  // 3) public skills: DATA + GROWTH(SEO/GA4/Analytics). Everything else PRACTICING (hidden).
  await db.skill.updateMany({ data: { status: "PRACTICING" } });
  await db.skill.updateMany({ where: { category: "DATA" }, data: { status: "PORTFOLIO_READY" } });
  await db.skill.updateMany({ where: { name: { in: ["Excel", "Google Sheets"] } }, data: { status: "ADVANCED" } });
  await db.skill.updateMany({ where: { name: { in: ["SEO", "Analytics", "GA4", "Looker Studio"] } }, data: { status: "PORTFOLIO_READY" } });

  // 4) capabilities: UNDERSTAND + GROW public
  await db.capability.updateMany({ data: { visibility: "PRIVATE" } });
  await db.capability.updateMany({ where: { slug: { in: ["understand", "grow"] } }, data: { visibility: "PUBLIC" } });

  // 5) publish the data projects only
  await db.project.updateMany({ data: { status: "DRAFT", featured: false } });
  await db.project.updateMany({
    where: { slug: { in: ["northstar", "signal", "pulse"] } },
    data: { status: "PUBLISHED", featured: true, publishedAt: new Date() },
  });

  console.log({
    publicSkills: await db.skill.count({ where: { status: { in: ["PORTFOLIO_READY", "CLIENT_READY", "ADVANCED"] } } }),
    publicCaps: await db.capability.count({ where: { visibility: "PUBLIC" } }),
    published: await db.project.count({ where: { status: "PUBLISHED" } }),
    videoLeft: await db.skill.count({ where: { category: "VIDEO" } }),
  });
}

main().finally(() => db.$disconnect());
