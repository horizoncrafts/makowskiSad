# Build the stamped, animated version

Piotr asked, after seeing „Baśń z sadu” (`versions/2026-11-04-orchard-tales/`), for a new version that also tells the story with its own drawings instead of the photographs, but as a clearly different concept with motion and animation. Use Baśń z sadu as inspiration only. Keep it light, because the basic site already loads too many heavy photos.

Tell the eight chapters of `versions/shared/story.md` in order, in Polish, with the facts, contact details and delivery conventions in `versions/PLAN.md`. As in Baśń z sadu, this edition replaces the photographs with drawings at Piotr's request, so say on the page that every picture is a drawing.

Done when the version opens from disk with JavaScript disabled and shows every chapter in its finished state, motion can be paused and respects `prefers-reduced-motion`, there is no sideways scroll from 320 to 1920 px, and the mobile Lighthouse scores have been recorded.

## Done

Built by Claude in `versions/2026-11-05-stamped/` as „Odbite w sadzie”. The idea comes from the family's own packaging: they stamp the logo on the cartons instead of printing labels, so the whole page is a set of stamp and linocut prints on kraft cardboard. A rubber stamp prints the title and a brayer rolls the ink over the opening picture of the house.

Each chapter is an inline SVG scene with its own motion: a hammock swinging by the terrace, blossoms opening with a bee, an apple that ripens as you scroll past it, a tree you can shake so the apples drop onto the net, a car with sacks driving the winding road to Tłocznia Chocznia, an illustrative modern press, a bag filling with juice before a stamp prints the logo on the carton, and the market stall with bunting. The recycling advice is drawn as parts moving to the paper and plastic bins. A bar button pauses all motion, and pictures out of view are paused.

There are no photos or raster images. The page is about 70 KiB in total over gzip: HTML, CSS and JS, one self-hosted Rubik subset (19 KiB) and the logo from `assets/icons/`.

Mobile Lighthouse on a gzip static server scored 100 for performance, 100 for accessibility and 100 for best practices (LCP 1.3 s, TBT 0 ms, CLS 0). Desktop also scored 100. Checked: no sideways scroll at 320, 360, 390, 414, 768, 1024, 1280, 1440 and 1920 px; all eight chapters and pictures render with JavaScript disabled; reduced motion shows every finished picture with no motion; jump links land on their chapter with and without JavaScript; no console errors.
