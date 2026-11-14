// Static site generator for Barjeel Journeys. No dependencies: `node scripts/build.mjs` → dist/
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config, fullAddress } from '../src/config.mjs';
import { places, driveTargets, routes, baseNights } from '../src/data/places.mjs';
import { regions, band, campSeason, coolMonthPlaces } from '../src/data/climate.mjs';
import altText from '../src/content/alt.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const content = {};
for (const loc of config.locales) content[loc] = (await import(`../src/content/${loc}.mjs`)).default;
const images = existsSync(join(ROOT, 'src/data/images.json')) ? JSON.parse(readFileSync(join(ROOT, 'src/data/images.json'), 'utf8')) : {};
const YEAR = new Date().getFullYear();

// ── Routes ──────────────────────────────────────────────────
const placeByKey = Object.fromEntries(places.map((p) => [p.key, p]));
const ROUTES = [
  { key: 'home', path: '' },
  ...places.map((p) => ({ key: p.key, path: p.slug + '/' })),
  { key: 'season', path: 'season-planner/' },
  { key: 'ramadan', path: 'ramadan-etiquette/' },
  { key: 'drive', path: 'drive-planner/' },
  { key: 'journeys', path: 'journeys/' },
  { key: 'stays', path: 'stays/' },
  { key: 'about', path: 'about/' },
  { key: 'journal', path: 'journal/' },
  { key: 'enquire', path: 'enquire/' },
  { key: 'thanks', path: 'enquire/thank-you/', noindex: true },
  { key: 'privacy', path: 'privacy/' },
  { key: 'terms', path: 'booking-terms/' },
  { key: 'cookies', path: 'cookies/' },
  { key: 'credits', path: 'credits/' },
];
const routeByKey = Object.fromEntries(ROUTES.map((r) => [r.key, r]));
const url = (loc, key) => (loc === config.defaultLocale ? '/' : `/${loc}/`) + (routeByKey[key]?.path ?? '');
const abs = (u) => config.siteUrl + u;

// ── Text helpers ────────────────────────────────────────────
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (s) => String(s).replace(/<[^>]+>/g, '');
const tokens = (s, html) => String(s)
  .replace(/\{brand\}/g, config.brand.name)
  .replace(/\{email\}/g, html ? `<a href="mailto:${config.email}">${config.email}</a>` : config.email)
  .replace(/\{address\}/g, fullAddress())
  .replace(/\{year\}/g, YEAR)
  .replace(/\{site\}/g, config.siteUrl);
const mkT = (loc) => {
  const links = (s) => String(s).replace(/href="@([a-z]+)"/g, (_, k) => `href="${url(loc, k)}"`);
  return {
    h: (s) => tokens(links(s), true),        // trusted HTML content
    p: (s) => esc(strip(tokens(s, false))),    // plain text for attributes
    link: (k) => url(loc, k.replace(/^@/, '')),
  };
};
const fmtMin = (m, L) => (m < 60 ? `${m} ${L.ui.min}` : `${Math.floor(m / 60)} ${L.ui.hr}${m % 60 ? ' ' + String(m % 60).padStart(2, '0') : ''}`);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ── Images ──────────────────────────────────────────────────
const alt = (loc, slot) => altText[loc]?.[slot] || altText.en?.[slot] || '';
function srcset(slot, fmt) { const im = images[slot]; return im.widths.map((w) => `/img/${slot}-${w}.${fmt} ${w}w`).join(', '); }
function pic(slot, loc, { sizes = '100vw', eager = false, cls = '', altOverride } = {}) {
  const im = images[slot];
  const a = esc(altOverride ?? alt(loc, slot));
  if (!im) return `<div class="ph-missing" role="img" aria-label="${a}" style="width:100%;height:100%;background:var(--sand)"></div>`;
  const mid = im.widths.find((w) => w >= 1200) || im.widths[im.widths.length - 1];
  return `<picture${cls ? ` class="${cls}"` : ''}><source type="image/avif" srcset="${srcset(slot, 'avif')}" sizes="${sizes}"><source type="image/webp" srcset="${srcset(slot, 'webp')}" sizes="${sizes}"><img src="/img/${slot}-${mid}.webp" width="${im.w}" height="${im.h}" alt="${a}" ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'} style="object-position:${im.pos || '50% 50%'}"></picture>`;
}
const ph = (slot, loc, ratio, opts = {}) => `<div class="ph ${ratio || ''} ${opts.phCls || ''}">${pic(slot, loc, opts)}</div>`;
const preload = (slot, sizes = '100vw') => (images[slot] ? `<link rel="preload" as="image" type="image/avif" imagesrcset="${srcset(slot, 'avif')}" imagesizes="${sizes}" fetchpriority="high">` : '');

// ── Motifs ──────────────────────────────────────────────────
const towerSvg = (cls = '') => `<svg class="${cls}" viewBox="0 0 15 26" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true" focusable="false"><path d="M2 25.5V10.5h11v15"/><path d="M.5 10.5h14M2.5 1.5h10v9h-10z"/><path d="M5 2.5v7M7.5 2.5v7M10 2.5v7"/></svg>`;
const dune = () => `<svg class="dune" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 46C160 26 300 16 470 32s300 26 490 0 300-24 480-6" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/><path d="M0 54c200-10 380-22 560-8s360 18 520 2 240-14 360-10" fill="none" stroke="currentColor" stroke-width="1" opacity=".5" vector-effect="non-scaling-stroke"/></svg>`;
const arrow = (dir = 'r') => `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="${dir === 'r' ? 'M1 8h13M9 3l5 5-5 5' : 'M15 8H2M7 3 2 8l5 5'}" fill="none" stroke="currentColor" stroke-width="1"/></svg>`;
const arName = { dubai: 'دبي', abudhabi: 'أبوظبي', sharjah: 'الشارقة', ajman: 'عجمان', uaq: 'أم القيوين', rak: 'رأس الخيمة', fujairah: 'الفجيرة' };

