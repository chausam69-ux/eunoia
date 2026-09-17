"use server";

import path from "node:path";
import { randomUUID } from "node:crypto";
import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { str, bool } from "@/lib/slug";

const ALLOWED: Record<string, "image" | "video"> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/avif": "image",
  "image/gif": "image",
  "video/mp4": "video",
  "video/webm": "video",
};
const MAX = 25 * 1024 * 1024;

export type MediaState = { error?: string; ok?: boolean };

// Files live in Vercel Blob (public URLs stored in Media.filePath). Needs BLOB_READ_WRITE_TOKEN.
export async function uploadMedia(_: MediaState, form: FormData): Promise<MediaState> {
  await requireSession();
  const file = form.get("file");
  const altText = str(form, "altText");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a file." };
  if (!altText) return { error: "Alt text is required." };
  const type = ALLOWED[file.type];
  if (!type) return { error: `Unsupported type: ${file.type || "unknown"}.` };
  if (file.size > MAX) return { error: "Max 25 MB." };

  const ext = path.extname(file.name).toLowerCase() || `.${file.type.split("/")[1]}`;
  const name = `${randomUUID()}${ext}`;
  const blob = await put(`uploads/${name}`, file, { access: "public", contentType: file.type });

  await db.media.create({
    data: {
      filePath: blob.url,
      altText,
      caption: str(form, "caption") || null,
      type,
      projectId: Number(form.get("projectId")) || null,
      labEntryId: Number(form.get("labEntryId")) || null,
      published: bool(form, "published"),
    },
  });
  revalidatePath("/studio/media");
  return { ok: true };
}

export async function updateMedia(form: FormData) {
  await requireSession();
  const id = Number(form.get("id"));
  await db.media.update({
    where: { id },
    data: {
      altText: str(form, "altText"),
      caption: str(form, "caption") || null,
      projectId: Number(form.get("projectId")) || null,
      labEntryId: Number(form.get("labEntryId")) || null,
      published: bool(form, "published"),
    },
  });
  revalidatePath("/studio/media");
  revalidatePath("/work");
  revalidatePath("/");
}

export async function deleteMedia(form: FormData) {
  await requireSession();
  const id = Number(form.get("id"));
  const m = await db.media.delete({ where: { id } });
  try {
    if (m.filePath.startsWith("https://")) await del(m.filePath);
  } catch {
    // blob already gone; row is deleted, that's what matters
  }
  revalidatePath("/studio/media");
  revalidatePath("/work");
  revalidatePath("/");
}
