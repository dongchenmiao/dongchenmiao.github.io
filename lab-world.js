/* Seasonal diorama extension. All new scenery is real geometry; no homepage changes. */
(() => {
 'use strict';
 window.buildSeasonalWorld=({THREE:T,scene,interior:s,roof,builder,merge})=>{
  const {box,cyl,sphere,tube}=s;
  const wood='#b99a73',dark='#304b55',paper='#dfdec8',mint='#7fa99b';
  // A lived-in reading corner, with individual cushions and a folded throw.
  box(1.85,.28,.72,-2.45,.79,.22,'#547575');box(1.85,.56,.17,-2.45,1.12,-.08,'#668986');
  for(const x of [-3.43,-1.47])box(.16,.48,.85,x,.99,.22,dark);
  for(const x of [-2.91,-1.99]){box(.82,.14,.57,x,.98,.28,'#84a39a');box(.36,.32,.12,x,1.2,.05,x<-2.5?'#c7a57e':'#c6cdb6',{rotationZ:.13});}
  box(.4,.035,.66,-2.4,1.07,.3,'#d8c5a4');for(let i=0;i<5;i++)box(.012,.005,.65,-2.57+i*.08,1.092,.3,'#8eaa9b',{outline:false});
  // Meeting table and two stools occupy the center, not the entrance corridor.
  cyl(.73,.73,.09,-.2,1.2,-2.45,wood);cyl(.09,.13,.63,-.2,.84,-2.45,dark);cyl(.4,.4,.05,-.2,.52,-2.45,dark);
  for(const z of [-3.55,-1.35]){cyl(.3,.3,.13,-.2,.86,z,'#7b9992');for(const x of [-.38,-.02])box(.045,.32,.045,x,.66,z,dark);}
  box(.33,.025,.25,-.42,1.265,-2.45,paper,{rotationY:.2});box(.25,.03,.3,.07,1.27,-2.65,'#6c938d',{rotationY:-.2});
  for(const x of [-.52,.17]){cyl(.055,.055,.1,x,1.31,-2.16,'#d8cdb0');cyl(.045,.045,.004,x,1.364,-2.16,'#554d42');}
  // Bookcase against the rear wall; books share a small material palette for merging.
  const bookColors=['#af8572','#759997','#b3ad87','#657f91'];
  for(const x of [-1.35,1.55])box(.08,1.13,.46,x,1.07,-4.98,dark);
  for(const y of [.54,1.05,1.59])box(2.98,.065,.5,.1,y,-4.98,wood);
  for(let row=0;row<2;row++)for(let j=0;j<15;j++){const h=.25+(j%4)*.045;box(.11,h,.29,-1.18+j*.18,.59+row*.51+h/2,-4.94,bookColors[j%4]);box(.065,.012,.006,-1.18+j*.18,.68+row*.51,-4.789,paper,{outline:false});}
  // Acoustic ceiling baffles follow the roof visibility, exposing the room from above.
  const rs=builder(roof);for(let j=0;j<7;j++)rs.box(.13,.12,3.7,-4.6+j*.52,3.74,-2.7,'#b3a083');
  // Desk detail: headphones, pencil cup, note stack, and cable routing.
  const ring=new T.Mesh(new T.TorusGeometry(.13,.018,6,18,Math.PI),s.mat(dark));ring.position.set(-2.08,1.43,-3.68);s.add(ring);
  for(const x of [-2.21,-1.95])box(.05,.12,.06,x,1.38,-3.68,dark);
  cyl(.065,.055,.14,-4.99,1.4,-3.48,mint);for(let j=0;j<4;j++)cyl(.009,.009,.22,-5.02+j*.02,1.51,-3.48,bookColors[j]);
  for(let j=0;j<3;j++)box(.26,.012,.21,-2.6,1.32+j*.018,-3.38,paper,{rotationY:j*.08});
  tube([[-4.4,1.35,-4.4],[-4.4,1.12,-4.45],[-3.8,.68,-4.45],[-2.2,.68,-4.3]],.012,dark);
  // A wall clock, coat rail and storage boxes make the studio feel occupied.
  const clock=new T.Mesh(new T.CylinderGeometry(.2,.2,.04,24),s.mat(paper));clock.rotation.x=Math.PI/2;clock.position.set(-2.18,3.03,-5.49);s.add(clock);
  tube([[-2.18,3.03,-5.46],[-2.18,3.17,-5.46]],.012,dark);tube([[-2.18,3.03,-5.45],[-2.08,2.98,-5.45]],.012,dark);
  box(.055,.07,1.13,-5.49,2.32,-1.28,wood);for(let j=0;j<3;j++){box(.1,.22,.05,-5.4,2.2,-1.65+j*.34,dark);box(.12,.56,.25,-5.34,1.9,-1.65+j*.34,bookColors[j]);}
  for(let j=0;j<3;j++){box(.38,.2,.32,2.95,3.06,-1.7+j*.34,'#b7ac8c');box(.19,.045,.006,2.95,3.06,-1.534+j*.34,paper,{outline:false});}
  // Rear/service facade of SLAB: framed clerestory glazing, vent and conduit.
  for(let j=0;j<5;j++){const x=-4.5+j*1.75;box(1.2,.82,.065,x,2.76,-5.77,'#284452');box(1.08,.68,.025,x,2.76,-5.82,'#567c88');box(.035,.72,.025,x,2.76,-5.843,'#a0b2ad');box(1.2,.055,.13,x,2.32,-5.81,'#778f92');}
  box(.75,1.18,.08,2.8,1.35,-5.8,'#607c85');for(let j=0;j<7;j++)box(.65,.025,.025,2.8,.92+j*.13,-5.86,'#284652');
  tube([[-5.1,.55,-5.84],[-5.1,3.4,-5.84],[2.9,3.4,-5.84]],.026,'#869d9c');
  const neighborhood=new T.Group();neighborhood.name='companion-buildings';scene.add(neighborhood);const n=builder(neighborhood),cityGroups=[];
  // The original slab and its single planar reflector now cover the whole neighborhood.
  // Neighbors sit only behind / left of the lab. The street and main portal remain clear.
  const buildings=[{x:-2,z:-48,w:16.4,d:7.4,h:13.8,color:'#62777c'}];
  const snowCaps=new T.Group();snowCaps.name='seasonal-snow-caps';scene.add(snowCaps);const sn=builder(snowCaps);
  for(const [bi,b] of buildings.entries()){
   const district=new T.Group(),districtSnow=new T.Group();district.name='residential-block-'+bi;neighborhood.add(district);snowCaps.add(districtSnow);cityGroups.push({owner:'neighbor-'+bi,group:district,snow:districtSnow});const n=builder(district),sn=builder(districtSnow);
   n.box(b.w,b.h,b.d,b.x,b.h/2-.38,b.z,b.color);n.box(b.w+.22,.2,b.d+.22,b.x,b.h-.25,b.z,'#384e5a');
   sn.box(b.w+.18,.12,b.d+.18,b.x,b.h-.09,b.z,'#e1eaf0',{outline:false});
   for(let floor=0;floor<Math.floor(b.h/1.65);floor++)for(let col=0;col<Math.floor(b.w/1.25);col++){
    const x=b.x-b.w/2+.68+col*1.25,y=.65+floor*1.6,z=b.z+b.d/2+.025;
    n.box(.69,.9,.045,x,y,z,'#293e4b');n.box(.55,.76,.014,x,y,z+.034,(floor+col)%3?'#7b9b9c':'#b6b69b',{emissive:(floor+col)%3?'#617f85':'#cfb380',emissiveIntensity:.18,outline:false});
    n.box(.035,.8,.02,x,y,z+.047,'#455e66',{outline:false});n.box(.8,.07,.23,x,y-.49,z+.04,'#8b9997');
   }
   for(let floor=0;floor<Math.floor(b.h/1.65);floor++){
    const yy=.65+floor*1.6;for(let j=0;j<Math.floor(b.d/1.7);j++)for(const side of [-1,1])n.plane(.7,.85,b.x+side*(b.w/2+.018),yy,b.z-b.d/2+.8+j*1.7,'#355261',{rotationY:Math.PI/2});
    for(let j=0;j<Math.floor(b.w/1.25);j++)n.plane(.69,.9,b.x-b.w/2+.68+j*1.25,yy,b.z-b.d/2-.018,'#365261');
   }
   for(let j=0;j<3;j++)n.box(.8,.32,.75,b.x-b.w/2+.8+j*1.2,b.h+.02,b.z,'#708386');
  }
  // Faceted Zifeng core, asymmetric silver blades, rounded spine and long spire.
  const zifeng=new T.Group();zifeng.name='zifeng-tower';zifeng.position.set(-8,0,-64);zifeng.scale.setScalar(1.12);neighborhood.add(zifeng);const zf=builder(zifeng);
  const zifengSnow=new T.Group();zifengSnow.position.copy(zifeng.position);zifengSnow.scale.copy(zifeng.scale);snowCaps.add(zifengSnow);const zs=builder(zifengSnow);
  zf.box(7.1,1.1,6.8,0,.65,0,'#6b8182');zf.box(6,1.15,5.8,0,1.7,0,'#8a9a96');zs.box(7.1,.09,6.8,0,1.25,0,'#e1e8e7');
  const towerPlan=new T.Shape();[[-1.6,-2.5],[1.6,-2.5],[2.4,-1.7],[2.4,1.7],[1.6,2.5],[-1.6,2.5],[-2.4,1.7],[-2.4,-1.7]].forEach(([x,z],i)=>i?towerPlan.lineTo(x,-z):towerPlan.moveTo(x,-z));towerPlan.closePath();
  const tg=new T.ExtrudeGeometry(towerPlan,{depth:22.7,bevelEnabled:false});tg.rotateX(-Math.PI/2);const core=new T.Mesh(tg,zf.mat('#4a7380'));core.position.y=.2;core.castShadow=true;core.receiveShadow=true;zf.add(core);
  zf.cyl(.56,.62,25.7,.38,13.05,2.12,'#6c919c',{radialSegments:18});
  const bladeOffsets=[];scene.userData.zifengBladeOffsets=bladeOffsets;
  const blade=(x,y,z,w,h,angle)=>{bladeOffsets.push({x,y,z,angle});const a=new T.Shape();a.moveTo(-w/2,0);a.lineTo(w/2,.7);a.lineTo(w/2,h);a.lineTo(-w/2,h-1.1);a.closePath();const m=new T.Mesh(new T.ExtrudeGeometry(a,{depth:.18,bevelEnabled:false}),zf.mat('#a4b6b4'));m.position.set(x,y,z);m.rotation.y=angle;m.castShadow=true;zf.add(m);};
  blade(-.45,5.8,2.57,3.9,7.2,0);blade(.15,12.5,2.57,3.5,6.9,0);blade(-.32,18.8,2.57,2.8,6.3,0);blade(.15,24.2,1.65,1.7,3,0);
  blade(2.47,7.1,-.2,3.4,9.1,Math.PI/2);blade(2.47,17.1,-.2,2.8,7.4,Math.PI/2);blade(-2.47,11.5,.05,3.1,10.8,-Math.PI/2);blade(0,15,-2.57,3.5,9.5,Math.PI);
  for(let j=0;j<43;j++){const y=1.2+j*.5;zf.box(3.1,.022,.022,0,y,2.52,'#91aaa9',{outline:false});zf.box(.022,.022,3.3,2.42,y,0,'#7e999d',{outline:false});zf.box(3.1,.022,.022,0,y,-2.52,'#8da7a6',{outline:false});}
  for(const x of [-1.45,-.95,-.45,.05,.55,1.05,1.45])zf.box(.022,21.7,.022,x,11.3,2.535,'#a8bab2',{outline:false});
  for(const z of [-1.5,-.9,-.3,.3,.9,1.5])zf.box(.022,21.7,.022,2.435,11.3,z,'#88a4a6',{outline:false});
  zf.cyl(.06,.20,3.8,.38,28.05,2.12,'#b6c6bf',{radialSegments:12});zf.cyl(.025,.06,1.1,.38,30.45,2.12,'#d0d8c9',{radialSegments:8});
  zf.label('紫峰 · ZIFENG',3.4,.34,0,1.58,2.94,{bg:'transparent',fg:'#e0e7d6',fontSize:96});
  // North Building, based on the university archive's front elevation:
  // a tall central stone tower, lower symmetrical wings, rectangular window bays,
  // steep grey tiled roofs and climbing ivy. The model now stands beside the
  // lab, rather than disappearing behind it. All coordinates below are local.
  const campus=new T.Group();campus.name='nanjing-university';campus.position.set(-11,0,-33);campus.scale.setScalar(2.0);neighborhood.add(campus);const u=builder(campus);
  const campusSnow=new T.Group();campusSnow.position.copy(campus.position);campusSnow.scale.copy(campus.scale);snowCaps.add(campusSnow);const us=builder(campusSnow);
  const stone='#91938a',trim='#b8b8a8',windowInk='#2e484d',tile='#455957';
  // Mesh-built curved hip roof: the eaves lift slightly, the upper slopes steepen.
  const roofHip=(x,y,z,w,d,h,color,build=n,snowBuild=null)=>{
   const positions=[],levels=[[0,1], [.20,.84], [.66,.48], [1,.12]];
   const corners=(yy,k)=>[[-w*k/2,yy,-d*k/2],[w*k/2,yy,-d*k/2],[w*k/2,yy,d*k/2],[-w*k/2,yy,d*k/2]];
   for(let j=0;j<3;j++){const a=corners(levels[j][0]*h,levels[j][1]),b=corners(levels[j+1][0]*h,levels[j+1][1]);for(let k=0;k<4;k++){const l=(k+1)%4;positions.push(...a[k],...b[k],...a[l],...a[l],...b[k],...b[l]);}}
   const top=corners(h,.12);positions.push(...top[0],...top[2],...top[1],...top[0],...top[3],...top[2]);
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.computeVertexNormals();
   const m=new T.Mesh(g,build.mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;build.add(m);
   build.box(w,.10,d,x,y-.035,z,color);
   build.box(w*.15,.09,.09,x,y+h+.025,z,'#697a70');
   if(['#3d5058','#3e525b','#3f5259','#40545b'].includes(color)){
    // Ribs follow each of the four existing hip faces, ending below the ridge.
    for(let face=0;face<4;face++){
     const span=face%2?d:w,count=Math.max(3,Math.floor(span/.3));
     for(let i=1;i<count;i++){
      const t=i/count,points=levels.map(([yy,k])=>{const a=corners(yy*h,k)[face],b=corners(yy*h,k)[(face+1)%4];return [x+a[0]*(1-t)+b[0]*t,y+a[1]+.014,z+a[2]*(1-t)+b[2]*t];});
      for(let j=0;j<points.length-1;j++){
       const a=new T.Vector3(...points[j]),b=new T.Vector3(...points[j+1]),delta=b.clone().sub(a);
       const rib=new T.Mesh(new T.CylinderGeometry(.009,.009,delta.length(),4,1,true),build.mat('#617176'));
       rib.position.copy(a).add(b).multiplyScalar(.5);rib.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());rib.receiveShadow=true;build.add(rib);
      }
     }
    }
   }
   if(snowBuild){const snowRoof=new T.Mesh(g.clone(),snowBuild.mat('#e1e8e8'));snowRoof.position.set(x,y+.055,z);snowBuild.add(snowRoof);}
   return m;
  };
  // Long hipped-gable wing roofs, not pyramids: a near-full-length ridge with
  // curved eaves. Proportions and rectilinear openings follow the official elevation.
  const wingRoof=(x,w)=>{
   const levels=[[0,1,1],[.18,.98,.82],[.65,.95,.38],[1,.91,.025]],v=[];
   const corners=(h,kx,kz)=>[[-w*kx/2,h,-2.25*kz],[w*kx/2,h,-2.25*kz],[w*kx/2,h,2.25*kz],[-w*kx/2,h,2.25*kz]];
   for(let j=0;j<3;j++){const a=corners(levels[j][0]*1.3,levels[j][1],levels[j][2]),b=corners(levels[j+1][0]*1.3,levels[j+1][1],levels[j+1][2]);for(let k=0;k<4;k++){let q=(k+1)%4;v.push(...a[k],...b[k],...a[q],...a[q],...b[k],...b[q]);}}
   const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.computeVertexNormals();const m=new T.Mesh(geo,u.mat(tile));m.position.set(x,2.7,0);m.castShadow=true;m.receiveShadow=true;u.add(m);
   const winterRoof=new T.Mesh(geo.clone(),us.mat('#e1e8e8'));winterRoof.position.set(x,2.755,0);us.add(winterRoof);
   u.box(w*.92,.09,.13,x,4.02,0,'#7c8980');u.box(w,.10,4.52,x,2.68,0,tile);
   for(let j=0;j<Math.round(w/.26);j++){const xx=x-w/2+.14+j*.26;u.tube([[xx,2.73,2.25],[xx,2.95,1.8],[xx,3.55,.88],[xx,4.0,.08]],.012,'#748078');}
  };
  u.box(12.6,.18,5.2,0,.09,0,'#a4aaa0');
  for(const x of [-3.75,3.75]){u.box(4.95,2.35,3.85,x,1.4,0,stone);u.box(4.98,.18,3.92,x,.3,0,'#677b76');u.box(5,.12,3.95,x,1.4,0,trim);u.box(5.05,.14,4,x,2.61,0,trim);wingRoof(x,5.35);}
  for(const x of [-5.75,-4.78,-3.81,-2.84,-1.87,1.87,2.84,3.81,4.78,5.75])for(const y of [.88,2.0]){u.box(.55,.81,.035,x,y,-1.947,'#304752');u.box(.035,.80,.025,x,y,-1.973,'#a3aaa2');u.box(.54,.035,.025,x,y,-1.973,'#a3aaa2');}
  // Tall slender tower: one narrow opening per intermediate floor, three at top.
  u.box(2.3,5.92,4.15,0,3.16,.10,stone);u.box(2.45,.22,4.3,0,.31,.10,'#6c7f76');
  for(const x of [-1.06,1.06])u.box(.16,5.72,.15,x,3.2,2.24,'#a4a99a');
  const rectangularWindow=(x,y,z,w,h)=>{
   u.box(w,h,.045,x,y,z,windowInk);
   for(const xx of [x-w/2-.025,x+w/2+.025])u.box(.045,h+.09,.06,xx,y,z+.025,trim);
   for(const yy of [y-h/2-.025,y+h/2+.025])u.box(w+.14,.05,.08,x,yy,z+.035,trim);
   u.box(.035,h,.025,x,y,z+.065,'#879e91',{outline:false});u.box(w,.035,.025,x,y,z+.065,'#879e91',{outline:false});
  };
  for(const x of [-5.75,-4.78,-3.81,-2.84,-1.87,1.87,2.84,3.81,4.78,5.75])for(const y of [.88,2.0])rectangularWindow(x,y,1.95,.52,.78);
  for(const y of [3.55,4.65])rectangularWindow(0,y,2.205,.46,.65);
  for(const x of [-.65,0,.65])rectangularWindow(x,5.65,2.205,.43,.69);
  // Two projecting white stone balconies, including fine open balusters.
  const balcony=(y,w)=>{u.box(w,.11,.6,0,y,2.4,trim);u.box(w,.075,.075,0,y+.4,2.68,trim);for(let j=0;j<9;j++)u.box(.04,.34,.04,-w/2+.08+j*(w-.16)/8,y+.22,2.68,trim);for(const x of [-w/2+.04,w/2-.04])u.box(.07,.4,.55,x,y+.23,2.42,trim);};
  balcony(5.17,1.94);balcony(1.58,1.8);
  for(const x of [-.53,0,.53])rectangularWindow(x,2.05,2.205,.4,.72);
  u.box(1.13,1.15,.12,0,.88,2.22,'#625c49');u.box(.035,1.15,.025,0,.88,2.29,'#b6b09b');
  for(const x of [-.65,.65])u.box(.13,1.3,.22,x,.95,2.27,trim);
  u.box(1.5,.15,.35,0,1.62,2.3,trim);
  for(let j=0;j<4;j++)u.box(2.0-j*.13,.08,1.35-j*.22,0,.08+j*.08,2.6,trim);
  // Tower's hipped lower eaves and raised triangular front gable.
  roofHip(0,6.15,.1,3.05,4.8,.52,tile,u,us);
  const pediment=new T.Shape();pediment.moveTo(-.95,0);pediment.lineTo(.95,0);pediment.lineTo(0,.78);pediment.closePath();const face=new T.Mesh(new T.ShapeGeometry(pediment),u.mat('#b2ac8f'));face.position.set(0,6.35,2.08);u.add(face);
  u.tube([[-1.02,6.34,2.12],[0,7.16,2.12],[1.02,6.34,2.12]],.075,tile);
  u.tube([[-1.02,6.36,-1.91],[0,7.16,-1.91],[1.02,6.36,-1.91]],.075,tile);
  u.box(.11,.11,4.1,0,7.16,.10,tile);
  const gableVertices=[-1.02,6.34,-1.91,0,7.16,-1.91,-1.02,6.34,2.12,-1.02,6.34,2.12,0,7.16,-1.91,0,7.16,2.12,0,7.16,-1.91,1.02,6.34,-1.91,0,7.16,2.12,0,7.16,2.12,1.02,6.34,-1.91,1.02,6.34,2.12];
  for(let j=0;j<gableVertices.length;j+=9)for(let k=0;k<3;k++){const v=gableVertices[j+3+k];gableVertices[j+3+k]=gableVertices[j+6+k];gableVertices[j+6+k]=v;}
  const gableGeometry=new T.BufferGeometry();gableGeometry.setAttribute('position',new T.Float32BufferAttribute(gableVertices,3));gableGeometry.computeVertexNormals();scene.userData.gableMinimumUpNormal=Math.min(...gableGeometry.getAttribute('normal').array.filter((_,i)=>i%3===1));const gableRoof=new T.Mesh(gableGeometry,u.mat(tile));gableRoof.castShadow=true;u.add(gableRoof);const gableSnow=new T.Mesh(gableGeometry.clone(),us.mat('#e1e8e8'));gableSnow.position.y=.05;us.add(gableSnow);
  // A tiny red roof star is visible in the official current building photograph.
  const star=new T.Shape();for(let j=0;j<10;j++){let a=Math.PI/2+j*Math.PI/5,r=j%2?.11:.25;const x=Math.cos(a)*r,y=Math.sin(a)*r;j?star.lineTo(x,y):star.moveTo(x,y);}star.closePath();const emblem=new T.Mesh(new T.ShapeGeometry(star),u.mat('#b55d4a'));emblem.position.set(0,6.64,2.16);u.add(emblem);
  // Slate courses, stone wall lines and ivy remain restrained at miniature scale.
  for(let j=0;j<10;j++)for(const x of [-3.75,3.75])u.box(4.94,.014,.012,x,.4+j*.22,1.94,'#7a8279',{outline:false});
  for(const x of [-6.24,6.24])for(const z of [-1.25,0,1.25])for(const y of [.88,2.0]){u.box(.035,.72,.5,x,y,z,windowInk);u.box(.07,.06,.66,x,y-.39,z,trim);}
  for(let j=0;j<42;j++){const side=j%2?-1:1,x=side*(.88+(j%3)*.20),y=.55+(j%14)*.4;u.sphere(.11+(j%3)*.02,x,y,2.25,j%3?'#56735d':'#71836b');}

  // A small forecourt with a framed lawn, path, lamp posts and benches.
  u.box(8.8,.12,2.7,0,.11,4.55,'#607c69');const campusGardenPath=u.box(1.9,.025,3.0,0,.19,4.6,'#929f9b');
  for(const x of [-3.5,3.5]){u.box(1.55,.12,.42,x,.52,4.8,'#a98f6d');u.box(1.55,.38,.08,x,.73,4.62,'#a98f6d');for(const dx of [-.58,.58])u.box(.07,.37,.3,x+dx,.31,4.8,'#475f58');}
  for(const x of [-2.2,2.2]){u.cyl(.035,.07,1.8,x,1.03,3.4,'#485e59');u.box(.22,.3,.22,x,2.05,3.4,'#d8d3ab',{emissive:'#dbcf9e',emissiveIntensity:.65});}
  us.box(8.8,.10,2.7,0,.24,4.55,'#e1e8e8');us.box(1.85,.06,2.7,0,.28,4.55,'#d5e0e2');
  // Photo-checked Gulou gate: four rectangular piers and three openings.
  // The lower side portals and broad flat central lintel are not a paifang.
  const entry=new T.Group();entry.position.set(0,0,8.8);entry.rotation.y=0;entry.scale.setScalar(1.02);campus.add(entry);const g=builder(entry),gateStone='#c6cabd';
  for(const x of [-3.2,-1.55,1.55,3.2]){const inner=Math.abs(x)<2;g.box(inner?.48:.42,inner?2.35:1.78,.66,x,inner?1.27:.98,0,gateStone);g.box(inner?.63:.57,.23,.83,x,.19,0,'#9da99e');}
  g.box(3.65,.45,.72,0,2.38,0,gateStone);g.box(4.1,.13,.95,0,2.67,0,'#d4d7c9');g.box(1.0,.18,.56,0,2.82,0,gateStone);
  for(const x of [-2.38,2.38]){g.box(1.85,.27,.64,x,1.84,0,gateStone);g.box(2,.1,.78,x,2.03,0,'#d1d6c7');}
  g.label('南京大学',2.65,.37,0,2.39,.375,{bg:'transparent',fg:'#9b8048',fontSize:200});
  for(const [x,words] of [[-1.55,'严肃活泼'],[1.55,'团结紧张']])for(let j=0;j<4;j++)g.label(words[j],.27,.29,x,1.72-j*.34,.415,{bg:'transparent',fg:'#a26051',fontSize:190});
  g.cyl(.018,.025,1.15,0,3.48,0,'#aeb9ad');g.box(.42,.25,.018,.21,3.85,0,'#b25c4d');
  for(const x of [-1.04,1.04,-2.45,2.45])g.sphere(.14,x,.24,.7,'#9ca89c');
  const entrySnow=new T.Group();entrySnow.position.copy(entry.position);entrySnow.rotation.copy(entry.rotation);entrySnow.scale.copy(entry.scale);campusSnow.add(entrySnow);const gs=builder(entrySnow);gs.box(4.1,.065,.95,0,2.77,0,'#e5ebeb');for(const x of [-2.38,2.38])gs.box(2,.065,.78,x,2.12,0,'#e5ebeb');

  // A small Ming city-wall gate makes the low eastern edge recognizably Nanjing.
  const wallGroup=new T.Group();wallGroup.position.set(-55.5,0,-22);wallGroup.scale.setScalar(1.2);neighborhood.add(wallGroup);const wall=builder(wallGroup);const wallSnow=new T.Group();wallSnow.position.copy(wallGroup.position);wallSnow.scale.copy(wallGroup.scale);snowCaps.add(wallSnow);const ws=builder(wallSnow);
  for(const x of [5.8,8.8])wall.box(1.65,2.25,2.7,x,1.1,-11.3,'#737d79');
  wall.box(4.65,.72,2.7,7.3,2.52,-11.3,'#737d79');
  const gateArch=new T.Mesh(new T.TorusGeometry(.68,.15,6,18,Math.PI),wall.mat('#9a9e8d'));gateArch.position.set(7.3,1.37,-9.91);wall.add(gateArch);
  for(let j=0;j<8;j++)wall.box(.36,.37,.42,5.15+j*.61,3.05,-10.14,'#8a9388');
  for(let j=0;j<6;j++)wall.box(4.6,.025,.025,7.3,.3+j*.39,-9.93,'#536661',{outline:false});
  wall.box(2.4,1.12,1.8,7.3,3.45,-11.3,'#8f806c');roofHip(7.3,4.35,-11.3,2.95,2.25,1.05,'#435b5c',wall,ws);
  wall.label('金陵 · NANJING',2.6,.3,7.3,2.51,-9.92,{bg:'#596c68',fg:'#dedac1',fontSize:80});
  // Snow ledges on landmark roofs remain a single merged seasonal group.

  // Nanjing Drum Tower, modeled from the inspected official present-day photograph:
  // broad red three-arch platform, compact double-eaved hall, two stair shelters.
  const gulou=new T.Group();gulou.name='nanjing-drum-tower';gulou.position.set(-19.8,0,-2);gulou.rotation.y=0;gulou.scale.set(1.30,1.45,1.45);neighborhood.add(gulou);const gu=builder(gulou);
  const gulouSnow=new T.Group();gulouSnow.position.copy(gulou.position);gulouSnow.rotation.copy(gulou.rotation);gulouSnow.scale.copy(gulou.scale);snowCaps.add(gulouSnow);const gus=builder(gulouSnow);
  gu.box(12.6,.26,8.7,0,.13,0,'#869294');gu.box(12,.35,8.2,0,.43,0,'#6f7d81');
  gu.box(.38,3.1,8,-5.81,1.9,0,'#a9534d');gu.box(.38,3.1,8,5.81,1.9,0,'#a9534d');gu.box(12,3.1,.38,0,1.9,-3.81,'#a9534d');
  const facade=new T.Shape();facade.moveTo(-6,.55);facade.lineTo(6,.55);facade.lineTo(6,3.55);facade.lineTo(-6,3.55);facade.closePath();
  for(const xx of [-3.2,0,3.2]){const rad=xx===0?.90:.67,springY=xx===0?1.72:1.48,path=new T.Path();path.moveTo(xx-rad,.55);path.lineTo(xx+rad,.55);path.lineTo(xx+rad,springY);path.absarc(xx,springY,rad,0,Math.PI,false);path.lineTo(xx-rad,.55);facade.holes.push(path);
   const doorShape=new T.Shape();doorShape.moveTo(xx-rad,.55);doorShape.lineTo(xx+rad,.55);doorShape.lineTo(xx+rad,springY);doorShape.absarc(xx,springY,rad,0,Math.PI,false);doorShape.closePath();const door=new T.Mesh(new T.ShapeGeometry(doorShape),gu.mat('#614849'));door.position.z=3.86;gu.add(door);
   for(let j=-1;j<=1;j++)gu.box(.045,springY-.58,.04,xx+j*rad*.55,(springY+.55)/2,3.90,'#a56a5a');gu.box(rad*1.8,.05,.04,xx,1.1,3.90,'#a56a5a');
   const trim=new T.Mesh(new T.TorusGeometry(rad+.06,.07,6,16,Math.PI),gu.mat('#924d48'));trim.position.set(xx,springY,4.23);gu.add(trim);
  }
  const front=new T.Mesh(new T.ExtrudeGeometry(facade,{depth:.32,bevelEnabled:false}),gu.mat('#b35c55'));front.position.z=3.84;front.castShadow=true;gu.add(front);
  gu.box(12.3,.18,8.4,0,3.57,0,'#b7babc');gus.box(12.3,.075,8.4,0,3.7,0,'#e1e9eb');
  for(const z of [-4.02,4.02]){gu.box(12.15,.4,.16,0,3.85,z,'#af5951');gu.box(12.22,.08,.24,0,4.09,z,'#c5c8c7');gus.box(12.22,.065,.24,0,4.17,z,'#e4ecee');}
  for(const x of [-6,6]){gu.box(.16,.4,8,x,3.85,0,'#af5951');gu.box(.24,.08,8.1,x,4.09,0,'#c5c8c7');}
  const drumRoof=(y,w,d,h)=>{const v=[],levels=[[0,1,1],[.2,.94,.82],[.7,.83,.30],[1,.73,.02]];const ring=j=>{const [a,b,c]=levels[j];return[[-w*b/2,a*h,-d*c/2],[w*b/2,a*h,-d*c/2],[w*b/2,a*h,d*c/2],[-w*b/2,a*h,d*c/2]];};for(let j=0;j<3;j++){const a=ring(j),b=ring(j+1);for(let k=0;k<4;k++){const l=(k+1)%4;v.push(...a[k],...b[k],...a[l],...a[l],...b[k],...b[l]);}}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.computeVertexNormals();const mesh=new T.Mesh(geo,gu.mat('#3f5059'));mesh.position.y=y;mesh.castShadow=true;gu.add(mesh);const cap=new T.Mesh(geo.clone(),gus.mat('#e3ebed'));cap.position.y=y+.055;gus.add(cap);gu.box(w,.10,d,0,y-.03,0,'#5c5145');gu.box(w*.74,.1,.13,0,y+h,0,'#68767a');
   for(let xx=-w*.34;xx<=w*.34;xx+=.28)for(const side of [-1,1])gu.tube([[xx,y+.025,side*d*.5],[xx,y+h*.2+.025,side*d*.41],[xx,y+h*.7+.025,side*d*.15],[xx,y+h+.025,side*d*.01]],.018,'#65767b');
   for(const x of [-w/2,w/2])for(const z of [-d/2,d/2])gu.tube([[x*.85,y+.12,z*.8],[x,y+.04,z],[x*1.06,y+.30,z*1.05]],.055,'#53656b');};
  gu.box(5.7,1.65,4.1,0,4.55,0,'#854a44');drumRoof(5.38,7,5.3,.62);gu.box(5.35,1.2,3.8,0,6.35,0,'#98594e');drumRoof(6.98,6.8,5.15,1.55);
  for(const y of [4.65,6.4])for(let j=0;j<7;j++){const x=-2.3+j*.76;gu.box(.59,.67,.025,x,y,2.075-(y>6?.16:0),'#354b51');gu.box(.035,.66,.025,x,y,2.10-(y>6?.16:0),'#b39a78');}
  for(const x of [-2.7,-1.35,0,1.35,2.7])gu.box(.11,1.8,.11,x,4.5,2.18,'#a35d50');
  for(const x of [-4.35,4.35]){for(const xx of [x-.6,x+.6])gu.box(.10,.8,.10,xx,4.05,1.1,'#955347');roofHip(x,4.48,1.1,1.9,1.9,.48,'#41535b',gu,gus);}
  // Rear stone footing, construction courses, rainwater spouts, side access stair.
  for(let j=0;j<5;j++)gu.box(11.6,.018,.025,0,.75+j*.48,-4.012,'#a1534e',{outline:false});
  for(const x of [-4.5,-1.5,1.5,4.5]){gu.box(.12,.20,.20,x,3.38,-4.12,'#b7b4aa');gu.box(.055,2.5,.055,x,1.85,-4.025,'#934b47',{outline:false});}
  for(let j=0;j<13;j++)gu.box(1.35,.255,3.7-j*.26,-5.12,.35+j*.255,-1.8-j*.13,'#929b98');
  for(const y of [4.65,6.4])for(let j=0;j<7;j++){const x=-2.3+j*.76;gu.box(.59,.67,.025,x,y,-2.075+(y>6?.16:0),'#354b51');gu.box(.035,.66,.025,x,y,-2.10+(y>6?.16:0),'#b39a78');}
  gu.label('鼓 楼',1.1,.28,0,3.12,4.18,{bg:'transparent',fg:'#d0b57a',fontSize:150});

  // Jiming Temple: artistic lightweight composition from the inspected official
  // winter photograph, preserving ochre walls, terraced hill and slender pagoda.
  const jiming=new T.Group();jiming.name='jiming-temple';jiming.position.set(16,0,-23.5);jiming.scale.setScalar(1.4);neighborhood.add(jiming);const jb=builder(jiming);
  const jimingSnow=new T.Group();jimingSnow.position.copy(jiming.position);jimingSnow.scale.copy(jiming.scale);snowCaps.add(jimingSnow);const jbs=builder(jimingSnow);
  // Carved terrain stays below the terrace and each entrance tread, including snow.
  // The former ellipsoid rose through both; a bounded height field preserves its footprint.
  const templeHeight=(x,z)=>{
   let h=Math.min(1.24,Math.max(.08,1.65*Math.sqrt(Math.max(0,1-x*x/64-z*z/49))-.15));
   if(z>4)h=Math.min(h,.08+(7-z)*.24);
   if(Math.abs(x)<1.65&&z>3.5)h=Math.min(h,.09+Math.max(0,(6.72-z)/.31)*.13);
   return h;
  };
  const terrain=new T.PlaneGeometry(16,14,64,56);terrain.rotateX(-Math.PI/2);
  const terrainPos=terrain.getAttribute('position');for(let i=0;i<terrainPos.count;i++)terrainPos.setY(i,templeHeight(terrainPos.getX(i),terrainPos.getZ(i)));terrain.computeVertexNormals();
  const hill=new T.Mesh(terrain,new T.MeshStandardMaterial({color:'#6c7c66',roughness:.98}));hill.name='jiming-carved-hill';hill.receiveShadow=true;jb.add(hill);
  const hillSnow=new T.Mesh(terrain.clone(),new T.MeshStandardMaterial({color:'#dce7e9',roughness:.98}));hillSnow.position.y=.04;jbs.add(hillSnow);
  scene.userData.templeTerrain={heightAt:templeHeight,snowOffset:.04,terraceBottom:1.30,stairWidth:2.8};
  jb.box(11,1.4,8,0,.9,0,'#8d9993');jbs.box(11,.07,8,0,1.65,0,'#e5ecec');
  jb.box(8.2,1.5,2.9,0,2.35,2.0,'#c29b43');roofHip(0,3.13,2,9.2,3.8,.9,'#3d5058',jb,jbs);
  for(let k=0;k<7;k++){const x=-3+k; jb.box(.60,1.06,.035,x,2.25,3.48,'#564737');jb.box(.035,1.1,.04,x,2.25,3.51,'#b5a06c');}
  for(const x of [-5.4,5.4]){jb.box(.25,1.3,8,x,1.94,0,'#c5a149');jb.box(.43,.12,8.2,x,2.65,0,'#42565c');jbs.box(.43,.07,8.2,x,2.75,0,'#e5edee');}
  for(const x of [-3.6,3.6]){jb.box(3.7,1.0,.27,x,1.18,5.0,'#c29c43');jb.box(3.95,.12,.45,x,1.74,5.0,'#3f535b');jbs.box(3.95,.07,.45,x,1.84,5,'#e4ecee');}
  for(let j=0;j<11;j++){jb.box(2.8,.15,.36,0,.26+j*.13,6.9-j*.31,'#a5afaa');jbs.box(2.8,.035,.36,0,.3525+j*.13,6.9-j*.31,'#e5ecec');}
  for(const x of [-1.38,1.38])jb.box(.17,1.8,.17,x,1.47,4.5,'#a97b38');roofHip(0,2.42,4.5,3.4,1.6,.55,'#3e525b',jb,jbs);jb.label('鸡鸣寺',1.3,.32,0,2.14,4.61,{bg:'#3c4948',fg:'#d8bf81',fontSize:160});
  // Seven shallow eave rings and open red timber galleries, not generic cones.
  for(let floor=0;floor<7;floor++){
   const y=2.0+floor*1.06,r=1.13-floor*.075; jb.cyl(r,r+.04,.75,-1.4,y+.38,-1.6,'#956449',{radialSegments:8});
   for(let j=0;j<8;j++){const a=j*Math.PI/4; jb.box(.20,.42,.04,-1.4+Math.sin(a)*(r+.02),y+.40,-1.6+Math.cos(a)*(r+.02),'#344954',{rotationY:a,outline:false});}
   jb.cyl(r*.48,r+.38,.31,-1.4,y+.92,-1.6,'#3e535d',{radialSegments:8});jbs.cyl(r*.48,r+.38,.07,-1.4,y+1.10,-1.6,'#e2ebee',{radialSegments:8});
   for(let j=0;j<8;j++){const a=j*Math.PI/4; jb.tube([[-1.4+Math.sin(a)*(r+.12),y+.84,-1.6+Math.cos(a)*(r+.12)],[-1.4+Math.sin(a)*(r+.43),y+.90,-1.6+Math.cos(a)*(r+.43)],[-1.4+Math.sin(a)*(r+.47),y+1.10,-1.6+Math.cos(a)*(r+.47)]],.025,'#4c6169');}
  }
  jb.cyl(.025,.10,1.15,-1.4,10.05,-1.6,'#8b967f',{radialSegments:8});jb.sphere(.13,-1.4,10.65,-1.6,'#acaa84');
  jb.box(2.4,1.35,2.6,3.4,2.27,-1.5,'#c69f49');roofHip(3.4,2.98,-1.5,3.2,3.1,.62,'#3f5259',jb,jbs);jb.box(1.9,.8,2.1,3.4,3.78,-1.5,'#bfa054');roofHip(3.4,4.21,-1.5,2.8,2.8,.7,'#40545b',jb,jbs);

  // Shopfront canopy and warm bookshelves, plus a quiet pedestrian lane.
  n.box(3.5,.15,1.0,-1,1.86,-44.55,'#426963');n.box(3.2,1.35,.06,-1,.7,-44.98,'#243d49');
  for(let j=0;j<7;j++)n.box(.29,.67,.018,-2.3+j*.43,.7,-44.933,bookColors[j%4],{emissive:'#bb9e65',emissiveIntensity:.13,outline:false});
  n.label('BOOKS',2.7,.3,-1,1.61,-44.81,{bg:'#33585a',fg:'#d9dbc3',fontSize:95});

  // A second and third city layer extend beyond the small foreground tableau.
  // Quiet silhouettes and sparse windows keep the original lit SLAB dominant.
  const skyline=[
   [-75,-72,18,15.6,22.8],[-39,-82,20.4,16.8,28.8],[-2,-87,21.6,18,32.4],
   [42,-80,20.4,16.8,24],[69,-44,19.2,18,27.6],[78,3,16.8,19.2,20.4],[-86,38,18,16.8,21.6]
  ];
  for(let k=0;k<skyline.length;k++){
   const district=new T.Group(),districtSnow=new T.Group();district.name='skyline-block-'+k;neighborhood.add(district);snowCaps.add(districtSnow);cityGroups.push({owner:'skyline-'+k,group:district,snow:districtSnow});const n=builder(district),sn=builder(districtSnow);
   const [x,z,w,d,h]=skyline[k];n.box(w,h,d,x,h/2,z,k%2?'#51676e':'#5e7275');
   n.box(w+.15,.18,d+.15,x,h+.02,z,'#354d57');sn.box(w+.15,.10,d+.15,x,h+.17,z,'#dbe5e8',{outline:false});
   // Large facade bays, rather than dense tiny detail that would compete with campus.
   for(let floor=0;floor<Math.floor(h/1.65);floor++)for(let col=0;col<Math.floor(w/1.6);col++){
    const xx=x-w/2+.85+col*1.6,yy=.85+floor*1.65;
    n.box(.78,.9,.025,xx,yy,z+d/2+.018,'#304b59',{outline:false});
    if((floor+col+k)%4===0)n.box(.65,.76,.012,xx,yy,z+d/2+.038,'#9b9d86',{emissive:'#b2a375',emissiveIntensity:.12,outline:false});
   }
   for(let floor=0;floor<Math.floor(h/1.65);floor++){
    const yy=.85+floor*1.65;for(let col=0;col<Math.floor(w/1.6);col++)n.plane(.78,.9,x-w/2+.85+col*1.6,yy,z-d/2-.018,'#365160');
    for(let col=0;col<Math.floor(d/1.8);col++)for(const side of [-1,1])n.plane(.78,.9,x+side*(w/2+.018),yy,z-d/2+.85+col*1.8,'#365160',{rotationY:Math.PI/2});
   }
   n.box(w*.65,.55,d*.62,x,h+.35,z,'#6c7d7c');
  }
  // Broad quiet boulevards connect the foreground to the city, with a planted
  // median rather than a sharp display-plinth edge behind the laboratory.


  // Qinhuai riverside: original low-poly geometry informed by photographs,
  // arranged artistically to the left of SLAB in the default camera rather than pretending to be a city map.
  // View-dependent blue-grey water: analytic micro-normal, Fresnel sky reflection,
  // broken specular streaks and two current scales. No extra reflection render pass.
  const riverUniforms={time:{value:0},waterColor:{value:new T.Color('#29485c')},skyColor:{value:new T.Color('#a5b9c4')}};
  const riverMaterial=new T.ShaderMaterial({uniforms:riverUniforms,vertexShader:`
   uniform float time;varying vec2 p;varying vec3 world;
   void main(){p=position.xy;vec3 v=position;
   v.z+=.025*sin(p.y*2.1+time*1.1+p.x*.7)+.012*sin(p.x*4.8-p.y*3.5-time*1.7);
   vec4 w=modelMatrix*vec4(v,1.);world=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
   fragmentShader:`uniform float time;uniform vec3 waterColor;uniform vec3 skyColor;varying vec2 p;varying vec3 world;
   void main(){float a=p.y*2.1+time*1.1+p.x*.7;float b=p.x*4.8-p.y*3.5-time*1.7;
   vec3 N=normalize(vec3(-.0175*cos(a)-.0576*cos(b),1.,.0525*cos(a)-.042*cos(b)));
   vec3 V=normalize(cameraPosition-world);float fresnel=.06+.72*pow(1.-max(dot(N,V),0.),3.);
   float broad=sin(p.y*.7+p.x*.37+time*.32);float fine=sin(p.y*5.3+sin(p.x*1.4)*.8-time*.9);
   float glint=pow(max(dot(reflect(normalize(vec3(-.4,-1.,.5)),N),V),0.),48.);
   float edge=1.-smoothstep(3.88,4.2,abs(p.x));
   vec3 c=mix(waterColor,skyColor,fresnel)+vec3(.006,.008,.01)*fine+vec3(.018,.023,.028)*broad+vec3(.16,.20,.23)*glint;
   c*=mix(.72,1.,edge);gl_FragColor=vec4(c,1.);
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
  }`,side:T.DoubleSide});
  const river=new T.Mesh(new T.PlaneGeometry(8.4,48.2,16,80),riverMaterial);river.name='qinhuai-river';river.rotation.x=-Math.PI/2;river.position.set(-34,.17,15.9);scene.add(river);
  // Continuous embankments extend through the city, not a display-tank rectangle.
  for(const x of [-38.55,-29.45]){
   n.box(.55,.48,48.2,x,.15,15.9,'#848a8b');n.box(.75,.1,48.2,x,.44,15.9,'#b0b4b3');sn.box(.75,.07,48.2,x,.53,15.9,'#e4ebea',{outline:false});
   for(const y of [.22,.38])n.box(.565,.012,48.2,x,y,15.9,'#55616a',{outline:false});
   const inner=x<-34?x+.285:x-.285;for(let j=0;j<48;j++)n.box(.012,.28,.018,inner,.29,39.5-j,'#59636b',{outline:false});
   for(let j=0;j<24;j++){const z=39-j*2;if(Math.abs(z-18.7)>1.15){n.box(.09,.48,.09,x,.73,z,'#aab4b7');n.box(.08,.065,1.9,x,.98,z,'#b8c1c3');}}
  }
  // Open arched footbridge, modeled as shallow stepped deck sections and rails.
  const bridgeZ=18.7,bridgeX=-34,bridgeWidth=9.3;
  const bridgeHeight=x=>.59+.42*Math.cos((x-bridgeX)/bridgeWidth*Math.PI);
  for(let j=0;j<15;j++){const x=bridgeX-bridgeWidth/2+(j+.5)*bridgeWidth/15,angle=Math.atan(-.42*Math.PI/bridgeWidth*Math.sin((x-bridgeX)/bridgeWidth*Math.PI));n.box(bridgeWidth/15+.015,.14,1.65,x,bridgeHeight(x),bridgeZ,'#a1aca0',{rotationZ:angle});sn.box(bridgeWidth/15+.015,.065,1.65,x,bridgeHeight(x)+.10,bridgeZ,'#e7ece9',{rotationZ:angle,outline:false});}
  for(const z of [bridgeZ-.8,bridgeZ+.8]){const pts=[];for(let j=0;j<13;j++){const x=bridgeX-bridgeWidth/2+j*bridgeWidth/12,y=bridgeHeight(x);pts.push([x,y+.6,z]);n.box(.055,.55,.055,x,y+.33,z,'#adb9a8');}n.tube(pts,.035,'#bcc6b4');}
  // Boats turn before the bridge, half a lap apart, with explicit path envelopes.
  const boats=[],boatScale=.82,pathRadius=.9,pathBack=-5,pathFront=13.5,pathStraight=18.5,pathLength=37+2*Math.PI*.9;
  const boatPose=distance=>{let d=((distance%pathLength)+pathLength)%pathLength;if(d<pathStraight)return{x:-33.1,z:pathBack+d,yaw:0};d-=pathStraight;if(d<Math.PI*pathRadius){const a=d/pathRadius;return{x:-34+pathRadius*Math.cos(a),z:pathFront+pathRadius*Math.sin(a),yaw:Math.atan2(-Math.sin(a),Math.cos(a))};}d-=Math.PI*pathRadius;if(d<pathStraight)return{x:-34.9,z:pathFront-d,yaw:Math.PI};d-=pathStraight;const a=Math.PI+d/pathRadius;return{x:-34+pathRadius*Math.cos(a),z:pathBack+pathRadius*Math.sin(a),yaw:Math.atan2(-Math.sin(a),Math.cos(a))};};
  for(let i=0;i<2;i++){const boat=new T.Group();boat.name='qinhuai-boat-'+i;scene.add(boat);const bb=builder(boat);
   const sh=new T.Shape();sh.moveTo(0,-1.85);sh.quadraticCurveTo(-.7,-1.5,-.67,-.95);sh.lineTo(-.67,1.15);sh.quadraticCurveTo(-.62,1.65,0,1.85);sh.quadraticCurveTo(.62,1.65,.67,1.15);sh.lineTo(.67,-.95);sh.quadraticCurveTo(.7,-1.5,0,-1.85);sh.closePath();const hg=new T.ExtrudeGeometry(sh,{depth:.28,bevelEnabled:true,bevelSize:.035,bevelThickness:.025,bevelSegments:1});hg.rotateX(Math.PI/2);const hull=new T.Mesh(hg,bb.mat('#80563f'));hull.position.y=.44;hull.castShadow=true;bb.add(hull);
   bb.box(1.5,.13,3.45,0,.55,0,'#b6935e');for(const x of [-.52,.52])for(const z of [-1.15,1.15])bb.box(.055,.78,.055,x,.97,z,'#8e6c45');roofHip(0,1.35,0,1.7,3.2,.38,'#b99b57',bb);for(const x of [-.73,.73])for(let j=0;j<5;j++)bb.box(.045,.23,.045,x,.72,-1.3+j*.65,'#cab27b');for(const z of [-1.18,1.18])bb.sphere(.1,0,1.08,z,'#b77a4b',{emissive:'#b8864f',emissiveIntensity:.10});merge(boat);boat.scale.setScalar(boatScale);boats.push(boat);}
  let boatTravel=0,lastBoatTime=0;const placeBoats=()=>boats.forEach((b,i)=>{const p=boatPose(boatTravel+i*pathLength/2);b.position.set(p.x,0,p.z);b.rotation.y=p.yaw;});placeBoats();scene.userData.boatRoute={pose:boatPose,length:pathLength,halfWidth:.85*boatScale,halfLength:1.85*boatScale,water:{minX:-38.2,maxX:-29.8,minZ:-8.2,maxZ:40},bridgeMinZ:17.87};
  // Real-photo-inspired wide double-eaved Dacheng Hall, not a pagoda.
  const waterside=new T.Group();waterside.name='fuzimiao-dacheng-hall';waterside.position.set(-48.5,0,-2.9);waterside.scale.setScalar(1.38);neighborhood.add(waterside);const q=builder(waterside);
  const watersideSnow=new T.Group();watersideSnow.position.copy(waterside.position);watersideSnow.scale.copy(waterside.scale);snowCaps.add(watersideSnow);const qs=builder(watersideSnow);
  const hallRoof=(x,y,z,w,d,h)=>{const v=[],levels=[[0,1,1],[.2,.94,.79],[.73,.78,.34],[1,.66,.025]];const ring=j=>{const [yy,kx,kz]=levels[j],a=w*kx/2,b=d*kz/2,c=j===0?.2:0;return[[-a,yy*h+c,-b],[0,yy*h,-b],[a,yy*h+c,-b],[a,yy*h,0],[a,yy*h+c,b],[0,yy*h,b],[-a,yy*h+c,b],[-a,yy*h,0]];};for(let j=0;j<3;j++){const a=ring(j),b=ring(j+1);for(let k=0;k<8;k++){const l=(k+1)%8;v.push(...a[k],...b[k],...a[l],...a[l],...b[k],...b[l]);}}// Close the actual roof volume: dark timber soffit below curved eaves,
  // a capped ridge above, and visible rafter tails supporting each overhang.
  const underside=[],base=ring(0),peak=ring(3);for(let k=0;k<8;k++){const l=(k+1)%8;underside.push(0,.045,0,...base[k],...base[l]);v.push(0,h,0,...peak[l],...peak[k]);}
  const soffitGeo=new T.BufferGeometry();soffitGeo.setAttribute('position',new T.Float32BufferAttribute(underside,3));soffitGeo.computeVertexNormals();const soffit=new T.Mesh(soffitGeo,q.mat('#655b4e'));soffit.name='hall-roof-soffit';soffit.position.set(x,y,z);soffit.castShadow=true;soffit.receiveShadow=true;q.add(soffit);
  for(let j=0;j<15;j++){const xx=x-w*.43+j*w*.86/14;for(const side of [-1,1])q.box(.07,.09,d*.19,xx,y-.03,z+side*d*.40,'#76694f');}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.computeVertexNormals();const m=new T.Mesh(geo,q.mat('#354b46'));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;q.add(m);const cap=new T.Mesh(geo.clone(),qs.mat('#e4e9e5'));cap.position.set(x,y+.055,z);qs.add(cap);const rim=ring(0).map(p=>[p[0]+x,p[1]+y,p[2]+z]);rim.push(rim[0]);q.tube(rim,.045,'#627267');q.box(w*.68,.1,.14,x,y+h+.035,z,'#6d7a6b');for(let j=0;j<31;j++){const xx=-w*.46+j*w*.92/30;q.tube([[x+xx,y+.02,z+d*.5],[x+xx*.94,y+h*.2,z+d*.395],[x+xx*.78,y+h*.73,z+d*.17],[x+xx*.66,y+h,z]],.011,'#66766b');}};
  q.box(11.8,.42,10,0,.25,1,'#8d9c8a');q.box(11.9,.12,10.1,0,.52,1,'#bbc2aa');qs.box(11.9,.065,10.1,0,.61,1,'#e5ebe6');q.box(9.6,2.65,5.3,0,1.97,0,'#775343');
  for(const x of [-4,-2.66,-1.33,0,1.33,2.66,4]){q.cyl(.095,.12,2.7,x,1.99,2.8,'#8d5546');q.box(.3,.17,.36,x,3.28,2.8,'#a17953');}for(let j=0;j<6;j++){const x=-3.34+j*1.33;q.box(.98,1.85,.035,x,1.75,2.67,'#3c4034');for(let k=0;k<5;k++)q.box(.022,1.72,.015,x-.37+k*.185,1.75,2.7,'#a48f61',{outline:false});}
  q.box(10.1,.22,5.8,0,3.35,0,'#7c5543');hallRoof(0,3.52,0,11.7,7.7,.7);q.box(8.9,1.17,4.6,0,4.45,0,'#745342');hallRoof(0,5.08,0,10.25,6.6,1.72);
  for(const x of [-3.3,3.3])q.tube([[x,6.83,0],[x*.99,7.02,0],[x*.93,7.14,0],[x*.9,6.99,0]],.065,'#7a8974');for(let j=0;j<9;j++)q.sphere(.085,-2.8+j*.7,6.93,0,'#74856e');
  q.box(.62,1.05,.06,0,4.51,2.36,'#314b43');for(const [j,c] of [...'大成殿'].entries())q.label(c,.32,.28,0,4.83-j*.30,2.405,{bg:'transparent',fg:'#c2aa6b',fontSize:200});
  for(let j=0;j<6;j++)q.box(5.2-j*.19,.075,2.2-j*.26,0,.06+j*.075,4.95,'#b2b9a4');for(const x of [-4.9,4.9]){q.box(.11,.1,8.4,x,1.18,1,'#c4c9b0');for(let j=0;j<10;j++)q.box(.10,.61,.10,x,.86,-2.8+j*.84,'#b9c1a8');}
  q.box(.8,.28,.75,0,.75,3.63,'#7d8b78');q.cyl(.23,.37,1.15,0,1.46,3.63,'#526357');q.sphere(.19,0,2.17,3.63,'#657364');q.box(.36,.13,.25,0,2.3,3.62,'#526357');q.tube([[-.23,1.94,3.65],[-.29,1.65,3.87],[0,1.72,3.97],[.29,1.65,3.87],[.23,1.94,3.65]],.1,'#5c6d5e');
  for(const x of [-3.3,3.3])for(const z of [3.6,5.2]){q.box(.43,.14,.43,x,.69,z,'#a9b7a1');q.cyl(.12,.21,.7,x,1.11,z,'#c6cbb6');q.sphere(.12,x,1.59,z,'#c9cfb8');}
  // Scarlet double-dragon screen faces east toward the river and normal city view.
  const screen=new T.Group();screen.name='qinhuai-dragon-screen';screen.position.set(-41,0,11);screen.rotation.y=Math.PI/2;neighborhood.add(screen);const d=builder(screen);const screenSnow=new T.Group();screenSnow.position.copy(screen.position);screenSnow.rotation.copy(screen.rotation);snowCaps.add(screenSnow);const ds=builder(screenSnow);
  d.box(8.6,2.05,.4,0,1.24,0,'#984e3e');d.box(8.9,.24,.7,0,.33,0,'#87917c');d.box(8.95,.16,.9,0,2.33,0,'#3d534b');ds.box(8.95,.07,.9,0,2.46,0,'#e5ebe4');for(const sign of [-1,1]){const a=[[-3.2,.9],[-2.7,1.1],[-2.8,1.6],[-2.3,1.85],[-1.75,1.5],[-1.5,.95],[-.8,1.1],[-.65,1.6],[-.3,1.73]].map(([x,y])=>[x*sign,y,.225]);d.tube(a,.055,'#bb9b58');d.sphere(.12,-.3*sign,1.73,.25,'#c5a363');d.tube([[-.4*sign,1.82,.25],[-.55*sign,2.01,.25],[-.7*sign,1.94,.25]],.025,'#c8ad6c');for(let j=0;j<6;j++)d.sphere(.035,(-2.8+j*.36)*sign,1.17+(j%3)*.22,.27,'#ceb176');}d.sphere(.12,0,1.72,.25,'#d1b46d');
  // Planters/trees: seasonal crowns swap visibility instead of allocating meshes on clicks.
  const spring=new T.Group(),winter=new T.Group();scene.add(spring,winter);const sp=builder(spring),wi=builder(winter);
  for(const [x,z] of [[-7.4,9.8],[-21,-18.2],[3.9,11.8]]){
   n.box(.9,.35,.9,x,.19,z,'#4b655f');n.cyl(.09,.17,2.3,x,.95,z,'#665d52');
   for(let j=0;j<5;j++){const a=j*Math.PI*2/5,xx=x+Math.cos(a)*.55,zz=z+Math.sin(a)*.55;n.tube([[x,1.4,z],[xx,2.2,zz]],.045,'#665d52');sp.sphere(.57,xx,2.38+j%2*.25,zz,j%2?'#a2b69a':'#c2bcad');wi.sphere(.43,xx,2.4+j%2*.25,zz,'#dce6ee');}
  }
  // Connected urban ground plan. Raised pedestrian districts define streets without
  // replacing the original rain-reflecting asphalt with a second ground material.
  // Shared ground grammar: dark asphalt, grey-green granite and planted soil.
  // Collect footprints first; render their union once instead of stacking slabs.
  const urbanPaving=[],pedestrianSurfaces=[],crossingSurfaces=[],curbRamps=[];
  const groundStone=new T.MeshStandardMaterial({color:'#929f9b',roughness:.72,metalness:.015});
  const groundAsphalt=new T.MeshStandardMaterial({color:'#34454e',roughness:.82,metalness:0});
  const groundSnow=new T.MeshStandardMaterial({color:'#d5e0e3',roughness:.96,metalness:0});
  groundStone.onBeforeCompile=shader=>{
   shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 groundPosition;').replace('#include <begin_vertex>','#include <begin_vertex>\ngroundPosition = (modelMatrix * vec4(position,1.0)).xyz;');
   shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 groundPosition;').replace('#include <color_fragment>',`#include <color_fragment>
    vec2 stoneUV=groundPosition.xz/vec2(1.2,.6);
    vec2 fw=max(fwidth(stoneUV),vec2(.0001));
    vec2 jointDistance=min(fract(stoneUV),1.0-fract(stoneUV));
    vec2 joints=1.0-smoothstep(vec2(.012),vec2(.012)+fw,jointDistance);
    float fade=1.0-smoothstep(.08,.35,max(fw.x,fw.y));
    float variation=fract(sin(dot(floor(stoneUV),vec2(12.9898,78.233)))*43758.5453);
    diffuseColor.rgb*=1.0-.15*max(joints.x,joints.y)*fade+(variation-.5)*.035*fade;`);
  };
  campusGardenPath.material=groundStone;
  scene.traverse(mesh=>{if(mesh.isMesh&&Array.isArray(mesh.material)&&mesh.material[0]?.color?.getHexString()==='6e7f89')mesh.material[0]=groundStone;if(mesh.isMesh&&mesh.material?.color?.getHexString()==='a1aca0')mesh.material=groundStone;});
  groundStone.customProgramCacheKey=()=> 'city-granite-world-joints-v1';
  const paving=(name,x,z,w,d)=>{const top=.26;const p={name,x,z,w,d,top};urbanPaving.push(p);pedestrianSurfaces.push(p);};
  // Independent pedestrian direction sign, not lettering pasted on historic masonry.
  n.cyl(.045,.065,1.55,-14.7,.96,-25.1,'#526b73');n.box(1.8,.55,.10,-14.7,1.62,-25.1,'#31505b');n.label('北大楼',1.45,.34,-14.7,1.62,-25.16,{bg:'transparent',fg:'#e3e8d7',fontSize:180});
  // Parcel-first masterplan: the campus, civic square and lab each have a
  // bounded plot. Streets occupy reserved corridors, never leftover empty space.
  // One complete axial parcel: both wings, all three gate openings and the
  // street landing share a boundary instead of a narrow tongue under the gate.
  paving('campus-forecourt',-11,-25.2625,28.8,26.075);
  paving('campus-entrance',-11,-14.2,9,3.9,'#a5acad');
  // Granite joints share world coordinates across courts, paths and sidewalks.
  // Keep the original lab entrance pavement; no isolated slab over the parking/crossing.
  paving('bridge-west-approach',-41.6,18.7,5.85,1.6,'#a6afb1');
  paving('river-west-promenade',-39.3,15.9,1.25,48.2,'#899ba1');
  paving('river-east-promenade',-28.9,15.9,1.2,48.2,'#899ba1');
  paving('bridge-east-approach',-26.4,18.7,5.85,1.6,'#a6afb1');
  paving('bridge-city-link',-23.5,17.1,1.2,4.8,'#a6afb1');
  paving('residential-block',-2,-48,17.9,8.6);
  paving('gulou-court',-19.8,-1.275,17.8,14.95);
  paving('jiming-court',16,-23.1125,23.6,21.775);
  // Front landings widen the doorway-to-walk transition, without paving over
  // the riverside garden, road network or the Hall's raised historic terrace.
  paving('hall-front-landing',-48.5,6.5,14,2.4);
  paving('wall-gate-landing',-46.74,-33.1,7,2.8);
  paving('zifeng-court',-8,-64,10.5,10.5);
  paving('river-lab-walk',-19.5,6,19.8,1.8,'#a2aaa5');
  paving('temple-lab-walk',3.5,-21.3,1.5,16,'#a2aaa5');
  // The southern block is a public garden, not an unbounded asphalt apron.
  paving('river-garden-block',-19.8,11.8,17,7.8,'#929e99');
  for(const x of [-24.6,-15]){n.box(6.2,.14,5.5,x,.23,11.8,'#627d6b',{outline:false});sn.box(6.2,.07,5.5,x,.335,11.8,'#d8e5e7',{outline:false});}
  paving('garden-central-walk',-19.8,11.3,2,10.6,'#a6aea4');
  paving('garden-bridge-walk',-23.5,15.2,11,1.2,'#a6aea4');
  for(const x of [-24.6,-15]){
   for(let j=0;j<4;j++)n.box(2.1,.08,.105,x,.62,8.41+j*.13,j%2?'#a58d6c':'#b29a78',{outline:false});
   for(let j=0;j<3;j++)n.box(2.1,.10,.065,x,.76+j*.14,8.39,j%2?'#a58d6c':'#b29a78',{outline:false});
   for(const dx of [-.8,.8]){n.box(.07,.65,.055,x+dx,.62,8.36,'#47615d');n.box(.08,.4,.35,x+dx,.36,8.6,'#47615d');n.box(.16,.05,.45,x+dx,.18,8.6,'#47615d');}
   sn.box(2.1,.045,.5,x,.685,8.6,'#e1e8e7',{outline:false});
  }
  // Court gardens occupy the margins, leaving the campus central entrance clear.
  for(const x of [-21,-1])for(const z of [-20.6,-16.9]){n.box(1.2,.36,1.9,x,.36,z,'#667a79');n.box(1.06,.09,1.76,x,.59,z,'#647b68');sn.box(1.1,.075,1.8,x,.67,z,'#e1e9eb');}
  // Low-rise mixed-use blocks transition between civic foreground and distant skyline.
  const urbanBlocks=[[-61,-20,14,8.5,8.6],[41,-31,12,10,10.8],[61,20,13,14,9.8],[-28,-48,16,7.2,10.2],[-62,-32,16,10,9]];
  for(let k=0;k<urbanBlocks.length;k++){
   const district=new T.Group(),districtSnow=new T.Group();district.name='urban-block-'+k;neighborhood.add(district);snowCaps.add(districtSnow);cityGroups.push({owner:'urban-block-'+k,group:district,snow:districtSnow});const n=builder(district),sn=builder(districtSnow);
   const [x,z,w,d,h]=urbanBlocks[k];paving('urban-block-'+k,x,z,w+1.5,d+1.4);
   n.box(w,h,d,x,h/2+.18,z,k%2?'#687c83':'#70818a');n.box(w+.2,.2,d+.2,x,h+.26,z,'#455c69');sn.box(w+.2,.08,d+.2,x,h+.4,z,'#dce7eb');
   for(let floor=0;floor<Math.floor(h/1.7);floor++)for(let j=0;j<Math.floor(w/1.7);j++){
    const xx=x-w/2+.9+j*1.7,yy=1.1+floor*1.7;n.box(.82,.96,.024,xx,yy,z+d/2+.016,'#314c5a',{outline:false});
    if(floor===0)n.box(.72,.85,.025,xx,yy,z+d/2+.032,'#9b9d86',{emissive:'#bea56f',emissiveIntensity:.16,outline:false});
   }
   for(let floor=0;floor<Math.floor(h/1.7);floor++){
    for(let j=0;j<Math.floor(d/1.7);j++)for(const side of [-1,1])n.plane(.82,.96,x+side*(w/2+.016),1.1+floor*1.7,z-d/2+.9+j*1.7,'#314c5a',{rotationY:Math.PI/2});
    for(let j=0;j<Math.floor(w/1.7);j++)n.plane(.82,.96,x-w/2+.9+j*1.7,1.1+floor*1.7,z-d/2-.016,'#314c5a');
   }
  }
  // Small residential parcels follow the established outer streets. Low roofs
  // step down toward the civic core; each building owns its cutaway and snow.
  const homes=[
   [-60,-48,10,6,9],[-47,-48,8,6,6.8],[15,-48,9,6,8.8],
   [26,-48,8,6,10.5],[40,-48,9,6,7.2],[-62.5,-2,10,9,7],
   [-61,12,11,8,8.8],[40,-1,10,9,7.2],[40,14,10,10,9],[23,10,9,8,5.5]
  ];
  const homePalette=['#8b9188','#829592','#a0927e','#7c8d96'];
  const detailMetal=new T.MeshStandardMaterial({color:'#81928d',roughness:.53,metalness:.28});
  const detailGlass=new T.MeshStandardMaterial({color:'#68858c',roughness:.24,metalness:.12});
  const detailWarmGlass=new T.MeshStandardMaterial({color:'#b4aa8c',roughness:.29,metalness:.08,emissive:'#d4ae73',emissiveIntensity:.19});
  const detailRoof=new T.MeshStandardMaterial({color:'#52696b',roughness:.72,metalness:.18});
  const homeMaterials=homePalette.map(color=>new T.MeshStandardMaterial({color,roughness:.91,metalness:0}));
  scene.userData.neighborhoodDetailMaterials={metal:detailMetal,glass:detailGlass,warmGlass:detailWarmGlass,roof:detailRoof,plaster:homeMaterials};
  for(const [k,[x,z,w,d,h]] of homes.entries()){
   const district=new T.Group(),caps=new T.Group(),owner='housing-'+k;
   district.name=owner;caps.name=owner+'-snow';neighborhood.add(district);snowCaps.add(caps);
   cityGroups.push({owner,group:district,snow:caps});const b=builder(district),c=builder(caps);
   paving(owner+'-court',x,z+.5,w+1.8,d+2.4,'#939f9a');
   b.box(w,h,d,x,h/2+.18,z,homeMaterials[k%4]);
   b.box(w+.06,.34,d+.06,x,.38,z,'#697c78',{outline:false});
   b.box(w+.22,.18,d+.22,x,h+.27,z,detailRoof);c.box(w+.26,.075,d+.26,x,h+.40,z,'#e3ebed');
   // Thin parapets and small screened service boxes, rather than tower crowns.
   for(const zz of [z-d/2,z+d/2])b.box(w,.30,.12,x,h+.49,zz,detailMetal);
   for(const xx of [x-w/2,x+w/2])b.box(.12,.30,d,xx,h+.49,z,detailMetal);
   for(let j=1;j<Math.floor(w/.85);j++)b.box(.025,.025,d-.24,x-w/2+j*.85,h+.37,z,detailMetal,{outline:false});
   for(const xx of [x-w/2+.22,x+w/2-.22])b.box(.045,h-.15,.045,xx,h/2+.22,z-d/2-.07,detailMetal,{outline:false});
   b.box(1.4,.65,1.2,x-w*.25,h+.7,z-.5,'#728782');c.box(1.45,.065,1.25,x-w*.25,h+1.06,z-.5,'#e3ebed');
   const floors=Math.floor((h-.8)/1.65),cols=Math.floor(w/1.55);
   for(let f=0;f<floors;f++)for(let j=0;j<cols;j++){
    const xx=x-w/2+.9+j*1.55,yy=1.1+f*1.65;
    for(const side of [-1,1]){
     const zz=z+side*(d/2+.025),warm=(f*7+j*3+k)%7===0;
     b.box(.74,.94,.045,xx,yy,zz,'#354e57',{outline:false});
     b.box(.61,.79,.018,xx,yy,zz+side*.033,warm?detailWarmGlass:detailGlass,{outline:false});
     b.box(.035,.82,.025,xx,yy,zz+side*.05,'#b3b9a7',{outline:false});
     if(f>0&&j%3===k%3){
      b.box(1.07,.10,.59,xx,yy-.53,zz+side*.22,'#a8afa0');
      b.box(1.07,.045,.055,xx,yy-.15,zz+side*.48,detailMetal,{outline:false});
      for(const dx of [-.47,-.23,0,.23,.47])b.box(.028,.33,.028,xx+dx,yy-.32,zz+side*.48,detailMetal,{outline:false});
      for(const dx of [-.51,.51])b.box(.035,.045,.45,xx+dx,yy-.15,zz+side*.25,detailMetal,{outline:false});
      c.box(1.08,.05,.59,xx,yy-.45,zz+side*.22,'#e3ebed');
     }
    }
   }
   for(const side of [-1,1])for(let f=0;f<floors;f++)for(let j=0;j<Math.floor(d/1.8);j++){
    const xx=x+side*(w/2+.025),yy=1.1+f*1.65,zz=z-d/2+.9+j*1.8;
    b.box(.045,.98,.80,xx,yy,zz,'#354e57',{outline:false});
    b.box(.018,.80,.62,xx+side*.034,yy,zz,(f+j+k)%9===0?detailWarmGlass:detailGlass,{outline:false});
    b.box(.025,.84,.035,xx+side*.05,yy,zz,detailMetal,{outline:false});
    b.box(.14,.055,.84,xx+side*.03,yy-.52,zz,detailMetal,{outline:false});
   }
   b.box(1.08,1.48,.08,x,.94,z+d/2+.055,'#3d5659');b.box(1.75,.13,.85,x,1.78,z+d/2+.34,'#728982');c.box(1.78,.065,.85,x,1.88,z+d/2+.34,'#e3ebed');
   b.box(1.6,.025,.8,x,.195,z+d/2+.8,'#b6b9a5');
   b.box(.65,1.05,.022,x,.99,z+d/2+.108,detailGlass,{outline:false});
   b.box(.035,.28,.035,x+.30,.98,z+d/2+.14,detailMetal,{outline:false});
   b.box(1.3,.025,.49,x,1.705,z+d/2+.34,'#d1c5a2',{emissive:'#e3c38b',emissiveIntensity:.28,outline:false});
  }
  // Street-side pocket gardens leave the sidewalk width and doors unobstructed.
  const neighborhoodTrees=[[-56.5,-60.5],[-67.8,7],[-55,18],[-50.3,-24],[34.1,5.5],[46.7,7],[17.2,9],[17.2,14],[-53,-48],[20.75,-48],[33,-48]];
  for(const [k,[x,z]] of neighborhoodTrees.entries()){
   n.box(1.05,.28,1.05,x,.27,z,'#73877d');n.cyl(.075,.12,2.0,x,1.27,z,'#756b59');
   for(let j=0;j<3;j++){const a=j*Math.PI*2/3,xx=x+Math.cos(a)*.38,zz=z+Math.sin(a)*.38;n.tube([[x,1.55,z],[xx,2.18,zz]],.04,'#756b59');sp.sphere(.65,xx,2.35+j*.13,zz,j%2?'#a2b69a':'#c2bcad');wi.sphere(.47,xx,2.38+j*.13,zz,'#dce6ee');}
  }
  const streetFurniture=[];
  for(const [x,z] of [[-68.7,-5.5],[-68.7,10],[-68.7,19],[46.7,-7],[46.7,3],[46.7,20],[-53,-44.4],[20.75,-44.4],[33,-44.4]]){
   n.cyl(.045,.09,2.65,x,1.48,z,'#4b656b');n.box(.42,.12,.4,x,2.85,z,'#536c70');n.box(.30,.14,.28,x,2.73,z,'#d9d5b3',{emissive:'#dfc991',emissiveIntensity:.4});sn.box(.44,.06,.42,x,2.94,z,'#e4ecef');streetFurniture.push({x,z,w:.5,d:.5});
  }
  for(const [x,z] of [[-53.8,19.8],[40,6.6],[17.4,17]]){
   paving('pocket-seat-'+x,x,z,3.6,1.4,'#9ca79b');n.box(2.0,.12,.48,x,.65,z,'#ac9474');n.box(2,.38,.08,x,.9,z-.2,'#ac9474');for(const dx of [-.76,.76])n.box(.07,.40,.36,x+dx,.40,z,'#4d6766');sn.box(2.02,.06,.50,x,.75,z,'#e4ecef');n.box(.38,.66,.38,x+1.4,.54,z,'#637a77');streetFurniture.push({x,z,w:3.6,d:1.4});
  }
  scene.userData.residentialInfill={homes,trees:neighborhoodTrees,streetFurniture};
  // A connected street graph. All roads have a physical asphalt surface;
  // sidewalks and lane marks are cut at intersections rather than crossing them.
  const roadNetwork=[
   {name:'civic-lane',x:-8.5,z:-3.125,w:3,d:16.35},
   {name:'campus-south-street',x:-8.5,z:-10.7,w:38,d:3},
   {name:'east-lab-avenue',x:8.5,z:7.05,w:3.6,d:38.3},
   {name:'south-street',x:-5.55,z:19.3,w:31.7,d:4.2},
   {name:'campus-west-street',x:-40,z:-32.9,w:3.3,d:47.4},
   {name:'campus-north-street',x:-11,z:-41,w:128.4,d:4.2},
   {name:'north-outer-street',x:-11,z:-55,w:128.4,d:4.4},
   {name:'west-outer-avenue',x:-73,z:-15.55,w:4.4,d:83.3},
   {name:'east-outer-avenue',x:51,z:-15,w:4.4,d:84.4},
   {name:'temple-east-street',x:31,z:-8.5,w:3.6,d:69.2},
   {name:'temple-south-street',x:29.75,z:-10.7,w:46.1,d:3},
   {name:'west-district-street',x:-50.25,z:-10.7,w:49.9,d:3},
   {name:'west-waterfront-street',x:-58,z:24,w:34.4,d:4.2},
   {name:'east-neighborhood-street',x:29.75,z:24,w:46.1,d:4.2}
  ];
  const inside=(r,x,z,pad=0)=>Math.abs(x-r.x)<r.w/2+pad&&Math.abs(z-r.z)<r.d/2+pad;
  // Door-to-door walking routes are explicit geometry, not merely touching plots.
  // They cross streets at grade; the curb generator leaves those openings clear.
  const walkSegments=[],walkEntrances=[];
  const walk=(name,points,width=.9,owner=null,existing=false)=>{
   for(let i=1;i<points.length;i++)walkSegments.push({name,a:points[i-1],b:points[i],width,owner,existing});
  };
  const entrance=(name,point,owner)=>walkEntrances.push({name,point,owner});
  walk('north-frontage',[[-70.4,-43.55],[48.4,-43.55]],.8);
  walk('west-neighborhood',[[-70.4,-43.55],[-70.4,21.4],[-39.3,21.4]],.7);
  walk('east-neighborhood',[[48.4,-43.55],[48.4,21.4],[6.1,21.4],[6.1,-12.65]],.8);
  walk('temple-neighborhood',[[28.5,-43.55],[28.5,21.4]],.8);
  walk('campus-frontage',[[-11,-12.65],[28.5,-12.65]],.85);
  walk('campus-entry',[[-11,-27.4],[-11,-12.65]],1.6,'campus');
  walk('campus-civic-crossing',[[-11,-12.65],[-11,-8.9]],1.6);
  entrance('North Building',[-11,-27.4],'campus');entrance('University gate',[-11,-14.7],'campus');
  walk('temple-entry',[[16,-13.6],[16,-12.65]],1.3,'jiming');entrance('Jiming Temple',[16,-13.6],'jiming');
  walk('civic-north',[[-28.9,-8.9],[6.1,-8.9]],.55);
  walk('civic-lane-side',[[-10.35,-8.9],[-10.35,6]],.6);
  walk('civic-river-link',[[-28.9,6],[-10.35,6]],1.1);
  walk('gulou-entry',[[-19.8,4.4],[-19.8,6]],1.6,'gulou');entrance('Drum Tower',[-19.8,4.4],'gulou');
  walk('garden-link',[[-19.8,6],[-19.8,15.2],[-23.5,15.2],[-23.5,18.7]],1.1);
  walk('garden-south-crossing',[[-19.8,15.2],[-19.8,21.85],[6.1,21.85]],1.1);
  walk('river-east',[[-28.9,-8.9],[-28.9,39.5]],.9);
  walk('river-west',[[-39.3,-8.9],[-39.3,39.5]],.9);
  walk('river-head',[[-39.3,-8.9],[-28.9,-8.9]],.55);
  walk('hall-bridge',[[-48.5,5.45],[-48.5,18.7],[-44.5,18.7]],1.3,'fuzimiao');entrance('Dacheng Hall',[-48.5,5.45],'fuzimiao');
  walk('west-bridge-ramp',[[-44.5,18.7],[-38.65,18.7]],1.6,null,true);
  walk('arched-bridge',[[-38.65,18.7],[-29.35,18.7]],1.6,null,true);
  walk('east-bridge-ramp',[[-29.35,18.7],[-23.5,18.7]],1.6,null,true);
  walk('lab-existing-entrance',[[-1,2.2],[-1,3.25],[5.45,3.25]],.65,'slab',true);
  walk('lab-sidewalk-link',[[5.45,3.25],[6.1,3.25]],.65);
  walk('lab-civic-crossing',[[-10.35,3.8],[-7,3.8],[-7,3.45],[-5.4,3.45],[-1,3.45]],.55,null,true);
  entrance('SLAB',[-1,2.2],'slab');
  homes.forEach(([x,z,w,d],i)=>{
   const door=[x,z+d/2+.82];entrance('Home '+(i+1),door,'housing-'+i);
   if(i<5)walk('home-'+i,[door,[x,-43.55]],1,'housing-'+i);
   else if(i===5)walk('home-'+i,[door,[x,3.8],[-70.4,3.8]],.9,'housing-'+i);
   else if(i===6)walk('home-'+i,[door,[x,17.5],[-70.4,17.5]],.9,'housing-'+i);
   else if(i===7)walk('home-'+i,[door,[x,4.4],[48.4,4.4]],.9,'housing-'+i);
   else if(i===8)walk('home-'+i,[door,[x,21.4]],1,'housing-'+i);
   else walk('home-'+i,[door,[23,16],[28.5,16]],.9,'housing-'+i);
  });
  // The northern apartment and five mixed-use blocks also receive front doors.
  const frontages=[[-2,-44.18,'neighbor-0'],...urbanBlocks.map(([x,z,w,d],i)=>[x,z+d/2+.1,'urban-block-'+i])];
  frontages.forEach(([x,z,owner],i)=>{
   n.box(1.1,1.6,.10,x,1,z,'#345158');n.box(1.7,.12,.8,x,1.9,z+.25,'#7b9291');
   entrance(owner,[x,z+.2],owner);
   const points=i===0?[[x,z+.2],[x,-43.55]]:i===1?[[x,z+.2],[x,-14.4],[-70.4,-14.4]]:i===2?[[x,z+.2],[x,-24.8],[48.4,-24.8]]:i===3?[[x,z+.2],[x,29],[48.4,29],[48.4,21.4]]:i===4?[[x,z+.2],[x,-43.55]]:[[x,z+.2],[x,-26.2],[-70.4,-26.2]];
   walk(owner+'-entry',points,.9,owner);
  });
  entrance('Zifeng Tower',[-8,-60.1],'zifeng');
  walk('zifeng-entry',[[-8,-60.1],[-13,-60.1],[-13,-43.55]],1.2,'zifeng');
  entrance('Ming city gate',[-46.74,-33.76],'wall');
  walk('wall-entry',[[-46.74,-33.76],[-46.74,-32.8],[-42.4,-32.8],[-42.4,-38.3],[-37.7,-38.3],[-37.7,-43.55]],1.2,'wall');
  // The distant skyline also belongs to the city, rather than floating beyond it.
  walk('northern-park-walk',[[-75,-58.2],[48.4,-58.2],[48.4,-43.55]],1.2);
  walk('northwest-link',[[-37.7,-58.2],[-37.7,-43.55]],1.2);
  skyline.forEach(([x,z,w,d],i)=>{
   const door=[x,z+d/2+.22],owner='skyline-'+i;
   n.box(1.3,1.8,.10,x,1.0,z+d/2+.04,'#345158');entrance('Skyline '+(i+1),door,owner);
   if(i<4)walk(owner+'-entry',[door,[x,-58.2]],1.2,owner);
   else if(i===4)walk(owner+'-entry',[door,[56,door[1]],[56,-8.1],[48.4,-8.1]],1.2,owner);
   else if(i===5)walk(owner+'-entry',[door,[78,14],[68.3,14],[68.3,-8.1],[48.4,-8.1]],1.1,owner);
   else walk(owner+'-entry',[door,[-73,door[1]],[-73,28],[-70.4,28],[-70.4,21.4]],1.2,owner);
  });
  walk('south-park-entry',[[16,21.4],[16,34],[-12,34]],1.2);
  // Empty blocks have a purpose: a campus grove, a city-wall garden and
  // an eastern neighborhood green. Keep low planting below landmark sightlines.
  walk('campus-grove',[[-31.5,-38.3],[-31.5,-8.9]],1.2);
  walk('grove-north-link',[[-37.7,-38.3],[-31.5,-38.3]],1.1);
  walk('wall-garden',[[-46.74,-32.8],[-46.74,-14.65],[-70.4,-14.65]],1.1);
  walk('east-green',[[16,-12.65],[16,6],[6.1,6]],1.1);
  const publicGardens=[
   {name:'campus-west-grove',x:-34.3,z:-25.2,w:3.6,d:18},
   {name:'campus-east-grove',x:-28.4,z:-25.2,w:3.6,d:18},
   {name:'wall-west-garden',x:-50.3,z:-24,w:4.7,d:13},
   {name:'wall-east-garden',x:-43.8,z:-24,w:3.4,d:13},
   {name:'east-neighborhood-green',x:22,z:-1,w:9,d:8},
   {name:'east-reading-garden',x:12.3,z:-1,w:4,d:8},
   {name:'west-waterfront-meadow',x:-60,z:20,w:13,d:1.5},
   {name:'east-waterfront-meadow',x:17,z:19,w:12,d:1.5},
   {name:'northwest-green',x:-56.5,z:-66,w:12,d:10},
   {name:'northeast-green',x:17,z:-70,w:14,d:16},
   {name:'west-park-belt',x:-82,z:-20,w:8,d:65},
   {name:'east-park-belt',x:60.5,z:-20,w:6,d:20},
   {name:'south-park-north-lawn',x:0,z:30,w:27,d:5},
   {name:'south-park-south-lawn',x:0,z:38,w:27,d:5}
  ];
  const gardenTrees=[];
  for(const g of publicGardens){
   n.box(g.w,.12,g.d,g.x,.17,g.z,'#637e6e',{outline:false});
   sn.box(g.w,.065,g.d,g.x,.265,g.z,'#d9e5e5',{outline:false});
   if(g.d>4)for(let j=0,count=Math.max(2,Math.floor(g.d/6));j<count;j++){
    const x=g.x+(g.w>10?(j%2?2.2:-2.2):0),z=g.z-g.d/2+2+j*(g.d-4)/(count-1),height=2.5;
    n.cyl(.07,.12,height,x,1.4,z,'#6f6b56');
    sp.sphere(.8,x,2.9,z,'#9baf91');sp.sphere(.65,x+.4,2.65,z+.3,'#7f9d82');wi.sphere(.75,x,2.94,z,'#dee8e9');
    gardenTrees.push({x,z,w:2.1,d:2.1});
   }
  }
  const gardenSeats=[[-33.1,-16],[-29.8,-34],[-48.1,-16.4],[14.2,3],[-42.3,27.4]];
  for(const [x,z] of gardenSeats){
   for(let j=0;j<4;j++)n.box(.09,.08,1.7,x-.17+j*.115,.60,z,j%2?'#a18a6c':'#b29b7b',{outline:false});
   for(let j=0;j<3;j++)n.box(.065,.10,1.7,x-.20,.72+j*.13,z,j%2?'#a18a6c':'#b29b7b',{outline:false});
   for(const dz of [-.65,.65])n.box(.055,.62,.055,x-.20,.59,z+dz,'#536e68',{outline:false});
   for(const dz of [-.65,.65])n.box(.30,.40,.07,x,.35,z+dz,'#536e68');
   sn.box(.46,.055,1.72,x,.70,z,'#e1e8e7',{outline:false});
  }
  scene.userData.publicRealm={gardens:publicGardens,trees:gardenTrees,seats:gardenSeats};
  const routeContains=(seg,x,z,pad=0)=>Math.abs(x-(seg.a[0]+seg.b[0])/2)<=Math.abs(seg.a[0]-seg.b[0])/2+seg.width/2+pad&&Math.abs(z-(seg.a[1]+seg.b[1])/2)<=Math.abs(seg.a[1]-seg.b[1])/2+seg.width/2+pad;
  const routeCrossings=[];
  for(const seg of walkSegments){
   if(seg.existing)continue;
   const dx=seg.b[0]-seg.a[0],dz=seg.b[1]-seg.a[1],length=Math.hypot(dx,dz),cuts=[0,1];
   for(const r of roadNetwork){
    const axis=dx?0:1,center=dx?r.x:r.z,size=dx?r.w:r.d,delta=dx||dz;
    const cross=dx?seg.a[1]:seg.a[0],crossCenter=dx?r.z:r.x,crossSize=dx?r.d:r.w;
    if(Math.abs(cross-crossCenter)>crossSize/2+seg.width/2)continue;
    for(const edge of [center-size/2,center+size/2]){const t=(edge-seg.a[axis])/delta;if(t>0&&t<1)cuts.push(t);}
   }
   cuts.sort((a,b)=>a-b);
   for(let j=1;j<cuts.length;j++){
    const t=(cuts[j-1]+cuts[j])/2,unit=length*(cuts[j]-cuts[j-1]);if(unit<.001)continue;
    const x=seg.a[0]+dx*t,z=seg.a[1]+dz*t,onRoad=roadNetwork.some(r=>inside(r,x,z,.01));
    // Flush crossing panels cannot form a raised obstruction across the street.
    const w=dx?unit+.012:seg.width,d=dz?unit+.012:seg.width;
    (onRoad?crossingSurfaces:pedestrianSurfaces).push({name:seg.name,x,z,w:dx?unit:seg.width,d:dz?unit:seg.width,top:onRoad?.055:.26});
    if(!onRoad){
     // Lower the pavement toward a crossing rather than leaving a vertical curb.
     for(const end of [cuts[j-1],cuts[j]]){
      const ex=seg.a[0]+dx*end,ez=seg.a[1]+dz*end;
      const direction=end===cuts[j-1]?1:-1;
      if(roadNetwork.some(r=>inside(r,ex-dx/length*direction*.02,ez-dz/length*direction*.02))){
       const run=Math.min(1.8,unit/2);
       curbRamps.push({x:ex+dx/length*direction*run/2,z:ez+dz/length*direction*run/2,w:dx?run:seg.width,d:dz?run:seg.width,a:[ex,ez],b:[ex+dx/length*direction*run,ez+dz/length*direction*run],low:.055,high:.26,name:seg.name});
      }
     }
    }
   }
   for(const r of roadNetwork){const horizontal=seg.a[1]===seg.b[1];if(horizontal&&r.d>r.w&&routeContains(seg,r.x,seg.a[1])&&inside(r,r.x,seg.a[1]))routeCrossings.push({x:r.x,z:seg.a[1],w:r.w,d:seg.width});if(!horizontal&&r.w>r.d&&routeContains(seg,seg.a[0],r.z)&&inside(r,seg.a[0],r.z))routeCrossings.push({x:seg.a[0],z:r.z,w:seg.width,d:r.d});}
  }
  // Gradual six-unit landings meet the real arched deck at its .66 top surface.
  const bridgeLandings=[];
  const ramp=(name,a,b,low,high,width)=>{
   bridgeLandings.push({name,a,b,low,high,width});
  };
  ramp('west-bridge-landing',[-44.5,18.7],[-38.65,18.7],.26,.66,1.65);
  ramp('east-bridge-landing',[-29.35,18.7],[-23.5,18.7],.66,.26,1.65);
  for(const [x,height] of [[-39.3,.26+(.66-.26)*5.2/5.85],[-28.9,.66-(.66-.26)*.45/5.85]]){
   ramp('promenade-north-'+x,[x,12.7],[x,18.7],.26,height,1.2);
   ramp('promenade-south-'+x,[x,18.7],[x,24.7],height,.26,1.2);
  }
  scene.userData.walkNetwork={segments:walkSegments,entrances:walkEntrances,bridgeLandings,crossings:routeCrossings};

  const pavementStrips=[],retiredRoadsideStrips=[],roadEdgeLines=[];
  for(const road of roadNetwork){
   const alongZ=road.d>road.w,length=alongZ?road.d:road.w,width=alongZ?road.w:road.d;
   // Preserve the original central street reflector: matching asphalt has no
   // extra reflective render pass, and is raised only beyond its immediate area.
   // Asphalt and snow are rendered once from the union below.
   for(let j=-length/2+.5;j<length/2;j+=1){
    const x=road.x+(alongZ?0:j),z=road.z+(alongZ?j:0);
    const junction=roadNetwork.some(r=>r!==road&&inside(r,x,z,.5));
    if(!junction&&!walkSegments.some(seg=>routeContains(seg,x,z,.4))&&Math.round(j*10)%30<10)n.box(alongZ?.06:.7,.012,alongZ?.7:.06,x,.075,z,'#acb8b5',{outline:false});
    if(!junction&&!walkSegments.some(seg=>routeContains(seg,x,z,.4)))for(const side of [-.65,.65])sn.box(alongZ?.22:1.02,.006,alongZ?1.02:.22,x+(alongZ?side:0),.19,z+(alongZ?0:side),'#738f9f',{outline:false});
    for(const sign of [-1,1]){
     const xx=x+(alongZ?sign*(width/2+.35):0),zz=z+(alongZ?0:sign*(width/2+.35));
     if(roadNetwork.some(r=>r!==road&&inside(r,xx,zz,.52)))continue;
     if(walkSegments.some(seg=>routeContains(seg,xx,zz,.1)))continue;
     const w=alongZ?.65:1.02,d=alongZ?1.02:.65;
     // End civic lane in the shared pedestrian square, not through its paving.
     if(road.name==='civic-lane'&&z>4.7)continue;
     // The connected named walking network already supplies the useful sidewalks.
     // Do not lay a second, disconnected granite ribbon on every road edge.
     retiredRoadsideStrips.push({x:xx,z:zz,w,d,road:road.name});
    }
   }

  }
  // Solid edge paint belongs on asphalt, not a raised strip beside it. Coalesce
  // samples into continuous runs, breaking before junctions and walking crossings.
  for(const road of roadNetwork){
   const alongZ=road.d>road.w,length=alongZ?road.d:road.w,width=alongZ?road.w:road.d;
   for(const side of [-1,1]){
    let start=null;
    const flush=end=>{if(start===null)return;const span=end-start;if(span>.45){const mid=(start+end)/2,x=road.x+(alongZ?side*(width/2-.14):mid),z=road.z+(alongZ?mid:side*(width/2-.14)),w=alongZ?.055:span,d=alongZ?span:.055;roadEdgeLines.push({x,z,w,d,road:road.name});n.box(w,.008,d,x,.07,z,'#b5beb7',{outline:false});}start=null;};
    for(let t=-length/2+.5;t<=length/2-.5+.001;t+=.25){
     const x=road.x+(alongZ?side*(width/2-.14):t),z=road.z+(alongZ?t:side*(width/2-.14));
     const clear=t<length/2-.5&& !roadNetwork.some(r=>r!==road&&inside(r,x,z,.8))&&!walkSegments.some(seg=>routeContains(seg,x,z,.45));
     if(clear){if(start===null)start=t;}else flush(t-.25);
    }
    flush(length/2-.5);
   }
  }
  // Mark each planned street crossing and leave its centerline unpainted.
  for(const c of routeCrossings){
   const vertical=c.d>c.w,span=vertical?c.w:c.d;
   for(let t=-span/2+.08;t<span/2;t+=.26)n.box(vertical?.12:c.w,.012,vertical?c.d:.12,c.x+(vertical?t:0),.079,c.z+(vertical?0:t),'#d2d9d3',{outline:false});
  }
  // Pedestrian crossings sit only on carriageways, linking real sidewalks.
  const crossings=[{x:-8.5,z:3.8,w:3,d:.55}];
  for(const c of crossings){const vertical=c.d>c.w;for(let j=-.6;j<=.6;j+=.3)n.box(vertical?.16:c.w,.014,vertical?c.d:.16,c.x+(vertical?j:0),.078,c.z+(vertical?0:j),'#c0c8c6',{outline:false});}
  // Low planted setbacks and plazas subdivide the outer urban fabric.
  for(let j=0;j<skyline.length;j++){const [x,z,w,d]=skyline[j];paving('skyline-apron-'+j,x,z,w+3,d+3,'#788991');}
  for(const [x,z,w,d] of [[40,-19,12,9],[-58,-7.9,16,1.5]]){
   n.box(w,.14,d,x,.15,z,'#627a70',{outline:false});sn.box(w,.065,d,x,.255,z,'#d4e1e3',{outline:false});
  }
  scene.userData.masterplan={version:3,pavementStrips,crossings,principle:'connected streets, bounded civic parcels, continuous river walks'};
  // Axis-aligned rectangle subtraction gives a watertight, non-overlapping union.
  // This removes doubled junctions in both rain and snow without depth offsets.
  const extent=r=>({x0:r.x-r.w/2,x1:r.x+r.w/2,z0:r.z-r.d/2,z1:r.z+r.d/2});
  const subtract=(a,b)=>{
   const x0=Math.max(a.x0,b.x0),x1=Math.min(a.x1,b.x1),z0=Math.max(a.z0,b.z0),z1=Math.min(a.z1,b.z1);
   if(x1-x0<1e-7||z1-z0<1e-7)return [a];
   return [{x0:a.x0,x1:x0,z0:a.z0,z1:a.z1},{x0:x1,x1:a.x1,z0:a.z0,z1:a.z1},{x0,x1,z0:a.z0,z1:z0},{x0,x1,z0:z1,z1:a.z1}].filter(r=>r.x1-r.x0>1e-7&&r.z1-r.z0>1e-7);
  };
  const union=(rects,holes=[])=>{
   const result=[];
   for(const r of rects){let pieces=[extent(r)];for(const cut of [...holes.map(extent),...result]){pieces=pieces.flatMap(p=>subtract(p,cut));if(!pieces.length)break;}result.push(...pieces);}
   return result;
  };
  const planePatch=(r,height,material,build=n)=>{
   const {x0,x1,z0,z1}=r,h=typeof height==='function'?height:()=>height;
   const points=[[x0,h(x0,z0),z0],[x0,h(x0,z1),z1],[x1,h(x1,z1),z1],[x1,h(x1,z0),z0]],v=[];
   for(const i of [0,1,2,0,2,3])v.push(...points[i]);
   const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.computeVertexNormals();
   const m=new T.Mesh(geo,material);m.receiveShadow=true;build.add(m);return m;
  };
  const roadCells=union(roadNetwork),crossingCells=union(crossingSurfaces);
  for(const r of roadCells){planePatch(r,.027,groundAsphalt);planePatch(r,.166,sn.mat('#91a8b8'),sn);}
  for(const r of crossingCells){planePatch(r,.055,groundStone);planePatch(r,.217,groundSnow,sn);}
  // Original SLAB pavement stays intact; only its narrow connector blends heights.
  const originalSlabPavement=[{x:-1.1,z:2.55,w:9.6,d:2.3},{x:4.75,z:-1.35,w:2.1,d:10.1}];
  const rampRects=bridgeLandings.map(r=>({x:(r.a[0]+r.b[0])/2,z:(r.a[1]+r.b[1])/2,w:Math.abs(r.a[0]-r.b[0])||r.width,d:Math.abs(r.a[1]-r.b[1])||r.width}));
  const groundCells=union(pedestrianSurfaces,[...roadNetwork,...curbRamps,...rampRects,...originalSlabPavement]);
  for(const r of groundCells){planePatch(r,.26,groundStone);planePatch(r,.3125,groundSnow,sn);}
  const rampCells=[];
  for(const r of curbRamps){
   const dx=r.b[0]-r.a[0],dz=r.b[1]-r.a[1],length2=dx*dx+dz*dz;
   const height=(x,z)=>r.low+(r.high-r.low)*Math.max(0,Math.min(1,((x-r.a[0])*dx+(z-r.a[1])*dz)/length2));
   const cells=union([r],rampCells.map(q=>({x:(q.x0+q.x1)/2,z:(q.z0+q.z1)/2,w:q.x1-q.x0,d:q.z1-q.z0})));
   for(const cell of cells){planePatch(cell,height,groundStone);planePatch(cell,(x,z)=>.217+(height(x,z)-.055)/.205*.0955,groundSnow,sn);}rampCells.push(...cells);
  }
  const bridgeCells=[];
  for(const [i,r] of bridgeLandings.entries()){
   const dx=r.b[0]-r.a[0],dz=r.b[1]-r.a[1],len2=dx*dx+dz*dz;
   const height=(x,z)=>r.low+(r.high-r.low)*Math.max(0,Math.min(1,((x-r.a[0])*dx+(z-r.a[1])*dz)/len2));
   const cells=union([rampRects[i]],rampRects.slice(0,i));
   for(const cell of cells){planePatch(cell,height,groundStone);planePatch(cell,(x,z)=>height(x,z)+.0525,groundSnow,sn);}bridgeCells.push(...cells);
  }
  // Curb faces only on the exposed outside boundary, never across shared seams.
  const edgeMaterial=new T.MeshStandardMaterial({color:'#7e8e89',roughness:.87,metalness:0,side:T.DoubleSide});
  const edgeVertices=[],edgeSegments=[];
  const allGround=[...groundCells,...rampCells,...bridgeCells],occupied=(x,z)=>allGround.some(r=>x>r.x0-1e-6&&x<r.x1+1e-6&&z>r.z0-1e-6&&z<r.z1+1e-6);
  for(const r of groundCells)for(const [x0,z0,x1,z1,ox,oz] of [[r.x0,r.z0,r.x1,r.z0,0,-.002],[r.x1,r.z0,r.x1,r.z1,.002,0],[r.x1,r.z1,r.x0,r.z1,0,.002],[r.x0,r.z1,r.x0,r.z0,-.002,0]]){
   const dx=x1-x0,dz=z1-z0,axis=dx?'x':'z',start=dx?x0:z0,delta=dx||dz;
   const cuts=[0,1];for(const q of allGround)for(const v of [q[axis+'0'],q[axis+'1']]){const t=(v-start)/delta;if(t>0&&t<1)cuts.push(t);}cuts.sort((a,b)=>a-b);
   for(let k=1;k<cuts.length;k++){const a=cuts[k-1],b=cuts[k],mid=(a+b)/2;if(b-a<1e-6||occupied(x0+dx*mid+ox,z0+dz*mid+oz))continue;
    const p=[x0+dx*a,.26,z0+dz*a],q=[x0+dx*b,.26,z0+dz*b],lo=[p[0],.03,p[2]],lq=[q[0],.03,q[2]];
    edgeVertices.push(...p,...lo,...q,...q,...lo,...lq);edgeSegments.push([p,q]);
   }
  }
  // Coalesce tiny collinear pieces produced by clipping into full curb runs.
  const edgeRuns=new Map();
  for(const [p,q] of edgeSegments){const axis=p[0]===q[0]?2:0,fixed=p[axis===0?2:0],key=axis+':'+fixed.toFixed(6);if(!edgeRuns.has(key))edgeRuns.set(key,{axis,fixed,intervals:[]});edgeRuns.get(key).intervals.push([Math.min(p[axis],q[axis]),Math.max(p[axis],q[axis])]);}
  edgeVertices.length=0;edgeSegments.length=0;
  for(const {axis,fixed,intervals} of edgeRuns.values()){
   intervals.sort((a,b)=>a[0]-b[0]);const runs=[];for(const range of intervals){const last=runs.at(-1);if(last&&range[0]<=last[1]+1e-6)last[1]=Math.max(last[1],range[1]);else runs.push([...range]);}
   for(const [a,b] of runs){const p=axis===0?[a,.26,fixed]:[fixed,.26,a],q=axis===0?[b,.26,fixed]:[fixed,.26,b],lo=[p[0],.03,p[2]],lq=[q[0],.03,q[2]];edgeVertices.push(...p,...lo,...q,...q,...lo,...lq);edgeSegments.push([p,q]);}
  }
  const edgeGeo=new T.BufferGeometry();edgeGeo.setAttribute('position',new T.Float32BufferAttribute(edgeVertices,3));edgeGeo.computeVertexNormals();const curbMesh=new T.Mesh(edgeGeo,edgeMaterial);curbMesh.receiveShadow=true;n.add(curbMesh);
  const snowEdgeGeo=edgeGeo.clone(),snowEdgePosition=snowEdgeGeo.attributes.position;for(let i=0;i<snowEdgePosition.count;i++)snowEdgePosition.setY(i,snowEdgePosition.getY(i)>.2?.3125:.26);snowEdgeGeo.computeVertexNormals();const snowEdge=new T.Mesh(snowEdgeGeo,groundSnow);snowEdge.receiveShadow=true;sn.add(snowEdge);
  scene.userData.groundDesign={version:1,stone:groundStone,asphalt:groundAsphalt,snow:groundSnow,pedestrianSurfaces,groundCells,roadCells,crossingCells,curbRamps,rampCells,bridgeCells,edgeSegments,top:.26,jointSize:[1.2,.6]};
  // Winter-only snow sculptures; the SLAB snowman sits in the front open space, away from Lulu and the entrance walk.
  const snowmen=new T.Group();snowmen.name='winter-snowmen';winter.add(snowmen);const sm=builder(snowmen);
  const snowmanSites=[[-19,-16.1,.85,-.18],[-3.5,-17.4,.62,.2],[-47,14,.72,-.35],[-3.4,10.5,.72,.15]];
  for(let i=0;i<snowmanSites.length;i++){const [x,z,k,lean]=snowmanSites[i],g=new T.Group();g.name='snowman-'+i;g.position.set(x,.22,z);g.scale.setScalar(k);g.rotation.y=lean;snowmen.add(g);const b=builder(g);
   b.sphere(.55,0,.48,0,'#e3edf0');b.sphere(.39,.035,1.1,0,'#eef3f3');b.sphere(.28,.06,1.62,0,'#f0f4f4');
   for(const xx of [-.045,.16])b.sphere(.026,xx,1.68,.254,'#334954');b.cyl(.005,.055,.25,.065,1.60,.34,'#c88b57',{rotationX:Math.PI/2,radialSegments:8});
   b.cyl(.32,.32,.045,.06,1.85,0,'#304c61');b.cyl(.21,.23,.23,.06,1.98,0,i===1?'#845960':'#385b68');b.cyl(.40,.40,.085,.035,1.35,0,i===1?'#b99561':'#986b62');
   for(const y of [.88,1.09,1.25])b.sphere(.028,.035,y,.37,'#40545d');
   for(const sign of [-1,1]){const yy=i===2&&sign===1?1.65:1.23;b.tube([[sign*.3,1.12,0],[sign*.58,yy,.03],[sign*.74,yy+.11,.04]],.025,'#6b6760');}
  }
  scene.userData.roadNetwork=roadNetwork;scene.userData.urbanPaving=urbanPaving;scene.userData.snowmanSites=snowmanSites;

  sn.box(199.8,.10,199.8,-3,.06,-20,'#dce6e9',{outline:false});
  const sidewalkShape=new T.Shape();[[-5.9,1.4],[3.7,1.4],[3.7,-6.4],[5.8,-6.4],[5.8,3.7],[-5.9,3.7]].forEach(([x,z],i)=>i?sidewalkShape.lineTo(x,-z):sidewalkShape.moveTo(x,-z));sidewalkShape.closePath();const sidewalkSnow=new T.Mesh(new T.ShapeGeometry(sidewalkShape),sn.mat('#e5ebeb'));sidewalkSnow.rotation.x=-Math.PI/2;sidewalkSnow.position.y=.34;sn.add(sidewalkSnow);
  // Thin snow rests above the real main roof, never a fake flat image.
  const roofSnow=new T.Group();roofSnow.name="main-roof-snow";scene.add(roofSnow);const sr=builder(roofSnow);sr.box(10.05,.09,7.75,-1,4.99,-2,'#e2ebef',{outline:false});
  for(const [x,z,w,d] of [[-7,5,2.3,1.1],[6.6,-4,1.4,3.5],[-12,3.5,5,1.2]])sn.box(w,.05,d,x,.07,z,'#dbe5e9',{outline:false});
  cityGroups.push({owner:'jiming',group:jiming,snow:jimingSnow},{owner:'campus',group:campus,snow:campusSnow},{owner:'zifeng',group:zifeng,snow:zifengSnow},{owner:'wall',group:wallGroup,snow:wallSnow},{owner:'gulou',group:gulou,snow:gulouSnow},{owner:'fuzimiao',group:waterside,snow:watersideSnow},{owner:'screen',group:screen,snow:screenSnow});
  scene.updateMatrixWorld(true);const bounds=(name,owner,group,min,max)=>{const b=new T.Box3(new T.Vector3(...min),new T.Vector3(...max)).applyMatrix4(group.matrixWorld);return{name,owner,min:b.min.toArray(),max:b.max.toArray()};};
  scene.userData.clearanceVolumes=[
   bounds('jiming-temple','jiming',jiming,[-8,0,-7],[8,10.9,7]),
   bounds('nanjing-drum-tower','gulou',gulou,[-6.4,0,-4.4],[6.4,8.8,4.4]),
   bounds('zifeng-tower','zifeng',zifeng,[-3.6,0,-3.45],[3.6,31.05,3.45]),
   {name:'slab',owner:'slab',min:[-6.1,0,-5.9],max:[4.1,5.1,2.2]},
   bounds('north-left-wing','campus',campus,[-6.65,0,-2.3],[-.95,4.2,2.3]),
   bounds('north-right-wing','campus',campus,[.95,0,-2.3],[6.65,4.2,2.3]),
   bounds('north-tower','campus',campus,[-1.56,0,-2.3],[1.56,7.35,2.5]),
   bounds('campus-gate','campus',entry,[-3.55,0,-.5],[3.55,4.05,.95]),
   {name:'original-street-notice',owner:'notice',min:[-6.85,0,2.65],max:[-5.35,2.45,3.05]},
   {name:'power-pole-front',owner:'power',min:[-6.85,0,4.4],max:[-6.45,7.85,4.8]},
   {name:'power-pole-rear',owner:'power',min:[-6.85,0,-7.22],max:[-6.45,7.65,-6.82]},
   {name:'power-lines',owner:'power',min:[-6.8,5.9,-7.05],max:[-6.1,7.9,4.65]},
   {name:'qinhuai-waterway',owner:'water',min:[-38.2,0,-8.2],max:[-29.8,.56,40]},
   bounds('fuzimiao-dacheng-hall','fuzimiao',waterside,[-5.95,0,-4.05],[5.95,7.3,6.05]),
   bounds('dragon-screen','screen',screen,[-4.5,0,-.45],[4.5,2.5,.45]),
   bounds('wall-gate','wall',wallGroup,[4.8,0,-12.8],[9.8,5.4,-9.8]),
   ...buildings.map((b,j)=>({name:'neighbor-'+j,owner:'neighbor-'+j,min:[b.x-b.w/2-.15,0,b.z-b.d/2-.15],max:[b.x+b.w/2+.15,b.h+4.5,b.z+b.d/2+.15]})),
   ...[[-7.4,9.8],[-21,-18.2],[3.9,11.8]].map(([x,z],j)=>({name:'tree-'+j,owner:'tree-'+j,min:[x-1.15,0,z-1.15],max:[x+1.15,3.3,z+1.15]})),
   ...homes.map(([x,z,w,d,h],j)=>({name:'housing-'+j,owner:'housing-'+j,min:[x-w/2-.15,0,z-d/2-.65],max:[x+w/2+.15,h+1.1,z+d/2+.82]})),
   ...neighborhoodTrees.map(([x,z],j)=>({name:'tree-infill-'+j,owner:'tree-infill-'+j,min:[x-1.05,0,z-1.05],max:[x+1.05,3.35,z+1.05]})),
   ...urbanBlocks.map(([x,z,w,d,h],j)=>({name:"urban-block-"+j,owner:"urban-block-"+j,min:[x-w/2,0,z-d/2],max:[x+w/2,h+.5,z+d/2]})),
   ...skyline.map(([x,z,w,d,h],j)=>({name:'skyline-'+j,owner:'skyline-'+j,min:[x-w/2-.15,0,z-d/2-.15],max:[x+w/2+.15,h+.8,z+d/2+.15]}))
  ];
  // Short planted verge modules replace selected redundant ribbons. Their outer
  // envelope includes the concrete rim, foliage and winter cap. Keep the complete
  // walking surface and every crossing clear, not merely the route centerline.
  const vergePlanters=[],rectOverlap=(a,b,pad=0)=>Math.abs(a.x-b.x)<(a.w+b.w)/2+pad&&Math.abs(a.z-b.z)<(a.d+b.d)/2+pad;
  const reserved=[...roadNetwork,...pedestrianSurfaces,...publicGardens,...streetFurniture,...gardenTrees,...gardenSeats.map(([x,z])=>({x,z,w:.5,d:1.8})),...scene.userData.clearanceVolumes.map(v=>({x:(v.min[0]+v.max[0])/2,z:(v.min[2]+v.max[2])/2,w:v.max[0]-v.min[0],d:v.max[2]-v.min[2]}))];
  for(const road of roadNetwork){
   if(road.name==='civic-lane')continue;
   const alongZ=road.d>road.w,length=alongZ?road.d:road.w,width=alongZ?road.w:road.d;
   for(const side of [-1,1])for(let t=-length/2+5;t<length/2-5;t+=12){
    const p={name:'verge-'+road.name+'-'+side+'-'+t,x:road.x+(alongZ?side*(width/2+.48):t),z:road.z+(alongZ?t:side*(width/2+.48)),w:alongZ?.6:3.6,d:alongZ?3.6:.6};
    if(reserved.some(r=>rectOverlap(p,r,.16))||vergePlanters.some(r=>rectOverlap(p,r,1)))continue;
    vergePlanters.push(p);
    n.box(p.w,.30,p.d,p.x,.20,p.z,'#667a73',{outline:false});
    n.box(p.w-.13,.08,p.d-.13,p.x,.37,p.z,'#415b49',{outline:false});
    // Low clipped evergreen hedges remain visible in rain; snow follows their rim.
    n.box(p.w-.18,.18,p.d-.20,p.x,.48,p.z,'#6a876d',{outline:false});
    sn.box(p.w-.12,.065,p.d-.12,p.x,.61,p.z,'#dce7e6',{outline:false});
    scene.userData.clearanceVolumes.push({name:p.name,owner:'verge',min:[p.x-p.w/2,0,p.z-p.d/2],max:[p.x+p.w/2,.65,p.z+p.d/2]});
   }
  }
  scene.userData.roadsideDesign={retiredRoadsideStrips,roadEdgeLines,vergePlanters};
  // A soft architectural cutaway preserves free orbit instead of forcing a
  // camera jump. Only a building that intercepts the central lab view fades.
  const fadedOwners=new Set(),focus=new T.Vector3(-1,2.2,-1.5),focusNdc=new T.Vector3(),focusSamples=[focus,new T.Vector3(-5,1,-5),new T.Vector3(3,1,-5),new T.Vector3(-5,3,1.6),new T.Vector3(3,3,1.6)];
  const segmentHits=(from,to,v,pad=0)=>{let near=0,far=1;for(let k=0;k<3;k++){const axis=k===0?'x':k===1?'y':'z',o=from[axis],d=to[axis]-o;if(Math.abs(d)<1e-7){if(o<v.min[k]-pad||o>v.max[k]+pad)return false;}else{let a=(v.min[k]-pad-o)/d,b=(v.max[k]+pad-o)/d;if(a>b){const t=a;a=b;b=t;}near=Math.max(near,a);far=Math.min(far,b);}}return near<=far&&far>0&&near<.98;};
  const occludingVolumes=scene.userData.clearanceVolumes.filter(v=>cityGroups.some(g=>g.owner===v.owner));
  scene.userData.isCityOccluded=(from,to)=>occludingVolumes.some(v=>!fadedOwners.has(v.owner)&&segmentHits(from,to,v));
  const updateCityCutaway=camera=>{if(!camera)return;let coreInView=true;if(camera.isCamera){focusNdc.copy(focus).project(camera);coreInView=Math.abs(focusNdc.x)<.85&&Math.abs(focusNdc.y)<.9&&focusNdc.z>-1&&focusNdc.z<1;}for(const district of cityGroups){const hit=coreInView&&district.volumes.some(v=>focusSamples.some(point=>segmentHits(camera.position,point,v,district.opacity===0?1.4:.55)));const target=hit?0:1;district.opacity=target; // direct response to camera, no autonomous motion
   if(hit)fadedOwners.add(district.owner);else fadedOwners.delete(district.owner);district.group.visible=!hit;district.snow.visible=!hit;for(const entry of landmarkLights)if(entry.owner===district.owner)entry.light.intensity=hit?0:entry.power*(current==='winter'?.83:1);for(const o of district.renderables)o.castShadow=hit?false:o.userData.originalCastShadow;
   for(const m of district.materials){m.opacity=m.userData.baseOpacity*target;const transparent=m.userData.baseTransparent||hit;if(m.transparent!==transparent){m.transparent=transparent;m.needsUpdate=true;}m.depthWrite=hit?false:m.userData.baseDepthWrite;}
  }};
  scene.userData.updateCityCutaway=updateCityCutaway;
  // Shared roof map covers the complete modeled city, including transformed landmarks.
  const weatherRoofs=[
   ...scene.userData.clearanceVolumes.filter(v=>v.owner==='campus'||v.owner==='jiming'||v.owner==='gulou'||v.owner==='wall'||v.owner==='screen'||v.owner.startsWith('skyline-')||v.owner.startsWith('urban-block-')||v.owner.startsWith('housing-')),
   ...buildings.map(b=>({min:[b.x-b.w/2-.2,0,b.z-b.d/2-.2],max:[b.x+b.w/2+.2,b.h+.4,b.z+b.d/2+.2]})),
   bounds('temple-roof','weather',waterside,[-5.95,0,-4.05],[5.95,7.3,3.9]),
   bounds('zifeng-podium','weather',zifeng,[-3.6,0,-3.45],[3.6,2.4,3.45]),
   bounds('zifeng-core','weather',zifeng,[-2.6,0,-2.65],[2.6,27.4,2.65])
  ];
  const roofAt=(x,z)=>{let y=.062;for(const p of urbanPaving)if(Math.abs(x-p.x)<p.w/2&&Math.abs(z-p.z)<p.d/2)y=Math.max(y,p.top+.07);if(x>-38.2&&x<-29.8&&z>-10&&z<40)y=.22;
   if((z>1.4&&z<3.7&&x>-5.9&&x<5.8)||(x>3.7&&x<5.8&&z>-6.4&&z<3.7))y=.34;
   if(x>-6.25&&x<4.25&&z>-6.05&&z<2.35)y=5.1;
   for(const b of weatherRoofs)if(x>b.min[0]&&x<b.max[0]&&z>b.min[2]&&z<b.max[2])y=Math.max(y,b.max[1]+.06);
   return y;};window.itongWorldRoofAt=roofAt;scene.userData.weatherRoofAt=roofAt;scene.userData.weatherCoverage={minX:-103,maxX:97,minZ:-120,maxZ:80,rainCount:7200,snowCount:3600};
  // Physical surfaces share one restrained palette; printed signs and existing custom
  // glazing retain their own materials. No texture downloads or extra render passes.
  const physicalPalette=new Map();
  const roofColors=new Set(['3d5058','42565c','3f535b','3e525b','3e535d','3f5259','40545b','455957','435b5c','354d57','3f5059','41535b']);
  const glassColors=new Set(['2e484d','304752','354b51','344954','355261','365261','304b59','365160','4a7380','7b9b9c','b6b69b','9b9d86']);
  const metalColors=new Set(['a4b6b4','6c919c','b6c6bf','d0d8c9','91aaa9','7e999d','8da7a6','a8bab2','88a4a6']);
  neighborhood.traverse(o=>{const m=o.material;if(!o.isMesh||!m?.isMeshToonMaterial)return;
   if(!physicalPalette.has(m)){
    const hex=m.color.getHexString(),isRoof=roofColors.has(hex),isGlass=glassColors.has(hex),isMetal=metalColors.has(hex);
    const material=new T.MeshStandardMaterial({color:m.color,roughness:isGlass?.28:isMetal?.43:isRoof?.78:.9,metalness:isGlass?.08:isMetal?.35:isRoof?.055:0,emissive:m.emissive,emissiveIntensity:m.emissiveIntensity,map:m.map,transparent:m.transparent,opacity:m.opacity,side:m.side,depthWrite:m.depthWrite});
    material.userData.surfaceKind=isGlass?'glazing':isMetal?'metal':isRoof?'tile':'masonry';
    physicalPalette.set(m,material);
   }o.material=physicalPalette.get(m);
  });
  // Three modest freestanding street lamps, placed beside rather than on civic
  // facades. All poles stand on paved forecourts, off the entrance axes and signs.
  const landmarkLights=[];
  for(const [owner,x,z,power] of [['jiming',25.8,-13.1,10],['gulou',-27,4.8,7],['fuzimiao',-54.7,6.5,10]]){
   const y=4.6,arm=.55,light=new T.PointLight('#ffe1b3',power,18,2);light.name=owner+'-street-light';light.position.set(x+arm,y-.15,z);light.castShadow=false;scene.add(light);landmarkLights.push({owner,light,power,x,z});
   n.cyl(.16,.20,.16,x,.34,z,'#53656a',{radialSegments:8});n.cyl(.055,.085,4.16,x,2.5,z,'#4c6269',{radialSegments:8});
   n.box(.72,.075,.08,x+.30,4.56,z,'#4c6269',{outline:false});n.box(.44,.10,.30,x+arm,4.53,z,'#4c6269',{outline:false});
   n.box(.34,.035,.23,x+arm,4.46,z,'#d6cbb0',{emissive:'#ffe1b3',emissiveIntensity:.65,outline:false});
  }
  // Reuse both existing North Building garden lanterns, with no extra campus pole.
  for(const x of [-15.4,-6.6]){const light=new T.PointLight('#ffe1b3',6,13,2);light.position.set(x,4.1,-26.2);light.name='campus-existing-garden-lamp';scene.add(light);landmarkLights.push({owner:'campus',light,power:6,x,z:-26.2,existing:true});}
  scene.userData.cityLighting={landmarkLights,pointLightBudget:9,extraShadowMaps:0,physicalPalette};
  // The original merge helper bakes WORLD transforms. Reset each merged
  // district to identity to avoid double transforms and retain cutaway control.
  const mergeDistricts=parent=>{const direct=new T.Group();parent.add(direct);for(const child of [...parent.children]){if(child===direct)continue;if(child.isGroup){merge(child);child.position.set(0,0,0);child.rotation.set(0,0,0);child.scale.set(1,1,1);}else direct.attach(child);}merge(direct);for(const mesh of [...direct.children])parent.attach(mesh);parent.remove(direct);};
  mergeDistricts(neighborhood);mergeDistricts(snowCaps);
  for(const district of cityGroups){district.opacity=1;district.volumes=occludingVolumes.filter(v=>v.owner===district.owner);district.materials=[];district.renderables=[];for(const group of [district.group,district.snow])group.traverse(o=>{if(o.material){o.userData.originalCastShadow=o.castShadow;district.renderables.push(o);o.material=o.material.clone();o.material.userData={...o.material.userData,baseOpacity:o.material.opacity,baseTransparent:o.material.transparent,baseDepthWrite:o.material.depthWrite};district.materials.push(o.material);}});}
merge(spring);merge(winter);merge(roofSnow);roofSnow.traverse(o=>{if(o.material){o.material=o.material.clone();o.material.transparent=true;}});
  const autumn=spring.clone(true);autumn.name='autumn-crowns';autumn.traverse(o=>{if(o.material){o.material=o.material.clone();o.material.color.set(o.material.color.getHexString()==='a2b69a'?'#ad784d':'#c49c61');}});scene.add(autumn);
  const summerCrowns=spring.clone(true);summerCrowns.name='summer-crowns';summerCrowns.traverse(o=>{if(o.material){o.material=o.material.clone();o.material.color.set(o.material.color.getHexString()==='a2b69a'?'#718e78':'#879f7e');}});scene.add(summerCrowns);
  // City-wide snowfall: 650 local flakes and 2,950 broad-city flakes in one draw.
  // A CSS-pixel size floor keeps distant snow visible on Retina screens, without
  // inflating nearby flakes or tying motion to camera distance. Shared clock stays frozen under reduced motion.
  const count=3600,pos=new Float32Array(count*3),phase=new Float32Array(count),floorY=new Float32Array(count),ceiling=new Float32Array(count);
  let seed=84;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let j=0;j<count;j++){const near=j<650,x=near?random()*31-18:random()*200-103,z=near?random()*27-16:random()*200-120,y=roofAt(x,z);pos[j*3]=x;pos[j*3+1]=random();pos[j*3+2]=z;phase[j]=random();floorY[j]=y;ceiling[j]=Math.max(near?14:60,y+8);}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(pos,3));geo.setAttribute('phase',new T.BufferAttribute(phase,1));geo.setAttribute('floorY',new T.BufferAttribute(floorY,1));geo.setAttribute('ceiling',new T.BufferAttribute(ceiling,1));
  const snowMaterial=new T.ShaderMaterial({uniforms:{time:{value:0},pixelRatio:{value:Math.min(window.devicePixelRatio||1,1.7)}},transparent:true,depthWrite:false,vertexShader:'attribute float phase;attribute float floorY;attribute float ceiling;uniform float time;uniform float pixelRatio;varying float fade;void main(){vec3 p=position;float span=ceiling-floorY;p.y=ceiling-mod(position.y*span+time*(.5+phase*.55),span);p.x+=sin(time*.15+phase*6.)*.12;fade=smoothstep(floorY,floorY+.7,p.y)*(1.-smoothstep(ceiling-3.,ceiling,p.y));vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((2.+phase*2.)*42./max(1.,-mv.z),1.25+phase*.75,4.2)*pixelRatio;}',fragmentShader:'varying float fade;void main(){float d=length(gl_PointCoord-.5);float a=(1.-smoothstep(.18,.5,d))*fade*.85;if(a<.02)discard;gl_FragColor=vec4(.87,.94,1.,a);}'});
  const snow=new T.Points(geo,snowMaterial);snow.name='seasonal-snowflakes';snow.frustumCulled=false;scene.add(snow);
  // A single low-frequency storm dome follows the shared reduced-motion clock.
  const cloudMaterial=new T.ShaderMaterial({uniforms:{time:{value:0}},side:T.BackSide,transparent:true,depthWrite:false,
   vertexShader:'varying vec3 sky;void main(){sky=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'uniform float time;varying vec3 sky;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}void main(){vec2 p=sky.xz/max(.25,sky.y+.3)*2.8+vec2(time*.007,time*.003);float n=noise(p)*.58+noise(p*2.1)*.28+noise(p*4.2)*.14;float a=smoothstep(.16,.53,n)*smoothstep(-.02,.16,sky.y)*.84;vec3 c=mix(vec3(.025,.044,.065),vec3(.12,.16,.19),n);gl_FragColor=vec4(c,a);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'});
  const clouds=new T.Mesh(new T.SphereGeometry(170,40,20),cloudMaterial);clouds.name='summer-storm-clouds';clouds.position.set(-3,0,-10);clouds.renderOrder=-10;scene.add(clouds);
  const starPositions=[],starSizes=[],starPhases=[];for(let j=0;j<2000;j++){const a=random()*Math.PI*2,y=.015+Math.pow(random(),1.6)*.985,r=Math.sqrt(1-y*y);starPositions.push(Math.cos(a)*r*140-3,y*140,Math.sin(a)*r*140-10);starSizes.push(j%17===0?3.2:1.15+random()*1.25);starPhases.push(random()*6.28);}
  const starGeo=new T.BufferGeometry();starGeo.setAttribute('position',new T.Float32BufferAttribute(starPositions,3));starGeo.setAttribute('size',new T.Float32BufferAttribute(starSizes,1));starGeo.setAttribute('phase',new T.Float32BufferAttribute(starPhases,1));
  const starMaterial=new T.ShaderMaterial({uniforms:{time:{value:0},pixelRatio:{value:Math.min(window.devicePixelRatio||1,2)}},transparent:true,depthWrite:false,vertexShader:'attribute float size;attribute float phase;uniform float time;uniform float pixelRatio;varying float glow;void main(){glow=.88+.12*sin(time*.17+phase);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=size*pixelRatio;}',fragmentShader:'varying float glow;void main(){float a=(1.-smoothstep(.05,.5,length(gl_PointCoord-.5)))*glow;if(a<.02)discard;gl_FragColor=vec4(.88,.93,1.,a);}'});
  const stars=new T.Points(starGeo,starMaterial);stars.name='winter-starfield';stars.frustumCulled=false;scene.add(stars);
  // A restrained masonry finish in world units survives geometry merging and
  // district cutaways. No images, new meshes, render passes or shadow maps.
  const masonryColors=new Set(['a9534d','b35c55','af5951','91938a','62777c']);
  const masonryMaterials=new Set();
  neighborhood.traverse(o=>{const m=o.material;if(!(m?.isMeshToonMaterial||m?.isMeshStandardMaterial)||!m.color||!masonryColors.has(m.color.getHexString())||masonryMaterials.has(m))return;
   masonryMaterials.add(m);
   m.onBeforeCompile=shader=>{
    shader.vertexShader='varying vec3 vMasonryWorld;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvMasonryWorld=(modelMatrix*vec4(position,1.0)).xyz;');
    shader.fragmentShader='varying vec3 vMasonryWorld;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
     vec2 masonryUV=vec2(vMasonryWorld.x+vMasonryWorld.z,vMasonryWorld.y)/vec2(.70,.32);
     masonryUV.x+=mod(floor(masonryUV.y),2.0)*.5;
     vec2 edge=min(fract(masonryUV),1.0-fract(masonryUV));
     vec2 aa=max(fwidth(masonryUV),vec2(.002));
     vec2 joint=1.0-smoothstep(vec2(.018),vec2(.018)+aa,edge);
     float fade=1.0-smoothstep(.16,.55,max(aa.x,aa.y));
     float grain=sin(vMasonryWorld.x*7.0+vMasonryWorld.z*6.0)*sin(vMasonryWorld.y*10.0);
     diffuseColor.rgb*=1.0-fade*(.065*max(joint.x,joint.y)+.012*(grain+1.0));
    `);
   };
   m.customProgramCacheKey=()=> 'itong-masonry-v1';m.needsUpdate=true;
  });
  // Finite, world-scale ceramic courses break up smooth landmark roofs. The
  // derivative fade suppresses subpixel lines in distant and overhead views.
  const finishMaterials=new Set(),finishCounts={tile:0,glazing:0,metal:0};
  neighborhood.traverse(o=>{
   const m=o.material,kind=m?.userData.surfaceKind;
   if(!m?.isMeshStandardMaterial||!['tile','glazing','metal'].includes(kind)||finishMaterials.has(m))return;
   finishMaterials.add(m);finishCounts[kind]++;
   if(kind==='metal')return;
   m.onBeforeCompile=shader=>{
    shader.vertexShader='varying vec3 vFinishWorld;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvFinishWorld=(modelMatrix*vec4(position,1.0)).xyz;');
    shader.fragmentShader='varying vec3 vFinishWorld;\n'+shader.fragmentShader;
    if(kind==='tile')shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
     float course=vFinishWorld.y/.19;
     float courseAA=max(fwidth(course),.002);
     float courseEdge=min(fract(course),1.0-fract(course));
     float courseJoint=1.0-smoothstep(.045,.045+courseAA,courseEdge);
     float courseFade=1.0-smoothstep(.2,.65,courseAA);
     float tileVariation=sin(vFinishWorld.x*3.4+vFinishWorld.z*2.7)*.018;
     diffuseColor.rgb*=1.0-courseFade*(.10*courseJoint+tileVariation);
    `);
    // A restrained sky-facing sheen, not a second scene reflection. Existing
    // window emissive values remain untouched so SLAB stays the visual focus.
    if(kind==='glazing')shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
     float skySheen=pow(1.0-clamp(dot(normal,normalize(vViewPosition)),0.0,1.0),3.0);
     outgoingLight+=vec3(.025,.042,.052)*(.2+.8*skySheen);
     #include <opaque_fragment>
    `);
   };
   m.customProgramCacheKey=()=> 'itong-finish-v1-'+kind;m.needsUpdate=true;
  });
  scene.userData.surfaceFinishes={counts:finishCounts,materials:finishMaterials,extraRenderPasses:0,extraLights:0};
  scene.userData.materialPolish={masonryMaterials:masonryMaterials.size,roadSnow:'#91a8b8',freshSnow:'#dce6e9',extraRenderPasses:0};
  // Six quiet neighborhood cars. This closed block is the connected part of the
  // street graph around SLAB / Jiming, not the civic cul-de-sac or river walks.
  const trafficGroup=new T.Group();trafficGroup.name='neighborhood-traffic';scene.add(trafficGroup);
  const makeLane=(offset,reverse)=>{
   const x0=8.5+offset,x1=31-offset,z0=-10.7+offset,z1=24-offset,r=1.65-offset;
   const pieces=[],line=(x,z,dx,dz,length)=>pieces.push({x,z,dx,dz,length}),arc=(x,z,a)=>pieces.push({x,z,a,r,length:Math.PI*r/2});
   line(x0+r,z0,1,0,x1-x0-2*r);arc(x1-r,z0+r,-Math.PI/2);
   line(x1,z0+r,0,1,z1-z0-2*r);arc(x1-r,z1-r,0);
   line(x1-r,z1,-1,0,x1-x0-2*r);arc(x0+r,z1-r,Math.PI/2);
   line(x0,z1-r,0,-1,z1-z0-2*r);arc(x0+r,z0+r,Math.PI);
   const length=pieces.reduce((n,p)=>n+p.length,0);
   const pose=distance=>{let d=((reverse?-distance:distance)%length+length)%length;for(const p of pieces){if(d<=p.length){if(p.r){const a=p.a+d/p.r,dx=-Math.sin(a),dz=Math.cos(a);return{x:p.x+Math.cos(a)*p.r,z:p.z+Math.sin(a)*p.r,yaw:Math.atan2(reverse?-dx:dx,reverse?-dz:dz),turn:true};}return{x:p.x+p.dx*d,z:p.z+p.dz*d,yaw:Math.atan2(reverse?-p.dx:p.dx,reverse?-p.dz:p.dz),turn:false};}d-=p.length;}return pose(0);};
   // Stop at the approach to actual crosswalks, not on the pedestrian strip.
   const occupied=d=>{const p=pose(d);return routeCrossings.some(c=>Math.abs(p.x-c.x)<c.w/2+.95&&Math.abs(p.z-c.z)<c.d/2+.95);};
   const stops=[];for(let d=0;d<length;d+=.05)if(occupied(d)&&!occupied(d-.05))stops.push(d-.10);
   return{length,pose,stops,reverse};
  };
  const trafficLanes=[makeLane(.65,false),makeLane(-.65,true)],trafficCars=[];
  const trafficMat=(color,roughness=.5)=>new T.MeshStandardMaterial({color,roughness,metalness:.12});
  const paint=trafficMat('#ffffff',.34),glass=trafficMat('#294754',.22),rubber=trafficMat('#27343b',.9),lamp=trafficMat('#f4db9c'),tail=trafficMat('#ae6257');
  lamp.emissive=new T.Color('#ebc78d');lamp.emissiveIntensity=.5;tail.emissive=new T.Color('#98483b');tail.emissiveIntensity=.25;
  const parts=[{w:.72,h:.25,d:1.55,y:.31,z:0,mat:paint,paint:true},{w:.61,h:.24,d:.82,y:.54,z:-.08,mat:glass},{w:.63,h:.055,d:.68,y:.68,z:-.09,mat:paint,paint:true},
   {w:.11,h:.25,d:.29,y:.23,z:0,mat:rubber,wheels:true},{w:.15,h:.085,d:.025,y:.35,z:.782,mat:lamp,lights:true},{w:.15,h:.08,d:.025,y:.35,z:-.782,mat:tail,lights:true}];
  for(const p of parts){p.count=p.wheels?4:p.lights?2:1;p.mesh=new T.InstancedMesh(new T.BoxGeometry(p.w,p.h,p.d),p.mat,6*p.count);p.mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);p.mesh.castShadow=true;p.mesh.receiveShadow=true;p.mesh.frustumCulled=false;trafficGroup.add(p.mesh);}
  const colors=['#bdc7bc','#b88b6f','#638c91','#c9b784','#8495ad','#9a6c68'];
  for(let i=0;i<6;i++){const lane=trafficLanes[i%2];trafficCars.push({lane:i%2,distance:lane.length*(Math.floor(i/2)/3+(i%2)*.13),speed:0,laps:0});for(const p of parts)if(p.paint)p.mesh.setColorAt(i,new T.Color(colors[i]));}
  const trafficDummy=new T.Object3D();
  const placeTraffic=()=>{for(let i=0;i<6;i++){const car=trafficCars[i],pose=trafficLanes[car.lane].pose(car.distance);car.pose=pose;for(const p of parts){for(let j=0;j<p.count;j++){const x=p.wheels?(j%2?1:-1)*.365:p.lights?(j%2?1:-1)*.22:0,z=p.wheels?(j<2?-.48:.48):p.z;trafficDummy.position.set(pose.x+Math.cos(pose.yaw)*x+Math.sin(pose.yaw)*z,p.y+(current==='winter'?.13:0),pose.z-Math.sin(pose.yaw)*x+Math.cos(pose.yaw)*z);trafficDummy.rotation.set(0,pose.yaw,0);trafficDummy.updateMatrix();p.mesh.setMatrixAt(i*p.count+j,trafficDummy.matrix);}}}for(const p of parts)p.mesh.instanceMatrix.needsUpdate=true;};
  let trafficClock=0,lastTrafficTime=0;
  const reducedTraffic=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const updateTraffic=(time,cold)=>{let remaining=Math.min(.1,Math.max(0,time-lastTrafficTime));lastTrafficTime=time;if(reducedTraffic?.matches)remaining=0;
   while(remaining>1e-8){const dt=Math.min(remaining,.025);remaining-=dt;trafficClock+=dt;const crossingOpen=trafficClock%24>=5;
    const moves=trafficCars.map(car=>{const lane=trafficLanes[car.lane];let free=Infinity;for(const other of trafficCars)if(other!==car&&other.lane===car.lane)free=Math.min(free,(other.distance-car.distance+lane.length)%lane.length-2.5);
     if(!crossingOpen)for(const stop of lane.stops){const gap=(stop-car.distance+lane.length)%lane.length;free=Math.min(free,gap);}
     const cruise=(cold?.9:1.25)*(lane.pose(car.distance).turn?.6:1),target=Math.min(cruise,Math.sqrt(Math.max(0,2*1.6*(free-.08))));
     car.speed=Math.max(0,Math.min(target,car.speed+.7*dt));return Math.max(0,Math.min(car.speed*dt,free));});
    trafficCars.forEach((car,i)=>{const length=trafficLanes[car.lane].length;car.distance+=moves[i];if(car.distance>=length){car.distance-=length;car.laps++;}});
   }placeTraffic();
  };
  scene.userData.traffic={lanes:trafficLanes,cars:trafficCars,halfWidth:.43,halfLength:.80,update:updateTraffic,group:trafficGroup};
  let handles=null,current='summer';try{const saved=localStorage.getItem('itong-season');if(saved==='winter')current='winter';else current='summer';if(saved==='spring'||saved==='autumn')localStorage.setItem('itong-season','summer');}catch{}
  const apply=()=>{placeTraffic();if(!handles)return;const summer=current==='summer',cold=current==='winter';handles.rain.visible=summer;clouds.visible=summer;stars.visible=cold;riverUniforms.waterColor.value.set(cold?'#354958':summer?'#263e50':'#355970');riverUniforms.skyColor.value.set(cold?'#70869e':summer?'#8498aa':'#becfdb');scene.traverse(o=>{if(o.name==='seasonal-wet-marks')o.visible=summer;});handles.wet.visible=summer&&handles.getQuality?.()!=='light';snow.visible=cold;snowCaps.visible=cold;roofSnow.visible=cold;winter.visible=cold;spring.visible=current==='spring';summerCrowns.visible=summer;autumn.visible=current==='autumn';
   scene.background.set(summer?'#131f30':cold?'#1b3047':current==='autumn'?'#9caaa7':'#b7c8c7');handles.ground.material.color.set(summer?'#131f30':cold?'#1b3047':current==='autumn'?'#9caaa7':'#b7c8c7');handles.key.color.set(summer?'#a6c8ed':cold?'#d9e8ff':current==='autumn'?'#ffd1a2':'#fff0c9');handles.key.intensity=summer?1.22:cold?1.3:2.1;handles.fill.intensity=summer?1.12:cold?1.0:.55;handles.renderer.toneMappingExposure=summer?1.08:cold?1.1:1.05;scene.traverse(o=>{if(o.isHemisphereLight)o.intensity=cold?1.35:1.45;});for(const entry of landmarkLights)entry.light.intensity=entry.power*(cold?.83:1);
   document.documentElement.dataset.season=current;window.dispatchEvent(new CustomEvent('itong:season-changed',{detail:{season:current}}));};
  window.addEventListener('itong:set-season',e=>{if(!['spring','summer','autumn','winter'].includes(e.detail?.season))return;current=e.detail.season==='winter'?'winter':'summer';try{localStorage.setItem('itong-season',current);}catch{}apply();});
  return {connect:opts=>{handles=opts;apply();},update:(time,roofOpacity=1)=>{updateTraffic(time,current==='winter');updateCityCutaway(handles?.camera);riverUniforms.time.value=time;cloudMaterial.uniforms.time.value=time;starMaterial.uniforms.time.value=time;const dt=Math.max(0,time-lastBoatTime);lastBoatTime=time;boatTravel+=dt*(current==='winter'?.19:.28);placeBoats();if(snow.visible)snowMaterial.uniforms.time.value=time;roofSnow.visible=current==='winter'&&roofOpacity>.025;roofSnow.traverse(o=>{if(o.material)o.material.opacity=roofOpacity;});}};
 };
 const switcher=document.querySelector('.season-switch');let ready=false;
 const sync=()=>{switcher.hidden=!ready||document.querySelector('#home-overlay').classList.contains('is-open')||!document.querySelector('#lab-settings').hidden||!document.querySelector('#lab-menu').hidden;};
 for(const el of [document.querySelector('#home-overlay'),document.querySelector('#lab-settings'),document.querySelector('#lab-menu')])new MutationObserver(sync).observe(el,{attributes:true,attributeFilter:['class','hidden']});
 switcher.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('itong:set-season',{detail:{season:b.dataset.season}}))));
 window.addEventListener('itong:season-changed',e=>{switcher.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.season===e.detail.season)));});
 window.addEventListener('lab:ready',()=>{ready=true;sync();});
})();
