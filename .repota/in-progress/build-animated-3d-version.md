# Build the animated 3D version

Build a Makowski Sad version that feels like a moving pop-up book. Do this after `build-anime-version.md`. The folder is `versions/YYYY-MM-DD-animated-3d/`.

CSS 3D only: `perspective` and `transform-style: preserve-3d`. A paper diorama of the orchard, with the real photos at different depths. A scroll-driven move through the chapters listed in `versions/PLAN.md`. The juice carton is a six-faced box that turns as you read the packaging chapter. Particles, if any, are a short canvas or a few lines of WebGL with no library.

No Three.js, Babylon, glTF, or physics. On a phone, use fewer layers. With reduced motion, it becomes a still diorama that still tells the whole story.

Done when the depth reads on a phone at a smooth frame rate and the still version is complete.

Follow `versions/PLAN.md` for every shared rule.
