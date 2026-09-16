import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const SIMULATED =
  "SELF-INITIATED CONCEPT — RESULTS ARE SIMULATED. No client, revenue or user numbers are claimed.";

const skills = [
  // DATA
  ["Excel", "DATA", "ADVANCED"],
  ["Google Sheets", "DATA", "ADVANCED"],
  ["SQL", "DATA", "PORTFOLIO_READY"],
  ["Power BI", "DATA", "PORTFOLIO_READY"],
  ["GA4", "DATA", "PORTFOLIO_READY"],
  ["Looker Studio", "DATA", "PRACTICING"],
  // PRODUCT
  ["Research", "PRODUCT", "CLIENT_READY"],
  ["Requirements", "PRODUCT", "CLIENT_READY"],
  ["UX", "PRODUCT", "PORTFOLIO_READY"],
  ["Figma", "PRODUCT", "PORTFOLIO_READY"],
  ["Roadmaps", "PRODUCT", "PORTFOLIO_READY"],
  // DIGITAL
  ["Landing pages", "DIGITAL", "CLIENT_READY"],
  ["Websites", "DIGITAL", "CLIENT_READY"],
  ["Web apps", "DIGITAL", "PORTFOLIO_READY"],
  ["Next.js", "DIGITAL", "PORTFOLIO_READY"],
  // GROWTH
  ["SEO", "GROWTH", "PORTFOLIO_READY"],
  ["Analytics", "GROWTH", "PORTFOLIO_READY"],
  ["Conversion optimization", "GROWTH", "PRACTICING"],
  // AUTOMATION
  ["n8n", "AUTOMATION", "PORTFOLIO_READY"],
  ["Make", "AUTOMATION", "PRACTICING"],
  ["APIs", "AUTOMATION", "PORTFOLIO_READY"],
  ["CRM", "AUTOMATION", "PRACTICING"],
  ["Workflow design", "AUTOMATION", "PORTFOLIO_READY"],
  // AI
  ["AI integration", "AI", "PORTFOLIO_READY"],
  ["Agents", "AI", "PRACTICING"],
  ["RAG", "AI", "LEARNING"],
  ["Business workflows", "AI", "PORTFOLIO_READY"],
] as const;

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const capabilities = [
  ["UNDERSTAND", "DATA", "Data analysis\nResearch\nProduct discovery\nBusiness requirements", "Unclear numbers, unclear priorities, unclear users."],
  ["DESIGN", "PRODUCT", "UX/UI\nWireframes\nFigma\nInformation architecture\nConversion-focused interfaces", "Interfaces that look fine but don't convert or scale."],
  ["BUILD", "DIGITAL", "Websites\nWeb apps\nDashboards\nLanding pages", "Slow, brittle or template-bound digital products."],
  ["GROW", "GROWTH", "SEO\nGA4\nConversion optimization\nMarketing reporting", "Traffic without measurement, spend without insight."],
  ["CONNECT", "AUTOMATION", "APIs\nWebhooks\nCRM\nIntegrations", "Tools that don't talk to each other."],
  ["AUTOMATE", "AUTOMATION", "n8n\nMake\nWorkflow automation\nLead routing\nReporting automation", "Manual work that eats hours every week."],
  ["INTELLIGENCE", "AI", "AI integrations\nAI agents\nRAG\nKnowledge systems", "Information buried in documents and inboxes."],
] as const;

type P = {
  n: number;
  title: string;
  sub: string;
  short: string;
  problem: string;
  approach: string;
  solution: string;
  flow: string[];
  stack: string[];
  skills: string[];
  featured?: boolean;
  liveUrl?: string;
};

