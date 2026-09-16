import Link from "next/link";
import { db } from "@/lib/db";
import { setProjectStatus, duplicateProject } from "@/actions/projects";
import { PageHead, StatusBadge, th, td } from "@/components/studio/server-ui";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: { projectNumber: "asc" },
    include: { skills: { include: { skill: { select: { category: true } } } } },
  });

  return (
    <div>
      <PageHead title="PROJECTS" count={projects.length} action={{ href: "/studio/projects/new", label: "NEW PROJECT" }} />
      <div className="overflow-x-auto border border-line-light bg-white">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr>
              <th className={th}>#</th>
              <th className={th}>PROJECT</th>
              <th className={th}>STATUS</th>
              <th className={th}>CATEGORY</th>
              <th className={th}>YEAR</th>
              <th className={th}>UPDATED</th>
              <th className={th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const cats = Array.from(new Set(p.skills.map((s) => s.skill.category)));
              return (
                <tr key={p.id} className="border-t border-line-light">
                  <td className={`${td} tabular-nums text-gray`}>{String(p.projectNumber).padStart(3, "0")}</td>
                  <td className={td}>
                    <Link href={`/studio/projects/${p.id}`} className="font-medium underline-offset-4 hover:underline">
                      {p.title}
                    </Link>
                    {p.featured && <span className="t-meta ml-2 text-accent">★</span>}
                  </td>
                  <td className={td}><StatusBadge s={p.status} /></td>
                  <td className={`${td} t-meta text-gray`}>{cats.join(" · ")}</td>
                  <td className={td}>{p.year}</td>
                  <td className={`${td} text-gray`}>{p.updatedAt.toLocaleDateString("en-GB")}</td>
                  <td className={td}>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/studio/projects/${p.id}`} className="t-meta hover:text-accent">EDIT</Link>
                      {p.status === "PUBLISHED" && (
                        <Link href={`/work/${p.slug}`} target="_blank" className="t-meta hover:text-accent">VIEW ↗</Link>
                      )}
                      <form action={setProjectStatus}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="status" value={p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"} />
                        <button className="t-meta hover:text-accent">{p.status === "PUBLISHED" ? "UNPUBLISH" : "PUBLISH"}</button>
                      </form>
                      <form action={duplicateProject}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="t-meta hover:text-accent">DUPLICATE</button>
                      </form>
                      {p.status !== "ARCHIVED" && (
                        <form action={setProjectStatus}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="status" value="ARCHIVED" />
                          <button className="t-meta text-gray hover:text-accent">ARCHIVE</button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
