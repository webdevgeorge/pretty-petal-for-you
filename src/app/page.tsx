"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { useLang } from "@/components/i18n";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactForm } from "@/components/ContactForm";

import springBouquet from "@/media/spring-bouquet.png";
import pinkWinter from "@/media/pink-winter.png";
import goldenFifty from "@/media/golden-fifty.png";
import frostedPine from "@/media/frosted-pine.png";
import christmasShapes from "@/media/image copy.png";
import spookyNight from "@/media/spooky-night.png";
import heroCandles from "@/media/hero-candles.png";
import makerImage from "@/media/image.png";

/* Image order must match the gallery order in the dictionary. */
const galleryImages: StaticImageData[] = [
  springBouquet,
  pinkWinter,
  goldenFifty,
  frostedPine,
  christmasShapes,
  spookyNight,
];

const INSTAGRAM = "https://www.instagram.com/prettypetalforyou";
const FACEBOOK = "https://www.facebook.com/profile.php?id=61577608970603";

/* Her portrait on the home page. Swap the import in src/media to change it. */
const makerPhoto: StaticImageData | null = makerImage;

/* ------------------------------------------------------------------ */
/*  Little brand shapes                                                 */
/* ------------------------------------------------------------------ */
function Flame({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
      <path
        d="M12 2c2.6 3.2 5.4 5.7 5.4 9.4A5.4 5.4 0 0 1 6.6 11.4c0-1.6.8-3 2.1-4.4C8 9 8.6 6.2 12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Petal({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
      <path d="M12 2C7 6 5 10 5 14a7 7 0 0 0 14 0c0-4-2-8-7-12Z" fill="currentColor" />
    </svg>
  );
}

function Flourish({ tone = "sage" }: { tone?: "sage" | "cream" }) {
  const line = tone === "cream" ? "bg-cream/30" : "bg-line";
  const flame = tone === "cream" ? "text-cream/70" : "text-blush";
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden="true">
      <span className={`h-px w-10 ${line}`} />
      <Flame className={`h-4 w-4 ${flame} anim-flicker`} />
      <span className={`h-px w-10 ${line}`} />
    </div>
  );
}

