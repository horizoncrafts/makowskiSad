# Build a version from the brutal prompt

Build a new Makowski Sad version with `versions/BrutalPrompt.md` as the art direction. The folder is `versions/YYYY-MM-DD-brutal/`.

The prompt's advice about tools does not override `versions/PLAN.md`: the page stays plain HTML, CSS, and JS.

Follow `versions/PLAN.md` for every shared rule.

## Done

Built by Claude on 2026-10-16 in `versions/2026-10-16-brutal/`. An editorial, type-led page in Instrument Serif and Instrument Sans on a 12-column grid, with no rounded corners. Eight chapters, each with a running folio set sideways in the left gutter. Scenes: a pinned bloom photo beside three statements, a horizontal summer strip on desktop, a typographic route to the press, a dark pressing chapter with a growing panel, and large numerals for 100%, 3 l and 300 litres. Scroll-driven animation uses transform and opacity only, with an IntersectionObserver fallback. With reduced motion the whole story shows without motion. Lighthouse mobile on a gzip static server: performance 98, accessibility 96, best practices 100. The one accessibility flag is the dark chapter's kicker, which axe measures against the paper colour because the dark panel is a separate layer. No sideways scroll from 320 to 1920 px.
