"use client";

import { useActionState } from "react";
import { Field } from "./server-ui";
import { SubmitButton } from "./ui";
import type { ProjectFormState } from "@/actions/projects";

type Skill = { id: number; name: string; category: string };
type Media = { id: number; filePath: string; altText: string };
type Project = {
  id?: number;
  title: string;
  slug: string;
  projectNumber: number;
  shortDescription: string;
  problem: string;
  approach: string;
  solution: string;
  result: string;
  systemFlow: string;
  stack: string;
  projectType: string;
  clientName: string | null;
  year: number;
  status: string;
  coverMediaId: number | null;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  skillIds: number[];
};

export function ProjectForm({
  project,
  skills,
  media,
  action,
}: {
  project: Project;
  skills: Skill[];
  media: Media[];
  action: (prev: ProjectFormState, form: FormData) => Promise<ProjectFormState>;
}) {
  const [state, formAction] = useActionState(action, {});
  const e = state.errors ?? {};
  const cats = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="grid gap-5 sm:grid-cols-[1fr_1fr_120px]">
          <Field label="TITLE" name="title" value={project.title} required error={e.title} />
          <Field label="SLUG" name="slug" value={project.slug} hint="Leave blank to generate from title." error={e.slug} />
          <Field label="NO." name="projectNumber" type="number" value={project.projectNumber} required error={e.projectNumber} />
        </div>
        <Field label="SHORT DESCRIPTION" name="shortDescription" value={project.shortDescription} rows={2} required hint="First sentence = subtitle on cards." error={e.shortDescription} />
        <Field label="A / THE PROBLEM" name="problem" value={project.problem} rows={4} />
        <Field label="B / THE THINKING (APPROACH)" name="approach" value={project.approach} rows={4} />
        <Field label="C / THE SYSTEM (SOLUTION)" name="solution" value={project.solution} rows={4} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="SYSTEM FLOW" name="systemFlow" value={project.systemFlow} rows={6} hint="One step per line. Rendered as a ladder." />
          <Field label="STACK" name="stack" value={project.stack} rows={6} hint="One tool per line." />
        </div>
        <Field label="D / THE RESULT" name="result" value={project.result} rows={3} hint="Real results only. Self-initiated → say results are simulated." />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="SEO TITLE" name="seoTitle" value={project.seoTitle} />
          <Field label="SEO DESCRIPTION" name="seoDescription" value={project.seoDescription} />
        </div>
      </div>

      <aside className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <Field label="STATUS" name="status" value={project.status} options={["DRAFT", "READY", "PUBLISHED", "ARCHIVED"]} />
          <Field label="TYPE" name="projectType" value={project.projectType} options={["SELF_INITIATED", "CLIENT", "EXPERIMENT"]} />
          <Field label="CLIENT NAME" name="clientName" value={project.clientName} hint="Only for CLIENT type." />
          <Field label="YEAR" name="year" type="number" value={project.year} required error={e.year} />
          <Field label="LIVE URL" name="liveUrl" type="url" value={project.liveUrl} />
          <Field label="GITHUB URL" name="githubUrl" type="url" value={project.githubUrl} />
          <Field label="COVER MEDIA" name="coverMediaId" value={project.coverMediaId}>
            <select id="f-coverMediaId" name="coverMediaId" defaultValue={project.coverMediaId ?? ""}>
              <option value="">— procedural cover —</option>
              {media.map((m) => (
                <option key={m.id} value={m.id}>
                  #{m.id} {m.altText}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={project.featured} /> Featured on homepage
          </label>
        </div>

        <fieldset>
          <legend className="t-meta mb-2 text-gray">SKILLS (PROJECT ↔ SKILL)</legend>
          <div className="max-h-80 space-y-3 overflow-y-auto border border-line-light bg-white p-3">
            {cats.map((c) => (
              <div key={c}>
                <p className="t-meta text-gray">{c}</p>
                <div className="mt-1 grid grid-cols-2 gap-1">
                  {skills
                    .filter((s) => s.category === c)
                    .map((s) => (
                      <label key={s.id} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" name="skillIds" value={s.id} defaultChecked={project.skillIds.includes(s.id)} />
                        {s.name}
                      </label>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="flex items-center gap-4">
          <SubmitButton>{project.id ? "SAVE" : "CREATE"}</SubmitButton>
          {state.message && (
            <p role="status" className="t-meta text-green-800">
              {state.message}
            </p>
          )}
        </div>
      </aside>
    </form>
  );
}