// ── Shell ───────────────────────────────────────────────────
const cssRaw = readFileSync(join(ROOT, 'src/assets/site.css'), 'utf8');
const pal = config.palette;
const cssVars = `:root{${Object.entries(pal).map(([k, v]) => `--${k}:${v}`).join(';')};--font-display:${config.fonts.display};--font-text:${config.fonts.text};--font-ar:${config.fonts.arabic}}`;
const minifyCss = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim();
const CSS = minifyCss(cssVars + cssRaw);
const jsRaw = readFileSync(join(ROOT, 'src/assets/site.js'), 'utf8');
const jsHash = createHash('sha1').update(jsRaw).digest('hex').slice(0, 10);
const JS_PATH = `/assets/site.${jsHash}.js`;

function langList(loc, key, L) {
  return `<ul class="langs">${config.locales.map((l) => `<li><a href="${url(l, key)}" hreflang="${l}" lang="${l}" aria-label="${esc(content[l].name)}"${l === loc ? ' aria-current="true"' : ''}>${content[l].short}</a></li>`).join('')}</ul>`;
}

function header(loc, key, L, over) {
  const t = mkT(loc);
  const destKeys = places.map((p) => p.key);
  const menuImgs = [...destKeys.map((k) => [k, placeByKey[k].hero])];
  return `<a class="skip" href="#main">${esc(L.ui.skip)}</a>
<header class="hd${over ? ' hd--over' : ''}">
  <button class="hd__menu" type="button" data-menu-open aria-controls="menu" aria-expanded="false" aria-label="${esc(L.ui.menu)}"><span class="hd__burger" aria-hidden="true"></span><span class="hd__menu-label" aria-hidden="true">${esc(L.ui.menu)}</span></button>
  <a class="hd__logo" href="${url(loc, 'home')}" aria-label="${t.p(L.ui.homeLabel)}">${towerSvg()}<span class="hd__word">${esc(config.brand.name)}</span></a>
  <nav aria-label="${esc(L.ui.languages)}">${langList(loc, key, L)}</nav>
  <a class="btn hd__cta" href="${url(loc, 'enquire')}">${esc(L.ui.enquire)}</a>
</header>
<div class="mn" id="menu" role="dialog" aria-modal="true" aria-label="${esc(L.ui.menu)}" aria-hidden="true" inert>
  <div class="mn__top"><button class="mn__close" type="button" data-menu-close><span class="mn__x" aria-hidden="true"></span>${esc(L.ui.close)}</button><a class="hd__logo" href="${url(loc, 'home')}" aria-label="${t.p(L.ui.homeLabel)}">${towerSvg()}<span class="hd__word">${esc(config.brand.name)}</span></a></div>
  <nav class="mn__body" aria-label="${esc(L.ui.menu)}">
    <div class="mn__col mn__col--a"><h2>${esc(L.ui.menuPrimary)}</h2><ul class="mn__big">${places.map((p, i) => `<li style="--i:${i}"><a href="${url(loc, p.key)}" data-img="${p.key}"${p.key === key ? ' aria-current="page"' : ''}>${esc(L.nav[p.key])} <span class="ar" lang="ar" dir="rtl">${p.ar}</span></a></li>`).join('')}</ul></div>
    <div class="mn__col mn__col--b"><h2>${esc(L.ui.menuSecondary)}</h2><ul class="mn__small">${['season', 'ramadan', 'drive', 'journeys', 'stays'].map((k, i) => `<li style="--i:${i + 2}"><a href="${url(loc, k)}"${k === key ? ' aria-current="page"' : ''}>${esc(L.nav[k])}</a></li>`).join('')}</ul>
      <h2>${esc(L.ui.menuTertiary)}</h2><ul class="mn__small">${['about', 'journal', 'enquire'].map((k, i) => `<li style="--i:${i + 8}"><a href="${url(loc, k)}"${k === key ? ' aria-current="page"' : ''}>${esc(L.nav[k])}</a></li>`).join('')}</ul></div>
    <div class="mn__img" aria-hidden="true">${images['home-dawn'] ? pic('home-dawn', loc, { sizes: '33vw', altOverride: '' }) : ''}</div>
  </nav>
  ${menuImgs.map(([k, slot]) => (images[slot] ? `<template id="mi-${k}">${pic(slot, loc, { sizes: '33vw', altOverride: '' })}</template>` : '')).join('')}
  <div class="mn__foot"><nav aria-label="${esc(L.ui.languages)}">${langList(loc, key, L)}</nav><a href="mailto:${config.email}">${config.email}</a></div>
</div>`;
}

function footer(loc, key, L) {
  const t = mkT(loc);
  const li = (k) => `<li><a href="${url(loc, k)}">${esc(L.nav[k])}</a></li>`;
  return `<footer class="ft">
  <div class="ft__top">
    <div><p class="eyebrow">${esc(L.footer.emailLabel)}</p><a class="ft__mail" href="mailto:${config.email}">${config.email}</a></div>
    <div><p class="ft__lead">${t.h(L.footer.lead)}</p><a class="btn btn--light" href="${url(loc, 'enquire')}">${esc(L.footer.cta)}</a></div>
  </div>
  <div class="ft__cols">
    <div><h2>${esc(L.footer.addressLabel)}</h2><address class="ft__addr"><strong>${esc(config.brand.name)}</strong><br>${esc(config.address.venue)}<br>${esc(config.address.street)}, ${esc(config.address.area)}<br>${esc(config.address.city)}, ${esc(config.address.country)}<br><a href="mailto:${config.email}">${config.email}</a></address>${towerSvg('motif ft__mark mt-m')}</div>
    <div><h2>${esc(L.footer.destinations)}</h2><ul>${places.map((p) => li(p.key)).join('')}</ul></div>
    <div><h2>${esc(L.footer.plan)}</h2><ul>${['season', 'ramadan', 'drive', 'journeys', 'stays'].map(li).join('')}</ul></div>
    <div><h2>${esc(L.footer.house)}</h2><ul>${['about', 'journal', 'enquire'].map(li).join('')}</ul></div>
    <div><h2>${esc(L.footer.legal)}</h2><ul>${['privacy', 'terms', 'cookies', 'credits'].map(li).join('')}</ul></div>
  </div>
  <div class="ft__bot"><span>${t.h(L.footer.rights)}</span><nav aria-label="${esc(L.ui.languages)}">${langList(loc, key, L)}</nav><span>${esc(L.footer.note)}</span></div>
</footer>`;
}