const projects: P[] = [
  {
    n: 1,
    title: "EUNΟIA",
    sub: "Digital Systems Studio identity + platform",
    short: "The brand, site and private studio you are looking at — built as a living portfolio that grows with each new skill.",
    problem:
      "A freelancer with six connected disciplines needs one place that shows how they connect — without pretending to be an agency, and without editing code every time a new skill or project appears.",
    approach:
      "Treat the portfolio as a product. Define the positioning first (problems → systems), then the information architecture, then a content model that lets every project belong to many niches.",
    solution:
      "Next.js App Router site with an art-directed public layer and a private /studio CMS. Projects, lab entries, skills and capabilities are database records. Filters and the capability connector are driven by project↔skill relations.",
    flow: ["POSITIONING", "IA", "CONTENT MODEL", "DESIGN SYSTEM", "PUBLIC SITE", "STUDIO CMS", "PUBLISH LOOP"],
    stack: ["Next.js", "TypeScript", "Tailwind", "Prisma", "SQLite", "Framer Motion"],
    skills: ["UX", "Websites", "Web apps", "Next.js", "Requirements", "Figma"],
    featured: true,
  },
  {
    n: 2,
    title: "NORTHSTAR",
    sub: "Growth Intelligence System",
    short: "A business-intelligence dashboard concept that turns raw sales exports into weekly decisions.",
    problem:
      "Small businesses collect sales data in spreadsheets but never see trend, margin or channel performance in one view. Decisions are made from memory.",
    approach:
      "Model the data first (orders, products, channels, periods), clean it in SQL, then design the dashboard around three questions: what sold, what's changing, what to do next.",
    solution:
      "Excel/SQL pipeline feeding a Power BI report with revenue, margin, channel mix and a 'watch list' of products moving against trend.",
    flow: ["SALES EXPORT", "CLEAN (SQL)", "MODEL", "POWER BI", "WEEKLY REVIEW", "ACTION"],
    stack: ["Excel", "SQL", "Power BI"],
    skills: ["Excel", "SQL", "Power BI", "Analytics"],
    featured: true,
  },
  {
    n: 3,
    title: "SIGNAL",
    sub: "Website analytics + conversion dashboard",
    short: "GA4 measurement plan and Looker Studio report for a content-led service website.",
    problem:
      "A website has traffic, but nobody knows which pages produce inquiries, which sources are wasted, and where visitors drop.",
    approach:
      "Write a measurement plan (events, conversions, parameters), implement it in GA4, then build a report that answers source → page → action in one screen.",
    solution:
      "GA4 event schema with form-start, form-submit and scroll milestones; Looker Studio dashboard with funnel, source quality and landing-page table; SEO opportunity list from Search Console.",
    flow: ["TRAFFIC", "WEBSITE", "GA4 EVENTS", "LOOKER STUDIO", "FUNNEL", "SEO FIXES"],
    stack: ["GA4", "Looker Studio", "Search Console"],
    skills: ["GA4", "Looker Studio", "SEO", "Analytics"],
  },
  {
    n: 4,
    title: "ATLAS",
    sub: "Lead-generation website for a service business",
    short: "Design and build of a conversion-focused site for a fictional home-services company.",
    problem:
      "Service businesses often have a brochure site with no clear path from 'I have a problem' to 'I've booked a call'.",
    approach:
      "Start from the customer's questions, structure pages around problems not services, wireframe in Figma, then build a fast static site with a guided inquiry form.",
    solution:
      "Figma wireframes → Next.js site with problem-first navigation, proof sections, and a three-step inquiry form that feeds a CRM sheet.",
    flow: ["RESEARCH", "WIREFRAMES", "COPY", "BUILD", "FORM → CRM", "SEO BASELINE"],
    stack: ["Figma", "Next.js", "Google Sheets"],
    skills: ["Figma", "UX", "Websites", "Landing pages", "SEO"],
    featured: true,
  },
  {
    n: 5,
    title: "FLOW",
    sub: "Automated lead pipeline",
    short: "An n8n workflow that captures, enriches, scores and routes inbound leads without manual copy-paste.",
    problem:
      "Leads arrive from forms, email and chat. Someone copies them into a sheet, forgets to reply, and nobody knows which ones matter.",
    approach:
      "Map every lead source and every hand-off. Design the workflow as stages (capture → enrich → score → route → follow-up) before touching a tool.",
    solution:
      "n8n workflow: webhook intake → enrichment via API → rule-based scoring → CRM record → Slack/email notification → scheduled follow-up reminder.",
    flow: ["FORM / EMAIL", "WEBHOOK", "ENRICH", "SCORE", "CRM", "NOTIFY", "FOLLOW-UP"],
    stack: ["n8n", "Webhooks", "Google Sheets", "Slack"],
    skills: ["n8n", "APIs", "CRM", "Workflow design"],
    featured: true,
  },
  {
    n: 6,
    title: "ORBIS",
    sub: "AI lead research + qualification concept",
    short: "An AI agent that researches an inbound company and drafts a qualification summary before the first call.",
    problem:
      "Preparing for a discovery call takes 30–60 minutes of manual research. Most of it is repetitive.",
    approach:
      "Define what a good 'pre-call brief' contains, then design an agent that collects the same inputs, with clear boundaries on what it may claim.",
    solution:
      "Workflow triggered from the lead pipeline: fetch public company info → summarise → score fit against criteria → draft brief for human review. Human approves before anything is sent.",
    flow: ["NEW LEAD", "AGENT RESEARCH", "SUMMARY", "FIT SCORE", "HUMAN REVIEW", "CALL"],
    stack: ["n8n", "LLM API", "Google Docs"],
    skills: ["AI integration", "Agents", "Business workflows", "Workflow design", "Research"],
  },
  {
    n: 7,
    title: "PULSE",
    sub: "Product analytics system",
    short: "A product analytics setup that links user behaviour to roadmap decisions.",
    problem:
      "Product teams ship features and argue about impact. Without event data tied to outcomes, prioritisation is opinion.",
    approach:
      "Define north-star and input metrics, write the event taxonomy, instrument the product, then design a Power BI view that product and business both read.",
    solution:
      "GA4 event taxonomy for activation and retention, exported to a warehouse table, modelled in Power BI with cohort and feature-adoption views.",
    flow: ["METRICS", "EVENT TAXONOMY", "GA4", "EXPORT", "POWER BI", "ROADMAP"],
    stack: ["GA4", "SQL", "Power BI", "Figma"],
    skills: ["Roadmaps", "GA4", "Power BI", "UX", "SQL"],
  },
  {
    n: 8,
    title: "FORMA",
    sub: "High-end fashion web experience",
    short: "An editorial, motion-led web experience concept for a fashion label.",
    problem:
      "Fashion brands need a site that feels like the product — but most fashion sites are slow, heavy and inaccessible.",
    approach:
      "Design in motion from the start: typography, image masking and scroll-linked storytelling, with performance and accessibility budgets set before design.",
    solution:
      "Next.js build with masked image reveals, editorial grid, restrained motion and a lookbook that stays under performance budget. 3D exploration planned as a later lab entry.",
    flow: ["ART DIRECTION", "MOTION STUDY", "GRID", "BUILD", "PERF BUDGET", "LOOKBOOK"],
    stack: ["Next.js", "Framer Motion", "Figma"],
    skills: ["Websites", "UX", "Figma", "Next.js"],
  },
];

