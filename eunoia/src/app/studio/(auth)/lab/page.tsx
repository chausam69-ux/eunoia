import Link from "next/link";
import { db } from "@/lib/db";
import { setLabStatus, duplicateLab } from "@/actions/lab";
import { PageHead, StatusBadge, th, td } from "@/components/studio/server-ui";

export default async function LabAdminPage() {
  const entries = await db.labEntry.findMany({ orderBy: { labNumber: "asc" } });
  return (
    <div>
      <PageHead title="LAB" count={entries.length} action={{ href: "/studio/lab/new", label: "NEW ENTRY" }} />
      <div className="overflow-x-auto border border-line-light bg-white">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr>
              <th className={th}>#</th><th className={th}>ENTRY</th><th className={th}>TYPE</th>
              <th className={th}>STATUS</th><th className={th}>UPDATED</th><th className={th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-t border-line-light">
                <td className={`${td} tabular-nums text-gray`}>{String(e.labNumber).padStart(3, "0")}</td>
                <td className={td}><Link href={`/studio/lab/${e.id}`} className="font-medium underline-offset-4 hover:underline">{e.title}</Link></td>
                <td className={`${td} t-meta text-gray`}>{e.type}</td>
                <td className={td}><StatusBadge s={e.status} /></td>
                <td className={`${td} text-gray`}>{e.updatedAt.toLocaleDateString("en-GB")}</td>
                <td className={td}>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/studio/lab/${e.id}`} className="t-meta hover:text-accent">EDIT</Link>
                    {e.status === "PUBLISHED" && <Link href={`/lab/${e.slug}`} target="_blank" className="t-meta hover:text-accent">VIEW ↗</Link>}
                    <form action={setLabStatus}>
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="status" value={e.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"} />
                      <button className="t-meta hover:text-accent">{e.status === "PUBLISHED" ? "UNPUBLISH" : "PUBLISH"}</button>
                    </form>
                    <form action={duplicateLab}>
                      <input type="hidden" name="id" value={e.id} />
                      <button className="t-meta hover:text-accent">DUPLICATE</button>
                    </form>
                    {e.status !== "ARCHIVED" && (
                      <form action={setLabStatus}>
                        <input type="hidden" name="id" value={e.id} />
                        <input type="hidden" name="status" value="ARCHIVED" />
                        <button className="t-meta text-gray hover:text-accent">ARCHIVE</button>
                      </form>
                    )}
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
