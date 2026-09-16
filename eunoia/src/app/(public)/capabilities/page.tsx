import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { SectionHead } from "@/components/public/SectionHead";
import { FadeIn } from "@/components/public/Reveal";

export const metadata: Metadata = { title: "Capabilities" };

export default async function CapabilitiesPage() {
  const caps = await db.capability.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <section className="wrap pb-[clamp(5rem,12vw,11rem)] pt-[clamp(7rem,14vw,12rem)]">
      <div className="inner">
        <p className="t-meta mb-6 text-gray">{"////// "}CAPABILITIES</p>
        <SectionHead as="h1" title="WHAT I DO FOR A BUSINESS." count={caps.length} />
        <p className="mb-16 max-w-2xl text-lg text-gray">
          Not job titles. Stages of solving a problem — each backed by tools I actually use.
        </p>

        <ol className="border-t border-line">
          {caps.map((c, i) => {
            const items = c.deliverables.split("\n").filter(Boolean);
            return (
              <li key={c.id} data-cat={c.category} className="border-b border-line">
                <FadeIn className="grid gap-6 py-10 md:grid-cols-12 md:py-14">
                  <div className="md:col-span-1">
                    <span className="t-meta cat-text">{String(i + 1).padStart(2, "0")} /</span>
                  </div>
                  <div className="md:col-span-5">
                    <h2 className="t-display text-[clamp(2.2rem,6vw,5rem)]">{c.name}</h2>
                    {c.whatISolve && <p className="mt-4 max-w-md text-lg text-gray">{c.whatISolve}</p>}
                  </div>
                  <ul className="t-meta-lg flex flex-col gap-2 md:col-span-4">
                    {items.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                  <div className="t-meta flex flex-col gap-2 text-gray md:col-span-2 md:text-right">
                    {c.startingPrice && <span>FROM {c.startingPrice}</span>}
                    {c.timeline && <span>{c.timeline}</span>}
                    <Link href={`/work?cat=${c.category}`} className="text-paper hover:text-accent">
                      RELATED WORK ↘
                    </Link>
                  </div>
                </FadeIn>
              </li>
            );
          })}
        </ol>

      </div>
    </section>
  );
}
