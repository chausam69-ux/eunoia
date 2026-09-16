import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateLab, deleteLab } from "@/actions/lab";
import { LabForm } from "@/components/studio/LabForm";
import { PageHead, StatusBadge } from "@/components/studio/server-ui";
import { ConfirmDelete } from "@/components/studio/ui";

export default async function EditLabPage({ params }: PageProps<"/studio/lab/[id]">) {
  const { id } = await params;
  const lid = Number(id);
  if (!Number.isInteger(lid)) notFound();
  const [e, skills, media] = await Promise.all([
    db.labEntry.findUnique({ where: { id: lid }, include: { skills: true } }),
    db.skill.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true, category: true } }),
    db.media.findMany({ where: { type: "image" }, select: { id: true, altText: true } }),
  ]);
  if (!e) notFound();
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <Link href="/studio/lab" className="t-meta text-gray hover:text-accent">← LAB</Link>
        <StatusBadge s={e.status} />
        {e.status === "PUBLISHED" && <Link href={`/lab/${e.slug}`} target="_blank" className="t-meta hover:text-accent">PREVIEW ↗</Link>}
        <span className="ml-auto"><ConfirmDelete action={deleteLab} id={e.id} /></span>
      </div>
      <PageHead title={e.title} />
      <LabForm action={updateLab.bind(null, e.id)} skills={skills} media={media} lab={{ ...e, skillIds: e.skills.map((s) => s.skillId) }} />
    </div>
  );
}
