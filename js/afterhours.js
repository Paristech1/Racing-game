/* AFTERHOURS — Issue 01. Street racing in three.js (r128, global build). */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;

/* ---------------- DATA ---------------- */
const CARS=[
 {id:'kage',name:'KAGE R',paint:0xb9c4d0,metal:.9,rough:.26,rim:0x24272c,caliper:0xffc21a,wing:false,world:'ice',
  top:90,acc:22,grip:30,nitro:1.0,
  kick:'Specimen 01',loc:'Harbor Line',when:'Tunnel 7, 03:12',
  caption:'Found under a tarp on level B3. The owner never came back for it.',
  specs:'FLAT-PLANE V8 / TWIN-TURBO / 1,040 HP / 0–60 IN 2.3S',
  rival:'Rival note: the white one takes turn four flat. Don\'t follow it in.',
  note:'brakes late.\nway too late.', notePos:{l:'54%',t:'36%'},
  cam:{p:[3.9,0.5,4.7],l:[0,0.62,0.2],roll:.16,fov:34}},
 {id:'noctis',name:'NOCTIS GT',paint:0x06070a,metal:.25,rough:.1,rim:0xf0f3f7,chrome:true,caliper:0xd42020,wing:false,world:'flash',
  top:87,acc:20,grip:26,nitro:1.25,
  kick:'Street meet',loc:'Pier 9 Lot',when:'Thursday, 02:14',
  caption:'Shot at the Thursday meet. Chrome wheels, no plates, no story.',
  specs:'NAT-ASP V12 / 820 HP / REAR-DRIVE / STEEL CLUTCH',
  rival:'Rival note: heavy through the chicane. Save boost for the exits.',
  note:'slides like\nbutter.', notePos:{l:'8%',t:'38%'},
  cam:{p:[-4.6,1.0,3.1],l:[0,0.5,0.7],roll:-.06,fov:30}},
 {id:'vanta',name:'VANTA LM',paint:0xe8edf3,metal:.35,rough:.3,rim:0x111214,caliper:0x19c2ff,wing:true,world:'ice',
  top:86,acc:24,grip:34,nitro:.9,
  kick:'Archive',loc:'North Cut',when:'Last run, 04:40',
  caption:'Built for a circuit that isn\'t there anymore. Now it lives in the tunnels.',
  specs:'HYBRID V6 / 960 HP / ACTIVE AERO / CARBON TUB',
  rival:'Rival note: it won\'t lose you in corners. Beat it on the straights.',
  note:'glued to\nthe road.', notePos:{l:'58%',t:'33%'},
  cam:{p:[2.5,2.9,4.7],l:[0,0.3,0.2],roll:-.2,fov:34}}
];
CARS.push(
 {id:'kern',name:'KERN RS',body:'gt',cutaway:true,paint:0x0b0d11,metal:.35,rough:.12,rim:0x8a5a2b,bronze:true,caliper:0xc9a23a,wing:true,world:'white',
  top:89,acc:24,grip:33,nitro:1.0,mass:1.05,
  kick:'Cutaway',loc:'Studio 4',when:'Rear quarter in X-ray',
  caption:'Shot with the back half see-through. The engine was always the story.',
  specs:'FLAT-SIX HYBRID / 880 HP / REAR-ENGINE / ELECTRIC FRONT AXLE',
  rival:'Rival note: Apex hates it. Same line, more torque out of the U-turns.',
  note:'look at the\nmotor.', notePos:{l:'8%',t:'35%'},
  cam:{p:[-5.6,1.6,-4.6],l:[0,.65,-.5],roll:.05,fov:32}},
 {id:'dune',name:'DUNE-R',body:'suv',paint:0xd9dcdf,metal:.55,rough:.28,rim:0x8a5a2b,bronze:true,caliper:0x222428,wing:false,world:'desert',
  top:82,acc:25,grip:29,nitro:1.1,mass:1.7,
  kick:'Off the map',loc:'Salt Flat 3',when:'Last light, 19:48',
  caption:'Built to leave the tarmac. Tonight it doesn\'t have to.',
  specs:'TWIN-TURBO V8 HYBRID / 740 HP / 900 LB-FT / PORTAL AXLES',
  rival:'Rival note: Bruiser bounces off this one. Lean on him first.',
  note:'heavy. use\nthat.', notePos:{l:'56%',t:'32%'},
  cam:{p:[3.2,.9,5.4],l:[0,1.0,.4],roll:-.08,fov:34}},
 {id:'sovereign',name:'SOVEREIGN',body:'sedan',paint:0x040405,metal:.45,rough:.08,rim:0x0b0b0c,caliper:0x1a1a1a,wing:false,spokes:14,world:'flash',
  top:86,acc:21,grip:28,nitro:1.25,mass:1.5,
  kick:'Driveway',loc:'Old York Rd',when:'Sunday, 07:10',
  caption:'Chauffeur car from the outside. Nobody rides in the back.',
  specs:'TWIN-TURBO V12 / 790 HP / 830 LB-FT / WIDEBODY KIT',
  rival:'Rival note: The Wall can\'t hold you off in this. Push through.',
  note:'quiet until\nit isn\'t.', notePos:{l:'8%',t:'36%'},
  cam:{p:[3.9,.95,5.4],l:[0,.7,.3],roll:-.06,fov:32}},
 {id:'granfour',name:'GRAN FOUR',body:'fastback',paint:0x5b5f65,metal:.35,rough:.55,matte:true,rim:0x16181b,caliper:0xffc21a,wing:true,world:'ice',
  top:89,acc:22,grip:30,nitro:1.0,mass:1.35,
  kick:'Four doors',loc:'Forest Lot',when:'After rain, 05:30',
  caption:'Four doors, four seats, one driver who actually matters.',
  specs:'TWIN-TURBO V8 / 690 HP / 680 LB-FT / REAR-AXLE STEER',
  rival:'Rival note: Leech will sit behind you all race. Brake-check nothing.',
  note:'matte. don\'t\nwash it.', notePos:{l:'55%',t:'34%'},
  cam:{p:[4.8,.8,3.4],l:[0,.6,.2],roll:.1,fov:32}}
);
// full spec sheets (slide-up panel)
const SHEETS={
 kage:{engine:'4.0L flat-plane V8, twin-turbo',power:'1,040 hp',torque:'780 lb-ft',zero:'2.3 s',vmax:'221 mph',weight:'3,120 lb',drive:'Rear-wheel drive',gearbox:'7-speed dual-clutch'},
 noctis:{engine:'6.5L naturally aspirated V12',power:'820 hp',torque:'560 lb-ft',zero:'2.9 s',vmax:'212 mph',weight:'3,480 lb',drive:'Rear-wheel drive',gearbox:'6-speed manual, steel clutch'},
 vanta:{engine:'3.0L V6 + two e-motors',power:'960 hp',torque:'740 lb-ft',zero:'2.4 s',vmax:'205 mph',weight:'2,980 lb',drive:'All-wheel drive',gearbox:'8-speed sequential'},
 kern:{engine:'3.8L flat-six + front e-axle',power:'880 hp',torque:'690 lb-ft',zero:'2.5 s',vmax:'208 mph',weight:'3,250 lb',drive:'All-wheel drive (electric front)',gearbox:'8-speed dual-clutch'},
 dune:{engine:'4.0L twin-turbo V8 hybrid',power:'740 hp',torque:'900 lb-ft',zero:'3.1 s',vmax:'183 mph',weight:'5,100 lb',drive:'All-wheel drive, locking diffs',gearbox:'9-speed automatic'},
 sovereign:{engine:'6.0L twin-turbo V12',power:'790 hp',torque:'830 lb-ft',zero:'3.2 s',vmax:'196 mph',weight:'4,650 lb',drive:'Rear-wheel drive',gearbox:'9-speed automatic'},
 granfour:{engine:'4.0L twin-turbo V8',power:'690 hp',torque:'680 lb-ft',zero:'3.1 s',vmax:'199 mph',weight:'4,400 lb',drive:'All-wheel drive',gearbox:'9-speed wet-clutch'}
};
const GHOST_CAR={id:'ghost',name:'THE GHOST',paint:0x2b3038,metal:.7,rough:.35,rim:0x0d0e10,caliper:0xff5a1f,wing:true,top:89,acc:22,grip:30,nitro:1};
const LAPS=2;
/* Rival personas. Each one borrows a different idea from the racing-AI recon:
   APEX      racing-line robot, precise braking (Speed Dreams "simplix"/"usr" robots)
   THE WALL  refuses to let you by, the inverse of Speed Dreams "LetPass"
   LEECH     sits in the slipstream, then pulls out to pass (SuperTuxKart make_use_of_slipstream)
   BRUISER   low overtake caution, leans on you (Speed Dreams driver_aggression)
   THE CLOSER holds a boost reserve for the end (SuperTuxKart nitro skill + energy reserve)
   WILDCARD  late braking and random mistakes (Toybox-Rally mistake_rate, apex-circuit riskTolerance) */
const RIVALS=[
 {id:'apex',  tag:'APEX',      car:'KESTREL S', color:'#9fd3ff',paint:0x9fb4c8,metal:.9,rough:.2, rim:0x1a1c20,caliper:0x19c2ff,wing:false,top:90,acc:22,grip:32,nitro:1.0,
  P:{line:1.0,offScale:.15,wobble:0,  risk:1.0, rubber:.5, gain:.3,  mass:1,   start:.05, nitro:'exit'}},
 {id:'wall',  tag:'THE WALL',  car:'BASTION',   color:'#c9ced6',paint:0x2b3038,metal:.7,rough:.35,rim:0x0d0e10,caliper:0xff5a1f,wing:true, top:87,acc:21,grip:31,nitro:1.0,
  P:{line:.7, offScale:.5, wobble:.2, risk:.96, rubber:1.0,gain:.34, mass:1.3, start:.2,  nitro:'defend'}},
 {id:'leech', tag:'LEECH',     car:'REMORA',    color:'#5fe6c8',paint:0x1f4a4a,metal:.4,rough:.5, rim:0x111214,caliper:0x5fe6c8,wing:false,top:88,acc:23,grip:29,nitro:1.1,
  P:{line:.6, offScale:.3, wobble:.3, risk:.97, rubber:1.1,gain:.36, mass:1,   start:.25, nitro:'pass'}},
 {id:'bruiser',tag:'BRUISER',  car:'HAMMERHEAD',color:'#ff5a5a',paint:0x5a0f12,metal:.5,rough:.4, rim:0x0d0e10,caliper:0xffc21a,wing:true, top:87,acc:24,grip:28,nitro:1.0,
  P:{line:.5, offScale:.6, wobble:.4, risk:1.02,rubber:1.0,gain:.46, mass:1.9, start:.15, nitro:'eager'}},
 {id:'closer',tag:'THE CLOSER',car:'LAST CALL', color:'#f4f7ff',paint:0xeef0f2,metal:.3,rough:.25,rim:0xf0f3f7,chrome:true,caliper:0xd42020,wing:false,top:91,acc:21,grip:30,nitro:1.3,
  P:{line:.9, offScale:.2, wobble:.1, risk:.98, rubber:1.5,gain:.3,  mass:1,   start:.3,  nitro:'reserve'}},
 {id:'wild',  tag:'WILDCARD',  car:'LOOSE DICE',color:'#ffd23b',paint:0xc9a81a,metal:.6,rough:.3, rim:0x111214,caliper:0x7dff9a,wing:true, top:92,acc:23,grip:27,nitro:1.15,
  P:{line:.8, offScale:.8, wobble:2.2,risk:1.16,rubber:.8, gain:.32, mass:1,   start:-1,  nitro:'burst',mistakeRate:.2,mistakeStrength:.8}}
].map(r=>Object.assign(r,{name:r.car}));
{ const SEEK={apex:0,wall:.5,leech:1,bruiser:1,closer:1,wild:1}; RIVALS.forEach(r=>r.P.seek=SEEK[r.id]); }

let SAVE={};
try{ SAVE=JSON.parse(localStorage.getItem('afterhours.v1')||'{}')||{}; }catch(e){ SAVE={}; }
function persist(){ try{ localStorage.setItem('afterhours.v1',JSON.stringify(SAVE)); }catch(e){} }
function hist(id){ const h=SAVE[id]||(SAVE[id]={runs:0,wins:0,hits:0,last:0}); if(!h.bestBy){ h.bestBy={}; if(h.best) h.bestBy.tunnel=h.best; } return h; }

/* ---------------- RENDERER ---------------- */
const canvas=$('#gl');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;
const pmrem=new THREE.PMREMGenerator(renderer);

function canvasTex(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); return c; }
function CT(c,wrap){ const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=4; if(wrap){ t.wrapS=t.wrapT=THREE.RepeatWrapping; } return t; }
function makeEnv(kind){
  const c=canvasTex(1024,512,(g,w,h)=>{
    if(kind==='ice'){
      const gr=g.createLinearGradient(0,0,0,h);
      gr.addColorStop(0,'#030406');gr.addColorStop(.38,'#141b26');gr.addColorStop(.5,'#b9c8dc');gr.addColorStop(.58,'#3a4658');gr.addColorStop(1,'#06080b');
      g.fillStyle=gr;g.fillRect(0,0,w,h);
      g.fillStyle='#ffffff';
      for(let i=0;i<16;i++) g.fillRect(i*64+8,70+(i%3)*28,40,7);
      g.fillRect(0,150,w,4); g.fillRect(0,196,w,3);
      g.globalAlpha=.6; g.fillRect(300,20,420,30); g.globalAlpha=1;
    } else if(kind==='street'){
      const gr=g.createLinearGradient(0,0,0,h);
      gr.addColorStop(0,'#04060a');gr.addColorStop(.42,'#101828');gr.addColorStop(.5,'#3a4050');gr.addColorStop(.56,'#161b24');gr.addColorStop(1,'#050608');
      g.fillStyle=gr;g.fillRect(0,0,w,h);
      for(let i=0;i<60;i++){ const x=Math.random()*w,y=h*.36+Math.random()*h*.14,r=3+Math.random()*9;
        const rg=g.createRadialGradient(x,y,0,x,y,r); rg.addColorStop(0,i%5?'#dfe9ff':'#ffb36a'); rg.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=rg; g.fillRect(x-r,y-r,r*2,r*2); }
      g.fillStyle='#e8f0ff'; for(let i=0;i<10;i++) g.fillRect(i*104+20,60,30,5);
    } else {
      const gr=g.createLinearGradient(0,0,0,h);
      gr.addColorStop(0,'#0a0605');gr.addColorStop(.45,'#2a1810');gr.addColorStop(.52,'#6b4a33');gr.addColorStop(.62,'#1b120d');gr.addColorStop(1,'#050403');
      g.fillStyle=gr;g.fillRect(0,0,w,h);
      const cols=['#ff7a2a','#ff3a2a','#ffd08a','#4fd0ff'];
      for(let i=0;i<40;i++){ const x=Math.random()*w,y=h*.25+Math.random()*h*.3,r=6+Math.random()*22;
        const rg=g.createRadialGradient(x,y,0,x,y,r); rg.addColorStop(0,cols[i%4]); rg.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=rg; g.fillRect(x-r,y-r,r*2,r*2); }
      g.fillStyle='#fff6ea'; g.fillRect(430,160,170,90);
    }
  });
  const t=new THREE.CanvasTexture(c); t.mapping=THREE.EquirectangularReflectionMapping; t.encoding=THREE.sRGBEncoding;
  const rt=pmrem.fromEquirectangular(t); t.dispose(); return rt.texture;
}
const ENV={ice:makeEnv('ice'),flash:makeEnv('flash'),street:makeEnv('street')};

