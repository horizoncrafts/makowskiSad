// Makowski Sad – the pop-up book. A classic deferred script, so the page also works
// when opened from disk. Browsers with scroll-driven animations need nothing from
// here; the rest get the same pop-ups from an IntersectionObserver and the turning
// carton from a scroll listener. With reduced motion the book stays still.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollDriven = window.CSS?.supports?.('animation-timeline: view()');
  if (scrollDriven || reduceMotion) return;

  const root = document.documentElement;
  const spreads = document.querySelectorAll('.spread');
  if (!('IntersectionObserver' in window)) return;
  root.classList.add('no-sda');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-open');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -20% 0px' },
  );
  spreads.forEach((spread) => observer.observe(spread));

  // The carton turns with the reader's progress through its chapter.
  const box = document.querySelector('.box');
  const chapter = box?.closest('.spread');
  if (!box || !chapter) return;
  let queued = false;
  const turn = () => {
    queued = false;
    const rect = chapter.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (innerHeight - rect.top) / (innerHeight + rect.height)));
    box.style.transform = `rotateX(-14deg) rotateY(${-60 + progress * 360}deg)`;
  };
  addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(turn);
    },
    { passive: true },
  );
  turn();
})();
