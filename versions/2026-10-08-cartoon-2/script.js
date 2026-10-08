// Film: drawings play while their scene is on screen. The page already tells the
// whole story without this file. Classic deferred script, so it also runs from file://.
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

    for (const photo of document.querySelectorAll('.shot img[loading="lazy"]')) {
      observer.observe(photo.closest('.shot'));
    }
  }

  // Shots and narrative boxes that start below the fold are "armed" (hidden by CSS)
  // and spring into place once they scroll into view. Anything already on screen is
  // left as it is, fully drawn. The observer's first report says where each block is,
  // so nothing forces a layout at start-up.
  function initSlams() {
    if (!hasObserver || !motionAllowed()) return;

    const seen = new WeakSet();
    const observer = new IntersectionObserver(
      (entries) => {
        let order = 0;
        for (const entry of entries) {
          const item = entry.target;
          if (!seen.has(item)) {
            seen.add(item);
            if (entry.isIntersecting || entry.boundingClientRect.top < viewHeight()) {
              observer.unobserve(item);
              continue;
            }
            item.classList.add('is-armed');
            continue;
          }
          if (!entry.isIntersecting) continue;
          item.style.setProperty('--delay', `${Math.min(order, 4) * 0.08}s`);
          item.classList.add('is-inview');
          observer.unobserve(item);
          order += 1;
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    for (const item of document.querySelectorAll('[data-slam]')) observer.observe(item);

    onMotionChange(() => {
      if (motionAllowed()) return;
      observer.disconnect();
      for (const item of document.querySelectorAll('.is-armed')) {
        item.classList.remove('is-armed', 'is-inview');
      }
    });
  }

  // The press runs a few short cycles whenever it comes into view, then rests.
  function initLoops() {
    const loops = document.querySelectorAll('[data-loop]');
    if (!loops.length || !hasObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle('is-playing', entry.isIntersecting);
        }
      },
      { threshold: 0 }
    );
    loops.forEach((loop) => observer.observe(loop));
  }

  // Browsers without scroll-driven animations: the car still keeps pace with the
  // reader, driven by --drive (0 at the orchard, 1 at the press). Without motion, or
  // without this script, the car has already arrived.
  function initDrive() {
    const drive = document.querySelector('[data-drive]');
    const stage = drive && drive.querySelector('.route__stage');
    if (!stage || supportsScrollTimeline || !hasObserver) return;

    const progress = () => {
      const rect = stage.getBoundingClientRect();
      const travel = viewHeight() - rect.height;
      if (travel <= 0) return 1;
      const seen = clamp((viewHeight() - rect.bottom) / travel);
      return clamp((seen - 0.08) / 0.74);
    };

    const update = () => drive.style.setProperty('--drive', progress().toFixed(4));
    const loop = scrollLoop(update);
    let near = false;

    const apply = () => {
      const moving = motionAllowed();
      root.classList.toggle('has-drive-fallback', moving);
      if (!moving) {
        loop.stop();
        drive.style.removeProperty('--drive');
        return;
      }
      update();
      if (near) loop.start();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) near = entry.isIntersecting;
        if (near && motionAllowed()) {
          loop.start();
        } else {
          loop.stop();
          if (motionAllowed()) update();
        }
      },
      { rootMargin: '20% 0px' }
    );

    apply();
    observer.observe(stage);
    onMotionChange(apply);
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

  initPhotoRelease();
  initSlams();
  initLoops();
  initDrive();
  initFilm();
})();
