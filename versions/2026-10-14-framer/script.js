// Makowski Sad – the Framer site, rebuilt. A classic deferred script, so the page
// also works when opened from disk.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollDriven = window.CSS?.supports?.('animation-timeline: view()');

  // Fallback for the rise-in: browsers without scroll-driven animations get .is-in
  // from an IntersectionObserver. With reduced motion the CSS shows everything.
  const reveals = document.querySelectorAll('.reveal');
  if (!scrollDriven && !reduceMotion) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        },
        { rootMargin: '0px 0px -10% 0px' },
      );
      reveals.forEach((el) => observer.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('is-in'));
    }
  }

  // Marks the header link of the section being read.
  const links = new Map();
  document.querySelectorAll('.site-nav a[href^="#"]').forEach((link) => {
    const target = document.getElementById(link.hash.slice(1));
    if (target) links.set(target, link);
  });
  if (links.size && 'IntersectionObserver' in window) {
    const current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const link = links.get(entry.target);
          if (entry.isIntersecting) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    links.forEach((_, target) => current.observe(target));
  }
})();
