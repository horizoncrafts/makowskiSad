# Build the anime version

Build the next Makowski Sad version: an anime telling of the orchard. This is the first unchecked item in `versions/PLAN.md`. Do this task before `build-animated-3d-version.md`.

Create a new folder named with the day you build it, `versions/YYYY-MM-DD-anime/`, with its own `index.html`, `styles.css`, and `script.js`. Add one line to `versions/index.html`. In the same commit, check this item off in `versions/PLAN.md` and record the agent name on the page and in the plan (`Claude`, `Cursor`, `Codex`, or the name of whoever built it).

## What it should feel like

Cel-shaded sky gradients and layered SVG silhouettes of the Beskidy hills behind the photos. Wind and petals. A lens-flare glow matched to the backlit photos. A title card for each chapter. Light moves from spring morning to autumn evening.

Done when the golden-hour mood of the photos is there and the seasons read as time passing. Nothing flashes more than 3 times a second.

## Acceptance

- Facts and body copy come from `versions/shared/story.md`, in order: the place, flower, apple, harvest, transport, pressing, packaging, selling. Polish only. No new prices, awards, varieties, dates, testimonials, or people.
- Real photographs stay the hero. Draw only the known gaps (the drive to Tłocznia Chocznia, and the press machinery) and label those drawings as illustrations.
- Visible captions are sentences in the family’s voice, not labels. Avoid “Jabłko w promieniach słońca”. Write something like “Nasze owoce dojrzewające w promieniach zachodzącego słońca”. Do not claim the sun is setting or rising unless the photo or `story.md` says so. Alt text stays the plain description from `story.md`.
- Copy the speed technique from `versions/2026-10-06-fairy-tale/`, not its look. Phones get the 640 px photo only, through a `<picture>` source at `max-width: 30rem`. Wider screens keep 1000 and 2000 px. Self-host `.woff2` fonts, subset for Polish letters plus `! " ' / ; ?` and the em dash. No Google Fonts. Preload fonts only when the page is served. Photos below the first screen wait until first paint. The opening photo stays eager. Without JavaScript the whole story is still there. `script.js` is a classic deferred script.
- `prefers-reduced-motion` shows the complete story with no motion. Scroll-driven animation sits behind `@supports`, with an IntersectionObserver fallback.
- Each page has `<meta name="robots" content="noindex">`, a link to `../../index.html`, and a link to `../index.html`. Brand green `#2c5e2e` stays available.
- Lighthouse mobile on a gzip static server: performance around 90 or better, accessibility 95 or better. No sideways scroll from 320 px to 1920 px. Keyboard focus is visible. Text contrast is at least 4.5:1.
- Commit straight to `main`. Do not open a pull request. Do not edit a finished folder: the basic site, `versions/shared/`, `versions/2026-10-05-fairy-tale/`, `versions/2026-10-06-fairy-tale/`, `versions/2026-10-08-cartoon/`, `versions/2026-10-08-cartoon-2/`.
- Do not add npm, a bundler, analytics, or anything server-side. Do not change DNS.

Report the folder path and the Lighthouse performance and accessibility scores.
