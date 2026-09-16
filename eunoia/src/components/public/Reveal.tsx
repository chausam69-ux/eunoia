"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.2, 0.7, 0.2, 1] as const;

// Masked line reveal. Wrap each line/word group you want to slide up.
export function Reveal({
  children,
  delay = 0,
  as: Tag = "span",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: "span" | "div" | "h1" | "h2" | "p";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const M = motion[Tag];
  return (
    <Tag className={`reveal-line ${className}`}>
      <M
        initial={reduce ? false : { y: "110%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6, ease, delay }}
        style={{ display: "block" }}
      >
        {children}
      </M>
    </Tag>
  );
}

// Reveals each line of text separately. Pass lines as array.
export function RevealLines({
  lines,
  className = "",
  stagger = 0.06,
  as = "span",
}: {
  lines: string[];
  className?: string;
  stagger?: number;
  as?: "span" | "div";
}) {
  return (
    <>
      {lines.map((l, i) => (
        <Reveal key={i} delay={i * stagger} className={className} as={as}>
          {l}
        </Reveal>
      ))}
    </>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
