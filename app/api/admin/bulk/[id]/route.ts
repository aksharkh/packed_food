import { isAdmin, unauthorized } from "@/lib/auth";
import { BULK_STATUSES, type BulkStatus } from "@/lib/config";
import { setBulkStatus } from "@/lib/store";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  const { status } = (await req.json().catch(() => ({}))) as { status?: string };
  if (!status || !(BULK_STATUSES as readonly string[]).includes(status)) return Response.json({ error: "Invalid status" }, { status: 400 });
  const e = await setBulkStatus(id, status as BulkStatus);
  if (!e) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(e);
}
