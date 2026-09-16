import Link from "next/link";
import type { ComponentProps } from "react";
import { Magnetic } from "./Fx";

// `● START A PROJECT` pill. Dot scales on hover.
const base =
  "group/pill inline-flex min-h-[44px] items-center gap-3 rounded-full border border-current px-5 py-2 t-meta-lg transition-colors duration-200 hover:bg-paper hover:text-ink";

export function PillLink({ children, className = "", ...rest }: ComponentProps<typeof Link>) {
  return (
    <Magnetic>
      <Link className={`${base} ${className}`} {...rest}>
        <Dot />
        <span>{children}</span>
      </Link>
    </Magnetic>
  );
}

export function PillButton({ children, className = "", ...rest }: ComponentProps<"button">) {
  return (
    <button className={`${base} ${className}`} {...rest}>
      <Dot />
      <span>{children}</span>
    </button>
  );
}

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="h-2 w-2 rounded-full bg-accent transition-transform duration-200 group-hover/pill:scale-[1.6]"
    />
  );
}
