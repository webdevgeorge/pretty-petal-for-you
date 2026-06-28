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

export function Article({ slug }: { slug: string }) {
  const { t, lang } = useLang();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;

  const c = post[lang];
  const more = posts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main className="t-body">
      <article className="mx-auto max-w-2xl px-5 pb-16 pt-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-medium text-sage-text/70 transition-colors hover:text-sage-text"
        >
          ← {t.blog.back}
        </Link>

        <p className="mt-6 font-semibold uppercase tracking-[0.18em] text-blush-deep">
          {post.tag[lang]}
        </p>
        <h1 className="t-heading mt-3 text-sage-text">{c.title}</h1>
        <p className="mt-3 text-sage-text/55">
          {formatDate(post.date, lang)} · {post.readMins} {t.blog.minRead} · {t.blog.by} Lize
        </p>

        <div className="mt-7 overflow-hidden rounded-3xl ring-1 ring-line/70 shadow-sm">
          <Image
            src={post.image}
            alt={c.title}
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, 42rem"
            className="h-auto w-full object-cover"
          />
        </div>

        {/* self-contained answer block — built for snippets & AI citation */}
        <div className="mt-8 rounded-2xl bg-blush-soft/50 p-6 ring-1 ring-blush/30">
          <p className="flex items-center gap-2 font-semibold uppercase tracking-[0.16em] text-blush-deep">
            <Flame className="h-4 w-4 anim-flicker" />
            {t.blog.inShort}
          </p>
          <p className="mt-3 text-sage-text/90">{c.answer}</p>
        </div>

        <p className="mt-8 text-sage-text/85">{c.intro}</p>

        {c.sections.map((s, i) => (
          <section key={i} className="mt-9">
            <h2 className="t-heading flex items-start gap-2 text-sage-text">
              <Flame className="mt-1 h-5 w-5 shrink-0 text-blush" />
              {s.h}
            </h2>
            {s.body.map((para, j) => (
              <p key={j} className="mt-3 text-sage-text/80">
                {para}
              </p>
            ))}
          </section>
        ))}

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="t-heading text-sage-text">{t.blog.faqHeading}</h2>
          <div className="mt-4 divide-y divide-line">
            {c.faq.map((f, i) => (
              <div key={i} className="py-4">
                <h3 className="font-semibold text-sage-text">{f.q}</h3>
                <p className="mt-2 text-sage-text/80">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* author box — E-E-A-T: written by the real maker */}
        <div className="mt-12 flex items-center gap-4 rounded-2xl bg-cream-soft/70 p-5 ring-1 ring-line">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blush-soft text-blush-deep">
            <Flame className="h-6 w-6 anim-flicker" />
          </span>
          <div>
            <p className="font-semibold text-sage-text">{t.blog.by} Lize</p>
            <p className="mt-1 text-sage-text/75">{t.blog.authorBio}</p>
          </div>
        </div>
      </article>

      {/* keep reading */}
      <section className="bg-blush-soft/30 px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="t-heading text-center text-sage-text">{t.blog.moreReading}</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {more.map((p, i) => {
              const mc = p[lang];
              return (
                <Reveal key={p.slug} delay={i * 100} className="h-full">
                  <li className="h-full">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-card ring-1 ring-line/70 shadow-sm transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="relative aspect-[16/11] overflow-hidden">
                        <Image
                          src={p.image}
                          alt={mc.title}
                          placeholder="blur"
                          fill
                          sizes="(max-width: 640px) 100vw, 18rem"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-cream-bg/85 px-3 py-1 font-semibold text-sage-text backdrop-blur-sm">
                          {p.tag[lang]}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="t-heading text-sage-text">{mc.title}</h3>
                      </div>
                    </Link>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
