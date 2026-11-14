/* Rok w sadzie – Makowski Sad.
   A classic deferred script, so the page also works when opened from disk.
   Everything here is an enhancement. Without it the whole story is visible, the season
   links jump to their sections and each photo link opens the large file.
   The class "motion" on <html> (set in the head unless reduced motion is asked for)
   turns on the pinned scenes; this script only feeds them their scroll position. */
(() => {
  'use strict';

  const root = document.documentElement;
  const motion = root.classList.contains('motion');
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const ease = (v) => 1 - Math.pow(1 - v, 3);
  let paused = false;

  /* ---- things fade in or draw themselves as they come into view ---- */
  const reveals = document.querySelectorAll('.reveal, .orn');
  const showAll = () => reveals.forEach((el) => el.classList.add('in'));
  if ('IntersectionObserver' in window) {
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('in');
          seen.unobserve(entry.target);
          const counter = entry.target.querySelector('[data-count]');
          if (counter) count(counter);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    reveals.forEach((el) => seen.observe(el));
    window.addEventListener('beforeprint', showAll);

    /* Looping drawings run only while they are on screen. */
    const live = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.classList.toggle('live', entry.isIntersecting);
    });
    document.querySelectorAll('[data-live]').forEach((el) => live.observe(el));
  } else {
    showAll();
    document.querySelectorAll('[data-live]').forEach((el) => el.classList.add('live'));
  }

  /* ---- "około 300 litrów" counts up once ---- */
  function count(el) {
    if (!motion || el.dataset.done) return;
    el.dataset.done = '1';
    const target = Number(el.dataset.count);
    const started = performance.now();
    const step = (now) => {
      const p = clamp((now - started) / 1600);
      el.textContent = String(Math.round(target * ease(p)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  document.querySelectorAll('.ch-text [data-count]').forEach((el) => {
    /* The number sits in the text column, which is not a .reveal: watch it directly. */
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        count(el);
        io.disconnect();
      }
    }, { threshold: 0.6 });
    io.observe(el);
  });

  /* ---- scroll-linked pieces ---- */
  const links = new Map();
  document.querySelectorAll('.seasons a[data-nav]').forEach((a) => links.set(a.dataset.nav, a));
  const sections = [...document.querySelectorAll('[data-season]')];
  const bar = document.querySelector('.seasons ul');
  const scenes = motion ? [...document.querySelectorAll('[data-scene]')] : [];
  const ripen = motion ? document.querySelector('[data-ripen]') : null;
  const ripenItems = ripen ? [...ripen.querySelectorAll('.strip > li')] : [];
  const ripenSteps = ripen ? [...ripen.querySelectorAll('.ripen-steps li')] : [];
  const route = document.querySelector('[data-route]');
  const roadPath = route ? route.querySelector('.route-done') : null;
  const car = route ? route.querySelector('.route-car') : null;
  const roadLength = roadPath && roadPath.getTotalLength ? roadPath.getTotalLength() : 0;
  const cssProgress = window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()');
  const progress = document.querySelector('.progress span');
  let season = null;
  let ripenStep = -1;

  /* Split the claim into words so that they can light up one after another. */
  const claims = motion ? [...document.querySelectorAll('[data-words]')] : [];
  for (const claim of claims) {
    const p = claim.querySelector('p');
    const words = p.textContent.trim().split(/ /);
    p.textContent = '';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'w';
      span.style.setProperty('--i', i);
      span.textContent = word;
      p.append(span, i < words.length - 1 ? ' ' : '');
    });
    claim.style.setProperty('--n', words.length);
  }

  /* Progress of a pinned block: 0 when its top reaches the top of the window,
     1 when its bottom reaches the bottom. */
  const pinned = (el, vh) => {
    const rect = el.getBoundingClientRect();
    return clamp(-rect.top / Math.max(1, rect.height - vh));
  };

  const update = () => {
    const vh = window.innerHeight;

    /* season bar */
    let current = null;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= vh * 0.4) current = section.id;
    }
    if (current !== season) {
      season = current;
      links.forEach((a, id) => {
        if (id === current) {
          a.setAttribute('aria-current', 'true');
          if (bar.scrollWidth > bar.clientWidth) {
            bar.scrollLeft = a.offsetLeft - bar.clientWidth / 2 + a.offsetWidth / 2;
          }
        } else {
          a.removeAttribute('aria-current');
        }
      });
    }

    /* progress line fallback */
    if (!cssProgress && progress) {
      const max = root.scrollHeight - vh;
      progress.style.setProperty('--p', max > 0 ? clamp(window.scrollY / max).toFixed(4) : '0');
    }

    /* season scenes: the window opens over the first 80% of the pin */
    for (const scene of scenes) {
      const rect = scene.getBoundingClientRect();
      if (rect.bottom < -vh || rect.top > 2 * vh) continue;
      const t = ease(clamp(-rect.top / Math.max(1, (rect.height - vh) * 0.8)));
      scene.style.setProperty('--t', t.toFixed(4));
    }

    /* the claim: lit from when it enters to when it reaches the middle of the screen */
    for (const claim of claims) {
      const rect = claim.getBoundingClientRect();
      if (rect.bottom < -vh || rect.top > 2 * vh) continue;
      claim.style.setProperty('--t', clamp((vh * 0.95 - rect.top) / (vh * 0.6)).toFixed(4));
    }

    /* the ripening apple */
    if (ripen) {
      const step = Math.min(ripenItems.length - 1, Math.floor(pinned(ripen, vh) * ripenItems.length));
      if (step !== ripenStep) {
        ripenStep = step;
        ripenItems.forEach((li, i) => li.classList.toggle('on', i === step));
        ripenSteps.forEach((li, i) => li.classList.toggle('on', i === step));
      }
    }

    /* the car drives the road while the drawing crosses the screen */
    if (motion && route && roadLength) {
      const rect = route.getBoundingClientRect();
      if (rect.bottom > -vh && rect.top < 2 * vh) {
        const t = clamp((vh * 0.85 - rect.top) / (vh * 0.6));
        route.style.setProperty('--t', t.toFixed(4));
        const at = roadPath.getPointAtLength(roadLength * t);
        const ahead = roadPath.getPointAtLength(Math.min(roadLength, roadLength * t + 2));
        const behind = roadPath.getPointAtLength(Math.max(0, roadLength * t - 2));
        const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
        car.setAttribute('transform', `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
      }
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  /* The first measurement waits for a frame, so it never forces an early layout. */
  onScroll();

  /* ---- petals in spring, motes of light in summer, leaves in autumn ---- */
  const canvas = document.querySelector('.air');
  const pauseButton = document.querySelector('.pause');
  if (motion && canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const KINDS = {
      petal: { colors: ['#f2b8c9', '#e99bb3', '#fbe3ea', '#f6cdd8'], size: [7, 12], fall: [22, 46], sway: 26 },
      mote: { colors: ['#e9b93a', '#f3d36b', '#d99a1f'], size: [1.6, 3.4], fall: [-16, -5], sway: 14 },
      leaf: { colors: ['#f0b04a', '#d9772b', '#b8431f', '#e3c14f'], size: [9, 15], fall: [30, 62], sway: 38 },
    };
    const kindFor = () => {
      if (season === null || season === 'wiosna') return 'petal';
      if (season === 'lato') return 'mote';
      if (season === 'jesien') return 'leaf';
      return null;
    };
    const rand = (a, b) => a + Math.random() * (b - a);
    let width = 0;
    let height = 0;
    let dpr = 1;
    let items = [];
    let last = 0;
    let running = false;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    const spawn = (kind, anywhere) => {
      const k = KINDS[kind];
      const up = k.fall[0] < 0;
      return {
        kind,
        x: rand(0, width),
        y: anywhere ? rand(0, height) : up ? height + 20 : -20,
        size: rand(k.size[0], k.size[1]),
        vy: rand(k.fall[0], k.fall[1]),
        sway: rand(0.4, 1) * k.sway,
        phase: rand(0, Math.PI * 2),
        speed: rand(0.6, 1.5),
        spin: rand(-1.4, 1.4),
        color: k.colors[Math.floor(Math.random() * k.colors.length)],
        fade: 1,
      };
    };

    const draw = (p, time) => {
      const wobble = Math.sin(p.phase + time * p.speed);
      const x = p.x + wobble * p.sway;
      ctx.save();
      ctx.translate(x, p.y);
      ctx.fillStyle = p.color;
      if (p.kind === 'mote') {
        ctx.globalAlpha = p.fade * (0.35 + 0.45 * (0.5 + 0.5 * Math.sin(p.phase * 3 + time * 2.2)));
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.rotate(p.phase + time * p.spin);
        /* A flat shape seen turning in the air: squash it along one axis. */
        ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.cos(p.phase + time * p.speed * 1.3)));
        ctx.globalAlpha = 0.9 * p.fade;
        const s = p.size;
        ctx.beginPath();
        if (p.kind === 'petal') {
          ctx.moveTo(0, -s);
          ctx.bezierCurveTo(s * 0.9, -s * 0.7, s * 0.8, s * 0.6, 0, s);
          ctx.bezierCurveTo(-s * 0.8, s * 0.6, -s * 0.9, -s * 0.7, 0, -s);
          ctx.fill();
        } else {
          ctx.moveTo(0, -s * 1.2);
          ctx.quadraticCurveTo(s * 0.95, -s * 0.2, 0, s * 1.2);
          ctx.quadraticCurveTo(-s * 0.95, -s * 0.2, 0, -s * 1.2);
          ctx.fill();
          ctx.globalAlpha = 0.35 * p.fade;
          ctx.strokeStyle = '#3a1d0c';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, -s * 1.1);
          ctx.lineTo(0, s * 1.5);
          ctx.stroke();
        }
      }
      ctx.restore();
    };

    const frame = (now) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      const time = now / 1000;
      const kind = kindFor();
      const wanted = kind ? Math.round(Math.min(30, Math.max(10, width / 48))) : 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      items = items.filter((p) => p.y > -40 && p.y < height + 40);
      /* Shapes of a season that has passed fade out; new ones match the season. */
      const ofKind = items.filter((p) => p.kind === kind).length;
      if (kind && ofKind < wanted && Math.random() < 0.12) items.push(spawn(kind, false));
      for (const p of items) {
        p.y += p.vy * dt;
        if (p.kind !== kind) p.fade -= dt * 1.2;
        draw(p, time);
      }
      items = items.filter((p) => p.fade > 0);
      if (!items.length && !kind) {
        running = false;
        return;
      }
      requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || paused || document.hidden) return;
      running = true;
      last = performance.now();
      requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    window.addEventListener('scroll', start, { passive: true });

    /* Begin after the page has loaded, so the first paint is never held up. */
    const begin = () => {
      const kind = kindFor();
      if (kind) for (let i = 0; i < 8; i += 1) items.push(spawn(kind, true));
      start();
    };
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
    const later = () => setTimeout(() => idle(begin), 900);
    if (document.readyState === 'complete') later();
    else window.addEventListener('load', later);

    if (pauseButton) {
      pauseButton.hidden = false;
      const label = pauseButton.querySelector('.pause-label');
      pauseButton.addEventListener('click', () => {
        paused = !paused;
        root.classList.toggle('paused', paused);
        pauseButton.setAttribute('aria-pressed', String(paused));
        label.textContent = paused ? 'Wznów ruch' : 'Zatrzymaj ruch';
        if (paused) {
          stop();
          items = [];
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          start();
        }
      });
    }
  }

  /* ---- lightbox: a photo opens large, arrows move through all photos ---- */
  const box = document.querySelector('.lightbox');
  const zooms = [...document.querySelectorAll('a.zoom')];
  if (!box || typeof box.showModal !== 'function' || !zooms.length) return;

  const img = box.querySelector('img');
  const caption = box.querySelector('figcaption');
  let index = 0;
  let opener = null;

  const show = (i) => {
    index = (i + zooms.length) % zooms.length;
    const link = zooms[index];
    const small = link.querySelector('img');
    const figcaption = link.parentElement.querySelector('figcaption');
    const text = figcaption ? figcaption.cloneNode(true) : null;
    if (text) text.querySelectorAll('.tag').forEach((tag) => tag.remove());
    /* Show the photo that is already loaded at once, then swap in the large file. */
    img.src = small.currentSrc || small.src;
    img.alt = small.alt;
    caption.textContent = text ? text.textContent.trim() : small.alt;
    const large = new Image();
    const wanted = index;
    large.onload = () => {
      if (box.open && wanted === index) img.src = large.src;
    };
    large.src = link.href;
  };

  zooms.forEach((link, i) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;
      event.preventDefault();
      opener = link;
      show(i);
      box.showModal();
    });
  });

  box.querySelector('.lb-close').addEventListener('click', () => box.close());
  box.querySelector('.lb-prev').addEventListener('click', () => show(index - 1));
  box.querySelector('.lb-next').addEventListener('click', () => show(index + 1));
  box.addEventListener('click', (event) => {
    if (event.target === box || event.target.tagName === 'FIGURE') box.close();
  });
  box.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });
  box.addEventListener('close', () => {
    img.removeAttribute('src');
    if (opener) opener.focus({ preventScroll: true });
  });

  let startX = null;
  box.addEventListener('touchstart', (event) => {
    startX = event.touches.length === 1 ? event.touches[0].clientX : null;
  }, { passive: true });
  box.addEventListener('touchend', (event) => {
    if (startX === null) return;
    const dx = event.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