const glowTex=new THREE.CanvasTexture(canvasTex(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.25,'rgba(255,255,255,.5)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);}));
const poolTex=new THREE.CanvasTexture(canvasTex(128,128,(g)=>{const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(255,255,255,.9)');r.addColorStop(.45,'rgba(255,255,255,.35)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,128,128);}));
const shadowTex=new THREE.CanvasTexture(canvasTex(64,128,(g)=>{const r=g.createRadialGradient(32,64,4,32,64,62);r.addColorStop(0,'rgba(0,0,0,.85)');r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,64,128);}));
const smokeTex=new THREE.CanvasTexture(canvasTex(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(220,228,240,.55)');r.addColorStop(1,'rgba(220,228,240,0)');g.fillStyle=r;g.fillRect(0,0,64,64);}));

/* ---------------- CAR MODELS ---------------- */
function profileGeo(pts,base,depth,bevel){
  const s=new THREE.Shape(); s.moveTo(base[0][0],base[0][1]);
  s.splineThru(pts.map(p=>new THREE.Vector2(p[0],p[1])));
  for(let i=1;i<base.length;i++) s.lineTo(base[i][0],base[i][1]);
  const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel*.9,bevelSegments:4,steps:1,curveSegments:28});
  g.translate(0,0,-depth/2); g.rotateY(-Math.PI/2); return g;
}
const tireM=new THREE.MeshStandardMaterial({color:0x0b0b0c,roughness:.92});
const headM=new THREE.MeshBasicMaterial({color:0xeaf4ff,toneMapped:false});
const tailM=new THREE.MeshBasicMaterial({color:0xff1a2a,toneMapped:false});
const blackM=new THREE.MeshStandardMaterial({color:0x08090b,metalness:.4,roughness:.55});
function glowSprite(c,s){ const m=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:c,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true})); m.scale.set(s,s,s); return m; }
function shadowPlane(w,l){ const sh=new THREE.Mesh(new THREE.PlaneGeometry(w,l),new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false})); sh.rotation.x=-Math.PI/2; sh.position.y=.02; return sh; }
/* body families. y values are profile heights, x runs rear (-) to front (+) */
const BODIES={
 wedge:{pts:[[-2.3,.34],[-2.36,.66],[-2.24,.93],[-1.5,1.0],[-.6,1.02],[.4,.96],[1.3,.8],[1.95,.62],[2.34,.46],[2.36,.33]],base:.24,
   cab:[[-1.2,.95],[-.6,1.28],[.3,1.34],[.95,1.08],[1.35,.84]],cabBase:[-1.2,.92,1.35,.84],w:1.84,cw:1.3,wr:.37,wb:1.45,tr:.98,front:2.36,rear:2.36,headY:.64,tailY:.84,wingY:1.36,wingZ:-2.05},
 gt:{pts:[[-2.25,.36],[-2.34,.72],[-2.2,.9],[-1.5,1.0],[-.4,1.08],[.6,.95],[1.5,.77],[2.05,.6],[2.3,.45],[2.32,.33]],base:.25,
   cab:[[-1.75,.97],[-.95,1.32],[.1,1.4],[.78,1.12],[1.2,.9]],cabBase:[-1.75,.95,1.2,.9],w:1.92,cw:1.34,wr:.38,wb:1.4,tr:1.0,front:2.32,rear:2.34,headY:.66,tailY:.86,wingY:1.62,wingZ:-2.15,swan:true},
 suv:{pts:[[-2.35,.66],[-2.42,1.05],[-2.28,1.3],[-1.2,1.36],[0,1.38],[1.1,1.32],[1.85,1.16],[2.32,.96],[2.42,.74]],base:.52,
   cab:[[-2.05,1.3],[-1.25,1.78],[.2,1.84],[1.0,1.55],[1.5,1.3]],cabBase:[-2.05,1.28,1.5,1.28],w:2.0,cw:1.62,wr:.47,wb:1.55,tr:1.04,front:2.42,rear:2.42,headY:1.06,tailY:1.22,wingY:1.9,wingZ:-2.0},
 sedan:{pts:[[-2.45,.4],[-2.5,.8],[-2.32,.98],[-1.6,1.02],[-.6,1.0],[.5,.98],[1.4,.92],[2.1,.8],[2.46,.62],[2.5,.42]],base:.26,
   cab:[[-1.6,.98],[-1.05,1.42],[.35,1.46],[.95,1.22],[1.38,.96]],cabBase:[-1.6,.95,1.38,.94],w:1.94,cw:1.5,wr:.38,wb:1.58,tr:1.0,front:2.5,rear:2.5,headY:.74,tailY:.92,wingY:1.2,wingZ:-2.3},
 fastback:{pts:[[-2.42,.4],[-2.48,.76],[-2.34,.92],[-1.7,.97],[-.6,.99],[.5,.97],[1.4,.9],[2.1,.76],[2.44,.6],[2.48,.4]],base:.26,
   cab:[[-2.15,.94],[-1.3,1.28],[.3,1.4],[1.0,1.16],[1.42,.93]],cabBase:[-2.15,.92,1.42,.92],w:1.94,cw:1.46,wr:.38,wb:1.55,tr:1.0,front:2.48,rear:2.48,headY:.72,tailY:.86,wingY:1.08,wingZ:-2.3}
};
const bronzeM=()=>new THREE.MeshStandardMaterial({color:0x8a5a2b,metalness:1,roughness:.25});
function buildCar(def,opts){
  opts=opts||{}; const B=BODIES[def.body||'wedge'];
  const g=new THREE.Group();
  const paint=new THREE.MeshPhysicalMaterial({color:def.paint,metalness:def.metal,roughness:def.rough,clearcoat:def.matte?0:1,clearcoatRoughness:.06});
  const glass=new THREE.MeshPhysicalMaterial({color:0x05070a,metalness:1,roughness:.03,clearcoat:1});
  const bodyGeo=profileGeo(B.pts,[[B.pts[0][0]+.1,B.base],[B.pts[B.pts.length-1][0]-.1,B.base],[B.pts[0][0]+.1,B.base]],B.w,.14);
  const cut=opts.cut&&def.cutaway, cutZ=-.75;
  if(cut){ // X-ray rear quarter: front stays painted, rear becomes a clear shell over the drivetrain
    paint.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,0,1),-cutZ)];
    g.add(new THREE.Mesh(bodyGeo,paint));
    const shell=new THREE.MeshPhysicalMaterial({color:0x223246,metalness:.2,roughness:.05,transparent:true,opacity:.3,depthWrite:false,side:THREE.DoubleSide,clippingPlanes:[new THREE.Plane(new THREE.Vector3(0,0,-1),cutZ)]});
    g.add(new THREE.Mesh(bodyGeo,shell));
    const edge=new THREE.Mesh(new THREE.BoxGeometry(B.w+.3,.9,.02),new THREE.MeshBasicMaterial({color:0x9fd3ff,toneMapped:false,transparent:true,opacity:.35})); edge.position.set(0,.66,cutZ); g.add(edge);
    const chrome=new THREE.MeshStandardMaterial({color:0xc8ced6,metalness:1,roughness:.18}), dark=new THREE.MeshStandardMaterial({color:0x1a1d22,metalness:.8,roughness:.35});
    const eng=new THREE.Group(); eng.position.set(0,.55,-1.55); g.add(eng);
    const blockM=new THREE.Mesh(new THREE.BoxGeometry(1.0,.34,1.0),dark); eng.add(blockM);
    for(let i=0;i<3;i++) [-1,1].forEach(sd=>{ const c=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.34,14),chrome); c.rotation.z=Math.PI/2; c.position.set(sd*.66,.02,-.33+i*.33); eng.add(c);
      const h=new THREE.Mesh(new THREE.BoxGeometry(.06,.2,.22),dark); h.position.set(sd*.86,.02,-.33+i*.33); eng.add(h); });
    [-1,1].forEach(sd=>{ const t=new THREE.Mesh(new THREE.TorusGeometry(.13,.05,8,18),chrome); t.position.set(sd*.42,.3,.25); t.rotation.x=Math.PI/2; eng.add(t); });
    for(let i=0;i<9;i++){ const fin=new THREE.Mesh(new THREE.BoxGeometry(.9,.02,.36),chrome); fin.position.set(0,.36+i*.028,-.2); eng.add(fin); }
    const mot=new THREE.Mesh(new THREE.CylinderGeometry(.26,.26,.4,20),chrome); mot.rotation.z=Math.PI/2; mot.position.set(0,-.1,.62); eng.add(mot);
    const pack=new THREE.Mesh(new THREE.BoxGeometry(1.2,.2,.5),new THREE.MeshStandardMaterial({color:0x2a3b52,emissive:0x0c2a44,metalness:.4,roughness:.3})); pack.position.set(0,-.2,-.62); eng.add(pack);
    const hose=new THREE.MeshStandardMaterial({color:0x0b0b0c,roughness:.6});
    for(let i=0;i<5;i++){ const tb=new THREE.Mesh(new THREE.TorusGeometry(.35+i*.04,.018,6,20,Math.PI),hose); tb.position.set(-.3+i*.15,.1,.1); tb.rotation.y=Math.PI/2; eng.add(tb); }
  } else g.add(new THREE.Mesh(bodyGeo,paint));
  const cb=B.cabBase;
  g.add(new THREE.Mesh(profileGeo(B.cab,[[cb[0],cb[1]],[cb[2],cb[3]],[cb[0],cb[1]]],B.cw,.1),glass));
  const box=(w,h,d,m,x,y,z,ry)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);if(ry)b.rotation.y=ry;g.add(b);return b;};
  const hw=B.w/2+.12, F=B.front, Rr=B.rear;
  if(!cut){ box(.05,.2,.75,blackM,hw,B.base+.36,-.5); box(.05,.2,.75,blackM,-hw,B.base+.36,-.5); }
  box(1.6,.2,.3,blackM,0,B.base+.08,-Rr+.1); box(2.0,.12,.5,blackM,0,B.base+.01,F-.26);
  const hx=B.w*.36;
  box(.5,.05,.08,headM,hx,B.headY,F-.16,.38); box(.5,.05,.08,headM,-hx,B.headY,F-.16,-.38);
  box(B.w*.95,.05,.05,tailM,0,B.tailY,-Rr-.03);
  if(def.body==='sedan'||def.body==='suv'){ // upright grille
    const gr=box(1.1,.34,.06,new THREE.MeshStandardMaterial({color:0x07080a,metalness:.9,roughness:.2}),0,B.headY-.12,F-.02);
    for(let i=0;i<5;i++) box(.02,.3,.08,new THREE.MeshStandardMaterial({color:0x2a2e35,metalness:1,roughness:.2}),-.44+i*.22,B.headY-.12,F+.01); void gr; }
  if(def.wing){ const wy=B.wingY, wz=B.wingZ;
    if(B.swan){ [.5,-.5].forEach(x=>{ const p=box(.06,.62,.14,blackM,x,wy-.25,wz+.12); p.rotation.x=.35; }); const w=box(2.1,.06,.55,blackM,0,wy,wz); w.rotation.x=-.12;
      [1,-1].forEach(sd=>box(.04,.28,.6,blackM,sd*1.05,wy-.05,wz)); }
    else { box(.06,.42,.12,blackM,.55,wy-.24,wz+.05); box(.06,.42,.12,blackM,-.55,wy-.24,wz+.05); const w=box(2.05,.05,.46,def.chrome?blackM:paint,0,wy,wz); w.rotation.x=-.1; } }
  if(def.livery){ // original two-tone blade across each flank
    const lm=new THREE.MeshStandardMaterial({color:def.livery,roughness:.35,metalness:.2});
    [1,-1].forEach(sd=>{ const bl=new THREE.Mesh(new THREE.BoxGeometry(.02,.32,2.6),lm); bl.position.set(sd*(B.w/2+.13),B.base+.42,.35); bl.rotation.x=-.22; g.add(bl); }); }
  [[0xcfe6ff,1.1,hx+.04,B.headY,F-.06],[0xcfe6ff,1.1,-hx-.04,B.headY,F-.06],[0xff2030,1.0,.6,B.tailY,-Rr-.06],[0xff2030,1.0,-.6,B.tailY,-Rr-.06]].forEach(a=>{ const s=glowSprite(a[0],a[1]); s.position.set(a[2],a[3],a[4]); g.add(s); });
  g.add(shadowPlane(B.w+1.05,(F+Rr)*1.24));
  const rimM=def.bronze?bronzeM():new THREE.MeshStandardMaterial({color:def.rim,metalness:def.chrome?1:.8,roughness:def.chrome?.08:.3});
  const calM=new THREE.MeshStandardMaterial({color:def.caliper,roughness:.4,metalness:.2});
  const wheels=[], steers=[], wr=B.wr, sc=wr/.37;
  [[B.tr,B.wb],[-B.tr,B.wb],[B.tr,-B.wb],[-B.tr,-B.wb]].forEach(([x,z],i)=>{
    const holder=new THREE.Group(); holder.position.set(x,wr,z); g.add(holder);
    const spin=new THREE.Group(); spin.scale.setScalar(sc); holder.add(spin);
    const tire=new THREE.Mesh(new THREE.CylinderGeometry(.37,.37,.3,28),tireM); tire.rotation.z=Math.PI/2; spin.add(tire);
    const side=Math.sign(x);
    const disc=new THREE.Mesh(new THREE.CylinderGeometry(.27,.27,.02,24),rimM); disc.rotation.z=Math.PI/2; disc.position.x=side*.14; spin.add(disc);
    const lip=new THREE.Mesh(new THREE.TorusGeometry(.29,.025,6,28),rimM); lip.rotation.y=Math.PI/2; lip.position.x=side*.155; spin.add(lip);
    const spokes=def.spokes||6;
    for(let k=0;k<spokes;k++){ const s=new THREE.Mesh(new THREE.BoxGeometry(.03,.5,spokes>10?.03:.07),rimM); s.position.x=side*.16; s.rotation.x=k*Math.PI/spokes; spin.add(s); }
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.04,12),calM); hub.rotation.z=Math.PI/2; hub.position.x=side*.17; spin.add(hub);
    const cal=new THREE.Mesh(new THREE.BoxGeometry(.08,.18,.16),calM); cal.position.set(side*.05,.13*sc,-.05); holder.add(cal);
    wheels.push(spin); if(i<2) steers.push(holder);
  });
  return {group:g,wheels,steers,paint,def};
}
// everyday traffic car: boxy, generic
const trafficBodyGeo=new THREE.BoxGeometry(1.86,.72,4.5), trafficCabGeo=new THREE.BoxGeometry(1.62,.58,2.3), trafficWheelGeo=new THREE.CylinderGeometry(.34,.34,.26,14);
const trafficGlassM=new THREE.MeshStandardMaterial({color:0x07090d,metalness:.9,roughness:.15});
function buildTrafficCar(color){
  const g=new THREE.Group();
  const m=new THREE.MeshStandardMaterial({color,metalness:.55,roughness:.35});
  const b=new THREE.Mesh(trafficBodyGeo,m); b.position.y=.62; g.add(b);
  const c=new THREE.Mesh(trafficCabGeo,trafficGlassM); c.position.set(0,1.26,-.25); g.add(c);
  const hl=new THREE.Mesh(new THREE.BoxGeometry(1.5,.12,.05),headM); hl.position.set(0,.72,2.26); g.add(hl);
  const tl=new THREE.Mesh(new THREE.BoxGeometry(1.6,.1,.05),tailM); tl.position.set(0,.8,-2.26); g.add(tl);
  [[.6,.75,2.3,0xdfe9ff,1.3],[-.6,.75,2.3,0xdfe9ff,1.3],[.62,.8,-2.32,0xff2030,.9],[-.62,.8,-2.32,0xff2030,.9]].forEach(a=>{ const s=glowSprite(a[3],a[4]); s.position.set(a[0],a[1],a[2]); g.add(s); });
  const wheels=[];
  [[.9,1.45],[-.9,1.45],[.9,-1.45],[-.9,-1.45]].forEach(([x,z])=>{ const w=new THREE.Mesh(trafficWheelGeo,tireM); w.rotation.z=Math.PI/2; w.position.set(x,.34,z); g.add(w); wheels.push(w); });
  g.add(shadowPlane(2.7,5.6));
  return {group:g,wheels};
}

/* ---------------- TRACKS ---------------- */
const UP=new THREE.Vector3(0,1,0);
function makeTrack(pts,W,H){
  const N=pts.length; let L=0; for(let i=0;i<N;i++) L+=pts[i].distanceTo(pts[(i+1)%N]);
  const ds=L/N, T=[], R=[], K=[], raw=[];
  for(let i=0;i<N;i++){ T.push(new THREE.Vector3().subVectors(pts[(i+1)%N],pts[(i-1+N)%N]).normalize()); }
  for(let i=0;i<N;i++){ R.push(new THREE.Vector3().crossVectors(T[i],UP).normalize()); }
  for(let i=0;i<N;i++){ const a=T[(i-1+N)%N], b=T[(i+1)%N]; raw.push(-Math.atan2(a.x*b.z-a.z*b.x, a.x*b.x+a.z*b.z)/(2*ds)); }
  const win=Math.max(4,Math.round(12/ds));
  for(let i=0;i<N;i++){ let s=0; for(let j=-win;j<=win;j++) s+=raw[(i+j+N)%N]; K.push(s/(2*win+1)); }
  // make sure positive K means a left turn (center of curvature on the -R side)
  let bi=0; for(let k=0;k<N;k++) if(Math.abs(K[k])>Math.abs(K[bi])) bi=k;
  const kb=K[bi]; if(Math.abs(kb)>1e-6){
    const cA=new THREE.Vector3().copy(pts[bi]).addScaledVector(R[bi],-1/kb), cB=new THREE.Vector3().copy(pts[bi]).addScaledVector(R[bi],1/kb);
    const mid=pts[(bi+Math.round(8/ds))%N]; if(mid.distanceTo(cB)<mid.distanceTo(cA)) for(let k=0;k<N;k++) K[k]=-K[k]; }
  return {pts,T,R,K,L,N,ds,W,H};
}
let TR=null;
function frame(s,o,tr){ tr=tr||TR; const L=tr.L,N=tr.N; s=((s%L)+L)%L; const f=s/L*N, i=Math.floor(f)%N, a=f-Math.floor(f), j=(i+1)%N;
  o.p.lerpVectors(tr.pts[i],tr.pts[j],a); o.t.lerpVectors(tr.T[i],tr.T[j],a).normalize(); o.r.lerpVectors(tr.R[i],tr.R[j],a).normalize(); o.k=tr.K[i]*(1-a)+tr.K[j]*a; return o; }
const mkF=()=>({p:new THREE.Vector3(),t:new THREE.Vector3(),r:new THREE.Vector3(),k:0});
function orientQ(f,q,basis,nr){ nr.copy(f.r).negate(); basis.makeBasis(nr,UP,f.t); q.setFromRotationMatrix(basis); return q; }

function ribbon(tr,S,offA,offB,yA,yB,mat,vScale){
  vScale=vScale||24; const N=tr.N;
  const pos=new Float32Array((N+1)*6), uv=new Float32Array((N+1)*4), idx=[];
  for(let i=0;i<=N;i++){ const k=i%N,p=tr.pts[k],r=tr.R[k];
    pos.set([p.x+r.x*offA,p.y+yA,p.z+r.z*offA,p.x+r.x*offB,p.y+yB,p.z+r.z*offB],i*6);
    const v=i*tr.ds/vScale; uv.set([0,v,1,v],i*4);
    if(i<N){const a=i*2; idx.push(a,a+1,a+2,a+1,a+3,a+2);} }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3)); g.setAttribute('uv',new THREE.BufferAttribute(uv,2)); g.setIndex(idx); g.computeVertexNormals();
  const m=new THREE.Mesh(g,mat); S.add(m); return m;
}

