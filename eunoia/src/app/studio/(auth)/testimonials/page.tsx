import { db } from "@/lib/db";
import { upsertTestimonial, deleteTestimonial } from "@/actions/settings";
import { PageHead, Field, StatusBadge } from "@/components/studio/server-ui";
import { ConfirmDelete } from "@/components/studio/ui";

export default async function TestimonialsPage() {
  const [items, projects] = await Promise.all([
    db.testimonial.findMany({ orderBy: { createdAt: "desc" }, include: { project: { select: { title: true } } } }),
    db.project.findMany({ orderBy: { projectNumber: "asc" }, select: { id: true, title: true } }),
  ]);
  const blank = { id: 0, name: "", role: "", company: "", quote: "", avatarUrl: null, projectId: null, permissionToPublish: false, published: false, project: null };

  return (
    <div>
      <PageHead title="TESTIMONIALS" count={items.length} />
      <p className="mb-6 text-sm text-gray">Only testimonials with explicit permission can be published. Never invent one.</p>
      <div className="space-y-6">
        {[blank, ...items].map((t) => (
          <details key={t.id} open={t.id === 0 && items.length === 0} className="border border-line-light bg-white">
            <summary className="flex cursor-pointer items-center justify-between px-4 py-3">
              <span className="t-display text-xl">{t.id ? `${t.name} · ${t.company}` : "+ NEW TESTIMONIAL"}</span>
              {t.id > 0 && <StatusBadge s={t.published ? "PUBLISHED" : t.permissionToPublish ? "READY" : "DRAFT"} />}
            </summary>
            <form action={upsertTestimonial} className="grid gap-4 border-t border-line-light p-4 md:grid-cols-2">
              {t.id > 0 && <input type="hidden" name="id" value={t.id} />}
              <Field label="NAME" name="name" value={t.name} required />
              <Field label="ROLE" name="role" value={t.role} />
              <Field label="COMPANY" name="company" value={t.company} />
              <Field label="PROJECT" name="projectId">
                <select id="f-projectId" name="projectId" defaultValue={t.projectId ?? ""}>
                  <option value="">—</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </Field>
              <div className="md:col-span-2"><Field label="QUOTE" name="quote" value={t.quote} rows={3} required /></div>
              <Field label="AVATAR / LOGO URL" name="avatarUrl" value={t.avatarUrl} />
              <div className="flex flex-col justify-end gap-2 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" name="permissionToPublish" defaultChecked={t.permissionToPublish} /> Permission to publish granted</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={t.published} /> Published</label>
              </div>
              <div className="md:col-span-2">
                <button className="t-meta-lg min-h-[44px] bg-ink px-5 text-paper hover:bg-accent hover:text-ink">{t.id ? "SAVE" : "CREATE"}</button>
              </div>
            </form>
            {t.id > 0 && (
              <div className="border-t border-line-light px-4 py-2 text-right">
                <ConfirmDelete action={deleteTestimonial} id={t.id} />
              </div>
            )}
          </details>
        ))}
      </div>
    </div>
  );
}
