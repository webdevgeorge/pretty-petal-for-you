import "server-only";
import { Resend } from "resend";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

let cached: Resend | null = null;

function getResend(): Resend {
  if (!cached) cached = new Resend(process.env.RESEND_API_KEY);
  return cached;
}

export type SendResult = { ok: boolean; skipped?: boolean };

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendResult> {
  if (!isEmailConfigured()) return { ok: false, skipped: true };
  const from = "Liza · Pretty Petal <Liza@prettypetal.shop>";
  await getResend().emails.send({ from, to, subject, html, replyTo: "prpetal777@gmail.com" });
  return { ok: true };
}
