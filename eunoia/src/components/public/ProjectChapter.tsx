import Link from "next/link";
import { Cover } from "./Cover";
import { FadeIn } from "./Reveal";

export type ChapterProject = {
  slug: string;
  projectNumber: number;
  title: string;
  shortDescription: string;
  year: number;
  projectType: string;
  cover: { filePath: string; altText: string } | null;
  skills: { skill: { name: string; category: string } }[];
};

const TYPE: Record<string, string> = {
  CLIENT: "CLIENT WORK",
  SELF_INITIATED: "SELF-INITIATED",
  EXPERIMENT: "EXPERIMENT",
};

// Editorial chapter, alternates alignment. Not a grid card.
export function ProjectChapter({ p, index }: { p: ChapterProject; index: number }) {
  const cats = Array.from(new Set(p.skills.map((s) => s.skill.category)));
  const flip = index % 2 === 1;
  const sub = p.shortDescription.split(". ")[0];
  return (
    <FadeIn>
      <Link
        href={`/work/${p.slug}`}
        className="group grid items-end gap-8 border-t border-line py-[clamp(2.5rem,6vw,5rem)] md:grid-cols-12 md:gap-10"
      >
        <div className={`md:col-span-7 ${flip ? "md:order-2 md:col-start-6" : ""}`}>
          <div data-cat={cats[0]}>
            <Cover slug={p.slug} number={p.projectNumber} label={cats.join(" / ")} image={p.cover} />
          </div>
        </div>
        <div className={`md:col-span-5 ${flip ? "md:order-1 md:col-start-1" : ""}`}>
          <p className="t-meta mb-5 text-gray">
            {String(p.projectNumber).padStart(2, "0")} / {p.year} · {TYPE[p.projectType] ?? p.projectType}
          </p>
          <h3 className="t-display text-[clamp(2.2rem,6vw,5rem)] transition-colors group-hover:text-accent">
            {p.title}
          </h3>
          <p className="mt-3 max-w-md text-lg text-gray">{sub}</p>
          <p className="t-meta mt-6 flex flex-wrap gap-x-4 gap-y-1">
            {cats.map((c) => (
              <span key={c} data-cat={c} className="cat-text">
                {c}
              </span>
            ))}
          </p>
          <p className="t-meta-lg mt-8 inline-flex items-center gap-2">
            VIEW SYSTEM <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </p>
        </div>
      </Link>
    </FadeIn>
  );
}