function orgLd(loc, L) {
  return {
    '@context': 'https://schema.org', '@type': 'TravelAgency', '@id': config.siteUrl + '/#org',
    name: config.brand.name, alternateName: config.brand.nameArabic, url: config.siteUrl + '/', email: config.email,
    description: strip(tokens(L.meta.home.description)),
    logo: config.siteUrl + '/favicon.svg', image: images['home-dawn'] ? `${config.siteUrl}/img/home-dawn-1200.webp` : undefined,
    address: { '@type': 'PostalAddress', streetAddress: `${config.address.venue}, ${config.address.street}`, addressLocality: config.address.city, addressRegion: config.address.area + ', ' + config.address.city, addressCountry: config.address.countryCode },
    areaServed: { '@type': 'Country', name: 'United Arab Emirates' }, availableLanguage: ['en', 'fr', 'de', 'es'],
  };
}

function page({ loc, key, body, heroSlot, heroSizes, over = false, extraLd = [], extraCss = '' }) {
  const L = content[loc];
  const meta = L.meta[key] || L.meta.notFound;
  const title = strip(tokens(meta.title)), desc = strip(tokens(meta.description));
  const r = routeByKey[key];
  const canonical = r ? abs(url(loc, key)) : null;
  const alts = r ? config.locales.map((l) => `<link rel="alternate" hreflang="${l}" href="${abs(url(l, key))}">`).join('') + `<link rel="alternate" hreflang="x-default" href="${abs(url(config.defaultLocale, key))}">` : '';
  const ld = [orgLd(loc, L), ...extraLd];
  const og = heroSlot && images[heroSlot] ? `${config.siteUrl}/img/${heroSlot}-1200.webp` : (images['home-dawn'] ? `${config.siteUrl}/img/home-dawn-1200.webp` : '');
  return `<!doctype html>
<html lang="${loc}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${canonical ? `<link rel="canonical" href="${canonical}">` : ''}${alts}
${r?.noindex || !r ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(config.brand.name)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:locale" content="${L.locale}">${canonical ? `<meta property="og:url" content="${canonical}">` : ''}${og ? `<meta property="og:image" content="${og}">` : ''}<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="${pal.gypsum}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/cormorant-garamond-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/hanken-grotesk-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
${heroSlot ? preload(heroSlot, heroSizes) : ''}
<style>${CSS}${extraCss}</style>
<script>document.documentElement.classList.add('js')</script>
<script type="module" src="${JS_PATH}"></script>
<script type="application/ld+json">${JSON.stringify(ld.length === 1 ? ld[0] : ld).replace(/</g, '\\u003c')}</script>
</head>
<body>
${header(loc, key, L, over)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(loc, key, L)}
</body>
</html>`;
}

// ── Shared blocks ───────────────────────────────────────────
const eyebrow = (txt, ar) => `<p class="eyebrow"><span>${txt}</span>${ar ? `<span class="ar" lang="ar" dir="rtl">${ar}</span>` : ''}</p>`;
const heroBlock = (loc, slot, { ey, ar, title, lead, cls = 'hero--inner', tag = 'h1' }) => `<section class="hero ${cls}" data-hero>
  <div class="hero__img">${pic(slot, loc, { eager: true })}</div>
  <div class="hero__txt">${eyebrow(ey, ar)}<${tag} class="hero__title">${title}</${tag}>${lead ? `<div class="hero__row"><p class="hero__lead">${lead}</p></div>` : ''}</div>
</section>`;
const textHead = (ey, title, lead, ar) => `<header class="phd">${eyebrow(ey, ar)}<h1 class="phd__t">${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}</header>`;
const priceLine = (L, key) => { const v = config.prices[key]; return `${esc(L.ui.from)} ${v ? `${config.currency} ${Number(v).toLocaleString('en-US')} ${esc(L.ui.perPerson)}` : `— ${esc(L.ui.onRequest)}`}`; };

