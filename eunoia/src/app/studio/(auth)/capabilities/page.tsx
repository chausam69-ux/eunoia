import { db } from "@/lib/db";
import { upsertCapability, deleteCapability } from "@/actions/skills";
import { PageHead, Field } from "@/components/studio/server-ui";
import { ConfirmDelete } from "@/components/studio/ui";
import { CATEGORIES } from "@/lib/constants";

export default async function CapabilitiesAdmin() {
  const caps = await db.capability.findMany({ orderBy: { sortOrder: "asc" } });
  const blank = {
    id: 0, name: "", category: "DATA", description: "", whatISolve: "", deliverables: "",
    startingPrice: null, timeline: null, visibility: "PUBLIC", sortOrder: caps.length,
  };
  return (
    <div>
      <PageHead title="CAPABILITIES" count={caps.length} />
      <div className="space-y-6">
        {[...caps, blank].map((c) => (
          <details key={c.id} open={c.id === 0 && caps.length === 0} className="border border-line-light bg-white">
            <summary className="flex cursor-pointer items-center justify-between px-4 py-3">
              <span className="t-display text-xl">{c.id ? `${String(c.sortOrder + 1).padStart(2, "0")} / ${c.name}` : "+ NEW CAPABILITY"}</span>
              {c.id > 0 && <span className="t-meta text-gray">{c.visibility} · {c.category}</span>}
            </summary>
            <form action={upsertCapability} className="grid gap-4 border-t border-line-light p-4 md:grid-cols-2">
              {c.id > 0 && <input type="hidden" name="id" value={c.id} />}
              <Field label="NAME" name="name" value={c.name} required />
              <Field label="CATEGORY" name="category" value={c.category} options={CATEGORIES} />
              <Field label="WHAT I SOLVE" name="whatISolve" value={c.whatISolve} rows={2} />
              <Field label="DELIVERABLES" name="deliverables" value={c.deliverables} rows={4} hint="One per line." />
              <Field label="DESCRIPTION" name="description" value={c.description} rows={2} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="STARTING PRICE" name="startingPrice" value={c.startingPrice} hint="Optional." />
                <Field label="TYPICAL TIMELINE" name="timeline" value={c.timeline} hint="Optional." />
                <Field label="VISIBILITY" name="visibility" value={c.visibility} options={["PUBLIC", "PRIVATE"]} />
                <Field label="DISPLAY ORDER" name="sortOrder" type="number" value={c.sortOrder} />
              </div>
              <div className="flex items-center gap-4 md:col-span-2">
                <button className="t-meta-lg min-h-[44px] bg-ink px-5 text-paper hover:bg-accent hover:text-ink">{c.id ? "SAVE" : "CREATE"}</button>
              </div>
            </form>
            {c.id > 0 && (
              <div className="border-t border-line-light px-4 py-2 text-right">
                <ConfirmDelete action={deleteCapability} id={c.id} />
              </div>
            )}
          </details>
        ))}
      </div>
    </div>
  );
}
