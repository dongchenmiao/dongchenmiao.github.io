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
const originalLamp=new T.PointLight('#ffd591',15);originalLamp.name='slab-street-lamp-light';scene.add(originalLamp);
const originalBulb=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial({color:'#ffe6a3',emissive:'#ffe6a3',emissiveIntensity:2.2}));originalBulb.name='slab-street-lamp-bulb';scene.add(originalBulb);
const originalGlow=new T.Mesh(new T.PlaneGeometry(),new T.MeshBasicMaterial({transparent:true,opacity:.32}));originalGlow.name='slab-night-glow';scene.add(originalGlow);
const api=c.window.buildSeasonalWorld({THREE:T,scene,interior:builder(interiorGroup),roof,builder:trackedBuilder,merge});
const rain=new T.Group(),wet=new T.Group(),key=new T.DirectionalLight(),fill=new T.DirectionalLight(),ground=new T.Mesh(new T.PlaneGeometry(),new T.MeshBasicMaterial()),renderer={};
wet.material={uniforms:{wetness:{value:1}}};let quality="full";api.connect({rain,wet,key,fill,ground,renderer,getQuality:()=>quality});const select=season=>handlers['itong:set-season']({detail:{season}});

select('clear');assert.equal(storage.get('itong-season'),'clear');assert.equal(rain.visible,false);assert.equal(wet.visible,false,'zero-alpha reflection skips its extra render pass in sun');assert.equal(wet.material.uniforms.wetness.value,0,'sunny reflection is exactly zero');assert.equal(originalLamp.intensity,0);assert.equal(originalBulb.material.emissiveIntensity,0);assert.equal(originalGlow.material.opacity,0);assert.equal(wetMarks.visible,false);
for(const name of ['seasonal-snowflakes','seasonal-snow-caps','summer-storm-clouds','winter-starfield'])assert.equal(scene.getObjectByName(name).visible,false,name);
assert.equal(scene.getObjectByName('clear-day-sun-sky').visible,true);assert.ok(key.intensity>2);assert.ok(key.position.y>0,'sun is above skyline');assert.ok(scene.getObjectByName('clear-day-sun-disc').visible);
const daylight=scene.userData.daylight;
const sunCamera=new T.PerspectiveCamera(48,1.6,.1,300);sunCamera.position.set(8,23,48);sunCamera.lookAt(-10,6,-10);sunCamera.updateMatrixWorld();
api.connect({rain,wet,key,fill,ground,renderer,camera:sunCamera,getQuality:()=>quality});api.update(1);
const sunScreen=daylight.sunDisc.position.clone().project(sunCamera);assert.ok(Math.abs(sunScreen.x)<.9&&sunScreen.y>.3&&sunScreen.y<.98&&sunScreen.z<1,'celestial sun is above buildings in default framing');
const lightBearing=key.position.clone().sub(key.target.position).normalize();assert.ok(daylight.sunDirection.clone().cross(lightBearing).length()<1e-7,'sun aligns with light POSITION MINUS TARGET');
for(const position of [[8,23,48],[-45,16,20],[30,40,60]]){
 sunCamera.position.set(...position);sunCamera.lookAt(-10,6,-10);sunCamera.updateMatrixWorld();api.update(2);
 const skyBearing=daylight.sunDisc.position.clone().sub(sunCamera.position).normalize();assert.ok(skyBearing.distanceTo(lightBearing)<1e-7,'sun has zero camera-translation parallax');
 // A vertical object's shadow and the sun's vanishing point are collinear in screen space.
 const foot=new T.Vector3(-5,0,5),top=foot.clone().add(new T.Vector3(0,3,0)),tip=top.clone().addScaledVector(lightBearing,-3/lightBearing.y);
 const a=top.clone().project(sunCamera),b=tip.clone().project(sunCamera),v=daylight.sunDisc.position.clone().project(sunCamera);
 assert.ok(Math.abs((b.x-a.x)*(v.y-a.y)-(b.y-a.y)*(v.x-a.x))<1e-6,'projected shadow ray points away from the visible sun');
}
assert.equal(key.shadow.camera.far,380);assert.equal(key.shadow.camera.right,100);for(const e of scene.userData.cityLighting.landmarkLights)assert.equal(e.light.intensity,0,'daytime street lights are off');
assert.ok(daylight.nightEmitters.size>0);for(const [m] of daylight.nightEmitters)assert.equal(m.emissiveIntensity,0,'daytime windows are unlit');for(const [m,b] of daylight.materials)assert.equal(m.color.getHex(),b.day.getHex());
select('winter');assert.equal(daylight.sunDisc.visible,false);for(const [m,power] of daylight.nightEmitters)assert.equal(m.emissiveIntensity,power,'night windows restore warm emission');for(const [m,b] of daylight.materials)assert.equal(m.color.getHex(),b.color.getHex(),'snow restores original material');assert.equal(scene.getObjectByName('clear-day-sun-sky').visible,false);assert.equal(scene.getObjectByName('seasonal-snowflakes').visible,true);assert.equal(rain.visible,false);
select('summer');for(const [m,power] of daylight.nightEmitters)assert.equal(m.emissiveIntensity,power,'rain restores night windows');assert.equal(daylight.sunDisc.visible,false);assert.equal(rain.visible,true);assert.equal(wet.visible,true);assert.equal(scene.getObjectByName('clear-day-sun-sky').visible,false);assert.ok(key.position.clone().sub(key.target.position).normalize().distanceTo(new T.Vector3(-8,19,7).normalize())<1e-7);assert.equal(wet.material.uniforms.wetness.value,1);assert.equal(originalLamp.intensity,15);assert.equal(originalBulb.material.emissiveIntensity,2.2);assert.equal(originalGlow.material.opacity,.32);assert.equal(key.shadow.camera.far,380);assert.equal(key.shadow.camera.right,100);
select('clear');quality='light';select('clear');assert.equal(wet.visible,false);select('invalid');assert.equal(storage.get('itong-season'),'clear');
// Landmark bodies must stay solid, including west-side and distant views.
for(const name of ['nanjing-drum-tower','fuzimiao-dacheng-hall']){
 const landmark=scene.getObjectByName(name);
 for(const position of [[-45,7,-2],[-85,10,-3],[-145,18,-4],[8,23,48]]){
  scene.userData.updateCityCutaway({position:new T.Vector3(...position)});
  assert.equal(landmark.visible,true,name+' remains visible');
  landmark.traverse(o=>{if(o.material){assert.equal(o.material.opacity,o.material.userData.baseOpacity,name+' retains opacity');assert.equal(o.material.depthWrite,o.material.userData.baseDepthWrite);assert.equal(o.material.transparent,o.material.userData.baseTransparent);assert.equal(o.castShadow,o.userData.originalCastShadow);}});
 }
}
assert.equal(scene.userData.isCityOccluded(new T.Vector3(-85,7,-3),new T.Vector3(-1,2.2,-1.5)),true,'solid landmarks still occlude labels behind them');
// Run the real mascot update in isolation, using real Three transforms.
const mascot=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial());mascot.material.userData.luluBlink={value:0};scene.add(mascot);mascot.name='lulu-colored';
c.ze=scene;c.mb=false;c.vd=0;c.performance={now:()=>1000};c.yn={dataset:{}};c.portalState='idle';c.window.itongPanels={active:false};
vm.runInContext(source.slice(source.indexOf('const labMascot=ze.getObjectByName'),source.indexOf("document.querySelector('#lab-greet')")),c);
vm.runInContext('vd=10;updateMascot()',c);assert.ok(mascot.rotation.y>0);assert.equal(mascot.position.y,.07);const frozen=JSON.stringify([mascot.rotation.toArray(),mascot.scale.toArray()]);vm.runInContext('updateMascot()',c);assert.equal(JSON.stringify([mascot.rotation.toArray(),mascot.scale.toArray()]),frozen);
vm.runInContext('vd=.11;updateMascot()',c);assert.ok(mascot.material.userData.luluBlink.value>.99);
vm.runInContext('mb=true;updateMascot()',c);assert.equal(mascot.scale.toArray().join(),'1,1,1');assert.equal(mascot.rotation.x,0);assert.equal(mascot.rotation.y,0);assert.equal(mascot.rotation.z,0);assert.equal(mascot.material.userData.luluBlink.value,0);
console.log('PASS: clear/rain/snow states, light quality, invalid state, opaque Drum Tower/Dacheng Hall across side and distant views, Lulu glance/blink/reduced motion');
// Reversible weather sequencing uses wall time, independent of particle motion.
let now=0;c.performance.now=()=>now;storage.set('yutong-motion','on');
storage.set('yutong-motion','off');select('clear');storage.set('yutong-motion','on');assert.equal(scene.userData.weatherTransition.active,false);
select('summer');assert.equal(scene.userData.weatherTransition.active,true);assert.equal(rain.visible,false,'rain waits for clouds and dusk');
now=1000;api.update(5);const before=scene.userData.weatherTransition.daylight;assert.ok(before>0&&before<1);assert.equal(rain.visible,false);assert.ok(scene.userData.weatherTransition.sunDirection.y<daylight.sunDirection.y,'sun descends during dusk');
const bearing=key.position.clone().sub(key.target.position).normalize();assert.ok(bearing.distanceTo(scene.userData.weatherTransition.sunDirection)<1e-7,'moving sun keeps the actual key-light bearing');
select('clear');assert.equal(scene.userData.weatherTransition.daylight,before,'reversal preserves current frame');now=8000;api.update(6);assert.equal(scene.userData.weatherTransition.active,false);assert.equal(scene.userData.weatherTransition.daylight,1);assert.equal(rain.visible,false);
select('summer');now=12000;api.update(7);assert.equal(rain.visible,true,'rain starts only in later dark stage');assert.ok([...daylight.nightEmitters].some(([m])=>m.emissiveIntensity>0),'window lights rise with dusk');now=14500;api.update(8);assert.equal(scene.userData.weatherTransition.active,false);assert.ok(key.position.clone().sub(key.target.position).normalize().distanceTo(new T.Vector3(-8,19,7).normalize())<1e-7);
select('clear');now=17500;api.update(9);assert.ok(scene.userData.weatherTransition.daylight>.4);select('winter');assert.equal(scene.userData.weatherTransition.active,true);now+=7000;api.update(9);assert.equal(rain.visible,false);assert.equal(scene.getObjectByName('seasonal-snowflakes').visible,true,'snow retargets transition cleanly');
select('clear');storage.set('yutong-motion','off');select('summer');assert.equal(scene.userData.weatherTransition.active,false);assert.equal(rain.visible,true);select('clear');assert.equal(scene.userData.weatherTransition.active,false);assert.equal(rain.visible,false);
storage.set('yutong-motion','on');select('summer');storage.set('yutong-motion','off');api.update(10);assert.equal(scene.userData.weatherTransition.active,false,'turning motion off mid-transition snaps to final target');
console.log('PASS: dusk/sunrise sequence, rain delay, moving sun-light alignment, rapid reversal, snow interruption, reduced-motion start and interruption');

