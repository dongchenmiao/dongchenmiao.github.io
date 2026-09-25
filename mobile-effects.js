(() => {
  'use strict';

  const root = document.documentElement;
  const hero = document.querySelector('.hero-visual');
  const cards = [...document.querySelectorAll('.research-card')];
  const paperArt = [...document.querySelectorAll('.paper-art')];
  const mobile = matchMedia('(max-width: 900px) and (pointer: coarse)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canAnimate = () => mobile.matches && !reduced.matches && !root.classList.contains('motion-off');
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

  const control = document.createElement('div');
  control.className = 'mobile-motion-control';
  control.innerHTML = '<button class="tilt-button" type="button"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/><path d="M4 9a9 9 0 0 1 15-3M20 15a9 9 0 0 1-15 3M19 3v3h-3M5 21v-3h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="tilt-label"></span></button><span class="tilt-hint"></span>';
  hero.append(control);
  const button = control.querySelector('button');
  const label = control.querySelector('.tilt-label');
  const hint = control.querySelector('.tilt-hint');
  const copy = {
    en: {
      enable: 'Enable tilt', active: 'Tilt is on', waiting: 'Connecting sensor…',
      unavailable: 'Tilt unavailable', paused: 'Animations paused',
      touch: 'Touch the portrait or cards', activeHint: 'Move your phone · touch the cards',
      unavailableHint: 'Touch effects still work', pausedHint: 'Use the wave button to resume'
    },
    zh: {
      enable: '启用倾斜互动', active: '倾斜互动已开启', waiting: '正在连接传感器…',
      unavailable: '无法使用倾斜互动', paused: '动效已暂停',
      touch: '触摸头像或研究卡片', activeHint: '倾斜手机，也可触摸卡片',
      unavailableHint: '仍可使用触摸特效', pausedHint: '点击顶部波形按钮恢复'
    }
  };

  let listening = false;
  let active = false;
  let waiting = false;
  let unavailable = false;
  let firstReadingTimer = 0;
  let orientationFrame = 0;
  let touchFrame = 0;
  let touchInProgress = false;
  let baseline = null;
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };

  function updateControl() {
    const zh = root.lang.startsWith('zh');
    const strings = copy[zh ? 'zh' : 'en'];
    const supported = isSecureContext && typeof window.DeviceOrientationEvent === 'function';
    const paused = reduced.matches || root.classList.contains('motion-off');
    control.hidden = !mobile.matches;
    button.disabled = paused || !supported;
    button.setAttribute('aria-pressed', String(active));
    label.textContent = paused ? strings.paused : active ? strings.active : waiting ? strings.waiting : !supported || unavailable ? strings.unavailable : strings.enable;
    hint.textContent = paused ? strings.pausedHint : active ? strings.activeHint : !supported || unavailable ? strings.unavailableHint : strings.touch;
    button.setAttribute('aria-label', active ? (zh ? '关闭倾斜互动' : 'Turn off tilt interaction') : label.textContent);
  }

  function applyPortrait(x, y) {
    hero.style.setProperty('--portrait-x', `${(x * 9).toFixed(2)}px`);
    hero.style.setProperty('--portrait-y', `${(y * 7).toFixed(2)}px`);
    hero.style.setProperty('--portrait-light-x', `${(50 + x * 22).toFixed(1)}%`);
    hero.style.setProperty('--portrait-light-y', `${(44 + y * 18).toFixed(1)}%`);
    const movement = Math.hypot(x, y);
    hero.style.setProperty('--portrait-light-opacity', String(movement > .02 ? clamp(movement * .4 + .15, 0, .65) : 0));
  }

  function applyCards(x, y) {
    for (const card of cards) {
      card.style.setProperty('--tilt-x', `${(-y * 1.5).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(x * 1.5).toFixed(2)}deg`);
      card.style.setProperty('--pointer-x', `${(50 + x * 24).toFixed(1)}%`);
      card.style.setProperty('--pointer-y', `${(50 + y * 24).toFixed(1)}%`);
    }
  }

  function animateOrientation() {
    orientationFrame = 0;
    if (!canAnimate() || !active || document.hidden) return;
    current.x += (target.x - current.x) * .2;
    current.y += (target.y - current.y) * .2;
    if (!touchInProgress) applyPortrait(current.x, current.y);
    applyCards(current.x, current.y);
    if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > .015) {
      orientationFrame = requestAnimationFrame(animateOrientation);
    }
  }

  function onOrientation(event) {
    if (!canAnimate() || document.hidden || !Number.isFinite(event.gamma) || !Number.isFinite(event.beta)) return;
    const angle = screen.orientation?.angle ?? window.orientation ?? 0;
    let horizontal = event.gamma;
    let vertical = event.beta;
    if (angle === 90) [horizontal, vertical] = [event.beta, -event.gamma];
    else if (angle === 270 || angle === -90) [horizontal, vertical] = [-event.beta, event.gamma];
    else if (angle === 180) [horizontal, vertical] = [-event.gamma, -event.beta];
    if (!baseline) baseline = { horizontal, vertical };
    const angleDelta = (value, origin) => ((value - origin + 540) % 360) - 180;
    target.x = clamp(angleDelta(horizontal, baseline.horizontal) / 18, -1, 1);
    target.y = clamp(angleDelta(vertical, baseline.vertical) / 18, -1, 1);
    if (!active) {
      active = true;
      waiting = false;
      unavailable = false;
      clearTimeout(firstReadingTimer);
      hero.classList.add('sensor-on');
      cards.forEach(card => card.classList.add('mobile-tilt'));
      updateControl();
    }
    if (!orientationFrame) orientationFrame = requestAnimationFrame(animateOrientation);
  }

  function stopOrientation() {
    if (listening) removeEventListener('deviceorientation', onOrientation);
    listening = false;
    active = false;
    waiting = false;
    baseline = null;
    clearTimeout(firstReadingTimer);
    cancelAnimationFrame(orientationFrame);
    orientationFrame = 0;
    target.x = target.y = current.x = current.y = 0;
    hero.classList.remove('sensor-on');
    if (!touchInProgress) applyPortrait(0, 0);
    cards.forEach(card => {
      card.classList.remove('mobile-tilt');
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
      if (!card.classList.contains('is-hovered')) {
        card.style.removeProperty('--pointer-x');
        card.style.removeProperty('--pointer-y');
      }
    });
    updateControl();
  }

  button.addEventListener('click', async () => {
    if (!canAnimate()) return;
    if (active || waiting) {
      stopOrientation();
      return;
    }
    unavailable = false;
    waiting = true;
    updateControl();
    try {
      // Browsers that require permission need this call inside the click gesture.
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== 'granted') throw new Error('orientation permission denied');
      }
      if (!canAnimate() || !waiting) return;
      addEventListener('deviceorientation', onOrientation, { passive: true });
      listening = true;
      firstReadingTimer = setTimeout(() => {
        if (!active) {
          stopOrientation();
          unavailable = true;
          updateControl();
        }
      }, 3200);
    } catch {
      stopOrientation();
      unavailable = true;
      updateControl();
    }
  });

  function touchPortrait(event) {
    if (!canAnimate() || event.target.closest('button') || !event.touches.length) return;
    touchInProgress = true;
    const touch = event.touches[0];
    const bounds = hero.getBoundingClientRect();
    const x = clamp(((touch.clientX - bounds.left) / bounds.width - .5) * 2, -1, 1);
    const y = clamp(((touch.clientY - bounds.top) / bounds.height - .5) * 2, -1, 1);
    cancelAnimationFrame(touchFrame);
    touchFrame = requestAnimationFrame(() => applyPortrait(x, y));
  }
  hero.addEventListener('touchstart', touchPortrait, { passive: true });
  hero.addEventListener('touchmove', touchPortrait, { passive: true });
  const endTouch = () => {
    touchInProgress = false;
    cancelAnimationFrame(touchFrame);
    applyPortrait(canAnimate() && active ? current.x : 0, canAnimate() && active ? current.y : 0);
  };
  hero.addEventListener('touchend', endTouch, { passive: true });
  hero.addEventListener('touchcancel', endTouch, { passive: true });

  function ripple(element, clientX, clientY) {
    const rect = element.getBoundingClientRect();
    const ring = document.createElement('span');
    ring.className = 'touch-ripple';
    ring.style.left = `${clientX - rect.left}px`;
    ring.style.top = `${clientY - rect.top}px`;
    element.append(ring);
    ring.addEventListener('animationend', () => ring.remove(), { once: true });
    setTimeout(() => ring.remove(), 800);
  }
  for (const card of cards) {
    let clearTouch = 0;
    card.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'touch' || !canAnimate()) return;
      clearTimeout(clearTouch);
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width * 100).toFixed(1)}%`);
      card.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height * 100).toFixed(1)}%`);
      card.classList.add('is-hovered');
      ripple(card, event.clientX, event.clientY);
    });
    const release = () => {
      clearTouch = setTimeout(() => {
        card.classList.remove('is-hovered');
        if (!active) {
          card.style.removeProperty('--pointer-x');
          card.style.removeProperty('--pointer-y');
        }
      }, 500);
    };
    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', release);
  }
  for (const art of paperArt) {
    art.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'touch' || !canAnimate()) return;
      ripple(art, event.clientX, event.clientY);
      art.classList.add('is-touched');
      setTimeout(() => art.classList.remove('is-touched'), 850);
    });
  }

  const syncAvailability = () => {
    if (!canAnimate()) {
      stopOrientation();
      endTouch();
      cards.forEach(card => card.classList.remove('is-hovered'));
    }
    updateControl();
  };
  document.addEventListener('yutong:motionchange', syncAvailability);
  mobile.addEventListener('change', syncAvailability);
  reduced.addEventListener('change', syncAvailability);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && active && !orientationFrame) orientationFrame = requestAnimationFrame(animateOrientation);
  });
  screen.orientation?.addEventListener?.('change', () => { baseline = null; });
  new MutationObserver(updateControl).observe(root, { attributes: true, attributeFilter: ['lang'] });
  updateControl();
})();
