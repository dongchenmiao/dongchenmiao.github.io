const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/../lab-scene.js','utf8');const handlers={};
const node={hidden:true,classList:{contains:()=>false},dataset:{},querySelectorAll:()=>[],setAttribute(){}};
const canvas={width:0,height:0,getContext:()=>({fillRect(){},fillText(){},strokeRect(){}})};
const storage=new Map([["itong-season","spring"]]);
const c={console,window:{addEventListener:(name,fn)=>handlers[name]=fn,dispatchEvent(){}},document:{createElement:()=>canvas,querySelector:()=>node,documentElement:{dataset:{}}},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},MutationObserver:class{observe(){}},CustomEvent:class{constructor(type,p){this.type=type;this.detail=p.detail;}}};vm.createContext(c);
vm.runInContext(source.slice(0,source.indexOf('function Am()'))+source.slice(source.indexOf('function Im('),source.indexOf('var xr=class'))+source.slice(source.indexOf('function Lm('),source.indexOf('var yn=document'))+';this.EXPORT={T:gr,builder:Nc,merge:xd,buildStreet:Im,buildRain:Lm};})();',c);
const worldSource=fs.readFileSync(process.env.BASELINE||__dirname+'/../lab-world.js','utf8');assert.ok(!worldSource.includes('rotationY:.31'));assert.ok(!worldSource.includes('北大楼 · NORTH BUILDING'));assert.ok(worldSource.includes("n.label('北大楼'"));vm.runInContext(worldSource,c);
const {T,builder,merge}=c.EXPORT,scene=new T.Scene(),interiorGroup=new T.Group(),roof=new T.Group();scene.background=new T.Color('#131f30');scene.add(interiorGroup,roof);
const street=new T.Group();scene.add(street);c.EXPORT.buildStreet(builder(street));const wetMarks=street.getObjectByName("seasonal-wet-marks");assert.ok(wetMarks);const wetCount=wetMarks.children.length;assert.ok(wetCount>10);merge(street);assert.equal(wetMarks.children.length,wetCount);
const labelCalls=[];const trackedBuilder=group=>{const b=builder(group),label=b.label;b.label=(...a)=>{if(a[0]==='南京大学'||[...'严肃活泼团结紧张'].includes(a[0]))labelCalls.push(a);return label(...a);};return b;};
const api=c.window.buildSeasonalWorld({THREE:T,scene,interior:builder(interiorGroup),roof,builder:trackedBuilder,merge});

const finishes=scene.userData.surfaceFinishes;
assert.ok(finishes.counts.tile>5&&finishes.counts.glazing>5&&finishes.counts.metal>0);
assert.equal(finishes.extraRenderPasses,0);assert.equal(finishes.extraLights,0);
for(const m of finishes.materials){
 const kind=m.userData.surfaceKind;
 if(kind==='metal'){assert.equal(m.metalness,.35);continue;}
 const shader={vertexShader:'#include <begin_vertex>',fragmentShader:'#include <color_fragment>\n#include <opaque_fragment>'};
 m.onBeforeCompile(shader);assert.ok(shader.vertexShader.includes('vFinishWorld'));
 assert.ok(shader.fragmentShader.includes(kind==='tile'?'fwidth(course)':'skySheen'));
 assert.equal(m.customProgramCacheKey(),'itong-finish-v1-'+kind);
 if(kind==='glazing')assert.equal(m.roughness,.28);
}
let vertices=0,meshes=0;scene.traverse(o=>{if(o.isMesh){vertices+=o.geometry.attributes.position.count;meshes++;}});
assert.ok(vertices<460000,'surface refinement stays within a three-percent geometry budget');
console.log(JSON.stringify({status:'PASS',finishes:finishes.counts,vertices,meshes,extraLights:0,extraRenderPasses:0}));
