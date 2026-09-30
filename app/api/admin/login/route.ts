import { cookies } from "next/headers";
import { ADMIN_COOKIE, checkPasscode } from "@/lib/auth";

export async function POST(req: Request) {
  if (!process.env.ADMIN_PASSCODE) {
    return Response.json({ error: "Set ADMIN_PASSCODE in .env.local to enable the admin panel" }, { status: 500 });
  }
  const { passcode } = (await req.json().catch(() => ({}))) as { passcode?: string };
  const token = checkPasscode(String(passcode ?? ""));
  if (!token) return Response.json({ error: "Wrong passcode" }, { status: 401 });
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return Response.json({ ok: true });
}

export async function DELETE() {
  (await cookies()).delete(ADMIN_COOKIE);
  return Response.json({ ok: true });
}
