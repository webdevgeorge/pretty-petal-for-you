import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// Only run on the admin area — the public marketing site never touches Supabase.
export const config = {
  matcher: ["/admin/:path*"],
};
