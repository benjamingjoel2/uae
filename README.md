# Barjeel Journeys

A fast, static, four-language travel website for private journeys across the seven emirates of the United Arab Emirates.

- **Live site:** https://barjeel-journeys.vercel.app
- **Intended domain:** https://barjeeljourneys.tourground.com
- **Languages:** English (default, at `/`), French (`/fr/`), German (`/de/`), Spanish (`/es/`). Every page is pre-rendered in all four.

## Run it

You need Node.js 18 or newer. The build has no dependencies.

```bash
npm run build
```

```bash
npm run serve
```

`npm run build` writes the whole site to `dist/` (96 pages: 24 pages × 4 languages, plus 404 pages, `sitemap.xml` and `robots.txt`). `npm run serve` previews it at http://localhost:4173. `npm run dev` does both.

## Deploy (Vercel)

`vercel.json` already holds the settings: build command `npm run build`, output folder `dist`, clean URLs with trailing slashes, a no-op install step, and one-year immutable cache headers for `/img`, `/fonts` and `/assets`. Every push to `main` on GitHub (`benjamingjoel2/uae`) deploys automatically to the Vercel project `barjeel-journeys` (team *Benjamin - Sevo*).

To use the real domain, add `barjeeljourneys.tourground.com` under the project's **Settings → Domains** in Vercel, and add the CNAME record Vercel shows at the DNS host for `tourground.com`. Canonical URLs, hreflang links and the sitemap already point to that domain (`siteUrl` in `src/config.mjs`).

## Edit the site

| What | Where |
|---|---|
| Brand name, email, address, palette, fonts, site URL, live URL, form endpoint, prices | `src/config.mjs` |
| All words, in each language | `src/content/en.mjs`, `fr.mjs`, `de.mjs`, `es.mjs` |
| Image alt text, in each language | `src/content/alt.mjs` |
| Destinations, drive times, route grouping | `src/data/places.mjs` |
| Monthly temperatures, sea temperatures, comfort bands, desert-camp season | `src/data/climate.mjs` |
| Page templates and layout | `scripts/build.mjs` |
| Styles (one file, inlined into each page) | `src/assets/site.css` |
| Small enhancement script (menu, carousels, season month, form) | `src/assets/site.js` |
| Images (generated) and their credits | `public/img/`, `src/data/images.json` |

**Re-branding.** Change `src/config.mjs`. The name, email and address flow into the header, footer, contact page, legal pages and JSON-LD. Palette values become CSS variables.

**Copy.** Edit the English file, then make the same change in the other three. They must keep exactly the same structure. Check them with:

```bash
node scripts/check-locales.mjs
```

Strings can use the tokens `{brand}`, `{email}`, `{address}` and `{year}`, and links such as `<a href="@season">`. A link written `@key` points to that page in the reader's own language. The keys are `home`, `dubai`, `abudhabi`, `alain`, `liwa`, `sharjah`, `rak`, `fujairah`, `hatta`, `ajman`, `sbi`, `season`, `ramadan`, `drive`, `journeys`, `stays`, `about`, `journal`, `enquire`, `privacy`, `terms`, `cookies` and `credits`.

**Prices.** Prices are never invented. Every journey and stay shows "From — on request" until you set a number in `config.prices` (in AED per person). It then reads, for example, "From AED 12,400 per person".

**Ramadan dates.** Update `ramadan.dates` and `season.ramadanNote` in each language file every year.

**Languages.** The language selector (EN · FR · DE · ES) in the header, mobile menu and footer links to the same page in the other language. There is no automatic redirect by browser language, and no translation library runs in the browser.

## Enquiry form

The form posts to [FormSubmit](https://formsubmit.co), which forwards each enquiry to `barjeeljourneys@tourground.com`. With JavaScript, it sends in the background and shows a thank-you message. Without JavaScript, it does a normal POST and lands on `/enquire/thank-you/`.

**One-time step:** the very first submission makes FormSubmit send an activation email to barjeeljourneys@tourground.com. Click the link in that email once, and enquiries are delivered from then on. To use a different form service, change `formEndpoint` and `formAjaxEndpoint` in `src/config.mjs`.

## Images

Photos are stored as right-sized AVIF and WebP files (480–2000 px wide) in `public/img/`, and served with `srcset` and `sizes`. Every image has width and height, every image below the fold is lazy-loaded, and each hero is preloaded with `fetchpriority="high"`.

To add or replace photos:

1. Put the source JPGs and a `manifest.json` in a folder. Each manifest entry needs `slot`, `file`, `title`, `author`, `license`, `license_url`, `source_url` and `place`.
2. Install sharp: `npm i -D sharp`.
3. Run `npm run images -- path/to/folder`.

Creative Commons photos are credited automatically on `/credits/`. Unsplash photos carry no credit line. Venue photos follow the rules in `IMAGES-NEEDED.md`.

The Arabic label font is subset to the characters the site uses. If you add new Arabic words, regenerate it with `npm run fonts -- path/to/amiri-arabic-400-normal.woff2`. This needs Python `fonttools` and `brotli`.

## Performance and accessibility

- **No render-blocking requests:** CSS is inlined, the one small script is a deferred module, and fonts load with `font-display: swap` (only the weights used, latin subsets preloaded).
- **The home-page dawn-to-dusk pan is pure CSS:** it uses scroll-driven animations, with a static fallback for browsers that don't support them and for reduced-motion settings.
- **Page transitions** use cross-document View Transitions, where the browser supports them.
- **The season and drive planners work without JavaScript:** they are built from radio buttons and CSS `:has()`.
- **Colour contrast:** all text and background pairs meet WCAG AA. Body charcoal `#22201D` on gypsum `#F5F0E7` is about 14.3:1, muted `#5E574E` on gypsum about 6.3:1, gypsum on palm green `#36432B` about 9.3:1, white on falaj teal about 7.9:1, and ember `#B5441E` is used only as an accent.

## Other documents

- `FACTS-TO-VERIFY.md`: every fact to check before launch.
- `IMAGES-NEEDED.md`: images still wanted, and venue photo rules.
