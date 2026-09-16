export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
export const bool = (f: FormData, k: string) => f.get(k) === "on" || f.get(k) === "true";
export const ints = (f: FormData, k: string) => f.getAll(k).map(Number).filter((n) => Number.isInteger(n));

export function revalidatePublic() {
  // imported lazily to keep this file usable outside server actions
  return ["/", "/work", "/lab", "/capabilities", "/about"];
}
