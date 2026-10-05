// Baśń o Makowskim Sadzie: motion and controls on top of a page that already
// works without them. Classic deferred script, so it also runs from file://.
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hasObserver = 'IntersectionObserver' in window;
  const supportsScrollTimeline =
    typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline: view()');

  const motionAllowed = () => !reducedMotion.matches;

  const onMotionChange = (callback) => {
    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', callback);
    } else if (typeof reducedMotion.addListener === 'function') {
      reducedMotion.addListener(callback);
    }
  };

  // Browsers without scroll-driven animations: ornaments that start below the
  // fold are "armed" (hidden by CSS) and drawn once they scroll into view.
  // Anything already on screen is left as it is, fully drawn.
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

    const fold = window.innerHeight;
    for (const item of document.querySelectorAll('[data-reveal]')) {
      if (item.getBoundingClientRect().top < fold) continue;
      item.classList.add('is-armed');
      observer.observe(item);
    }
  }

  // Petals, falling apples and glints only animate while they are on screen.
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

  // Chapter IV map: the road is inked and the car drives to the press as the
  // reader scrolls past. Without motion the road is whole and the car has arrived.
  function initMap() {
    const figure = document.querySelector('[data-map]');
    const svg = figure && figure.querySelector('svg');
    const track = figure && figure.querySelector('.map__track');
    const reveal = figure && figure.querySelector('.map__reveal');
    const car = figure && figure.querySelector('.map__car');
    if (!svg || !track || !reveal || !car || typeof track.getTotalLength !== 'function') return;
    if (!hasObserver) return;

    const length = track.getTotalLength();
    const parked = car.getAttribute('transform');
    let frame = 0;
    let listening = false;
    let near = false;

    const progress = () => {
      const rect = svg.getBoundingClientRect();
      const view = window.innerHeight || document.documentElement.clientHeight;
      const value = (view * 0.8 - rect.top) / (view * 0.2 + rect.height);
      return Math.min(1, Math.max(0, value));
    };

    const place = (amount) => {
      const distance = amount * length;
      const point = track.getPointAtLength(distance);
      const ahead = track.getPointAtLength(Math.min(length, distance + 2));
      const behind = track.getPointAtLength(Math.max(0, distance - 2));
      let angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
      let mirror = '';
      if (angle > 90 || angle < -90) {
        angle += 180;
        mirror = ' scale(-1 1)';
      }
      car.setAttribute(
        'transform',
        `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)}) rotate(${angle.toFixed(1)})${mirror}`
      );
      reveal.setAttribute('stroke-dashoffset', (1 - amount).toFixed(4));
    };

    const update = () => {
      frame = 0;
      place(progress());
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const start = () => {
      if (listening || !motionAllowed()) return;
      listening = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      update();
    };

    const stop = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const park = () => {
      stop();
      car.setAttribute('transform', parked);
      reveal.setAttribute('stroke-dashoffset', '0');
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) near = entry.isIntersecting;
        if (near) {
          start();
        } else {
          if (motionAllowed()) place(progress());
          stop();
        }
      },
      { rootMargin: '25% 0px' }
    );
    observer.observe(svg);

    if (motionAllowed()) place(progress());

    onMotionChange(() => {
      if (!motionAllowed()) {
        park();
        return;
      }
      place(progress());
      if (near) start();
    });
  }

  initRevealFallback();
  initLoops();
  initFilm();
  initMap();
})();
