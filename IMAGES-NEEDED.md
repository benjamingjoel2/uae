# Images needed

Every image slot on the site has a correctly located photograph. 20 are high-quality Unsplash photos (Unsplash License, no credit line needed). The home hero is the owner's photo. The rest come from Wikimedia Commons and are credited on `/credits/`. This file lists what to replace or add before launch.

## Still Wikimedia, no confirmed free Unsplash alternative (upgrade first)
The search covered free Unsplash photos whose page confirms the exact place. None was found for these slots, or none good enough:
- `alain-hero` (Al Ain Oasis palms) and `alain-falaj` (Al Ain falaj)
- `abudhabi-hosn` (Qasr Al Hosn): the only Unsplash option was a harsh midday shot dominated by towers
- `sharjah-hero` (Heart of Sharjah) and `sharjah-museum` (Sharjah Art Foundation)
- `ajman-hero` (Ajman / Umm Al Quwain mangroves)
- `rak-hamra` (Jazirat Al Hamra)
- `fujairah-hero` (Al Badiyah Mosque) and `fujairah-coast` (Fujairah Fort)
- `sbi-hero` and `sbi-wildlife` (Sir Bani Yas Island): request images from the island's operator
- `home-dawn` (Al Fahidi, used in the menu and the first sample journey) and `home-dusk` (Liwa sunset)

Good next sources: the Department of Culture and Tourism Abu Dhabi and Dubai DET media libraries, Sharjah Commerce and Tourism, Visit Ras Al Khaimah, and Fujairah Tourism. All issue images for travel-trade use; check the terms.

## Venues (no venue photos are used yet)
The site does not name real hotels, lodges, restaurants or cafés. The six stays on `/stays/` are **placeholder names**, each illustrated with a photo of the location (not of a venue). When real partners are confirmed, use only images you are clearly allowed to use:
- the venue's media kit or press terms,
- a booking-platform partner feed, or
- Creative Commons images.

Never copy images from a venue's own website.

| Placeholder | Location photo used | Needed |
|---|---|---|
| The Courtyard House | Al Fahidi lane, Dubai | Partner heritage house, from its media kit |
| Dune Line Retreat | Liwa dunes | Partner desert retreat, from its media kit |
| Falaj Farm | Falaj in Al Ain Oasis | Partner farm stay, from its media kit |
| Ridge Lodge | Jebel Jais road | Partner mountain lodge, from its media kit |
| East Bay House | Beach near Snoopy Island, Dibba coast | Partner beach property, from its media kit |
| Island Camp | Sir Bani Yas panorama | Sir Bani Yas resort, from its press/media kit |

## Upgrades worth making (all current photos are acceptable)
- **Home hero (`home-hero`, Qasr Al Watan main facade)**: supplied by the owner at 500 px and AI-upscaled to 2738×4096 (Higgsfield). If the original full-size photo turns up, replace it with `npm run images -- <folder> --force`.
- **Sheikh Zayed Grand Mosque exterior (`abudhabi-hero`)**: the current shot is down the approach avenue, with the domes small in the frame. The mosque's media centre issues images for editorial and tourism use; request a full exterior.
- **Louvre Abu Dhabi (`abudhabi-louvre`)**: the photo is CC BY-SA, but the UAE has no freedom-of-panorama exception, so the architect's rights may apply. Replace it with an image from the Louvre Abu Dhabi press office, or have it cleared.
- **Same point for other modern buildings**, such as the Sharjah Art Foundation (`sharjah-museum`).
- **Emirati coffee / dallah (`detail-coffee`)**: no CC photo clearly taken in the UAE was found. This slot is not used on the site.
- **Higher resolution**: these photos came in at 1920 px because Wikimedia was rate-limiting at the time: `rak-*`, `fujairah-*`, `stays-coast`, `hatta-*`, `sbi-*`, `stays-desert`, `alain-hero`, `alain-falaj` and `liwa-hero`. The originals are larger; re-run `npm run images` with 2560 px downloads for sharper large screens.
- **Sir Bani Yas wildlife (`sbi-wildlife`)**: taken on the island, but on a compact camera in 2012. A newer image from the island's operator would be better.
- **Ramadan (`journal-ramadan`)**: currently Sharjah's mosque at dusk. An iftar setting without identifiable faces would suit the Ramadan guide better.
- **Hero video**: none is used. If added later, load it on demand on desktop only and keep the poster image on mobile.
