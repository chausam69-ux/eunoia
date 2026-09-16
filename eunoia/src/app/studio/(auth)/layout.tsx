import type { Metadata } from "next";
import { requireSession, signOut } from "@/lib/auth";
import { Sidebar } from "@/components/studio/Sidebar";

export const metadata: Metadata = { title: "Studio", robots: { index: false } };

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  await requireSession();
  async function out() {
    "use server";
    await signOut({ redirectTo: "/studio/login" });
  }
  return (
    <div className="theme-light studio flex min-h-dvh flex-col md:flex-row">
      <Sidebar signOutAction={out} />
      <main id="main" className="flex-1 px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