/* ---- Event 01: Harbor Line tunnel ---- */
function buildTunnel(){
  const ctrl=[[0,0,0],[0,0,-260],[60,6,-420],[220,10,-470],[380,6,-400],[430,0,-240],[360,-4,-80],[420,0,80],[380,6,240],[220,10,300],[60,4,260],[-40,0,140]].map(p=>new THREE.Vector3(p[0],p[1],p[2]));
  const curve=new THREE.CatmullRomCurve3(ctrl,true,'centripetal');
  const tr=makeTrack(curve.getSpacedPoints(1600).slice(0,1600),8,7.5);
  const W=tr.W,H=tr.H;
  const S=new THREE.Scene();
  S.fog=new THREE.FogExp2(0x8a9cb4,0.0072); S.background=new THREE.Color(0x8a9cb4); S.environment=ENV.ice;
  S.userData.bloom={strength:.45,radius:.4,threshold:.9};
  S.add(new THREE.HemisphereLight(0xd6e4ff,0x0a0d12,.9));
  const dl=new THREE.DirectionalLight(0xe8f0ff,.6); dl.position.set(0,1,.3); S.add(dl);
  const roadTex=CT(canvasTex(256,512,(g,w,h)=>{
    g.fillStyle='#1a1d22'; g.fillRect(0,0,w,h);
    for(let i=0;i<5000;i++){ const v=20+Math.random()*30; g.fillStyle=`rgba(${v},${v+3},${v+8},.6)`; g.fillRect(Math.random()*w,Math.random()*h,1.5,1.5); }
    g.fillStyle='rgba(235,240,248,.85)'; g.fillRect(w*.035,0,4,h); g.fillRect(w*.965-4,0,4,h);
    g.fillStyle='rgba(235,240,248,.7)'; [.34,.66].forEach(u=>g.fillRect(w*u-2,0,4,h*.45));
    g.fillStyle='rgba(0,0,0,.25)'; for(let i=0;i<6;i++) g.fillRect(w*(.2+i*.12),0,10,h);
  }),true);
  ribbon(tr,S,-W-.3,W+.3,.01,.01,new THREE.MeshStandardMaterial({map:roadTex,roughness:.42,metalness:.15,side:THREE.DoubleSide}),24);
  const barrierM=new THREE.MeshStandardMaterial({color:0x14181e,roughness:.4,metalness:.5,side:THREE.DoubleSide});
  const wallM=new THREE.MeshStandardMaterial({color:0xb2bfd0,roughness:.95,emissive:0x2a3444,side:THREE.DoubleSide});
  const stripeM=new THREE.MeshBasicMaterial({color:0xe6f2ff,toneMapped:false,side:THREE.DoubleSide});
  [-1,1].forEach(sd=>{ const o=sd*(W+.3), oi=sd*(W+.25);
    ribbon(tr,S,o,o,0,1.1,barrierM); ribbon(tr,S,o,o,1.1,H,wallM); ribbon(tr,S,oi,oi,1.18,1.3,stripeM); });
  ribbon(tr,S,-W-.3,W+.3,H,H,new THREE.MeshBasicMaterial({color:0x030406,side:THREE.DoubleSide}));
  const f=mkF(), m4=new THREE.Matrix4(), q=new THREE.Quaternion(), sc=new THREE.Vector3(1,1,1), p=new THREE.Vector3(), basis=new THREE.Matrix4(), nr=new THREE.Vector3();
  const lightM=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false});
  const nStrip=Math.floor(tr.L/13), strips=new THREE.InstancedMesh(new THREE.BoxGeometry(.4,.08,8),lightM,nStrip*2);
  let c=0; for(let i=0;i<nStrip;i++){ frame(i*13,f,tr); orientQ(f,q,basis,nr);
    [-3.4,3.4].forEach(x=>{ p.copy(f.p).addScaledVector(f.r,x); p.y+=H-.08; m4.compose(p,q,sc); strips.setMatrixAt(c++,m4); }); }
  S.add(strips);
  const nSl=Math.floor(tr.L/34), slits=new THREE.InstancedMesh(new THREE.BoxGeometry(.08,3.6,.7),lightM,nSl*2);
  c=0; for(let i=0;i<nSl;i++){ frame(i*34+6,f,tr); orientQ(f,q,basis,nr);
    [-(W+.2),W+.2].forEach(x=>{ p.copy(f.p).addScaledVector(f.r,x); p.y+=3.4; m4.compose(p,q,sc); slits.setMatrixAt(c++,m4); }); }
  S.add(slits);
  frame(0,f,tr); orientQ(f,q,basis,nr);
  const gan=new THREE.Mesh(new THREE.BoxGeometry(2*W,.35,.35),new THREE.MeshBasicMaterial({color:0xff2a3a,toneMapped:false}));
  gan.position.copy(f.p); gan.position.y+=H-.6; gan.quaternion.copy(q); S.add(gan);
  addStartLine(S,f,q,2*W);
  return {scene:S,track:tr,traffic:[],cams:[],update:null};
}
function addStartLine(S,f,q,w){
  const chk=new THREE.CanvasTexture(canvasTex(128,16,(g)=>{for(let x=0;x<16;x++)for(let y=0;y<2;y++){g.fillStyle=(x+y)%2?'#e8ecf2':'#111';g.fillRect(x*8,y*8,8,8);}}));
  const line=new THREE.Mesh(new THREE.PlaneGeometry(w,1.4),new THREE.MeshBasicMaterial({map:chk,transparent:true,opacity:.8}));
  line.position.copy(f.p); line.position.y+=.035; line.quaternion.copy(q); line.rotateX(-Math.PI/2); S.add(line);
}

