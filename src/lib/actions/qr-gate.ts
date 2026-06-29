"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import crypto from "node:crypto";
import { UAParser } from "ua-parser-js";
import { createAdminClient } from "@/lib/supabase/admin";

function buildTarget(destinationUrl: string, slug: string): string {
  try {
    const dest = new URL(destinationUrl);
    if (!dest.searchParams.has("utm_source")) dest.searchParams.set("utm_source", "qr");
    if (!dest.searchParams.has("utm_medium")) dest.searchParams.set("utm_medium", "qr");
    if (!dest.searchParams.has("utm_campaign")) dest.searchParams.set("utm_campaign", slug);
    return dest.toString();
  } catch {
    return destinationUrl;
  }
}

export async function captureQrEmail(slug: string, formData: FormData) {
  const email = (formData.get("email") as string | null)?.trim() || null;

  const supabase = createAdminClient();
  const { data: qr } = await supabase
    .from("qr_codes")
    .select("id, destination_url, is_active")
    .eq("slug", slug)
    .maybeSingle();

  if (!qr || !qr.is_active) redirect("/");

  // Log scan with email using request headers available inside the server action
  try {
    const h = await headers();
    const ua = h.get("user-agent") ?? "";
    const r = new UAParser(ua).getResult();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      "";
    const ipHash = ip
      ? crypto
          .createHash("sha256")
          .update((process.env.SCAN_IP_SALT ?? "") + ip)
          .digest("hex")
          .slice(0, 32)
      : null;
    const cityRaw = h.get("x-vercel-ip-city");

    await supabase.from("qr_scans").insert({
      qr_code_id: qr.id,
      email,
      country: h.get("x-vercel-ip-country"),
      region: h.get("x-vercel-ip-country-region"),
      city: cityRaw ? decodeURIComponent(cityRaw) : null,
      device_type: r.device.type ?? "desktop",
      os: r.os.name ?? null,
      browser: r.browser.name ?? null,
      user_agent: ua || null,
      referrer: h.get("referer"),
      ip_hash: ipHash,
    });
  } catch {
    // never block the redirect on logging failures
  }

  redirect(buildTarget(qr.destination_url, slug));
}
