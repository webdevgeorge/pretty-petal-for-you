import { createClient } from "@/lib/supabase/server";
import { tally } from "@/lib/tally";
import { getGAOverview } from "@/lib/ga-data";
import { Stat } from "@/components/admin/Stat";
import { Breakdown } from "@/components/admin/Breakdown";

export const dynamic = "force-dynamic";

type ScanRow = {
  created_at: string;
  country: string | null;
  device_type: string | null;
  qr_code_id: string;
};

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const [{ data: scanData }, { data: codeData }, ga] = await Promise.all([
    supabase
      .from("qr_scans")
      .select("created_at, country, device_type, qr_code_id")
      .order("created_at", { ascending: false })
      .limit(5000),
    supabase.from("qr_codes").select("id, name"),
    getGAOverview(30).catch(() => null),
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

      {/* ── Google Analytics ───────────────────────────────────────── */}
      <h2 className="mt-6 font-semibold text-sage-text/70">
        Website — last 30 days
      </h2>

      {ga ? (
        <>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Users" value={fmt(ga.users)} />
            <Stat label="Page views" value={fmt(ga.pageViews)} />
            <Stat label="Sessions" value={fmt(ga.sessions)} />
            <Stat label="Bounce rate" value={`${ga.bounceRate}%`} />
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <Breakdown title="Top pages" items={ga.topPages} />
            <Breakdown title="Visitors by country" items={ga.topCountries} />
            <Breakdown title="Traffic sources" items={ga.topSources} />
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Breakdown title="Devices" items={ga.topDevices} />
          </div>
        </>
      ) : (
        <div className="mt-3 rounded-3xl bg-card p-6 text-sage-text/70 ring-1 ring-line">
          <p className="font-medium text-sage-text">Google Analytics not connected yet.</p>
          <p className="mt-2 text-sm">
            Add these two environment variables in Vercel and redeploy:
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <code className="rounded bg-sage-text/10 px-1.5">GA_PROPERTY_ID</code>
              {" — "}numeric property ID from GA4 Admin → Property Settings
            </li>
            <li>
              <code className="rounded bg-sage-text/10 px-1.5">GOOGLE_APPLICATION_CREDENTIALS_JSON</code>
              {" — "}the full contents of your service account JSON key file
            </li>
          </ul>
          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-blush-deep hover:underline"
          >
            Open Google Analytics →
          </a>
        </div>
      )}

      {/* ── QR code scans ──────────────────────────────────────────── */}
      <h2 className="mt-10 font-semibold text-sage-text/70">QR code scans</h2>
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
    </div>
  );
}
