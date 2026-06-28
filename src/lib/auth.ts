import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import type { User } from "@supabase/supabase-js";

/**
 * Returns the current user only if they are signed in AND listed in the
 * `admins` table (verified via the is_admin() RPC, which RLS relies on).
 * Returns null otherwise (logged out, not an admin, or Supabase not set up).
 */
export async function getAdminUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: isAdmin } = await supabase.rpc("is_admin");
  return isAdmin ? user : null;
}
