import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { UAParser } from "ua-parser-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { isServiceConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const home = new URL("/", req.url);

  if (!isServiceConfigured()) {
    return NextResponse.redirect(home, 302);
  }

  const supabase = createAdminClient();
  const { data: qr } = await supabase
    .from("qr_codes")
    .select("id, destination_url, is_active")
    .eq("slug", slug)
    .maybeSingle();

  if (!qr || !qr.is_active) {
    return NextResponse.redirect(home, 302);
  }

  // Best-effort scan logging — never block the redirect on it.
  try {
    const ua = req.headers.get("user-agent") ?? "";
    const r = new UAParser(ua).getResult();
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "";
    const ipHash = ip
      ? crypto
          .createHash("sha256")
          .update((process.env.SCAN_IP_SALT ?? "") + ip)
          .digest("hex")
          .slice(0, 32)
      : null;
    const cityRaw = req.headers.get("x-vercel-ip-city");

    await supabase.from("qr_scans").insert({
      qr_code_id: qr.id,
      country: req.headers.get("x-vercel-ip-country"),
      region: req.headers.get("x-vercel-ip-country-region"),
      city: cityRaw ? decodeURIComponent(cityRaw) : null,
      device_type: r.device.type ?? "desktop",
      os: r.os.name ?? null,
      browser: r.browser.name ?? null,
      user_agent: ua || null,
      referrer: req.headers.get("referer"),
      ip_hash: ipHash,
    });
  } catch {
    // ignore logging failures
  }

  // Append UTM params so Google Analytics attributes the visit to this QR.
  let target = qr.destination_url;
  try {
    const dest = new URL(qr.destination_url);
    if (!dest.searchParams.has("utm_source")) dest.searchParams.set("utm_source", "qr");
    if (!dest.searchParams.has("utm_medium")) dest.searchParams.set("utm_medium", "qr");
    if (!dest.searchParams.has("utm_campaign")) dest.searchParams.set("utm_campaign", slug);
    target = dest.toString();
  } catch {
    // destination wasn't a parseable URL — redirect as-is
  }

  return NextResponse.redirect(target, 302);
}
