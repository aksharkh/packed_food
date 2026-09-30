import { isAdmin, unauthorized } from "@/lib/auth";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/config";
import { setOrderStatus } from "@/lib/store";

const VALID = new Set<string>([...ORDER_STATUSES.map((s) => s.id), "cancelled"]);

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  const { status } = (await req.json().catch(() => ({}))) as { status?: string };
  if (!status || !VALID.has(status)) return Response.json({ error: "Invalid status" }, { status: 400 });
  const order = await setOrderStatus(id, status as OrderStatus);
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
  return Response.json(order);
}
