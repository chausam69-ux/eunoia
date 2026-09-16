"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { slugify, str, bool, ints } from "@/lib/slug";

const STATUS = ["DRAFT", "READY", "PUBLISHED", "ARCHIVED"] as const;
const TYPE = ["CLIENT", "SELF_INITIATED", "EXPERIMENT"] as const;

const Schema = z.object({
  title: z.string().min(1, "Title required"),
  slug: z.string().min(1, "Slug required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, dashes"),
  projectNumber: z.coerce.number().int().min(1),
  shortDescription: z.string().min(1, "Short description required"),
  problem: z.string(),
  approach: z.string(),
  solution: z.string(),
  result: z.string(),
  systemFlow: z.string(),
  stack: z.string(),
  projectType: z.enum(TYPE),
  clientName: z.string(),
  year: z.coerce.number().int().min(2000).max(2100),
  status: z.enum(STATUS),
  coverMediaId: z.coerce.number().int().optional(),
  liveUrl: z.string(),
  githubUrl: z.string(),
  featured: z.boolean(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  skillIds: z.array(z.number().int()),
});

export type ProjectFormState = { errors?: Record<string, string>; message?: string };

function read(form: FormData) {
  const title = str(form, "title");
  return Schema.safeParse({
    title,
    slug: str(form, "slug") || slugify(title),
    projectNumber: str(form, "projectNumber"),
    shortDescription: str(form, "shortDescription"),
    problem: str(form, "problem"),
    approach: str(form, "approach"),
    solution: str(form, "solution"),
    result: str(form, "result"),
    systemFlow: str(form, "systemFlow"),
    stack: str(form, "stack"),
    projectType: str(form, "projectType"),
    clientName: str(form, "clientName"),
    year: str(form, "year"),
    status: str(form, "status"),
    coverMediaId: str(form, "coverMediaId") || undefined,
    liveUrl: str(form, "liveUrl"),
    githubUrl: str(form, "githubUrl"),
    featured: bool(form, "featured"),
    seoTitle: str(form, "seoTitle"),
    seoDescription: str(form, "seoDescription"),
    skillIds: ints(form, "skillIds"),
  });
}

function toErrors(e: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const i of e.issues) errors[String(i.path[0])] = i.message;
  return { errors };
}

function revalidate(slug?: string) {
  for (const p of ["/", "/work", "/studio", "/studio/projects"]) revalidatePath(p);
  if (slug) revalidatePath(`/work/${slug}`);
}

export async function createProject(_: ProjectFormState, form: FormData): Promise<ProjectFormState> {
  await requireSession();
  const parsed = read(form);
  if (!parsed.success) return toErrors(parsed.error);
  const { skillIds, coverMediaId, clientName, liveUrl, githubUrl, seoTitle, seoDescription, ...d } = parsed.data;
  if (await db.project.findUnique({ where: { slug: d.slug } })) return { errors: { slug: "Slug already in use" } };
  const p = await db.project.create({
    data: {
      ...d,
      clientName: clientName || null,
      liveUrl: liveUrl || null,
      githubUrl: githubUrl || null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      coverMediaId: coverMediaId ?? null,
      publishedAt: d.status === "PUBLISHED" ? new Date() : null,
      skills: { create: skillIds.map((skillId) => ({ skillId })) },
    },
  });
  revalidate(p.slug);
  redirect(`/studio/projects/${p.id}`);
}

export async function updateProject(id: number, _: ProjectFormState, form: FormData): Promise<ProjectFormState> {
  await requireSession();
  const parsed = read(form);
  if (!parsed.success) return toErrors(parsed.error);
  const { skillIds, coverMediaId, clientName, liveUrl, githubUrl, seoTitle, seoDescription, ...d } = parsed.data;
  const clash = await db.project.findFirst({ where: { slug: d.slug, id: { not: id } } });
  if (clash) return { errors: { slug: "Slug already in use" } };
  const prev = await db.project.findUnique({ where: { id }, select: { slug: true, publishedAt: true } });
  await db.project.update({
    where: { id },
    data: {
      ...d,
      clientName: clientName || null,
      liveUrl: liveUrl || null,
      githubUrl: githubUrl || null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      coverMediaId: coverMediaId ?? null,
      publishedAt: d.status === "PUBLISHED" ? prev?.publishedAt ?? new Date() : prev?.publishedAt,
      skills: { deleteMany: {}, create: skillIds.map((skillId) => ({ skillId })) },
    },
  });
  revalidate(d.slug);
  if (prev?.slug && prev.slug !== d.slug) revalidatePath(`/work/${prev.slug}`);
  return { message: "Saved." };
}

export async function setProjectStatus(form: FormData) {
  await requireSession();
  const id = Number(form.get("id"));
  const status = z.enum(STATUS).parse(form.get("status"));
  const p = await db.project.update({
    where: { id },
    data: { status, ...(status === "PUBLISHED" ? { publishedAt: new Date() } : {}) },
  });
  revalidate(p.slug);
}

export async function duplicateProject(form: FormData) {
  await requireSession();
  const id = Number(form.get("id"));
  const src = await db.project.findUnique({ where: { id }, include: { skills: true } });
  if (!src) return;
  const { id: _id, createdAt: _c, updatedAt: _u, publishedAt: _p, skills, ...rest } = src;
  const max = await db.project.aggregate({ _max: { projectNumber: true } });
  const copy = await db.project.create({
    data: {
      ...rest,
      title: `${src.title} COPY`,
      slug: `${src.slug}-copy-${Date.now().toString(36)}`,
      projectNumber: (max._max.projectNumber ?? 0) + 1,
      status: "DRAFT",
      featured: false,
      skills: { create: skills.map((s) => ({ skillId: s.skillId })) },
    },
  });
  revalidate();
  redirect(`/studio/projects/${copy.id}`);
}

export async function deleteProject(form: FormData) {
  await requireSession();
  const id = Number(form.get("id"));
  const p = await db.project.delete({ where: { id } });
  revalidate(p.slug);
  redirect("/studio/projects");
}
