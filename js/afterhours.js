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
CARS.push(
 {id:'bell',name:'BELL 76',paint:0x14306b,metal:.7,rough:.16,rim:0x16181b,caliper:0xd8b04a,wing:true,livery:0xd8b04a,world:'ice',
  top:94,acc:21,grip:27,nitro:1.3,mass:1.2,
  kick:'Special issue',loc:'Independence Mall',when:'July 4th, 23:59',
  caption:'Blue and gold, built for exactly one thing: the longest straight in the city.',
  specs:'QUAD-TURBO W16 / 1,300 HP / 0–60 IN 2.4S / LONGTAIL AERO',
  rival:'Rival note: The Closer can\'t match it flat out. Just don\'t give it corners.',
  note:'bridge\nweapon.', notePos:{l:'56%',t:'34%'},
  cam:{p:[4.4,1.0,-3.9],l:[0,.55,-.2],roll:.08,fov:32}},
 {id:'passyunk',name:'PASSYUNK R',body:'hatch',paint:0xb3121c,metal:.5,rough:.22,rim:0xe8eaee,caliper:0xffc21a,wing:true,world:'flash',
  top:84,acc:26,grip:35,nitro:1.05,mass:.85,
  kick:'Corner shop',loc:'East Passyunk Ave',when:'Friday, 01:40',
  caption:'Double-parked outside the cheesesteak window. Fits through gaps nothing else will.',
  specs:'2.0L TURBO I4 / 420 HP / FRONT DIFF LOCK / 2,650 LB',
  rival:'Rival note: Bruiser will try to push you around. Stay out of his lane.',
  note:'lives in\nthe corners.', notePos:{l:'60%',t:'36%'},
  cam:{p:[-4.2,1.0,3.4],l:[0,.6,.4],roll:-.06,fov:32}},
 {id:'richmond',name:'RICHMOND',body:'truck',paint:0x1d2127,metal:.4,rough:.4,rim:0x0d0e10,caliper:0xff5a1f,wing:false,lightbar:true,world:'desert',
  top:83,acc:24,grip:28,nitro:1.15,mass:2.0,
  kick:'Work truck',loc:'Port Richmond',when:'Shift change, 05:00',
  caption:'Hauls pallets by day. By night it hauls everyone else out of its way.',
  specs:'SUPERCHARGED V8 / 710 HP / 650 LB-FT / 5,600 LB',
  rival:'Rival note: nothing moves this. Lean on The Wall and watch him fold.',
  note:'nothing\nmoves it.', notePos:{l:'55%',t:'33%'},
  cam:{p:[4.6,1.6,6.4],l:[0,1.0,.3],roll:-.07,fov:34}}
);
CARS.push(
 {id:'zenkai',name:'ZENKAI 37',body:'coupe',paint:0xc0121c,metal:.6,rough:.14,rim:0x111214,caliper:0xd42020,wing:true,widebody:true,spokes:3,world:'white',
  top:90,acc:24,grip:32,nitro:1.15,mass:1.1,
  kick:'Loading dock',loc:'Bay 17',when:'Saturday, 06:10',
  caption:'Widebody, bolted wing, six-spoke wheels. Shot against the loading doors at first light.',
  specs:'3.7L TWIN-TURBO V6 / 640 HP / WIDEBODY / 6-SPEED MANUAL',
  rival:'Rival note: Leech loves the wake off that wing. Break the tow early.',
  note:'wide. low.\nloud.', notePos:{l:'72%',t:'34%'},
  cam:{p:[4.6,.8,4.2],l:[0,.5,.3],roll:-.05,fov:32}},
 {id:'split',name:'SPLIT 63',body:'classic',classic:true,paint:0x050507,metal:.5,rough:.06,rim:0x0b0b0c,rimLip:0xd42020,caliper:0xd42020,wing:false,spokes:5,world:'flash',
  top:88,acc:23,grip:29,nitro:1.2,mass:1.25,
  kick:'Restomod',loc:'Chestnut Hill',when:'Sunday, 08:15',
  caption:'Sixty-year-old lines on a modern chassis. The split rear window is the whole point.',
  specs:'6.2L SUPERCHARGED V8 / 755 HP / SIDE-EXIT PIPES / 7-SPEED MANUAL',
  rival:'Rival note: The Closer hates getting passed by something this old.',
  note:'look at\nthe split.', notePos:{l:'58%',t:'34%'},
  cam:{p:[-4.6,.9,4.0],l:[0,.5,.4],roll:.05,fov:32}}
);
CARS.push(
 {id:'overload',name:'OVERLOAD 3K',body:'hyper',hyper:true,paint:0x10131a,metal:.75,rough:.2,rim:0x0b0b0c,caliper:0x2fe6ff,wing:true,livery:0x2fe6ff,accent:0x2fe6ff,spokes:7,world:'ice',
  top:100,acc:33,grip:33,nitro:1.35,mass:1.25,
  kick:'Prototype',loc:'Navy Yard, Dry Dock 1',when:'Unregistered, 02:59',
  caption:'Three thousand horsepower and no plates. Nobody at the Navy Yard will say who brought it.',
  specs:'QUAD E-MOTOR / 3,000 HP / 2,900 LB-FT / 0–60 IN 1.4S',
  rival:'Rival note: every rival wants this one. Expect a target on your back.',
  note:'don\'t\nfloor it.', notePos:{l:'60%',t:'34%'}, plate:'3000HP',
  cam:{p:[4.8,.9,-4.2],l:[0,.45,-.2],roll:.08,fov:30}}
);
// full spec sheets (slide-up panel)
const SHEETS={
 kage:{engine:'4.0L flat-plane V8, twin-turbo',power:'1,040 hp',torque:'780 lb-ft',zero:'2.3 s',vmax:'221 mph',weight:'3,120 lb',drive:'Rear-wheel drive',gearbox:'7-speed dual-clutch'},
 noctis:{engine:'6.5L naturally aspirated V12',power:'820 hp',torque:'560 lb-ft',zero:'2.9 s',vmax:'212 mph',weight:'3,480 lb',drive:'Rear-wheel drive',gearbox:'6-speed manual, steel clutch'},
 vanta:{engine:'3.0L V6 + two e-motors',power:'960 hp',torque:'740 lb-ft',zero:'2.4 s',vmax:'205 mph',weight:'2,980 lb',drive:'All-wheel drive',gearbox:'8-speed sequential'},
 kern:{engine:'3.8L flat-six + front e-axle',power:'880 hp',torque:'690 lb-ft',zero:'2.5 s',vmax:'208 mph',weight:'3,250 lb',drive:'All-wheel drive (electric front)',gearbox:'8-speed dual-clutch'},
 dune:{engine:'4.0L twin-turbo V8 hybrid',power:'740 hp',torque:'900 lb-ft',zero:'3.1 s',vmax:'183 mph',weight:'5,100 lb',drive:'All-wheel drive, locking diffs',gearbox:'9-speed automatic'},
 sovereign:{engine:'6.0L twin-turbo V12',power:'790 hp',torque:'830 lb-ft',zero:'3.2 s',vmax:'196 mph',weight:'4,650 lb',drive:'Rear-wheel drive',gearbox:'9-speed automatic'},
 bell:{engine:'8.0L W16, quad-turbo',power:'1,300 hp',torque:'1,180 lb-ft',zero:'2.4 s',vmax:'236 mph',weight:'4,100 lb',drive:'All-wheel drive',gearbox:'7-speed dual-clutch'},
 passyunk:{engine:'2.0L turbo inline-four',power:'420 hp',torque:'390 lb-ft',zero:'3.6 s',vmax:'168 mph',weight:'2,650 lb',drive:'Front-wheel drive, locking diff',gearbox:'6-speed manual'},
 richmond:{engine:'6.2L supercharged V8',power:'710 hp',torque:'650 lb-ft',zero:'3.9 s',vmax:'162 mph',weight:'5,600 lb',drive:'Four-wheel drive',gearbox:'10-speed automatic'},
 zenkai:{engine:'3.7L twin-turbo V6',power:'640 hp',torque:'560 lb-ft',zero:'3.2 s',vmax:'198 mph',weight:'3,300 lb',drive:'Rear-wheel drive',gearbox:'6-speed manual'},
 split:{engine:'6.2L supercharged V8',power:'755 hp',torque:'715 lb-ft',zero:'3.0 s',vmax:'201 mph',weight:'3,450 lb',drive:'Rear-wheel drive',gearbox:'7-speed manual'},
 overload:{engine:'Four axial-flux e-motors, 2.2 MW',power:'3,000 hp',torque:'2,900 lb-ft',zero:'1.4 s',vmax:'268 mph',weight:'4,300 lb',drive:'All-wheel drive, torque vectoring',gearbox:'Single-speed, two-stage'},
 granfour:{engine:'4.0L twin-turbo V8',power:'690 hp',torque:'680 lb-ft',zero:'3.1 s',vmax:'199 mph',weight:'4,400 lb',drive:'All-wheel drive',gearbox:'9-speed wet-clutch'}
};
const GHOST_CAR={id:'ghost',name:'THE GHOST',paint:0x2b3038,metal:.7,rough:.35,rim:0x0d0e10,caliper:0xff5a1f,wing:true,top:89,acc:22,grip:30,nitro:1};
const LAPS=2; // default; an event can set its own laps
function laps(){ return EV.laps||LAPS; }
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
{ const SEEK={apex:.35,wall:.45,leech:.85,bruiser:.55,closer:.5,wild:.95}; RIVALS.forEach(r=>r.P.seek=SEEK[r.id]); }
/* Per-event machine picks + track bias (grip tracks vs boulevard straights). */
const EVENT_CAR_BIAS={
 tunnel:{gripW:1.22,topW:.94,nitroW:1.05},
 blvd:{gripW:.9,topW:1.12,nitroW:1.08},
 bridge:{gripW:.95,topW:1.15,nitroW:1.12},
 grand:{gripW:1.02,topW:1.1,nitroW:1.12},
 dockside:{gripW:1.08,topW:1.05,nitroW:1.06},
 skyline:{gripW:1.05,topW:1.08,nitroW:1.1},
 midnight:{gripW:1,topW:1.12,nitroW:1.14}
};
const RIVAL_CAR_PREF={
 apex:{gripW:1.18,topW:.98,ids:['vanta','kage','kern','granfour','passyunk']},
 wall:{gripW:1.05,topW:1,ids:['granfour','dune','sovereign','vanta']},
 leech:{gripW:.95,topW:1.05,nitroW:1.15,ids:['zenkai','noctis','sovereign','kage','vanta']},
 bruiser:{gripW:.92,topW:1.02,ids:['richmond','dune','sovereign','granfour','noctis']},
 closer:{gripW:1.05,topW:1.08,nitroW:1.2,ids:['bell','noctis','vanta','kern','sovereign']},
 wild:{gripW:.88,topW:1.14,nitroW:1.25,ids:['split','noctis','dune','kage','granfour']}
};
function buildRivalForEvent(rival,eventId,taken){
 const eb=EVENT_CAR_BIAS[eventId]||EVENT_CAR_BIAS.tunnel, rp=RIVAL_CAR_PREF[rival.id]||{};
 let best=null, bestSc=-1e9;
 for(const c of CARS){
  if(taken.includes(c.id)) continue;
  if(c.id==='overload'&&Math.random()<.85) continue; // the 3,000 hp car only shows up on a rival's grid now and then
  const pref=rp.ids&&rp.ids.includes(c.id)?9:0;
  const sc=c.grip*(eb.gripW||1)*(rp.gripW||1)+c.top*(eb.topW||1)*(rp.topW||1)+c.nitro*18*(eb.nitroW||1)*(rp.nitroW||1)+pref+Math.random()*4;
  if(sc>bestSc){ bestSc=sc; best=c; }
 }
 const base=best||CARS.find(c=>!taken.includes(c.id))||CARS[0];
 taken.push(base.id);
 return Object.assign({},base,{id:rival.id,chassisId:base.id,tag:rival.tag,color:rival.color,car:base.name,P:rival.P,mass:(rival.P.mass||1)*(base.mass||1),rivalNote:base.rival});
}
function eventAiBias(){ return EV.open?{straight:1.06,tight:.93,line:.85}:{straight:.97,tight:1.06,line:1.12}; }
function nearestChaser(r,maxG){
 let best=null,bd=maxG||34;
 for(const o of racers){ if(o===r||o.finished) continue; const gap=r.dist-o.dist; if(gap>1.5&&gap<bd){ bd=gap; best=o; } }
 return best;
}
function nearestAlongside(r,span){
 let best=null,bd=span||9;
 for(const o of racers){ if(o===r||o.finished) continue; const gap=Math.abs(r.dist-o.dist); if(gap<bd){ bd=gap; best=o; } }
 return best;
}
function scorePickup(r,p,P,s0,L){
 if(p.cd>0) return -999;
 let dd=p.s-s0; if(dd<0) dd+=L;
 if(dd<5||dd>72) return -999;
 const lat=Math.abs(p.x-r.x), det=lat*1.35+dd*.045;
 let val=P.seek*12;
 if(p.type==='refill'&&r.nitro>.82) val-=9;
 if(p.type==='long'&&(P.nitro==='pass'||P.nitro==='reserve')) val+=2.5;
 if(p.type==='over'&&(P.nitro==='eager'||P.nitro==='burst')) val+=3;
 if(r.nitro<.35) val+=4;
 if(r.def.id==='wild') val+=2;
 if(r.def.id==='apex'&&lat>3.2) val-=3;
 return val-det*(1.1-P.risk*.35);
}
/* How each persona approaches a corner (zone = start thinking, late = carry speed deeper). */
const CORNER_APPROACH={
 apex:{zone:88,late:.22,brakeMax:.52,carry:1.06,lineIn:1.1,vBonus:1.05,style:'early'},
 wall:{zone:70,late:.45,brakeMax:.58,carry:.94,lineIn:.75,vBonus:.98,style:'safe'},
 leech:{zone:55,late:.62,brakeMax:.38,carry:1.08,lineIn:.95,vBonus:1.06,style:'momentum'},
 bruiser:{zone:78,late:.32,brakeMax:.65,carry:.92,lineIn:.7,vBonus:.97,style:'heavy'},
 closer:{zone:82,late:.38,brakeMax:.48,carry:1.02,lineIn:1.05,vBonus:1.03,style:'smooth'},
 wild:{zone:42,late:.82,brakeMax:.72,carry:1.12,lineIn:1.28,vBonus:1.1,style:'late'}
};
function aiCornerPlan(r,d,P,ka,turn,evB,rubber,vF,G,M){
 const st=CORNER_APPROACH[d.id]||CORNER_APPROACH.apex, W=TR.W;
 const grip=G||d.grip, moodPush=M?(1+M.D*.07+(M.mood==='allin'?.05:0)):1;
 let vTarget=d.top*r.skill*rubber*vF*(Math.abs(ka)<.003?evB.straight:evB.tight);
 let brake=0, lineShift=0, inApproach=false;
 if(turn&&turn.d>0&&turn.d<st.zone+r.v*st.late*1.1){
  inApproach=true;
  const zone=st.zone+r.v*st.late;
  const t=clamp(1-turn.d/zone,0,1);
  const entry=turn.d<zone*(.28+st.late*.35);
  const kTurn=Math.abs(kAhead(r.dist+Math.max(0,turn.d-zone*.35),Math.min(28,turn.d+12)));
  const kaEff=Math.max(Math.abs(ka)*(.25+t*.35),kTurn*t);
  const vLim=Math.sqrt(1.9*grip*.95*P.risk*st.carry*moodPush/Math.max(kaEff,.0028))*st.vBonus;
  vTarget=Math.min(vTarget,vLim);
  if(r.v>vTarget+1.5){
   const over=(r.v-vTarget)/Math.max(vTarget,22);
   brake=clamp(over*st.brakeMax*(.35+t*.65),0,st.brakeMax);
   if(st.style==='late'&&turn.d>zone*.5) brake*=.25+ t*.75;
   if(st.style==='momentum'&&turn.d>zone*.45) brake*=.55;
   if(st.style==='early'&&turn.d>zone*.55) brake*=.7;
   if(M&&M.mood==='allin') brake*=.72;
   if(M&&M.mood==='push') brake*=.85;
  }
  if(entry) lineShift=turn.dir*(W*.11)*st.lineIn;
  else if(st.style==='late') lineShift=turn.dir*(W*.06)*st.lineIn*(1-t);
  else lineShift=turn.dir*(W*.08)*st.lineIn*t;
  if(d.id==='wild') lineShift+=turn.dir*(W*.08)*(1-t);
 }
 else if(Math.abs(ka)>.006){
  const vLim=Math.sqrt(1.9*grip*.95*P.risk*moodPush/Math.max(Math.abs(ka),.003));
  vTarget=Math.min(vTarget,vLim*1.02);
  if(r.v>vTarget+3) brake=clamp((r.v-vTarget)/40,.15,.45);
 }
 return {vTarget,brake,lineShift,inApproach};
}

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

/* ---------------- NEXT-GEN LOOK: wet asphalt, light streaks, volumetrics, car light rigs ---------------- */
const LOOK={wet:false,roadMats:[]};
// puddled asphalt: a roughness map (green channel) with glossy puddles and a fine normal map for the grain
const WETMAPS=(()=>{ const N=256, hgt=new Float32Array(N*N), rnd=rng(77);
  const grid=(n)=>{ const a=[]; for(let i=0;i<(n+1)*(n+1);i++) a.push(rnd()); return (x,y)=>{ const fx=x/N*n, fy=y/N*n, ix=Math.floor(fx), iy=Math.floor(fy), tx=fx-ix, ty=fy-iy, s=t=>t*t*(3-2*t);
    const g=(i,j)=>a[((j%n)*(n+1))+(i%n)]; return lerp(lerp(g(ix,iy),g(ix+1,iy),s(tx)),lerp(g(ix,iy+1),g(ix+1,iy+1),s(tx)),s(ty)); }; };
  const o1=grid(4), o2=grid(9), o3=grid(32), o4=grid(96);
  for(let y=0;y<N;y++) for(let x=0;x<N;x++) hgt[y*N+x]=o1(x,y)*.55+o2(x,y)*.3+o3(x,y)*.1+o4(x,y)*.05;
  const rough=canvasTex(N,N,(g)=>{ const im=g.createImageData(N,N);
    for(let i=0;i<N*N;i++){ const h=hgt[i], puddle=clamp((.42-h)/.08,0,1), v=Math.round(255*lerp(.62+(hgt[(i*7)%(N*N)]-.5)*.2,.06,puddle)); im.data.set([v,v,v,255],i*4); } g.putImageData(im,0,0); });
  const nrm=canvasTex(N,N,(g)=>{ const im=g.createImageData(N,N), H=(x,y)=>hgt[((y+N)%N)*N+((x+N)%N)];
    for(let y=0;y<N;y++) for(let x=0;x<N;x++){ const dx=(H(x+1,y)-H(x-1,y))*9+(Math.random()-.5)*.35, dy=(H(x,y+1)-H(x,y-1))*9+(Math.random()-.5)*.35, l=Math.hypot(dx,dy,1);
      im.data.set([Math.round((-dx/l*.5+.5)*255),Math.round((-dy/l*.5+.5)*255),Math.round((1/l*.5+.5)*255),255],(y*N+x)*4); } g.putImageData(im,0,0); });
  const t=c=>{ const x=new THREE.CanvasTexture(c); x.wrapS=x.wrapT=THREE.RepeatWrapping; x.anisotropy=4; return x; };
  return {rough:t(rough),normal:t(nrm)};
})();
function wetRoad(m){ m.roughnessMap=WETMAPS.rough; m.normalMap=WETMAPS.normal; m.normalScale=new THREE.Vector2(.35,.35); m.userData.baseRough=m.roughness; LOOK.roadMats.push(m); return m; }
const gradTex=(w,h,draw)=>{ const t=new THREE.CanvasTexture(canvasTex(w,h,draw)); return t; };
// long reflection streaks on wet asphalt under every light
const streakTex=gradTex(64,256,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'rgba(255,255,255,0)'); gr.addColorStop(.35,'rgba(255,255,255,.55)'); gr.addColorStop(.5,'rgba(255,255,255,1)'); gr.addColorStop(.65,'rgba(255,255,255,.55)'); gr.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=gr; g.fillRect(0,0,w,h); g.globalCompositeOperation='destination-in'; const gx=g.createLinearGradient(0,0,w,0); gx.addColorStop(0,'rgba(0,0,0,0)'); gx.addColorStop(.5,'rgba(0,0,0,1)'); gx.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gx; g.fillRect(0,0,w,h); });
// soft vertical falloff for light cones (bright at the top of the texture)
const coneTex=gradTex(8,128,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.4,'rgba(255,255,255,.35)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
// headlight throw on the road: narrow and hot near the car, wide and faint far away
const beamTex=gradTex(128,256,(g,w,h)=>{ for(let y=0;y<h;y++){ const t=y/h, half=(.12+.38*t)*w, a=Math.pow(1-t,1.6)*.9; const gr=g.createLinearGradient(w/2-half,0,w/2+half,0);
  gr.addColorStop(0,'rgba(255,255,255,0)'); gr.addColorStop(.5,`rgba(255,255,255,${a})`); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,y,w,1); } });
const flameTex=gradTex(8,128,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'rgba(120,190,255,1)'); gr.addColorStop(.35,'rgba(170,120,255,.8)'); gr.addColorStop(.7,'rgba(255,140,60,.55)'); gr.addColorStop(1,'rgba(255,90,20,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
const addMat=(o)=>new THREE.MeshBasicMaterial(Object.assign({transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false},o));
const STREAK_MAT=addMat({map:streakTex,color:0xcfe0ff,opacity:.14}), TSTREAK_MAT=addMat({map:streakTex,color:0xe6f0ff,opacity:.24}), TAIL_MAT=addMat({map:streakTex,color:0xff2030,opacity:.14});
const LAMPCONE_MAT=addMat({map:coneTex,color:0xdfe9ff,opacity:.035,side:THREE.DoubleSide}), BEAM_MAT=addMat({map:beamTex,color:0xeaf2ff,opacity:.3}), CONE_MAT=addMat({map:coneTex,color:0xeaf2ff,opacity:.03,side:THREE.DoubleSide});
const FLAME_MAT=addMat({map:flameTex,opacity:.95,side:THREE.DoubleSide});
const STREAK_GEO=new THREE.PlaneGeometry(1.5,18).rotateX(-Math.PI/2), LAMPCONE_GEO=new THREE.CylinderGeometry(.3,4.4,8.6,20,1,true);
const BEAM_GEO=new THREE.PlaneGeometry(5.2,17).rotateX(-Math.PI/2).translate(0,.06,8.5), HCONE_GEO=new THREE.ConeGeometry(1.7,13,18,1,true).rotateX(-Math.PI/2).translate(0,0,6.5);
const FLAME_GEO=new THREE.ConeGeometry(.2,1.3,10,1,true).rotateX(-Math.PI/2).translate(0,0,-.65), TAILREF_GEO=new THREE.PlaneGeometry(1.8,6).rotateX(-Math.PI/2).translate(0,.05,-3);
function instAll(S,geo,mat,arr){ if(!arr.length) return null; const im=new THREE.InstancedMesh(geo,mat,arr.length); arr.forEach((m,i)=>im.setMatrixAt(i,m)); S.add(im); return im; }
// streaks from a list of ground-level matrices (position + road-aligned rotation)
function lampStreaks(S,mats,tunnel){ return instAll(S,STREAK_GEO,tunnel?TSTREAK_MAT:STREAK_MAT,mats); }
// volumetric cones hanging under lamp heads, from head matrices
function lampCones(S,headMats){ const v=new THREE.Vector3(), q=new THREE.Quaternion(), sc=new THREE.Vector3(), one=new THREE.Vector3(1,1,1);
  return instAll(S,LAMPCONE_GEO,LAMPCONE_MAT,headMats.map(m=>{ m.decompose(v,q,sc); v.y-=4.4; return new THREE.Matrix4().compose(v,new THREE.Quaternion(),one); })); }
function setWeather(wet){ LOOK.wet=wet;
  LOOK.roadMats.forEach(m=>{ m.roughness=(m.userData.baseRough||.45)*(wet?.5:1.15); m.envMapIntensity=wet?1.6:1; m.normalScale.set(wet?.18:.35,wet?.18:.35); });
  STREAK_MAT.opacity=wet?.5:.14; TAIL_MAT.opacity=wet?.45:.14; LAMPCONE_MAT.opacity=wet?.065:.035; CONE_MAT.opacity=wet?.05:.03;
  if(SKY_MAT) SKY_MAT.color.setScalar(wet?.62:1); }
// headlight throw, volumetric beams, exhaust flames and a wet tail-light reflection on every car
const STAGE_V=[40,58,72];
function speedStage(r){ let s=0; for(const v of STAGE_V) if(r.v>v) s++; if(r.nosOn) s++; return Math.min(4,s); }
const STAGE={beam:[.2,.28,.38,.5,.64],cone:[.012,.022,.036,.055,.08],lines:[0,.12,.22,.34,.48],len:[.6,.8,1,1.25,1.5],trail:[0,.35,.6,.85,1.15],blur:[0,.2,.45,.7,1]};
function rigLights(group,B,traffic){
  const front=traffic?2.26:B.front, hy=traffic?.72:B.headY, hx=traffic?.6:B.w*.36, rear=traffic?2.26:B.rear;
  const beamM=traffic?BEAM_MAT:BEAM_MAT.clone(), coneM=traffic?CONE_MAT:CONE_MAT.clone(); // racers get their own so the glow can follow their speed
  const beam=new THREE.Mesh(BEAM_GEO,beamM); beam.position.set(0,0,front-.2); group.add(beam);
  const tail=new THREE.Mesh(TAILREF_GEO,TAIL_MAT); tail.position.set(0,0,-rear); group.add(tail);
  if(traffic) return {};
  const cones=[-1,1].map(sd=>{ const c=new THREE.Mesh(HCONE_GEO,coneM); c.position.set(sd*hx,hy,front-.1); c.rotation.x=.06; group.add(c); return c; });
  const flames=[-1,1].map(sd=>{ const fl=new THREE.Mesh(FLAME_GEO,FLAME_MAT); fl.position.set(sd*.45,B.base+.22,-rear-.08); fl.visible=false; group.add(fl); return fl; });
  return {cones,flames,beamM,coneM};
}
// tail-light trails: two ribbons following each car, drawn when it's really moving
function makeTrail(){ const N=22, V=N*2*2, pos=new Float32Array(V*3), col=new Float32Array(V*3), idx=[];
  for(let l=0;l<2;l++) for(let i=0;i<N-1;i++){ const a=(l*N+i)*2; idx.push(a,a+1,a+2,a+1,a+3,a+2); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3)); g.setAttribute('color',new THREE.BufferAttribute(col,3)); g.setIndex(idx);
  const mesh=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));
  mesh.frustumCulled=false; return {mesh,pos,col,N,hist:[[],[]]}; }
