"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SonarGrid } from "./SonarGrid";
import { Scramble } from "./Fx";

// Scene 01: single viewport. Aurora + pointer grid behind the headline.
export function Hero({
  videoUrl,
  posterUrl,
  lines = ["I TURN", "BUSINESS PROBLEMS", "INTO DIGITAL SYSTEMS."],
  subline = "DATA · PRODUCT · DIGITAL · GROWTH · AUTOMATION · AI",
}: {
  videoUrl?: string | null;
  posterUrl?: string | null;
  lines?: string[];
  subline?: string;
}) {
  const reduce = useReducedMotion();

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--mx", `${e.clientX}px`);
    el.style.setProperty("--my", `${e.clientY}px`);
  };

  const headline = (
    <h1 className="t-display relative z-10 max-w-[12ch] text-[clamp(2.5rem,min(13vw,13.5vh),11rem)]">
      {lines.map((l, i) => (
        <span key={l} className="reveal-line">
          <motion.span
            className="block"
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </h1>
  );

  return (
    <section
      onMouseMove={onMove}
      className="snap grain wrap relative flex min-h-dvh flex-col justify-between overflow-hidden pb-10 pt-28 md:pb-12 md:pt-32"
    >
      {videoUrl && (
        <video
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          src={videoUrl}
          poster={posterUrl ?? undefined}
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}
      {!reduce && (
        <>
          <div aria-hidden="true" className="aurora" />
          <SonarGrid />
        </>
      )}
      <Corners />
      <Meta />

      <div className="relative z-10 grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-9">{headline}</div>
        <div className="t-meta flex flex-col gap-2 text-gray md:col-span-3 md:items-end md:text-right">
          <span><Scramble text="SCENE 01 / SYSTEM BOOT" /></span>
          <span className="text-paper"><Scramble text="DATA → INSIGHT → DECISION" speed={30} /></span>
        </div>
      </div>

      <div className="relative z-10 mt-16 flex items-end justify-between gap-6 md:mt-20">
        <p className="t-meta-lg max-w-xl text-gray">{subline}</p>
        <p className="t-meta hidden text-gray md:block">SCROLL TO EXPLORE ↓</p>
        <Stamp />
      </div>
    </section>
  );
}

function Meta() {
  return (
    <div className="t-meta relative z-10 mb-10 flex flex-wrap gap-x-8 gap-y-2 text-gray md:mb-14">
      <span><Scramble text="EUNΟIA / 001" /></span>
      <span><Scramble text="INDEPENDENT DIGITAL PRACTICE" /></span>
      <span><Scramble text="INDIA → WORLDWIDE" /></span>
    </div>
  );
}

function Corners() {
  const c = "absolute t-meta select-none text-gray";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      <span className={`${c} left-4 top-20 md:top-24`}>+</span>
      <span className={`${c} right-4 top-20 md:top-24`}>+</span>
      <span className={`${c} bottom-4 left-4`}>+</span>
      <span className={`${c} bottom-4 right-4`}>+</span>
    </div>
  );
}

function Stamp() {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className="stamp hidden h-24 w-24 text-gray md:block lg:h-28 lg:w-28">
      <defs>
        <path id="stamp-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <text fontFamily="var(--font-jetbrains)" fontSize="7.5" letterSpacing="1.6" fill="currentColor">
        <textPath href="#stamp-circle">INDEPENDENT DIGITAL PRACTICE · EST 2026 · </textPath>
      </text>
      <circle cx="50" cy="50" r="3" fill="var(--accent)" />
    </svg>
  );
}
