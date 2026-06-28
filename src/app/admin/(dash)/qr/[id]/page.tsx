import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site";
import { tally } from "@/lib/tally";
import { QrDownload } from "@/components/admin/QrDownload";
import { Breakdown } from "@/components/admin/Breakdown";
import type { QrCode, QrScan } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function QrDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const { data: code } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!code) notFound();
  const qr = code as QrCode;

  const { data: scanData } = await supabase
    .from("qr_scans")
    .select("*")
    .eq("qr_code_id", id)
    .order("created_at", { ascending: false });
  const scans = (scanData ?? []) as QrScan[];

  const target = `${siteUrl}/qr/${qr.slug}`;
  const byCountry = tally(scans.map((s) => s.country || "Unknown"));
  const byDevice = tally(scans.map((s) => s.device_type || "Unknown"));
  const byBrowser = tally(scans.map((s) => s.browser || "Unknown"));

  return (
    <div>
      <Link
        href="/admin/qr"
        className="font-medium text-sage-text/60 transition-colors hover:text-sage-text"
      >
        ← Back to QR codes
      </Link>

      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-start">
        <QrDownload url={target} filename={qr.slug} />
        <div className="min-w-0">
          <h1 className="t-heading text-sage-text">{qr.name}</h1>
          <p className="mt-1 text-sage-text/60">→ {qr.destination_url}</p>
          <p className="mt-1 break-all text-sage-text/50">{target}</p>
          <p className="mt-4 text-sage-text">
            <span className="text-3xl font-bold">{scans.length}</span>{" "}
            <span className="text-sage-text/60">total scans</span>
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <Breakdown title="By country" items={byCountry} />
        <Breakdown title="By device" items={byDevice} />
        <Breakdown title="By browser" items={byBrowser} />
      </div>

      <h2 className="t-heading mt-10 text-sage-text">Recent scans</h2>
      {scans.length === 0 ? (
        <p className="mt-4 rounded-3xl bg-card p-8 text-center text-sage-text/60 ring-1 ring-line">
          No scans yet. Download the code, scan it, and it&apos;ll appear here.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-3xl bg-card ring-1 ring-line">
          {scans.slice(0, 50).map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3"
            >
              <span className="text-sage-text/70">{fmt(s.created_at)}</span>
              <span className="text-sage-text/70">
                {[s.city, s.country].filter(Boolean).join(", ") || "—"}
              </span>
              <span className="text-sage-text/55">
                {[s.device_type, s.os, s.browser].filter(Boolean).join(" · ") || "—"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
