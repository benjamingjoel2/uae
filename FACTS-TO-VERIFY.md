# Facts to verify before launch

Everything below appears on the site in all four languages. It was written from general knowledge and public sources in November 2026. Laws, opening hours and religious dates change, so please check each item against an official source before launch and again every season. Where a fact lives in data rather than copy, the file is named.

## Business details
- [ ] **Business address**: *Servcorp, Level 41, Emirates Towers, Sheikh Zayed Road, Trade Centre 2, Dubai, UAE*. This is Servcorp's flagship coworking floor in Emirates Towers ([TradeArabia announcement](https://www.tradearabia.com/news/EDU_340896.html)). Third-party listings mention Levels 41–42. Confirm the exact level and wording and the PO Box, and confirm you have the right to use this address. (`src/config.mjs`)
- [ ] **Email** barjeeljourneys@tourground.com receives mail, and the FormSubmit activation email has been confirmed (see README).

## Entry and documents (Ramadan & etiquette page)
- [ ] **Visa on arrival / visa-free entry by nationality**. The site says only that "many nationalities" qualify and tells readers to check. Check the current list on the official UAE portal (u.ae / ICP / GDRFA) before adding anything more specific.
- [ ] **Passport validity**: "generally at least six months on arrival."
- [ ] Carrying a passport or a copy between emirates.

