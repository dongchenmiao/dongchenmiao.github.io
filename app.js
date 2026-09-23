const translations = {
  en: {
    navAbout: 'About', navResearch: 'Research', navPublications: 'Publications', navNews: 'News', navContact: 'Get in touch',
    heroEyebrow: 'PHD RESEARCHER · NANJING UNIVERSITY', heroGreeting: "Hello, I'm", heroIntro: 'I study how foundation models can think more deeply, remember more effectively, and compute more efficiently.', exploreWork: 'Explore my work', emailMe: 'Email me', portraitStatus: 'CURRENTLY EXPLORING', portraitFocus: 'Latent reasoning · Physical AI', portraitLocation: 'Nanjing University · Nanjing, China', scrollCue: 'SCROLL TO EXPLORE',
    sectionAboutLabel: 'ABOUT', aboutTitle: 'Curiosity meets computation<span class="accent-dot">.</span>', aboutLead: "I am a Ph.D. student at the Software Institute, Nanjing University, advised by Prof. Shouqian Shi and working with Prof. Sheng Zhong's research team.", aboutText: 'My research sits at the intersection of large language model reasoning and intelligent systems. I explore latent-space computation, recursive reasoning, and efficient architectures to improve how foundation models reason. I am also interested in knowledge organization, memory-augmented reasoning, long-context modeling, and adaptive computation. In parallel, I collaborate with Prof. Yunhuai Liu’s team at Peking University on Physical AI and embodied intelligence.', affiliationLabel: 'AFFILIATION', affiliationValue: 'Software Institute<br>Nanjing University', advisorLabel: 'ADVISOR', advisorValue: 'Prof. Shouqian Shi', labLabel: 'RESEARCH GROUP', citationLabel: 'GOOGLE SCHOLAR · SEP 2026', citationUnit: 'citations',
    sectionResearchLabel: 'RESEARCH', researchTitle: 'Questions worth exploring<span class="accent-dot">.</span>', researchSubtitle: 'Building more capable and efficient intelligence, from internal computation to embodied action.', researchOneTitle: 'Reasoning inside models', researchOneBody: 'Latent-space computation, recursive inference, and adaptive compute for stronger reasoning without unnecessary generation.', researchTwoTitle: 'Knowledge & memory', researchTwoBody: 'Organizing knowledge and building memory mechanisms that help foundation models handle long contexts and complex tasks.', researchThreeTitle: 'Physical AI', researchThreeBody: 'Exploring how intelligent systems can connect perception, reasoning, and action in the physical world.',
    sectionPublicationsLabel: 'PUBLICATIONS', publicationsTitle: 'Selected work<span class="accent-dot">.</span>', allPublications: 'All publications on Scholar', penelopeSummary: 'Penelope concentrates recurrent computation in a selected decoder interval, enabling efficient latent reasoning without repeatedly running the full model or generating a long visible chain of thought.', traceSummary: "A training-free approach that reveals local semantic evidence inside CLIP's global representation and uses it for dense vision-language understanding.", earlierTitle: 'Earlier work in service computing', earlierCaption: 'Selected journal papers · Full list on Google Scholar',
    sectionNewsLabel: 'NEWS', newsTitle: 'Latest updates<span class="accent-dot">.</span>', newsType: 'NEW PREPRINT', newsHeading: 'Penelope is now available on arXiv.', newsBody: 'Our work on localized latent recurrence for efficient structured reasoning has been submitted to AAAI 2027.',
    sectionContactLabel: 'CONTACT', contactTitle: "Let's think together<span class=\"accent-dot\">.</span>", contactText: "Interested in reasoning, intelligent systems, or a research collaboration? I'd be glad to hear from you.", footerLocation: 'Made in Nanjing · Thinking everywhere', backToTop: 'Back to top'
  },
  zh: {
    navAbout: '关于', navResearch: '研究', navPublications: '论文', navNews: '动态', navContact: '联系我',
    heroEyebrow: '南京大学 · 博士研究生', heroGreeting: '你好，我是', heroIntro: '我研究如何让基础模型推理得更深入、记忆得更有效，并以更少的计算完成复杂任务。', exploreWork: '了解我的研究', emailMe: '发送邮件', portraitStatus: '当前研究方向', portraitFocus: '隐空间推理 · 物理智能', portraitLocation: '南京大学 · 中国南京', scrollCue: '向下探索',
    sectionAboutLabel: '关于', aboutTitle: '以好奇心探索计算<span class="accent-dot">.</span>', aboutLead: '我是南京大学软件学院博士研究生，师从石守谦老师，在仲盛教授团队开展研究。', aboutText: '我的研究聚焦大模型推理与智能系统，探索隐空间计算、递归推理和高效架构设计，提升基础模型的推理能力。我也关注知识组织、记忆增强、超长上下文建模与推理过程中的动态计算优化。同时，我与北京大学刘云淮教授团队合作，研究 Physical AI 与具身智能。', affiliationLabel: '所在单位', affiliationValue: '南京大学<br>软件学院', advisorLabel: '导师', advisorValue: '石守谦教授', labLabel: '研究团队', citationLabel: 'GOOGLE SCHOLAR · 2026年9月', citationUnit: '次引用',
    sectionResearchLabel: '研究', researchTitle: '值得探索的问题<span class="accent-dot">.</span>', researchSubtitle: '从模型内部计算走向物理世界，研究更强、更高效的智能。', researchOneTitle: '模型内部推理', researchOneBody: '通过隐空间计算、递归推理和动态计算分配，让模型减少冗长输出并提升推理效率。', researchTwoTitle: '知识与记忆', researchTwoBody: '研究知识组织和记忆增强机制，帮助基础模型处理长上下文与复杂任务。', researchThreeTitle: '物理智能', researchThreeBody: '探索智能系统如何在物理世界中连接感知、推理与行动。',
    sectionPublicationsLabel: '论文', publicationsTitle: '代表性工作<span class="accent-dot">.</span>', allPublications: '在 Google Scholar 查看全部', penelopeSummary: 'Penelope 将循环计算集中在选定的解码器区间，在不反复运行整个模型、也不生成冗长显式思维链的条件下，实现高效隐空间推理。', traceSummary: '一种免训练方法，从 CLIP 全局表征的形成过程中恢复局部语义证据，服务于密集视觉语言理解。', earlierTitle: '早期服务计算研究', earlierCaption: '部分期刊论文 · 完整列表见 Google Scholar',
    sectionNewsLabel: '动态', newsTitle: '近期动态<span class="accent-dot">.</span>', newsType: '最新预印本', newsHeading: 'Penelope 已发布在 arXiv。', newsBody: '关于局部化隐空间递归与高效结构化推理的工作已投稿 AAAI 2027。',
    sectionContactLabel: '联系', contactTitle: '一起探索新问题<span class="accent-dot">.</span>', contactText: '如果你对模型推理、智能系统或科研合作感兴趣，欢迎联系我。', footerLocation: '在南京写作 · 向更远处思考', backToTop: '返回顶部'
  }
};