for(const from of ['clear','summer','winter'])for(const to of ['clear','summer','winter'])if(from!==to){
 storage.set('yutong-motion','off');select(from);storage.set('yutong-motion','on');select(to);assert.equal(scene.userData.weatherTransition.active,true,from+' to '+to);
 now+=1600;api.update(10);const w=scene.userData.weatherTransition;assert.equal(w.daylight,((from==='clear'?1:0)+(to==='clear'?1:0))/2);assert.equal(w.snowfall,((from==='winter'?1:0)+(to==='winter'?1:0))/2);assert.ok(w.active);
 now+=1599;api.update(10);assert.ok(w.active,from+' to '+to+' is active at 3199 ms');
 now+=1;api.update(11);assert.equal(w.active,false);assert.equal(w.daylight,to==='clear'?1:0);assert.equal(w.snowfall,to==='winter'?1:0);assert.equal(scene.getObjectByName('seasonal-snowflakes').visible,to==='winter');assert.equal(rain.visible,to==='summer');
}
console.log('PASS: all six weather directions, continuous daytime/snow weights, final particle state');

storage.set('yutong-motion','off');select('clear');storage.set('yutong-motion','on');select('summer');now+=2400;api.update(12);const shine=wet.material.uniforms.wetness.value;assert.ok(shine>0&&shine<1,'rain reflection has actual fractional midpoint');select('clear');assert.equal(wet.material.uniforms.wetness.value,shine,'reflection reversal has no discontinuity');now+=7000;api.update(13);assert.equal(wet.material.uniforms.wetness.value,0);assert.equal(originalLamp.intensity,0);assert.equal(originalGlow.material.opacity,0);console.log('PASS: original SLAB lamp bulb/point/halo, zero sunny reflection, wetness midpoint and interruption');

