"use client";

import Link from "next/link";
import { useLang } from "./i18n";
import { Flame } from "./icons";

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="bg-sage-deep px-5 py-10 text-cream/80">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <Link href="/" className="flex items-center gap-2 text-cream">
          <Flame className="h-5 w-5 text-blush anim-flicker" />
          <span className="brand">Pretty Petal</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/#about" className="transition-colors hover:text-cream">
            {t.footer.story}
          </Link>
          <Link href="/#collection" className="transition-colors hover:text-cream">
            {t.footer.collection}
          </Link>
          <Link href="/blog" className="transition-colors hover:text-cream">
            {t.footer.journal}
          </Link>
          <Link href="/#contact" className="transition-colors hover:text-cream">
            {t.footer.hello}
          </Link>
        </nav>
        <p className="text-cream/55">
          © {new Date().getFullYear()} Pretty Petal · {t.footer.tagline}
        </p>
      </div>
    </footer>
  );
}
