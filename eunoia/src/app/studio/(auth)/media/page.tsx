import Image from "next/image";
import { db } from "@/lib/db";
import { updateMedia, deleteMedia } from "@/actions/media";
import { UploadForm } from "@/components/studio/UploadForm";
import { PageHead } from "@/components/studio/server-ui";
import { ConfirmDelete } from "@/components/studio/ui";

export default async function MediaPage() {
  const [media, projects, labs] = await Promise.all([
    db.media.findMany({ orderBy: { createdAt: "desc" }, include: { project: { select: { title: true } }, labEntry: { select: { title: true } } } }),
    db.project.findMany({ orderBy: { projectNumber: "asc" }, select: { id: true, title: true } }),
    db.labEntry.findMany({ orderBy: { labNumber: "asc" }, select: { id: true, title: true } }),
  ]);

  return (
    <div>
      <PageHead title="MEDIA" count={media.length} />
      <div className="mb-10">
        <UploadForm projects={projects} labs={labs} />
      </div>
      <p className="mb-4 text-sm text-gray">To use an image as a project cover: open the project → COVER MEDIA. Unpublished media never renders publicly.</p>

      {media.length === 0 ? (
        <p className="border border-dashed border-line-light p-10 text-center text-gray">No media yet. Procedural covers are used until you upload.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((m) => (
            <li key={m.id} className="border border-line-light bg-white">
              <div className="relative aspect-[3/2] bg-line-light">
                {m.type === "image" ? (
                  <Image src={m.filePath} alt={m.altText} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" />
                ) : (
                  <video src={m.filePath} className="h-full w-full object-cover" muted playsInline />
                )}
                <span className="t-meta absolute left-2 top-2 bg-ink px-2 py-1 text-paper">#{m.id} · {m.published ? "PUBLISHED" : "PRIVATE"}</span>
              </div>
              <form action={updateMedia} className="grid gap-2 p-3">
                <input type="hidden" name="id" value={m.id} />
                <input name="altText" defaultValue={m.altText} aria-label="Alt text" required />
                <input name="caption" defaultValue={m.caption ?? ""} placeholder="Caption" aria-label="Caption" />
                <div className="grid grid-cols-2 gap-2">
                  <select name="projectId" defaultValue={m.projectId ?? ""} aria-label="Project">
                    <option value="">— project —</option>
                    {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                  <select name="labEntryId" defaultValue={m.labEntryId ?? ""} aria-label="Lab entry">
                    <option value="">— lab —</option>
                    {labs.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
                  </select>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={m.published} /> Published</label>
                  <button className="t-meta hover:text-accent">SAVE</button>
                </div>
              </form>
              <div className="flex items-center justify-between border-t border-line-light px-3 py-2">
                <span className="t-meta text-gray">{m.createdAt.toLocaleDateString("en-GB")} · {m.type}</span>
                <ConfirmDelete action={deleteMedia} id={m.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
