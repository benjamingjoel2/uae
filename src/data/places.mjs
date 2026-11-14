// Language-neutral data for each destination page. Copy lives in src/content/<locale>.mjs.
// Drive times are typical, unhurried, off-peak times by car from central Dubai / central Abu Dhabi
// (minutes). They are planning guidance only — see FACTS-TO-VERIFY.md.

export const places = [
  { key: 'dubai', slug: 'dubai', ar: 'دبي', hero: 'dubai-hero', imgs: ['dubai-fahidi', 'dubai-souk', 'detail-windtower'], region: 'dubai', drive: { dubai: 0, abudhabi: 90 }, type: 'base' },
  { key: 'abudhabi', slug: 'abu-dhabi', ar: 'أبوظبي', hero: 'abudhabi-hero', imgs: ['abudhabi-mosque-interior', 'abudhabi-hosn', 'abudhabi-louvre'], region: 'abudhabi', drive: { dubai: 90, abudhabi: 0 }, type: 'base' },
  { key: 'alain', slug: 'al-ain', ar: 'العين', hero: 'alain-hero', imgs: ['alain-falaj', 'alain-hafeet', 'alain-fort'], region: 'alain', drive: { dubai: 90, abudhabi: 100 } },
  { key: 'liwa', slug: 'liwa-empty-quarter', ar: 'ليوا والربع الخالي', hero: 'liwa-hero', imgs: ['liwa-oasis', 'home-dusk', 'stays-desert'], region: 'liwa', drive: { dubai: 225, abudhabi: 135 } },
  { key: 'sharjah', slug: 'sharjah', ar: 'الشارقة', hero: 'sharjah-hero', imgs: ['sharjah-museum', 'detail-arish', 'detail-coffee'], region: 'dubai', drive: { dubai: 30, abudhabi: 120 } },
  { key: 'rak', slug: 'ras-al-khaimah', ar: 'رأس الخيمة', hero: 'rak-hero', imgs: ['rak-hamra', 'stays-coast', 'rak-hero'], region: 'rak', drive: { dubai: 75, abudhabi: 160 } },
  { key: 'fujairah', slug: 'fujairah-east-coast', ar: 'الفجيرة', hero: 'fujairah-hero', imgs: ['fujairah-coast', 'stays-coast', 'fujairah-hero'], region: 'fujairah', drive: { dubai: 100, abudhabi: 170 } },
  { key: 'hatta', slug: 'hatta', ar: 'حتا', hero: 'hatta-hero', imgs: ['hatta-village', 'hatta-hero', 'detail-arish'], region: 'hatta', drive: { dubai: 80, abudhabi: 150 } },
  { key: 'ajman', slug: 'ajman-umm-al-quwain', ar: 'عجمان وأم القيوين', hero: 'ajman-hero', imgs: ['uaq-lagoon', 'ajman-hero', 'uaq-lagoon'], region: 'dubai', drive: { dubai: 45, abudhabi: 135 } },
  { key: 'sbi', slug: 'sir-bani-yas', ar: 'جزيرة صير بني ياس', hero: 'sbi-hero', imgs: ['sbi-wildlife', 'sbi-hero', 'sbi-wildlife'], region: 'abudhabi', drive: { dubai: 230, abudhabi: 150 } },
];

// Emirate-level drive table for the drive planner (minutes, one way, typical off-peak).
// "boat" adds a ferry crossing after the drive.
export const driveTargets = [
  { key: 'dubai', slug: 'dubai', emirate: 'dubai', dubai: 0, abudhabi: 90 },
  { key: 'sharjah', slug: 'sharjah', emirate: 'sharjah', dubai: 30, abudhabi: 120 },
  { key: 'ajman', slug: 'ajman-umm-al-quwain', emirate: 'ajman', dubai: 40, abudhabi: 130 },
  { key: 'uaq', slug: 'ajman-umm-al-quwain', emirate: 'uaq', dubai: 55, abudhabi: 145 },
  { key: 'hatta', slug: 'hatta', emirate: 'dubai', dubai: 80, abudhabi: 150 },
  { key: 'rak', slug: 'ras-al-khaimah', emirate: 'rak', dubai: 75, abudhabi: 160 },
  { key: 'jais', slug: 'ras-al-khaimah', emirate: 'rak', dubai: 110, abudhabi: 190 },
  { key: 'fujairah', slug: 'fujairah-east-coast', emirate: 'fujairah', dubai: 100, abudhabi: 170 },
  { key: 'dibba', slug: 'fujairah-east-coast', emirate: 'fujairah', dubai: 115, abudhabi: 190 },
  { key: 'abudhabi', slug: 'abu-dhabi', emirate: 'abudhabi', dubai: 90, abudhabi: 0 },
  { key: 'alain', slug: 'al-ain', emirate: 'abudhabi', dubai: 90, abudhabi: 100 },
  { key: 'liwa', slug: 'liwa-empty-quarter', emirate: 'abudhabi', dubai: 225, abudhabi: 135 },
  { key: 'sbi', slug: 'sir-bani-yas', emirate: 'abudhabi', dubai: 230, abudhabi: 150, boat: 20 },
];

// Suggested route grouping for each base: day trips (return the same day) and overnights (in order).
export const baseNights = { dubai: 3, abudhabi: 2 };

export const routes = {
  dubai: {
    day: ['sharjah', 'ajman', 'uaq', 'hatta'],
    overnight: [
      { stops: ['rak', 'jais'], nights: 2 },
      { stops: ['dibba', 'fujairah'], nights: 2 },
      { stops: ['alain'], nights: 2 },
      { stops: ['liwa'], nights: 2 },
      { stops: ['sbi'], nights: 2 },
      { stops: ['abudhabi'], nights: 2 },
    ],
  },
  abudhabi: {
    day: ['alain'],
    overnight: [
      { stops: ['sbi'], nights: 2 },
      { stops: ['liwa'], nights: 2 },
      { stops: ['dubai', 'sharjah'], nights: 3 },
      { stops: ['ajman', 'uaq'], nights: 1 },
      { stops: ['rak', 'jais'], nights: 2 },
      { stops: ['dibba', 'fujairah'], nights: 1 },
      { stops: ['hatta'], nights: 1 },
    ],
  },
};