/* ---- Event 02: Roosevelt Blvd, Tyson Av to Cottman Av ---- */
function rng(seed){ let s=seed>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
function buildBlvd(){
  const R0=25, zS=800, zN=-800, z0=-40;
  const e1=z0-zN, arc=Math.PI*R0, wS=zS-zN, e2=zS-z0, total=e1+arc+wS+arc+e2, n=Math.round(total);
  const pts=[];
  for(let i=0;i<n;i++){ let s=i*total/n, x,z;
    if(s<e1){ x=R0; z=z0-s; }
    else if((s-=e1)<arc){ const th=s/R0; x=R0*Math.cos(th); z=zN-R0*Math.sin(th); }
    else if((s-=arc)<wS){ x=-R0; z=zN+s; }
    else if((s-=wS)<arc){ const th=s/R0; x=-R0*Math.cos(th); z=zS+R0*Math.sin(th); }
    else { s-=arc; x=R0; z=zS-s; }
    pts.push(new THREE.Vector3(x,0,z)); }
  const tr=makeTrack(pts,6,6);
  const S=new THREE.Scene();
  S.userData.bloom={strength:.95,radius:.5,threshold:.72};
  S.background=CT(canvasTex(8,256,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#03050a'); gr.addColorStop(.55,'#0b1322'); gr.addColorStop(.8,'#1c2232'); gr.addColorStop(1,'#2a2830'); g.fillStyle=gr; g.fillRect(0,0,w,h); }));
  S.fog=new THREE.FogExp2(0x121a28,0.0052); S.environment=ENV.street;
  S.add(new THREE.HemisphereLight(0x8fa6cc,0x0b0d12,.6));
  const moon=new THREE.DirectionalLight(0xbcd0ff,.35); moon.position.set(-1,2,1); S.add(moon);

  const BAND_H=[798,834], BAND_T=[-2,32], BAND_C=[-834,-798], ZMIN=-990, ZMAX=990;
  const BANDS=[BAND_H,BAND_T,BAND_C];
  const exY=z=> z>-680?0:(z<-770?-6.5:-6.5*(1-Math.cos(Math.PI*(-680-z)/90))/2);
  const segsAll=[[ZMAX,BAND_H[1]],[BAND_H[0],BAND_T[1]],[BAND_T[0],BAND_C[1]],[BAND_C[0],ZMIN]];
  const segsExp=[[ZMAX,BAND_H[1]],[BAND_H[0],BAND_T[1]],[BAND_T[0],ZMIN]];
  const R_=rng(1917);

  // materials
  const asphaltTex=CT(canvasTex(512,512,(g,w,h)=>{
    g.fillStyle='#17191d'; g.fillRect(0,0,w,h);
    for(let i=0;i<14000;i++){ const v=18+Math.random()*26; g.fillStyle=`rgba(${v},${v+2},${v+6},.7)`; g.fillRect(Math.random()*w,Math.random()*h,1.6,1.6); }
    for(let i=0;i<7;i++){ g.fillStyle=`rgba(${8+Math.random()*10|0},${9+Math.random()*10|0},${12+Math.random()*10|0},.55)`; g.fillRect(Math.random()*w,Math.random()*h,40+Math.random()*140,20+Math.random()*90); }
    g.strokeStyle='rgba(5,5,6,.6)'; g.lineWidth=1.4; for(let i=0;i<12;i++){ g.beginPath(); let x=Math.random()*w,y=Math.random()*h; g.moveTo(x,y); for(let k=0;k<6;k++){ x+=(Math.random()-.5)*50; y+=Math.random()*40; g.lineTo(x,y); } g.stroke(); }
  }),true);
  const asphaltM=new THREE.MeshStandardMaterial({map:asphaltTex,roughness:.5,metalness:.12});
  const lotM=new THREE.MeshStandardMaterial({map:asphaltTex,color:0x9aa0aa,roughness:.8,metalness:.05});
  const concreteM=new THREE.MeshStandardMaterial({color:0x5b616b,roughness:.9});
  const curbM=new THREE.MeshStandardMaterial({color:0x6e737c,roughness:.85});
  const grassM=new THREE.MeshStandardMaterial({color:0x121c16,roughness:1});
  const groundM=new THREE.MeshStandardMaterial({color:0x0b0d11,roughness:1});

  function quad(x0,x1,z0,z1,y,mat,sc){ sc=sc||8; const a=Math.min(x0,x1),b=Math.max(x0,x1),c=Math.min(z0,z1),d=Math.max(z0,z1);
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(new Float32Array([a,y,c, b,y,c, a,y,d, b,y,d]),3));
    g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array([a/sc,c/sc, b/sc,c/sc, a/sc,d/sc, b/sc,d/sc]),2));
    g.setIndex([0,2,1,1,2,3]); g.computeVertexNormals(); const m=new THREE.Mesh(g,mat); S.add(m); return m; }
  function profQuad(x0,x1,z0,z1,yf,mat,sc){ sc=sc||8; const a=Math.min(x0,x1),b=Math.max(x0,x1),hi=Math.max(z0,z1),lo=Math.min(z0,z1);
    const steps=Math.max(1,Math.ceil((hi-lo)/5)), pos=[], uv=[], idx=[];
    for(let i=0;i<=steps;i++){ const z=lo+(hi-lo)*i/steps, y=yf(z); pos.push(a,y,z, b,y,z); uv.push(a/sc,z/sc, b/sc,z/sc);
      if(i<steps){ const k=i*2; idx.push(k,k+2,k+1,k+1,k+2,k+3); } }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2)); g.setIndex(idx); g.computeVertexNormals();
    const m=new THREE.Mesh(g,mat); S.add(m); return m; }
  function profWall(x,z0,z1,ybot,ytop,mat){ const hi=Math.max(z0,z1),lo=Math.min(z0,z1), steps=Math.max(1,Math.ceil((hi-lo)/5)), pos=[], idx=[];
    for(let i=0;i<=steps;i++){ const z=lo+(hi-lo)*i/steps; pos.push(x,ybot(z),z, x,ytop(z),z); if(i<steps){ const k=i*2; idx.push(k,k+2,k+1,k+1,k+2,k+3); } }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setIndex(idx); g.computeVertexNormals();
    const m=new THREE.Mesh(g,mat); S.add(m); return m; }
  function box(w,h,d,mat,x,y,z){ const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat); m.position.set(x,y,z); S.add(m); return m; }

  // ground: local lanes + side medians + sidewalks base, express trough, cross streets, lots
  [-1,1].forEach(sd=>{ quad(sd*14,sd*35,ZMIN,ZMAX,0,asphaltM); quad(sd*35,sd*112,ZMIN,ZMAX,.004,lotM); quad(sd*112,sd*700,-1500,1500,-.02,groundM); });
  profQuad(-14,14,ZMIN,ZMAX,exY,asphaltM);
  quad(-260,260,BAND_T[0],BAND_T[1],.012,asphaltM);
  quad(-260,260,BAND_H[0],BAND_H[1],.012,asphaltM);
  [-1,1].forEach(sd=>quad(sd*14.5,sd*260,BAND_C[0],BAND_C[1],.012,asphaltM));
  quad(-14.5,14.5,BAND_C[0],BAND_C[1],.014,asphaltM);
  box(29,1.4,36,concreteM,0,-.69,(BAND_C[0]+BAND_C[1])/2); // Cottman bridge deck over the express lanes
  [BAND_C[0]+.3,BAND_C[1]-.3].forEach(z=>box(28,.9,.45,concreteM,0,.45,z));
  // medians and sidewalks
  segsAll.forEach(([za,zb])=>{ const len=za-zb, zc=(za+zb)/2;
    [-1,1].forEach(sd=>{ box(5,.18,len,curbM,sd*16.5,.09,zc); box(4.5,.02,len-.5,grassM,sd*16.5,.19,zc); box(4,.15,len,curbM,sd*33,.075,zc); }); });
  segsExp.forEach(([za,zb])=>{ profQuad(-3,3,zb,za,z=>exY(z)+.2,grassM); [-3,3].forEach(x=>profWall(x,zb,za,exY,z=>exY(z)+.2,new THREE.MeshStandardMaterial({color:0x6e737c,roughness:.85,side:THREE.DoubleSide}))); });
  // retaining walls where the express lanes drop under Cottman
  const wallM=new THREE.MeshStandardMaterial({color:0x7d848e,roughness:.95,side:THREE.DoubleSide});
  [-14,14].forEach(x=>{ profWall(x,-676,ZMIN,exY,()=>.2,wallM); });
  [[-690,BAND_C[1]],[BAND_C[0],ZMIN]].forEach(([za,zb])=>[-14.2,14.2].forEach(x=>box(.4,1,za-zb,concreteM,x,.5,(za+zb)/2)));

  // lane markings (instanced 3 m pieces)
  const whites=[], yellows=[], m4=new THREE.Matrix4(), q0=new THREE.Quaternion(), one=new THREE.Vector3(1,1,1), pv=new THREE.Vector3(), eul=new THREE.Euler();
  function line(arr,x,za,zb,dashed,yf){ const step=dashed?12:3; for(let z=za-1.5;z>zb+1.5;z-=step){ const y=yf?yf(z):0; const y2=yf?yf(z-1.5)-yf(z+1.5):0;
      eul.set(Math.atan2(y2,3),0,0); q0.setFromEuler(eul); pv.set(x,y+.03,z); m4.compose(pv,q0,one); arr.push(m4.clone()); } }
  [-1,1].forEach(sd=>{
    segsAll.forEach(([za,zb])=>{
      line(yellows,sd*19.3,za,zb,false); line(whites,sd*22.6,za,zb,true); line(whites,sd*26.2,za,zb,true); line(whites,sd*29.8,za,zb,false); });
    segsExp.forEach(([za,zb])=>{
      line(yellows,sd*3.3,za,zb,false,exY); line(whites,sd*6.9,za,zb,true,exY); line(whites,sd*10.5,za,zb,true,exY); line(whites,sd*13.7,za,zb,false,exY); });
  });
  // crosswalk bars at both intersections
  const zebra=[];
  [BAND_H[0],BAND_H[1],BAND_T[0],BAND_T[1],BAND_C[0],BAND_C[1]].forEach(ze=>{ const inward=(ze===BAND_T[0]||ze===BAND_C[0]||ze===BAND_H[0])?1:-1;
    for(let x=-34.5;x<=34.5;x+=1.15){ pv.set(x,.035,ze+inward*1.9); m4.compose(pv,new THREE.Quaternion(),one); zebra.push(m4.clone()); } });
  const markGeo=new THREE.BoxGeometry(.15,.02,3);
  const mkInst=(geo,mat,arr)=>{ const im=new THREE.InstancedMesh(geo,mat,arr.length); arr.forEach((m,i)=>im.setMatrixAt(i,m)); S.add(im); return im; };
  mkInst(markGeo,new THREE.MeshBasicMaterial({color:0xc9ced6}),whites);
  mkInst(markGeo,new THREE.MeshBasicMaterial({color:0xc9a23a}),yellows);
  mkInst(new THREE.BoxGeometry(.55,.02,3),new THREE.MeshBasicMaterial({color:0xb9bec6}),zebra);
  const f0=mkF(), qS=new THREE.Quaternion(); frame(0,f0,tr); orientQ(f0,qS,new THREE.Matrix4(),new THREE.Vector3()); addStartLine(S,f0,qS,11);

  // street lights on the side medians: poles, arms, heads, light pools, flares
  const poleM=new THREE.MeshStandardMaterial({color:0x2a2e35,metalness:.7,roughness:.4});
  const lampM=new THREE.MeshBasicMaterial({color:0xeaf2ff,toneMapped:false});
  const poles=[], arms=[], heads=[], pools=[], flarePos=[];
  const inBand=z=>BANDS.some(b=>z>b[0]-3&&z<b[1]+3);
  for(let z=ZMAX-8;z>ZMIN;z-=42){ if(inBand(z)) continue;
    [-1,1].forEach(sd=>{ const x=sd*16.5;
      pv.set(x,5,z); m4.compose(pv,new THREE.Quaternion(),one); poles.push(m4.clone());
      pv.set(x,10,z); m4.compose(pv,new THREE.Quaternion(),one); arms.push(m4.clone());
      [x-3.6,x+3.6].forEach(hx=>{ pv.set(hx,9.85,z); m4.compose(pv,new THREE.Quaternion(),one); heads.push(m4.clone()); flarePos.push(hx,9.7,z);
        const gy=Math.abs(hx)<14?exY(z)+.04:.04; pv.set(hx,gy,z); m4.compose(pv,new THREE.Quaternion(),new THREE.Vector3(1,1,1)); pools.push(m4.clone()); }); }); }
  mkInst(new THREE.CylinderGeometry(.14,.2,10,8),poleM,poles);
  mkInst(new THREE.BoxGeometry(7.6,.14,.2),poleM,arms);
  mkInst(new THREE.BoxGeometry(1.1,.22,.5),lampM,heads);
  const poolGeo=new THREE.PlaneGeometry(16,16); poolGeo.rotateX(-Math.PI/2);
  mkInst(poolGeo,new THREE.MeshBasicMaterial({map:poolTex,color:0x6f86b0,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}),pools);
  const fg=new THREE.BufferGeometry(); fg.setAttribute('position',new THREE.Float32BufferAttribute(flarePos,3));
  S.add(new THREE.Points(fg,new THREE.PointsMaterial({map:glowTex,color:0xdfe9ff,size:3.2,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false})));

  // median trees
  const trunks=[], crowns=[];
  for(let z=ZMAX-29;z>ZMIN;z-=21){ if(inBand(z)) continue; [-1,1].forEach(sd=>{ const s=.8+R_()*.5;
    pv.set(sd*16.5,1.5,z); m4.compose(pv,new THREE.Quaternion(),one); trunks.push(m4.clone());
    pv.set(sd*16.5,4.3,z); m4.compose(pv,new THREE.Quaternion().setFromEuler(new THREE.Euler(R_(),R_()*3,0)),new THREE.Vector3(s*1.1,s,s*1.1)); crowns.push(m4.clone()); }); }
  mkInst(new THREE.CylinderGeometry(.16,.22,3,6),new THREE.MeshStandardMaterial({color:0x1d1813,roughness:1}),trunks);
  mkInst(new THREE.IcosahedronGeometry(2.3,0),new THREE.MeshStandardMaterial({color:0x16241b,roughness:1,flatShading:true}),crowns);

  // signs
  function signCanvas(text,opts){ opts=opts||{}; const w=opts.w||512, h=opts.h||96;
    return canvasTex(w,h,(g)=>{ g.fillStyle=opts.bg||'#0a0c10'; g.fillRect(0,0,w,h);
      g.font=`${opts.weight||800} ${opts.size||(h*.62|0)}px "Archivo Narrow","Arial Narrow",Arial,sans-serif`; g.textAlign='center'; g.textBaseline='middle';
      if(opts.glow){ g.shadowColor=opts.color; g.shadowBlur=opts.glow; }
      g.fillStyle=opts.color||'#fff'; g.fillText(text,w/2,h/2+2,w*.92);
      if(opts.border){ g.shadowBlur=0; g.strokeStyle=opts.color||'#fff'; g.lineWidth=4; g.strokeRect(6,6,w-12,h-12); } }); }
  function faceRoad(mesh,sd){ mesh.rotation.y=-sd*Math.PI/2; return mesh; }
  function signPlane(text,w,h,x,y,z,sd,opts){ const mat=new THREE.MeshBasicMaterial({map:CT(signCanvas(text,opts)),toneMapped:false,transparent:!!opts.transparent});
    const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat); m.position.set(x,y,z); faceRoad(m,sd); S.add(m); return m; }

  // traffic signals on mast arms, with street-name blades
  const lampMats={r:[],y:[],g:[]};
  function signal(px,pz,armTo,facing,names){
    box(.3,7.2,.3,poleM,px,3.6,pz);
    const armLen=Math.abs(armTo-px); box(armLen,.22,.22,poleM,(px+armTo)/2,6.9,pz);
    const dir=Math.sign(armTo-px);
    for(let k=0;k<3;k++){ const hx=px+dir*(armLen-1.2-k*3.6);
      box(.46,1.25,.42,blackM,hx,6.2,pz+facing*.05);
      [['r',6.6],['y',6.2],['g',5.8]].forEach(([c,y])=>{ const m=new THREE.MeshBasicMaterial({color:0x222,toneMapped:false}); lampMats[c].push(m);
        const l=new THREE.Mesh(new THREE.CircleGeometry(.14,12),m); l.position.set(hx,y,pz+facing*.27); if(facing<0) l.rotation.y=Math.PI; S.add(l); }); }
    names.forEach((nm,i)=>{ const tex=CT(signCanvas(nm,{bg:'#0f5a32',color:'#f4f7f2',size:54,weight:700}));
      const blade=new THREE.Mesh(new THREE.BoxGeometry(i?.06:2.6,.5,i?2.6:.06),new THREE.MeshBasicMaterial({map:tex})); blade.position.set(px+(i?0:dir*1.4),7.6+i*.6,pz+(i?facing*1.3:0)); S.add(blade); });
  }
  signal(33,-796.5,18.6,1,['Cottman Av','Roosevelt Blvd']);
  signal(-33,-835.5,-18.6,-1,['Cottman Av','Roosevelt Blvd']);
  signal(-33,-2.5,-18.6,-1,['Tyson Av','Roosevelt Blvd']);
  signal(33,32.5,18.6,1,['Tyson Av','Roosevelt Blvd']);
  signal(33,834.5,18.6,1,['Harbison Av','Roosevelt Blvd']);
  signal(-33,797.5,-18.6,-1,['Harbison Av','Roosevelt Blvd']);
  // express-lane signals at Tyson hang from the side medians
  signal(16.5,33,4,1,['Tyson Av','Roosevelt Blvd']); signal(-16.5,-3,-4,-1,['Tyson Av','Roosevelt Blvd']);

  // speed cameras (one each direction)
  function speedCam(x,z,facing){ box(.22,5.2,.22,poleM,x,2.6,z); box(.7,.55,1.1,new THREE.MeshStandardMaterial({color:0xd8dbe0,roughness:.5}),x,5.3,z);
    const led=glowSprite(0xff3030,.6); led.position.set(x,5.3,z+facing*.6); S.add(led);
    signPlane('SPEED CAMERA',2.2,.5,x+(x>0?1.2:-1.2),3.4,z,x>0?1:-1,{bg:'#f2f2ee',color:'#101114',size:52}); }
  speedCam(18.2,-420,1); speedCam(-18.2,-380,-1); speedCam(18.2,420,1); speedCam(-18.2,380,-1);

  // bus shelters
  const shelterM=new THREE.MeshStandardMaterial({color:0x9fb2c8,metalness:.2,roughness:.1,transparent:true,opacity:.35,emissive:0x1a2a3a});
  [[1,-150],[1,-560],[1,300],[1,650],[-1,-240],[-1,-660],[-1,210],[-1,560]].forEach(([sd,z])=>{ box(1.6,2.4,4.2,shelterM,sd*33.6,1.35,z); box(1.8,.12,4.4,poleM,sd*33.6,2.6,z);
    const ad=new THREE.Mesh(new THREE.PlaneGeometry(1.4,2),new THREE.MeshBasicMaterial({color:0xe8eef8,toneMapped:false})); ad.position.set(sd*33.6,1.3,z-2.12); S.add(ad); });

  // ---- buildings along both sides (lit windows via emissive maps) ----
  const STORES=['PIZZA','NAILS','CHECK CASHING','PHARMACY','WIRELESS','LAUNDROMAT','TAKEOUT','DENTAL','TIRES','BEAUTY SUPPLY','DOLLAR STORE','INSURANCE','TAX SERVICE','DELI','BAKERY','BARBER','PAWN','LIQUORS'];
  const SIGNCOL=['#ff3b3b','#ffd23b','#6fe3ff','#ff6fd8','#f4f7ff','#7dff9a'];
  const warm=['#ffd79a','#ffc57a','#ffe6bf'], cool=['#cfe3ff','#a9c8ff'];
  const darkM=new THREE.MeshStandardMaterial({color:0x14110f,roughness:.95}), roofM=new THREE.MeshStandardMaterial({color:0x08090b,roughness:1});
  function facadeBox(len,h,d,x,z,sd,draw,cw,ch,emisI){
    const base=canvasTex(cw,ch,(g)=>draw(g,false)), emis=canvasTex(cw,ch,(g)=>draw(g,true));
    const fm=new THREE.MeshStandardMaterial({map:CT(base),emissive:0xffffff,emissiveMap:CT(emis),emissiveIntensity:emisI||1,roughness:.85});
    const mats=[darkM,darkM,roofM,roofM,darkM,darkM]; mats[sd>0?1:0]=fm;
    const m=new THREE.Mesh(new THREE.BoxGeometry(d,h,len),mats); m.position.set(x,h/2,z); S.add(m); return m; }
  function rowhomes(sd,zc,len){ const units=Math.max(5,Math.round(len/5.5)), L2=units*5.5, cw=units*64, ch=128;
    const lit=[]; for(let u=0;u<units*6;u++) lit.push(R_()<.42); const cols=[]; for(let u=0;u<units;u++) cols.push(['#3a2520','#2f211d','#45302a','#35251f','#3b2a24'][(u*3+(R_()*5|0))%5]);
    const aw=[]; for(let u=0;u<units;u++) aw.push(['#6a1c1c','#1c3a5e','#2a4a2a','#3d3d3d','#5a4a1c'][R_()*5|0]);
    facadeBox(L2,8.6,12,sd*62,zc,sd,(g,em)=>{ g.fillStyle='#000'; g.fillRect(0,0,cw,ch);
      for(let u=0;u<units;u++){ const ox=u*64;
        if(!em){ g.fillStyle=cols[u]; g.fillRect(ox,0,64,ch); g.fillStyle='#161212'; g.fillRect(ox,0,64,9); g.fillStyle=aw[u]; g.fillRect(ox+2,60,60,7); g.fillStyle='#0b0d12'; }
        const wins=[[8,20,12,26],[26,20,12,26],[44,20,12,26],[6,76,24,24],[40,70,11,36]];
        wins.forEach((r,k)=>{ const on=lit[u*6+k]; if(em){ if(!on) return; g.fillStyle=(u+k)%3?warm[(u+k)%3]:cool[k%2]; } g.fillRect(r[0]+ox,r[1],r[2],r[3]); });
        if(em){ g.fillStyle='#ffe2a8'; g.fillRect(ox+44,66,3,3); } } },cw,ch,.95);
  }
  function stripMall(sd,zc,len,title){ const shops=Math.max(3,Math.round(len/10)), L2=shops*10, cw=shops*80, ch=96, x=sd*78;
    const names=[]; for(let i=0;i<shops;i++) names.push(STORES[R_()*STORES.length|0]);
    const open=[]; for(let i=0;i<shops;i++) open.push(R_()<.75);
    facadeBox(L2,6,18,x,zc,sd,(g,em)=>{ g.fillStyle=em?'#000':'#26272b'; g.fillRect(0,0,cw,ch);
      for(let i=0;i<shops;i++){ const ox=i*80; if(em&&!open[i]) continue; g.fillStyle=em?(i%2?'#dfe9ff':'#fff1d6'):'#0d1117'; g.fillRect(ox+6,40,68,52);
        if(!em){ g.fillStyle='#2b2d33'; for(let k=1;k<4;k++) g.fillRect(ox+6+k*17,40,2,52); } } },cw,ch,1.1);
    const sc=canvasTex(cw,64,(g)=>{ g.fillStyle='#07080a'; g.fillRect(0,0,cw,64); g.textAlign='center'; g.textBaseline='middle';
      for(let i=0;i<shops;i++){ const c=SIGNCOL[(i+(R_()*6|0))%6]; g.font='800 30px "Arial Narrow",Arial,sans-serif'; g.shadowColor=c; g.shadowBlur=open[i]?12:0; g.fillStyle=open[i]?c:'#2a2a2a'; g.fillText(names[i],i*80+40,34,74); } });
    const sm=new THREE.Mesh(new THREE.PlaneGeometry(L2,1.5),new THREE.MeshBasicMaterial({map:CT(sc),toneMapped:false}));
    sm.position.set(x-sd*9.05,5.1,zc); faceRoad(sm,sd); S.add(sm);
    if(title){ box(.5,9,.5,poleM,sd*37,4.5,zc+L2/2-4); signPlane(title,5.5,1.6,sd*37-sd*.3,9.4,zc+L2/2-4,sd,{bg:'#10141c',color:'#f4f7ff',size:52,border:true}); }
    lotLight(sd,zc-L2/4); lotLight(sd,zc+L2/4);
  }
  function lotLight(sd,z){ box(.2,8,.2,poleM,sd*48,4,z); const h=box(1.4,.2,.6,lampM,sd*48,8,z); void h;
    const p=new THREE.Mesh(poolGeo,new THREE.MeshBasicMaterial({map:poolTex,color:0x7a8fb8,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false})); p.position.set(sd*48,.03,z); S.add(p);
    const fl=glowSprite(0xe6eeff,2.4); fl.position.set(sd*48,7.9,z); S.add(fl); }
  function gas(sd,zc){ const x=sd*56;
    const under=new THREE.MeshBasicMaterial({color:0xf2f6ff,toneMapped:false}), fascia=new THREE.MeshStandardMaterial({color:0xcfd6e0,emissive:0x405068,roughness:.5});
    const can=new THREE.Mesh(new THREE.BoxGeometry(14,.9,22),[fascia,fascia,roofM,under,fascia,fascia]); can.position.set(x,5.8,zc); S.add(can);
    [[-4,-7],[4,-7],[-4,7],[4,7]].forEach(([dx,dz])=>box(.5,5.4,.5,curbM,x+dx,2.7,zc+dz));
    [-5,0,5].forEach(dz=>box(1,1.6,.6,new THREE.MeshStandardMaterial({color:0x1a1e26,emissive:0x0e2a3a}),x,.8,zc+dz));
    const pool=new THREE.Mesh(new THREE.PlaneGeometry(20,28),new THREE.MeshBasicMaterial({map:poolTex,color:0xbfd0ff,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false})); pool.rotation.x=-Math.PI/2; pool.position.set(x,.04,zc); S.add(pool);
    facadeBox(16,4.5,10,sd*76,zc,sd,(g,em)=>{ g.fillStyle=em?'#000':'#2c2f36'; g.fillRect(0,0,256,64); g.fillStyle=em?'#eaf2ff':'#0c1016'; g.fillRect(20,22,216,36); },256,64,1.2);
    box(.4,10,.4,poleM,sd*37,5,zc+13); signPlane('GAS',3,1.6,sd*36.7,10.2,zc+13,sd,{bg:'#0b0e14',color:'#ff3b3b',size:70,glow:14});
    signPlane('OPEN 24 HOURS',3,.7,sd*36.7,8.9,zc+13,sd,{bg:'#0b0e14',color:'#f4f7ff',size:44});
  }
  function dealer(sd,zc){ const x=sd*76;
    facadeBox(40,9,20,x,zc,sd,(g,em)=>{ g.fillStyle=em?'#000':'#11151b'; g.fillRect(0,0,512,128); g.fillStyle=em?'#cfe2ff':'#1b2632'; g.fillRect(8,30,496,92);
      if(!em){ g.fillStyle='#0c0f14'; for(let k=1;k<10;k++) g.fillRect(8+k*50,30,3,92); } },512,128,.9);
    const cols=[0xb8bec6,0x101216,0x7a1f1f,0x1c3a5a,0xe6e6e6,0x2e3540];
    for(let i=0;i<6;i++){ const c=buildTrafficCar(cols[i]); c.group.position.set(sd*(52+(i%2)*7),0,zc-12+Math.floor(i/2)*11); c.group.rotation.y=-sd*Math.PI/2; S.add(c.group); }
    box(.6,12,.6,poleM,sd*38,6,zc); signPlane('AUTO GALLERY',7,1.8,sd*37.6,12.2,zc,sd,{bg:'#0e1218',color:'#f4f7ff',size:50,border:true});
    lotLight(sd,zc+14);
  }
  function diner(sd,zc){ const x=sd*58;
    const steel=new THREE.MeshStandardMaterial({color:0xc2c9d2,metalness:1,roughness:.22});
    const body=new THREE.Mesh(new THREE.BoxGeometry(12,5,28),steel); body.position.set(x,2.5,zc); S.add(body);
    const band=new THREE.Mesh(new THREE.PlaneGeometry(26,1.6),new THREE.MeshBasicMaterial({color:0xffe0b0,toneMapped:false})); band.position.set(x-sd*6.02,2.6,zc); faceRoad(band,sd); S.add(band);
    const neon=new THREE.MeshBasicMaterial({color:0x5fe6ff,toneMapped:false}); box(.08,.08,28,neon,x-sd*6.05,4.4,zc); box(.08,.08,28,neon,x-sd*6.05,1.1,zc);
    signPlane('DINER',6,1.6,x-sd*6.1,6.2,zc,sd,{bg:'#060708',color:'#ff4a5a',size:72,glow:18});
    lotLight(sd,zc-18);
  }
  function emptyLot(sd,zc,len){ lotLight(sd,zc); if(len>30){ const c=buildTrafficCar([0x2a2f38,0x5a1a1a,0xcfd2d8][R_()*3|0]); c.group.position.set(sd*60,0,zc+5); c.group.rotation.y=R_()*3; S.add(c.group); } }
  [-1,1].forEach(sd=>{ let z=ZMAX-10;
    while(z>ZMIN+20){ const t=R_(); let len;
      const inB=BANDS.find(b=>z<=b[1]+4&&z>b[0]-4); if(inB){ z=inB[0]-6; continue; }
      const below=BANDS.filter(b=>b[1]+4<z).map(b=>b[1]+4); const nextBand=below.length?Math.max(...below):ZMIN+20;
      if(sd<0&&z<BAND_C[0]-4){ stripMall(sd,z-70,130,'SHOPPING CENTER'); z-=150; continue; }
      if(t<.34) len=55+R_()*40; else if(t<.6) len=45+R_()*40; else if(t<.72) len=32; else if(t<.82) len=46; else if(t<.9) len=34; else len=22+R_()*20;
      if(z-len<nextBand){ len=z-nextBand; if(len<16){ z=nextBand-.01; continue; } }
      const zc=z-len/2;
      if(t<.34&&len>=28) rowhomes(sd,zc,len-4); else if(t<.6&&len>=30) stripMall(sd,zc,len-6); else if(t<.72&&len>=30) gas(sd,zc); else if(t<.82&&len>=44) dealer(sd,zc); else if(t<.9&&len>=32) diner(sd,zc); else emptyLot(sd,zc,len);
      z-=len+4; } });

  // distant low skyline + scattered window lights
  const sky=[], winPts=[];
  for(let i=0;i<90;i++){ const sd=R_()<.5?-1:1, x=sd*(170+R_()*300), z=-1300+R_()*1500, h=6+R_()*16*(R_()<.08?4:1), w=14+R_()*30, d=14+R_()*30;
    pv.set(x,h/2,z); m4.compose(pv,new THREE.Quaternion(),new THREE.Vector3(w,h,d)); sky.push(m4.clone());
    for(let k=0;k<8;k++) winPts.push(x-sd*w/2*1.01,1+R_()*(h-2),z+(R_()-.5)*d); }
  mkInst(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0x0a0d13,roughness:1}),sky);
  const wg=new THREE.BufferGeometry(); wg.setAttribute('position',new THREE.Float32BufferAttribute(winPts,3));
  S.add(new THREE.Points(wg,new THREE.PointsMaterial({color:0xffcf8a,size:1.1,sizeAttenuation:true,transparent:true,opacity:.8})));

  // ambient express-lane traffic (separated from the race by the medians)
  const amb=[], cols=[0x2a2f38,0x9aa1ab,0x5a1a1a,0x1c2f4a,0xd8dade,0x3b3b3b,0x14171c,0xc9b28a];
  for(let i=0;i<34;i++){ const nb=i%2===0, lane=[4.8,8.4,12.0][(i>>1)%3], c=buildTrafficCar(cols[i%cols.length]);
    const o={m:c,x:nb?lane:-lane,z:ZMAX-(i*47)%(ZMAX-ZMIN),v:(nb?-1:1)*(18+R_()*9)}; c.group.rotation.y=nb?Math.PI:0; S.add(c.group); amb.push(o); }
  // race-lane traffic (obstacles you can hit)
  const obst=[]; const ocols=[0xd2b23a,0x2a2f38,0xcfd2d8,0x1c3a5a,0x6b1d1d];
  for(let i=0;i<7;i++){ const c=buildTrafficCar(ocols[i%ocols.length]); S.add(c.group); obst.push({tr:true,m:c,dist:0,x:0,v:14,vx:0,hitCd:0,isP:false,yaw:0,steer:0}); }

  let sigT=0;
  function update(dt){
    amb.forEach(o=>{ o.z+=o.v*dt; if(o.z<ZMIN) o.z=ZMAX; if(o.z>ZMAX) o.z=ZMIN; const y=exY(o.z);
      o.m.group.position.set(o.x,y,o.z); o.m.group.rotation.x=-Math.atan((exY(o.z+1)-exY(o.z-1))/2); o.m.wheels.forEach(w=>w.rotation.x+=Math.abs(o.v)*dt/.34); });
    sigT=(sigT+dt)%26; const ph=sigT<16?'g':(sigT<19?'y':'r');
    ['r','y','g'].forEach(c=>lampMats[c].forEach(m=>m.color.setHex(c===ph?(c==='r'?0xff2a2a:c==='y'?0xffb020:0x3cff8a):0x1a1a1a)));
  }
  return {scene:S,track:tr,traffic:obst,update,
    cams:[{s:e1-380},{s:e1+arc+420},{s:e1+arc+wS+arc+380},{s:e1+arc+1180}],
    resetTraffic(){ [180,520,900,1350,1850,2400,2950].forEach((s,i)=>{ const o=obst[i]; o.dist=s; o.x=[-3.6,0,3.6,0,-3.6,3.6,0][i]; o.v=12+R_()*4; }); }};
}

