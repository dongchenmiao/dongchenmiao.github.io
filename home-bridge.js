/* Navigation and preferences are shared with the parent lab shell. */
(() => {
  'use strict';
  const framed = window.parent !== window;
  let applyingPreferences = false;
  let highlightTimer = 0;
  const send = payload => { if (framed) parent.postMessage(payload, '*'); };
  const motionEnabled = () => !document.documentElement.classList.contains('motion-off');
  function sharePreviewContent(){
    const paper=document.querySelector('#penelope');
    const content={language:document.documentElement.lang.startsWith('zh')?'zh':'en',penelope:{title:paper.querySelector('h3').textContent,authors:paper.querySelector('.paper-authors').textContent,summary:paper.querySelector('.paper-summary').textContent,date:[...paper.querySelectorAll('.paper-update span')].map(el=>el.textContent.trim()).join(' '),status:paper.querySelector('.paper-status').textContent,url:paper.querySelector('.paper-link').href},research:[...document.querySelectorAll('.research-card')].map(card=>({title:card.querySelector('h3').textContent,summary:card.querySelector('p').textContent,icon:card.querySelector('.research-icon').innerHTML,tags:[...card.querySelectorAll('.card-tags span')].map(tag=>tag.textContent)}))};
    send({type:'itong:content',content});
  }
  const ready = () => send({type:'itong:home-ready', language:document.documentElement.lang.startsWith('zh') ? 'zh' : 'en', motion:motionEnabled()});
  function navigate(section) {
    if (typeof section !== 'string' || !section || !/^[a-z][a-z0-9-]*$/i.test(section)) return;
    const target = document.getElementById(section);
    if (!target) return;
    const offset = section === 'top' ? 0 : Math.max(0, target.getBoundingClientRect().top + scrollY - (document.querySelector('.topbar')?.offsetHeight || 80) - 24);
    target.classList.add('is-revealed');
    target.querySelectorAll('.reveal-ready').forEach(el => el.classList.add('is-revealed'));
    window.scrollTo({top:offset, behavior:motionEnabled() ? 'smooth' : 'instant'});
    document.querySelectorAll('.bridge-target').forEach(el => el.classList.remove('bridge-target'));
    void target.offsetWidth;
    target.classList.add('bridge-target');
    clearTimeout(highlightTimer);
    highlightTimer = setTimeout(() => target.classList.remove('bridge-target'), 1700);
  }
  addEventListener('message', event => {
    if (!framed || event.source !== parent || !event.data || typeof event.data !== 'object') return;
    const message = event.data;
    if (message.type === 'itong:preferences') {
      applyingPreferences = true;
      try {
        if (message.language === 'zh' || message.language === 'en') {
          language = message.language;
          const current = document.documentElement.lang.startsWith("zh") ? "zh" : "en";
          if (current !== language){applyLanguage(language);sharePreviewContent();}
        }
        if (typeof message.motion === 'boolean') document.dispatchEvent(new CustomEvent('yutong:setmotion',{detail:{enabled:message.motion}}));
      } finally { applyingPreferences = false; }
    } else if(message.type==='itong:request-content'){sharePreviewContent();ready();}
    else if (message.type === 'itong:navigate') navigate(message.section);
    else if(message.type==='itong:visibility'){document.documentElement.classList.toggle('lab-page-paused',!message.visible);document.dispatchEvent(new CustomEvent('yutong:visibility',{detail:{visible:!!message.visible}}))}
  });
  document.addEventListener('itong:languagechange', event => {
    if (!applyingPreferences) send({type:'itong:language',language:event.detail.language});
    sharePreviewContent();
  });
  document.addEventListener('yutong:motionchange', event => {
    if (!applyingPreferences) send({type:'itong:motion',enabled:event.detail.enabled});
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    if (link.matches('[data-lab-return]')) {
      if (framed && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
        event.preventDefault();
        send({type:'itong:return'});
      }
      return;
    }
    const href = link.getAttribute('href');
    if (!href?.startsWith('#') || !framed || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    const section = href.slice(1);
    if (!document.getElementById(section)) return;
    event.preventDefault();
    send({type:'itong:route',section});
    navigate(section);
  });
  // Read-position state remains in the iframe while the visitor walks around the lab.
  if(framed){document.documentElement.classList.add('lab-page-paused');document.dispatchEvent(new CustomEvent('yutong:visibility',{detail:{visible:false}}))}
  sharePreviewContent();
  ready();
})();