// Layered snow blends continuously while retaining per-fragment occlusion.
for(const target of ['summer','clear']){
 storage.set('yutong-motion','off');select('winter');
 const caps=scene.getObjectByName('seasonal-snow-caps'),materials=new Map();
 caps.traverse(o=>{if(o.material)materials.set(o.material,{opacity:o.material.opacity,depthWrite:o.material.depthWrite});});
 storage.set('yutong-motion','on');select(target);const start=now;let last=1;
 for(const elapsed of [0,16,100,500,1600,3190]){
  now=start+elapsed;api.update(14+elapsed/1000);const amount=scene.userData.weatherTransition.snowfall;
  assert.ok(amount<=last&&amount>=0);last=amount;
  for(const[m,b]of materials){assert.equal(m.depthWrite,b.depthWrite,'snow retains per-fragment occlusion');assert.equal(m.transparent,true,'snow stays in its transparent queue');assert.ok(Math.abs(m.opacity-b.opacity*amount)<1e-9,'continuous alpha, no dither');const shader={uniforms:{},vertexShader:'#include <begin_vertex>',fragmentShader:'void main() {'};m.onBeforeCompile(shader);assert.ok(!shader.fragmentShader.includes('gl_FragCoord'),'snow color has no screen-space noise');}
  for(const m of [scene.userData.groundDesign.stone,scene.userData.groundDesign.asphalt]){assert.equal(m.opacity,1);assert.equal(m.depthWrite,true);assert.equal(m.transparent,false);}
 }
 const before=scene.userData.weatherTransition.snowfall;select('winter');assert.equal(scene.userData.weatherTransition.snowfall,before,'interruption keeps melt amount');
 now+=4000;api.update(30);assert.equal(scene.userData.weatherTransition.snowfall,1);
 storage.set('yutong-motion','off');select(target);assert.equal(scene.userData.weatherTransition.active,false);
}
console.log('PASS: smooth non-dithered snow with stable depth/queue, permanent ground, reversal and reduced motion');

// Rapid changes keep the rendered state, and every new target has the same clock.
storage.set('yutong-motion','off');select('clear');storage.set('yutong-motion','on');
for(const target of ['summer','winter','clear','winter','summer','clear']){
 const w=scene.userData.weatherTransition,day=w.daylight,snow=w.snowfall,shine=wet.material.uniforms.wetness.value;
 select(target);assert.equal(w.daylight,day);assert.equal(w.snowfall,snow);assert.equal(wet.material.uniforms.wetness.value,shine);
 now+=137;api.update(31);assert.ok(w.active);assert.ok(w.daylight>=0&&w.snowfall>=0&&w.daylight+w.snowfall<=1.00001);
}
now+=3062;api.update(32);assert.equal(scene.userData.weatherTransition.active,true);
now+=1;api.update(33);assert.equal(scene.userData.weatherTransition.active,false);assert.equal(scene.userData.weatherTransition.daylight,1);
console.log('PASS: rapid retargets retain frame continuity and complete at exactly 3200 ms');
