import { db } from "@/lib/db";
import { createProject } from "@/actions/projects";
import { ProjectForm } from "@/components/studio/ProjectForm";
import { PageHead } from "@/components/studio/server-ui";

export default async function NewProjectPage() {
  const [skills, media, max] = await Promise.all([
    db.skill.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true, category: true } }),
    db.media.findMany({ where: { type: "image" }, select: { id: true, filePath: true, altText: true } }),
    db.project.aggregate({ _max: { projectNumber: true } }),
  ]);
  return (
    <div>
      <PageHead title="NEW PROJECT" />
      <ProjectForm
        action={createProject}
        skills={skills}
        media={media}
        project={{
          title: "",
          slug: "",
          projectNumber: (max._max.projectNumber ?? 0) + 1,
          shortDescription: "",
          problem: "",
          approach: "",
          solution: "",
          result: "SELF-INITIATED CONCEPT — RESULTS ARE SIMULATED.",
          systemFlow: "",
          stack: "",
          projectType: "SELF_INITIATED",
          clientName: null,
          year: new Date().getFullYear(),
          status: "DRAFT",
          coverMediaId: null,
          liveUrl: null,
          githubUrl: null,
          featured: false,
          seoTitle: null,
          seoDescription: null,
          skillIds: [],
        }}
      />
    </div>
  );
}