const trV=new THREE.Vector3(), trD=new THREE.Vector3(), trS=new THREE.Vector3();
function updateTrail(r){ const T=r.trail; if(!T) return; const B=BODIES[r.def.body||'wedge'], N=T.N;
  const glow=STAGE.trail[r.stage||0];
  [-1,1].forEach((sd,l)=>{ const h=T.hist[l]; r.m.group.localToWorld(trV.set(sd*.62,B.tailY,-B.rear-.05));
    if(!h.length||h[0].distanceToSquared(trV)>.5) { h.unshift(trV.clone()); if(h.length>N) h.pop(); } else h[0].copy(trV);
    for(let i=0;i<N;i++){ const p=h[Math.min(i,h.length-1)]||trV, pn=h[Math.min(i+1,h.length-1)]||p, pp=h[Math.max(i-1,0)]||p;
      trD.subVectors(pp,pn); trD.y=0; if(trD.lengthSq()<1e-6) trD.set(0,0,1); trD.normalize(); trS.crossVectors(trD,UP).multiplyScalar(.07*(1-i/N)+.02);
      const k=((l*N+i)*2)*3, f=glow*Math.pow(1-i/N,1.4);
      T.pos[k]=p.x+trS.x; T.pos[k+1]=p.y; T.pos[k+2]=p.z+trS.z; T.pos[k+3]=p.x-trS.x; T.pos[k+4]=p.y; T.pos[k+5]=p.z-trS.z;
      T.col[k]=T.col[k+3]=f; T.col[k+1]=T.col[k+4]=f*.08; T.col[k+2]=T.col[k+5]=f*.12; } });
  T.mesh.geometry.attributes.position.needsUpdate=true; T.mesh.geometry.attributes.color.needsUpdate=true; }
// night sky dome for open-air events: stars, a moon, and low clouds lit orange by the city
let SKY_MAT=null;
function addDome(S){
  if(!SKY_MAT){ const tex=CT(canvasTex(1024,512,(g,w,h)=>{ const R=rng(9);
    const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#01030a'); gr.addColorStop(.3,'#060b18'); gr.addColorStop(.44,'#141a2c'); gr.addColorStop(.5,'#2b2331'); gr.addColorStop(.53,'#151b2b'); gr.addColorStop(1,'#0b0e15'); g.fillStyle=gr; g.fillRect(0,0,w,h);
    for(let i=0;i<520;i++){ const y=R()*h*.36; g.fillStyle=`rgba(220,230,255,${.25+R()*.6})`; const s=R()<.08?1.6:.9; g.fillRect(R()*w,y,s,s); }
    const mg=g.createRadialGradient(w*.72,h*.2,0,w*.72,h*.2,60); mg.addColorStop(0,'rgba(240,244,255,1)'); mg.addColorStop(.12,'rgba(230,236,255,.9)'); mg.addColorStop(.2,'rgba(170,190,230,.25)'); mg.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=mg; g.fillRect(w*.72-60,h*.2-60,120,120);
    for(let i=0;i<420;i++){ const y=h*(.33+Math.pow(R(),.6)*.165), x=R()*w, rx=40+R()*140, ry=5+R()*14, t=(y/h-.33)/.165;
      const c=g.createRadialGradient(x,y,0,x,y,rx); const col=t>.8?`${96+R()*30|0},${70+R()*16|0},${72|0}`:`${34+t*40|0},${42+t*26|0},${62+t*14|0}`; c.addColorStop(0,`rgba(${col},${.04+R()*.06})`); c.addColorStop(1,`rgba(${col},0)`);
      g.save(); g.translate(x,y); g.scale(1,ry/rx); g.translate(-x,-y); g.fillStyle=c; g.fillRect(x-rx,y-rx,rx*2,rx*2); g.restore(); }
    const hz=g.createLinearGradient(0,h*.44,0,h*.52); hz.addColorStop(0,'rgba(255,150,90,0)'); hz.addColorStop(.7,'rgba(255,140,80,.14)'); hz.addColorStop(1,'rgba(255,140,80,0)'); g.fillStyle=hz; g.fillRect(0,h*.44,w,h*.08); }));
    SKY_MAT=new THREE.MeshBasicMaterial({map:tex,side:THREE.BackSide,fog:false,depthWrite:false}); }
  const m=new THREE.Mesh(new THREE.SphereGeometry(1400,40,20),SKY_MAT); m.renderOrder=-1; m.frustumCulled=false; S.add(m); S.userData.dome=m; return m;
}

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
/* car detail: metallic flake under clear coat, tire tread + sidewall, drilled rotors, plates */
const CARTEX=(()=>{ const t=(c,rep)=>{ const x=new THREE.CanvasTexture(c); if(rep){ x.wrapS=x.wrapT=THREE.RepeatWrapping; x.repeat.set(rep,rep); } x.anisotropy=4; return x; };
  const flake=canvasTex(128,128,(g)=>{ const im=g.createImageData(128,128); for(let i=0;i<128*128;i++){ const a=Math.random()*Math.PI*2, m=Math.random()*.55;
    im.data.set([Math.round((Math.cos(a)*m*.5+.5)*255),Math.round((Math.sin(a)*m*.5+.5)*255),255,255],i*4); } g.putImageData(im,0,0); });
  const tread=canvasTex(256,32,(g,w,h)=>{ g.fillStyle='#8a8a8a'; g.fillRect(0,0,w,h); g.fillStyle='#1a1a1a';
    [6,15,24].forEach(y=>g.fillRect(0,y,w,2)); for(let x=0;x<w;x+=8){ g.fillRect(x,0,2,6); g.fillRect(x+4,26,2,6); g.save(); g.translate(x,16); g.rotate(.6); g.fillRect(0,-5,2,10); g.restore(); } });
  const side=canvasTex(256,256,(g,w,h)=>{ g.fillStyle='#050506'; g.fillRect(0,0,w,h);
    g.strokeStyle='#0d0d0e'; g.lineWidth=10; g.beginPath(); g.arc(128,128,112,0,7); g.stroke();
    g.fillStyle='#1d1e21'; g.font='800 15px "Arial Narrow",Arial,sans-serif'; g.textAlign='center'; g.textBaseline='middle';
    ['AFTERHOURS','R19','AFTERHOURS','R19'].forEach((s,i)=>{ g.save(); g.translate(128,128); g.rotate(i*Math.PI/2); g.fillText(s,0,-100); g.restore(); }); });
  const rotor=canvasTex(128,128,(g,w,h)=>{ const gr=g.createRadialGradient(64,64,10,64,64,64); gr.addColorStop(0,'#2a2c30'); gr.addColorStop(.45,'#5a5e64'); gr.addColorStop(.9,'#8d9299'); gr.addColorStop(1,'#3a3c40');
    g.fillStyle=gr; g.fillRect(0,0,w,h); g.fillStyle='#16171a'; for(let i=0;i<36;i++){ const a=i/36*Math.PI*2, r=40+(i%3)*7; g.beginPath(); g.arc(64+Math.cos(a)*r,64+Math.sin(a)*r,2.2,0,7); g.fill(); } });
  return {flake:t(flake,6),tread:t(tread),side:t(side),rotor:t(rotor)};
})();
const tireTreadM=new THREE.MeshStandardMaterial({color:0x0e0e0f,roughness:.9,envMapIntensity:.5,bumpMap:CARTEX.tread,bumpScale:.015}), tireSideM=new THREE.MeshStandardMaterial({map:CARTEX.side,roughness:.92,metalness:0,envMapIntensity:.4});
const rotorM=new THREE.MeshStandardMaterial({map:CARTEX.rotor,metalness:.85,roughness:.35}), barrelM=new THREE.MeshStandardMaterial({color:0x0a0a0b,metalness:.6,roughness:.5,side:THREE.DoubleSide});
const trimM=new THREE.MeshStandardMaterial({color:0x050506,metalness:.2,roughness:.25}), chromeTrimM=new THREE.MeshStandardMaterial({color:0xdfe4ea,metalness:1,roughness:.1});
const gapM=new THREE.MeshBasicMaterial({color:0x020203}), lensM=new THREE.MeshStandardMaterial({color:0x0b0e13,metalness:.9,roughness:.08}), exhM=new THREE.MeshStandardMaterial({color:0xb8bec6,metalness:1,roughness:.18});
const TIRE_GEO=new THREE.CylinderGeometry(.37,.37,.3,32), ROTOR_GEO=new THREE.CylinderGeometry(.25,.25,.024,28), BARREL_GEO=new THREE.CylinderGeometry(.275,.275,.2,24,1,true);
const PLATE_CACHE={};
function plateTex(txt){ if(PLATE_CACHE[txt]) return PLATE_CACHE[txt]; const c=canvasTex(256,64,(g,w,h)=>{ g.fillStyle='#e9ecef'; g.fillRect(0,0,w,h); g.strokeStyle='#1a2a4a'; g.lineWidth=4; g.strokeRect(3,3,w-6,h-6);
  g.fillStyle='#1a2a4a'; g.font='800 38px "Arial Narrow",Arial,sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3,w*.86); g.font='700 10px Arial'; g.fillText('PENNSYLVANIA',w/2,10); });
  return (PLATE_CACHE[txt]=CT(c)); }
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
 hatch:{pts:[[-1.98,.42],[-2.04,.78],[-1.98,1.0],[-1.5,1.06],[-.5,1.04],[.5,1.0],[1.3,.88],[1.82,.7],[2.0,.52],[2.02,.4]],base:.3,
   cab:[[-1.92,1.0],[-1.72,1.52],[-.3,1.6],[.5,1.34],[1.02,1.02]],cabBase:[-1.92,.98,1.02,.98],w:1.84,cw:1.5,wr:.35,wb:1.26,tr:.94,front:2.02,rear:2.04,headY:.76,tailY:.94,wingY:1.66,wingZ:-1.82},
 truck:{pts:[[-2.62,.66],[-2.68,1.06],[-2.6,1.2],[-1.6,1.22],[-.6,1.22],[.2,1.24],[1.1,1.3],[1.9,1.24],[2.5,1.06],[2.64,.78]],base:.56,
   cab:[[-.62,1.22],[-.5,1.96],[.62,2.0],[1.14,1.62],[1.56,1.3]],cabBase:[-.62,1.2,1.56,1.28],w:2.04,cw:1.8,wr:.5,wb:1.72,tr:1.06,front:2.64,rear:2.68,headY:1.06,tailY:1.02,wingY:2.1,wingZ:-2.2},
 coupe:{pts:[[-2.12,.4],[-2.18,.74],[-2.08,.96],[-1.6,1.02],[-.8,1.04],[.2,.98],[1.1,.86],[1.75,.72],[2.12,.54],[2.16,.38]],base:.24,
   cab:[[-1.75,.98],[-1.1,1.24],[-.2,1.32],[.45,1.12],[.9,.9]],cabBase:[-1.75,.96,.9,.88],w:1.9,cw:1.36,wr:.36,wb:1.3,tr:1.0,front:2.16,rear:2.18,headY:.7,tailY:.88,wingY:1.36,wingZ:-1.95},
 classic:{pts:[[-2.2,.42],[-2.3,.7],[-2.2,.86],[-1.6,.94],[-.9,.98],[-.2,.9],[.6,.86],[1.4,.8],[2.0,.66],[2.3,.5],[2.36,.4]],base:.22,
   cab:[[-1.95,.92],[-1.2,1.3],[-.55,1.34],[-.1,1.14],[.25,.9]],cabBase:[-1.95,.9,.25,.86],w:1.82,cw:1.3,wr:.36,wb:1.28,tr:.96,front:2.36,rear:2.3,headY:.64,tailY:.78,wingY:1.1,wingZ:-2.1},
 hyper:{pts:[[-2.5,.34],[-2.56,.64],[-2.42,.8],[-1.6,.9],[-.6,.94],[.4,.86],[1.3,.66],[1.95,.5],[2.4,.38],[2.46,.3]],base:.2,
   cab:[[-1.35,.9],[-.8,1.2],[.1,1.25],[.7,1.03],[1.15,.74]],cabBase:[-1.35,.88,1.15,.72],w:2.02,cw:1.28,wr:.37,wb:1.5,tr:1.02,front:2.46,rear:2.56,headY:.5,tailY:.72,wingY:1.5,wingZ:-2.2,swan:true},
 fastback:{pts:[[-2.42,.4],[-2.48,.76],[-2.34,.92],[-1.7,.97],[-.6,.99],[.5,.97],[1.4,.9],[2.1,.76],[2.44,.6],[2.48,.4]],base:.26,
   cab:[[-2.15,.94],[-1.3,1.28],[.3,1.4],[1.0,1.16],[1.42,.93]],cabBase:[-2.15,.92,1.42,.92],w:1.94,cw:1.46,wr:.38,wb:1.55,tr:1.0,front:2.48,rear:2.48,headY:.72,tailY:.86,wingY:1.08,wingZ:-2.3}
};
const bronzeM=()=>new THREE.MeshStandardMaterial({color:0x8a5a2b,metalness:1,roughness:.25});
function buildCar(def,opts){
  opts=opts||{}; const B=BODIES[def.body||'wedge'];
  const g=new THREE.Group();
  const paint=new THREE.MeshPhysicalMaterial({color:def.paint,metalness:def.metal,roughness:def.rough,clearcoat:def.matte?0:1,clearcoatRoughness:.03,envMapIntensity:1.25});
  if(!def.matte){ paint.normalMap=CARTEX.flake; paint.normalScale=new THREE.Vector2(.12+def.metal*.18,.12+def.metal*.18); } // metallic flake under a smooth clear coat
  const glass=new THREE.MeshPhysicalMaterial({color:0x0a0e14,metalness:.15,roughness:.02,clearcoat:1,clearcoatRoughness:.02,reflectivity:1,envMapIntensity:1.7});
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
  // headlight units: glossy housing, two projector lenses and an LED running-light strip
  [1,-1].forEach(sd=>{ box(.56,.13,.12,lensM,sd*hx,B.headY,F-.17,sd*.38);
    [.1,-.1].forEach(o=>{ const l=new THREE.Mesh(new THREE.CircleGeometry(.045,16),headM); l.position.set(sd*hx+o*Math.cos(.38),B.headY-.005,F-.1+o*sd*Math.sin(.38)*-1); g.add(l); });
    box(.5,.018,.03,headM,sd*hx,B.headY+.075,F-.14,sd*.38); });
  // taillights: full-width bar plus two clusters, third brake light, reverse lights
  box(B.w*.95,.035,.05,tailM,0,B.tailY,-Rr-.03);
  [1,-1].forEach(sd=>{ box(.46,.1,.05,lensM,sd*B.w*.33,B.tailY-.05,-Rr-.02); box(.4,.03,.02,tailM,sd*B.w*.33,B.tailY-.03,-Rr-.05); box(.4,.02,.02,tailM,sd*B.w*.33,B.tailY-.08,-Rr-.05);
    box(.12,.04,.02,headM,sd*B.w*.16,B.base+.2,-Rr-.04); });
  if(def.widebody){ // bolt-on fender flares, hood vents, canards
    [[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([sx,sz])=>{ const fl=box(.24,.36,1.3,paint,sx*(B.w/2+.1),B.wr+.28,sz*B.wb); fl.rotation.x=sz*.04; });
    [.34,-.34].forEach(x=>{ const v=box(.36,.04,.5,blackM,x,.93,.95); v.rotation.x=.12; });
    [1,-1].forEach(sx=>{ const c=box(.34,.03,.14,blackM,sx*(B.w/2-.05),B.headY-.18,B.front-.2); c.rotation.z=sx*.25; }); }
  if(def.classic){ // split rear window, chrome bumpers, side-exit pipes, fender vents
    const spine=box(.08,.035,.9,paint,0,1.12,-1.575); spine.rotation.x=-.47;
    const chr=new THREE.MeshStandardMaterial({color:0xdfe4ea,metalness:1,roughness:.08});
    [1,-1].forEach(sx=>{ box(.62,.07,.1,chr,sx*.5,.46,B.front-.02); box(.5,.07,.1,chr,sx*.55,.52,-B.rear+.02);
      const pipe=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,1.6,12),chr); pipe.rotation.x=Math.PI/2; pipe.position.set(sx*(B.w/2+.1),.3,.15); g.add(pipe);
      for(let i=0;i<3;i++) box(.03,.05,.32,blackM,sx*(B.w/2+.06),.62-i*.08,1.05); });
    box(.9,.16,.06,blackM,0,.42,B.front-.03); }
  if(def.hyper){ // dorsal fin, light blade across the nose, cyan accents along the rockers, big side intakes
    const acc=new THREE.MeshBasicMaterial({color:def.accent||0x2fe6ff,toneMapped:false});
    const fin=box(.04,.36,1.5,paint,0,1.05,-1.55); fin.rotation.x=.22;
    box(B.w*.78,.022,.03,acc,0,B.headY+.06,F-.1);
    [1,-1].forEach(sd=>{ box(.02,.02,B.wb*2-.6,acc,sd*(B.w/2+.14),B.base+.1,0); const it=box(.06,.26,.7,trimM,sd*(B.w/2+.1),B.base+.42,-.85); it.rotation.y=sd*.12; });
    [1,-1].forEach(sd=>{ const s=glowSprite(def.accent||0x2fe6ff,.7); s.position.set(sd*(B.w/2+.14),B.base+.1,1); g.add(s); }); }
  if(def.lightbar){ box(1.5,.08,.16,headM,0,2.06,.28); [-.55,0,.55].forEach(x=>{ const s=glowSprite(0xeaf4ff,.9); s.position.set(x,2.07,.4); g.add(s); }); }
  if(def.body==='sedan'||def.body==='suv'||def.body==='truck'){ // upright grille
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
  const cbB=B.cabBase; // cab base: [rear x, rear y, front x, front y]
  if(!cut){
    // window trim, mirrors, panel gaps, handles, skirts
    [1,-1].forEach(sd=>{ const tx=sd*(B.cw/2+.006), trim=def.chrome||def.classic||def.body==='sedan'?chromeTrimM:trimM;
      box(.012,.035,cbB[2]-cbB[0],trim,tx,Math.min(cbB[1],cbB[3])+.035,(cbB[0]+cbB[2])/2);
      box(.2,.1,.22,paint,sd*(B.cw/2+.24),cbB[3]+.16,cbB[2]-.22); box(.2,.03,.05,trimM,sd*(B.cw/2+.12),cbB[3]+.12,cbB[2]-.18);
      box(.012,.08,.2,lensM,sd*(B.cw/2+.345),cbB[3]+.16,cbB[2]-.22);
      const sx=sd*(B.w/2+.128), top=Math.min(cbB[1],cbB[3])-.05, bot=B.base+.14;
      [cbB[2]-.05,cbB[0]+.35].forEach(z=>box(.008,top-bot,.014,gapM,sx,(top+bot)/2,z));
      box(.02,.035,.17,chromeTrimM,sd*(B.w/2+.135),top-.12,(cbB[2]+cbB[0])/2+.25);
      box(.06,.07,B.wb*2-1.1,trimM,sd*(B.w/2+.1),B.base+.04,0); }); }
  // plates, exhaust tips, diffuser
  const plate=plateTex(def.plate||def.name.replace(/[^A-Z0-9]/g,'').slice(0,7));
  const pf=new THREE.Mesh(new THREE.PlaneGeometry(.52,.13),new THREE.MeshStandardMaterial({map:plate,roughness:.5})); pf.position.set(0,B.base+.2,F+.02); g.add(pf);
  const pr=pf.clone(); pr.position.set(0,B.base+.3,-Rr-.06); pr.rotation.y=Math.PI; g.add(pr);
  [1,-1].forEach(sd=>{ const t=new THREE.Mesh(new THREE.CylinderGeometry(.055,.06,.16,14,1,true),exhM); t.rotation.x=Math.PI/2; t.position.set(sd*.45,B.base+.22,-Rr-.02); g.add(t);
    const inner=new THREE.Mesh(new THREE.CircleGeometry(.05,14),gapM); inner.position.set(sd*.45,B.base+.22,-Rr+.04); inner.rotation.y=Math.PI; g.add(inner); });
  for(let i=0;i<5;i++) box(.025,.12,.4,trimM,-.5+i*.25,B.base+.02,-Rr+.12);
  g.add(shadowPlane(B.w+1.05,(F+Rr)*1.24));
  [[B.tr,B.wb],[-B.tr,B.wb],[B.tr,-B.wb],[-B.tr,-B.wb]].forEach(([x,z])=>{ const s=shadowPlane(.9,1.1); s.position.set(x,.025,z); g.add(s); }); // wheel contact shadows
  const rimM=def.bronze?bronzeM():new THREE.MeshStandardMaterial({color:def.rim,metalness:def.chrome?1:.8,roughness:def.chrome?.08:.3});
  const calM=new THREE.MeshStandardMaterial({color:def.caliper,roughness:.4,metalness:.2});
  const wheels=[], steers=[], wr=B.wr, sc=wr/.37;
  [[B.tr,B.wb],[-B.tr,B.wb],[B.tr,-B.wb],[-B.tr,-B.wb]].forEach(([x,z],i)=>{
    const holder=new THREE.Group(); holder.position.set(x,wr,z); g.add(holder);
    const spin=new THREE.Group(); spin.scale.setScalar(sc); holder.add(spin);
    const tire=new THREE.Mesh(TIRE_GEO,[tireTreadM,tireSideM,tireSideM]); tire.rotation.z=Math.PI/2; spin.add(tire);
    const side=Math.sign(x);
    const barrel=new THREE.Mesh(BARREL_GEO,barrelM); barrel.rotation.z=Math.PI/2; barrel.position.x=side*.05; spin.add(barrel);
    const rotor=new THREE.Mesh(ROTOR_GEO,[barrelM,rotorM,rotorM]); rotor.rotation.z=Math.PI/2; rotor.position.x=side*.02; spin.add(rotor);
    const disc=new THREE.Mesh(new THREE.RingGeometry(.2,.27,28),rimM); disc.rotation.y=side*Math.PI/2; disc.position.x=side*.14; spin.add(disc);
    const lip=new THREE.Mesh(new THREE.TorusGeometry(.29,.025,6,28),def.rimLip?new THREE.MeshStandardMaterial({color:def.rimLip,roughness:.35,metalness:.3}):rimM); lip.rotation.y=Math.PI/2; lip.position.x=side*.155; spin.add(lip);
    const spokes=def.spokes||6;
    for(let k=0;k<spokes;k++){ const s=new THREE.Mesh(new THREE.BoxGeometry(.03,.5,spokes>10?.03:.07),rimM); s.position.x=side*.16; s.rotation.x=k*Math.PI/spokes; spin.add(s); }
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.04,12),calM); hub.rotation.z=Math.PI/2; hub.position.x=side*.17; spin.add(hub);
    for(let k=0;k<5;k++){ const a=k/5*Math.PI*2, nut=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.03,6),chromeTrimM); nut.rotation.z=Math.PI/2; nut.position.set(side*.165,Math.cos(a)*.085,Math.sin(a)*.085); spin.add(nut); }
    const cal=new THREE.Mesh(new THREE.BoxGeometry(.07,.2,.18),calM); cal.position.set(side*.06,.14*sc,-.06); holder.add(cal);
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
  g.add(shadowPlane(2.7,5.6)); rigLights(g,null,true);
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
  ribbon(tr,S,-W-.3,W+.3,.01,.01,wetRoad(new THREE.MeshStandardMaterial({map:roadTex,roughness:.3,metalness:.15,side:THREE.DoubleSide})),24);
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
  { const st=[]; for(let i=0;i<nStrip;i++){ frame(i*13,f,tr); orientQ(f,q,basis,nr); [-3.4,3.4].forEach(x=>{ p.copy(f.p).addScaledVector(f.r,x); p.y+=.04; m4.compose(p,q,sc); st.push(m4.clone()); }); } lampStreaks(S,st,true); }
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

/* ---- shared road-sign canvas ---- */
function signCanvas(text,opts){ opts=opts||{}; const w=opts.w||512, h=opts.h||96;
  return canvasTex(w,h,(g)=>{ g.fillStyle=opts.bg||'#0a0c10'; g.fillRect(0,0,w,h);
    g.font=`${opts.weight||800} ${opts.size||(h*.62|0)}px "Archivo Narrow","Arial Narrow",Arial,sans-serif`; g.textAlign='center'; g.textBaseline='middle';
    if(opts.glow){ g.shadowColor=opts.color; g.shadowBlur=opts.glow; }
    g.fillStyle=opts.color||'#fff'; g.fillText(text,w/2,h/2+2,w*.92);
    if(opts.border){ g.shadowBlur=0; g.strokeStyle=opts.color||'#fff'; g.lineWidth=4; g.strokeRect(6,6,w-12,h-12); } }); }
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
  S.fog=new THREE.FogExp2(0x121a28,0.0052); S.environment=ENV.street; addDome(S);
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
  const asphaltM=wetRoad(new THREE.MeshStandardMaterial({map:asphaltTex,roughness:.5,metalness:.12}));
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
  lampStreaks(S,pools); lampCones(S,heads);
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

/* ---- Event 03: City Hall to the Ben Franklin Bridge ----
   x runs east, -z runs north. The loop: Market St east (z=20) from City Hall, 6th St north (x=720),
   onto the bridge (z=-300) and over the Delaware, U-turn at the Camden toll plaza, back over the
   bridge (z=-340), Race St west through Chinatown, 15th St south past LOVE Park (x=-80). */
const BR={deckY:30,rampUp:[790,1020],rampDown:[1740,1960],river:[1030,1730],towers:[1180,1580],anch:[960,1800],cableZ:[-285,-355]};
function bridgeY(x){ const sm=(a,b)=>{ const t=clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); };
  return BR.deckY*sm(BR.rampUp[0],BR.rampUp[1])*(1-sm(BR.rampDown[0],BR.rampDown[1])); }
function cableY(x){ const [t1,t2]=BR.towers, top=104, mid=37;
  if(x<=t1){ const y0=bridgeY(BR.anch[0])+3.5, u=(x-BR.anch[0])/(t1-BR.anch[0]); return lerp(y0,top,u)-6*4*u*(1-u); }
  if(x>=t2){ const y0=bridgeY(BR.anch[1])+3.5, u=(BR.anch[1]-x)/(BR.anch[1]-t2); return lerp(y0,top,u)-6*4*u*(1-u); }
  const c=(t1+t2)/2, h=(t2-t1)/2; return mid+(top-mid)*Math.pow((x-c)/h,2); }