/* ---------------- EVENTS ---------------- */
const EVENTS=[
  {id:'tunnel',build:buildTunnel,name:'Harbor Line',kick:'Event 01',loc:'Tunnel 7',when:'Harbor Line, 03:00',
   caption:'Two laps under the harbor. Cold light, no traffic, nowhere to hide.',specs:'2.1 KM LOOP / 2 LAPS / 7 CARS / NO TRAFFIC',
   note:'flat out\nexcept turn 4',load:'Tunnel 7. Two laps, seven cars.'},
  {id:'blvd',build:buildBlvd,name:'Roosevelt Blvd',kick:'Event 02',loc:'Northeast Philly',when:'Harbison Av to Cottman Av',
   caption:'A full mile of the Boulevard: U-turn at Harbison, straight through Tyson, U-turn on the Cottman bridge while the express lanes drop underneath.',specs:'1-MILE STRAIGHTS / 2 LAPS / 7 CARS / LIVE TRAFFIC / 4 SPEED CAMERAS',
   note:'U-turn on the\nCottman bridge',load:'Harbison to Cottman and back. Traffic is live.'}
];
EVENTS.forEach(e=>{ Object.assign(e,e.build()); });
/* ---- power-ups on the racing surface (any car can grab them) ---- */
const PU_TYPES={refill:{c:0x5fe6ff,css:'#5fe6ff',label:'Refill',tag:'REFILL'},long:{c:0xb28cff,css:'#b28cff',label:'Long Boost',tag:'LONG BOOST'},over:{c:0xffb020,css:'#ffb020',label:'Overdrive',tag:'OVERDRIVE'}};
const puGeo=new THREE.OctahedronGeometry(.62,0), puRing=new THREE.TorusGeometry(1.15,.07,6,28);
function addPickups(ev,list){
  ev.pickups=[]; const f=mkF();
  list.forEach(([s,x,type])=>{ frame(s,f,ev.track); const T=PU_TYPES[type];
    const g=new THREE.Group(); g.position.copy(f.p).addScaledVector(f.r,x);
    const gem=new THREE.Mesh(puGeo,new THREE.MeshStandardMaterial({color:T.c,emissive:T.c,emissiveIntensity:1.5,metalness:.3,roughness:.2})); gem.position.y=1.3; g.add(gem);
    const gl=glowSprite(T.c,3.4); gl.position.y=1.3; g.add(gl);
    const ring=new THREE.Mesh(puRing,new THREE.MeshBasicMaterial({color:T.c,toneMapped:false,transparent:true,opacity:.75})); ring.rotation.x=Math.PI/2; ring.position.y=.07; g.add(ring);
    const lab=addLabel(g,T.tag,T.css); lab.position.y=2.55;
    ev.scene.add(g); ev.pickups.push({s,x,type,g,gem,ring,cd:0}); });
}
/* ---- floating chevrons ahead of the brutal corners ---- */
function chevCanvas(dir){ return canvasTex(256,160,(g)=>{ g.fillStyle='rgba(6,8,12,.72)'; g.fillRect(6,6,244,148); g.strokeStyle='#ff9d2a'; g.lineWidth=5; g.strokeRect(6,6,244,148);
  g.fillStyle='#ffb347'; g.shadowColor='#ff8a1a'; g.shadowBlur=14;
  for(let k=0;k<3;k++){ const x0=dir>0?150-k*52:106+k*52, sx=dir>0?-1:1; g.beginPath(); g.moveTo(x0,30); g.lineTo(x0+sx*44,80); g.lineTo(x0,130); g.lineTo(x0+sx*-22,130); g.lineTo(x0+sx*22,80); g.lineTo(x0+sx*-22,30); g.closePath(); g.fill(); } }); }
const CHEV_TEX={1:CT(chevCanvas(1)),'-1':CT(chevCanvas(-1))};
function addChevrons(ev){
  const tr=ev.track, N=tr.N, thr=.0095, L=tr.L; ev.turns=[]; ev.chevrons=[];
  let start=0; while(start<N&&Math.abs(tr.K[start])>=thr) start++;
  let inT=false,i0=0,sg=0;
  for(let k=0;k<=N;k++){ const idx=(start+k)%N, hot=Math.abs(tr.K[idx])>=thr;
    if(hot&&!inT){ inT=true; i0=start+k; sg=Math.sign(tr.K[idx]); }
    else if(!hot&&inT){ inT=false; const s0=i0*tr.ds, s1=(start+k)*tr.ds; if(s1-s0>10) ev.turns.push({s0:s0%L,len:s1-s0,dir:sg}); } }
  const f=mkF(), q=new THREE.Quaternion(), b=new THREE.Matrix4(), nr=new THREE.Vector3(), W=tr.W;
  ev.turns.forEach(t=>{
    const span=Math.min(t.len*.7,70);
    for(let d=-42;d<=span;d+=12){ frame(t.s0+d,f,tr); orientQ(f,q,b,nr);
      const m=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.12),new THREE.MeshBasicMaterial({map:CHEV_TEX[t.dir],transparent:true,toneMapped:false,depthWrite:false}));
      m.position.copy(f.p).addScaledVector(f.r,t.dir*(W-.2)); m.position.y+=2.6; m.quaternion.copy(q); m.rotateY(Math.PI+t.dir*.35); ev.scene.add(m);
      ev.chevrons.push({m,y:m.position.y,i:ev.chevrons.length}); }
    // one big chevron hanging over the road at the entry
    frame(t.s0-55,f,tr); orientQ(f,q,b,nr);
    const big=new THREE.Mesh(new THREE.PlaneGeometry(4.2,2.6),new THREE.MeshBasicMaterial({map:CHEV_TEX[t.dir],transparent:true,toneMapped:false,depthWrite:false}));
    big.position.copy(f.p).addScaledVector(f.r,t.dir*1.5); big.position.y+=Math.min(tr.H-1.8,5.2); big.quaternion.copy(q); big.rotateY(Math.PI); ev.scene.add(big);
    ev.chevrons.push({m:big,y:big.position.y,i:ev.chevrons.length,big:true});
  });
}
addPickups(EVENTS[0],[[300,-3,'refill'],[620,3,'over'],[950,0,'long'],[1280,-3,'refill'],[1600,3,'over'],[1900,0,'long']]);
addPickups(EVENTS[1],[[250,-3.4,'refill'],[560,3.4,'long'],[1000,0,'over'],[1400,-3.4,'refill'],[1800,3.4,'over'],[2200,0,'long'],[2700,-3.4,'over'],[3100,3.4,'refill']]);
EVENTS.forEach(addChevrons);
function resetPickups(){ (EV.pickups||[]).forEach(p=>{ p.cd=0; p.g.visible=true; }); }
function worldFx(dt){
  (EV.pickups||[]).forEach(p=>{ p.gem.rotation.y+=dt*2.2; p.gem.rotation.x+=dt*.7; p.gem.position.y=1.3+Math.sin(ghostT*3+p.s)*.22; p.ring.scale.setScalar(1+Math.sin(ghostT*4+p.s)*.08);
    if(p.cd>0){ p.cd-=dt; if(p.cd<=0) p.g.visible=true; } });
  (EV.chevrons||[]).forEach(c=>{ c.m.material.opacity=c.big?.6+.4*Math.max(0,Math.sin(ghostT*5)):.3+.7*Math.max(0,Math.sin(ghostT*7-c.i*.8)); c.m.position.y=c.y+Math.sin(ghostT*2+c.i)*.12; });
}
function checkPickups(r){
  if(!EV.pickups) return; const L=TR.L, s0=((r.dist%L)+L)%L;
  for(const p of EV.pickups){ if(p.cd>0) continue; let d=Math.abs(s0-p.s); d=Math.min(d,L-d);
    if(d<2.8&&Math.abs(r.x-p.x)<2.3){ p.cd=7; p.g.visible=false; applyPU(r,p.type); } }
}
function applyPU(r,type){
  if(type==='refill') r.nitro=1; else if(type==='long'){ r.fxLong=8; r.nitro=Math.max(r.nitro,.5); } else r.fxOver=5;
  if(mode!=='race') return;
  if(r.isP){ toast({refill:'Refill. Boost is full.',long:'Long boost. Drains slower for 8s.',over:'Overdrive. Top speed up for 5s.'}[type]); tone(880,.12,.25,'triangle'); setTimeout(()=>tone(1320,.18,.22,'triangle'),90); flash(.18); }
  else if(player&&Math.abs(r.dist-player.dist)<70&&r.def.tag) persona(r,`${r.def.tag} grabbed ${PU_TYPES[type].label}.`);
}
function nextTurn(r){ if(!EV.turns||!EV.turns.length) return null; const L=TR.L, s0=((r.dist%L)+L)%L; let best=null;
  for(const t of EV.turns){ let d=t.s0-s0; if(d<-t.len) d+=L; if(d>L-t.len) d-=L; if(d<150&&d>-t.len*.8&&(!best||d<best.d)) best={d,dir:t.dir}; } return best; }
let EVI=0, EV=EVENTS[0], RS=EV.scene, traffic=[];

/* ---------------- FX (moves between race scenes) ---------------- */
const fxGroup=new THREE.Group();
const SL=90, slMesh=new THREE.InstancedMesh(new THREE.BoxGeometry(.03,.03,1),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.45,blending:THREE.AdditiveBlending,depthWrite:false}),SL);
slMesh.frustumCulled=false; fxGroup.add(slMesh);
const slData=[]; for(let i=0;i<SL;i++) slData.push({s:-1e9,x:0,y:0});
const SP=360, spPos=new Float32Array(SP*3), spVel=new Float32Array(SP*3), spLife=new Float32Array(SP);
for(let i=0;i<SP;i++) spPos[i*3+1]=-999;
const spGeo=new THREE.BufferGeometry(); spGeo.setAttribute('position',new THREE.BufferAttribute(spPos,3));
const sparks=new THREE.Points(spGeo,new THREE.PointsMaterial({color:0xffb45a,size:.22,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,map:glowTex}));
sparks.frustumCulled=false; fxGroup.add(sparks);
let spI=0;
function emitSparks(pos,dir,n,spd){ for(let k=0;k<n;k++){ const i=spI++%SP; spLife[i]=.35+Math.random()*.5;
  spPos[i*3]=pos.x;spPos[i*3+1]=pos.y;spPos[i*3+2]=pos.z;
  spVel[i*3]=dir.x*spd*(.4+Math.random())+(Math.random()-.5)*6; spVel[i*3+1]=Math.random()*5; spVel[i*3+2]=dir.z*spd*(.4+Math.random())+(Math.random()-.5)*6; } }
const smokes=[]; for(let i=0;i<46;i++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTex,transparent:true,depthWrite:false,opacity:0})); s.visible=false; fxGroup.add(s); smokes.push({s,life:0}); }
let smI=0;
function emitSmoke(pos){ const o=smokes[smI++%smokes.length]; o.life=1.1; o.s.visible=true; o.s.position.copy(pos); o.s.scale.setScalar(1.2); }
function setEvent(i){
  EVI=(i+EVENTS.length)%EVENTS.length; EV=EVENTS[EVI]; RS=EV.scene; TR=EV.track; RS.add(fxGroup);
  traffic=EV.traffic; EV.traffic.forEach(o=>{ o.m.group.visible=true; }); if(EV.resetTraffic) EV.resetTraffic();
  slData.forEach(d=>d.s=-1e9);
}
TR=EV.track; RS.add(fxGroup);

/* ---------------- STUDIO (magazine photos) ---------------- */
const studio=new THREE.Scene();
studio.fog=new THREE.Fog(0x05070a,10,34);
studio.background=new THREE.Color(0x05070a);
studio.userData.bloom={strength:.4,radius:.4,threshold:.88};
const sHemi=new THREE.HemisphereLight(0xcfe0ff,0x0a0c10,.6); studio.add(sHemi);
const sKey=new THREE.DirectionalLight(0xffffff,1.2); studio.add(sKey);
const sRim=new THREE.DirectionalLight(0x9fc4ff,1.4); sRim.position.set(-4,3,-6); studio.add(sRim);
const floorM=new THREE.MeshStandardMaterial({color:0x10141a,roughness:.28,metalness:.6});
const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),floorM); floor.rotation.x=-Math.PI/2; studio.add(floor);
const stripsG=new THREE.Group(); studio.add(stripsG);
for(let i=0;i<9;i++){ const b=new THREE.Mesh(new THREE.BoxGeometry(.3,.06,9),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}));
  b.position.set(-8+i*2,7.5,0); b.rotation.y=.5; stripsG.add(b); }
const floorStreaks=new THREE.Group(); studio.add(floorStreaks);
for(let i=0;i<14;i++){ const b=new THREE.Mesh(new THREE.PlaneGeometry(.06,5+Math.random()*6),new THREE.MeshBasicMaterial({color:0xcfe0ff,transparent:true,opacity:.09,blending:THREE.AdditiveBlending,depthWrite:false}));
  b.rotation.x=-Math.PI/2; b.position.set((Math.random()*2-1)*7,.015,(Math.random()*2-1)*10); floorStreaks.add(b); }
const bokeh=new THREE.Group(); studio.add(bokeh);
for(let i=0;i<34;i++){ const c=[0xff7a2a,0xff3a2a,0xffd08a,0x4fd0ff][i%4];
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:c,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.7,fog:false}));
  const a=Math.random()*Math.PI*2, r=12+Math.random()*10; s.position.set(Math.cos(a)*r,1+Math.random()*5,Math.sin(a)*r); s.scale.setScalar(1+Math.random()*2.5); bokeh.add(s); }
renderer.localClippingEnabled=true;
const studioCars=CARS.map(d=>{ const c=buildCar(d,{cut:true}); c.group.visible=false; studio.add(c.group); return c; });
const dust=new THREE.Group(); studio.add(dust);
for(let i=0;i<26;i++){ const d=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTex,color:0xe8dccb,transparent:true,depthWrite:false,opacity:.5}));
  d.position.set(1.5+Math.random()*5,.3+Math.random()*1.2,-2.5+Math.random()*4); d.scale.setScalar(1.5+Math.random()*2.5); d.userData.v=.2+Math.random()*.5; dust.add(d); }
