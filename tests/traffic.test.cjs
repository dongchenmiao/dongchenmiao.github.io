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
let reducedMotion=false;c.window.matchMedia=()=>({get matches(){return reducedMotion;}});
const api=c.window.buildSeasonalWorld({THREE:T,scene,interior:builder(interiorGroup),roof,builder:trackedBuilder,merge});


const traffic=scene.userData.traffic;assert.equal(traffic.cars.length,6);
const corners=p=>{const out=[];for(const x of [-traffic.halfWidth,traffic.halfWidth])for(const z of [-traffic.halfLength,traffic.halfLength])out.push([p.x+Math.cos(p.yaw)*x+Math.sin(p.yaw)*z,p.z-Math.sin(p.yaw)*x+Math.cos(p.yaw)*z]);return out;};
const roadAt=(x,z)=>scene.userData.roadNetwork.some(r=>Math.abs(x-r.x)<=r.w/2-.015&&Math.abs(z-r.z)<=r.d/2-.015);
const separated=(a,b,p,q)=>[-p.yaw,-p.yaw+Math.PI/2,-q.yaw,-q.yaw+Math.PI/2].some(angle=>{const axis=[Math.cos(angle),Math.sin(angle)],aa=a.map(v=>v[0]*axis[0]+v[1]*axis[1]),bb=b.map(v=>v[0]*axis[0]+v[1]*axis[1]);return Math.max(...aa)<Math.min(...bb)-.02||Math.max(...bb)<Math.min(...aa)-.02;});
for(const lane of traffic.lanes){assert.ok(lane.stops.length>0);for(let i=0;i<8192;i++){const p=lane.pose(lane.length*i/8192);for(const [x,z] of corners(p)){assert.ok(roadAt(x,z),'entire car on asphalt '+JSON.stringify({x,z,p}));for(const v of scene.userData.clearanceVolumes)if(v.min[1]<.85)assert.ok(x<v.min[0]||x>v.max[0]||z<v.min[2]||z>v.max[2],'car clears '+v.name);}}}
let stops=0,minGap=Infinity;for(let frame=0;frame<24000;frame++){traffic.update(frame/30,frame>12000);const cars=traffic.cars;for(let i=0;i<cars.length;i++){if(cars[i].speed<.01)stops++;for(let j=i+1;j<cars.length;j++){assert.ok(separated(corners(cars[i].pose),corners(cars[j].pose),cars[i].pose,cars[j].pose),'collision-free '+JSON.stringify({frame,i,j,a:cars[i],b:cars[j]}));minGap=Math.min(minGap,Math.hypot(cars[i].pose.x-cars[j].pose.x,cars[i].pose.z-cars[j].pose.z));}}}
assert.ok(traffic.cars.every(c=>c.laps>=3),'each car completes multiple laps');assert.ok(stops>6,'cars yield at crossings');
const before=JSON.stringify(traffic.cars);traffic.update(23999/30,true);assert.equal(JSON.stringify(traffic.cars),before,'frozen shared animation clock');
const old=traffic.cars[0].distance;traffic.update(9000,true);assert.ok(Math.abs(traffic.cars[0].distance-old)<.15,'resume cannot teleport');
reducedMotion=true;const paused=JSON.stringify(traffic.cars);traffic.update(9001,true);assert.equal(JSON.stringify(traffic.cars),paused,'live reduced-motion setting freezes cars');reducedMotion=false;traffic.update(9001.05,true);assert.notEqual(JSON.stringify(traffic.cars),paused,'motion resumes without teleporting');
const meshes=[];traffic.group.traverse(o=>{if(o.isMesh)meshes.push(o);});assert.equal(meshes.length,6);assert.ok(meshes.every(m=>m.isInstancedMesh));
console.log(JSON.stringify({status:'PASS',routeSamples:16384,simulationSeconds:800,laps:traffic.cars.map(c=>c.laps),minimumCenterGap:minGap,crosswalkStoppedFrames:stops,trafficDrawBatches:meshes.length}));
