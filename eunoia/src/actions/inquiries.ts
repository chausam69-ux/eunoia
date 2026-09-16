"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

const InquirySchema = z.object({
  improve: z.string().min(1, "Pick one."),
  problem: z.string().trim().min(10, "Tell me a bit more (10+ characters)."),
  need: z.string().min(1, "Pick one."),
  budget: z.string().trim().optional(),
  timeline: z.string().trim().optional(),
  company: z.string().trim().optional(),
  name: z.string().trim().min(2, "Your name, please."),
  email: z.string().trim().email("That email doesn't look right."),
  message: z.string().trim().min(10, "A few more words help (10+ characters)."),
  website: z.string().max(0).optional(), // honeypot
});

export type InquiryState = { ok: boolean; errors?: Record<string, string> };

export async function createInquiry(_prev: InquiryState, form: FormData): Promise<InquiryState> {
  const raw = Object.fromEntries(form.entries());
  const parsed = InquirySchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message;
    return { ok: false, errors };
  }
  const d = parsed.data;
  if (d.website) return { ok: true }; // bot: pretend success, store nothing
  await db.inquiry.create({
    data: {
      improve: d.improve,
      problem: d.problem,
      need: d.need,
      budget: d.budget || null,
      timeline: d.timeline || null,
      company: d.company || null,
      name: d.name,
      email: d.email,
      message: d.message,
      source: "site",
    },
  });
  revalidatePath("/studio");
  revalidatePath("/studio/inquiries");
  return { ok: true };
}

const UpdateSchema = z.object({
  id: z.coerce.number().int(),
  status: z.enum(["NEW", "REVIEWING", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST", "ARCHIVED"]),
  notes: z.string().default(""),
  nextAction: z.string().default(""),
});

export async function updateInquiry(form: FormData) {
  await requireSession();
  const d = UpdateSchema.parse(Object.fromEntries(form.entries()));
  await db.inquiry.update({
    where: { id: d.id },
    data: { status: d.status, notes: d.notes, nextAction: d.nextAction },
  });
  revalidatePath("/studio/inquiries");
  revalidatePath(`/studio/inquiries/${d.id}`);
  revalidatePath("/studio");
}

export async function deleteInquiry(form: FormData) {
  await requireSession();
  const id = Number(form.get("id"));
  await db.inquiry.delete({ where: { id } });
  revalidatePath("/studio/inquiries");
  revalidatePath("/studio");
}
