"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

const PRESETS = [
  { label: "Sage", color: "#474d39" },
  { label: "Black", color: "#1a1a1a" },
  { label: "Blush", color: "#c47e7e" },
  { label: "Navy", color: "#1e3a5f" },
];

export function QrDownload({ url, filename }: { url: string; filename: string }) {
  const [fgColor, setFgColor] = useState("#474d39");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, {
      width: 480,
      margin: 2,
      color: { dark: fgColor, light: "#ffffff" },
    })
      .then((d) => !cancelled && setPreview(d))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url, fgColor]);

  async function downloadPng() {
    const dataUrl = await QRCode.toDataURL(url, {
      width: 960,
      margin: 2,
      color: { dark: fgColor, light: "#00000000" },
    });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${filename}.png`;
    a.click();
  }

  async function downloadSvg() {
    const svg = await QRCode.toString(url, {
      type: "svg",
      margin: 2,
      color: { dark: fgColor, light: "#00000000" },
    });
    const blobUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${filename}.svg`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* preview — white bg so transparent QR is visible */}
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="QR code preview"
          className="h-40 w-40 rounded-2xl bg-white p-2 ring-1 ring-line"
        />
      ) : (
        <div className="h-40 w-40 animate-pulse rounded-2xl bg-cream-soft ring-1 ring-line" />
      )}

      {/* color swatches + custom picker */}
      <div className="flex items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.color}
            onClick={() => setFgColor(p.color)}
            title={p.label}
            className={`h-5 w-5 rounded-full transition-transform ${
              fgColor === p.color
                ? "scale-125 ring-2 ring-blush-deep ring-offset-1"
                : "ring-1 ring-line"
            }`}
            style={{ backgroundColor: p.color }}
          />
        ))}
        {/* custom color picker */}
        <label
          title="Custom color"
          className="relative h-5 w-5 cursor-pointer overflow-hidden rounded-full ring-1 ring-line"
          style={{
            background:
              "conic-gradient(red,yellow,lime,aqua,blue,magenta,red)",
          }}
        >
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </div>

      {/* download buttons */}
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
      <p className="text-[10px] text-sage-text/40">Downloads have no background</p>
    </div>
  );
}
