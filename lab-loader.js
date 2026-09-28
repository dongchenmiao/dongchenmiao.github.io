(() => {
  'use strict';

  const sceneUrl = './lab-scene.js?v=6885f915';
  const overlay = document.querySelector('#lab-loading');
  const title = document.querySelector('#lab-loading-title');
  const stage = document.querySelector('#lab-loading-stage');
  const percent = document.querySelector('#lab-loading-percent');
  const progressbar = document.querySelector('#lab-loading-progress');
  const fill = document.querySelector('#lab-loading-fill');
  const skip = document.querySelector('#lab-loading-skip');
  const retry = document.querySelector('#lab-loading-retry');
  const strings = {
    en: {
      title: 'Welcome to iTong Slab',
      download: 'Loading the scene…',
      build: 'Preparing the lab…',
      render: 'Almost ready…',
      ready: 'Ready to explore',
      error: 'The 3D scene could not load.',
      skip: 'Open homepage',
      retry: 'Retry',
      label: '3D scene loading progress'
    },
    zh: {
      title: '欢迎来到 iTong Slab',
      download: '正在加载场景…',
      build: '正在布置实验室…',
      render: '即将就绪…',
      ready: '欢迎探索',
      error: '3D 场景加载失败。',
      skip: '直接进入个人主页',
      retry: '重试',
      label: '3D 场景加载进度'
    }
  };

  let language = 'en';
  try { language = localStorage.getItem('yutong-homepage-language') === 'zh' ? 'zh' : 'en'; } catch {}
  const copy = strings[language];
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  title.textContent = copy.title;
  stage.textContent = copy.download;
  skip.textContent = copy.skip;
  retry.textContent = copy.retry;
  progressbar.setAttribute('aria-label', copy.label);

  let ready = false;
  let failed = false;
  let progress = 0;
  let watchdog = 0;

  function setProgress(value, message) {
    if (ready || failed) return;
    progress = Math.max(progress, Math.min(100, Math.round(value)));
    overlay.classList.remove('is-indeterminate');
    fill.style.width = `${progress}%`;
    percent.textContent = `${progress}%`;
    progressbar.setAttribute('aria-valuenow', String(progress));
    progressbar.removeAttribute('aria-valuetext');
    if (message) stage.textContent = message;
  }

  function setUnknownProgress() {
    if (ready || failed) return;
    overlay.classList.add('is-indeterminate');
    percent.textContent = '…';
    progressbar.removeAttribute('aria-valuenow');
    progressbar.setAttribute('aria-valuetext', copy.download);
  }

  function fail() {
    if (ready || failed) return;
    failed = true;
    clearTimeout(watchdog);
    overlay.classList.remove('is-indeterminate');
    stage.textContent = copy.error;
    percent.textContent = '—';
    progressbar.removeAttribute('aria-valuenow');
    progressbar.setAttribute('aria-valuetext', copy.error);
    retry.hidden = false;
  }

  function finish() {
    if (ready || failed) return;
    setProgress(100, copy.ready);
    ready = true;
    clearTimeout(watchdog);
    setTimeout(() => {
      overlay.classList.add('is-hidden');
      setTimeout(() => overlay.remove(), 500);
    }, 120);
  }

  window.addEventListener('lab:ready', finish, { once: true });
  window.addEventListener('error', () => { if (!ready) fail(); });
  retry.addEventListener('click', () => location.reload());

  function executeScene(source) {
    if (failed) return;
    if (source !== null) setProgress(84, copy.build);
    watchdog = setTimeout(fail, 45000);
    requestAnimationFrame(() => {
      if (failed) return;
      const script = document.createElement('script');
      let blobUrl;
      if (source !== null) {
        blobUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
        script.src = blobUrl;
      } else {
        script.src = sceneUrl;
      }
      script.onload = () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        if (!ready) setProgress(94, copy.render);
      };
      script.onerror = () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        fail();
      };
      document.body.append(script);
    });
  }

  // Local file previews can load a script tag, while XHR may be blocked for file URLs.
  if (location.protocol === 'file:') {
    setUnknownProgress();
    executeScene(null);
    return;
  }

  setProgress(1, copy.download);
  const request = new XMLHttpRequest();
  request.open('GET', sceneUrl, true);
  request.timeout = 60000;
  request.onprogress = event => {
    if (event.lengthComputable && event.total > 0) {
      setProgress(Math.min(82, event.loaded / event.total * 82));
    } else {
      setUnknownProgress();
    }
  };
  request.onload = () => {
    if (request.status < 200 || request.status >= 300) return fail();
    executeScene(request.responseText);
  };
  request.onerror = fail;
  request.ontimeout = fail;
  request.send();
})();
