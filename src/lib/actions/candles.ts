"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function parseForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    tag: String(formData.get("tag") ?? "").trim() || null,
    image_url: String(formData.get("image_url") ?? "").trim(),
    link_url: String(formData.get("link_url") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    notify: formData.get("notify") === "on",
  };
}

export async function createCandle(formData: FormData) {
  const { notify, ...fields } = parseForm(formData);
  if (!fields.name || !fields.image_url) return { error: "Name and image are required" };

  const supabase = await createClient();
  const { data: candle } = await supabase.from("candles").insert(fields).select().single();
  revalidatePath("/admin/candles");
  revalidatePath("/");

  if (notify && candle) {
    const { broadcastNewCandle } = await import("@/lib/actions/subscribers");
    broadcastNewCandle(candle).catch(() => {});
  }
}

export async function updateCandle(id: string, formData: FormData) {
  const fields = parseForm(formData);
  if (!fields.name || !fields.image_url) return { error: "Name and image are required" };

  const supabase = await createClient();
  await supabase.from("candles").update(fields).eq("id", id);
  revalidatePath("/admin/candles");
  revalidatePath("/");
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
  revalidatePath("/");
}

export async function toggleCandlePublished(id: string, isPublished: boolean) {
  const supabase = await createClient();
  await supabase.from("candles").update({ is_published: isPublished }).eq("id", id);
  revalidatePath("/admin/candles");
  revalidatePath("/");
}
