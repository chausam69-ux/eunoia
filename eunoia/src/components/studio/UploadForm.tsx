"use client";

import { useActionState } from "react";
import { uploadMedia, type MediaState } from "@/actions/media";
import { SubmitButton } from "./ui";

type Opt = { id: number; title: string };

export function UploadForm({ projects, labs }: { projects: Opt[]; labs: Opt[] }) {
  const [state, action] = useActionState<MediaState, FormData>(uploadMedia, {});
  return (
    <form action={action} className="grid gap-4 border border-line-light bg-white p-4 md:grid-cols-2">
      <div>
        <label htmlFor="file" className="t-meta mb-1 text-gray">FILE (JPG/PNG/WEBP/AVIF/GIF/MP4/WEBM, ≤25MB)</label>
        <input id="file" name="file" type="file" accept="image/*,video/mp4,video/webm" required />
      </div>
      <div>
        <label htmlFor="altText" className="t-meta mb-1 text-gray">ALT TEXT *</label>
        <input id="altText" name="altText" required />
      </div>
      <div>
        <label htmlFor="caption" className="t-meta mb-1 text-gray">CAPTION</label>
        <input id="caption" name="caption" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="projectId" className="t-meta mb-1 text-gray">PROJECT</label>
          <select id="projectId" name="projectId" defaultValue="">
            <option value="">—</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="labEntryId" className="t-meta mb-1 text-gray">LAB ENTRY</label>
          <select id="labEntryId" name="labEntryId" defaultValue="">
            <option value="">—</option>
            {labs.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm md:col-span-2">
        <input type="checkbox" name="published" /> Published (public media must be explicitly published)
      </label>
      <div className="flex items-center gap-4 md:col-span-2">
        <SubmitButton>UPLOAD</SubmitButton>
        {state.error && <p role="alert" className="t-meta text-red-700">{state.error}</p>}
        {state.ok && <p role="status" className="t-meta text-green-800">UPLOADED.</p>}
      </div>
    </form>
  );
}
