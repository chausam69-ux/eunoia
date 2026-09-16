"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { THEMES } from "@/lib/constants";

// ?theme=<name> previews a theme without saving. Studio setting is the default.
export function ThemeOverride() {
  const sp = useSearchParams();
  const t = sp.get("theme");
  useEffect(() => {
    if (!t || !THEMES.includes(t)) return;
    const html = document.documentElement;
    const all = THEMES.filter((x) => x !== "system").map((x) => `theme-${x}`);
    html.classList.remove(...all, "theme-force-system");
    if (t === "system") html.classList.add("theme-force-system");
    else html.classList.add(`theme-${t}`);
    return () => html.classList.remove(...all, "theme-force-system");
  }, [t]);
  return null;
}
