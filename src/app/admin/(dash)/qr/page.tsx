import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site";
import { createQrCode, toggleQrActive } from "@/lib/actions/qr";
import { QrDownload } from "@/components/admin/QrDownload";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  created_at: string;
  slug: string;
  name: string;
  destination_url: string;
  is_active: boolean;
  qr_scans: { count: number }[];
};

export default async function QrPage() {
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { data } = await supabase
    .from("qr_codes")
    .select("id, created_at, slug, name, destination_url, is_active, qr_scans(count)")
    .order("created_at", { ascending: false });
  const codes = (data ?? []) as unknown as Row[];

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
            const scans = c.qr_scans?.[0]?.count ?? 0;
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
                  <p className="mt-3 text-sage-text">
                    <span className="text-2xl font-bold">{scans}</span>{" "}
                    <span className="text-sage-text/60">scans</span>
                  </p>
                  <p className="mt-1 break-all text-sage-text/50">{target}</p>

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
