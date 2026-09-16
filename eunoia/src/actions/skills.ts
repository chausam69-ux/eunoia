"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { slugify, str, bool } from "@/lib/slug";
import { CATEGORIES, SKILL_STATUS } from "@/lib/constants";

const Schema = z.object({
  name: z.string().min(1),
  category: z.string().refine((c) => CATEGORIES.includes(c)),
  status: z.string().refine((s) => SKILL_STATUS.includes(s)),
  description: z.string(),
  featured: z.boolean(),
  sortOrder: z.coerce.number().int(),
});

const PUBLIC = ["/", "/work", "/about", "/studio", "/studio/skills"];
const revalidate = () => PUBLIC.forEach((p) => revalidatePath(p));

export async function upsertSkill(form: FormData) {
  await requireSession();
  const id = Number(form.get("id") || 0);
  const d = Schema.parse({
    name: str(form, "name"),
    category: str(form, "category"),
    status: str(form, "status"),
    description: str(form, "description"),
    featured: bool(form, "featured"),
    sortOrder: str(form, "sortOrder") || 0,
  });
  if (id) {
    await db.skill.update({ where: { id }, data: d });
  } else {
    const base = slugify(d.name);
    const clash = await db.skill.findUnique({ where: { slug: base } });
    await db.skill.create({ data: { ...d, slug: clash ? `${base}-${Date.now().toString(36)}` : base } });
  }
  revalidate();
}

export async function deleteSkill(form: FormData) {
  await requireSession();
  await db.skill.delete({ where: { id: Number(form.get("id")) } });
  revalidate();
}

const CapSchema = z.object({
  name: z.string().min(1),
  category: z.string().refine((c) => CATEGORIES.includes(c)),
  description: z.string(),
  whatISolve: z.string(),
  deliverables: z.string(),
  startingPrice: z.string(),
  timeline: z.string(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  sortOrder: z.coerce.number().int(),
});

const revalidateCaps = () => ["/capabilities", "/studio", "/studio/capabilities"].forEach((p) => revalidatePath(p));

export async function upsertCapability(form: FormData) {
  await requireSession();
  const id = Number(form.get("id") || 0);
  const d = CapSchema.parse({
    name: str(form, "name"),
    category: str(form, "category"),
    description: str(form, "description"),
    whatISolve: str(form, "whatISolve"),
    deliverables: str(form, "deliverables"),
    startingPrice: str(form, "startingPrice"),
    timeline: str(form, "timeline"),
    visibility: str(form, "visibility") || "PUBLIC",
    sortOrder: str(form, "sortOrder") || 0,
  });
  const data = { ...d, startingPrice: d.startingPrice || null, timeline: d.timeline || null };
  if (id) await db.capability.update({ where: { id }, data });
  else {
    const base = slugify(d.name);
    const clash = await db.capability.findUnique({ where: { slug: base } });
    await db.capability.create({ data: { ...data, slug: clash ? `${base}-${Date.now().toString(36)}` : base } });
  }
  revalidateCaps();
}

export async function deleteCapability(form: FormData) {
  await requireSession();
  await db.capability.delete({ where: { id: Number(form.get("id")) } });
  revalidateCaps();
}
