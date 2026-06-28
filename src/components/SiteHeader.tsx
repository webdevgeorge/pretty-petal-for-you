"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "./i18n";
import logoWordmark from "@/media/pretty-petal-wordmark.png";

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center rounded-full border border-line/70 bg-cream-bg/70 p-0.5">
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 font-semibold uppercase tracking-wide transition-colors ${
            lang === l ? "bg-blush text-white" : "text-sage-text/60 hover:text-sage-text"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const { t } = useLang();
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-2.5">
        <Link href="/" className="flex items-center">
          <Image
            src={logoWordmark}
            alt="Pretty Petal"
            preload
            sizes="64px"
            className="h-12 w-auto sm:h-14"
            style={{ filter: "saturate(1.4) brightness(0.62) drop-shadow(0 1px 1px rgba(71,77,57,0.25))" }}
          />
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/#collection"
            className="hidden font-medium text-sage-text/80 transition-colors hover:text-sage-text sm:inline"
          >
            {t.nav.collection}
          </Link>
          <Link
            href="/blog"
            className="font-medium text-sage-text/80 transition-colors hover:text-sage-text"
          >
            {t.nav.journal}
          </Link>
          <LangToggle />
          <Link
            href="/#contact"
            className="hidden rounded-full border border-line px-4 py-1.5 font-medium text-sage-text transition-colors hover:bg-cream-soft sm:inline-flex"
          >
            {t.sayHi}
          </Link>
        </div>
      </div>
    </header>
  );
}
