import { createClient } from "@/lib/supabase/server";
import { tally } from "@/lib/tally";
import { Stat } from "@/components/admin/Stat";
import { Breakdown } from "@/components/admin/Breakdown";

export const dynamic = "force-dynamic";

const lookerUrl = process.env.NEXT_PUBLIC_GA_LOOKER_EMBED_URL;
const gaPropertyId = process.env.GA_PROPERTY_ID;

type ScanRow = {
  created_at: string;
  country: string | null;
  device_type: string | null;
  qr_code_id: string;
};

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const [{ data: scanData }, { data: codeData }] = await Promise.all([
    supabase
      .from("qr_scans")
      .select("created_at, country, device_type, qr_code_id")
      .order("created_at", { ascending: false })
      .limit(5000),
    supabase.from("qr_codes").select("id, name"),
  ]);

  const scans = (scanData ?? []) as ScanRow[];
  const codeName = new Map(
    ((codeData ?? []) as { id: string; name: string }[]).map((c) => [c.id, c.name]),
  );

  const since = (days: number) => {
    const cutoff = Date.now() - days * 86_400_000;
    return scans.filter((s) => new Date(s.created_at).getTime() >= cutoff).length;
  };

  const byCountry = tally(scans.map((s) => s.country || "Unknown"));
  const byDevice = tally(scans.map((s) => s.device_type || "Unknown"));
  const byCode = tally(scans.map((s) => codeName.get(s.qr_code_id) || "Unknown"));

  return (
    <div>
      <h1 className="t-heading text-sage-text">Analytics</h1>

      <h2 className="mt-6 font-semibold text-sage-text/70">QR code scans</h2>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Total scans" value={scans.length} />
        <Stat label="Last 7 days" value={since(7)} />
        <Stat label="Last 30 days" value={since(30)} />
        <Stat label="QR codes" value={codeName.size} href="/admin/qr" />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <Breakdown title="Scans by country" items={byCountry} />
        <Breakdown title="Scans by device" items={byDevice} />
        <Breakdown title="Top QR codes" items={byCode} />
      </div>

      <h2 className="mt-10 font-semibold text-sage-text/70">Website analytics (Google Analytics)</h2>
      {lookerUrl ? (
        <iframe
          src={lookerUrl}
          title="Google Analytics"
          className="mt-3 aspect-[16/10] w-full rounded-3xl ring-1 ring-line"
        />
      ) : (
        <div className="mt-3 rounded-3xl bg-card p-6 text-sage-text/70 ring-1 ring-line">
          <p>
            Live Google Analytics isn&apos;t embedded yet. The site already sends data to
            GA{gaPropertyId ? ` (property ${gaPropertyId})` : ""} — including QR scans
            tagged as <code className="rounded bg-sage-text/10 px-1.5">source = qr</code>.
          </p>
          <p className="mt-2">
            To show it here, create a <strong>Looker Studio</strong> report from your GA4
            property, copy its <em>Embed report</em> URL into{" "}
            <code className="rounded bg-sage-text/10 px-1.5">NEXT_PUBLIC_GA_LOOKER_EMBED_URL</code>,
            and redeploy. Until then, view it directly at{" "}
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blush-deep hover:underline"
            >
              analytics.google.com
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
