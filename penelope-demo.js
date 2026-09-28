/* A schematic of localized recurrence, not a running model or a benchmark. */
(() => {
  'use strict';
  let nextId = 0;
  const words = {
    en:{run:'Explore the computation',again:'Replay the schematic',note:'Illustrative schematic · no model inference',input:'Input',interval:'Selected decoder interval',output:'Output',idle:'Follow one input through localized recurrence.',start:'1 / Encode the input once',loop:'2 / Revisit the selected interval',done:'3 / Decode the output',turn:'Illustrative pass'},
    zh:{run:'看看计算过程',again:'重新播放示意',note:'原理示意 · 非模型推理',input:'输入',interval:'选定的解码器区间',output:'输出',idle:'跟随一次输入，观察局部递归计算。',start:'1 / 一次输入编码',loop:'2 / 在选定区间内递归',done:'3 / 解码输出',turn:'示意轮次'}
  };
  function mount(container, options={}) {
    if (!container) return null;
    let language=options.language==='zh'?'zh':'en',stage='idle',turn=0,timer=0,disposed=false;
    const id=`penelope-schematic-${++nextId}`;
    container.removeAttribute('aria-hidden');
    container.classList.add('penelope-demo-host');
    const root=document.createElement('div');root.className='penelope-demo';root.dataset.stage=stage;
    root.innerHTML=`<svg class="penelope-demo-svg" viewBox="0 0 420 210" role="img" aria-labelledby="${id}-title"><title id="${id}-title"></title><defs><linearGradient id="${id}-glow"><stop stop-color="#78c9d3"/><stop offset="1" stop-color="#9ee8c6"/></linearGradient></defs><path class="demo-flow-line" d="M82 106H154M266 106H338" stroke="url(#${id}-glow)"/><path class="demo-flow-line" d="m144 100 10 6-10 6m184-12 10 6-10 6"/><g class="demo-input"><rect x="34" y="82" width="48" height="48" rx="12"/><text x="58" y="112" class="demo-symbol">x</text><text x="58" y="159" data-demo="input"/></g><g class="demo-interval"><rect class="demo-boundary" x="154" y="63" width="112" height="86" rx="17"/><rect class="demo-layer" x="175" y="81" width="70" height="8" rx="3"/><rect class="demo-layer" x="175" y="102" width="70" height="8" rx="3"/><rect class="demo-layer" x="175" y="123" width="70" height="8" rx="3"/><path class="demo-recurrence" d="M263 92C298 91 298 30 213 30C129 30 129 70 153 75"/><path class="demo-recurrence" d="m147 66 6 9-10 2"/><circle class="demo-pulse" cx="210" cy="30" r="6"/><text x="210" y="181" data-demo="interval"/><text class="demo-pass" x="210" y="53"></text></g><g class="demo-output"><rect x="338" y="82" width="48" height="48" rx="12"/><text x="362" y="112" class="demo-symbol">ŷ</text><text x="362" y="159" data-demo="output"/></g></svg><div class="penelope-demo-status" role="status" aria-live="polite"></div><button class="penelope-demo-run" type="button"></button><small class="penelope-demo-note"></small>`;
    container.replaceChildren(root);
    const button=root.querySelector('button'),status=root.querySelector('[role="status"]');
    const motion=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.documentElement.classList.contains('motion-off')&&!document.documentElement.classList.contains('lab-motion-off')&&(typeof options.motionEnabled==='function'?options.motionEnabled():options.motionEnabled!==false);
    function render(){
      const w=words[language];
      root.querySelector('title').textContent=language==='zh'?'局部隐空间递归的原理示意':'Schematic of localized latent recurrence';
      root.querySelectorAll('[data-demo]').forEach(el=>el.textContent=w[el.dataset.demo]);
      root.querySelector('.demo-pass').textContent=turn?`${w.turn} ${turn} / 3`:'';
      status.textContent=w[stage==='idle'?'idle':stage==='input'?'start':stage==='recurrence'?'loop':'done'];
      button.textContent=w[stage==='done'?'again':'run'];
      root.querySelector('small').textContent=w.note;
      root.dataset.stage=stage;
      root.classList.toggle('demo-animate',motion());
    }
    function stop(){clearTimeout(timer);timer=0;if(stage!=='idle'&&stage!=='done'){stage='idle';turn=0;}button.disabled=false;render();}
    function finish(){stage='done';turn=3;button.disabled=false;render();}
    function advance(){
      if(disposed)return;
      if(stage==='input'){stage='recurrence';turn=1;}
      else if(turn<3){turn++;}
      else{finish();return;}
      render();timer=setTimeout(advance,650);
    }
    function run(){
      if(disposed||button.disabled)return;
      if(!motion()){finish();return;}
      stage='input';turn=0;button.disabled=true;render();timer=setTimeout(advance,550);
    }
    function visibility(event){if(event.detail?.visible===false||document.hidden)stop();}
    function onMotion(){if(!motion()&&button.disabled)finish();else render();}
    function hidden(){if(document.hidden)stop();}
    button.addEventListener('click',run);
    document.addEventListener('yutong:visibility',visibility);
    document.addEventListener('visibilitychange',hidden);
    document.addEventListener('yutong:motionchange',onMotion);
    const observer=new MutationObserver(()=>{if(!motion()&&button.disabled)finish();else render();});
    observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
    render();
    return {setLanguage(value){language=value==='zh'?'zh':'en';render();},dispose(){disposed=true;clearTimeout(timer);observer.disconnect();button.removeEventListener('click',run);document.removeEventListener('yutong:visibility',visibility);document.removeEventListener('visibilitychange',hidden);document.removeEventListener('yutong:motionchange',onMotion);}};
  }
  window.itongPenelopeDemo={mount};
})();
