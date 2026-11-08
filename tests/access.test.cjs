const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/../lab-scene.js','utf8');const handlers={};
const node={hidden:true,classList:{contains:()=>false},dataset:{},querySelectorAll:()=>[],setAttribute(){}};
const canvas={width:0,height:0,getContext:()=>({fillRect(){},fillText(){},strokeRect(){}})};
const storage=new Map([["itong-season","spring"]]);
const c={console,window:{addEventListener:(name,fn)=>handlers[name]=fn,dispatchEvent(){}},document:{createElement:()=>canvas,querySelector:()=>node,documentElement:{dataset:{}}},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},MutationObserver:class{observe(){}},CustomEvent:class{constructor(type,p){this.type=type;this.detail=p.detail;}}};vm.createContext(c);
vm.runInContext(source.slice(0,source.indexOf('function Am()'))+source.slice(source.indexOf('function Im('),source.indexOf('var xr=class'))+source.slice(source.indexOf('function Lm('),source.indexOf('var yn=document'))+';this.EXPORT={T:gr,builder:Nc,merge:xd,buildStreet:Im,buildRain:Lm};})();',c);
const worldSource=fs.readFileSync(__dirname+'/../lab-world.js','utf8');assert.ok(!worldSource.includes('rotationY:.31'));assert.ok(!worldSource.includes('北大楼 · NORTH BUILDING'));assert.ok(worldSource.includes("n.label('北大楼'"));vm.runInContext(worldSource,c);
const {T,builder,merge}=c.EXPORT,scene=new T.Scene(),interiorGroup=new T.Group(),roof=new T.Group();scene.background=new T.Color('#131f30');scene.add(interiorGroup,roof);
const street=new T.Group();scene.add(street);c.EXPORT.buildStreet(builder(street));const wetMarks=street.getObjectByName("seasonal-wet-marks");assert.ok(wetMarks);const wetCount=wetMarks.children.length;assert.ok(wetCount>10);merge(street);assert.equal(wetMarks.children.length,wetCount);
const labelCalls=[];const trackedBuilder=group=>{const b=builder(group),label=b.label;b.label=(...a)=>{if(a[0]==='南京大学'||[...'严肃活泼团结紧张'].includes(a[0]))labelCalls.push(a);return label(...a);};return b;};
const api=c.window.buildSeasonalWorld({THREE:T,scene,interior:builder(interiorGroup),roof,builder:trackedBuilder,merge});

