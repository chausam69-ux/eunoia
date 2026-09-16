"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const links = [
  ["WORK", "/work"],
  ["LAB", "/lab"],
  ["CAPABILITIES", "/capabilities"],
  ["ABOUT", "/about"],
  ["START A PROJECT", "/start"],
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const reduce = useReducedMotion();
  const firstLink = useRef<HTMLAnchorElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const triggerEl = trigger.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        // ponytail: minimal focus trap — cycle within overlay
        const nodes = Array.from(
          document.querySelectorAll<HTMLElement>("#menu a, #menu button")
        );
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      triggerEl?.focus();
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-[950]">
      <div className={`navbar relative z-[960] flex items-center justify-between px-4 py-4 md:px-6 ${open ? "text-ink" : "mix-blend-difference text-paper"}`}>
        <Link href="/" className="t-display text-xl leading-none tracking-tight" aria-label="EUNΟIA home">
          EUNΟIA
        </Link>
        <button
          ref={trigger}
          type="button"
          className="t-meta-lg flex min-h-[44px] items-center gap-3"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span>{open ? "CLOSE" : "MENU"}</span>
          <span aria-hidden="true" className="relative block h-3 w-6">
            <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
            <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300 ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu"
            aria-label="Main"
            className="theme-light fixed inset-0 z-[940] flex flex-col justify-between px-4 pb-6 pt-24 md:px-6"
            style={{ willChange: "transform" }}
            initial={reduce ? false : { y: "-100%" }}
            animate={{ y: 0, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
            exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
          >
            <ul className="flex flex-col gap-1">
              {links.map(([label, href], i) => (
                <li key={href} className="reveal-line">
                  <motion.div
                    initial={reduce ? false : { y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.45 + i * 0.07, ease: [0.2, 0.7, 0.2, 1] }}
                  >
                    <Link
                      ref={i === 0 ? firstLink : undefined}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`t-display block py-1 text-[clamp(2.5rem,9vw,7rem)] transition-colors hover:text-accent ${path.startsWith(href) ? "text-accent" : ""}`}
                    >
                      <span className="t-meta mr-4 inline-block w-8 align-top text-gray">0{i + 1}</span>
                      {label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <div className="t-meta flex flex-wrap justify-between gap-4 text-gray">
              <span>INDEPENDENT DIGITAL PRACTICE BY SANDIP CHAUDHARY</span>
              <span>INDIA → WORLDWIDE</span>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