const horizon=new THREE.Mesh(new THREE.CylinderGeometry(40,40,6,48,1,true),new THREE.MeshBasicMaterial({color:0x1d2a24,side:THREE.BackSide,fog:false}));
horizon.position.y=2; studio.add(horizon);
function setWorld(w){
  const W={
    flash:{env:ENV.flash,bg:0x0b0705,hemi:[0xffd9b0,.5],key:[0xfff0dc,2.6],rim:[0xff8a3a,1.2],floor:[0x2a2622,.7],strips:0,bokeh:1,streaks:0,dust:0,hz:0,exp:1.15,near:10,far:34},
    ice:  {env:ENV.ice,bg:0x070a0f,hemi:[0xcfe0ff,.6],key:[0xdfeaff,1.1],rim:[0x9fc4ff,1.6],floor:[0x10141a,.28],strips:1,bokeh:0,streaks:1,dust:0,hz:0,exp:1.05,near:10,far:34},
    white:{env:ENV.ice,bg:0x8d9cae,hemi:[0xe6eef8,.7],key:[0xffffff,1.2],rim:[0xcfe0ff,1.4],floor:[0x7f8c9b,.5],strips:0,bokeh:0,streaks:0,dust:0,hz:0,exp:.95,near:12,far:48},
    desert:{env:ENV.street,bg:0x2b3a44,hemi:[0xbcd0e0,.9],key:[0xfff1e0,1.6],rim:[0x9fc0d8,.8],floor:[0xb3aa9e,.95],strips:0,bokeh:0,streaks:0,dust:1,hz:1,exp:1.0,near:14,far:60}
  }[w]||null; const c=W||{};
  studio.environment=c.env; studio.fog.color.set(c.bg); studio.background.set(c.bg); studio.fog.near=c.near; studio.fog.far=c.far;
  sHemi.color.set(c.hemi[0]); sHemi.intensity=c.hemi[1]; sKey.color.set(c.key[0]); sKey.intensity=c.key[1]; sRim.color.set(c.rim[0]); sRim.intensity=c.rim[1];
  floorM.color.set(c.floor[0]); floorM.roughness=c.floor[1]; floorM.metalness=w==='desert'?0:.6;
  stripsG.visible=!!c.strips; bokeh.visible=!!c.bokeh; floorStreaks.visible=!!c.streaks; dust.visible=!!c.dust; horizon.visible=!!c.hz;
  renderer.toneMappingExposure=c.exp;
  document.body.classList.toggle('warm',w==='flash'||w==='desert');
}

/* ---------------- CAMERA + POST ---------------- */
const cam=new THREE.PerspectiveCamera(60,1,.1,1600);
function aspect(){ return innerWidth/innerHeight; }
let composer=null, renderPass=null, bloomPass=null, glowOn=true;
try{
  if(THREE.EffectComposer&&THREE.RenderPass&&THREE.UnrealBloomPass&&THREE.ShaderPass&&THREE.GammaCorrectionShader){
    composer=new THREE.EffectComposer(renderer);
    renderPass=new THREE.RenderPass(studio,cam); composer.addPass(renderPass);
    bloomPass=new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.8,.45,.8); composer.addPass(bloomPass);
    composer.addPass(new THREE.ShaderPass(THREE.GammaCorrectionShader));
  }
}catch(e){ composer=null; }
if(!composer){ const b=$('#glow'); if(b) b.style.display='none'; }
function draw(scene){
  if(composer&&glowOn){ renderPass.scene=scene; const b=scene.userData.bloom||{strength:.5,radius:.4,threshold:.85};
    bloomPass.strength=b.strength; bloomPass.radius=b.radius; bloomPass.threshold=b.threshold; composer.render(); }
  else renderer.render(scene,cam);
}
function resize(){ renderer.setSize(innerWidth,innerHeight,false); if(composer) composer.setSize(innerWidth,innerHeight); cam.aspect=aspect(); cam.updateProjectionMatrix(); }
addEventListener('resize',resize); resize();
function hfovToV(h){ return THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(h)/2)/cam.aspect)); }

/* ---------------- AUDIO ---------------- */
let AC=null, master, engGain, engF, o1, o2, scrGain, windGain, noiseBuf, soundOn=true;
function initAudio(){
  if(AC) { AC.resume&&AC.resume(); return; }
  try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return; }
  master=AC.createGain(); master.gain.value=.55; master.connect(AC.destination);
  noiseBuf=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate); const d=noiseBuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  engF=AC.createBiquadFilter(); engF.type='lowpass'; engF.frequency.value=900; engF.Q.value=4;
  engGain=AC.createGain(); engGain.gain.value=0; engF.connect(engGain); engGain.connect(master);
  o1=AC.createOscillator(); o1.type='sawtooth'; o2=AC.createOscillator(); o2.type='square';
  const g2=AC.createGain(); g2.gain.value=.5; o1.connect(engF); o2.connect(g2); g2.connect(engF); o1.start(); o2.start();
  const loop=(filterType,f,q)=>{ const n=AC.createBufferSource(); n.buffer=noiseBuf; n.loop=true; const bf=AC.createBiquadFilter(); bf.type=filterType; bf.frequency.value=f; bf.Q.value=q; const gg=AC.createGain(); gg.gain.value=0; n.connect(bf); bf.connect(gg); gg.connect(master); n.start(); return gg; };
  scrGain=loop('bandpass',2100,6); windGain=loop('lowpass',500,.7);
}
function burst(dur,type,f0,f1,vol,q){ if(!AC||!soundOn) return; const t=AC.currentTime; const n=AC.createBufferSource(); n.buffer=noiseBuf;
  const bf=AC.createBiquadFilter(); bf.type=type; bf.Q.value=q||1; bf.frequency.setValueAtTime(f0,t); bf.frequency.exponentialRampToValueAtTime(f1,t+dur);
  const g=AC.createGain(); g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+dur); n.connect(bf); bf.connect(g); g.connect(master); n.start(t); n.stop(t+dur+.05); }
function tone(f,dur,vol,type){ if(!AC||!soundOn) return; const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain(); o.type=type||'sine'; o.frequency.value=f;
  g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+dur); o.connect(g); g.connect(master); o.start(t); o.stop(t+dur+.05); }
const sfx={
  shutter(){ burst(.05,'highpass',3000,6000,.5); setTimeout(()=>burst(.07,'highpass',2500,5000,.35),70); },
  page(){ burst(.28,'bandpass',500,3200,.35,1.4); },
  hit(){ burst(.25,'lowpass',1400,120,.8); tone(70,.25,.6); },
  horn(){ tone(392,.35,.18,'square'); tone(311,.35,.14,'square'); },
  beep(hi){ tone(hi?1320:660,hi?.5:.18,.3,'square'); }
};
function engine(v,on){
  if(!AC) return; const t=AC.currentTime;
  const gears=[0,16,29,42,55,68,81,200]; let gi=0; while(v>gears[gi+1]) gi++;
  const fr=clamp((v-gears[gi])/(gears[gi+1]-gears[gi]),0,1);
  const f=48+fr*95+gi*7;
  o1.frequency.setTargetAtTime(f,t,.04); o2.frequency.setTargetAtTime(f*.5,t,.04);
  engF.frequency.setTargetAtTime(500+fr*1400+gi*120,t,.05);
  engGain.gain.setTargetAtTime(on&&soundOn?.09:0,t,.1);
  windGain.gain.setTargetAtTime(on&&soundOn?clamp(v/90,0,1)*.18:0,t,.2);
}
function screech(a){ if(AC) scrGain.gain.setTargetAtTime(soundOn?a*.12:0,AC.currentTime,.05); }

/* ---------------- RACERS ---------------- */
let racers=[], player=null;
const F=mkF(), F2=mkF(), tmpV=new THREE.Vector3(), headV=new THREE.Vector3(), leftV=new THREE.Vector3(), upV=new THREE.Vector3(), mat=new THREE.Matrix4();
function clearRacers(){ racers.forEach(r=>{ r.scene.remove(r.m.group); r.m.group.traverse(o=>{ if(o.geometry&&!o.isSprite) o.geometry.dispose(); }); }); racers=[]; }
function addRacer(def,isP,dist,x,skill){
  const m=buildCar(def); RS.add(m.group);
  if(isP){ const h=hist(def.id); m.paint.roughness=clamp(def.rough+h.hits*.004,0,.6); }
  const r={def,m,scene:RS,isP,dist,x,vx:0,v:0,steer:0,nitro:1,hitCd:0,slip:0,yaw:0,finished:false,finishT:0,laps:[],lapStart:0,hits:0,top:0,skill:skill||1,off:(Math.random()-.5)*3,wob:Math.random()*10,draft:0,burst:0,lit:false,mass:(def.P&&def.P.mass)||def.mass||1,startDelay:def.P?(def.P.start<0?Math.random()*.55:def.P.start):0};
  if(def.P) r.label=addLabel(m.group,def.tag,def.color);
  racers.push(r); return r;
}
let personaT=0, boardT=0;
function standings(){ return racers.slice().sort((a,b)=>(b.finished?1e9-b.finishT:b.dist)-(a.finished?1e9-a.finishT:a.dist)); }
function persona(r,msg,force){ if(mode!=='race'||raceT<2) return; if(!force&&((r.tc||0)>raceT||personaT>raceT)) return; r.tc=raceT+11; personaT=raceT+3; toast(msg); }
function addLabel(g,text,color){
  const c=canvasTex(256,64,(x)=>{ x.font='800 30px "Arial Narrow",Arial,sans-serif'; x.textAlign='center'; x.textBaseline='middle'; x.fillStyle='rgba(4,6,10,.55)'; const w=Math.min(250,x.measureText(text).width+26); x.fillRect(128-w/2,12,w,40); x.fillStyle=color; x.fillText(text,128,33); });
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:CT(c),transparent:true,depthWrite:false})); sp.scale.set(2.8,.7,1); sp.position.set(0,2.3,0); g.add(sp); return sp; }
function kAhead(s,span){ let m=0; for(let i=0;i<6;i++){ const k=frame(s+10+span*i/5,F2).k; if(Math.abs(k)>Math.abs(m)) m=k; } return m; }

function stepRacer(r,dt,inp){
  const d=r.def, W=TR.W, L=TR.L;
  frame(r.dist,F);
  const k=F.k;
  let steer=0, brake=false, nitro=false;
  if(inp){ steer=inp.steer; brake=inp.brake; nitro=inp.nitro&&r.nitro>0.02; }
  else {
    const P=d.P||RIVALS[0].P, racing=mode==='race';
    const ka=kAhead(r.dist,Math.max(30,r.v*1.4));
    const kn=frame(r.dist+r.v*.6+12,F2).k;
    const line=clamp(-kn*700,-5.2,5.2)*P.line;
    let tx=line+r.off*P.offScale+Math.sin(r.wob+ghostT*.3)*P.wobble, gain=P.gain, bias=0, vF=1, wantN=false;
    const pl=racing&&player&&player!==r?player:null, gapP=pl?r.dist-pl.dist:0; // >0: I'm ahead of you
    let chasing=null;
    switch(d.id){
      case 'wall': // covers your line whenever you're right behind it
        if(pl&&gapP>1.5&&gapP<34){ tx=pl.x; gain=.4; persona(r,`${d.tag} is covering your line.`); if(gapP<10&&r.nitro>.2) wantN=true; }
        break;
      case 'leech': { // tuck into the draft of the nearest car ahead, then slingshot out
        let best=null,bd=46; for(const o of racers){ if(o===r) continue; const dd=o.dist-r.dist; if(dd>0&&dd<bd){ bd=dd; best=o; } }
        if(best){ chasing=best;
          if(bd>9){ tx=best.x; if(bd<24&&Math.abs(best.x-r.x)<2.4){ r.draft=7.5; if(best===pl) persona(r,`${d.tag} is sitting in your slipstream.`); } }
          else { tx=best.x+(best.x>0?-3.5:3.5); wantN=true; r.draft=4; if(best===pl) persona(r,`${d.tag} slingshots out of your draft.`); } }
        break; }
      case 'bruiser': // aims for you when alongside
        if(pl&&Math.abs(gapP)<9){ tx=pl.x; gain=.62; chasing=pl; persona(r,`${d.tag} is leaning on you.`); }
        break;
      case 'closer': { // cruises, then empties the tank late
        const prog=r.dist/(LAPS*TR.L);
        if(prog<.6) vF=.97; else { vF=1.075; wantN=Math.abs(ka)<.004; if(!r.lit&&racing){ r.lit=true; persona(r,`${d.tag} just lit the boost.`,true); } }
        break; }
      case 'wild': // late braking + random mistakes + random bursts
        r.mt=(r.mt||0)-dt;
        if(r.mt<=0&&Math.random()<P.mistakeRate*dt){ r.mt=.9+Math.random()*.6; r.mSteer=(Math.random()<.5?-1:1)*P.mistakeStrength; if(pl&&Math.abs(gapP)<40) persona(r,`${d.tag} sent it way too hot.`); }
        if(r.mt>0) bias=r.mSteer;
        if(Math.random()<.006) r.burst=1.2+Math.random();
        if(pl&&gapP>-14&&gapP<0) persona(r,`${d.tag} is coming up the outside.`);
        break;
      case 'apex': // pure line; takes the inside when it's reeling you in
        if(pl&&gapP<0&&gapP>-16&&Math.abs(kn)>.002){ tx=clamp(line*1.3,-5.2,5.2); persona(r,`${d.tag} is diving to the inside.`); }
        break;
    }
    if(P.seek&&!chasing&&EV.pickups&&!(d.id==='wall'&&pl&&gapP>1.5&&gapP<34)){ const L=TR.L, s0=((r.dist%L)+L)%L;
      for(const p of EV.pickups){ if(p.cd>0) continue; if(p.type==='refill'&&r.nitro>.8) continue; let dd=p.s-s0; if(dd<0) dd+=L;
        if(dd>6&&dd<70&&Math.abs(p.x-r.x)<4.6&&Math.random()<.98){ tx=p.x; break; } } }
    // avoidance: traffic always; other racers unless you're the one this persona is attacking
    for(const o of racers.concat(traffic)){ if(o===r||o===chasing) continue; const dd=o.dist-r.dist, dx=o.x-r.x;
      if(dd>0&&dd<(o.tr?26:15)&&Math.abs(dx)<2.8){ tx=o.x+(o.x>0?-3.4:3.4); } }
    tx=clamp(tx,-W+1.4,W-1.4);
    const ac=r.v*r.v*k*.5;
    steer=clamp(-ac/d.grip+(tx-r.x)*gain-r.vx*.14+bias,-1,1);
    let rubber=1; if(pl) rubber=1+clamp((pl.dist-r.dist)/420,-.08,.1)*P.rubber;
    const vLim=Math.sqrt(1.9*d.grip*.95*P.risk/Math.max(Math.abs(ka),1e-4));
    const vT=Math.min(d.top*r.skill*rubber*vF,vLim);
    if(r.v>vT+2) brake=true;
    const straight=Math.abs(ka)<.003&&r.v>38;
    switch(P.nitro){
      case 'exit':    nitro=straight&&r.nitro>.25&&(r._nos||Math.abs(frame(r.dist-25,F2).k)>.004); break;
      case 'defend':  nitro=wantN; break;
      case 'pass':    nitro=wantN&&r.nitro>.05; break;
      case 'eager':   nitro=straight&&r.nitro>.1; break;
      case 'reserve': nitro=wantN&&r.nitro>.02; break;
      case 'burst':   nitro=(r.burst>0)&&r.nitro>.05; break;
    }
    if(r.burst>0) r.burst-=dt;
    if(brake) nitro=false;
    r._nos=nitro;
  }
  r.steer=inp?lerp(r.steer,steer,1-Math.exp(-dt*9)):steer;
  const vmax=d.top*(nitro?1.22:1)*(r.fxOver>0?1.14:1);
  let a=d.acc*Math.max(0,1-r.v/vmax); if(r.v>vmax) a=-10;
  if(nitro) a+=14*d.nitro;
  if(r.fxOver>0) a+=5;
  if(r.draft>0){ a+=r.draft; r.draft=0; }
  if(brake) a=-40;
  if(mode==='race'&&raceT<r.startDelay) a=0;
  r.v=Math.max(0,r.v+a*dt);
  if(nitro) r.nitro=Math.max(0,r.nitro-.3*dt*(r.fxLong>0?.35:1));
  if(r.fxLong>0) r.fxLong-=dt; if(r.fxOver>0) r.fxOver-=dt;
  const ac=r.v*r.v*k*.5, sa=r.steer*d.grip*Math.min(1,r.v/18);
  r.vx+=(sa+ac-r.vx*3.2)*dt;
  r.x+=r.vx*dt;
  r.slip=clamp((Math.abs(ac)-d.grip*.72)/(d.grip*.4),0,1)*(r.v>30?1:0) + (brake&&r.v>35?.6:0);
  r.nitro=Math.min(1,r.nitro+(.035+r.slip*.12)*dt*(r.isP?1:1.2));
  const lim=W-1.1; r.hitCd-=dt;
  if(Math.abs(r.x)>lim){ const sd=Math.sign(r.x); r.x=sd*lim;
    if(r.hitCd<=0&&Math.abs(r.vx)>3){ r.v*=.88; r.hitCd=.35; r.hits++;
      if(r.isP){ shake=.7; sfx.hit(); }
      tmpV.copy(F.p).addScaledVector(F.r,r.x+sd*1); tmpV.y+=.4; emitSparks(tmpV,F.t,26,r.v*.25); }
    else if(Math.random()<.5){ tmpV.copy(F.p).addScaledVector(F.r,r.x+sd*1); tmpV.y+=.4; emitSparks(tmpV,F.t,2,r.v*.2); r.v*=1-.25*dt; }
    r.vx*=-.3; }
  const prevDist=r.dist, prevLap=Math.floor(r.dist/L);
  r.dist+=r.v*dt/Math.max(.6,1+r.x*k);
  r.top=Math.max(r.top,r.v);
  checkPickups(r);
  const lap=Math.floor(r.dist/L);
  if(lap>prevLap&&lap>=1&&mode==='race'){ r.laps.push(raceT-r.lapStart); r.lapStart=raceT;
    if(r.isP&&lap<LAPS) toast(`Lap ${lap+1}. ${fmt(r.laps[r.laps.length-1])}`); }
  if(!r.finished&&r.dist>=LAPS*L&&mode==='race'){ r.finished=true; r.finishT=raceT; }
  if(r.isP&&mode==='race'&&EV.cams.length&&!r.finished){ const a0=((prevDist%L)+L)%L, b0=((r.dist%L)+L)%L;
    EV.cams.forEach(c=>{ const crossed=a0<=b0?(a0<c.s&&c.s<=b0):(a0<c.s||c.s<=b0); if(crossed&&r.v>44.7){ camFlashes++; flash(.55); sfx.shutter(); toast(`Speed camera. ${Math.round(r.v*2.237)} mph.`); } }); }
}
function stepTraffic(o,dt){ frame(o.dist,F); o.dist+=o.v*dt/Math.max(.6,1+o.x*F.k); o.hitCd-=dt; }
function collide(){
  const all=racers.concat(traffic);
  for(let i=0;i<all.length;i++) for(let j=i+1;j<all.length;j++){
    const a=all[i],b=all[j]; if(a.tr&&b.tr) continue;
    let dd=a.dist-b.dist; const L=TR.L; dd=((dd%L)+L*1.5)%L-L*.5;
    const dx=a.x-b.x;
    if(Math.abs(dd)<4.5&&Math.abs(dx)<2.05){
      if(a.tr||b.tr){ const car=a.tr?b:a, t=a.tr?a:b, ddx=car.x-t.x, sgn=ddx>=0?1:-1;
        car.x=t.x+sgn*2.06; car.vx=sgn*4; const behind=((car.dist-t.dist)%L+L*1.5)%L-L*.5<0;
        if(behind) car.v=Math.min(car.v,t.v*.85+1); else car.v*=.97;
        if(car.hitCd<=0){ car.hitCd=.45; frame(t.dist,F); tmpV.copy(F.p).addScaledVector(F.r,(car.x+t.x)/2); tmpV.y+=.6; emitSparks(tmpV,F.t,34,car.v*.3);
          if(car.isP){ car.hits++; shake=1; sfx.hit(); setTimeout(()=>sfx.horn(),120); } }
        continue; }
      const ov=(2.05-Math.abs(dx))*(dx>=0?1:-1), ma=a.mass||1, mb=b.mass||1; a.x+=ov*mb/(ma+mb); b.x-=ov*ma/(ma+mb);
      const t=a.vx, sg=Math.sign(dx||1); a.vx=b.vx*.6+sg*2*mb/ma*1.4; b.vx=t*.6-sg*2*ma/mb*1.4;
      const back=dd<0?a:b; back.v*=.985;
      if((a.isP||b.isP)&&(a.hitCd<=0)){ a.hitCd=.3; b.hitCd=.3; sfx.hit(); shake=.5;
        frame((a.dist+b.dist)/2,F); tmpV.copy(F.p).addScaledVector(F.r,(a.x+b.x)/2); tmpV.y+=.5; emitSparks(tmpV,F.t,30,a.v*.3); if(a.isP) a.hits++; if(b.isP) b.hits++; }
    }
  }
}
function poseAt(g,dist,x,yaw,vx){
  frame(dist,F);
  headV.copy(F.t).multiplyScalar(Math.cos(yaw)).addScaledVector(F.r,Math.sin(yaw)).normalize();
  g.position.copy(F.p).addScaledVector(F.r,x);
  leftV.crossVectors(UP,headV).normalize(); upV.crossVectors(headV,leftV);
  mat.makeBasis(leftV,upV,headV); g.quaternion.setFromRotationMatrix(mat);
  if(vx) g.rotateZ(clamp(-vx*.006,-.06,.06));
}
function poseRacer(r,dt){
  r.yaw=Math.atan2(r.vx,Math.max(r.v,4))+r.slip*.12*Math.sign(r.vx||r.steer);
  poseAt(r.m.group,r.dist,r.x,r.yaw,r.vx);
  r.m.wheels.forEach(w=>w.rotation.x+=r.v*dt/.37);
  r.m.steers.forEach(s=>s.rotation.y=-r.steer*.35);
  if(r.slip>.35&&Math.random()<r.slip*.9){ tmpV.copy(r.m.group.position).addScaledVector(headV,-1.6); tmpV.y+=.4; emitSmoke(tmpV); }
}
function poseTraffic(o,dt){ poseAt(o.m.group,o.dist,o.x,0,0); o.m.wheels.forEach(w=>w.rotation.x+=o.v*dt/.34); }