// ── Pages ───────────────────────────────────────────────────
function homePage(loc) {
  const L = content[loc], t = mkT(loc), H = L.home;
  const featImgs = ['liwa-oasis', 'journal-ramadan', 'fujairah-coast'];
  const body = `
<section class="pan" data-hero aria-label="${t.p(H.heroTitle)}">
  <div class="pan__stick">
    <div class="pan__layer pan__dawn">${pic('home-hero', loc, { eager: true })}
      <div class="hero__txt">${eyebrow(esc(H.heroEyebrow), 'الإمارات السبع')}<h1 class="hero__title">${t.h(H.heroTitle)}</h1>
      <div class="hero__row"><p class="hero__lead">${t.h(H.heroLead)}</p><span class="hero__scroll" aria-hidden="true">${esc(H.heroScroll)}</span></div></div>
    </div>
    <div class="pan__layer pan__dusk">${pic('home-dusk', loc)}
      <div class="hero__txt">${eyebrow(esc(H.duskEyebrow), 'الربع الخالي')}<h2 class="pan__dusk-title">${t.h(H.duskTitle)}</h2></div>
    </div>
  </div>
</section>

<section class="wrap sec">
  <div class="tower-rule mb-l" aria-hidden="true">${towerSvg('motif')}</div>
  <div class="state-wrap" data-reveal>
    <p class="state">${t.h(H.intro)}</p>
    <p class="state-meta state-meta--right">${t.h(H.introSub)}</p>
  </div>
</section>
${dune()}
<section class="wrap sec" aria-labelledby="feat-h">
  <h2 id="feat-h" class="sr">${esc(H.featuresEyebrow)}</h2>
  ${eyebrow(esc(H.featuresEyebrow))}
  <div class="duo">
    ${H.features.map((f, i) => {
      const cls = i === 0 ? 'duo__a' : i === 1 ? 'duo__b' : 'duo__wide';
      const ratio = i === 0 ? 'r-32' : i === 1 ? 'r-34' : 'r-21';
      const sizes = i === 0 ? '(min-width: 900px) 66vw, 100vw' : i === 1 ? '(min-width: 900px) 33vw, 100vw' : '(min-width: 900px) 66vw, 100vw';
      return `<a class="card ${cls}" href="${t.link(f.link)}" data-reveal>${ph(featImgs[i], loc, ratio, { sizes })}<div class="card__body"><p class="card__ey">${esc(f.eyebrow)}</p><h3 class="card__t">${t.h(f.title)}</h3><p class="card__p">${t.h(f.text)}</p><span class="link">${esc(L.ui.discover)}</span></div></a>`;
    }).join('')}
  </div>
</section>

<section class="band sec" aria-labelledby="pl-h">
  <div class="rail" data-rail>
    <div class="rail__head">${eyebrow(esc(H.placesEyebrow))}<h2 id="pl-h" class="h2 mb-m">${t.h(H.placesTitle)}</h2><p class="muted">${t.h(H.placesText)}</p></div>
    <div class="rail__track" tabindex="0" role="region" aria-label="${esc(H.placesTitle)}">
      ${places.map((p) => `<a class="card" href="${url(loc, p.key)}">${ph(p.hero, loc, 'r-45', { sizes: '(min-width: 900px) 300px, 78vw' })}<p class="card__ey"><span class="ar" lang="ar" dir="rtl">${p.ar}</span></p><h3 class="card__t">${esc(L.nav[p.key])}</h3><p class="card__p">${esc(L.places[p.key].title)}</p><span class="link">${esc(L.ui.discover)}</span></a>`).join('')}
    </div>
    <div class="rail__ctl"><button class="rail__btn" type="button" data-prev aria-label="${esc(L.ui.previous)}">${arrow('l')}</button><button class="rail__btn" type="button" data-next aria-label="${esc(L.ui.next)}">${arrow('r')}</button><div class="rail__bar" aria-hidden="true"><span></span></div></div>
  </div>
</section>

<section class="wrap sec">
  <div class="state-wrap" data-reveal><p class="state state--wide">${t.h(H.statement)}</p><p class="state-meta">— ${esc(H.statementSource)}</p></div>
</section>

<section class="sec--tight" aria-labelledby="jr-h" style="padding-top:0">
  <div class="wrap mb-m">${eyebrow(esc(H.journeysEyebrow))}<h2 id="jr-h" class="h2">${t.h(H.journeysTitle)}</h2><p class="muted mt-s">${t.h(H.journeysText)}</p></div>
  <div class="panels">
    ${L.journeys.list.map((j) => `<a class="pnl" href="${url(loc, 'journeys')}#${j.key}">${ph(j.img, loc, '', { sizes: '(min-width: 900px) 60vw, 84vw' })}<span class="pnl__t">${esc(j.title)}</span><span class="pnl__mini" aria-hidden="true">${esc(j.title)}</span><span class="pnl__b"><span class="pnl__meta"><span>${j.nights} ${esc(L.ui.nights)}</span><span>${esc(j.season)}</span></span>${esc(j.summary)}</span></a>`).join('')}
  </div>
  <div class="wrap mt-m"><a class="link" href="${url(loc, 'journeys')}">${esc(L.nav.journeys)}</a></div>
</section>

<section class="wrap sec">
  <div class="split">
    <div class="split__img">${ph('alain-hero', loc, 'r-32 arish', { sizes: '(min-width: 900px) 70vw, 100vw' })}</div>
    <div class="split__txt" data-reveal>${eyebrow(esc(H.storyEyebrow))}<h2 class="h2 mb-m">${t.h(H.storyTitle)}</h2><p>${t.h(H.storyText)}</p><a class="link" href="${url(loc, 'about')}">${esc(H.storyLink)}</a></div>
  </div>
</section>

<div class="mq" aria-hidden="true"><div class="mq__in">${[0, 1].map(() => ['abudhabi', 'dubai', 'sharjah', 'ajman', 'uaq', 'rak', 'fujairah'].map((k, i) => `<span>${esc(H.marquee[i])}</span><span class="ar" lang="ar">${arName[k]}</span>`).join('')).join('')}</div></div>

<section class="wrap sec" aria-labelledby="jn-h">
  ${eyebrow(esc(H.journalEyebrow))}<h2 id="jn-h" class="sr">${esc(L.nav.journal)}</h2>
  <ul class="route" style="counter-reset:r">
    ${L.journal.posts.map((p) => `<li><b><a href="${url(loc, 'journal')}#${p.key}" style="text-decoration:none">${t.h(p.title)}</a></b><span class="muted">${esc(p.date)}</span></li>`).join('')}
  </ul>
</section>`;
  return page({ loc, key: 'home', body, heroSlot: 'home-hero', over: true });
}

function placePage(loc, p, i) {
  const L = content[loc], t = mkT(loc), P = L.places[p.key];
  const next = places[(i + 1) % places.length];
  const body = `
${heroBlock(loc, p.hero, { ey: esc(P.eyebrow), ar: p.ar, title: t.h(P.title) })}
<section class="wrap sec">
  <div class="state-wrap" data-reveal><p class="state">${t.h(P.intro)}</p></div>
  <dl class="facts mt-l">
    <div><dt>${esc(L.ui.bestMonths)}</dt><dd>${esc(P.best)}</dd></div>
    <div><dt>${esc(L.ui.timeNeeded)}</dt><dd>${esc(P.time)}</dd></div>
    <div><dt>${esc(L.ui.fromDubai)}</dt><dd>${p.drive.dubai ? fmtMin(p.drive.dubai, L) : '—'}</dd></div>
    <div><dt>${esc(L.ui.fromAbuDhabi)}</dt><dd>${p.drive.abudhabi ? fmtMin(p.drive.abudhabi, L) : '—'}${p.key === 'sbi' ? ` <small class="muted">(+ ${fmtMin(20, L)})</small>` : ''}</dd></div>
  </dl>
</section>
<section class="wrap sec--tight">
  ${p.split ? `<div class="split">
    <div class="split__img">${ph(p.split, loc, 'r-32 arish', { sizes: '(min-width: 900px) 70vw, 100vw' })}</div>
    <div class="split__txt" data-reveal>${eyebrow(esc(L.nav[p.key]), p.ar)}<p style="font-size:1rem;color:var(--charcoal)">${t.h(P.body)}</p></div>
  </div>` : `<div class="note" data-reveal><div>${eyebrow(esc(L.nav[p.key]), p.ar)}</div><div><p style="font-size:1.0625rem">${t.h(P.body)}</p></div></div>`}
</section>
${dune()}
<section class="wrap sec" aria-label="${esc(L.ui.explore)}">
  <div class="hl">
    ${P.highlights.map((h, n) => `<article class="hl__row" data-reveal>${ph(p.hl[n], loc, n === 1 ? 'r-45' : 'r-32', { sizes: '(min-width: 900px) 58vw, 100vw' })}<div class="hl__txt"><span class="hl__n">0${n + 1}</span><h2 class="hl__t">${t.h(h.title)}</h2><p class="hl__p">${t.h(h.text)}</p></div></article>`).join('')}
  </div>
</section>
<section class="band sec--tight">
  <div class="wrap">
    <div class="note"><div>${eyebrow(esc(L.ui.summerNote))}<h2>${esc(P.best)}</h2></div><div><p>${t.h(P.summer)}</p><a class="link" href="${url(loc, 'season')}">${esc(L.ui.seasonLink)}</a></div></div>
    <div class="note mt-l"><div>${eyebrow(esc(L.ui.stayLink))}</div><div><p>${t.h(P.stays)}</p><a class="link" href="${url(loc, 'stays')}">${esc(L.nav.stays)}</a></div></div>
  </div>
</section>
<a class="next" href="${url(loc, next.key)}">${ph(next.hero, loc, '', { sizes: '100vw', altOverride: '' })}<div class="next__txt">${eyebrow(esc(L.ui.nextPlace), next.ar)}<p class="next__t">${esc(L.nav[next.key])}</p></div></a>`;
  const ld = [{ '@context': 'https://schema.org', '@type': 'TouristDestination', name: L.nav[p.key], description: strip(tokens(L.meta[p.key].description)), url: abs(url(loc, p.key)), image: images[p.hero] ? `${config.siteUrl}/img/${p.hero}-1200.webp` : undefined, containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: L.ui.breadcrumbHome, item: abs(url(loc, 'home')) }, { '@type': 'ListItem', position: 2, name: L.nav[p.key], item: abs(url(loc, p.key)) }] }];
  return page({ loc, key: p.key, body, heroSlot: p.hero, over: true, extraLd: ld });
}

