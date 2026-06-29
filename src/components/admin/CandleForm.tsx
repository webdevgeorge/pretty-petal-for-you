"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { createCandle, updateCandle } from "@/lib/actions/candles";

const TAGS = ["Spring", "Summer", "Autumn", "Winter", "Christmas", "Halloween", "Celebration", "Valentine", "Birthday"];

export type CandleFormValues = {
  id: string;
  name: string;
  description: string | null;
  tag: string | null;
  image_url: string;
  link_url: string | null;
  sort_order: number;
};

export function CandleForm({ candle }: { candle?: CandleFormValues }) {
  const isEdit = !!candle;
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(candle?.image_url ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
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
    const formEl = e.currentTarget;

    // Image required on create; on edit it's optional (keep existing)
    if (!isEdit && !file) { setError("Please select an image."); return; }

    setBusy(true);
    setError(null);

    let imageUrl = candle?.image_url ?? "";

    // Upload a new image if one was picked
    if (file) {
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
        setBusy(false);
        return;
      }
      imageUrl = supabase.storage.from("candle-images").getPublicUrl(upload.path).data.publicUrl;
    }

    const fd = new FormData(formEl);
    fd.set("image_url", imageUrl);

    if (isEdit && candle) {
      await updateCandle(candle.id, fd);
      router.push("/admin/candles");
      router.refresh();
    } else {
      await createCandle(fd);
      formRef.current?.reset();
      setFile(null);
      setPreview(null);
    }
    setBusy(false);
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-3xl bg-card p-6 ring-1 ring-line"
    >
      <h2 className="font-semibold text-sage-text">
        {isEdit ? "Edit candle" : "Add new candle"}
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-sage-text/70">Name *</span>
          <input
            name="name"
            required
            defaultValue={candle?.name ?? ""}
            placeholder="Spring Bouquet"
            className="rounded-xl border border-line bg-cream-bg/60 px-4 py-2.5 outline-none focus:border-blush-deep"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-sage-text/70">Tag / season</span>
          <select
            name="tag"
            defaultValue={candle?.tag ?? ""}
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
            defaultValue={candle?.description ?? ""}
            placeholder="roses, blooms & golden wheat"
            className="rounded-xl border border-line bg-cream-bg/60 px-4 py-2.5 outline-none focus:border-blush-deep"
          />
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium text-sage-text/70">
            Link (optional) — where the candle card goes when clicked
          </span>
          <input
            name="link_url"
            type="url"
            defaultValue={candle?.link_url ?? ""}
            placeholder="https://instagram.com/p/… or any URL"
            className="rounded-xl border border-line bg-cream-bg/60 px-4 py-2.5 outline-none focus:border-blush-deep"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-sage-text/70">Sort order</span>
          <input
            name="sort_order"
            type="number"
            defaultValue={candle?.sort_order ?? 0}
            className="rounded-xl border border-line bg-cream-bg/60 px-4 py-2.5 outline-none focus:border-blush-deep"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-sage-text/70">
            Photo {isEdit ? "(leave empty to keep current)" : "*"}
          </span>
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

      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-blush px-6 py-2.5 font-semibold text-sage-text transition-colors hover:bg-blush-deep hover:text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : isEdit ? "Save changes" : "Add candle"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={() => router.push("/admin/candles")}
            className="rounded-full border border-line px-6 py-2.5 font-medium transition-colors hover:bg-cream-soft"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
