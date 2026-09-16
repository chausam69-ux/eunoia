import { MonoLabel } from "./SectionHead";

type S = { nowLearning: string; nowBuilding: string; nowExperimenting: string; openFor: string };

export function Now({ s }: { s: S }) {
  const rows = [
    ["LEARNING", s.nowLearning, "DATA"],
    ["BUILDING", s.nowBuilding, "AI"],
    ["EXPERIMENTING", s.nowExperimenting, "AUTOMATION"],
    ["OPEN FOR", s.openFor, "GROWTH"],
  ];
  return (
    <div>
      <MonoLabel className="mb-8">CURRENTLY</MonoLabel>
      <dl className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {rows.map(([k, v, cat]) => (
          <div key={k} data-cat={cat} className="cat-border border-t-2 bg-ink p-6 md:p-8">
            <dt className="t-meta cat-text">{k}</dt>
            <dd className="t-display mt-4 text-2xl">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