function seasonPage(loc) {
  const L = content[loc], t = mkT(loc), S = L.season;
  const goodNow = { cool: ['liwa', 'alain', 'hatta', 'sbi', 'rak', 'fujairah', 'ajman'], shoulder: ['sharjah', 'abudhabi', 'dubai', 'rak', 'fujairah', 'ajman'] };
  const placeLinks = (keys) => `<ul>${keys.map((k) => `<li><a href="${url(loc, k)}">${esc(L.nav[k])}</a></li>`).join('')}</ul>`;
  const panes = S.months.map((mName, m) => {
    const dub = band(regions[0].highs[m], true, m), ain = regions.find((r) => r.key === 'alain').highs[m];
    const hot = dub.level >= 3 || ain >= 41;
    const camp = campSeason.closed.includes(m) ? S.campClosed : campSeason.shoulder.includes(m) ? S.campShoulder : S.campOpen;
    const cool = [10, 11, 0, 1, 2].includes(m);
    const listBlock = hot
      ? `<div><h3>${esc(S.saveTitle)}</h3><p>${t.h(S.saveText)}</p>${placeLinks(coolMonthPlaces)}</div>`
      : `<div><h3>${esc(S.goodTitle)}</h3><p>${t.h(S.goodText)}</p>${placeLinks(cool ? goodNow.cool : goodNow.shoulder)}</div>`;
    return `<section class="pane" id="p${m}" aria-labelledby="ph${m}">
  <h2 class="pane__h" id="ph${m}">${esc(cap(mName))}</h2>
  ${hot ? `<div class="warn" role="note"><h3>${esc(S.hotTitle)}</h3><p>${t.h(S.hotText.replace('{month}', mName))}</p></div>` : ''}
  <table class="tbl"><thead><tr><th scope="col">${esc(S.colRegion)}</th><th scope="col">${esc(S.colHigh)}</th><th scope="col">${esc(S.colHours)}</th><th scope="col">${esc(S.colWindow)}</th><th scope="col">${esc(S.colSea)}</th></tr></thead><tbody>
  ${regions.map((r) => { const b = band(r.highs[m], r.humid, m); return `<tr><td>${esc(S.regionNames[r.key])}</td><td data-l="${esc(S.colHigh)}">${r.highs[m]}°C</td><td data-l="${esc(S.colHours)}">${esc(S.levels[b.level])}<br><span class="muted">${esc(S.hoursUnit.replace('{n}', b.hours))}</span><span class="bar bar--${b.level}" aria-hidden="true"><i style="width:${b.hours * 10}%"></i></span></td><td data-l="${esc(S.colWindow)}">${b.window}</td><td data-l="${esc(S.colSea)}">${r.sea ? r.sea[m] + '°C' : S.noSea}</td></tr>`; }).join('')}
  </tbody></table>
  <div class="cols3">
    <div><h3>${esc(S.campTitle)}</h3><p>${t.h(camp)}</p></div>
    ${listBlock}
    ${m === 1 || m === 2 ? `<div><h3>${esc(L.nav.ramadan)}</h3><p>${t.h(S.ramadanNote)}</p></div>` : ''}
  </div>
</section>`;
  }).join('');
  const extraCss = S.months.map((_, m) => `.season:has(#m${m}:checked) #p${m}{display:block}`).join('') + '.season:not(:has(input:checked)) #p0{display:block}';
  const body = `
${heroBlock(loc, 'liwa-oasis', { ey: esc(S.eyebrow), ar: 'الطقس والمواسم', title: t.h(S.title), lead: t.h(S.lead), cls: 'hero--short' })}
<section class="wrap sec season" data-season>
  <fieldset class="picker"><legend>${esc(S.chooseMonth)}</legend>
    ${S.monthsShort.map((s, m) => `<input type="radio" name="month" id="m${m}" value="${m}"${m === 0 ? ' checked' : ''}><label for="m${m}"><span aria-hidden="true">${esc(cap(s))}</span><span class="sr">${esc(cap(S.months[m]))}</span></label>`).join('')}
  </fieldset>
  <div aria-live="polite">${panes}</div>
</section>
<section class="wrap sec--tight"><div class="doc"><h2>${esc(S.method)}</h2><div><p>${t.h(S.methodText)}</p></div></div></section>`;
  return page({ loc, key: 'season', body, heroSlot: 'liwa-oasis', over: true, extraCss });
}

