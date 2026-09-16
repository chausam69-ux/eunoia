// Procedural SVG covers: deterministic per slug. No image assets needed.
// ponytail: simple mulberry32 PRNG + 3 pattern families. Add more families if covers feel samey.

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export type CoverSpec = {
  family: "grid" | "rings" | "lines";
  seed: number;
  cells: { x: number; y: number; r: number }[];
  rings: number[];
  lines: { x1: number; y1: number; x2: number; y2: number }[];
};

export function coverSpec(slug: string): CoverSpec {
  const seed = hash(slug);
  const rnd = mulberry32(seed);
  const family = (["grid", "rings", "lines"] as const)[seed % 3];

  const cells: CoverSpec["cells"] = [];
  const cols = 12;
  const rows = 8;
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const v = rnd();
      if (v > 0.55) cells.push({ x: (x + 0.5) * (100 / cols), y: (y + 0.5) * (66 / rows), r: 0.6 + v * 1.6 });
    }

  const rings: number[] = [];
  for (let i = 0; i < 6; i++) rings.push(8 + i * (6 + rnd() * 4));

  const lines: CoverSpec["lines"] = [];
  for (let i = 0; i < 14; i++) {
    const y = rnd() * 66;
    lines.push({ x1: rnd() * 30, y1: y, x2: 60 + rnd() * 40, y2: y + (rnd() - 0.5) * 20 });
  }

  return { family, seed, cells, rings, lines };
}
