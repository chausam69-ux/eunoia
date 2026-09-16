import { db } from "@/lib/db";
import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { PageTransition } from "@/components/public/PageTransition";
import { ThemeOverride } from "@/components/public/ThemeOverride";
import { Suspense } from "react";
import { THEMES } from "@/lib/constants";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [profile, settings] = await Promise.all([
    db.profile.findUnique({ where: { id: 1 } }),
    db.siteSettings.findUnique({ where: { id: 1 } }),
  ]);
  const t = settings?.theme ?? "system";
  const theme = t !== "system" && THEMES.includes(t) ? `theme-${t}` : "";
  return (
    <div className={`${theme} flex min-h-dvh flex-col`}>
      <a href="#main" className="skip-link t-meta">
        SKIP TO CONTENT
      </a>
      <Suspense fallback={null}>
        <ThemeOverride />
      </Suspense>
      <Nav />
      <PageTransition>
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer
          email={profile?.email ?? ""}
          githubUrl={profile?.githubUrl ?? "#"}
          linkedinUrl={profile?.linkedinUrl ?? "#"}
        />
      </PageTransition>
    </div>
  );
}
