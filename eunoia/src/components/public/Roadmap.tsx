import { FadeIn } from "./Reveal";

// The ladder: one rung per line "Skill | outcome". Current rung lit in accent; passed rungs paper; future rungs gray.
export function Roadmap({ raw, current }: { raw: string; current: number }) {
  const rungs = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [skill, outcome = ""] = l.split("|").map((x) => x.trim());
      return { skill, outcome };
    });
  if (rungs.length === 0) return null;

  return (
    <ol className="border-t border-line">
      {rungs.map((r, i) => {
        const state = i < current ? "done" : i === current ? "now" : "next";
        return (
          <li key={i} className="border-b border-line">
            <FadeIn className="grid items-baseline gap-3 py-4 md:grid-cols-12 md:gap-6 md:py-5">
              <span className={`t-meta md:col-span-1 ${state === "now" ? "text-accent" : "text-gray"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`t-display text-[clamp(1.6rem,4vw,3.6rem)] md:col-span-9 ${
                  state === "next" ? "text-paper/80" : state === "now" ? "text-paper" : "text-paper/60"
                }`}
              >
                {r.skill}
              </span>
              <span className="t-meta md:col-span-2 md:text-right">
                {state === "now" && <span className="rounded-full border border-accent px-3 py-1 text-accent">OFFERING NOW</span>}
                {state === "done" && <span className="text-gray">SHIPPED</span>}
                {state === "next" && <span className="text-gray">NEXT</span>}
              </span>
            </FadeIn>
          </li>
        );
      })}
    </ol>
  );
}
