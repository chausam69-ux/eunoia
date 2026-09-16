import type { Metadata } from "next";
import Image from "next/image";
import { db } from "@/lib/db";
import { Now } from "@/components/public/Now";
import { MonoLabel } from "@/components/public/SectionHead";
import { RevealLines, FadeIn } from "@/components/public/Reveal";
import { PillLink } from "@/components/public/Pill";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [profile, settings, skills] = await Promise.all([
    db.profile.findUnique({ where: { id: 1 } }),
    db.siteSettings.findUnique({ where: { id: 1 } }),
    db.skill.findMany({
      where: { status: { in: ["PORTFOLIO_READY", "CLIENT_READY", "ADVANCED"] } },
      orderBy: { sortOrder: "asc" },
    }),
  ]);
  if (!profile) return null;

  const byCat = ["DATA", "PRODUCT", "DIGITAL", "GROWTH", "AUTOMATION", "AI"].map((c) => ({
    c,
    list: skills.filter((s) => s.category === c).map((s) => s.name),
  }));

  return (
    <article>
      <header className="wrap pb-[clamp(3rem,6vw,5rem)] pt-[clamp(7rem,14vw,12rem)]">
        <div className="inner">
          <p className="t-meta mb-8 text-gray">{"////// "}ABOUT</p>
          <h1 className="t-display max-w-6xl text-[clamp(2.5rem,8vw,7.5rem)]">
            <RevealLines
              lines={["EUNΟIA IS AN INDEPENDENT", "DIGITAL PRACTICE BY", "SANDIP CHAUDHARY."]}
            />
          </h1>
        </div>
      </header>

      <div className="theme-light wrap section">
        <div className="inner grid gap-[clamp(3rem,6vw,5rem)] md:grid-cols-12">
          <FadeIn className="md:col-span-4">
            <div className="relative aspect-square max-w-sm overflow-hidden border border-line-light">
              <Image
                src={profile.avatarUrl || "/sandip.jpg"}
                alt={`Portrait of ${profile.name}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover grayscale"
                priority
              />
            </div>
            <dl className="t-meta mt-6 grid grid-cols-2 gap-y-2 text-gray">
              <dt>NAME</dt>
              <dd className="text-ink">{profile.name.toUpperCase()}</dd>
              <dt>BASE</dt>
              <dd className="text-ink">{profile.locationLabel}</dd>
              <dt>MODEL</dt>
              <dd className="text-ink">INDEPENDENT FREELANCER</dd>
              <dt>STATUS</dt>
              <dd className="text-ink">{profile.availability.toUpperCase()}</dd>
            </dl>
          </FadeIn>

          <div className="space-y-12 md:col-span-7 md:col-start-6">
            <FadeIn>
              <MonoLabel className="mb-4">THE IDEA</MonoLabel>
              <p className="text-xl leading-relaxed md:text-2xl">{profile.bio}</p>
            </FadeIn>
            <FadeIn>
              <MonoLabel className="mb-4">HOW I WORK</MonoLabel>
              <ol className="t-display flex flex-wrap gap-x-6 gap-y-2 text-2xl md:text-4xl">
                {["RESEARCH", "DESIGN", "BUILD", "MEASURE", "AUTOMATE"].map((s, i) => (
                  <li key={s} className="flex items-baseline gap-3">
                    <span className="t-meta text-gray">0{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <p className="mt-6 max-w-xl text-lg text-gray">
                From problem to product. From data to decision. From manual to automated. One person, connected
                systems — never presented as an agency.
              </p>
            </FadeIn>
            <FadeIn>
              <MonoLabel className="mb-4">TOOLS I ACTUALLY USE</MonoLabel>
              <dl className="grid gap-4 sm:grid-cols-2">
                {byCat.map(({ c, list }) => (
                  <div key={c} className="border-t border-line-light pt-3">
                    <dt className="t-meta text-gray">{c}</dt>
                    <dd className="mt-1 text-base">{list.join(" · ") || "—"}</dd>
                  </div>
                ))}
              </dl>
            </FadeIn>
          </div>
        </div>
      </div>

      {settings && (
        <section className="wrap section">
          <div className="inner">
            <Now s={settings} />
            <div className="mt-16 flex flex-wrap gap-4">
              <PillLink href="/start">START A PROJECT</PillLink>
              <a
                href={`mailto:${profile.email}`}
                className="t-meta-lg inline-flex min-h-[44px] items-center hover:text-accent"
              >
                [MAIL] {profile.email.toUpperCase()} ↗
              </a>
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
