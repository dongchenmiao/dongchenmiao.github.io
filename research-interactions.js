/* Local scholarly interactions. Citation fields come from the displayed records. */
(() => {
  'use strict';
  const root=document.documentElement;
  const lang=()=>root.lang.startsWith('zh')?'zh':'en';
  const motion=()=>!root.classList.contains('motion-off')&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  const labels={
    en:{related:'View related work',active:'Viewing related work',all:'Show all work',latent:'Related work: latent reasoning · Penelope',memory:'Earlier systems work: service computing. These papers provide background, rather than direct studies of foundation-model knowledge or memory.',physical:'Physical AI is an ongoing research direction. No publication in this direction is listed here yet.',copy:'Copy BibTeX',copied:'Copied',fallback:'Select and copy the citation below.',citation:'BibTeX citation',close:'Close',return:'Lulu is waiting in the lab',returnDetail:'Return to iTong Slab',source:'Metadata from the displayed publication record; unspecified fields are omitted.'},
    zh:{related:'查看相关论文',active:'正在查看相关论文',all:'显示全部论文',latent:'相关论文：隐空间推理 · Penelope',memory:'早期系统研究：服务计算。这些论文是研究背景，并非直接研究基础模型的知识或记忆机制。',physical:'物理智能是目前正在探索的方向，主页尚未列出该方向的论文。',copy:'复制 BibTeX',copied:'已复制',fallback:'请选择并复制下面的引用。',citation:'BibTeX 引用',close:'关闭',return:'噜噜在实验室等你',returnDetail:'回到 iTong Slab',source:'引用信息来自主页所列记录；未提供的字段已省略。'}
  };
  const topics=['latent','memory','physical'];
  const cards=[...document.querySelectorAll('.research-card')];
  const publications=document.querySelector('#publications');
  let activeTopic=null;
  const banner=document.createElement('div');banner.className='research-results';banner.hidden=true;
  const status=document.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const reset=document.createElement('button');reset.type='button';reset.className='research-reset';
  banner.append(status,reset);publications.querySelector('.section-heading').after(banner);
  cards.forEach((card,index)=>{
    card.dataset.researchTopic=topics[index];
    const button=document.createElement('button');button.type='button';button.className='research-related';button.setAttribute('aria-controls','publications');button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>selectTopic(topics[index],true));card.append(button);
  });
  function selectTopic(topic,scroll=false){
    activeTopic=topics.includes(topic)?topic:null;
    document.querySelectorAll('.paper,.earlier-item').forEach(paper=>{
      const match=activeTopic==='latent'?paper.id==='penelope':activeTopic==='memory'?paper.classList.contains('earlier-item'):false;
      paper.classList.toggle('research-match',!!activeTopic&&match);
      paper.classList.toggle('research-other',!!activeTopic&&!match);
    });
    cards.forEach(card=>{
      const selected=card.dataset.researchTopic===activeTopic;
      card.classList.toggle('research-selected',selected);
      card.querySelector('.research-related').setAttribute('aria-pressed',String(selected));
    });
    banner.hidden=!activeTopic;
    refreshLabels();
    if(scroll){publications.classList.add('is-revealed');publications.querySelectorAll('.reveal-ready').forEach(el=>el.classList.add('is-revealed'));const y=publications.getBoundingClientRect().top+scrollY-(document.querySelector('.topbar')?.offsetHeight||80)-24;window.scrollTo({top:Math.max(0,y),behavior:motion()?'smooth':'instant'});}
  }
  reset.addEventListener('click',()=>selectTopic(null));
  addEventListener('message',event=>{if(parent!==window&&event.source===parent&&event.data?.type==='itong:topic'&&topics.includes(event.data.topic))selectTopic(event.data.topic,false);});
  // Exact titles, author spellings, years and DOI/URLs already supplied on this page.
  function bibliography(record,index){
    const fields={title:record.title,author:record.authors.join(' and '),year:record.year};
    if(record.journal)fields.journal=record.journal;
    if(record.arxiv){fields.eprint=record.arxiv;fields.archivePrefix='arXiv';}
    if(record.url?.startsWith('https://doi.org/'))fields.doi=record.url.slice('https://doi.org/'.length);
    if(record.url)fields.url=record.url;
    const key=`Chen${record.year}${index+1}`;
    const escaped=value=>String(value).replace(/\\/g,'\\textbackslash{}').replace(/([%&#_])/g,'\\$1');
    return `@${record.arxiv?'misc':'article'}{${key},\n${Object.entries(fields).map(([key,value])=>`  ${key} = {${escaped(value)}}`).join(',\n')}\n}`;
  }
  const records=[...document.querySelectorAll('.paper')].map(paper=>({title:paper.querySelector('h3').textContent.trim(),authors:paper.querySelector('.paper-authors').textContent.split(',').map(a=>a.trim()),year:'2026',arxiv:paper.querySelector('.paper-id').textContent.replace('arXiv:','').trim(),url:paper.querySelector('.paper-link').href}));
  if(typeof earlierPapers!=='undefined')earlierPapers.forEach(p=>{const [journal,authorText]=p.meta.split(' · ');records.push({title:p.title,authors:authorText.split(',').map(a=>a.trim()),year:p.year,journal,url:p.url});});
  const citationDialog=document.createElement('dialog');citationDialog.className='citation-dialog';citationDialog.innerHTML='<div class="citation-dialog-heading"><h2></h2><button type="button"></button></div><p class="citation-instruction"></p><textarea readonly spellcheck="false" aria-label="BibTeX"></textarea><small></small>';
  document.body.append(citationDialog);
  const citationText=citationDialog.querySelector('textarea');
  const closeCitation=()=>citationDialog.close();
  citationDialog.querySelector('button').addEventListener('click',closeCitation);
  citationDialog.addEventListener('click',event=>{if(event.target===citationDialog){const r=citationDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeCitation();}});
  function showCitation(text){citationText.value=text;citationDialog.showModal();citationText.focus();citationText.select();}
  async function copyCitation(button,text){
    let copied=false;
    try{if(navigator.clipboard&&isSecureContext){await navigator.clipboard.writeText(text);copied=true;}}catch{}
    if(!copied){
      const textarea=document.createElement('textarea');textarea.value=text;textarea.className='citation-copy-helper';document.body.append(textarea);textarea.focus({preventScroll:true});textarea.select();
      try{copied=document.execCommand('copy');}catch{}textarea.remove();button.focus({preventScroll:true});
    }
    if(!copied){showCitation(text);return;}
    button.dataset.copied='true';button.textContent=labels[lang()].copied;
    setTimeout(()=>{if(!button.isConnected)return;delete button.dataset.copied;button.textContent=labels[lang()].copy;},1800);
  }
  function addCitationButtons(){
    const papers=[...document.querySelectorAll('.paper'),...document.querySelectorAll('.earlier-item')];
    papers.forEach((paper,index)=>{
      if(paper.querySelector('.copy-bibtex')||!records[index])return;
      const button=document.createElement('button');button.type='button';button.className='copy-bibtex';button.textContent=labels[lang()].copy;button.setAttribute('aria-label',`${labels[lang()].copy}: ${records[index].title}`);button.dataset.citationIndex=index;
      button.addEventListener('click',()=>copyCitation(button,bibliography(records[index],index)));
      if(paper.classList.contains('paper')){const actions=document.createElement('div');actions.className='paper-citation-actions';actions.append(button);paper.querySelector('.paper-content').append(actions);}else paper.querySelector('h4').parentElement.append(button);
    });
  }
  const luluLink=document.createElement('a');luluLink.href='./index.html#lab';luluLink.dataset.labReturn='';luluLink.className='footer-lulu';
  luluLink.innerHTML='<svg viewBox="0 0 68 56" fill="none" aria-hidden="true"><ellipse cx="33" cy="35" rx="24" ry="17" fill="#bc9670"/><path d="M15 39v9m36-9v9" stroke="#ac835d" stroke-width="9" stroke-linecap="round"/><ellipse cx="31" cy="22" rx="20" ry="15" fill="#cda87e"/><ellipse cx="14" cy="12" rx="5" ry="6" fill="#bc9670"/><ellipse cx="44" cy="12" rx="5" ry="6" fill="#bc9670"/><ellipse cx="31" cy="29" rx="12" ry="6" fill="#ac835d"/><circle cx="23" cy="22" r="2" fill="#242622"/><circle cx="39" cy="22" r="2" fill="#242622"/><path d="m29 30 2 1 2-1" stroke="#44372b" stroke-width="1.5" stroke-linecap="round"/><circle cx="31" cy="7" r="6" fill="#e9a54c"/><path d="M31 1c4-3 7-1 7-1-2 3-5 3-7 1Z" fill="#7ea675"/></svg><span><strong></strong><small></small></span>';
  document.querySelector('.footer').insertAdjacentElement('beforebegin',luluLink);
  const demo=window.itongPenelopeDemo?.mount(document.querySelector('.paper-art-penelope'),{language:lang(),motionEnabled:motion});
  function refreshLabels(){
    const w=labels[lang()];status.textContent=activeTopic?w[activeTopic]:'';reset.textContent=w.all;
    cards.forEach(card=>card.querySelector('.research-related').textContent=card.dataset.researchTopic===activeTopic?w.active:w.related);
    document.querySelectorAll('.copy-bibtex').forEach(button=>{button.textContent=button.dataset.copied?w.copied:w.copy;button.setAttribute('aria-label',`${w.copy}: ${records[Number(button.dataset.citationIndex)]?.title||''}`);});
    citationDialog.querySelector('h2').textContent=w.citation;citationDialog.querySelector('button').textContent=w.close;citationDialog.querySelector('p').textContent=w.fallback;citationDialog.querySelector('small').textContent=w.source;
    luluLink.querySelector('strong').textContent=w.return;luluLink.querySelector('small').textContent=w.returnDetail;
    demo?.setLanguage(lang());
  }
  new MutationObserver(()=>{addCitationButtons();selectTopic(activeTopic);}).observe(document.querySelector('#earlierList'),{childList:true});
  new MutationObserver(refreshLabels).observe(root,{attributes:true,attributeFilter:['lang']});
  addCitationButtons();refreshLabels();
  window.itongResearchInteractions={selectTopic,makeBibTeX:index=>records[index]?bibliography(records[index],index):null};
})();
