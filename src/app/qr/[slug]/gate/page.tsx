import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { captureQrEmail } from "@/lib/actions/qr-gate";

export const dynamic = "force-dynamic";

export default async function QrGatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: qr } = await supabase
    .from("qr_codes")
    .select("name, is_active, require_email")
    .eq("slug", slug)
    .maybeSingle();

  if (!qr || !qr.is_active || !qr.require_email) notFound();

  const action = captureQrEmail.bind(null, slug);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream-bg px-4 py-16">
      <div className="w-full max-w-sm text-center">
        {/* Logo / brand */}
        <p className="font-serif text-2xl tracking-wide text-sage-text">Pretty Petal</p>
        <p className="mt-1 text-sm text-sage-text/50">handmade candles</p>

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-line">
          <h1 className="text-xl font-semibold text-sage-text">
            Stay in the loop 🌸
          </h1>
          <p className="mt-2 text-sm text-sage-text/60">
            Drop your email to get exclusive updates, new collections, and
            special offers — then we&apos;ll take you right to the page.
          </p>

          <form action={action} className="mt-6 flex flex-col gap-3">
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="w-full rounded-xl border border-line bg-cream-bg/60 px-4 py-3 text-center outline-none focus:border-blush-deep"
            />
            <button
              type="submit"
              className="rounded-full bg-blush px-6 py-3 font-semibold text-sage-text transition-colors hover:bg-blush-deep hover:text-white"
            >
              Continue to site →
            </button>
          </form>
        </div>

        {/* skip link — still logs scan but without email */}
        <form action={action} className="mt-4">
          <input type="hidden" name="email" value="" />
          <button
            type="submit"
            className="text-sm text-sage-text/40 underline-offset-2 hover:text-sage-text/60 hover:underline"
          >
            Skip for now
          </button>
        </form>
      </div>
    </main>
  );
}
