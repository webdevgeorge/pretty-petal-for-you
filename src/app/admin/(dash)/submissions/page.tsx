import { createClient } from "@/lib/supabase/server";
import type { Submission } from "@/lib/supabase/types";
import { setSubmissionStatus } from "@/lib/actions/submissions";

export const dynamic = "force-dynamic";

const statusStyle: Record<Submission["status"], string> = {
  new: "bg-blush text-white",
  read: "bg-sage-text/15 text-sage-text",
  archived: "bg-sage-text/10 text-sage-text/60",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function SubmissionsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });
  const subs = (data ?? []) as Submission[];
  const newCount = subs.filter((s) => s.status === "new").length;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="t-heading text-sage-text">Submissions</h1>
        <p className="text-sage-text/60">
          {subs.length} total · {newCount} new
        </p>
      </div>

      {subs.length === 0 ? (
        <p className="mt-10 rounded-3xl bg-card p-8 text-center text-sage-text/60 ring-1 ring-line">
          No submissions yet. They&apos;ll show up here the moment someone uses the form.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {subs.map((s) => (
            <li
              key={s.id}
              className="flex flex-col rounded-3xl bg-card p-5 ring-1 ring-line"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sage-text">{s.name}</span>
                <span
                  className={`rounded-full px-3 py-0.5 text-[0.95em] font-semibold ${statusStyle[s.status]}`}
                >
                  {s.status}
                </span>
              </div>
              <p className="mt-1 text-sage-text/55">{fmt(s.created_at)}</p>

              <dl className="mt-3 space-y-1">
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-sage-text/50">Email</dt>
                  <dd>
                    <a href={`mailto:${s.email}`} className="text-blush-deep hover:underline">
                      {s.email}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-sage-text/50">Phone</dt>
                  <dd>
                    <a href={`tel:${s.phone}`} className="text-blush-deep hover:underline">
                      {s.phone}
                    </a>
                  </dd>
                </div>
                {s.note && (
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 text-sage-text/50">Note</dt>
                    <dd className="text-sage-text/80">{s.note}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-4 flex flex-wrap gap-2">
                {s.status !== "read" && (
                  <form action={setSubmissionStatus.bind(null, s.id, "read")}>
                    <button className="rounded-full border border-line px-3 py-1 font-medium transition-colors hover:bg-cream-soft">
                      Mark read
                    </button>
                  </form>
                )}
                {s.status !== "new" && (
                  <form action={setSubmissionStatus.bind(null, s.id, "new")}>
                    <button className="rounded-full border border-line px-3 py-1 font-medium transition-colors hover:bg-cream-soft">
                      Mark new
                    </button>
                  </form>
                )}
                {s.status !== "archived" && (
                  <form action={setSubmissionStatus.bind(null, s.id, "archived")}>
                    <button className="rounded-full border border-line px-3 py-1 font-medium text-sage-text/60 transition-colors hover:bg-cream-soft">
                      Archive
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
