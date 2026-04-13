import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase";
import type { OrderStatus } from "@/types/database";

const VALID_STATUSES: OrderStatus[] = ["pending", "completed", "cancelled"];

/** PATCH /api/orders/[id] — seller updates order status */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();

  // Verify the caller is the seller
  const { data: order } = await supabase
    .from("orders")
    .select("seller_id")
    .eq("id", id)
    .single();

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (order.seller_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: { status?: string } = await req.json();
  if (!body.status || !VALID_STATUSES.includes(body.status as OrderStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: body.status as OrderStatus })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
