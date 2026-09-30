import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "dhm_admin";

const token = (passcode: string) => createHash("sha256").update(`dhm:${passcode}`).digest("hex");

export function checkPasscode(input: string) {
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected) return null;
  const a = Buffer.from(token(input));
  const b = Buffer.from(token(expected));
  return timingSafeEqual(a, b) ? token(expected) : null;
}

export async function isAdmin() {
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return value === token(expected);
}

export const unauthorized = () => Response.json({ error: "Unauthorized" }, { status: 401 });
