"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·→+";
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Scramble: text resolves from random glyphs left→right when it enters view. Once.
export function Scramble({ text, className = "", speed = 22 }: { text: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (reduced()) return;
    const el = ref.current!;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const total = text.length * speed;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / total);
        const fixed = Math.floor(p * text.length);
        let s = text.slice(0, fixed);
        for (let i = fixed; i < text.length; i++) s += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        setOut(s);
        if (p < 1) raf = requestAnimationFrame(tick);
        else setOut(text);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [text, speed]);
  return <span ref={ref} className={className} aria-label={text}>{out}</span>;
}

// Ticker: number counts up from 0 when in view. Keeps zero-padding.
export function Ticker({ value, pad = 2, duration = 900, className = "" }: { value: number; pad?: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current!;
    if (reduced()) { requestAnimationFrame(() => setN(value)); return; }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        setN(Math.round((1 - Math.pow(1 - p, 3)) * value));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);
  return <span ref={ref} className={`tabular-nums ${className}`}>{String(n).padStart(pad, "0")}</span>;
}

// Magnetic: child leans toward the cursor (fine pointers only), springs back on leave.
export function Magnetic({ children, strength = 0.35, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || reduced()) return;
    const el = ref.current!;
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      const x = (e.clientX - (b.left + b.width / 2)) * strength;
      const y = (e.clientY - (b.top + b.height / 2)) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const leave = () => { el.style.transform = "translate(0,0)"; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [strength]);
  return (
    <div ref={ref} className={`inline-block transition-transform duration-300 ease-out ${className}`}>
      {children}
    </div>
  );
}

// Marquee: CSS-only infinite strip. Pauses on hover; static under reduced motion.
export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={`marquee overflow-hidden ${className}`} aria-label={items.join(", ")}>
      <div className="marquee-track flex w-max gap-6 md:gap-10">
        {row.map((t, i) => (
          <span key={i} className="t-meta-lg whitespace-nowrap" aria-hidden={i >= items.length}>
            {t} <span aria-hidden="true" className="ml-6 text-accent md:ml-10">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
