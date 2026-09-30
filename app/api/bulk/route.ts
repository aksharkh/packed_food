import { OCCASIONS } from "@/lib/config";
import { addBulk } from "@/lib/store";

const clean = (s: unknown, max = 300) => (typeof s === "string" ? s.trim().slice(0, max) : "");
const bad = (error: string) => Response.json({ error }, { status: 400 });

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = clean(b.name, 80);
  const phone = clean(b.phone, 20).replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  const email = clean(b.email, 120);
  const quantity = Math.floor(Number(b.quantity));
  const city = clean(b.city, 60);
  const occasion = OCCASIONS.includes(clean(b.occasion, 60)) ? clean(b.occasion, 60) : "Something else";
  if (!name) return bad("Please enter your name");
  if (!/^[6-9]\d{9}$/.test(phone)) return bad("Please enter a valid 10-digit mobile number");
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return bad("That email doesn't look right");
  if (!(quantity >= 25 && quantity <= 1_000_000)) return bad("Bulk orders start at 25 packs");
  if (!city) return bad("Please enter your city");

  const e = await addBulk({
    name,
    org: clean(b.org, 100) || undefined,
    phone,
    email: email || undefined,
    occasion,
    quantity,
    city,
    date: clean(b.date, 20) || undefined,
    message: clean(b.message, 800) || undefined,
  });
  return Response.json({ id: e.id }, { status: 201 });
}
