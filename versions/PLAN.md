# Plan for the next Makowski Sad versions

This file is the brief for anyone building the next version. Read it, then build **one** unchecked version. Do not edit a finished folder.

The basic site at the repo root stays as it is. Each version is a self-contained page: `index.html`, `styles.css`, `script.js`. No build step, no npm, no framework, no Tailwind.

## Already done

Do not edit these.

| Folder | What it is |
|---|---|
| `../index.html`, `../ecology.html`, `../styles.css`, `../script.js`, `../assets/` | The basic site |
| `shared/story.md` and `shared/photos/` | The facts, alt texts, and resized photos |
| `2026-10-05-fairy-tale/` | The book. Approved. Phone lab score 95 |
| `2026-10-06-fairy-tale/` | The walk-in orchard. Captions rewritten in `e9ef811` |

## Next versions, in order

Do the first unchecked one. Name the folder with the day you build it: `YYYY-MM-DD-style`. Add one line to `versions/index.html`.

- [ ] **Cartoon.** Thick outlines. A flat palette from the brand green `#2c5e2e` plus apple red. Springy motion with CSS `linear()` easing. Photos in comic panels. The real copy sits in speech bubbles. A drawn car full of sacks drives along a path to Tłocznia Chocznia with `offset-path`. Done when it is playful and not childish, and every fact is easy to read.
- [ ] **Anime.** Cel-shaded sky gradients and layered SVG silhouettes of the Beskidy hills behind the photos. Wind and petals. A lens-flare glow matched to the backlit photos. A title card for each chapter. Light moves from spring morning to autumn evening. Done when the golden-hour mood of the photos is there and the seasons read as time passing. Nothing flashes more than 3 times a second.
- [ ] **Animated 3D, as a pop-up book.** CSS 3D only: `perspective` and `transform-style: preserve-3d`. A paper diorama of the orchard, real photos at different depths, a scroll-driven move through the seven chapters, and the juice carton as a six-faced box that turns. Particles, if any, are a short canvas or a few lines of WebGL with no library. No Three.js, Babylon, glTF, or physics. On a phone, fewer layers. With reduced motion, a still diorama. Done when the depth reads on a phone and the still version is complete.

After these three, stop. A further round only happens when Piotr picks a style.

## What every version shares

Facts and body copy come from `shared/story.md`, in this order: the place, flower, apple, harvest, transport, pressing, packaging, selling. Polish only. A heading may be poetic. A fact may not be invented: no new prices, awards, varieties, dates, testimonials, or people.

Real photographs are the hero. Frame, crop, mask, grade, or animate them. Do not replace them with drawings or generated images. Transport and pressing are thin on purpose: the car boot of sacks, and the sacks at the press. Draw the drive and the press machinery, and label those drawings as illustrations.

**Visible captions** are sentences in the voice of the orchard, as if the family is showing the place. They are not labels of the picture.

- Avoid: “Jabłko w promieniach słońca”
- Write: “Nasze owoce dojrzewające w promieniach zachodzącego słońca”

Do not claim the sun is setting or rising unless the photo or `story.md` says so. The alt text stays the plain description already in `story.md`.

Contact details, the logo, and the brand green stay. Each page has `<meta name="robots" content="noindex">`, a link to `../../index.html`, and a link to `../index.html`.

## Optimisations, copied from the finished fairy tales

Copy the technique from `2026-10-06-fairy-tale/`. Do not copy its look.

- Phones get the 640 px photo only, through a `<picture>` source at `max-width: 30rem`. Wider screens keep the 1000 and 2000 px files. If a photo you use has no 640 px file, export one from `assets/images/`, strip metadata, and do not leave the export tool in the repo.
- Typefaces are self-hosted `.woff2` files in the version folder, subset for Polish letters plus `! " ' / ; ?` and the em dash. Preload them only when the page is served, so opening the file from disk does not log errors. No Google Fonts. A system font is the fallback.
- Photos below the first screen wait until the page has painted. The opening photo stays eager. Without JavaScript the whole story is still there.
- `script.js` is a classic deferred script, not an ES module, so the page works from disk.
- Scroll-driven animation sits behind `@supports`, with an IntersectionObserver fallback.
- Native scrolling only. Motion uses `transform` and `opacity`.
- `prefers-reduced-motion` shows the complete story with no motion.
- Lighthouse mobile, on a gzip static server: performance around 90 or better, accessibility 95 or better, 100 is the aim. No sideways scroll from 320 px to 1920 px. Keyboard focus is visible. Text contrast is at least 4.5:1. Video is muted and has a pause control.

## How to hand a version over

1. Build only the next unchecked item above. Check it off in this file in the same commit.
2. Commit straight to `main`. Do not open a pull request. Do not edit a finished folder.
3. Say what the folder is, and the Lighthouse performance and accessibility scores.

## Not part of a version

- Do not replace the basic site. That needs Piotr’s approval.
- Do not add npm, a bundler, analytics, or anything server-side.
- Hosting at makowskisad.pl is separate. The domain is on OVH and still points at Framer. Do not change DNS from a version task.
