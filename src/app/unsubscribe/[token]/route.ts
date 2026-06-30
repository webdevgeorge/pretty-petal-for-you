import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const supabase = createAdminClient();
  await supabase
    .from("subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .is("unsubscribed_at", null);

  const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Unsubscribed · Pretty Petal</title>
  <meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;background:#f7f1ea;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#474d39;display:flex;align-items:center;justify-content:center;min-height:100vh;">
    <div style="text-align:center;max-width:380px;padding:24px;">
      <p style="font-size:40px;margin:0 0 12px;">🌸</p>
      <h1 style="margin:0 0 10px;font-size:22px;">You're unsubscribed</h1>
      <p style="margin:0 0 20px;font-size:15px;color:#8a8f7d;line-height:1.6;">
        You won't receive any more emails from Pretty Petal.<br/>
        You're always welcome to come back.
      </p>
      <a href="/" style="display:inline-block;background:#e6a4a4;color:#474d39;text-decoration:none;font-weight:600;padding:11px 24px;border-radius:999px;font-size:14px;">
        Back to the site
      </a>
    </div>
  </body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
