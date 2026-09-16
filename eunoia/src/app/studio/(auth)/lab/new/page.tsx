import { db } from "@/lib/db";
import { createLab } from "@/actions/lab";
import { LabForm } from "@/components/studio/LabForm";
import { PageHead } from "@/components/studio/server-ui";

export default async function NewLabPage() {
  const [skills, media, max] = await Promise.all([
    db.skill.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true, category: true } }),
    db.media.findMany({ where: { type: "image" }, select: { id: true, altText: true } }),
    db.labEntry.aggregate({ _max: { labNumber: true } }),
  ]);
  return (
    <div>
      <PageHead title="NEW LAB ENTRY" />
      <LabForm
        action={createLab}
        skills={skills}
        media={media}
        lab={{
          title: "", slug: "", labNumber: (max._max.labNumber ?? 0) + 1, type: "Experiment", summary: "",
          content: "", whatILearned: "", status: "DRAFT", coverMediaId: null, demoUrl: null, githubUrl: null, skillIds: [],
        }}
      />
    </div>
  );
}