function drivePage(loc) {
  const L = content[loc], t = mkT(loc), D = L.drive;
  const tgt = Object.fromEntries(driveTargets.map((d) => [d.key, d]));
  const panes = ['dubai', 'abudhabi'].map((base) => {
    const rt = routes[base];
    const overnightKeys = new Set(rt.overnight.flatMap((o) => o.stops));
    const rows = [...driveTargets].sort((a, b) => a[base] - b[base]).map((d) => {
      const isBase = d[base] === 0;
      const type = isBase ? `<span class="pill pill--base">${esc(D.base)}</span>` : rt.day.includes(d.key) && !overnightKeys.has(d.key) ? `<span class="pill pill--day">${esc(D.dayTrip)}</span>` : `<span class="pill pill--night">${esc(D.overnight)}</span>`;
      return `<tr><td><a href="${url(loc, placeByKey[Object.keys(placeByKey).find((k) => placeByKey[k].slug === d.slug)].key)}">${esc(D.targets[d.key])}</a></td><td data-l="${esc(D.colTime)}">${isBase ? '—' : fmtMin(d[base], L)}${d.boat ? `<br><span class="muted">${esc(D.boat.replace('{n}', d.boat))}</span>` : ''}</td><td data-l="${esc(D.colType)}">${type}</td></tr>`;
    }).join('');
    const total = rt.overnight.reduce((s, o) => s + o.nights, 0) + baseNights[base];
    return `<section class="pane" id="b-${base}" aria-labelledby="bh-${base}">
  <h2 class="pane__h" id="bh-${base}">${esc(D.bases[base])}</h2>
  <div class="split" style="align-items:start">
    <div style="grid-column:1 / span 7"><table class="tbl"><thead><tr><th scope="col">${esc(D.colPlace)}</th><th scope="col">${esc(D.colTime)}</th><th scope="col">${esc(D.colType)}</th></tr></thead><tbody>${rows}</tbody></table></div>
    <div style="grid-column:9 / span 4">
      <h3 class="card__t">${esc(D.dayTitle)}</h3>
      <p>${rt.day.map((k) => `${esc(D.targets[k])} <span class="muted">(${fmtMin(tgt[k][base], L)})</span>`).join(' · ')}</p>
      <h3 class="card__t mt-m">${esc(D.overnightTitle)}</h3>
      <ol class="route">
        <li><b>${esc(D.bases[base])}</b><span class="muted">${baseNights[base]} ${esc(L.ui.nights)}</span></li>
        ${rt.overnight.map((o) => `<li><b>${o.stops.map((k) => esc(D.targets[k])).join(' & ')}</b><span class="muted">${o.nights} ${esc(o.nights === 1 ? L.ui.night : L.ui.nights)}</span></li>`).join('')}
      </ol>
      <p class="mt-s"><strong>${esc(D.total.replace('{n}', total))}</strong></p>
      <p class="muted">${t.h(D.routeLead)}</p>
    </div>
  </div>
</section>`;
  }).join('');
  const extraCss = '.drive:has(#base-dubai:checked) #b-dubai,.drive:has(#base-abudhabi:checked) #b-abudhabi{display:block}@media(min-width:900px){.drive .split{grid-template-columns:repeat(12,minmax(0,1fr))}}@media(max-width:899px){.drive .split>div{grid-column:auto!important}}';
  const body = `
${heroBlock(loc, 'fujairah-coast', { ey: esc(D.eyebrow), ar: 'الإمارات السبع', title: t.h(D.title), lead: t.h(D.lead), cls: 'hero--short' })}
<section class="wrap sec drive">
  <fieldset class="picker"><legend>${esc(D.chooseBase)}</legend>
    <input type="radio" name="base" id="base-dubai" value="dubai" checked><label for="base-dubai">${esc(D.bases.dubai)}</label>
    <input type="radio" name="base" id="base-abudhabi" value="abudhabi"><label for="base-abudhabi">${esc(D.bases.abudhabi)}</label>
  </fieldset>
  <div aria-live="polite">${panes}</div>
  <div class="doc mt-l"><h2>${esc(D.routeTitle)}</h2><div><p>${t.h(D.rule)}</p><p class="muted">${t.h(D.note)}</p></div></div>
</section>`;
  return page({ loc, key: 'drive', body, heroSlot: 'fujairah-coast', over: true, extraCss });
}

function ramadanPage(loc) {
  const L = content[loc], t = mkT(loc), R = L.ramadan;
  const body = `
${heroBlock(loc, 'journal-ramadan', { ey: esc(R.eyebrow), ar: 'رمضان', title: t.h(R.title), lead: t.h(R.lead), cls: 'hero--short' })}
<section class="wrap sec">
  <div class="doc" style="border-top:0"><div>${eyebrow(esc(R.datesTitle), 'رمضان والعيد')}<p class="muted">${t.h(R.datesNote)}</p></div>
  <dl class="dates">${R.dates.map((d) => `<div><dt>${esc(d.label)}</dt><dd>${esc(d.date)}</dd></div>`).join('')}</dl></div>
</section>
${dune()}
<section class="wrap sec--tight">
  ${R.sections.map((s) => `<div class="doc" data-reveal><h2>${t.h(s.title)}</h2><ul>${s.items.map((i) => `<li>${t.h(i)}</li>`).join('')}</ul></div>`).join('')}
</section>
<section class="band sec">
  <div class="wrap state-wrap"><p class="state">${t.h(R.closingText)}</p><p class="state-meta">— ${esc(R.closingTitle)}</p></div>
  <div class="wrap mt-l"><p class="muted" style="font-size:var(--fs-small)">${t.h(R.disclaimer)}</p></div>
</section>`;
  return page({ loc, key: 'ramadan', body, heroSlot: 'journal-ramadan', over: true });
}

