# Build a version from the Framer site

Build a new Makowski Sad version that is the best this repository can do of https://makowskisad.framer.website/. It is a new folder, `versions/YYYY-MM-DD-framer/`, not a change to the basic site.

Look at the Framer site for composition, hierarchy, and what the family chooses to show. Rebuild that intent in plain HTML, CSS, and JS. Do not embed Framer. Leave out any fact that is not in `versions/shared/story.md`.

Follow `versions/PLAN.md` for every shared rule.

## Done

Built by Claude on 2026-10-14 in `versions/2026-10-14-framer/`. makowskisad.framer.website no longer resolves, so the reference was the Framer screenshots in `design/`. Framer copy that is not in `versions/shared/story.md` (the number and age of the trees, GMO, the press's web address, 5 l bags) was left out. Lighthouse mobile on a gzip static server: performance 96, accessibility 100. No sideways scroll from 320 to 1920 px.
