"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createCandle(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const tag = String(formData.get("tag") ?? "").trim() || null;
  const image_url = String(formData.get("image_url") ?? "").trim();
  const sort_order = Number(formData.get("sort_order") ?? 0);
  if (!name || !image_url) return { error: "Name and image are required" };

  const supabase = await createClient();
  await supabase.from("candles").insert({ name, description, tag, image_url, sort_order });
  revalidatePath("/admin/candles");
}

export async function updateCandle(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const tag = String(formData.get("tag") ?? "").trim() || null;
  const image_url = String(formData.get("image_url") ?? "").trim();
  const sort_order = Number(formData.get("sort_order") ?? 0);
  if (!name || !image_url) return { error: "Name and image are required" };

  const supabase = await createClient();
  await supabase.from("candles").update({ name, description, tag, image_url, sort_order }).eq("id", id);
  revalidatePath("/admin/candles");
}

export async function deleteCandle(id: string) {
  const supabase = await createClient();
  // also delete the stored image if it's in our bucket
  const { data } = await supabase.from("candles").select("image_url").eq("id", id).maybeSingle();
  if (data?.image_url?.includes("candle-images")) {
    const admin = createAdminClient();
    const path = data.image_url.split("/candle-images/")[1];
    if (path) await admin.storage.from("candle-images").remove([path]);
  }
  await supabase.from("candles").delete().eq("id", id);
  revalidatePath("/admin/candles");
}

export async function toggleCandlePublished(id: string, isPublished: boolean) {
  const supabase = await createClient();
  await supabase.from("candles").update({ is_published: isPublished }).eq("id", id);
  revalidatePath("/admin/candles");
}
