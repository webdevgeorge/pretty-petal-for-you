"use client";

import { useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { createCandle } from "@/lib/actions/candles";

const TAGS = ["Spring", "Summer", "Autumn", "Winter", "Christmas", "Halloween", "Celebration", "Valentine", "Birthday"];

export function CandleForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) { setError("Please select an image."); return; }
    setUploading(true);
    setError(null);

    // Upload image directly from browser to Supabase Storage
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;
    const { data: upload, error: uploadErr } = await supabase.storage
      .from("candle-images")
      .upload(filename, file, { contentType: file.type, upsert: false });

    if (uploadErr || !upload) {
      setError("Image upload failed: " + (uploadErr?.message ?? "unknown error"));
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("candle-images")
      .getPublicUrl(upload.path);

    // Save candle record via server action
    const fd = new FormData(e.currentTarget);
    fd.set("image_url", publicUrl);
    await createCandle(fd);

    formRef.current?.reset();
    setFile(null);
    setPreview(null);
    setUploading(false);
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-3xl bg-card p-6 ring-1 ring-line"
    >
      <h2 className="font-semibold text-sage-text">Add new candle</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-sage-text/70">Name *</span>
          <input
            name="name"
            required
            placeholder="Spring Bouquet"
            className="rounded-xl border border-line bg-cream-bg/60 px-4 py-2.5 outline-none focus:border-blush-deep"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-sage-text/70">Tag / season</span>
          <select
            name="tag"
            className="rounded-xl border border-line bg-cream-bg/60 px-4 py-2.5 outline-none focus:border-blush-deep"
          >
            <option value="">— none —</option>
            {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium text-sage-text/70">Short description</span>
          <input
            name="description"
            placeholder="roses, blooms & golden wheat"
            className="rounded-xl border border-line bg-cream-bg/60 px-4 py-2.5 outline-none focus:border-blush-deep"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-sage-text/70">Sort order</span>
          <input
            name="sort_order"
            type="number"
            defaultValue={0}
            className="rounded-xl border border-line bg-cream-bg/60 px-4 py-2.5 outline-none focus:border-blush-deep"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-sage-text/70">Photo *</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="rounded-xl border border-line bg-cream-bg/60 px-4 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-blush file:px-3 file:py-1 file:font-medium file:text-sage-text"
          />
        </label>
      </div>

      {preview && (
        <div className="mt-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview" className="h-40 w-40 rounded-2xl object-cover ring-1 ring-line" />
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={uploading}
        className="mt-5 rounded-full bg-blush px-6 py-2.5 font-semibold text-sage-text transition-colors hover:bg-blush-deep hover:text-white disabled:opacity-50"
      >
        {uploading ? "Uploading…" : "Add candle"}
      </button>
    </form>
  );
}
