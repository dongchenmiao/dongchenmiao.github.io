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
const rain=new T.Group(),wet=new T.Group(),key=new T.DirectionalLight(),fill=new T.DirectionalLight(),ground=new T.Mesh(new T.PlaneGeometry(),new T.MeshBasicMaterial()),renderer={};
let quality="full";api.connect({rain,wet,key,fill,ground,renderer,getQuality:()=>quality});const select=season=>handlers['itong:set-season']({detail:{season}});
assert.equal(rain.visible,true);assert.equal(storage.get("itong-season"),"summer");select('winter');assert.equal(rain.visible,false);assert.equal(wet.visible,false);assert.equal(wetMarks.visible,false);assert.equal(scene.getObjectByName('seasonal-snow-caps').visible,true);api.update(0,0);assert.equal(scene.getObjectByName('main-roof-snow').visible,false);api.update(2,.5);assert.equal(scene.getObjectByName('main-roof-snow').visible,true);assert.equal(scene.getObjectByName('main-roof-snow').children[0].material.opacity,.5);assert.equal(scene.getObjectByName('seasonal-snowflakes').material.uniforms.time.value,2);assert.equal(scene.children.find(x=>x.name==='companion-buildings').visible,true);
select('autumn');assert.equal(scene.getObjectByName('autumn-crowns').visible,false);assert.equal(storage.get('itong-season'),'summer');select('spring');assert.equal(rain.visible,true);select('summer');assert.equal(rain.visible,true);assert.equal(wetMarks.visible,true);assert.equal(storage.get('itong-season'),'summer');select('invalid');assert.equal(storage.get('itong-season'),'summer');
quality="light";select("summer");assert.equal(wet.visible,false);quality="full";select("summer");assert.equal(wet.visible,true);select("winter");assert.equal(wet.visible,false);
const volumes=scene.userData.clearanceVolumes;const clashes=[];for(let i=0;i<volumes.length;i++)for(let j=i+1;j<volumes.length;j++){const a=volumes[i],b=volumes[j];if(a.owner===b.owner)continue;if([0,1,2].every(k=>Math.min(a.max[k],b.max[k])-Math.max(a.min[k],b.min[k])>.01))clashes.push([a.name,b.name]);}assert.deepEqual(clashes,[]);
// Masterplan connectivity and real pedestrian clearances.
const roads=scene.userData.roadNetwork, seen=new Set([0]);
const overlap=(a,b)=>Math.abs(a.x-b.x)<=((a.w+b.w)/2)+.01&&Math.abs(a.z-b.z)<=((a.d+b.d)/2)+.01;
for(let sweep=0;sweep<roads.length;sweep++)roads.forEach((r,j)=>{if([...seen].some(i=>overlap(r,roads[i])))seen.add(j);});
assert.equal(seen.size,roads.length,'every street joins the road graph');
for(const p of scene.userData.urbanPaving)for(const r of roads)assert.ok(!overlap({...p,w:p.w-.02,d:p.d-.02},r),'raised parcel '+p.name+' avoids road '+r.name);
for(const p of scene.userData.masterplan.pavementStrips){
 for(const r of roads)assert.ok(!overlap({...p,w:p.w-.02,d:p.d-.02},r),'sidewalk never closes a carriageway');
 for(const v of volumes.filter(v=>!['power','notice','water'].includes(v.owner)&&!v.name.startsWith('tree-'))){
 const b={x:(v.min[0]+v.max[0])/2,z:(v.min[2]+v.max[2])/2,w:v.max[0]-v.min[0],d:v.max[2]-v.min[2]};
 assert.ok(!overlap(p,b),'sidewalk avoids '+v.name+' at '+p.x+','+p.z);
 }
}
// Residential additions must retain their roofs, setbacks and seasonal cutaway.
const infill=scene.userData.residentialInfill;assert.equal(infill.homes.length,10);
for(const [i,[x,z,w,d,h]] of infill.homes.entries()){
 assert.ok(scene.userData.weatherRoofAt(x,z)>h,'rain/snow stops above residential roofs');
 assert.ok(scene.getObjectByName('housing-'+i));assert.ok(scene.getObjectByName('housing-'+i+'-snow'));
}
for(const [x,z] of infill.trees)for(const road of roads)assert.ok(!overlap({x,z,w:2.1,d:2.1},road),'new tree canopy clears road');
for(const f of infill.streetFurniture){
 for(const r of roads)assert.ok(!overlap(f,r),'street furniture clears carriageway');
 for(const p of scene.userData.masterplan.pavementStrips)assert.ok(!overlap(f,p),'street furniture leaves through sidewalk open');
 for(const v of volumes.filter(v=>!v.name.startsWith('tree-'))){const b={x:(v.min[0]+v.max[0])/2,z:(v.min[2]+v.max[2])/2,w:v.max[0]-v.min[0],d:v.max[2]-v.min[2]};assert.ok(!overlap(f,b),'street furniture clears '+v.name);}
}
// Distant skyline is outside the entire default 65-unit orbit path.
for(const v of volumes.filter(v=>v.name.startsWith('skyline-'))){const x=Math.max(v.min[0],Math.min(-12,v.max[0])),z=Math.max(v.min[2],Math.min(-4,v.max[2]));assert.ok(Math.hypot(x+12,z+4)>68,'skyline clears camera orbit');}
for(const road of scene.userData.roadNetwork)for(const v of volumes.filter(v=>!v.name.startsWith('tree-')&&!v.name.startsWith('power-')&&v.owner!=='water'&&v.owner!=='notice')){const ix=Math.min(road.x+road.w/2,v.max[0])-Math.max(road.x-road.w/2,v.min[0]),iz=Math.min(road.z+road.d/2,v.max[2])-Math.max(road.z-road.d/2,v.min[2]);assert.ok(ix<=0||iz<=0,'road avoids '+v.name);}
assert.equal(scene.userData.isCityOccluded({x:-21,y:2,z:-39},{x:-21,y:2,z:-22}),true);assert.equal(scene.userData.snowmanSites.length,4);for(const [x,z,k] of scene.userData.snowmanSites)for(const road of scene.userData.roadNetwork)assert.ok(Math.abs(x-road.x)>road.w/2+.8*k||Math.abs(z-road.z)>road.d/2+.8*k,'snowman clear of road');
select('winter');assert.ok(scene.getObjectByName('winter-snowmen').parent.visible);select('summer');assert.equal(scene.getObjectByName('winter-snowmen').parent.visible,false);
for(const b of scene.userData.zifengBladeOffsets){if(b.y>=24)continue;if(Math.abs(b.angle)<.01)assert.ok(b.z>=2.57);else if(Math.abs(b.angle-Math.PI)<.01)assert.ok(b.z<=-2.57);else assert.ok(Math.abs(b.x)>=2.47);}
assert.ok(scene.userData.gableMinimumUpNormal>0,"gable roof slopes face upward");
const camera=new T.PerspectiveCamera(48,16/10,.1,300);camera.position.set(8,23,48).sub(new T.Vector3(-10,6,-10)).multiplyScalar(1.90/(16/10)).add(new T.Vector3(-10,6,-10));camera.lookAt(-10,6,-10);camera.updateMatrixWorld();for(const name of ['slab','north-left-wing','north-tower','campus-gate','zifeng-tower','nanjing-drum-tower','jiming-temple','fuzimiao-dacheng-hall']){const v=volumes.find(o=>o.name===name);for(const x of [v.min[0],v.max[0]])for(const y of [v.min[1],v.max[1]])for(const z of [v.min[2],v.max[2]]){const q=new T.Vector3(x,y,z).project(camera);assert.ok(Math.abs(q.x)<.97&&Math.abs(q.y)<.97,name+' default desktop framing');}}

