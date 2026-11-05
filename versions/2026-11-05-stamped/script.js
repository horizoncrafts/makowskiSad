/* Odbite w sadzie – Makowski Sad.
   Classic deferred script, so the page also works when opened from disk.
   Everything here is an extra: without it, the whole story and every finished picture are still there. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var paused = false;

  try {
    paused = window.localStorage.getItem('odbite-paused') === '1';
  } catch (e) {
    paused = false;
  }

  /* ---------------------------------------------------------------- the car on the map (SMIL) */
  var map = document.querySelector('.art--map');
  var drive = map && map.querySelector('.drive');
  var carWrap = map && map.querySelector('.car-wrap');
  var mapOn = false;
  var driving = false;

  function updateMap() {
    if (!map || typeof map.pauseAnimations !== 'function') return;
    var shouldRun = mapOn && !paused && !reduce.matches;
    if (shouldRun && !driving && drive && typeof drive.beginElement === 'function') {
      // The parked car sits at the orchard through its own transform; the motion path takes over from here.
      carWrap.removeAttribute('transform');
      drive.beginElement();
      driving = true;
    }
    if (shouldRun) map.unpauseAnimations();
    else map.pauseAnimations();
  }

  /* ---------------------------------------------------------------- pause button */
  var motionBtn = document.querySelector('[data-motion]');
  var motionLabel = motionBtn && motionBtn.querySelector('.motion__label');

  function applyPaused() {
    root.classList.toggle('is-paused', paused);
    if (motionBtn) {
      motionBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      motionLabel.textContent = paused ? 'Wznów ruch' : 'Zatrzymaj ruch';
    }
    updateMap();
  }

  if (motionBtn) {
    motionBtn.addEventListener('click', function () {
      paused = !paused;
      try {
        window.localStorage.setItem('odbite-paused', paused ? '1' : '0');
      } catch (e) {
        /* Storage can be blocked; the button still works for this visit. */
      }
      applyPaused();
    });
  }
  applyPaused();

  /* ---------------------------------------------------------------- jump links */
  // Chapters out of view skip layout (content-visibility), so their height is only estimated.
  // Lay them all out before the browser scrolls to a chapter, so the jump lands on it.
  document.addEventListener(
    'click',
    function (event) {
      var link = event.target.closest && event.target.closest('a[href^="#"]');
      if (link) root.classList.add('cv-all');
    },
    true
  );
  if (location.hash) root.classList.add('cv-all');

  /* ---------------------------------------------------------------- replays */
  function replay(seq) {
    seq.classList.remove('run');
    seq.classList.add('reset');
    void seq.getBoundingClientRect();
    seq.classList.remove('reset');
    seq.classList.add('run');
  }

  var shakeBtn = document.querySelector('[data-shake]');
  if (shakeBtn) {
    shakeBtn.addEventListener('click', function () {
      var seq = document.querySelector('#zbior .seq');
      if (seq) replay(seq);
    });
  }

  document.querySelectorAll('[data-replay]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var seq = document.querySelector('#' + btn.getAttribute('data-replay') + ' .chapter__art .seq');
      if (seq) replay(seq);
    });
  });

  /* ---------------------------------------------------------------- counter */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduce.matches || !target) return;
    var start = null;
    var duration = 1800;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) window.requestAnimationFrame(step);
    }
    el.textContent = '0';
    window.requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------------- what is on screen */
  function firstView(el) {
    if (el.matches('[data-scene]')) {
      el.querySelectorAll('.seq').forEach(function (seq) {
        seq.classList.add('run');
      });
    }
    if (el.classList.contains('chapter')) {
      var num = el.querySelector('[data-count]');
      if (num) countUp(num);
    }
  }

  var watched = document.querySelectorAll('.chapter, [data-scene]');

  if (!('IntersectionObserver' in window)) {
    watched.forEach(function (el) {
      el.classList.add('on');
      firstView(el);
    });
    mapOn = true;
    updateMap();
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var el = entry.target;
          if (entry.isIntersecting) {
            el.classList.remove('is-off');
            if (!el.classList.contains('on')) {
              el.classList.add('on');
              firstView(el);
            }
          } else {
            el.classList.add('is-off');
          }
          if (map && el.contains(map) && el.matches('[data-scene]')) {
            mapOn = entry.isIntersecting;
            updateMap();
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px' }
    );
    watched.forEach(function (el) {
      io.observe(el);
    });
  }

  reduce.addEventListener('change', updateMap);

  /* ---------------------------------------------------------------- reading progress, where CSS scroll timelines are missing */
  if (!(window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()'))) {
    var twine = document.querySelector('.twine');
    var ticking = false;
    var update = function () {
      var max = root.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      twine.style.setProperty('--p', p.toFixed(4));
      ticking = false;
    };
    if (twine) {
      window.addEventListener(
        'scroll',
        function () {
          if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(update);
          }
        },
        { passive: true }
      );
      window.addEventListener('resize', update);
      update();
    }
  }
})();
