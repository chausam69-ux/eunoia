import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { SectionHead } from "@/components/public/SectionHead";
import { FadeIn } from "@/components/public/Reveal";

export const metadata: Metadata = { title: "Lab" };

export default async function LabPage() {
  const ORDER = ["DATA", "GROWTH", "DIGITAL", "PRODUCT", "AUTOMATION", "AI"];
  const rank = (cats: string[]) => Math.min(...cats.map((c) => (ORDER.indexOf(c) === -1 ? 99 : ORDER.indexOf(c))), 99);
  const entries = (
    await db.labEntry.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { labNumber: "asc" },
      include: { skills: { include: { skill: true } } },
    })
  ).sort((a, b) => rank(a.skills.map((s) => s.skill.category)) - rank(b.skills.map((s) => s.skill.category)) || a.labNumber - b.labNumber);

  return (
    <section className="wrap pb-[clamp(5rem,12vw,11rem)] pt-[clamp(7rem,14vw,12rem)]">
      <div className="inner">
        <p className="t-meta mb-6 text-gray">{"////// "}LAB</p>
        <SectionHead as="h1" title="LEARNING, PUBLISHED." count={entries.length} />
        <p className="mb-16 max-w-2xl text-lg text-gray">
          Not everything becomes a full case study. The Lab is where experiments, builds and notes live — honest about what
          worked and what didn&apos;t.
        </p>

        <ol className="divide-y divide-line border-y border-line">
          {entries.map((e) => (
            <li key={e.id}>
              <FadeIn>
                <Link
                  href={`/lab/${e.slug}`}
                  className="group grid gap-3 py-6 md:grid-cols-12 md:items-baseline md:gap-6 md:py-8"
                >
                  <span className="t-meta text-gray md:col-span-2">
                    LAB {String(e.labNumber).padStart(3, "0")} / {e.type.toUpperCase()}
                  </span>
                  <span className="t-display text-2xl transition-colors group-hover:text-accent md:col-span-6 md:text-4xl">
                    {e.title}
                  </span>
                  <span className="t-meta md:col-span-3">
                    {e.skills.map((s, i) => (
                      <span key={s.skill.id} data-cat={s.skill.category} className="cat-text">
                        {i > 0 && <span className="text-gray"> · </span>}
                        {s.skill.name}
                      </span>
                    ))}
                  </span>
                  <span className="t-meta hidden text-gray group-hover:text-accent md:col-span-1 md:block md:text-right">
                    →
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ol>
        {entries.length === 0 && <p className="py-20 text-gray">Nothing published yet.</p>}
      </div>
    </section>
  );
}
