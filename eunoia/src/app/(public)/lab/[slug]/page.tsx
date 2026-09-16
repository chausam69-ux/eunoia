import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { MonoLabel } from "@/components/public/SectionHead";
import { RevealLines, FadeIn } from "@/components/public/Reveal";
import { PillLink } from "@/components/public/Pill";

async function getEntry(slug: string) {
  return db.labEntry.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { skills: { include: { skill: true } }, cover: true },
  });
}

export async function generateMetadata({ params }: PageProps<"/lab/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = await getEntry(slug);
  return e ? { title: `${e.title} — Lab`, description: e.summary } : {};
}

// ponytail: content is plain text; paragraphs split on blank lines. Add markdown when needed.
const paras = (s: string) => s.split(/\n\s*\n/).filter(Boolean);

export default async function LabEntryPage({ params }: PageProps<"/lab/[slug]">) {
  const { slug } = await params;
  const e = await getEntry(slug);
  if (!e) notFound();

  return (
    <article>
      <header className="wrap pb-[clamp(3rem,6vw,5rem)] pt-[clamp(7rem,14vw,12rem)]">
        <div className="inner">
          <p className="t-meta mb-8 text-gray">
            LAB {String(e.labNumber).padStart(3, "0")} · {e.type.toUpperCase()} ·{" "}
            {(e.publishedAt ?? e.createdAt).getFullYear()}
          </p>
          <h1 className="t-display max-w-5xl text-[clamp(2.5rem,8vw,7rem)]">
            <RevealLines lines={[e.title]} />
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-gray">{e.summary}</p>
          <div className="t-meta mt-8 flex flex-wrap gap-x-8 gap-y-2 text-gray">
            <span>{e.skills.map((s) => s.skill.name).join(" · ")}</span>
            {e.demoUrl && (
              <a href={e.demoUrl} target="_blank" rel="noreferrer" className="text-paper hover:text-accent">
                DEMO ↗
              </a>
            )}
            {e.githubUrl && (
              <a href={e.githubUrl} target="_blank" rel="noreferrer" className="text-paper hover:text-accent">
                GITHUB ↗
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="theme-light wrap section">
        <div className="inner grid gap-[clamp(3rem,6vw,5rem)] md:grid-cols-12">
          <FadeIn className="md:col-span-3">
            <MonoLabel>NOTES</MonoLabel>
          </FadeIn>
          <FadeIn className="space-y-6 text-xl leading-relaxed md:col-span-6">
            {paras(e.content).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </FadeIn>
          {e.whatILearned && (
            <>
              <FadeIn className="md:col-span-3">
                <MonoLabel>WHAT I LEARNED</MonoLabel>
              </FadeIn>
              <FadeIn className="md:col-span-6">
                <p className="border-l-2 border-accent pl-4 text-xl leading-relaxed">{e.whatILearned}</p>
              </FadeIn>
            </>
          )}
        </div>
      </div>

      <section className="wrap section-sm">
        <div className="inner flex flex-wrap gap-4">
          <PillLink href="/lab">BACK TO LAB</PillLink>
          <Link href="/work" className="t-meta-lg inline-flex min-h-[44px] items-center hover:text-accent">
            SEE FULL PROJECTS →
          </Link>
        </div>
      </section>
    </article>
  );
}
