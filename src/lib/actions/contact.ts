"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { isServiceConfigured } from "@/lib/supabase/config";
import { welcomeSubscriber, notifyOwnerOfLead } from "@/lib/actions/subscribers";

export type ContactError = "fields" | "email" | "server" | "config";
export type ContactResult = { ok: boolean; error?: ContactError };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function submitContact(
  _prev: ContactResult | null,
  formData: FormData,
): Promise<ContactResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  // Honeypot — real users never fill this hidden field.
  const trap = String(formData.get("company") ?? "");

  if (trap) return { ok: true }; // silently drop bots
  if (!name || !email || !phone) return { ok: false, error: "fields" };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "email" };

  if (!isServiceConfigured()) return { ok: false, error: "config" };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("submissions").insert({
      name,
      email,
      phone,
      note: note || null,
    });
    if (error) return { ok: false, error: "server" };
    welcomeSubscriber(email, name, "contact_form").catch(() => {});
    notifyOwnerOfLead({ source: "contact_form", email, name, phone, message: note || null }).catch(() => {});
    return { ok: true };
  } catch {
    return { ok: false, error: "server" };
  }
}
