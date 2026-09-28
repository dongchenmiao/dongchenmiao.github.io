// Small research windows stay inside the lab. Their copy comes from home.html.
(() => {
 'use strict';
 const dialog=document.createElement('dialog');dialog.id='scene-dialog';dialog.setAttribute('aria-labelledby','scene-dialog-title');
 dialog.innerHTML=`<div class="scene-panel-shell"><header class="scene-panel-header"><div><span class="scene-panel-kicker">iTong Slab / RESEARCH NOTES</span><h2 id="scene-dialog-title"></h2></div><div class="scene-panel-controls"><button class="panel-close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button></div></header><div class="scene-panel-body"></div></div>`;
 document.body.append(dialog);
 const body=dialog.querySelector('.scene-panel-body'),title=dialog.querySelector('h2'),closeButton=dialog.querySelector('.panel-close');
 const sharedLanguage=document.querySelector('#language-toggle'),languageHome=sharedLanguage.parentNode,languageNext=sharedLanguage.nextSibling;
 const sharedSound=document.querySelector('#lab-sound-toggle'),soundHome=sharedSound.parentNode,soundNext=sharedSound.nextSibling;
 const copy={en:{paper:'Latest work',research:'Research directions',close:'Close and return to the lab',open:'View in academic homepage',read:'Read on arXiv',latent:'LATENT RECURRENCE',compute:'LOCALIZED COMPUTE',paperLabel:'RESEARCH NOTE / 01',researchLabel:'RESEARCH NOTE / 02',related:'View related work',researchIntro:'Three questions guide my work, from reasoning inside models to intelligence in the physical world.'},zh:{paper:'最新研究',research:'研究方向',close:'关闭并返回实验室',open:'在学术主页中查看',read:'阅读 arXiv 论文',latent:'隐空间递归推理',compute:'局部递归计算',paperLabel:'研究笔记 / 01',researchLabel:'研究笔记 / 02',related:'查看关联成果',researchIntro:'从模型内部的推理过程，到物理世界中的智能，我主要关注以下三个方向。'}};
 let language=document.documentElement.lang.startsWith('zh')?'zh':'en',content=window.itongPreviewContent||null,active=null,opener=null,ownedHistory=false,pending=null,demo=null;
 const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11"/></svg>';
 const diagram=`<svg class="panel-recurrence" viewBox="0 0 360 260" role="img" aria-label="Input, latent recurrence, output"><defs><marker id="panel-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="m1 1 6 3-6 3" fill="none" stroke="#a8e6be" stroke-width="1.1"/></marker><radialGradient id="panel-halo"><stop stop-color="#76c9a5" stop-opacity=".24"/><stop offset="1" stop-color="#76c9a5" stop-opacity="0"/></radialGradient></defs><circle cx="180" cy="128" r="107" fill="url(#panel-halo)"/><circle cx="180" cy="128" r="76" stroke="#a8e6be" fill="none"/><circle cx="180" cy="128" r="59" stroke="#719f9f" stroke-dasharray="3 4" fill="none"/><circle cx="180" cy="128" r="43" stroke="#719f9f" stroke-dasharray="2 4" fill="none"/><rect x="17" y="106" width="42" height="44" rx="10" fill="#20394b" stroke="#709a9e"/><path d="M59 128h45m152 0h45" stroke="#a8e6be" fill="none" marker-end="url(#panel-arrow)"/><rect x="301" y="106" width="42" height="44" rx="10" fill="#233f3d" stroke="#91cdae"/><text x="38" y="136" text-anchor="middle" fill="#dcecec" font-family="Georgia,serif" font-size="27">x</text><text x="180" y="140" text-anchor="middle" fill="#b6efc9" font-family="Georgia,serif" font-size="46">h<tspan font-size="17" dy="9">t</tspan></text><text x="322" y="136" text-anchor="middle" fill="#b6efc9" font-family="Georgia,serif" font-size="27">ŷ</text><path d="M222 58a80 80 0 0 1 38 70" fill="none" stroke="#a8e6be" marker-end="url(#panel-arrow)"/></svg>`;
 function element(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!=null)el.textContent=text;return el}
 function homepageButton(section,topic){const button=element('button','panel-homepage',copy[language].open);button.type='button';button.insertAdjacentHTML('beforeend',arrow);button.addEventListener('click',()=>{close({historyUpdate:false});api.onEnter?.(section,topic)});return button}
 function render(){
  const c=copy[language];closeButton.setAttribute('aria-label',c.close);
  if(!active||!content)return;
  title.textContent=active==='penelope'?c.paper:c.research;
  dialog.querySelector('.scene-panel-kicker').textContent='iTong Slab / '+(active==='penelope'?c.paperLabel:c.researchLabel);
  demo?.dispose();demo=null;body.replaceChildren();
  if(active==='penelope'){
   const paper=content.penelope,layout=element('div','panel-paper-layout'),figure=element('div','panel-paper-figure');
   figure.append(element('span','panel-figure-kicker',c.compute));figure.insertAdjacentHTML('beforeend',diagram);figure.append(element('span','panel-figure-caption',c.latent));if(window.itongPenelopeDemo)demo=window.itongPenelopeDemo.mount(figure,{language,motionEnabled:()=>!document.documentElement.classList.contains('lab-motion-off')&&!matchMedia('(prefers-reduced-motion: reduce)').matches});
   const text=element('article','panel-paper-copy');text.append(element('span','panel-paper-status',paper.status),element('h3','',paper.title),element('p','panel-authors',paper.authors),element('p','panel-summary',paper.summary),element('p','panel-paper-date',paper.date));
   const actions=element('div','panel-actions');actions.append(homepageButton('penelope'));const read=element('a','panel-read',c.read);read.href=paper.url;read.target='_blank';read.rel='noopener noreferrer';read.insertAdjacentHTML('beforeend',arrow);actions.append(read);text.append(actions);layout.append(figure,text);body.append(layout);
  }else{
   body.append(element('p','panel-research-intro',c.researchIntro));const grid=element('div','panel-research-grid');
   content.research.forEach((item,index)=>{const card=element('article','panel-research-card');const top=element('div','panel-card-top');top.append(element('span','panel-card-number',String(index+1).padStart(2,'0')));const icon=element('span','panel-card-icon');icon.innerHTML=item.icon;top.append(icon);card.append(top,element('h3','',item.title),element('p','',item.summary));const tags=element('div','panel-card-tags');item.tags.forEach(tag=>tags.append(element('span','',tag)));card.append(tags);const related=homepageButton('publications',['latent','memory','physical'][index]);related.className='panel-related';related.firstChild.textContent=c.related;card.append(related);grid.append(card)});
   const actions=element('div','panel-actions');actions.append(homepageButton('research'));body.append(grid,actions);
  }
 }
 function open(section,{historyUpdate=true}={}){
  if(section!=='penelope'&&section!=='research')return;
  if(!content){pending={section,historyUpdate};return}
  const already=dialog.open;active=section;api.active=section;opener=already?opener:document.activeElement;if(opener?.closest('#lab-menu'))opener=document.querySelector('#lab-menu-toggle');render();
  if(historyUpdate){const route='#lab/'+section;if(already)history.replaceState({itongPanel:true},'',route);else{history.pushState({itongPanel:true},'',route);ownedHistory=true}}
  if(!already){dialog.append(sharedLanguage,sharedSound);document.documentElement.classList.add('scene-panel-open');dialog.showModal();api.onOpen?.()}
  document.querySelector('#scene').dataset.panel=section;body.scrollTop=0;closeButton.focus({preventScroll:true});
 }
 function close({historyUpdate=true}={}){
  pending=null;if(!dialog.open)return;
  demo?.dispose();demo=null;dialog.close();languageHome.insertBefore(sharedLanguage,languageNext?.parentNode===languageHome?languageNext:null);soundHome.insertBefore(sharedSound,soundNext?.parentNode===soundHome?soundNext:null);document.documentElement.classList.remove('scene-panel-open');active=null;api.active=null;document.querySelector('#scene').dataset.panel='closed';api.onClose?.();
  if(historyUpdate&&location.hash.startsWith('#lab/')){if(ownedHistory)history.back();else history.replaceState({itong:true},'','#lab')}
  ownedHistory=false;opener?.focus?.({preventScroll:true});
 }
 const api=window.itongPanels={open,close,active:null,setLanguage(value){language=value==='zh'?'zh':'en';render()}};
 closeButton.addEventListener('click',()=>close());dialog.addEventListener('cancel',event=>{event.preventDefault();close()});
 dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)close()}});
 window.addEventListener('itong:content',event=>{content=event.detail;language=content.language==='zh'?'zh':'en';render();if(pending){const next=pending;pending=null;open(next.section,{historyUpdate:next.historyUpdate})}});
 render();
})();