const earlierPapers = [
  {year:'2025',title:'An End-to-End Deep Learning QoS Prediction Model Based on Temporal Context and Feature Fusion',meta:'IEEE Transactions on Services Computing · P. Zhang, J. Fan, Y. Chen, W. Huang, H. Zhu, Q. Zhao',url:'https://doi.org/10.1109/TSC.2025.3562324',rank:'CCF A',rankUrl:'https://www.ccf.org.cn/Academic_Evaluation/TCSE_SS_PDL/zgjsjxhtjgjxskw/al/2023-03-09/787259.shtml',rank2:'JCR Q1',rank2Url:'https://topj.lib.whu.edu.cn/show.asp?cat=sci&id=4618',rank3:'CAS Software Eng. 1区',rank3Url:'https://topj.lib.whu.edu.cn/show.asp?cat=sci&id=4618'},
  {year:'2024',title:'A Deep-Learning Model for Service QoS Prediction Based on Feature Mapping and Inference',meta:'IEEE Transactions on Services Computing · P. Zhang, J. Ren, W. Huang, Y. Chen, Q. Zhao, H. Zhu',url:'https://doi.org/10.1109/TSC.2023.3326208',rank:'CCF A',rankUrl:'https://www.ccf.org.cn/Academic_Evaluation/TCSE_SS_PDL/zgjsjxhtjgjxskw/al/2023-03-09/787259.shtml',rank2:'JCR Q1',rank2Url:'https://topj.lib.whu.edu.cn/show.asp?cat=sci&id=4618',rank3:'CAS Software Eng. 1区',rank3Url:'https://topj.lib.whu.edu.cn/show.asp?cat=sci&id=4618'},
  {year:'2024',title:'A Novel Deep-Learning-Based QoS Prediction Model for Service Recommendation Utilizing Multi-Stage Multi-Scale Feature Fusion With Individual Evaluations',meta:'IEEE Transactions on Automation Science and Engineering · P. Zhang, W. Huang, Y. Chen, M. Zhou, Y. Al-Turki',url:'https://ieeexplore.ieee.org/document/10137554',rank:'CCF B',rankUrl:'https://www.ccf.org.cn/Academic_Evaluation/Cross_Compre_Emerging/',rank2:'JCR Q1',rank2Url:'https://topj.lib.whu.edu.cn/show.asp?cat=sci&id=1876'},
  {year:'2023',title:'Predicting Quality of Services Based on a Two-Stream Deep Learning Model With User and Service Graphs',meta:'IEEE Transactions on Services Computing · P. Zhang, W. Huang, Y. Chen, M. Zhou',url:'https://doi.org/10.1109/TSC.2023.3303191',rank:'CCF A',rankUrl:'https://www.ccf.org.cn/Academic_Evaluation/TCSE_SS_PDL/zgjsjxhtjgjxskw/al/2023-03-09/787259.shtml',rank2:'JCR Q1',rank2Url:'https://topj.lib.whu.edu.cn/show.asp?cat=sci&id=4618',rank3:'CAS Software Eng. 1区',rank3Url:'https://topj.lib.whu.edu.cn/show.asp?cat=sci&id=4618'},
  {year:'2023',title:'Generative-Adversarial-Based Feature Compensation to Predict Quality of Service',meta:'IEEE Transactions on Services Computing · P. Zhang, Y. Chen, W. Huang, H. Zhu, Q. Zhao',url:'https://doi.org/10.1109/TSC.2023.3335296',rank:'CCF A',rankUrl:'https://www.ccf.org.cn/Academic_Evaluation/TCSE_SS_PDL/zgjsjxhtjgjxskw/al/2023-03-09/787259.shtml',rank2:'JCR Q1',rank2Url:'https://topj.lib.whu.edu.cn/show.asp?cat=sci&id=4618',rank3:'CAS Software Eng. 1区',rank3Url:'https://topj.lib.whu.edu.cn/show.asp?cat=sci&id=4618'},
  {year:'2022',title:'QoS Prediction Model of Cloud Services Based on Deep Learning',meta:'IEEE/CAA Journal of Automatica Sinica · W. Huang, P. Zhang, Y. Chen, M. Zhou, Y. Al-Turki, A. Abusorrah',url:'https://doi.org/10.1109/JAS.2021.1004392',rank:'CAA A+',rankUrl:'https://www.caa.org.cn/Uploads/image/file/20250409/20250409163352_52457.pdf',rank2:'JCR Q1',rank2Url:'https://www.ieee-jas.com/',rank3:'CAS Major Zone 1 Top · 2025',rank3Url:'https://tsg.gxust.edu.cn/info/1018/3787.htm'},
  {year:'2021',title:'A Fault-Tolerant Model for Performance Optimization of a Fog Computing System',meta:'IEEE Internet of Things Journal · P. Zhang, Y. Chen, M. Zhou, G. Xu, W. Huang, Y. Al-Turki, A. Abusorrah',url:'https://doi.org/10.1109/JIOT.2021.3088417',rank:'CCF C',rankUrl:'https://www.ccf.org.cn/Academic_Evaluation/CN/zgjsjxhtjgjxskw/cl/2023-03-09/787253.shtml',rank2:'JCR Q1',rank2Url:'https://topj.lib.whu.edu.cn/show.asp?cat=zk&id=3250',rank3:'XinRui Major Zone 1 Top · 2026',rank3Url:'https://www.xr-scholar.com/Journals/j-543edrz2?culture=zh-CN'}
];

