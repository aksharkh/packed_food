import { isAdmin, unauthorized } from "@/lib/auth";
import { getBulk, getOrders } from "@/lib/store";

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  const [orders, bulk] = await Promise.all([getOrders(), getBulk()]);
  return Response.json({ orders, bulk });
}