// Qinhuai decoration faces the river (+X), never mirrored by negative scaling.
const dragonScreen=scene.getObjectByName('qinhuai-dragon-screen');
assert.ok(dragonScreen,'named river screen exists');
scene.updateMatrixWorld(true);
const dragonRelief=dragonScreen.children.filter(o=>o.isMesh&&['bb9b58','c5a363','c8ad6c','ceb176','d1b46d'].includes(o.material.color?.getHexString()));
assert.ok(dragonRelief.length>0,'dragon relief retained after merge');
for(const mesh of dragonRelief){const bounds=new T.Box3().setFromObject(mesh);assert.ok(bounds.min.x>-40.9,'dragon relief sits on east river-facing side');}
assert.ok(dragonScreen.matrixWorld.determinant()>0,'screen is rotated rather than mirrored');

// Refined neighborhood materials survive merging and season/cutaway restoration.
const detail=scene.userData.neighborhoodDetailMaterials;
assert.ok(detail.plaster.every(m=>m.isMeshStandardMaterial&&m.roughness>=.85&&m.metalness===0));
assert.ok(detail.glass.roughness<detail.metal.roughness&&detail.metal.roughness<detail.roof.roughness);
assert.ok(detail.warmGlass.emissiveIntensity>0&&detail.warmGlass.emissiveIntensity<.3);
for(let i=0;i<10;i++){
 const group=scene.getObjectByName('housing-'+i),materials=[];group.traverse(o=>{if(o.material)materials.push(o.material);});
 assert.ok(materials.some(m=>m.isMeshStandardMaterial&&m.roughness===detail.glass.roughness&&m.color.equals(detail.glass.color)),'side glazing retains physical material');
 assert.ok(materials.some(m=>m.isMeshStandardMaterial&&m.roughness===detail.metal.roughness&&m.color.equals(detail.metal.color)),'rails and parapets retain metal');
 assert.ok(materials.some(m=>m.isMeshStandardMaterial&&m.roughness===detail.roof.roughness&&m.color.equals(detail.roof.color)),'roof retains rough metal');
}