const labs = [
  ["POWER BI SALES DASHBOARD", "Build", "Rebuilt a sales report in Power BI from a messy Excel export.", "Data modelling matters more than visuals. Star schema first.", ["Power BI", "Excel"]],
  ["GA4 FUNNEL EXPLORATION", "Experiment", "Set up a funnel exploration for a content site and compared it to Looker Studio.", "GA4 explorations are powerful but unshareable; Looker Studio wins for stakeholders.", ["GA4", "Looker Studio"]],
  ["N8N LEAD ROUTER", "Build", "Webhook → scoring → routing workflow in n8n.", "Design the stages on paper before opening n8n. Rewrote it twice otherwise.", ["n8n", "APIs"]],
  ["AI QUALIFICATION AGENT", "Prototype", "Prototype agent that drafts a pre-call brief from a company name.", "Constrain what the model may assert. Unconstrained output invents facts.", ["AI integration", "Agents"]],
  ["NEXT.JS COMMERCE CONCEPT", "Concept", "Product grid + cart flow in Next.js App Router.", "Server Components remove most client state I used to reach for.", ["Next.js", "Web apps"]],
  ["SEO EXPERIMENT", "Research", "Rewrote titles/meta on a small site and tracked impressions over 6 weeks.", "Intent match beat keyword density. Small site = noisy data; longer windows needed.", ["SEO", "Analytics"]],
  ["FIGMA PRODUCT FLOW", "Research", "Mapped an onboarding flow end-to-end before designing screens.", "Flow diagrams surface missing states that screens hide.", ["Figma", "UX"]],
  ["API AUTOMATION TEST", "Technical Note", "Connected two SaaS tools via REST + webhooks, no middleware.", "Retries and idempotency are the actual work. The happy path is 10%.", ["APIs", "Workflow design"]],
] as const;

