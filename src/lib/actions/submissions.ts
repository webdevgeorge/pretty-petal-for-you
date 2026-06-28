"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Admin-only (enforced by RLS). Updates a submission's status. */
export async function setSubmissionStatus(
  id: string,
  status: "new" | "read" | "archived",
) {
  const supabase = await createClient();
  await supabase.from("submissions").update({ status }).eq("id", id);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}
