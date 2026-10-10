# Build a version from the brutal prompt

Build a new Makowski Sad version that follows `versions/BrutalPrompt.md`. That file is an art-direction brief: editorial composition, strong typography, generous whitespace, a small number of strong visual ideas, and none of the generic landing-page habits it lists.

Create `versions/YYYY-MM-DD-brutal/` with its own `index.html`, `styles.css`, and `script.js`. Add one line to `versions/index.html`. In the same commit, check this item off in `versions/PLAN.md` and record the agent name on the page and in the plan.

Read `versions/BrutalPrompt.md` and apply it to this orchard story. The result should feel art-directed. It should not look like a template.

## Acceptance

- Facts and body copy come from `versions/shared/story.md`, in order: the place, flower, apple, harvest, transport, pressing, packaging, selling. Polish only. No new prices, awards, varieties, dates, testimonials, or people.
- Real photographs stay the hero. Draw only the known gaps (the drive to Tłocznia Chocznia, and the press machinery) and label those drawings as illustrations.
- Visible captions are sentences in the family’s voice, not labels. Avoid “Jabłko w promieniach słońca”. Write something like “Nasze owoce dojrzewające w promieniach zachodzącego słońca”. Do not claim the sun is setting or rising unless the photo or `story.md` says so. Alt text stays the plain description from `story.md`.
- Copy the speed technique from `versions/2026-10-06-fairy-tale/`, not its look. Phones get the 640 px photo only, through a `<picture>` source at `max-width: 30rem`. Wider screens keep 1000 and 2000 px. Self-host `.woff2` fonts, subset for Polish letters plus `! " ' / ; ?` and the em dash. No Google Fonts. Preload fonts only when the page is served. Photos below the first screen wait until first paint. The opening photo stays eager. Without JavaScript the whole story is still there. `script.js` is a classic deferred script.
- `prefers-reduced-motion` shows the complete story with no motion.
- Each page has `<meta name="robots" content="noindex">`, a link to `../../index.html`, and a link to `../index.html`.
- Lighthouse mobile on a gzip static server: performance around 90 or better, accessibility 95 or better. No sideways scroll from 320 px to 1920 px. Keyboard focus is visible. Text contrast is at least 4.5:1.
- Commit straight to `main`. Do not open a pull request. Do not edit a finished folder, and do not replace the root site.
- Do not add npm, a bundler, analytics, or anything server-side. Do not change DNS. The brutal prompt’s advice about tools does not override this: the page stays plain HTML, CSS, and JS.

Report the folder path and the Lighthouse performance and accessibility scores.
