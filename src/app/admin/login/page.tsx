"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="t-body flex min-h-screen items-center justify-center bg-cream-bg px-5">
      <div className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-sm ring-1 ring-line">
        <h1 className="t-heading text-center text-sage-text">Pretty Petal admin</h1>
        <p className="mt-2 text-center text-sage-text/70">Sign in to continue</p>

        {!configured ? (
          <p className="mt-6 rounded-2xl bg-blush-soft/60 p-4 text-center text-sage-text/80">
            Supabase isn&apos;t configured yet. Add your keys (see SETUP.md) and redeploy.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="font-medium text-sage-text/80">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-line bg-cream-bg/60 px-4 py-2.5 text-sage-text outline-none focus:border-blush-deep"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium text-sage-text/80">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-line bg-cream-bg/60 px-4 py-2.5 text-sage-text outline-none focus:border-blush-deep"
              />
            </label>

            {error && <p className="text-blush-deep">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-blush px-6 py-3 font-semibold text-sage-text transition-colors hover:bg-blush-deep hover:text-white disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
