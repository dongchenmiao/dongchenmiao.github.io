// Start the academic page together with the scene, while keeping one browser page.
(() => {
 const overlay=document.querySelector('#home-overlay'),frame=document.querySelector('#home-frame'),loader=document.querySelector('#lab-loading');
 const read=key=>{try{return localStorage.getItem(key)}catch{return null}};
 function openEarly(section){
  window.itongEarlyHome=true;frame.contentWindow?.postMessage({type:'itong:visibility',visible:true},'*');loader.classList.add('is-hidden');overlay.classList.add('is-open');overlay.setAttribute('aria-hidden','false');
  if(section){window.itongEarlySection=section;frame.contentWindow?.postMessage({type:'itong:navigate',section},'*')}
  document.querySelector('#language-toggle').hidden=true;document.querySelector('#lab-interface').hidden=true;document.querySelector('#lab-hotspots').hidden=true;
 }
 document.querySelector('#lab-loading-skip').addEventListener('click',event=>{event.preventDefault();if(window.itongSceneControls){window.dispatchEvent(new Event('itong:open-now'));return}history.pushState({itong:true},'','#home');openEarly(null)});
 function returnEarly(){
  if(window.itongSceneControls)return;
  window.itongEarlyHome=false;frame.contentWindow?.postMessage({type:'itong:visibility',visible:false},'*');overlay.classList.remove('is-open');overlay.setAttribute('aria-hidden','true');loader.classList.remove('is-hidden');history.pushState({itong:true},'','#lab');
 }
 document.querySelector('#home-back').addEventListener('click',returnEarly);
 window.addEventListener('message',event=>{
  if(event.source!==frame.contentWindow||!event.data)return;
  const data=event.data;
  if(data.type==='itong:content'){
   window.itongPreviewContent=data.content;window.dispatchEvent(new CustomEvent('itong:content',{detail:data.content}));
  }
  if(data.type==='itong:home-ready'){
   frame.dataset.ready='true';frame.contentWindow?.postMessage({type:'itong:visibility',visible:!!window.itongEarlyHome},'*');window.dispatchEvent(new Event('itong:home-ready'));
   if(window.itongEarlySection)frame.contentWindow?.postMessage({type:'itong:navigate',section:window.itongEarlySection},'*');
  }
  if(window.itongSceneControls)return;
  if(data.type==='itong:return')returnEarly();
  if(data.type==='itong:language'&&(data.language==='en'||data.language==='zh')){try{localStorage.setItem('yutong-homepage-language',data.language)}catch{}}
  if(data.type==='itong:motion'&&typeof data.enabled==='boolean'){try{localStorage.setItem('yutong-motion',data.enabled?'on':'off')}catch{}}
 });
 window.addEventListener('popstate',()=>{
  if(window.itongSceneControls)return;const route=location.hash.slice(1);
  if(/^(home|top|about|research|publications|penelope|contact)$/.test(route))openEarly(route==='home'?null:route);
  else{window.itongEarlyHome=false;frame.contentWindow?.postMessage({type:'itong:visibility',visible:false},'*');overlay.classList.remove('is-open');overlay.setAttribute('aria-hidden','true');loader.classList.remove('is-hidden')}
 });
 frame.addEventListener('load',()=>frame.contentWindow?.postMessage({type:'itong:request-content'},'*'));
 frame.contentWindow?.postMessage({type:'itong:request-content'},'*');
 const route=location.hash.slice(1);
 if(/^(home|top|about|research|publications|penelope|contact)$/.test(route))openEarly(route==='home'?null:route);
 else if(!route&&read('itong-visited')==='yes'&&read('itong-start-home')==='on'){history.replaceState({itong:true},'','#home');openEarly(null)}
})();
