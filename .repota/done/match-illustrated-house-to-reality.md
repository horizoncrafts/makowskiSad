# Match the illustrated house to the family home

Revise the house in the cover and opening chapter of `versions/2026-11-04-orchard-tales/`, as requested by Piotr after reviewing the new edition. Use the orchard photographs as architectural references, preserving the generated fairytale painting style.

Match the cream rendered walls, broad dark tiled roof, solar panels, chimney, roof window and small timber entrance canopy. Export the existing desktop and phone sizes and update the two image descriptions to match the revised artwork.

Done when both generated scenes visibly match the reference house, the responsive images render correctly, and the correction is committed to `main`.

## Image generation

Edited with built-in ImageGen. The reference photographs were `0-miejsce-sciezka-do-domu-1000.jpg` and `0-miejsce-korona-nad-domem-1440.jpg` from `versions/shared/photos/`.

<details>
<summary>Cover edit prompt</summary>

Use case: precise-object-edit.
Asset type: full-width landscape website hero illustration, approx 2.4:1.
Input image 1 is the illustration to edit. Images 2 and 3 are architectural reference photographs of the real family home.
Primary request: correct ONLY the house in image 1 to resemble the real home closely. Keep the exact scene, aspect ratio and moonlit fairytale gouache/engraving painting style, composition, image framing, dark forest space on the left for website text, hills, moon, apples, trees, ferns, meadow and curving path. The new house must sit at the same position and similar footprint on the right.
House architecture from references: a modest low rectangular cream-white plastered house, with a long broad charcoal dark tiled gable roof, the BROAD SLOPING ROOF PLANE facing the viewer and horizontal ridge across it. Match the references' proportions and orientation: no prominent tall front triangular chalet gable. Include recognizable two roof-mounted solar panel groups, a small rectangular roof window below the ridge, a simple pale chimney, dark brown eaves, the double brown-framed window left of a reddish-brown entrance door, with a small timber gabled canopy on two wooden posts over the entrance. Cream walls should look warm under the moonlight; retain inviting golden light from its windows. Embed the ground floor into the grassy slope as in the reference. Remove the invented log walls, decorative high chalet facade and full-width veranda. The actual building should be recognizable, naturally rendered in the existing painted style, not a pasted photo.
Constraints: change only the house and immediately adjacent entrance details as necessary. Maintain the rest of the original illustration very closely. No lettering, no watermark. Output a single landscape image.

</details>

The opening chapter used the same architectural brief, preserving its spring blossom orchard, warm daylight, winding path and 3:2 composition.

## Done

Codex revised the cover and opening chapter on 2026-11-05 following Piotr's requested correction to this edition. The two generated scenes now share the real house's cream facade, broad dark tiled roof, panel arrays, rooflight and small entrance canopy. All five responsive WebP files retain their expected dimensions, and both alt texts describe the revised house.

Desktop and phone rendering checks passed with no missing assets or browser errors. Mobile Lighthouse on a gzip static server scored 99 for performance and 100 for accessibility, with LCP 2.1 s and zero layout shift.
