"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 32) || "qr"
  );
}

function randSuffix() {
  return Math.random().toString(36).slice(2, 6);
}

/** Admin-only (RLS). Creates a QR code row with a unique slug. */
export async function createQrCode(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  let destination = String(formData.get("destination") ?? "").trim();
  if (!name || !destination) return;
  if (!/^https?:\/\//i.test(destination)) destination = "https://" + destination;

  const slug = `${slugify(name)}-${randSuffix()}`;
  const supabase = await createClient();
  await supabase.from("qr_codes").insert({ name, destination_url: destination, slug });
  revalidatePath("/admin/qr");
}

export async function toggleQrActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  await supabase.from("qr_codes").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/admin/qr");
}

export async function deleteQrCode(id: string) {
  const supabase = await createClient();
  await supabase.from("qr_codes").delete().eq("id", id);
  revalidatePath("/admin/qr");
}
