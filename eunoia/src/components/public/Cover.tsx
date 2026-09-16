import Image from "next/image";
import { coverSpec } from "@/lib/covers";

type Props = {
  slug: string;
  number: number;
  label?: string;
  image?: { filePath: string; altText: string; type?: string } | null;
  className?: string;
};

// Cover = real media if set, else procedural SVG. Accent duotone on group hover.
export function Cover({ slug, number, label, image, className = "" }: Props) {
  if (image && image.type === "video") {
    return (
      <div className={`relative overflow-hidden bg-line ${className}`} style={{ aspectRatio: "3/2" }}>
        <video
          src={image.filePath}
          aria-label={image.altText}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => e.currentTarget.pause()}
        />
        <span className="t-meta absolute bottom-3 left-3 text-paper/80">▶ HOVER TO PLAY</span>
      </div>
    );
  }
  if (image) {
    return (
      <div className={`relative overflow-hidden bg-line ${className}`} style={{ aspectRatio: "3/2" }}>
        <Image
          src={image.filePath}
          alt={image.altText}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="cat-bg pointer-events-none absolute inset-0 opacity-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-60" />
      </div>
    );
  }

  const spec = coverSpec(slug);
  const num = String(number).padStart(3, "0");

  return (
    <div className={`relative overflow-hidden border border-line ${className}`} style={{ aspectRatio: "3/2" }}>
      <svg
        viewBox="0 0 100 66"
        className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.03]"
        aria-hidden="true"
      >
        <rect width="100" height="66" fill="var(--cover-bg, var(--ink))" />
        <g stroke="var(--cover-fg, var(--paper))" strokeOpacity="0.18" strokeWidth="0.2" fill="none">
          <line x1="0" y1="33" x2="100" y2="33" />
          <line x1="50" y1="0" x2="50" y2="66" />
        </g>
        {spec.family === "grid" && (
          <g fill="var(--cat, var(--paper))" fillOpacity="0.7">
            {spec.cells.map((c, i) => (
              <circle key={i} cx={c.x} cy={c.y} r={c.r * 0.5} />
            ))}
          </g>
        )}
        {spec.family === "rings" && (
          <g stroke="var(--cat, var(--paper))" strokeOpacity="0.7" strokeWidth="0.25" fill="none">
            {spec.rings.map((r, i) => (
              <circle key={i} cx="72" cy="33" r={r} />
            ))}
          </g>
        )}
        {spec.family === "lines" && (
          <g stroke="var(--cat, var(--paper))" strokeOpacity="0.7" strokeWidth="0.25">
            {spec.lines.map((l, i) => (
              <line key={i} {...l} />
            ))}
          </g>
        )}
        <text
          x="4"
          y="60"
          fontFamily="var(--font-grotesk)"
          fontWeight="700"
          fontSize="34"
          fill="none"
          stroke="var(--cover-fg, var(--paper))"
          strokeWidth="0.35"
          letterSpacing="-1.5"
        >
          {num}
        </text>
        {label && (
          <text
            x="96"
            y="8"
            textAnchor="end"
            fontFamily="var(--font-jetbrains)"
            fontSize="2.6"
            fill="var(--cover-fg, var(--paper))"
            fillOpacity="0.7"
            letterSpacing="0.4"
          >
            {label}
          </text>
        )}
      </svg>
      <div className="cat-bg pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-70" />
    </div>
  );
}