function safeText(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function renderEarlier(language){
  document.querySelector('#earlierList').innerHTML=earlierPapers.map(p=>{
    const href=p.url||`https://scholar.google.com/scholar?q=${encodeURIComponent(p.title)}`;
    const rankNames={
      'CCF A':{en:'CCF A',zh:'CCF A类'},
      'CCF B':{en:'CCF B',zh:'CCF B类'},
      'CCF C':{en:'CCF C',zh:'CCF C类'},
      'CAA A+':{en:'CAA A+',zh:'中国自动化学会 A+类'},
      'CAS Major Zone 1 Top · 2025':{en:'CAS Major Zone 1 · Top (2025)',zh:'2025 中科院大类1区 · Top'},
      'XinRui Major Zone 1 Top · 2026':{en:'XinRui Major Zone 1 · Top (2026)',zh:'2026 新锐大类1区 · Top'},
      'JCR Q1':{en:'JCR Q1',zh:'JCR 1区'},
      'CAS Software Eng. 1区':{en:'CAS Software Eng. Zone 1',zh:'中科院软件工程小类1区'}
    };
    const badge=(value,url)=>value?`<a class="rank-badge" href="${url}" target="_blank" rel="noopener noreferrer" title="${language==='zh'?'查看期刊分级来源':'View journal ranking source'}">${safeText(rankNames[value]?.[language]||value)}</a>`:'';
    return `<article class="earlier-item"><span class="earlier-year">${p.year}</span><div><h4>${safeText(p.title)}</h4><p>${safeText(p.meta)}</p>${badge(p.rank,p.rankUrl)} ${badge(p.rank2,p.rank2Url)} ${badge(p.rank3,p.rank3Url)}</div><a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="Open ${safeText(p.title)}">↗</a></article>`;
  }).join('');
}

function applyLanguage(language){
  const copy=translations[language];
  document.documentElement.lang=language==='zh'?'zh-CN':'en';
  document.title=language==='zh'?'陈禹同 · 学术主页':'Yutong Chen · Researcher';
  document.querySelector('meta[name="description"]').content=language==='zh'?'陈禹同，南京大学软件学院博士研究生，研究基础模型推理与智能系统。':'Yutong Chen is a Ph.D. student at the Software Institute, Nanjing University, researching reasoning in foundation models and intelligent systems.';
  document.querySelectorAll('[data-i18n]').forEach(el=>{const value=copy[el.dataset.i18n];if(value!==undefined)el.innerHTML=value;});
  renderEarlier(language);
  const switcher=document.querySelector('#languageSwitch');
  switcher.querySelector('.language-current').textContent=language==='zh'?'中文':'EN';
  switcher.querySelector('.language-next').textContent=language==='zh'?'EN':'中文';
  switcher.setAttribute('aria-label',language==='zh'?'切换到英文版':'Switch to Chinese');
  try{localStorage.setItem('yutong-homepage-language',language);}catch{}
}

let language='en';
try{language=localStorage.getItem('yutong-homepage-language')==='zh'?'zh':'en';}catch{}
applyLanguage(language);
document.querySelector('#languageSwitch').addEventListener('click',()=>{language=language==='en'?'zh':'en';applyLanguage(language);});
document.querySelector('#year').textContent=new Date().getFullYear();
