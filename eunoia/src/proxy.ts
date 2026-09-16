import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Optimistic gate for /studio/*. Server actions re-check via requireSession().
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/studio/login") return NextResponse.next();
  const session = await auth();
  if (!session?.user) {
    const url = new URL("/studio/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/studio/:path*"] };
