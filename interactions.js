(() => {
  'use strict';
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let enabled = !reduced.matches;
  try { enabled = enabled && localStorage.getItem('yutong-motion') !== 'off'; } catch {}

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'motion-toggle';
  toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12h3l3-7 6 14 3-7h3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.querySelector('.nav-actions').prepend(toggle);
  const labelToggle = () => {
    const zh = root.lang.startsWith('zh');
    const label = reduced.matches ? (zh ? '已遵循系统设置减少动效' : 'Reduced motion follows your system setting') : enabled ? (zh ? '暂停动效' : 'Pause animations') : (zh ? '开启动效' : 'Enable animations');
    toggle.disabled = reduced.matches;
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.title = label;
  };
  new MutationObserver(labelToggle).observe(root, { attributes: true, attributeFilter: ['lang'] });

  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  let scrollFrame = 0;
  const updateProgress = () => {
    scrollFrame = 0;
    const max = root.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0})`;
  };
  addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress); }, { passive: true });
  addEventListener('resize', updateProgress, { passive: true });
  new ResizeObserver(updateProgress).observe(document.body);
  updateProgress();

  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.section-heading,.about-layout,.research-card,.paper,.earlier-work,.news-list,.contact-main').forEach(el => {
      el.classList.add('reveal-ready');
      if (el.matches('.research-card')) el.style.setProperty('--reveal-delay', `${Array.from(el.parentElement.children).indexOf(el) * 90}ms`);
      reveal.observe(el);
    });
    // Keyboard navigation must never land on visually hidden content.
    document.addEventListener('focusin', event => event.target.closest('.reveal-ready')?.classList.add('is-revealed'));
  }

  const resetPointer = el => {
    el.classList.remove('is-hovered');
    ['--tilt-x','--tilt-y','--portrait-x','--portrait-y','--magnet-x','--magnet-y'].forEach(key => el.style.removeProperty(key));
  };
  document.querySelectorAll('.research-card,.hero-visual,.hero-actions .button').forEach(el => {
    let frame = 0;
    el.addEventListener('pointermove', event => {
      if (!enabled || !finePointer.matches || event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      const { clientX, clientY } = event;
      frame = requestAnimationFrame(() => {
        if (!enabled) return;
        const rect = el.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width - .5;
        const y = (clientY - rect.top) / rect.height - .5;
        if (el.matches('.research-card')) {
          el.classList.add('is-hovered');
          el.style.setProperty('--pointer-x', `${(x + .5) * 100}%`);
          el.style.setProperty('--pointer-y', `${(y + .5) * 100}%`);
          el.style.setProperty('--tilt-x', `${-y * 5}deg`);
          el.style.setProperty('--tilt-y', `${x * 5}deg`);
        } else {
          const prefix = el.matches('.hero-visual') ? 'portrait' : 'magnet';
          const distance = prefix === 'portrait' ? 14 : 7;
          el.style.setProperty(`--${prefix}-x`, `${x * distance}px`);
          el.style.setProperty(`--${prefix}-y`, `${y * distance}px`);
        }
      });
    }, { passive: true });
    const reset = () => { cancelAnimationFrame(frame); resetPointer(el); };
    el.addEventListener('pointerleave', reset);
    el.addEventListener('pointercancel', reset);
  });

  const canvas = document.createElement('canvas');
  canvas.className = 'neural-field';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, particles = [], pulses = [], frame = 0, last = 0;
  let inView = true;
  const pointer = { x: -1000, y: -1000 };
  const draw = (advance = false, dt = 1) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      if (advance) {
        p.x = (p.x + p.vx * dt + width) % width;
        p.y = (p.y + p.vy * dt + height) % height;
      }
      const distance = Math.hypot(p.x - pointer.x, p.y - pointer.y);
      ctx.fillStyle = distance < 150 ? '#b7ff5abf' : '#95bbdf66';
      ctx.beginPath(); ctx.arc(p.x, p.y, distance < 150 ? 2 : 1.3, 0, Math.PI * 2); ctx.fill();
      if (distance < 150) {
        ctx.strokeStyle = `rgba(183,255,90,${(1 - distance / 150) * .3})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
      }
    }
    for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 135) {
        ctx.strokeStyle = `rgba(114,219,240,${(1 - distance / 135) * .16})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    pulses = pulses.filter(p => p.radius < 230);
    for (const p of pulses) {
      if (advance) p.radius += 5 * dt;
      ctx.strokeStyle = `rgba(183,255,90,${(1 - p.radius / 230) * .4})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.stroke();
    }
  };
  const tick = time => {
    frame = 0;
    if (!enabled || document.hidden || !inView) return;
    if (!last || time - last >= 32) {
      draw(true, last ? Math.min((time - last) / 33, 2) : 1);
      last = time;
    }
    frame = requestAnimationFrame(tick);
  };
  const syncLoop = () => {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    if (enabled && !document.hidden && inView && ctx) frame = requestAnimationFrame(tick);
    else draw();
  };
  const resizeCanvas = () => {
    width = hero.clientWidth; height = hero.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = width < 650 ? 24 : 58;
    particles = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .5 }));
    draw();
  };
  new ResizeObserver(resizeCanvas).observe(hero);
  hero.addEventListener('pointermove', event => {
    if (!enabled || !finePointer.matches) return;
    const rect = hero.getBoundingClientRect(); pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.x = pointer.y = -1000; });
  hero.addEventListener('pointerdown', event => {
    if (!enabled || event.target.closest('a,button')) return;
    const rect = hero.getBoundingClientRect();
    pulses.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, radius: 0 });
    pulses = pulses.slice(-4);
  }, { passive: true });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { inView = entries[0].isIntersecting; syncLoop(); }).observe(hero);
  document.addEventListener('visibilitychange', syncLoop);
  const applyMotion = () => {
    root.classList.toggle('motion-off', !enabled); labelToggle();
    if (!enabled) {
      document.querySelectorAll('.is-hovered,.hero-visual,.hero-actions .button').forEach(resetPointer);
      pointer.x = pointer.y = -1000; pulses = [];
    }
    syncLoop();
  };
  toggle.addEventListener('click', () => {
    enabled = !enabled && !reduced.matches;
    try { localStorage.setItem('yutong-motion', enabled ? 'on' : 'off'); } catch {}
    applyMotion();
  });
  reduced.addEventListener('change', () => {
    enabled = !reduced.matches;
    try { enabled = enabled && localStorage.getItem('yutong-motion') !== 'off'; } catch {}
    applyMotion();
  });
  resizeCanvas(); applyMotion();
})();
