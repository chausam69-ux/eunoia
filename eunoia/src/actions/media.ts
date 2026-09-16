"use server";

import { writeFile, unlink, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
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

// ponytail: writes to public/uploads. Swap for blob storage at deploy time.
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
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  await db.media.create({
    data: {
      filePath: `/uploads/${name}`,
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
    await unlink(path.join(process.cwd(), "public", m.filePath));
  } catch {
    /* file already gone */
  }
  revalidatePath("/studio/media");
  revalidatePath("/work");
  revalidatePath("/");
}
