import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Stat } from "@/components/admin/Stat";
import type { Submission } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function OverviewPage() {
  const supabase = await createClient();

  const [newSubs, totalSubs, scanCount, codeCount, recent] = await Promise.all([
    supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase.from("submissions").select("*", { count: "exact", head: true }),
    supabase.from("qr_scans").select("*", { count: "exact", head: true }),
    supabase.from("qr_codes").select("*", { count: "exact", head: true }),
    supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const recentSubs = (recent.data ?? []) as Submission[];

  return (
    <div>
      <h1 className="t-heading text-sage-text">Overview</h1>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="New submissions" value={newSubs.count ?? 0} href="/admin/submissions" />
        <Stat label="Total submissions" value={totalSubs.count ?? 0} href="/admin/submissions" />
        <Stat label="QR scans" value={scanCount.count ?? 0} href="/admin/analytics" />
        <Stat label="QR codes" value={codeCount.count ?? 0} href="/admin/qr" />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-semibold text-sage-text">Latest submissions</h2>
        <Link href="/admin/submissions" className="text-blush-deep hover:underline">
          View all →
        </Link>
      </div>

      {recentSubs.length === 0 ? (
        <p className="mt-3 rounded-3xl bg-card p-8 text-center text-sage-text/60 ring-1 ring-line">
          No submissions yet.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-line overflow-hidden rounded-3xl bg-card ring-1 ring-line">
          {recentSubs.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3"
            >
              <span className="font-medium text-sage-text">{s.name}</span>
              <span className="text-sage-text/60">{s.email}</span>
              <span className="text-sage-text/55">{s.phone}</span>
              <span className="text-sage-text/50">{fmt(s.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
