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


const r=scene.userData.roadsideDesign,g=scene.userData.groundDesign,net=scene.userData.walkNetwork;
const overlap=(a,b,pad=0)=>Math.abs(a.x-b.x)<(a.w+b.w)/2+pad-1e-7&&Math.abs(a.z-b.z)<(a.d+b.d)/2+pad-1e-7;
const routeRect=s=>({x:(s.a[0]+s.b[0])/2,z:(s.a[1]+s.b[1])/2,w:Math.abs(s.a[0]-s.b[0])+s.width,d:Math.abs(s.a[1]-s.b[1])+s.width});
assert.ok(r.retiredRoadsideStrips.length>600);
assert.equal(scene.userData.masterplan.pavementStrips.length,0,'no automatic duplicate paving ribbons');
assert.ok(r.roadEdgeLines.length>20);assert.ok(r.vergePlanters.length>10);
assert.equal(net.entrances.length,31);assert.equal(net.segments.length,93);
for(const p of r.vergePlanters){
 for(const road of scene.userData.roadNetwork)assert.ok(!overlap(p,road,.15),'planter clears asphalt');
 for(const s of net.segments)assert.ok(!overlap(p,routeRect(s),.1),'planter clears complete route '+s.name);
 for(const surface of g.pedestrianSurfaces)assert.ok(!overlap(p,surface,.15),'planter clears existing paving');
 for(const v of scene.userData.clearanceVolumes){if(v.name===p.name)continue;assert.ok(!overlap(p,{x:(v.min[0]+v.max[0])/2,z:(v.min[2]+v.max[2])/2,w:v.max[0]-v.min[0],d:v.max[2]-v.min[2]},.1),'planter clears '+v.name);}
 assert.ok(scene.userData.clearanceVolumes.some(v=>v.name===p.name&&v.max[1]>=.64),'winter envelope participates in traffic collision tests');
}
for(const line of r.roadEdgeLines){
 const road=scene.userData.roadNetwork.find(road=>road.name===line.road);
 assert.ok(Math.abs(line.x-road.x)+line.w/2<=road.w/2&&Math.abs(line.z-road.z)+line.d/2<=road.d/2,'edge paint stays inside asphalt');
 for(const s of net.segments)assert.ok(!overlap(line,routeRect(s),.25),'edge paint leaves crosswalk open');
 for(const other of scene.userData.roadNetwork)if(other!==road)assert.ok(!overlap(line,other,.4),'edge paint stops before junction');
}
for(const name of ['river-west-promenade','river-east-promenade','bridge-west-approach','bridge-east-approach','garden-central-walk'])assert.ok(g.pedestrianSurfaces.some(p=>p.name===name),'preserved useful walk '+name);
console.log(JSON.stringify({status:'PASS',removedAutomaticTiles:r.retiredRoadsideStrips.length,solidEdgeRuns:r.roadEdgeLines.length,clearPlanters:r.vergePlanters.length,entrances:net.entrances.length,walkingSegments:net.segments.length}));
