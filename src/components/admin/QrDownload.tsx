"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

const COLORS = { dark: "#474d39", light: "#ffffff" };

export function QrDownload({ url, filename }: { url: string; filename: string }) {
  const [png, setPng] = useState("");

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, { width: 480, margin: 2, color: COLORS })
      .then((d) => !cancelled && setPng(d))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url]);

  function downloadPng() {
    if (!png) return;
    const a = document.createElement("a");
    a.href = png;
    a.download = `${filename}.png`;
    a.click();
  }

  async function downloadSvg() {
    const svg = await QRCode.toString(url, { type: "svg", margin: 2, color: COLORS });
    const blobUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${filename}.svg`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {png ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={png}
          alt="QR code"
          className="h-40 w-40 rounded-2xl bg-white p-2 ring-1 ring-line"
        />
      ) : (
        <div className="h-40 w-40 animate-pulse rounded-2xl bg-cream-soft ring-1 ring-line" />
      )}
      <div className="flex gap-2">
        <button
          onClick={downloadPng}
          className="rounded-full bg-blush px-4 py-1.5 font-semibold text-sage-text transition-colors hover:bg-blush-deep hover:text-white"
        >
          PNG
        </button>
        <button
          onClick={downloadSvg}
          className="rounded-full border border-line px-4 py-1.5 font-medium transition-colors hover:bg-cream-soft"
        >
          SVG
        </button>
      </div>
    </div>
  );
}
