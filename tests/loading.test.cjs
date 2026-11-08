const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/../lab-loader.js','utf8');
function setup(blockStorage=false){
 const nodes={},events={},timers=[],messages=[],saved=new Map();let request,script;
 const node=id=>nodes[id]||= {hidden:id.includes('skip')||id.includes('retry'),dataset:{},attrs:{},style:{},listeners:{},textContent:'',inert:false,classList:{add(){},remove(){}},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},hasAttribute(k){return k in this.attrs},addEventListener(k,fn){this.listeners[k]=fn},contains(){return false},remove(){this.removed=true},focus(){}};
 node('#home-frame').contentWindow={postMessage:m=>messages.push(m)};
 const context={window:{addEventListener:(k,f)=>(events[k]||=[]).push(f),dispatchEvent:e=>(events[e.type]||[]).forEach(f=>f(e))},document:{querySelector:node,documentElement:{},createElement:()=>script={},body:{append(){}},activeElement:null},localStorage:{getItem:k=>{if(blockStorage)throw Error();return saved.get(k)},setItem:(k,v)=>{if(blockStorage)throw Error();saved.set(k,v)}},CustomEvent:class{constructor(type,opts){this.type=type;this.detail=opts?.detail}},location:{protocol:'http:',reload(){}},XMLHttpRequest:class{constructor(){request=this}open(){}send(){}},setTimeout:f=>(timers.push(f),timers.length),clearTimeout(){},requestAnimationFrame:f=>f(),Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL(){}}};
 vm.runInNewContext(source,context);return {nodes,node,context,events,timers,messages,saved,get request(){return request},get script(){return script},click:()=>node('#lab-loading-language').listeners.click(),emit:k=>context.window.dispatchEvent({type:k})};
}
for(const blocked of [false,true]){
 const t=setup(blocked);assert.equal(t.node('#lab-loading-skip').hidden,true);assert.equal(t.node('#scene').inert,true);
 t.click();assert.equal(t.node('#lab-loading-title').textContent,'欢迎来到 iTong Slab');assert.equal(t.context.window.itongLoadingLanguage,'zh');assert.equal(t.messages.at(-1).language,'zh');
 t.request.onprogress({lengthComputable:false});assert.equal(t.node('#lab-loading-progress').attrs['aria-valuetext'],'正在加载场景…');t.click();assert.equal(t.node('#lab-loading-progress').attrs['aria-valuetext'],'Loading the scene…');
 t.request.status=200;t.request.responseText='';t.request.onload();assert.equal(t.node('#lab-loading-stage').textContent,'Preparing the lab…');t.click();assert.equal(t.node('#lab-loading-stage').textContent,'正在布置实验室…');
 t.script.onload();assert.equal(t.node('#lab-loading-stage').textContent,'即将就绪…');t.emit('lab:ready');assert.equal(t.node('#lab-loading-stage').textContent,'正在准备网页内容…');t.node('#home-frame').dataset.ready='true';t.emit('itong:home-ready');assert.equal(t.node('#lab-loading-stage').textContent,'欢迎探索');t.timers[1]();assert.equal(t.node('#scene').inert,false);
 const f=setup(blocked);f.request.onerror();assert.equal(f.node('#lab-loading-skip').hidden,false);assert.equal(f.node('#lab-loading-retry').hidden,false);f.click();assert.equal(f.node('#lab-loading-stage').textContent,'3D 场景加载失败。');assert.equal(f.node('#lab-loading-progress').attrs['aria-valuetext'],'3D 场景加载失败。');
}
console.log('PASS: loading language, every stage, persistence + blocked storage, progress ARIA, ready handoff, failure fallback');
