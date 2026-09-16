"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["DASHBOARD", "/studio"],
  ["PROJECTS", "/studio/projects"],
  ["LAB", "/studio/lab"],
  ["SKILLS", "/studio/skills"],
  ["CAPABILITIES", "/studio/capabilities"],
  ["MEDIA", "/studio/media"],
  ["TESTIMONIALS", "/studio/testimonials"],
  ["INQUIRIES", "/studio/inquiries"],
  ["SETTINGS", "/studio/settings"],
] as const;

export function Sidebar({ signOutAction }: { signOutAction: () => Promise<void> }) {
  const path = usePathname();
  return (
    <aside className="border-b border-line-light bg-white md:sticky md:top-0 md:h-dvh md:w-56 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between px-4 py-4 md:block md:px-5 md:py-6">
        <div>
          <p className="t-display text-xl">EUNΟIA</p>
          <p className="t-meta text-gray">STUDIO</p>
        </div>
        <Link href="/" className="t-meta text-gray hover:text-accent md:mt-3 md:block">
          VIEW SITE ↗
        </Link>
      </div>
      <nav aria-label="Studio" className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:px-3 md:pb-0">
        {items.map(([l, h]) => {
          const active = h === "/studio" ? path === h : path.startsWith(h);
          return (
            <Link
              key={h}
              href={h}
              aria-current={active ? "page" : undefined}
              className={`t-meta-lg whitespace-nowrap px-3 py-2.5 transition-colors ${
                active ? "bg-ink text-paper" : "hover:bg-paper"
              }`}
            >
              {l}
            </Link>
          );
        })}
      </nav>
      <form action={signOutAction} className="hidden px-3 pt-6 md:block">
        <button type="submit" className="t-meta px-3 py-2 text-gray hover:text-accent">
          SIGN OUT →
        </button>
      </form>
    </aside>
  );
}
