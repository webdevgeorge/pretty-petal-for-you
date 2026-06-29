import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isServiceConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isServiceConfigured()) return NextResponse.json([]);
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("candles")
    .select("id, name, description, tag, image_url, link_url, sort_order")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return NextResponse.json(data ?? []);
}
