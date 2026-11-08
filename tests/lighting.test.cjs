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


const terrain=scene.userData.templeTerrain;
for(let x=-5.5;x<=5.5;x+=.1)for(let z=-4;z<=4;z+=.1)assert.ok(terrain.heightAt(x,z)+terrain.snowOffset<1.3,'snow terrain stays below courtyard slab');
for(let j=0;j<11;j++)for(let x=-1.4;x<=1.4;x+=.1)for(let dz=-.18;dz<=.18;dz+=.02){const z=6.9-j*.31+dz;assert.ok(terrain.heightAt(x,z)+.04<.26+j*.13-.075,'terrain clears underside of every stair');}
for(let x=-5.5;x<=5.5;x+=.1)assert.ok(terrain.heightAt(x,5)+.04<.68,'terrain clears front ochre walls');
const lighting=scene.userData.cityLighting;assert.equal(lighting.landmarkLights.length,5);assert.equal(lighting.extraShadowMaps,0);assert.equal(lighting.pointLightBudget,9);
for(const {light} of lighting.landmarkLights){assert.ok(light.isPointLight);assert.equal(light.castShadow,false);assert.ok(light.distance<=22&&light.decay===2);}
assert.ok(lighting.physicalPalette.size>20);for(const m of lighting.physicalPalette.values()){assert.ok(m.isMeshStandardMaterial);if(['glazing','metal'].includes(m.userData.surfaceKind)){assert.ok(m.roughness>=.28&&m.roughness<=.43);}else assert.ok(m.roughness>=.78&&m.metalness<=.055);}
let quality='full';const hemi=new T.HemisphereLight();scene.add(hemi);
api.connect({rain:new T.Group(),wet:new T.Group(),key:new T.DirectionalLight(),fill:new T.DirectionalLight(),ground:new T.Mesh(new T.PlaneGeometry(),new T.MeshBasicMaterial()),renderer:{},getQuality:()=>quality});
const powers=lighting.landmarkLights.map(e=>e.light.intensity);handlers['itong:set-season']({detail:{season:'winter'}});lighting.landmarkLights.forEach((e,i)=>assert.equal(e.light.intensity,powers[i]*.83));assert.equal(hemi.intensity,1.35);
handlers['itong:set-season']({detail:{season:'summer'}});lighting.landmarkLights.forEach((e,i)=>assert.equal(e.light.intensity,powers[i]));assert.equal(hemi.intensity,1.45);
scene.userData.updateCityCutaway({position:new T.Vector3(16,10,-35)});for(const e of lighting.landmarkLights){const group=scene.getObjectByName(e.owner==='jiming'?'jiming-temple':e.owner==='campus'?'nanjing-university':e.owner==='gulou'?'nanjing-drum-tower':'fuzimiao-dacheng-hall');if(!group.visible)assert.equal(e.light.intensity,0,'hidden landmark has no ghost light');}
console.log(JSON.stringify({status:'PASS',terrainSamples:'courtyard, front walls and all eleven stair footprints',localLights:5,scenePointLightBudget:9,additionalShadowMaps:0,physicalMaterials:lighting.physicalPalette.size}));

for(const e of lighting.landmarkLights){
 if(e.existing)continue;
 assert.ok(scene.userData.urbanPaving.some(p=>Math.abs(e.x-p.x)+.20<p.w/2&&Math.abs(e.z-p.z)+.20<p.d/2),'pole base stands entirely on paving');
 for(const r of scene.userData.roadNetwork)assert.ok(Math.abs(e.x-r.x)>r.w/2+.2||Math.abs(e.z-r.z)>r.d/2+.2,'pole outside asphalt');
 for(const v of scene.userData.clearanceVolumes){if(v.owner==='water')continue;assert.ok(e.x+.2<v.min[0]||e.x-.2>v.max[0]||e.z+.2<v.min[2]||e.z-.2>v.max[2],'pole clears '+v.name);}
 assert.ok(e.power<=10,'street lamps avoid architectural hot spots');
}
const flakes=scene.getObjectByName('seasonal-snowflakes');assert.equal(flakes.geometry.attributes.position.count,3600);assert.ok(flakes.material.vertexShader.includes('1.25+phase*.75,4.2)*pixelRatio'));api.update(9);const t=flakes.material.uniforms.time.value;api.update(9);assert.equal(flakes.material.uniforms.time.value,t,'frozen clock freezes snow');
