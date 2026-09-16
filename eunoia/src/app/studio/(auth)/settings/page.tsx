import { db } from "@/lib/db";
import { updateProfile, updateNow } from "@/actions/settings";
import { PageHead, Field } from "@/components/studio/server-ui";
import { THEMES } from "@/lib/constants";

export default async function SettingsPage() {
  const [p, s] = await Promise.all([
    db.profile.findUnique({ where: { id: 1 } }),
    db.siteSettings.findUnique({ where: { id: 1 } }),
  ]);
  const btn = "t-meta-lg min-h-[44px] bg-ink px-5 text-paper hover:bg-accent hover:text-ink";

  return (
    <div>
      <PageHead title="SETTINGS" />
      <div className="grid gap-10 lg:grid-cols-2">
        <form action={updateProfile} className="space-y-4 border border-line-light bg-white p-5">
          <h2 className="t-meta-lg">PROFILE</h2>
          <Field label="NAME" name="name" value={p?.name} required />
          <Field label="HEADLINE" name="headline" value={p?.headline} required />
          <Field label="BIO" name="bio" value={p?.bio} rows={6} />
          <Field label="LOCATION LABEL" name="locationLabel" value={p?.locationLabel} hint="Status bar + about. e.g. INDIA → WORLDWIDE" />
          <Field label="AVAILABILITY" name="availability" value={p?.availability} />
          <Field label="EMAIL" name="email" type="email" value={p?.email} required />
          <Field label="GITHUB URL" name="githubUrl" type="url" value={p?.githubUrl} />
          <Field label="LINKEDIN URL" name="linkedinUrl" type="url" value={p?.linkedinUrl} />
          <Field label="AVATAR PATH" name="avatarUrl" value={p?.avatarUrl} hint="e.g. /sandip.jpg or an /uploads/... path" />
          <button className={btn}>SAVE PROFILE</button>
        </form>

        <form action={updateNow} className="space-y-4 self-start border border-line-light bg-white p-5">
          <h2 className="t-meta-lg">NOW / CURRENTLY</h2>
          <p className="text-sm text-gray">Rendered on the homepage and about page. Change it as your career changes.</p>
          <Field label="LEARNING" name="nowLearning" value={s?.nowLearning} />
          <Field label="BUILDING" name="nowBuilding" value={s?.nowBuilding} />
          <Field label="EXPERIMENTING" name="nowExperimenting" value={s?.nowExperimenting} />
          <Field label="OPEN FOR" name="openFor" value={s?.openFor} />
          <Field label="HERO BACKGROUND VIDEO" name="heroVideoUrl" value={s?.heroVideoUrl} hint="Path to a WebM/MP4, e.g. /uploads/hero.webm (upload in Media). Empty = aurora only." />
          <Field label="HERO POSTER IMAGE" name="heroPosterUrl" value={s?.heroPosterUrl} hint="First frame as JPG/WebP, shown before video loads and under reduced-motion." />
          <Field label="COLOUR THEME" name="theme" value={s?.theme ?? "system"} options={THEMES} hint="system = ink/paper + six colours · olive = 606C38-283618-FEFAE0-DDA15E-BC6C25 · pastel = CDB4DB-FFC8DD-FFAFCC-BDE0FE-A2D2FF · navy = 780000-C1121F-FDF0D5-003049-669BBC. Preview any with /?theme=<name>" />
          <Field label="ROADMAP (LADDER)" name="roadmap" value={s?.roadmap} rows={7} hint="One rung per line: 'Video editing | first cash'. Rendered on the homepage." />
          <Field label="CURRENT RUNG (0 = first line)" name="currentStage" type="number" value={s?.currentStage ?? 0} />
          <button className={btn}>SAVE NOW BLOCK</button>
          <div className="border-t border-line-light pt-4 text-sm text-gray">
            <p className="t-meta mb-1">STUDIO PASSWORD</p>
            <p>
              Set via <code>.env</code> → <code>STUDIO_PASSWORD_HASH</code>. Generate with{" "}
              <code>npx tsx scripts/hash-password.ts newpassword</code>, then restart the server.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