// Cutaway responds to rear camera occlusion and restores opaque buildings.
scene.updateMatrixWorld(true);const zb=new T.Box3().setFromObject(scene.getObjectByName('zifeng-tower'));assert.ok(zb.min.x>-13&&zb.max.x<-3,'district merge keeps world transforms once');
scene.userData.updateCityCutaway({position:new T.Vector3(-8,12,-70)});let dim=0;scene.getObjectByName('zifeng-tower').traverse(o=>{if(o.material&&o.material.opacity<.2)dim++;});assert.ok(dim>0,'rear tower fades out of core sightline');assert.equal(scene.getObjectByName('zifeng-tower').visible,false);scene.getObjectByName('zifeng-tower').traverse(o=>{if(o.material)assert.equal(o.castShadow,false,'cutaway cannot cast ghost shadows');});
scene.userData.updateCityCutaway({position:new T.Vector3(13,18,42)});scene.getObjectByName('zifeng-tower').traverse(o=>{if(o.material)assert.equal(o.material.opacity,o.material.userData.baseOpacity,'tower restores on front orbit');});
const start=source.indexOf(' const markerSlots=[];'),end=source.indexOf(' for(const spot of labSpots){',start);c.innerWidth=800;c.innerHeight=650;vm.runInContext(source.slice(start,end)+';this.placeMarker=separateMarker;',c);const marks=Array.from({length:4},()=>c.placeMarker(300,280));for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)assert.ok(Math.abs(marks[i].x-marks[j].x)>88||Math.abs(marks[i].y-marks[j].y)>60,'four coincident markers separate');

// Boat envelope and SAT collision checks over an entire lap, including both turns.
const route=scene.userData.boatRoute;
const corners=p=>{const out=[];for(const x of [-route.halfWidth,route.halfWidth])for(const z of [-route.halfLength,route.halfLength])out.push([p.x+Math.cos(p.yaw)*x+Math.sin(p.yaw)*z,p.z-Math.sin(p.yaw)*x+Math.cos(p.yaw)*z]);return out;};
const separated=(a,b,p,q)=>[p.yaw,p.yaw+Math.PI/2,q.yaw,q.yaw+Math.PI/2].some(angle=>{const axis=[Math.cos(angle),Math.sin(angle)],aa=a.map(v=>v[0]*axis[0]+v[1]*axis[1]),bb=b.map(v=>v[0]*axis[0]+v[1]*axis[1]);return Math.max(...aa)<Math.min(...bb)-.03||Math.max(...bb)<Math.min(...aa)-.03;});
for(let i=0;i<4096;i++){const d=route.length*i/4096,p=route.pose(d),q=route.pose(d+route.length/2),a=corners(p),b=corners(q);for(const [x,z] of [...a,...b])assert.ok(x>route.water.minX+.1&&x<route.water.maxX-.1&&z>route.water.minZ+.1&&z<route.bridgeMinZ-1,'boat bank/bridge clearance');assert.ok(separated(a,b,p,q),'boats remain separated');}
const boat=scene.getObjectByName('qinhuai-boat-0');api.update(10);const frozen=boat.position.clone();api.update(10);assert.ok(frozen.equals(boat.position),'frozen shared clock freezes boats');api.update(12);assert.ok(!frozen.equals(boat.position),'boats actually advance');
assert.equal(labelCalls.length,9);for(const a of labelCalls.filter(a=>a[0]!=='南京大学'))assert.ok(a[4]<=1.72&&a[4]>=.69&&a[5]>=.415,'pillar text stays below lintels and outside front face');for(const a of labelCalls){assert.equal(a[6].bg,'transparent');assert.ok(a[5]>.36,'gate inscription in front of beams');}
const realRain=new T.Group();c.EXPORT.buildRain(realRain)(0);const ra=realRain.children.find(o=>o.isLineSegments).geometry.attributes;assert.equal(ra.position.count,14400);let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;for(let i=0;i<ra.position.count;i++){const x=ra.position.getX(i),z=ra.position.getZ(i);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minZ=Math.min(minZ,z);maxZ=Math.max(maxZ,z);assert.ok(ra.ceiling.getX(i)>ra.floorY.getX(i));}assert.ok(minX<-90&&maxX>84&&minZ<-107&&maxZ>67,'rain covers full city');let nearRain=0;for(let i=0;i<ra.position.count;i+=2){if(Math.abs(ra.position.getX(i))<8.75&&Math.abs(ra.position.getZ(i))<8.75)nearRain++;assert.ok(ra.ceiling.getX(i)>=60);}assert.ok(nearRain<350,'no dense near-lab rain plume');
const sa=scene.getObjectByName('seasonal-snowflakes').geometry.attributes;assert.equal(sa.position.count,3600);for(let i=0;i<3600;i++)assert.ok(sa.ceiling.getX(i)>sa.floorY.getX(i));
for(const season of ['summer','winter']){select(season);assert.equal(scene.getObjectByName('summer-storm-clouds').visible,season==='summer');assert.equal(scene.getObjectByName('winter-starfield').visible,season==='winter');assert.equal(wetMarks.visible,season==='summer');}
assert.ok(scene.userData.weatherRoofAt(-8,-64)>27,'rain clears new Zifeng roof');