// closed path of straights joined by quadratic fillets; corners are [point, fillet length]
function filletPath(start,corners,step){
  const out=[]; let cur=start.clone();
  const seg=(a,b)=>{ const d=a.distanceTo(b); if(d<1e-6) return; const n=Math.ceil(d/step); for(let i=0;i<n;i++) out.push(new THREE.Vector2().lerpVectors(a,b,i/n)); };
  const bez=(a,c,b)=>{ const n=Math.max(4,Math.ceil((a.distanceTo(c)+c.distanceTo(b))/step)); for(let i=0;i<n;i++){ const t=i/n,u=1-t; out.push(new THREE.Vector2(u*u*a.x+2*u*t*c.x+t*t*b.x,u*u*a.y+2*u*t*c.y+t*t*b.y)); } };
  corners.forEach(([c,r],i)=>{ const prev=i?corners[i-1][0]:start, next=i<corners.length-1?corners[i+1][0]:start;
    const t1=c.clone().addScaledVector(prev.clone().sub(c).normalize(),r), t2=c.clone().addScaledVector(next.clone().sub(c).normalize(),r);
    seg(cur,t1); bez(t1,c,t2); cur=t2; });
  seg(cur,start); return out;
}
// lift a 2D path into 3D and resample it to ~1 m even spacing (makeTrack assumes even spacing)
function resample3(p2,yf){
  const P=p2.map(p=>new THREE.Vector3(p.x,yf(p.x,p.y),p.y)), n=P.length, cum=[0];
  for(let i=1;i<=n;i++) cum.push(cum[i-1]+P[i-1].distanceTo(P[i%n]));
  const L=cum[n], N=Math.round(L), out=[]; let j=0;
  for(let k=0;k<N;k++){ const s=k*L/N; while(j<n-1&&cum[j+1]<s) j++; const a=(s-cum[j])/Math.max(1e-6,cum[j+1]-cum[j]); out.push(new THREE.Vector3().lerpVectors(P[j],P[(j+1)%n],clamp(a,0,1))); }
  return out;
}
// ribbon with per-point control: fn(k,p) -> [offA,yA,offB,yB] (y absolute) or null to leave a gap
function ribbonF(tr,S,mat,fn,vScale){
  vScale=vScale||12; const N=tr.N, pos=[], uv=[], idx=[]; let prev=false;
  for(let i=0;i<=N;i++){ const k=i%N, p=tr.pts[k], r=tr.R[k], v=fn(k,p); if(!v){ prev=false; continue; }
    const n=pos.length/3; pos.push(p.x+r.x*v[0],v[1],p.z+r.z*v[0], p.x+r.x*v[2],v[3],p.z+r.z*v[2]);
    const t=i*tr.ds/vScale; uv.push(0,t,1,t); if(prev) idx.push(n-2,n-1,n,n-1,n+1,n); prev=true; }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2)); g.setIndex(idx); g.computeVertexNormals();
  const m=new THREE.Mesh(g,mat); S.add(m); return m;
}
// night facades: 512 px = 32 m, 8 floors x 8 bays, lit windows in a matching emissive map
function facadeTex(style){
  const P={glass:{bg:'#0d1520',win:'#18263a',lit:['#dfe9ff','#cfe0ff','#fff1d6'],p:.34},
           brick:{bg:'#3b2520',win:'#1a1412',lit:['#ffd79a','#ffc57a','#ffe6bf'],p:.32},
           stone:{bg:'#4a453d',win:'#191816',lit:['#ffe2b0','#fff1d6','#cfe0ff'],p:.3},
           hall:{bg:'#7a6b55',win:'#2a2218',lit:['#ffd89a','#ffe2b0','#ffcf85'],p:.8}}[style];
  const lit=[]; for(let i=0;i<64;i++) lit.push(Math.random()<P.p);
  const draw=(g,em)=>{ g.fillStyle=em?'#000':P.bg; g.fillRect(0,0,512,512);
    for(let fl=0;fl<8;fl++) for(let b=0;b<8;b++){ const x=b*64, y=fl*64, on=lit[fl*8+b];
      if(em){ if(!on) continue; g.fillStyle=P.lit[(fl*3+b)%3]; } else g.fillStyle=style==='glass'&&on?'#26384e':P.win;
      if(style==='glass') g.fillRect(x+3,y+6,58,52);
      else if(style==='hall'){ g.fillRect(x+20,y+22,24,34); g.beginPath(); g.arc(x+32,y+22,12,Math.PI,0); g.fill(); }
      else g.fillRect(x+18,y+14,28,38); }
    if(!em&&style!=='glass'){ g.fillStyle='rgba(0,0,0,.35)'; for(let fl=0;fl<8;fl++) g.fillRect(0,fl*64+60,512,4); } };
  const t=(em)=>CT(canvasTex(512,512,g=>draw(g,em)),true);
  return {map:t(false),emis:t(true)};
}
function signCanvas2(l1,l2,o){ o=o||{}; return canvasTex(512,160,(g,w,h)=>{ g.fillStyle=o.bg||'#0f5a32'; g.fillRect(0,0,w,h);
  g.strokeStyle=o.color||'#f4f7f2'; g.lineWidth=4; g.strokeRect(8,8,w-16,h-16); g.fillStyle=o.color||'#f4f7f2'; g.textAlign='center'; g.textBaseline='middle';
  g.font='800 58px "Arial Narrow",Arial,sans-serif'; g.fillText(l1,w/2,58,w*.9); g.font='700 36px "Arial Narrow",Arial,sans-serif'; g.fillText(l2,w/2,116,w*.9); }); }

// Harbor Line tunnel under the Delaware (Event 04): ramps down on the Philly side, back up in Camden
const TUN={down:[820,1000],up:[1780,1960],depth:28};
function tunnelY(x){ const sm=(a,b)=>{ const t=clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); };
  return -TUN.depth*sm(TUN.down[0],TUN.down[1])*(1-sm(TUN.up[0],TUN.up[1])); }
/* One builder, two layouts. Corners are [x,z,fillet]; roads list the race streets that get crosswalks and
   signals at every named cross street; trackX/trackZ tell the city grid which grid lines carry the race. */
const ZS_BASE=[-700,-610,-520,-430,-340,-250,-160,-70,20,110,200,290,380];
const BRIDGE_CFG={banner:'EVENT 03',start:[40,20],
  corners:[[720,20,30],[720,-300,30],[2000,-300,20],[2000,-340,20],[-80,-340,30],[-80,20,30]],
  yAt:(x,z)=>z<-250?bridgeY(x):0, zMin:-1600, ZS:ZS_BASE, toll:true, jerseyMaxX:3000,
  trackX:(x,zc)=>(x===-80&&zc>-340&&zc<20)||(x===720&&zc>-300&&zc<20),
  trackZ:(z,xc)=>(z===20&&xc>-80&&xc<720)||(z===-340&&xc>-80&&xc<720),
  skip:[], excl:[[1960,2110,-400,-240]],
  gantries:[[860,-300,'BEN FRANKLIN BRIDGE','NEW JERSEY  ↑'],[1660,-340,'PHILADELPHIA','CENTER CITY · VINE ST']],
  roads:[{ew:1,c:20,dir:1,a:-80,b:720},{ew:1,c:-340,dir:-1,a:-80,b:720},{ew:0,c:-80,dir:1,a:-340,b:20},{ew:0,c:720,dir:-1,a:-300,b:20}],
  cams:[[380,20,0,1],[380,-340,0,-1]]};
const GRAND_CFG={banner:'EVENT 04',start:[-20,-1150],
  corners:[[-20,-800,30],[720,-800,30],[720,-300,30],[2030,-300,30],[2030,470,30],[-80,470,30],[-80,-1400,30],[-20,-1400,30]],
  yAt:(x,z)=>z<-250&&z>-360&&x>760?bridgeY(x):(z>400?tunnelY(x):0), zMin:-2200, ZS:[-880,-800,...ZS_BASE,470,560,650], jerseyMaxX:1990,
  trackX:(x,zc)=>(x===-80&&zc>-880&&zc<470)||(x===720&&zc>-800&&zc<-250)||(x===2030&&zc>-300&&zc<470),
  trackZ:(z,xc)=>(z===-800&&xc>-20&&xc<720)||(z===470&&xc>-80&&xc<820),
  skip:[[-80,70,-880,-800]], excl:[[800,1040,455,485],[1720,2000,455,485]], holes:[[815,885,462.6,477.4],[1895,1965,462.6,477.4]],
  gantries:[[860,-300,'BEN FRANKLIN BRIDGE','NEW JERSEY  ↑'],[-20,-1000,'ROOSEVELT BLVD','US 1 SOUTH · CENTER CITY'],[-80,-1100,'ROOSEVELT BLVD','NORTHEAST PHILA  ↑'],[2030,200,'HARBOR LINE TUNNEL','PHILADELPHIA  ← 1 MI']],
  roads:[{ew:1,c:-800,dir:1,a:-20,b:720},{ew:1,c:470,dir:-1,a:-80,b:820},{ew:0,c:-80,dir:-1,a:-800,b:470},{ew:0,c:720,dir:1,a:-800,b:-300}],
  cams:[[-20,-1050,1,0],[380,-800,0,1],[400,470,0,-1]],
  tunnel:true, decoBridge:true, blvd:{xw:-80,xe:-20,z0:-1368,z1:-835}};
const GAUNTLET_CFG={banner:'THE GAUNTLET',start:[40,20],
  corners:[[430,20,30],[430,-340,30],[-80,-340,30],[-80,20,30]],
  yAt:()=>0, zMin:-1600, ZS:ZS_BASE, jerseyMaxX:3000, noTraffic:true, arena:true,
  trackX:(x,zc)=>(x===-80&&zc>-340&&zc<20)||(x===430&&zc>-340&&zc<20),
  trackZ:(z,xc)=>(z===20&&xc>-80&&xc<430)||(z===-340&&xc>-80&&xc<430),
  skip:[], excl:[],
  gantries:[[120,-340,'THE GAUNTLET','12 IN · ONE OUT EVERY LAP'],[-80,-150,'THE GAUNTLET','DON\'T BE LAST']],
  roads:[{ew:1,c:20,dir:1,a:-80,b:430},{ew:1,c:-340,dir:-1,a:-80,b:430},{ew:0,c:-80,dir:1,a:-340,b:20},{ew:0,c:430,dir:-1,a:-340,b:20}],
  cams:[]};
/* Event 05: tight container yard chicane, then a waterfront sprint (≈1.3 km). */
const DOCKSIDE_CFG={banner:'EVENT 05 · DOCKSIDE DASH',start:[160,-320],
  corners:[[340,-320,18],[340,-230,15],[240,-200,15],[80,-230,12],[40,-320,12],[-40,-320,15],[-40,-250,12],[80,-250,12],[240,-250,15],[340,-250,15]],
  yAt:()=>0, zMin:-520, ZS:ZS_BASE.slice(0,8), jerseyMaxX:520, noTraffic:true, dockside:true,
  trackX:(x,zc)=>(x===-40&&zc>-320&&zc<-230)||(x===340&&zc>-320&&zc<-230),
  trackZ:(z,xc)=>(z===-320&&xc>-40&&xc<340)||(z===-250&&xc>-40&&xc<340),
  skip:[[-40,-320,-160,-70]], excl:[],
  gantries:[[280,-320,'DOCKSIDE DASH','CONTAINER YARD  →'],[80,-250,'WATERFRONT','FULL THROTTLE']],
  roads:[{ew:1,c:-320,dir:1,a:-40,b:340},{ew:1,c:-250,dir:-1,a:-40,b:340}],
  cams:[[240,-250,0,-1]]};
/* Event 06: Center City mix with a raised skyline straight (≈4 km). */
const SKYLINE_CFG={banner:'EVENT 06 · SKYLINE CIRCUIT',start:[40,20],
  corners:[[430,20,30],[430,-340,30],[-80,-340,30],[-80,470,30],[720,470,30],[720,20,30]],
  yAt:(x,z)=>z>400&&x>-20&&x<760?12+(z-400)*.008:0, zMin:-1600, ZS:ZS_BASE.concat([470,560]), jerseyMaxX:820, noTraffic:true, skyline:true,
  trackX:(x,zc)=>(x===-80&&zc>-340&&zc<470)||(x===430&&zc>-340&&zc<20)||(x===720&&zc>-340&&zc<470),
  trackZ:(z,xc)=>(z===20&&xc>-80&&xc<430)||(z===-340&&xc>-80&&xc<430)||(z===470&&xc>-80&&xc<720),
  skip:[], excl:[],
  gantries:[[430,-340,'SKYLINE CIRCUIT','ELEVATED RUN  ↑'],[720,470,'BROAD ST','HARD BRAKING']],
  roads:[{ew:1,c:20,dir:1,a:-80,b:430},{ew:1,c:-340,dir:-1,a:-80,b:430},{ew:1,c:470,dir:-1,a:-80,b:720},{ew:0,c:-80,dir:1,a:-340,b:470},{ew:0,c:430,dir:-1,a:-340,b:20},{ew:0,c:720,dir:1,a:-340,b:470}],
  cams:[[430,-340,0,-1],[720,470,0,1]]};
/* Event 07: one long lap — blvd, bridge, tunnel, waterfront (≈10 km). */
const MIDNIGHT_CFG={banner:'EVENT 07 · MIDNIGHT EXPRESS',start:[-20,-1950],
  corners:[[-20,-800,30],[720,-800,30],[720,-300,30],[2030,-300,30],[2480,-300,20],[2480,-340,20],[-80,-340,30],[-80,470,30],[-80,-1400,30],[-20,-1400,30],[-20,-1950,30]],
  yAt:(x,z)=>z<-250&&z>-360&&x>760?bridgeY(x):(z>400?tunnelY(x):0), zMin:-2200, ZS:[-880,-800,...ZS_BASE,470,560,650], jerseyMaxX:1990,
  trackX:(x,zc)=>(x===-80&&zc>-880&&zc<470)||(x===720&&zc>-800&&zc<-250)||(x===2030&&zc>-300&&zc<470),
  trackZ:(z,xc)=>(z===-800&&xc>-20&&xc<720)||(z===470&&xc>-80&&xc<820)||(z===-340&&xc>-80&&xc<2480),
  skip:[[-80,70,-880,-800]], excl:[[800,1040,455,485],[1720,2000,455,485]], holes:[[815,885,462.6,477.4],[1895,1965,462.6,477.4]],
  gantries:[[860,-300,'MIDNIGHT EXPRESS','CAMDEN STRAIGHT  ↑'],[-20,-1000,'ROOSEVELT BLVD','US 1 SOUTH'],[2030,200,'HARBOR LINE TUNNEL','PHILADELPHIA  ←']],
  roads:[{ew:1,c:-800,dir:1,a:-20,b:720},{ew:1,c:470,dir:-1,a:-80,b:820},{ew:1,c:-340,dir:-1,a:-80,b:2480},{ew:0,c:-80,dir:-1,a:-800,b:470},{ew:0,c:720,dir:1,a:-800,b:-300}],
  cams:[[-20,-1050,1,0],[400,-800,0,1],[400,470,0,-1]],
  tunnel:true, decoBridge:true, blvd:{xw:-80,xe:-20,z0:-1950,z1:-835}};
