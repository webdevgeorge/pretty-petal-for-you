"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "./i18n";
import { Flame } from "./icons";
import { Reveal } from "./Reveal";
import { posts } from "./blog";
import type { Lang } from "./dictionary";

function formatDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Meta({ slug, date }: { slug: string; date: string }) {
  const { t, lang } = useLang();
  const post = posts.find((p) => p.slug === slug)!;
  return (
    <p className="mt-3 text-sage-text/55">
      {formatDate(date, lang)} · {post.readMins} {t.blog.minRead}
    </p>
  );
}

export function BlogIndex() {
  const { t, lang } = useLang();
  const [featured, ...rest] = posts;
  const fc = featured[lang];

  return (
    <main className="t-body">
      {/* intro */}
      <section className="bg-blush-soft/40 px-5 pb-14 pt-16 text-center sm:pt-20">
        <Reveal>
          <p className="font-semibold uppercase tracking-[0.18em] text-blush-deep">
            {t.blog.kicker}
          </p>
          <h1 className="t-heading mt-3 text-sage-text">{t.blog.heading}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sage-text/80">{t.blog.sub}</p>
        </Reveal>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-16">
        {/* featured post */}
        <Reveal>
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-3xl bg-card ring-1 ring-line/70 shadow-sm transition-transform duration-300 hover:-translate-y-1 lg:grid-cols-2"
          >
            <div className="relative aspect-[16/11] overflow-hidden lg:aspect-auto">
              <Image
                src={featured.image}
                alt={fc.title}
                placeholder="blur"
                fill
                sizes="(max-width: 1024px) 100vw, 36rem"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-cream-bg/85 px-3 py-1 font-semibold text-sage-text backdrop-blur-sm">
                {featured.tag[lang]}
              </span>
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-9">
              <h2 className="t-heading text-sage-text">{fc.title}</h2>
              <p className="mt-3 text-sage-text/80">{fc.excerpt}</p>
              <Meta slug={featured.slug} date={featured.date} />
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-blush-deep">
                <Flame className="h-4 w-4 anim-flicker" />
                {t.blog.readArticle}
              </span>
            </div>
          </Link>
        </Reveal>

        {/* the rest */}
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => {
            const c = p[lang];
            return (
              <Reveal key={p.slug} delay={(i % 3) * 100} className="h-full">
                <li className="h-full">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl bg-card ring-1 ring-line/70 shadow-sm transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/11] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={c.title}
                        placeholder="blur"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 22rem"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-cream-bg/85 px-3 py-1 font-semibold text-sage-text backdrop-blur-sm">
                        {p.tag[lang]}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="t-heading text-sage-text">{c.title}</h2>
                      <p className="mt-2 flex-1 text-sage-text/75">{c.excerpt}</p>
                      <Meta slug={p.slug} date={p.date} />
                    </div>
                  </Link>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
