import Link from "next/link";
import { db } from "@/lib/db";
import { StatusBadge, th, td } from "@/components/studio/server-ui";

export default async function Dashboard() {
  const [projects, labs, caps, inquiries, published, recentWork, recentInq, drafts, learning] = await Promise.all([
    db.project.count(),
    db.labEntry.count(),
    db.capability.count(),
    db.inquiry.count({ where: { status: { notIn: ["ARCHIVED", "LOST"] } } }),
    db.project.count({ where: { status: "PUBLISHED" } }).then(async (p) => p + (await db.labEntry.count({ where: { status: "PUBLISHED" } }))),
    db.project.findMany({ orderBy: { updatedAt: "desc" }, take: 5, select: { id: true, title: true, status: true, updatedAt: true } }),
    db.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, company: true, need: true, status: true, createdAt: true } }),
    db.project.findMany({ where: { status: { in: ["DRAFT", "READY"] } }, take: 5, select: { id: true, title: true, status: true } }),
    db.skill.findMany({ where: { status: { in: ["LEARNING", "PRACTICING"] } }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true, status: true } }),
  ]);

  const h = new Date().getHours();
  const greet = h < 12 ? "GOOD MORNING" : h < 18 ? "GOOD AFTERNOON" : "GOOD EVENING";
  const stats = [
    ["PROJECTS", projects],
    ["LAB ENTRIES", labs],
    ["CAPABILITIES", caps],
    ["INQUIRIES", inquiries],
    ["PUBLISHED", published],
  ] as const;

  return (
    <div>
      <p className="t-meta mb-2 text-gray">{greet}, SANDIP.</p>
      <h1 className="t-display mb-10 text-4xl">EUNΟIA IS BUILDING.</h1>

      <dl className="mb-12 grid grid-cols-2 gap-px border border-line-light bg-line-light sm:grid-cols-5">
        {stats.map(([k, v]) => (
          <div key={k} className="bg-white p-4">
            <dt className="t-meta text-gray">{k}</dt>
            <dd className="t-display mt-2 text-3xl tabular-nums">{String(v).padStart(3, "0")}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-10 lg:grid-cols-2">
        <Panel title="RECENT WORK" href="/studio/projects">
          <table className="w-full">
            <thead><tr><th className={th}>PROJECT</th><th className={th}>STATUS</th><th className={th}>UPDATED</th></tr></thead>
            <tbody>
              {recentWork.map((p) => (
                <tr key={p.id} className="border-t border-line-light">
                  <td className={td}><Link href={`/studio/projects/${p.id}`} className="underline-offset-4 hover:underline">{p.title}</Link></td>
                  <td className={td}><StatusBadge s={p.status} /></td>
                  <td className={`${td} text-gray`}>{p.updatedAt.toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="RECENT INQUIRIES" href="/studio/inquiries">
          {recentInq.length === 0 ? (
            <p className="text-sm text-gray">No inquiries yet. The /start form feeds this list.</p>
          ) : (
            <table className="w-full">
              <thead><tr><th className={th}>FROM</th><th className={th}>NEED</th><th className={th}>STATUS</th></tr></thead>
              <tbody>
                {recentInq.map((i) => (
                  <tr key={i.id} className="border-t border-line-light">
                    <td className={td}><Link href={`/studio/inquiries/${i.id}`} className="underline-offset-4 hover:underline">{i.name}</Link>{i.company && <span className="text-gray"> · {i.company}</span>}</td>
                    <td className={td}>{i.need}</td>
                    <td className={td}><StatusBadge s={i.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>

        <Panel title="CURRENT LEARNING" href="/studio/skills">
          <ul className="flex flex-wrap gap-2">
            {learning.map((s) => (
              <li key={s.id} className="t-meta border border-line-light px-2 py-1">{s.name} · {s.status}</li>
            ))}
            {learning.length === 0 && <li className="text-sm text-gray">Nothing marked LEARNING/PRACTICING.</li>}
          </ul>
        </Panel>

        <Panel title="DRAFTS" href="/studio/projects">
          <ul className="divide-y divide-line-light">
            {drafts.map((d) => (
              <li key={d.id} className="flex items-center justify-between py-2 text-sm">
                <Link href={`/studio/projects/${d.id}`} className="underline-offset-4 hover:underline">{d.title}</Link>
                <StatusBadge s={d.status} />
              </li>
            ))}
            {drafts.length === 0 && <li className="text-sm text-gray">No unpublished projects.</li>}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="border border-line-light bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="t-meta-lg">{title}</h2>
        <Link href={href} className="t-meta text-gray hover:text-accent">ALL ↘</Link>
      </div>
      {children}
    </section>
  );
}