function buildKnockout(){ return buildCity(GAUNTLET_CFG); }
function buildDockside(){ return buildCity(DOCKSIDE_CFG); }
function buildSkyline(){ return buildCity(SKYLINE_CFG); }
function buildMidnight(){ return buildCity(MIDNIGHT_CFG); }
function buildBridge(){ return buildCity(BRIDGE_CFG); }
function buildGrand(){ return buildCity(GRAND_CFG); }
function buildCity(C){
  const V=(x,z)=>new THREE.Vector2(x,z);
  const path=filletPath(V(C.start[0],C.start[1]),C.corners.map(([x,z,r])=>[V(x,z),r]),1);
  const tr=makeTrack(resample3(path,C.yAt),7,6);
  const W=tr.W, R_=rng(1776);
  const sNear=(x,z)=>{ let bi=0,bd=1e18; for(let k=0;k<tr.N;k++){ const p=tr.pts[k], d=(p.x-x)*(p.x-x)+(p.z-z)*(p.z-z); if(d<bd){ bd=d; bi=k; } } return bi*tr.ds; };
  const S=new THREE.Scene();
  S.userData.bloom={strength:.9,radius:.5,threshold:.72};
  S.background=CT(canvasTex(8,256,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#02040a'); gr.addColorStop(.5,'#0a1224'); gr.addColorStop(.78,'#1e2336'); gr.addColorStop(1,'#3a2c2c'); g.fillStyle=gr; g.fillRect(0,0,w,h); }));
  S.fog=new THREE.FogExp2(0x151b2b,0.0024); S.environment=ENV.street; addDome(S);
  S.add(new THREE.HemisphereLight(0x8fa6cc,0x0b0d12,.65));
  const moonL=new THREE.DirectionalLight(0xbcd0ff,.35); moonL.position.set(-1,2,1); S.add(moonL);
  const f=mkF(), q=new THREE.Quaternion(), basis=new THREE.Matrix4(), nr=new THREE.Vector3(), m4=new THREE.Matrix4(), pv=new THREE.Vector3(), one=new THREE.Vector3(1,1,1);
  const mesh=(geo,mat,x,y,z)=>{ const m=new THREE.Mesh(geo,mat); m.position.set(x,y,z); S.add(m); return m; };
  const boxM=(w,h,d,mat,x,y,z)=>mesh(new THREE.BoxGeometry(w,h,d),mat,x,y,z);
  const mkInst=(geo,mat,arr)=>{ const im=new THREE.InstancedMesh(geo,mat,arr.length); arr.forEach((m,i)=>im.setMatrixAt(i,m)); S.add(im); return im; };
  const flat=(x0,x1,z0,z1,y,mat)=>{ const g=new THREE.PlaneGeometry(x1-x0,z1-z0); g.rotateX(-Math.PI/2); return mesh(g,mat,(x0+x1)/2,y,(z0+z1)/2); };

  // ---- sky: stars + moon ----
  const starP=[]; for(let i=0;i<500;i++){ const a=R_()*Math.PI*2, e=.15+R_()*1.2, r=1800; starP.push(700+Math.cos(a)*Math.cos(e)*r,Math.sin(e)*r,-200+Math.sin(a)*Math.cos(e)*r); }
  const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.Float32BufferAttribute(starP,3));
  S.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xcfd8ff,size:1.6,sizeAttenuation:false,fog:false,transparent:true,opacity:.75})));
  const moon=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xe8eeff,fog:false,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})); moon.scale.setScalar(160); moon.position.set(2600,900,-1600); S.add(moon);

  // ---- ground, river, banks ----
  const groundM=new THREE.MeshStandardMaterial({color:0x0c0e12,roughness:.95,metalness:.05});
  const ground=(x0,x1)=>{ let rects=[[x0,x1,C.zMin,1400]];
    (C.holes||[]).forEach(h=>{ rects=rects.flatMap(r=>{ if(h[0]>=r[1]||h[1]<=r[0]||h[2]>=r[3]||h[3]<=r[2]) return [r];
      return [[r[0],r[1],r[2],h[2]],[r[0],r[1],h[3],r[3]],[r[0],h[0],h[2],h[3]],[h[1],r[1],h[2],h[3]]].filter(q=>q[1]-q[0]>.01&&q[3]-q[2]>.01); }); });
    rects.forEach(r=>flat(r[0],r[1],r[2],r[3],-.03,groundM)); };
  ground(-1600,BR.river[0]); ground(BR.river[1],3300);
  flat(BR.river[0],BR.river[1],C.zMin,1400,-6,new THREE.MeshStandardMaterial({color:0x03060a,metalness:.95,roughness:.08}));
  const bankM=new THREE.MeshStandardMaterial({color:0x2a2d33,roughness:.95,side:THREE.DoubleSide});
  [BR.river[0],BR.river[1]].forEach(x=>{ const g=new THREE.PlaneGeometry(1400-C.zMin,6); g.rotateY(Math.PI/2); mesh(g,bankM,x,-3,(1400+C.zMin)/2); });

  // ---- road: asphalt with lane lines, curbs, sidewalks ----
  const roadTex=CT(canvasTex(256,512,(g,w,h)=>{ g.fillStyle='#16181c'; g.fillRect(0,0,w,h);
    for(let i=0;i<6000;i++){ const v=18+Math.random()*28; g.fillStyle=`rgba(${v},${v+2},${v+6},.65)`; g.fillRect(Math.random()*w,Math.random()*h,1.6,1.6); }
    g.fillStyle='rgba(232,234,238,.85)'; g.fillRect(w*.03,0,4,h); g.fillRect(w*.97-4,0,4,h);
    g.fillStyle='rgba(232,234,238,.75)'; [.34,.66].forEach(u=>g.fillRect(w*u-2,0,4,h*.4));
    g.fillStyle='rgba(0,0,0,.22)'; for(let i=0;i<5;i++) g.fillRect(w*(.18+i*.15),0,12,h); }),true);
  const roadMat=wetRoad(new THREE.MeshStandardMaterial({map:roadTex,roughness:.45,metalness:.15,side:THREE.DoubleSide}));
  ribbon(tr,S,-W-.3,W+.3,.01,.01,roadMat,24);
  const walkM=new THREE.MeshStandardMaterial({color:0x3a3d44,roughness:.9,side:THREE.DoubleSide}), curbM=new THREE.MeshStandardMaterial({color:0x6e737c,roughness:.85,side:THREE.DoubleSide});
  [-1,1].forEach(sd=>{ ribbon(tr,S,sd*(W+.3),sd*(W+4.5),.16,.16,walkM); ribbon(tr,S,sd*(W+.3),sd*(W+.3),0,.16,curbM); });
  const addStart=()=>{ frame(0,f,tr); orientQ(f,q,basis,nr); addStartLine(S,f,q,2*W);
    const red=new THREE.MeshBasicMaterial({color:0xff2a3a,toneMapped:false});
    [-1,1].forEach(sd=>{ const p=f.p.clone().addScaledVector(f.r,sd*(W+1.6)); boxM(.5,8.4,.5,blackM,p.x,4.2,p.z); });
    const beam=boxM(2*W+3.6,.5,.5,red,f.p.x,8.4,f.p.z); beam.quaternion.copy(q);
    const ban=new THREE.Mesh(new THREE.PlaneGeometry(10,1.4),new THREE.MeshBasicMaterial({map:CT(signCanvas('AFTERHOURS  ·  '+C.banner,{bg:'#07080a',color:'#f4f7ff',size:50})),toneMapped:false}));
    ban.position.set(f.p.x,7.2,f.p.z); ban.quaternion.copy(q); ban.rotateY(Math.PI); S.add(ban); };
  addStart();

  // ---- city blocks, merged into a few draw calls ----
  const FAC={}; ['glass','brick','stone','hall'].forEach(k=>{ const t=facadeTex(k); FAC[k]={mat:new THREE.MeshStandardMaterial({map:t.map,emissive:0xffffff,emissiveMap:t.emis,emissiveIntensity:k==='hall'?1.1:.95,roughness:k==='glass'?.35:.85,metalness:k==='glass'?.5:.05}),pos:[],nor:[],uv:[]}; });
  const skyMat=FAC.glass.mat.clone(); skyMat.fog=false; FAC.sky={mat:skyMat,pos:[],nor:[],uv:[]};
  FAC.roof={mat:new THREE.MeshStandardMaterial({color:0x0b0c0f,roughness:1}),pos:[],nor:[],uv:[]};
  const storeTex=(em)=>CT(canvasTex(256,64,(g)=>{ g.fillStyle=em?'#000':'#15161a'; g.fillRect(0,0,256,64);
    [[10,108],[138,108]].forEach(([x,w],i)=>{ g.fillStyle=em?(i?'#fff1d6':'#dfe9ff'):'#0d1117'; g.fillRect(x,20,w,40); });
    if(!em){ g.fillStyle='#2b2d33'; g.fillRect(0,0,256,10); } }),true);
  FAC.store={mat:new THREE.MeshStandardMaterial({map:storeTex(false),emissive:0xffffff,emissiveMap:storeTex(true),emissiveIntensity:1.1,roughness:.6}),pos:[],nor:[],uv:[]};
  const SHOPS=['CHEESESTEAKS','HOAGIES','WATER ICE','SOFT PRETZELS','PIZZA','PHARMACY','SNEAKERS','PHONE REPAIR','DINER','HOTEL','TAVERN','RECORDS','DUMPLINGS','NOODLES','TEA HOUSE','BAKERY'];
  const SCOL=['#ff3b3b','#ffd23b','#6fe3ff','#ff6fd8','#f4f7ff','#7dff9a'];
  const atlas=CT(canvasTex(1024,256,(g)=>{ g.fillStyle='#07080a'; g.fillRect(0,0,1024,256); g.textAlign='center'; g.textBaseline='middle'; g.font='800 34px "Arial Narrow",Arial,sans-serif';
    SHOPS.forEach((n,i)=>{ const c=SCOL[i%SCOL.length]; g.shadowColor=c; g.shadowBlur=12; g.fillStyle=c; g.fillText(n,(i%4)*256+128,(i>>2)*64+33,236); }); }));
  FAC.sign={mat:new THREE.MeshBasicMaterial({map:atlas,toneMapped:false}),pos:[],nor:[],uv:[]};
  function faceQuad(b,face,a0,a1,y0,y1,pc,u0,u1,v0,v1){ let A,B,C,D,n;
    if(face==='s'){ A=[a0,y0,pc];B=[a1,y0,pc];C=[a1,y1,pc];D=[a0,y1,pc];n=[0,0,1]; }
    else if(face==='n'){ A=[a1,y0,pc];B=[a0,y0,pc];C=[a0,y1,pc];D=[a1,y1,pc];n=[0,0,-1]; }
    else if(face==='e'){ A=[pc,y0,a1];B=[pc,y0,a0];C=[pc,y1,a0];D=[pc,y1,a1];n=[1,0,0]; }
    else { A=[pc,y0,a0];B=[pc,y0,a1];C=[pc,y1,a1];D=[pc,y1,a0];n=[-1,0,0]; }
    b.pos.push(...A,...B,...C,...A,...C,...D); for(let i=0;i<6;i++) b.nor.push(...n); b.uv.push(u0,v0,u1,v0,u1,v1,u0,v0,u1,v1,u0,v1); }
  const beacons=[];
  function block(b,x0,x1,z0,z1,h,y0){ y0=y0||0; const y1=y0+h, T=32, uo=(R_()*8|0)/8, va=y0/T, vb=y1/T;
    faceQuad(b,'s',x0,x1,y0,y1,z1,uo,uo+(x1-x0)/T,va,vb); faceQuad(b,'n',x0,x1,y0,y1,z0,uo,uo+(x1-x0)/T,va,vb);
    faceQuad(b,'e',z0,z1,y0,y1,x1,uo,uo+(z1-z0)/T,va,vb); faceQuad(b,'w',z0,z1,y0,y1,x0,uo,uo+(z1-z0)/T,va,vb);
    const r=FAC.roof; r.pos.push(x0,y1,z1,x1,y1,z1,x1,y1,z0,x0,y1,z1,x1,y1,z0,x0,y1,z0); for(let i=0;i<6;i++) r.nor.push(0,1,0); r.uv.push(0,0,1,0,1,1,0,0,1,1,0,1);
    if(h>80) beacons.push((x0+x1)/2,y1+1.5,(z0+z1)/2); }
  function storefront(face,a0,a1,pc,china){ const out={s:.06,n:-.06,e:.06,w:-.06}[face], len=a1-a0; if(len<6) return;
    faceQuad(FAC.store,face,a0,a1,0,4.2,pc+out,0,len/16,0,1);
    const i=china?12+(R_()*4|0):(R_()*12|0), u0=(i%4)/4, v1=1-(i>>2)/4, sw=Math.min(8,len-2), c=(a0+a1)/2;
    faceQuad(FAC.sign,face,c-sw/2,c+sw/2,4.6,6.1,pc+out*2,u0,u0+.25,v1-.25,v1); }
  const styleAt=(x)=>{ const r=R_(); if(x>1700) return r<.7?'brick':'stone'; if(x<250) return r<.5?'glass':(r<.8?'stone':'brick'); if(x<600) return r<.2?'glass':(r<.6?'stone':'brick'); return r<.8?'brick':'stone'; };
  const heightAt=(x)=>{ const r=R_(); if(x>1700) return 8+r*24+(R_()<.08?40:0); if(x<-80) return 40+r*110+(R_()<.2?80:0); if(x<250) return 24+r*70+(R_()<.12?60:0); if(x<600) return 16+r*38; return 10+r*18; };
  function fillLot(x0,x1,z0,z1,fronts,china){
    const nx=Math.max(1,Math.min(3,Math.round((x1-x0)/30))), nz=(z1-z0)>50?2:1, wx=(x1-x0)/nx, wz=(z1-z0)/nz;
    for(let i=0;i<nx;i++) for(let j=0;j<nz;j++){
      const bx0=x0+i*wx+(i?.8:0), bx1=x0+(i+1)*wx-(i<nx-1?.8:0), bz0=z0+j*wz+(j?.8:0), bz1=z0+(j+1)*wz-(j<nz-1?.8:0), xc=(bx0+bx1)/2;
      block(FAC[styleAt(xc)],bx0,bx1,bz0,bz1,heightAt(xc));
      if(fronts.n&&j===0) storefront('n',bx0,bx1,bz0,china); if(fronts.s&&j===nz-1) storefront('s',bx0,bx1,bz1,china);
      if(fronts.w&&i===0) storefront('w',bz0,bz1,bx0,china); if(fronts.e&&i===nx-1) storefront('e',bz0,bz1,bx1,china); } }
  const trackX=C.trackX, trackZ=C.trackZ;
  const SKIP=[[-80,70,-160,20],[720,810,-340,20],[720,810,20,110],[-170,-80,-160,-70],[160,250,20,110],[-260,-170,-70,20],[-350,-260,20,110],[-350,-260,-160,-70],[-440,-350,-250,-160]].concat(C.skip);
  const EXCL=[[720,3300,-366,-274]].concat(C.excl);
  function grid(XS,ZS){
    for(let i=0;i<XS.length-1;i++) for(let j=0;j<ZS.length-1;j++){
      const xa=XS[i],xb=XS[i+1],za=ZS[j],zb=ZS[j+1];
      if(SKIP.some(s=>xa>=s[0]&&xb<=s[1]&&za>=s[2]&&zb<=s[3])) continue;
      const xc=(xa+xb)/2, zc=(za+zb)/2, tw=trackX(xa,zc), te=trackX(xb,zc), tn=trackZ(za,xc), ts=trackZ(zb,xc);
      const x0=xa+(tw?13:8), x1=xb-(te?13:8), z0=za+(tn?13:8), z1=zb-(ts?13:8);
      let rects=[[x0,x1,z0,z1]];
      EXCL.forEach(e=>{ rects=rects.flatMap(r=>{ if(r[1]<=e[0]||r[0]>=e[1]||r[3]<=e[2]||r[2]>=e[3]) return [r];
        const o=[]; if(e[2]-r[2]>14) o.push([r[0],r[1],r[2],e[2]]); if(r[3]-e[3]>14) o.push([r[0],r[1],e[3],r[3]]); return o; }); });
      rects.forEach(r=>fillLot(r[0],r[1],r[2],r[3],{w:tw&&r[0]===x0,e:te&&r[1]===x1,n:tn&&r[2]===z0,s:ts&&r[3]===z1},(tn||ts)&&za<-250&&xc>250&&xc<520));
    } }
  const ZS=C.ZS;
  grid([-800,-710,-620,-530,-440,-350,-260,-170,-80,70,160,250,340,430,520,610,720,810,900,990],ZS);
  grid([1760,1850,1940,2030,2120,2210,2300,2390,2480,2570],ZS);

  // ---- landmarks ----
  // City Hall: stone base, corner pavilions, clock tower, cupola and the William Penn statue
  const H=FAC.hall, hx=-3, hz=-72;
  block(H,hx-42,hx+42,hz-42,hz+42,34);
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>block(H,hx+a*42-(a>0?16:0),hx+a*42+(a<0?16:0),hz+b*42-(b>0?16:0),hz+b*42+(b<0?16:0),44));
  block(H,hx-13,hx+13,hz-13,hz+13,62,34); block(H,hx-11,hx+11,hz-11,hz+11,12,96);
  const clockTex=CT(canvasTex(128,128,(g)=>{ g.fillStyle='#fff3d6'; g.beginPath(); g.arc(64,64,62,0,7); g.fill(); g.strokeStyle='#2a2218'; g.lineWidth=5;
    for(let i=0;i<12;i++){ const a=i/12*Math.PI*2; g.beginPath(); g.moveTo(64+Math.cos(a)*50,64+Math.sin(a)*50); g.lineTo(64+Math.cos(a)*58,64+Math.sin(a)*58); g.stroke(); }
    g.lineWidth=6; g.beginPath(); g.moveTo(64,64); g.lineTo(64,24); g.moveTo(64,64); g.lineTo(90,76); g.stroke(); }));
  const clockM=new THREE.MeshBasicMaterial({map:clockTex,toneMapped:false});
  const clock=(x,y,z,ry,r)=>{ const c=mesh(new THREE.CircleGeometry(r,32),clockM,x,y,z); c.rotation.y=ry; };
  clock(hx,102,hz+11.1,0,4.6); clock(hx,102,hz-11.1,Math.PI,4.6); clock(hx+11.1,102,hz,Math.PI/2,4.6); clock(hx-11.1,102,hz,-Math.PI/2,4.6);
  const goldStone=new THREE.MeshStandardMaterial({color:0xb09a74,emissive:0x5a4426,emissiveIntensity:.8,roughness:.7});
  mesh(new THREE.CylinderGeometry(8,10,18,8),goldStone,hx,117,hz); mesh(new THREE.CylinderGeometry(2.5,8,14,8),goldStone,hx,133,hz);
  const bronze=new THREE.MeshStandardMaterial({color:0x6a4a2a,emissive:0x3a2410,metalness:.8,roughness:.4});
  mesh(new THREE.CylinderGeometry(1,1.4,7,8),bronze,hx,143.5,hz); mesh(new THREE.SphereGeometry(1.1,10,8),bronze,hx,147.6,hz);
  flat(-67,62,-152,7,.02,new THREE.MeshStandardMaterial({color:0x2c2822,roughness:.8}));
  [[-58,-150],[52,-150],[-58,0],[52,0]].forEach(([x,z])=>{ const s=glowSprite(0xffd9a0,5); s.position.set(x,5,z); S.add(s); });
  // LOVE Park, facing 15th St
  const loveTex=CT(canvasTex(256,256,(g)=>{ g.fillStyle='#e0262f'; g.font='900 118px Georgia,serif'; g.textBaseline='alphabetic';
    g.fillText('L',22,118); g.save(); g.translate(170,78); g.rotate(-.35); g.fillText('O',-42,40); g.restore(); g.fillText('V',22,236); g.fillText('E',140,236); }));
  const love=mesh(new THREE.PlaneGeometry(5,5),new THREE.MeshBasicMaterial({map:loveTex,transparent:true,side:THREE.DoubleSide}),-100,4.2,-115); love.rotation.y=Math.PI/2;
  boxM(1.2,1.6,5.4,new THREE.MeshStandardMaterial({color:0x777a80,roughness:.8}),-100.8,.8,-115);
  const fount=mesh(new THREE.CircleGeometry(10,32),new THREE.MeshBasicMaterial({color:0x2a7fa8,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}),-132,.06,-115); fount.rotation.x=-Math.PI/2;
  mesh(new THREE.CylinderGeometry(.5,1.4,7,12,1,true),new THREE.MeshBasicMaterial({color:0xbfe8ff,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false}),-132,3.5,-115);
  // PSFS tower, 12th & Market, red letters on the roof
  block(FAC.stone,168,242,33,102,18); block(FAC.stone,180,230,45,95,132,18);
  const psfs=new THREE.MeshBasicMaterial({map:CT(signCanvas('PSFS',{bg:'rgba(0,0,0,0)',color:'#ff2a2a',size:80,glow:22})),transparent:true,toneMapped:false,side:THREE.DoubleSide});
  const p1=mesh(new THREE.PlaneGeometry(40,8),psfs,205,156,44.5); p1.rotation.y=Math.PI; const p2=mesh(new THREE.PlaneGeometry(40,8),psfs,179.5,156,70); p2.rotation.y=-Math.PI/2;
  // Independence Mall: Independence Hall (south of Market), lawn, Liberty Bell Center, Constitution Center
  const grassM=new THREE.MeshStandardMaterial({color:0x12201a,roughness:1});
  flat(733,802,-287,7,.02,grassM); flat(733,802,33,72,.02,grassM);
  block(FAC.brick,735,795,75,93,14); block(FAC.brick,760,770,84,94,28);
  const white=new THREE.MeshStandardMaterial({color:0xe8e2d4,emissive:0x8a8272,emissiveIntensity:.5,roughness:.6});
  boxM(7,8,7,white,765,32,89); mesh(new THREE.CylinderGeometry(3.2,3.2,8,8),white,765,40,89); mesh(new THREE.ConeGeometry(2.4,8,8),white,765,48,89);
  clock(765,24,83.9,Math.PI,2.2);
  boxM(54,6,40,new THREE.MeshStandardMaterial({color:0x9fb2c8,metalness:.2,roughness:.1,transparent:true,opacity:.35,emissive:0x1a2a3a}),769,3,-28);
  const bell=new THREE.LatheGeometry([[0,2.3],[.25,2.3],[.35,2.05],[.6,1.6],[.72,.9],[.85,.3],[1.05,0],[0,0]].map(p=>new THREE.Vector2(p[0],p[1])),20);
  mesh(bell,new THREE.MeshStandardMaterial({color:0x8a5a2b,metalness:1,roughness:.35,emissive:0x2a1808}),769,1.2,-28).scale.setScalar(1.3);
  boxM(2,1.2,2,white,769,.6,-28); const bg=glowSprite(0xffe2b0,9); bg.position.set(769,3,-28); S.add(bg);
  block(FAC.stone,740,800,-285,-240,20);
  // Chinatown gate over 10th St, just off Race
  const redM=new THREE.MeshStandardMaterial({color:0xa01818,emissive:0x400808,roughness:.5}), jade=new THREE.MeshStandardMaterial({color:0x1d6a4a,emissive:0x0a2a1c,roughness:.5}), goldM=new THREE.MeshStandardMaterial({color:0xd8b04a,emissive:0x6a4a10,metalness:.6,roughness:.3});
  [332.8,347.2].forEach(x=>boxM(1.4,9,1.4,redM,x,4.5,-322)); boxM(17,1,1.2,redM,340,9,-322);
  [[20,1,4,9.9],[16,.8,3.2,11.2],[10,.7,2.4,12.4]].forEach(([w,h,d,y])=>{ boxM(w,h,d,jade,340,y,-322); boxM(w+.4,.18,d+.2,goldM,340,y-h/2,-322); });
  const ctSign=mesh(new THREE.PlaneGeometry(6,1.2),new THREE.MeshBasicMaterial({map:CT(signCanvas('CHINATOWN',{bg:'#a01818',color:'#ffd86a',size:56})),toneMapped:false}),340,7.8,-322.7); ctSign.rotation.y=Math.PI;
  [334.5,345.5].forEach(x=>{ const s=glowSprite(0xff3a2a,2.2); s.position.set(x,7.4,-323); S.add(s); });
  // Center City skyline west of City Hall (drawn without fog so it reads at distance)
  const SK=FAC.sky;
  const crownM=new THREE.MeshStandardMaterial({color:0x2a3a52,emissive:0x9fc4ff,emissiveIntensity:.55,metalness:.6,roughness:.2,fog:false});
  const edgeM=new THREE.LineBasicMaterial({color:0xe6f2ff,toneMapped:false,fog:false});
  const crownPiece=(x,y,z,r,h)=>{ const g=new THREE.ConeGeometry(r,h,4); g.rotateY(Math.PI/4); mesh(g,crownM,x,y,z); const e=new THREE.LineSegments(new THREE.EdgesGeometry(g),edgeM); e.position.set(x,y,z); S.add(e); };
  block(SK,-232,-198,-42,-8,212); [[24,26,225],[15,22,243],[7.5,20,257]].forEach(([r,h,y])=>crownPiece(-215,y,-25,r,h)); mesh(new THREE.CylinderGeometry(.3,.6,30,6),new THREE.MeshBasicMaterial({color:0xe6f2ff,toneMapped:false,fog:false}),-215,282,-25);
  block(SK,-322,-288,48,82,188); [[24,22,199],[14,20,215],[7,16,229]].forEach(([r,h,y])=>crownPiece(-305,y,65,r,h));
  block(SK,-330,-280,-132,-98,290); boxM(50.4,7,34.4,new THREE.MeshBasicMaterial({color:0xcfe3ff,toneMapped:false,fog:false}),-305,293.5,-115);
  block(SK,-415,-375,-225,-185,330); boxM(40.4,12,40.4,new THREE.MeshBasicMaterial({color:0xf4f7ff,toneMapped:false,fog:false}),-395,336,-205);

  // ---- the Ben Franklin Bridge ----
  const steel=new THREE.MeshStandardMaterial({color:0x2f5d9e,emissive:0x0a1a33,emissiveIntensity:1,metalness:.6,roughness:.45,side:THREE.DoubleSide});
  const concrete=new THREE.MeshStandardMaterial({color:0x6a6e76,roughness:.9,side:THREE.DoubleSide});
  const stone=new THREE.MeshStandardMaterial({color:0x5a5650,roughness:.95,side:THREE.DoubleSide});
  const railM=new THREE.MeshStandardMaterial({color:0x9aa1ab,metalness:1,roughness:.3,side:THREE.DoubleSide});
  function deck(tr,ok){ const el=(k,p)=>(!ok||ok(k))&&p.y>.4&&p.z<-250;
  ribbonF(tr,S,steel,(k,p)=>el(k,p)?[W+4.7,p.y-2.6,W+4.7,p.y+.25]:null);                                  // outer girder
  ribbonF(tr,S,steel,(k,p)=>el(k,p)?[W+4.7,p.y-2.6,-20,p.y-2.6]:null);                                    // underside
  ribbonF(tr,S,stone,(k,p)=>el(k,p)&&(p.x<BR.river[0]||p.x>BR.river[1])?[W+4.7,0,W+4.7,p.y-2.6]:null);    // approach viaduct walls
  ribbonF(tr,S,stone,(k,p)=>el(k,p)&&(p.x<BR.river[0]||p.x>BR.river[1])?[-20,0,-20,p.y-2.6]:null);
  ribbonF(tr,S,concrete,(k,p)=>el(k,p)?[-(W+4.5),p.y+.12,-20,p.y+.12]:null);                             // median deck
  ribbonF(tr,S,concrete,(k,p)=>(!ok||ok(k))&&p.z<-250&&p.z>-360&&p.x>760&&p.x<C.jerseyMaxX?[-(W+.3),p.y,-(W+.3),p.y+.85]:null); // jersey barrier
  ribbonF(tr,S,steel,(k,p)=>el(k,p)?[W+4.6,p.y+1.0,W+4.6,p.y+1.2]:null);                                  // outer railing
  ribbonF(tr,S,steel,(k,p)=>el(k,p)?[W+4.6,p.y+.45,W+4.6,p.y+.55]:null);
  [-15.4,-16.9].forEach(o=>ribbonF(tr,S,railM,(k,p)=>el(k,p)?[o,p.y+.14,o,p.y+.3]:null));                 // PATCO tracks
  }
  deck(tr);
  // towers, piers, anchorages
  BR.towers.forEach(x=>{
    BR.cableZ.forEach(z=>boxM(4.5,112,6,steel,x,50,z));
    [24,60,85,104].forEach(y=>boxM(4,y===24?2:3,70,steel,x,y,-320));
    [[60,85],[85,104]].forEach(([a,b])=>{ const h=b-a, len=Math.hypot(h,70), ang=Math.atan2(h,70);
      [1,-1].forEach(sd=>{ const br=boxM(1.2,1.2,len,steel,x,(a+b)/2,-320); br.rotation.x=sd*ang; }); });
    boxM(18,9,86,stone,x,-4,-320);
    const bc=glowSprite(0xff2030,3); bc.position.set(x,108,-320); S.add(bc); });
  BR.anch.forEach(x=>BR.cableZ.forEach(z=>{ const y=bridgeY(x)+4; boxM(16,y,6,stone,x,y/2,z+(z>-320?2.5:-2.5)); }));
  // main cables, suspenders, and the LED show strung along the cables
  const cableLED=[];
  BR.cableZ.forEach(z=>{ const pts=[]; for(let x=BR.anch[0];x<=BR.anch[1];x+=10) pts.push(new THREE.Vector3(x,cableY(x),z));
    mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),420,.55,6,false),steel,0,0,0);
    for(let x=BR.anch[0]+4;x<BR.anch[1]-4;x+=3) cableLED.push(x,cableY(x)+.6,z); });
  const hang=[]; BR.cableZ.forEach(z=>{ for(let x=BR.anch[0]+12;x<BR.anch[1]-8;x+=8){ if(BR.towers.some(t=>Math.abs(t-x)<5)) continue;
    const y0=bridgeY(x)-.5, y1=cableY(x); if(y1-y0<1) continue; pv.set(x,(y0+y1)/2,z); m4.compose(pv,new THREE.Quaternion(),new THREE.Vector3(1,y1-y0,1)); hang.push(m4.clone()); } });
  mkInst(new THREE.BoxGeometry(.14,1,.14),steel,hang);
  const ledGeo=new THREE.BufferGeometry(), ledCol=new Float32Array(cableLED.length);
  ledGeo.setAttribute('position',new THREE.Float32BufferAttribute(cableLED,3)); ledGeo.setAttribute('color',new THREE.BufferAttribute(ledCol,3));
  S.add(new THREE.Points(ledGeo,new THREE.PointsMaterial({map:glowTex,size:2.4,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false})));
  // light on the water under the bridge
  const refl=[]; for(let x=BR.river[0]+10;x<BR.river[1];x+=14) [-282,-358].forEach(z=>{ pv.set(x,-5.9,z+(z>-320?12:-12)); m4.compose(pv,new THREE.Quaternion(),one); refl.push(m4.clone()); });
  const reflGeo=new THREE.PlaneGeometry(1.6,26); reflGeo.rotateX(-Math.PI/2);
  mkInst(reflGeo,new THREE.MeshBasicMaterial({map:glowTex,color:0x9fc8ff,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false}),refl);
  // overhead signs on both approaches
  const gantry=(s,l1,l2)=>{ frame(s,f,tr); orientQ(f,q,basis,nr);
    [-1,1].forEach(sd=>{ const p=f.p.clone().addScaledVector(f.r,sd*(W+2)); boxM(.4,9.6,.4,blackM,p.x,f.p.y+4.8,p.z); });
    const beam=boxM(2*W+4.4,.4,.4,blackM,f.p.x,f.p.y+9.6,f.p.z); beam.quaternion.copy(q);
    const sg=new THREE.Mesh(new THREE.PlaneGeometry(10,3.1),new THREE.MeshBasicMaterial({map:CT(signCanvas2(l1,l2)),toneMapped:false}));
    sg.position.set(f.p.x,f.p.y+7.8,f.p.z); sg.quaternion.copy(q); sg.rotateY(Math.PI); S.add(sg); };
  C.gantries.forEach(([x,z,l1,l2])=>gantry(sNear(x,z),l1,l2));
  const canopyM=new THREE.MeshStandardMaterial({color:0xcfd6e0,emissive:0x405068,roughness:.5});
  if(C.toll){ // Camden toll plaza past the U-turn
  boxM(20,1.2,112,canopyM,2042,7,-320); flat(2032,2052,-376,-264,.05,new THREE.MeshBasicMaterial({map:poolTex,color:0xbfd0ff,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}));
  for(let i=0;i<6;i++){ const z=-365+i*18; boxM(2.2,2.8,3.2,new THREE.MeshStandardMaterial({color:0x1a1e26,emissive:0x2a4a66}),2042,1.4,z); boxM(.4,6.4,.4,curbM,2042,3.2,z+4); }
  const tp=mesh(new THREE.PlaneGeometry(14,2.2),new THREE.MeshBasicMaterial({map:CT(signCanvas2('TOLL PLAZA','NEW JERSEY',{bg:'#0e1218',color:'#f4f7ff'})),toneMapped:false}),2031.9,9.4,-320); tp.rotation.y=-Math.PI/2; }

  // ---- street lights along the course ----
  const poleM=new THREE.MeshStandardMaterial({color:0x2a2e35,metalness:.7,roughness:.4}), lampM=new THREE.MeshBasicMaterial({color:0xeaf2ff,toneMapped:false});
  const poles=[],arms=[],heads=[],pools=[],flare=[],lampSt=[];
  for(let s=10;s<tr.L;s+=32){ frame(s,f,tr); if(f.p.y<-.3) continue; orientQ(f,q,basis,nr);
    [-1,1].forEach(sd=>{ const b=f.p.clone().addScaledVector(f.r,sd*(W+3.4));
      pv.copy(b); pv.y+=4.5; m4.compose(pv,q,one); poles.push(m4.clone());
      pv.copy(b).addScaledVector(f.r,-sd*1.7); pv.y+=9; m4.compose(pv,q,one); arms.push(m4.clone());
      pv.copy(b).addScaledVector(f.r,-sd*3.4); pv.y+=8.85; m4.compose(pv,q,one); heads.push(m4.clone()); flare.push(pv.x,pv.y-.15,pv.z);
      pv.y=f.p.y+.05; m4.compose(pv,new THREE.Quaternion(),one); pools.push(m4.clone()); m4.compose(pv,q,one); lampSt.push(m4.clone()); }); }
  mkInst(new THREE.CylinderGeometry(.14,.2,9,8),poleM,poles); mkInst(new THREE.BoxGeometry(3.6,.14,.2),poleM,arms); mkInst(new THREE.BoxGeometry(1.1,.2,.5),lampM,heads);
  const poolGeo=new THREE.PlaneGeometry(15,15); poolGeo.rotateX(-Math.PI/2);
  mkInst(poolGeo,new THREE.MeshBasicMaterial({map:poolTex,color:0x7a8fb8,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false}),pools);
  lampStreaks(S,lampSt); lampCones(S,heads);
  const fl=new THREE.BufferGeometry(); fl.setAttribute('position',new THREE.Float32BufferAttribute(flare,3));
  S.add(new THREE.Points(fl,new THREE.PointsMaterial({map:glowTex,color:0xdfe9ff,size:3,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false})));
  const bcg=new THREE.BufferGeometry(); bcg.setAttribute('position',new THREE.Float32BufferAttribute(beacons,3));
  const beaconM=new THREE.PointsMaterial({map:glowTex,color:0xff2a2a,size:6,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}); S.add(new THREE.Points(bcg,beaconM));

  // ---- intersections: crosswalks, signals, street-name blades ----
  const lamp={r:new THREE.MeshBasicMaterial({color:0x1a1a1a,toneMapped:false}),y:new THREE.MeshBasicMaterial({color:0x1a1a1a,toneMapped:false}),g:new THREE.MeshBasicMaterial({color:0x1a1a1a,toneMapped:false})};
  const zX=[], zZ=[], lampGeo=new THREE.CircleGeometry(.15,12);
  const NAMES_X={70:'13th St',160:'12th St',250:'11th St',340:'10th St',430:'9th St',520:'8th St',610:'7th St',720:'6th St',810:'5th St'};
  const NAMES_Z={'-800':'Spring Garden St','-700':'Green St','-610':'Buttonwood St','-520':'Callowhill St','-430':'Vine St','-340':'Race St','-250':'Cherry St','-160':'Arch St','-70':'JFK Blvd',
    '20':'Market St','110':'Chestnut St','200':'Walnut St','290':'Locust St','380':'Spruce St','470':'South St'};
  function signal(px,pz,dirX,dirZ,name){ // dir = travel direction of the race lane it controls
    boxM(.3,7.2,.3,poleM,px,3.6,pz);
    const tx=px+dirZ*(W+3), tz=pz-dirX*(W+3); // arm reaches back over the road
    const len=W+4; boxM(dirX?.22:len,.22,dirX?len:.22,poleM,(px+tx)/2,6.9,(pz+tz)/2);
    const ry=Math.atan2(-dirX,-dirZ);
    [0,.55].forEach(t=>{ const hx=lerp(px,tx,.45+t*.6), hz=lerp(pz,tz,.45+t*.6); boxM(.46,1.25,.46,blackM,hx,6.2,hz);
      [['r',6.6],['y',6.2],['g',5.8]].forEach(([c,y])=>{ const l=mesh(lampGeo,lamp[c],hx-dirX*.25,y,hz-dirZ*.25); l.rotation.y=ry; }); });
    const blade=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.5),new THREE.MeshBasicMaterial({map:CT(signCanvas(name,{bg:'#0f5a32',color:'#f4f7f2',size:54,weight:700})),side:THREE.DoubleSide}));
    blade.position.set(px,7.6,pz); blade.rotation.y=ry; S.add(blade); }
  C.roads.forEach(rd=>{ const lo=Math.min(rd.a,rd.b)+40, hi=Math.max(rd.a,rd.b)-40, names=rd.ew?NAMES_X:NAMES_Z, dir=rd.dir;
    Object.keys(names).forEach(k=>{ const c=+k; if(c<=lo||c>=hi) return;
      if(rd.ew){ const xc=c, zc=rd.c; [xc-9,xc+9].forEach(x=>{ for(let z=zc-6.4;z<=zc+6.4;z+=1.25){ pv.set(x,.035,z); m4.compose(pv,new THREE.Quaternion(),one); zX.push(m4.clone()); } });
        signal(xc-dir*11,zc+dir*(W+3),dir,0,names[k]); }
      else { const xc=rd.c, zc=c; [zc-9,zc+9].forEach(z=>{ for(let x=xc-6.4;x<=xc+6.4;x+=1.25){ pv.set(x,.035,z); m4.compose(pv,new THREE.Quaternion(),one); zZ.push(m4.clone()); } });
        signal(xc-dir*(W+3),zc-dir*11,0,dir,names[k]); } }); });
  const zebraM=new THREE.MeshBasicMaterial({color:0xb9bec6});
  mkInst(new THREE.BoxGeometry(3,.02,.55),zebraM,zX); mkInst(new THREE.BoxGeometry(.55,.02,3),zebraM,zZ);
  // speed cameras at the roadside
  const camAt=C.cams;
  camAt.forEach(([x,z,dx,dz])=>{ const cx=x+dx*(W+3), cz=z+dz*(W+3); boxM(.22,5.2,.22,poleM,cx,2.6,cz); boxM(1.1,.55,.7,new THREE.MeshStandardMaterial({color:0xd8dbe0,roughness:.5}),cx,5.3,cz);
    const led=glowSprite(0xff3030,.7); led.position.set(cx-dx*.6,5.3,cz-dz*.6); S.add(led); });
  const EXTRA=[]; // per-frame updates for layout-specific pieces
  if(C.tunnel) tunnelDress();
  if(C.blvd) blvdDress(C.blvd);
  if(C.decoBridge) decoBridge();
  if(C.dockside) docksideDress();
  if(C.skyline) skylineDress();
  const arena=C.arena?arenaDress():null;

  function docksideDress(){
    const stackM=new THREE.MeshStandardMaterial({color:0x1a4a6a,metalness:.55,roughness:.4});
    const boxC=new THREE.MeshStandardMaterial({color:0x8a4a18,metalness:.35,roughness:.75});
    [[180,-290,3,2.6,6],[220,-305,2.2,2.6,5],[260,-285,2.8,2.6,7],[140,-305,2,2.6,4]].forEach(([x,z,w,h,d])=>{
      boxM(w,h,d,stackM,x,h/2,z); boxM(w*.92,h*.9,d*.95,boxC,x,h/2,z); });
    flat(60,320,-330,-260,.05,new THREE.MeshBasicMaterial({map:poolTex,color:0x3a5a78,transparent:true,opacity:.45,blending:THREE.AdditiveBlending,depthWrite:false}));
    const sg=mesh(new THREE.PlaneGeometry(8,1.6),new THREE.MeshBasicMaterial({map:CT(signCanvas2('PORT RICHMOND','CONTAINER YARD',{bg:'#0a0d12',color:'#e6f2ff'})),toneMapped:false}),200,6,-318); sg.rotation.y=Math.PI;
  }
  function skylineDress(){
    const rail=new THREE.MeshStandardMaterial({color:0x9aa1ab,metalness:.8,roughness:.25,side:THREE.DoubleSide});
    ribbonF(tr,S,rail,(k,p)=>p.y>10&&p.z>380&&p.x>100&&p.x<740?[W+3.8,p.y+.4,W+3.8,p.y+1.1]:null);
    ribbonF(tr,S,new THREE.MeshBasicMaterial({color:0xffcf8a,toneMapped:false,side:THREE.DoubleSide}),(k,p)=>p.y>10&&p.z>380&&p.x>100&&p.x<740?[-(W+3.8),p.y+.55,-(W+3.8),p.y+.62]:null);
    const glow=glowSprite(0xffcf8a,12); glow.position.set(720,18,470); S.add(glow);
  }

  // Harbor Line tunnel: open cuts with retaining walls, then a roofed tube with strip lights, portals at both ends
  function tunnelDress(){
    const TH=7.5, inT=p=>p.z>400&&p.y<-.3, roofed=p=>p.z>400&&p.y<-TH+.2;
    const tBarrier=new THREE.MeshStandardMaterial({color:0x14181e,roughness:.4,metalness:.5,side:THREE.DoubleSide});
    const tWall=new THREE.MeshStandardMaterial({color:0xb2bfd0,roughness:.95,emissive:0x2a3444,side:THREE.DoubleSide});
    const tStripe=new THREE.MeshBasicMaterial({color:0xe6f2ff,toneMapped:false,side:THREE.DoubleSide});
    [-1,1].forEach(sd=>{ const o=sd*(W+.3);
      ribbonF(tr,S,tBarrier,(k,p)=>inT(p)?[o,p.y,o,p.y+1.1]:null);
      ribbonF(tr,S,tWall,(k,p)=>inT(p)?[o,p.y+1.1,o,roofed(p)?p.y+TH:Math.max(p.y+1.1,0)]:null);
      ribbonF(tr,S,tStripe,(k,p)=>inT(p)?[sd*(W+.25),p.y+1.18,sd*(W+.25),p.y+1.3]:null); });
    ribbonF(tr,S,new THREE.MeshBasicMaterial({color:0x030406,side:THREE.DoubleSide}),(k,p)=>roofed(p)?[-W-.3,p.y+TH,W+.3,p.y+TH]:null);
    const lightM=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}), sp=[], sl=[];
    for(let s=0,i=0;s<tr.L;s+=13,i++){ frame(s,f,tr); if(!roofed(f.p)) continue; orientQ(f,q,basis,nr);
      [-3.4,3.4].forEach(x=>{ pv.copy(f.p).addScaledVector(f.r,x); pv.y+=TH-.08; m4.compose(pv,q,one); sp.push(m4.clone()); });
      if(i%3===0) [-(W+.2),W+.2].forEach(x=>{ pv.copy(f.p).addScaledVector(f.r,x); pv.y+=3.4; m4.compose(pv,q,one); sl.push(m4.clone()); }); }
    mkInst(new THREE.BoxGeometry(.4,.08,8),lightM,sp); mkInst(new THREE.BoxGeometry(.08,3.6,.7),lightM,sl);
    lampStreaks(S,sp.map(m=>{ const v=new THREE.Vector3(), qq=new THREE.Quaternion(), sc=new THREE.Vector3(); m.decompose(v,qq,sc); v.y-=TH-.12; return new THREE.Matrix4().compose(v,qq,sc); }),true);
    const portalM=new THREE.MeshStandardMaterial({color:0x8a919c,roughness:.8});
    for(let k=0;k<tr.N;k++){ const a=roofed(tr.pts[k]), b=roofed(tr.pts[(k+1)%tr.N]); if(a===b) continue;
      frame(k*tr.ds,f,tr); orientQ(f,q,basis,nr);
      const face=new THREE.Mesh(new THREE.BoxGeometry(2*W+10,4,2.4),portalM); face.position.set(f.p.x,2,f.p.z); face.quaternion.copy(q); S.add(face);
      if(!a&&b){ const sg=new THREE.Mesh(new THREE.PlaneGeometry(12,2.3),new THREE.MeshBasicMaterial({map:CT(signCanvas2('HARBOR LINE','TUNNEL 7 · PHILADELPHIA',{bg:'#0a0d12',color:'#e6f2ff'})),toneMapped:false}));
        sg.position.set(f.p.x,2.2,f.p.z); sg.quaternion.copy(q); sg.rotateY(Math.PI); sg.translateZ(1.25); S.add(sg);
        const red=new THREE.Mesh(new THREE.BoxGeometry(2*W+10,.3,.3),new THREE.MeshBasicMaterial({color:0xff2a3a,toneMapped:false})); red.position.set(f.p.x,4.1,f.p.z); red.quaternion.copy(q); S.add(red); } }
  }
  // Roosevelt Blvd: divided road with a tree median, strip malls, rowhomes and a gas station on both sides
  function blvdDress(B){
    const R2=rng(1917), mid=(B.xw+B.xe)/2;
    flat(B.xw+11.6,B.xe-11.6,B.z0,B.z1,.04,new THREE.MeshStandardMaterial({color:0x121c16,roughness:1}));
    const trunks=[], crowns=[];
    for(let z=B.z0+8;z<B.z1;z+=21) [mid-7,mid+7].forEach(x=>{ const s=.8+R2()*.5;
      pv.set(x,1.5,z); m4.compose(pv,new THREE.Quaternion(),one); trunks.push(m4.clone());
      pv.set(x,4.3,z); m4.compose(pv,new THREE.Quaternion().setFromEuler(new THREE.Euler(R2(),R2()*3,0)),new THREE.Vector3(s*1.1,s,s*1.1)); crowns.push(m4.clone()); });
    mkInst(new THREE.CylinderGeometry(.16,.22,3,6),new THREE.MeshStandardMaterial({color:0x1d1813,roughness:1}),trunks);
    mkInst(new THREE.IcosahedronGeometry(2.3,0),new THREE.MeshStandardMaterial({color:0x16241b,roughness:1,flatShading:true}),crowns);
    const lotM=new THREE.MeshStandardMaterial({color:0x1e2127,roughness:.85});
    [[-1,B.xw],[1,B.xe]].forEach(([sd,xr])=>{ let z=B.z0-20; const face=sd<0?'e':'w', xn=xr+sd*13;
      while(z<B.z1-40){ const len=Math.min(34+R2()*42,B.z1-z), t=R2(), zc=z+len/2;
        if(t<.4){ const x0=sd<0?xn-12:xn, x1=sd<0?xn:xn+12; block(FAC.brick,x0,x1,z,z+len,8.6); storefront(face,z,z+len,sd<0?x1:x0,false); }
        else if(t<.75){ const set=24, x0=sd<0?xn-set-16:xn+set, x1=x0+16;
          block(FAC.stone,x0,x1,z,z+len,6); storefront(face,z,z+len,sd<0?x1:x0,false);
          flat(Math.min(xn,xn+sd*set),Math.max(xn,xn+sd*set),z,z+len,.02,lotM);
          const lg=glowSprite(0xe6eeff,2.4); lg.position.set(xn+sd*set/2,7.9,zc); S.add(lg); boxM(.2,8,.2,poleM,xn+sd*set/2,4,zc); }
        else if(t<.9){ const cx=xn+sd*14;
          boxM(12,.9,Math.min(22,len-4),canopyM,cx,5.8,zc); flat(cx-9,cx+9,zc-12,zc+12,.05,new THREE.MeshBasicMaterial({map:poolTex,color:0xbfd0ff,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false}));
          [-5,0,5].forEach(dz=>boxM(1,1.6,.6,new THREE.MeshStandardMaterial({color:0x1a1e26,emissive:0x0e2a3a}),cx,.8,zc+dz));
          boxM(.4,10,.4,poleM,xn+sd*2,5,z+2); const gs=mesh(new THREE.PlaneGeometry(3,1.6),new THREE.MeshBasicMaterial({map:CT(signCanvas('GAS',{bg:'#0b0e14',color:'#ff3b3b',size:70,glow:14})),toneMapped:false,side:THREE.DoubleSide}),xn+sd*2,10.2,z+2); gs.rotation.y=Math.PI/2; }
        else { const x0=sd<0?xn-14:xn+2, x1=x0+12; block(FAC.glass,x0,x1,z,z+len,5); storefront(face,z,z+len,sd<0?x1:x0,false); }
        z+=len+7; } });
  }
  // the westbound half of the bridge, with its own traffic, so the deck is complete in Event 04
  function decoBridge(){
    const dp=[]; for(let x=2045;x>=705;x-=1) dp.push(new THREE.Vector3(x,bridgeY(x),-340));
    const dtr=makeTrack(dp,W,6), ok=k=>k>2&&k<dtr.N-3;
    ribbonF(dtr,S,roadMat,(k,p)=>ok(k)?[-W-.3,p.y+.01,W+.3,p.y+.01]:null,24);
    [-1,1].forEach(sd=>{ ribbonF(dtr,S,walkM,(k,p)=>ok(k)?[sd*(W+.3),p.y+.16,sd*(W+4.5),p.y+.16]:null); ribbonF(dtr,S,curbM,(k,p)=>ok(k)?[sd*(W+.3),p.y,sd*(W+.3),p.y+.16]:null); });
    deck(dtr,ok);
    const cars=[0x2a2f38,0x9aa1ab,0x5a1a1a,0x1c2f4a,0xd8dade,0x3b3b3b].map((c,i)=>{ const m=buildTrafficCar(c); m.group.rotation.y=-Math.PI/2; S.add(m.group);
      return {m,i:5+i*220,v:17+R_()*8,lane:[-3.6,3.6][i%2]}; });
    EXTRA.push(dt=>cars.forEach(o=>{ o.i+=o.v*dt; if(o.i>dtr.N-5) o.i=4; const k=Math.floor(o.i), p=dtr.pts[k], r=dtr.R[k];
      o.m.group.position.set(p.x+r.x*o.lane,p.y,p.z+r.z*o.lane); o.m.wheels.forEach(w=>w.rotation.x+=o.v*dt/.34); }));
  }

  function arenaDress(){
    const panel=new THREE.MeshStandardMaterial({color:0x0b0d12,roughness:.4,metalness:.6,side:THREE.DoubleSide});
    [[-1,0xff2fb4],[1,0x2fe6ff]].forEach(([sd,c])=>{ const o=sd*(W+.4);
      ribbonF(tr,S,panel,(k,p)=>[o,p.y+.16,o,p.y+.95]);
      ribbonF(tr,S,new THREE.MeshBasicMaterial({color:c,toneMapped:false,side:THREE.DoubleSide}),(k,p)=>[sd*(W+.36),p.y+.62,sd*(W+.36),p.y+.74]); });
    const bank=new THREE.MeshBasicMaterial({color:0xf4f8ff,toneMapped:false});
    [[452,42,0xff2fb4],[452,-362,0x2fe6ff],[-102,-362,0xff2fb4],[-102,42,0x2fe6ff]].forEach(([x,z,c])=>{
      boxM(1.2,30,1.2,poleM,x,15,z); boxM(7,2.6,1,bank,x,30.5,z);
      const g=glowSprite(0xffffff,14); g.position.set(x,30.5,z); S.add(g);
      const cone=new THREE.Mesh(LAMPCONE_GEO,addMat({map:coneTex,color:c,opacity:.12,side:THREE.DoubleSide})); cone.scale.set(3.4,3.4,3.4); cone.position.set(x,30.5-14.6,z); S.add(cone);
      const pool=new THREE.Mesh(new THREE.PlaneGeometry(60,60).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:poolTex,color:c,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false})); pool.position.set(x,.06,z); S.add(pool); });
    const cv=canvasTex(512,192,()=>{}), tex=CT(cv);
    const screen=(x,z)=>{ frame(sNear(x,z),f,tr); orientQ(f,q,basis,nr);
      [-1,1].forEach(sd=>{ const pp=f.p.clone().addScaledVector(f.r,sd*(W+2.4)); boxM(.5,12.5,.5,blackM,pp.x,6.25,pp.z); });
      const beam=boxM(2*W+5,.5,.5,blackM,f.p.x,12.5,f.p.z); beam.quaternion.copy(q);
      const sc=new THREE.Mesh(new THREE.PlaneGeometry(11,4.1),new THREE.MeshBasicMaterial({map:tex,toneMapped:false})); sc.position.set(f.p.x,10,f.p.z); sc.quaternion.copy(q); sc.rotateY(Math.PI); S.add(sc); };
    screen(260,20); screen(300,-340);
    return {canvas:cv,tex};
  }

  // flush merged city geometry
  Object.values(FAC).forEach(b=>{ if(!b.pos.length) return; const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(b.pos,3)); g.setAttribute('normal',new THREE.Float32BufferAttribute(b.nor,3)); g.setAttribute('uv',new THREE.Float32BufferAttribute(b.uv,2));
    S.add(new THREE.Mesh(g,b.mat)); });

  // race-lane traffic
  const obst=[], ocols=[0xd2b23a,0x2a2f38,0xcfd2d8,0x1c3a5a,0x6b1d1d,0xe8e8e8];
  for(let i=0;i<(C.noTraffic?0:7);i++){ const c=buildTrafficCar(ocols[i%ocols.length]); S.add(c.group); obst.push({tr:true,m:c,dist:0,x:0,v:14,vx:0,hitCd:0,isP:false,yaw:0,steer:0}); }
  let sigT=0, ledT=0;
  function update(dt){
    sigT=(sigT+dt)%24; const ph=sigT<14?'g':(sigT<17?'y':'r');
    lamp.r.color.setHex(ph==='r'?0xff2a2a:0x1a1a1a); lamp.y.color.setHex(ph==='y'?0xffb020:0x1a1a1a); lamp.g.color.setHex(ph==='g'?0x3cff8a:0x1a1a1a);
    ledT+=dt; const n=ledCol.length/3;
    for(let i=0;i<n;i++){ const w=Math.max(0,Math.sin(i*.11-ledT*3.2)), b=.22+.78*Math.pow(w,6), warm=Math.max(0,Math.sin(i*.013+ledT*.25));
      ledCol[i*3]=b*(.75+.25*warm); ledCol[i*3+1]=b*(.85+.05*warm); ledCol[i*3+2]=b*(1-.35*warm); }
    ledGeo.attributes.color.needsUpdate=true;
    beaconM.opacity=(ledT%1.6)<.8?1:.15;
    EXTRA.forEach(fn=>fn(dt));
  }
  return {scene:S,track:tr,traffic:obst,update,sNear,koScreen:arena,
    cams:camAt.map(([x,z])=>({s:sNear(x,z)})),
    resetTraffic(){ [.06,.19,.3,.45,.58,.72,.86].forEach((u,i)=>{ const o=obst[i]; if(!o) return; o.dist=u*tr.L; o.x=[-3.6,3.6,0,-3.6,3.6,0,-3.6][i]; o.v=12+R_()*4; }); }};
}

