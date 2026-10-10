# Build the animated 3D version

Build a Makowski Sad version that feels like a moving pop-up book. Do this after `build-anime-version.md`.

Create a new folder named with the day you build it, `versions/YYYY-MM-DD-animated-3d/`, with its own `index.html`, `styles.css`, and `script.js`. Add one line to `versions/index.html`. In the same commit, check this item off in `versions/PLAN.md` and record the agent name on the page and in the plan.

## What it should feel like

CSS 3D only: `perspective` and `transform-style: preserve-3d`. A paper diorama of the orchard, with the real photos at different depths. A scroll-driven move through the seven chapters. The juice carton is a six-faced box that turns as you read the packaging chapter. Particles, if any, are a short canvas or a few lines of WebGL with no library.

No Three.js, Babylon, glTF, or physics. On a phone, use fewer layers. With reduced motion, it becomes a still diorama that still tells the whole story.

Done when the depth reads on a phone at a smooth frame rate and the still version is complete.

## Acceptance

- Facts and body copy come from `versions/shared/story.md`, in order: the place, flower, apple, harvest, transport, pressing, packaging, selling. Polish only. No new prices, awards, varieties, dates, testimonials, or people.
- Real photographs stay the hero. Draw only the known gaps (the drive to Tłocznia Chocznia, and the press machinery) and label those drawings as illustrations.
- Visible captions are sentences in the family’s voice, not labels. Avoid “Jabłko w promieniach słońca”. Write something like “Nasze owoce dojrzewające w promieniach zachodzącego słońca”. Do not claim the sun is setting or rising unless the photo or `story.md` says so. Alt text stays the plain description from `story.md`.
- Copy the speed technique from `versions/2026-10-06-fairy-tale/`, not its look. Phones get the 640 px photo only, through a `<picture>` source at `max-width: 30rem`. Wider screens keep 1000 and 2000 px. Self-host `.woff2` fonts, subset for Polish letters plus `! " ' / ; ?` and the em dash. No Google Fonts. Preload fonts only when the page is served. Photos below the first screen wait until first paint. The opening photo stays eager. Without JavaScript the whole story is still there. `script.js` is a classic deferred script.
- `prefers-reduced-motion` shows the complete story with no motion. Scroll-driven animation sits behind `@supports`, with an IntersectionObserver fallback.
- Each page has `<meta name="robots" content="noindex">`, a link to `../../index.html`, and a link to `../index.html`. Brand green `#2c5e2e` stays available.
- Lighthouse mobile on a gzip static server: performance around 90 or better, accessibility 95 or better. No sideways scroll from 320 px to 1920 px. Keyboard focus is visible. Text contrast is at least 4.5:1.
- Commit straight to `main`. Do not open a pull request. Do not edit a finished folder: the basic site, `versions/shared/`, `versions/2026-10-05-fairy-tale/`, `versions/2026-10-06-fairy-tale/`, `versions/2026-10-08-cartoon/`, `versions/2026-10-08-cartoon-2/`, or the anime folder once `build-anime-version.md` has landed.
- Do not add npm, a bundler, analytics, or anything server-side. Do not change DNS.

Report the folder path and the Lighthouse performance and accessibility scores.