## Ramadan and Eid dates (Ramadan & etiquette page, season planner)
- [ ] Ramadan 1448 expected to begin **about Monday 8 February 2027**.
- [ ] Eid al-Fitr **about 9 or 10 March 2027**.
- [ ] Arafat Day and Eid al-Adha **about 15–18 May 2027**.
- [ ] Ramadan 1449 begins **about late January 2028**.
- These are astronomical estimates ([Khaleej Times](https://www.khaleejtimes.com/uae/ramadan-eid-al-fitr-eid-al-adha-2027-likely-dates), [Gulf News](https://gulfnews.com/living-in-uae/ask-us/ramadan-2027-eid-al-fitr-eid-al-adha-uae-public-holidays-1.500712923)). Update each year in `src/content/*.mjs` → `ramadan.dates` and `season.ramadanNote`.

## What changes in Ramadan
- [ ] Daytime eating and drinking in public: the site says many restaurants have served openly since 2021, often behind screens. Check the current guidance for Dubai, Abu Dhabi and Sharjah separately. Sharjah is stricter.
- [ ] Opening hours for government offices, shops and attractions, and the timing of alcohol service in licensed venues during Ramadan.
- [ ] Reduced live music and entertainment during Ramadan.

## Heat and outdoor-hours guidance (season planner)
- [ ] Monthly average highs and sea temperatures (`src/data/climate.mjs`). These are rounded long-term averages for planning; compare with the NCM (National Center of Meteorology) climate normals.
- [ ] Outdoor-comfort bands and hour windows (`band()` in `src/data/climate.mjs`). This is editorial guidance and not medical advice. The 3 °C humidity adjustment for coasts in July–September is a planning heuristic.
- [ ] The "too hot for this" warning shows May–September. Confirm you are happy with the wording in each language.
- [ ] Jebel Jais summit temperatures (about 10 °C cooler than the coast) and winter frost.

## Desert-camp season
- [ ] Most seasonal desert camps open from about October/November to April and close May–September. Check the partners you actually use. (`campSeason` in `src/data/climate.mjs`)

## Mosque visiting
- [ ] **Sheikh Zayed Grand Mosque**: free entry, the online booking/time-slot system, visiting hours (generally morning to late evening, closed to visitors on Friday mornings), Ramadan hours, the dress code (full-length loose clothing; headscarf for women; abayas available), and the facts "82 domes", "more than 1,000 columns" and "one of the largest hand-knotted carpets".
- [ ] **Jumeirah Mosque (Dubai)**: visits through guided programmes. Confirm current tour days.
- [ ] **Al Badiyah Mosque (Fujairah)**: visitors welcome outside prayer times in modest dress. Check the claim that it is "thought to be the oldest mosque in use in the UAE".

## Alcohol, behaviour and the law
- [ ] Legal drinking age 21; alcohol served in licensed venues; drinking or drunkenness in public is an offence; **Sharjah is dry**.
- [ ] Zero tolerance for drink-driving and drugs, including traces in the blood.
- [ ] Photography: photographing people without consent, posting images of others online (cybercrime law), government, military and security sites, airports, and drone registration and permits.
- [ ] Public displays of affection; rude gestures and swearing, including online.

## Medicines
- [ ] Controlled medicines (some painkillers, sleeping pills and ADHD medication): carrying prescriptions, the MOHAP permit requirement for some controlled medicines, and quantity limits. Link to the current MOHAP / EDE guidance before launch.

## Places
- [ ] **Sir Bani Yas Island**: access is by boat from the Jebel Dhanna jetty, and visitors normally need a resort booking. Check boat timings (about 20 min), the wildlife listed (Arabian oryx, sand gazelle, giraffe) and the monastery date (7th–8th century).
- [ ] **Jebel Jais**: the summit road, viewing decks, trails and zip line open year-round. Seasonal closures happen in bad weather. Height about 1,900 m on the UAE side (summit 1,934 m).
- [ ] **Jebel Hafeet**: road about 12 km with 60 bends; height "more than 1,200 m".
- [ ] **Al Ain Oasis**: "more than 147,000 date palms"; the UNESCO listing (Cultural Sites of Al Ain, 2011) includes Hili and Jebel Hafeet tombs.
- [ ] **Jazirat Al Hamra**: families moved away in the 1960s.
- [ ] **Louvre Abu Dhabi / Saadiyat Cultural District**: which museums are open (Zayed National Museum, Guggenheim Abu Dhabi, natureLAB/teamLab Phenomena). The copy deliberately says "the museums that have joined it". Turtle nesting on Saadiyat Beach.
- [ ] **Sharjah**: Heart of Sharjah, Al Hisn fort, Souq Al Arsah, Bait Al Naboodah, Museum of Islamic Civilization, Calligraphy Museum, Sharjah Art Foundation (Arts Area, former vegetable market = "The Flying Saucer"/"Al Mureijah"). Check opening days.
- [ ] **Hatta**: dam lake kayaking, heritage village (two watchtowers), trail network.
- [ ] **Ajman / Umm Al Quwain**: Al Zorah mangroves, Khor Al Beidah, flamingos in winter, Ajman Museum in an 18th-century fort, UAQ fort.
- [ ] **Dibba**: Snoopy Island snorkelling; Dibba sits on the UAE–Oman boundary.
- [ ] **Dubai**: abra crossing price ("a coin"), Coffee Museum in Al Fahidi, dhows trading to Iran and the Horn of Africa.

## Drive times (drive planner, destination pages)
- [ ] All drive times in `src/data/places.mjs` are typical off-peak times by private car from central Dubai and central Abu Dhabi, rounded. Check them with a route planner and adjust. Main values:

| To | From Dubai | From Abu Dhabi |
|---|---|---|
| Sharjah | 30 min | 2 h |
| Ajman | 40 min | 2 h 10 |
| Umm Al Quwain | 55 min | 2 h 25 |
| Hatta | 1 h 20 | 2 h 30 |
| Ras Al Khaimah | 1 h 15 | 2 h 40 |
| Jebel Jais | 1 h 50 | 3 h 10 |
| Fujairah city | 1 h 40 | 2 h 50 |
| Dibba | 1 h 55 | 3 h 10 |
| Abu Dhabi / Dubai | 1 h 30 | 1 h 30 |
| Al Ain | 1 h 30 | 1 h 40 |
| Liwa | 3 h 45 | 2 h 15 |
| Jebel Dhanna (Sir Bani Yas boat) | 3 h 50 + boat | 2 h 30 + boat |

## Legal pages
- [ ] Privacy Policy, Booking Terms and Cookie Policy are complete working texts but are **not legal advice**. Have them reviewed by a UAE lawyer, especially on PDPL compliance, governing law, deposits and cancellation scales, and any DET (Dubai Department of Economy and Tourism) requirements for travel businesses.