/* ---------------- EVENTS ---------------- */
const EVENTS=[
  {id:'tunnel',build:buildTunnel,name:'Harbor Line',kick:'Event 01',loc:'Tunnel 7',when:'Harbor Line, 03:00',
   caption:'Two laps under the harbor. Cold light, no traffic, nowhere to hide.',specs:'2.1 KM LOOP / 2 LAPS / 7 CARS / NO TRAFFIC',
   note:'flat out\nexcept turn 4',load:'Tunnel 7. Two laps, seven cars.'},
  {id:'blvd',build:buildBlvd,open:true,name:'Roosevelt Blvd',kick:'Event 02',loc:'Northeast Philly',when:'Harbison Av to Cottman Av',
   caption:'A full mile of the Boulevard: U-turn at Harbison, straight through Tyson, U-turn on the Cottman bridge while the express lanes drop underneath.',specs:'1-MILE STRAIGHTS / 2 LAPS / 7 CARS / LIVE TRAFFIC / 4 SPEED CAMERAS',
   note:'U-turn on the\nCottman bridge',load:'Harbison to Cottman and back. Traffic is live.'},
  {id:'bridge',build:buildBridge,open:true,laps:3,name:'The Bridge Run',kick:'Event 03',loc:'Center City',when:'City Hall to the Ben Franklin Bridge',
   caption:'Off the line at City Hall, flat out down Market, up 6th past the Liberty Bell, then a full 1.3 km sprint over the Ben Franklin Bridge. U-turn at the Camden toll plaza and back through Chinatown.',
   specs:'3 LAPS / 1.3 KM BRIDGE STRAIGHT / 7 CARS / LIVE TRAFFIC / 2 SPEED CAMERAS',
   note:'save boost for\nthe bridge',load:'City Hall to the bridge and back. Three laps.'},
  {id:'grand',build:buildGrand,open:true,laps:2,name:'The Long Night',kick:'Event 04',loc:'All of it',when:'Blvd, Center City, the Bridge, the Tunnel',
   caption:'Every level in one loop. Down Roosevelt Blvd, through the Center City canyons, over the Ben Franklin Bridge to Camden, then back under the Delaware through the Harbor Line tunnel.',
   specs:'2 LAPS / 8 KM LOOP / BLVD + BRIDGE + TUNNEL / 7 CARS / LIVE TRAFFIC / 3 SPEED CAMERAS',
   note:'the tunnel\nis where\nit\'s won',load:'The Blvd, the bridge and the tunnel. Two laps of all of it.'},
  {id:'ko',build:buildKnockout,open:true,knockout:true,laps:99,name:'The Gauntlet',kick:'Tournament',loc:'Penn Square',when:'Twelve cars, one survivor',
   caption:'Pick your battlefield, then survive eleven knockout rounds. Last car running wins — same rules on every map, with sector knockouts on the long courses.',
   specs:'12 CARS / 4 MAPS / KNOCKOUT ROUNDS / SECTOR OR LAP CHECKPOINTS',
   note:'pick your\nmap. then\nsurvive.',load:'Twelve cars, one survivor. Choose a map and run The Gauntlet.'},
  {id:'dockside',build:buildDockside,open:true,laps:3,name:'Dockside Dash',kick:'Event 05',loc:'Port Richmond',when:'Container yard to the waterfront',
   caption:'A short, tight, aggressive loop: a narrow container-yard chicane opens onto a waterfront sprint. Three laps, nowhere to hide.',
   specs:'1.3 KM LOOP / 3 LAPS / 7 CARS / NO TRAFFIC',
   note:'chicane tight.\nwater open.',load:'Dockside Dash. Three laps through the yard and the waterfront.'},
  {id:'skyline',build:buildSkyline,open:true,laps:2,name:'Skyline Circuit',kick:'Event 06',loc:'Center City',when:'Streets and the elevated run',
   caption:'A medium mix of technical streets and fast avenues. A sweeping elevated section frames the city before a hard braking zone into South Street.',
   specs:'4.0 KM LOOP / 2 LAPS / 7 CARS / NO TRAFFIC / 2 SPEED CAMERAS',
   note:'save brakes\nfor South St',load:'Skyline Circuit. Two laps of streets and the elevated straight.'},
  {id:'midnight',build:buildMidnight,open:true,laps:1,name:'Midnight Express',kick:'Event 07',loc:'All night',when:'Blvd, bridge, tunnel, waterfront',
   caption:'The longest, fastest, most playful course in one lap: long boost-friendly straights, the Harbor Line tunnel, sweeping bends, and a high-speed run to the line.',
   specs:'10.0 KM / 1 LAP / 7 CARS / LIVE TRAFFIC / 3 SPEED CAMERAS',
   note:'one lap.\nall of it.',load:'Midnight Express. Ten kilometers, one lap, no shortcuts.'}
];
EVENTS.forEach(e=>{ Object.assign(e,e.build()); });
const KO_MAPS=[
 {id:'arena',eventId:'ko',name:'City Hall Arena',km:'1.7'},
 {id:'dockside',eventId:'dockside',name:'Dockside Dash',km:'1.3'},
 {id:'skyline',eventId:'skyline',name:'Skyline Circuit',km:'4.0'},
 {id:'midnight',eventId:'midnight',name:'Midnight Express',km:'10.0'}
];
let koMapI=0;
function bindKoTrack(i){
  koMapI=(i+KO_MAPS.length)%KO_MAPS.length;
  const map=KO_MAPS[koMapI], base=EVENTS.find(e=>e.id==='ko'), track=EVENTS.find(e=>e.id===map.eventId);
  if(!base||!track) return;
  EV=Object.assign({},base,{name:'The Gauntlet · '+map.name,load:`Twelve cars on ${map.name}. Sector checkpoints on long maps.`,track:track.track,scene:track.scene,traffic:track.traffic,update:track.update,sNear:track.sNear,koScreen:track.koScreen,cams:track.cams,pickups:track.pickups,turns:track.turns,chevrons:track.chevrons,resetTraffic:track.resetTraffic,id:'ko',knockout:true});
  RS=EV.scene; TR=EV.track; RS.add(fxGroup); traffic=EV.traffic||[]; if(EV.resetTraffic) EV.resetTraffic();
}
/* ---- power-ups on the racing surface (any car can grab them) ---- */
const PU_TYPES={refill:{c:0x5fe6ff,css:'#5fe6ff',label:'Refill',tag:'REFILL'},long:{c:0xb28cff,css:'#b28cff',label:'Long Boost',tag:'LONG BOOST'},over:{c:0xffb020,css:'#ffb020',label:'Overdrive',tag:'OVERDRIVE'},
  sling:{c:0xff3b4a,css:'#ff3b4a',label:'Slingshot',tag:'SLINGSHOT'},shield:{c:0x7dff9a,css:'#7dff9a',label:'Shield',tag:'SHIELD'},
  shock:{c:0xff6fd8,css:'#ff6fd8',label:'Shockwave',tag:'SHOCKWAVE'},grip:{c:0x4f7bff,css:'#4f7bff',label:'Grip Tires',tag:'GRIP'}};
const PU_DESC='Power-ups: cyan refills boost, violet makes it last, amber raises top speed, red slingshots you forward, green shields you from hits, pink blasts the cars around you, blue adds grip.';
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
addPickups(EVENTS[0],[[300,-3,'refill'],[460,0,'sling'],[620,3,'over'],[790,-3,'shield'],[950,0,'long'],[1120,3,'grip'],[1280,-3,'refill'],[1450,0,'shock'],[1600,3,'over'],[1760,-3,'sling'],[1900,0,'long']]);
addPickups(EVENTS[1],[[250,-3.4,'refill'],[560,3.4,'long'],[1000,0,'over'],[1400,-3.4,'refill'],[1800,3.4,'over'],[2200,0,'long'],[2700,-3.4,'over'],[3100,3.4,'refill'],
  [400,0,'sling'],[780,-3.4,'shield'],[1200,3.4,'grip'],[1600,0,'shock'],[2000,-3.4,'sling'],[2450,3.4,'shield'],[2900,0,'shock']]);
{ const at=EVENTS[2].sNear;
  addPickups(EVENTS[2],[[at(200,20),-3.6,'refill'],[at(470,20),3.6,'sling'],[at(640,20),0,'grip'],[at(720,-150),0,'shield'],[at(880,-300),-3.6,'over'],
    [at(1150,-300),3.6,'long'],[at(1380,-300),0,'sling'],[at(1640,-300),-3.6,'shock'],[at(1880,-300),0,'grip'],[at(1700,-340),3.6,'refill'],
    [at(1400,-340),0,'over'],[at(1100,-340),-3.6,'sling'],[at(560,-340),3.6,'shield'],[at(200,-340),0,'shock'],[at(-80,-160),0,'grip']]); }
{ const at=EVENTS[4].sNear;
  addPickups(EVENTS[4],[[at(150,20),-3.6,'refill'],[at(330,20),3.6,'sling'],[at(430,-90),0,'shield'],[at(430,-250),-3.6,'shock'],
    [at(320,-340),3.6,'over'],[at(160,-340),0,'grip'],[at(10,-340),-3.6,'long'],[at(-80,-230),3.6,'sling'],[at(-80,-80),0,'refill']]); }
{ const at=EVENTS[3].sNear;
  addPickups(EVENTS[3],[[at(-20,-1300),-3.6,'refill'],[at(-20,-950),3.6,'sling'],[at(200,-800),0,'shield'],[at(560,-800),-3.6,'grip'],[at(720,-600),3.6,'over'],
    [at(720,-420),0,'refill'],[at(900,-300),-3.6,'long'],[at(1200,-300),3.6,'sling'],[at(1500,-300),0,'shock'],[at(1800,-300),-3.6,'grip'],
    [at(2030,-100),3.6,'shield'],[at(2030,250),0,'refill'],[at(1600,470),-3.6,'over'],[at(1300,470),3.6,'sling'],[at(1000,470),0,'shock'],
    [at(600,470),-3.6,'refill'],[at(250,470),3.6,'shield'],[at(-80,200),0,'grip'],[at(-80,-300),-3.6,'long'],[at(-80,-650),3.6,'shock'],[at(-80,-1100),0,'over']]); }
{ const at=EVENTS[5].sNear;
  addPickups(EVENTS[5],[[at(160,-320),-3.4,'refill'],[at(280,-320),3.4,'sling'],[at(340,-260),0,'grip'],[at(240,-200),-3.4,'over'],[at(80,-230),3.4,'shield'],
    [at(40,-320),0,'long'],[at(-40,-280),-3.4,'shock'],[at(120,-250),3.4,'refill'],[at(300,-250),0,'sling']]); }
{ const at=EVENTS[6].sNear;
  addPickups(EVENTS[6],[[at(200,20),-3.6,'refill'],[at(430,-120),3.6,'sling'],[at(430,-340),0,'shield'],[at(160,-340),-3.6,'grip'],[at(-80,120),3.6,'over'],
    [at(-80,470),0,'long'],[at(430,470),-3.6,'refill'],[at(720,470),3.6,'shock'],[at(720,200),0,'sling'],[at(430,20),-3.6,'over']]); }
{ const at=EVENTS[7].sNear;
  addPickups(EVENTS[7],[[at(-20,-1700),-3.6,'refill'],[at(-20,-950),3.6,'sling'],[at(400,-800),0,'shield'],[at(720,-500),-3.6,'grip'],[at(1200,-300),3.6,'long'],
    [at(1800,-300),0,'over'],[at(2300,-300),-3.6,'sling'],[at(2480,-320),3.6,'shock'],[at(900,-340),0,'refill'],[at(-80,250),-3.6,'shield'],
    [at(2030,200),3.6,'grip'],[at(1600,470),0,'long'],[at(720,470),-3.6,'over'],[at(-80,-900),3.6,'sling']]); }
