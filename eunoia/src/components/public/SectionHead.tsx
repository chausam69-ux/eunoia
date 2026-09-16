import Link from "next/link";
import { Reveal } from "./Reveal";
import { Ticker } from "./Fx";

// `SELECTED WORK 08 ↘` — title + count + diagonal arrow (Lusion pattern)
export function SectionHead({
  title,
  count,
  href,
  label,
  as = "h2",
}: {
  title: string;
  count?: number;
  href?: string;
  label?: string;
  as?: "h1" | "h2";
}) {
  const Tag = as;
  const inner = (
    <span className="flex items-end gap-4">
      <span className="t-display text-[clamp(2.2rem,7vw,6.5rem)]">{title}</span>
      {typeof count === "number" && (
        <span className="t-meta-lg mb-2 flex items-center gap-2 text-gray">
          <Ticker value={count} />
          <span aria-hidden="true" className="text-accent">
            ↘
          </span>
        </span>
      )}
    </span>
  );
  return (
    <div className="mb-[clamp(2.5rem,6vw,5rem)]">
      {label && <p className="t-meta mb-4 text-gray">{label}</p>}
      <Tag className="m-0">
        <Reveal as="span">{href ? <Link href={href} className="hover:text-accent transition-colors">{inner}</Link> : inner}</Reveal>
      </Tag>
    </div>
  );
}

export function MonoLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`t-meta text-gray ${className}`}>
      <span aria-hidden="true">{"////// "}</span>
      {children}
    </p>
  );
}
