"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { slugify, str, ints } from "@/lib/slug";

const STATUS = ["DRAFT", "READY", "PUBLISHED", "ARCHIVED"] as const;


const Schema = z.object({
  title: z.string().min(1, "Title required"),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, dashes"),
  labNumber: z.coerce.number().int().min(1),
  type: z.string().min(1),
  summary: z.string().min(1, "Summary required"),
  content: z.string(),
  whatILearned: z.string(),
  status: z.enum(STATUS),
  coverMediaId: z.coerce.number().int().optional(),
  demoUrl: z.string(),
  githubUrl: z.string(),
  skillIds: z.array(z.number().int()),
});

export type LabFormState = { errors?: Record<string, string>; message?: string };

function read(form: FormData) {
  const title = str(form, "title");
  return Schema.safeParse({
    title,
    slug: str(form, "slug") || slugify(title),
    labNumber: str(form, "labNumber"),
    type: str(form, "type"),
    summary: str(form, "summary"),
    content: str(form, "content"),
    whatILearned: str(form, "whatILearned"),
    status: str(form, "status"),
    coverMediaId: str(form, "coverMediaId") || undefined,
    demoUrl: str(form, "demoUrl"),
    githubUrl: str(form, "githubUrl"),
    skillIds: ints(form, "skillIds"),
  });
}

const toErrors = (e: z.ZodError) => ({
  errors: Object.fromEntries(e.issues.map((i) => [String(i.path[0]), i.message])),
});

function revalidate(slug?: string) {
  for (const p of ["/lab", "/studio", "/studio/lab"]) revalidatePath(p);
  if (slug) revalidatePath(`/lab/${slug}`);
}

export async function createLab(_: LabFormState, form: FormData): Promise<LabFormState> {
  await requireSession();
  const parsed = read(form);
  if (!parsed.success) return toErrors(parsed.error);
  const { skillIds, coverMediaId, demoUrl, githubUrl, ...d } = parsed.data;
  if (await db.labEntry.findUnique({ where: { slug: d.slug } })) return { errors: { slug: "Slug already in use" } };
  const e = await db.labEntry.create({
    data: {
      ...d,
      demoUrl: demoUrl || null,
      githubUrl: githubUrl || null,
      coverMediaId: coverMediaId ?? null,
      publishedAt: d.status === "PUBLISHED" ? new Date() : null,
      skills: { create: skillIds.map((skillId) => ({ skillId })) },
    },
  });
  revalidate(e.slug);
  redirect(`/studio/lab/${e.id}`);
}

export async function updateLab(id: number, _: LabFormState, form: FormData): Promise<LabFormState> {
  await requireSession();
  const parsed = read(form);
  if (!parsed.success) return toErrors(parsed.error);
  const { skillIds, coverMediaId, demoUrl, githubUrl, ...d } = parsed.data;
  if (await db.labEntry.findFirst({ where: { slug: d.slug, id: { not: id } } }))
    return { errors: { slug: "Slug already in use" } };
  const prev = await db.labEntry.findUnique({ where: { id }, select: { slug: true, publishedAt: true } });
  await db.labEntry.update({
    where: { id },
    data: {
      ...d,
      demoUrl: demoUrl || null,
      githubUrl: githubUrl || null,
      coverMediaId: coverMediaId ?? null,
      publishedAt: d.status === "PUBLISHED" ? prev?.publishedAt ?? new Date() : prev?.publishedAt,
      skills: { deleteMany: {}, create: skillIds.map((skillId) => ({ skillId })) },
    },
  });
  revalidate(d.slug);
  if (prev?.slug && prev.slug !== d.slug) revalidatePath(`/lab/${prev.slug}`);
  return { message: "Saved." };
}

export async function setLabStatus(form: FormData) {
  await requireSession();
  const id = Number(form.get("id"));
  const status = z.enum(STATUS).parse(form.get("status"));
  const e = await db.labEntry.update({
    where: { id },
    data: { status, ...(status === "PUBLISHED" ? { publishedAt: new Date() } : {}) },
  });
  revalidate(e.slug);
}

export async function duplicateLab(form: FormData) {
  await requireSession();
  const id = Number(form.get("id"));
  const src = await db.labEntry.findUnique({ where: { id }, include: { skills: true } });
  if (!src) return;
  const { id: _id, createdAt: _c, updatedAt: _u, publishedAt: _p, skills, ...rest } = src;
  const max = await db.labEntry.aggregate({ _max: { labNumber: true } });
  const copy = await db.labEntry.create({
    data: {
      ...rest,
      title: `${src.title} COPY`,
      slug: `${src.slug}-copy-${Date.now().toString(36)}`,
      labNumber: (max._max.labNumber ?? 0) + 1,
      status: "DRAFT",
      skills: { create: skills.map((s) => ({ skillId: s.skillId })) },
    },
  });
  revalidate();
  redirect(`/studio/lab/${copy.id}`);
}

export async function deleteLab(form: FormData) {
  await requireSession();
  const id = Number(form.get("id"));
  const e = await db.labEntry.delete({ where: { id } });
  revalidate(e.slug);
  redirect("/studio/lab");
}
