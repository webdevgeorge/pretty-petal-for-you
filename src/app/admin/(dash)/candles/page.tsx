import { createClient } from "@/lib/supabase/server";
import { CandleForm } from "@/components/admin/CandleForm";
import { deleteCandle, toggleCandlePublished } from "@/lib/actions/candles";

export const dynamic = "force-dynamic";

type Candle = {
  id: string;
  name: string;
  description: string | null;
  tag: string | null;
  image_url: string;
  is_published: boolean;
  sort_order: number;
};

export default async function CandlesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("candles")
    .select("id, name, description, tag, image_url, is_published, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const candles = (data ?? []) as Candle[];
  const published = candles.filter((c) => c.is_published).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="t-heading text-sage-text">Candles</h1>
          <p className="mt-1 text-sage-text/60">
            {candles.length} candles · {published} published on the website
          </p>
        </div>
      </div>

      <div className="mt-6">
        <CandleForm />
      </div>

      {candles.length === 0 ? (
        <p className="mt-8 rounded-3xl bg-card p-8 text-center text-sage-text/60 ring-1 ring-line">
          No candles added yet — use the form above to add your first one.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {candles.map((c) => (
            <li key={c.id} className="overflow-hidden rounded-3xl bg-card ring-1 ring-line">
              {/* image */}
              <div className="relative aspect-[4/3] bg-cream-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image_url}
                  alt={c.name}
                  className="h-full w-full object-cover"
                />
                {!c.is_published && (
                  <span className="absolute left-3 top-3 rounded-full bg-sage-text/70 px-3 py-0.5 text-xs font-semibold text-white">
                    hidden
                  </span>
                )}
                {c.tag && (
                  <span className="absolute right-3 top-3 rounded-full bg-cream-bg/90 px-3 py-0.5 text-xs font-semibold text-sage-text backdrop-blur-sm">
                    {c.tag}
                  </span>
                )}
              </div>

              {/* info */}
              <div className="p-4">
                <p className="font-semibold text-sage-text">{c.name}</p>
                {c.description && (
                  <p className="mt-0.5 text-sm text-sage-text/60">{c.description}</p>
                )}
                <p className="mt-1 text-xs text-sage-text/40">sort: {c.sort_order}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <form action={toggleCandlePublished.bind(null, c.id, !c.is_published)}>
                    <button
                      className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                        c.is_published
                          ? "border-blush-deep bg-blush text-sage-text hover:bg-blush-deep hover:text-white"
                          : "border-line hover:bg-cream-soft"
                      }`}
                    >
                      {c.is_published ? "Published" : "Hidden"}
                    </button>
                  </form>
                  <form
                    action={deleteCandle.bind(null, c.id)}
                    onSubmit={(e) => {
                      if (!confirm(`Delete "${c.name}"?`)) e.preventDefault();
                    }}
                  >
                    <button className="rounded-full border border-red-200 px-3 py-1 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
