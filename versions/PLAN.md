# Plan for the next Makowski Sad versions

This file is the shared brief for every version. Build one open item from the list below, and open that task for what the version should look like.

## Already done

Do not edit these.


| Folder                                                                            | What it is                                           |
| --------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `../index.html`, `../styles.css`, `../script.js`, `../assets/orchard-tales/` | The main site, promoted from orchard tales on 2026-11-05 by Codex |
| `2026-11-05-basic/` | The previous basic site and ecology page, archived by Codex |
| `shared/story.md` and `shared/photos/`                                            | The facts, alt texts, and resized photos             |
| `2026-10-05-fairy-tale/`                                                          | The book. Approved. Phone lab score 95               |
| `2026-10-06-fairy-tale/`                                                          | The walk-in orchard. Captions rewritten in `e9ef811` |
| `2026-10-08-cartoon/`                                                             | The comic book. Built by Claude                      |
| `2026-10-08-cartoon-2/`                                                           | The second comic, in ink plates. Built by Grok       |
| `2026-10-14-framer/`                                                              | The Framer site, rebuilt. Built by Claude            |
| `2026-10-14-anime/`                                                               | The anime telling, eight episodes. Built by Claude   |
| `2026-10-15-animated-3d/`                                                         | The CSS 3D pop-up book. Built by Claude              |
| `2026-10-16-brutal/`                                                              | Art direction from BrutalPrompt.md. Built by Claude  |
| `2026-11-04-orchard-tales/`                                                       | Baśń z sadu, with generated illustrations. Built by Codex |
| `2026-11-05-stamped/`                                                             | Odbite w sadzie, animated stamp and linocut prints in SVG. Built by Claude |
| `2026-11-13-true-tale/` | Prawdziwa baśń. Piotr's favorites combined: Baśń z sadu plates with a real photo pinned to each on a stamped kraft tag, Brutal type, Anime seasons, Wejdź do sadu walk-in. Built by Claude |


## Still to build

- [x] `build-anime-version.md` — Anime telling of the orchard. Before build-animated-3d-version.md. Built by Claude.
- [x] `build-animated-3d-version.md` — CSS 3D pop-up book. After build-anime-version.md. Built by Claude.
- [x] `build-framer-site-version.md` — The Framer site rebuilt in plain HTML, CSS, and JS. No order.
- [x] `build-brutal-prompt-version.md` — Art direction from BrutalPrompt.md. No order. Built by Claude.
- [x] `build-orchard-tales-version.md` — Baśń z sadu. Piotr selected a fairytale told entirely with generated illustrations for this edition. Built by Codex.
- [x] `build-stamped-version.md` — Odbite w sadzie. Piotr asked for a new version drawn in the spirit of Baśń z sadu, with motion and animation. Built by Claude.

Piotr selected orchard tales as the main site on 2026-11-05. The original version folder remains a snapshot. The former main site is archived in `2026-11-05-basic/`. Further edits to the live orchard tales site belong at the repository root.

## What every version shares

### How to deliver a version

Create `versions/YYYY-MM-DD-<slug>/` with its own `index.html`, `styles.css`, and `script.js`. The task names the slug. Add one line to `versions/index.html`. Record the name of the agent that built it on the page and on the matching line above. Check that line in the same commit.

### Facts and copy

Facts and body copy come from `versions/shared/story.md`, in this order: the place, flower, apple, harvest, transport, pressing, packaging, selling. Polish only. A heading may be poetic. A fact may not be invented: no new prices, awards, varieties, dates, testimonials, or people.

### Photographs

Real photographs are the hero. Use the files in `versions/shared/photos/`. Frame, crop, mask, grade, or animate them. Do not replace them with drawings or generated images. Transport and pressing are thin on purpose: the car boot of sacks, and the sacks at the press. Draw only the known gaps (the drive to Tłocznia Chocznia, and the press machinery), and label those drawings as illustrations.

### Captions

**Visible captions** are sentences in the voice of the orchard, as if the family is showing the place. They are not labels of the picture.

- Avoid: “Jabłko w promieniach słońca”
- Write: “Nasze owoce dojrzewające w promieniach zachodzącego słońca”

Do not claim the sun is setting or rising unless the photo or `versions/shared/story.md` says so. The alt text stays the plain description already in `versions/shared/story.md`.

### Links and the brand

Each page has `<meta name="robots" content="noindex">`, a link to `../../index.html`, and a link to `../index.html`. Contact details, the logo, and the brand green `#2c5e2e` stay.

### Optimisations, copied from the finished fairy tales

Copy the technique from `versions/2026-10-06-fairy-tale/`. Do not copy its look.

- Phones get the 640 px photo only, through a `<picture>` source at `max-width: 30rem`. Wider screens keep the 1000 and 2000 px files. If a photo you use has no 640 px file, export one from `assets/images/`, strip metadata, and do not leave the export tool in the repo.
- Typefaces are self-hosted `.woff2` files in the version folder, subset for Polish letters plus `! " ' / ; ?` and the em dash. Preload them only when the page is served, so opening the file from disk does not log errors. No Google Fonts. A system font is the fallback.
- Photos below the first screen wait until the page has painted. The opening photo stays eager. Without JavaScript the whole story is still there.
- `script.js` is a classic deferred script, not an ES module, so the page works from disk.
- Scroll-driven animation sits behind `@supports`, with an IntersectionObserver fallback.
- Native scrolling only. Motion uses `transform` and `opacity`.
- `prefers-reduced-motion` shows the complete story with no motion.
- Lighthouse mobile, on a gzip static server: performance around 90 or better, accessibility 95 or better, 100 is the aim. No sideways scroll from 320 px to 1920 px. Keyboard focus is visible. Text contrast is at least 4.5:1. Video is muted and has a pause control.

### Hand over

Commit straight to `main`. Do not open a pull request. Do not edit a finished folder. That includes the basic site, `versions/shared/`, and any version folder that has already been built. Do not replace the basic site. That needs Piotr’s approval.

No build step. Do not add npm, a framework, Tailwind, a bundler, analytics, or anything server-side. Hosting at makowskisad.pl is separate: GitHub Pages serves `main` over HTTPS, with DNS at OVH pointing only to GitHub. Do not change DNS, `CNAME`, or Pages settings from a version task.

Report the folder path and the Lighthouse performance and accessibility scores.
