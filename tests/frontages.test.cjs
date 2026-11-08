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


const g=scene.userData.groundDesign, parcels=scene.userData.urbanPaving;
const covered=(x,z)=>[...g.groundCells,...g.rampCells].some(r=>x>=r.x0-1e-6&&x<=r.x1+1e-6&&z>=r.z0-1e-6&&z<=r.z1+1e-6);
const checkParcel=(name)=>{
 const p=parcels.find(p=>p.name===name);assert.ok(p,name);
 for(let ix=0;ix<=20;ix++)for(let iz=0;iz<=20;iz++){
  const x=p.x-p.w/2+.01+(p.w-.02)*ix/20,z=p.z-p.d/2+.01+(p.d-.02)*iz/20;
  assert.ok(covered(x,z),name+' complete ground surface '+x+','+z);
 }
 return p;
};
const campus=checkParcel('campus-forecourt');assert.equal(campus.x,-11);
for(const v of scene.userData.clearanceVolumes.filter(v=>v.owner==='campus')){
 assert.ok(v.min[0]>=campus.x-campus.w/2&&v.max[0]<=campus.x+campus.w/2,'campus width covers '+v.name);
 assert.ok(v.min[2]>=campus.z-campus.d/2&&v.max[2]<=campus.z+campus.d/2,'campus depth covers '+v.name);
}
for(const z of [-38,-28,-16,-14,-12.3])for(let dx=0;dx<14.3;dx+=.2)assert.equal(covered(-11-dx,z),covered(-11+dx,z),'campus paving mirrors its building axis');
for(const name of ['gulou-court','jiming-court','hall-front-landing','wall-gate-landing','zifeng-court',...Array.from({length:10},(_,i)=>'housing-'+i+'-court'),...Array.from({length:5},(_,i)=>'urban-block-'+i)])checkParcel(name);
for(const e of scene.userData.walkNetwork.entrances){
 if(e.owner==='slab'||e.owner==='fuzimiao')continue; // Existing elevated platforms have their own surfaces.
 assert.ok(covered(...e.point),'entrance ground coverage '+e.name);
}
assert.equal(scene.userData.walkNetwork.entrances.length,31);
assert.equal(scene.userData.walkNetwork.segments.length,93);
console.log(JSON.stringify({status:'PASS',campusAxialCoverage:true,completeParcels:21,entrances:31}));
