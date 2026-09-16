"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

// Fast route change: 180ms crossfade. No curtain — speed over theatre.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={path}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.18 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
