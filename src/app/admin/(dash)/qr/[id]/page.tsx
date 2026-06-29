import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site";
import { tally } from "@/lib/tally";
import { QrDownload } from "@/components/admin/QrDownload";
import { Breakdown } from "@/components/admin/Breakdown";
import { DeleteQrButton } from "@/components/admin/DeleteQrButton";
import type { QrCode, QrScan } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildDailyTrend(scans: QrScan[], days = 14) {
  const counts: Record<string, number> = {};
  const now = Date.now();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * 86_400_000).toISOString().slice(0, 10);
    counts[d] = 0;
  }
  for (const s of scans) {
    const d = s.created_at.slice(0, 10);
    if (d in counts) counts[d]++;
  }
  return Object.entries(counts).map(([date, count]) => ({ date, count }));
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
  const byCity = tally(scans.map((s) => s.city || "Unknown"));

  const firstScan = scans.length ? scans[scans.length - 1].created_at : null;
  const lastScan = scans.length ? scans[0].created_at : null;
  const since7 = scans.filter(
    (s) => new Date(s.created_at).getTime() >= Date.now() - 7 * 86_400_000,
  ).length;

  const daysSinceFirst = firstScan
    ? Math.max(1, Math.ceil((Date.now() - new Date(firstScan).getTime()) / 86_400_000))
    : 1;
  const avgPerDay = (scans.length / daysSinceFirst).toFixed(1);

  const trend = buildDailyTrend(scans, 14);
  const trendMax = Math.max(1, ...trend.map((t) => t.count));

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
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="t-heading text-sage-text">{qr.name}</h1>
              <p className="mt-1 text-sage-text/60">→ {qr.destination_url}</p>
              <p className="mt-1 break-all text-xs text-sage-text/40">{target}</p>
            </div>
            <DeleteQrButton id={qr.id} name={qr.name} />
          </div>

          {/* summary stats */}
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Total scans", value: scans.length },
              { label: "Last 7 days", value: since7 },
              { label: "Avg / day", value: avgPerDay },
              { label: "Unique countries", value: byCountry.length },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-card p-4 ring-1 ring-line">
                <p className="text-xs text-sage-text/50">{s.label}</p>
                <p className="mt-1 text-2xl font-bold text-sage-text">{s.value}</p>
              </div>
            ))}
          </div>

          {firstScan && (
            <p className="mt-3 text-xs text-sage-text/50">
              First scan: {fmtDate(firstScan)}
              {lastScan && lastScan !== firstScan && (
                <> &nbsp;·&nbsp; Last scan: {fmtDate(lastScan)}</>
              )}
            </p>
          )}
        </div>
      </div>

      {/* daily trend */}
      <div className="mt-8 rounded-3xl bg-card p-5 ring-1 ring-line">
        <h2 className="font-semibold text-sage-text">Scans — last 14 days</h2>
        <div className="mt-4 flex h-24 items-end gap-1">
          {trend.map((t) => (
            <div key={t.date} className="group relative flex flex-1 flex-col items-center gap-1">
              <span className="absolute -top-5 hidden rounded bg-sage-text px-1.5 py-0.5 text-[10px] text-white group-hover:block">
                {t.count}
              </span>
              <div
                className="w-full rounded-t bg-blush transition-all"
                style={{ height: `${(t.count / trendMax) * 100}%`, minHeight: t.count ? "4px" : "0" }}
              />
              <span className="text-[9px] text-sage-text/40 rotate-45 origin-left whitespace-nowrap">
                {fmtShort(t.date)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* breakdowns */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Breakdown title="By country" items={byCountry} />
        <Breakdown title="By city" items={byCity} />
        <Breakdown title="By device" items={byDevice} />
        <Breakdown title="By browser" items={byBrowser} />
      </div>

      {/* recent scans log */}
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
              <span className="text-sage-text/70">{fmtDate(s.created_at)}</span>
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
