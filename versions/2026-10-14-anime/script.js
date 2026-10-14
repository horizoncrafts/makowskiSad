// Od wiosny do jesieni: the motion laid over a page that already tells the whole story
// without it. Classic deferred script, so it also runs from file://.
(() => {
  'use strict';

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hasObserver = 'IntersectionObserver' in window;
  const supportsScrollTimeline =
    typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline: view()');

  const motionAllowed = () => !reducedMotion.matches;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const viewHeight = () => window.innerHeight || root.clientHeight;

  const onMotionChange = (callback) => {
    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', callback);
    } else if (typeof reducedMotion.addListener === 'function') {
      reducedMotion.addListener(callback);
    }
  };

  // Calls back at most once per frame while the reader scrolls or resizes.
  const scrollLoop = (callback) => {
    let frame = 0;
    let listening = false;

    const run = () => {
      frame = 0;
      callback();
    };

    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(run);
    };

    return {
      start() {
        if (listening) return;
        listening = true;
        window.addEventListener('scroll', request, { passive: true });
        window.addEventListener('resize', request, { passive: true });
        request();
      },
      stop() {
        if (!listening) return;
        listening = false;
        window.removeEventListener('scroll', request);
        window.removeEventListener('resize', request);
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
      },
    };
  };

  // Photos below the opening screen are held until the page has loaded and been painted
  // (see the head of index.html). A reader who scrolls to one sooner gets it straight
  // away, with or without motion.
  function initPhotoRelease() {
    if (!hasObserver || !root.classList.contains('is-holding-photos')) return;

    const observer = new IntersectionObserver((entries) => {
      if (!root.classList.contains('is-holding-photos')) {
        observer.disconnect();
        return;
      }
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-released');
        observer.unobserve(entry.target);
      }
    });

    for (const photo of document.querySelectorAll('.frame img[loading="lazy"]')) {
      observer.observe(photo.closest('.frame'));
    }
  }

  // Browsers without scroll-driven animations: blocks that start below the fold are
  // "armed" (hidden by CSS) and rise into place once they scroll into view. Anything
  // already on screen is left as it is, fully drawn.
  function initRevealFallback() {
    if (supportsScrollTimeline || !hasObserver || !motionAllowed()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-inview');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );

    const fold = viewHeight();
    for (const item of document.querySelectorAll('[data-reveal]')) {
      if (item.getBoundingClientRect().top < fold) continue;
      item.classList.add('is-armed');
      observer.observe(item);
    }
  }

  // Clouds, wind, flares, the drive and the press only move while they are on screen.
  function initLoops() {
    const loops = document.querySelectorAll('[data-loop]');
    if (!loops.length) return;

    if (!hasObserver) {
      loops.forEach((loop) => loop.classList.add('is-playing'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle('is-playing', entry.isIntersecting);
      }
    });
    loops.forEach((loop) => observer.observe(loop));
  }

  // The blossom clip: muted, plays while in view, and the reader can pause it.
  // Under reduced motion it never starts by itself.
  function initFilm() {
    const figure = document.querySelector('[data-film]');
    const video = figure && figure.querySelector('video');
    const button = figure && figure.querySelector('.film__toggle');
    const label = button && button.querySelector('.film__label');
    if (!video || !button || !label) return;

    let pausedByReader = false;
    let startedByReader = false;
    let visible = false;

    const render = () => {
      const playing = !video.paused && !video.ended;
      figure.classList.toggle('is-playing', playing);
      label.textContent = playing ? 'Zatrzymaj film' : 'Odtwórz film';
    };

    const play = () => {
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(render);
      }
    };

    const autoplay = () => {
      if (!visible) {
        if (!video.paused) video.pause();
        return;
      }
      if (!pausedByReader && (motionAllowed() || startedByReader)) play();
    };

    video.removeAttribute('controls');
    button.hidden = false;

    button.addEventListener('click', () => {
      if (video.paused || video.ended) {
        pausedByReader = false;
        startedByReader = true;
        play();
      } else {
        pausedByReader = true;
        startedByReader = false;
        video.pause();
      }
    });

    video.addEventListener('play', render);
    video.addEventListener('pause', render);
    video.addEventListener('ended', render);

    if (hasObserver) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) visible = entry.isIntersecting;
          autoplay();
        },
        { threshold: 0.5 }
      );
      observer.observe(video);
    }

    onMotionChange(() => {
      if (!motionAllowed() && !startedByReader && !video.paused) video.pause();
      else autoplay();
    });

    render();
  }

  // Episode 5 in browsers without scroll-driven animations: the same panorama on the way
  // to the press, driven by --p (0 as the stage pins, 1 as it lets go). Without motion,
  // or without this script, the drive is the three still panels.
  function initDrive() {
    const track = document.querySelector('.drive__track');
    if (!track || supportsScrollTimeline || !hasObserver) return;

    const progress = () => {
      const rect = track.getBoundingClientRect();
      const travel = rect.height - viewHeight();
      return travel > 0 ? clamp(-rect.top / travel) : 0;
    };

    const update = () => track.style.setProperty('--p', progress().toFixed(4));
    const loop = scrollLoop(update);
    let near = false;

    const apply = () => {
      const moving = motionAllowed();
      root.classList.toggle('has-drive-fallback', moving);
      if (!moving) {
        loop.stop();
        track.style.removeProperty('--p');
        return;
      }
      update();
      if (near) loop.start();
    };

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) near = entry.isIntersecting;
      if (near && motionAllowed()) {
        loop.start();
      } else {
        loop.stop();
        if (motionAllowed()) update();
      }
    });

    apply();
    observer.observe(track);
    onMotionChange(apply);
  }

  // The stop button: one press stills every loop on the page and the choice is kept
  // for the next visit. Under reduced motion nothing moves, so it stays hidden.
  function initStill() {
    const button = document.querySelector('.still');
    const label = button && button.querySelector('.still__label');
    if (!button || !label) return;

    const STORAGE_KEY = 'makowski-sad-anime';

    const recall = () => {
      try {
        return window.localStorage.getItem(STORAGE_KEY) === 'still';
      } catch {
        return false;
      }
    };

    const remember = (value) => {
      try {
        if (value) window.localStorage.setItem(STORAGE_KEY, 'still');
        else window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Storage can be off (private windows, some file:// pages): the choice then
        // lasts for this visit only.
      }
    };

    let still = recall();

    const render = () => {
      root.classList.toggle('is-still', still);
      label.textContent = still ? 'Wznów animacje' : 'Zatrzymaj animacje';
      button.hidden = !motionAllowed();
    };

    button.addEventListener('click', () => {
      still = !still;
      remember(still);
      render();
    });

    onMotionChange(render);
    render();
  }

  initStill();
  initPhotoRelease();
  initDrive();
  initRevealFallback();
  initLoops();
  initFilm();
})();
