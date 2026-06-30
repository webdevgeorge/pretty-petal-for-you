const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.prettypetal.shop").replace(/\/$/, "");
const INSTAGRAM = "https://www.instagram.com/prettypetalforyou";
const MAKER_PHOTO = `${SITE}/maker.png`;

const CREAM = "#f7f1ea";
const CARD = "#ffffff";
const SAGE = "#474d39";
const MUTED = "#8a8f7d";
const BLUSH = "#e6a4a4";
const BLUSH_DEEP = "#c47e7e";
const LINE = "#ece4d8";

export type EmailDoc = { subject: string; html: string };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Shared shell: cream backdrop, centered white card, footer with unsubscribe. */
function shell(inner: string, unsubscribeUrl: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${CREAM};font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${SAGE};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr>
              <td align="center" style="padding:8px 0 18px;">
                <span style="font-size:22px;letter-spacing:.14em;font-weight:600;color:${SAGE};">PRETTY&nbsp;PETAL</span>
              </td>
            </tr>
            <tr>
              <td style="background:${CARD};border:1px solid ${LINE};border-radius:24px;padding:34px 30px;">
                ${inner}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:18px 14px 6px;color:${MUTED};font-size:12px;line-height:1.6;">
                Pretty Petal · handmade candles, poured with love.<br/>
                You're getting this because you left your email with us.<br/>
                <a href="${unsubscribeUrl}" style="color:${MUTED};text-decoration:underline;">Unsubscribe</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${BLUSH};color:${SAGE};text-decoration:none;font-weight:600;padding:12px 26px;border-radius:999px;">${label}</a>`;
}

export function welcomeEmail({
  name,
  unsubscribeUrl,
}: {
  name?: string | null;
  unsubscribeUrl: string;
}): EmailDoc {
  const hi = name ? `Hi ${escapeHtml(name)},` : "Hi there,";
  const inner = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding-bottom:22px;">
          <img src="${MAKER_PHOTO}" width="120" height="120" alt="The maker behind Pretty Petal"
               style="width:120px;height:120px;border-radius:999px;object-fit:cover;border:3px solid ${BLUSH};" />
        </td>
      </tr>
    </table>
    <p style="margin:0 0 14px;font-size:17px;">${hi}</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:${SAGE};">
      Thank you so much for stopping by 🌸 I'm the little hands behind Pretty Petal —
      I pour every candle myself, shaping flowers, bears and tiny hearts at my kitchen table.
    </p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:${SAGE};">
      I'd love to keep you close. I share each new candle first on Instagram, so come say
      hello — and if you ever dream of a piece made just for you, simply message me there.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:20px 0 8px;">${button(INSTAGRAM, "Follow on Instagram")}</td></tr>
    </table>
    <p style="margin:18px 0 0;font-size:15px;color:${SAGE};">With love,<br/><strong style="color:${BLUSH_DEEP};">Pretty Petal</strong></p>
    <p style="margin:22px 0 0;padding-top:16px;border-top:1px solid ${LINE};font-size:13px;font-style:italic;color:${MUTED};line-height:1.6;">
      PS — every candle is poured by hand at my kitchen table, just for the love of it.
      No two are ever quite the same. 🕯️
    </p>`;
  return {
    subject: "A little hello from Pretty Petal 🌸",
    html: shell(inner, unsubscribeUrl),
  };
}

export function newCandleEmail({
  candle,
  unsubscribeUrl,
}: {
  candle: { name: string; description: string | null; image_url: string; link_url: string | null };
  unsubscribeUrl: string;
}): EmailDoc {
  const cta = candle.link_url || INSTAGRAM;
  const desc = candle.description
    ? `<p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:${MUTED};">${escapeHtml(candle.description)}</p>`
    : "";
  const inner = `
    <p style="margin:0 0 18px;font-size:14px;letter-spacing:.12em;text-transform:uppercase;color:${BLUSH_DEEP};font-weight:600;">
      Fresh from the kitchen table
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding-bottom:20px;">
          <img src="${escapeHtml(candle.image_url)}" alt="${escapeHtml(candle.name)}"
               style="width:100%;max-width:540px;border-radius:18px;display:block;" />
        </td>
      </tr>
    </table>
    <h1 style="margin:0 0 10px;font-size:24px;color:${SAGE};">${escapeHtml(candle.name)}</h1>
    ${desc}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:8px 0 6px;">${button(cta, "Take a look")}</td></tr>
    </table>
    <p style="margin:20px 0 0;font-size:15px;color:${SAGE};">With love,<br/><strong style="color:${BLUSH_DEEP};">Pretty Petal</strong></p>`;
  return {
    subject: `New candle: ${candle.name} 🕯️`,
    html: shell(inner, unsubscribeUrl),
  };
}
