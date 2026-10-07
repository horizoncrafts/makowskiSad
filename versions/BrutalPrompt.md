Design and implement this website to a very high visual standard.

Do not make it look like a generic template, component-library demo, or typical SaaS landing page. The result should feel intentionally art-directed, cohesive, distinctive, and polished.

Treat typography, composition, whitespace, motion, hierarchy, and interaction as first-class parts of the product.

## Visual direction

Aim for:

- strong editorial composition;
- excellent typography;
- generous whitespace;
- clear hierarchy;
- restrained but distinctive use of color;
- sophisticated proportions;
- intentional asymmetry where useful;
- visual rhythm between dense and sparse sections;
- subtle personality rather than decoration for decoration's sake.

Prefer a small number of strong visual ideas over many weak ones.

Avoid by default:

- generic hero + three cards + testimonials + CTA layouts;
- excessive rounded cards;
- unnecessary gradients;
- glassmorphism;
- giant pills everywhere;
- generic icon grids;
- arbitrary shadows;
- decorative blobs;
- excessive borders;
- obvious Tailwind/UI-kit aesthetics;
- repetitive section structures.

When in doubt, simplify.

## Typography

Typography should carry much of the visual identity.

Use:

- expressive display typography;
- clean and highly readable body typography;
- clear differences between display, heading, body, caption, and utility text;
- carefully chosen line-height and tracking;
- deliberate line lengths;
- large typography where the composition benefits from it.

Headings may function as graphical elements, not just text labels.

Do not make every heading centered.

Do not make everything the same visual weight.

## Layout

Build strong compositions rather than stacks of components.

Use:

- substantial margins;
- deliberate content widths;
- full-width moments where appropriate;
- asymmetric layouts;
- editorial grids;
- overlapping elements when justified;
- sections with varied density;
- intentional negative space.

Avoid placing every piece of content inside a card.

Allow some content to exist directly on the page.

Every section should have a clear visual purpose.

## Scroll and motion

Scrolling should feel designed.

Use motion to:

- establish hierarchy;
- guide attention;
- transition between sections;
- reveal relationships;
- create depth;
- make the page feel alive.

Use a mix of:

- scroll-linked transforms;
- sticky or pinned sections;
- masked reveals;
- staggered text entrances;
- subtle parallax;
- scale changes;
- controlled horizontal movement;
- layered transitions;
- occasional overlapping scenes.

Do not reduce all animation to fade-in-on-scroll.

For important sections, think in terms of a timeline:

1. entrance;
2. composed readable state;
3. stable reading period;
4. transition into the next scene.

Motion should feel calm, precise, and expensive.

Avoid:

- excessive bounce;
- gimmicky animation;
- constant movement;
- scroll hijacking;
- long animations that delay interaction;
- animation that harms readability.

Use animation sparingly enough that the important moments feel special.

## Transitions

Sections should not always feel like separate rectangular blocks.

Where appropriate, visually connect one section to the next using:

- typography moving between compositions;
- clipping or masks;
- elements continuing across section boundaries;
- sticky transitions;
- scale changes;
- foreground/background layering;
- whitespace used intentionally as part of the transition.

The page should feel like one continuous experience.

## Interaction

Micro-interactions should be subtle but excellent.

Use refined:

- hover states;
- animated underlines;
- arrow movement;
- button state changes;
- cursor feedback;
- navigation transitions;
- focus states.

Interactions should feel responsive and immediate.

Do not use flashy effects just because they are possible.

## Images and media

Treat images, video, illustrations, screenshots, and diagrams as compositional elements.

Do not simply drop them into generic rounded rectangles.

Consider:

- cropping;
- scale;
- layering;
- masks;
- unusual positioning;
- edge-to-edge presentation;
- interaction with typography;
- scroll-linked movement.

Maintain a consistent visual language.

## Design system

Create a compact design system before proliferating components.

Define:

- typography scale;
- spacing scale;
- content widths;
- color tokens;
- border treatment;
- radius rules;
- motion timing;
- easing;
- responsive breakpoints.

Use these consistently.

Consistency should come from shared visual rules, not from making every section look identical.

## Responsiveness

Recompose the design for smaller screens.

Do not simply stack the desktop layout vertically.

On mobile:

- preserve hierarchy;
- simplify overlap;
- reduce extreme movement;
- shorten pinned sequences;
- maintain strong typography;
- preserve intentional whitespace;
- keep animations performant.

The mobile version should still feel designed.

## Implementation quality

Use semantic HTML and accessible interactions.

Prefer transform and opacity for animation.

Avoid unnecessary layout-triggering animation.

Use `prefers-reduced-motion`.

Maintain smooth 60fps interactions where possible.

Keep the implementation clean enough that the visual system can be refined later without rewriting the entire page.

If using React, do not over-componentize trivial markup.

If sophisticated scroll animation is appropriate, consider GSAP + ScrollTrigger and optionally Lenis.

## Working process

Do not begin by assembling generic components.

First determine:

- visual hierarchy;
- page rhythm;
- major compositions;
- key typography;
- important animation moments;
- transitions between sections.

Then implement the structure around those decisions.

For every major section, ask:

- What makes this visually memorable?
- What is the dominant element?
- Where does the eye go first?
- What changes while scrolling?
- How does it transition into the next section?
- What can be removed?

If a section looks generic, redesign it rather than decorating it.

## Quality bar

The final result should feel comparable to a high-end digital studio, editorial product site, or carefully art-directed modern brand website.

It should look good in still screenshots, but it should feel even better when scrolling and interacting with it.

Favor:

**composition over components  
typography over decoration  
motion over gimmicks  
restraint over clutter  
intentionality over convention**

Above all:

**Do not make a merely clean website. Make a website with a point of view.**