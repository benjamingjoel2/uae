# Images needed

Every image slot on the site now has a correctly located photograph. All of them come from Wikimedia Commons under CC0, CC BY or CC BY-SA licences and are credited on `/credits/`. This file lists what to replace or add before launch.

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
- **Sheikh Zayed Grand Mosque exterior (`abudhabi-hero`)**: the current shot is down the approach avenue, with the domes small in the frame. The mosque's media centre issues images for editorial and tourism use; request a full exterior.
- **Louvre Abu Dhabi (`abudhabi-louvre`)**: the photo is CC BY-SA, but the UAE has no freedom-of-panorama exception, so the architect's rights may apply. Replace it with an image from the Louvre Abu Dhabi press office, or have it cleared.
- **Same point for other modern buildings**, such as the Sharjah Art Foundation (`sharjah-museum`).
- **Emirati coffee / dallah (`detail-coffee`)**: no CC photo clearly taken in the UAE was found. This slot is not used on the site.
- **Higher resolution**: these photos came in at 1920 px because Wikimedia was rate-limiting at the time: `rak-*`, `fujairah-*`, `stays-coast`, `hatta-*`, `sbi-*`, `stays-desert`, `alain-hero`, `alain-falaj` and `liwa-hero`. The originals are larger; re-run `npm run images` with 2560 px downloads for sharper large screens.
- **Sir Bani Yas wildlife (`sbi-wildlife`)**: taken on the island, but on a compact camera in 2012. A newer image from the island's operator would be better.
- **Ramadan (`journal-ramadan`)**: currently Sharjah's mosque at dusk. An iftar setting without identifiable faces would suit the Ramadan guide better.
- **Hero video**: none is used. If added later, load it on demand on desktop only and keep the poster image on mobile.
