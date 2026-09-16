import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { ProjectChapter } from "@/components/public/ProjectChapter";
import { SectionHead } from "@/components/public/SectionHead";

export const metadata: Metadata = { title: "Work" };

const CATS = ["ALL", "DATA", "PRODUCT", "DIGITAL", "GROWTH", "AUTOMATION", "AI"];

export default async function WorkPage({ searchParams }: PageProps<"/work">) {
  const { cat } = await searchParams;
  const active = typeof cat === "string" && CATS.includes(cat) ? cat : "ALL";

  const projects = await db.project.findMany({
    where: {
      status: "PUBLISHED",
      ...(active !== "ALL" ? { skills: { some: { skill: { category: active } } } } : {}),
    },
    orderBy: { projectNumber: "asc" },
    include: { cover: true, skills: { include: { skill: true } } },
  });

  return (
    <section className="wrap pb-[clamp(5rem,12vw,11rem)] pt-[clamp(7rem,14vw,12rem)]">
      <div className="inner">
        <p className="t-meta mb-6 text-gray">{"////// "}WORK</p>
        <SectionHead as="h1" title="WORK IS WHERE THE SKILLS CONNECT." count={projects.length} />

        <nav aria-label="Filter by category" className="mb-[clamp(2rem,5vw,4rem)] flex flex-wrap gap-2 border-y border-line py-5">
          {CATS.map((c) => (
            <Link
              key={c}
              href={c === "ALL" ? "/work" : `/work?cat=${c}`}
              aria-current={active === c ? "page" : undefined}
              data-cat={c}
              className={`t-meta-lg inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 transition-colors ${
                active === c ? "cat-bg cat-border text-ink" : "border-line hover:border-paper"
              }`}
            >
              {active === c && <span className="sr-only">Active: </span>}
              {c !== "ALL" && <span aria-hidden="true" className={`h-2 w-2 rounded-full ${active === c ? "bg-ink" : "cat-bg"}`} />}
              {c}
            </Link>
          ))}
        </nav>

        {projects.length === 0 ? (
          <div className="py-20">
            <p className="t-display text-[clamp(1.8rem,5vw,4rem)]">NOTHING HERE YET.</p>
            <p className="mt-4 max-w-xl text-lg text-gray">Nothing published in this category yet. Check the Lab.</p>
          </div>
        ) : (
          projects.map((p, i) => <ProjectChapter key={p.id} p={p} index={i} />)
        )}
      </div>
    </section>
  );
}
