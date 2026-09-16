"use client";

import { useActionState } from "react";
import { Field } from "./server-ui";
import { SubmitButton } from "./ui";
import { LAB_TYPES } from "@/lib/constants";
import type { LabFormState } from "@/actions/lab";

type Skill = { id: number; name: string; category: string };
type Media = { id: number; altText: string };
type Lab = {
  id?: number;
  title: string;
  slug: string;
  labNumber: number;
  type: string;
  summary: string;
  content: string;
  whatILearned: string;
  status: string;
  coverMediaId: number | null;
  demoUrl: string | null;
  githubUrl: string | null;
  skillIds: number[];
};

export function LabForm({
  lab, skills, media, action,
}: {
  lab: Lab;
  skills: Skill[];
  media: Media[];
  action: (prev: LabFormState, form: FormData) => Promise<LabFormState>;
}) {
  const [state, formAction] = useActionState(action, {});
  const e = state.errors ?? {};
  const cats = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="grid gap-5 sm:grid-cols-[1fr_1fr_120px]">
          <Field label="TITLE" name="title" value={lab.title} required error={e.title} />
          <Field label="SLUG" name="slug" value={lab.slug} hint="Blank = from title." error={e.slug} />
          <Field label="NO." name="labNumber" type="number" value={lab.labNumber} required />
        </div>
        <Field label="SUMMARY" name="summary" value={lab.summary} rows={2} required error={e.summary} />
        <Field label="CONTENT" name="content" value={lab.content} rows={10} hint="Plain text. Blank line = new paragraph." />
        <Field label="WHAT I LEARNED" name="whatILearned" value={lab.whatILearned} rows={3} />
      </div>
      <aside className="space-y-5">
        <Field label="STATUS" name="status" value={lab.status} options={["DRAFT", "READY", "PUBLISHED", "ARCHIVED"]} />
        <Field label="TYPE" name="type" value={lab.type} options={LAB_TYPES} />
        <Field label="DEMO URL" name="demoUrl" type="url" value={lab.demoUrl} />
        <Field label="GITHUB URL" name="githubUrl" type="url" value={lab.githubUrl} />
        <Field label="COVER MEDIA" name="coverMediaId">
          <select id="f-coverMediaId" name="coverMediaId" defaultValue={lab.coverMediaId ?? ""}>
            <option value="">— none —</option>
            {media.map((m) => (
              <option key={m.id} value={m.id}>#{m.id} {m.altText}</option>
            ))}
          </select>
        </Field>
        <fieldset>
          <legend className="t-meta mb-2 text-gray">RELATED SKILLS</legend>
          <div className="max-h-72 space-y-3 overflow-y-auto border border-line-light bg-white p-3">
            {cats.map((c) => (
              <div key={c}>
                <p className="t-meta text-gray">{c}</p>
                <div className="mt-1 grid grid-cols-2 gap-1">
                  {skills.filter((s) => s.category === c).map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="skillIds" value={s.id} defaultChecked={lab.skillIds.includes(s.id)} />
                      {s.name}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </fieldset>
        <div className="flex items-center gap-4">
          <SubmitButton>{lab.id ? "SAVE" : "CREATE"}</SubmitButton>
          {state.message && <p role="status" className="t-meta text-green-800">{state.message}</p>}
        </div>
      </aside>
    </form>
  );
}
