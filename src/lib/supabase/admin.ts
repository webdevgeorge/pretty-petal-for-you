import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses Row Level Security. Used only for trusted
 * server-side writes (public form submissions, QR scan logging) and server
 * reads in the public redirect route. NEVER import this into client code.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
