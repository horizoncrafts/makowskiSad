/* Prawdziwa baśń – Makowski Sad. Classic deferred script, so the page also works from disk.
   Without it the whole story is still there, in the seasons' colours, with nothing moving. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- The walk-in cover ---------- */
  var intro = document.querySelector('.intro');
  var stage = document.querySelector('.intro-stage');
  var portal = document.querySelector('.portal');
  var copy = document.querySelector('.intro-copy');
  var ticking = false;

  function measure() {
    if (!root.classList.contains('walk')) return;
    intro.style.setProperty('--p', 0);
    var vw = stage.clientWidth;
    var vh = stage.clientHeight;
    var narrow = window.matchMedia('(max-width: 40rem)').matches;
    portal.style.removeProperty('--w');
    if (narrow) {
      // Fit the window into the space left under the text on short phones.
      var room = vh - (copy.offsetTop + copy.offsetHeight) - 36;
      var fit = Math.max(vw * 0.32, Math.min(vw * 0.52, (room * 3) / 4));
      portal.style.setProperty('--w', fit + 'px');
    }
    var w = portal.offsetWidth;
    var h = (w * 4) / 3;
    var top = narrow
      ? Math.min(copy.offsetTop + copy.offsetHeight + 12, vh - h - 24)
      : Math.max((vh - h) / 2, 90);
    intro.style.setProperty('--top', top + 'px');
    var left = narrow ? (vw - w) / 2 : portal.offsetLeft;
    var k = Math.max(vw / w, vh / h) * 1.12;
    intro.style.setProperty('--k', k.toFixed(3));
    intro.style.setProperty('--tx', (vw / 2 - (left + w / 2)).toFixed(1) + 'px');
    intro.style.setProperty('--ty', (vh / 2 - (top + h / 2)).toFixed(1) + 'px');
    update();
  }

  function update() {
    ticking = false;
    var travel = intro.offsetHeight - stage.clientHeight;
    var raw = travel > 0 ? (window.scrollY - intro.offsetTop) / travel : 0;
    var p = Math.min(1, Math.max(0, raw));
    p = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // ease in and out
    intro.style.setProperty('--p', p.toFixed(4));
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function setWalk() {
    if (!intro) return;
    if (reduce.matches) {
      root.classList.remove('walk');
      intro.style.removeProperty('--p');
      window.removeEventListener('scroll', onScroll);
      return;
    }
    root.classList.add('walk');
    window.addEventListener('scroll', onScroll, { passive: true });
    measure();
  }

  // Phones open with a light copy of the photo and swap in the sharp one as soon as
  // the reader starts walking in.
  var later = document.querySelector('.portal source[data-later]');
  function sharpen() {
    window.removeEventListener('scroll', sharpen);
    if (later) later.srcset = later.getAttribute('data-later');
  }
  window.addEventListener('scroll', sharpen, { passive: true });

  setWalk();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);

  /* ---------- Pause control for the falling petals and leaves ---------- */
  var toggle = document.querySelector('.motion-toggle');
  var sky = document.querySelector('.sky');

  function setToggle() {
    toggle.hidden = reduce.matches;
  }

  if (toggle) {
    setToggle();
    toggle.addEventListener('click', function () {
      var paused = root.classList.toggle('paused');
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.querySelector('span').textContent = paused ? 'Wznów ruch' : 'Zatrzymaj ruch';
      toggle.querySelector('use').setAttribute('href', paused ? '#i-play' : '#i-pause');
    });
  }

  if (reduce.addEventListener) {
    reduce.addEventListener('change', function () {
      // Phones open with a light copy of the photo and swap in the sharp one as soon as
  // the reader starts walking in.
  var later = document.querySelector('.portal source[data-later]');
  function sharpen() {
    window.removeEventListener('scroll', sharpen);
    if (later) later.srcset = later.getAttribute('data-later');
  }
  window.addEventListener('scroll', sharpen, { passive: true });

  setWalk();
      if (toggle) setToggle();
    });
  }

  if (!hasIO) return;

  /* ---------- Plates rise, tags swing in, stamps land ---------- */
  root.classList.add('reveal-ready');
  var revealer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -12% 0px' }
  );
  document.querySelectorAll('.reveal').forEach(function (el) {
    revealer.observe(el);
  });

  /* ---------- The page eases through the seasons ---------- */
  var colours = { wiosna: '#f5efe2', lato: '#eef0dc', jesien: '#f4e2c4', targ: '#14302a' };
  var fx = { wiosna: '#f2b8c6', lato: '#8fb35a', jesien: '#d0782f', targ: '#ffd98a' };
  var bands = document.querySelectorAll('main [data-season], .footer[data-season]');

  function setSeason(season) {
    document.body.style.setProperty('--page-bg', colours[season]);
    sky.style.setProperty('--sky-fx', fx[season]);
    sky.setAttribute('data-fx', season);
  }

  var seasons = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setSeason(entry.target.getAttribute('data-season'));
      });
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );
  bands.forEach(function (band) {
    seasons.observe(band);
  });

  // Petals only once the cover is behind us.
  new IntersectionObserver(function (entries) {
    sky.classList.toggle('is-on', !entries[0].isIntersecting);
  }).observe(intro);

  /* ---------- Which chapter we are in ---------- */
  var links = {};
  document.querySelectorAll('.chapters a').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });
  var current = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var link = links[entry.target.id];
        if (!link) return;
        Object.keys(links).forEach(function (id) {
          links[id].removeAttribute('aria-current');
        });
        link.setAttribute('aria-current', 'location');
        var list = link.closest('ol');
        list.scrollLeft = link.parentNode.offsetLeft - list.clientWidth / 2 + link.offsetWidth / 2;
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  document.querySelectorAll('.chapter').forEach(function (chapter) {
    current.observe(chapter);
  });
})();
