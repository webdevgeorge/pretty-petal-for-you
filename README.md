# Pretty Petal 🌸

The website for **Pretty Petal** — handmade decoration candles, hand-poured in
small batches by Liza, with a lot of love.

🔗 **Live:** https://pretty-petal-for-you.vercel.app

## About

A bilingual (English / French) brand site featuring an animated hero, a product
gallery, a "meet the maker" story, and an SEO-optimised candle-care blog.

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4** · **TypeScript**
- Deployed on **Vercel**, with **Google Analytics** (gtag.js)

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

- `src/app/` — routes (home, `/blog`, `/blog/[slug]`) and the root layout
- `src/components/` — UI, the EN/FR dictionary + language provider, blog content
- `src/media/` — product photos and the logo
- `public/` — static assets

## Notes

- **Languages:** English is the default; visitors switch to French via the header toggle.
- **Site URL:** set `NEXT_PUBLIC_SITE_URL` in the environment so Open Graph / share
  links resolve to the production domain.
