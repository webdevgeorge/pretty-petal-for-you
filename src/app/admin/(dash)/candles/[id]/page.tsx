import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CandleForm, type CandleFormValues } from "@/components/admin/CandleForm";

export const dynamic = "force-dynamic";

export default async function EditCandlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("candles")
    .select("id, name, description, tag, image_url, link_url, sort_order")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const candle = data as CandleFormValues;

  return (
    <div>
      <Link
        href="/admin/candles"
        className="font-medium text-sage-text/60 transition-colors hover:text-sage-text"
      >
        ← Back to candles
      </Link>

      <h1 className="t-heading mt-4 text-sage-text">Edit “{candle.name}”</h1>

      <div className="mt-6">
        <CandleForm candle={candle} />
      </div>
    </div>
  );
}
