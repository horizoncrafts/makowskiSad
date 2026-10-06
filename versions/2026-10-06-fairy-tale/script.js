// Wejdź do sadu: the walk through the orchard, laid over a page that already tells
// the whole story without it. Classic deferred script, so it also runs from file://.
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

  // Resolves once the head of index.html has seen the page loaded and painted.
  const afterFirstPaint = () =>
    new Promise((resolve) => {
      if (!root.classList.contains('is-holding-photos')) {
        resolve();
        return;
      }
      const watcher = new MutationObserver(() => {
        if (root.classList.contains('is-holding-photos')) return;
        watcher.disconnect();
        resolve();
      });
      watcher.observe(root, { attributes: true, attributeFilter: ['class'] });
    });

  const whenIdle = (callback) => {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(callback, { timeout: 2500 });
    } else {
      window.setTimeout(callback, 600);
    }
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

  // The gate in browsers without scroll-driven animations: the same walk in between
  // the trees, driven by --p (0 at the top, 1 once the reader is through).
  function initGate() {
    const gate = document.querySelector('.gate');
    if (!gate || supportsScrollTimeline || !hasObserver) return;

    const progress = () => {
      const rect = gate.getBoundingClientRect();
      const travel = rect.height - viewHeight();
      return travel > 0 ? clamp(-rect.top / travel) : 0;
    };

    const update = () => gate.style.setProperty('--p', progress().toFixed(4));
    const loop = scrollLoop(update);
    let near = true;

    const apply = () => {
      const moving = motionAllowed();
      root.classList.toggle('has-gate-fallback', moving);
      if (!moving) {
        loop.stop();
        gate.style.removeProperty('--p');
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
    observer.observe(gate);
    onMotionChange(apply);
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

  // Motes, swaying fruit, the press and the lanterns only move while they are on screen.
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

  // Chapter IV: the car keeps pace with the reader's eye line on its way to the press and
  // inks the road behind it. Without motion, or without this script, the road is whole
  // and the car has arrived.
  function initRoad() {
    const figure = document.querySelector('[data-road]');
    const svg = figure && figure.querySelector('.road__map');
    const bed = figure && figure.querySelector('.road__bed');
    const car = figure && figure.querySelector('.road__car');
    const inks = figure ? [...figure.querySelectorAll('.road__trail, .road__glow')] : [];
    if (!svg || !bed || !car || !inks.length || !hasObserver) return;
    if (typeof bed.getTotalLength !== 'function') return;

    const length = bed.getTotalLength();
    const parked = car.getAttribute('transform');
    const mapHeight = (svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.height) || 900;

    // The road only ever runs downhill, so each height on the map is one place on it.
    const samples = [];
    for (let i = 0; i <= 120; i += 1) {
      const at = (length * i) / 120;
      samples.push([at, bed.getPointAtLength(at).y]);
    }

    const distanceAt = (y) => {
      if (y <= samples[0][1]) return 0;
      for (let i = 1; i < samples.length; i += 1) {
        const [at, sampleY] = samples[i];
        if (y > sampleY) continue;
        const [previousAt, previousY] = samples[i - 1];
        return previousAt + ((at - previousAt) * (y - previousY)) / (sampleY - previousY || 1);
      }
      return length;
    };

    const drive = (at) => {
      const point = bed.getPointAtLength(at);
      const ahead = bed.getPointAtLength(Math.min(length, at + 3));
      const behind = bed.getPointAtLength(Math.max(0, at - 3));
      const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
      car.setAttribute(
        'transform',
        `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)}) rotate(${angle.toFixed(1)})`
      );
      const offset = at >= length ? '0' : (1 - at / length).toFixed(4);
      inks.forEach((ink) => ink.setAttribute('stroke-dashoffset', offset));
    };

    const follow = () => {
      const rect = svg.getBoundingClientRect();
      if (!rect.height) return;
      drive(distanceAt(((viewHeight() * 0.55 - rect.top) / rect.height) * mapHeight));
    };

    const park = () => {
      loop.stop();
      car.setAttribute('transform', parked);
      inks.forEach((ink) => ink.setAttribute('stroke-dashoffset', '0'));
    };

    const loop = scrollLoop(follow);
    let near = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) near = entry.isIntersecting;
        if (!motionAllowed()) return;
        if (near) {
          loop.start();
        } else {
          follow();
          loop.stop();
        }
      },
      { rootMargin: '25% 0px' }
    );
    observer.observe(svg);

    if (motionAllowed()) follow();

    onMotionChange(() => {
      if (!motionAllowed()) {
        park();
        return;
      }
      follow();
      if (near) loop.start();
    });
  }

  // The magic: juice-gold light on a fixed canvas below the content, a different kind
  // in each chapter, and a burst of sparks where the reader taps the orchard. The
  // switch stops it together with every other decorative loop on the page.
  function initMagic() {
    const masthead = document.querySelector('.masthead');
    if (!masthead) return;

    const STORAGE_KEY = 'makowski-sad-magia';
    const TAU = Math.PI * 2;
    const rand = (min, max) => min + Math.random() * (max - min);
    const pick = (list) => list[Math.floor(Math.random() * list.length)];

    const GOLD = '255, 217, 142';
    const AMBER = '243, 182, 75';
    const CREAM = '255, 243, 207';
    const ROSE = '242, 196, 204';
    const EMBER = '232, 104, 74';
    const POLLEN = '226, 240, 150';
    const DUST = '255, 197, 138';

    // Each kind fills the screen in about a second and a half and then keeps itself
    // topped up. "fresh" particles appear anywhere; later ones come in from an edge.
    const MODES = {
      fireflies: {
        count: 20,
        make: (w, h) => ({
          shape: 'glow',
          rgb: pick([GOLD, GOLD, CREAM]),
          x: rand(0, w),
          y: rand(h * 0.1, h),
          vx: rand(-7, 7),
          vy: rand(-9, 3),
          sway: rand(10, 22),
          swayRate: rand(0.35, 0.8),
          size: rand(8, 15),
          life: rand(6, 11),
          pulse: rand(1.1, 2.2),
        }),
      },
      petals: {
        count: 18,
        make: (w, h, fresh) => ({
          shape: 'petal',
          color: pick(['#f7e3e6', '#f2c4cc', '#fbeff1', '#eab3be']),
          x: rand(-0.15 * w, w),
          y: fresh ? rand(0, h * 0.8) : rand(-30, -10),
          vx: rand(12, 34),
          vy: rand(26, 50),
          sway: rand(16, 30),
          swayRate: rand(0.7, 1.3),
          size: rand(5, 8.5),
          angle: rand(0, TAU),
          spin: rand(-1.3, 1.3),
          flip: rand(1.1, 2.4),
          life: rand(24, 32),
        }),
      },
      pollen: {
        count: 26,
        make: (w, h) => ({
          shape: 'glow',
          rgb: pick([POLLEN, POLLEN, GOLD]),
          x: rand(0, w),
          y: rand(0, h),
          vx: rand(-4, 4),
          vy: rand(-14, -5),
          sway: rand(4, 10),
          swayRate: rand(0.5, 1.1),
          size: rand(4, 7.5),
          life: rand(5, 9),
          pulse: rand(0.8, 1.6),
        }),
      },
      leaves: {
        count: 12,
        make: (w, h, fresh) => ({
          shape: 'leaf',
          color: pick(['#e0a03a', '#c8642e', '#d9b44a', '#a8612b', '#8fa83e']),
          x: rand(-0.1 * w, w),
          y: fresh ? rand(0, h * 0.8) : rand(-30, -10),
          vx: rand(-8, 26),
          vy: rand(40, 70),
          sway: rand(24, 42),
          swayRate: rand(0.8, 1.4),
          size: rand(7, 11),
          angle: rand(0, TAU),
          spin: rand(-1.8, 1.8),
          flip: rand(1.6, 3),
          life: rand(20, 26),
        }),
      },
      dust: {
        count: 24,
        make: (w, h) => ({
          shape: 'glow',
          rgb: pick([DUST, GOLD]),
          x: rand(-0.1 * w, w),
          y: rand(0, h),
          vx: rand(8, 22),
          vy: rand(-4, 3),
          sway: rand(4, 9),
          swayRate: rand(0.4, 0.9),
          size: rand(4, 9),
          life: rand(6, 10),
          pulse: rand(0.6, 1.2),
        }),
      },
      sparks: {
        count: 18,
        make: (w, h, fresh) => ({
          shape: 'spark',
          rgb: pick([GOLD, AMBER, CREAM]),
          x: rand(0, w),
          y: fresh ? rand(h * 0.2, h) : rand(h * 0.55, h + 10),
          vx: rand(-6, 6),
          vy: rand(-38, -18),
          sway: rand(3, 8),
          swayRate: rand(0.6, 1.2),
          size: rand(2.6, 5.2),
          angle: rand(0, TAU),
          spin: rand(-0.6, 0.6),
          life: rand(2.6, 4.6),
          pulse: rand(2.2, 3.4),
        }),
      },
      glow: {
        count: 9,
        make: (w, h) => ({
          shape: 'glow',
          soft: true,
          rgb: pick([AMBER, DUST, GOLD]),
          x: rand(0, w),
          y: rand(h * 0.1, h),
          vx: rand(-5, 5),
          vy: rand(-12, -5),
          sway: rand(6, 12),
          swayRate: rand(0.25, 0.5),
          size: rand(26, 54),
          life: rand(9, 14),
          peak: rand(0.18, 0.32),
          pulse: rand(0.4, 0.7),
        }),
      },
      lanterns: {
        count: 18,
        make: (w, h) => ({
          shape: 'glow',
          rgb: pick([GOLD, ROSE, EMBER, GOLD]),
          x: rand(0, w),
          y: rand(h * 0.2, h),
          vx: rand(-5, 5),
          vy: rand(-24, -10),
          sway: rand(8, 16),
          swayRate: rand(0.5, 1),
          size: rand(6, 11),
          life: rand(6, 10),
          pulse: rand(1, 1.9),
        }),
      },
    };

    const burst = (x, y) => {
      const count = 16;
      for (let i = 0; i < count; i += 1) {
        const direction = (TAU * i) / count + rand(-0.2, 0.2);
        const speed = rand(70, 190);
        particles.push({
          mode: 'burst',
          shape: 'spark',
          rgb: pick([GOLD, CREAM, AMBER]),
          x,
          y,
          vx: Math.cos(direction) * speed,
          vy: Math.sin(direction) * speed - 60,
          gravity: 150,
          drag: 1.8,
          size: rand(2.6, 5),
          angle: rand(0, TAU),
          spin: rand(-3, 3),
          life: rand(0.8, 1.4),
          peak: 1,
          phase: 0,
          depth: 0,
          age: 0,
        });
      }
    };

    // Controls
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'magic-toggle';
    button.innerHTML =
      '<svg class="magic-toggle__icon magic-toggle__icon--on" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>' +
      '<svg class="magic-toggle__icon magic-toggle__icon--off" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.5l2.1 6.4 6.4 2.1-6.4 2.1L12 19.5l-2.1-6.4L3.5 11l6.4-2.1zM18.5 15.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z" /></svg>' +
      '<span class="magic-toggle__label"></span>';
    const label = button.querySelector('.magic-toggle__label');

    const recall = () => {
      try {
        return window.localStorage.getItem(STORAGE_KEY) === 'off';
      } catch {
        return false;
      }
    };

    const remember = (value) => {
      try {
        if (value) window.localStorage.setItem(STORAGE_KEY, 'off');
        else window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Storage can be off (private windows, some file:// pages): the choice then
        // lasts for this visit only.
      }
    };

    let still = recall();

    const render = () => {
      root.classList.toggle('is-still', still);
      label.textContent = still ? 'Wznów magię' : 'Zatrzymaj magię';
      button.hidden = !motionAllowed();
    };

    render();
    masthead.append(button);

    // Canvas
    const sections = [...document.querySelectorAll('[data-magic]')];
    const canUseCanvas = hasObserver && !!document.createElement('canvas').getContext;
    const particles = [];
    const sprites = new Map();
    let canvas = null;
    let context = null;
    let ready = false;
    let running = false;
    let raf = 0;
    let width = 0;
    let height = 0;
    let density = 1;
    let mode = 'off';
    let modeSince = 0;
    let clock = 0;
    let last = 0;
    let lastScroll = 0;
    let owed = 0;

    const sprite = (rgb, soft) => {
      const key = `${soft ? 'soft' : 'core'}:${rgb}`;
      let image = sprites.get(key);
      if (image) return image;
      image = document.createElement('canvas');
      image.width = 64;
      image.height = 64;
      const paint = image.getContext('2d');
      const fill = paint.createRadialGradient(32, 32, 0, 32, 32, 32);
      if (soft) {
        fill.addColorStop(0, `rgba(${rgb}, 0.9)`);
        fill.addColorStop(0.55, `rgba(${rgb}, 0.35)`);
      } else {
        fill.addColorStop(0, 'rgba(255, 250, 235, 1)');
        fill.addColorStop(0.16, `rgba(${rgb}, 0.95)`);
        fill.addColorStop(0.42, `rgba(${rgb}, 0.28)`);
      }
      fill.addColorStop(1, `rgba(${rgb}, 0)`);
      paint.fillStyle = fill;
      paint.fillRect(0, 0, 64, 64);
      sprites.set(key, image);
      return image;
    };

    const resize = () => {
      if (!canvas) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const nextWidth = canvas.clientWidth;
      const nextHeight = canvas.clientHeight;
      if (nextWidth === width && nextHeight === height && canvas.width) return;
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      density = clamp((width * height) / (1280 * 800), 0.45, 1.25);
    };

    const ensureCanvas = () => {
      if (canvas) return true;
      canvas = document.createElement('canvas');
      canvas.className = 'magic';
      canvas.setAttribute('aria-hidden', 'true');
      context = canvas.getContext('2d');
      if (!context) {
        canvas = null;
        return false;
      }
      document.body.append(canvas);
      resize();
      return true;
    };

    const spawn = (dt) => {
      const kind = MODES[mode];
      if (!kind) return;
      const target = Math.round(kind.count * density);
      let alive = 0;
      for (const particle of particles) if (particle.mode === mode && !particle.leftAt) alive += 1;
      if (alive >= target) {
        owed = 0;
        return;
      }
      owed += (target / 1.5) * dt;
      const fresh = clock - modeSince < 1.2;
      while (owed >= 1 && alive < target) {
        owed -= 1;
        alive += 1;
        particles.push({
          ...kind.make(width, height, fresh),
          mode,
          phase: rand(0, TAU),
          depth: rand(0.08, 0.3),
          age: 0,
        });
      }
    };

    const alphaOf = (particle) => {
      const progress = particle.age / particle.life;
      let alpha = Math.min(1, progress / 0.15, (1 - progress) / 0.3) * (particle.peak || 0.9);
      if (particle.pulse) alpha *= 0.55 + 0.45 * Math.sin(clock * particle.pulse + particle.phase);
      if (particle.leftAt) alpha *= 1 - (clock - particle.leftAt) / 1.2;
      return alpha;
    };

    const move = (particle, dt, scrolled) => {
      particle.age += dt;
      if (particle.gravity) particle.vy += particle.gravity * dt;
      if (particle.drag) {
        const keep = Math.exp(-particle.drag * dt);
        particle.vx *= keep;
        particle.vy *= keep;
      }
      const wave = clock * (particle.swayRate || 0) + particle.phase;
      const swayX = particle.sway ? Math.sin(wave) * particle.sway : 0;
      const swayY = particle.sway && particle.shape === 'glow' ? Math.cos(wave * 0.8) * particle.sway * 0.5 : 0;
      particle.x += (particle.vx + swayX) * dt;
      particle.y += (particle.vy + swayY) * dt - scrolled * particle.depth;
      if (particle.spin) particle.angle += particle.spin * dt;
    };

    const outside = (particle) =>
      particle.y > height + 60 || particle.y < -80 || particle.x < -80 || particle.x > width + 80;

    const petal = (size) => {
      context.beginPath();
      context.moveTo(0, -size);
      context.bezierCurveTo(size * 0.95, -size * 0.75, size * 0.7, size * 0.8, 0, size);
      context.bezierCurveTo(-size * 0.7, size * 0.8, -size * 0.95, -size * 0.75, 0, -size);
      context.fill();
    };

    const leaf = (size) => {
      context.beginPath();
      context.moveTo(-size, 0);
      context.quadraticCurveTo(0, -size * 0.62, size, 0);
      context.quadraticCurveTo(0, size * 0.62, -size, 0);
      context.fill();
    };

    const star = (size) => {
      const waist = size * 0.28;
      context.beginPath();
      context.moveTo(0, -size);
      context.lineTo(waist, -waist);
      context.lineTo(size, 0);
      context.lineTo(waist, waist);
      context.lineTo(0, size);
      context.lineTo(-waist, waist);
      context.lineTo(-size, 0);
      context.lineTo(-waist, -waist);
      context.closePath();
      context.fill();
    };

    const draw = (particle, alpha) => {
      context.globalAlpha = alpha;
      const { x, y, size } = particle;
      if (particle.shape === 'glow') {
        context.drawImage(sprite(particle.rgb, particle.soft), x - size, y - size, size * 2, size * 2);
        return;
      }
      if (particle.shape === 'spark') {
        context.drawImage(sprite(particle.rgb, false), x - size * 3, y - size * 3, size * 6, size * 6);
      }
      context.save();
      context.translate(x, y);
      context.rotate(particle.angle || 0);
      if (particle.shape === 'spark') {
        context.fillStyle = '#fff6dc';
        star(size);
      } else {
        context.scale(1, Math.cos(clock * particle.flip + particle.phase));
        context.fillStyle = particle.color;
        if (particle.shape === 'leaf') leaf(size);
        else petal(size);
      }
      context.restore();
    };

    const frame = (now) => {
      raf = 0;
      const dt = last ? clamp((now - last) / 1000, 0, 0.05) : 1 / 60;
      last = now;
      clock += dt;
      const scroll = window.scrollY;
      const scrolled = scroll - lastScroll;
      lastScroll = scroll;

      spawn(dt);
      context.clearRect(0, 0, width, height);

      let kept = 0;
      for (const particle of particles) {
        move(particle, dt, scrolled);
        if (particle.age >= particle.life || outside(particle)) continue;
        const alpha = alphaOf(particle);
        if (particle.leftAt && alpha <= 0) continue;
        if (alpha > 0.01) draw(particle, alpha);
        particles[kept] = particle;
        kept += 1;
      }
      particles.length = kept;
      context.globalAlpha = 1;

      if (particles.length || MODES[mode]) {
        raf = window.requestAnimationFrame(frame);
      } else {
        running = false;
      }
    };

    const pause = () => {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      running = false;
    };

    const halt = () => {
      pause();
      particles.length = 0;
      if (context) context.clearRect(0, 0, width, height);
    };

    const wake = () => {
      if (running || !ready || still || !motionAllowed() || document.hidden) return;
      if (!MODES[mode] && !particles.length) return;
      if (!ensureCanvas()) return;
      running = true;
      last = 0;
      lastScroll = window.scrollY;
      raf = window.requestAnimationFrame(frame);
    };

    const setMode = (next) => {
      if (next === mode) return;
      for (const particle of particles) {
        if (particle.mode !== 'burst' && particle.mode !== next && !particle.leftAt) {
          particle.leftAt = clock;
        }
      }
      mode = next;
      modeSince = clock;
      owed = 0;
      wake();
    };

    button.addEventListener('click', () => {
      still = !still;
      remember(still);
      render();
      if (still) halt();
      else wake();
    });

    onMotionChange(() => {
      render();
      if (motionAllowed()) wake();
      else halt();
    });

    if (!canUseCanvas || !sections.length) return;

    const inBand = new Set();
    const modeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target);
          else inBand.delete(entry.target);
        }
        const active = sections.filter((section) => inBand.has(section)).pop();
        setMode(active ? active.dataset.magic : 'off');
      },
      { rootMargin: '-48% 0px -48% 0px' }
    );

    const interactive =
      'a, button, input, select, textarea, label, summary, video, [tabindex]:not([tabindex="-1"])';

    const onClick = (event) => {
      if (still || !motionAllowed() || event.detail === 0) return;
      if (event.target instanceof Element && event.target.closest(interactive)) return;
      if (!ensureCanvas()) return;
      burst(event.clientX, event.clientY);
      wake();
    };

    let resizeFrame = 0;
    const onResize = () => {
      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
      });
    };

    afterFirstPaint().then(() =>
      whenIdle(() => {
        ready = true;
        sections.forEach((section) => modeObserver.observe(section));
        document.addEventListener('click', onClick);
        window.addEventListener('resize', onResize, { passive: true });
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) pause();
          else wake();
        });
        wake();
      })
    );
  }

  initPhotoRelease();
  initGate();
  initRevealFallback();
  initLoops();
  initFilm();
  initRoad();
  initMagic();
})();
