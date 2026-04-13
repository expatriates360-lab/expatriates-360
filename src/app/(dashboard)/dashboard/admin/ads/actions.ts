"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase";
import type { AdType } from "@/types/database";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (data?.role !== "admin") throw new Error("Forbidden");
  return supabase;
}

export async function upsertAdPlacement(formData: {
  id?: string;
  slot_name: string;
  is_active: boolean;
  ad_type: AdType;
  custom_image_url: string;
  custom_redirect_url: string;
  adsense_slot_id: string;
}): Promise<void> {
  const supabase = await requireAdmin();

  const payload = {
    slot_name: formData.slot_name.trim(),
    is_active: formData.is_active,
    ad_type: formData.ad_type,
    custom_image_url: formData.custom_image_url.trim() || null,
    custom_redirect_url: formData.custom_redirect_url.trim() || null,
    adsense_slot_id: formData.adsense_slot_id.trim() || null,
  };

  if (formData.id) {
    const { error } = await supabase
      .from("ad_placements")
      .update(payload)
      .eq("id", formData.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("ad_placements").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/dashboard/admin/ads");
}

export async function deleteAdPlacement(id: string): Promise<void> {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("ad_placements")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/admin/ads");
}