/* ---------------- GHOST REPLAY (best run per event, stored on this device) ---------------- */
let ghostRec=[], ghostAcc=0, ghostData=null, ghostCar=null, ghostIdx=0;
function ghostKey(){ return 'afterhours.ghost.'+EV.id; }
function loadGhost(){ try{ ghostData=JSON.parse(localStorage.getItem(ghostKey())||'null'); }catch(e){ ghostData=null; } return ghostData; }
function spawnGhost(){
  if(ghostCar){ ghostCar.scene.remove(ghostCar.group); ghostCar=null; }
  if(!ghostData||!ghostData.s||ghostData.s.length<4) return;
  const def=CARS.find(c=>c.id===ghostData.car)||CARS[0], m=buildCar(def);
  m.group.traverse(o=>{ if(o.material&&!o.isSprite){ o.material=o.material.clone(); o.material.transparent=true; o.material.opacity=.28; o.material.depthWrite=false; } if(o.isSprite) o.visible=false; });
  RS.add(m.group); ghostCar={group:m.group,scene:RS,wheels:m.wheels}; ghostIdx=0;
}
function ghostState(t){
  const s=ghostData.s; if(t>=s[s.length-1][0]) return null;
  while(ghostIdx<s.length-2&&s[ghostIdx+1][0]<t) ghostIdx++;
  const A=s[ghostIdx],B=s[ghostIdx+1],a=clamp((t-A[0])/Math.max(1e-3,B[0]-A[0]),0,1);
  return {dist:lerp(A[1],B[1],a),x:lerp(A[2],B[2],a),yaw:lerp(A[3],B[3],a)};
}
const r2=v=>Math.round(v*100)/100;

/* ---------------- FX update ---------------- */
const FX={m4:new THREE.Matrix4(),q:new THREE.Quaternion(),sc:new THREE.Vector3(),p:new THREE.Vector3(),b:new THREE.Matrix4(),nr:new THREE.Vector3()};
function updateFx(dt,focus){
  for(let i=0;i<SP;i++){ if(spLife[i]<=0) continue; spLife[i]-=dt;
    if(spLife[i]<=0){ spPos[i*3+1]=-999; continue; }
    spVel[i*3+1]-=18*dt; spPos[i*3]+=spVel[i*3]*dt; spPos[i*3+1]+=spVel[i*3+1]*dt; spPos[i*3+2]+=spVel[i*3+2]*dt;
    if(spPos[i*3+1]<0){ spPos[i*3+1]=0; spVel[i*3+1]*=-.3; } }
  spGeo.attributes.position.needsUpdate=true;
  smokes.forEach(o=>{ if(o.life<=0) return; o.life-=dt; o.s.scale.multiplyScalar(1+dt*2.2); o.s.material.opacity=Math.max(0,o.life*.5); o.s.position.y+=dt*.6; if(o.life<=0) o.s.visible=false; });
  if(!focus) return;
  const {m4,q,sc,p,b,nr}=FX, W=TR.W, H=TR.H;
  const len=clamp(focus.v*.09,.3,9); slMesh.material.opacity=clamp((focus.v-25)/60,0,.55)*(EV.id==='blvd'?.6:1);
  for(let i=0;i<SL;i++){ const d=slData[i];
    if(d.s<focus.dist-6||d.s>focus.dist+400){ d.s=focus.dist+30+Math.random()*140; d.x=(Math.random()*2-1)*(W+.1); d.y=.3+Math.random()*(H-.8); }
    frame(d.s,F2); p.copy(F2.p).addScaledVector(F2.r,d.x); p.y+=d.y; orientQ(F2,q,b,nr); sc.set(1,1,len);
    m4.compose(p,q,sc); slMesh.setMatrixAt(i,m4); }
  slMesh.instanceMatrix.needsUpdate=true;
}

/* ---------------- INPUT ---------------- */
const keys={};
const pads={left:false,right:false,brake:false,nitro:false};
addEventListener('keydown',e=>{ keys[e.code]=true;
  if(mode==='select'&&e.code==='KeyI'){ sheetOpen?closeSheet():openSheet(); }
  if(mode==='select'){ if(e.code==='ArrowRight') turn(1); if(e.code==='ArrowLeft') turn(-1); if(e.code==='Enter') openEvents(); }
  else if(mode==='events'){ if(e.code==='ArrowRight') turnEvent(1); if(e.code==='ArrowLeft') turnEvent(-1); if(e.code==='Enter') startLoading(); if(e.code==='Escape') backToArchive(); }
  else if(mode==='boot'&&bootReady&&(e.code==='Enter'||e.code==='Space')) enter();
  else if(mode==='results'&&e.code==='Enter') startLoading();
});
addEventListener('keyup',e=>{ keys[e.code]=false; });
document.querySelectorAll('.pad').forEach(b=>{
  const k=b.dataset.k;
  const on=e=>{ e.preventDefault(); pads[k]=true; b.classList.add('on'); try{b.setPointerCapture(e.pointerId);}catch(_){} };
  const off=()=>{ pads[k]=false; b.classList.remove('on'); };
  b.addEventListener('pointerdown',on); b.addEventListener('pointerup',off); b.addEventListener('pointercancel',off); b.addEventListener('lostpointercapture',off);
});
function readInput(){
  const l=keys.ArrowLeft||keys.KeyA||pads.left, r=keys.ArrowRight||keys.KeyD||pads.right;
  return {steer:(r?1:0)-(l?1:0), brake:!!(keys.ArrowDown||keys.KeyS||pads.brake), nitro:!!(keys.Space||keys.ShiftLeft||keys.ShiftRight||pads.nitro)};
}

/* ---------------- UI HELPERS ---------------- */
function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id)); }
function flash(strength){ const f=$('#flash'); f.classList.remove('go'); f.style.opacity=strength||1; void f.offsetWidth; f.classList.add('go'); f.style.opacity=0;
  canvas.classList.add('blur'); requestAnimationFrame(()=>requestAnimationFrame(()=>canvas.classList.remove('blur'))); }
function fmt(t){ if(!(t>0)||!isFinite(t)) return '0:00.0'; const m=Math.floor(t/60), s=t-m*60; return m+':'+(s<10?'0':'')+s.toFixed(1); }
let toastT=0; function toast(s){ const t=$('#hToast'); t.textContent=s; t.style.opacity=1; toastT=1.8; }
function esc(s){ return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
function animIn(list,dir){ list.forEach(([s,c])=>{ const e=$(s); e.style.setProperty('--dx',(dir*40)+'px'); e.classList.remove('enter','d1','d2','d3'); void e.offsetWidth; e.classList.add('enter'); if(c) e.classList.add(c); }); }
const handArrow='<svg width="70" height="34" viewBox="0 0 70 34" fill="none" stroke="#fbf6ea" stroke-width="2.4" stroke-linecap="round"><path d="M4 4 C 20 26, 40 30, 62 22"/><path d="M52 14 L63 22 L51 29"/></svg>';

/* ---------------- STATE ---------------- */
let mode='boot', page=0, sel=0, shake=0, raceT=0, countdown=0, ghostT=0, modeT=0, finishHold=0, slowmo=1, bootReady=false, camFlashes=0;
const camPos=new THREE.Vector3(0,5,10), camLook=new THREE.Vector3();
let camSnap=true;

function setupAttract(def){
  clearRacers();
  player=addRacer(def,false,600,-2,1);
  const rival=addRacer(RIVALS[0],false,588,2.5,1);
  player.v=EV.id==='blvd'?60:70; rival.v=player.v+2; player.off=-1.5; rival.off=1.5;
  racers.forEach(r=>{ r.def=Object.assign({},r.def,{top:EV.id==='blvd'?66:78}); });
  if(EV.resetTraffic) EV.resetTraffic();
  resetPickups();
  camSnap=true; renderer.toneMappingExposure=1.05;
}
function enter(){ initAudio(); closeSheet(); sfx.shutter(); flash(1); mode='select'; show('select'); renderPage(0); }
function renderPage(dir){
  const d=CARS[page], h=hist(d.id);
  setWorld(d.world);
  studioCars.forEach((c,i)=>{ c.group.visible=i===page; c.paint.roughness=clamp(c.def.rough+hist(c.def.id).hits*.004,0,.6); });
  $('#sHead').innerHTML=`<span class="k">${esc(d.kick)}</span><span>${esc(d.name)}</span>`;
  const st=$('#sStamp'); st.innerHTML=`${esc(d.loc)}<small>${esc(d.when)}</small>`;
  const portrait=aspect()<1;
  st.style.top=portrait?'29%':'30%'; st.style.left=page===1?'':'22px'; st.style.right=page===1?'22px':'';
  st.style.transform=`rotate(${page===1?6:-7}deg)`;
  const n=$('#sNote'); n.innerHTML=esc(d.note)+handArrow;
  n.style.left=d.notePos.l; n.style.top=portrait?d.notePos.t:'22%';
  $('#sSpecs').textContent=d.specs;
  const bars=[['Speed',d.top/94],['Grip',d.grip/36],['Boost',d.nitro/1.3]];
  $('#sStats').innerHTML=bars.map(b=>`<div>${b[0]}<i><b style="width:${Math.round(b[1]*100)}%"></b></i></div>`).join('');
  $('#sCap').textContent=d.caption; $('#sRival').textContent=d.rival;
  $('#sPg').innerHTML=`${String(page+1).padStart(2,'0')} <em>/ ${String(CARS.length).padStart(2,'0')}</em>`;
  const w=$('#sWin');
  if(h.wins>0){ w.style.display=''; w.innerHTML=`Won ${h.wins>1?h.wins+' times':''}<small>${esc(h.winAt||'Harbor Line')}</small>`; w.style.top=portrait?'52%':'44%'; w.style.right='26px'; w.style.left=''; w.style.transform='rotate(9deg)'; }
  else w.style.display='none';
  const bests=EVENTS.filter(e=>h.bestBy[e.id]).map(e=>`${e.name.toLowerCase()} ${fmt(h.bestBy[e.id])}`);
  $('#sLog').textContent=h.runs?`raced ${h.runs}×${bests.length?', best '+bests.join(', '):''}${h.hits?`, ${h.hits} hits`:''}`:'';
  if(dir) animIn([['#sHead',''],['#sNote','d2'],['#sFoot','d1'],['#sStamp','d3']],dir);
  camSnap=true; modeT=0;
}
let sheetOpen=false;
function renderSheet(dir){
  const d=CARS[page], sh=SHEETS[d.id]||{};
  $('#shKick').textContent=`Spec sheet, ${String(page+1).padStart(2,'0')} of ${String(CARS.length).padStart(2,'0')}`;
  $('#shName').textContent=d.name;
  const rows=[['Engine',sh.engine],['Power',sh.power],['Torque',sh.torque],['0–60 mph',sh.zero],['Top speed',sh.vmax],['Weight',sh.weight],['Drivetrain',sh.drive],['Gearbox',sh.gearbox]];
  const bars=[['Speed',d.top/94],['Acceleration',d.acc/26],['Grip',d.grip/36],['Boost',d.nitro/1.3],['Weight',(d.mass||1)/1.8],['Handling',(d.grip/36)*(1.15-((d.mass||1)-1)*.35)]];
  $('#shBody').innerHTML=rows.map((r,i)=>`<div class="srow sline" style="--sx:${(dir||1)*30}px;animation-delay:${i*35}ms"><span>${r[0]}</span><b>${esc(r[1]||'—')}</b></div>`).join('')+
    `<div class="sbars">${bars.map(b=>`<div class="sbar">${b[0]}<i><b data-w="${Math.round(clamp(b[1],0,1)*100)}"></b></i></div>`).join('')}</div>`;
  $('#shPg').textContent=`${String(page+1).padStart(2,'0')} / ${String(CARS.length).padStart(2,'0')}`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>document.querySelectorAll('#shBody .sbar i b').forEach(b=>b.style.width=b.dataset.w+'%')));
}
function openSheet(){ sheetOpen=true; renderSheet(1); $('#sheet').classList.add('open'); $('#sheet').setAttribute('aria-hidden','false'); sfx.page(); }
function closeSheet(){ sheetOpen=false; $('#sheet').classList.remove('open'); $('#sheet').setAttribute('aria-hidden','true'); }
function turn(dir){ page=(page+dir+CARS.length)%CARS.length; sfx.page(); setTimeout(()=>sfx.shutter(),60); flash(.95); renderPage(dir); if(sheetOpen) renderSheet(dir); }
function openEvents(){ initAudio(); closeSheet(); sel=page; sfx.shutter(); flash(1); mode='events'; show('events'); renderEvent(0,true); }
function renderEvent(dir,force){
  if(force||dir) { setEvent(EVI); setupAttract(CARS[sel]); }
  const e=EV;
  $('#eHead').innerHTML=`<span class="k">${esc(e.kick)}</span><span>${esc(e.name)}</span>`;
  $('#eStamp').innerHTML=`${esc(e.loc)}<small>${esc(e.when)}</small>`;
  $('#eNote').innerHTML=esc(e.note)+handArrow;
  $('#eSpecs').textContent=e.specs; $('#eCap').textContent=e.caption;
  const g=loadGhost();
  $('#eGhost').textContent=g?`Your ghost: ${fmt(g.t)} in the ${(CARS.find(c=>c.id===g.car)||CARS[0]).name}. Beat it and it gets replaced.`:'No ghost yet. Your first finish becomes the one to beat.';
  $('#eGhost').textContent+=' On the grid: Apex, The Wall, Leech, Bruiser, The Closer, Wildcard. Power-ups: cyan refills boost, violet makes it last, amber raises top speed.';
  $('#ePg').innerHTML=`0${EVI+1} <em>/ 0${EVENTS.length}</em>`;
  if(dir) animIn([['#eHead',''],['#eNote','d2'],['#eFoot','d1'],['#eStamp','d3']],dir);
  modeT=0; shot=-1;
}
function turnEvent(dir){ EVI=(EVI+dir+EVENTS.length)%EVENTS.length; sfx.page(); setTimeout(()=>sfx.shutter(),60); flash(.95); renderEvent(dir); }
function backToArchive(){ engine(0,false); screech(0); mode='select'; show('select'); flash(.9); sfx.shutter(); renderPage(0); }
$('#prev').onclick=()=>turn(-1); $('#next').onclick=()=>turn(1);
$('#specBtn').onclick=()=>sheetOpen?closeSheet():openSheet(); $('#shClose').onclick=closeSheet;
$('#shPrev').onclick=()=>turn(-1); $('#shNext').onclick=()=>turn(1);
(function(){ const el=$('#sheet'); let x0=null,y0=0;
  el.addEventListener('pointerdown',e=>{ if(e.target.closest('button')) return; x0=e.clientX; y0=e.clientY; e.stopPropagation(); });
  el.addEventListener('pointerup',e=>{ if(x0===null) return; const dx=e.clientX-x0, dy=e.clientY-y0; x0=null; e.stopPropagation();
    if(dy>60&&dy>Math.abs(dx)) closeSheet(); else if(Math.abs(dx)>40) turn(dx<0?1:-1); }); })();