const net=scene.userData.walkNetwork,roads=scene.userData.roadNetwork,volumes=scene.userData.clearanceVolumes;
const issues=[];
const rect=s=>({x:(s.a[0]+s.b[0])/2,z:(s.a[1]+s.b[1])/2,w:Math.abs(s.a[0]-s.b[0])||s.width,d:Math.abs(s.a[1]-s.b[1])||s.width});
const overlap=(a,b,tol=0)=>Math.min(a.x+a.w/2,b.x+b.w/2)-Math.max(a.x-a.w/2,b.x-b.w/2)>tol&&Math.min(a.z+a.d/2,b.z+b.d/2)-Math.max(a.z-a.d/2,b.z-b.d/2)>tol;
const box=v=>({x:(v.min[0]+v.max[0])/2,z:(v.min[2]+v.max[2])/2,w:v.max[0]-v.min[0],d:v.max[2]-v.min[2]});
const seen=new Set([0]);for(let pass=0;pass<net.segments.length;pass++)net.segments.forEach((s,i)=>{if([...seen].some(j=>overlap(rect(s),rect(net.segments[j]),-.001)))seen.add(i);});
for(const [i,s] of net.segments.entries())if(!seen.has(i))issues.push('Disconnected route '+s.name);
for(const e of net.entrances){if(!net.segments.some((s,i)=>seen.has(i)&&overlap(rect(s),{x:e.point[0],z:e.point[1],w:.01,d:.01},-.001)))issues.push('Unreachable entrance '+e.name);}
for(const s of net.segments){
 for(const v of volumes){
  if(s.owner===v.owner||v.owner==='water'&&s.name==='arched-bridge'||v.name==='power-lines')continue;
  if(overlap(rect(s),box(v),.02))issues.push('Route '+s.name+' intersects '+v.name);
 }
}
for(const p of scene.userData.publicRealm.gardens){
 for(const r of roads)if(overlap(p,r,.01))issues.push('Garden '+p.name+' blocks road '+r.name);
 for(const s of net.segments)if(overlap(p,rect(s),.01))issues.push('Garden '+p.name+' blocks route '+s.name);
 for(const v of volumes.filter(v=>!v.name.startsWith('tree-')))if(overlap(p,box(v),.01))issues.push('Garden '+p.name+' intersects '+v.name);
}
for(const f of [...scene.userData.residentialInfill.streetFurniture,...scene.userData.publicRealm.trees,...scene.userData.publicRealm.seats.map(([x,z])=>({x,z,w:.5,d:1.8}))]){
 for(const r of roads)if(overlap(f,r,.01))issues.push('New furniture/tree '+JSON.stringify(f)+' blocks '+r.name);
 for(const s of net.segments)if(overlap(f,rect(s),.01))issues.push('New furniture/tree '+JSON.stringify(f)+' blocks route '+s.name);
 for(const v of volumes)if(overlap(f,box(v),.01))issues.push('New furniture/tree '+JSON.stringify(f)+' intersects '+v.name);
}
for(const l of net.bridgeLandings){const length=Math.hypot(l.b[0]-l.a[0],l.b[1]-l.a[1]);if(Math.abs(l.high-l.low)/length>1/12+.001)issues.push('Steep bridge landing '+l.name);}
assert.equal(net.bridgeLandings[0].high,.66);assert.equal(net.bridgeLandings[1].low,.66);
assert.equal(net.bridgeLandings[0].low,.26);assert.equal(net.bridgeLandings[1].high,.26);
assert.equal(net.bridgeLandings[0].b[0],-38.65);assert.equal(net.bridgeLandings[1].a[0],-29.35);
// All intersecting street centerlines must actually reach the intersection.
for(let i=0;i<roads.length;i++)for(let j=i+1;j<roads.length;j++){
 const a=roads[i],b=roads[j];if(!overlap(a,b,.01))continue;
 const av=a.d>a.w,bv=b.d>b.w;
 if(av===bv){assert.ok(Math.abs((av?a.x:a.z)-(bv?b.x:b.z))<1e-8,'parallel streets must share centerline: '+a.name+' / '+b.name);continue;}
 const v=av?a:b,h=av?b:a;
 assert.ok(v.x>=h.x-h.w/2&&v.x<=h.x+h.w/2&&h.z>=v.z-v.d/2&&h.z<=v.z+v.d/2,'centerlines reach junction: '+a.name+' / '+b.name);
}
for(const c of net.crossings){
 const acrossZ=c.d>c.w;
 assert.ok(roads.some(r=>acrossZ?r.w>r.d&&Math.abs(r.z-c.z)<1e-8&&Math.abs(r.d-c.d)<1e-8:r.d>r.w&&Math.abs(r.x-c.x)<1e-8&&Math.abs(r.w-c.w)<1e-8),'crossing spans its real road at center');
 assert.ok(net.segments.some(s=>acrossZ?Math.abs(s.a[0]-c.x)<1e-8&&Math.abs(s.b[0]-c.x)<1e-8:Math.abs(s.a[1]-c.z)<1e-8&&Math.abs(s.b[1]-c.z)<1e-8),'crossing shares pedestrian centerline');
}
const labSnowman=scene.userData.snowmanSites.at(-1);
assert.ok(labSnowman[1]>8, "SLAB snowman stays in front open space, away from Lulu");
const snowBody={x:labSnowman[0],z:labSnowman[1],w:1.1*labSnowman[2],d:1.1*labSnowman[2]};
for(const route of net.segments)assert.ok(!overlap(snowBody,rect(route)), 'SLAB snowman clears route '+route.name);
assert.ok(!overlap(snowBody,box(volumes.find(v=>v.owner==='slab'))),'SLAB snowman clears building');
const garden=scene.userData.urbanPaving.find(p=>p.name==='garden-central-walk');
assert.equal(garden.x,net.entrances.find(e=>e.name==='Drum Tower').point[0],'Drum Tower garden and doorway share axis');
for(const s of net.segments.filter(s=>['west-bridge-ramp','east-bridge-ramp','arched-bridge'].includes(s.name)))assert.equal(s.a[1],s.b[1],'bridge approach straight and level in plan');
assert.equal(scene.userData.groundDesign.top,.26,'one shared pedestrian elevation');
assert.ok(scene.userData.groundDesign.roadCells.length>0,'non-overlapping asphalt union exists');
assert.ok(scene.userData.groundDesign.curbRamps.length>0,'crossings have lowered curb transitions');
console.log(JSON.stringify({status:issues.length?'FAIL':'PASS',entrances:net.entrances.length,segments:net.segments.length,connectedSegments:seen.size,roads:roads.length,gardens:scene.userData.publicRealm.gardens.length,issues:[...new Set(issues)]},null,2));
assert.equal(issues.length,0,'pedestrian access / public realm geometry');
