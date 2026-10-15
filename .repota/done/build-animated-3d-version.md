# Build the animated 3D version

Build a Makowski Sad version that feels like a moving pop-up book. Do this after `build-anime-version.md`. The folder is `versions/YYYY-MM-DD-animated-3d/`.

CSS 3D only: `perspective` and `transform-style: preserve-3d`. A paper diorama of the orchard, with the real photos at different depths. A scroll-driven move through the chapters listed in `versions/PLAN.md`. The juice carton is a six-faced box that turns as you read the packaging chapter. Particles, if any, are a short canvas or a few lines of WebGL with no library.

No Three.js, Babylon, glTF, or physics. On a phone, use fewer layers. With reduced motion, it becomes a still diorama that still tells the whole story.

Done when the depth reads on a phone at a smooth frame rate and the still version is complete.

Follow `versions/PLAN.md` for every shared rule.

## Done

Built by Claude on 2026-10-15 in `versions/2026-10-15-animated-3d/`. Eight paper dioramas, one per chapter, in CSS 3D only. Their layers fold up off the page as each stage scrolls into view, and the view tilts through the scene. The carton is a six-faced box that turns across the packaging chapter. There are no particles. Phones drop the far hills and use less depth. With reduced motion every page stands still. Lighthouse mobile on a gzip static server: performance 98, accessibility 100. A scripted scroll at 4× CPU throttling held 60 fps, with no frame over 50 ms. No sideways scroll from 320 to 1920 px.