async function main() {
  await db.inquiry.deleteMany();
  await db.testimonial.deleteMany();
  await db.media.deleteMany();
  await db.labEntry.deleteMany();
  await db.project.deleteMany();
  await db.capability.deleteMany();
  await db.skill.deleteMany();
  await db.profile.deleteMany();
  await db.siteSettings.deleteMany();

  await db.profile.create({
    data: {
      id: 1,
      name: "Sandip Chaudhary",
      headline: "I turn business problems into digital systems.",
      bio: "I am building EUNΟIA around a simple idea: businesses rarely have isolated problems. A website problem can become a data problem. A lead problem can become an automation problem. A product problem can become a UX problem. I like working across those boundaries and connecting the pieces into systems that are useful, measurable and maintainable.",
      locationLabel: "INDIA → WORLDWIDE",
      availability: "Open for selected freelance projects",
      email: "chausam69@gmail.com",
      githubUrl: "https://github.com/",
      linkedinUrl: "https://www.linkedin.com/in/sandip-c-5192b3138/",
      avatarUrl: "/sandip.jpg",
    },
  });

  await db.siteSettings.create({
    data: {
      id: 1,
      nowLearning: "Advanced SQL",
      nowBuilding: "AI Lead Qualification System",
      nowExperimenting: "n8n + APIs",
      openFor: "Selected freelance projects",
    },
  });

  const skillIds = new Map<string, number>();
  let i = 0;
  for (const [name, category, status] of skills) {
    const s = await db.skill.create({
      data: { name, slug: slug(name), category, status, sortOrder: i++ },
    });
    skillIds.set(name, s.id);
  }

  i = 0;
  for (const [name, category, deliverables, whatISolve] of capabilities) {
    await db.capability.create({
      data: { name, slug: slug(name), category, deliverables, whatISolve, sortOrder: i++ },
    });
  }

  for (const p of projects) {
    await db.project.create({
      data: {
        projectNumber: p.n,
        title: p.title,
        slug: slug(p.title),
        shortDescription: `${p.sub}. ${p.short}`,
        problem: p.problem,
        approach: p.approach,
        solution: p.solution,
        result: SIMULATED,
        systemFlow: p.flow.join("\n"),
        stack: p.stack.join("\n"),
        projectType: "SELF_INITIATED",
        year: 2026,
        status: "PUBLISHED",
        featured: !!p.featured,
        liveUrl: p.liveUrl,
        publishedAt: new Date(),
        skills: {
          create: p.skills
            .filter((n) => skillIds.has(n))
            .map((n) => ({ skillId: skillIds.get(n)! })),
        },
      },
    });
  }

  i = 1;
  for (const [title, type, summary, learned, sk] of labs) {
    await db.labEntry.create({
      data: {
        labNumber: i++,
        title,
        slug: slug(title),
        type,
        summary,
        content: summary,
        whatILearned: learned,
        status: "PUBLISHED",
        publishedAt: new Date(),
        skills: {
          create: sk.filter((n) => skillIds.has(n)).map((n) => ({ skillId: skillIds.get(n)! })),
        },
      },
    });
  }

  console.log({
    skills: await db.skill.count(),
    capabilities: await db.capability.count(),
    projects: await db.project.count(),
    labs: await db.labEntry.count(),
  });
}

main().finally(() => db.$disconnect());
