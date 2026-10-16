// Makowski Sad – the editorial version. A classic deferred script, so the page also
// works when opened from disk. It keeps the folio in the corner current, measures
// the route line for its travelling dot, and gives browsers without scroll-driven
// animations the one-time reveals. Without it, every word and photo still shows.
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  // The folio: chapter number and name of the section across the middle of the
  // screen, and a lighter colour while the dark press scene sits under it.
  const counter = document.querySelector('.counter');
  const sections = document.querySelectorAll('[data-chapter]');
  if (counter && hasIO) {
    const num = counter.querySelector('.counter__num');
    const name = counter.querySelector('.counter__name');
    const middle = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          num.textContent = entry.target.dataset.chapter;
          name.textContent = entry.target.dataset.name;
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    sections.forEach((section) => middle.observe(section));

    const dark = document.querySelector('[data-dark]');
    if (dark) {
      new IntersectionObserver(
        ([entry]) => document.body.classList.toggle('on-dark', entry.isIntersecting),
        { rootMargin: '-94% 0px 0px 0px' },
      ).observe(dark);
    }
  }

  // The dot drives the length of the route line; CSS needs that length.
  const line = document.querySelector('.route__line');
  if (line) {
    const measure = () => line.style.setProperty('--route-w', `${line.getBoundingClientRect().width}px`);
    measure();
    addEventListener('resize', measure, { passive: true });
  }

  // Fallback reveals (the head script added .no-sda when they are needed).
  if (!root.classList.contains('no-sda') || reduceMotion || !hasIO) return;
  const reveal = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        reveal.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  document
    .querySelectorAll('.ch .lines, .manifesto .lines, .statement, .lede, .spec li, .partner')
    .forEach((el) => reveal.observe(el));
})();