/* Deterministic decoration data (no random → no hydration mismatch). */
const petals = [
  { left: "6%", dur: "14s", delay: "0s", sway: "34px", size: 15, tone: "text-blush/50" },
  { left: "20%", dur: "18s", delay: "4s", sway: "-26px", size: 11, tone: "text-cream/40" },
  { left: "38%", dur: "16s", delay: "2s", sway: "30px", size: 13, tone: "text-blush/40" },
  { left: "58%", dur: "20s", delay: "6s", sway: "-34px", size: 10, tone: "text-cream/35" },
  { left: "74%", dur: "15s", delay: "1s", sway: "26px", size: 14, tone: "text-blush/45" },
  { left: "88%", dur: "19s", delay: "5s", sway: "-22px", size: 12, tone: "text-cream/40" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
type DbCandle = { id: string; name: string; description: string | null; tag: string | null; image_url: string; link_url: string | null };

export default function Home() {
  const { t } = useLang();
  const marqueeStrip = Array.from({ length: 4 }, () => t.marquee).flat();
  const [extraCandles, setExtraCandles] = useState<DbCandle[] | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const res = await fetch("/api/candles");
      const data: DbCandle[] = await res.json();
      setExtraCandles(data);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="t-body">
      {/* ---- Header ---------------------------------------------------- */}
      <SiteHeader />

      {/* ---- Hero ------------------------------------------------------ */}
      <section
        id="top"
        className="relative isolate flex min-h-[88vh] items-center overflow-hidden"
      >
        {/* the candle scene — text sits in the empty middle */}
        <Image
          src={heroCandles}
          alt=""
          aria-hidden="true"
          placeholder="blur"
          preload
          fill
          sizes="100vw"
          className="-z-20 object-cover object-[76%_50%] sm:object-[50%_60%]"
        />

        {/* soft cream scrims: brighten the centre for the text, fade the
            top into the header and the bottom into the ribbon */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 56% 52% at 50% 50%, rgba(250,246,236,0.6), rgba(250,246,236,0.12) 58%, transparent 74%), linear-gradient(to bottom, rgba(250,246,236,0.5), transparent 20%, transparent 85%, rgba(250,246,236,0.55))",
          }}
        />

        {/* a few drifting blush petals keep the brand's gentle motion */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          {petals.slice(0, 3).map((p, i) => (
            <Petal
              key={i}
              className="anim-petal absolute top-0 text-blush/40"
              style={
                {
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  "--dur": p.dur,
                  "--sway": p.sway,
                  animationDelay: p.delay,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-24 text-center">
          <span className="anim-rise" style={{ animationDelay: "0s" }}>
            <Flame className="h-7 w-7 text-blush anim-flicker" aria-hidden="true" />
          </span>

          <h1
            className="anim-rise mt-5 max-w-2xl text-balance"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="t-heading block text-sage-text">{t.hero.title}</span>
            <span className="script-accent mt-1 block text-blush-deep">
              {t.hero.titleScript}
            </span>
          </h1>

          <p
            className="anim-rise mt-5 max-w-md text-sage-text/80"
            style={{ animationDelay: "0.25s" }}
          >
            {t.hero.sub}
          </p>

          <div
            className="anim-rise mt-8 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="#collection"
              className="shine rounded-full bg-blush px-7 py-3 font-semibold text-sage-text transition-all duration-300 hover:-translate-y-0.5 hover:bg-blush-deep hover:text-white hover:shadow-lg hover:shadow-blush/30"
            >
              {t.hero.cta1}
            </a>
            <a
              href="#about"
              className="rounded-full border border-sage-text/30 bg-cream-bg/40 px-7 py-3 font-medium text-sage-text backdrop-blur-sm transition-colors hover:bg-cream-bg/75"
            >
              {t.hero.cta2}
            </a>
          </div>

          {/* scroll cue */}
          <a
            href="#about"
            className="anim-rise mt-12 text-sage-text/70"
            style={{ animationDelay: "0.6s" }}
            aria-label={t.hero.scroll}
          >
            <svg className="anim-bob h-6 w-6 text-sage-text/70" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

      {/* ---- Marquee ribbon -------------------------------------------- */}
      <div className="overflow-hidden border-y border-line/60 bg-blush-soft/50 py-3">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {marqueeStrip.map((word, i) => (
                <span key={i} className="flex shrink-0 items-center">
                  <span className="whitespace-nowrap px-6 font-medium text-sage-text/80">
                    {word}
                  </span>
                  <Flame className="h-3.5 w-3.5 text-blush anim-flicker" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---- Meet the maker -------------------------------------------- */}
      <section id="about" className="px-5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
          {/* her portrait — real photo if set, otherwise a gentle placeholder */}
          <Reveal>
            <div className="relative mx-auto w-full max-w-sm">
              <span
                className="absolute -inset-3 rounded-[2rem] bg-blush-soft/60 blur-xl"
                aria-hidden="true"
              />
              <div className="anim-floaty-slow relative overflow-hidden rounded-[2rem] ring-1 ring-line shadow-xl shadow-sage/10">
                {makerPhoto ? (
                  <Image
                    src={makerPhoto}
                    alt={t.about.photoAlt}
                    placeholder="blur"
                    sizes="(max-width: 1024px) 90vw, 28rem"
                    className="h-auto w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/5] flex-col items-center justify-center gap-4 bg-gradient-to-br from-cream-soft via-blush-soft/70 to-blush-soft px-8 text-center text-sage-text/70">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-bg/70 text-blush-deep">
                      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden="true">
                        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-8 2-8 5.2V21h16v-1.8C20 16 16 14 12 14Z" />
                      </svg>
                    </span>
                    <span>{t.about.photoCaption}</span>
                  </div>
                )}
              </div>
              <span className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-card px-4 py-2 font-medium text-sage-text shadow-md ring-1 ring-line">
                <Flame className="h-4 w-4 text-blush anim-flicker" />
                {t.about.role}
              </span>
            </div>
          </Reveal>

          {/* her story, in her own words */}
          <Reveal delay={120}>
            <div>
              <p className="font-semibold uppercase tracking-[0.18em] text-blush-deep">
                {t.about.kicker}
              </p>
              <h2 className="t-heading mt-3 text-sage-text">{t.about.heading}</h2>
              <p className="mt-5 text-sage-text/80">{t.about.p1}</p>
              <p className="mt-4 text-sage-text/80">{t.about.p2}</p>
              <p className="mt-4 text-sage-text/80">{t.about.p3}</p>
              <p className="mt-6 italic text-sage-text/80">{t.about.signoff}</p>
              <p
                className="mt-1 italic text-sage-text"
                style={{ fontWeight: 600, letterSpacing: "0.01em" }}
              >
                {t.about.signature}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Collection / gallery -------------------------------------- */}
      <section id="collection" className="bg-blush-soft/40 px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="text-center">
              <Flourish />
              <h2 className="t-heading mt-6 text-sage-text">{t.collection.heading}</h2>
              <p className="mx-auto mt-4 max-w-md text-sage-text/80">{t.collection.sub}</p>
            </div>
          </Reveal>

          {extraCandles && extraCandles.length > 0 ? (
            /* Full collection from the database (revealed by "See all") */
            <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {extraCandles.map((c, i) => {
                const card = (
                  <figure className="shine relative h-full overflow-hidden rounded-3xl ring-1 ring-line/70 shadow-sm">
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={c.image_url}
                        alt={c.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-sage-deep/85 via-sage-deep/15 to-transparent transition-opacity duration-500 group-hover:from-sage-deep/90" />
                      {c.tag && (
                        <span className="absolute left-4 top-4 rounded-full bg-cream-bg/85 px-3 py-1 font-semibold text-sage-text backdrop-blur-sm">
                          {c.tag}
                        </span>
                      )}
                      <figcaption className="absolute inset-x-0 bottom-0 p-5 text-left transition-transform duration-500 group-hover:-translate-y-1">
                        <h3 className="t-heading text-cream">{c.name}</h3>
                        {c.description && <p className="mt-1 text-cream/85">{c.description}</p>}
                      </figcaption>
                    </div>
                  </figure>
                );
                return (
                  <Reveal key={c.id} as="li" delay={(i % 3) * 110} className="group h-full">
                    {c.link_url ? (
                      <a
                        href={c.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full"
                      >
                        {card}
                      </a>
                    ) : (
                      card
                    )}
                  </Reveal>
                );
              })}
            </ul>
          ) : (
            /* Default featured set — server-rendered for instant load + SEO */
            <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {t.collection.gallery.map((g, i) => (
                <Reveal key={g.name} as="li" delay={(i % 3) * 110} className="group h-full">
                  <figure className="shine relative h-full overflow-hidden rounded-3xl ring-1 ring-line/70 shadow-sm">
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={galleryImages[i]}
                        alt={g.alt}
                        placeholder="blur"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-sage-deep/85 via-sage-deep/15 to-transparent transition-opacity duration-500 group-hover:from-sage-deep/90" />
                      <span className="absolute left-4 top-4 rounded-full bg-cream-bg/85 px-3 py-1 font-semibold text-sage-text backdrop-blur-sm">
                        {g.tag}
                      </span>
                      <figcaption className="absolute inset-x-0 bottom-0 p-5 text-left transition-transform duration-500 group-hover:-translate-y-1">
                        <h3 className="t-heading text-cream">{g.name}</h3>
                        <p className="mt-1 text-cream/85">{g.note}</p>
                      </figcaption>
                    </div>
                  </figure>
                </Reveal>
              ))}
            </ul>
          )}

          {extraCandles === null && (
            <Reveal delay={120}>
              <div className="mt-10 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="shine rounded-full border border-sage-text/30 px-8 py-3 font-semibold text-sage-text transition-all hover:-translate-y-0.5 hover:border-blush-deep hover:text-blush-deep disabled:opacity-50"
                >
                  {loadingMore ? "Loading…" : "See all candles"}
                </button>
              </div>
            </Reveal>
          )}

          <Reveal delay={120}>
            <p className="mt-10 text-center text-sage-text/70">
              <Flame className="mr-2 inline h-4 w-4 text-blush anim-flicker" aria-hidden="true" />
              <a
                href="#contact"
                className="underline decoration-blush/60 underline-offset-4 transition-colors hover:text-sage-text"
              >
                {t.collection.notForSale}
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- Why / features ------------------------------------------- */}
      <section className="px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="text-center">
              <Flourish />
              <h2 className="t-heading mt-6 text-sage-text">{t.features.heading}</h2>
            </div>
          </Reveal>

          <ul className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {t.features.items.map((f, i) => (
              <Reveal key={f.title} as="li" delay={i * 120} className="group text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blush-soft text-blush-deep transition-transform duration-300 group-hover:scale-110">
                  {i === 0 && <Flame className="h-6 w-6 anim-flicker" />}
                  {i === 1 && (
                    <svg viewBox="0 0 24 24" className="h-6 w-6 anim-floaty" aria-hidden="true">
                      <path
                        d="M12 20.5S3.5 15 3.5 8.9A4.4 4.4 0 0 1 12 7.2a4.4 4.4 0 0 1 8.5 1.7C20.5 15 12 20.5 12 20.5Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  {i === 2 && <Petal className="h-6 w-6 anim-floaty-slow" />}
                </span>
                <h3 className="t-heading mt-5 text-sage-text">{f.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sage-text/75">{f.note}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Contact --------------------------------------------------- */}
      <section
        id="contact"
        className="anim-drift relative overflow-hidden px-5 py-20 text-cream sm:py-24"
        style={{ backgroundImage: "linear-gradient(135deg, #6f7560, #565b46 60%, #6b7459)" }}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {petals.slice(0, 4).map((p, i) => (
            <Petal
              key={i}
              className={`anim-petal absolute top-0 ${p.tone}`}
              style={
                {
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  "--dur": p.dur,
                  "--sway": p.sway,
                  animationDelay: p.delay,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <Reveal>
          <div className="relative mx-auto max-w-xl text-center">
            <Flourish tone="cream" />
            <h2 className="t-heading mt-6 text-cream">{t.contact.heading}</h2>
            <p className="mt-5 text-cream/85">{t.contact.sub}</p>

            <ContactForm />

            <p className="mt-8 text-cream/80">{t.contact.form.or}</p>
            <div className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-cream/40 px-6 py-2.5 font-medium text-cream transition-colors hover:bg-cream/10"
              >
                {t.contact.instagram}
              </a>
              <a
                href={FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-cream/40 px-6 py-2.5 font-medium text-cream transition-colors hover:bg-cream/10"
              >
                {t.contact.facebook}
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---- Footer ---------------------------------------------------- */}
      <SiteFooter />
    </div>
  );
}