// Regression: both address plates touch brackets mounted on the actual poles.
const signStart=source.indexOf('function buildHankouStreetSigns('),signEnd=source.indexOf('buildHankouStreetSigns(Oo,bilingualLabel);',signStart);
vm.runInContext(source.slice(signStart,signEnd)+';this.buildSigns=buildHankouStreetSigns;',c);
const signGroup=new T.Group(),signBuilder=builder(signGroup);
const signs=c.buildSigns(signBuilder,(zh,en,...args)=>[signBuilder.label(zh,...args),signBuilder.label(en,...args)]);
assert.equal(signs.length,2);
for(const sign of signs){
 assert.equal(sign.plate.position.x,sign.pole.x);
 const plate=new T.Box3().setFromObject(sign.plate);
 const brackets=signGroup.children.filter(o=>o.isMesh&&o!==sign.plate&&Math.abs(o.position.x-sign.pole.x)<1e-6&&Math.abs(o.position.z-sign.pole.z-.11)<1e-6);
 assert.equal(brackets.length,2);
 for(const bracket of brackets){const bb=new T.Box3().setFromObject(bracket);assert.ok(bb.intersectsBox(plate),'bracket touches plate');assert.ok(bb.min.z<=sign.pole.z+.075,'bracket reaches pole');}
 for(const label of sign.labels){assert.ok(label.position.z>plate.max.z,'both language labels face out');assert.equal(label.position.x,sign.pole.x);}
}
assert.ok(!scene.userData.urbanPaving?.some(p=>p.name==='lab-front-link'),'no detached paving slab across lab parking and crossing');
assert.ok(!worldSource.includes("paving('lab-front-link'"));

// Material polish keeps real geometry, physical shading and seasonal controls intact.
assert.ok(scene.userData.materialPolish.masonryMaterials>=5);
assert.equal(scene.userData.materialPolish.extraRenderPasses,0);
assert.ok(new T.Color(scene.userData.materialPolish.roadSnow).getHSL({}).l<new T.Color(scene.userData.materialPolish.freshSnow).getHSL({}).l);
let finishedMaterials=0;
scene.getObjectByName('companion-buildings').traverse(o=>{
 const m=o.material;if(m?.customProgramCacheKey?.()!=='itong-masonry-v1')return;
 const shader={vertexShader:T.ShaderLib.standard.vertexShader,fragmentShader:T.ShaderLib.standard.fragmentShader};m.onBeforeCompile(shader);
 assert.ok(shader.vertexShader.includes('vMasonryWorld=(modelMatrix*vec4(position,1.0)).xyz;'));
 assert.ok(shader.fragmentShader.includes('fwidth(masonryUV)'),'subpixel masonry fades to avoid shimmer');
 assert.ok(m.isMeshStandardMaterial&&shader.fragmentShader.includes('#include <lights_physical_fragment>'),'physical lighting retained');finishedMaterials++;
});
assert.ok(finishedMaterials>=5);

merge(interiorGroup);let vertices=0,meshes=0,invalid=0;scene.traverse(o=>{if(o.isMesh||o.isPoints){meshes++;const a=o.geometry.attributes.position;if(a){vertices+=a.count;for(const v of a.array)if(!Number.isFinite(v))invalid++;}}});assert.equal(invalid,0);console.log(JSON.stringify({status:'PASS',vertices,meshes,interiorObjects:interiorGroup.children.length,tests:['4096-step boat route, banks, bridge and mutual clearance','boat motion and frozen-clock stability','transparent gate text clears beams','full-city rain/snow with roof ceilings','seasonal clouds and winter stars','gable roof upward normals','default desktop framing projection','major structure, tree canopy and power-line clearance volumes','geometry construction with real Three.js','finite vertices','rain/snow visibility and old-season compatibility','invalid-input guard','preference persistence','snow update','original puddles survive merge as seasonal group','wet-marks season visibility','quality/season reflection interaction']}));