function journeysPage(loc) {
  const L = content[loc], t = mkT(loc), J = L.journeys;
  const body = `
${heroBlock(loc, 'liwa-hero', { ey: esc(J.eyebrow), ar: 'رحلات', title: t.h(J.title), lead: t.h(J.lead), cls: 'hero--short' })}
<section class="wrap">
  ${J.list.map((j) => `<article class="jr" id="${j.key}">
    <div class="jr__img">${ph(j.img, loc, 'r-32', { sizes: '(min-width: 900px) 60vw, 100vw', altOverride: strip(j.title) })}</div>
    <div class="jr__body" data-reveal><h2 class="jr__t">${t.h(j.title)}</h2>
      <dl><dt>${esc(J.dayLabel)}</dt><dd>${j.nights + 1}</dd><dt>${esc(J.seasonLabel)}</dt><dd>${esc(j.season)}</dd><dt>${esc(J.priceLabel)}</dt><dd>${priceLine(L, j.key)}</dd></dl>
      <p>${t.h(j.summary)}</p>
      <ul class="jr__days">${j.days.map((d) => `<li>${t.h(d)}</li>`).join('')}</ul>
      <a class="btn" href="${url(loc, 'enquire')}?journey=${j.key}">${esc(J.enquire)}</a>
    </div>
  </article>`).join('')}
</section>`;
  return page({ loc, key: 'journeys', body, heroSlot: 'liwa-hero', over: true });
}

function staysPage(loc) {
  const L = content[loc], t = mkT(loc), S = L.stays;
  const body = `
${textHead(esc(S.eyebrow), t.h(S.title), t.h(S.lead), 'إقامات')}
<section class="wrap sec" style="padding-top:0">
  <div class="stays">
    ${S.list.map((s, i) => `<article class="card" data-reveal>${ph(s.img, loc, [0, 3].includes(i % 4) ? 'r-32' : 'r-45', { sizes: [0, 3].includes(i % 4) ? '(min-width: 900px) 66vw, 100vw' : '(min-width: 900px) 33vw, 100vw', altOverride: s.where })}<p class="card__ey">${esc(s.where)}</p><h2 class="card__t">${esc(s.name)}</h2><p class="card__p">${t.h(s.text)}</p><p class="card__p"><strong>${priceLine(L, 'stay')}</strong></p></article>`).join('')}
  </div>
  <p class="muted mt-l" style="font-size:var(--fs-small)">${t.h(S.priceNote)}</p>
</section>`;
  return page({ loc, key: 'stays', body });
}

function aboutPage(loc) {
  const L = content[loc], t = mkT(loc), A = L.about;
  const body = `
${heroBlock(loc, 'detail-windtower', { ey: esc(A.eyebrow), ar: 'البرجيل', title: t.h(A.title) })}
<section class="wrap sec"><div class="state-wrap" data-reveal><p class="state">${t.h(A.lead)}</p></div></section>
${dune()}
<section class="wrap sec--tight">${A.sections.map((s) => `<div class="doc" data-reveal><h2>${t.h(s.title)}</h2><div><p>${t.h(s.text)}</p></div></div>`).join('')}</section>
<section class="wrap sec">
  <div class="split"><div class="split__img">${ph('detail-arish', loc, 'r-32 arish', { sizes: '(min-width: 900px) 70vw, 100vw' })}</div>
  <div class="split__txt" data-reveal>${eyebrow(esc(A.promiseTitle))}<ul class="jr__days">${A.promise.map((p) => `<li>${t.h(p)}</li>`).join('')}</ul><a class="btn mt-s" href="${url(loc, 'enquire')}">${esc(L.ui.enquire)}</a></div></div>
</section>`;
  return page({ loc, key: 'about', body, heroSlot: 'detail-windtower', over: true });
}

function journalPage(loc) {
  const L = content[loc], t = mkT(loc), J = L.journal;
  const body = `
${textHead(esc(J.eyebrow), t.h(J.title), t.h(J.lead))}
<section class="wrap" style="padding-bottom:var(--sec)">
  ${J.posts.map((p) => `<article class="post" id="${p.key}">${ph(p.img, loc, 'r-45 arish', { sizes: '(min-width: 900px) 40vw, 100vw' })}<div class="post__txt" data-reveal>${eyebrow(esc(p.date))}<h2 class="post__t">${t.h(p.title)}</h2>${p.text.map((x) => `<p>${t.h(x)}</p>`).join('')}</div></article>`).join('')}
</section>`;
  return page({ loc, key: 'journal', body });
}

function enquirePage(loc) {
  const L = content[loc], t = mkT(loc), E = L.enquire, F = E.fields;
  const months = L.season.months;
  const body = `
<div class="enq">
  <div class="enq__img" aria-hidden="true">${ph('dubai-fahidi', loc, '', { sizes: '42vw', altOverride: '' })}</div>
  <div class="enq__body">
    ${eyebrow(esc(E.eyebrow), 'استفسار')}<h1 class="phd__t">${t.h(E.title)}</h1><p class="lead mb-l">${t.h(E.lead)}</p>
    <form class="form" method="post" action="${config.formEndpoint}" data-enquiry data-ajax="${config.formAjaxEndpoint}" data-thanks="${url(loc, 'thanks')}" data-sending="${t.p(F.sending)}" data-err-required="${t.p(E.errors.required)}" data-err-email="${t.p(E.errors.email)}" data-err-consent="${t.p(E.errors.consent)}" data-err-generic="${t.p(E.errors.generic)}" novalidate>
      <input type="hidden" name="_subject" value="${t.p(E.subject)}">
      <input type="hidden" name="_next" value="${abs(url(loc, 'thanks'))}">
      <input type="hidden" name="_template" value="table">
      <input type="hidden" name="_captcha" value="false">
      <input type="hidden" name="language" value="${loc}">
      <input type="hidden" name="journey" value="">
      <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="form__2">
        <div class="fld"><label for="f-name">${esc(F.name)} <span class="req" aria-hidden="true">*</span></label><input id="f-name" name="name" type="text" autocomplete="name" required></div>
        <div class="fld"><label for="f-email">${esc(F.email)} <span class="req" aria-hidden="true">*</span></label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="form__2">
        <div class="fld"><label for="f-country">${esc(F.country)}</label><input id="f-country" name="country" type="text" autocomplete="country-name"></div>
        <div class="fld"><label for="f-month">${esc(F.month)}</label><select id="f-month" name="month"><option value="">${esc(F.monthPlaceholder)}</option>${months.map((m) => `<option>${esc(cap(m))}</option>`).join('')}<option>${esc(F.flexible)}</option></select></div>
      </div>
      <div class="form__2">
        <div class="fld"><label for="f-nights">${esc(F.nights)}</label><input id="f-nights" name="nights" type="number" min="1" max="60" inputmode="numeric"></div>
        <div class="fld"><label for="f-trav">${esc(F.travellers)}</label><input id="f-trav" name="travellers" type="number" min="1" max="30" inputmode="numeric"></div>
      </div>
      <div class="fld"><fieldset><legend>${esc(F.interests)}</legend><div class="chips">${F.interestOptions.map((o, i) => `<input type="checkbox" id="f-i${i}" name="interests" value="${esc(o)}"><label for="f-i${i}">${esc(o)}</label>`).join('')}</div></fieldset></div>
      <div class="fld"><label for="f-base">${esc(F.base)}</label><select id="f-base" name="base">${F.baseOptions.map((o) => `<option>${esc(o)}</option>`).join('')}</select></div>
      <div class="fld"><label for="f-msg">${esc(F.message)}</label><textarea id="f-msg" name="message" rows="5"></textarea></div>
      <label class="check"><input type="checkbox" name="consent" value="yes" required> <span>${t.h(F.consent)} <span class="req" aria-hidden="true">*</span></span></label>
      <p class="muted" style="font-size:.8rem;margin:0"><span class="req" aria-hidden="true">*</span> ${esc(F.required)}</p>
      <div class="msg msg--ok" role="status" tabindex="-1">${t.h(E.success)}</div>
      <div class="msg msg--err" role="alert" tabindex="-1"></div>
      <div><button class="btn" type="submit">${esc(F.submit)}</button></div>
      <p class="muted" style="font-size:var(--fs-small)">${t.h(E.direct)}</p>
    </form>
  </div>
</div>`;
  return page({ loc, key: 'enquire', body });
}

