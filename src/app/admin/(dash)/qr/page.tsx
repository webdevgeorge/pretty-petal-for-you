import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site";
import { createQrCode, toggleQrActive, toggleQrEmailGate } from "@/lib/actions/qr";
import { QrDownload } from "@/components/admin/QrDownload";
import { DeleteQrButton } from "@/components/admin/DeleteQrButton";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  created_at: string;
  slug: string;
  name: string;
  destination_url: string;
  is_active: boolean;
  require_email: boolean;
  qr_scans: { count: number }[];
};

type ScanSummary = {
  qr_code_id: string;
  created_at: string;
};

export default async function QrPage() {
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const cutoff7 = new Date(Date.now() - 7 * 86_400_000).toISOString();

  const [{ data }, { data: recentScans }] = await Promise.all([
    supabase
      .from("qr_codes")
      .select("id, created_at, slug, name, destination_url, is_active, require_email, qr_scans(count)")
      .order("created_at", { ascending: false }),
    supabase
      .from("qr_scans")
      .select("qr_code_id, created_at")
      .gte("created_at", cutoff7),
  ]);

  const codes = (data ?? []) as unknown as Row[];
  const recent = (recentScans ?? []) as ScanSummary[];

  const scans7 = new Map<string, number>();
  const lastScan = new Map<string, string>();
  for (const s of recent) {
    scans7.set(s.qr_code_id, (scans7.get(s.qr_code_id) ?? 0) + 1);
  }
  // last scan from all-time scans — fetch per-code latest
  const { data: latestScans } = await supabase
    .from("qr_scans")
    .select("qr_code_id, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  for (const s of (latestScans ?? []) as ScanSummary[]) {
    if (!lastScan.has(s.qr_code_id)) lastScan.set(s.qr_code_id, s.created_at);
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div>
      <h1 className="t-heading text-sage-text">QR codes</h1>
      <p className="mt-1 text-sage-text/60">
        Create a code, download it, and every scan is tracked + sent to Analytics.
      </p>

      {/* create */}
      <form
        action={createQrCode}
        className="mt-6 flex flex-col gap-3 rounded-3xl bg-card p-5 ring-1 ring-line sm:flex-row sm:items-end"
      >
        <label className="flex flex-1 flex-col gap-1">
          <span className="font-medium text-sage-text/70">Name</span>
          <input
            name="name"
            required
            placeholder="e.g. Business card"
            className="rounded-xl border border-line bg-cream-bg/60 px-4 py-2.5 outline-none focus:border-blush-deep"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1">
          <span className="font-medium text-sage-text/70">Destination URL</span>
          <input
            name="destination"
            required
            placeholder="prettypetal.shop/collection"
            className="rounded-xl border border-line bg-cream-bg/60 px-4 py-2.5 outline-none focus:border-blush-deep"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-blush px-6 py-2.5 font-semibold text-sage-text transition-colors hover:bg-blush-deep hover:text-white"
        >
          Create
        </button>
      </form>

      {/* list */}
      {codes.length === 0 ? (
        <p className="mt-8 rounded-3xl bg-card p-8 text-center text-sage-text/60 ring-1 ring-line">
          No QR codes yet — create your first one above.
        </p>
      ) : (
        <ul className="mt-8 grid gap-5 lg:grid-cols-2">
          {codes.map((c) => {
            const target = `${siteUrl}/qr/${c.slug}`;
            const totalScans = c.qr_scans?.[0]?.count ?? 0;
            const weekScans = scans7.get(c.id) ?? 0;
            const last = lastScan.get(c.id);
            return (
              <li
                key={c.id}
                className="flex flex-col gap-5 rounded-3xl bg-card p-5 ring-1 ring-line sm:flex-row"
              >
                <QrDownload url={target} filename={c.slug} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sage-text">{c.name}</span>
                    <span
                      className={`rounded-full px-3 py-0.5 text-[0.95em] font-semibold ${
                        c.is_active
                          ? "bg-sage-text/15 text-sage-text"
                          : "bg-sage-text/10 text-sage-text/50"
                      }`}
                    >
                      {c.is_active ? "active" : "paused"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sage-text/60" title={c.destination_url}>
                    → {c.destination_url}
                  </p>

                  {/* scan stats */}
                  <div className="mt-3 flex gap-5">
                    <div>
                      <p className="text-2xl font-bold text-sage-text">{totalScans}</p>
                      <p className="text-xs text-sage-text/50">total scans</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-sage-text">{weekScans}</p>
                      <p className="text-xs text-sage-text/50">last 7 days</p>
                    </div>
                  </div>

                  {last && (
                    <p className="mt-1 text-xs text-sage-text/50">
                      Last scan: {fmtDate(last)}
                    </p>
                  )}

                  <p className="mt-2 break-all text-xs text-sage-text/40">{target}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/admin/qr/${c.id}`}
                      className="rounded-full bg-sage-text/10 px-3 py-1 font-medium text-sage-text transition-colors hover:bg-sage-text/15"
                    >
                      View analytics
                    </Link>
                    <form action={toggleQrActive.bind(null, c.id, !c.is_active)}>
                      <button className="rounded-full border border-line px-3 py-1 font-medium transition-colors hover:bg-cream-soft">
                        {c.is_active ? "Pause" : "Activate"}
                      </button>
                    </form>
                    <form action={toggleQrEmailGate.bind(null, c.id, !c.require_email)}>
                      <button
                        className={`rounded-full border px-3 py-1 font-medium transition-colors ${
                          c.require_email
                            ? "border-blush-deep bg-blush text-sage-text hover:bg-blush-deep hover:text-white"
                            : "border-line hover:bg-cream-soft"
                        }`}
                      >
                        {c.require_email ? "Email gate: ON" : "Email gate: OFF"}
                      </button>
                    </form>
                    <DeleteQrButton id={c.id} name={c.name} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
