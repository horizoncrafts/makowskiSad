// The complete illustrated story and its anchor links also work from disk, without JS.
(() => {
  'use strict';

  const index = document.querySelector('.chapter-index');
  const toggle = index.querySelector('.index-toggle');
  const currentName = toggle.querySelector('[data-chapter-name]');
  const links = [...index.querySelectorAll('.chapter-links a')];
  const chapters = links.map((link) => document.getElementById(link.hash.slice(1)));
  const compact = window.matchMedia('(max-width: 52.99rem)');

  function setExpanded(expanded) {
    toggle.setAttribute('aria-expanded', String(expanded));
  }

  index.classList.add('index-enhanced');
  toggle.hidden = !compact.matches;
  toggle.addEventListener('click', () =>
    setExpanded(toggle.getAttribute('aria-expanded') !== 'true')
  );
  compact.addEventListener('change', () => {
    toggle.hidden = !compact.matches;
    setExpanded(false);
  });

  // Both cover links open the compact contents directly, even when its hash is already current.
  document.querySelectorAll('a[href="#rozdzialy"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (compact.matches) {
        setExpanded(true);
        toggle.focus({ preventScroll: true });
      }
    });
  });
  if (location.hash === '#rozdzialy' && compact.matches) setExpanded(true);
  index.addEventListener('click', (event) => {
    if (event.target.closest('.chapter-links a')) setExpanded(false);
  });
  index.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      compact.matches &&
      toggle.getAttribute('aria-expanded') === 'true'
    ) {
      setExpanded(false);
      toggle.focus();
    }
  });
  document.addEventListener('pointerdown', (event) => {
    if (!index.contains(event.target)) setExpanded(false);
  });

  let activeIndex = -1;
  function markChapter() {
    // Measure the first screen line below the closed rail, even when its contents are expanded.
    const marker = (compact.matches ? toggle.offsetHeight : index.offsetHeight) + 22;
    let active = 0;
    for (let i = 1; i < chapters.length; i++) {
      if (chapters[i].getBoundingClientRect().top > marker) break;
      active = i;
    }
    if (active === activeIndex) return;
    activeIndex = active;
    for (const [i, link] of links.entries()) {
      if (i === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    currentName.textContent = links[active].textContent.trim();
  }

  let scheduled = false;
  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      markChapter();
    });
  }
  markChapter();
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('pageshow', scheduleUpdate);

  if (
    'IntersectionObserver' in window &&
    !CSS.supports('animation-timeline: view()') &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-arriving');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.plate').forEach((plate) => observer.observe(plate));
  }
})();
