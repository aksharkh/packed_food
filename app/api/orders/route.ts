import { describe, type CartLine } from "@/lib/cart";
import { shippingFor } from "@/lib/config";
import { addOrder, type OrderLine } from "@/lib/store";

type Body = {
  customer?: { name?: string; phone?: string; email?: string; address?: string; city?: string; pincode?: string };
  payment?: string;
  notes?: string;
  lines?: Partial<CartLine>[];
};

const bad = (error: string) => Response.json({ error }, { status: 400 });
const clean = (s: unknown, max = 300) => (typeof s === "string" ? s.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid request");
  }

  const c = body.customer ?? {};
  const name = clean(c.name, 80);
  const phone = clean(c.phone, 20).replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  const address = clean(c.address, 400);
  const city = clean(c.city, 60);
  const pincode = clean(c.pincode, 6);
  const email = clean(c.email, 120);
  if (!name) return bad("Naam toh batao! (Please enter your name)");
  if (!/^[6-9]\d{9}$/.test(phone)) return bad("Please enter a valid 10-digit mobile number");
  if (address.length < 8) return bad("Please enter your full address");
  if (!city) return bad("Please enter your city");
  if (!/^[1-9]\d{5}$/.test(pincode)) return bad("Please enter a valid 6-digit pincode");
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return bad("That email doesn't look right");

  // Everything is re-priced on the server from the catalogue.
  const lines: OrderLine[] = [];
  for (const raw of body.lines ?? []) {
    const qty = Math.floor(Number(raw.qty));
    if (!(qty > 0 && qty <= 100)) continue;
    let shape: Parameters<typeof describe>[0] | null = null;
    if (raw.type === "product" && typeof raw.slug === "string") shape = { type: "product", slug: raw.slug };
    else if (raw.type === "combo" && typeof raw.id === "string") shape = { type: "combo", id: raw.id };
    else if (raw.type === "box" && Array.isArray(raw.items)) shape = { type: "box", items: raw.items.filter((x) => typeof x === "string") };
    else if (raw.type === "sub" && typeof raw.plan === "string" && typeof raw.pref === "string") shape = { type: "sub", plan: raw.plan, pref: raw.pref };
    const d = shape && describe(shape);
    if (!shape || !d) return bad("Something in your cart is no longer available — please refresh");
    lines.push({
      type: shape.type,
      title: d.title,
      subtitle: d.subtitle,
      unit: d.unit,
      qty: shape.type === "sub" ? 1 : qty,
      packs: d.packs.map((p) => p.slug),
      recurring: d.recurring,
    });
  }
  if (lines.length === 0) return bad("Your cart is empty");

  const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
  const hasSubscription = lines.some((l) => l.type === "sub");
  const shipping = hasSubscription ? 0 : shippingFor(subtotal);

  const order = await addOrder({
    customer: { name, phone, email: email || undefined, address, city, pincode },
    payment: body.payment === "upi" ? "upi" : "cod",
    notes: clean(body.notes, 300) || undefined,
    lines,
    subtotal,
    shipping,
    total: subtotal + shipping,
    hasSubscription,
  });

  return Response.json({ id: order.id }, { status: 201 });
}