function simplePage(loc, key, { ey, title, html, ar }) {
  const body = `${textHead(ey, title, '', ar)}<section class="wrap" style="padding-bottom:var(--sec)">${html}</section>`;
  return page({ loc, key, body });
}
function thanksPage(loc) {
  const L = content[loc], t = mkT(loc), T = L.thanks;
  return simplePage(loc, 'thanks', { ey: esc(T.eyebrow), title: t.h(T.title), html: `<p class="lead">${t.h(T.text)}</p><a class="link mt-s" href="${url(loc, 'season')}">${esc(T.link)}</a>` });
}
function legalPage(loc, key) {
  const L = content[loc], t = mkT(loc), G = L.legal[key];
  const html = `<p class="muted mb-l">${esc(L.legal.updated)}</p>${G.sections.map((s) => `<div class="doc"><h2>${t.h(s.h)}</h2><div class="prose">${s.p.map((x) => `<p>${t.h(x)}</p>`).join('')}</div></div>`).join('')}`;
  return simplePage(loc, key, { ey: esc(config.brand.name), title: t.h(G.title), html });
}
function creditsPage(loc) {
  const L = content[loc], t = mkT(loc), C = L.credits;
  const cc = Object.entries(images).filter(([, im]) => im.credit && im.credit.attribution);
  const html = `<p class="lead mb-l">${t.h(C.lead)}</p><table class="tbl credits"><thead><tr><th scope="col">${esc(C.usedOn)}</th><th scope="col">${esc(C.photo)}</th><th scope="col">${esc(C.licence)}</th><th scope="col">${esc(C.source)}</th></tr></thead><tbody>${cc.map(([slot, im]) => `<tr><td>${esc(alt(loc, slot) || im.credit.place)}</td><td data-l="${esc(C.photo)}">“${esc(im.credit.title)}” ${esc(C.by)} ${esc(im.credit.author)}</td><td data-l="${esc(C.licence)}">${im.credit.license_url ? `<a href="${esc(im.credit.license_url)}" rel="license noopener">${esc(im.credit.license)}</a>` : esc(im.credit.license)}</td><td data-l="${esc(C.source)}"><a href="${esc(im.credit.source_url)}" rel="noopener">Wikimedia Commons</a></td></tr>`).join('')}</tbody></table><p class="muted mt-m" style="font-size:var(--fs-small)">${t.h(C.none)}</p>`;
  return simplePage(loc, 'credits', { ey: esc(C.eyebrow), title: t.h(C.title), html });
}
function notFoundPage(loc) {
  const L = content[loc], t = mkT(loc), N = L.notFound;
  const body = `${textHead('404', t.h(N.title), t.h(N.text))}<section class="wrap" style="padding-bottom:var(--sec)"><a class="btn" href="${url(loc, 'home')}">${esc(N.link)}</a></section>`;
  return page({ loc, key: 'notFound', body });
}

// ── Write ───────────────────────────────────────────────────
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(ROOT, 'public'), DIST, { recursive: true });
mkdirSync(join(DIST, 'assets'), { recursive: true });
writeFileSync(join(DIST, JS_PATH), jsRaw);

const out = (loc, key, html) => {
  const dir = join(DIST, loc === config.defaultLocale ? '' : loc, routeByKey[key].path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
};
let count = 0;
for (const loc of config.locales) {
  out(loc, 'home', homePage(loc));
  places.forEach((p, i) => out(loc, p.key, placePage(loc, p, i)));
  out(loc, 'season', seasonPage(loc));
  out(loc, 'drive', drivePage(loc));
  out(loc, 'ramadan', ramadanPage(loc));
  out(loc, 'journeys', journeysPage(loc));
  out(loc, 'stays', staysPage(loc));
  out(loc, 'about', aboutPage(loc));
  out(loc, 'journal', journalPage(loc));
  out(loc, 'enquire', enquirePage(loc));
  out(loc, 'thanks', thanksPage(loc));
  for (const k of ['privacy', 'terms', 'cookies']) out(loc, k, legalPage(loc, k));
  out(loc, 'credits', creditsPage(loc));
  count += ROUTES.length;
  if (loc !== config.defaultLocale) { mkdirSync(join(DIST, loc), { recursive: true }); writeFileSync(join(DIST, loc, '404.html'), notFoundPage(loc)); }
}
writeFileSync(join(DIST, '404.html'), notFoundPage('en'));

// Sitemap + robots
const sm = ROUTES.filter((r) => !r.noindex).flatMap((r) => config.locales.map((loc) => `<url><loc>${abs(url(loc, r.key))}</loc>${config.locales.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${abs(url(l, r.key))}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${abs(url('en', r.key))}"/></url>`)).join('');
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${sm}</urlset>`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
console.log(`Built ${count} pages in ${config.locales.length} languages → dist/`);
