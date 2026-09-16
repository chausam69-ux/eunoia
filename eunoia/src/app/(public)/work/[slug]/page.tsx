import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Cover } from "@/components/public/Cover";
import { MonoLabel } from "@/components/public/SectionHead";
import { RevealLines, FadeIn } from "@/components/public/Reveal";
import { PillLink } from "@/components/public/Pill";

const TYPE: Record<string, string> = {
  CLIENT: "CLIENT WORK",
  SELF_INITIATED: "SELF-INITIATED",
  EXPERIMENT: "EXPERIMENT",
};

async function getProject(slug: string) {
  return db.project.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { cover: true, skills: { include: { skill: true } } },
  });
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return {};
  return { title: p.seoTitle ?? p.title, description: p.seoDescription ?? p.shortDescription };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) notFound();

  const cats = Array.from(new Set(p.skills.map((s) => s.skill.category)));
  const related = await db.project.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: p.id },
      skills: { some: { skill: { category: { in: cats } } } },
    },
    take: 3,
    orderBy: { projectNumber: "asc" },
    select: { slug: true, title: true, projectNumber: true },
  });

  const [sub, ...rest] = p.shortDescription.split(". ");
  const flow = p.systemFlow.split("\n").filter(Boolean);
  const skillNames = p.skills.map((s) => s.skill.name);
  const stack = p.stack
    .split("\n")
    .filter(Boolean)
    .filter((s) => !skillNames.some((n) => n.toLowerCase() === s.toLowerCase()));

  return (
    <article>
      {/* Opening — dark */}
      <header className="wrap pb-[clamp(3rem,6vw,5rem)] pt-[clamp(7rem,14vw,12rem)]">
        <div className="inner">
          <p className="t-meta mb-8 text-gray">
            PROJECT {String(p.projectNumber).padStart(3, "0")} · {p.year} · {TYPE[p.projectType] ?? p.projectType}
          </p>
          <h1 className="t-display text-[clamp(3rem,12vw,12rem)]">
            <RevealLines lines={[p.title]} />
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-gray md:text-2xl">{sub}</p>
          <div className="t-meta mt-12 flex flex-wrap gap-x-8 gap-y-3 text-gray">
            <span className="flex flex-wrap gap-x-4">
              {cats.map((c) => (
                <span key={c} data-cat={c} className="cat-text">{c}</span>
              ))}
            </span>
            <span>STATUS: SHIPPED</span>
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-paper hover:text-accent">
                LIVE ↗
              </a>
            )}
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-paper hover:text-accent">
                GITHUB ↗
              </a>
            )}
          </div>
          <div className="group mt-[clamp(3rem,6vw,5rem)]" data-cat={cats[0]}>
            <Cover slug={p.slug} number={p.projectNumber} label={cats.join(" / ")} image={p.cover} />
          </div>
        </div>
      </header>

      {/* Documentary — light */}
      <div className="theme-light wrap section">
        <div className="inner grid gap-[clamp(3rem,6vw,5rem)] md:grid-cols-12">
          <Section label="A / THE PROBLEM" text={p.problem} />
          <Section label="B / THE THINKING" text={p.approach}>
            <Ladder steps={["OBSERVATION", "RESEARCH", "HYPOTHESIS", "DESIGN", "BUILD"]} />
          </Section>
          <Section label="C / THE SYSTEM" text={p.solution}>
            {flow.length > 0 && <Ladder steps={flow} />}
          </Section>
          <Section label="D / THE RESULT" text={p.result} accent={p.projectType !== "CLIENT"} />
          <div className="md:col-span-12">
            <MonoLabel className="mb-6">E / THE STACK</MonoLabel>
            <ul className="flex flex-wrap gap-3">
              {stack.map((s) => (
                <li key={s} className="t-meta-lg border border-line-light px-4 py-2">
                  {s}
                </li>
              ))}
              {p.skills.map((s) => (
                <li key={s.skill.id} className="t-meta-lg border border-line-light bg-ink px-4 py-2 text-paper">
                  {s.skill.name}
                </li>
              ))}
            </ul>
            {rest.length > 0 && <p className="mt-10 max-w-2xl text-lg">{rest.join(". ")}</p>}
          </div>
        </div>
      </div>

      {/* Related — dark */}
      <section className="wrap section" aria-labelledby="related">
        <div className="inner">
          <MonoLabel className="mb-6">F / RELATED WORK</MonoLabel>
          <h2 id="related" className="t-display mb-10 text-4xl">
            MORE FROM {cats.slice(0, 2).join(" + ")}
          </h2>
          <ul className="divide-y divide-line border-y border-line">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/work/${r.slug}`} className="group flex items-baseline justify-between gap-6 py-6 hover:text-accent">
                  <span className="t-display text-3xl md:text-5xl">
                    <span className="t-meta mr-4 text-gray">{String(r.projectNumber).padStart(2, "0")}</span>
                    {r.title}
                  </span>
                  <span className="t-meta hidden text-gray group-hover:text-accent md:block">VIEW SYSTEM →</span>
                </Link>
              </li>
            ))}
            {related.length === 0 && <li className="py-6 text-gray">More coming.</li>}
          </ul>
          <div className="mt-10">
            <PillLink href="/work">ALL PROJECTS</PillLink>
          </div>
        </div>
      </section>
    </article>
  );
}

function Section({
  label,
  text,
  children,
  accent,
}: {
  label: string;
  text: string;
  children?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <FadeIn className="grid gap-6 md:col-span-12 md:grid-cols-12">
      <div className="md:col-span-3">
        <MonoLabel>{label}</MonoLabel>
      </div>
      <div className="md:col-span-6">
        <p
          className={
            accent
              ? "t-meta-lg border-l-2 border-accent pl-4 leading-loose"
              : "text-xl leading-relaxed md:text-2xl"
          }
        >
          {text || "—"}
        </p>
      </div>
      <div className="md:col-span-3">{children}</div>
    </FadeIn>
  );
}

function Ladder({ steps }: { steps: string[] }) {
  return (
    <ol className="t-meta-lg flex flex-col">
      {steps.map((s, i) => (
        <li key={s + i} className="flex flex-col">
          <span>{s}</span>
          {i < steps.length - 1 && (
            <span aria-hidden="true" className="my-1 text-gray">
              ↓
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
