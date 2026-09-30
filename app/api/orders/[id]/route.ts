import { getOrder } from "@/lib/store";

// Public tracking endpoint — no phone/address.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = await getOrder(id.toUpperCase());
  if (!o) return Response.json({ error: "Order not found" }, { status: 404 });
  return Response.json({
    id: o.id,
    status: o.status,
    createdAt: o.createdAt,
    name: o.customer.name.split(" ")[0],
    city: o.customer.city,
    payment: o.payment,
    lines: o.lines,
    subtotal: o.subtotal,
    shipping: o.shipping,
    total: o.total,
  });
}
