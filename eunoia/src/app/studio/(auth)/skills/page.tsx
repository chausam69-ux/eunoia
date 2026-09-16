import { db } from "@/lib/db";
import { upsertSkill, deleteSkill } from "@/actions/skills";
import { PageHead, StatusBadge, th, td } from "@/components/studio/server-ui";
import { ConfirmDelete } from "@/components/studio/ui";
import { CATEGORIES, SKILL_STATUS } from "@/lib/constants";

// ponytail: inline-edit rows, one form per row. No modal, no client state.
export default async function SkillsPage() {
  const skills = await db.skill.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    include: { _count: { select: { projects: true, labs: true } } },
  });

  return (
    <div>
      <PageHead title="SKILLS" count={skills.length} />
      <p className="mb-6 text-sm text-gray">
        LEARNING and PRACTICING stay private. PORTFOLIO_READY, CLIENT_READY and ADVANCED render publicly (connector, about, filters).
      </p>

      <section className="mb-10 border border-line-light bg-white p-4">
        <h2 className="t-meta-lg mb-3">ADD SKILL</h2>
        <form action={upsertSkill} className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_2fr_auto]">
          <input name="name" placeholder="Name" aria-label="Name" required />
          <select name="category" aria-label="Category" defaultValue="DATA">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          <select name="status" aria-label="Status" defaultValue="LEARNING">{SKILL_STATUS.map((s) => <option key={s}>{s}</option>)}</select>
          <input name="description" placeholder="Description" aria-label="Description" />
          <button className="t-meta-lg min-h-[44px] bg-ink px-4 text-paper hover:bg-accent hover:text-ink">ADD</button>
        </form>
      </section>

      <div className="overflow-x-auto border border-line-light bg-white">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr>
              <th className={th}>NAME</th><th className={th}>CATEGORY</th><th className={th}>STATUS</th>
              <th className={th}>DESCRIPTION</th><th className={th}>ORDER</th><th className={th}>USED</th><th className={th}></th>
            </tr>
          </thead>
          <tbody>
            {skills.map((s) => (
              <tr key={s.id} className="border-t border-line-light">
                <td className={td} colSpan={5}>
                  <form action={upsertSkill} id={`skill-${s.id}`} className="grid items-center gap-2 md:grid-cols-[2fr_1fr_1fr_2fr_80px]">
                    <input type="hidden" name="id" value={s.id} />
                    <input name="name" defaultValue={s.name} aria-label="Name" required />
                    <select name="category" defaultValue={s.category} aria-label="Category">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
                    <select name="status" defaultValue={s.status} aria-label="Status">{SKILL_STATUS.map((x) => <option key={x}>{x}</option>)}</select>
                    <input name="description" defaultValue={s.description} aria-label="Description" />
                    <input name="sortOrder" type="number" defaultValue={s.sortOrder} aria-label="Sort order" />
                  </form>
                </td>
                <td className={`${td} t-meta text-gray`}>{s._count.projects}P · {s._count.labs}L</td>
                <td className={td}>
                  <div className="flex items-center gap-2">
                    <button form={`skill-${s.id}`} className="t-meta hover:text-accent">SAVE</button>
                    <StatusBadge s={s.status} />
                    <ConfirmDelete action={deleteSkill} id={s.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
