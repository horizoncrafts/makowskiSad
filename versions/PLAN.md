# Plan for the next Makowski Sad versions

This file is the shared brief for every version. Build one open item from the list below, and open that task for what the version should look like.

## Already done

Do not edit these.


| Folder                                                                            | What it is                                           |
| --------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `../index.html`, `../ecology.html`, `../styles.css`, `../script.js`, `../assets/` | The basic site                                       |
| `shared/story.md` and `shared/photos/`                                            | The facts, alt texts, and resized photos             |
| `2026-10-05-fairy-tale/`                                                          | The book. Approved. Phone lab score 95               |
| `2026-10-06-fairy-tale/`                                                          | The walk-in orchard. Captions rewritten in `e9ef811` |
| `2026-10-08-cartoon/`                                                             | The comic book. Built by Claude                      |
| `2026-10-08-cartoon-2/`                                                           | The second comic, in ink plates. Built by Grok       |


## Still to build

- [ ] [build-anime-version.md](../.repota/build-anime-version.md) — Anime telling of the orchard. Before build-animated-3d-version.md.
- [ ] [build-animated-3d-version.md](../.repota/build-animated-3d-version.md) — CSS 3D pop-up book. After build-anime-version.md.
- [ ] [build-framer-site-version.md](../.repota/build-framer-site-version.md) — The Framer site rebuilt in plain HTML, CSS, and JS. No order.
- [ ] [build-brutal-prompt-version.md](../.repota/build-brutal-prompt-version.md) — Art direction from BrutalPrompt.md. No order.

After these, stop. A further round only happens when Piotr picks a style.

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

No build step. Do not add npm, a framework, Tailwind, a bundler, analytics, or anything server-side. Hosting at makowskisad.pl is separate. The domain is on OVH and still points at Framer. Do not change DNS from a version task.

Report the folder path and the Lighthouse performance and accessibility scores.
