import Link from "next/link";

const COLORS: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-900",
  READY: "bg-blue-100 text-blue-900",
  DRAFT: "bg-yellow-100 text-yellow-900",
  ARCHIVED: "bg-gray-200 text-gray-700",
  NEW: "bg-accent text-ink",
  WON: "bg-green-100 text-green-900",
  LOST: "bg-gray-200 text-gray-700",
  CLIENT_READY: "bg-green-100 text-green-900",
  ADVANCED: "bg-green-100 text-green-900",
  PORTFOLIO_READY: "bg-blue-100 text-blue-900",
  PRACTICING: "bg-yellow-100 text-yellow-900",
  LEARNING: "bg-gray-200 text-gray-700",
};

export function StatusBadge({ s }: { s: string }) {
  return <span className={`t-meta inline-block px-2 py-1 ${COLORS[s] ?? "bg-gray-100"}`}>{s.replace("_", " ")}</span>;
}

export function PageHead({
  title, count, action,
}: { title: string; count?: number; action?: { href: string; label: string } }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <h1 className="t-display text-4xl">
        {title}
        {typeof count === "number" && <span className="t-meta-lg ml-3 text-gray">{String(count).padStart(2, "0")} ↘</span>}
      </h1>
      {action && (
        <Link href={action.href} className="t-meta-lg min-h-[44px] inline-flex items-center bg-ink px-5 text-paper hover:bg-accent hover:text-ink">
          + {action.label}
        </Link>
      )}
    </div>
  );
}

export function Field({
  label, name, type = "text", value, required, hint, error, rows, options, children,
}: {
  label: string; name: string; type?: string; value?: string | number | null; required?: boolean;
  hint?: string; error?: string; rows?: number; options?: string[]; children?: React.ReactNode;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="t-meta mb-1 text-gray">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children ? (
        children
      ) : options ? (
        <select id={id} name={name} defaultValue={value ?? ""} required={required}>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : rows ? (
        <textarea id={id} name={name} defaultValue={value ?? ""} rows={rows} required={required} />
      ) : (
        <input id={id} name={name} type={type} defaultValue={value ?? ""} required={required} />
      )}
      {hint && <p className="mt-1 text-xs text-gray">{hint}</p>}
      {error && <p role="alert" className="t-meta mt-1 text-red-700">{error}</p>}
    </div>
  );
}

export function EmptyState({ text, href, label }: { text: string; href?: string; label?: string }) {
  return (
    <div className="border border-dashed border-line-light p-10 text-center">
      <p className="text-gray">{text}</p>
      {href && (
        <Link href={href} className="t-meta-lg mt-4 inline-block underline underline-offset-4">
          {label}
        </Link>
      )}
    </div>
  );
}

export const th = "t-meta px-3 py-2 text-left text-gray";
export const td = "px-3 py-3 align-top text-sm";
