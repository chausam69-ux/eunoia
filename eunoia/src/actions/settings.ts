"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { str, bool } from "@/lib/slug";
import { THEMES } from "@/lib/constants";

const ALL = ["/", "/about", "/work", "/lab", "/capabilities", "/start", "/studio", "/studio/settings"];

export async function updateProfile(form: FormData) {
  await requireSession();
  const d = z
    .object({
      name: z.string().min(1),
      headline: z.string().min(1),
      bio: z.string(),
      locationLabel: z.string(),
      availability: z.string(),
      email: z.string().email(),
      githubUrl: z.string(),
      linkedinUrl: z.string(),
      avatarUrl: z.string(),
    })
    .parse({
      name: str(form, "name"),
      headline: str(form, "headline"),
      bio: str(form, "bio"),
      locationLabel: str(form, "locationLabel"),
      availability: str(form, "availability"),
      email: str(form, "email"),
      githubUrl: str(form, "githubUrl"),
      linkedinUrl: str(form, "linkedinUrl"),
      avatarUrl: str(form, "avatarUrl"),
    });
  await db.profile.upsert({ where: { id: 1 }, update: d, create: { id: 1, ...d } });
  ALL.forEach((p) => revalidatePath(p));
}

export async function updateNow(form: FormData) {
  await requireSession();
  const d = {
    nowLearning: str(form, "nowLearning"),
    nowBuilding: str(form, "nowBuilding"),
    nowExperimenting: str(form, "nowExperimenting"),
    openFor: str(form, "openFor"),
    heroVideoUrl: str(form, "heroVideoUrl"),
    heroPosterUrl: str(form, "heroPosterUrl"),
    theme: THEMES.includes(str(form, "theme")) ? str(form, "theme") : "system",
    roadmap: str(form, "roadmap"),
    currentStage: Math.max(0, Number(form.get("currentStage")) || 0),
  };
  await db.siteSettings.upsert({ where: { id: 1 }, update: d, create: { id: 1, ...d } });
  ALL.forEach((p) => revalidatePath(p));
}

// Testimonials
export async function upsertTestimonial(form: FormData) {
  await requireSession();
  const id = Number(form.get("id") || 0);
  const permission = bool(form, "permissionToPublish");
  const d = {
    name: str(form, "name"),
    role: str(form, "role"),
    company: str(form, "company"),
    quote: str(form, "quote"),
    avatarUrl: str(form, "avatarUrl") || null,
    projectId: Number(form.get("projectId")) || null,
    permissionToPublish: permission,
    published: permission && bool(form, "published"), // never publish without permission
  };
  if (!d.name || !d.quote) return;
  if (id) await db.testimonial.update({ where: { id }, data: d });
  else await db.testimonial.create({ data: d });
  revalidatePath("/studio/testimonials");
}

export async function deleteTestimonial(form: FormData) {
  await requireSession();
  await db.testimonial.delete({ where: { id: Number(form.get("id")) } });
  revalidatePath("/studio/testimonials");
}
