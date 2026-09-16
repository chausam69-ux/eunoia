import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/lib/auth";

export const metadata: Metadata = { title: "Studio login", robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<"/studio/login">) {
  const session = await auth();
  if (session?.user) redirect("/studio");
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;
  const next = typeof sp.next === "string" && sp.next.startsWith("/studio") ? sp.next : "/studio";

  async function login(form: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: form.get("email"),
        password: form.get("password"),
        redirectTo: String(form.get("next") ?? "/studio"),
      });
    } catch (e) {
      if (e instanceof AuthError) redirect(`/studio/login?error=1&next=${encodeURIComponent(next)}`);
      throw e; // NEXT_REDIRECT
    }
  }

  return (
    <main className="theme-light studio flex min-h-dvh items-center justify-center px-4">
      <form action={login} className="w-full max-w-sm">
        <p className="t-meta mb-2 text-gray">PRIVATE WORKSPACE</p>
        <h1 className="t-display mb-10 text-4xl">EUNΟIA STUDIO</h1>
        <input type="hidden" name="next" value={next} />
        <label htmlFor="email" className="t-meta mb-1 text-gray">
          EMAIL
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className="mb-5" />
        <label htmlFor="password" className="t-meta mb-1 text-gray">
          PASSWORD
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
        {error && (
          <p role="alert" className="t-meta mt-3 text-accent">
            EMAIL OR PASSWORD DIDN&apos;T MATCH.
          </p>
        )}
        <button
          type="submit"
          className="t-meta-lg mt-8 min-h-[48px] w-full bg-ink text-paper transition-colors hover:bg-accent hover:text-ink"
        >
          SIGN IN
        </button>
        <p className="t-meta mt-8 text-gray">
          NO PASSWORD SET? RUN <code className="normal-case">npx tsx scripts/hash-password.ts yourpassword</code> AND PUT
          THE HASH IN <code>.env</code>.
        </p>
      </form>
    </main>
  );
}
