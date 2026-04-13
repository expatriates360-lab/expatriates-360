import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase";

/** POST /api/orders — authenticated buyer places an order */
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: {
    listing_id?: string;
    seller_id?: string;
    price?: string;
    currency?: string;
    delivery_name?: string;
    delivery_address?: string;
    delivery_phone?: string;
  } = await req.json();

  if (!body.listing_id) return NextResponse.json({ error: "listing_id is required" }, { status: 400 });
  if (!body.seller_id) return NextResponse.json({ error: "seller_id is required" }, { status: 400 });
  if (!body.price) return NextResponse.json({ error: "price is required" }, { status: 400 });
  if (!body.delivery_name?.trim()) return NextResponse.json({ error: "Delivery name is required" }, { status: 400 });
  if (!body.delivery_address?.trim()) return NextResponse.json({ error: "Delivery address is required" }, { status: 400 });
  if (!body.delivery_phone?.trim()) return NextResponse.json({ error: "Delivery phone is required" }, { status: 400 });

  // Prevent self-purchase
  if (body.seller_id === userId) {
    return NextResponse.json({ error: "You cannot purchase your own listing" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Verify the listing exists, is approved, and is a native listing
  const { data: listing } = await supabase
    .from("marketplace_listings")
    .select("id, status, listing_type, seller_id")
    .eq("id", body.listing_id)
    .single();

  if (!listing || listing.status !== "approved" || listing.listing_type !== "native") {
    return NextResponse.json({ error: "Listing not available for purchase" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      listing_id: body.listing_id,
      buyer_id: userId,
      seller_id: body.seller_id,
      price: body.price,
      currency: body.currency ?? "USD",
      payment_method: "COD",
      status: "pending",
      delivery_name: body.delivery_name.trim(),
      delivery_address: body.delivery_address.trim(),
      delivery_phone: body.delivery_phone.trim(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ order: data }, { status: 201 });
}
