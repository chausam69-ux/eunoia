import { db } from "@/lib/db";
import { Hero } from "@/components/public/Hero";
import { Roadmap } from "@/components/public/Roadmap";
import { ProjectChapter } from "@/components/public/ProjectChapter";
import { Now } from "@/components/public/Now";
import { SectionHead } from "@/components/public/SectionHead";
import { RevealLines, FadeIn } from "@/components/public/Reveal";
import { PillLink } from "@/components/public/Pill";
import { Marquee, Scramble } from "@/components/public/Fx";

const PUBLIC_SKILL = ["PORTFOLIO_READY", "CLIENT_READY", "ADVANCED"];

export default async function Home() {
  const [projects, total, skills, settings, profile] = await Promise.all([
    db.project.findMany({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { projectNumber: "asc" },
      take: 4,
      include: { cover: true, skills: { include: { skill: true } } },
    }),
    db.project.count({ where: { status: "PUBLISHED" } }),
    db.skill.findMany({
      where: { status: { in: PUBLIC_SKILL } },
      orderBy: { sortOrder: "asc" },
      include: { projects: { where: { project: { status: "PUBLISHED" } }, select: { projectId: true } } },
    }),
    db.siteSettings.findUnique({ where: { id: 1 } }),
    db.profile.findUnique({ where: { id: 1 } }),
  ]);
  // headline: profile.headline split on " / " into lines, e.g. "I CUT VIDEO / THAT KEEPS PEOPLE / WATCHING."
  const lines = (profile?.headline ?? "").includes(" / ") ? profile!.headline.split(" / ") : undefined;
  const publicCats = Array.from(new Set(skills.map((s) => s.category)));
  const subline = publicCats.length ? publicCats.join(" · ") : undefined;

  return (
    <div className="snap-home">
      <Hero videoUrl={settings?.heroVideoUrl} posterUrl={settings?.heroPosterUrl} lines={lines} subline={subline} />

      {/* Skills strip */}
      <div className="border-y border-line py-5 text-gray">
        <Marquee items={skills.map((s) => s.name.toUpperCase())} />
      </div>

      {/* Roadmap */}
      <section className="snap wrap section-sm" aria-labelledby="roadmap">
        <div className="inner grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <p className="t-meta mb-6 text-gray">{"////// "}<Scramble text="SCENE 02 / THE LADDER" /></p>
            <h2 id="roadmap" className="t-display text-[clamp(2rem,5vw,4.5rem)]">
              <RevealLines lines={["ONE SKILL", "AT A TIME."]} />
            </h2>
            <FadeIn className="mt-6 max-w-sm text-base text-gray">
              What I offer today is lit. What comes next is written down, in order.
            </FadeIn>
          </div>
          <div className="md:col-span-8">
            <Roadmap raw={settings?.roadmap ?? ""} current={settings?.currentStage ?? 0} />
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="snap wrap section" aria-labelledby="work">
        <div className="inner">
          <p className="t-meta mb-8 text-gray">{"////// "}<Scramble text="SCENE 03 / SELECTED WORK" /></p>
          <SectionHead title="SELECTED WORK" count={total} href="/work" />
          {projects.length === 0 ? (
            <div className="border-t border-line py-[clamp(3rem,8vw,6rem)]">
              <p className="t-display max-w-3xl text-[clamp(1.8rem,5vw,4rem)]">FIRST CASE STUDIES LANDING SOON.</p>
              <p className="mt-6 max-w-xl text-lg text-gray">
                Work is being published here as it ships — labelled honestly as self-initiated or client. Meanwhile the Lab shows the learning.
              </p>
            </div>
          ) : (
            <div>
              {projects.map((p, i) => (
                <ProjectChapter key={p.id} p={p} index={i} />
              ))}
            </div>
          )}
          <div className="mt-[clamp(3rem,6vw,5rem)] border-t border-line pt-10">
            <PillLink href="/work">ALL WORK</PillLink>
          </div>
        </div>
      </section>

      {/* Now */}
      {settings && (
        <section className="snap wrap section" aria-label="Currently">
          <div className="inner">
            <Now s={settings} />
          </div>
        </section>
      )}
    </div>
  );
}