EVENTS.forEach(addChevrons);
function resetPickups(){ (EV.pickups||[]).forEach(p=>{ p.cd=0; p.g.visible=true; }); }
function worldFx(dt){
  (EV.pickups||[]).forEach(p=>{ p.gem.rotation.y+=dt*2.2; p.gem.rotation.x+=dt*.7; p.gem.position.y=1.3+Math.sin(ghostT*3+p.s)*.22; p.ring.scale.setScalar(1+Math.sin(ghostT*4+p.s)*.08);
    if(p.cd>0){ p.cd-=dt; if(p.cd<=0) p.g.visible=true; } });
  (EV.chevrons||[]).forEach(c=>{ c.m.material.opacity=c.big?.6+.4*Math.max(0,Math.sin(ghostT*5)):.3+.7*Math.max(0,Math.sin(ghostT*7-c.i*.8)); c.m.position.y=c.y+Math.sin(ghostT*2+c.i)*.12; });
}
function checkPickups(r){
  if(!EV.pickups) return; const L=TR.L, s0=((r.dist%L)+L)%L;
  r.puCd=r.puCd||{}; // every car can take each pickup once per pass; the gem just blinks when someone does
  EV.pickups.forEach((p,i)=>{ if((r.puCd[i]||-1)>ghostT) return; let d=Math.abs(s0-p.s); d=Math.min(d,L-d);
    if(d<2.8&&Math.abs(r.x-p.x)<2.8){ r.puCd[i]=ghostT+6; p.cd=.35; p.g.visible=false; applyPU(r,(EV.knockout&&KO&&!KO.done&&KO.mod&&KO.mod.pu)||p.type); } });
}
/* ---- power-ups play differently by race position and car ----
   A pickup checks the grabber's bracket (FRONT = P1-2, PACK = P3-5, CHASE = the last two) and car class
   (HEAVY mass >= 1.35, NIMBLE grip >= 32, MUSCLE boost >= 1.2 or top >= 92, otherwise BALANCED).
   7 power-ups x 3 brackets = 21 variants, 11 car-class twists on top, and 1 pickup in 8 is a jackpot (x1.5). */
