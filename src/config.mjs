// ─────────────────────────────────────────────────────────────
//  BRAND CONFIG — the one file to edit to re-brand the site.
//  Name, contact details, address, palette, fonts and URLs all
//  flow from here into every page, the legal pages and JSON-LD.
// ─────────────────────────────────────────────────────────────

export const config = {
  brand: {
    name: 'Barjeel Journeys',
    nameArabic: 'رحلات البراجيل',
    shortName: 'Barjeel',
    // One-line description used in meta tags and JSON-LD (English; translated copies live in src/content/*)
    tagline: 'All seven emirates, planned properly — timed to the cool months and Ramadan.',
  },

  // The only public contact method. No phone numbers, no messaging links.
  email: 'barjeeljourneys@tourground.com',

  // Business address (flagship premium coworking, Dubai). Check before launch: see FACTS-TO-VERIFY.md
  address: {
    venue: 'Servcorp, Level 41, Emirates Towers',
    street: 'Sheikh Zayed Road',
    area: 'Trade Centre 2',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
  },

  // Canonical site URL (no trailing slash). The production domain format is barjeeljourneys.tourground.com.
  siteUrl: 'https://barjeeljourneys.tourground.com',
  // Live Vercel deployment URL (set after deploy).
  liveUrl: 'https://barjeel-journeys.vercel.app',

  // Enquiry form endpoint. FormSubmit forwards submissions to the email above
  // (the first submission triggers a one-time activation email to that inbox).
  formEndpoint: 'https://formsubmit.co/barjeeljourneys@tourground.com',
  formAjaxEndpoint: 'https://formsubmit.co/ajax/barjeeljourneys@tourground.com',

  // Prices. Never invent a price: leave null and the site shows "From — on request".
  // Set a number (in AED, per person) and it renders as "From AED 12,400".
  currency: 'AED',
  prices: { seven: null, oases: null, mountains: null, ramadan: null, islands: null },

  // Palette — "Wind tower and dune". All text pairs pass WCAG AA (see README).
  palette: {
    gypsum: '#F5F0E7', // gypsum-plaster white (page background)
    plaster: '#EBE3D5', // a shade deeper, for alternating bands
    sand: '#D8C3A1', // coral-stone sand
    stone: '#9C7B57', // darker coral stone (borders / large type only)
    palm: '#36432B', // date-palm green
    falaj: '#1D5A57', // falaj water teal
    ember: '#B5441E', // ember — accent only
    charcoal: '#22201D', // text
    mute: '#5E574E', // secondary text (AA on gypsum)
  },

  fonts: {
    display: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
    text: '"Hanken Grotesk", "Helvetica Neue", Arial, sans-serif',
    arabic: '"Amiri", "Geeza Pro", "Noto Naskh Arabic", serif',
  },

  locales: ['en', 'fr', 'de', 'es'],
  defaultLocale: 'en',
};

export const fullAddress = (a = config.address) =>
  [a.venue, a.street, a.area, a.city, a.country].filter(Boolean).join(', ');
