import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateProject, deleteProject } from "@/actions/projects";
import { ProjectForm } from "@/components/studio/ProjectForm";
import { PageHead, StatusBadge } from "@/components/studio/server-ui";
import { ConfirmDelete } from "@/components/studio/ui";

export default async function EditProjectPage({ params }: PageProps<"/studio/projects/[id]">) {
  const { id } = await params;
  const pid = Number(id);
  if (!Number.isInteger(pid)) notFound();
  const [p, skills, media] = await Promise.all([
    db.project.findUnique({ where: { id: pid }, include: { skills: true } }),
    db.skill.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true, category: true } }),
    db.media.findMany({ where: { type: "image" }, select: { id: true, filePath: true, altText: true } }),
  ]);
  if (!p) notFound();
  const action = updateProject.bind(null, p.id);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <Link href="/studio/projects" className="t-meta text-gray hover:text-accent">← PROJECTS</Link>
        <StatusBadge s={p.status} />
        {p.status === "PUBLISHED" && (
          <Link href={`/work/${p.slug}`} target="_blank" className="t-meta hover:text-accent">PREVIEW ↗</Link>
        )}
        <span className="ml-auto"><ConfirmDelete action={deleteProject} id={p.id} /></span>
      </div>
      <PageHead title={p.title} />
      <ProjectForm action={action} skills={skills} media={media} project={{ ...p, skillIds: p.skills.map((s) => s.skillId) }} />
    </div>
  );
}
