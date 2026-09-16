import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// Single-user studio auth. Password hash lives in env — no password table.
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/studio/login" },
  providers: [
    Credentials({
      credentials: { email: { label: "Email" }, password: { label: "Password", type: "password" } },
      async authorize(creds) {
        const email = String(creds?.email ?? "").trim().toLowerCase();
        const password = String(creds?.password ?? "");
        const expectedEmail = (process.env.STUDIO_EMAIL ?? "").trim().toLowerCase();
        const hash = process.env.STUDIO_PASSWORD_HASH ?? "";
        if (!expectedEmail || !hash) return null;
        if (email !== expectedEmail) return null;
        const ok = await bcrypt.compare(password, hash);
        return ok ? { id: "1", email, name: "Sandip" } : null;
      },
    }),
  ],
});

export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/studio/login");
  return session;
}
