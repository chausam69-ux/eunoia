"use client";

import { useState } from "react";
import Link from "next/link";

export type Group = { category: string; skills: string[]; count: number };

const ORDER = ["DATA", "PRODUCT", "DIGITAL", "GROWTH", "AUTOMATION", "AI"];
const COLOR: Record<string, string> = {
  DATA: "var(--c-data)", PRODUCT: "var(--c-product)", DIGITAL: "var(--c-digital)",
  GROWTH: "var(--c-growth)", AUTOMATION: "var(--c-automation)", AI: "var(--c-ai)",
};
const LABEL: Record<string, string> = {
  DATA: "DATA", PRODUCT: "PRODUCT", DIGITAL: "DIGITAL", GROWTH: "GROWTH", AUTOMATION: "AUTOMATION", AI: "AI",
};

// One problem, many connected systems. SVG ring on desktop; stacked list on mobile.
export function Connector({ groups }: { groups: Group[] }) {
  const [active, setActive] = useState<string>("DATA");
  const colorOf = (c: string) => COLOR[c];
  const byCat = Object.fromEntries(groups.map((g) => [g.category, g]));
  const nodes = ORDER.map((c, i) => {
    const a = (-90 + i * 60) * (Math.PI / 180);
    return { c, x: 50 + 38 * Math.cos(a), y: 50 + 38 * Math.sin(a) };
  });
  const cur = byCat[active];

  return (
    <div className="grid gap-12 md:grid-cols-12 md:gap-10">
      {/* graph — desktop */}
      <div className="hidden md:col-span-7 md:block">
        <svg viewBox="0 0 100 100" className="mx-auto w-full max-w-[560px]" role="group" aria-label="Capability connector">
          {nodes.map((n) => (
            <line
              key={n.c}
              x1="50" y1="50" x2={n.x} y2={n.y}
              stroke={active === n.c ? colorOf(n.c) : "currentColor"}
              strokeOpacity={active === n.c ? 1 : 0.25}
              strokeWidth={active === n.c ? "0.6" : "0.3"}
              className="transition-all duration-300"
            />
          ))}
          <circle cx="50" cy="50" r="9" fill="var(--paper)" data-node-fill="" />
          <text x="50" y="51.5" textAnchor="middle" fontFamily="var(--font-jetbrains)" fontSize="3" fill="var(--ink)" letterSpacing="0.4" data-node-text="">
            PROBLEM
          </text>
          {nodes.map((n) => (
            <g key={n.c}>
              <circle
                cx={n.x} cy={n.y} r="7.5"
                fill={active === n.c ? colorOf(n.c) : "var(--ink)"}
                stroke={colorOf(n.c)}
                strokeWidth={active === n.c ? "0.3" : "0.5"}
                className="transition-all duration-300"
              />
              <text x={n.x} y={n.y + 1} textAnchor="middle" fontFamily="var(--font-jetbrains)" fontSize="2.6" fill={active === n.c ? "var(--ink)" : "var(--paper)"} letterSpacing="0.3">
                {LABEL[n.c]}
              </text>
              {/* HTML button overlay for a11y + hit area */}
              <foreignObject x={n.x - 9} y={n.y - 9} width="18" height="18">
                <button
                  type="button"
                  aria-pressed={active === n.c}
                  aria-label={`${LABEL[n.c]}: ${byCat[n.c]?.skills.join(", ") ?? ""}`}
                  onMouseEnter={() => setActive(n.c)}
                  onFocus={() => setActive(n.c)}
                  onClick={() => setActive(n.c)}
                  className="h-full w-full rounded-full bg-transparent"
                />
              </foreignObject>
            </g>
          ))}
        </svg>
      </div>

      {/* detail panel — desktop */}
      <div className="hidden md:col-span-5 md:flex md:flex-col md:justify-center">
        <p className="t-meta mb-3" style={{ color: colorOf(active) }}>{"////// "}{active}</p>
        <p className="t-display mb-6 text-4xl leading-[1.05]">{cur?.skills.join(" · ")}</p>
        <p className="t-meta text-gray">
          {cur?.count ?? 0} PROJECT{cur?.count === 1 ? "" : "S"} CONNECT HERE ·{" "}
          <Link href={`/work?cat=${active}`} className="text-paper underline underline-offset-4 hover:text-accent">
            VIEW <span aria-hidden="true">↘</span>
          </Link>
        </p>
      </div>

      {/* mobile stacked list */}
      <ul className="flex flex-col divide-y divide-line border-y border-line md:hidden">
        {ORDER.map((c) => (
          <li key={c}>
            <button
              type="button"
              className="flex min-h-[56px] w-full items-center justify-between py-3 text-left"
              aria-expanded={active === c}
              onClick={() => setActive(active === c ? "" : c)}
            >
              <span className="t-display text-2xl" style={{ color: active === c ? colorOf(c) : undefined }}>
                <span aria-hidden="true" className="mr-3 inline-block h-3 w-3 rounded-full align-middle" style={{ background: colorOf(c) }} />
                {LABEL[c]}
              </span>
              <span className="t-meta text-gray">{byCat[c]?.count ?? 0} ↘</span>
            </button>
            {active === c && (
              <div className="pb-4">
                <p className="text-base text-gray">{byCat[c]?.skills.join(" · ")}</p>
                <Link href={`/work?cat=${c}`} className="t-meta mt-2 inline-block underline underline-offset-4">
                  VIEW WORK
                </Link>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