const PU_VARIANTS={
 refill:{front:['Top-Off','Boost topped off.'],pack:['Refill','Full boost, and it recharges faster for 5s.'],chase:['Overflow','Boost overfilled to 140%.']},
 long:{front:['Cruise Control','Boost drains slower for 8s.'],pack:['Long Boost','A quarter tank now, and slow drain for 8s.'],chase:['Endless','Boost does not drain at all for 5s.']},
 over:{front:['Overdrive','Top speed up 14% for 5s.'],pack:['Slipstream','Top speed up and draft from twice as far for 6s.'],chase:['Redline','Top speed up 22% for 4s. No boost recharge.']},
 sling:{front:['Kick','A small shove forward.'],pack:['Slingshot','Launched forward.'],chase:['Catapult','Launched and towed toward the car ahead.']},
 shield:{front:['Rear Guard','Hits from behind and shockwaves bounce off for 9s.'],pack:['Shield','Walls and contact can\'t slow you for 6s.'],chase:['Battering Ram','Shielded for 5s. Hit a car from behind to steal its speed.']},
 shock:{front:['Wake','Everyone behind you loses speed.'],pack:['Shockwave','Every car around you loses speed.'],chase:['Lightning','The leaders get struck, wherever they are.']},
 grip:{front:['Grip Tires','45% more grip for 8s.'],pack:['Slicks','More grip and no scrub through corners for 8s.'],chase:['Rails','80% more grip, and walls can\'t slow you for 6s.']}
};
const BR_LABEL={front:'front-runner',pack:'midpack',chase:'from the back'};
function carClass(d){ const m=d.mass||1; if(m>=1.35) return 'heavy'; if(d.grip>=32) return 'nimble'; if((d.nitro||1)>=1.2||d.top>=92) return 'muscle'; return 'balanced'; }
function bracketOf(r){ if(mode!=='race'||!racers.length) return 'pack'; const n=EV.knockout?koActive().length:racers.length, pl=standings().indexOf(r)+1; return pl<=2?'front':(pl>=n-1?'chase':'pack'); }
function nextAhead(r,maxD){ let best=null,bd=maxD; for(const o of racers){ if(o===r||o.finished) continue; const g=o.dist-r.dist; if(g>2&&g<bd){ bd=g; best=o; } } return best; }
function shieldVs(c,o){ if(!(c.fxShield>0)) return false; return c.shieldMode==='rear'?o.dist<c.dist:true; }
function applyPU(r,type){
  const br=bracketOf(r), cls=carClass(r.def), V=PU_VARIANTS[type][br], jack=Math.random()<.125||koMod('jackpot'), J=jack?1.5:1;
  let twist='';
  r.fxName=r.fxName||{};
  switch(type){
    case 'refill':
      r.nitro=Math.max(r.nitro,br==='chase'?1.4*(jack?1.15:1):1);
      if(br==='pack') r.fxRegen=5*J;
      if(cls==='muscle'){ r.fxNosMul=6*J; twist='Supercharged: boost hits 20% harder for 6s.'; }
      break;
    case 'long':
      r.fxLong=(br==='chase'?5:8)*J+(cls==='heavy'?4:0); r.drainMul=br==='chase'?0:.35;
      if(br==='pack') r.nitro=Math.min(1,r.nitro+.25); if(br==='chase') r.nitro=Math.max(r.nitro,.6);
      if(cls==='heavy') twist='Diesel: lasts 4s longer.';
      break;
    case 'over':
      r.overMul=br==='chase'?1.22:1.14; r.fxOver=(br==='chase'?4:(br==='pack'?6:5))*J; r.draftRange=br==='pack'?36:0; r.noRegen=br==='chase'; r.overAcc=0;
      if(cls==='muscle'){ r.overMul+=.04; twist='Big Block: another 4% on top.'; }
      else if(cls==='nimble'){ r.fxOver=3.5*J; r.overAcc=7; twist='Short Shift: shorter, but it pulls harder.'; }
      break;
    case 'sling': { let kick=br==='front'?10:(br==='pack'?16:24);
      if(cls==='nimble'){ kick*=1.25; twist='Featherweight: 25% more launch.'; }
      else if(cls==='heavy'){ kick*=.8; r.fxShield=Math.max(r.fxShield,2); r.shieldMode='ram'; r.shieldMass=6; twist='Freight Train: less launch, but you plow through for 2s.'; }
      r.fxSling=(br==='front'?.8:1.4)*J; r.v=Math.min(r.v+kick*J,r.def.top*1.3);
      if(br==='chase'){ const t=nextAhead(r,160); if(t){ r.towT=2.5*J; r.towTarget=t; } }
      break; }
    case 'shield':
      r.shieldMode=br==='front'?'rear':(br==='chase'?'ram':'full'); r.fxShield=(br==='front'?9:(br==='chase'?5:6))*J; r.shieldMass=cls==='heavy'?7:4;
      if(cls==='heavy') twist='Bulldozer: you shove much harder.';
      break;
    case 'grip':
      r.gripMul=br==='chase'?1.8:1.45; r.fxGrip=(br==='chase'?6:8)*J; r.noScrub=br==='pack'; r.railsWall=br==='chase';
      if(cls==='nimble'){ r.fxGrip+=3; twist='Glue: lasts 3s longer.'; } else if(cls==='heavy'){ r.gripMul+=.2; twist='Downforce: even more grip.'; }
      break;
    case 'shock': {
      const hit=shockwave(r,br==='front'?'wake':(br==='chase'?'lightning':'ring'),(cls==='heavy'?1.5:1)*J);
      if(cls==='heavy') twist='Quake: bigger blast radius.';
      else if(cls==='muscle'&&hit){ r.nitro=Math.min(Math.max(1,r.nitro),r.nitro+.25*hit); twist=`Siphon: stole boost from ${hit} car${hit>1?'s':''}.`; }
      break; }
  }
  const key={refill:'refill',long:'long',over:'over',sling:'sling',shield:'shield',grip:'grip',shock:'shock'}[type];
  r.fxName[key]=(jack?'Jackpot ':'')+V[0];
  r.puLog=r.puLog||{}; const combo=`${type}/${br}/${cls}${jack?'/J':''}`; r.puLog[combo]=(r.puLog[combo]||0)+1;
  if(mode!=='race') return;
  if(r.isP){ toast(`${jack?'JACKPOT. ':''}${V[0]}. ${V[1]}${twist?' '+twist:''}`); if(type==='sling') shake=br==='chase'?.9:.6;
    tone(jack?1040:880,.12,.25,'triangle'); setTimeout(()=>tone(jack?1560:1320,.18,.22,'triangle'),90); if(jack) setTimeout(()=>tone(2080,.22,.2,'triangle'),200); flash(jack?.35:.18); }
  else if(player&&type!=='shock'&&Math.abs(r.dist-player.dist)<70&&r.def.tag) persona(r,`${r.def.tag} grabbed ${jack?'a jackpot ':''}${V[0]}.`);
  if(r.isP) tapeLog('powerup',{who:'YOU',tag:(jack?'Jackpot ':'')+V[0]});
}
// shockwave modes: ring hits cars around you, wake only cars behind, lightning strikes the leaders anywhere
const swF=mkF(), swV=new THREE.Vector3();
function shockwave(src,kind,rad){
  kind=kind||'ring'; rad=rad||1;
  const order=mode==='race'?standings():racers, targets=[];
  if(kind==='lightning'){ const lead=order.filter(o=>o!==src&&!o.finished).slice(0,order.indexOf(src)===order.length-1?2:1); targets.push(...lead); }
  else racers.forEach(o=>{ if(o===src||o.finished) return; const dd=o.dist-src.dist;
    if(kind==='wake'?(dd<-2&&dd>-50*rad):(dd>-14*rad&&dd<55*rad)) targets.push(o); });
  frame(src.dist,swF); swV.copy(swF.p).addScaledVector(swF.r,src.x);
  if(kind!=='lightning'){ swRing.position.set(swV.x,swV.y+.25,swV.z); swRing.material.color.setHex(kind==='wake'?0xff9ad8:0xff6fd8); swT=.7; }
  let hitP=false, n=0;
  targets.forEach(o=>{ if(o.fxShield>0) return; n++;
    const k=kind==='lightning'?.8:(kind==='wake'?.85:.78); o.v*=k; o.nitro=kind==='lightning'?0:Math.max(0,o.nitro-(kind==='wake'?.25:.4)); o.vx+=(o.x>=src.x?1:-1)*6;
    frame(o.dist,swF); swV.copy(swF.p).addScaledVector(swF.r,o.x); swV.y+=.6; emitSparks(swV,swF.t,kind==='lightning'?40:20,o.v*.2);
    if(kind==='lightning'){ boltAt(swV); if(!swT){ swRing.position.set(swV.x,swV.y-.35,swV.z); swRing.material.color.setHex(0xbfd8ff); swT=.7; } }
    if(o.isP) hitP=true; });
  if(mode==='race'&&hitP){ toast(kind==='lightning'?`Lightning from ${src.def.tag||src.def.name}, all the way from P${order.indexOf(src)+1}.`:`${kind==='wake'?'Wake':'Shockwave'} from ${src.def.tag||src.def.name}.`); shake=.9; sfx.hit(); }
  if(mode==='race'&&(src.isP||hitP||(player&&Math.abs(src.dist-player.dist)<80))) burst(.5,'lowpass',900,60,.7);
  if(mode==='race'&&src.isP&&kind==='lightning'&&n) toast(`Lightning. ${targets.map(t=>t.def.tag).join(' and ')} got struck.`);
  return n;
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
const smokes=[]; for(let i=0;i<90;i++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTex,transparent:true,depthWrite:false,opacity:0})); s.visible=false; fxGroup.add(s); smokes.push({s,life:0}); }
let smI=0;
function emitSmoke(pos,k){ const o=smokes[smI++%smokes.length]; o.life=1.1*(k||1); o.s.visible=true; o.s.position.copy(pos); o.s.scale.setScalar(1.2*(k?1.4:1)); }
const RN=1400, rainPos=new Float32Array(RN*6), rainP=new Float32Array(RN*3), rainGeo=new THREE.BufferGeometry();
rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPos,3));
const rain=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0xaec2dc,transparent:true,opacity:.34,depthWrite:false}));
rain.frustumCulled=false; rain.visible=false; fxGroup.add(rain);
const rainLast=new THREE.Vector3(), rainVel=new THREE.Vector3(); let rainReady=false;
function inTunnel(){ if(EV.id==='tunnel') return true; const r=player||racers[0]; return !!r&&frame(r.dist,F2).p.y<-6; }
function updateRain(dt){
  const show=LOOK.wet&&(mode==='race'||mode==='loading'||mode==='events')&&!inTunnel(); rain.visible=show;
  if(rainGain) rainGain.gain.setTargetAtTime(show&&soundOn?.07:0,AC.currentTime,.3);
  if(!show){ rainReady=false; return; }
  const c=cam.position; rainVel.subVectors(c,rainLast).divideScalar(Math.max(dt,1e-3)); rainLast.copy(c);
  if(!rainReady){ rainReady=true; rainVel.set(0,0,0); for(let i=0;i<RN;i++){ rainP[i*3]=c.x+(Math.random()-.5)*64; rainP[i*3+1]=c.y-6+Math.random()*24; rainP[i*3+2]=c.z+(Math.random()-.5)*64; } }
  const sx=-rainVel.x*.028, sz=-rainVel.z*.028, sy=-1.1+Math.min(0,-rainVel.y*.02);
  for(let i=0;i<RN;i++){ let x=rainP[i*3], y=rainP[i*3+1]-30*dt, z=rainP[i*3+2]+2*dt;
    if(y<c.y-7||Math.abs(x-c.x)>32||Math.abs(z-c.z)>32){ x=c.x+(Math.random()-.5)*64; y=c.y+10+Math.random()*8; z=c.z+(Math.random()-.5)*64; }
    rainP[i*3]=x; rainP[i*3+1]=y; rainP[i*3+2]=z;
    rainPos.set([x,y,z,x+sx,y+sy,z+sz],i*6); }
  rainGeo.attributes.position.needsUpdate=true;
}
let swT=0; const swRing=new THREE.Mesh(new THREE.RingGeometry(.8,1.25,48),new THREE.MeshBasicMaterial({color:0xff6fd8,transparent:true,opacity:0,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,depthWrite:false,toneMapped:false}));
swRing.rotation.x=-Math.PI/2; swRing.frustumCulled=false; fxGroup.add(swRing);
let boltT=0; const bolt=new THREE.Mesh(new THREE.BoxGeometry(.5,60,.5),new THREE.MeshBasicMaterial({color:0xd8e8ff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));
bolt.frustumCulled=false; fxGroup.add(bolt);
function boltAt(p){ bolt.position.set(p.x,p.y+30,p.z); boltT=.45; }
const shieldGeo=new THREE.SphereGeometry(1,24,16), shieldMat=new THREE.MeshBasicMaterial({color:0x7dff9a,transparent:true,opacity:.16,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false});
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
let composer=null, renderPass=null, bloomPass=null, gradePass=null, glowOn=true;
/* final grade: radial speed blur, edge chromatic aberration, split-tone color grade and vignette (runs in linear space) */
const GRADE_SHADER={uniforms:{tDiffuse:{value:null},uSpeed:{value:0},uBoost:{value:0},uHit:{value:0},uWet:{value:0}},
  vertexShader:'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader:`uniform sampler2D tDiffuse; uniform float uSpeed,uBoost,uHit,uWet; varying vec2 vUv;
  void main(){
    vec2 c=vUv-.5; float r=length(c);
    float bl=(uSpeed*.022+uBoost*.03)*smoothstep(.12,.75,r);
    vec3 col=vec3(0.);
    for(int i=0;i<8;i++){ float t=float(i)/7.; col+=texture2D(tDiffuse,vUv-c*bl*t).rgb; }
    col/=8.;
    float ca=(.0035+uBoost*.006+uHit*.012)*r*r*4.;
    col.r=mix(col.r,texture2D(tDiffuse,vUv+c*ca).r,.85); col.b=mix(col.b,texture2D(tDiffuse,vUv-c*ca).b,.85);
    float l=dot(col,vec3(.2126,.7152,.0722));
    vec3 shadowTint=mix(vec3(.9,1.,1.14),vec3(.86,.98,1.18),uWet), highTint=vec3(1.1,1.02,.9);
    col*=mix(shadowTint,highTint,smoothstep(.04,.55,l));
    col=max(mix(vec3(l),col,1.12),0.);
    col=col*(1.0+col*.06)/(1.0+col*.06*.5);
    col*=1.-.42*smoothstep(.38,.92,r*1.2);
    gl_FragColor=vec4(col,1.);
  }`};
try{
  if(THREE.EffectComposer&&THREE.RenderPass&&THREE.UnrealBloomPass&&THREE.ShaderPass&&THREE.GammaCorrectionShader){
    let rt; // WebGL2: 4x MSAA on the composer targets so edges stay clean through bloom and grading
    if(renderer.capabilities.isWebGL2&&THREE.WebGLMultisampleRenderTarget){ const pr=renderer.getPixelRatio();
      rt=new THREE.WebGLMultisampleRenderTarget(innerWidth*pr,innerHeight*pr,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat}); rt.samples=4; }
    composer=new THREE.EffectComposer(renderer,rt);
    renderPass=new THREE.RenderPass(studio,cam); composer.addPass(renderPass);
    bloomPass=new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.8,.45,.8); composer.addPass(bloomPass);
    gradePass=new THREE.ShaderPass(GRADE_SHADER); composer.addPass(gradePass);
    composer.addPass(new THREE.ShaderPass(THREE.GammaCorrectionShader));
  }
}catch(e){ composer=null; }
if(!composer){ const b=$('#glow'); if(b) b.style.display='none'; }
function draw(scene){
  if(scene.userData.dome) scene.userData.dome.position.copy(cam.position);
  if(gradePass){ const u=gradePass.uniforms, pl=mode==='race'&&player?player:null;
    u.uSpeed.value=lerp(u.uSpeed.value,pl?STAGE.blur[pl.stage||0]*.85:0,.06); u.uBoost.value=lerp(u.uBoost.value,pl&&pl.nosOn?1:0,.12);
    u.uHit.value=Math.min(1,shake); u.uWet.value=LOOK.wet&&scene!==studio?1:0; }
  if(composer&&glowOn){ renderPass.scene=scene; const b=scene.userData.bloom||{strength:.5,radius:.4,threshold:.85};
    bloomPass.strength=b.strength; bloomPass.radius=b.radius; bloomPass.threshold=b.threshold; composer.render(); }
  else renderer.render(scene,cam);
}
function resize(){ renderer.setSize(innerWidth,innerHeight,false); if(composer) composer.setSize(innerWidth,innerHeight); cam.aspect=aspect(); cam.updateProjectionMatrix(); }
addEventListener('resize',resize); resize();
function hfovToV(h){ return THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(h)/2)/cam.aspect)); }

/* ---------------- AUDIO ---------------- */
let AC=null, master, engGain, engF, o1, o2, scrGain, windGain, rainGain=null, noiseBuf, soundOn=true;
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
  scrGain=loop('bandpass',2100,6); windGain=loop('lowpass',500,.7); rainGain=loop('highpass',2600,.4);
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
function clearRacers(){ racers.forEach(r=>{ r.scene.remove(r.m.group); if(r.trail) r.scene.remove(r.trail.mesh); r.m.group.traverse(o=>{ if(o.geometry&&!o.isSprite) o.geometry.dispose(); }); }); racers=[]; }
function addRacer(def,isP,dist,x,skill){
  const m=buildCar(def); RS.add(m.group); const rig=rigLights(m.group,BODIES[def.body||'wedge'],false), trail=makeTrail(); RS.add(trail.mesh);
  if(isP){ const h=hist(def.id); m.paint.roughness=clamp(def.rough+h.hits*.004,0,.6); }
  const r={def,m,scene:RS,isP,dist,x,vx:0,v:0,steer:0,nitro:1,hitCd:0,slip:0,yaw:0,finished:false,finishT:0,laps:[],lapStart:0,hits:0,top:0,skill:skill||1,off:(Math.random()-.5)*3,wob:Math.random()*10,draft:0,burst:0,lit:false,fxLong:0,fxOver:0,fxSling:0,fxShield:0,fxGrip:0,fxRegen:0,fxNosMul:0,towT:0,fxName:{},mass:(def.P&&def.P.mass)||def.mass||1,startDelay:def.P?(def.P.start<0?Math.random()*.55:def.P.start):0,grudge:{}};
  if(def.P) r.label=addLabel(m.group,def.tag,def.color);
  r.rig=rig; r.trail=trail;
  r.bubble=new THREE.Mesh(shieldGeo,shieldMat); r.bubble.position.y=.8; r.bubble.visible=false; m.group.add(r.bubble);
  racers.push(r); return r;
}
let personaT=0, boardT=0;
function standings(){ if(EV.knockout){ const on=racers.filter(r=>!r.out).sort((a,b)=>b.dist-a.dist), off=racers.filter(r=>r.out).sort((a,b)=>b.outAt-a.outAt); return on.concat(off); }
  return racers.slice().sort((a,b)=>(b.finished?1e9-b.finishT:b.dist)-(a.finished?1e9-a.finishT:a.dist)); }
function persona(r,msg,force){ if(mode!=='race'||raceT<2) return; if(!force&&((r.tc||0)>raceT||personaT>raceT)) return; r.tc=raceT+11; personaT=raceT+3; toast(msg); }
function addLabel(g,text,color){
  const c=canvasTex(256,64,(x)=>{ x.font='800 30px "Arial Narrow",Arial,sans-serif'; x.textAlign='center'; x.textBaseline='middle'; x.fillStyle='rgba(4,6,10,.55)'; const w=Math.min(250,x.measureText(text).width+26); x.fillRect(128-w/2,12,w,40); x.fillStyle=color; x.fillText(text,128,33); });
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:CT(c),transparent:true,depthWrite:false})); sp.scale.set(2.8,.7,1); sp.position.set(0,2.3,0); g.add(sp); return sp; }
function kAhead(s,span){ let m=0; for(let i=0;i<6;i++){ const k=frame(s+10+span*i/5,F2).k; if(Math.abs(k)>Math.abs(m)) m=k; } return m; }

/* ---- race situation: rivals read their position and pick a mood ----
   Four times a second each rival checks its place, the gaps (in seconds) to the cars just ahead and
   behind, the gap to the leader, how much race is left, and whether it just got passed. That gives a
   desperation score D (0..1) and a mood:
     lead    P1 with nobody close: drives clean and banks boost
     defend  someone within ~0.6 s behind (and closer than the car ahead): covers their line, boosts to break the tow
     attack  a car within ~0.7 s ahead: boosts on straights to make the pass
     push    behind with a gap to close: spends boost above its reserve, detours for power-ups
     all-in  desperate, usually late: empties the tank, brakes later, will make contact
   TEMPER says how each persona bends: temper scales D, bank is the boost it tries to keep in reserve,
   defend is how hard it covers a chaser. */
const TEMPER={apex:{temper:.55,bank:.35,defend:.45},wall:{temper:.7,bank:.45,defend:1},leech:{temper:.8,bank:.25,defend:.3},
  bruiser:{temper:1,bank:.15,defend:.6},closer:{temper:.6,bank:.6,defend:.5},wild:{temper:1.1,bank:.05,defend:.2}};
const MOOD_TAG={lead:'LEAD',defend:'DEFEND',attack:'ATTACK',push:'PUSH',allin:'ALL-IN'};
function updateMood(r,order){
  const T=TEMPER[r.def.id]||TEMPER.apex, n=EV.knockout?order.filter(o=>!o.out).length:order.length, place=order.indexOf(r)+1, vRef=Math.max(r.v,30);
  const ahead=order[place-2]||null, behind=order[place]||null;
  const gapA=ahead?(ahead.dist-r.dist)/vRef:99, gapB=behind?(r.dist-behind.dist)/vRef:99, gapLead=(order[0].dist-r.dist)/vRef;
  const prog=EV.knockout?clamp((KO?KO.round:1)/11,0,1):clamp(r.dist/(laps()*TR.L),0,1), prev=r.mood;
  if(prev&&place>prev.place){ r.stung=4; r.stungBy=ahead; } else if(prev&&place<prev.place) r.stung=0;
  r.stung=Math.max(0,(r.stung||0)-.25);
  let D=((place-1)/Math.max(1,n-1))*.45+clamp(gapLead/12,0,1)*.35;
  D*=.55+.65*prog;                          // position matters more as the race runs out
  if(r.stung>0) D+=.25;                     // just got passed
  if(prog>.85&&place>1&&gapA<1.5) D+=.2;    // last-lap scrap
  if(EV.knockout&&KO&&!KO.done&&place>=n-(KO.mod&&KO.mod.id==='double'?1:0)) D+=.3+.4*(((r.dist%TR.L)+TR.L)%TR.L/TR.L); // in the knockout zone
  D=clamp(D*T.temper,0,1);
  let mood='push';
  if(D>.62) mood='allin'; else if(gapA<.7||gapB<.6) mood=gapA<=gapB*1.2?'attack':'defend'; else if(place===1||D<.22) mood='lead';
  r.mood={D,mood,place,gapA,gapB,ahead,behind,prog,T};
  r.moodLog=r.moodLog||{}; r.moodLog[mood]=(r.moodLog[mood]||0)+1;
  if(!prev||prev.mood===mood||!player) return;
  const tag=r.def.tag;
  if(mood==='allin') persona(r,`${tag} is all-in. Everything left is going into the boost.`);
  else if(r.stung>3.5&&r.stungBy===player) persona(r,`You passed ${tag}. It wants that spot back.`);
  else if(mood==='defend'&&behind===player) persona(r,`${tag} is defending from you.`);
  else if(mood==='attack'&&ahead===player) persona(r,`${tag} is lining up a pass on you.`);
}
// how a rival's situation changes the worth of each power-up (added to scorePickup)
function moodPickup(r,p,M,s0,L){
  let dd=p.s-s0; if(dd<0) dd+=L; if(dd<5||dd>72) return 0;
  const D=M.D, lat=Math.abs(p.x-r.x);
  let v=3.5+D*6+lat*1.35*D*.6;                          // every rival wants a reachable pickup; desperate ones accept bigger detours
  const near=racers.filter(o=>o!==r&&!o.finished&&o.dist-r.dist>-8&&o.dist-r.dist<45).length;
  switch(p.type){
    case 'shock': v+=near?(M.mood==='attack'||M.mood==='allin'?9:4):-6; break;
    case 'sling': case 'over': v+=D*5+(M.mood==='attack'?3:0); break;
    case 'shield': v+=M.mood==='defend'?6:(M.mood==='lead'&&M.gapB<1.6?4:0); break;
    case 'grip': v+=Math.abs(kAhead(r.dist+dd,40))>.006?3:0; break;
    case 'refill': v+=r.nitro<.3&&(M.mood==='allin'||M.mood==='attack'||M.mood==='push')?5:0; break;
    case 'long': v+=M.mood==='lead'||M.mood==='defend'?3:0; break; }
  const nA=EV.knockout?koActive().length:racers.length, br=M.place<=2?'front':(M.place>=nA-1?'chase':'pack');
  if(br==='chase'){ if(p.type==='shock') v+=10; if(p.type==='sling') v+=5; if(p.type==='refill') v+=3; }   // lightning, catapult, overflow
  else if(br==='front'){ if(p.type==='shock') v+=M.gapB<1.2?6:-4; if(p.type==='shield') v+=3; }           // wake, rear guard
  if(M.mood==='lead'&&p.type!=='shield') v-=3;          // leaders don't wander off the line
  return v;
}
function stepRacer(r,dt,inp){
  const d=r.def, W=TR.W, L=TR.L, G=d.grip*(r.fxGrip>0?(r.gripMul||1.45):1)*(EV.knockout&&KO?KO.gripMul:1), shielded=(r.fxShield>0&&r.shieldMode!=='rear')||(r.fxGrip>0&&r.railsWall);
  frame(r.dist,F);
  const k=F.k;
  let steer=0, brake=false, nitro=false, brakeAmt=0;
  if(inp){ steer=inp.steer; brake=inp.brake; nitro=inp.nitro&&r.nitro>0.02; if(brake) brakeAmt=1; }
  else {
    const P=d.P||RIVALS[0].P, racing=mode==='race', evB=eventAiBias();
    const ka=kAhead(r.dist,Math.max(30,r.v*1.4));
    const kn=frame(r.dist+r.v*.6+12,F2).k;
    const line=clamp(-kn*700,-5.2,5.2)*P.line*evB.line;
    let tx=line+r.off*P.offScale+Math.sin(r.wob+ghostT*.3)*P.wobble, gain=P.gain, bias=0, vF=1, wantN=false;
    const pl=racing&&player&&player!==r?player:null, gapP=pl?r.dist-pl.dist:0; // >0: I'm ahead of you
    let chasing=null;
    const chaser=nearestChaser(r);
    if(racing){ r.moodT=(r.moodT||0)-dt; if(r.moodT<=0){ r.moodT=.25; updateMood(r,standings()); } }
    const M=racing&&r.mood?r.mood:null, D=M?M.D:0;
    switch(d.id){
      case 'wall': { // covers the line of whoever is glued to its bumper (you or another rival)
        const tgt=pl&&gapP>1.5&&gapP<34?pl:chaser;
        if(tgt){ const g=r.dist-tgt.dist; tx=tgt.x; gain=.4; if(gapP<10&&r.nitro>.2) wantN=true;
          if(tgt===pl) persona(r,`${d.tag} is covering your line.`);
          else if(Math.random()<.012) persona(r,`${d.tag} shuts the door on ${tgt.def.tag}.`,true); }
        break; }
      case 'leech': { // tuck into the draft of the nearest car ahead, then slingshot out
        let best=null,bd=46; for(const o of racers){ if(o===r) continue; const dd=o.dist-r.dist; if(dd>0&&dd<bd){ bd=dd; best=o; } }
        if(best){ chasing=best;
          if(bd>9){ tx=best.x; if(bd<24&&Math.abs(best.x-r.x)<2.4){ r.draft=7.5;
            if(best===pl) persona(r,`${d.tag} is sitting in your slipstream.`);
            else if(best.def.tag&&Math.random()<.01) persona(r,`${d.tag} hooks onto ${best.def.tag}'s draft.`,true); } }
          else { tx=best.x+(best.x>0?-3.5:3.5); wantN=true; r.draft=4;
            if(best===pl) persona(r,`${d.tag} slingshots out of your draft.`);
            else if(Math.random()<.015) persona(r,`${d.tag} sends it past ${best.def.tag}.`,true); } }
        break; }
      case 'bruiser': { // leans on whoever is alongside (you or a rival)
        const tgt=pl&&Math.abs(gapP)<9?pl:nearestAlongside(r);
        if(tgt){ tx=tgt.x; gain=.62; chasing=tgt;
          if(tgt===pl) persona(r,`${d.tag} is leaning on you.`);
          else if(Math.random()<.014) persona(r,`${d.tag} bounces ${tgt.def.tag} off the paint.`,true); }
        break; }
      case 'closer': { // cruises, then empties the tank late
        const prog=r.dist/(laps()*TR.L);
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
    // situational tactics on top of the persona
    if(M){
      if(M.mood==='allin'&&d.id==='bruiser'&&M.ahead&&M.ahead.dist-r.dist<14){ tx=M.ahead.x; gain=.6; chasing=M.ahead; }
      else if(M.mood==='defend'&&M.behind&&d.id!=='wall'&&M.gapB<.6) tx=lerp(tx,M.behind.x,.45*M.T.defend);
    }
    const turnHint=nextTurn(r);
    let puDD=1e9; // distance to the pickup this rival is lining up for
    if((P.seek||D>.4)&&(!chasing||D>.6)&&EV.pickups&&!(d.id==='wall'&&(pl&&gapP>1.5&&gapP<34||chaser))){ const L=TR.L, s0=((r.dist%L)+L)%L;
      let bestP=null,bestSc=.4;
      for(const p of EV.pickups){ if(r.puCd&&r.puCd[EV.pickups.indexOf(p)]>ghostT) continue; const sc=scorePickup(r,{...p,cd:0},P,s0,L)+(M?moodPickup(r,p,M,s0,L):0); if(sc>bestSc){ bestSc=sc; bestP=p; } }
      if(bestP){ tx=bestP.x; puDD=((bestP.s-s0)%L+L)%L; } }
    // avoidance: traffic always; other racers unless you're the one this persona is attacking
    for(const o of racers.concat(traffic)){ if(o===r||o===chasing) continue; const dd=o.dist-r.dist, dx=o.x-r.x;
      if(dd>0&&dd<(o.tr?26:15*(1-.45*D))&&Math.abs(dx)<2.8&&(o.tr||dd<puDD)){ tx=o.x+(o.x>0?-3.4:3.4); } }  // a pickup closer than the car ahead wins
    let rubber=1; if(pl) rubber=1+clamp((pl.dist-r.dist)/420,-.08,.1)*P.rubber;
    const corner=aiCornerPlan(r,d,P,ka,turnHint,evB,rubber,vF,G,M);
    if(corner.inApproach&&corner.lineShift) tx+=corner.lineShift;
    tx=clamp(tx,-W+1.4,W-1.4);
    const ac=r.v*r.v*k*.5;
    steer=clamp(-ac/G+(tx-r.x)*gain-r.vx*.14+bias,-1,1);
    const vT=corner.vTarget;
    brakeAmt=corner.brake;
    brake=brakeAmt>.12;
    const straight=Math.abs(ka)<.003&&r.v>38;
    switch(P.nitro){
      case 'exit':    nitro=straight&&r.nitro>.25&&(r._nos||Math.abs(frame(r.dist-25,F2).k)>.004); break;
      case 'defend':  nitro=wantN; break;
      case 'pass':    nitro=wantN&&r.nitro>.05; break;
      case 'eager':   nitro=straight&&r.nitro>.1; break;
      case 'reserve': nitro=wantN&&r.nitro>.02; break;
      case 'burst':   nitro=(r.burst>0)&&r.nitro>.05; break;
    }
    if(M){ const bank=M.T.bank*(1-D);
      if(M.mood==='allin') nitro=nitro||(r.nitro>.02&&(straight||Math.abs(ka)<.006));
      else if(M.mood==='attack') nitro=nitro||(straight&&r.nitro>bank*.5);
      else if(M.mood==='defend') nitro=nitro||(straight&&M.gapB<.55&&r.nitro>.2);
      else if(M.mood==='push') nitro=nitro||(straight&&r.nitro>bank);
      if(M.mood==='lead'&&r.nitro<bank&&!wantN) nitro=false; }
    if(r.burst>0) r.burst-=dt;
    if(brake) nitro=false;
    r._nos=nitro;
  }
  r.steer=inp?lerp(r.steer,steer,1-Math.exp(-dt*9)):steer;
  const vmax=d.top*(r.koTop||1)*(EV.knockout&&KO&&!KO.done?KO.topMul:1)*(nitro?1.22:1)*(r.fxOver>0?(r.overMul||1.14):1)*(r.fxSling>0?1.3:1);
  let a=d.acc*Math.max(0,1-r.v/vmax); if(r.v>vmax) a=-10;
  if(nitro) a+=14*d.nitro*(r.fxNosMul>0?1.2:1);
  if(r.fxOver>0) a+=5+(r.overAcc||0);
  if(r.towT>0&&r.towTarget){ const g=r.towTarget.dist-r.dist; if(g>8&&g<220) a+=16; else r.towT=0; }
  if(r.fxSling>0) a+=22;
  if(r.draft>0){ a+=r.draft; r.draft=0; }
  if(brakeAmt>0) a=-40*brakeAmt;
  if(mode==='race'&&raceT<r.startDelay) a=0;
  r.v=Math.max(0,r.v+a*dt);
  if(nitro) r.nitro=Math.max(0,r.nitro-.3*dt*(r.fxLong>0?(r.drainMul!==undefined?r.drainMul:.35):1));
  else if(r.nitro>1) r.nitro=Math.max(1,r.nitro-.015*dt);
  r.nosOn=nitro;
  ['fxLong','fxOver','fxSling','fxShield','fxGrip','fxRegen','fxNosMul','towT'].forEach(k=>{ if(r[k]>0) r[k]-=dt; });
  const ac=r.v*r.v*k*.5, sa=r.steer*G*Math.min(1,r.v/18);
  r.vx+=(sa+ac-r.vx*3.2)*dt;
  r.x+=r.vx*dt;
  r.slip=clamp((Math.abs(ac)-G*.72)/(G*.4),0,1)*(r.v>30?1:0) + (brake&&r.v>35?.6:0);
  if(r.fxGrip>0&&r.noScrub) r.slip*=.3;
  const regen=r.noRegen&&r.fxOver>0?0:(.035+r.slip*.12)*dt*(r.isP?1:1.2)*(r.fxRegen>0?2.5:1)*(koMod('nitro')?2:1);
  r.nitro=Math.min(Math.max(1,r.nitro),r.nitro+regen);
  const lim=W-1.1; r.hitCd-=dt;
  if(Math.abs(r.x)>lim){ const sd=Math.sign(r.x); r.x=sd*lim;
    if(r.hitCd<=0&&Math.abs(r.vx)>3){ if(!shielded){ r.v*=.88; r.hits++; } r.hitCd=.35;
      if(r.isP){ shake=shielded?.25:.7; sfx.hit(); }
      tmpV.copy(F.p).addScaledVector(F.r,r.x+sd*1); tmpV.y+=.4; emitSparks(tmpV,F.t,26,r.v*.25); }
    else if(Math.random()<.5){ tmpV.copy(F.p).addScaledVector(F.r,r.x+sd*1); tmpV.y+=.4; emitSparks(tmpV,F.t,2,r.v*.2); if(!shielded) r.v*=1-.25*dt; }
    r.vx*=-.3; }
  const prevDist=r.dist, prevLap=Math.floor(r.dist/L);
  r.dist+=r.v*dt/Math.max(.6,1+r.x*k);
  r.top=Math.max(r.top,r.v);
  checkPickups(r);
  const lap=Math.floor(r.dist/L);
  if(lap>prevLap&&lap>=1&&mode==='race'){ r.laps.push(raceT-r.lapStart); r.lapStart=raceT;
    if(r.isP&&lap<laps()&&!EV.knockout) toast(`Lap ${lap+1}. ${fmt(r.laps[r.laps.length-1])}`); }
  if(!r.finished&&r.dist>=laps()*L&&mode==='race'){ r.finished=true; r.finishT=raceT; }
  if(r.isP&&mode==='race'&&EV.cams.length&&!r.finished){ const a0=((prevDist%L)+L)%L, b0=((r.dist%L)+L)%L;
    EV.cams.forEach(c=>{ const crossed=a0<=b0?(a0<c.s&&c.s<=b0):(a0<c.s||c.s<=b0); if(crossed&&r.v>44.7){ camFlashes++; flash(.55); sfx.shutter(); toast(`Speed camera. ${Math.round(r.v*2.237)} mph.`); } }); }
}
function stepTraffic(o,dt){ frame(o.dist,F); o.dist+=o.v*dt/Math.max(.6,1+o.x*F.k); o.hitCd-=dt; }
function collide(){
  const all=racers.concat(traffic);
  for(let i=0;i<all.length;i++) for(let j=i+1;j<all.length;j++){
    const a=all[i],b=all[j]; if(a.tr&&b.tr) continue; if(a.out||b.out) continue; if(!a.tr&&!b.tr&&koMod('ghost')) continue;
    let dd=a.dist-b.dist; const L=TR.L; dd=((dd%L)+L*1.5)%L-L*.5;
    const dx=a.x-b.x;
    if(Math.abs(dd)<4.5&&Math.abs(dx)<2.05){
      if(a.tr||b.tr){ const car=a.tr?b:a, t=a.tr?a:b, ddx=car.x-t.x, sgn=ddx>=0?1:-1;
        car.x=t.x+sgn*2.06; car.vx=sgn*4; const behind=((car.dist-t.dist)%L+L*1.5)%L-L*.5<0;
        if(shieldVs(car,t)) t.v=Math.max(t.v,car.v*.6); else if(behind) car.v=Math.min(car.v,t.v*.85+1); else car.v*=.97;
        if(car.hitCd<=0){ car.hitCd=.45; frame(t.dist,F); tmpV.copy(F.p).addScaledVector(F.r,(car.x+t.x)/2); tmpV.y+=.6; emitSparks(tmpV,F.t,34,car.v*.3);
          if(car.isP){ if(!shieldVs(car,t)) car.hits++; shake=shieldVs(car,t)?.3:1; sfx.hit(); setTimeout(()=>sfx.horn(),120); } }
        continue; }
      const ov=(2.05-Math.abs(dx))*(dx>=0?1:-1), ma=(a.mass||1)*(shieldVs(a,b)?(a.shieldMass||4):1), mb=(b.mass||1)*(shieldVs(b,a)?(b.shieldMass||4):1); a.x+=ov*mb/(ma+mb); b.x-=ov*ma/(ma+mb);
      const t=a.vx, sg=Math.sign(dx||1); a.vx=b.vx*.6+sg*2*mb/ma*1.4; b.vx=t*.6-sg*2*ma/mb*1.4;
      const back=dd<0?a:b, fore=back===a?b:a; if(!shieldVs(back,fore)) back.v*=.985;
      if(back.fxShield>0&&back.shieldMode==='ram'&&!(fore.fxShield>0)&&(back.ramCd||0)<=raceT){ back.ramCd=raceT+.8; fore.v*=.8; back.v=Math.max(back.v,fore.v/.8+2);
        frame(fore.dist,F); tmpV.copy(F.p).addScaledVector(F.r,fore.x); tmpV.y+=.5; emitSparks(tmpV,F.t,40,back.v*.3);
        if(fore.isP){ toast(`Rammed by ${back.def.tag}. It took your speed.`); shake=1; } else if(back.isP) toast(`Rammed ${fore.def.tag}. Speed stolen.`); }
      if((a.isP||b.isP)&&(a.hitCd<=0)){ a.hitCd=.3; b.hitCd=.3; sfx.hit(); shake=.5;
        frame((a.dist+b.dist)/2,F); tmpV.copy(F.p).addScaledVector(F.r,(a.x+b.x)/2); tmpV.y+=.5; emitSparks(tmpV,F.t,30,a.v*.3); if(a.isP&&!shieldVs(a,b)) a.hits++; if(b.isP&&!shieldVs(b,a)) b.hits++; }
      if(!a.tr&&!b.tr&&raceT<9&&raceT>0&&!raceTape.battle){ raceTape.battle=true; tapeLog('battle',{a:a.def.tag,b:b.def.tag}); }
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
  if(r.bubble){ const on=r.fxShield>0; r.bubble.visible=on; if(on){ const k=1+Math.sin(ghostT*9)*.05; r.bubble.scale.set(1.55*k,1.05*k,2.9*k); } }
  if(r.slip>.35&&Math.random()<r.slip*.9){ tmpV.copy(r.m.group.position).addScaledVector(headV,-1.6); tmpV.y+=.4; emitSmoke(tmpV); }
  if(LOOK.wet&&r.v>28&&Math.random()<dt*9*(r.v/60)){ tmpV.copy(r.m.group.position).addScaledVector(headV,-2.6); tmpV.y+=.25; emitSmoke(tmpV,.6); } // spray off wet tires
  r.stage=speedStage(r);
  if(r.rig&&r.rig.beamM){ const k=(LOOK.wet?1.25:1)*(LOOK.lightsOut?1.9:1); r.rig.beamM.opacity=STAGE.beam[r.stage]*k; r.rig.coneM.opacity=STAGE.cone[r.stage]*k; }
  if(r.rig&&r.rig.flames) r.rig.flames.forEach(fl=>{ fl.visible=!!r.nosOn; if(r.nosOn) fl.scale.set(1,1,.75+Math.random()*.6); });
  updateTrail(r);
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

/* ---------------- RACE TAPE (all racers — powers highlights + race report) ---------------- */
let raceTape=null, tapeAcc=0, tapeLeader=null, tapePlace=0, hiPlay=null, hiCars=[], reportSkip=false;
function tapeReset(){
  raceTape={snaps:[],events:[],margin:null,battle:false};
  tapeLeader=null; tapePlace=0; tapeAcc=0; reportSkip=false;
}
function tapeSample(sdt){
  if(!raceTape||mode!=='race'||countdown>0) return;
  tapeAcc+=sdt;
  if(tapeAcc<.05) return;
  tapeAcc=0;
  const row=[r2(raceT)];
  racers.forEach(r=>{
    if(r.out) return;
    row.push(r.isP?'player':r.def.id,r2(r.dist),r2(r.x),r2(r.yaw));
  });
  raceTape.snaps.push(row);
  ghostRec.push([r2(raceT),r2(player.dist),r2(player.x),r2(player.yaw)]);
}
function tapeLog(type,payload){
  if(!raceTape||mode!=='race') return;
  raceTape.events.push(Object.assign({t:r2(raceT),type},payload||{}));
}
function tapeWatchStandings(){
  if(!raceTape||!player||mode!=='race'||countdown>0) return;
  const st=standings(), lead=st[0], place=st.indexOf(player)+1;
  if(lead&&lead!==tapeLeader&&!lead.out){
    if(tapeLeader) tapeLog('lead',{from:tapeLeader.isP?'YOU':tapeLeader.def.tag,to:lead.isP?'YOU':lead.def.tag});
    tapeLeader=lead;
  }
  if(place&&tapePlace&&place<tapePlace){
    const overtaken=st[tapePlace-1];
    if(overtaken&&overtaken!==player) tapeLog('overtake',{who:'YOU',target:overtaken.def.tag,fromP:tapePlace,toP:place});
  }
  if(place) tapePlace=place;
}
function koUsesSectors(){ return EV.knockout&&TR&&TR.L>2500; }
function koCheckpoint(round){ const L=TR.L; return koUsesSectors()?round*(L/11):round*L; }
function snapAt(t){
  if(!raceTape||!raceTape.snaps.length) return null;
  const s=raceTape.snaps; if(t<=s[0][0]) return s[0];
  for(let i=0;i<s.length-1;i++) if(t>=s[i][0]&&t<=s[i+1][0]) return s[i];
  return s[s.length-1];
}
function snapDecode(row){
  const out=[]; for(let i=1;i<row.length;i+=4) out.push({id:row[i],dist:row[i+1],x:row[i+2],yaw:row[i+3]});
  return out;
}
function racerLabel(id){ if(id==='player') return 'YOU'; const r=racers.find(x=>x.def.id===id); return r?r.def.tag:id; }
function buildRaceReport(place,t){
  if(!raceTape) return {headline:'Race complete',quote:'',items:[],margin:null};
  const evs=raceTape.events.slice().sort((a,b)=>a.t-b.t);
  const margin=raceTape.margin!=null?raceTape.margin:(()=>{ const order=racers.slice().sort((a,b)=>(a.finishT||9e9)-(b.finishT||9e9)); return order.length>1?Math.abs((order[1].finishT||t)-(order[0].finishT||t)):null; })();
  const items=[]; const used=new Set();
  function pick(type,title,fmtFn){
    const e=evs.find(x=>x.type===type&&!used.has(x)); if(!e) return;
    used.add(e); items.push({t:e.t,title,body:fmtFn(e),ids:e.ids||[]});
  }
  pick('battle','THE OPENING SCRAMBLE',e=>`${e.a} and ${e.b} fought for the first corner.`);
  pick('overtake','THE COMEBACK',e=>`You climbed from P${e.fromP} to P${e.toP}${e.target?' through '+e.target:''}.`);
  const pass=evs.filter(e=>e.type==='overtake').pop();
  if(pass&&!used.has(pass)){ used.add(pass); items.push({t:pass.t,title:'THE DECISIVE PASS',body:`You took P${pass.toP}${pass.target?' past '+pass.target:''}.`,ids:['player']}); }
  pick('powerup','POWER SWING',e=>`${e.who} grabbed ${e.tag}.`);
  pick('knockout','KNOCKOUT',e=>`${e.who} was knocked out.`);
  pick('lead','LEAD CHANGE',e=>`${e.to} took the lead from ${e.from}.`);
  const fin=evs.filter(e=>e.type==='finish').pop();
  if(fin){ items.push({t:fin.t,title:'THE FINISH',body:place===1?`Winner, margin +${(margin||0).toFixed(1)} s.`:`Finished P${place}.`,ids:['player']}); }
  while(items.length<4){
    if(items.length===0) items.push({t:t*.25,title:'THE RUN',body:'You kept it pinned all race.',ids:['player']});
    else if(!items.some(x=>x.title==='THE FINISH')) items.push({t:t,title:'THE FINISH',body:place===1?'Winner.':`Finished P${place}.`,ids:['player']});
    else break;
  }
  const headline=place===1?'THE NIGHT WAS YOURS':(`P${place} / ${racers.length}`);
  const quote=pass?`A ${pass.target?'pass on '+pass.target:'late move'} settled the race.`:items[0]?items[0].body:'';
  return {headline,quote,items:items.slice(0,4),margin};
}
function showResultsClassic(show){
  $('#rClassic').style.display=show?'':'none';
  $('#rReport').style.display=show?'none':'';
}
function finishRaceReport(place,t,gap){
  tapeLog('finish',{place});
  if(raceTape) raceTape.margin=parseFloat(gap)||null;
  const rep=buildRaceReport(place,t);
  renderRaceReport(rep);
  showResultsClassic(reportSkip);
}
function renderRaceReport(rep){
  $('#rReport').style.display='';
  $('#rMagHead').textContent=rep.headline;
  $('#rMagSub').textContent=`${EV.name.toUpperCase()} · P${$('#rPlace').textContent.replace('P','')} / ${racers.length}`;
  $('#rMagQuote').textContent=rep.quote?`“${rep.quote}”`:'';
  $('#rHiList').innerHTML=rep.items.map((it,i)=>`<li><button type="button" data-hi="${i}"><b>${String(i+1).padStart(2,'0')}</b> ${esc(it.title)}<span>${esc(it.body)}</span></button></li>`).join('');
  $('#rHiList').querySelectorAll('button').forEach(b=>b.onclick=()=>playHighlight(rep.items[+b.dataset.hi]));
}
function endHighlight(){
  hiCars.forEach(c=>{ if(c.group.parent) c.group.parent.remove(c.group); });
  hiCars=[]; hiPlay=null; mode='results'; show('results'); draw(studio);
}
function playHighlight(h){
  if(!raceTape||!h) return;
  hiPlay={t0:Math.max(0,h.t-2.2),t1:h.t+3.8,t:Math.max(0,h.t-2.2),ids:h.ids&&h.ids.length?h.ids:['player']};
  hiCars.forEach(c=>{ if(c.group.parent) c.group.parent.remove(c.group); }); hiCars=[];
  const idSet=new Set(hiPlay.ids);
  idSet.forEach(id=>{
    const def=id==='player'?player.def:(racers.find(r=>r.def.id===id)||{}).def||CARS[0];
    const m=buildCar(def); RS.add(m.group); hiCars.push({id,group:m.group,wheels:m.wheels});
  });
  mode='highlight'; show('hud'); $('#hMsg').textContent=h.title; camSnap=true;
}
function highlightStep(dt){
  if(!hiPlay) return;
  hiPlay.t+=dt;
  const row=snapAt(hiPlay.t); if(!row) return;
  snapDecode(row).forEach(s=>{
    if(!hiPlay.ids.includes(s.id)) return;
    const car=hiCars.find(c=>c.id===s.id); if(!car) return;
    poseAt(car.group,s.dist,s.x,s.yaw,0); car.wheels.forEach(w=>w.rotation.x+=dt*40);
  });
  const focus=hiCars.find(c=>c.id==='player')||hiCars[0];
  if(focus){ const s=snapDecode(row).find(x=>x.id===focus.id); if(s){ chaseCam(dt,{dist:s.dist,x:s.x,yaw:s.yaw,v:55,m:{group:focus.group},steer:0,vx:0,nitro:0},null); } }
  draw(RS);
  if(hiPlay.t>=hiPlay.t1) endHighlight();
}

const FX={m4:new THREE.Matrix4(),q:new THREE.Quaternion(),sc:new THREE.Vector3(),p:new THREE.Vector3(),b:new THREE.Matrix4(),nr:new THREE.Vector3()};
function updateFx(dt,focus){
  for(let i=0;i<SP;i++){ if(spLife[i]<=0) continue; spLife[i]-=dt;
    if(spLife[i]<=0){ spPos[i*3+1]=-999; continue; }
    spVel[i*3+1]-=18*dt; spPos[i*3]+=spVel[i*3]*dt; spPos[i*3+1]+=spVel[i*3+1]*dt; spPos[i*3+2]+=spVel[i*3+2]*dt;
    if(spPos[i*3+1]<0){ spPos[i*3+1]=0; spVel[i*3+1]*=-.3; } }
  spGeo.attributes.position.needsUpdate=true;
  if(swT>0){ swT-=dt; const k=1-Math.max(0,swT)/.7; swRing.scale.setScalar(1+k*34); swRing.material.opacity=Math.max(0,swT/.7)*.9; } else { swT=0; swRing.material.opacity=0; }
  if(boltT>0){ boltT-=dt; bolt.material.opacity=Math.max(0,boltT/.45)*(Math.random()<.7?1:.3); bolt.scale.x=bolt.scale.z=.6+Math.random()*.8; } else bolt.material.opacity=0;
  smokes.forEach(o=>{ if(o.life<=0) return; o.life-=dt; o.s.scale.multiplyScalar(1+dt*2.2); o.s.material.opacity=Math.max(0,o.life*.5); o.s.position.y+=dt*.6; if(o.life<=0) o.s.visible=false; });
  updateRain(dt);
  if(!focus) return;
  const {m4,q,sc,p,b,nr}=FX, W=TR.W, H=TR.H;
  const stg=focus.stage||0, len=clamp(focus.v*.07,.3,7)*STAGE.len[stg]; slMesh.material.opacity=STAGE.lines[stg]*(EV.open?.7:1);
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
  player.v=EV.open?60:70; rival.v=player.v+2; player.off=-1.5; rival.off=1.5;
  racers.forEach(r=>{ r.def=Object.assign({},r.def,{top:EV.open?66:78}); });
  if(EV.resetTraffic) EV.resetTraffic();
  resetPickups();
  camSnap=true; renderer.toneMappingExposure=1.05; if(mode!=='loading') setWeather(false);
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
  $('#sStats').innerHTML=bars.map(b=>`<div>${b[0]}<i><b style="width:${Math.min(100,Math.round(b[1]*100))}%"></b></i></div>`).join('');
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
  $('#eGhost').textContent+=' On the grid: Apex, The Wall, Leech, Bruiser, The Closer, Wildcard. '+PU_DESC;
  if(e.knockout){ bindKoTrack(koMapI); $('#eGhost').textContent='Pick a map on the next screen. Short loops use lap checkpoints; long courses knock out at sectors so you are not running 110 km. Round rules: '+KO_MODS.filter(m=>m.id!=='clean').map(m=>m.name).join(', ')+', and a Final Duel for the last two.'; }
  $('#ePg').innerHTML=`0${EVI+1} <em>/ 0${EVENTS.length}</em>`;
  if(dir) animIn([['#eHead',''],['#eNote','d2'],['#eFoot','d1'],['#eStamp','d3']],dir);
  modeT=0; shot=-1;
}
function turnEvent(dir){ EVI=(EVI+dir+EVENTS.length)%EVENTS.length; sfx.page(); setTimeout(()=>sfx.shutter(),60); flash(.95); renderEvent(dir); }
function renderGauntlet(){
  $('#gMaps').innerHTML=KO_MAPS.map((m,i)=>`<button type="button" class="gmap${i===koMapI?' on':''}" data-i="${i}"><b>${esc(m.name)}</b><span>${m.km} km</span></button>`).join('');
  $('#gMaps').querySelectorAll('button').forEach(b=>b.onclick=()=>{ koMapI=+b.dataset.i; bindKoTrack(koMapI); renderGauntlet(); setupAttract(CARS[sel]); sfx.page(); });
  bindKoTrack(koMapI);
}
function openGauntlet(){ initAudio(); closeSheet(); sfx.shutter(); flash(1); mode='gauntlet'; show('gauntlet'); renderGauntlet(); setupAttract(CARS[sel]); }
function startGauntlet(){ bindKoTrack(koMapI); startLoading(); }
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
$('#eGo').onclick=()=>EV.knockout?openGauntlet():startLoading(); $('#eBack').onclick=()=>backToArchive();
$('#gBack').onclick=()=>{ mode='events'; show('events'); renderEvent(0,true); };
$('#gStart').onclick=()=>startGauntlet();
$('#snd').onclick=()=>{ soundOn=!soundOn; $('#snd').textContent=soundOn?'Sound on':'Sound off'; };
$('#glow').onclick=()=>{ glowOn=!glowOn; $('#glow').textContent=glowOn?'Glow on':'Glow off'; };
$('#tap').onclick=()=>{ if(bootReady) enter(); };
$('#quit').onclick=()=>{ endGhost(); backToArchive(); };
$('#rBack').onclick=()=>backToArchive();
$('#rAgain').onclick=()=>startLoading();
$('#rSkip').onclick=()=>{ reportSkip=true; showResultsClassic(true); };
$('#rView').onclick=()=>{ reportSkip=false; showResultsClassic(false); };
$('#rWatch').onclick=()=>{ const b=$('#rHiList button'); if(b) b.click(); else showResultsClassic(true); };
let sx=null, sy=0, swipeEl=null;
['#select','#events'].forEach(id=>{ const el=$(id); el.style.pointerEvents='auto';
  el.addEventListener('pointerdown',e=>{ if(e.target.closest('button')) return; sx=e.clientX; sy=e.clientY; swipeEl=id; }); });
addEventListener('pointerup',e=>{ if(sx===null) return; const dx=e.clientX-sx, dy=e.clientY-sy; sx=null;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){ if(mode==='select'&&swipeEl==='#select') turn(dx<0?1:-1); else if(mode==='events'&&swipeEl==='#events') turnEvent(dx<0?1:-1); } });

function startLoading(){
  initAudio(); sfx.shutter(); flash(1);
  if(mode!=='events') { setEvent(EVI); setupAttract(CARS[sel]); }
  mode='loading'; modeT=0; show('loading');
  setWeather(EV.id!=='tunnel'&&Math.random()<.45);
  $('#ldwhere').textContent=EV.name; $('#ldsub').textContent=`${EV.load} You're in the ${CARS[sel].name}.${LOOK.wet?' Rain tonight, the roads are wet.':''}`;
}
function endGhost(){ if(ghostCar){ ghostCar.scene.remove(ghostCar.group); ghostCar=null; } }
function startRace(){
  clearRacers();
  const me=CARS[sel], R_=id=>RIVALS.find(r=>r.id===id), taken=[me.id];
  if(EV.knockout){ // every car in the archive on one grid; the six personas spread across the eleven rivals
    const others=CARS.filter(c=>c.id!==me.id).sort(()=>Math.random()-.5), per=['apex','wall','leech','bruiser','closer','wild'], pSlot=6+Math.floor(Math.random()*4);
    for(let i=0,oi=0;i<12;i++){ const dist=-5-i*5.5, x=i%2?2.6:-2.6;
      if(i===pSlot){ player=addRacer(me,true,dist,x,1); continue; }
      const car=others[oi], P=R_(per[oi%6]); oi++;
      addRacer(Object.assign({},car,{id:P.id,chassisId:car.id,tag:car.name,color:P.color,car:car.name,P:Object.assign({},P.P,{mass:car.mass||1}),mass:car.mass||1,rivalNote:car.rival}),false,dist,x,.975+Math.random()*.02); }
  } else {
  const grid=[
   ['apex',-5,-2.6,.99],['closer',-11,2.6,.985],['wall',-17,-2.6,.975],
   ['player',-23,2.6,1],['leech',-29,-2.6,.985],['bruiser',-35,2.6,.98],['wild',-41,-2.6,.99]
  ];
  if(Math.random()<.45) grid.sort((a,b)=>a[0]==='player'?1:b[0]==='player'?-1:Math.random()-.5);
  grid.forEach(row=>{
   if(row[0]==='player'){ player=addRacer(me,true,row[1],row[2],row[3]); return; }
   const shell=R_(row[0]), def=buildRivalForEvent(shell,EV.id,taken);
   addRacer(def,false,row[1],row[2],row[3]+(Math.random()-.5)*.012);
  }); }
  personaT=0; boardT=0; resetPickups(); racers.forEach(r=>{ r.fxLong=r.fxOver=r.fxSling=r.fxShield=r.fxGrip=r.fxRegen=r.fxNosMul=r.towT=0; r.fxName={}; });
  if(EV.resetTraffic) EV.resetTraffic();
  const boss=racers.find(r=>!r.isP&&(r.def.chassisId==='overload'));
  if(boss&&!EV.knockout) setTimeout(()=>{ if(mode==='race') toast(`${boss.def.tag} brought the OVERLOAD 3K. Three thousand horsepower on the grid.`); },4200);
  if(EV.knockout){ ghostData=null; endGhost(); } else { loadGhost(); spawnGhost(); } ghostRec=[]; ghostAcc=0; camFlashes=0;
  tapeReset(); KO=null; LOOK.lightsOut=false; applyLights(); if(EV.knockout) koStart();
  mode='race'; show('hud'); countdown=3.6; raceT=0; finishHold=0; slowmo=1; camSnap=true; shake=0;
  $('#hGhost').textContent=''; $('#hMsg').textContent='3'; sfx.beep(false); flash(.9);
}
function finishRace(){
  mode='results'; show('results'); sfx.shutter(); flash(1); engine(0,false); screech(0);
  if(EV.knockout){ finishKnockout(); return; }
  const L=TR.L, est=r=>r.finished?r.finishT:raceT+(laps()*L-r.dist)/Math.max(r.v,30);
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
  $('#rOrder').innerHTML=order.map((r,i)=>`<li${r.isP?' class="me"':''}><b>${i+1}</b>${r.isP?'You, '+esc(r.def.name):esc(r.def.tag)+' <em>'+esc(r.def.name||r.def.car)+'</em>'}</li>`).join('');
  finishRaceReport(place,t,gap);
  page=sel; setWorld('flash'); studioCars.forEach((c,i)=>{ c.group.visible=i===sel; c.paint.roughness=clamp(c.def.rough+h.hits*.004,0,.6); });
  camSnap=true; modeT=0;
}

/* ---------------- TOURNAMENT: THE GAUNTLET ----------------
   Twelve cars. Every lap is a round: once all but the last car (or two) have crossed the line, the stragglers
   are out. Each round rolls a rule from KO_MODS, never the same one twice in a row, and the last two cars
   always get the Final Duel. The last car running wins. */
let KO=null;
const KO_MODS=[
 {id:'clean',name:'Clean Round',txt:'No tricks. Just don\'t be last.'},
 {id:'double',name:'Double Knockout',txt:'The last TWO cars across the line are out.',min:5},
 {id:'bomb',name:'Time Bomb',txt:'Last car past the half-lap mark is out too.',min:5},
 {id:'nitro',name:'Nitro Rain',txt:'Full boost for everyone, recharging twice as fast.',on(){ koActive().forEach(r=>r.nitro=Math.max(r.nitro,1)); }},
 {id:'lights',name:'Lights Out',txt:'The city goes dark. Headlights only.',on(){ LOOK.lightsOut=true; applyLights(); },off(){ LOOK.lightsOut=false; applyLights(); }},
 {id:'underdog',name:'Underdog',txt:'The last three cars get 10% more top speed.'},
 {id:'bounty',name:'Bounty',txt:'Take the lead and you get full boost and a shield.'},
 {id:'shock',name:'Shock Season',txt:'Every pickup is a Shockwave this lap.',pu:'shock'},
 {id:'sling',name:'Slingshot Alley',txt:'Every pickup is a Slingshot this lap.',pu:'sling'},
 {id:'ghost',name:'Ghost Lap',txt:'No contact. Cars pass straight through each other.'},
 {id:'rain',name:'Downpour',txt:'The sky opens up. Everyone loses grip.',on(){ if(!LOOK.wet) setWeather(true); KO.gripMul=.86; },off(){ KO.gripMul=1; }},
 {id:'jackpot',name:'Jackpot Lap',txt:'Every pickup is a jackpot.'},
 {id:'turbo',name:'Turbo Round',txt:'Everyone gets 12% more top speed.',on(){ KO.topMul=1.12; },off(){ KO.topMul=1; }},
 {id:'draft',name:'Draft Frenzy',txt:'Slipstreams reach twice as far and pull twice as hard.'}
];
const KO_FINAL={id:'final',name:'Final Duel',txt:'Two cars left. Overfilled boost, and every pickup is a Slingshot.',pu:'sling',
  on(){ koActive().forEach(r=>r.nitro=1.4); KO.topMul=1.05; },off(){ KO.topMul=1; }};
function koActive(){ return racers.filter(r=>!r.out); }
function koLeader(){ return koActive().reduce((a,b)=>!a||b.dist>a.dist?b:a,null); }
function koMod(id){ return EV.knockout&&KO&&!KO.done&&KO.mod&&KO.mod.id===id; }
function applyLights(){ const o=LOOK.lightsOut; renderer.toneMappingExposure=o?.45:1.05; BEAM_MAT.opacity=o?.8:.3; setWeather(LOOK.wet); if(o) CONE_MAT.opacity=.14; }
const crown=new THREE.Sprite(new THREE.SpriteMaterial({map:CT(canvasTex(256,64,(g)=>{ g.fillStyle='rgba(20,14,4,.7)'; g.fillRect(40,8,176,48); g.strokeStyle='#ffd23b'; g.lineWidth=3; g.strokeRect(40,8,176,48);
  g.font='900 32px "Arial Narrow",Arial,sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillStyle='#ffd23b'; g.fillText('BOUNTY',128,33); })),transparent:true,depthWrite:false}));
crown.scale.set(3.2,.8,1);
function placeCrown(r){ if(crown.parent!==r.m.group){ if(crown.parent) crown.parent.remove(crown); r.m.group.add(crown); } crown.position.set(0,3.2,0); crown.visible=true; }
function hideCrown(){ crown.visible=false; }
function koBanner(title,sub,info){ const b=$('#hRound'); b.innerHTML=`<b>${esc(title)}</b><span>${esc(sub||'')}</span>`; b.className='round on'+(info?' info':''); KO.bannerT=3.4; }
function drawKoScreen(){ const S=EV.koScreen; if(!S||!KO) return; const g=S.canvas.getContext('2d'), act=koActive(), last=KO.out[KO.out.length-1];
  g.fillStyle='#05060a'; g.fillRect(0,0,512,192); g.strokeStyle='#ff2fb4'; g.lineWidth=4; g.strokeRect(6,6,500,180);
  g.textAlign='left'; g.textBaseline='alphabetic'; g.fillStyle='#2fe6ff'; g.font='800 26px "Arial Narrow",Arial,sans-serif'; g.fillText('THE GAUNTLET',22,40);
  g.fillStyle='#f4f7ff'; g.font='900 58px "Arial Narrow",Arial,sans-serif'; g.fillText(KO.done?'WINNER':`ROUND ${KO.round}`,22,100);
  g.font='800 30px "Arial Narrow",Arial,sans-serif'; g.fillStyle='#ffd23b'; g.fillText(KO.done?(act[0]?act[0].def.tag:''):(KO.mod?KO.mod.name.toUpperCase():''),22,140);
  g.textAlign='right'; g.fillStyle='#f4f7ff'; g.font='900 72px "Arial Narrow",Arial,sans-serif'; g.fillText(String(act.length),490,100); g.font='700 20px "Arial Narrow",Arial,sans-serif'; g.fillText('CARS LEFT',490,124);
  if(last){ g.fillStyle='#ff4a3d'; g.font='800 22px "Arial Narrow",Arial,sans-serif'; g.fillText(`OUT: ${last.isP?'YOU':last.def.tag}`,490,170); }
  S.tex.needsUpdate=true; }
function koPick(n){ if(n===2) return KO_FINAL; const pool=KO_MODS.filter(m=>m.id!==KO.lastId&&(!m.min||n>=m.min)&&!(KO.round===1&&(m.id==='double'||m.id==='bomb'))); return pool[Math.floor(Math.random()*pool.length)]; }
function koRound(first){
  if(KO.mod&&KO.mod.off) KO.mod.off();
  const act=koActive(); act.forEach(r=>r.koTop=1); hideCrown(); KO.leader=null;
  if(act.length<=1){ koWin(act[0]); return; }
  KO.mod=koPick(act.length); KO.lastId=KO.mod.id; (KO.log=KO.log||[]).push(KO.mod.id); KO.bombed=false; if(KO.mod.on) KO.mod.on();
  setTimeout(()=>{ if(KO&&!KO.done&&mode==='race') koBanner(`Round ${KO.round} · ${KO.mod.name}`,KO.mod.txt,true); },first?0:2600);
  drawKoScreen();
}
function knockOut(r,why){
  r.out=true; r.finished=true; r.finishT=raceT; r.outAt=raceT; r.koOutRound=KO.round; KO.out.push(r); r.nosOn=false; r.v=0;
  frame(r.dist,F); tmpV.copy(F.p).addScaledVector(F.r,r.x); tmpV.y+=.8; emitSparks(tmpV,F.t,90,18); for(let i=0;i<6;i++) emitSmoke(tmpV,1.6);
  for(let i=0;i<3;i++){ tmpV.y+=5; emitSparks(tmpV,UP,40,12); }
  r.m.group.visible=false; if(r.trail) r.trail.mesh.visible=false; if(crown.parent===r.m.group) hideCrown();
  r.dist=-1e7-KO.out.length; // parked far off the course so nothing steers around it
  const left=koActive().length;
  if(r.isP){ koBanner('You\'re out',`${why} You finished P${left+1} of ${racers.length}.`); flash(.8); shake=1.2; }
  else if(!player.out){ koBanner(`${r.def.tag} is out`,`${why} ${left} left.`); flash(.25); }
  tapeLog('knockout',{who:r.isP?'YOU':r.def.tag});
  sfx.hit(); burst(.7,'lowpass',1400,50,.9); drawKoScreen();
}
function koWin(w){ KO.done=true; if(KO.mod&&KO.mod.off) KO.mod.off(); hideCrown();
  if(w){ w.finished=true; w.finishT=raceT; if(!player.out) koBanner(w.isP?'You win The Gauntlet':`${w.def.tag} wins The Gauntlet`,'Last car running.'); w.m.group.getWorldPosition(tmpV); for(let i=0;i<5;i++){ tmpV.y+=4; emitSparks(tmpV,UP,60,16); } }
  drawKoScreen(); }
function koStart(){ KO={round:1,mod:null,lastId:null,out:[],gripMul:1,topMul:1,leader:null,bombed:false,done:false,bannerT:0}; LOOK.lightsOut=false; applyLights(); koRound(true); }
function koStep(dt){
  if(!KO||KO.done) return; const act=koActive(), L=TR.L;
  if(act.length<=1){ koWin(act[0]); return; }
  if(KO.mod.id==='underdog'){ act.forEach(r=>r.koTop=1); act.slice().sort((a,b)=>a.dist-b.dist).slice(0,3).forEach(r=>r.koTop=1.1); }
  if(KO.mod.id==='draft'||KO.mod.id==='final') act.forEach(r=>{ for(const o of act){ if(o===r) continue; const g=o.dist-r.dist;
    if(g>2&&g<40&&Math.abs(o.x-r.x)<2.4){ r.draft=Math.max(r.draft,KO.mod.id==='draft'?8:5); r.nitro=Math.min(Math.max(1,r.nitro),r.nitro+.08*dt); break; } } });
  if(KO.mod.id==='bounty'){ const lead=koLeader();
    if(KO.leader&&lead!==KO.leader&&!KO.leader.out){ lead.nitro=Math.max(lead.nitro,1.2); lead.fxShield=Math.max(lead.fxShield,3); lead.shieldMode='full';
      if(lead.isP) toast('Bounty claimed. Full boost and a shield.'); else if(KO.leader.isP) toast(`${lead.def.tag} took the lead and the bounty.`); }
    KO.leader=lead; placeCrown(lead); }
  if(KO.mod.id==='bomb'&&!KO.bombed){ const mark=koUsesSectors()?koCheckpoint(KO.round-.5):((KO.round-1+.5)*L), passed=act.filter(r=>r.dist>=mark);
    if(passed.length>=act.length-1){ KO.bombed=true; knockOut(act.filter(r=>r.dist<mark)[0]||act.slice().sort((a,b)=>a.dist-b.dist)[0],'Caught by the time bomb.'); return; } }
  const e=KO.mod.id==='double'&&act.length>=5?2:1;
  const mark=koCheckpoint(KO.round);
  act.forEach(r=>{ if(r.dist>=mark&&r.koRound!==KO.round){ r.koRound=KO.round; r.koT=raceT; } });
  const crossed=act.filter(r=>r.koRound===KO.round);
  if(crossed.length>=act.length-e){
    let outs=act.filter(r=>r.koRound!==KO.round);
    if(outs.length<e) outs=outs.concat(crossed.slice().sort((a,b)=>b.koT-a.koT).slice(0,e-outs.length));
    outs.slice(0,Math.min(e,act.length-1)).forEach(r=>knockOut(r,e===2?'Double knockout.':'Last across the line.'));
    KO.round++; koRound(false);
  }
}

function finishKnockout(){
  const order=standings(), place=order.indexOf(player)+1, t=player.finishT||raceT, won=place===1;
  const rounds=player.out?player.koOutRound-1:(KO?KO.round-1:0);
  const h=hist(player.def.id); h.runs++; h.hits+=player.hits; if(won){ h.wins++; h.winAt=EV.name; } h.last=place; persist();
  LOOK.lightsOut=false; applyLights();
  $('#rPlace').textContent='P'+place;
  $('#rHead').textContent=won?`${player.def.name} survives The Gauntlet`:`${player.def.name} knocked out in round ${player.koOutRound}`;
  $('#rStamp').innerHTML=(won?'Last one standing':`Out in round ${player.koOutRound}`)+`<small>${esc(EV.kick)}</small>`;
  $('#rTbl').innerHTML=`<dt>Survived</dt><dd>${fmt(t)}</dd><dt>Rounds cleared</dt><dd>${rounds} of 11</dd><dt>Cars outlasted</dt><dd>${racers.length-place}</dd><dt>Top speed</dt><dd>${Math.round(player.top*2.237)} mph</dd><dt>Hits</dt><dd>${player.hits}</dd>`;
  $('#rLog').textContent=won?'new stamp on the page.':(place<=3?'so close. run it back.':'don\'t be last. ever.');
  $('#rOrder').innerHTML=order.map((r,i)=>`<li${r.isP?' class="me"':''}><b>${i+1}</b>${r.isP?'You, '+esc(r.def.name):esc(r.def.tag)}${r.out?` <em>out R${r.koOutRound}</em>`:(KO&&KO.done&&i===0?' <em>winner</em>':' <em>still running</em>')}</li>`).join('');
  finishRaceReport(place,t,won?'0.0':'0.0');
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
  else { tgt.copy(pos).addScaledVector(F.t,5).addScaledVector(F.r,2.2).addScaledVector(UP,EV.open?6:3.4); camLook.copy(pos).addScaledVector(F.t,-1).addScaledVector(UP,.3); }
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

  if(mode==='boot'||mode==='loading'||mode==='events'||mode==='gauntlet'){
    attractStep(dt);
    if(mode==='boot'){ bootP=Math.min(1,(now-bootStart)/2200); $('#bootbar').style.width=(bootP*100)+'%'; if(bootP>=1&&!bootReady){ bootReady=true; $('#tap').classList.add('ready'); } }
    else if(mode==='loading'){ $('#ldbar').style.width=Math.min(100,modeT/3.6*100)+'%'; engine(player.v*.7,true); if(modeT>3.6) startRace(); }
    else engine(0,false);
    if(mode!=='race'&&mode!=='highlight') draw(RS);
  }
  else if(mode==='highlight'){
    highlightStep(dt);
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
      racers.forEach(r=>{ if(!r.out) poseRacer(r,0); }); traffic.forEach(o=>poseTraffic(o,0));
      engine(8+(inp.nitro?30:0)+Math.random()*3,true);
    } else {
      raceT+=sdt;
      racers.forEach(r=>{ if(r.out) return; if(r.finished&&!r.isP){ r.v*=.99; } stepRacer(r,sdt,r.isP&&!r.finished?inp:(r.isP?{steer:0,brake:true,nitro:false}:null)); });
      traffic.forEach(o=>stepTraffic(o,sdt));
      collide(); if(EV.knockout) koStep(sdt); racers.forEach(r=>{ if(!r.out) poseRacer(r,sdt); }); traffic.forEach(o=>poseTraffic(o,sdt));
      engine(player.v,true); screech(clamp(player.slip,0,1));
      if(!player.finished) tapeSample(sdt);
      if(player.finished){ if(finishHold===0){ $('#hMsg').textContent=EV.knockout?(player.out?'Out':'Winner'):'Finish'; sfx.beep(true); } finishHold+=dt; slowmo=lerp(slowmo,EV.knockout&&player.out?.8:.3,1-Math.exp(-dt*3)); if(finishHold>(EV.knockout&&player.out?3.4:2.2)) finishRace(); }
      for(const o of racers){ if(o===player||o.out) continue; const dd=o.dist-player.dist; if(dd>3&&dd<(player.fxOver>0&&player.draftRange?player.draftRange:18)&&Math.abs(o.x-player.x)<2.2){ player.nitro=Math.min(Math.max(1,player.nitro),player.nitro+.12*sdt); } }
    }
    if(mode==='race'){
      if(ghostCar&&ghostData){ const g=ghostState(raceT);
        if(g){ ghostCar.group.visible=true; poseAt(ghostCar.group,g.dist,g.x,g.yaw,0); ghostCar.wheels.forEach(w=>w.rotation.x+=player.v*sdt/.37);
          if(countdown<=0&&!player.finished){ const gap=(g.dist-player.dist)/Math.max(player.v,15); const el=$('#hGhost'); el.textContent=gap>0?`Ghost ahead ${gap.toFixed(1)}s`:`Ghost behind ${(-gap).toFixed(1)}s`; el.classList.toggle('ahead',gap<=0); } }
        else ghostCar.group.visible=false; }
      const focus=EV.knockout&&player.out?(koLeader()||player):player;
      updateFx(sdt,focus); chaseCam(dt,focus,player.out?null:inp);
      if(EV.knockout&&KO&&KO.bannerT>0){ KO.bannerT-=dt; if(KO.bannerT<=0) $('#hRound').className='round'; }
      const place=standings().indexOf(player)+1, nOn=EV.knockout?koActive().length:racers.length;
      $('#hPos').innerHTML=`${place}<small>/${nOn}</small>`;
      const danger=EV.knockout&&KO&&!KO.done&&!player.out&&countdown<=0&&place>=nOn-(koMod('double')?1:0);
      $('#hPos').classList.toggle('danger',!!danger);
      if(danger&&KO.warned!==KO.round){ KO.warned=KO.round; toast('You\'re in the knockout zone. Get out of last.'); }
      boardT-=dt; if(boardT<=0){ boardT=.25; tapeWatchStandings(); const st=standings(); $('#hBoard').innerHTML=st.map((r,i)=>`<li class="${r.isP?'me':''}${r.out?' out':''}"><b>${i+1}</b>${r.isP?'YOU':esc(r.def.tag)}${r.out?'':(EV.knockout&&KO&&!KO.done&&countdown<=0&&i>=nOn-(koMod('double')?2:1)?'<em class="m-ko">KO</em>':(!r.isP&&r.mood&&countdown<=0?`<em class="m-${r.mood.mood}">${MOOD_TAG[r.mood.mood]}</em>`:''))}</li>`).join(''); }
      if(EV.knockout&&KO){
        if(KO.done) $('#hLap').textContent='Tournament over';
        else if(koUsesSectors()) $('#hLap').textContent=`Round ${KO.round} / Sector ${KO.round} · ${nOn} left`;
        else $('#hLap').textContent=`Round ${KO.round} · ${nOn} left`;
        $('#hGhost').textContent=KO.done?'':KO.mod.name;
      }
      else $('#hLap').textContent=`Lap ${clamp(Math.floor(Math.max(0,player.dist)/TR.L)+1,1,laps())} of ${laps()}`;
      $('#hTime').textContent=fmt(raceT);
      $('#hSpd').textContent=Math.round(player.v*2.237);
      { const st=player.stage||0, el=$('#hStg'); if(el.dataset.s!==String(st)){ el.dataset.s=st; el.className='stg s'+st; [...el.children].forEach((c,i)=>c.classList.toggle('on',i<st)); $('#hSpd').className='s'+st; } }
      $('#hNos').style.width=Math.min(100,player.nitro*100)+'%'; $('#hNos').classList.toggle('over',player.nitro>1.001);
      const nt=nextTurn(player), tw=$('#hTurn');
      if(nt&&countdown<=0){ tw.className='turn on '+(nt.dir>0?'l':'r'); tw.innerHTML=`<i>${nt.dir>0?'‹‹‹':'›››'}</i><span>${nt.d>0?Math.round(nt.d)+' m':'now'}</span>`; } else tw.className='turn';
      const fx=[], FN=player.fxName||{}, FXL=[['fxLong','long','#b28cff'],['fxOver','over','#ffb020'],['fxSling','sling','#ff3b4a'],['fxShield','shield','#7dff9a'],['fxGrip','grip','#4f7bff'],['fxRegen','refill','#5fe6ff'],['fxNosMul','refill','#5fe6ff'],['towT','sling','#ff3b4a']];
      FXL.forEach(([k,n,c])=>{ if(player[k]>0) fx.push(`<b style="color:${c}">${esc((k==='fxNosMul'?'Supercharged':k==='towT'?'Tow':FN[n])||PU_TYPES[n].label)} ${Math.ceil(player[k])}s</b>`); });
      if(player.nitro>1.001) fx.push(`<b style="color:#ffe08a">Overflow ${Math.round(player.nitro*100)}%</b>`);
      $('#hFx').innerHTML=fx.join('');
      draw(RS);
    }
  }
}
requestAnimationFrame(loop);
})();
