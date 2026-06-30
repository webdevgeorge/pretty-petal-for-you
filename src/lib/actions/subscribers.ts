"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/mailer";
import { welcomeEmail, newCandleEmail } from "@/lib/email/templates";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.prettypetal.shop").replace(/\/$/, "");

function unsubUrl(token: string) {
  return `${SITE}/unsubscribe/${token}`;
}

/** Insert or fetch a subscriber. Returns the row. */
async function upsertSubscriber(email: string, name: string | null, source: string) {
  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from("subscribers")
    .select("id, welcomed_at, unsubscribe_token")
    .eq("email", email)
    .maybeSingle();

  if (existing) return existing;

  const { data: created } = await supabase
    .from("subscribers")
    .insert({ email, name: name || null, source })
    .select("id, welcomed_at, unsubscribe_token")
    .single();

  return created;
}

/** Send the welcome email once per subscriber (guarded by welcomed_at). */
export async function welcomeSubscriber(email: string, name: string | null, source: string) {
  try {
    const sub = await upsertSubscriber(email, name, source);
    if (!sub || sub.welcomed_at) return; // already welcomed or insert failed

    const { subject, html } = welcomeEmail({ name, unsubscribeUrl: unsubUrl(sub.unsubscribe_token) });
    const result = await sendEmail({ to: email, subject, html });

    if (result.ok) {
      await createAdminClient()
        .from("subscribers")
        .update({ welcomed_at: new Date().toISOString() })
        .eq("id", sub.id);
    }
  } catch {
    // best-effort — never let this block a form submission or scan
  }
}

const OWNER_EMAIL = "prpetal777@gmail.com";
const SAGE = "#474d39";
const MUTED = "#8a8f7d";
const CREAM = "#f7f1ea";
const LINE = "#ece4d8";

/** Send a quick lead-alert to the owner's Gmail inbox. Best-effort, never throws. */
export async function notifyOwnerOfLead(details: {
  source: "contact_form" | "qr_gate";
  email: string;
  name?: string | null;
  phone?: string | null;
  message?: string | null;
  qrSlug?: string | null;
}) {
  try {
    const rows = [
      details.name ? `<tr><td style="color:${MUTED};padding:4px 12px 4px 0;white-space:nowrap;">Name</td><td style="color:${SAGE};">${details.name}</td></tr>` : "",
      `<tr><td style="color:${MUTED};padding:4px 12px 4px 0;white-space:nowrap;">Email</td><td style="color:${SAGE};"><a href="mailto:${details.email}" style="color:${SAGE};">${details.email}</a></td></tr>`,
      details.phone ? `<tr><td style="color:${MUTED};padding:4px 12px 4px 0;white-space:nowrap;">Phone</td><td style="color:${SAGE};">${details.phone}</td></tr>` : "",
      details.message ? `<tr><td style="color:${MUTED};padding:4px 12px 4px 0;white-space:nowrap;vertical-align:top;">Message</td><td style="color:${SAGE};">${details.message}</td></tr>` : "",
      details.qrSlug ? `<tr><td style="color:${MUTED};padding:4px 12px 4px 0;white-space:nowrap;">QR code</td><td style="color:${SAGE};">${details.qrSlug}</td></tr>` : "",
    ].filter(Boolean).join("");

    const label = details.source === "contact_form" ? "Contact form" : "QR code scan";
    const html = `<!doctype html><html><body style="margin:0;padding:0;background:${CREAM};font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:28px 12px;">
        <tr><td align="center">
          <table role="presentation" width="540" cellpadding="0" cellspacing="0" style="max-width:540px;width:100%;background:#fff;border:1px solid ${LINE};border-radius:20px;padding:28px 28px 22px;">
            <tr><td>
              <p style="margin:0 0 6px;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};">${label}</p>
              <h2 style="margin:0 0 20px;font-size:20px;color:${SAGE};">New lead 🌸</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.8;">
                ${rows}
              </table>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body></html>`;

    await sendEmail({
      to: OWNER_EMAIL,
      subject: details.source === "contact_form"
        ? `New enquiry from ${details.name || details.email} 🌸`
        : `New QR lead: ${details.email} 🌸`,
      html,
    });
  } catch {
    // never block the submission
  }
}

type CandleForBroadcast = {
  name: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
};

/** Send a new-candle announcement to all active (non-unsubscribed) subscribers. */
export async function broadcastNewCandle(candle: CandleForBroadcast) {
  const supabase = createAdminClient();
  const { data: subs } = await supabase
    .from("subscribers")
    .select("email, unsubscribe_token")
    .is("unsubscribed_at", null);

  if (!subs?.length) return;

  const BATCH = 10;
  for (let i = 0; i < subs.length; i += BATCH) {
    const batch = subs.slice(i, i + BATCH);
    await Promise.allSettled(
      batch.map(({ email, unsubscribe_token }) => {
        const { subject, html } = newCandleEmail({ candle, unsubscribeUrl: unsubUrl(unsubscribe_token) });
        return sendEmail({ to: email, subject, html });
      }),
    );
  }
}
