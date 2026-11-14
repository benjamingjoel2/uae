// Climate guidance for the heat-and-season planner.
// Average daily HIGH air temperature (°C) and average sea-surface temperature (°C), Jan→Dec.
// Rounded long-term averages compiled for planning; verify before publishing (FACTS-TO-VERIFY.md).

export const regions = [
  { key: 'dubai', coast: true, humid: true, highs: [24, 25, 28, 33, 37, 39, 41, 41, 38, 35, 30, 26], sea: [22, 21, 23, 25, 28, 31, 32, 33, 32, 30, 27, 24] },
  { key: 'abudhabi', coast: true, humid: true, highs: [24, 26, 29, 34, 39, 41, 42, 42, 40, 36, 30, 26], sea: [22, 21, 23, 26, 29, 32, 33, 33, 32, 30, 27, 24] },
  { key: 'alain', coast: false, humid: false, highs: [24, 26, 30, 36, 41, 44, 45, 45, 42, 37, 31, 26], sea: null },
  { key: 'liwa', coast: false, humid: false, highs: [24, 26, 30, 36, 41, 45, 46, 46, 43, 38, 31, 26], sea: null },
  { key: 'rak', coast: true, humid: true, highs: [24, 25, 28, 33, 38, 40, 41, 41, 39, 35, 30, 26], sea: [22, 21, 23, 25, 28, 31, 32, 33, 32, 30, 27, 24] },
  { key: 'jais', coast: false, humid: false, highs: [14, 15, 18, 23, 27, 29, 31, 31, 28, 25, 20, 16], sea: null },
  { key: 'fujairah', coast: true, humid: true, highs: [25, 26, 29, 33, 37, 38, 38, 37, 36, 34, 30, 27], sea: [24, 23, 24, 26, 29, 31, 31, 30, 30, 29, 27, 25] },
  { key: 'hatta', coast: false, humid: false, highs: [23, 25, 29, 34, 39, 41, 42, 41, 38, 34, 29, 25], sea: null },
  { key: 'sbi', coast: true, humid: true, highs: [24, 26, 29, 34, 39, 41, 42, 42, 40, 36, 30, 26], sea: [22, 21, 23, 26, 29, 32, 33, 33, 32, 30, 27, 24] },
];

// Comfort bands → hours you can comfortably be outdoors (guidance, not a rule).
// Humid coasts drop one band from July to September (heat index).
export function band(high, humid, month) {
  let t = high + (humid && month >= 6 && month <= 8 ? 3 : 0);
  if (t <= 30) return { level: 0, hours: 10, window: '07:00–18:00' };
  if (t <= 34) return { level: 1, hours: 7, window: '06:30–10:30 · 16:00–19:00' };
  if (t <= 38) return { level: 2, hours: 4, window: '06:00–09:00 · 17:30–19:00' };
  return { level: 3, hours: 2, window: '05:30–07:30 · 19:00–22:00' };
}

// Desert-camp season (most seasonal desert camps), month indexes 0–11.
export const campSeason = { open: [0, 1, 2, 10, 11], shoulder: [3, 9], closed: [4, 5, 6, 7, 8] };

// Places best saved for the cool months (Oct–Apr), shown in summer.
export const coolMonthPlaces = ['liwa', 'alain', 'hatta', 'sbi', 'fujairah'];
