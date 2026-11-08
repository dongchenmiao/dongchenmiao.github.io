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


const g=scene.userData.groundDesign;
assert.equal(g.version,1);
assert.ok(g.stone.isMeshStandardMaterial&&g.asphalt.isMeshStandardMaterial);
assert.ok(g.asphalt.roughness>g.stone.roughness);
assert.equal(g.top,.26);
const overlaps=(a,b)=>Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0)>1e-6&&Math.min(a.z1,b.z1)-Math.max(a.z0,b.z0)>1e-6;
for(const [name,cells] of Object.entries({paving:g.groundCells,roads:g.roadCells,crossings:g.crossingCells,ramps:g.rampCells,bridge:g.bridgeCells})){
 for(let i=0;i<cells.length;i++)for(let j=0;j<i;j++)assert.ok(!overlaps(cells[i],cells[j]),name+' has no coplanar overlaps');
 for(const r of cells)assert.ok(r.x1>r.x0&&r.z1>r.z0);
}
for(const p of g.groundCells){
 for(const r of [...g.roadCells,...g.rampCells,...g.bridgeCells])assert.ok(!overlaps(p,r),'paving ends at road/ramp boundary');
}
assert.ok(g.curbRamps.length>0);
for(const r of g.curbRamps){assert.equal(r.low,.055);assert.equal(r.high,.26);}
// World-space joints survive joining rectangles and fade rather than alias at distance.
const shader={vertexShader:'#include <common>\n#include <begin_vertex>',fragmentShader:'#include <common>\n#include <color_fragment>'};
g.stone.onBeforeCompile(shader);assert.ok(shader.vertexShader.includes('modelMatrix'));assert.ok(shader.fragmentShader.includes('fwidth'));assert.ok(shader.fragmentShader.includes('fade'));
assert.ok(g.edgeSegments.length>0&&g.edgeSegments.length<2000,'coalesced exposed curb runs');
let meshes=0,vertices=0;scene.traverse(o=>{if(o.isMesh){meshes++;vertices+=o.geometry.attributes.position?.count||0;}});
console.log(JSON.stringify({status:'PASS',pavingCells:g.groundCells.length,roadCells:g.roadCells.length,curbRamps:g.curbRamps.length,curbRuns:g.edgeSegments.length,vertices,meshes}));