$('#race').onclick=()=>openEvents();
$('#ePrev').onclick=()=>turnEvent(-1); $('#eNext').onclick=()=>turnEvent(1);
$('#eGo').onclick=()=>startLoading(); $('#eBack').onclick=()=>backToArchive();
$('#snd').onclick=()=>{ soundOn=!soundOn; $('#snd').textContent=soundOn?'Sound on':'Sound off'; };
$('#glow').onclick=()=>{ glowOn=!glowOn; $('#glow').textContent=glowOn?'Glow on':'Glow off'; };
$('#tap').onclick=()=>{ if(bootReady) enter(); };
$('#quit').onclick=()=>{ endGhost(); backToArchive(); };
$('#rBack').onclick=()=>backToArchive();
$('#rAgain').onclick=()=>startLoading();
let sx=null, sy=0, swipeEl=null;
['#select','#events'].forEach(id=>{ const el=$(id); el.style.pointerEvents='auto';
  el.addEventListener('pointerdown',e=>{ if(e.target.closest('button')) return; sx=e.clientX; sy=e.clientY; swipeEl=id; }); });
addEventListener('pointerup',e=>{ if(sx===null) return; const dx=e.clientX-sx, dy=e.clientY-sy; sx=null;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){ if(mode==='select'&&swipeEl==='#select') turn(dx<0?1:-1); else if(mode==='events'&&swipeEl==='#events') turnEvent(dx<0?1:-1); } });

function startLoading(){
  initAudio(); sfx.shutter(); flash(1);
  if(mode!=='events') { setEvent(EVI); setupAttract(CARS[sel]); }
  mode='loading'; modeT=0; show('loading');
  $('#ldwhere').textContent=EV.name; $('#ldsub').textContent=`${EV.load} You're in the ${CARS[sel].name}.`;
}
function endGhost(){ if(ghostCar){ ghostCar.scene.remove(ghostCar.group); ghostCar=null; } }
function startRace(){
  clearRacers();
  const me=CARS[sel], R_=id=>RIVALS.find(r=>r.id===id);
  // grid: APEX on pole, THE WALL just ahead of you, LEECH and BRUISER right behind you
  addRacer(R_('apex'),false,-5,-2.6,.99);
  addRacer(R_('closer'),false,-11,2.6,.985);
  addRacer(R_('wall'),false,-17,-2.6,.975);
  player=addRacer(me,true,-23,2.6,1);
  addRacer(R_('leech'),false,-29,-2.6,.985);
  addRacer(R_('bruiser'),false,-35,2.6,.98);
  addRacer(R_('wild'),false,-41,-2.6,.99);
  personaT=0; boardT=0; resetPickups(); racers.forEach(r=>{ r.fxLong=0; r.fxOver=0; });
  if(EV.resetTraffic) EV.resetTraffic();
  loadGhost(); spawnGhost(); ghostRec=[]; ghostAcc=0; camFlashes=0;
  mode='race'; show('hud'); countdown=3.6; raceT=0; finishHold=0; slowmo=1; camSnap=true; shake=0;
  $('#hGhost').textContent=''; $('#hMsg').textContent='3'; sfx.beep(false); flash(.9);
}
function finishRace(){
  mode='results'; show('results'); sfx.shutter(); flash(1); engine(0,false); screech(0);
  const L=TR.L, est=r=>r.finished?r.finishT:raceT+(LAPS*L-r.dist)/Math.max(r.v,30);
  const order=racers.slice().sort((a,b)=>est(a)-est(b));
  const place=order.indexOf(player)+1, t=player.finishT;
  const h=hist(player.def.id); h.runs++; h.hits+=player.hits; if(place===1){ h.wins++; h.winAt=EV.name; }
  if(!h.bestBy[EV.id]||t<h.bestBy[EV.id]) h.bestBy[EV.id]=t; h.last=place; persist();
  let ghostMsg;
  const prev=ghostData;
  if(!prev||t<prev.t){ try{ localStorage.setItem(ghostKey(),JSON.stringify({t:r2(t),car:player.def.id,s:ghostRec})); ghostMsg=prev?`new ghost, ${ (prev.t-t).toFixed(1)}s faster`:'saved as your ghost'; }catch(e){ ghostMsg='ghost not saved'; } }
  else ghostMsg=`ghost still ${ (t-prev.t).toFixed(1)}s ahead`;
  endGhost();
  const best=player.laps.length?Math.min(...player.laps):t;
  $('#rPlace').textContent='P'+place;
  const winner=order[0];
  const gap=Math.abs(est(order[1])-est(order[0])).toFixed(1);
  $('#rHead').textContent= place===1 ? `${player.def.name} takes ${EV.name} by ${gap}s` : `${winner.def.name} holds off the ${player.def.name} on ${EV.name}`;
  $('#rStamp').innerHTML=(place===1?'Cleared':`Finished P${place}`)+`<small>${esc(EV.kick)}</small>`;
  $('#rTbl').innerHTML=`<dt>Time</dt><dd>${fmt(t)}</dd><dt>Best lap</dt><dd>${fmt(best)}</dd><dt>Top speed</dt><dd>${Math.round(player.top*2.237)} mph</dd><dt>Hits</dt><dd>${player.hits}</dd>`+(EV.cams.length?`<dt>Camera flashes</dt><dd>${camFlashes}</dd>`:'')+`<dt>Ghost</dt><dd>${esc(ghostMsg)}</dd>`;
  $('#rLog').textContent= place===1?'new stamp on the page.':(player.hits>6?'too many hits. clean it up.':'run it back.');
  $('#rOrder').innerHTML=order.map((r,i)=>`<li${r.isP?' class="me"':''}><b>${i+1}</b>${r.isP?'You, '+esc(r.def.name):esc(r.def.tag)+' <em>'+esc(r.def.car)+'</em>'}</li>`).join('');
  page=sel; setWorld('flash'); studioCars.forEach((c,i)=>{ c.group.visible=i===sel; c.paint.roughness=clamp(c.def.rough+h.hits*.004,0,.6); });
  camSnap=true; modeT=0;
}

/* ---------------- CAMERA RIGS ---------------- */
const tgt=new THREE.Vector3();
function chaseCam(dt,r,inp){
  frame(r.dist,F);
  headV.copy(F.t).multiplyScalar(Math.cos(r.yaw*.6)).addScaledVector(F.r,Math.sin(r.yaw*.6)).normalize();
  const pos=r.m.group.position, boost=inp&&inp.nitro&&r.nitro>0?1:0;
  tgt.copy(pos).addScaledVector(headV,-(7.2+boost*.8)).addScaledVector(UP,2.3);
  if(camSnap){ camPos.copy(tgt); camSnap=false; } else camPos.lerp(tgt,1-Math.exp(-dt*9));
  cam.position.copy(camPos);
  if(shake>0){ cam.position.x+=(Math.random()-.5)*shake*.5; cam.position.y+=(Math.random()-.5)*shake*.4; shake=Math.max(0,shake-dt*2.2); }
  camLook.copy(pos).addScaledVector(headV,8).addScaledVector(UP,1);
  cam.lookAt(camLook); cam.rotateZ(-r.steer*.05-r.vx*.004);
  const h=78+r.v*.16+boost*10;
  cam.fov=lerp(cam.fov,clamp(hfovToV(h),52,98),1-Math.exp(-dt*4)); cam.updateProjectionMatrix();
}
let shot=0;
function cineCam(dt,r){
  frame(r.dist,F); const pos=r.m.group.position;
  const t=Math.floor(modeT/3.2)%3;
  if(t!==shot){ shot=t; camSnap=true; }
  if(t===0){ tgt.copy(pos).addScaledVector(F.t,8.5).addScaledVector(F.r,-3.4).addScaledVector(UP,.55); camLook.copy(pos).addScaledVector(UP,.7); }
  else if(t===1){ tgt.copy(pos).addScaledVector(F.t,-3).addScaledVector(F.r,4.6).addScaledVector(UP,.9); camLook.copy(pos).addScaledVector(F.t,1.5).addScaledVector(UP,.6); }
  else { tgt.copy(pos).addScaledVector(F.t,5).addScaledVector(F.r,2.2).addScaledVector(UP,EV.id==='blvd'?6:3.4); camLook.copy(pos).addScaledVector(F.t,-1).addScaledVector(UP,.3); }
  if(camSnap){ camPos.copy(tgt); camSnap=false; } else camPos.lerp(tgt,1-Math.exp(-dt*14));
  cam.position.copy(camPos); cam.lookAt(camLook); cam.rotateZ([.2,-.12,-.25][t]);
  cam.fov=clamp(hfovToV(62),38,90); cam.updateProjectionMatrix();
}
function studioCam(dt,d,hero){
  const c=hero?{p:[4.2,1.1,-3.6],l:[0,.6,-.3],roll:-.1,fov:32}:d.cam;
  const mul=cam.aspect<1?Math.min(2.3,.8/Math.pow(cam.aspect,.9)):1;
  const drift=Math.sin(modeT*.25)*.25;
  tgt.set(c.p[0]*mul+drift,c.p[1]*(cam.aspect<1?1+(mul-1)*.4:1),c.p[2]*mul);
  if(camSnap){ camPos.copy(tgt); camSnap=false; } else camPos.lerp(tgt,1-Math.exp(-dt*3));
  cam.position.copy(camPos);
  camLook.set(c.l[0],c.l[1]+(cam.aspect<1?-.15:0),c.l[2]); cam.lookAt(camLook); cam.rotateZ(c.roll);
  if(cam.aspect<1){ const dist=camPos.distanceTo(camLook); cam.fov=Math.min(76,hfovToV(THREE.MathUtils.radToDeg(2*Math.atan(2.6/dist)))); } else cam.fov=c.fov;
  cam.updateProjectionMatrix();
  sKey.position.copy(cam.position).add(new THREE.Vector3(0,2,0));
  floorStreaks.children.forEach((b,i)=>{ b.position.z+=dt*(2+i%4); if(b.position.z>12) b.position.z=-12; });
  bokeh.rotation.y+=dt*.02;
  if(dust.visible) dust.children.forEach(d=>{ d.position.x+=d.userData.v*dt*2; d.position.y+=d.userData.v*dt*.3; d.material.opacity=Math.max(0,.5-(d.position.x-1.5)/14); if(d.position.x>9){ d.position.set(1.2+Math.random(),.3+Math.random()*.6,-2.5+Math.random()*4); } });
}

/* ---------------- LOOP ---------------- */
setEvent(0); setupAttract(CARS[0]);
let bootP=0, last=performance.now(), bootStart=last;
function attractStep(dt){
  racers.forEach(r=>stepRacer(r,dt,null)); traffic.forEach(o=>stepTraffic(o,dt)); collide();
  racers.forEach(r=>poseRacer(r,dt)); traffic.forEach(o=>poseTraffic(o,dt)); if(EV.update) EV.update(dt); worldFx(dt);
  updateFx(dt,player); cineCam(dt,player);
}
function loop(now){
  requestAnimationFrame(loop);
  let dt=Math.min(.033,(now-last)/1000); last=now;
  modeT+=dt; ghostT+=dt;
  if(toastT>0){ toastT-=dt; if(toastT<=0) $('#hToast').style.opacity=0; }

  if(mode==='boot'||mode==='loading'||mode==='events'){
    attractStep(dt);
    if(mode==='boot'){ bootP=Math.min(1,(now-bootStart)/2200); $('#bootbar').style.width=(bootP*100)+'%'; if(bootP>=1&&!bootReady){ bootReady=true; $('#tap').classList.add('ready'); } }
    else if(mode==='loading'){ $('#ldbar').style.width=Math.min(100,modeT/3.6*100)+'%'; engine(player.v*.7,true); if(modeT>3.6) startRace(); }
    else engine(0,false);
    if(mode!=='race') draw(RS);
  }
  else if(mode==='select'||mode==='results'){
    studioCam(dt,CARS[page],mode==='results');
    draw(studio);
  }
  else if(mode==='race'){
    const inp=readInput();
    const sdt=dt*slowmo;
    if(EV.update) EV.update(sdt); worldFx(sdt);
    if(countdown>0){
      const prev=Math.ceil(countdown-.6); countdown-=dt; const c=Math.ceil(countdown-.6);
      if(c!==prev){ if(c>0){ $('#hMsg').textContent=c; sfx.beep(false); } else { $('#hMsg').textContent='Go'; sfx.beep(true); } }
      if(countdown<=0) $('#hMsg').textContent='';
      racers.forEach(r=>poseRacer(r,0)); traffic.forEach(o=>poseTraffic(o,0));
      engine(8+(inp.nitro?30:0)+Math.random()*3,true);
    } else {
      raceT+=sdt;
      racers.forEach(r=>{ if(r.finished&&!r.isP){ r.v*=.99; } stepRacer(r,sdt,r.isP&&!r.finished?inp:(r.isP?{steer:0,brake:true,nitro:false}:null)); });
      traffic.forEach(o=>stepTraffic(o,sdt));
      collide(); racers.forEach(r=>poseRacer(r,sdt)); traffic.forEach(o=>poseTraffic(o,sdt));
      engine(player.v,true); screech(clamp(player.slip,0,1));
      if(!player.finished){ ghostAcc+=sdt; if(ghostAcc>=.05){ ghostAcc=0; ghostRec.push([r2(raceT),r2(player.dist),r2(player.x),r2(player.yaw)]); } }
      if(player.finished){ if(finishHold===0){ $('#hMsg').textContent='Finish'; sfx.beep(true); } finishHold+=dt; slowmo=lerp(slowmo,.3,1-Math.exp(-dt*3)); if(finishHold>2.2) finishRace(); }
      for(const o of racers){ if(o===player) continue; const dd=o.dist-player.dist; if(dd>3&&dd<18&&Math.abs(o.x-player.x)<2.2){ player.nitro=Math.min(1,player.nitro+.12*sdt); } }
    }
    if(mode==='race'){
      if(ghostCar&&ghostData){ const g=ghostState(raceT);
        if(g){ ghostCar.group.visible=true; poseAt(ghostCar.group,g.dist,g.x,g.yaw,0); ghostCar.wheels.forEach(w=>w.rotation.x+=player.v*sdt/.37);
          if(countdown<=0&&!player.finished){ const gap=(g.dist-player.dist)/Math.max(player.v,15); const el=$('#hGhost'); el.textContent=gap>0?`Ghost ahead ${gap.toFixed(1)}s`:`Ghost behind ${(-gap).toFixed(1)}s`; el.classList.toggle('ahead',gap<=0); } }
        else ghostCar.group.visible=false; }
      updateFx(sdt,player); chaseCam(dt,player,inp);
      const place=standings().indexOf(player)+1;
      $('#hPos').innerHTML=`${place}<small>/${racers.length}</small>`;
      boardT-=dt; if(boardT<=0){ boardT=.25; $('#hBoard').innerHTML=standings().map((r,i)=>`<li class="${r.isP?'me':''}"><b>${i+1}</b>${r.isP?'YOU':esc(r.def.tag)}</li>`).join(''); }
      $('#hLap').textContent=`Lap ${clamp(Math.floor(Math.max(0,player.dist)/TR.L)+1,1,LAPS)} of ${LAPS}`;
      $('#hTime').textContent=fmt(raceT);
      $('#hSpd').textContent=Math.round(player.v*2.237);
      $('#hNos').style.width=(player.nitro*100)+'%';
      const nt=nextTurn(player), tw=$('#hTurn');
      if(nt&&countdown<=0){ tw.className='turn on '+(nt.dir>0?'l':'r'); tw.innerHTML=`<i>${nt.dir>0?'‹‹‹':'›››'}</i><span>${nt.d>0?Math.round(nt.d)+' m':'now'}</span>`; } else tw.className='turn';
      const fx=[]; if(player.fxLong>0) fx.push(`<b style="color:#b28cff">Long boost ${Math.ceil(player.fxLong)}s</b>`); if(player.fxOver>0) fx.push(`<b style="color:#ffb020">Overdrive ${Math.ceil(player.fxOver)}s</b>`);
      $('#hFx').innerHTML=fx.join('');
      draw(RS);
    }
  }
}
requestAnimationFrame(loop);
})();
