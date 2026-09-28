// Optional, locally synthesized rain: it starts only after an explicit user gesture.
(() => {
 'use strict';
 const toggle=document.querySelector('#lab-rain-sound'),status=document.querySelector('#lab-sound-status'),homeToggle=document.querySelector('#home-rain'),labToggle=document.querySelector('#lab-sound-toggle');
 const copy={en:{enable:'Enable rain ambience',mute:'Mute rain ambience',off:'Sound is off. Enable for soft rain; it fades indoors.',on:'Soft rain on · quieter in the homepage',error:'Audio unavailable in this browser.',hello:'Hi! Welcome to the lab.'},zh:{enable:'开启雨声',mute:'关闭雨声',off:'雨声默认关闭。开启后，进入主页时会减弱。',on:'轻雨声已开启 · 主页内音量降低',error:'当前浏览器无法播放雨声。',hello:'你好，欢迎来到实验室！'}};
 let language=document.documentElement.lang.startsWith('zh')?'zh':'en',context=null,gain=null,enabled=false,room='lab',suspendTimer=0,error=false,toastTimer=0,greeting=false,anchor=null;
 const toast=document.createElement('div');toast.className='lab-mascot-toast';toast.setAttribute('role','status');toast.hidden=true;document.querySelector('#lab-hotspots').append(toast);
 function positionBubble(){
  if(!anchor||!greeting||room!=='lab'||!anchor.visible){toast.hidden=true;return}
  toast.hidden=false;const half=toast.offsetWidth/2,x=Math.max(half+16,Math.min(innerWidth-half-16,anchor.x));
  toast.style.left=x+'px';toast.style.top=(anchor.y-29)+'px';toast.style.setProperty('--tail-left',(half+anchor.x-x)+'px');
 }
 function render(){
  status.textContent=copy[language][error?'error':enabled?'on':'off'];toggle.checked=enabled;homeToggle.hidden=false;
  for(const button of [homeToggle,labToggle]){button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',copy[language][enabled?'mute':'enable']);button.title=copy[language][enabled?'mute':'enable'];button.classList.toggle('sound-muted',!enabled)}
  if(greeting){toast.textContent=copy[language].hello;positionBubble()}
 }
 function build(){
  const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('Web Audio unavailable');context=new Audio();
  const seconds=8,buffer=context.createBuffer(2,context.sampleRate*seconds,context.sampleRate);
  for(let c=0;c<2;c++){const data=buffer.getChannelData(c);let last=0;for(let i=0;i<data.length;i++){last=(last+.035*(Math.random()*2-1))/1.035;data[i]=last*5.5}}
  const source=context.createBufferSource();source.buffer=buffer;source.loop=true;
  const high=context.createBiquadFilter();high.type='highpass';high.frequency.value=260;
  const low=context.createBiquadFilter();low.type='lowpass';low.frequency.value=5400;
  gain=context.createGain();gain.gain.value=0;source.connect(high);high.connect(low);low.connect(gain);gain.connect(context.destination);source.start();
 }
 function fade(){
  if(!context)return;clearTimeout(suspendTimer);const target=enabled&&!document.hidden?(room==='lab'?.045:.008):0;
  gain.gain.cancelScheduledValues(context.currentTime);gain.gain.setTargetAtTime(target,context.currentTime,.25);
  if(!target)suspendTimer=setTimeout(()=>{if(!enabled||document.hidden)context.suspend().catch(()=>{})},900);
 }
 async function setSound(value){
  enabled=value;error=false;
  try{if(enabled){if(!context)build();await context.resume()}fade()}catch{error=true;enabled=false}render();
 }
 toggle.addEventListener('change',()=>setSound(toggle.checked));homeToggle.addEventListener('click',()=>setSound(!enabled));labToggle.addEventListener('click',()=>setSound(!enabled));
 document.addEventListener('visibilitychange',()=>{if(context&&enabled&&!document.hidden)context.resume().then(fade).catch(()=>{});else fade()});
 window.itongLabPersonality={
  setLanguage(value){language=value==='zh'?'zh':'en';render()},
  setRoom(value){room=value;positionBubble();fade()},
  setMascotAnchor(value){anchor=value;positionBubble()},
  greet(){greeting=true;toast.textContent=copy[language].hello;positionBubble();clearTimeout(toastTimer);toastTimer=setTimeout(()=>{greeting=false;toast.hidden=true},2600)}
 };
 render();
})();
