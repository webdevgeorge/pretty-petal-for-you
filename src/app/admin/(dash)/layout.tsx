import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "@/lib/actions/auth";
import { AdminNav } from "@/components/admin/AdminNav";

function SetupNotice() {
  return (
    <main className="t-body flex min-h-screen items-center justify-center bg-cream-bg px-5 text-center">
      <div className="max-w-md rounded-3xl bg-card p-8 ring-1 ring-line">
        <h1 className="t-heading text-sage-text">Admin not set up yet</h1>
        <p className="mt-3 text-sage-text/75">
          Connect Supabase to enable the admin panel — see{" "}
          <code className="rounded bg-sage-text/10 px-1.5 py-0.5">SETUP.md</code> for the
          steps.
        </p>
      </div>
    </main>
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="t-body min-h-screen bg-cream-bg text-sage-text">
      <header className="sticky top-0 z-30 border-b border-line bg-cream-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="brand">Pretty Petal</span>
            <span className="rounded-full bg-sage-text/10 px-2.5 py-0.5 font-medium text-sage-text/70">
              admin
            </span>
          </div>
          <AdminNav />
          <form action={signOut} className="flex items-center gap-3">
            <span className="hidden text-sage-text/55 sm:inline">{user.email}</span>
            <button
              type="submit"
              className="rounded-full border border-line px-4 py-1.5 font-medium transition-colors hover:bg-cream-soft"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
