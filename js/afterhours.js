/* AFTERHOURS — Issue 01. Street racing in three.js (r128, global build). */
window.AFTERHOURS_BOOT=function(){
'use strict';
const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;

/* ---------------- DATA ---------------- */
const CARS=[
 {id:'kage',name:'KAGE R',body:'kage',sculpt:'kage',lowPro:true,paint:0xe3e6e9,metal:.3,rough:.12,rim:0x0d0e10,caliper:0x16171a,wing:false,spokes:10,world:'ice',
  top:90,acc:22,grip:30,nitro:1.0,
  kick:'Specimen 01',loc:'Harbor Line',when:'Tunnel 7, 03:12',
  caption:'Found under a tarp on level B3. The owner never came back for it.',
  specs:'QUAD E-MOTOR / 1,940 HP / VENTURI TUNNELS / 0–60 IN 1.9S',
  rival:'Rival note: the white one takes turn four flat. Don\'t follow it in.',
  note:'brakes late.\nway too late.', notePos:{l:'54%',t:'36%'},
  cam:{p:[3.9,0.5,4.7],l:[0,0.62,0.2],roll:.16,fov:34}},
 {id:'noctis',sculpt:'noctis',name:'NOCTIS GT',body:'noctis',lowPro:true,paint:0x040508,metal:.55,rough:.08,rim:0xf4f6fa,chrome:true,caliper:0xd42020,wing:false,world:'flash',
  top:87,acc:20,grip:26,nitro:1.25,
  kick:'Street meet',loc:'Pier 9 Lot',when:'Thursday, 02:14',
  caption:'Shot at the Thursday meet. Chrome wheels, no plates, no story.',
  specs:'NAT-ASP V12 / 820 HP / REAR-DRIVE / STEEL CLUTCH',
  rival:'Rival note: heavy through the chicane. Save boost for the exits.',
  note:'slides like\nbutter.', notePos:{l:'8%',t:'38%'},
  cam:{p:[-4.6,1.0,3.1],l:[0,0.5,0.7],roll:-.06,fov:30}},
 {id:'vanta',sculpt:'vanta',name:'VANTA LM',body:'vanta',lowPro:true,paint:0xf2f5f8,metal:.45,rough:.22,rim:0x0e1012,caliper:0x19c2ff,wing:true,world:'ice',
  top:86,acc:24,grip:34,nitro:.9,
  kick:'Archive',loc:'North Cut',when:'Last run, 04:40',
  caption:'Built for a circuit that isn\'t there anymore. Now it lives in the tunnels.',
  specs:'HYBRID V6 / 960 HP / ACTIVE AERO / CARBON TUB',
  rival:'Rival note: it won\'t lose you in corners. Beat it on the straights.',
  note:'glued to\nthe road.', notePos:{l:'58%',t:'33%'},
  cam:{p:[2.5,2.9,4.7],l:[0,0.3,0.2],roll:-.2,fov:34}}
];
CARS.push(
 {id:'kern',sculpt:'kern',name:'KERN RS',body:'gt',lowPro:true,cutaway:true,paint:0x0b0d11,metal:.35,rough:.12,rim:0x8a5a2b,bronze:true,caliper:0xc9a23a,wing:true,world:'white',
  top:89,acc:24,grip:33,nitro:1.0,mass:1.05,
  kick:'Cutaway',loc:'Studio 4',when:'Rear quarter in X-ray',
  caption:'Shot with the back half see-through. The engine was always the story.',
  specs:'FLAT-SIX HYBRID / 880 HP / REAR-ENGINE / ELECTRIC FRONT AXLE',
  rival:'Rival note: Apex hates it. Same line, more torque out of the U-turns.',
  note:'look at the\nmotor.', notePos:{l:'8%',t:'35%'},
  cam:{p:[-5.6,1.6,-4.6],l:[0,.65,-.5],roll:.05,fov:32}},
 {id:'dune',sculpt:'dune',name:'DUNE-R',body:'suv',paint:0xd9dcdf,metal:.55,rough:.28,rim:0x8a5a2b,bronze:true,caliper:0x222428,wing:false,world:'desert',
  top:82,acc:25,grip:29,nitro:1.1,mass:1.7,
  kick:'Off the map',loc:'Salt Flat 3',when:'Last light, 19:48',
  caption:'Built to leave the tarmac. Tonight it doesn\'t have to.',
  specs:'TWIN-TURBO V8 HYBRID / 740 HP / 900 LB-FT / PORTAL AXLES',
  rival:'Rival note: Bruiser bounces off this one. Lean on him first.',
  note:'heavy. use\nthat.', notePos:{l:'56%',t:'32%'},
  cam:{p:[3.2,.9,5.4],l:[0,1.0,.4],roll:-.08,fov:34}},
 {id:'sovereign',sculpt:'sovereign',name:'SOVEREIGN',body:'sedan',lowPro:true,paint:0x040405,metal:.45,rough:.08,rim:0x0b0b0c,caliper:0x1a1a1a,wing:false,spokes:14,world:'flash',
  top:86,acc:21,grip:28,nitro:1.25,mass:1.5,
  kick:'Driveway',loc:'Old York Rd',when:'Sunday, 07:10',
  caption:'Chauffeur car from the outside. Nobody rides in the back.',
  specs:'TWIN-TURBO V12 / 790 HP / 830 LB-FT / WIDEBODY KIT',
  rival:'Rival note: The Wall can\'t hold you off in this. Push through.',
  note:'quiet until\nit isn\'t.', notePos:{l:'8%',t:'36%'},
  cam:{p:[3.9,.95,5.4],l:[0,.7,.3],roll:-.06,fov:32}},
 {id:'granfour',sculpt:'granfour',name:'GRAN FOUR',body:'granfour',lowPro:true,paint:0x333431,metal:.3,rough:.42,matte:true,rim:0x2a2622,rimLip:0x1c1a18,caliper:0xffc21a,wing:false,accent:0xffc21a,world:'ice',
  top:89,acc:22,grip:30,nitro:1.0,mass:1.35,
  kick:'Four doors',loc:'Forest Lot',when:'After rain, 05:30',
  caption:'Four doors, four seats, one driver who actually matters.',
  specs:'TWIN-TURBO V8 / 690 HP / 680 LB-FT / REAR-AXLE STEER',
  rival:'Rival note: Leech will sit behind you all race. Brake-check nothing.',
  note:'matte. don\'t\nwash it.', notePos:{l:'55%',t:'34%'},
  cam:{p:[4.8,.8,3.4],l:[0,.6,.2],roll:.1,fov:32}}
);
CARS.push(
 {id:'bell',sculpt:'bell',name:'BELL 76',body:'bell',lowPro:true,paint:0x14306b,metal:.7,rough:.16,rim:0x16181b,caliper:0xd8b04a,wing:true,accent:0xd8b04a,spokes:10,world:'ice',
  top:94,acc:21,grip:27,nitro:1.3,mass:1.2,
  kick:'Special issue',loc:'Independence Mall',when:'July 4th, 23:59',
  caption:'Blue and gold, built for exactly one thing: the longest straight in the city.',
  specs:'QUAD-TURBO W16 / 1,300 HP / 0–60 IN 2.4S / LONGTAIL AERO',
  rival:'Rival note: The Closer can\'t match it flat out. Just don\'t give it corners.',
  note:'bridge\nweapon.', notePos:{l:'56%',t:'34%'},
  cam:{p:[4.4,1.0,-3.9],l:[0,.55,-.2],roll:.08,fov:32}},
 {id:'passyunk',sculpt:'passyunk',name:'PASSYUNK R',body:'hatch',lowPro:true,paint:0xb3121c,metal:.5,rough:.22,rim:0x17181b,rimLip:0x0e0f11,caliper:0xffc21a,wing:false,world:'flash',
  top:84,acc:26,grip:35,nitro:1.05,mass:.85,
  kick:'Corner shop',loc:'East Passyunk Ave',when:'Friday, 01:40',
  caption:'Double-parked outside the cheesesteak window. Fits through gaps nothing else will.',
  specs:'2.0L TURBO I4 / 420 HP / FRONT DIFF LOCK / 2,650 LB',
  rival:'Rival note: Bruiser will try to push you around. Stay out of his lane.',
  note:'lives in\nthe corners.', notePos:{l:'60%',t:'36%'},
  cam:{p:[-4.2,1.0,3.4],l:[0,.6,.4],roll:-.06,fov:32}},
 {id:'richmond',sculpt:'richmond',name:'RICHMOND',body:'truck',paint:0x1d2127,metal:.4,rough:.4,rim:0x0d0e10,caliper:0xff5a1f,wing:false,world:'desert',
  top:83,acc:24,grip:28,nitro:1.15,mass:2.0,
  kick:'Work truck',loc:'Port Richmond',when:'Shift change, 05:00',
  caption:'Hauls pallets by day. By night it hauls everyone else out of its way.',
  specs:'SUPERCHARGED V8 / 710 HP / 650 LB-FT / 5,600 LB',
  rival:'Rival note: nothing moves this. Lean on The Wall and watch him fold.',
  note:'nothing\nmoves it.', notePos:{l:'55%',t:'33%'},
  cam:{p:[4.6,1.6,6.4],l:[0,1.0,.3],roll:-.07,fov:34}}
);
CARS.push(
 {id:'zenkai',sculpt:'zenkai',name:'ZENKAI 37',body:'coupe',lowPro:true,paint:0xc0121c,metal:.6,rough:.14,rim:0x111214,caliper:0xd42020,wing:true,widebody:true,spokes:3,world:'white',
  top:90,acc:24,grip:32,nitro:1.15,mass:1.1,
  kick:'Loading dock',loc:'Bay 17',when:'Saturday, 06:10',
  caption:'Widebody, bolted wing, six-spoke wheels. Shot against the loading doors at first light.',
  specs:'3.7L TWIN-TURBO V6 / 640 HP / WIDEBODY / 6-SPEED MANUAL',
  rival:'Rival note: Leech loves the wake off that wing. Break the tow early.',
  note:'wide. low.\nloud.', notePos:{l:'72%',t:'34%'},
  cam:{p:[4.6,.8,4.2],l:[0,.5,.3],roll:-.05,fov:32}},
 {id:'split',sculpt:'split',name:'SPLIT 63',body:'classic',lowPro:true,paint:0x050507,metal:.5,rough:.06,rim:0x1c1e22,rimLip:0x1a1b1e,caliper:0xd42020,wing:false,spokes:5,world:'flash',
  top:88,acc:23,grip:29,nitro:1.2,mass:1.25,
  kick:'Restomod',loc:'Chestnut Hill',when:'Sunday, 08:15',
  caption:'Sixty-year-old lines on a modern chassis. The split rear window is the whole point.',
  specs:'6.2L SUPERCHARGED V8 / 755 HP / SIDE-EXIT PIPES / 7-SPEED MANUAL',
  rival:'Rival note: The Closer hates getting passed by something this old.',
  note:'look at\nthe split.', notePos:{l:'58%',t:'34%'},
  cam:{p:[-4.6,.9,4.0],l:[0,.5,.4],roll:.05,fov:32}}
);
CARS.push(
 {id:'overload',name:'OVERLOAD 3K',body:'hyper',hyper:true,sculpt:'overload',paint:0x10131a,metal:.75,rough:.2,rim:0x0b0b0c,caliper:0x2fe6ff,wing:true,livery:0x2fe6ff,accent:0x2fe6ff,spokes:7,world:'ice',
  top:100,acc:33,grip:33,nitro:1.35,mass:1.25,
  kick:'Prototype',loc:'Navy Yard, Dry Dock 1',when:'Unregistered, 02:59',
  caption:'Three thousand horsepower and no plates. Nobody at the Navy Yard will say who brought it.',
  specs:'QUAD E-MOTOR / 3,000 HP / 2,900 LB-FT / 0–60 IN 1.4S',
  rival:'Rival note: every rival wants this one. Expect a target on your back.',
  note:'don\'t\nfloor it.', notePos:{l:'60%',t:'34%'}, plate:'3000HP',
  cam:{p:[4.8,.9,-4.2],l:[0,.45,-.2],roll:.08,fov:30}}
);
CARS.push(
 {id:'wisp',sculpt:'wisp',name:'WISP 07',body:'wisp',lowPro:false,paint:0x050506,metal:.55,rough:.08,rim:0x2c2a33,rimLip:0x19181d,caliper:0xa8ff1a,wing:true,accent:0xa8ff1a,spokes:5,world:'wisp',
  top:97,acc:39,grip:29,nitro:1.55,mass:.52,nitroRegenMul:.28,nosVmax:1.42,nosAccMul:2.05,nosDrainMul:1.18,
  kick:'Carbon tub',loc:'South Street, Loading Bay 2',when:'Tuesday, 01:08',
  caption:'Weighed on a freight scale. The clerk thought the scale was broken.',
  specs:'TRIPLE E-MOTOR / 920 HP / 1,980 LB / 0–60 IN 1.8S',
  rival:'Rival note: it launches like a railgun. Boost takes forever to come back.',
  note:'feather.\nviolent.', notePos:{l:'62%',t:'35%'},
  cam:{p:[-3.7,.58,4.3],l:[.15,.62,.45],roll:-.035,fov:36}},
 {id:'stratos',sculpt:'stratos',name:'STRATOS V',body:'stratos',lowPro:true,paint:0xff5c12,metal:.72,rough:.12,rim:0x101114,caliper:0xffd23b,wing:true,livery:0xffd23b,accent:0xffd23b,spokes:5,world:'ice',
  top:102,acc:29,grip:35,nitro:1.42,mass:1.08,nosVmax:1.28,
  kick:'Wind-tunnel',loc:'Delaware Ave Overpass',when:'Pre-dawn, 04:55',
  caption:'Built for sustained flat-out. The wing is not for show.',
  specs:'HYBRID V8 + E-AXLE / 1,180 HP / ACTIVE AERO / 0–60 IN 2.0S',
  rival:'Rival note: Apex can\'t match it on the long pulls. Don\'t fight it in the esses.',
  note:'hold\nflat.', notePos:{l:'58%',t:'33%'},
  cam:{p:[4.2,1.05,-4.0],l:[0,.5,-.15],roll:.07,fov:31}}
);
CARS.push(
 {id:'volcano',name:'VOLCANO P1',body:'p1',p1:true,sculpt:'p1',lowPro:true,paint:0xffc20e,metal:.55,rough:.12,rim:0xf2f5f8,chrome:true,caliper:0xd42020,wing:true,spokes:10,world:'flash',plate:'P1 GTR',
  top:112,acc:42,grip:34,nitro:1.52,mass:.46,nosVmax:1.4,nosAccMul:2.2,
  kick:'Hybrid hypercar',loc:'Columbus Blvd, Pier 40',when:'Saturday, 03:13',
  caption:'Volcano yellow over bare carbon, a visor canopy and a swan-neck wing. Modeled in Blender, bolted to the archive, and it still pulls.',
  specs:'3.8L TWIN-TURBO V8 + E-MOTOR / 1,350 HP / 0–60 IN 1.5S / THE FASTEST HYBRID IN THE ARCHIVE',
  rival:'Rival note: only the Zephyr is faster in a straight line. Beat this one in the corners or not at all.',
  note:'fastest\nhybrid here.', notePos:{l:'60%',t:'34%'},
  cam:{p:[4.4,1.0,-3.9],l:[0,.5,-.2],roll:.07,fov:31}}
);
CARS.push(
 {id:'zephyr',sculpt:'zephyr',name:'ZEPHYR 960',body:'zephyr',lowPro:true,paint:0x14943c,metal:.58,rough:.14,rim:0x101416,caliper:0x14e0c8,wing:true,accent:0x14e0c8,livery:0x14e0c8,spokes:5,world:'ice',plate:'960 MPH',
  top:429,acc:88,accCurve:1.35,grip:31,nitro:1.45,mass:.22,nitroRegenMul:.08,nosVmax:1,nosAccMul:2.6,vcap:429,
  kick:'Featherweight',loc:'Navy Yard, Slip 4',when:'Unregistered, 01:11',
  caption:'Green over teal, weighed like a bicycle and geared for nine hundred and sixty. The boost comes back when it feels like it.',
  specs:'TWIN E-MOTOR / 1,640 HP / 1,180 LB / 0–60 IN 1.1S / 960 MPH',
  rival:'Rival note: it is gone before the lights change. Do not bother chasing the boost light.',
  note:'light.\nthen gone.', notePos:{l:'60%',t:'34%'},
  cam:{p:[4.6,.95,-4.0],l:[0,.42,-.2],roll:.06,fov:31}}
);
CARS.push(
 {id:'hikari',sculpt:'hikari',name:'HIKARI 91',body:'hikari',lowPro:true,paint:0x3a0ca6,metal:.25,rough:.3,rim:0x3b3e45,rimLip:0x1c1d21,caliper:0xd42020,wing:true,widebody:true,world:'neon',plate:'HIKARI',
  top:110,acc:38,grip:38,nitro:1.45,mass:.9,
  kick:'Drift build',loc:'Frankford Ave, Fishtown',when:'After the rain, 01:52',
  caption:'Satin violet, lime slashes, lamps flipped up. It went sideways past every bar on the Avenue and nobody saw the plate.',
  specs:'2.4L STROKED TURBO I4 / 1,020 HP / WIDEBODY / 0–60 IN 2.0S / THE BEST HANDLING IN THE ARCHIVE',
  rival:'Rival note: it carries more speed through a corner than anything here, and it keeps most of it on the straights.',
  note:'lamps up.\nfull lock.', notePos:{l:'60%',t:'34%'},
  cam:{p:[4.5,.85,4.1],l:[0,.5,.3],roll:-.05,fov:31}}
);
CARS.push(
 {id:'lumen',sculpt:'lumen',name:'LUMEN SP',body:'lumen',lowPro:true,paint:0x1f5f8f,metal:.5,rough:.14,rim:0x121416,caliper:0xff6080,wing:false,world:'ice',
  top:91,acc:26,grip:31,nitro:1.12,mass:.92,
  kick:'Garage find',loc:'Spring Garden St',when:'Blue hour, 05:22',
  caption:'Top down in a parking garage on Spring Garden. Keys still in the ignition.',
  specs:'3.0L TWIN-TURBO I6 / 520 HP / ROADSTER / 7-SPEED DUAL-CLUTCH',
  rival:'Rival note: it rotates faster than it looks. Don\'t chase it through the esses.',
  note:'top down.\nno story.', notePos:{l:'58%',t:'34%'},
  cam:{p:[-4.2,.95,4.0],l:[0,.55,.35],roll:-.05,fov:32}},
 {id:'brigline',sculpt:'brigline',name:'BRIG LINE W',body:'brigline',lowPro:true,paint:0x1d3a2a,metal:.45,rough:.2,rim:0x1a1c20,caliper:0xc8a060,wing:false,accent:0xc8a060,world:'ice',
  top:88,acc:24,grip:30,nitro:1.08,mass:1.58,
  kick:'Estate issue',loc:'Forest Hills',when:'After rain, 05:45',
  caption:'Four seats, full carpet in the back. Still faster than your excuses.',
  specs:'3.0L TWIN-TURBO I6 / 580 HP / SHOOTING BRAKE / AWD',
  rival:'Rival note: Bruiser will try to move you. He won\'t.',
  note:'matte wagon.\nquiet power.', notePos:{l:'56%',t:'33%'},
  cam:{p:[4.6,.85,3.6],l:[0,.65,.25],roll:.08,fov:32}},
 {id:'pulse2',sculpt:'pulse2',name:'PULSE 2',body:'pulse2',lowPro:true,paint:0x181e24,metal:.5,rough:.12,rim:0x0e1012,caliper:0x5fe6c8,wing:false,accent:0x5fe6c8,world:'neon',
  top:90,acc:26,grip:29,nitro:1.22,mass:1.02,
  kick:'Wall charge',loc:'Neon Core, Data Port',when:'Tuesday, 02:30',
  caption:'Charged on a laundromat outlet. Range unknown. Attitude sufficient.',
  specs:'DUAL E-MOTOR / 640 HP / 62 KWH / SINGLE-SPEED',
  rival:'Rival note: Leech loves drafting this one. Break the tow on the straight.',
  note:'quiet zap.\nloud exit.', notePos:{l:'60%',t:'35%'},
  cam:{p:[3.8,.7,4.4],l:[0,.5,.3],roll:-.06,fov:33}},
 {id:'vandal',sculpt:'vandal',name:'VANDAL SS',body:'muscle',lowPro:true,paint:0x24103c,metal:.6,rough:.1,rim:0xf0f2f5,chrome:true,caliper:0xd42020,wing:false,widebody:true,spokes:5,world:'flash',
  top:94,acc:23,grip:27,nitro:1.32,mass:1.28,
  kick:'Back-alley',loc:'Kensington Ave',when:'Friday, 00:48',
  caption:'SS badges are fake. The blower whine is not.',
  specs:'6.2L SUPERCHARGED V8 / 820 HP / WIDEBODY / 6-SPEED MANUAL',
  rival:'Rival note: Wildcard runs the same playbook. Out-brake it or get passed.',
  note:'fake badges.\nreal pull.', notePos:{l:'58%',t:'34%'},
  cam:{p:[4.5,.88,4.4],l:[0,.58,.35],roll:-.05,fov:32}},
 {id:'needle',sculpt:'needle',name:'NEEDLE MK1',body:'needle',lowPro:true,paint:0x2a7fb5,metal:.4,rough:.18,rim:0x17181b,rimLip:0x0e0f11,caliper:0xff5a1f,wing:false,world:'flash',
  top:86,acc:28,grip:33,nitro:1.05,mass:.8,
  kick:'Parallel park',loc:'Dockside, Pier 12',when:'Wednesday, 01:15',
  caption:'Parallel-parked across two meters. Still made the start.',
  specs:'1.6L TURBO I4 / 310 HP / KEI-WIDE / 2,180 LB',
  rival:'Rival note: Apex hates getting shown up by something this small.',
  note:'tiny.\nsharp.', notePos:{l:'62%',t:'36%'},
  cam:{p:[-3.8,.75,3.2],l:[0,.58,.45],roll:-.04,fov:34}}
);
// four outlaw cars: 500 / 600 / 700 / 800 mph, each unlocked its own way (see stepRacer). Player-only, never rivals.
CARS.push(
 {id:'hellbound',sculpt:'hellbound',name:'HELLBOUND 717',body:'muscle',outlaw:true,paint:0xb5121b,metal:.55,rough:.14,rim:0x0b0b0c,caliper:0xd42020,wing:false,widebody:true,spokes:5,world:'flash',
  top:224,acc:42,grip:25,nitro:0,mass:1.5,noBoost:true,vcap:224,plate:'HELLBND',
  kick:'Outlaw 01',loc:'Frankford Ave, under the El',when:'Friday, 00:17',
  caption:'Two black stripes, one supercharger whine you can hear from Kensington. It will not take help from anyone.',
  specs:'SUPERCHARGED 7.0L V8 / 2,400 HP / WIDEBODY / 500 MPH',
  rival:'Rival note: nothing on the grid can hold it on a straight. Nothing on the grid has to, in the turns.',
  note:'no boost.\njust hell.', notePos:{l:'58%',t:'34%'},
  cam:{p:[4.4,.9,4.6],l:[0,.6,.3],roll:-.05,fov:32}},
 {id:'tempesta',sculpt:'tempesta',name:'TEMPESTA SV',body:'tempesta',outlaw:true,paint:0xc0141c,metal:.6,rough:.12,rim:0x141518,caliper:0xd8b04a,wing:true,accent:0xd8b04a,spokes:10,world:'white',
  top:103,acc:32,grip:33,nitro:1.3,mass:1.1,sigTop:268,vcap:270,
  kick:'Outlaw 02',loc:'Delaware Ave, Pier 70',when:'Storm warning, 02:40',
  caption:'Red over black, a Y of light at every corner. Most nights it drives like any other hypercar. Most nights.',
  specs:'6.5L V12 + THREE E-MOTORS / 1,100 HP / Y-LIGHT AERO / 600 MPH',
  rival:'Rival note: watch for the red gem nobody else can touch.',
  note:'wait for\nthe storm.', notePos:{l:'60%',t:'34%'},
  cam:{p:[4.5,.95,4.0],l:[0,.45,.3],roll:-.06,fov:31}},
 {id:'mantis',sculpt:'mantis',name:'MANTIS LT',body:'mantis',outlaw:true,paint:0x76d31e,metal:.5,rough:.14,rim:0x0d0e10,caliper:0x76d31e,wing:false,spokes:10,world:'ice',
  top:99,acc:31,grip:34,nitro:1.2,mass:.95,lastTop:313,vcap:315,
  kick:'Outlaw 03',loc:'Schuylkill Banks',when:'Dew on the glass, 05:05',
  caption:'Mantis green, longtail, air-brake up. It seems perfectly happy at the back of the pack. For a while.',
  specs:'4.0L TWIN-TURBO V8 / 890 HP / LONGTAIL AIR-BRAKE / 700 MPH',
  rival:'Rival note: never leave it behind you for long.',
  note:'patient.\nthen not.', notePos:{l:'58%',t:'33%'},
  cam:{p:[-4.4,.95,3.9],l:[0,.5,.3],roll:.05,fov:31}},
 {id:'autobahn',sculpt:'autobahn',name:'AUTOBAHN 63',body:'autobahn',outlaw:true,paint:0x0a2a8c,metal:.8,rough:.1,rim:0xf2f4f7,chrome:true,lowPro:true,caliper:0xd4121c,nosColor:0x6f9dff,wing:false,spokes:10,world:'wisp',
  top:96,acc:27,grip:30,nitro:1.15,mass:1.4,cleanTop:358,vcap:360,
  kick:'Outlaw 04',loc:'I-76, Blue Route split',when:'Unrestricted, 03:30',
  caption:'Four doors, a roof that never stops falling and a tail lit like a blade. Deep sapphire, chrome split spokes, red calipers. It gets faster the longer you leave it alone.',
  specs:'4.0L TWIN-TURBO V8 + E-AXLE / 830 HP / FOUR DOORS / 800 MPH',
  rival:'Rival note: smooth is fast. Smoother is faster. Smoothest is something else.',
  note:'don\'t touch\nanything.', notePos:{l:'58%',t:'34%'},
  cam:{p:[-4.1,.62,4.6],l:[.15,.62,.4],roll:-.035,fov:34}}
);
// full spec sheets (slide-up panel)
const SHEETS={
 kage:{engine:'Four e-motors, carbon tub, 70 kWh pack',power:'1,940 hp',torque:'1,210 lb-ft',zero:'1.9 s',vmax:'217 mph',weight:'3,700 lb',drive:'All-wheel drive, torque vectoring',gearbox:'Single-speed, one per axle'},
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
 granfour:{engine:'4.0L twin-turbo V8',power:'690 hp',torque:'680 lb-ft',zero:'3.1 s',vmax:'199 mph',weight:'4,400 lb',drive:'All-wheel drive',gearbox:'9-speed wet-clutch'},
 wisp:{engine:'Triple e-motors, carbon tub',power:'920 hp',torque:'780 lb-ft',zero:'1.8 s',vmax:'228 mph',weight:'1,980 lb',drive:'All-wheel drive',gearbox:'Single-speed'},
 volcano:{engine:'3.8L twin-turbo V8 + e-motor (IPAS)',power:'1,350 hp',torque:'1,090 lb-ft',zero:'1.5 s',vmax:'290 mph',weight:'2,425 lb',drive:'Rear-wheel drive',gearbox:'7-speed dual-clutch'},
 hellbound:{engine:'7.0L supercharged V8',power:'2,400 hp',torque:'1,900 lb-ft',zero:'2.6 s',vmax:'500 mph',weight:'4,900 lb',drive:'Rear-wheel drive',gearbox:'8-speed automatic'},
 tempesta:{engine:'6.5L V12 + three e-motors',power:'1,100 hp',torque:'800 lb-ft',zero:'2.3 s',vmax:'600 mph',weight:'3,900 lb',drive:'All-wheel drive',gearbox:'8-speed dual-clutch'},
 mantis:{engine:'4.0L twin-turbo V8',power:'890 hp',torque:'700 lb-ft',zero:'2.6 s',vmax:'700 mph',weight:'2,950 lb',drive:'Rear-wheel drive',gearbox:'7-speed dual-clutch'},
 autobahn:{engine:'4.0L twin-turbo V8 + rear e-axle',power:'830 hp',torque:'1,030 lb-ft',zero:'2.9 s',vmax:'800 mph',weight:'4,650 lb',drive:'All-wheel drive',gearbox:'9-speed wet-clutch'},
 stratos:{engine:'4.0L twin-turbo V8 + rear e-axle',power:'1,180 hp',torque:'920 lb-ft',zero:'2.0 s',vmax:'248 mph',weight:'3,050 lb',drive:'All-wheel drive',gearbox:'8-speed dual-clutch'},
 hikari:{engine:'2.4L stroked turbo inline-four, built',power:'1,020 hp',torque:'760 lb-ft',zero:'2.0 s',vmax:'286 mph',weight:'2,480 lb',drive:'Rear-wheel drive, welded diff',gearbox:'6-speed sequential'},
 zephyr:{engine:'Twin axial-flux e-motors, carbon monocoque',power:'1,640 hp',torque:'1,280 lb-ft',zero:'1.1 s',vmax:'960 mph',weight:'1,180 lb',drive:'All-wheel drive, torque vectoring',gearbox:'Single-speed'},
 lumen:{engine:'3.0L twin-turbo inline-six',power:'520 hp',torque:'480 lb-ft',zero:'3.2 s',vmax:'198 mph',weight:'3,150 lb',drive:'Rear-wheel drive',gearbox:'7-speed dual-clutch'},
 brigline:{engine:'3.0L twin-turbo inline-six',power:'580 hp',torque:'520 lb-ft',zero:'3.4 s',vmax:'184 mph',weight:'4,200 lb',drive:'All-wheel drive',gearbox:'8-speed automatic'},
 pulse2:{engine:'Dual e-motors, 62 kWh pack',power:'640 hp',torque:'580 lb-ft',zero:'3.0 s',vmax:'202 mph',weight:'3,450 lb',drive:'All-wheel drive',gearbox:'Single-speed'},
 vandal:{engine:'6.2L supercharged V8',power:'820 hp',torque:'780 lb-ft',zero:'2.9 s',vmax:'212 mph',weight:'3,680 lb',drive:'Rear-wheel drive',gearbox:'6-speed manual'},
 needle:{engine:'1.6L turbo inline-four',power:'310 hp',torque:'280 lb-ft',zero:'3.8 s',vmax:'168 mph',weight:'2,180 lb',drive:'Front-wheel drive',gearbox:'6-speed manual'}
};
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
  P:{line:.8, offScale:.8, wobble:2.2,risk:1.16,rubber:.8, gain:.32, mass:1,   start:-1,  nitro:'burst',mistakeRate:.2,mistakeStrength:.8}},
 /* Four more for the big grids (Gauntlet, full-grid events), so twelve cars don't repeat the same six drivers:
   GRUDGE    remembers whoever passed it and hunts that car down (Burnout Revenge)
   HUNTER    always goes after the race leader (Mario Kart blue-shell targeting)
   RABBIT    bolts early to build a gap, then fades so the pack can reel it in (Mario Kart / Burnout front-runner)
   WEAVER    threads the clearest lane through traffic and slower cars (Midnight Club) */
 {id:'grudge',tag:'GRUDGE',    car:'PAYBACK GT',color:'#ff8a3d',paint:0x6b2a0c,metal:.5,rough:.4, rim:0x0d0e10,caliper:0xff8a3d,wing:true, top:88,acc:24,grip:29,nitro:1.05,
  P:{line:.6, offScale:.5, wobble:.3, risk:1.04,rubber:1.0,gain:.42, mass:1.5, start:.15, nitro:'eager'}},
 {id:'hunter',tag:'HUNTER',    car:'LOCKON',    color:'#ff4fa3',paint:0x4a1030,metal:.7,rough:.3, rim:0x15101a,caliper:0xff4fa3,wing:false,top:91,acc:22,grip:31,nitro:1.15,
  P:{line:.9, offScale:.25,wobble:.1, risk:1.0, rubber:1.3,gain:.34, mass:1.1, start:.2,  nitro:'pass'}},
 {id:'rabbit',tag:'RABBIT',    car:'JACKRABBIT',color:'#a6ff4f',paint:0x3f6b1a,metal:.5,rough:.35,rim:0x101410,caliper:0xa6ff4f,wing:false,top:90,acc:25,grip:30,nitro:1.0,
  P:{line:.85,offScale:.2, wobble:.1, risk:1.02,rubber:.3, gain:.32, mass:.9,  start:.02, nitro:'eager'}},
 {id:'weaver',tag:'WEAVER',    car:'NEEDLE',    color:'#c7a0ff',paint:0x3a2a5c,metal:.8,rough:.25,rim:0x14111c,caliper:0xc7a0ff,wing:false,top:89,acc:23,grip:33,nitro:1.0,
  P:{line:.8, offScale:.3, wobble:.15,risk:1.05,rubber:.9, gain:.5,  mass:.9,  start:.1,  nitro:'exit'}}
].map(r=>Object.assign(r,{name:r.car}));
{ const SEEK={apex:.35,wall:.45,leech:.85,bruiser:.55,closer:.5,wild:.95,grudge:.7,hunter:.75,rabbit:.4,weaver:.8}; RIVALS.forEach(r=>r.P.seek=SEEK[r.id]); }
/* Per-event machine picks + track bias (grip tracks vs boulevard straights). */
const EVENT_CAR_BIAS={
 tunnel:{gripW:1.22,topW:.94,nitroW:1.05},
 blvd:{gripW:.9,topW:1.12,nitroW:1.08},
 bridge:{gripW:.95,topW:1.15,nitroW:1.12},
 grand:{gripW:1.02,topW:1.1,nitroW:1.12},
 dockside:{gripW:1.08,topW:1.05,nitroW:1.06},
 skyline:{gripW:1.05,topW:1.08,nitroW:1.1},
 midnight:{gripW:1,topW:1.12,nitroW:1.14},
 philly:{gripW:1.02,topW:1.16,nitroW:1.12},
 mtairy:{gripW:1.12,topW:.96,nitroW:1.04},
 gamenight:{gripW:1.06,topW:1.06,nitroW:1.1},
 manayunk:{gripW:1.08,topW:1.02,nitroW:1.08},
 el:{gripW:1.14,topW:.98,nitroW:1.04},
 firstlight:{gripW:1,topW:1.12,nitroW:1.12},
 neoncore:{gripW:1.1,topW:1.06,nitroW:1.12},
 calder:{gripW:1.04,topW:1.12,nitroW:1.14}
};
const RIVAL_CAR_PREF={
 apex:{gripW:1.18,topW:.98,ids:['vanta','kage','kern','granfour','passyunk','needle','lumen']},
 wall:{gripW:1.05,topW:1,ids:['granfour','dune','sovereign','vanta','brigline']},
 leech:{gripW:.95,topW:1.05,nitroW:1.15,ids:['zenkai','noctis','sovereign','kage','vanta','pulse2']},
 bruiser:{gripW:.92,topW:1.02,ids:['richmond','dune','sovereign','granfour','noctis','brigline']},
 closer:{gripW:1.05,topW:1.08,nitroW:1.2,ids:['bell','noctis','vanta','kern','sovereign','stratos','vandal']},
 wild:{gripW:.88,topW:1.14,nitroW:1.25,ids:['split','noctis','dune','kage','granfour','wisp','vandal']},
 grudge:{gripW:.95,topW:1,nitroW:1.05,ids:['richmond','dune','sovereign','granfour','brigline']},
 hunter:{gripW:1,topW:1.1,nitroW:1.15,ids:['noctis','vanta','kern','stratos','vandal']},
 rabbit:{gripW:.95,topW:1.12,nitroW:1.1,ids:['zenkai','split','wisp','bell','lumen']},
 weaver:{gripW:1.15,topW:1,nitroW:1,ids:['kage','passyunk','granfour','vanta','needle']}
};
let RIVAL_BOSS=false;
function rivalChassisEligible(c){ if(c.outlaw) return false; if((c.id==='overload'||c.id==='volcano'||c.id==='zephyr'||c.id==='hikari')&&!RIVAL_BOSS) return false; return true; }
function buildRivalForEvent(rival,eventId,taken){
 const eb=EVENT_CAR_BIAS[eventId]||EVENT_CAR_BIAS.tunnel, rp=RIVAL_CAR_PREF[rival.id]||{};
 let best=null, bestSc=-1e9;
 for(const c of CARS){
  if(taken.includes(c.id)) continue;
  if(!rivalChassisEligible(c)) continue;
  const pref=rp.ids&&rp.ids.includes(c.id)?9:0;
  const sc=c.grip*(eb.gripW||1)*(rp.gripW||1)+c.top*(eb.topW||1)*(rp.topW||1)+c.nitro*18*(eb.nitroW||1)*(rp.nitroW||1)+pref+Math.random()*4;
  if(sc>bestSc){ bestSc=sc; best=c; }
 }
 const base=best||CARS.find(c=>!taken.includes(c.id)&&rivalChassisEligible(c))||CARS.find(rivalChassisEligible)||CARS[0];
 taken.push(base.id);
 return Object.assign({},base,{id:rival.id,chassisId:base.id,tag:rival.tag,color:rival.color,car:base.name,P:rival.P,mass:(rival.P.mass||1)*(base.mass||1),rivalNote:base.rival});
}
function eventAiBias(){ return EV.open?{straight:1.06,tight:.93,line:.85}:{straight:.97,tight:1.06,line:1.12}; }
function nearestChaser(r,maxG){
 let best=null,bd=maxG||34;
 for(const o of racers){ if(o===r||o.finished||o.out||(TAG&&o.team===r.team)) continue; const gap=r.dist-o.dist; if(gap>1.5&&gap<bd){ bd=gap; best=o; } }
 return best;
}
function nearestAlongside(r,span){
 let best=null,bd=span||9;
 for(const o of racers){ if(o===r||o.finished||o.out||(TAG&&o.team===r.team)) continue; const gap=Math.abs(r.dist-o.dist); if(gap<bd){ bd=gap; best=o; } }
 return best;
}
/* The race leader as seen from r (null if r is already ahead of everyone): the HUNTER's target. */
function leaderOf(r){
 let best=null;
 for(const o of racers){ if(o===r||o.finished||o.out||(TAG&&o.team===r.team)) continue; if(!best||o.dist>best.dist) best=o; }
 return best&&best.dist>r.dist?best:null;
}
/* WEAVER lane choice: the lane with the most open road ahead, with a small pull toward where it already is.
   Duplicated in logic.mjs for the unit tests. */
function pickClearLane(lanes,obs,s0,L,span,x0){
 let best=lanes[0];
 let bestScore=-1e9;
 for(let i=0;i<lanes.length;i++){
  const lx=lanes[i];
  let clear=span;
  for(let j=0;j<obs.length;j++){
   let dd=obs[j].dist-s0;
   dd=((dd%L)+L)%L;
   if(dd>3&&dd<clear&&Math.abs(obs[j].x-lx)<2.3) clear=dd;
  }
  const score=clear-Math.abs(lx-x0)*1.5;
  if(score>bestScore){ bestScore=score; best=lx; }
 }
 return best;
}
/* Power-ups that go on every map automatically (same idea as the Tempest gem): [type, fraction of the lap, lane x]. */
const NEW_PU_SPOTS=[['jam',.16,-2.4],['slick',.36,2.4],['payback',.6,-2.4],['ghost',.8,2.4]];
function autoPickupSpots(list,L){
 const out=list.slice();
 for(let i=0;i<NEW_PU_SPOTS.length;i++){
  const type=NEW_PU_SPOTS[i][0];
  if(out.some(it=>it[2]===type)) continue;
  let s=(L*NEW_PU_SPOTS[i][1])%L;
  for(let k=0;k<8;k++){
   const crowded=out.some(it=>{ const d=Math.abs(it[0]-s); return Math.min(d,L-d)<45; });
   if(!crowded) break;
   s=(s+50)%L;
  }
  out.push([s,NEW_PU_SPOTS[i][2],type]);
 }
 return out;
}
function scorePickup(r,p,P,s0,L){
 if(p.cd>0) return -999;
 if(p.carId&&(r.def.chassisId||r.def.id)!==p.carId) return -999;
 if(p.lastOnly||p.lastTwo) return -999;
 let dd=p.s-s0; if(dd<0) dd+=L;
 if(dd<5||dd>72) return -999;
 const lat=Math.abs(p.x-r.x), det=lat*1.35+dd*.045;
 let val=P.seek*12;
 if(p.type==='refill'&&r.nitro>.82) val-=9;
 if(p.type==='long'&&(P.nitro==='pass'||P.nitro==='reserve')) val+=2.5;
 if(p.type==='over'&&(P.nitro==='eager'||P.nitro==='burst')) val+=3;
 if(r.nitro<.35) val+=4;
 if(p.type==='desperate'||p.type==='echoboost') val+=14;
 if(p.type==='wispflux'||p.type==='stratossurge'||p.type==='tempest') val+=6;
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
 wild:{zone:42,late:.82,brakeMax:.72,carry:1.12,lineIn:1.28,vBonus:1.1,style:'late'},
 grudge:{zone:76,late:.34,brakeMax:.62,carry:.95,lineIn:.75,vBonus:.99,style:'heavy'},
 hunter:{zone:84,late:.3,brakeMax:.5,carry:1.04,lineIn:1.05,vBonus:1.04,style:'smooth'},
 rabbit:{zone:70,late:.36,brakeMax:.52,carry:1.03,lineIn:1,vBonus:1.02,style:'early'},
 weaver:{zone:58,late:.5,brakeMax:.45,carry:1.07,lineIn:.9,vBonus:1.05,style:'momentum'}
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

/* ---------------- GEOMETRY DETAIL ----------------
   Game-wide polygon upgrade (threejs-geometry): every round primitive is built with more segments than its call site asks
   for, so wheels, tires, poles, lamps, domes and arches read smooth up close. Intentionally faceted shapes (3-5 sided prisms,
   flat-shaded icosahedra) are left alone. Phones get a smaller multiplier.
   Two knobs: PRIM_DETAIL drives the primitive-segment override below (every track, prop and car primitive);
   CAR_BODY_DETAIL drives only the lofted car shells, so car and level density move independently. */
const PHONE_TIER=matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<700;
const PRIM_DETAIL=PHONE_TIER?2:3;
const CAR_BODY_DETAIL=PHONE_TIER?2:3; // lofted shells only (sculptBody / sculptCanopy / loftGeo)
{ const up=(n,min,max)=>n>=6?Math.min(max,Math.max(min,Math.round(n*PRIM_DETAIL))):n;
  // perf: caps trimmed (144 -> 64 round segments etc.). Past ~64 segments a cylinder edge is sub-pixel at race distance,
  // so this keeps the smooth look while cutting the vertex load on wheels, poles, arches and domes by up to half.
  const C=THREE.CylinderGeometry, Sp=THREE.SphereGeometry, T=THREE.TorusGeometry, Ci=THREE.CircleGeometry, Ri=THREE.RingGeometry, Co=THREE.ConeGeometry, La=THREE.LatheGeometry;
  THREE.CylinderGeometry=class extends C{ constructor(a,b,h,rs,hs,o,ts,tl){ super(a,b,h,up(rs===undefined?8:rs,12,64),hs,o,ts,tl); } };
  THREE.ConeGeometry=class extends Co{ constructor(r,h,rs,hs,o,ts,tl){ super(r,h,up(rs===undefined?8:rs,12,64),hs,o,ts,tl); } };
  THREE.SphereGeometry=class extends Sp{ constructor(r,ws,hs,a,b,c,d){ super(r,up(ws===undefined?32:ws,12,64),up(hs===undefined?16:hs,8,40),a,b,c,d); } };
  THREE.TorusGeometry=class extends T{ constructor(r,t,rs,ts,arc){ super(r,t,up(rs===undefined?8:rs,8,20),up(ts===undefined?6:ts,16,128),arc); } };
  THREE.CircleGeometry=class extends Ci{ constructor(r,seg,a,b){ super(r,up(seg===undefined?8:seg,16,64),a,b); } };
  THREE.RingGeometry=class extends Ri{ constructor(i,o,ts,ps,a,b){ super(i,o,up(ts===undefined?8:ts,16,64),ps,a,b); } };
  THREE.LatheGeometry=class extends La{ constructor(pts,seg,a,b){ super(pts,up(seg===undefined?12:seg,16,64),a,b); } }; }
/* ---------------- CULLING (perf) ----------------
   Two fixes to what the renderer skips each frame, both inside Frustum.intersectsObject so no game code changes:
   1. InstancedMesh: r128 tests only the base geometry at the mesh origin, so a row of lamps is kept or dropped as a
      whole depending on where 0,0,0 is. We test a sphere around the instances themselves (cached until they move).
   2. Fog distance: anything whose material is fogged and sits entirely past the view depth where the scene fog is
      ~99.9% opaque is invisible anyway, so it is not drawn. Fog-exempt things (sky, moon, skyline glow) are never touched. */
const CULL={far:Infinity,x:0,y:0,z:0,fx:0,fy:0,fz:-1};
{ const F=THREE.Frustum.prototype, sp=new THREE.Sphere(), m4=new THREE.Matrix4(), v=new THREE.Vector3(), box=new THREE.Box3();
  const fogged=m=>Array.isArray(m)?m.every(x=>x&&x.fog):!!(m&&m.fog);
  F.intersectsObject=function(o){ const g=o.geometry; if(g.boundingSphere===null) g.computeBoundingSphere();
    if(o.isInstancedMesh){ let c=o.userData._ib;
      if(!c||c.v!==o.instanceMatrix.version||c.n!==o.count||c.g!==g){ box.makeEmpty(); let sc=1;
        for(let i=0;i<o.count;i++){ o.getMatrixAt(i,m4); box.expandByPoint(v.setFromMatrixPosition(m4)); sc=Math.max(sc,m4.getMaxScaleOnAxis()); }
        const s=new THREE.Sphere(); if(o.count) box.getBoundingSphere(s); s.radius+=(g.boundingSphere.radius+g.boundingSphere.center.length())*sc; // conservative: any rotation of the part fits
        c=o.userData._ib={v:o.instanceMatrix.version,n:o.count,g,s}; }
      sp.copy(c.s).applyMatrix4(o.matrixWorld); }
    else sp.copy(g.boundingSphere).applyMatrix4(o.matrixWorld);
    if(CULL.far<Infinity&&fogged(o.material)){ // fog runs on view depth, so test the sphere's depth along the camera's forward axis
      const dep=(sp.center.x-CULL.x)*CULL.fx+(sp.center.y-CULL.y)*CULL.fy+(sp.center.z-CULL.z)*CULL.fz; if(dep-sp.radius>CULL.far) return false; }
    return this.intersectsSphere(sp); }; }
/* ---------------- RENDERER ---------------- */
const canvas=$('#gl');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
const PHONE=matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<700; // phones get a lighter pipeline
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1)); // render scale; the frame pacer (below) moves it with the frame time
// if iOS resets the GPU, come back cleanly instead of sitting on a frozen frame
canvas.addEventListener('webglcontextlost',e=>{ e.preventDefault(); const d=document.getElementById('ldsub'); if(d) d.textContent='Graphics were reset by the phone. Reloading.'; setTimeout(()=>location.reload(),1200); });
// surface script errors on screen so a stuck load can be reported
addEventListener('error',e=>{ const d=document.getElementById('ldsub'); if(d) d.textContent='Error: '+(e.message||e.error||'unknown')+(e.lineno?' (line '+e.lineno+')':''); });
renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;
const pmrem=new THREE.PMREMGenerator(renderer);
/* ---------------- STREET HAZE (light as art) ----------------
   Every FogExp2 scene gets a second fog layer that hugs the road: ~7 m deep, measured from the camera's own height
   (so the bridge deck, the tunnel and the street all sit in it) with a linear rather than squared distance falloff. Far
   street level dissolves into warm, sodium-lit air while rooftops and the sky stay crisp: the depth a night photo has.
   Additive light (pools, cones, beams, flares) is tagged FOG_ADD and fades to black with distance, so a far lamp pool
   dims out instead of turning into a fog-colored smudge. No new uniforms: the haze rides on each scene's fog density,
   so every event keeps its own look. (Points and sprites don't receive viewMatrix in r128, so they get a fixed,
   moderate haze amount instead of a height-based one.) */
{ const SC=THREE.ShaderChunk;
  SC.fog_pars_vertex='#ifdef USE_FOG\n\tvarying float fogDepth;\n\tvarying float fogHazeH;\n#endif\n';
  SC.fog_vertex='#ifdef USE_FOG\n\tfogDepth = - mvPosition.z;\n\tfogHazeH = dot( viewMatrix[ 1 ].xyz, mvPosition.xyz ) + 3.0; // height above the road under the camera\n#endif\n';
  SC.fog_pars_fragment='#ifdef USE_FOG\n\tuniform vec3 fogColor;\n\tvarying float fogDepth;\n\tvarying float fogHazeH;\n\t#ifdef FOG_EXP2\n\t\tuniform float fogDensity;\n\t#else\n\t\tuniform float fogNear;\n\t\tuniform float fogFar;\n\t#endif\n#endif\n';
  SC.fog_fragment=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * fogDepth * fogDepth );
		float hzL = exp( - max( fogHazeH, 0.0 ) / 7.0 );
		fogFactor = 1.0 - ( 1.0 - fogFactor ) * exp( - fogDensity * fogDepth * hzL * 0.55 );
		vec3 fogC = fogColor * mix( vec3( 1.0 ), vec3( 1.45, 1.12, 0.82 ), hzL * 0.8 );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, fogDepth );
		vec3 fogC = fogColor;
	#endif
	#ifdef FOG_ADD
		gl_FragColor.rgb *= 1.0 - fogFactor;
	#else
		gl_FragColor.rgb = mix( gl_FragColor.rgb, fogC, fogFactor );
	#endif
#endif
`; }
const FOG_ADD={FOG_ADD:''}; // material.defines for additive light: fades to black in fog
function fogAdd(m){ m.defines=FOG_ADD; return m; } // r128 setValues() rejects 'defines' in a constructor, so assign it after

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
    } else if(kind==='pinkcity'){ // Wisp's street: violet dusk sky, lit towers, pink neon and cool shopfronts low on the horizon
      const gr=g.createLinearGradient(0,0,0,h);
      gr.addColorStop(0,'#0d0a2a');gr.addColorStop(.3,'#2a1d5c');gr.addColorStop(.46,'#5a3a86');gr.addColorStop(.5,'#c060b0');gr.addColorStop(.55,'#2a1430');gr.addColorStop(1,'#07050a');
      g.fillStyle=gr;g.fillRect(0,0,w,h);
      for(let i=0;i<22;i++){ const x=i*48+Math.random()*20, bw=24+Math.random()*30, top=h*(.14+Math.random()*.22); g.fillStyle='#120e24'; g.fillRect(x,top,bw,h*.5-top);
        g.fillStyle='#cfe0ff'; for(let y=top+4;y<h*.48;y+=7) for(let xx=x+3;xx<x+bw-3;xx+=6) if(Math.random()<.32) g.fillRect(xx,y,3,3); }
      [['#ff3fb8',.53,90],['#ff5ad0',.56,60],['#4f8bff',.54,70],['#ffb070',.42,40],['#b8ff3a',.55,22]].forEach(([c,y,r],i)=>{ for(let k=0;k<5;k++){ const x=Math.random()*w, rg=g.createRadialGradient(x,h*y,0,x,h*y,r);
        rg.addColorStop(0,c); rg.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=rg; g.fillRect(x-r,h*y-r,r*2,r*2); } });
    } else if(kind==='tunnel'){ // inside a lit road tube: dark vault, two rows of LED strips overhead, tiled walls glowing low, green exits
      const gr=g.createLinearGradient(0,0,0,h);
      gr.addColorStop(0,'#05070a');gr.addColorStop(.3,'#0c1118');gr.addColorStop(.46,'#3a4450');gr.addColorStop(.5,'#8e9aa8');gr.addColorStop(.56,'#2a3038');gr.addColorStop(1,'#07080a');
      g.fillStyle=gr;g.fillRect(0,0,w,h);
      g.fillStyle='#ffffff'; for(let i=0;i<32;i++){ g.fillRect(i*32+4,h*.16,20,6); g.fillRect(i*32+12,h*.24,16,5); } // ceiling strips, streaking past
      g.fillStyle='rgba(230,240,255,.55)'; g.fillRect(0,h*.47,w,5);                                           // wall-wash line
      for(let i=0;i<8;i++){ g.fillStyle=i%2?'#3dff8a':'#ff8a2a'; g.fillRect(i*128+40,h*.5,10,6); }        // exit signs and SOS boxes
    } else if(kind==='street'){
      const gr=g.createLinearGradient(0,0,0,h);
      // a Philly street as the paint sees it: warm light-polluted sky low down, rowhouse and tower silhouettes with lit
      // windows, sodium amber and LED white street lights receding along the horizon, overhead heads passing above
      gr.addColorStop(0,'#04060a');gr.addColorStop(.36,'#0e1626');gr.addColorStop(.47,'#3a3440');gr.addColorStop(.5,'#5a4436');gr.addColorStop(.56,'#161b24');gr.addColorStop(1,'#050608');
      g.fillStyle=gr;g.fillRect(0,0,w,h);
      for(let i=0;i<30;i++){ const x=i*35+Math.random()*12, bw=18+Math.random()*24, top=h*(.24+Math.random()*.22); g.fillStyle='#0a0d14'; g.fillRect(x,top,bw,h*.5-top);
        for(let y=top+4;y<h*.49;y+=6) for(let xx=x+3;xx<x+bw-3;xx+=5) if(Math.random()<.24){ g.globalAlpha=.45+Math.random()*.55; g.fillStyle=Math.random()<.7?'#ffcf8a':'#d6e6ff'; g.fillRect(xx,y,2,3); }
        g.globalAlpha=1; }
      for(let i=0;i<70;i++){ const x=Math.random()*w,y=h*(.4+Math.random()*.1),r=3+Math.random()*9;
        const rg=g.createRadialGradient(x,y,0,x,y,r); rg.addColorStop(0,i%3?'#ffb45a':'#e6eeff'); rg.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=rg; g.fillRect(x-r,y-r,r*2,r*2); }
      for(let i=0;i<10;i++){ g.fillStyle=i%3?'#ffe2b4':'#eef4ff'; g.fillRect(i*104+20,60,30,5); }
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
const ENV={ice:makeEnv('ice'),flash:makeEnv('flash'),street:makeEnv('street'),tunnel:makeEnv('tunnel'),pinkcity:makeEnv('pinkcity')};

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
  // dry asphalt: the same grain without the puddles, so a dry night doesn't show mirror patches
  const dry=canvasTex(N,N,(g)=>{ const im=g.createImageData(N,N);
    for(let i=0;i<N*N;i++){ const v=Math.round(255*(.66+(hgt[(i*7)%(N*N)]-.5)*.22+(hgt[i]-.5)*.12)); im.data.set([v,v,v,255],i*4); } g.putImageData(im,0,0); });
  const nrm=canvasTex(N,N,(g)=>{ const im=g.createImageData(N,N), H=(x,y)=>hgt[((y+N)%N)*N+((x+N)%N)];
    for(let y=0;y<N;y++) for(let x=0;x<N;x++){ const dx=(H(x+1,y)-H(x-1,y))*9+(Math.random()-.5)*.35, dy=(H(x,y+1)-H(x,y-1))*9+(Math.random()-.5)*.35, l=Math.hypot(dx,dy,1);
      im.data.set([Math.round((-dx/l*.5+.5)*255),Math.round((-dy/l*.5+.5)*255),Math.round((1/l*.5+.5)*255),255],(y*N+x)*4); } g.putImageData(im,0,0); });
  const t=c=>{ const x=new THREE.CanvasTexture(c); x.wrapS=x.wrapT=THREE.RepeatWrapping; x.anisotropy=4; return x; };
  return {rough:t(rough),dry:t(dry),normal:t(nrm)};
})();
function wetRoad(m){ m.roughnessMap=LOOK.wet?WETMAPS.rough:WETMAPS.dry; m.normalMap=WETMAPS.normal; m.normalScale=new THREE.Vector2(.35,.35); m.userData.baseRough=m.roughness; LOOK.roadMats.push(m);
  m.onBeforeCompile=WETFX.obc; m.customProgramCacheKey=WETFX.key; return m; }
/* WET ROAD SHADER (threejs-shaders: onBeforeCompile on every wetRoad() material). Technique notes from Threejs-Punk
   (Mancini & Sunag): procedural rain-ripple normals in world XZ, reflection strength driven by (1 - roughness), and a
   dark wet base so the lights carry the image. We skip their planar-reflection render (an extra scene pass) and instead
   trace the street lamps and nearby car lights analytically: each light is a stretched anisotropic lobe around the
   reflected view ray, long vertically and narrow sideways, which is how a wet street smears lamps into streaks.
   Puddles (low roughness in WETMAPS.rough) get tight mirror lobes; plain asphalt gets long soft streaks.
   Cost: one uniform-branch when dry; when wet, N lights x a few ALU per road pixel plus a 3x3 ripple loop near the
   camera (skipped on PHONE). Light list is chosen on the CPU each frame in wetFrame(), called from draw(). */
const WETFX=(()=>{ const N=PHONE?8:16, CARS_N=4;
  const uWL={value:Array.from({length:N},()=>new THREE.Vector4())}, uWC={value:Array.from({length:N},()=>new THREE.Vector3())};
  const uWetK={value:0}, uWetT={value:0}, uWetS={value:2.8}, uWetTune={value:new THREE.Vector4(1000,200,.5,.3)}; // asphalt lobe width, asphalt lobe length, fresnel cap, env-reflection keep
  const vert=['varying vec3 vWetP;','#include <project_vertex>\n  { vec4 wp4=vec4(transformed,1.0);\n  #ifdef USE_INSTANCING\n  wp4=instanceMatrix*wp4;\n  #endif\n  vWetP=(modelMatrix*wp4).xyz; }'];
  const pars=`#define WET_N ${N}\n${PHONE?'#define WET_LITE\n':''}varying vec3 vWetP; uniform float uWetK,uWetT,uWetS; uniform vec4 uWetTune,uWL[WET_N]; uniform vec3 uWC[WET_N];
vec2 wH22(vec2 p){ vec3 p3=fract(p.xyx*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yzx+19.19); return fract((p3.xx+p3.yz)*p3.zy); }
float wH12(vec2 p){ vec3 p3=fract(p.xyx*.1031); p3+=dot(p3,p3.yzx+19.19); return fract((p3.x+p3.y)*p3.z); }
vec2 wRipple(vec2 uv,float t){ vec2 p0=floor(uv), c=vec2(0.); // expanding rings, 3x3 cells (port of Threejs-Punk rainRipples.js)
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){ vec2 pi=p0+vec2(float(i),float(j)), v=pi+wH22(pi)-uv; float tt=fract(.3*t+wH12(pi)), d=length(v)-2.*tt;
    float d1=d-.01, d2=d+.01, a=sin(31.*d1)*smoothstep(-.6,-.3,d1)*smoothstep(0.,-.3,d1), b=sin(31.*d2)*smoothstep(-.6,-.3,d2)*smoothstep(0.,-.3,d2);
    c+=v/max(length(v),1e-4)*((b-a)/.02)*(1.-tt)*(1.-tt)*.5; }
  return c/9.; }
`;
  const darken='#include <roughnessmap_fragment>\n  float wetPud=0.;\n  #ifdef USE_ROUGHNESSMAP\n  wetPud=uWetK*(1.-smoothstep(.12,.42,texelRoughness.g));\n  #endif\n  diffuseColor.rgb*=1.-uWetK*(.32+.38*wetPud);';
  const ripple=`#include <normal_fragment_maps>
  float wetD=length(vWetP-cameraPosition);
  #ifndef WET_LITE
  if(uWetK>.5){ float rf=1.-smoothstep(9.,30.,wetD); if(rf>0.){ vec2 rp=wRipple(vWetP.xz*2.4,uWetT*3.)*rf*(.4+.6*wetPud); normal=normalize(normal+(viewMatrix*vec4(rp.x,0.,rp.y,0.)).xyz*.07); } }
  #endif`;
  const streaks=`#include <lights_fragment_end>
  if(uWetK>.5){
    reflectedLight.indirectSpecular*=uWetTune.w+(1.-uWetTune.w)*wetPud; // the env map's grey horizon band was washing the whole road out
    vec3 wN=normalize((vec4(normal,0.)*viewMatrix).xyz), V=normalize(vWetP-cameraPosition), R=reflect(V,wN);
    vec2 Rh=R.xz/max(length(R.xz),1e-4);
    float kA=mix(uWetTune.x,5200.,wetPud), kE=mix(uWetTune.y,420.,wetPud), en=mix(1.,1.3,wetPud), F=.05+(uWetTune.z-.05)*pow(1.-clamp(-dot(V,wN),0.,1.),5.);
    vec3 acc=vec3(0.);
    for(int i=0;i<WET_N;i++){ vec4 L=uWL[i]; if(L.w<=0.) continue;
      vec3 Ld=L.xyz-vWetP; float dl=length(Ld); Ld/=dl;
      float ca=dot(Rh,Ld.xz/max(length(Ld.xz),1e-4)), dE=R.y-Ld.y;
      acc+=uWC[i]*(L.w*exp(-(1.-ca)*kA-dE*dE*kE)*(.3+.7*smoothstep(6.,28.,dl))/(1.+dl*dl*.00009)); } // near lights cover a huge footprint: ease them off
    reflectedLight.indirectSpecular+=min(acc*en*F*uWetS,vec3(.9))*(1.-smoothstep(.55,.9,roughnessFactor)); // clamp: a lamp right overhead must not white out the lane
  }`;
  function obc(sh){ Object.assign(sh.uniforms,{uWL,uWC,uWetK,uWetT,uWetS,uWetTune});
    sh.vertexShader=vert[0]+'\n'+sh.vertexShader.replace('#include <project_vertex>',vert[1]);
    sh.fragmentShader=pars+sh.fragmentShader.replace('#include <roughnessmap_fragment>',darken).replace('#include <normal_fragment_maps>',ripple).replace('#include <lights_fragment_end>',streaks); }
  // per-frame light pick: nearest street lamps ahead of the camera plus the closest car lights (tails facing us, or oncoming heads)
  const bD=new Float32Array(N), bI=new Int32Array(N), cf=new THREE.Vector3(), cp=new THREE.Vector3(), fz=new THREE.Vector3(), tc=new THREE.Color(0xff2a24), hc=new THREE.Color(0xeaf0ff);
  const carL=[];
  function pick(scene,camera,racers,traffic){ uWetK.value=LOOK.wet&&!!scene.fog?1:0; if(!uWetK.value) return;
    uWetT.value=(performance.now()/1000)%1000; camera.getWorldPosition(cp); camera.getWorldDirection(cf);
    const lamps=scene.userData.wetL, nl=N-CARS_N; let k=0;
    if(lamps) for(let i=0;i<lamps.length;i+=6){ const dx=lamps[i]-cp.x, dy=lamps[i+1]-cp.y, dz=lamps[i+2]-cp.z;
      if(dx*cf.x+dy*cf.y+dz*cf.z<-4) continue; const d=dx*dx+dy*dy+dz*dz; if(d>90000) continue;
      if(k<nl){ let j=k++; while(j>0&&bD[j-1]>d){ bD[j]=bD[j-1]; bI[j]=bI[j-1]; j--; } bD[j]=d; bI[j]=i; }
      else if(d<bD[nl-1]){ let j=nl-1; while(j>0&&bD[j-1]>d){ bD[j]=bD[j-1]; bI[j]=bI[j-1]; j--; } bD[j]=d; bI[j]=i; } }
    for(let j=0;j<k;j++){ const i=bI[j]; uWL.value[j].set(lamps[i],lamps[i+1],lamps[i+2],1.25); uWC.value[j].set(lamps[i+3],lamps[i+4],lamps[i+5]); }
    carL.length=0; const add=o=>{ const g=o&&o.m&&o.m.group; if(!g||!g.visible||g.parent!==scene) return; const p=g.position, dx=p.x-cp.x, dz=p.z-cp.z, d=dx*dx+dz*dz;
      if(d>14400||d<64||dx*cf.x+dz*cf.z<-2) return; carL.push(d,o); }; // skip the car under the camera: its beam/tail planes already light its own patch
    (racers||[]).forEach(add); (traffic||[]).forEach(add);
    for(let c=0;c<CARS_N;c++){ let bi=-1; for(let i=0;i<carL.length;i+=2) if(carL[i]>=0&&(bi<0||carL[i]<carL[bi])) bi=i; const s=k+c;
      if(bi<0){ uWL.value[s].w=0; continue; } carL[bi]=-1; const g=carL[bi+1].m.group; g.updateMatrixWorld(); fz.setFromMatrixColumn(g.matrixWorld,2).normalize();
      const away=fz.x*cf.x+fz.z*cf.z>0; uWL.value[s].set(g.position.x-fz.x*(away?2.3:-2.3),g.position.y+(away?.85:.7),g.position.z-fz.z*(away?2.3:-2.3),away?.3:.2); // car lights are close and hot: keep them under the lamp streaks
      const col=away?tc:hc; uWC.value[s].set(col.r,col.g,col.b); }
    for(let j=k;j<nl;j++) uWL.value[j].w=0; }
  // street-lamp heads register here (from lampCones) so every builder that hangs lamps feeds the reflections
  function lamps(S,pts,col){ const a=S.userData.wetL||(S.userData.wetL=[]), one=Array.isArray(col)?null:new THREE.Color(col||0xdfe9ff); // col: one color, or one per lamp
    pts.forEach((p,i)=>{ const c=one||col[i]||LAMP_LED, m=one?1:Math.max(c.r,c.g,c.b,.01); a.push(p.x,p.y,p.z,c.r/m,c.g/m,c.b/m); }); } // per-lamp colors are hue only: reflections stay full-bright
  return {obc,key:()=>'wetRoad'+N,frame:pick,lamps,uWetK,uWetS,uWetTune};
})();
const gradTex=(w,h,draw)=>{ const t=new THREE.CanvasTexture(canvasTex(w,h,draw)); return t; };
// long reflection streaks on wet asphalt under every light
const streakTex=gradTex(64,256,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'rgba(255,255,255,0)'); gr.addColorStop(.35,'rgba(255,255,255,.55)'); gr.addColorStop(.5,'rgba(255,255,255,1)'); gr.addColorStop(.65,'rgba(255,255,255,.55)'); gr.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=gr; g.fillRect(0,0,w,h); g.globalCompositeOperation='destination-in'; const gx=g.createLinearGradient(0,0,w,0); gx.addColorStop(0,'rgba(0,0,0,0)'); gx.addColorStop(.5,'rgba(0,0,0,1)'); gx.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gx; g.fillRect(0,0,w,h); });
// soft vertical falloff for light cones (bright at the top of the texture)
const coneTex=gradTex(8,128,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.4,'rgba(255,255,255,.35)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
// headlight throw on the road: narrow and hot near the car, wide and faint far away
// headlight throw on the road (low beams): two hot lobes just ahead of the car that spread and merge into one wide pool,
// the right lobe reaching a little further (US low-beam kick toward the curb), dark right under the bumper
const beamTex=gradTex(128,256,(g,w,h)=>{ const im=g.createImageData(w,h);
  for(let y=0;y<h;y++){ const t=y/h, fade=Math.pow(1-t,1.5)*Math.min(1,t/.05), sp=.07+.3*t, cx=.2*(1-t*.8);
    for(let x=0;x<w;x++){ const u=(x+.5)/w-.5, L=Math.exp(-Math.pow((u+cx)/sp,2)), Rr=Math.exp(-Math.pow((u-cx)/sp,2))*(1+.35*t), wide=Math.exp(-Math.pow(u/(.18+.3*t),2))*.35;
      const a=Math.min(1,(Math.max(L,Rr)+wide)*fade*.95); im.data.set([255,255,255,Math.round(a*255)],(y*w+x)*4); } }
  g.putImageData(im,0,0); });
const flameTex=gradTex(8,128,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'rgba(120,190,255,1)'); gr.addColorStop(.35,'rgba(170,120,255,.8)'); gr.addColorStop(.7,'rgba(255,140,60,.55)'); gr.addColorStop(1,'rgba(255,90,20,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
const addMat=(o)=>fogAdd(new THREE.MeshBasicMaterial(Object.assign({transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false},o)));
// volumetric look for light cones: faces seen edge-on fade out, faces seen square-on keep their glow, so a cone reads as a
// soft shaft of lit air instead of a hard-edged plastic cylinder (the classic "fresnel-inverse" god-ray trick, one dot product)
function edgeFade(m){ m.defines=FOG_ADD; m.onBeforeCompile=sh=>{
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vConeN; varying vec3 vConeV;').replace('#include <project_vertex>',
    '#include <project_vertex>\n{ vec3 cn=normal;\n#ifdef USE_INSTANCING\ncn=mat3(instanceMatrix)*cn;\n#endif\nvConeN=normalize(normalMatrix*cn); vConeV=-mvPosition.xyz; }');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vConeN; varying vec3 vConeV;').replace('#include <alphamap_fragment>',
    '#include <alphamap_fragment>\n{ float ed=abs(dot(normalize(vConeN),normalize(vConeV))); diffuseColor.a*=ed*ed*1.6; }'); };
  m.customProgramCacheKey=()=>'edgeFade'; return m; }
const STREAK_MAT=addMat({map:streakTex,color:0xcfe0ff,opacity:.14}), TSTREAK_MAT=addMat({map:streakTex,color:0xe6f0ff,opacity:.24}), TAIL_MAT=addMat({map:streakTex,color:0xff2030,opacity:.14});
const LAMPCONE_MAT=edgeFade(addMat({map:coneTex,color:0xffffff,opacity:.09,side:THREE.DoubleSide})), BEAM_MAT=addMat({map:beamTex,color:0xeaf2ff,opacity:.3}), CONE_MAT=edgeFade(addMat({map:coneTex,color:0xeaf2ff,opacity:.03,side:THREE.DoubleSide}));
const FLAME_MATS={};
function flameMat(col){ const k=(col>>>0).toString(16); return FLAME_MATS[k]||(FLAME_MATS[k]=addMat({map:flameTex,color:col,opacity:.95,side:THREE.DoubleSide})); }
const STREAK_GEO=new THREE.PlaneGeometry(1.5,18).rotateX(-Math.PI/2), LAMPCONE_GEO=new THREE.CylinderGeometry(.3,4.4,8.6,20,1,true);
const BEAM_GEO=new THREE.PlaneGeometry(5.2,17).rotateX(-Math.PI/2).translate(0,.06,8.5), HCONE_GEO=new THREE.ConeGeometry(1.7,13,18,1,true).rotateX(-Math.PI/2).translate(0,0,6.5);
const FLAME_GEO=new THREE.ConeGeometry(.2,1.3,10,1,true).rotateX(-Math.PI/2).translate(0,0,-.65), TAILREF_GEO=new THREE.PlaneGeometry(1.8,6).rotateX(-Math.PI/2).translate(0,.05,-3);
function instAll(S,geo,mat,arr){ if(!arr.length) return null; const im=new THREE.InstancedMesh(geo,mat,arr.length); arr.forEach((m,i)=>im.setMatrixAt(i,m)); S.add(im); return im; }
// streaks from a list of ground-level matrices (position + road-aligned rotation)
function lampStreaks(S,mats,tunnel){ return instAll(S,STREAK_GEO,tunnel?TSTREAK_MAT:STREAK_MAT,mats); }
// volumetric cones hanging under lamp heads, from head matrices
function lampCones(S,headMats,cols){ const v=new THREE.Vector3(), q=new THREE.Quaternion(), sc=new THREE.Vector3(), one=new THREE.Vector3(1,1,1);
  WETFX.lamps(S,headMats.map(m=>new THREE.Vector3().setFromMatrixPosition(m)),cols); // wet-road reflections trace these heads, in each lamp's own color
  const im=instAll(S,LAMPCONE_GEO,LAMPCONE_MAT,headMats.map(m=>{ m.decompose(v,q,sc); v.y-=4.4; return new THREE.Matrix4().compose(v,new THREE.Quaternion(),one); }));
  if(im) for(let i=0;i<im.count;i++) im.setColorAt(i,cols?cols[i]:LAMP_LED); return im; }
/* Street-light palette (light as art). Philly is mid-swap from high-pressure sodium to LED, so a street mixes amber sodium
   heads, cool-white LED cobra heads and the odd neutral metal-halide. Each lamp's head, pool, cone and flare share one color. */
const LAMP_SOD=new THREE.Color(.95,.56,.22), LAMP_LED=new THREE.Color(.6,.68,.82), LAMP_MH=new THREE.Color(.8,.7,.54); // LED reads brighter to the eye, so it is kept lower
function lampColors(n,sod,seed){ const R=rng(seed||431), out=[]; for(let i=0;i<n;i++){ const k=R(); out.push(k<sod?LAMP_SOD:(k<sod+(1-sod)*.8?LAMP_LED:LAMP_MH)); } return out; }
// pool of light under a lamp: inverse-square falloff (hot under the head, long soft tail) rather than a linear blob
const lampPoolTex=new THREE.CanvasTexture(canvasTex(256,256,(g,w,h)=>{ const im=g.createImageData(w,h);
  for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const dx=(x+.5)/w*2-1, dy=(y+.5)/h*2-1, r2=dx*dx+dy*dy;
    const a=r2>=1?0:(1/(1+r2*10)-1/11)/(10/11)*Math.pow(1-r2,1.1); im.data.set([255,255,255,Math.round(255*a)],(y*w+x)*4); }
  g.putImageData(im,0,0); }));
const LAMPPOOL_MAT=fogAdd(new THREE.MeshBasicMaterial({map:lampPoolTex,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}));
// instanced pools, one per lamp, tinted per lamp; raised to sidewalk height so the light spills over the curb too
function lampPools(S,mats,cols,size){ size=(size||22)*(PHONE?.78:1); /* phones: ~40% less additive overdraw */ const geo=new THREE.PlaneGeometry(size,size).rotateX(-Math.PI/2).translate(0,.14,0);
  const im=instAll(S,geo,LAMPPOOL_MAT,mats); if(im) for(let i=0;i<im.count;i++) im.setColorAt(i,cols?cols[i]:LAMP_LED); return im; }
// flare points over each head, colored per lamp
function lampFlares(S,flat,cols,size){ const g=new THREE.BufferGeometry(), c=new Float32Array(flat.length);
  for(let i=0;i<flat.length/3;i++){ const k=cols?cols[i]:LAMP_LED, m=Math.max(k.r,k.g,k.b); c[i*3]=k.r/m; c[i*3+1]=k.g/m; c[i*3+2]=k.b/m; /* flares stay full-bright, only the hue varies */ }
  g.setAttribute('position',new THREE.Float32BufferAttribute(flat,3)); g.setAttribute('color',new THREE.BufferAttribute(c,3));
  const p=new THREE.Points(g,fogAdd(new THREE.PointsMaterial({map:glowTex,size:size||3.4,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}))); S.add(p); return p; }
function setWeather(wet){ LOOK.wet=wet;
  LOOK.roadMats.forEach(m=>{ m.roughnessMap=wet?WETMAPS.rough:WETMAPS.dry; m.roughness=(m.userData.baseRough||.45)*(wet?.5:1.15); m.envMapIntensity=wet?1.6:1; m.normalScale.set(wet?.18:.35,wet?.18:.35); });
  STREAK_MAT.opacity=wet?.2:.14; TAIL_MAT.opacity=wet?.3:.14; WETFX.uWetK.value=wet?1:0; /* the road shader traces the lamp streaks now; the flat planes just fill in */ LAMPCONE_MAT.opacity=wet?.15:.09; CONE_MAT.opacity=wet?.05:.03; LAMPPOOL_MAT.opacity=wet?.62:.8; // rain: more light in the air, less pooled on the (reflective) road
  if(SKY_MAT) SKY_MAT.color.setScalar(wet?.62:1); }
// headlight throw, volumetric beams, exhaust flames and a wet tail-light reflection on every car
const STAGE_V=[40,58,72];
function speedStage(r){ let s=0; for(const v of STAGE_V) if(r.v>v) s++; if(r.nosOn) s++; return Math.min(4,s); }
const STAGE={beam:[.2,.28,.38,.5,.64],cone:[.012,.022,.036,.055,.08],lines:[0,.12,.22,.34,.48],len:[.6,.8,1,1.25,1.5],trail:[0,.35,.6,.85,1.15],blur:[0,.2,.45,.7,1]};
function rigLights(group,B,traffic,nitroCol){
  const front=traffic?2.26:B.front, hy=traffic?.72:B.headY, hx=traffic?.6:B.w*.36, rear=traffic?2.26:B.rear;
  const beamM=traffic?BEAM_MAT:BEAM_MAT.clone(), coneM=traffic?CONE_MAT:edgeFade(CONE_MAT.clone()); if(!traffic) beamM.defines=FOG_ADD; // racers get their own so the glow can follow their speed (clone drops defines/onBeforeCompile)
  const beam=new THREE.Mesh(BEAM_GEO,beamM); beam.position.set(0,0,front-.2); group.add(beam);
  const tail=new THREE.Mesh(TAILREF_GEO,TAIL_MAT); tail.position.set(0,0,-rear); group.add(tail);
  if(traffic) return {};
  const fMat=flameMat(nitroCol||0x9fd3ff);
  const cones=[-1,1].map(sd=>{ const c=new THREE.Mesh(HCONE_GEO,coneM); c.position.set(sd*hx,hy,front-.1); c.rotation.x=.06; group.add(c); return c; });
  const flames=[-1,1].map(sd=>{ const fl=new THREE.Mesh(FLAME_GEO,fMat); fl.position.set(sd*.45,B.base+.22,-rear-.08); fl.visible=false; group.add(fl); return fl; });
  return {cones,flames,beamM,coneM};
}
// tail-light trails: two ribbons following each car, drawn when it's really moving
function makeTrail(){ const N=22, V=N*2*2, pos=new Float32Array(V*3), col=new Float32Array(V*3), idx=[];
  for(let l=0;l<2;l++) for(let i=0;i<N-1;i++){ const a=(l*N+i)*2; idx.push(a,a+1,a+2,a+1,a+3,a+2); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3)); g.setAttribute('color',new THREE.BufferAttribute(col,3)); g.setIndex(idx);
  const mesh=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));
  mesh.frustumCulled=false; return {mesh,pos,col,N,hist:[[],[]],end:[null,null]}; }
const trV=new THREE.Vector3(), trD=new THREE.Vector3(), trS=new THREE.Vector3();
function updateTrail(r){ const T=r.trail; if(!T) return; const B=BODIES[r.def.body||'wedge'], N=T.N;
  const glow=STAGE.trail[r.stage||0];
  // the history is sampled by distance, so at speed 22 samples used to span 100+ m and a weaving car drew long
  // diagonal lines across the road: cap the trail by length and fade it by distance, not by sample index
  const maxL=clamp(8+r.v*.12,8,26);
  [-1,1].forEach((sd,l)=>{ const h=T.hist[l]; r.m.group.localToWorld(trV.set(sd*.62,B.tailY,-B.rear-.05));
    if(h.length&&h[0].distanceToSquared(trV)>900) h.length=0; // respawned or teleported: start over
    if(!h.length||h[0].distanceToSquared(trV)>.5) { h.unshift(trV.clone()); if(h.length>N) h.pop(); } else h[0].copy(trV);
    let cum=0;
    for(let i=0;i<N;i++){ if(i>0&&i<h.length) cum+=h[i].distanceTo(h[i-1]); const u=Math.min(1,cum/maxL);
      const p=u<1?(h[Math.min(i,h.length-1)]||trV):(T.end[l]||trV), pn=h[Math.min(i+1,h.length-1)]||p, pp=h[Math.max(i-1,0)]||p;
      if(u<1) T.end[l]=p; // everything past the cap folds onto the last point in range
      trD.subVectors(pp,pn); trD.y=0; if(trD.lengthSq()<1e-6) trD.set(0,0,1); trD.normalize(); trS.crossVectors(trD,UP).multiplyScalar(.07*(1-u)+.02);
      const k=((l*N+i)*2)*3, f=glow*Math.pow(1-u,1.4);
      T.pos[k]=p.x+trS.x; T.pos[k+1]=p.y; T.pos[k+2]=p.z+trS.z; T.pos[k+3]=p.x-trS.x; T.pos[k+4]=p.y; T.pos[k+5]=p.z-trS.z;
      T.col[k]=T.col[k+3]=f; T.col[k+1]=T.col[k+4]=f*.08; T.col[k+2]=T.col[k+5]=f*.12; } });
  T.mesh.geometry.attributes.position.needsUpdate=true; T.mesh.geometry.attributes.color.needsUpdate=true; }
// night sky dome for open-air events: stars, a moon, and low clouds lit orange by the city
let SKY_MAT=null;
function addDome(S){
  if(!SKY_MAT){ const tex=CT(canvasTex(1024,512,(g,w,h)=>{ const R=rng(9);
    const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#01030a'); gr.addColorStop(.3,'#060b18'); gr.addColorStop(.44,'#141a2c'); gr.addColorStop(.5,'#2b2331'); gr.addColorStop(.53,'#151b2b'); gr.addColorStop(1,'#0b0e15'); g.fillStyle=gr; g.fillRect(0,0,w,h);
    for(let i=0;i<420;i++){ const y=h*(.33+Math.pow(R(),.6)*.165), x=R()*w, rx=40+R()*140, ry=5+R()*14, t=(y/h-.33)/.165;
      const c=g.createRadialGradient(x,y,0,x,y,rx); const col=t>.8?`${96+R()*30|0},${70+R()*16|0},${72|0}`:`${34+t*40|0},${42+t*26|0},${62+t*14|0}`; c.addColorStop(0,`rgba(${col},${.04+R()*.06})`); c.addColorStop(1,`rgba(${col},0)`);
      g.save(); g.translate(x,y); g.scale(1,ry/rx); g.translate(-x,-y); g.fillStyle=c; g.fillRect(x-rx,y-rx,rx*2,rx*2); g.restore(); }
    const hz=g.createLinearGradient(0,h*.44,0,h*.52); hz.addColorStop(0,'rgba(255,150,90,0)'); hz.addColorStop(.7,'rgba(255,140,80,.14)'); hz.addColorStop(1,'rgba(255,140,80,0)'); g.fillStyle=hz; g.fillRect(0,h*.44,w,h*.08);
    // Skia dithers canvas gradients, and the dome magnifies each texel ~4x on screen, so the dither read as a dot
    // lattice across the sky. Blur the gradient layers (wrapping horizontally so the u seam stays clean), then add
    // the stars and moon on top so they stay sharp
    const pad=8, t=document.createElement('canvas'); t.width=w+pad*2; t.height=h; const tg=t.getContext('2d');
    tg.drawImage(g.canvas,pad,0); tg.drawImage(g.canvas,pad-w,0); tg.drawImage(g.canvas,pad+w,0);
    g.clearRect(0,0,w,h); g.filter='blur(2.5px)'; g.drawImage(t,-pad,0); g.filter='none';
    g.fillStyle='#01030a'; g.fillRect(0,0,w,4); // the blur pulls transparency in at the pole row
    for(let i=0;i<520;i++){ const y=R()*h*.36; g.fillStyle=`rgba(220,230,255,${.25+R()*.6})`; const s=R()<.08?1.6:.9; g.fillRect(R()*w,y,s,s); }
    const mg=g.createRadialGradient(w*.72,h*.2,0,w*.72,h*.2,60); mg.addColorStop(0,'rgba(240,244,255,1)'); mg.addColorStop(.12,'rgba(230,236,255,.9)'); mg.addColorStop(.2,'rgba(170,190,230,.25)'); mg.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=mg; g.fillRect(w*.72-60,h*.2-60,120,120);
    }));
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
  const carbon=canvasTex(64,64,(g,w,h)=>{ for(let y=0;y<h;y+=8) for(let x=0;x<w;x+=8){ const o=((x+y)/8)%2; // 2x2 twill weave
    g.fillStyle=o?'#1d2025':'#0e1013'; g.fillRect(x,y,8,8); g.fillStyle='rgba(255,255,255,.06)'; if(o) g.fillRect(x,y+1,8,2); else g.fillRect(x+1,y,2,8); } });
  return {flake:t(flake,6),tread:t(tread),side:t(side),rotor:t(rotor),carbon:t(carbon,3)};
})();
const tireTreadM=new THREE.MeshStandardMaterial({color:0x0e0e0f,roughness:.9,envMapIntensity:.5,bumpMap:CARTEX.tread,bumpScale:.015}), tireSideM=new THREE.MeshStandardMaterial({map:CARTEX.side,roughness:.92,metalness:0,envMapIntensity:.4});
const rotorM=new THREE.MeshStandardMaterial({map:CARTEX.rotor,metalness:.85,roughness:.35}), barrelM=new THREE.MeshStandardMaterial({color:0x0a0a0b,metalness:.6,roughness:.5,side:THREE.DoubleSide});
const trimM=new THREE.MeshStandardMaterial({color:0x050506,metalness:.2,roughness:.25}), chromeTrimM=new THREE.MeshStandardMaterial({color:0xdfe4ea,metalness:1,roughness:.1});
const carbonM=new THREE.MeshStandardMaterial({map:CARTEX.carbon,metalness:.45,roughness:.28,envMapIntensity:1.1});
const gapM=new THREE.MeshBasicMaterial({color:0x020203}), lensM=new THREE.MeshStandardMaterial({color:0x0b0e13,metalness:.9,roughness:.08}), exhM=new THREE.MeshStandardMaterial({color:0xb8bec6,metalness:1,roughness:.18});
const TIRE_GEO=new THREE.CylinderGeometry(.37,.37,.3,32), ROTOR_GEO=new THREE.CylinderGeometry(.25,.25,.024,28), BARREL_GEO=new THREE.CylinderGeometry(.275,.275,.2,24,1,true);
// Wisp 07 tire: lathed profile with rounded shoulders (threejs-geometry: LatheGeometry), far more segments than TIRE_GEO
let WISP_TIRE=null; function wispTireGeo(){ if(WISP_TIRE) return WISP_TIRE; const p=[];
  [[.262,-.15],[.3,-.152],[.34,-.148],[.358,-.138],[.367,-.12],[.37,-.09],[.37,.09],[.367,.12],[.358,.138],[.34,.148],[.3,.152],[.262,.15]].forEach(([r,y])=>p.push(new THREE.Vector2(r,y)));
  const ref=[]; for(let i=0;i<p.length-1;i++){ ref.push(p[i]); ref.push(p[i].clone().lerp(p[i+1],.5)); } ref.push(p[p.length-1]);
  WISP_TIRE=new THREE.LatheGeometry(ref,96); return WISP_TIRE; }
const WISP_BAND_GEO=new THREE.RingGeometry(.298,.34,96);
const PLATE_CACHE={};
function plateTex(txt){ if(PLATE_CACHE[txt]) return PLATE_CACHE[txt]; const c=canvasTex(256,64,(g,w,h)=>{ g.fillStyle='#e9ecef'; g.fillRect(0,0,w,h); g.strokeStyle='#1a2a4a'; g.lineWidth=4; g.strokeRect(3,3,w-6,h-6);
  g.fillStyle='#1a2a4a'; g.font='800 38px "Arial Narrow",Arial,sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3,w*.86); g.font='700 10px Arial'; g.fillText('PENNSYLVANIA',w/2,10); });
  return (PLATE_CACHE[txt]=CT(c)); }
function glowSprite(c,s){ const m=new THREE.Sprite(fogAdd(new THREE.SpriteMaterial({map:glowTex,color:c,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}))); m.scale.set(s,s,s); return m; }
const SHADOW_MAT=new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false});
function shadowPlane(w,l){ const sh=new THREE.Mesh(new THREE.PlaneGeometry(w,l),SHADOW_MAT); sh.rotation.x=-Math.PI/2; sh.position.y=.02; return sh; }
/* body families. y values are profile heights, x runs rear (-) to front (+) */
const BODIES={
 wedge:{pts:[[-2.3,.34],[-2.36,.66],[-2.24,.93],[-1.5,1.0],[-.6,1.02],[.4,.96],[1.3,.8],[1.95,.62],[2.34,.46],[2.36,.33]],base:.24,
   cab:[[-1.2,.95],[-.6,1.28],[.3,1.34],[.95,1.08],[1.35,.84]],cabBase:[-1.2,.92,1.35,.84],w:1.84,cw:1.3,wr:.37,wb:1.45,tr:.98,front:2.36,rear:2.36,headY:.64,tailY:.84,wingY:1.36,wingZ:-2.05},
 gt:{pts:[[-2.25,.36],[-2.34,.72],[-2.2,.9],[-1.5,1.0],[-.4,1.08],[.6,.95],[1.5,.77],[2.05,.6],[2.3,.45],[2.32,.33]],base:.25,
   cab:[[-1.75,.97],[-.95,1.32],[.1,1.4],[.78,1.12],[1.2,.9]],cabBase:[-1.75,.95,1.2,.9],w:1.92,cw:1.34,wr:.38,wb:1.4,tr:.9,front:2.32,rear:2.34,headY:.66,tailY:.86,wingY:1.62,wingZ:-2.15,swan:true},
 suv:{pts:[[-2.35,.66],[-2.42,1.05],[-2.28,1.3],[-1.2,1.36],[0,1.38],[1.1,1.32],[1.85,1.16],[2.32,.96],[2.42,.74]],base:.52,
   cab:[[-2.05,1.3],[-1.25,1.78],[.2,1.84],[1.0,1.55],[1.5,1.3]],cabBase:[-2.05,1.28,1.5,1.28],w:2.0,cw:1.62,wr:.47,wb:1.55,tr:.92,front:2.42,rear:2.42,headY:1.06,tailY:1.22,wingY:1.9,wingZ:-2.0},
 sedan:{pts:[[-2.45,.4],[-2.5,.8],[-2.32,.98],[-1.6,1.02],[-.6,1.0],[.5,.98],[1.4,.92],[2.1,.8],[2.46,.62],[2.5,.42]],base:.26,
   cab:[[-1.6,.98],[-1.05,1.42],[.35,1.46],[.95,1.22],[1.38,.96]],cabBase:[-1.6,.95,1.38,.94],w:1.94,cw:1.5,wr:.38,wb:1.58,tr:.9,front:2.5,rear:2.5,headY:.74,tailY:.92,wingY:1.2,wingZ:-2.3},
 hatch:{pts:[[-1.98,.42],[-2.04,.78],[-1.98,1.0],[-1.5,1.06],[-.5,1.04],[.5,1.0],[1.3,.88],[1.82,.7],[2.0,.52],[2.02,.4]],base:.3,
   cab:[[-1.92,1.0],[-1.72,1.52],[-.3,1.6],[.5,1.34],[1.02,1.02]],cabBase:[-1.92,.98,1.02,.98],w:1.84,cw:1.5,wr:.35,wb:1.26,tr:.94,front:2.02,rear:2.04,headY:.76,tailY:.94,wingY:1.66,wingZ:-1.82},
 wisp:{pts:[[-2.12,.42],[-2.18,.8],[-2.1,1.0],[-1.5,1.04],[-.5,1.0],[.5,.98],[1.3,.92],[1.85,.8],[2.18,.62],[2.24,.4]],base:.28, // time-attack hatch (Blender GLB, tools/blender/wisp_07.py)
   cab:[[-2.1,1.04],[-1.9,1.43],[-.3,1.47],[.5,1.32],[.92,1.03]],cabBase:[-2.1,1.02,.92,1.0],w:1.76,cw:1.5,wr:.38,wb:1.42,tr:.92,front:2.24,rear:2.18,headY:.69,tailY:.87,wingY:1.62,wingZ:-2.05},
 truck:{pts:[[-2.62,.66],[-2.68,1.06],[-2.6,1.2],[-1.6,1.22],[-.6,1.22],[.2,1.24],[1.1,1.3],[1.9,1.24],[2.5,1.06],[2.64,.78]],base:.56,
   cab:[[-.62,1.22],[-.5,1.96],[.62,2.0],[1.14,1.62],[1.56,1.3]],cabBase:[-.62,1.2,1.56,1.28],w:2.04,cw:1.8,wr:.5,wb:1.72,tr:.96,front:2.64,rear:2.68,headY:1.06,tailY:1.02,wingY:2.1,wingZ:-2.2},
 coupe:{pts:[[-2.12,.4],[-2.18,.74],[-2.08,.96],[-1.6,1.02],[-.8,1.04],[.2,.98],[1.1,.86],[1.75,.72],[2.12,.54],[2.16,.38]],base:.24,
   cab:[[-1.75,.98],[-1.1,1.24],[-.2,1.32],[.45,1.12],[.9,.9]],cabBase:[-1.75,.96,.9,.88],w:1.9,cw:1.36,wr:.36,wb:1.3,tr:.96,front:2.16,rear:2.18,headY:.7,tailY:.88,wingY:1.36,wingZ:-1.95},
 classic:{pts:[[-2.2,.42],[-2.3,.7],[-2.2,.86],[-1.6,.94],[-.9,.98],[-.2,.9],[.6,.86],[1.4,.8],[2.0,.66],[2.3,.5],[2.36,.4]],base:.22,
   cab:[[-1.95,.92],[-1.2,1.3],[-.55,1.34],[-.1,1.14],[.25,.9]],cabBase:[-1.95,.9,.25,.86],w:1.82,cw:1.3,wr:.36,wb:1.28,tr:.9,front:2.36,rear:2.3,headY:.64,tailY:.78,wingY:1.1,wingZ:-2.1},
 hyper:{pts:[[-2.5,.34],[-2.56,.64],[-2.42,.8],[-1.6,.9],[-.6,.94],[.4,.86],[1.3,.66],[1.95,.5],[2.4,.38],[2.46,.3]],base:.2,
   cab:[[-1.35,.9],[-.8,1.2],[.1,1.25],[.7,1.03],[1.15,.74]],cabBase:[-1.35,.88,1.15,.72],w:2.02,cw:1.28,wr:.37,wb:1.5,tr:.87,front:2.55,rear:2.45,headY:.5,tailY:.72,wingY:1.5,wingZ:-2.2,swan:true},
 p1:{pts:[[-2.24,.34],[-2.3,.66],[-2.2,.82],[-1.6,.9],[-.9,.92],[-.1,.84],[.8,.68],[1.6,.52],[2.14,.36],[2.22,.26]],base:.18,
   cab:[[-1.55,.96],[-1.0,1.16],[-.2,1.22],[.5,1.02],[.98,.7]],cabBase:[-1.55,.94,.98,.68],w:2.0,cw:1.22,wr:.36,wb:1.36,tr:.88,front:2.22,rear:2.3,headY:.5,tailY:.76,wingY:1.14,wingZ:-1.95},
 fastback:{pts:[[-2.42,.4],[-2.48,.76],[-2.34,.92],[-1.7,.97],[-.6,.99],[.5,.97],[1.4,.9],[2.1,.76],[2.44,.6],[2.48,.4]],base:.26,
   cab:[[-2.15,.94],[-1.3,1.28],[.3,1.4],[1.0,1.16],[1.42,.93]],cabBase:[-2.15,.92,1.42,.92],w:1.94,cw:1.46,wr:.38,wb:1.55,tr:.92,front:2.48,rear:2.48,headY:.72,tailY:.86,wingY:1.08,wingZ:-2.3},
 granfour:{pts:[[-2.4,.4],[-2.45,.76],[-2.34,.96],[-1.7,1.03],[-.6,1.0],[.5,.97],[1.4,.93],[2.1,.83],[2.44,.72],[2.47,.4]],base:.2, // Gran Four v3 (tools/blender/gran_four.py)
   cab:[[-2.12,1.05],[-1.3,1.29],[-.1,1.42],[.58,1.27],[.98,.99]],cabBase:[-2.12,1.02,.98,.97],w:1.96,cw:1.42,wr:.4,wb:1.56,tr:.78,front:2.49,rear:2.31,headY:.72,tailY:.87,wingY:1.08,wingZ:-2.3},
 noctis:{pts:[[-2.12,.34],[-2.2,.68],[-2.02,.86],[-1.3,.94],[-.35,.96],[.55,.92],[1.4,.8],[2.1,.64],[2.5,.48],[2.54,.34]],base:.22,
   cab:[[-1.62,.92],[-1.08,1.26],[-.15,1.32],[.4,1.08],[.72,.88]],cabBase:[-1.62,.9,.72,.86],w:1.98,cw:1.4,wr:.37,wb:1.5,tr:.9,front:2.54,rear:2.2,headY:.6,tailY:.8,wingY:1.16,wingZ:-1.9},
 vanta:{pts:[[-2.72,.26],[-2.78,.48],[-2.55,.62],[-1.75,.7],[-.75,.72],[.25,.66],[1.2,.5],[1.9,.36],[2.32,.28],[2.36,.22]],base:.14,
   cab:[[-.25,.68],[.15,.98],[.65,1.02],[1.02,.84],[1.22,.58]],cabBase:[-.25,.66,1.22,.56],w:2.08,cw:1.14,wr:.36,wb:1.55,tr:.94,front:2.36,rear:2.78,headY:.4,tailY:.54,wingY:1.14,wingZ:-2.4,swan:true},
 stratos:{pts:[[-2.58,.28],[-2.64,.7],[-2.38,.96],[-1.5,1.02],[-.45,.92],[.55,.72],[1.4,.52],[2.0,.4],[2.38,.32],[2.42,.24]],base:.16,
   cab:[[-.85,.92],[-.25,1.26],[.5,1.3],[1.0,1.02],[1.32,.68]],cabBase:[-.85,.9,1.32,.66],w:2.1,cw:1.22,wr:.37,wb:1.5,tr:.96,front:2.42,rear:2.64,headY:.46,tailY:.86,wingY:1.52,wingZ:-2.28,swan:true},
 muscle:{pts:[[-2.4,.42],[-2.46,.84],[-2.36,1.0],[-1.6,1.05],[-.4,1.07],[.6,1.06],[1.5,1.03],[2.2,.97],[2.46,.84],[2.5,.46]],base:.26, // long-hood widebody coupe
   cab:[[-1.5,1.03],[-.95,1.45],[.0,1.49],[.5,1.3],[1.0,1.03]],cabBase:[-1.5,1.01,1.0,1.01],w:2.02,cw:1.52,wr:.39,wb:1.52,tr:1.04,front:2.5,rear:2.46,headY:.8,tailY:.84,wingY:1.14,wingZ:-2.3},
 tempesta:{pts:[[-2.44,.3],[-2.5,.66],[-2.36,.88],[-1.6,.97],[-.7,.98],[.2,.86],[1.1,.64],[1.8,.46],[2.3,.32],[2.4,.24]],base:.16, // V12 wedge
   cab:[[-1.25,.95],[-.7,1.2],[.1,1.24],[.7,1.0],[1.15,.72]],cabBase:[-1.25,.93,1.15,.7],w:2.06,cw:1.24,wr:.37,wb:1.5,tr:1.05,front:2.4,rear:2.5,headY:.48,tailY:.68,wingY:1.36,wingZ:-2.28},
 mantis:{pts:[[-2.24,.36],[-2.3,.74],[-2.12,.92],[-1.5,.98],[-.7,.98],[.2,.9],[1.0,.72],[1.6,.54],[2.1,.4],[2.2,.28]],base:.2, // longtail mid-engine
   cab:[[-1.2,.95],[-.7,1.2],[.05,1.26],[.6,1.04],[1.05,.74]],cabBase:[-1.2,.93,1.05,.72],w:1.96,cw:1.26,wr:.36,wb:1.36,tr:1.0,front:2.2,rear:2.3,headY:.5,tailY:.82,wingY:1.12,wingZ:-1.95},
 autobahn:{pts:[[-2.55,.4],[-2.6,.76],[-2.45,.98],[-2.1,1.1],[-.6,1.06],[.6,1.04],[1.6,1.0],[2.1,.92],[2.4,.78],[2.45,.3]],base:.18, // four-door fastback on AMG GT 63 4-Door proportions (v4, traced)
   cab:[[-2.16,1.08],[-1.35,1.33],[-.5,1.444],[.3,1.31],[.92,1.04]],cabBase:[-2.16,1.06,.92,1.02],w:1.95,cw:1.4,wr:.36,wb:1.475,tr:.8,front:2.455,rear:2.6,headY:.7,tailY:.93,wingY:1.17,wingZ:-2.35},
 bell:{pts:[[-2.66,.34],[-2.72,.62],[-2.52,.84],[-1.7,.96],[-.7,.99],[.3,.92],[1.2,.76],[1.85,.58],[2.26,.42],[2.3,.3]],base:.2,
   cab:[[-1.2,.94],[-.6,1.24],[.25,1.3],[.85,1.04],[1.25,.78]],cabBase:[-1.2,.92,1.25,.76],w:2.04,cw:1.3,wr:.37,wb:1.5,tr:.94,front:2.3,rear:2.72,headY:.56,tailY:.76,wingY:1.14,wingZ:-2.36},
 hikari:{pts:[[-2.2,.4],[-2.26,.74],[-2.12,.9],[-1.6,.94],[-.8,.96],[.2,.9],[1.1,.8],[1.8,.68],[2.2,.52],[2.26,.38]],base:.22, // fastback drift coupe (sculpted; pts/cab are the fallback profile)
   cab:[[-2.0,.9],[-1.2,1.18],[-.3,1.28],[.35,1.14],[.74,.86]],cabBase:[-2.0,.88,.74,.84],w:1.84,cw:1.3,wr:.375,wb:1.36,tr:.89,front:2.3,rear:2.24,headY:.66,tailY:.76,wingY:1.3,wingZ:-2.0},
 kage:{pts:[[-1.96,.2],[-2.0,.6],[-1.9,.86],[-1.2,.93],[-.4,.9],[.4,.76],[1.3,.8],[1.9,.66],[2.4,.45],[2.52,.2]],base:.12, // Kage R: EV hypercar, venturi tunnels (Blender build; pts/cab are the fallback profile)
   cab:[[-1.0,.92],[-.5,1.0],[.1,1.07],[.8,.98],[1.4,.8]],cabBase:[-1.0,.9,1.4,.78],w:2.02,cw:1.28,wr:.35,wb:1.4,tr:.9,front:2.52,rear:1.96,headY:.57,tailY:.62,wingY:.95,wingZ:-1.78},
 zephyr:{pts:[[-2.62,.22],[-2.68,.46],[-2.48,.6],[-1.6,.66],[-.5,.64],[.5,.56],[1.4,.42],[2.05,.3],[2.42,.22],[2.46,.16]],base:.12,
   cab:[[-.7,.62],[-.15,.9],[.45,.94],[.9,.74],[1.15,.5]],cabBase:[-.7,.6,1.15,.48],w:1.72,cw:1.05,wr:.33,wb:1.48,tr:.9,front:2.46,rear:2.68,headY:.38,tailY:.52,wingY:1.02,wingZ:-2.32,swan:true},
 lumen:{pts:[[-2.08,.36],[-2.14,.7],[-2.04,.92],[-1.55,.98],[-.7,1.0],[.3,.94],[1.15,.82],[1.78,.68],[2.1,.52],[2.14,.36]],base:.24,
   cab:[[-1.55,.96],[-1.05,1.18],[-.25,1.22],[.35,1.06],[.72,.88]],cabBase:[-1.55,.94,.72,.86],w:1.88,cw:1.32,wr:.36,wb:1.28,tr:.96,front:2.14,rear:2.14,headY:.68,tailY:.86,wingY:1.28,wingZ:-1.92},
 brigline:{pts:[[-2.55,.4],[-2.6,.78],[-2.45,.98],[-1.75,1.04],[-.6,1.02],[.5,.99],[1.4,.95],[2.15,.86],[2.48,.74],[2.52,.42]],base:.22,
   cab:[[-2.15,1.04],[-1.35,1.32],[-.15,1.38],[.55,1.24],[.95,.98]],cabBase:[-2.15,1.02,.95,.96],w:1.98,cw:1.44,wr:.4,wb:1.58,tr:.92,front:2.52,rear:2.55,headY:.72,tailY:.88,wingY:1.1,wingZ:-2.35},
 pulse2:{pts:[[-1.92,.28],[-1.98,.62],[-1.88,.84],[-1.2,.9],[-.4,.88],[.5,.8],[1.35,.74],[1.88,.62],[2.28,.44],[2.34,.26]],base:.14,
   cab:[[-1.05,.9],[-.55,1.02],[.15,1.06],[.75,.92],[1.15,.72]],cabBase:[-1.05,.88,1.15,.7],w:1.86,cw:1.28,wr:.35,wb:1.36,tr:.92,front:2.34,rear:1.92,headY:.58,tailY:.72,wingY:1.0,wingZ:-1.78},
 needle:{pts:[[-1.72,.4],[-1.78,.72],[-1.72,.92],[-1.35,.98],[-.55,.96],[.35,.92],[1.05,.84],[1.55,.68],[1.78,.52],[1.82,.38]],base:.28,
   cab:[[-1.68,.98],[-1.52,1.38],[-.35,1.42],[.35,1.22],[.78,.98]],cabBase:[-1.68,.96,.78,.96],w:1.72,cw:1.38,wr:.33,wb:1.12,tr:.94,front:1.82,rear:1.78,headY:.72,tailY:.88,wingY:1.52,wingZ:-1.62}
};
const bronzeM=()=>new THREE.MeshStandardMaterial({color:0x8a5a2b,metalness:1,roughness:.25});
/* Fold a group's direct child meshes into one mesh per material (transforms baked in). A detailed car is
   ~140 small parts; drawn one by one that stalls phone GPUs, merged it's a couple dozen draw calls. */
/* Split a group's multi-material child meshes into one mesh per material group, so mergeByMaterial can fold them in. */
function splitMulti(group){
  group.children.slice().forEach(o=>{ if(!o.isMesh||o.isInstancedMesh||!Array.isArray(o.material)||o.children.length||!o.geometry.groups.length) return;
    const G=o.geometry, byMat=new Map();
    G.groups.forEach(gr=>{ const m=o.material[gr.materialIndex]; if(!m) return; if(!byMat.has(m)) byMat.set(m,[]); const L=byMat.get(m);
      for(let i=gr.start;i<gr.start+gr.count;i++) L.push(G.index?G.index.getX(i):i); });
    byMat.forEach((ix,m)=>{ const g=new THREE.BufferGeometry(); for(const k in G.attributes) g.setAttribute(k,G.attributes[k]); g.setIndex(ix);
      const part=new THREE.Mesh(g,m); part.position.copy(o.position); part.quaternion.copy(o.quaternion); part.scale.copy(o.scale); part.renderOrder=o.renderOrder; group.add(part); });
    group.remove(o); });
}
function mergeByMaterial(group){
  const buckets=new Map();
  group.children.slice().forEach(o=>{ if(!o.isMesh||o.isInstancedMesh||Array.isArray(o.material)||o.children.length) return;
    if(!buckets.has(o.material)) buckets.set(o.material,[]); buckets.get(o.material).push(o); });
  buckets.forEach((list,mat)=>{ if(list.length<2) return;
    let n=0; const parts=list.map(o=>{ o.updateMatrix(); const g=(o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone()).applyMatrix4(o.matrix); n+=g.attributes.position.count; return g; });
    const pos=new Float32Array(n*3), nor=new Float32Array(n*3), uv=new Float32Array(n*2); let k=0;
    parts.forEach(g=>{ const c=g.attributes.position.count; pos.set(g.attributes.position.array,k*3);
      if(g.attributes.normal) nor.set(g.attributes.normal.array,k*3); if(g.attributes.uv) uv.set(g.attributes.uv.array,k*2); k+=c; g.dispose(); });
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(pos,3)); geo.setAttribute('normal',new THREE.BufferAttribute(nor,3)); geo.setAttribute('uv',new THREE.BufferAttribute(uv,2));
    list.forEach(o=>group.remove(o)); const m=new THREE.Mesh(geo,mat); m.renderOrder=list[0].renderOrder; group.add(m); });
}
/* ---- Volcano P1: a sculpted body instead of an extruded side profile ----
   Built with the threejs-skills patterns: a custom BufferGeometry loft (cross-sections swept along the car,
   computeVertexNormals), TubeGeometry along Catmull-Rom curves for the light signatures, ExtrudeGeometry for the
   airfoil wing, splitter and intakes, a CanvasTexture carbon weave under a clear coat, and a fresnel rim injected
   into the physical paint with onBeforeCompile so the silhouette still reads at night. */
function kfCR(keys,z){ // Catmull-Rom through [z,value] keys
  let i=0; while(i<keys.length-2&&z>keys[i+1][0]) i++;
  const p0=keys[Math.max(0,i-1)],p1=keys[i],p2=keys[i+1],p3=keys[Math.min(keys.length-1,i+2)];
  const t=clamp((z-p1[0])/(p2[0]-p1[0]),0,1), t2=t*t, t3=t2*t;
  return .5*(2*p1[1]+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3);
}
// sweep a half cross-section (bottom-center → top-center, mirrored) through stations along z; capped ends
function refineSection(pts){ const out=[]; for(let i=0;i<pts.length;i++){ out.push(pts[i]); if(i===pts.length-1) break;
    const a=pts[Math.max(0,i-1)], b=pts[i], c=pts[i+1], d=pts[Math.min(pts.length-1,i+2)];
    out.push([(-a[0]+9*b[0]+9*c[0]-d[0])/16,(-a[1]+9*b[1]+9*c[1]-d[1])/16]); } return out; } // Catmull-Rom at t=.5
function loftGeo(stations){ if(CAR_BODY_DETAIL>1&&stations.length&&stations[0].pts.length<24) stations=stations.map(st=>({z:st.z,pts:refineSection(st.pts)}));
  const S=stations.length, m=stations[0].pts.length, n=2*(m-1), pos=[], uv=[], idx=[];
  const ring=st=>st.pts.concat(st.pts.slice(1,-1).reverse().map(([x,y])=>[-x,y]));
  stations.forEach((st,i)=>{ ring(st).forEach(([x,y],j)=>{ pos.push(x,y,st.z); uv.push(j/n,i/(S-1)); }); });
  for(let i=0;i<S-1;i++) for(let j=0;j<n;j++){ const a=i*n+j, b=i*n+(j+1)%n, c=(i+1)*n+j, d=(i+1)*n+(j+1)%n; idx.push(a,b,c,b,d,c); }
  [[0,-1],[S-1,1]].forEach(([i,dir])=>{ const r=ring(stations[i]), base=pos.length/3; let cx=0,cy=0; r.forEach(([x,y])=>{ cx+=x/n; cy+=y/n; });
    pos.push(cx,cy,stations[i].z); uv.push(.5,.5); r.forEach(([x,y])=>{ pos.push(x,y,stations[i].z); uv.push(.5+x*.3,.5+y*.3); });
    for(let j=0;j<n;j++){ const a=base+1+j, b=base+1+(j+1)%n; if(dir>0) idx.push(base,a,b); else idx.push(base,b,a); } });
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
let CARBON_M=null;
function carbonMat(){ if(CARBON_M) return CARBON_M;
  const tex=CT(canvasTex(64,64,(g,w,h)=>{ g.fillStyle='#0b0c0e'; g.fillRect(0,0,w,h); // 2x2 twill weave
    for(let y=0;y<8;y++) for(let x=0;x<8;x++){ const on=((x+y)>>1)%2===0; const gr=g.createLinearGradient(x*8,y*8,x*8+(on?8:0),y*8+(on?0:8));
      gr.addColorStop(0,on?'#26292e':'#15171a'); gr.addColorStop(.5,on?'#3a3e45':'#1d2024'); gr.addColorStop(1,on?'#1c1f23':'#101214'); g.fillStyle=gr; g.fillRect(x*8,y*8,8,8); } }),true);
  tex.repeat.set(10,10);
  return CARBON_M=new THREE.MeshPhysicalMaterial({map:tex,color:0xb8bcc4,metalness:.35,roughness:.42,clearcoat:1,clearcoatRoughness:.06,envMapIntensity:1.1});
}
/* ---- shared kit for the sculpted cars (Kage R, Overload 3K, Volcano P1) ---- */
const LENS_M=new THREE.MeshPhysicalMaterial({color:0xffffff,metalness:0,roughness:.02,clearcoat:1,clearcoatRoughness:.02,transparent:true,opacity:.26,depthWrite:false,envMapIntensity:2});
const GLOSS_BLACK=new THREE.MeshPhysicalMaterial({color:0x07080a,metalness:.3,roughness:.12,clearcoat:1,clearcoatRoughness:.03});
function rimPaint(paint,col,k){ // fresnel rim (threejs-shaders: onBeforeCompile) so the silhouette reads against a dark street
  paint.onBeforeCompile=sh=>{ sh.uniforms.rimCol={value:new THREE.Color(col)}; sh.uniforms.rimK={value:k||.32};
    sh.fragmentShader='uniform vec3 rimCol;\nuniform float rimK;\n'+sh.fragmentShader.replace('#include <emissivemap_fragment>',
      '#include <emissivemap_fragment>\n  float fres=pow(1.0-clamp(abs(dot(normalize(vViewPosition),normal)),0.0,1.0),3.0);\n  totalEmissiveRadiance+=rimCol*fres*rimK;'); };
  paint.customProgramCacheKey=()=>'sculptRim';
}
function carKit(g){
  const K={carbon:carbonMat()};
  K.add=(geo,m,x,y,z)=>{ const o=new THREE.Mesh(geo,m); o.position.set(x||0,y||0,z||0); g.add(o); return o; };
  K.tube=(pts,r,m,seg,rs)=>K.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2]))),seg||36,r,rs||8,false),m);
  K.lens=(x,y,z,sx,sy,sz,rx,ry)=>{ const l=K.add(new THREE.SphereGeometry(1,18,10),LENS_M,x,y,z); l.scale.set(sx,sy,sz); l.rotation.set(rx||0,ry||0,0); return l; };
  K.glow=(c,s,x,y,z)=>{ const o=glowSprite(c,s); o.position.set(x,y,z); g.add(o); return o; };
  K.airfoil=(chord,thick,span,m)=>{ const af=new THREE.Shape(), c=chord, t=thick; af.moveTo(0,0); af.bezierCurveTo(.03*c,.9*t,.25*c,1.2*t,.52*c,t); af.bezierCurveTo(.76*c,.7*t,.93*c,.25*t,c,0);
    af.bezierCurveTo(.86*c,-.1*t,.5*c,-.22*t,.24*c,-.22*t); af.bezierCurveTo(.08*c,-.2*t,0,-.14*t,0,0);
    const geo=new THREE.ExtrudeGeometry(af,{depth:span,bevelEnabled:true,bevelThickness:.006,bevelSize:.006,bevelSegments:3,curveSegments:16}); geo.translate(0,0,-span/2); return geo; };
  K.scoop=(len,h,m)=>{ const sh=new THREE.Shape(); sh.moveTo(0,0); sh.bezierCurveTo(.25*len,-.06*h,.72*len,.05*h,len,.45*h); sh.bezierCurveTo(1.04*len,.75*h,.9*len,h,.78*len,h);
    sh.bezierCurveTo(.48*len,.85*h,.15*len,.45*h,0,0); return new THREE.ExtrudeGeometry(sh,{depth:.06,bevelEnabled:true,bevelThickness:.01,bevelSize:.01,bevelSegments:3,curveSegments:16}); };
  return K;
}
/* lofted body: half cross-sections swept along the car (threejs-geometry: custom BufferGeometry + computeVertexNormals) */
function sculptBody(g,S,paint,K){
  // wheel clearance: a long, low swell over each wheel (not a tight circular hump), so shoulders and bonnets run straight
  const arch=z=>{ let a=0; [S.WB,-S.WB].forEach(zw=>{ const dz=z-zw, R=S.WR+.06, L=R*2.1; if(Math.abs(dz)<L){ const t=dz/L; a=Math.max(a,S.WR+R*.92*(1-t*t)*(1-.35*t*t)+.01); } }); return a; };
  const sec=z=>{ const tn=clamp((z-(S.Z1-.26))/.26,0,1), taper=1-(S.taper!=null?S.taper:.14)*tn*tn; // one cross-section; the nose closes smoothly
    const yb=kfCR(S.ybK,z)+.03*tn*tn, hs=kfCR(S.hwS,z)*taper, hl=Math.min(kfCR(S.hwL,z)*taper,hs-.08), yc=kfCR(S.ycK,z);
    const ay=Math.max(arch(z),yb+.16), ys=Math.max(kfCR(S.ysK,z),ay+.05), yf=lerp(Math.max(kfCR(S.yfK,z),ys+.06),Math.max(yc+.03,ys+.04),tn), ht=hs-(S.inset||.15);
    return {yb,hs,hl,yc,ay,ys,yf,ht}; };
  const st=[], NS=Math.round((S.NS||48)*CAR_BODY_DETAIL);
  for(let i=0;i<NS;i++){ const z=S.Z0+(S.Z1-S.Z0)*i/(NS-1), c=sec(z);
    st.push({z,pts:[[0,c.yb],[c.hl*.9,c.yb],[c.hl,c.yb+.05],[c.hl,c.ay],[c.hs*.985,Math.max(c.ys-.08,c.ay+.02)],[c.hs,c.ys],[c.hs-.05,c.ys+.07],[c.ht,c.yf],[c.ht*.5,(c.yf+c.yc)/2+.015],[0,c.yc]]}); }
  K.add(loftGeo(st),paint);
  // floor pan so the car sits on something, and dark arch liners so the arches read as openings
  K.add(new THREE.BoxGeometry(1.4,.05,(S.Z1-S.Z0)-1.3),GLOSS_BLACK,0,Math.min(...S.ybK.map(k=>k[1]))-.04,(S.Z0+S.Z1)/2); // floor pan just under the lowest sill
  const liner=new THREE.MeshBasicMaterial({color:0x040405,side:THREE.DoubleSide});
  [1,-1].forEach(sd=>[S.WB,-S.WB].forEach(zw=>{ const l=K.add(new THREE.CylinderGeometry(S.WR+.07,S.WR+.07,.3,16,1,true,.8,Math.PI-1.6),liner,sd*.88,S.WR,zw); l.rotation.z=Math.PI/2; }));
  const T={yc:z=>kfCR(S.ycK,z), yf:z=>kfCR(S.yfK,z), hs:z=>kfCR(S.hwS,z), ys:z=>kfCR(S.ysK,z)};
  // flank point at height y for station z (for placing lines on the body side)
  T.side=(z)=>kfCR(S.hwS,z)+.004;
  T.sec=sec;
  T.top=(x,z)=>{ const c=sec(z), ax=Math.abs(x), h2=c.ht*.5, m=(c.yf+c.yc)/2+.015; // upper-surface height at lateral offset x (hood, deck)
    return ax<h2?lerp(c.yc,m,ax/h2):lerp(m,c.yf,clamp((ax-h2)/(c.ht-h2),0,1)); };
  return T;
}
/* teardrop / bubble canopy with an optional roof skin and black window trim */
function sculptCanopy(g,C,T,glass,roofM,K){
  const dome=(z0,z1,a0,sc,lift)=>{ const st=[], NC=Math.round(22*CAR_BODY_DETAIL); for(let i=0;i<NC;i++){ const z=z0+(z1-z0)*i/(NC-1), cw=kfCR(C.cwK,z)*sc, top=kfCR(C.htK,z)*(1+(sc-1)*.5)+lift, base=T.yc(z)-.03;
      const pts=[[0,a0>0?base+(top-base)*.55:base],[cw*Math.cos(a0),a0>0?base+(top-base)*Math.sin(a0):base]];
      for(let k=1;k<=5;k++){ const a=a0+(Math.PI/2-a0)*k/6; pts.push([cw*Math.cos(a)*(1-(C.tumble||.06)*Math.sin(a)),base+(top-base)*Math.pow(Math.sin(a),C.pow||.8)]); }
      pts.push([0,top]); st.push({z,pts}); } return loftGeo(st); };
  K.add(dome(C.z0,C.z1,0,1,0),glass);
  if(C.roof) K.add(dome(C.roof[0],C.roof[1],C.roofA||.95,1.02,.012),roofM);
  // window trim (DLO) along the base of the glass on both sides
  [1,-1].forEach(sd=>{ const pts=[]; for(let i=0;i<=12;i++){ const z=C.z0+.12+(C.z1-C.z0-.24)*i/12; pts.push([sd*kfCR(C.cwK,z)*.985,T.yc(z)-.005,z]); } K.tube(pts,.016,GLOSS_BLACK,30); });
  return z=>kfCR(C.htK,z);
}

/* ---- Volcano P1 ---- */
function p1Shell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,def.rimGlow||0xffb040,.32);
  const WB=B.wb, WR=B.wr;
  const T=sculptBody(g,{Z0:-2.3,Z1:2.22,WB,WR,NS:46,
    hwS:[[-2.3,.9],[-2.0,.99],[-1.36,1.03],[-.8,.96],[-.25,.9],[.45,.92],[1.36,.98],[1.85,.95],[2.22,.86]],
    ysK:[[-2.3,.74],[-1.36,.76],[-.5,.62],[.5,.58],[1.36,.6],[1.85,.52],[2.22,.42]],
    yfK:[[-2.3,.92],[-1.7,.98],[-1.0,.94],[-.25,.84],[.6,.76],[1.3,.7],[1.75,.62],[2.05,.55],[2.22,.5]],
    ycK:[[-2.3,.9],[-1.7,.95],[-1.0,.92],[-.25,.84],[.6,.72],[1.1,.64],[1.6,.56],[2.0,.5],[2.22,.46]],
    hwL:[[-2.3,.78],[-1.8,.78],[-1.36,.74],[-.8,.86],[0,.9],[.8,.86],[1.36,.72],[1.9,.72],[2.22,.62]],
    ybK:[[-2.3,.32],[-2.05,.2],[-1.8,.18],[1.9,.18],[2.1,.2],[2.22,.26]]},paint,K);
  const top=sculptCanopy(g,{z0:-1.55,z1:.98,cwK:[[-1.55,.2],[-1.25,.52],[-.6,.64],[.1,.63],[.6,.52],[.98,.26]],htK:[[-1.55,.9],[-1.15,1.08],[-.55,1.19],[0,1.18],[.5,1.02],[.98,.74]],roof:[-1.3,.3]},T,glass,paint,K);
  const snork=[]; for(let i=0;i<10;i++){ const z=-.95+.6*i/9, t=top(z)*1.01+.012, h=.025+.075*(i/9); snork.push({z,pts:[[0,t-.02],[.09,t-.02],[.1,t+h*.6],[.06,t+h],[0,t+h+.01]]}); }
  K.add(loftGeo(snork),paint); K.add(new THREE.PlaneGeometry(.15,.07),gapM,0,top(-.35)*1.01+.07,-.345);
  const hy=T.top(.6,1.9)-.5; // lamps ride on the hood surface
  [1,-1].forEach(sd=>{
    K.tube([[sd*.4,.52+hy,2.02],[sd*.6,.555+hy,1.95],[sd*.75,.53+hy,1.86],[sd*.82,.45+hy,1.8]],.034,GLOSS_BLACK,20); // recess
    K.tube([[sd*.42,.545+hy,2.01],[sd*.6,.58+hy,1.945],[sd*.74,.555+hy,1.855],[sd*.8,.48+hy,1.81]],.014,headM,20); // boomerang LED
    K.tube([[sd*.62,.26,2.12],[sd*.72,.34,2.06],[sd*.78,.44,1.98]],.03,carbon,10);
    K.tube([[0,.815,-2.315],[sd*.45,.815,-2.315],[sd*.72,.79,-2.305],[sd*.8,.7,-2.3],[sd*.78,.56,-2.3],[sd*.66,.52,-2.3]],.024,tailM,28);
    K.glow(0xff2030,.9,sd*.78,.66,-2.36);
    const it=K.add(K.scoop(.84,.36),carbon,sd>0?.89:-.95,.35,-.16); it.rotation.y=Math.PI/2;
    const ms=K.add(new THREE.BoxGeometry(.05,.03,.16),carbon,sd*.74,.8,.46); ms.rotation.z=sd*-.35;
    const mp=K.add(new THREE.SphereGeometry(1,14,10),carbon,sd*.84,.85,.44); mp.scale.set(.1,.058,.085);
    K.add(new THREE.PlaneGeometry(.13,.06),lensM,sd*.84,.85,.36).rotation.y=Math.PI;
    K.tube([[sd*.925,.26,.56],[sd*.94,.5,.54],[sd*.93,.66,.5],[sd*.8,.76,.42]],.006,gapM,16); // dihedral door shut line
    K.tube([[sd*.3,T.yc(1.62)+.012,1.62],[sd*.55,T.yf(1.5)+.004,1.5],[sd*.7,T.yf(1.1)+.004,1.1]],.005,gapM,12); // front clam shut line
  });
  K.tube([[-.62,.26,2.12],[-.3,.215,2.18],[0,.205,2.2],[.3,.215,2.18],[.62,.26,2.12]],.045,carbon,24);
  K.add(new THREE.BoxGeometry(1.1,.07,.1),gapM,0,.25,2.12);
  { const sp=new THREE.Shape(); sp.moveTo(-.8,1.86); sp.quadraticCurveTo(-.76,2.2,0,2.25); sp.quadraticCurveTo(.76,2.2,.8,1.86); sp.lineTo(-.8,1.86);
    const m=K.add(new THREE.ExtrudeGeometry(sp,{depth:.03,bevelEnabled:false}),carbon,0,.2,0); m.rotation.x=Math.PI/2; }
  [1,-1].forEach(sd=>{ const d=K.add(new THREE.BoxGeometry(.26,.012,.3),gapM,sd*.28,T.yc(1.25)+.035,1.25); d.rotation.x=.18; });
  for(let i=0;i<6;i++){ const z=-1.62-i*.07; const l=K.add(new THREE.BoxGeometry(.72,.012,.035),carbon,0,T.yc(z)+.008,z); l.rotation.x=-.08; }
  { const rs=new THREE.Shape(); rs.moveTo(-.64,.54); rs.lineTo(.64,.54); rs.quadraticCurveTo(.76,.62,.72,.78); rs.lineTo(-.72,.78); rs.quadraticCurveTo(-.76,.62,-.64,.54);
    K.add(new THREE.ShapeGeometry(rs),gapM,0,0,-2.308).rotation.y=Math.PI;
    for(let i=0;i<5;i++) K.add(new THREE.BoxGeometry(1.36,.01,.02),carbon,0,.58+i*.045,-2.312); }
  [1,-1].forEach(sd=>{ const t=K.add(new THREE.CylinderGeometry(.075,.085,.22,18,1,true),exhM,sd*.11,.66,-2.33); t.rotation.x=Math.PI/2;
    K.add(new THREE.CircleGeometry(.07,18),gapM,sd*.11,.66,-2.25).rotation.y=Math.PI; });
  for(let i=0;i<7;i++) K.add(new THREE.BoxGeometry(.02,.16,.5),carbon,-.6+i*.2,.24,-2.08);
  K.add(new THREE.BoxGeometry(1.5,.03,.5),carbon,0,.17,-2.08);
  { const pr=K.add(new THREE.PlaneGeometry(.42,.11),new THREE.MeshStandardMaterial({map:plateTex(def.plate||'P1'),roughness:.5}),0,.44,-2.29); pr.rotation.y=Math.PI; pr.rotation.x=-.2; }
  { const wy=T.top(0,-2.1)+.13; const w=K.add(K.airfoil(.5,.05,1.78),paint,0,wy,-1.86); w.rotation.y=Math.PI/2; w.rotation.z=.06;
    [1,-1].forEach(sd=>{ K.add(new THREE.BoxGeometry(.03,.12,.34),carbon,sd*.5,wy-.07,-2.12);
      K.add(new THREE.BoxGeometry(.012,.16,.5),carbon,sd*.9,wy-.02,-2.1); }); }
  [[0xcfe6ff,1.0,.6,.53,1.98],[0xcfe6ff,1.0,-.6,.53,1.98],[0xff2030,.8,0,.82,-2.36]].forEach(a=>K.glow(a[0],a[1],a[2],a[3],a[4]));
  return T;
}

/* ---- Volcano P1 (Blender build): an original hypercar modeled in Blender and loaded as models/volcano_p1.glb ----
   threejs-loaders: GLTFLoader (r128 examples/js global) runs before the game boots (see the bootstrap at the end of this file).
   Each Blender material name maps onto the game's own materials, so the car keeps the clear-coat paint, fresnel rim,
   carbon weave and blooming lamps the rest of the archive uses. Falls back to the procedural p1Shell if the file is missing. */
const GLB_PARTS={}; // model key -> [{geo, key}] baked once, shared by every car built from it
function glbParts(model,lod){ const L=lod&&(window.AH_MODELS_LOD||{})[model]; if(lod&&!L) return glbParts(model); // rivals: ~30% triangle twin (models/lod, loaded in the background); full model until it lands
  const ck=L?model+':lod':model; if(GLB_PARTS[ck]!==undefined) return GLB_PARTS[ck];
  const src=L||(window.AH_MODELS||{})[model]; if(!src) return null; // not loaded (yet): don't cache the miss, it may arrive after boot
  src.updateMatrixWorld(true); const parts=[];
  src.traverse(o=>{ if(!o.isMesh) return; const g=o.geometry.clone().applyMatrix4(o.matrixWorld), key=(o.material&&o.material.name||'PAINT').split('.')[0];
    if(key==='CARBON'){ // no UVs from Blender: box-project so the twill weave has something to sample (threejs-textures)
      const P=g.attributes.position, N=g.attributes.normal, uv=new Float32Array(P.count*2);
      for(let i=0;i<P.count;i++){ const nx=Math.abs(N.getX(i)), ny=Math.abs(N.getY(i)), nz=Math.abs(N.getZ(i)), x=P.getX(i), y=P.getY(i), z=P.getZ(i);
        const [u,v]=nx>=ny&&nx>=nz?[z,y]:(ny>=nz?[x,z]:[x,y]); uv[i*2]=u*1.6; uv[i*2+1]=v*1.6; }
      g.setAttribute('uv',new THREE.BufferAttribute(uv,2)); }
    g.userData.shared=true; parts.push({geo:g,key}); }); // shared by every car built from this model: clearRacers must not free its GPU buffers
  return (GLB_PARTS[ck]=parts); }
const volcanoParts=o=>glbParts('volcano',o&&o.lod);
function volcanoShell(g,def,B,paint,glass,opts){
  const parts=volcanoParts(opts); if(!parts) return p1Shell(g,def,B,paint,glass,opts);
  const K=carKit(g); rimPaint(paint,def.rimGlow||0xffb040,.3);
  const MATS={PAINT:paint,CARBON:K.carbon,GLASS:glass,GLOSSBLACK:GLOSS_BLACK,GAP:gapM,HEAD:headM,TAIL:tailM,CHROME:exhM,LENS:LENS_M};
  parts.forEach(p=>g.add(new THREE.Mesh(p.geo,MATS[p.key]||paint)));
  { const pr=K.add(new THREE.PlaneGeometry(.4,.1),new THREE.MeshStandardMaterial({map:plateTex(def.plate||'P1'),roughness:.5}),0,.265,-2.345); pr.rotation.y=Math.PI; }
  [1,-1].forEach(sd=>{ K.glow(0xcfe6ff,.95,sd*.66,.5,2.1); K.glow(0xff2030,.8,sd*.84,.66,-2.38); });
  K.glow(0xff2030,.7,0,.74,-2.38);
  // side-section sampler for the street vinyl: same curves as the Blender loft (HS / YS / YB keys)
  const HS=[[-2.32,.93],[-2.1,1.05],[-1.6,1.12],[-1.2,1.1],[-.7,1.0],[-.1,.965],[.6,.985],[1.1,1.06],[1.5,1.08],[1.95,1.02],[2.26,.86]],
    YS=[[-2.32,.58],[-1.6,.58],[-.9,.52],[0,.48],[.8,.48],[1.4,.5],[1.95,.44],[2.26,.36]], YB=[[-2.32,.3],[-2.12,.19],[-1.9,.165],[1.9,.165],[2.12,.2],[2.26,.27]];
  return {sec:z=>{ const hs=kfCR(HS,z), ys=kfCR(YS,z), yb=kfCR(YB,z); return {hs,ys,yb,hl:hs-.14,ay:ys-.1,yc:ys+.25,yf:ys+.25}; }};
}

/* ---- AUTOBAHN 63 (Blender build, v2): an original four-door GT modeled in Blender (tools/blender/autobahn_63.py) ----
   Proportioned from side-view refs of the class: long hood with the cowl behind the front axle, convex sides that swell over
   both axles into wide hips, a low tumblehome glasshouse falling to a ducktail, gloss-black sills/valance, flush lower aero.
   Blender material names map onto the game's materials; the procedural autobahnShell stays as the fallback. */
const PLATE_Z=-2.565, HEAD_Z=2.42, TAIL_Z=-2.44; // lamp glow / plate stations measured off the v4 GLB
const AB_TAILW=new THREE.MeshBasicMaterial({color:0xfff0f0,toneMapped:false}); // white-hot LED slashes in the tail clusters
const AB_GRILLE=new THREE.MeshStandardMaterial({color:0x0c0d10,metalness:.3,roughness:.55});
const AB_REFLECT=new THREE.MeshStandardMaterial({color:0x7a0a0e,roughness:.3,metalness:.1});
const AB_CABIN=new THREE.MeshStandardMaterial({color:0x0e0e10,roughness:.8,metalness:0});
function autobahnGlbShell(g,def,B,paint,glass,opts){
  const parts=glbParts('autobahn',opts&&opts.lod); if(!parts) return autobahnShell(g,def,B,paint,glass,opts);
  const K=carKit(g); rimPaint(paint,0x7fa6ff,.1); paint.clearcoat=1; paint.clearcoatRoughness=.008; paint.roughness=Math.min(paint.roughness,.1); paint.envMapIntensity=1.5;
  const satin=new THREE.MeshStandardMaterial({color:0x3c4047,metalness:.9,roughness:.32});
  const MATS={PAINT:paint,CARBON:K.carbon,GLASS:WISP_GLASS,GLOSSBLACK:GLOSS_BLACK,GAP:gapM,HEAD:headM,TAIL:tailM,TAILW:AB_TAILW,CHROME:chromeTrimM,LENS:LENS_M,SATIN:satin,GRILLE:AB_GRILLE,REFLECT:AB_REFLECT,INTERIOR:AB_CABIN};
  parts.forEach(p=>{ const m=new THREE.Mesh(p.geo,MATS[p.key]||paint); if(p.key==='GLASS') m.renderOrder=3; g.add(m); });
  { const pr=K.add(new THREE.PlaneGeometry(.5,.12),new THREE.MeshStandardMaterial({map:plateTex(def.plate||'AUTOBAHN'),roughness:.5}),0,.79,PLATE_Z); pr.rotation.y=Math.PI; }
  [1,-1].forEach(sd=>{ K.glow(0xcfe6ff,.3,sd*.64,.69,HEAD_Z); K.glow(0xff2030,.28,sd*.68,.93,TAIL_Z); });
  K.glow(0xff2030,.2,0,.936,-2.5);
  // side-section sampler for the street vinyl: same keys as the Blender loft (HW / YS / YB in autobahn_63.py)
  const HS=[[-2.6,.7],[-2.55,.78],[-2.45,.86],[-2.3,.92],[-2.0,.962],[-1.5,.977],[-1.0,.955],[-.4,.925],[.3,.92],[.9,.94],[1.475,.962],[1.9,.945],[2.1,.92],[2.25,.87],[2.36,.8],[2.425,.7],[2.455,.58]],
    YS=[[-2.6,.6],[-2.55,.69],[-2.47,.79],[-2.38,.89],[-2.2,.96],[-1.9,1.02],[-1.6,1.04],[-1.0,1.02],[-.3,.995],[.5,.985],[.95,.975],[1.475,.945],[1.95,.885],[2.2,.825],[2.38,.755],[2.455,.64]],
    YB=[[-2.6,.4],[-2.55,.27],[-2.4,.17],[2.2,.18],[2.39,.21],[2.455,.28]];
  return {sec:z=>{ const hs=kfCR(HS,z), ys=kfCR(YS,z), yb=kfCR(YB,z); return {hs,ys,yb,hl:hs-.06,ay:ys-.12,yc:ys+.1,yf:ys+.1}; }};
}

/* ---- Kage R (Blender build): an electric hypercar modeled in Blender (tools/blender/kage_r.py) ----
   From a four-view sheet: pod front fenders over a low hood valley with vertical LED blades, a black teardrop canopy,
   a scallop carved through each door into a dark haunch intake, and two venturi tunnels through the tail ringed in red.
   Blender material names map onto the game's materials; the procedural p1Shell stays as the fallback. */
function kageShell(g,def,B,paint,glass,opts){
  const parts=glbParts('kage',opts&&opts.lod); if(!parts) return p1Shell(g,def,B,paint,glass,opts);
  const K=carKit(g); rimPaint(paint,0x9cc6ff,.1); paint.clearcoat=1; paint.clearcoatRoughness=.01; paint.roughness=Math.min(paint.roughness,.12);
  const MATS={PAINT:paint,CARBON:K.carbon,GLASS:glass,GLOSSBLACK:GLOSS_BLACK,GAP:gapM,HEAD:headM,TAIL:tailM,CHROME:chromeTrimM,LENS:LENS_M};
  parts.forEach(p=>g.add(new THREE.Mesh(p.geo,MATS[p.key]||paint)));
  [1,-1].forEach(sd=>{ K.glow(0xcfe6ff,.5,sd*.8,.57,2.12); K.glow(0xff2030,.16,sd*.82,.58,-2.0); }); // lamp stations measured off the GLB; tail glow kept small so the tunnels stay black inside a thin red ring
  K.glow(0xff2030,.12,0,.24,-1.95);
  // side-section sampler for the street vinyl: same keys as the Blender loft (HW / YS / YB in kage_r.py)
  const HS=[[-1.96,.94],[-1.86,1.0],[-1.6,1.02],[-1.3,1.02],[-.95,.98],[-.55,.92],[-.1,.88],[.5,.88],[1.0,.95],[1.4,.985],[1.85,.97],[2.15,.92],[2.38,.82],[2.52,.66]],
    YS=[[-1.96,.6],[-1.4,.58],[-.9,.62],[-.55,.7],[0,.72],[.6,.72],[.95,.66],[1.4,.5],[2.0,.44],[2.35,.4],[2.52,.37]],
    YB=[[-1.96,.2],[-1.84,.12],[-1.6,.1],[2.0,.1],[2.3,.14],[2.52,.18]];
  return {sec:z=>{ const hs=kfCR(HS,z), ys=kfCR(YS,z), yb=kfCR(YB,z); return {hs,ys,yb,hl:hs-.1,ay:ys-.12,yc:ys+.02,yf:ys+.02}; }};
}

/* ---- Overload 3K (Blender build): quad-motor EV hypercar modeled in Blender (tools/blender/overload_3k.py), loaded as models/overload_3k.glb ----
   Traced off the Gemini blueprint of the seed-locked Midjourney set. ACCENT is the cyan light-blade material (unlit, blooms).
   The procedural overloadShell below stays as the fallback until the file lands. */
function overloadGlbShell(g,def,B,paint,glass,opts){
  const parts=glbParts('overload',opts&&opts.lod); if(!parts) return overloadShell(g,def,B,paint,glass,opts);
  const K=carKit(g), cy=def.accent||0x2fe6ff; rimPaint(paint,cy,.16); paint.clearcoat=1; paint.clearcoatRoughness=.012;
  const blade=new THREE.MeshBasicMaterial({color:cy,toneMapped:false});
  const bubble=new THREE.MeshPhysicalMaterial({color:0x061a22,metalness:.2,roughness:.02,clearcoat:1,clearcoatRoughness:.02,reflectivity:1,envMapIntensity:2});
  const MATS={PAINT:paint,CARBON:K.carbon,GLASS:bubble,GLOSSBLACK:GLOSS_BLACK,GAP:gapM,HEAD:headM,TAIL:tailM,ACCENT:blade,LENS:LENS_M};
  parts.forEach(p=>{ const m=new THREE.Mesh(p.geo,MATS[p.key]||paint); if(p.key==='GLASS') m.renderOrder=3; g.add(m); });
  { const pr=K.add(new THREE.PlaneGeometry(.4,.1),new THREE.MeshStandardMaterial({map:plateTex(def.plate||'3K'),roughness:.5}),0,.34,-2.47); pr.rotation.y=Math.PI; }
  [1,-1].forEach(sd=>{ K.glow(0xcfe6ff,.5,sd*.82,.62,2.2); K.glow(cy,.3,sd*.55,.55,-2.46); });
  K.glow(0xff2030,.3,0,.61,-2.46);
  // side-section sampler for the street vinyl: same keys as the Blender loft (HW / YS / YB in overload_3k.py)
  const HS=[[-2.45,.6],[-2.4,.84],[-2.3,.95],[-2.2,1.0],[-1.5,1.03],[-.8,.97],[0,.93],[.8,.95],[1.5,1.02],[2.2,1.0],[2.3,.95],[2.4,.85],[2.5,.66],[2.55,.44]],
    YS=[[-2.45,.7],[-2.3,.8],[-2.0,.86],[-1.5,.88],[-1.0,.83],[-.5,.74],[0,.7],[.6,.72],[1.1,.78],[1.5,.82],[1.9,.74],[2.2,.64],[2.4,.55],[2.55,.43]],
    YB=[[-2.45,.3],[-2.3,.18],[-2.0,.12],[2.1,.12],[2.4,.15],[2.55,.24]];
  return {sec:z=>{ const hs=kfCR(HS,z), ys=kfCR(YS,z), yb=kfCR(YB,z); return {hs,ys,yb,hl:hs-.1,ay:ys-.12,yc:ys+.02,yf:ys+.02}; }};
}

/* ---- Overload 3K (procedural fallback): quad-motor EV hypercar, pontoon fenders, bubble canopy, dorsal fin, cyan light blades ---- */
function overloadShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon, cy=def.accent||0x2fe6ff; rimPaint(paint,cy,.16);
  const blade=new THREE.MeshBasicMaterial({color:cy,toneMapped:false});
  const bubble=new THREE.MeshPhysicalMaterial({color:0x061a22,metalness:.2,roughness:.02,clearcoat:1,clearcoatRoughness:.02,reflectivity:1,envMapIntensity:2});
  const WB=B.wb, WR=B.wr;
  const T=sculptBody(g,{Z0:-2.56,Z1:2.46,WB,WR,NS:52,
    hwS:[[-2.56,.9],[-2.2,1.04],[-1.5,1.1],[-.8,.98],[0,.9],[.8,.96],[1.5,1.09],[2.0,.99],[2.46,.72]],
    ysK:[[-2.56,.6],[-1.5,.7],[0,.56],[1.5,.66],[2.1,.46],[2.46,.3]],
    yfK:[[-2.56,.78],[-1.5,.88],[-.6,.72],[.4,.66],[1.5,.88],[2.1,.62],[2.46,.36]],
    ycK:[[-2.56,.7],[-1.8,.82],[-1.0,.84],[0,.72],[.8,.64],[1.5,.62],[2.1,.47],[2.46,.3]],
    hwL:[[-2.56,.84],[-1.5,.76],[-.8,.84],[0,.82],[.8,.84],[1.5,.74],[2.46,.66]],
    ybK:[[-2.56,.28],[-2.3,.16],[2.2,.15],[2.46,.2]]},paint,K);
  const top=sculptCanopy(g,{z0:-1.5,z1:1.22,pow:.65,tumble:.02,cwK:[[-1.5,.18],[-1.1,.44],[-.4,.5],[.3,.48],[.9,.34],[1.22,.14]],htK:[[-1.5,.86],[-1.1,1.06],[-.4,1.18],[.3,1.14],[.9,.92],[1.22,.6]]},T,bubble,null,K);
  // dorsal fin from the canopy to the tail
  { const fs=new THREE.Shape(); fs.moveTo(0,0); fs.lineTo(1.3,0); fs.quadraticCurveTo(.5,.1,0,.42); fs.lineTo(0,0);
    const f=K.add(new THREE.ExtrudeGeometry(fs,{depth:.03,bevelEnabled:true,bevelThickness:.008,bevelSize:.008,bevelSegments:2}),carbon,-.015,T.yc(-2.3)+.02,-2.35); f.rotation.y=-Math.PI/2; }
  K.tube([[0,T.yc(-2.3)+.44,-2.34],[0,T.yc(-1.9)+.26,-1.9],[0,top(-1.4)+.02,-1.42]],.012,blade,16); // fin light edge
  // cyan light blade across the nose, rocker lines, full-width C tail
  K.tube([[-.9,.44,2.16],[-.5,.4,2.36],[0,.37,2.44],[.5,.4,2.36],[.9,.44,2.16]],.018,blade,30);
  [1,-1].forEach(sd=>{
    K.tube([[sd*.7,.47,2.18],[sd*.86,.52,2.0],[sd*.94,.58,1.82]],.02,headM,12); // headlight streak up the pontoon
    K.lens(sd*.83,.52,2.02,.18,.05,.2,.3,sd*.35);
    K.glow(0xcfe6ff,1.0,sd*.82,.52,2.08);
    K.tube([[sd*.86,.2,1.0],[sd*.9,.2,0],[sd*.88,.2,-1.0]],.014,blade,12); // rocker blades
    const it=K.add(K.scoop(1.1,.42),GLOSS_BLACK,sd>0?.86:-.92,.3,-.3); it.rotation.y=Math.PI/2;
    const mp=K.add(new THREE.BoxGeometry(.2,.05,.12),carbon,sd*.62,top(.7)-.15,.7); mp.rotation.z=sd*.2; // camera pods instead of mirrors
    K.add(new THREE.PlaneGeometry(.05,.03),blade,sd*.72,top(.7)-.15,.635).rotation.y=Math.PI;
    K.tube([[sd*.3,.86,-2.555],[sd*.75,.8,-2.54],[sd*.88,.62,-2.5],[sd*.8,.42,-2.52]],.02,tailM,20);
  });
  K.tube([[-.3,.86,-2.555],[.3,.86,-2.555]],.02,tailM,6);
  K.glow(0xff2030,1.2,0,.84,-2.6);
  // open rear with a glowing diffuser
  K.add(new THREE.BoxGeometry(1.5,.3,.03),GLOSS_BLACK,0,.6,-2.54);
  for(let i=0;i<9;i++) K.add(new THREE.BoxGeometry(.02,.24,.7),carbon,-.8+i*.2,.24,-2.25);
  K.add(new THREE.BoxGeometry(1.7,.03,.7),carbon,0,.14,-2.25);
  K.add(new THREE.BoxGeometry(1.5,.02,.02),blade,0,.37,-2.58);
  // splitter and front bumper intakes
  { const sp=new THREE.Shape(); sp.moveTo(-.95,2.0); sp.quadraticCurveTo(-.9,2.5,0,2.58); sp.quadraticCurveTo(.9,2.5,.95,2.0); sp.lineTo(-.95,2.0);
    const m=K.add(new THREE.ExtrudeGeometry(sp,{depth:.03,bevelEnabled:false}),carbon,0,.14,0); m.rotation.x=Math.PI/2; }
  [1,-1].forEach(sd=>K.add(new THREE.BoxGeometry(.5,.12,.06),gapM,sd*.42,.24,2.36));
  // swan-neck wing: struts rise from the deck and hook over onto the top of the airfoil
  { const w=K.add(K.airfoil(.6,.07,2.0),carbon,0,1.42,-2.0); w.rotation.y=Math.PI/2; w.rotation.z=.12;
    [1,-1].forEach(sd=>{ K.tube([[sd*.45,T.yc(-2.05)-.02,-2.05],[sd*.45,1.25,-2.08],[sd*.45,1.52,-2.02],[sd*.45,1.5,-1.86]],.035,carbon,18);
      K.add(new THREE.BoxGeometry(.014,.34,.72),carbon,sd*1.01,1.4,-2.02);
      K.add(new THREE.BoxGeometry(.016,.02,.66),blade,sd*1.02,1.57,-2.02); }); }
  { const pr=K.add(new THREE.PlaneGeometry(.42,.11),new THREE.MeshStandardMaterial({map:plateTex(def.plate||'3000HP'),roughness:.5}),0,.5,-2.56); pr.rotation.y=Math.PI; }
  return T;
}
/* ---- outlaw shells (Hellbound, Tempesta, Mantis, Autobahn) ----
   Same kit as above. bandGeo lays a thin grid over any surface (fn(u,z) gives the point at lateral
   parameter u in 0..1), so stripes, black hoods and sill panels follow the lofted body exactly. */
function bandGeo(fn,z0,z1,n,m,flip){
  m=m||1; const pos=[],uv=[],idx=[];
  for(let i=0;i<=n;i++){ const z=z0+(z1-z0)*i/n; for(let j=0;j<=m;j++){ const p=fn(j/m,z); pos.push(p[0],p[1],z); uv.push(j/m,i/n); } }
  for(let i=0;i<n;i++) for(let j=0;j<m;j++){ const a=i*(m+1)+j, b=a+1, c=a+m+1, d=c+1; if(flip) idx.push(a,b,c,b,d,c); else idx.push(a,c,b,b,c,d); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
function canopyY(C,T,x,z){ const cw=Math.max(kfCR(C.cwK,z),.01), top=kfCR(C.htK,z), base=T.yc(z)-.03, a=Math.acos(clamp(Math.abs(x)/cw,0,1)); return base+(top-base)*Math.pow(Math.sin(a),C.pow||.8); }
function outlawKit(K,T,C){
  // on-surface helpers: top band (hood, deck), roof band, side band (sill), point on the upper surface
  K.top=(x0,x1,z0,z1,m,lift,n)=>{ if(x1<x0) [x0,x1]=[x1,x0]; return K.add(bandGeo((u,z)=>{ const x=lerp(x0,x1,u); return [x,T.top(x,z)+(lift||.005)]; },z0,z1,n||24,6),m); };
  K.roof=(x0,x1,z0,z1,m,lift,n)=>{ if(x1<x0) [x0,x1]=[x1,x0]; return K.add(bandGeo((u,z)=>{ const x=lerp(x0,x1,u); return [x,canopyY(C,T,x,z)+(lift||.02)]; },z0,z1,n||20,6),m); };
  K.sill=(sd,z0,z1,y0,y1,m)=>K.add(bandGeo((u,z)=>{ const c=T.sec(z); return [sd*(c.hl+.006),c.yb+lerp(y0,y1,u)]; },z0,z1,16,1,sd>0),m);
  K.P=(x,z,lift)=>[x,T.top(x,z)+(lift||.012),z];
  K.shut=(sd,z)=>{ const c=T.sec(z); K.tube([[sd*(c.hs+.004),c.ys+.05,z],[sd*(c.hs+.004),c.ys,z],[sd*(c.hs*.985+.004),Math.max(c.ys-.08,c.ay+.02),z],[sd*(c.hl+.006),c.yb+.12,z]],.005,gapM,10); };
  K.mirror=(sd,z,m)=>{ const x=kfCR(C.cwK,z), y=T.top(x,z)+.1; const ms=K.add(new THREE.BoxGeometry(.05,.03,.14),GLOSS_BLACK,sd*(x+.08),y,z); ms.rotation.z=sd*-.3;
    const mp=K.add(new THREE.SphereGeometry(1,14,10),m,sd*(x+.2),y+.03,z-.02); mp.scale.set(.11,.06,.085); K.add(new THREE.PlaneGeometry(.14,.07),lensM,sd*(x+.2),y+.03,z-.11).rotation.y=Math.PI; };
  K.pipe=(x,y,z,r,sides)=>{ const t=K.add(new THREE.CylinderGeometry(r,r*1.08,.2,sides||18,1,true),exhM,x,y,z); t.rotation.x=Math.PI/2; if(sides===6) t.rotation.y=Math.PI/6;
    K.add(new THREE.CircleGeometry(r*.9,sides||18),gapM,x,y,z+.07).rotation.y=Math.PI; };
  K.plate=(def,y,z,tilt)=>{ const pr=K.add(new THREE.PlaneGeometry(.42,.11),new THREE.MeshStandardMaterial({map:plateTex(def.plate||def.name.replace(/[^A-Z0-9]/g,'').slice(0,7)),roughness:.5}),0,y,z); pr.rotation.y=Math.PI; pr.rotation.x=tilt||0; };
  K.splitter=(hw,z0,z1,y)=>{ const sp=new THREE.Shape(); sp.moveTo(-hw,z0); sp.quadraticCurveTo(-hw*.96,z1,0,z1+.06); sp.quadraticCurveTo(hw*.96,z1,hw,z0); sp.lineTo(-hw,z0);
    const m=K.add(new THREE.ExtrudeGeometry(sp,{depth:.03,bevelEnabled:false}),K.carbon,0,y,0); m.rotation.x=Math.PI/2; };
  return K;
}

/* ---- Hellbound 717: widebody muscle coupe. Long flat hood, notchback roof, twin stripes, halo quad lamps ---- */
function hellboundShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0xff6a3a,.2);
  const gold=new THREE.MeshStandardMaterial({color:0xd8b04a,metalness:.85,roughness:.22}), amber=new THREE.MeshBasicMaterial({color:0xffa028,toneMapped:false});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:54,inset:.12,
    hwS:[[-R,.95],[-2.1,1.09],[-WB,1.14],[-.8,1.03],[0,1.01],[.8,1.03],[WB,1.14],[2.1,1.08],[F,.97]],
    ysK:[[-R,.8],[-WB,.86],[0,.82],[WB,.86],[F,.78]],
    yfK:[[-R,.98],[-WB,1.02],[0,1.0],[WB,1.03],[2.2,.99],[F,.92]],
    ycK:[[-R,.96],[-2.0,1.0],[-1.5,1.0],[0,.98],[1.1,1.05],[2.0,1.05],[F,.93]],
    hwL:[[-R,.9],[-WB,.86],[0,.98],[WB,.86],[F,.9]],
    ybK:[[-R,.38],[-2.2,.27],[2.2,.27],[F,.36]]},paint,K);
  const C={z0:-1.55,z1:1.02,tumble:.12,pow:.45,cwK:[[-1.55,.5],[-1.3,.63],[-.6,.69],[.2,.69],[.7,.63],[1.02,.54]],htK:[[-1.55,1.02],[-1.25,1.34],[-.6,1.46],[.2,1.46],[.7,1.31],[1.02,1.06]],roof:[-1.15,.45],roofA:.95};
  sculptCanopy(g,C,T,glass,paint,K); outlawKit(K,T,C);
  // twin black stripes nose to tail, gold pinstripe edges on the hood
  [[.07,.31],[-.31,-.07]].forEach(([a,b])=>{ K.top(a,b,1.05,F-.06,GLOSS_BLACK,.006,28); K.roof(a,b,-1.5,.98,GLOSS_BLACK,.022,24); K.top(a,b,-R+.06,-1.58,GLOSS_BLACK,.006,10);
    [a,b].forEach(e=>{ const o=Math.sign(e)*(Math.abs(e)>.2?.018:-.018); K.top(e,e+o,1.05,F-.06,gold,.009,28); }); });
  // shaker scoop and heat extractors
  { const y=T.top(0,1.72); K.add(new THREE.BoxGeometry(.5,.13,.6),GLOSS_BLACK,0,y+.07,1.72); K.add(new THREE.PlaneGeometry(.42,.07),gapM,0,y+.09,2.022);
    K.add(new THREE.BoxGeometry(.52,.02,.62),carbon,0,y+.14,1.72); }
  [1,-1].forEach(sd=>{ for(let i=0;i<6;i++){ const z=1.5+i*.085; K.add(new THREE.BoxGeometry(.3,.012,.04),gapM,sd*.62,T.top(sd*.62,z)+.006,z); } });
  // front: full-width black grille with halo quad lamps (inner-left one is the ram-air intake), lower grille, splitter
  K.add(new THREE.PlaneGeometry(1.24,.26),GLOSS_BLACK,0,.8,F+.012);
  for(let i=0;i<9;i++) K.add(new THREE.BoxGeometry(1.22,.006,.01),gapM,0,.69+i*.028,F+.016);
  [[.46,1],[.25,1],[-.25,0],[-.46,1]].forEach(([x,lit])=>{ K.add(new THREE.TorusGeometry(.068,.013,8,26),lit?headM:amber,x,.8,F+.03);
    K.add(new THREE.CircleGeometry(.056,22),lit?lensM:gapM,x,.8,F+.024); if(lit) K.glow(0xcfe6ff,.7,x,.8,F+.08); });
  K.add(new THREE.PlaneGeometry(1.0,.13),gapM,0,.55,F+.012); for(let i=0;i<3;i++) K.add(new THREE.BoxGeometry(.98,.01,.015),carbon,0,.5+i*.045,F+.018);
  K.splitter(.9,F-.35,F+.02,.34);
  // flanks: shut lines, side markers, fuel door, mirrors, black sills
  [1,-1].forEach(sd=>{ K.shut(sd,.98); K.shut(sd,-.42);
    const c=T.sec(F-.3); K.add(new THREE.BoxGeometry(.012,.04,.14),amber,sd*(c.hs+.006),c.ys,F-.3);
    K.mirror(sd,.78,paint);
    K.sill(sd,-WB+WR+.2,WB-WR-.2,.04,.16,GLOSS_BLACK); });
  { const c=T.sec(-1.95); const fd=K.add(new THREE.CircleGeometry(.07,20),GLOSS_BLACK,c.hs+.006,c.ys+.02,-1.95); fd.rotation.y=Math.PI/2; }
  // rear: black panel, full-width racetrack tail lamp, ducktail, diffuser with quad exhaust
  K.add(new THREE.PlaneGeometry(1.7,.2),GLOSS_BLACK,0,.84,-R-.012).rotation.y=Math.PI;
  K.tube([[-.82,.76,-R-.02],[-.84,.84,-R-.02],[-.8,.92,-R-.02],[0,.93,-R-.025],[.8,.92,-R-.02],[.84,.84,-R-.02],[.82,.76,-R-.02],[0,.75,-R-.025],[-.82,.76,-R-.02]],.018,tailM,60);
  K.glow(0xff2030,1.0,.66,.84,-R-.08); K.glow(0xff2030,1.0,-.66,.84,-R-.08);
  { const w=K.add(K.airfoil(.3,.05,1.72),paint,0,T.top(0,-2.3)+.03,-2.2); w.rotation.y=Math.PI/2; w.rotation.z=-.12; }
  K.add(new THREE.BoxGeometry(1.7,.2,.04),GLOSS_BLACK,0,.44,-R-.01); for(let i=0;i<6;i++) K.add(new THREE.BoxGeometry(.02,.16,.4),carbon,-.5+i*.2,.36,-R+.16);
  [-.66,-.5,.5,.66].forEach(x=>K.pipe(x,.44,-R-.06,.06));
  K.plate(def,.64,-R-.02);
  return T;
}

/* ---- Tempesta SV: V12 wedge. Fender peaks, black hood and roof, Y lamps, hex exhausts, swan-neck wing ---- */
function tempestaShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0xff5a3a,.26);
  const gold=new THREE.MeshStandardMaterial({color:def.accent||0xd8b04a,metalness:.85,roughness:.22});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:54,
    hwS:[[-R,.92],[-2.1,1.08],[-WB,1.13],[-.8,1.0],[0,.95],[.8,.98],[WB,1.1],[2.0,.94],[F,.62]],
    ysK:[[-R,.64],[-WB,.72],[-.5,.6],[.5,.56],[WB,.62],[2.1,.46],[F,.36]],
    yfK:[[-R,.84],[-1.6,.92],[-.8,.86],[.2,.74],[1.2,.8],[1.8,.66],[2.2,.52],[F,.44]],
    ycK:[[-R,.8],[-1.6,.9],[-1.0,.88],[-.2,.8],[.7,.7],[1.3,.64],[1.9,.54],[F,.42]],
    hwL:[[-R,.86],[-WB,.78],[-.8,.86],[0,.88],[.8,.86],[WB,.76],[F,.66]],
    ybK:[[-R,.28],[-2.2,.17],[2.1,.17],[F,.24]]},paint,K);
  const C={z0:-1.25,z1:1.2,tumble:.1,pow:.7,cwK:[[-1.25,.3],[-.9,.58],[-.2,.66],[.5,.6],[.95,.42],[1.2,.2]],htK:[[-1.25,.9],[-.8,1.1],[-.2,1.18],[.4,1.12],[.9,.9],[1.2,.66]],roof:[-.95,.5],roofA:.9};
  sculptCanopy(g,C,T,glass,GLOSS_BLACK,K); outlawKit(K,T,C);
  // black hood and engine cover over the red body; carbon louvers in the cover
  K.top(-.52,.52,1.22,F-.14,GLOSS_BLACK,.005,24);
  K.top(-.5,.5,-2.3,-1.3,GLOSS_BLACK,.005,14);
  for(let i=0;i<7;i++){ const z=-2.2+i*.13; K.add(new THREE.BoxGeometry(.8,.012,.05),carbon,0,T.top(0,z)+.012,z).rotation.x=-.1; }
  // Y-shaped headlamps set into the nose, and Y tail lamps
  [1,-1].forEach(sd=>{ const J=K.P(sd*.64,2.1);
    K.tube([K.P(sd*.64,2.3),J],.016,headM,6); K.tube([J,K.P(sd*.84,1.94)],.016,headM,8); K.tube([J,K.P(sd*.46,1.95)],.016,headM,8);
    const bowl=K.add(new THREE.SphereGeometry(1,16,10),lensM,sd*.64,T.top(sd*.64,2.08)-.01,2.08); bowl.scale.set(.2,.035,.2);
    K.glow(0xcfe6ff,.9,sd*.64,T.top(sd*.64,2.2)+.05,2.26);
    const z=-R-.02; K.tube([[sd*.66,.55,z],[sd*.66,.66,z]],.018,tailM,4); K.tube([[sd*.66,.66,z],[sd*.86,.78,z]],.018,tailM,6); K.tube([[sd*.66,.66,z],[sd*.46,.78,z]],.018,tailM,6);
    K.glow(0xff2030,.9,sd*.66,.7,-R-.08);
    // flanks: big carbon intake behind the door, gold sill line, shut line, mirror, front intakes
    const ci=T.sec(-.3), it=K.add(K.scoop(1.0,.42),carbon,sd>0?ci.hl+.02:-(ci.hl+.08),ci.yb+.12,-.34); it.rotation.y=Math.PI/2;
    const pts=[]; for(let i=0;i<=10;i++){ const z2=-1.0+2.0*i/10, c=T.sec(z2); pts.push([sd*(c.hl+.012),c.yb+.1,z2]); } K.tube(pts,.008,gold,24);
    K.shut(sd,1.0); K.mirror(sd,.62,GLOSS_BLACK);
    K.top(sd*.18,sd*.5,F-.2,F-.02,gapM,.007,6); });
  // rear: hex-mesh panel, high hex exhausts, diffuser, swan-neck wing with gold endplate edges
  { const hex=new THREE.MeshBasicMaterial({map:CT(canvasTex(256,64,(c,w,h)=>{ c.fillStyle='#050506'; c.fillRect(0,0,w,h); c.strokeStyle='#2a2d33'; c.lineWidth=2;
      for(let y=0;y<5;y++) for(let x=0;x<24;x++){ const cx=x*11+(y%2)*5.5, cy=y*13+6; c.beginPath(); for(let k=0;k<6;k++){ const a=k*Math.PI/3; c.lineTo(cx+5*Math.cos(a),cy+5*Math.sin(a)); } c.closePath(); c.stroke(); } }))});
    K.add(new THREE.PlaneGeometry(1.5,.3),hex,0,.44,-R-.012).rotation.y=Math.PI; }
  [-.15,.15].forEach(x=>K.pipe(x,.72,-R-.06,.085,6));
  for(let i=0;i<7;i++) K.add(new THREE.BoxGeometry(.02,.2,.55),carbon,-.6+i*.2,.24,-R+.24);
  K.add(new THREE.BoxGeometry(1.6,.03,.55),carbon,0,.15,-R+.24);
  { const w=K.add(K.airfoil(.58,.07,2.0),carbon,0,1.3,-2.02); w.rotation.y=Math.PI/2; w.rotation.z=.12;
    [1,-1].forEach(sd=>{ K.tube([[sd*.42,T.top(sd*.42,-2.1)-.02,-2.1],[sd*.42,1.18,-2.1],[sd*.42,1.4,-2.02],[sd*.42,1.38,-1.88]],.032,carbon,16);
      K.add(new THREE.BoxGeometry(.014,.3,.7),carbon,sd*1.01,1.3,-2.04); K.add(new THREE.BoxGeometry(.016,.018,.66),gold,sd*1.02,1.45,-2.04); }); }
  { // black front fascia over the nose face, with a red V down the middle and a Y lamp in each side
    const c=T.sec(F), fs=new THREE.Shape(), k=.92; fs.moveTo(0,c.yb+.02); fs.lineTo(c.hl*k,c.yb+.02); fs.lineTo(c.hs*k,c.ys); fs.lineTo(c.ht*k,c.yf-.02); fs.lineTo(c.ht*.45,(c.yf+c.yc)/2-.01); fs.lineTo(0,c.yc-.02);
    fs.lineTo(-c.ht*.45,(c.yf+c.yc)/2-.01); fs.lineTo(-c.ht*k,c.yf-.02); fs.lineTo(-c.hs*k,c.ys); fs.lineTo(-c.hl*k,c.yb+.02); fs.lineTo(0,c.yb+.02);
    K.add(new THREE.ShapeGeometry(fs),GLOSS_BLACK,0,0,F+.004);
    const v=new THREE.Shape(); v.moveTo(-.1,c.yc-.02); v.lineTo(.1,c.yc-.02); v.lineTo(.03,c.yb+.04); v.lineTo(-.03,c.yb+.04); v.lineTo(-.1,c.yc-.02); K.add(new THREE.ShapeGeometry(v),paint,0,0,F+.008);
    [1,-1].forEach(sd=>{ const x=sd*c.hs*.52, y=(c.ys+c.yb)/2+.02, z=F+.012;
      K.tube([[x,y-.07,z],[x,y,z]],.012,headM,3); K.tube([[x,y,z],[x+sd*.12,y+.05,z]],.012,headM,4); K.tube([[x,y,z],[x-sd*.1,y+.05,z]],.012,headM,4); K.glow(0xcfe6ff,.7,x,y,z+.05); }); }
  K.splitter(.95,F-.4,F+.02,.14);
  K.plate(def,.3,-R-.02);
  return T;
}

/* ---- Mantis LT: mid-engine longtail. Teardrop cockpit, black lower body and side scoops, raised air-brake ---- */
function mantisShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0xc8ff60,.22);
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:52,
    hwS:[[-R,.9],[-2.0,1.02],[-WB,1.08],[-.7,.96],[0,.92],[.7,.95],[WB,1.04],[1.85,.96],[F,.72]],
    ysK:[[-R,.66],[-WB,.72],[-.4,.6],[.6,.58],[WB,.64],[1.9,.48],[F,.32]],
    yfK:[[-R,.88],[-1.6,.94],[-.9,.9],[0,.8],[.8,.74],[WB,.8],[1.8,.62],[F,.38]],
    ycK:[[-R,.86],[-1.6,.94],[-1.0,.92],[-.2,.82],[.6,.72],[1.2,.66],[1.7,.58],[F,.44]],
    hwL:[[-R,.84],[-WB,.76],[-.7,.86],[0,.88],[.7,.86],[WB,.74],[F,.64]],
    ybK:[[-R,.3],[-2.05,.19],[1.9,.19],[F,.25]]},paint,K);
  const C={z0:-1.25,z1:1.05,tumble:.06,pow:.75,cwK:[[-1.25,.24],[-.9,.54],[-.3,.62],[.35,.6],[.8,.44],[1.05,.2]],htK:[[-1.25,.92],[-.85,1.12],[-.3,1.22],[.3,1.18],[.75,.98],[1.05,.72]],roof:[-.95,.45],roofA:.95};
  sculptCanopy(g,C,T,glass,paint,K); outlawKit(K,T,C);
  [1,-1].forEach(sd=>{
    // black lower body: sills between the wheels and ahead of / behind them
    K.sill(sd,-WB+WR+.18,WB-WR-.18,.03,.22,GLOSS_BLACK); K.sill(sd,WB+WR+.12,F-.3,.04,.18,GLOSS_BLACK); K.sill(sd,-R+.25,-WB-WR-.12,.04,.2,GLOSS_BLACK);
    // teardrop side scoop behind the door
    const ci=T.sec(-.45), it=K.add(K.scoop(1.1,.46),GLOSS_BLACK,sd>0?ci.hl+.02:-(ci.hl+.08),ci.yb+.14,-.5); it.rotation.y=Math.PI/2;
    K.shut(sd,.9); K.mirror(sd,.6,paint);
    // hooked LED eyes on the nose, with a clear cover
    K.tube([K.P(sd*.4,2.02),K.P(sd*.62,1.96),K.P(sd*.76,1.84),K.P(sd*.8,1.7)],.015,headM,14);
    K.tube([K.P(sd*.76,1.84),K.P(sd*.68,1.8)],.013,headM,4);
    const l=K.lens(sd*.62,T.top(sd*.62,1.9)+.01,1.9,.22,.04,.16,.3,sd*.3); void l;
    K.glow(0xcfe6ff,.9,sd*.62,T.top(sd*.62,1.95)+.05,2.0);
    // black hammerhead intakes in the nose
    K.top(sd*.16,sd*.5,F-.16,F-.02,gapM,.008,5);
    // thin tail lamps along the top edge of the rear
    K.tube([[sd*.2,.86,-R-.015],[sd*.6,.85,-R-.015],[sd*.84,.8,-R-.01]],.012,tailM,10);
    K.glow(0xff2030,.8,sd*.7,.84,-R-.06); });
  K.top(-.62,.62,F-.3,F-.17,GLOSS_BLACK,.007,4);
  K.splitter(.9,F-.35,F+.02,.22);
  // engine-deck louvers, raised longtail air-brake
  for(let i=0;i<6;i++){ const z=-1.9+i*.11; K.add(new THREE.BoxGeometry(.86,.012,.05),GLOSS_BLACK,0,T.top(0,z)+.01,z).rotation.x=-.1; }
  { const w=K.add(K.airfoil(.44,.05,1.78),paint,0,T.top(0,-2.12)+.12,-2.02); w.rotation.y=Math.PI/2; w.rotation.z=.42;
    [1,-1].forEach(sd=>K.add(new THREE.BoxGeometry(.03,.14,.1),GLOSS_BLACK,sd*.5,T.top(sd*.5,-2.12)+.06,-2.12)); }
  // open black rear with carbon slats, twin high round exhausts, big diffuser
  K.add(new THREE.PlaneGeometry(1.6,.46),gapM,0,.58,-R-.01).rotation.y=Math.PI;
  for(let i=0;i<7;i++) K.add(new THREE.BoxGeometry(1.56,.01,.02),carbon,0,.4+i*.06,-R-.02);
  [-.22,.22].forEach(x=>K.pipe(x,.68,-R-.06,.08));
  for(let i=0;i<7;i++) K.add(new THREE.BoxGeometry(.02,.22,.55),carbon,-.6+i*.2,.26,-R+.24);
  K.add(new THREE.BoxGeometry(1.6,.03,.55),carbon,0,.16,-R+.24);
  K.plate(def,.44,-R-.03);
  return T;
}

/* ---- Autobahn 63: four-door GT fastback after the GT 63 S reference photos. Panamericana grille with a big center
   star, slim swept headlamps, twin power domes, A-wing front apron, long fastback glasshouse with a chrome surround that
   ends in a point, pronounced rear haunches, slim tail lamps, quad trapezoid exhausts. The finish follows the
   blender-skills product-polish recipe: flat material values, no noisy normal maps, a clear coat over satin paint. ---- */
function autobahnShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0x6f9dff,.26);
  paint.clearcoat=1; paint.clearcoatRoughness=.015; paint.sheen!==undefined&&(paint.sheen=0); // deep gloss metallic blue under a full clear coat (product-polish recipe: flat values, no flake map)
  const silver=new THREE.MeshStandardMaterial({color:0xc4cad2,metalness:1,roughness:.2});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:72,inset:.14,
    hwS:[[-R,.9],[-2.25,.99],[-WB,1.05],[-.9,.99],[0,.96],[.8,.98],[WB,1.0],[F-.3,1.0],[F,1.28]],
    ysK:[[-R,.76],[-WB,.84],[-.6,.78],[.6,.76],[WB,.8],[F-.3,.7],[F,.6]],
    yfK:[[-R,.96],[-2.0,1.0],[-1.2,.99],[.3,.95],[1.2,.93],[WB,.92],[2.1,.84],[F,.72]],
    ycK:[[-R,.95],[-2.1,.99],[-1.5,.98],[.4,.93],[1.3,.9],[2.0,.84],[F-.2,.78],[F,.72]],
    hwL:[[-R,.86],[-WB,.84],[0,.94],[WB,.84],[F-.3,.9],[F,1.2]],
    ybK:[[-R,.34],[-2.3,.21],[2.3,.21],[F,.22]]},paint,K);
  const C={z0:-2.18,z1:1.32,tumble:.14,pow:.55,cwK:[[-2.18,.36],[-1.8,.56],[-1.0,.68],[0,.71],[.8,.68],[1.32,.56]],htK:[[-2.18,.99],[-1.7,1.17],[-1.0,1.36],[-.15,1.43],[.7,1.3],[1.32,.99]],roof:[-1.55,.55],roofA:.92};
  sculptCanopy(g,C,T,glass,paint,K); outlawKit(K,T,C);
  const bump=(fn,z0,z1,m)=>K.add(bandGeo(fn,z0,z1,24,8),m); // raised panel that meets the surface at its edges
  // twin power domes on the hood
  [1,-1].forEach(sd=>bump((u,z)=>{ const x=sd*lerp(.1,.36,u), e=Math.sin(Math.PI*clamp((z-1.3)/(F-.3-1.3),0,1)); return [x,T.top(x,z)+.028*Math.sin(Math.PI*u)*Math.sqrt(e)]; },1.3,F-.3,paint));
  // front face (the loft's nose cap): wide low grille in a black surround, vertical slats, center roundel;
  // big black corner intakes split from a full-width lower intake by body-color fangs; black lip under it all
  { const z=F+.006, shp=pts=>{ const s=new THREE.Shape(); pts.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y)); return new THREE.ShapeGeometry(s); };
    const gT=.665, gB=.435, hwT=.37, hwB=.42;
    K.add(shp([[-hwB-.03,gB-.03],[hwB+.03,gB-.03],[hwT+.03,gT+.025],[-hwT-.03,gT+.025]]),GLOSS_BLACK,0,0,z);
    K.add(shp([[-hwB,gB],[hwB,gB],[hwT,gT],[-hwT,gT]]),gapM,0,0,z+.002);
    for(let i=0;i<13;i++){ const t=(i+.5)/13, xb=lerp(-hwB,hwB,t)*.95, xt=lerp(-hwT,hwT,t)*.95, sl=K.add(new THREE.BoxGeometry(.016,gT-gB-.04,.02),chromeTrimM,(xb+xt)/2,(gT+gB)/2,z+.008); sl.rotation.z=-(xt-xb)/(gT-gB); }
    K.tube([[-.4,gT+.04,z+.01],[0,gT+.046,z+.01],[.4,gT+.04,z+.01]],.007,headM,16); K.glow(0xcfe6ff,.5,0,gT+.05,z+.05); // lit bar across the top of the grille
    [1,-1].forEach(sd=>{ K.add(shp([[sd*.46,.24],[sd*.8,.26],[sd*.84,.5],[sd*.66,.5],[sd*.5,.4]]),GLOSS_BLACK,0,0,z); // corner intake
      for(let i=0;i<3;i++) K.add(new THREE.BoxGeometry(.3,.008,.02),gapM,sd*.66,.3+i*.06,z+.006);
      K.tube([[sd*.44,.64,z+.004],[sd*.62,.655,z+.004],[sd*.76,.64,z+.004]],.008,headM,10); });
    K.add(shp([[-.44,.22],[.44,.22],[.4,.36],[-.4,.36]]),GLOSS_BLACK,0,0,z); // lower intake
    for(let i=0;i<9;i++) K.add(new THREE.BoxGeometry(.006,.1,.012),gapM,-.36+i*.09,.29,z+.006);
    K.add(new THREE.BoxGeometry(1.7,.03,.26),carbon,0,.2,F-.08); }
  // slim swept headlamps on the nose: dark housing, multibeam dots, LED eyebrow, clear cover
  [1,-1].forEach(sd=>{ const z0=F-.4, z1=F-.03, xi=z=>lerp(.66,.42,(z-z0)/(z1-z0)), xo=z=>Math.min(lerp(.92,.8,(z-z0)/(z1-z0)),T.sec(z).ht-.01);
    K.add(bandGeo((u,z)=>{ const x=sd*lerp(xi(z),xo(z),u); return [x,T.top(x,z)+.006]; },z0,z1,12,6,sd<0),lensM);
    K.tube([[sd*xi(z0),T.top(sd*xi(z0),z0)+.012,z0],[sd*xi((z0+z1)/2),T.top(sd*xi((z0+z1)/2),(z0+z1)/2)+.012,(z0+z1)/2],[sd*xi(z1),T.top(sd*xi(z1),z1)+.012,z1]],.01,headM,12);
    for(let i=0;i<3;i++){ const z=lerp(z0+.08,z1-.06,i/2), x=sd*lerp(xi(z),xo(z),.6), d=K.add(new THREE.SphereGeometry(.024,10,8),headM,x,T.top(x,z)+.012,z); d.scale.y=.5; }
    K.lens(sd*lerp(.54,.86,.5),T.top(sd*.7,F-.2)+.01,F-.2,.2,.025,.2,.2,sd*.5);
    K.glow(0xcfe6ff,.9,sd*.66,T.top(sd*.66,F-.1)+.04,F+.02); });
  // flanks: chrome window surround ending in a point at the rear, four doors, flush handles, fender gill, sills
  [1,-1].forEach(sd=>{ const lo=[], hi=[];
    for(let i=0;i<=20;i++){ const z=lerp(C.z0+.08,C.z1-.1,i/20), cw=kfCR(C.cwK,z); lo.push([sd*cw*.99,T.yc(z)+.016,z]); hi.push([sd*cw*.9,canopyY(C,T,cw*.9,z)+.01,z]); }
    K.tube(lo,.009,chromeTrimM,48); K.tube(hi.slice(2),.007,chromeTrimM,44);
    K.tube([[sd*kfCR(C.cwK,.02)*.99,T.yc(.02)+.02,.02],[sd*kfCR(C.cwK,.02)*.9,canopyY(C,T,kfCR(C.cwK,.02)*.9,.02),.02]],.012,GLOSS_BLACK,4); // B-pillar
    K.shut(sd,1.24); K.shut(sd,.04); K.shut(sd,-1.18);
    [.72,-.56].forEach(z=>{ const s=T.sec(z); K.add(new THREE.BoxGeometry(.012,.028,.2),chromeTrimM,sd*(s.hs+.01),s.ys-.03,z); });
    { const z=WB-WR-.32, s=T.sec(z); K.add(new THREE.BoxGeometry(.012,.09,.26),GLOSS_BLACK,sd*(s.hs*.99+.006),s.ys-.12,z); K.add(new THREE.BoxGeometry(.014,.016,.24),silver,sd*(s.hs*.99+.012),s.ys-.12,z); }
    K.sill(sd,-WB+WR+.22,WB-WR-.22,.035,.16,carbon);
    { const pts=[]; for(let i=0;i<=8;i++){ const z=lerp(-WB+WR+.3,WB-WR-.3,i/8), c=T.sec(z); pts.push([sd*(c.hl+.014),c.yb+.1,z]); } K.tube(pts,.006,silver,16); }
    K.mirror(sd,1.02,carbon); });
  // rear: long slim tail lamps, corner vents, reflectors, black diffuser with fins, paired trapezoid exhausts, raised blade spoiler
  { const z=-R-.012;
    [1,-1].forEach(sd=>{ K.tube([[sd*.24,.87,z],[sd*.55,.875,z],[sd*.8,.86,z-.005],[sd*.92,.83,z+.04]],.02,GLOSS_BLACK,16);
      K.tube([[sd*.26,.872,z-.012],[sd*.55,.877,z-.012],[sd*.8,.862,z-.016]],.008,tailM,14); K.tube([[sd*.3,.855,z-.012],[sd*.78,.848,z-.012]],.005,tailM,8);
      K.glow(0xff2030,.8,sd*.6,.87,-R-.08);
      K.add(new THREE.BoxGeometry(.05,.24,.04),GLOSS_BLACK,sd*.86,.56,-R+.02).rotation.z=sd*.25; // corner vent
      K.add(new THREE.BoxGeometry(.2,.022,.02),tailM,sd*.58,.5,z); // reflector
      [.5,.68].forEach(x=>{ K.add(new THREE.BoxGeometry(.15,.075,.14),exhM,sd*x,.33,-R-.02); K.add(new THREE.BoxGeometry(.12,.05,.02),gapM,sd*x,.33,-R-.095); }); });
    K.add(new THREE.PlaneGeometry(1.72,.22),carbon,0,.33,z).rotation.y=Math.PI;
    for(let i=0;i<7;i++) K.add(new THREE.BoxGeometry(.02,.18,.4),carbon,-.45+i*.15,.3,-R+.14);
    K.tube([[-.26,.874,z-.014],[0,.876,z-.014],[.26,.874,z-.014]],.007,tailM,10); K.glow(0xff2030,.9,0,.876,-R-.08); // full-width light bar
    const yb=T.top(0,-2.28); const w=K.add(K.airfoil(.26,.03,1.5),carbon,0,yb+.13,-2.22); w.rotation.y=Math.PI/2; w.rotation.z=-.06;
    [1,-1].forEach(sd=>K.add(new THREE.BoxGeometry(.03,.12,.08),carbon,sd*.42,yb+.06,-2.28)); }
  K.plate(def,.55,-R-.02);
  return T;
}

/* ---- Noctis GT: front-engine V12 grand tourer. Very long hood with a center bulge and side vents, cab pushed back,
   fastback roof into a short Kamm tail, wide hips, chrome grille, red beltline, triple center exhaust.
   Finish per the product-polish recipe: deep black under a mirror clear coat, flat values, no flake map. ---- */
function noctisShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0xb070ff,.22);
  paint.clearcoat=1; paint.clearcoatRoughness=.015;
  const red=new THREE.MeshStandardMaterial({color:0xc01820,roughness:.3,metalness:.3});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:64,inset:.13,
    hwS:[[-R,.86],[-1.9,1.0],[-WB,1.08],[-.8,.97],[0,.93],[.8,.95],[WB,1.02],[2.0,.98],[F,.84]],
    ysK:[[-R,.66],[-WB,.76],[-.5,.66],[.6,.62],[WB,.66],[2.1,.58],[F,.46]],
    yfK:[[-R,.86],[-1.6,.94],[-.9,.9],[.2,.84],[1.1,.82],[WB,.84],[2.1,.72],[F,.56]],
    ycK:[[-R,.85],[-1.7,.93],[-1.1,.92],[-.3,.86],[.6,.84],[1.4,.8],[2.1,.7],[F,.56]],
    hwL:[[-R,.82],[-WB,.8],[0,.9],[WB,.8],[F,.8]],
    ybK:[[-R,.3],[-2.0,.2],[2.2,.2],[F,.26]]},paint,K);
  const C={z0:-1.68,z1:.62,tumble:.12,pow:.6,cwK:[[-1.68,.3],[-1.3,.56],[-.7,.64],[0,.64],[.4,.56],[.62,.4]],htK:[[-1.68,.9],[-1.2,1.12],[-.6,1.25],[-.05,1.26],[.35,1.1],[.62,.9]],roof:[-1.35,.2],roofA:.92};
  sculptCanopy(g,C,T,glass,paint,K); outlawKit(K,T,C);
  const bump=(fn,z0,z1,m)=>K.add(bandGeo(fn,z0,z1,24,8),m);
  // long center power bulge on the hood, fender vents behind the front wheels
  bump((u,z)=>{ const x=lerp(-.34,.34,u), e=Math.sin(Math.PI*clamp((z-.8)/(F-.35-.8),0,1)); return [x,T.top(x,z)+.035*Math.sin(Math.PI*u)*Math.sqrt(e)]; },.8,F-.35,paint);
  [1,-1].forEach(sd=>{ for(let i=0;i<3;i++){ const z=1.06-i*.13, s=T.sec(z); K.add(new THREE.BoxGeometry(.012,.04,.09),chromeTrimM,sd*(s.hs+.008),s.ys-.04,z); } });
  // front face: wide chrome-framed grille with horizontal bars, slim swept lamps, corner intakes, black lip
  { const z=F+.006, shp=pts=>{ const s=new THREE.Shape(); pts.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y)); return new THREE.ShapeGeometry(s); };
    K.add(shp([[-.5,.3],[.5,.3],[.44,.5],[-.44,.5]]),gapM,0,0,z);
    K.tube([[-.5,.3,z+.004],[-.44,.5,z+.004],[0,.515,z+.004],[.44,.5,z+.004],[.5,.3,z+.004],[0,.285,z+.004],[-.5,.3,z+.004]],.012,chromeTrimM,50);
    for(let i=0;i<5;i++) K.add(new THREE.BoxGeometry(.88-i*.02,.01,.02),chromeTrimM,0,.33+i*.04,z+.008);
    [1,-1].forEach(sd=>K.add(shp([[sd*.58,.24],[sd*.82,.26],[sd*.84,.4],[sd*.62,.36]]),GLOSS_BLACK,0,0,z));
    K.add(new THREE.BoxGeometry(1.6,.025,.16),GLOSS_BLACK,0,.22,F-.08); }
  [1,-1].forEach(sd=>{ const z0=F-.42, z1=F-.05, xi=z=>lerp(.54,.4,(z-z0)/(z1-z0)), xo=z=>Math.min(lerp(.84,.72,(z-z0)/(z1-z0)),T.sec(z).ht-.01);
    K.add(bandGeo((u,z)=>{ const x=sd*lerp(xi(z),xo(z),u); return [x,T.top(x,z)+.006]; },z0,z1,10,6,sd<0),lensM);
    K.tube([[sd*xo(z0),T.top(sd*xo(z0),z0)+.012,z0],[sd*xi((z0+z1)/2),T.top(sd*xi((z0+z1)/2),(z0+z1)/2)+.012,(z0+z1)/2],[sd*xi(z1),T.top(sd*xi(z1),z1)+.012,z1]],.01,headM,12);
    K.glow(0xcfe6ff,.9,sd*.6,T.top(sd*.6,F-.12)+.04,F+.02);
    // flanks: red beltline, chrome window line, door shut, mirror, sill
    const bl=[]; for(let i=0;i<=12;i++){ const z=lerp(-1.6,1.9,i/12), c=T.sec(z); bl.push([sd*(c.hs+.006),c.ys-.02,z]); } K.tube(bl,.008,red,30);
    const dl=[]; for(let i=0;i<=12;i++){ const z=lerp(C.z0+.1,C.z1-.08,i/12); dl.push([sd*kfCR(C.cwK,z)*.99,T.yc(z)+.016,z]); } K.tube(dl,.008,chromeTrimM,30);
    K.shut(sd,.5); K.mirror(sd,.4,paint); K.sill(sd,-WB+WR+.2,WB-WR-.2,.03,.14,GLOSS_BLACK);
    // tail: round twin lamps each side set into the Kamm tail
    [.52,.76].forEach(x=>{ const l=K.add(new THREE.CircleGeometry(.07,24),tailM,sd*x,.72,-R-.01); l.rotation.y=Math.PI; K.add(new THREE.TorusGeometry(.075,.01,6,24),chromeTrimM,sd*x,.72,-R-.012); });
    K.glow(0xff2030,.8,sd*.64,.72,-R-.07); });
  // rear: red bar between the lamps, black diffuser, triple center exhaust, ducktail
  K.tube([[-.4,.72,-R-.012],[.4,.72,-R-.012]],.01,red,6);
  K.add(new THREE.PlaneGeometry(1.5,.2),GLOSS_BLACK,0,.34,-R-.01).rotation.y=Math.PI;
  for(let i=0;i<5;i++) K.add(new THREE.BoxGeometry(.02,.16,.36),GLOSS_BLACK,-.36+i*.18,.28,-R+.14);
  [-.16,0,.16].forEach(x=>K.pipe(x,.36,-R-.05,.05));
  { const w=K.add(K.airfoil(.2,.028,1.5),paint,0,T.top(0,-2.05)+.02,-2.02); w.rotation.y=Math.PI/2; w.rotation.z=-.1; }
  K.plate(def,.52,-R-.02); void carbon;
  return T;
}

/* ---- Vanta LM: Le Mans prototype. Very low tub between tall wheel pods, bubble cockpit pushed forward, shark fin
   running back into a longtail, black canopy, cyan ducts, number roundels, swan-neck wing. ---- */
function vantaShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0x9fdcff,.18);
  paint.clearcoat=1; paint.clearcoatRoughness=.03;
  const cyan=new THREE.MeshStandardMaterial({color:0x19c2ff,emissive:0x0a3a60,emissiveIntensity:.6,roughness:.3,metalness:.2});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:70,inset:.1,
    hwS:[[-R,.94],[-2.2,1.04],[-WB,1.1],[-.9,1.0],[0,.94],[.8,.98],[WB,1.08],[2.0,1.0],[F,.84]],
    ysK:[[-R,.58],[-WB,.72],[-.6,.5],[.5,.48],[WB,.7],[2.0,.5],[F,.3]],
    yfK:[[-R,.66],[-2.1,.72],[-WB,.78],[-.7,.62],[.4,.6],[WB,.76],[2.0,.56],[F,.32]],
    ycK:[[-R,.62],[-2.2,.68],[-1.4,.68],[-.4,.6],[.4,.56],[1.2,.5],[1.9,.4],[F,.26]],
    hwL:[[-R,.9],[-WB,.8],[0,.86],[WB,.8],[F,.76]],
    ybK:[[-R,.26],[-2.4,.15],[2.1,.14],[F,.18]]},paint,K);
  const C={z0:-.45,z1:1.3,tumble:.04,pow:.7,cwK:[[-.45,.2],[-.15,.48],[.35,.55],[.85,.5],[1.15,.34],[1.3,.14]],htK:[[-.45,.68],[-.15,.9],[.35,1.02],[.85,.94],[1.15,.74],[1.3,.52]],roof:[-.2,.95],roofA:.85};
  sculptCanopy(g,C,T,glass,GLOSS_BLACK,K); outlawKit(K,T,C);
  // shark fin from the cockpit to the tail
  { const fs=new THREE.Shape(); fs.moveTo(0,0); fs.lineTo(2.3,0); fs.quadraticCurveTo(1.0,.12,0,.34); fs.lineTo(0,0);
    const f=K.add(new THREE.ExtrudeGeometry(fs,{depth:.028,bevelEnabled:true,bevelThickness:.006,bevelSize:.006,bevelSegments:2}),paint,-.014,T.yc(-2.7)+.01,-2.72); f.rotation.y=-Math.PI/2; }
  // black engine cover band with louvers, cyan fin edge
  K.top(-.42,.42,-2.3,-.6,GLOSS_BLACK,.006,20);
  for(let i=0;i<8;i++){ const z=-.9-i*.14; K.add(new THREE.BoxGeometry(.7,.012,.05),carbon,0,T.top(0,z)+.014,z).rotation.x=-.1; }
  K.tube([[0,T.yc(-2.7)+.35,-2.7],[0,T.yc(-1.6)+.2,-1.6],[0,kfCR(C.htK,-.35)+.02,-.4]],.009,cyan,20);
  [1,-1].forEach(sd=>{
    // stacked LED lamps on the front wheel pods
    [0,1,2,3].forEach(i=>{ const z=F-.3-i*.07, x=sd*.78; const d=K.add(new THREE.SphereGeometry(.028,10,8),headM,x,T.top(x,z)+.01,z); d.scale.y=.5; });
    K.tube([K.P(sd*.62,F-.5),K.P(sd*.86,F-.34)],.009,headM,6); K.glow(0xcfe6ff,.9,sd*.78,T.top(sd*.78,F-.3)+.05,F-.1);
    // cyan side duct behind the door, number roundel, sidepod intake
    const ci=T.sec(-.9), it=K.add(K.scoop(1.0,.36),cyan,sd>0?ci.hl+.02:-(ci.hl+.08),ci.yb+.08,-.95); it.rotation.y=Math.PI/2;
    const s=T.sec(.55), rd=K.add(new THREE.CircleGeometry(.15,28),new THREE.MeshStandardMaterial({color:0xf4f6fa,roughness:.4}),sd*(s.hs+.012),s.ys-.08,.55); rd.rotation.y=sd*Math.PI/2;
    const nm=K.add(new THREE.PlaneGeometry(.2,.2),new THREE.MeshBasicMaterial({map:CT(canvasTex(128,128,(c,w,h)=>{ c.fillStyle='#0a0c10'; c.font='900 96px "Arial Narrow",Arial,sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('7',w/2,h/2+6); })),transparent:true}),sd*(s.hs+.016),s.ys-.08,.55); nm.rotation.y=sd*Math.PI/2;
    K.mirror(sd,1.0,paint);
    // thin tail light blade across each rear pod
    K.tube([[sd*.3,.64,-R-.012],[sd*.7,.64,-R-.012],[sd*.92,.6,-R+.03]],.012,tailM,10); K.glow(0xff2030,.8,sd*.7,.64,-R-.07); });
  // front: black splitter and dive planes, rear: open diffuser, swan-neck wing
  K.splitter(1.0,F-.4,F+.02,.14);
  [1,-1].forEach(sd=>K.add(new THREE.BoxGeometry(.28,.012,.14),carbon,sd*.8,.26,F-.12).rotation.z=sd*.2);
  K.add(new THREE.PlaneGeometry(1.7,.26),gapM,0,.4,-R-.01).rotation.y=Math.PI;
  for(let i=0;i<9;i++) K.add(new THREE.BoxGeometry(.02,.24,.7),carbon,-.8+i*.2,.24,-R+.3);
  K.add(new THREE.BoxGeometry(1.8,.03,.7),carbon,0,.13,-R+.3);
  { const w=K.add(K.airfoil(.5,.06,2.06),carbon,0,1.08,-2.42); w.rotation.y=Math.PI/2; w.rotation.z=.1;
    [1,-1].forEach(sd=>{ K.tube([[sd*.35,T.top(sd*.35,-2.5),-2.5],[sd*.35,.95,-2.5],[sd*.35,1.14,-2.44],[sd*.35,1.12,-2.3]],.028,carbon,14);
      K.add(new THREE.BoxGeometry(.014,.3,.66),carbon,sd*1.04,1.02,-2.45); K.add(new THREE.BoxGeometry(.016,.016,.6),cyan,sd*1.05,1.16,-2.45); }); }
  K.plate(def,.42,-R-.02);
  return T;
}

/* ---- Kern RS: rear-engine GT. Raised front fenders with round lamps, low hood between them, teardrop roof that
   slopes into a long engine lid with a louvered grille, wide rear hips, full-width light bar, swan-neck wing.
   Keeps the studio X-ray cutaway: the rear third turns into a clear shell over the flat-six. ---- */
function kernShell(g,def,B,paint,glass,opts){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0xd8b04a,.16);
  paint.clearcoat=1; paint.clearcoatRoughness=.02;
  const gold=new THREE.MeshStandardMaterial({color:def.caliper,roughness:.26,metalness:.8});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:64,inset:.16,
    hwS:[[-R,.9],[-1.9,1.04],[-WB,1.08],[-.7,.97],[0,.93],[.7,.95],[WB,1.0],[1.9,.96],[F,.8]],
    ysK:[[-R,.72],[-WB,.8],[-.5,.7],[.5,.68],[WB,.74],[1.9,.66],[F,.5]],
    yfK:[[-R,.92],[-1.8,.98],[-WB,.98],[-.6,.9],[.5,.86],[WB,.9],[1.9,.82],[F,.6]],
    ycK:[[-R,.9],[-1.8,.95],[-1.2,.98],[-.5,.92],[.6,.8],[1.3,.74],[1.9,.66],[F,.52]],
    hwL:[[-R,.86],[-WB,.84],[0,.9],[WB,.8],[F,.78]],
    ybK:[[-R,.34],[-2.0,.22],[2.0,.22],[F,.26]]},paint,K);
  const C={z0:-1.7,z1:1.12,tumble:.16,pow:.55,cwK:[[-1.7,.3],[-1.2,.56],[-.5,.64],[.3,.64],[.8,.58],[1.12,.46]],htK:[[-1.7,.98],[-1.2,1.15],[-.5,1.34],[.1,1.38],[.7,1.2],[1.12,.94]],roof:[-1.3,.45],roofA:.92};
  sculptCanopy(g,C,T,glass,paint,K); outlawKit(K,T,C);
  // twin gold stripes over hood, roof and engine lid
  [.16,-.16].forEach(x=>{ K.top(x-.06,x+.06,C.z1-.05,F-.1,gold,.006,20); K.roof(x-.06,x+.06,C.z0+.1,C.z1-.1,gold,.024,20); K.top(x-.06,x+.06,-R+.1,C.z0+.05,gold,.006,12); });
  // engine-lid grille
  for(let i=0;i<7;i++){ const z=-1.78-i*.06; K.add(new THREE.BoxGeometry(.52,.012,.03),GLOSS_BLACK,0,T.top(0,z)+.012,z).rotation.x=-.25; }
  [1,-1].forEach(sd=>{
    // round lamps on the raised front fenders: chrome ring, lens, 4-point DRL
    const x=sd*.66, z=F-.42, y=T.top(x,z)+.02; const ring=K.add(new THREE.TorusGeometry(.13,.016,8,28),chromeTrimM,x,y,z); ring.rotation.x=-1.05;
    const l=K.add(new THREE.CircleGeometry(.115,28),lensM,x,y-.003,z-.004); l.rotation.x=-1.05;
    [[0,.06],[0,-.06],[.06,0],[-.06,0]].forEach(([a,b])=>{ const d=K.add(new THREE.SphereGeometry(.014,8,6),headM,x+a,y+b*.5+.004,z+b*.87); d.scale.y=.6; });
    K.glow(0xcfe6ff,.9,x,y+.04,z+.1);
    // flanks: shut line, mirror, carbon sill, side intake ahead of the rear wheel, gold pinstripe
    K.shut(sd,.95); K.mirror(sd,.82,paint); K.sill(sd,-WB+WR+.2,WB-WR-.2,.03,.14,carbon);
    const ci=T.sec(-.62), it=K.add(K.scoop(.6,.22),GLOSS_BLACK,sd>0?ci.hs-.02:-(ci.hs+.04),ci.ys-.2,-.66); it.rotation.y=Math.PI/2;
    const pts=[]; for(let i=0;i<=10;i++){ const z=lerp(-1.6,1.7,i/10), c=T.sec(z); pts.push([sd*(c.hs+.006),c.ys-.05,z]); } K.tube(pts,.005,gold,24); });
  // front: black intakes and splitter; rear: full-width light bar, black diffuser, center twin exhaust, swan wing
  K.add(new THREE.PlaneGeometry(1.1,.14),GLOSS_BLACK,0,.34,F+.008);
  [1,-1].forEach(sd=>K.add(new THREE.PlaneGeometry(.26,.12),gapM,sd*.64,.32,F-.02));
  K.splitter(.86,F-.3,F+.03,.18);
  K.tube([[-.86,.84,-R-.012],[-.4,.86,-R-.015],[0,.862,-R-.015],[.4,.86,-R-.015],[.86,.84,-R-.012]],.016,tailM,30); K.glow(0xff2030,1.0,.6,.85,-R-.07); K.glow(0xff2030,1.0,-.6,.85,-R-.07);
  K.add(new THREE.PlaneGeometry(1.5,.22),GLOSS_BLACK,0,.4,-R-.01).rotation.y=Math.PI;
  for(let i=0;i<6;i++) K.add(new THREE.BoxGeometry(.02,.16,.4),carbon,-.5+i*.2,.28,-R+.16);
  [-.1,.1].forEach(x=>K.pipe(x,.42,-R-.05,.055));
  { const w=K.add(K.airfoil(.44,.05,1.8),carbon,0,1.28,-2.02); w.rotation.y=Math.PI/2; w.rotation.z=.1;
    [1,-1].forEach(sd=>{ K.tube([[sd*.4,T.top(sd*.4,-2.1)-.01,-2.1],[sd*.4,1.14,-2.12],[sd*.4,1.34,-2.04],[sd*.4,1.32,-1.92]],.028,carbon,14);
      K.add(new THREE.BoxGeometry(.012,.24,.54),carbon,sd*.92,1.24,-2.04); }); }
  K.plate(def,.6,-R-.02);
  if(opts&&opts.cut&&def.cutaway){ // X-ray rear quarter: paint clipped behind cutZ, a clear shell there, engine inside
    const cutZ=-.75; paint.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,0,1),-cutZ)];
    const body=g.children.find(o=>o.material===paint);
    const shell=new THREE.MeshPhysicalMaterial({color:0x223246,metalness:.2,roughness:.05,transparent:true,opacity:.3,depthWrite:false,side:THREE.DoubleSide,clippingPlanes:[new THREE.Plane(new THREE.Vector3(0,0,-1),cutZ)]});
    g.add(new THREE.Mesh(body.geometry,shell));
    const edge=new THREE.Mesh(new THREE.BoxGeometry(2.3,1.0,.02),new THREE.MeshBasicMaterial({color:0x9fd3ff,toneMapped:false,transparent:true,opacity:.3,clippingPlanes:[new THREE.Plane(new THREE.Vector3(0,1,0),-.2)]})); edge.position.set(0,.7,cutZ); g.add(edge);
    const chrome=new THREE.MeshStandardMaterial({color:0xc8ced6,metalness:1,roughness:.18}), dark=new THREE.MeshStandardMaterial({color:0x1a1d22,metalness:.8,roughness:.35});
    const eng=new THREE.Group(); eng.position.set(0,.55,-1.55); g.add(eng);
    eng.add(new THREE.Mesh(new THREE.BoxGeometry(1.0,.34,1.0),dark));
    for(let i=0;i<3;i++) [-1,1].forEach(sd=>{ const c=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.34,14),chrome); c.rotation.z=Math.PI/2; c.position.set(sd*.66,.02,-.33+i*.33); eng.add(c); });
    [-1,1].forEach(sd=>{ const t=new THREE.Mesh(new THREE.TorusGeometry(.13,.05,8,18),chrome); t.position.set(sd*.42,.3,.25); t.rotation.x=Math.PI/2; eng.add(t); });
    for(let i=0;i<9;i++){ const fin=new THREE.Mesh(new THREE.BoxGeometry(.9,.02,.36),chrome); fin.position.set(0,.36+i*.028,-.2); eng.add(fin); }
    const mot=new THREE.Mesh(new THREE.CylinderGeometry(.26,.26,.4,20),chrome); mot.rotation.z=Math.PI/2; mot.position.set(0,-.1,.62); eng.add(mot);
    const pack=new THREE.Mesh(new THREE.BoxGeometry(1.2,.2,.5),new THREE.MeshStandardMaterial({color:0x2a3b52,emissive:0x0c2a44,metalness:.4,roughness:.3})); pack.position.set(0,-.2,-.62); eng.add(pack); }
  return T;
}

/* ---- Dune-R: rally-raid performance SUV. Tall slab-sided body with a sharp shoulder line, flat hood with a
   power dome, upright glasshouse with a gently sloped tail, black arch cladding, skid plates front and rear,
   roof rack with a four-lamp bar, snorkel, spare on the tailgate. ---- */
function duneShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0xffc890,.12);
  paint.clearcoat=.8; paint.clearcoatRoughness=.08;
  const alloy=new THREE.MeshStandardMaterial({color:0x9aa2ab,metalness:.9,roughness:.35}), orange=new THREE.MeshStandardMaterial({color:0xff6a1a,roughness:.4,metalness:.3});
  const clad=new THREE.MeshStandardMaterial({color:0x08090a,roughness:.7,metalness:.1,envMapIntensity:.4});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:60,inset:.12,
    hwS:[[-R,.96],[-WB,1.04],[0,1.0],[WB,1.04],[F,.94]],
    ysK:[[-R,1.08],[-WB,1.14],[0,1.12],[WB,1.14],[2.0,1.08],[F,.96]],
    yfK:[[-R,1.3],[-WB,1.33],[0,1.33],[WB,1.34],[2.0,1.26],[F,1.1]],
    ycK:[[-R,1.3],[-1.9,1.33],[-1.2,1.34],[.5,1.34],[1.6,1.32],[2.1,1.24],[F,1.08]],
    hwL:[[-R,.9],[-WB,.9],[0,.94],[WB,.9],[F,.88]],
    ybK:[[-R,.62],[-2.0,.5],[2.0,.5],[F,.6]]},paint,K);
  const C={z0:-2.12,z1:1.45,tumble:.08,pow:.3,cwK:[[-2.12,.7],[-1.8,.8],[-.6,.84],[.5,.84],[1.1,.8],[1.45,.72]],htK:[[-2.12,1.46],[-1.8,1.86],[-1.0,1.96],[.3,1.97],[.95,1.9],[1.45,1.4]],roof:[-1.9,1.0],roofA:.9};
  sculptCanopy(g,C,T,glass,paint,K); outlawKit(K,T,C);
  // power dome on the hood
  K.add(bandGeo((u,z)=>{ const x=lerp(-.4,.4,u), e=Math.sin(Math.PI*clamp((z-1.55)/(F-.25-1.55),0,1)); return [x,T.top(x,z)+.03*Math.sin(Math.PI*u)*Math.sqrt(e)]; },1.55,F-.25,20,8),paint);
  // arch cladding: a thick black eyebrow over each wheel, plus clad sills
  [1,-1].forEach(sd=>[WB,-WB].forEach(zw=>{ const pts=[]; for(let i=0;i<=14;i++){ const a=Math.PI*(.1+.8*i/14), z=zw-Math.cos(a)*(WR+.16), c=T.sec(z); pts.push([sd*(c.hs+.03),WR+Math.sin(a)*(WR+.16),z]); } K.tube(pts,.05,clad,24,6); }));
  [1,-1].forEach(sd=>{ K.sill(sd,-WB+WR+.22,WB-WR-.22,.02,.3,clad);
    const pts=[]; for(let i=0;i<=8;i++){ const z=lerp(-WB+WR+.3,WB-WR-.3,i/8), c=T.sec(z); pts.push([sd*(c.hl+.05),c.yb-.02,z]); } K.tube(pts,.035,alloy,16); // side step
    K.shut(sd,1.3); K.shut(sd,.05); K.shut(sd,-1.2); K.mirror(sd,1.2,GLOSS_BLACK);
    [.8,-.5].forEach(z=>{ const s=T.sec(z); K.add(new THREE.BoxGeometry(.012,.03,.18),alloy,sd*(s.hs+.01),s.ys+.08,z); });
    // headlamps: wide slim unit with a Y DRL, and round fogs in the bumper
    const z=F-.02; K.add(new THREE.PlaneGeometry(.42,.12),lensM,sd*.62,1.0,z+.002); K.tube([[sd*.44,1.03,z+.006],[sd*.8,1.03,z+.006]],.012,headM,6); K.tube([[sd*.62,1.03,z+.006],[sd*.7,.96,z+.006]],.01,headM,4);
    K.glow(0xcfe6ff,1.0,sd*.62,1.0,z+.06);
    const fg=K.add(new THREE.CircleGeometry(.05,16),headM,sd*.66,.7,z+.004); void fg;
    // tail: slim lamps wrapping the corners
    K.tube([[sd*.3,1.2,-R-.012],[sd*.8,1.2,-R-.012],[sd*.92,1.16,-R+.06]],.022,tailM,10); K.glow(0xff2030,.9,sd*.7,1.2,-R-.07); });
  // front face: big black grille with alloy bars, skid plate, orange tow hooks
  K.add(new THREE.PlaneGeometry(.8,.34),GLOSS_BLACK,0,.9,F+.004);
  for(let i=0;i<4;i++) K.add(new THREE.BoxGeometry(.76,.018,.02),alloy,0,.78+i*.08,F+.01);
  K.add(new THREE.PlaneGeometry(1.5,.16),clad,0,.62,F+.003);
  K.add(new THREE.BoxGeometry(1.1,.03,.34),alloy,0,.5,F-.06).rotation.x=.5;
  [1,-1].forEach(sd=>K.add(new THREE.BoxGeometry(.08,.08,.12),orange,sd*.5,.58,F+.04));
  // roof rack with a four-lamp bar
  { const rt=kfCR(C.htK,-.3)+.07;
    [1,-1].forEach(sd=>{ K.add(new THREE.BoxGeometry(.05,.05,2.2),GLOSS_BLACK,sd*.66,rt,-.4); [-1.4,.6].forEach(z=>{ const h=rt-canopyY(C,T,.66,z); K.add(new THREE.BoxGeometry(.05,h,.06),GLOSS_BLACK,sd*.66,rt-h/2,z); }); });
    [-1.3,-.5,.3].forEach(z=>K.add(new THREE.BoxGeometry(1.36,.035,.05),GLOSS_BLACK,0,rt+.02,z));
    K.add(new THREE.BoxGeometry(1.46,.05,.08),GLOSS_BLACK,0,rt+.05,.66);
    [-.54,-.18,.18,.54].forEach(x=>{ const c=K.add(new THREE.CylinderGeometry(.085,.095,.1,16),GLOSS_BLACK,x,rt+.14,.68); c.rotation.x=Math.PI/2;
      K.add(new THREE.CircleGeometry(.07,16),headM,x,rt+.14,.735); K.glow(0xfff1d6,.55,x,rt+.14,.78); }); }
  // snorkel up the A-pillar
  { const c=T.sec(1.35); K.tube([[c.hs+.05,c.ys,1.4],[c.hs+.05,1.5,1.4],[c.hs*.86,1.9,1.2]],.055,GLOSS_BLACK,14,10); K.add(new THREE.BoxGeometry(.14,.12,.2),GLOSS_BLACK,c.hs*.86,1.95,1.18); }
  // rear: black bumper, skid plate, twin exhaust, spare wheel on the tailgate
  K.add(new THREE.PlaneGeometry(1.7,.26),clad,0,.66,-R-.004).rotation.y=Math.PI;
  K.add(new THREE.BoxGeometry(1.0,.03,.3),alloy,0,.52,-R+.02).rotation.x=-.5;
  [-.5,.5].forEach(x=>K.pipe(x,.6,-R-.05,.06));
  { const spare=K.add(new THREE.Mesh(TIRE_GEO,[tireTreadM,tireSideM,tireSideM]).geometry,[tireTreadM,tireSideM,tireSideM],0,1.14,-R-.2); spare.scale.setScalar(1.1); spare.rotation.x=Math.PI/2;
    const hb=K.add(new THREE.RingGeometry(.08,.22,24),bronzeM(),0,1.14,-R-.37); hb.rotation.y=Math.PI; }
  K.plate(def,.86,-R-.02); void carbon;
  return T;
}

/* ---- Sovereign: V12 chauffeur sedan. Three-box: long flat hood, tall upright glasshouse with a formal
   C-pillar, short flat boot, tall chrome grille with a mascot, chrome everywhere, rear-hinged coach doors. ---- */
function sovereignShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0x9fb4d8,.14);
  paint.clearcoat=1; paint.clearcoatRoughness=.01; // piano black
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:64,inset:.1,
    hwS:[[-R,.9],[-WB,1.0],[0,.98],[WB,1.0],[F-.3,1.0],[F,1.34]],
    ysK:[[-R,.86],[-WB,.9],[0,.88],[WB,.9],[2.1,.86],[F,.78]],
    yfK:[[-R,1.04],[-WB,1.08],[0,1.06],[WB,1.08],[2.1,1.04],[F,.96]],
    ycK:[[-R,1.02],[-2.0,1.06],[-1.6,1.06],[0,1.04],[1.4,1.06],[2.1,1.04],[F,.96]],
    hwL:[[-R,.86],[-WB,.86],[0,.92],[WB,.86],[F-.3,.92],[F,1.26]],
    ybK:[[-R,.34],[-2.2,.26],[2.2,.26],[F,.32]]},paint,K);
  const C={z0:-1.62,z1:1.2,tumble:.12,pow:.34,cwK:[[-1.62,.62],[-1.45,.72],[-.6,.76],[.4,.76],[.95,.72],[1.2,.62]],htK:[[-1.62,1.14],[-1.42,1.52],[-.8,1.62],[.3,1.62],[.85,1.54],[1.2,1.12]],roof:[-1.45,.9],roofA:.92};
  sculptCanopy(g,C,T,glass,paint,K); outlawKit(K,T,C);
  // formal chrome: grille, mascot, hood strake, window surround, beltline, coach doors
  { const z=F+.006, gT=1.0, gB=.52, hw=.3;
    K.add(new THREE.BoxGeometry(hw*2+.08,gT-gB+.08,.08),chromeTrimM,0,(gT+gB)/2,F-.02);
    K.add(new THREE.PlaneGeometry(hw*2,gT-gB),gapM,0,(gT+gB)/2,z+.02);
    for(let i=0;i<11;i++) K.add(new THREE.BoxGeometry(.016,gT-gB-.02,.02),chromeTrimM,-hw+.03+i*(hw*2-.06)/10,(gT+gB)/2,z+.03);
    K.add(new THREE.BoxGeometry(.03,.14,.08),chromeTrimM,0,gT+.1,F-.08).rotation.x=-.35; // mascot
    K.tube([[0,T.top(0,1.3)+.012,1.3],[0,T.top(0,F-.2)+.012,F-.2]],.012,chromeTrimM,8); // hood strake
    K.add(new THREE.BoxGeometry(1.5,.03,.05),chromeTrimM,0,.46,z+.01); }
  [1,-1].forEach(sd=>{
    // slim lamps either side of the grille, lower intakes
    const z=F-.02; K.add(new THREE.PlaneGeometry(.36,.1),lensM,sd*.58,.86,z+.004); K.tube([[sd*.42,.9,z+.008],[sd*.76,.88,z+.008]],.012,headM,6); K.glow(0xcfe6ff,1.0,sd*.58,.86,z+.06);
    K.add(new THREE.PlaneGeometry(.3,.08),gapM,sd*.6,.6,z+.004);
    const dl=[], up=[]; for(let i=0;i<=16;i++){ const zz=lerp(C.z0+.12,C.z1-.1,i/16), cw=kfCR(C.cwK,zz); dl.push([sd*cw*.99,T.yc(zz)+.016,zz]); up.push([sd*cw*.92,canopyY(C,T,cw*.92,zz)+.01,zz]); }
    K.tube(dl,.01,chromeTrimM,40); K.tube(up.slice(1,-1),.008,chromeTrimM,40);
    const bl=[]; for(let i=0;i<=12;i++){ const zz=lerp(-2.3,2.3,i/12), c=T.sec(zz); bl.push([sd*(c.hs+.006),c.ys-.12,zz]); } K.tube(bl,.006,chromeTrimM,30);
    // coach doors: front door hinged at the front, rear door hinged at the back, handles meet in the middle
    K.shut(sd,1.12); K.shut(sd,-.05); K.shut(sd,-1.4);
    [.1,-.2].forEach(zz=>{ const s=T.sec(zz); K.add(new THREE.BoxGeometry(.012,.03,.16),chromeTrimM,sd*(s.hs+.01),s.ys-.02,zz); });
    K.mirror(sd,1.02,paint); K.sill(sd,-WB+WR+.22,WB-WR-.22,.02,.12,chromeTrimM);
    // tail: tall slim vertical lamps at the corners
    K.tube([[sd*.78,1.0,-R-.012],[sd*.8,.74,-R-.012]],.03,tailM,6); K.glow(0xff2030,.9,sd*.79,.88,-R-.07); });
  K.tube([[-.72,.98,-R-.012],[.72,.98,-R-.012]],.008,chromeTrimM,6);
  K.add(new THREE.BoxGeometry(1.7,.03,.05),chromeTrimM,0,.5,-R-.02);
  [-.55,.55].forEach(x=>K.pipe(x,.42,-R-.05,.05));
  K.plate(def,.7,-R-.02); void carbon;
  return T;
}

/* ---- Gran Four: four-door sport liftback. Raised front fenders carrying 4-point LED lamps, low hood between them,
   long glasshouse sloping into a liftback with a full-width light bar, strong rear shoulders, pop-up spoiler,
   matte stealth gray with yellow accents. ---- */
function granfourShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0xffd878,.1);
  paint.clearcoat=0; paint.roughness=.55; paint.envMapIntensity=.55; paint.color.multiplyScalar(.8); // matte wrap: no coat, soft reflections
  const yel=new THREE.MeshStandardMaterial({color:def.accent||0xffc21a,roughness:.35,metalness:.2});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:64,inset:.15,
    hwS:[[-R,.9],[-2.0,1.02],[-WB,1.07],[-.8,.98],[0,.96],[.8,.97],[WB,1.0],[F-.3,.98],[F,1.2]],
    ysK:[[-R,.74],[-WB,.84],[-.5,.74],[.6,.72],[WB,.78],[F-.3,.68],[F,.56]],
    yfK:[[-R,.92],[-1.8,.98],[-WB,.98],[-.6,.92],[.6,.9],[WB,.92],[2.1,.84],[F,.7]],
    ycK:[[-R,.9],[-1.9,.95],[-1.4,.95],[.4,.9],[1.2,.8],[2.0,.74],[F-.2,.68],[F,.62]],
    hwL:[[-R,.86],[-WB,.84],[0,.92],[WB,.84],[F-.3,.88],[F,1.12]],
    ybK:[[-R,.34],[-2.2,.24],[2.2,.24],[F,.26]]},paint,K);
  const C={z0:-2.1,z1:1.32,tumble:.14,pow:.55,cwK:[[-2.1,.4],[-1.7,.58],[-.9,.68],[.1,.7],[.8,.66],[1.32,.52]],htK:[[-2.1,.96],[-1.6,1.12],[-.9,1.3],[0,1.37],[.75,1.24],[1.32,.95]],roof:[-1.5,.6],roofA:.92};
  sculptCanopy(g,C,T,glass,GLOSS_BLACK,K); outlawKit(K,T,C);
  [1,-1].forEach(sd=>{
    // 4-point LED lamps on the fender tops, clear cover
    const x=sd*.64, z=F-.34; K.lens(x,T.top(x,z)+.01,z,.2,.04,.18,.25,sd*.2);
    [[-.05,-.05],[.05,-.05],[-.05,.05],[.05,.05]].forEach(([a,b])=>K.add(new THREE.BoxGeometry(.06,.012,.022),headM,x+a,T.top(x+a,z+b)+.018,z+b));
    K.glow(0xcfe6ff,.9,x,T.top(x,z)+.05,z+.2);
    // big black corner intakes with yellow lips
    const zf=F+.006; K.add(new THREE.PlaneGeometry(.34,.2),GLOSS_BLACK,sd*.64,.38,zf); K.add(new THREE.BoxGeometry(.34,.02,.02),yel,sd*.64,.27,zf+.01);
    // flanks: four doors, black window line, fender gill, yellow sill stripe, mirror
    K.shut(sd,1.26); K.shut(sd,.06); K.shut(sd,-1.18);
    [.74,-.54].forEach(z2=>{ const s=T.sec(z2); K.add(new THREE.BoxGeometry(.012,.028,.2),GLOSS_BLACK,sd*(s.hs+.01),s.ys-.03,z2); });
    { const z2=WB-WR-.3, s=T.sec(z2); K.add(new THREE.BoxGeometry(.012,.12,.2),GLOSS_BLACK,sd*(s.hs+.006),s.ys-.1,z2); }
    K.sill(sd,-WB+WR+.22,WB-WR-.22,.03,.15,GLOSS_BLACK);
    { const pts=[]; for(let i=0;i<=8;i++){ const z2=lerp(-WB+WR+.3,WB-WR-.3,i/8), c=T.sec(z2); pts.push([sd*(c.hl+.014),c.yb+.13,z2]); } K.tube(pts,.008,yel,16); }
    K.mirror(sd,1.0,paint);
    // rear: quad exhaust, oval pairs
    [.42,.58].forEach(x2=>K.pipe(sd*x2,.38,-R-.05,.05)); });
  // front: center intake, yellow splitter lip
  K.add(new THREE.PlaneGeometry(.64,.14),GLOSS_BLACK,0,.36,F+.006);
  K.splitter(.9,F-.3,F+.03,.2); K.add(new THREE.BoxGeometry(1.5,.02,.03),yel,0,.21,F+.02);
  // rear: full-width light bar across the liftback, black diffuser, pop-up ducktail
  K.tube([[-.88,.88,-R-.01],[-.5,.9,-R-.014],[0,.905,-R-.014],[.5,.9,-R-.014],[.88,.88,-R-.01]],.014,tailM,30);
  K.glow(0xff2030,1.0,.62,.89,-R-.07); K.glow(0xff2030,1.0,-.62,.89,-R-.07);
  K.add(new THREE.PlaneGeometry(1.6,.2),GLOSS_BLACK,0,.4,-R-.01).rotation.y=Math.PI;
  for(let i=0;i<5;i++) K.add(new THREE.BoxGeometry(.02,.16,.36),carbon,-.4+i*.2,.3,-R+.14);
  { const yb=T.top(0,-2.2); const w=K.add(K.airfoil(.26,.03,1.5),paint,0,yb+.1,-2.16); w.rotation.y=Math.PI/2; w.rotation.z=-.08;
    [1,-1].forEach(sd=>K.add(new THREE.BoxGeometry(.03,.09,.08),GLOSS_BLACK,sd*.46,yb+.05,-2.2)); }
  K.plate(def,.62,-R-.02);
  return T;
}

/* ---- Gran Four (Blender build, v3): tools/blender/gran_four.py, traced off Paris's Midjourney sheet and design blueprint.
   Tapered nose with a proud vertical-slat grille, slim LED lamps whose DRL hooks down beside it, big corner intakes, a black
   splitter edged in yellow that carries on along the sills, long domed hood, four-door glasshouse under a glass roof with a
   yellow line on each rail, wide haunches, deck lip spoiler, full-width light bar, black diffuser band with square pipes.
   Matte pale-gray paint: no clear coat. Blender material names map onto the game's materials; granfourShell is the fallback. */
const GF_YELLOW=new THREE.MeshStandardMaterial({color:0xffb21a,emissive:0xb87400,emissiveIntensity:.35,roughness:.35,metalness:.1});
const GF_GRILLE=new THREE.MeshStandardMaterial({color:0x2c2e33,metalness:.9,roughness:.24,envMapIntensity:1.8});
const GF_GLASS=new THREE.MeshPhysicalMaterial({color:0x040507,metalness:.35,roughness:.04,clearcoat:1,clearcoatRoughness:.03,reflectivity:.8,envMapIntensity:.9,transparent:true,opacity:.9,depthWrite:false});
const GF_ZOFF=0, GF_HEAD_Z=2.37, GF_TAIL_Z=-2.33; // the Blender build is shifted by ZOFF so the axles sit at +-wb; lamp stations measured off the GLB (no plate: the sheet shows a clean tail)
const GF_HW=[[-2.31,.74],[-2.27,.84],[-2.2,.925],[-2.05,.975],[-1.8,1.0],[-1.56,1.01],[-1.1,.985],[-.5,.955],[.2,.95],[.85,.96],[1.2,.975],[1.56,1.0],[1.85,.985],[2.0,.965],[2.12,.935],[2.24,.89],[2.34,.83],[2.43,.74],[2.49,.6]],
  GF_YS=[[-2.31,.82],[-2.27,.88],[-2.15,.93],[-1.8,.96],[-1.5,.965],[-1.1,.94],[-.4,.92],[.4,.91],[.9,.91],[1.3,.905],[1.56,.91],[1.9,.85],[2.2,.79],[2.4,.745],[2.49,.7]],
  GF_YB=[[-2.31,.36],[-2.27,.28],[-2.15,.2],[-1.95,.15],[2.1,.14],[2.36,.17],[2.49,.2]];
function granfourGlbShell(g,def,B,paint,glass,opts){
  const parts=glbParts('granfour',opts&&opts.lod); if(!parts) return granfourShell(g,def,B,paint,glass,opts);
  const K=carKit(g); rimPaint(paint,0xffe2a8,.04);
  paint.clearcoat=0; paint.roughness=Math.max(paint.roughness,.45); paint.metalness=.25; paint.envMapIntensity=.6; // satin wrap
  const satin=new THREE.MeshStandardMaterial({color:0x3c4047,metalness:.9,roughness:.32});
  const MATS={PAINT:paint,GLASS:GF_GLASS,GLOSSBLACK:GLOSS_BLACK,GAP:gapM,HEAD:headM,TAIL:tailM,TAILW:AB_TAILW,CHROME:chromeTrimM,LENS:LENS_M,SATIN:satin,GRILLE:GF_GRILLE,YELLOW:GF_YELLOW,REFLECT:AB_REFLECT,INTERIOR:AB_CABIN,CARBON:K.carbon};
  parts.forEach(p=>{ const m=new THREE.Mesh(p.geo,MATS[p.key]||paint); if(p.key==='GLASS') m.renderOrder=3; g.add(m); });
  [1,-1].forEach(sd=>{ K.glow(0xcfe6ff,.35,sd*.64,.72,GF_HEAD_Z); K.glow(0xff2030,.3,sd*.7,.88,GF_TAIL_Z); });
  // side-section sampler for the street vinyl: same keys as the Blender loft (HW / YS / YB in gran_four.py)
  return {sec:z=>{ z-=GF_ZOFF; const hs=kfCR(GF_HW,z), ys=kfCR(GF_YS,z), yb=kfCR(GF_YB,z); return {hs,ys,yb,hl:hs-.07,ay:ys-.12,yc:ys+.1,yf:ys+.1}; }};
}

/* ---- Bell 76: W16 longtail hypercar. Smooth teardrop body, gold C-sweep around the door and side intake, horseshoe
   grille, quad-LED headlamps, gold dorsal spine over the roof, full-width tail light bar, square quad exhaust,
   active wing. Two-tone: blue over a darker navy tail section. ---- */
function bellShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0x8fb0ff,.2);
  paint.clearcoat=1; paint.clearcoatRoughness=.015;
  const gold=new THREE.MeshStandardMaterial({color:def.accent||0xd8b04a,metalness:.9,roughness:.2});
  const navy=new THREE.MeshPhysicalMaterial({color:0x07142e,metalness:.6,roughness:.18,clearcoat:1,clearcoatRoughness:.02});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:70,inset:.14,
    hwS:[[-R,.9],[-2.1,1.05],[-WB,1.1],[-.7,1.0],[0,.98],[.7,1.0],[WB,1.06],[1.9,.98],[F,.84]],
    ysK:[[-R,.66],[-WB,.78],[-.6,.66],[.5,.64],[WB,.72],[1.9,.56],[F,.4]],
    yfK:[[-R,.86],[-2.0,.94],[-WB,.98],[-.6,.9],[.5,.84],[WB,.86],[1.9,.66],[F,.46]],
    ycK:[[-R,.82],[-2.0,.9],[-1.5,.94],[-.8,.9],[0,.84],[.9,.74],[1.6,.62],[F,.44]],
    hwL:[[-R,.86],[-WB,.84],[0,.9],[WB,.82],[F,.76]],
    ybK:[[-R,.3],[-2.2,.19],[2.0,.19],[F,.24]]},paint,K);
  const C={z0:-1.3,z1:1.25,tumble:.12,pow:.62,cwK:[[-1.3,.3],[-1.0,.56],[-.4,.64],[.3,.64],[.85,.54],[1.25,.3]],htK:[[-1.3,.92],[-.95,1.14],[-.35,1.28],[.25,1.28],[.8,1.08],[1.25,.8]],roof:[-1.0,.95],roofA:.9};
  sculptCanopy(g,C,T,glass,paint,K); outlawKit(K,T,C);
  // navy tail section behind the C-sweep
  K.top(-.9,.9,-R+.06,-1.35,navy,.004,20);
  // gold dorsal spine from the hood over the roof to the tail
  { const pts=[]; for(let i=0;i<=30;i++){ const z=lerp(F-.5,-R+.2,i/30); let y=T.top(0,z)+.012; if(z>C.z0+.05&&z<C.z1-.05) y=Math.max(y,canopyY(C,T,0,z)+.022); pts.push([0,y,z]); } K.tube(pts,.016,gold,80,5); }
  [1,-1].forEach(sd=>{
    // gold C-sweep: an arc around the door, closing over a carbon side intake
    const zc=-.02, R0=.86, pts=[]; for(let i=0;i<=24;i++){ const a=-Math.PI/2+Math.PI*i/24, z=zc-R0*Math.cos(a)*.95, c=T.sec(z), y=lerp(c.yb+.08,c.ys-.02,(Math.sin(a)+1)/2); pts.push([sd*(lerp(c.hl,c.hs,clamp((y-c.ay)/(c.ys-c.ay),0,1))+.014),y,z]); }
    K.tube(pts,.028,gold,48,6);
    const ci=T.sec(-.62), it=K.add(K.scoop(.72,.34),carbon,sd>0?ci.hl+.02:-(ci.hl+.08),ci.yb+.1,-.66); it.rotation.y=Math.PI/2;
    // quad-LED headlamps in a slim housing
    const z0=F-.42; K.add(bandGeo((u,z)=>{ const x=sd*lerp(.44,.8,u); return [x,T.top(x,z)+.006]; },z0,F-.08,8,6,sd<0),lensM);
    [.5,.58,.66,.74].forEach((x,i)=>{ const z=z0+.08+i*.04, d=K.add(new THREE.BoxGeometry(.06,.014,.05),headM,sd*x,T.top(sd*x,z)+.014,z); d.rotation.x=-.3; });
    K.glow(0xcfe6ff,.9,sd*.62,T.top(sd*.62,F-.2)+.05,F+.02);
    K.shut(sd,.9); K.mirror(sd,.9,paint); K.sill(sd,-WB+WR+.2,WB-WR-.2,.03,.14,carbon); });
  // front: horseshoe grille with a dark mesh, side intakes, splitter
  { const z=F+.008, cy=.34; K.add(new THREE.CircleGeometry(.15,32),gapM,0,cy,z);
    const hs=K.add(new THREE.TorusGeometry(.16,.025,10,40,Math.PI*1.35),chromeTrimM,0,cy,z+.006); hs.rotation.z=-Math.PI*.175+Math.PI;
    [1,-1].forEach(sd=>K.add(new THREE.PlaneGeometry(.36,.16),gapM,sd*.52,.3,z-.01)); K.splitter(.92,F-.35,F+.03,.14); }
  // rear: full-width light bar, open black rear, square quad exhaust in the middle, active wing
  K.tube([[-.9,.8,-R-.01],[-.45,.82,-R-.014],[0,.825,-R-.014],[.45,.82,-R-.014],[.9,.8,-R-.01]],.014,tailM,30);
  K.glow(0xff2030,.9,.6,.81,-R-.07); K.glow(0xff2030,.9,-.6,.81,-R-.07);
  K.add(new THREE.PlaneGeometry(1.7,.34),gapM,0,.5,-R-.008).rotation.y=Math.PI;
  for(let i=0;i<6;i++) K.add(new THREE.BoxGeometry(1.66,.01,.02),carbon,0,.38+i*.05,-R-.015);
  [[-.1,.07],[.1,.07],[-.1,-.07],[.1,-.07]].forEach(([x,y])=>{ K.add(new THREE.BoxGeometry(.15,.11,.14),exhM,x,.46+y,-R-.02); K.add(new THREE.BoxGeometry(.11,.07,.02),gapM,x,.46+y,-R-.095); });
  for(let i=0;i<7;i++) K.add(new THREE.BoxGeometry(.02,.18,.5),carbon,-.6+i*.2,.24,-R+.22);
  { const w=K.add(K.airfoil(.4,.045,1.7),navy,0,T.top(0,-2.35)+.1,-2.3); w.rotation.y=Math.PI/2; w.rotation.z=.18;
    [1,-1].forEach(sd=>K.add(new THREE.BoxGeometry(.03,.1,.12),carbon,sd*.5,T.top(sd*.5,-2.35)+.05,-2.35)); }
  K.plate(def,.3,-R-.02);
  return T;
}

/* ---- Passyunk R: hot hatch. Short two-box body, near-vertical tailgate, blistered box arches, short hood with a
   scoop, honeycomb grille with a red line, roof spoiler, black roof, twin white stripes, triple center exhaust. ---- */
function passyunkShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0xff8080,.14);
  paint.clearcoat=1; paint.clearcoatRoughness=.02;
  const white=new THREE.MeshStandardMaterial({color:0xf2f4f6,roughness:.3,metalness:.1});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:56,inset:.14,
    hwS:[[-R,.94],[-WB-.1,1.04],[-.6,.96],[0,.94],[.6,.96],[WB+.1,1.04],[F,.94]],
    ysK:[[-R,.9],[-WB,.84],[0,.82],[WB,.84],[1.7,.8],[F,.66]],
    yfK:[[-R,1.04],[-WB,1.04],[-.5,1.02],[.5,1.0],[WB,.96],[1.7,.9],[F,.72]],
    ycK:[[-R,1.02],[-1.7,1.04],[-1.2,1.03],[0,1.0],[.8,.94],[1.5,.86],[F,.7]],
    hwL:[[-R,.9],[-WB,.84],[0,.9],[WB,.84],[F,.9]],
    ybK:[[-R,.34],[-1.9,.26],[1.9,.26],[F,.3]]},paint,K);
  const C={z0:-1.92,z1:.98,tumble:.12,pow:.42,cwK:[[-1.92,.62],[-1.75,.68],[-.8,.7],[.2,.7],[.7,.64],[.98,.54]],htK:[[-1.92,1.2],[-1.8,1.5],[-1.0,1.56],[-.2,1.56],[.5,1.38],[.98,1.02]],roof:[-1.72,.3],roofA:1.2};
  sculptCanopy(g,C,T,glass,GLOSS_BLACK,K); outlawKit(K,T,C);
  // box arch blisters: a flat-topped flare over each wheel
  [1,-1].forEach(sd=>[WB,-WB].forEach(zw=>{ const pts=[]; for(let i=0;i<=12;i++){ const a=Math.PI*(.12+.76*i/12), z=zw-Math.cos(a)*(WR+.14), c=T.sec(z); pts.push([sd*(c.hs+.02),WR+Math.sin(a)*(WR+.12),z]); } K.tube(pts,.04,paint,20,6); }));
  // twin white stripes over hood, roof and tailgate top
  [.13,-.13].forEach(x=>{ K.top(x-.055,x+.055,C.z1-.02,F-.08,white,.006,16); K.roof(x-.055,x+.055,C.z0+.08,C.z1-.06,white,.024,16); });
  // hood scoop
  { const y=T.top(0,1.45); K.add(new THREE.BoxGeometry(.4,.06,.28),GLOSS_BLACK,0,y+.03,1.45); K.add(new THREE.PlaneGeometry(.32,.035),gapM,0,y+.04,1.592); }
  // front: honeycomb grille with a red pinline, round-cornered lamps, big lower intake, splitter
  { const z=F+.006, hc=new THREE.MeshBasicMaterial({map:CT(canvasTex(256,64,(c,w,h)=>{ c.fillStyle='#050506'; c.fillRect(0,0,w,h); c.strokeStyle='#2a2d33'; c.lineWidth=2;
      for(let y=0;y<6;y++) for(let x=0;x<26;x++){ const cx=x*10+(y%2)*5, cy=y*11+5; c.beginPath(); for(let k=0;k<6;k++){ const a=k*Math.PI/3; c.lineTo(cx+4.5*Math.cos(a),cy+4.5*Math.sin(a)); } c.closePath(); c.stroke(); } }))});
    K.add(new THREE.PlaneGeometry(1.0,.16),hc,0,.6,z); K.add(new THREE.BoxGeometry(1.0,.012,.012),new THREE.MeshBasicMaterial({color:0xff2030,toneMapped:false}),0,.525,z+.006);
    K.add(new THREE.PlaneGeometry(1.2,.2),hc,0,.38,z-.004); K.splitter(.86,F-.3,F+.03,.22);
    [1,-1].forEach(sd=>{ K.add(new THREE.PlaneGeometry(.3,.12),lensM,sd*.66,.66,z+.003); K.tube([[sd*.52,.7,z+.008],[sd*.8,.7,z+.008]],.011,headM,6); K.glow(0xcfe6ff,1.0,sd*.66,.66,z+.06); }); }
  [1,-1].forEach(sd=>{ K.shut(sd,.72); K.mirror(sd,.78,GLOSS_BLACK); K.sill(sd,-WB+WR+.2,WB-WR-.2,.03,.14,GLOSS_BLACK);
    for(let i=0;i<3;i++){ const z=WB-WR-.24, s=T.sec(z); K.add(new THREE.BoxGeometry(.012,.025,.16),GLOSS_BLACK,sd*(s.hs+.02),s.ys-.06-i*.06,z); }
    // tail: tall lamps at the corners of the tailgate
    K.add(new THREE.BoxGeometry(.2,.16,.02),tailM,sd*.66,.98,-R-.012); K.glow(0xff2030,.9,sd*.66,.98,-R-.07); });
  // roof spoiler with endplates, black rear bumper insert, diffuser, triple center exhaust
  { const y=kfCR(C.htK,-1.8); const w=K.add(new THREE.BoxGeometry(1.24,.035,.3),GLOSS_BLACK,0,y+.005,-1.92); w.rotation.x=.18;
    [1,-1].forEach(sd=>K.add(new THREE.BoxGeometry(.03,.07,.3),GLOSS_BLACK,sd*.62,y-.02,-1.92)); }
  K.add(new THREE.PlaneGeometry(1.5,.18),GLOSS_BLACK,0,.44,-R-.008).rotation.y=Math.PI;
  for(let i=0;i<5;i++) K.add(new THREE.BoxGeometry(.02,.14,.32),carbon,-.4+i*.2,.34,-R+.12);
  [-.14,0,.14].forEach(x=>K.pipe(x,.42,-R-.05,.05));
  K.plate(def,.72,-R-.02);
  return T;
}

/* ---- Richmond: supercharged work pickup. Tall squared-off nose with a huge grille, raised power bulge, crew cab,
   open bed with a liner and a pallet, headache rack with a light bar, box flares, steel bumpers, tow hitch. ---- */
function richmondShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0xffa060,.1);
  paint.clearcoat=.6; paint.clearcoatRoughness=.1;
  const steel=new THREE.MeshStandardMaterial({color:0x2a2d33,metalness:.7,roughness:.45}), liner=new THREE.MeshStandardMaterial({color:0x101113,roughness:.9});
  const clad=new THREE.MeshStandardMaterial({color:0x08090a,roughness:.7,metalness:.1,envMapIntensity:.4}), orange=new THREE.MeshStandardMaterial({color:def.caliper,roughness:.4,metalness:.3});
  const amber=new THREE.MeshBasicMaterial({color:0xffa028,toneMapped:false}), wood=new THREE.MeshStandardMaterial({color:0x8a6a44,roughness:.85});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear, bz1=-.72; // bed runs from the tail to bz1
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:64,inset:.1,
    hwS:[[-R,1.0],[-WB,1.04],[0,1.02],[WB,1.04],[F,.98]],
    ysK:[[-R,.92],[-WB,.94],[bz1-.05,.94],[bz1+.1,1.14],[WB,1.18],[2.2,1.14],[F,1.02]],
    yfK:[[-R,1.02],[-WB,1.02],[bz1-.05,1.02],[bz1+.1,1.36],[WB,1.4],[2.2,1.38],[F,1.28]],
    ycK:[[-R,1.0],[-WB,1.0],[bz1-.05,1.0],[bz1+.1,1.34],[1.0,1.4],[WB,1.42],[2.2,1.42],[F,1.3]],
    hwL:[[-R,.94],[-WB,.94],[0,.98],[WB,.94],[F,.94]],
    ybK:[[-R,.62],[-2.3,.52],[2.3,.52],[F,.6]]},paint,K);
  outlawKit(K,T,{cwK:[[-1,.84],[1,.84]],htK:[[-1,1.9],[1,1.9]],pow:.4});
  // crew cab: lofted directly (the canopy helper assumes one continuous glasshouse)
  { const st=[], z0=bz1+.02, z1=1.12; for(let i=0;i<24;i++){ const z=lerp(z0,z1,i/23), t=(z-z0)/(z1-z0), base=T.yc(z)-.02, top=2.02-Math.max(0,t-.72)*1.9, hw=.86-.04*t; st.push({z,pts:[[0,base],[hw,base],[hw*.97,base+(top-base)*.55],[hw*.9,top-.04],[hw*.6,top],[0,top+.005]]}); }
    K.add(loftGeo(st),glass);
    const roof=[]; for(let i=0;i<20;i++){ const z=lerp(z0+.02,z1-.35,i/19); roof.push({z,pts:[[0,2.0],[.8,1.97],[.84,2.0],[.6,2.04],[0,2.05]]}); } K.add(loftGeo(roof),paint);
    [1,-1].forEach(sd=>{ [z0+.03,.18,z1-.3].forEach(z=>K.add(new THREE.BoxGeometry(.05,.62,.08),paint,sd*.84,1.68,z)); // pillars
      K.tube([[sd*.85,1.36,z0+.05],[sd*.85,1.36,z1-.3]],.012,GLOSS_BLACK,6); }); }
  // bed: liner, side rails, tailgate, pallet
  { const bl=bz1-(-R+.05), bm=(bz1+(-R+.05))/2;
    K.add(new THREE.BoxGeometry(1.7,.03,bl),liner,0,1.02,bm);
    [1,-1].forEach(sd=>{ K.add(new THREE.BoxGeometry(.12,.44,bl),paint,sd*.93,1.16,bm); K.add(new THREE.BoxGeometry(.02,.4,bl),liner,sd*.86,1.18,bm); K.add(new THREE.BoxGeometry(.16,.03,bl),steel,sd*.93,1.39,bm); });
    K.add(new THREE.BoxGeometry(2.0,.44,.08),paint,0,1.16,-R+.04); K.add(new THREE.BoxGeometry(1.72,.4,.06),liner,0,1.18,bz1+.02);
    for(let i=0;i<5;i++) K.add(new THREE.BoxGeometry(1.1,.03,.14),wood,0,1.15,-1.75-.36+i*.18);
    [-.45,0,.45].forEach(x=>K.add(new THREE.BoxGeometry(.12,.1,.9),wood,x,1.08,-1.75)); }
  // headache rack with an LED bar over the cab
  [1,-1].forEach(sd=>K.add(new THREE.BoxGeometry(.06,.8,.06),steel,sd*.78,1.62,bz1-.08)); K.add(new THREE.BoxGeometry(1.62,.06,.06),steel,0,2.02,bz1-.08);
  [-.4,-.2,0,.2,.4].forEach(x=>K.add(new THREE.BoxGeometry(.08,.035,.05),amber,x,2.07,.3));
  K.add(new THREE.BoxGeometry(1.5,.07,.14),GLOSS_BLACK,0,2.1,.7); K.add(new THREE.BoxGeometry(1.44,.04,.02),headM,0,2.1,.775); [-.5,0,.5].forEach(x=>K.glow(0xeaf4ff,.8,x,2.1,.82));
  // power bulge on the hood with a black intake
  K.add(bandGeo((u,z)=>{ const x=lerp(-.44,.44,u), e=Math.sin(Math.PI*clamp((z-1.25)/(F-.2-1.25),0,1)); return [x,T.top(x,z)+.07*Math.sin(Math.PI*u)*Math.sqrt(e)]; },1.25,F-.2,20,8),paint);
  K.add(new THREE.BoxGeometry(.36,.08,.2),GLOSS_BLACK,0,T.top(0,1.5)+.09,1.5);
  // front: huge grille with steel bars, stacked lamps, steel bumper, orange tow hooks
  { const z=F+.006; K.add(new THREE.PlaneGeometry(1.24,.46),GLOSS_BLACK,0,1.0,z);
    for(let i=0;i<4;i++) K.add(new THREE.BoxGeometry(1.2,.05,.02),exhM,0,.84+i*.11,z+.01);
    [1,-1].forEach(sd=>{ K.add(new THREE.PlaneGeometry(.2,.3),lensM,sd*.78,1.02,z+.002); [1.1,.96].forEach(y=>K.add(new THREE.BoxGeometry(.16,.03,.02),headM,sd*.78,y,z+.008)); K.glow(0xcfe6ff,1.0,sd*.78,1.04,z+.06);
      K.add(new THREE.BoxGeometry(.08,.12,.16),orange,sd*.62,.56,z+.12); }); K.add(new THREE.BoxGeometry(2.1,.24,.26),steel,0,.62,F+.04); }
  // flanks: box flares, clad sills with steps, mud flaps, mirrors; rear: steel bumper, hitch, tall tail lamps
  [1,-1].forEach(sd=>{ [WB,-WB].forEach(zw=>{ const pts=[]; for(let i=0;i<=12;i++){ const a=Math.PI*(.1+.8*i/12), z=zw-Math.cos(a)*(WR+.16), c=T.sec(z); pts.push([sd*(c.hs+.04),WR+Math.sin(a)*(WR+.14),z]); } K.tube(pts,.06,clad,20,6);
      K.add(new THREE.BoxGeometry(.34,.4,.02),GLOSS_BLACK,sd*.92,.34,zw-WR-.2); });
    K.sill(sd,-WB+WR+.24,WB-WR-.24,.02,.26,clad);
    const pts=[]; for(let i=0;i<=8;i++){ const z=lerp(-WB+WR+.3,WB-WR-.3,i/8), c=T.sec(z); pts.push([sd*(c.hl+.06),c.yb-.02,z]); } K.tube(pts,.04,steel,16);
    K.shut(sd,.2); K.shut(sd,-.4);
    { const ms=K.add(new THREE.BoxGeometry(.26,.2,.08),GLOSS_BLACK,sd*1.02,1.58,1.0); void ms; }
    K.add(new THREE.BoxGeometry(.1,.4,.03),tailM,sd*.84,1.14,-R-.01); K.glow(0xff2030,.9,sd*.84,1.14,-R-.07); });
  K.add(new THREE.BoxGeometry(2.0,.18,.24),steel,0,.62,-R-.02); K.add(new THREE.BoxGeometry(.1,.1,.26),steel,0,.56,-R-.18);
  K.pipe(.6,.52,-R-.08,.06); K.plate(def,.9,-R-.02); void carbon;
  return T;
}

/* ---- Zenkai 37: JDM widebody coupe. Long nose, cab set back, short fastback deck, bolt-on riveted over-fenders,
   carbon hood with vents, "37" door roundels, windshield banner, vortex generators, big GT wing, quad round tails,
   titanium center exit. ---- */
function zenkaiShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0xff7070,.16);
  paint.clearcoat=1; paint.clearcoatRoughness=.02;
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:60,inset:.15,
    hwS:[[-R,.9],[-WB,1.02],[-.5,.94],[0,.92],[.5,.93],[WB,1.0],[F,.84]],
    ysK:[[-R,.72],[-WB,.78],[0,.7],[WB,.74],[1.8,.64],[F,.48]],
    yfK:[[-R,.92],[-1.6,.96],[-WB,.96],[-.4,.9],[.4,.86],[WB,.84],[1.8,.72],[F,.56]],
    ycK:[[-R,.9],[-1.6,.95],[-1.2,.95],[-.4,.9],[.4,.84],[WB,.78],[1.8,.68],[F,.54]],
    hwL:[[-R,.86],[-WB,.82],[0,.88],[WB,.82],[F,.78]],
    ybK:[[-R,.3],[-1.9,.2],[1.9,.2],[F,.24]]},paint,K);
  const C={z0:-1.62,z1:.82,tumble:.14,pow:.6,cwK:[[-1.62,.36],[-1.3,.56],[-.7,.64],[0,.64],[.5,.56],[.82,.4]],htK:[[-1.62,.96],[-1.2,1.14],[-.6,1.3],[-.1,1.32],[.45,1.16],[.82,.9]],roof:[-1.35,.35],roofA:.92};
  sculptCanopy(g,C,T,glass,paint,K); outlawKit(K,T,C);
  // bolt-on over-fenders with rivets
  [1,-1].forEach(sd=>[WB,-WB].forEach(zw=>{ const pts=[]; for(let i=0;i<=14;i++){ const a=Math.PI*(.08+.84*i/14), z=zw-Math.cos(a)*(WR+.2), c=T.sec(z); pts.push([sd*(c.hs+.06),WR+Math.sin(a)*(WR+.14),z]); } K.tube(pts,.07,paint,24,8);
    for(let k=1;k<14;k+=2){ const p=pts[k]; K.add(new THREE.SphereGeometry(.014,6,4),chromeTrimM,p[0]+sd*.06,p[1],p[2]); } }));
  // carbon hood with vents, carbon lip, tow strap
  K.top(-.62,.62,.9,F-.12,carbon,.006,20);
  [.3,-.3].forEach(x=>{ for(let i=0;i<5;i++){ const z=1.3+i*.07; K.add(new THREE.BoxGeometry(.3,.01,.03),gapM,x,T.top(x,z)+.012,z); } });
  K.splitter(.86,F-.3,F-.04,.16);
  K.add(new THREE.BoxGeometry(.06,.1,.04),new THREE.MeshStandardMaterial({color:0xffc21a,roughness:.5}),.5,.26,F-.02);
  // front: wide black mouth, slim lamps with a single LED line
  K.add(new THREE.PlaneGeometry(1.1,.2),GLOSS_BLACK,0,.34,F+.006);
  [1,-1].forEach(sd=>{ K.tube([K.P(sd*.4,F-.14),K.P(sd*.62,F-.22),K.P(sd*.8,F-.36)],.014,headM,10); K.lens(sd*.6,T.top(sd*.6,F-.24)+.008,F-.24,.2,.03,.14,.3,sd*.3); K.glow(0xcfe6ff,.9,sd*.6,T.top(sd*.6,F-.2)+.04,F);
    // "37" roundels on the doors
    const s=T.sec(.1), n=K.add(new THREE.PlaneGeometry(.42,.42),new THREE.MeshStandardMaterial({map:CT(canvasTex(128,128,(c,w,h)=>{ c.fillStyle='#f4f5f7'; c.beginPath(); c.arc(w/2,h/2,w/2-2,0,7); c.fill(); c.fillStyle='#111214'; c.font='800 70px "Arial Narrow",Arial,sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('37',w/2,h/2+4); })),transparent:true,roughness:.4,polygonOffset:true,polygonOffsetFactor:-2}),sd*(s.hs+.012),s.ys-.1,.1); n.rotation.y=sd*Math.PI/2;
    K.shut(sd,.7); K.mirror(sd,.6,paint); K.sill(sd,-WB+WR+.26,WB-WR-.26,.02,.16,carbon);
    // quad round tail lamps
    [.44,.7].forEach(x=>{ K.add(new THREE.TorusGeometry(.075,.02,8,24),tailM,sd*x,.74,-R-.02); K.add(new THREE.CircleGeometry(.055,20),gapM,sd*x,.74,-R-.012).rotation.y=Math.PI; });
    K.glow(0xff2030,.8,sd*.57,.74,-R-.07); });
  // windshield banner
  { const bz=.62, y0=canopyY(C,T,0,bz)+.012, y1=canopyY(C,T,0,bz-.12)+.012;
    const ban=K.add(new THREE.PlaneGeometry(1.0,.14),new THREE.MeshBasicMaterial({map:CT(canvasTex(512,64,(c,w,h)=>{ c.fillStyle='#08090b'; c.fillRect(0,0,w,h); c.fillStyle='#f4f5f7'; c.font='800 44px "Arial Narrow",Arial,sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('ZENKAI',w/2,h/2+2); }))}),0,(y0+y1)/2,bz-.06);
    ban.rotation.x=-Math.PI/2+Math.atan2(y0-y1,.12); }
  // vortex generators on the roof's trailing edge
  for(let i=0;i<7;i++){ const x=-.42+i*.14; K.add(new THREE.BoxGeometry(.012,.05,.1),carbon,x,canopyY(C,T,x,-1.3)+.04,-1.3); }
  // rear: black panel, diffuser, titanium center exit, big GT wing on swan necks
  K.add(new THREE.PlaneGeometry(1.5,.2),GLOSS_BLACK,0,.44,-R-.01).rotation.y=Math.PI;
  for(let i=0;i<7;i++) K.add(new THREE.BoxGeometry(.02,.2,.5),carbon,-.6+i*.2,.24,-R+.22);
  { const ti=new THREE.MeshStandardMaterial({color:0x6a7fb8,metalness:1,roughness:.22}), ex=K.add(new THREE.CylinderGeometry(.1,.11,.22,18,1,true),ti,0,.36,-R-.06); ex.rotation.x=Math.PI/2; K.add(new THREE.CircleGeometry(.09,18),gapM,0,.36,-R+.01).rotation.y=Math.PI; }
  { const w=K.add(K.airfoil(.5,.06,2.0),carbon,0,1.32,-1.9); w.rotation.y=Math.PI/2; w.rotation.z=.12;
    [1,-1].forEach(sd=>{ K.tube([[sd*.4,T.top(sd*.4,-1.98)-.01,-1.98],[sd*.4,1.2,-2.0],[sd*.4,1.38,-1.94],[sd*.4,1.36,-1.8]],.03,carbon,14);
      K.add(new THREE.BoxGeometry(.014,.34,.66),carbon,sd*1.01,1.3,-1.92); }); }
  K.plate(def,.58,-R-.02);
  return T;
}

/* ---- Hikari 91: a late-night drift build. Long low hood with the pop-up lamps flipped up, a fastback hatch that runs
   almost to the tail, riveted bolt-on over-fenders with black leading-edge trim, a carbon splitter and skirts, round
   tail lamps in black bezels, a ducktail plus a GT wing on stands, and lime brush slashes over satin violet. ---- */
let HIKARI_VINYL=null, HIKARI_VINYL2=null; const HIKARI_VZ=[-2.2,.66];
function hikariVinylMat(two){ if(two) return HIKARI_VINYL2||(HIKARI_VINYL2=Object.assign(hikariVinylMat().clone(),{side:THREE.DoubleSide})); if(HIKARI_VINYL) return HIKARI_VINYL;
  // u runs rear (0) to nose (1) on both flanks, so the stripes rise toward the tail on either side without mirroring
  const tex=CT(canvasTex(1024,256,(g,w,h)=>{ const R=rng(91), lime='#9cff2e', deep='#2f6e08';
    const band=(x0,y0,x1,y1,t,taper)=>{ // one clean stripe: parallel edges, a knife-cut rear tip, a dark pinline under it
      const L=Math.hypot(x1-x0,y1-y0), nx=-(y1-y0)/L, ny=(x1-x0)/L, q=(k,s)=>[lerp(x0,x1,k)+nx*s,lerp(y0,y1,k)+ny*s];
      const poly=(sc,off)=>{ g.beginPath(); const pts=[q(0,-t/2*sc),q(1-taper,-t/2*sc),q(1,0),q(1-taper*.4,t/2*sc),q(.02,t/2*sc)]; pts.forEach(([x,y],i)=>i?g.lineTo(x+off,y+off):g.moveTo(x+off,y+off)); g.closePath(); g.fill(); };
      g.fillStyle=deep; poly(1.28,3); g.fillStyle=lime; poly(1,0);
      g.fillStyle='rgba(255,255,255,.18)'; g.beginPath(); const e=[q(.05,-t*.42),q(1-taper,-t*.42),q(1-taper*.9,-t*.3),q(.05,-t*.3)]; e.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y)); g.fill(); };
    // four parallel stripes, low at the front of the door, climbing over the rear quarter toward the tail
    [[1010,236,70,52,40,.1],[1000,196,150,26,24,.12],[980,164,250,20,13,.14],[1024,254,420,138,9,.16]].forEach(a=>band(...a));
    // a little grit thrown forward off the stripe roots (the reference is wet and dirty, not splattered)
    for(let i=0;i<55;i++){ const x=820+R()*200, y=150+R()*106, r=.6+R()*R()*3.5; g.globalAlpha=.4+R()*.5; g.fillStyle=lime; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); }
    g.globalAlpha=1; }));
  return HIKARI_VINYL=new THREE.MeshStandardMaterial({map:tex,transparent:true,alphaTest:.05,roughness:.3,metalness:.15,polygonOffset:true,polygonOffsetFactor:-2,depthWrite:false}); }
function surfGeo(fn,nu,nv,flip){ // param surface (u,v in 0..1) -> BufferGeometry; used for bands that run diagonally over the glass
  const pos=[],uv=[],idx=[]; for(let j=0;j<=nv;j++) for(let i=0;i<=nu;i++){ const p=fn(i/nu,j/nv); pos.push(p[0],p[1],p[2]); uv.push(i/nu,j/nv); }
  for(let j=0;j<nv;j++) for(let i=0;i<nu;i++){ const a=j*(nu+1)+i, b=a+1, c=a+nu+1, d=c+1; if(flip) idx.push(a,b,c,b,d,c); else idx.push(a,c,b,b,c,d); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2)); g.setIndex(idx); g.computeVertexNormals(); return g; }
function hikariShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0xc070ff,.12); // neon rim so the violet reads on a dark street
  paint.clearcoat=.5; paint.clearcoatRoughness=.2; paint.envMapIntensity=.7; // satin wrap under a light clear
  const lime=new THREE.MeshStandardMaterial({color:0x8ff21e,roughness:.35,metalness:.1}), amber=new THREE.MeshBasicMaterial({color:0xffa028,toneMapped:false});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  // proportions of a late-80s fastback: long, narrow, low nose that climbs to the cowl, straight beltline, hatch to the tail
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:64,inset:.1,taper:.05,
    hwS:[[-R,.84],[-1.9,.88],[-WB,.9],[-.8,.86],[0,.85],[.6,.87],[WB,.9],[1.9,.95],[F,.96]], // front flares are part of the shell, rolled into the bumper
    ysK:[[-R,.76],[-WB,.78],[-.5,.76],[.4,.75],[WB,.72],[1.9,.62],[F,.5]],
    yfK:[[-R,.88],[-1.8,.9],[-WB,.89],[-.4,.86],[.4,.84],[WB,.78],[1.9,.68],[F,.58]],
    ycK:[[-R,.88],[-1.85,.9],[-1.4,.89],[-.4,.86],[.4,.84],[WB,.78],[1.9,.68],[F,.58]],
    hwL:[[-R,.82],[-WB,.87],[0,.84],[WB,.87],[F,.86]], // flat door skin, not a pinched waist
    ybK:[[-R,.3],[-1.9,.2],[1.95,.2],[F,.24]]},paint,K);
  const C={z0:-2.05,z1:.98,tumble:.14,pow:.3,cwK:[[-2.05,.46],[-1.75,.64],[-1.1,.73],[-.3,.74],[.4,.71],[.98,.52]],htK:[[-2.05,1.0],[-1.65,1.15],[-1.0,1.35],[-.35,1.42],[.15,1.4],[.55,1.2],[.98,.88]],roof:[-1.25,.32],roofA:.62}; // long raked screen from the cowl, tall flat roof
  sculptCanopy(g,C,T,glass,paint,K); outlawKit(K,T,C);
  // greenhouse: a point on the glass at angle a (0 = sill, pi/2 = crown) and station z, lifted off the glass
  const dome=(sd,a,z,lift)=>{ const cw=kfCR(C.cwK,z), top=kfCR(C.htK,z), base=T.yc(z)-.03, ca=Math.cos(a), sa=Math.sin(a);
    return [sd*(cw*ca*(1-C.tumble*sa)+lift*ca),base+(top-base)*Math.pow(sa,C.pow)+lift*sa,z]; };
  const band=(sd,fn,m,nu,nv)=>K.add(surfGeo((u,v)=>{ const [a,z]=fn(u,v); return dome(sd,a,z,.012); },nu||4,nv||16,sd>0),m);
  const AT=.62; // where the roof skin starts
  [1,-1].forEach(sd=>{
    band(sd,(u,v)=>[lerp(.02,AT+.06,v),lerp(.96,.3,v)+(u-.5)*.13],paint,4,20);                           // A-pillar in body color
    band(sd,(u,v)=>[lerp(AT-.07,AT+.01,u),lerp(.2,-1.5,v)],GLOSS_BLACK,2,24);                        // window frame along the roof edge
    band(sd,(u,v)=>[lerp(.02,AT,v),-.8+(u-.5)*.1-.07*v],GLOSS_BLACK);                                  // B-pillar
    band(sd,(u,v)=>{ const a=lerp(.0,AT+.02,u); return [a,lerp(-2.05,lerp(-1.28,-1.6,a/AT),v)]; },paint,6,16); // C-pillar: the quarter glass ends in a raked body-color panel
    band(sd,(u,v)=>[lerp(.0,.06,u),lerp(-.8,-1.3,v)],GLOSS_BLACK,2,8);                                 // quarter window base trim
  });
  // bolt-on over-fenders: flat slab panels with an arch cut, bolted flush to the flank
  [1,-1].forEach(sd=>[WB,-WB].forEach(zw=>{ const zs=sd>0?-1:1, c=T.sec(zw), x0=c.hl-.06, x1=.98, front=zw>0, lf=front?.7:.62, lr=front?.62:.84, yt=front?WR*2+.14:Math.max(c.ys-.04,WR*2+.14), yb0=c.yb+.1;
    const sh=new THREE.Shape(), P=(dz,y)=>[zs*dz,y];
    const ar=WR+.04, xa=Math.sqrt(ar*ar-(yb0-WR)*(yb0-WR)), a0=Math.asin((yb0-WR)/ar); // U-shaped panel: the arch is cut out of the outline itself
    if(front){ sh.moveTo(...P(lf,yb0)); sh.lineTo(...P(lf-.02,yt-.18)); sh.quadraticCurveTo(...P(lf-.1,yt-.06),...P(lf-.4,yt)); } // the nose end drops with the hood
    else { sh.moveTo(...P(lf,yb0)); sh.lineTo(...P(lf-.06,yt-.12)); sh.quadraticCurveTo(...P(lf-.14,yt),...P(lf-.34,yt)); }
    sh.lineTo(...P(-lr+.3,yt)); sh.quadraticCurveTo(...P(-lr+.1,yt),...P(-lr+.04,yt-.14)); sh.lineTo(...P(-lr,yb0)); sh.lineTo(...P(-xa,yb0));
    for(let i=1;i<=24;i++){ const t=Math.PI-a0-(Math.PI-2*a0)*i/24; sh.lineTo(...P(Math.cos(t)*ar,WR+Math.sin(t)*ar)); } sh.lineTo(...P(lf,yb0));
    const geo=new THREE.ExtrudeGeometry(sh,{depth:x1-x0,bevelEnabled:true,bevelThickness:.07,bevelSize:.05,bevelSegments:5,curveSegments:32}); geo.rotateY(sd*Math.PI/2); // deep bevel so the flare blends into the flank
    const m=new THREE.Mesh(geo,paint); m.position.set(sd*x0,0,zw); g.add(m);
    const fx=sd*(x1+.072);
    for(let k=0;k<7;k++){ const a=Math.PI*(.15+.7*k/6); K.add(new THREE.SphereGeometry(.011,6,4),gapM,fx,WR+Math.sin(a)*(ar+.07),zw-Math.cos(a)*(ar+.07)); } // flush bolts, dark
    if(front){ // black lower trim sweeping up the front of the arch from the bumper corner (flat on the panel face)
      K.add(surfGeo((u,v)=>{ const t=Math.PI*lerp(-.06,.42,v), r=ar+lerp(.05,.16,u)*(1-.5*v)+.06*(1-v); return [fx+sd*(.004+.05*(1-v)),WR+Math.sin(t)*r,zw+Math.cos(t)*r]; },3,20,sd<0),GLOSS_BLACK); }
    else { const vg=new THREE.ShapeGeometry(sh,16); vg.rotateY(sd*Math.PI/2); const P2=vg.attributes.position, uv=vg.attributes.uv, y0=c.yb+.1, y1=c.ys+.06; // the stripes carry across the rear over-fender
      for(let i=0;i<P2.count;i++) uv.setXY(i,(zw+P2.getZ(i)-HIKARI_VZ[0])/(HIKARI_VZ[1]-HIKARI_VZ[0]),(P2.getY(i)-y0)/(y1-y0));
      const vm=new THREE.Mesh(vg,hikariVinylMat(true)); vm.position.set(sd*(x1+.074),0,zw); vm.renderOrder=1; g.add(vm); } }));
  // pop-up headlamps, flipped up at the front corners of the hood: painted pods, black bezel, one big clear rectangular lamp
  [1,-1].forEach(sd=>{ const x=sd*.6, z=F-.38, y=T.top(x,z)-.02;
    K.add(new THREE.BoxGeometry(.5,.012,.38),gapM,x,y+.004,z-.02); // the pocket they rise out of
    { const ws=new THREE.Shape(); ws.moveTo(.13,0); ws.lineTo(.13,.2); ws.lineTo(.05,.215); ws.lineTo(-.24,.03); ws.lineTo(-.24,0); ws.lineTo(.13,0); // pop-up wedge: tall lamp face, lid sloping back into the hood
      const wg=new THREE.ExtrudeGeometry(ws,{depth:.46,bevelEnabled:true,bevelThickness:.012,bevelSize:.01,bevelSegments:2}); wg.translate(0,0,-.23); wg.rotateY(-Math.PI/2); K.add(wg,paint,x,y,z-.013); }
    K.add(new THREE.PlaneGeometry(.42,.17),GLOSS_BLACK,x,y+.105,z+.13);
    K.add(new THREE.PlaneGeometry(.34,.13),chromeTrimM,x,y+.105,z+.133); K.add(new THREE.PlaneGeometry(.3,.11),headM,x,y+.105,z+.136); // one big clear lamp over a chrome reflector
    K.glow(0xdcecff,.9,x,y+.105,z+.24); });
  // front bumper: wide lower mouth, amber corners up high, fog lamps, carbon splitter, lime tow strap
  K.add(new THREE.PlaneGeometry(.92,.15),GLOSS_BLACK,0,.34,F+.006);
  for(let i=0;i<5;i++) K.add(new THREE.BoxGeometry(.9,.006,.01),gapM,0,.28+i*.03,F+.01);
  [1,-1].forEach(sd=>{ K.add(new THREE.BoxGeometry(.18,.05,.03),amber,sd*.56,.47,F-.012); K.glow(0xffa028,.45,sd*.56,.47,F+.03);
    K.add(new THREE.PlaneGeometry(.18,.09),GLOSS_BLACK,sd*.54,.3,F+.006); K.add(new THREE.CircleGeometry(.032,14),headM,sd*.54,.3,F+.012);
    K.tube([K.P(sd*.3,F-.08,.01),K.P(sd*.52,F-.12,.01),K.P(sd*.7,F-.24,.01)],.006,gapM,8); }); // bumper-to-hood seam
  K.splitter(.92,F-.4,F+.05,.19);
  K.add(new THREE.BoxGeometry(.06,.12,.03),lime,-.4,.25,F+.01);
  // door shuts, mirrors, carbon skirts, handles, hood seam
  [1,-1].forEach(sd=>{ K.shut(sd,.76); K.shut(sd,-.74); K.mirror(sd,.7,paint); K.sill(sd,-WB+WR+.24,WB-WR-.24,.0,.14,carbon);
    const s=T.sec(-.55); K.add(new THREE.BoxGeometry(.02,.03,.16),GLOSS_BLACK,sd*(s.hs+.008),s.ys-.08,-.55);
    const hs=[]; for(let i=0;i<=12;i++){ const z=lerp(F-.1,1.0,i/12); hs.push(K.P(sd*.7,z,.006)); } K.tube(hs,.005,gapM,16); });
  // lime stripes along each flank, door to rear quarter
  { const z0=HIKARI_VZ[0], z1=HIKARI_VZ[1], n=28, M=hikariVinylMat();
    [1,-1].forEach(sd=>{ const pos=[],uv=[],idx=[]; let m=0;
      for(let i=0;i<=n;i++){ const z=lerp(z0,z1,i/n), c=T.sec(z), o=.013, pts=[[sd*(c.hl+o),c.yb+.1],[sd*(c.hl+o),c.ay],[sd*(c.hs*.985+o),Math.max(c.ys-.08,c.ay+.02)],[sd*(c.hs+o*.7),c.ys-.005],[sd*(c.hs-.04+o),c.ys+.06]];
        const cum=[0]; for(let j=1;j<pts.length;j++) cum.push(cum[j-1]+Math.hypot(pts[j][0]-pts[j-1][0],pts[j][1]-pts[j-1][1]));
        pts.forEach((p,j)=>{ pos.push(p[0],p[1],z); uv.push(i/n,cum[j]/cum[cum.length-1]); }); m=pts.length; }
      for(let i=0;i<n;i++) for(let j=0;j<m-1;j++){ const a=i*m+j, b=a+1, c=a+m, d=c+1; if(sd>0) idx.push(a,b,c,b,d,c); else idx.push(a,c,b,b,c,d); }
      const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2)); geo.setIndex(idx); geo.computeVertexNormals();
      const v=new THREE.Mesh(geo,M); v.renderOrder=1; g.add(v); }); }
  // rear: full-width black panel, a dark red lens on each side holding two round lamps, reverse lamps, diffuser, twin tips
  const redLens=new THREE.MeshStandardMaterial({color:0x4a0008,emissive:0x3a0006,roughness:.15,metalness:.2});
  K.add(new THREE.PlaneGeometry(1.5,.2),GLOSS_BLACK,0,.76,-R-.008).rotation.y=Math.PI;
  [1,-1].forEach(sd=>{ K.add(new THREE.BoxGeometry(.5,.16,.04),redLens,sd*.5,.76,-R-.012);
    [.39,.61].forEach(x=>{ K.add(new THREE.CircleGeometry(.058,22),tailM,sd*x,.76,-R-.036).rotation.y=Math.PI; K.add(new THREE.TorusGeometry(.063,.01,6,22),GLOSS_BLACK,sd*x,.76,-R-.037); });
    K.add(new THREE.BoxGeometry(.06,.03,.02),headM,sd*.2,.72,-R-.03); K.glow(0xff2030,.85,sd*.5,.76,-R-.08); });
  for(let i=0;i<5;i++) K.add(new THREE.BoxGeometry(.02,.1,.4),carbon,-.5+i*.25,.29,-R+.2);
  [.44,.6].forEach(x=>K.pipe(x,.3,-R-.05,.05));
  // body-color hatch wing: thick blade on two blocks at the end of the hatch, kicked-up trailing edge
  { const wz=-2.02, wy=canopyY(C,T,0,wz)+.1, sp=new THREE.Shape();
    sp.moveTo(.16,0); sp.quadraticCurveTo(.2,.04,.1,.05); sp.lineTo(-.2,.07); sp.lineTo(-.3,.13); sp.lineTo(-.32,.105); sp.lineTo(-.22,.02); sp.quadraticCurveTo(0,-.015,.16,0);
    const wg=new THREE.ExtrudeGeometry(sp,{depth:1.6,bevelEnabled:true,bevelThickness:.02,bevelSize:.015,bevelSegments:3,curveSegments:12}); wg.translate(0,0,-.8); wg.rotateY(-Math.PI/2);
    K.add(wg,paint,0,wy,wz); K.add(new THREE.BoxGeometry(1.56,.012,.03),GLOSS_BLACK,0,wy+.155,wz-.31);
    [1,-1].forEach(sd=>K.add(new THREE.BoxGeometry(.14,.14,.26),paint,sd*.5,wy-.05,wz+.02)); }
  K.plate(def,.5,-R-.02);
  return T;
}

/* ---- Split 63: '63-style split-window restomod. Long pointed nose with a knife-edge beltline, hidden-lamp slits, fastback
   roof split down the middle by a spine, boattail deck, chrome bumperettes, side-exit pipes, stinger hood bulge. ---- */
function splitShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0xff6a50,.14);
  paint.clearcoat=1; paint.clearcoatRoughness=.01;
  const red=new THREE.MeshStandardMaterial({color:def.rimLip||0xd42020,roughness:.3,metalness:.3});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:64,inset:.16,
    hwS:[[-R,.82],[-1.8,.94],[-WB,.98],[-.6,.9],[0,.88],[.6,.9],[WB,.95],[1.9,.9],[F,.62]],
    ysK:[[-R,.66],[-WB,.72],[-.4,.64],[.6,.62],[WB,.66],[1.9,.6],[F,.46]],
    yfK:[[-R,.8],[-1.8,.9],[-WB,.92],[-.4,.84],[.6,.8],[WB,.84],[1.9,.72],[F,.52]],
    ycK:[[-R,.76],[-1.9,.86],[-1.4,.9],[-.6,.86],[.4,.8],[1.3,.76],[1.9,.68],[F,.5]],
    hwL:[[-R,.78],[-WB,.78],[0,.84],[WB,.78],[F,.56]],
    ybK:[[-R,.3],[-1.9,.22],[2.0,.22],[F,.26]]},paint,K);
  const C={z0:-1.95,z1:.22,tumble:.1,pow:.6,cwK:[[-1.95,.2],[-1.6,.46],[-1.0,.58],[-.4,.6],[0,.56],[.22,.42]],htK:[[-1.95,.86],[-1.5,1.08],[-.9,1.24],[-.4,1.26],[0,1.14],[.22,.9]],roof:[-1.2,-.1],roofA:.95};
  sculptCanopy(g,C,T,glass,paint,K); outlawKit(K,T,C);
  // the split: a body-color spine down the rear window
  { const pts=[]; for(let i=0;i<=12;i++){ const z=lerp(-1.9,-1.15,i/12); pts.push([0,canopyY(C,T,0,z)+.012,z]); } K.tube(pts,.032,paint,24,6); }
  // stinger bulge down the hood with chrome spears, knife-edge beltline
  K.add(bandGeo((u,z)=>{ const x=lerp(-.22,.22,u), e=Math.sin(Math.PI*clamp((z-.5)/(F-.35-.5),0,1)); return [x,T.top(x,z)+.03*Math.sin(Math.PI*u)*Math.sqrt(e)]; },.5,F-.35,24,8),paint);
  [1,-1].forEach(sd=>{ K.tube([K.P(sd*.21,.9,.04),K.P(sd*.21,1.4,.05)],.008,chromeTrimM,6);
    const bl=[]; for(let i=0;i<=14;i++){ const z=lerp(-R+.1,F-.1,i/14), c=T.sec(z); bl.push([sd*(c.hs+.006),c.ys,z]); } K.tube(bl,.006,chromeTrimM,30);
    // hidden-lamp slits and parking lamps in the nose
    K.add(new THREE.BoxGeometry(.3,.012,.1),gapM,sd*.46,T.top(sd*.46,F-.35)+.008,F-.35);
    K.add(new THREE.BoxGeometry(.18,.04,.02),headM,sd*.5,.4,F-.02); K.glow(0xcfe6ff,.7,sd*.5,.4,F+.03);
    // fender vents, side-exit pipes, door shut, mirror
    for(let i=0;i<3;i++){ const z=1.02, s=T.sec(z); K.add(new THREE.BoxGeometry(.012,.035,.26),GLOSS_BLACK,sd*(s.hs+.006),s.ys-.08-i*.06,z); }
    const pp=K.add(new THREE.CylinderGeometry(.05,.05,1.3,14),chromeTrimM,sd*(T.sec(0).hl+.1),.3,.1); pp.rotation.x=Math.PI/2;
    K.shut(sd,.2); K.mirror(sd,.05,chromeTrimM);
    // chrome bumperettes and quad round tail lamps
    K.tube([[sd*.2,.44,F-.02],[sd*.5,.46,F-.06],[sd*.66,.44,F-.14]],.028,chromeTrimM,10);
    K.tube([[sd*.25,.48,-R-.02],[sd*.55,.5,-R+.02],[sd*.7,.48,-R+.08]],.028,chromeTrimM,10);
    [.32,.56].forEach(x=>{ const l=K.add(new THREE.CircleGeometry(.065,22),tailM,sd*x,.66,-R-.01); l.rotation.y=Math.PI; K.add(new THREE.TorusGeometry(.07,.012,6,22),chromeTrimM,sd*x,.66,-R-.012); });
    K.glow(0xff2030,.8,sd*.44,.66,-R-.07); });
  // grille: slim black mouth with chrome teeth and a red pinline, crossed-flags badge
  { const z=F+.006; K.add(new THREE.PlaneGeometry(.8,.12),gapM,0,.4,z); for(let i=0;i<9;i++) K.add(new THREE.BoxGeometry(.016,.1,.02),chromeTrimM,-.36+i*.09,.4,z+.006);
    K.add(new THREE.BoxGeometry(.8,.008,.012),red,0,.465,z+.006);
    const badge=K.add(new THREE.CircleGeometry(.06,20),new THREE.MeshStandardMaterial({map:CT(canvasTex(128,128,(c,w,h)=>{ c.fillStyle='#dfe4ea'; c.beginPath(); c.arc(w/2,h/2,w/2-2,0,7); c.fill();
      c.save(); c.translate(w/2,h/2); [[-.5,'#111'],[.5,'#c81820']].forEach(([a,col])=>{ c.save(); c.rotate(a); c.fillStyle='#444'; c.fillRect(-2,-40,4,70); c.fillStyle=col; c.fillRect(2,-40,30,22); c.restore(); }); c.restore(); })),roughness:.3,metalness:.6}),0,T.top(0,F-.18)+.02,F-.18); badge.rotation.x=-1.2; }
  // boattail deck: fuel cap, subtle ducktail
  { const cap=K.add(new THREE.CircleGeometry(.06,20),chromeTrimM,0,T.top(0,-2.0)+.01,-2.0); cap.rotation.x=-1.3; }
  K.plate(def,.52,-R-.02); void carbon;
  return T;
}

/* ---- Stratos V: clean mid-engine hypercar. Long flat low hood, crisp straight shoulder, mid-set canopy, flat high
   deck into a Kamm tail with a full-width light bar, straight side intake, tidy swan-neck wing. ---- */
function stratosShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0xffb070,.14);
  paint.clearcoat=1; paint.clearcoatRoughness=.015;
  const gold=new THREE.MeshStandardMaterial({color:def.livery||0xffd23b,roughness:.26,metalness:.6});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:72,inset:.12,
    hwS:[[-R,.92],[-2.2,1.0],[-WB,1.04],[-.8,.98],[0,.95],[.8,.96],[WB,1.0],[2.0,.98],[F,.92]],
    ysK:[[-R,.76],[-WB,.78],[-.6,.68],[.4,.63],[WB,.62],[2.0,.57],[F,.48]],
    yfK:[[-R,.96],[-2.0,.98],[-WB,.96],[-.6,.9],[.4,.8],[WB,.75],[2.0,.66],[F,.56]],
    ycK:[[-R,.94],[-2.0,.96],[-1.2,.94],[-.6,.88],[.4,.78],[1.0,.7],[1.8,.61],[F,.54]],
    hwL:[[-R,.88],[-WB,.84],[0,.9],[WB,.84],[F,.86]],
    ybK:[[-R,.28],[-2.3,.18],[2.1,.18],[F,.24]]},paint,K);
  const C={z0:-1.0,z1:1.1,tumble:.08,pow:.68,cwK:[[-1.0,.3],[-.6,.56],[0,.64],[.6,.6],[.95,.44],[1.1,.24]],htK:[[-1.0,.98],[-.55,1.17],[0,1.23],[.55,1.14],[.95,.93],[1.1,.8]],roof:[-.7,.4],roofA:.9};
  sculptCanopy(g,C,T,glass,GLOSS_BLACK,K); outlawKit(K,T,C);
  // engine deck: black louvered panel behind the cabin
  K.top(-.46,.46,-2.3,-1.06,GLOSS_BLACK,.005,16);
  for(let i=0;i<8;i++){ const z=-1.16-i*.13; K.add(new THREE.BoxGeometry(.8,.012,.05),carbon,0,T.top(0,z)+.012,z).rotation.x=-.08; }
  // hood: two narrow black vents
  [1,-1].forEach(sd=>K.top(sd*.14,sd*.32,1.45,1.95,GLOSS_BLACK,.006,6));
  [1,-1].forEach(sd=>{
    // slim LED headlamps: a straight bar and a short return, under a flush clear cover
    K.tube([K.P(sd*.46,F-.12),K.P(sd*.8,F-.3)],.014,headM,8); K.tube([K.P(sd*.8,F-.3),K.P(sd*.86,F-.46)],.012,headM,4);
    K.add(bandGeo((u,z)=>{ const x=sd*lerp(.44,.88,u); return [x,T.top(x,z)+.006]; },F-.5,F-.08,8,6,sd<0),lensM);
    K.glow(0xcfe6ff,.9,sd*.62,T.top(sd*.62,F-.2)+.04,F);
    // straight side: thin gold pinstripe on the shoulder, black side intake ahead of the rear wheel, black sill
    const pts=[]; for(let i=0;i<=14;i++){ const z=lerp(-2.4,2.2,i/14), c=T.sec(z); pts.push([sd*(c.hs+.006),c.ys-.03,z]); } K.tube(pts,.007,gold,40);
    const ci=T.sec(-.62), it=K.add(K.scoop(.8,.28),GLOSS_BLACK,sd>0?ci.hl+.02:-(ci.hl+.08),ci.yb+.16,-.66); it.rotation.y=Math.PI/2;
    K.sill(sd,-WB+WR+.2,WB-WR-.2,.02,.13,carbon); K.shut(sd,1.0); K.mirror(sd,.78,paint);
    // tail: full-width light bar wrapping the corners
    K.tube([[sd*.02,.9,-R-.012],[sd*.6,.9,-R-.012],[sd*.9,.86,-R+.05]],.014,tailM,12); K.glow(0xff2030,.9,sd*.6,.9,-R-.07); });
  // front: wide black lower intake and splitter
  K.add(new THREE.PlaneGeometry(1.3,.16),GLOSS_BLACK,0,.34,F+.006);
  K.splitter(.9,F-.3,F-.02,.18);
  // rear: black mesh panel, twin center exhausts, diffuser
  K.add(new THREE.PlaneGeometry(1.7,.44),gapM,0,.6,-R-.008).rotation.y=Math.PI;
  for(let i=0;i<7;i++) K.add(new THREE.BoxGeometry(1.66,.01,.02),carbon,0,.42+i*.06,-R-.015);
  [-.14,.14].forEach(x=>K.pipe(x,.62,-R-.05,.07));
  for(let i=0;i<7;i++) K.add(new THREE.BoxGeometry(.02,.2,.5),carbon,-.6+i*.2,.22,-R+.22);
  K.add(new THREE.BoxGeometry(1.6,.03,.5),carbon,0,.13,-R+.22);
  // swan-neck wing just above the deck line, carbon endplates edged in gold
  { const wy=T.top(0,-2.3)+.34; const w=K.add(K.airfoil(.5,.05,1.9),carbon,0,wy,-2.08); w.rotation.y=Math.PI/2; w.rotation.z=.08;
    [1,-1].forEach(sd=>{ K.tube([[sd*.42,T.top(sd*.42,-2.4)-.01,-2.4],[sd*.42,wy-.08,-2.42],[sd*.42,wy+.07,-2.36],[sd*.42,wy+.06,-2.24]],.026,carbon,14);
      K.add(new THREE.BoxGeometry(.012,.2,.54),carbon,sd*.96,wy-.02,-2.33); K.add(new THREE.BoxGeometry(.016,.016,.5),gold,sd*.97,wy+.08,-2.33); }); }
  K.plate(def,.36,-R-.02);
  return T;
}


/* ---- Wisp 07: big carbon-tub EV hatch (kept as the tall hatch the owner likes). Pearl white over a carbon lower tub,
   floating roof over a black glasshouse, mint light blades front and rear, closed EV nose, big swan-neck wing. ---- */
function wispShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0x9ffff0,.08);
  paint.color.set(def.paint||0x050506); paint.metalness=.55; paint.roughness=.08; paint.clearcoat=1; paint.clearcoatRoughness=.01; // fallback only (GLB not loaded yet): gloss black like the real car
  const mint=new THREE.MeshBasicMaterial({color:def.accent||0x7dffef,toneMapped:false});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:60,inset:.14,
    hwS:[[-R,.92],[-WB-.1,1.04],[-.5,.95],[0,.93],[.5,.95],[WB+.1,1.02],[F,.88]],
    ysK:[[-R,.84],[-WB,.84],[0,.78],[WB,.8],[1.7,.72],[F,.56]],
    yfK:[[-R,1.02],[-WB,1.02],[-.4,.98],[.4,.94],[WB,.9],[1.7,.8],[F,.6]],
    ycK:[[-R,1.0],[-1.7,1.02],[-1.2,1.0],[0,.96],[.8,.88],[1.5,.78],[F,.58]],
    hwL:[[-R,.88],[-WB,.84],[0,.9],[WB,.84],[F,.82]],
    ybK:[[-R,.3],[-1.9,.22],[1.9,.22],[F,.26]]},paint,K);
  const C={z0:-1.9,z1:1.02,tumble:.12,pow:.45,cwK:[[-1.9,.58],[-1.7,.66],[-.8,.7],[.2,.7],[.7,.62],[1.02,.46]],htK:[[-1.9,1.16],[-1.75,1.48],[-1.0,1.56],[-.2,1.56],[.5,1.36],[1.02,.98]],roof:[-1.7,.35],roofA:1.15};
  sculptCanopy(g,C,T,glass,paint,K); outlawKit(K,T,C);
  // carbon lower tub: sills, splitter, lower door panels, diffuser
  [1,-1].forEach(sd=>{ K.sill(sd,-WB+WR+.18,WB-WR-.18,.02,.26,carbon); K.sill(sd,WB+WR+.14,F-.2,.02,.18,carbon); K.sill(sd,-R+.2,-WB-WR-.14,.02,.2,carbon);
    const pts=[]; for(let i=0;i<=10;i++){ const z=lerp(-WB+WR+.2,WB-WR-.2,i/10), c=T.sec(z); pts.push([sd*(c.hl+.012),c.yb+.28,z]); } K.tube(pts,.008,mint,20); K.glow(def.accent||0x7dffef,.45,sd*(T.sec(.4).hl+.02),T.sec(.4).yb+.28,.4);
    // black pillars under the floating roof, door shuts, camera mirrors
    K.tube([[sd*kfCR(C.cwK,-1.55)*.95,T.yc(-1.55)+.02,-1.55],[sd*kfCR(C.cwK,-1.55)*.8,canopyY(C,T,kfCR(C.cwK,-1.55)*.8,-1.55),-1.55]],.03,GLOSS_BLACK,4);
    K.shut(sd,.72); K.shut(sd,-.5);
    const mp=K.add(new THREE.BoxGeometry(.2,.05,.12),carbon,sd*(kfCR(C.cwK,.75)+.1),T.top(kfCR(C.cwK,.75),.75)+.1,.75); mp.rotation.z=sd*.2;
    // closed EV nose: mint light blade across the front, slim lamps
    K.tube([K.P(sd*.3,F-.08),K.P(sd*.62,F-.16),K.P(sd*.84,F-.34)],.014,headM,10); K.glow(0xcfe6ff,.8,sd*.6,T.top(sd*.6,F-.14)+.04,F);
    K.tube([[sd*.26,.9,-R-.012],[sd*.7,.9,-R-.012],[sd*.88,.86,-R+.04]],.014,tailM,10); K.glow(0xff2030,.8,sd*.6,.9,-R-.07); });
  K.tube([K.P(-.84,F-.3,.02),K.P(-.4,F-.1,.02),K.P(0,F-.06,.02),K.P(.4,F-.1,.02),K.P(.84,F-.3,.02)],.01,mint,30);
  K.add(new THREE.PlaneGeometry(1.0,.1),GLOSS_BLACK,0,.34,F+.006); K.splitter(.9,F-.3,F+.03,.2);
  // rear: mint bar, open carbon diffuser, big swan-neck wing
  K.tube([[-.24,.9,-R-.014],[.24,.9,-R-.014]],.008,mint,4);
  K.add(new THREE.PlaneGeometry(1.5,.2),GLOSS_BLACK,0,.44,-R-.008).rotation.y=Math.PI;
  for(let i=0;i<7;i++) K.add(new THREE.BoxGeometry(.02,.2,.5),carbon,-.6+i*.2,.24,-R+.22);
  { const w=K.add(K.airfoil(.46,.055,1.9),carbon,0,1.66,-1.72); w.rotation.y=Math.PI/2; w.rotation.z=.12;
    [1,-1].forEach(sd=>{ K.tube([[sd*.4,kfCR(C.htK,-1.75)-.04,-1.78],[sd*.4,1.62,-1.8],[sd*.4,1.72,-1.74],[sd*.4,1.7,-1.6]],.028,carbon,14);
      K.add(new THREE.BoxGeometry(.012,.28,.56),carbon,sd*.96,1.62,-1.74); K.add(new THREE.BoxGeometry(.014,.014,.52),mint,sd*.97,1.76,-1.74); }); }
  K.plate(def,.62,-R-.02);
  return T;
}
/* ---- Zephyr 960: narrow featherweight dart. Green upper body, teal lower cladding and light blades,
   lofted the same way as the other sculpted cars (cross-sections, tubes, airfoil, fresnel rim). ---- */
function zephyrShell(g,def,B,paint,glass){
  const K=carKit(g), carbon=K.carbon; rimPaint(paint,0x14e0c8,.2);
  // deep metallic green under the clear coat (threejs-materials: car paint = metalness + clearcoat, no sheen, which is for cloth and washes the green to mint)
  paint.color.set(def.paint||0x14943c); paint.metalness=.72; paint.roughness=.3; paint.clearcoat=1; paint.clearcoatRoughness=.02;
  const teal=new THREE.MeshPhysicalMaterial({color:0x0e8f86,metalness:.62,roughness:.18,clearcoat:1,clearcoatRoughness:.04,envMapIntensity:1.15});
  const blade=new THREE.MeshBasicMaterial({color:def.accent||0x14e0c8,toneMapped:false});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:56,inset:.12,
    // one-piece wedge nose: the hood crowns up into the fenders and the fender line runs smoothly down to a wide, rounded nose
    hwS:[[-R,.72],[-WB-.05,.86],[-.6,.78],[.15,.74],[WB,.86],[1.95,.84],[F,.74]],
    ysK:[[-R,.52],[-WB,.58],[0,.5],[.9,.56],[WB,.74],[1.95,.64],[F,.4]],
    yfK:[[-R,.64],[-WB,.66],[-.4,.6],[.5,.56],[.9,.6],[WB,.78],[1.95,.68],[F,.42]],
    ycK:[[-R,.6],[-1.5,.64],[-.6,.62],[.2,.54],[.95,.5],[WB,.58],[1.95,.5],[F,.3]],
    hwL:[[-R,.66],[-WB,.62],[0,.68],[WB,.64],[1.95,.66],[F,.62]],
    ybK:[[-R,.2],[-2.1,.12],[1.9,.12],[F,.14]]},paint,K);
  const C={z0:-1.15,z1:.95,tumble:.1,pow:.55,cwK:[[-1.15,.22],[-.7,.48],[-.1,.52],[.45,.46],[.95,.22]],htK:[[-1.15,.64],[-.75,.96],[-.15,1.04],[.4,.9],[.95,.58]],roof:[-.85,.25],roofA:1.05};
  sculptCanopy(g,C,T,glass,paint,K); outlawKit(K,T,C);
  [1,-1].forEach(sd=>{
    K.sill(sd,-R+.25,F-.18,.02,.22,teal);
    const pts=[]; for(let i=0;i<=12;i++){ const z=lerp(-WB+WR+.15,WB-WR-.15,i/12), c=T.sec(z); pts.push([sd*(c.hl+.014),c.yb+.2,z]); }
    K.tube(pts,.01,blade,22); K.glow(def.accent||0x14e0c8,.55,sd*(T.sec(0).hl+.02),T.sec(0).yb+.2,0);
    K.shut(sd,.55); K.shut(sd,-.35);
    K.lens(sd*.46,T.top(sd*.46,F-.3)+.012,F-.3,.2,.022,.11,.42,sd*.28); // slim headlamp slit set into the fender slope
    K.glow(0xd8fff6,.7,sd*.46,T.top(sd*.46,F-.3)+.03,F-.2);
    K.tube([[sd*.2,.52,-R-.01],[sd*.48,.5,-R-.01],[sd*.58,.42,-R+.04]],.012,tailM,8);
    K.glow(0xff2030,.7,sd*.42,.48,-R-.06);
    const it=K.add(K.scoop(.7,.28),carbon,sd>0?.72:-.78,.28,-.2); it.rotation.y=Math.PI/2;
    K.mirror(sd,.55,carbon);
  });
  K.top(-.03,.03,.9,F-.12,blade,.008,18); // thin center blade down the hood to the nose
  { const c=T.sec(F), lb=[]; for(let i=0;i<=12;i++){ const x=lerp(-.84,.84,i/12)*c.hl; lb.push([x,c.yb+.16,F+.03-.04*x*x]); } K.tube(lb,.013,blade,24); // full-width light bar across the nose face
    K.glow(def.accent||0x14e0c8,.5,0,c.yb+.16,F+.05); }
  K.splitter(.72,F-.28,F+.02,.14);
  K.add(new THREE.PlaneGeometry(.62,.06),GLOSS_BLACK,0,.22,F+.004);
  for(let i=0;i<6;i++) K.add(new THREE.BoxGeometry(.016,.16,.42),carbon,-.42+i*.17,.18,-R+.2);
  K.add(new THREE.BoxGeometry(1.15,.02,.5),teal,0,.14,-R+.18);
  { const w=K.add(K.airfoil(.42,.05,1.55),carbon,0,1.02,-2.05); w.rotation.y=Math.PI/2; w.rotation.z=.1;
    [1,-1].forEach(sd=>{ K.tube([[sd*.32,T.yc(-2.34)+.01,-2.34],[sd*.32,.92,-2.36],[sd*.32,1.12,-2.3],[sd*.32,1.08,-2.14]],.024,carbon,14); // swan neck: up behind the wing, over onto its top
      K.add(new THREE.BoxGeometry(.012,.24,.5),teal,sd*.785,1.04,-2.26); }); } // endplates centred on the chord (-2.05 to -2.47)
  K.plate(def,.4,-R-.02);
  return T;
}
/* ---- Wisp 07 (Blender build, v3): a gloss-black five-door time-attack hatch modeled in Blender (tools/blender/wisp_07.py) ----
   From Paris's three reference renders: flat-faced bolt-on over-fenders with rivets, a hawk-eye nose with a honeycomb hex
   grille, a top-mount hood scoop and louvers, carbon splitter and canards, lime trim on the splitter, skirts and shoulders,
   a lime roll cage and red harnesses behind tinted glass, vented rear quarters and a swan-neck time-attack wing.
   threejs-materials: tinted MeshPhysical glass (transparent, no depth write) so the cage reads through the windows;
   the lime is a glossy clear-coated paint with a little emission so it holds its color at night without blooming out. */
const WISP_LIME=new THREE.MeshPhysicalMaterial({color:0x3cff00,emissive:0x2fb800,emissiveIntensity:.5,metalness:0,roughness:.25,clearcoat:1,clearcoatRoughness:.05});
const WISP_GLASS=new THREE.MeshPhysicalMaterial({color:0x10141c,metalness:.1,roughness:.02,clearcoat:1,clearcoatRoughness:.02,reflectivity:1,envMapIntensity:1.8,transparent:true,opacity:.42,depthWrite:false});
const WISP_CABIN=new THREE.MeshStandardMaterial({color:0x0c0c0e,roughness:.85,metalness:0});
const WISP_RED=new THREE.MeshStandardMaterial({color:0xd01818,roughness:.45,metalness:.1});
const WISP_SATIN=new THREE.MeshStandardMaterial({color:0x34363c,metalness:.9,roughness:.32});
function wispGlbShell(g,def,B,paint,glass,opts){
  const parts=glbParts('wisp',opts&&opts.lod); if(!parts) return wispShell(g,def,B,paint,glass,opts);
  const K=carKit(g); rimPaint(paint,0x8fa0ff,.07); paint.color.set(def.paint||0x050506); paint.metalness=.55; paint.roughness=.08; paint.clearcoat=1; paint.clearcoatRoughness=.008; paint.envMapIntensity=1.5;
  const MATS={PAINT:paint,CARBON:K.carbon,GLASS:WISP_GLASS,GLOSSBLACK:GLOSS_BLACK,GAP:gapM,HEAD:headM,TAIL:tailM,CHROME:chromeTrimM,LENS:LENS_M,SATIN:WISP_SATIN,LIME:WISP_LIME,INTERIOR:WISP_CABIN,RED:WISP_RED};
  parts.forEach(p=>{ const m=new THREE.Mesh(p.geo,MATS[p.key]||paint); if(p.key==='GLASS') m.renderOrder=3; g.add(m); });
  { const pr=K.add(new THREE.PlaneGeometry(.5,.13),new THREE.MeshStandardMaterial({map:plateTex(def.plate||'WISP07'),roughness:.5}),0,.63,-2.148); pr.rotation.y=Math.PI; }
  [1,-1].forEach(sd=>{ K.glow(0xd8f0ff,.55,sd*.63,.69,2.2); K.glow(0xff2030,.38,sd*.64,.87,-2.21); K.glow(0xd8f0ff,.22,sd*.75,.38,2.17); });
  K.glow(0xff2030,.25,0,.245,-2.1);
  // side-section sampler for the street vinyl: same keys as the Blender loft (HW / YS / YB in wisp_07.py)
  const HS=[[-2.18,.74],[-2.1,.84],[-1.9,.88],[-1.42,.895],[-.6,.895],[0,.89],[.6,.895],[1.42,.895],[2.0,.91],[2.24,.8]],
    YS=[[-2.18,.9],[-2.0,.93],[-1.4,.93],[-.6,.91],[.4,.89],[.9,.87],[1.5,.82],[1.95,.74],[2.24,.56]], YB=[[-2.18,.36],[-2.06,.22],[-1.8,.17],[1.8,.17],[2.06,.2],[2.24,.26]];
  return {sec:z=>{ const hs=kfCR(HS,z), ys=kfCR(YS,z), yb=kfCR(YB,z); return {hs,ys,yb,hl:hs-.06,ay:ys-.12,yc:ys+.1,yf:ys+.1}; }};
}
/* ---- shared bits for the archive cars below: honeycomb mesh, box arch blisters, satin cladding ---- */
function hexGrilleM(){ return new THREE.MeshBasicMaterial({map:CT(canvasTex(256,64,(c,w,h)=>{ c.fillStyle='#050506'; c.fillRect(0,0,w,h); c.strokeStyle='#2a2d33'; c.lineWidth=2;
  for(let y=0;y<6;y++) for(let x=0;x<26;x++){ const cx=x*10+(y%2)*5, cy=y*11+5; c.beginPath(); for(let k=0;k<6;k++){ const a=k*Math.PI/3; c.lineTo(cx+4.5*Math.cos(a),cy+4.5*Math.sin(a)); } c.closePath(); c.stroke(); } }))}); }
function archBlisters(K,T,B,m,r,up,out){ [1,-1].forEach(sd=>[B.wb,-B.wb].forEach(zw=>{ const pts=[]; for(let i=0;i<=12;i++){ const a=Math.PI*(.12+.76*i/12), z=zw-Math.cos(a)*(B.wr+.14), c=T.sec(z); pts.push([sd*(c.hs+(out||.02)),B.wr+Math.sin(a)*(B.wr+(up||.12)),z]); } K.tube(pts,r||.04,m,20,6); })); }
const CLAD_M=new THREE.MeshStandardMaterial({color:0x0b0c0e,roughness:.72,metalness:.1,envMapIntensity:.4});
/* ---- LUMEN SP: open two-seat roadster. Raked glass screen, cockpit tub with seats, roll hoop and headrest fairings, hex intake, swept lamps. ---- */
function lumenShell(g,def,B,paint,glass){
  const K=carKit(g); rimPaint(paint,0xff90a8,.16);
  paint.clearcoat=1; paint.clearcoatRoughness=.018;
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear, hx=hexGrilleM();
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:52,inset:.13,
    hwS:[[-R,.88],[-WB,1.0],[-.7,.94],[0,.92],[.7,.94],[WB,1.0],[F,.86]],
    ysK:[[-R,.64],[-WB,.72],[0,.66],[WB,.7],[F,.52]],
    yfK:[[-R,.86],[-WB,.9],[0,.88],[WB,.86],[F,.68]],
    ycK:[[-R,.84],[-1.4,.88],[-.4,.84],[.5,.78],[F,.64]],
    hwL:[[-R,.82],[-WB,.78],[0,.86],[WB,.78],[F,.78]],
    ybK:[[-R,.28],[-1.9,.18],[1.9,.18],[F,.24]]},paint,K);
  const C={z0:-1.42,z1:.55,tumble:.1,pow:.55,cwK:[[-1.42,.28],[-1.05,.48],[-.45,.54],[.15,.52],[.55,.38]],htK:[[-1.42,.88],[-1.05,1.06],[-.45,1.12],[.05,1.1],[.55,.92]],roof:[-1.05,.45],roofA:.85};
  outlawKit(K,T,C);
  const seat=new THREE.MeshStandardMaterial({color:0x2c1f1c,roughness:.55,metalness:.05}), gl=glass.clone(); gl.side=THREE.DoubleSide;
  // cockpit tub, seats, roll hoop, headrest fairings
  K.top(-.62,.62,-1.15,.5,GLOSS_BLACK,.007,22);
  [1,-1].forEach(sd=>{ const x=sd*.3, y=T.top(x,-.4);
    K.add(new THREE.BoxGeometry(.36,.08,.44),seat,x,y+.05,-.34);
    const bk=K.add(new THREE.BoxGeometry(.34,.26,.08),seat,x,y+.17,-.6); bk.rotation.x=.2;
    const hr=K.add(new THREE.SphereGeometry(1,16,10),paint,sd*.34,T.top(sd*.34,-1.0)+.12,-1.02); hr.scale.set(.2,.17,.4); });
  { const y0=T.top(.56,-.86); K.tube([[-.56,y0,-.86],[-.52,y0+.34,-.88],[0,y0+.4,-.9],[.52,y0+.34,-.88],[.56,y0,-.86]],.022,paint,30,8); }
  // raked windscreen with body-colour frame
  { const yb=T.top(.5,.51)+.005; const ws=K.add(new THREE.PlaneGeometry(.98,.34),gl,0,yb+.145,.42); ws.rotation.x=-.55; ws.renderOrder=3;
    [1,-1].forEach(sd=>K.tube([[sd*.5,yb,.509],[sd*.5,yb+.29,.331]],.016,paint,8)); K.tube([[-.5,yb+.29,.331],[0,yb+.3,.331],[.5,yb+.29,.331]],.014,paint,12); }
  [1,-1].forEach(sd=>{ K.shut(sd,.35); K.mirror(sd,.35,paint); K.sill(sd,-WB+WR+.15,WB-WR-.15,.03,.12,GLOSS_BLACK);
    { const c=T.sec(1.42); const v=K.add(new THREE.PlaneGeometry(.26,.07),gapM,sd*(c.hs+.006),c.ys-.07,1.42); v.rotation.y=sd*Math.PI/2;
      for(let i=0;i<3;i++){ const z=1.3+i*.1, s=T.sec(z); K.add(new THREE.BoxGeometry(.012,.03,.06),GLOSS_BLACK,sd*(s.hs+.008),s.ys-.14,z); } }
    // swept lamp: lens plate, LED line, glow
    K.add(new THREE.PlaneGeometry(.26,.07),lensM,sd*.5,.55,F+.004); K.tube([[sd*.32,.58,F+.008],[sd*.5,.56,F+.008],[sd*.66,.5,F+.004]],.01,headM,10); K.glow(0xcfe6ff,.55,sd*.5,.55,F+.06);
    K.tube([[sd*.24,.8,-R-.01],[sd*.5,.8,-R-.012],[sd*.74,.76,-R-.01]],.016,tailM,12); K.glow(0xff2030,.8,sd*.58,.79,-R-.07); });
  K.add(new THREE.PlaneGeometry(.86,.13),hx,0,.36,F+.004); K.splitter(.82,F-.32,F+.02,.2);
  K.add(new THREE.PlaneGeometry(1.2,.2),GLOSS_BLACK,0,.46,-R-.008).rotation.y=Math.PI;
  for(let i=0;i<5;i++) K.add(new THREE.BoxGeometry(.02,.12,.3),K.carbon,-.36+i*.18,.34,-R+.1);
  [-.3,.3].forEach(x=>K.pipe(x,.4,-R-.05,.046)); K.plate(def,.6,-R-.02);
  return T;
}
/* ---- BRIG LINE W: shooting-brake wagon. Brass roof rails, black cladding and arch flares, hex grille, tailgate spoiler. ---- */
function briglineShell(g,def,B,paint,glass){
  const K=carKit(g); rimPaint(paint,0xc8a060,.14);
  const acc=new THREE.MeshStandardMaterial({color:def.accent||0xc8a060,roughness:.3,metalness:.8}), hx=hexGrilleM();
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:58,inset:.14,
    hwS:[[-R,.96],[-2.2,1.08],[-WB,1.12],[-.7,1.02],[0,1.0],[.7,1.02],[WB,1.08],[2.1,1.0],[F,.88]],
    ysK:[[-R,.88],[-WB,.82],[0,.8],[WB,.82],[F,.66]],
    yfK:[[-R,1.02],[-WB,1.04],[0,1.0],[WB,.98],[F,.78]],
    ycK:[[-R,1.0],[-2.2,1.06],[-1.2,1.04],[0,1.0],[.9,.92],[F,.76]],
    hwL:[[-R,.92],[-WB,.88],[0,.94],[WB,.88],[F,.86]],
    ybK:[[-R,.34],[-2.3,.24],[2.2,.24],[F,.3]]},paint,K);
  const C={z0:-2.15,z1:.95,tumble:.1,pow:.45,cwK:[[-2.15,.55],[-1.6,.68],[-.5,.72],[.4,.68],[.95,.58]],htK:[[-2.15,1.22],[-1.8,1.48],[-.8,1.52],[.2,1.46],[.95,1.18]],roof:[-1.85,.35],roofA:1.05};
  sculptCanopy(g,C,T,glass,paint,K); outlawKit(K,T,C);
  archBlisters(K,T,B,CLAD_M,.05,.1,.02);
  // roof rails with posts
  [1,-1].forEach(sd=>{ const pts=[]; for(let i=0;i<=8;i++){ const z=-1.8+i*.3, x=sd*.56; pts.push([x,canopyY(C,T,x,z)+.05,z]); } K.tube(pts,.016,acc,24,8);
    [-1.7,-.7,.3].forEach(z=>{ const x=sd*.56, y=canopyY(C,T,x,z); K.add(new THREE.BoxGeometry(.03,.05,.05),acc,x,y+.02,z); }); });
  { const y=canopyY(C,T,0,-2.08); const w=K.add(new THREE.BoxGeometry(1.1,.03,.22),GLOSS_BLACK,0,y+.02,-2.14); w.rotation.x=.14; }
  [1,-1].forEach(sd=>{ K.shut(sd,.85); K.shut(sd,-.45); K.mirror(sd,.82,paint); K.sill(sd,-WB+WR+.2,WB-WR-.2,.04,.2,CLAD_M);
    // tall tail lamps at the tailgate corners
    K.add(new THREE.BoxGeometry(.2,.2,.02),tailM,sd*.76,.98,-R-.012); K.glow(0xff2030,.9,sd*.76,.98,-R-.07);
    // front: slim lamps with an LED line, fog lamps
    K.add(new THREE.PlaneGeometry(.28,.09),lensM,sd*.54,.7,F+.004); K.tube([[sd*.42,.74,F+.008],[sd*.64,.74,F+.008]],.011,headM,6); K.glow(0xcfe6ff,.55,sd*.54,.7,F+.06);
    K.add(new THREE.CircleGeometry(.05,16),lensM,sd*.62,.36,F+.004); });
  K.add(new THREE.PlaneGeometry(.96,.16),hx,0,.6,F+.006); K.add(new THREE.BoxGeometry(.96,.014,.012),acc,0,.675,F+.012);
  K.add(new THREE.PlaneGeometry(1.1,.14),hx,0,.38,F+.002); K.splitter(.9,F-.34,F+.03,.18);
  K.add(new THREE.PlaneGeometry(1.7,.22),GLOSS_BLACK,0,.5,-R-.008).rotation.y=Math.PI;
  for(let i=0;i<5;i++) K.add(new THREE.BoxGeometry(.02,.12,.3),K.carbon,-.4+i*.2,.34,-R+.1);
  [-.5,.5].forEach(x=>K.pipe(x,.36,-R-.05,.05)); K.plate(def,.7,-R-.02);
  return T;
}
/* ---- PULSE 2: compact EV liftback. Floating black roof, closed nose with a full light bar, glowing rocker line, rear light bar. ---- */
function pulse2Shell(g,def,B,paint,glass){
  const K=carKit(g); rimPaint(paint,0x5fe6c8,.12);
  const cy=new THREE.MeshBasicMaterial({color:def.accent||0x5fe6c8,toneMapped:false});
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear, hx=hexGrilleM();
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:50,inset:.12,
    hwS:[[-R,.86],[-WB,.96],[-.5,.9],[0,.88],[.5,.9],[WB,.96],[F,.78]],
    ysK:[[-R,.58],[-WB,.64],[0,.6],[WB,.64],[F,.44]],
    yfK:[[-R,.78],[-WB,.82],[0,.76],[WB,.74],[F,.52]],
    ycK:[[-R,.74],[-1.2,.78],[-.3,.72],[.6,.66],[F,.48]],
    hwL:[[-R,.8],[-WB,.76],[0,.82],[WB,.76],[F,.72]],
    ybK:[[-R,.22],[-1.8,.14],[1.8,.14],[F,.18]]},paint,K);
  const C={z0:-1.2,z1:.85,tumble:.08,pow:.6,cwK:[[-1.2,.22],[-.75,.44],[-.15,.48],[.45,.44],[.85,.26]],htK:[[-1.2,.86],[-.75,1.02],[-.15,1.08],[.4,.96],[.85,.72]],roof:[-.9,.3],roofA:.95};
  sculptCanopy(g,C,T,glass,GLOSS_BLACK,K); outlawKit(K,T,C);
  archBlisters(K,T,B,paint,.034,.1,.016);
  // nose: closed face, full-width light bar, blade lamps at the corners, low hex intake
  K.add(new THREE.PlaneGeometry(1.0,.1),GLOSS_BLACK,0,.4,F+.005);
  K.tube([[-.5,.42,F+.012],[0,.4,F+.014],[.5,.42,F+.012]],.012,cy,20);
  K.add(new THREE.PlaneGeometry(1.0,.1),hx,0,.26,F+.003);
  [1,-1].forEach(sd=>{ K.add(new THREE.PlaneGeometry(.2,.06),lensM,sd*.45,.42,F+.004); K.tube([[sd*.36,.44,F+.01],[sd*.56,.4,F+.006]],.01,headM,8); K.glow(0xcfe6ff,.5,sd*.45,.42,F+.05);
    K.sill(sd,-WB+WR+.1,WB-WR-.1,.03,.07,cy); K.sill(sd,-WB+WR+.1,WB-WR-.1,.0,.03,GLOSS_BLACK);
    K.shut(sd,.45); K.shut(sd,-.5); K.mirror(sd,.55,K.carbon);
    K.tube([[sd*.3,.74,-R-.01],[sd*.62,.78,-R-.012],[sd*.8,.74,-R-.01]],.014,tailM,12); K.glow(0xff2030,.7,sd*.64,.76,-R-.06); });
  K.tube([[-.3,.76,-R-.012],[0,.77,-R-.014],[.3,.76,-R-.012]],.012,tailM,12);
  K.splitter(.78,F-.28,F+.02,.16);
  { const y=kfCR(C.htK,-1.05); const w=K.add(new THREE.BoxGeometry(1.1,.03,.24),GLOSS_BLACK,0,y+.005,-1.28); w.rotation.x=.2; }
  K.add(new THREE.PlaneGeometry(1.3,.16),GLOSS_BLACK,0,.4,-R-.008).rotation.y=Math.PI;
  for(let i=0;i<5;i++) K.add(new THREE.BoxGeometry(.02,.12,.3),K.carbon,-.32+i*.16,.28,-R+.1);
  K.plate(def,.52,-R-.02);
  return T;
}
/* ---- VANDAL SS: modern widebody muscle. Box arch blisters, hood heat vents, supercharger scoop, slim LED headlamps, quad tips. ---- */
function vandalShell(g,def,B,paint,glass){
  const K=carKit(g); rimPaint(paint,0xb070ff,.18);
  const silver=new THREE.MeshStandardMaterial({color:0xe8e8ee,roughness:.3,metalness:.1}), hx=hexGrilleM();
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:52,inset:.11,
    hwS:[[-R,.94],[-2.0,1.08],[-WB,1.12],[-.6,1.04],[0,1.02],[.6,1.04],[WB,1.1],[2.0,1.02],[F,.94]],
    ysK:[[-R,.78],[-WB,.84],[0,.8],[WB,.84],[F,.74]],
    yfK:[[-R,.96],[-WB,1.0],[0,.98],[WB,.98],[F,.9]],
    ycK:[[-R,.94],[-1.5,.98],[0,.96],[1.0,1.0],[F,.92]],
    hwL:[[-R,.88],[-WB,.84],[0,.94],[WB,.84],[F,.88]],
    ybK:[[-R,.36],[-2.1,.26],[2.1,.26],[F,.34]]},paint,K);
  const C={z0:-1.48,z1:.95,tumble:.12,pow:.45,cwK:[[-1.48,.48],[-1.0,.64],[-.2,.68],[.45,.64],[.95,.52]],htK:[[-1.48,1.02],[-1.0,1.38],[-.2,1.44],[.45,1.32],[.95,1.06]],roof:[-1.1,.42],roofA:.95};
  sculptCanopy(g,C,T,glass,GLOSS_BLACK,K); outlawKit(K,T,C);
  archBlisters(K,T,B,paint,.045,.14,.02);
  // twin silver stripes, hood heat extractors and a supercharger scoop
  [.14,-.14].forEach(x=>{ K.top(x-.05,x+.05,C.z1-.02,F-.08,silver,.006,16); K.roof(x-.05,x+.05,C.z0+.08,C.z1-.06,silver,.024,16); });
  { const y=T.top(0,1.45); K.add(new THREE.BoxGeometry(.38,.07,.3),GLOSS_BLACK,0,y+.035,1.45); K.add(new THREE.PlaneGeometry(.3,.04),gapM,0,y+.045,1.6); }
  [1,-1].forEach(sd=>{ for(let i=0;i<5;i++){ const z=1.3+i*.09; K.add(new THREE.BoxGeometry(.26,.012,.035),gapM,sd*.58,T.top(sd*.58,z)+.006,z); } });
  // front: black face, honeycomb lower, slim LED lamps with a lit bar, splitter
  K.add(new THREE.PlaneGeometry(1.2,.2),GLOSS_BLACK,0,.74,F+.01);
  K.add(new THREE.PlaneGeometry(1.1,.14),hx,0,.52,F+.008);
  [1,-1].forEach(sd=>{ K.add(new THREE.PlaneGeometry(.32,.08),lensM,sd*.55,.76,F+.012); K.tube([[sd*.4,.8,F+.016],[sd*.7,.78,F+.016]],.012,headM,8); K.tube([[sd*.4,.72,F+.016],[sd*.68,.72,F+.016]],.008,headM,8); K.glow(0xcfe6ff,.6,sd*.55,.76,F+.07); });
  K.splitter(.92,F-.36,F+.02,.32);
  [1,-1].forEach(sd=>{ K.shut(sd,.88); K.shut(sd,-.5); K.mirror(sd,.75,GLOSS_BLACK); K.sill(sd,-WB+WR+.2,WB-WR-.2,.04,.16,GLOSS_BLACK);
    for(let i=0;i<4;i++){ const z=1.5-i*.1, s=T.sec(z); K.add(new THREE.BoxGeometry(.012,.04,.07),gapM,sd*(s.hs+.008),s.ys-.04,z); } });
  // rear: black panel, racetrack bar, ducktail, diffuser fins, quad tips
  K.add(new THREE.PlaneGeometry(1.7,.2),GLOSS_BLACK,0,.84,-R-.012).rotation.y=Math.PI;
  K.tube([[-.82,.8,-R-.02],[-.8,.88,-R-.02],[0,.89,-R-.025],[.8,.88,-R-.02],[.82,.8,-R-.02],[0,.79,-R-.025],[-.82,.8,-R-.02]],.015,tailM,40);
  K.glow(0xff2030,.9,.66,.84,-R-.08); K.glow(0xff2030,.9,-.66,.84,-R-.08);
  { const w=K.add(K.airfoil(.26,.04,1.6),paint,0,T.top(0,-2.2)+.03,-2.14); w.rotation.y=Math.PI/2; w.rotation.z=-.1; }
  K.add(new THREE.BoxGeometry(1.6,.2,.04),GLOSS_BLACK,0,.46,-R-.01); for(let i=0;i<6;i++) K.add(new THREE.BoxGeometry(.02,.16,.36),K.carbon,-.5+i*.2,.38,-R+.14);
  [-.58,-.22,.22,.58].forEach(x=>K.pipe(x,.46,-R-.06,.052)); K.plate(def,.64,-R-.02);
  return T;
}
/* ---- NEEDLE MK1: kei-wide hot hatch. Round lamps, riveted-look box flares, orange stripes, roof spoiler. ---- */
function needleShell(g,def,B,paint,glass){
  const K=carKit(g); rimPaint(paint,0xffa060,.12);
  const pin=new THREE.MeshBasicMaterial({color:0xff5a1f,toneMapped:false}), hx=hexGrilleM();
  const WB=B.wb, WR=B.wr, F=B.front, R=B.rear;
  const T=sculptBody(g,{Z0:-R,Z1:F,WB,WR,NS:50,inset:.13,
    hwS:[[-R,.9],[-WB-.05,.98],[-.5,.94],[0,.92],[.5,.94],[WB+.05,.98],[F,.88]],
    ysK:[[-R,.86],[-WB,.8],[0,.78],[WB,.8],[F,.62]],
    yfK:[[-R,.98],[-WB,.98],[0,.96],[WB,.94],[F,.74]],
    ycK:[[-R,.96],[-1.5,.98],[0,.94],[.7,.88],[F,.72]],
    hwL:[[-R,.88],[-WB,.82],[0,.88],[WB,.82],[F,.86]],
    ybK:[[-R,.32],[-1.6,.24],[1.6,.24],[F,.28]]},paint,K);
  const C={z0:-1.58,z1:.88,tumble:.12,pow:.42,cwK:[[-1.58,.58],[-1.42,.64],[-.7,.66],[.15,.64],[.88,.54]],htK:[[-1.58,1.14],[-1.45,1.42],[-.75,1.46],[.1,1.38],[.88,1.04]],roof:[-1.38,.28],roofA:1.15};
  sculptCanopy(g,C,T,glass,paint,K); outlawKit(K,T,C);
  archBlisters(K,T,B,paint,.045,.14,.02);
  // twin orange stripes over hood, roof and hatch
  [.1,-.1].forEach(x=>{ K.top(x-.04,x+.04,C.z1-.02,F-.08,pin,.006,16); K.roof(x-.04,x+.04,C.z0+.08,C.z1-.06,pin,.02,14); });
  // front: round halo lamps, slim black grille with an orange pinline, honeycomb lower intake
  K.add(new THREE.PlaneGeometry(.36,.1),GLOSS_BLACK,0,.64,F+.006); K.add(new THREE.BoxGeometry(.36,.01,.01),pin,0,.585,F+.012);
  K.add(new THREE.PlaneGeometry(.8,.13),hx,0,.38,F+.004);
  [1,-1].forEach(sd=>{ K.add(new THREE.TorusGeometry(.085,.016,8,26),headM,sd*.46,.64,F+.03); K.add(new THREE.CircleGeometry(.07,22),lensM,sd*.46,.64,F+.024); K.glow(0xcfe6ff,.6,sd*.46,.64,F+.08);
    K.shut(sd,.65); K.shut(sd,-.45); K.mirror(sd,.7,GLOSS_BLACK); K.sill(sd,-WB+WR+.15,WB-WR-.15,.03,.14,GLOSS_BLACK);
    K.add(new THREE.TorusGeometry(.075,.014,8,24),tailM,sd*.58,.9,-R-.014); K.add(new THREE.CircleGeometry(.06,20),gapM,sd*.58,.9,-R-.01).rotation.y=Math.PI; K.glow(0xff2030,.85,sd*.58,.9,-R-.07); });
  { const y=kfCR(C.htK,-1.45); K.add(new THREE.BoxGeometry(1.05,.03,.22),GLOSS_BLACK,0,y+.004,-1.48); K.add(new THREE.BoxGeometry(1.05,.012,.012),pin,0,y+.02,-1.48); }
  K.splitter(.72,F-.26,F+.03,.18);
  K.add(new THREE.PlaneGeometry(1.2,.16),GLOSS_BLACK,0,.46,-R-.008).rotation.y=Math.PI;
  for(let i=0;i<4;i++) K.add(new THREE.BoxGeometry(.02,.12,.26),K.carbon,-.3+i*.2,.34,-R+.1);
  K.pipe(0,.4,-R-.05,.05); K.plate(def,.66,-R-.02);
  return T;
}
const SHELLS={wisp:wispGlbShell,stratos:stratosShell,split:splitShell,zenkai:zenkaiShell,hikari:hikariShell,richmond:richmondShell,passyunk:passyunkShell,bell:bellShell,granfour:granfourGlbShell,sovereign:sovereignShell,dune:duneShell,kern:kernShell,vanta:vantaShell,noctis:noctisShell,p1:volcanoShell,kage:kageShell,overload:overloadGlbShell,hellbound:hellboundShell,tempesta:tempestaShell,mantis:mantisShell,autobahn:autobahnGlbShell,zephyr:zephyrShell,lumen:lumenShell,brigline:briglineShell,pulse2:pulse2Shell,vandal:vandalShell,needle:needleShell};
/* ---- street style: every car gets its own vinyl, underglow and wheel design (threejs-textures: CanvasTexture decals) ----
   vinyl: side graphic drawn on a 512x128 canvas. Directional ones are drawn nose-at-left and mirrored for the left flank.
   wheel: spoke | dish | mesh | fan | split | star | aero.  camber: static wheel tilt (stance).
   glow: underglow color. Only the street-meet tuners run it (Noctis, Passyunk, Zenkai); on a hypercar, a classic or a
   work truck it reads as a costume. */
const STREET={
 kage:{wheel:'twin',camber:.02},
 noctis:{glow:0x9b4dff,vinyl:'script',vc:'#c9ced6',text:'Noctis',wheel:'mesh'},
 vanta:{wheel:'aero'},
 kern:{vinyl:'number',vc:'#d8b04a',text:'88',wheel:'mesh'},
 dune:{vinyl:'splatter',vc:'#5a4630',wheel:'star'},
 sovereign:{vinyl:'checker',vc:'#1a1a1c',wheel:'spoke'}, // ghost checker, black on black
 granfour:{wheel:'turbine'},
 bell:{wheel:'twin'},
 passyunk:{glow:0x2fd6ff,vinyl:'sponsor',wheel:'split',camber:.05},
 richmond:{vinyl:'tribal',vc:'#ff5a1f',wheel:'star'},
 zenkai:{glow:0xff2bd6,wheel:'mesh',camber:.08},
 hikari:{glow:0xff3cd8,wheel:'six',camber:.1}, // wears its own lime slashes (hikariShell) // already wears its 37 roundels and windshield banner
 split:{vinyl:'flames',wheel:'twin'},
 overload:{vinyl:'gradient',vc:'#2fe6ff',wheel:'fan'},
 wisp:{wheel:'wisp',camber:.03},
 stratos:{wheel:'split'},
 volcano:{wheel:'forged'},
 hellbound:{wheel:'dish',camber:.03},
 tempesta:{vinyl:'slash',vc:'#d8b04a',wheel:'split'},
 mantis:{vinyl:'gradient',vc:'#0b0c0e',wheel:'mesh'},
 autobahn:{wheel:'abs',camber:.03},
 zephyr:{glow:0x14e0c8,vinyl:'gradient',vc:'#14e0c8',wheel:'aero'},
 lumen:{wheel:'spoke',camber:.04},
 brigline:{wheel:'mesh'},
 pulse2:{glow:0x5fe6c8,vinyl:'gradient',vc:'#5fe6c8',wheel:'aero'},
 vandal:{glow:0xb070ff,vinyl:'slash',vc:'#e8e8ee',wheel:'dish',camber:.04},
 needle:{glow:0xff5a1f,vinyl:'number',vc:'#ff5a1f',text:'01',wheel:'split',camber:.06}
};
function carNitroColor(def){
  if(def.nosColor!=null) return def.nosColor;
  const id=def.chassisId||def.id, st=STREET[id];
  if(st&&st.glow) return st.glow;
  if(def.accent) return def.accent;
  if(def.livery) return def.livery;
  if(def.caliper){ const c=new THREE.Color(def.caliper); if(c.r+c.g+c.b>.35) return def.caliper; }
  if(def.color&&typeof def.color==='string'&&def.color[0]==='#') return parseInt(def.color.slice(1),16);
  return 0x9fd3ff;
}
function applyNitroHud(def){
  const c=new THREE.Color(carNitroColor(def)), lit=c.clone().lerp(new THREE.Color(0xffffff),.45);
  document.documentElement.style.setProperty('--nos','#'+c.getHexString());
  document.documentElement.style.setProperty('--nos-dim','#'+lit.getHexString());
}
const VINYLS={
 flames:{dir:1,draw(g,w,h){ const gr=g.createLinearGradient(0,0,w*.8,0); gr.addColorStop(0,'#fff27a'); gr.addColorStop(.35,'#ffb020'); gr.addColorStop(.7,'#ff3a1a'); gr.addColorStop(1,'rgba(200,20,10,0)');
   g.fillStyle=gr; g.strokeStyle='#7a0a05'; g.lineWidth=3;
   [[.62,.2,.9],[.5,.45,.75],[.7,.7,1],[.45,.88,.6]].forEach(([len,y,a])=>{ const L=w*len, Y=h*y; g.beginPath(); g.moveTo(0,Y-h*.2); g.bezierCurveTo(L*.35,Y-h*.26,L*.55,Y-h*.02,L,Y-h*.1*a);
     g.bezierCurveTo(L*.7,Y+h*.02,L*.55,Y+h*.12,L*.8,Y+h*.14); g.bezierCurveTo(L*.45,Y+h*.2,L*.2,Y+h*.12,0,Y+h*.18); g.closePath(); g.fill(); g.stroke(); }); }},
 tribal:{dir:0,draw(g,w,h,c){ g.fillStyle=c;
   for(let k=0;k<3;k++){ const x0=40+k*150; g.beginPath(); g.moveTo(x0,h*.5); g.quadraticCurveTo(x0+60,h*.05,x0+170,h*.15); g.quadraticCurveTo(x0+90,h*.3,x0+70,h*.5);
     g.quadraticCurveTo(x0+100,h*.72,x0+190,h*.82); g.quadraticCurveTo(x0+70,h*.95,x0,h*.5); g.fill(); } }},
 checker:{dir:1,draw(g,w,h,c){ const s=16; for(let y=0;y<h;y+=s) for(let x=0;x<w;x+=s){ if(((x+y)/s)%2) continue; const a=Math.max(0,1-x/(w*.75)); if(a<=0) continue;
   g.globalAlpha=a*(Math.random()<a*1.4?1:0); g.fillStyle=c; g.fillRect(x,y,s,s); } g.globalAlpha=1; }},
 splatter:{dir:0,draw(g,w,h,c){ const R=rng(31); g.fillStyle=c;
   for(let i=0;i<140;i++){ const x=R()*w, y=h*(1-Math.pow(R(),2.2)), r=1+R()*R()*9; g.globalAlpha=.55+R()*.45; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); if(R()<.15) g.fillRect(x-1,y,2,6+R()*14); }
   g.globalAlpha=.8; g.fillRect(0,h*.86,w,h*.14); g.globalAlpha=1; }},
 slash:{dir:1,draw(g,w,h,c){ g.fillStyle=c; [[10,.6],[120,1],[200,.8],[290,.45],[350,.3]].forEach(([x,k])=>{ g.globalAlpha=k; g.beginPath(); g.moveTo(x+60,h*.1); g.lineTo(x+60+120*k,h*.1); g.lineTo(x+120*k,h*.9); g.lineTo(x,h*.9); g.fill(); }); g.globalAlpha=1; }},
 sponsor:{dir:0,draw(g,w,h){ const tags=[['KAIZEN','#111','#ffd23b'],['AFTERHOURS','#f4f5f7','#111'],['RYU TUNE','#d42020','#fff'],['NIGHT GRIP','#1a6bff','#fff'],['TORQ','#111','#7dff9a']];
   let x=8; tags.forEach(([t,bg,fg],i)=>{ g.font=`800 ${i%2?22:26}px "Arial Narrow",Arial,sans-serif`; const tw=g.measureText(t).width+18, y=i%2?h*.52:h*.16, hh=i%2?34:40;
     g.fillStyle=bg; g.fillRect(x,y,tw,hh); g.fillStyle=fg; g.textBaseline='middle'; g.fillText(t,x+9,y+hh/2+1); x+=tw*.72; }); }},
 script:{dir:0,draw(g,w,h,c,t){ g.font='italic 900 84px Georgia,serif'; g.textAlign='center'; g.textBaseline='middle'; g.lineWidth=6; g.strokeStyle='rgba(0,0,0,.6)'; g.strokeText(t,w/2,h/2+4); g.fillStyle=c; g.fillText(t,w/2,h/2+4);
   g.fillRect(w*.12,h*.86,w*.76,3); }},
 number:{dir:0,draw(g,w,h,c,t){ g.font='italic 900 118px "Arial Narrow",Arial,sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.lineWidth=8; g.strokeStyle=c; g.strokeText(t,w*.5,h/2+6);
   g.fillStyle='#0b0c0e'; g.fillText(t,w*.5,h/2+6); g.fillStyle=c; g.fillRect(w*.08,h*.5-2,w*.22,4); g.fillRect(w*.7,h*.5-2,w*.22,4); }},
 gradient:{dir:1,draw(g,w,h,c){ for(let i=0;i<6;i++){ const y=h*(.12+i*.15), gr=g.createLinearGradient(0,0,w*(.95-i*.08),0); gr.addColorStop(0,c); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(0,y,w,h*(.1-i*.012)); } }},
 stars:{dir:1,draw(g,w,h,c){ g.fillStyle='#b3121c'; g.fillRect(0,h*.62,w*.9,10); g.fillStyle='#f4f5f7'; g.fillRect(0,h*.62+12,w*.8,6);
   g.fillStyle=c; const star=(x,y,r)=>{ g.beginPath(); for(let k=0;k<10;k++){ const a=-Math.PI/2+k*Math.PI/5, rr=k%2?r*.42:r; g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr); } g.fill(); };
   for(let i=0;i<7;i++) star(40+i*58,h*.3,18-i*1.6); }},
 stripes:{dir:1,draw(g,w,h,c){ g.fillStyle=c; [[.34,10],[.52,5]].forEach(([y,t])=>{ g.beginPath(); g.moveTo(0,h*y); g.lineTo(w*.55,h*y); g.lineTo(w*.66,h*(y+.28)); g.lineTo(w,h*(y+.28)); g.lineTo(w,h*(y+.28)+t); g.lineTo(w*.66-4,h*(y+.28)+t); g.lineTo(w*.55-4,h*y+t); g.lineTo(0,h*y+t); g.fill(); }); }},
 circuit:{dir:0,draw(g,w,h,c){ const R=rng(7); g.strokeStyle=c; g.fillStyle=c; g.lineWidth=3;
   for(let i=0;i<9;i++){ let x=R()*w*.3, y=12+R()*(h-24); g.beginPath(); g.moveTo(x,y); for(let k=0;k<4;k++){ x+=30+R()*90; g.lineTo(x,y); if(R()<.6){ const d=(R()<.5?-1:1)*20; x+=20; y=clamp(y+d,8,h-8); g.lineTo(x,y); } } g.stroke(); g.beginPath(); g.arc(x,y,5,0,7); g.fill(); } }},
 lightning:{dir:1,draw(g,w,h,c){ g.fillStyle=c; g.strokeStyle='#111'; g.lineWidth=3; g.beginPath();
   const pts=[[0,.42],[150,.3],[130,.52],[300,.36],[280,.6],[500,.5],[270,.72],[292,.5],[118,.66],[140,.46],[0,.58]]; pts.forEach(([x,y],i)=>i?g.lineTo(x,h*y):g.moveTo(x,h*y)); g.closePath(); g.fill(); g.stroke(); }},
 pinstripe:{dir:1,draw(g,w,h,c){ g.strokeStyle=c; g.lineWidth=2.5; [.46,.54].forEach(y=>{ g.beginPath(); g.moveTo(8,h*y); g.lineTo(w*.8,h*y); g.quadraticCurveTo(w*.92,h*y,w*.96,h*(y<.5?.3:.7)); g.stroke(); }); }}
};
const VINYL_CACHE={};
function vinylMat(key,st,frontLeft){ const k=key+'|'+frontLeft; if(VINYL_CACHE[k]) return VINYL_CACHE[k];
  const V=VINYLS[st.vinyl], tex=CT(canvasTex(512,128,(g,w,h)=>{ if(V.dir&&!frontLeft){ g.translate(w,0); g.scale(-1,1); } V.draw(g,w,h,st.vc||'#fff',st.text||''); }));
  return VINYL_CACHE[k]=new THREE.MeshStandardMaterial({map:tex,transparent:true,alphaTest:.05,roughness:.32,metalness:.1,polygonOffset:true,polygonOffsetFactor:-2,depthWrite:false}); }
/* underglow as a real LED kit reads at night: strips hidden under the sills throw a soft pool that hugs the car's
   footprint, brightest right under the sill line and dying out within a meter past the body; the middle stays
   dark (the car is in the way), so the contact shadow still grounds it. Baked into a texture per body shape rather
   than real lights (threejs-lighting: limit light count, bake where you can), tone-mapped so it never blows the bloom. */
const UG_TEX={}, UG_MAT={}, UG_STRIP={};
function underglowTex(B){ const W=B.w+2.6, L=B.front+B.rear+1.6, k=B.w.toFixed(2)+'|'+L.toFixed(2); if(UG_TEX[k]) return UG_TEX[k];
  const hx=B.w/2-.14, hz=(B.front+B.rear)/2-.45, cw=64, ch=160;
  return UG_TEX[k]=CT(canvasTex(cw,ch,(g,w,h)=>{ const im=g.createImageData(w,h);
    for(let j=0;j<h;j++) for(let i=0;i<w;i++){ const x=((i+.5)/w-.5)*W, z=((j+.5)/h-.5)*L, ax=Math.abs(x), az=Math.abs(z);
      const dx=ax-hx, dz=az-hz, out=Math.hypot(Math.max(dx,0),Math.max(dz,0));        // distance past the sill line
      const sill=Math.exp(-dx*dx/(2*.42*.42));                                              // strips run along the sides
      const ends=clamp((hz+.55-az)/.9,0,1);                                               // and stop short of the bumpers
      const a=clamp((.16+.84*sill)*(.35+.65*ends)*Math.exp(-out/.62),0,1);
      im.data.set([255,255,255,Math.round(255*a*a*(3-2*a))],(j*w+i)*4); }
    g.putImageData(im,0,0); })); }
function underglowMats(c,tex){ const k=c.getHexString()+'|'+tex.uuid; if(!UG_MAT[k]){
    UG_MAT[k]=new THREE.MeshBasicMaterial({map:tex,color:c.clone().multiplyScalar(.8),transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3});
    UG_STRIP[k]=new THREE.MeshBasicMaterial({color:c,toneMapped:false}); } // the strip itself is the one authored emissive bit
  return [UG_MAT[k],UG_STRIP[k]]; }
// add the street pieces to a built car group. flank(sd,z) -> side-surface points (bottom to top) where a decal sits at station z
function streetStyle(g,def,B,cid,flank){
  const st=STREET[cid]; if(!st) return;
  if(st.glow){ const c=new THREE.Color(st.glow), [poolM,stripM]=underglowMats(c,underglowTex(B));
    const pool=new THREE.Mesh(new THREE.PlaneGeometry(B.w+2.6,B.front+B.rear+1.6),poolM);
    pool.rotation.x=-Math.PI/2; pool.position.set(0,.028,(B.front-B.rear)/2); pool.renderOrder=2; g.add(pool);
    // the LED strips: tucked under the sills between the wheels, seen only from low angles and as a thin edge line
    const len=Math.max(.6,B.wb*2-B.wr*2-.5);
    [1,-1].forEach(sd=>{ const n=new THREE.Mesh(new THREE.BoxGeometry(.035,.018,len),stripM); n.position.set(sd*(B.w/2-.16),Math.max(.09,B.base-.05),0); g.add(n); }); }
  if(st.vinyl&&VINYLS[st.vinyl]){ const z0=-B.wb+B.wr+.16, z1=B.wb-B.wr-.16, n=14;
    [1,-1].forEach(sd=>{ const pos=[],uv=[],idx=[];
      for(let i=0;i<=n;i++){ const z=z0+(z1-z0)*i/n, pts=flank(sd,z), u=sd>0?1-i/n:i/n; // right flank: nose at canvas left
        const cum=[0]; for(let j=1;j<pts.length;j++) cum.push(cum[j-1]+Math.hypot(pts[j][0]-pts[j-1][0],pts[j][1]-pts[j-1][1]));
        pts.forEach((p,j)=>{ pos.push(p[0],p[1],z); uv.push(u,cum[j]/cum[cum.length-1]); }); } // points run bottom to top
      const m=flank(sd,0).length;
      for(let i=0;i<n;i++) for(let j=0;j<m-1;j++){ const a=i*m+j, b=a+1, c=a+m, d=c+1; if(sd>0) idx.push(a,b,c,b,d,c); else idx.push(a,c,b,b,c,d); }
      const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2)); geo.setIndex(idx); geo.computeVertexNormals();
      const mesh=new THREE.Mesh(geo,vinylMat(cid,st,sd>0)); mesh.renderOrder=1; g.add(mesh); }); }
}
// rim designs; spin is the wheel's spinning group, side = +-1, rimM the rim material
const TURBINE_M=new THREE.MeshStandardMaterial({color:0x3b342c,metalness:.75,roughness:.36,envMapIntensity:1.1});
const MACHINED_M=new THREE.MeshStandardMaterial({color:0xb4bac2,metalness:1,roughness:.22,envMapIntensity:1.6}); const WHEEL_GEO={}, FORGED_CHROME=new THREE.MeshStandardMaterial({color:0xf6f8fa,metalness:.88,roughness:.1,envMapIntensity:2.6});
function wheelStyle(spin,side,style,rimM,def){
  const at=(o,x)=>{ o.position.x=side*x; spin.add(o); return o; };
  const spokes=(n,wd,x,len)=>{ for(let k=0;k<n;k++){ const s=new THREE.Mesh(new THREE.BoxGeometry(.03,len,wd),rimM); s.rotation.x=k*Math.PI/n; at(s,x); } };
  switch(style){
    case 'dish': // deep dish: wide polished lip, spokes set far back
      at(new THREE.Mesh(new THREE.RingGeometry(.2,.3,32),chromeTrimM),.158).rotation.y=side*Math.PI/2;
      spokes(5,.08,.1,.42); break;
    case 'mesh': // cross-laced mesh: two sets of thin spokes skewed against each other, plus an inner ring
      for(let k=0;k<12;k++) [1,-1].forEach(t=>{ const s=new THREE.Mesh(new THREE.BoxGeometry(.012,.5,.018),rimM); s.rotation.x=k*Math.PI/12+t*.14; at(s,.155); });
      at(new THREE.Mesh(new THREE.TorusGeometry(.12,.012,6,24),rimM),.16).rotation.y=Math.PI/2; break;
    case 'fan': { // turbofan: solid disc with twisted blades
      at(new THREE.Mesh(new THREE.CircleGeometry(.27,28),rimM),.145).rotation.y=side*Math.PI/2;
      for(let k=0;k<14;k++){ const b=new THREE.Mesh(new THREE.BoxGeometry(.012,.2,.05),rimM); b.position.set(0,Math.cos(k/14*Math.PI*2)*.17,Math.sin(k/14*Math.PI*2)*.17); b.rotation.x=k/14*Math.PI*2; b.rotateY(side*.5);
        at(b,.16); } break; }
    case 'turbine': { // Gran Four, from Paris's sheet: sixteen curved, pitched turbine blades sweeping from a small hub to the lip over a dark dish
      const TB=WHEEL_GEO.turbine||(WHEEL_GEO.turbine=(()=>{ const P=(r,t)=>[-Math.sin(t)*r,Math.cos(t)*r], N=16, blades=[];
        const th=r=>{ const s=clamp((r-.07)/.205,0,1); return 1.05*Math.pow(s,1.25); }, hw=r=>{ const s=clamp((r-.07)/.205,0,1); return (.03-.011*s)/r; };
        for(let k=0;k<N;k++){ const a=k/N*Math.PI*2, sh=new THREE.Shape(), e1=[], e2=[];
          for(let i=0;i<=10;i++){ const r=lerp(.07,.275,i/10); e1.push(P(r,a+th(r)+hw(r))); e2.push(P(r,a+th(r)-hw(r))); }
          sh.moveTo(...e1[0]); e1.slice(1).forEach(p=>sh.lineTo(...p)); e2.reverse().forEach(p=>sh.lineTo(...p)); sh.lineTo(...e1[0]);
          const g=new THREE.ExtrudeGeometry(sh,{depth:.024,bevelEnabled:true,bevelThickness:.004,bevelSize:.003,bevelSegments:1,curveSegments:4});
          const pos=g.attributes.position; // pitch: push each point out along the axle by its offset from the blade's centreline (a turbine twist)
          for(let i=0;i<pos.count;i++){ const x=pos.getX(i), y=pos.getY(i), r=Math.hypot(x,y), phi=Math.atan2(-x,y); let d=phi-(a+th(r)); d=Math.atan2(Math.sin(d),Math.cos(d)); pos.setZ(i,pos.getZ(i)+.55*d*r); }
          g.computeVertexNormals(); g.rotateY(Math.PI/2); blades.push(g); }
        return {blades:mergeGeos(blades),dish:new THREE.RingGeometry(.05,.285,48).rotateY(Math.PI/2),cap:new THREE.CylinderGeometry(.062,.07,.04,28).rotateZ(Math.PI/2),
          badge:new THREE.CircleGeometry(.03,20).rotateY(Math.PI/2),lip:new THREE.CylinderGeometry(.285,.285,.04,48,1,true).rotateZ(Math.PI/2)}; })());
      const TM=TURBINE_M; // smoked dark-bronze satin, as on the sheet
      at(new THREE.Mesh(TB.dish,barrelM),.12).rotation.y=side>0?0:Math.PI;
      const bm=at(new THREE.Mesh(TB.blades,TM),.132); bm.scale.x=side;
      at(new THREE.Mesh(TB.lip,TM),.15); at(new THREE.Mesh(TB.cap,TM),.16);
      at(new THREE.Mesh(TB.badge,blackM),.181).rotation.y=side>0?0:Math.PI; break; }
    case 'twin': // forged ten twin-spoke: slim paired spokes running out to the lip
      for(let k=0;k<10;k++) [-.045,.045].forEach(o=>{ const s=new THREE.Mesh(new THREE.BoxGeometry(.016,.2,.022),rimM), a=k/10*Math.PI*2+o;
        s.position.set(0,Math.cos(a)*.165,Math.sin(a)*.165); s.rotation.x=a; at(s,.158); });
      at(new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.02,20),rimM),.158).rotation.z=Math.PI/2; break;
    case 'split': // split five-spoke: each spoke is a pair
      for(let k=0;k<5;k++) [-.1,.1].forEach(o=>{ const s=new THREE.Mesh(new THREE.BoxGeometry(.02,.25,.03),rimM); const a=k/5*Math.PI*2+o;
        s.position.set(0,Math.cos(a)*.14,Math.sin(a)*.14); s.rotation.x=a; at(s,.16); }); break;
    case 'star': // chunky off-road star: six wide spokes and exposed bolts
      spokes(3,.1,.16,.52); at(new THREE.Mesh(new THREE.RingGeometry(.24,.27,24),blackM),.162).rotation.y=side*Math.PI/2;
      for(let k=0;k<12;k++){ const a=k/12*Math.PI*2, nb=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.02,6),chromeTrimM); nb.rotation.z=Math.PI/2; nb.position.set(side*.165,Math.cos(a)*.255,Math.sin(a)*.255); spin.add(nb); } break;
    case 'forged': { // forged split five-spoke in mirror chrome: each spoke forks into two bevelled blades out to a riveted polished lip
      const key='forged', C=WHEEL_GEO[key]||(WHEEL_GEO[key]=(()=>{ const blades=[];
        for(let k=0;k<5;k++){ const a=k/5*Math.PI*2; [-1,1].forEach(f=>{ const sh=new THREE.Shape(), P=(r,t)=>[-Math.sin(t)*r,Math.cos(t)*r]; // shape (x,y) -> wheel (z,y) after rotateY
            const h0=a+f*.07, h1=a+f*.22, pts=[P(.075,h0-.06),P(.2,a+f*.14-.05),P(.272,h1-.042),P(.272,h1+.042),P(.2,a+f*.14+.05),P(.075,h0+.06)];
            sh.moveTo(...pts[0]); sh.quadraticCurveTo(...pts[1],...pts[2]); sh.lineTo(...pts[3]); sh.quadraticCurveTo(...pts[4],...pts[5]); sh.lineTo(...pts[0]);
            const g=new THREE.ExtrudeGeometry(sh,{depth:.03,bevelEnabled:true,bevelThickness:.008,bevelSize:.007,bevelSegments:2,curveSegments:8}); g.rotateY(Math.PI/2); blades.push(g); }); }
        const rivet=new THREE.CylinderGeometry(.009,.009,.016,6); rivet.rotateZ(Math.PI/2);
        return {blades,rivet,cap:new THREE.CylinderGeometry(.088,.098,.05,28).rotateZ(Math.PI/2),badge:new THREE.CircleGeometry(.045,20)}; })());
      const FC=FORGED_CHROME; // AUTOBAHN 63 v4 runs mirror-chrome split spokes over red calipers, as in Paris's wheel reference
      C.blades.forEach(g=>{ const m=at(new THREE.Mesh(g,FC),.128); m.scale.x=side; }); // the blade extrusion runs +x: mirror it on the left wheels so it stands proud of the tire there too
      at(new THREE.Mesh(C.back||(C.back=new THREE.RingGeometry(.09,.29,32)),barrelM),.1).rotation.y=side*Math.PI/2; // dark barrel face so the chrome pops
      at(new THREE.Mesh(C.cap,FC),.172);
      at(new THREE.Mesh(C.badge,blackM),.198).rotation.y=side*Math.PI/2;
      for(let k=0;k<20;k++){ const a=k/20*Math.PI*2, r=new THREE.Mesh(C.rivet,FORGED_CHROME); r.position.set(side*.165,Math.cos(a)*.285,Math.sin(a)*.285); spin.add(r); }
      break; }
    case 'six': { // TE-style six-spoke: tapered blades leaning out from a recessed hub (concave), stepped lip with a machined edge, dark face behind
      const W6=WHEEL_GEO.six6||(WHEEL_GEO.six6=(()=>{ const sh=new THREE.Shape(); // blade outline in (width, length): wide at the hub, narrow at the lip, rounded tip
          sh.moveTo(-.036,0); sh.lineTo(.036,0); sh.lineTo(.018,.17); sh.quadraticCurveTo(0,.182,-.018,.17); sh.lineTo(-.036,0);
          const spoke=new THREE.ExtrudeGeometry(sh,{depth:.028,bevelEnabled:true,bevelThickness:.008,bevelSize:.006,bevelSegments:3,curveSegments:6}); spoke.translate(0,0,-.014); spoke.rotateY(Math.PI/2);
          return {spoke,face:new THREE.RingGeometry(.09,.262,48).rotateY(Math.PI/2),step:new THREE.RingGeometry(.25,.281,56).rotateY(Math.PI/2),edge:new THREE.TorusGeometry(.281,.006,6,64).rotateY(Math.PI/2), // rotations baked in so the lowPro y/z scale stays round
            cap:new THREE.CylinderGeometry(.078,.088,.05,32).rotateZ(Math.PI/2),boss:new THREE.CylinderGeometry(.036,.036,.022,24).rotateZ(Math.PI/2)}; })());
      at(new THREE.Mesh(W6.face,barrelM),.153).rotation.y=side>0?0:Math.PI;                       // dark barrel floor just proud of the tire sidewall disc (everything under x=.15 is hidden)
      for(let k=0;k<6;k++){ const piv=new THREE.Group(); piv.rotation.x=k/6*Math.PI*2+Math.PI/6; const s=new THREE.Mesh(W6.spoke,rimM); s.position.y=.078; s.rotation.z=-side*.15; piv.add(s); at(piv,.16); } // hub sits back, blades climb out to the lip: concave
      at(new THREE.Mesh(W6.step,rimM),.187).rotation.y=side>0?0:Math.PI;                            // stepped outer lip, flush with the blade tips
      at(new THREE.Mesh(W6.edge,MACHINED_M),.189);                             // machined lip edge catches the light
      at(new THREE.Mesh(W6.cap,rimM),.16); at(new THREE.Mesh(W6.boss,MACHINED_M),.182);
      const lb=WHEEL_GEO.lip6||(WHEEL_GEO.lip6=new THREE.CylinderGeometry(.281,.281,.036,48,1,true).rotateZ(Math.PI/2)); at(new THREE.Mesh(lb,rimM),.169); // lip barrel wall between sidewall and step
      break; }
    case 'wisp': { // Wisp 07, from the side reference: five chunky Y spokes in smoked gunmetal, each forking into twin tines at
      // the lip, open between them so the drilled rotor and lime caliper show; stepped lip with a machined edge, small lime-ringed cap
      const W=WHEEL_GEO.wisp||(WHEEL_GEO.wisp=(()=>{ const P=(r,t)=>[-Math.sin(t)*r,Math.cos(t)*r], blades=[];
        for(let k=0;k<5;k++){ const a=k/5*Math.PI*2; [-1,1].forEach(f=>{ const sh=new THREE.Shape();
            const pts=[P(.062,a-.11+f*.05),P(.15,a+f*.045-.055),P(.272,a+f*.17-.05),P(.272,a+f*.17+.05),P(.15,a+f*.045+.055),P(.062,a+.11+f*.05)];
            sh.moveTo(...pts[0]); sh.quadraticCurveTo(...pts[1],...pts[2]); sh.lineTo(...pts[3]); sh.quadraticCurveTo(...pts[4],...pts[5]); sh.lineTo(...pts[0]);
            const g=new THREE.ExtrudeGeometry(sh,{depth:.04,bevelEnabled:true,bevelThickness:.012,bevelSize:.009,bevelSegments:5,curveSegments:20}); g.translate(0,0,-.02); g.rotateY(Math.PI/2); blades.push(g); }); }
        const hubG=new THREE.CylinderGeometry(.088,.1,.05,48).rotateZ(Math.PI/2);
        return {blades,hub:hubG,step:new THREE.RingGeometry(.264,.286,96).rotateY(Math.PI/2),edge:new THREE.TorusGeometry(.286,.006,8,128).rotateY(Math.PI/2),
          lip:new THREE.CylinderGeometry(.286,.286,.036,96,1,true).rotateZ(Math.PI/2),cap:new THREE.CylinderGeometry(.044,.05,.03,36).rotateZ(Math.PI/2),
          capRing:new THREE.TorusGeometry(.05,.006,8,48).rotateY(Math.PI/2),nut:new THREE.CylinderGeometry(.012,.012,.03,6).rotateZ(Math.PI/2)}; })());
      W.blades.forEach(b=>{ const piv=new THREE.Group(); piv.add(new THREE.Mesh(b,rimM)); piv.rotation.z=-side*.06; at(piv,.158); });
      at(new THREE.Mesh(W.hub,rimM),.15); at(new THREE.Mesh(W.lip,rimM),.168); at(new THREE.Mesh(W.step,rimM),.186).rotation.y=side>0?0:Math.PI; at(new THREE.Mesh(W.edge,MACHINED_M),.188);
      at(new THREE.Mesh(W.cap,blackM),.178); at(new THREE.Mesh(W.capRing,WISP_LIME),.192);
      for(let k=0;k<5;k++){ const a=k/5*Math.PI*2+Math.PI/5, n=new THREE.Mesh(W.nut,MACHINED_M); n.position.set(side*.18,Math.cos(a)*.07,Math.sin(a)*.07); spin.add(n); }
      break; }
    case 'abs': { // AUTOBAHN 63, from Paris's wheel reference: five split spokes in mirror chrome, each pair fanning wide toward a
      // thin polished rim, concave (hub set back), open between the tines so the drilled rotor and the big red caliper show
      const W=WHEEL_GEO.abs||(WHEEL_GEO.abs=(()=>{ const P=(r,t)=>[-Math.sin(t)*r,Math.cos(t)*r], blades=[];
        for(let k=0;k<5;k++){ const a=k/5*Math.PI*2; [-1,1].forEach(f=>{ const sh=new THREE.Shape();
            const pts=[P(.07,a+f*.05-.07),P(.17,a+f*.11-.045),P(.27,a+f*.24-.04),P(.27,a+f*.24+.04),P(.17,a+f*.11+.045),P(.07,a+f*.05+.07)];
            sh.moveTo(...pts[0]); sh.quadraticCurveTo(...pts[1],...pts[2]); sh.lineTo(...pts[3]); sh.quadraticCurveTo(...pts[4],...pts[5]); sh.lineTo(...pts[0]);
            const g=new THREE.ExtrudeGeometry(sh,{depth:.034,bevelEnabled:true,bevelThickness:.01,bevelSize:.008,bevelSegments:4,curveSegments:16}); g.translate(0,0,-.017); g.rotateY(Math.PI/2); blades.push(g); }); }
        return {blades,hub:new THREE.CylinderGeometry(.09,.1,.05,48).rotateZ(Math.PI/2),edge:new THREE.TorusGeometry(.284,.008,8,128).rotateY(Math.PI/2),
          lip:new THREE.CylinderGeometry(.286,.286,.03,96,1,true).rotateZ(Math.PI/2),cap:new THREE.CylinderGeometry(.046,.052,.03,36).rotateZ(Math.PI/2),
          nut:new THREE.CylinderGeometry(.012,.012,.03,6).rotateZ(Math.PI/2)}; })());
      W.blades.forEach(b=>{ const piv=new THREE.Group(); piv.add(new THREE.Mesh(b,FORGED_CHROME)); piv.rotation.z=-side*.07; at(piv,.152); }); // dish: tips lean out to the rim
      at(new THREE.Mesh(W.hub,FORGED_CHROME),.145); at(new THREE.Mesh(W.lip,FORGED_CHROME),.162); at(new THREE.Mesh(W.edge,FORGED_CHROME),.176);
      at(new THREE.Mesh(W.cap,blackM),.172);
      for(let k=0;k<5;k++){ const a=k/5*Math.PI*2+Math.PI/5, n=new THREE.Mesh(W.nut,MACHINED_M); n.position.set(side*.172,Math.cos(a)*.068,Math.sin(a)*.068); spin.add(n); }
      break; }
    case 'aero': // aero cover: flat disc with five teardrop windows
      at(new THREE.Mesh(new THREE.CircleGeometry(.27,28),rimM),.15).rotation.y=side*Math.PI/2;
      for(let k=0;k<5;k++){ const a=k/5*Math.PI*2, h=new THREE.Mesh(new THREE.CircleGeometry(.05,14),gapM); h.rotation.y=side*Math.PI/2;
        h.position.set(side*.152,Math.cos(a)*.17,Math.sin(a)*.17); spin.add(h); } break;
    default: { const n=def.spokes||6; for(let k=0;k<n;k++){ const s=new THREE.Mesh(new THREE.BoxGeometry(.03,.5,n>10?.03:.07),rimM); s.rotation.x=k*Math.PI/n; at(s,.16); } }
  }
}
function buildCar(def,opts){
  opts=opts||{}; const B=BODIES[def.body||'wedge'], cid=def.chassisId||def.id; // rivals race a copy of an archive car under their own id
  const g=new THREE.Group();
  const paint=new THREE.MeshPhysicalMaterial({color:def.paint,metalness:def.metal,roughness:def.rough,clearcoat:def.matte?0:1,clearcoatRoughness:.03,envMapIntensity:1.25});
  if(!def.matte){ paint.normalMap=CARTEX.flake; paint.normalScale=new THREE.Vector2(.12+def.metal*.18,.12+def.metal*.18); } // metallic flake under a smooth clear coat
  const glass=new THREE.MeshPhysicalMaterial({color:0x0a0e14,metalness:.15,roughness:.02,clearcoat:1,clearcoatRoughness:.02,reflectivity:1,envMapIntensity:1.7});
  let flank=null; // side-surface sampler for the street vinyl
  if(SHELLS[def.sculpt]){ paint.normalMap=null; paint.clearcoatRoughness=.015; const T=SHELLS[def.sculpt](g,def,B,paint,glass,opts);
    flank=(sd,z)=>{ const c=T.sec(z), o=.012; return [[sd*(c.hl+o),c.yb+.08],[sd*(c.hl+o),c.ay],[sd*(c.hs*.985+o),Math.max(c.ys-.08,c.ay+.02)],[sd*(c.hs+o*.7),c.ys-.01]]; }; } // sculpted bodies: smooth clear coat (the flake map stretches over lofted UVs)
  else {
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
  const bevelBoxGeo=(w,h,d)=>{ const bv=Math.min(.012,w,h,d)*.22; const sh=new THREE.Shape(); sh.moveTo(-w/2,-h/2); sh.lineTo(w/2,-h/2); sh.lineTo(w/2,h/2); sh.lineTo(-w/2,h/2); sh.closePath();
    const geo=new THREE.ExtrudeGeometry(sh,{depth:d,bevelEnabled:bv>.0008,bevelThickness:bv,bevelSize:bv*.9,bevelSegments:2,curveSegments:4}); geo.translate(0,0,-d/2); return geo; };
  const box=(w,h,d,m,x,y,z,ry,bev)=>{ const b=new THREE.Mesh(bev?bevelBoxGeo(w,h,d):new THREE.BoxGeometry(w,h,d),m); b.position.set(x,y,z); if(ry)b.rotation.y=ry; g.add(b); return b; };
  // surface heights along the car (z): body deck and cabin roof, sampled from the same splines the extrusions use (+ bevel)
  const spl=p=>new THREE.SplineCurve(p.map(q=>new THREE.Vector2(q[0],q[1]))).getPoints(96);
  const lin=(p,z)=>{ let i=1; while(i<p.length-1&&(p[i].x<z||p[i].x<=p[i-1].x)) i++; const a=p[i-1], b=p[i], t=clamp((z-a.x)/((b.x-a.x)||1),0,1); return a.y+(b.y-a.y)*t; };
  const deckP=spl(B.pts), roofP=spl(B.cab), deckY=z=>lin(deckP,z)+.135, roofY=z=>lin(roofP,z)+.1;
  const strip=(x,w,z0,z1,m,n,top,t)=>{ top=top||deckY; t=t||.012; const dz=(z1-z0)/n; // band (or bulge, with thickness t) laid over a curved surface in n straight pieces
    for(let i=0;i<n;i++){ const za=z0+i*dz, ya=top(za), yb=top(za+dz); box(w,t,Math.hypot(dz,yb-ya)+.01,m,x,(ya+yb)/2+t/2,za+dz/2).rotation.x=-Math.atan2(yb-ya,dz); } };
  const decal=(cw,ch,draw)=>new THREE.MeshStandardMaterial({map:CT(canvasTex(cw,ch,draw)),transparent:true,roughness:.4,metalness:.1});
  const pipe=(x,y,z,r)=>{ const t=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.1,.16,14,1,true),exhM); t.rotation.x=Math.PI/2; t.position.set(x,y,z); g.add(t);
    const inner=new THREE.Mesh(new THREE.CircleGeometry(r*.9,14),gapM); inner.position.set(x,y,z+.06); inner.rotation.y=Math.PI; g.add(inner); };
  /* flares: intentionally kept (documented in the afterhours-threejs skill) */ const flares=(m,h)=>[[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([sx,sz])=>{ const x=sx*(B.w/2+.15), y=B.wr*2+h, z=sz*B.wb; // arch cladding: top run plus two raked ends
    box(.16,.07,1.0,m,x,y,z); [1,-1].forEach(e=>box(.16,.07,.38,m,x,y-.12,z+e*.62).rotation.x=e*.75); });
  const hw=B.w/2+.12, F=B.front, Rr=B.rear;
  if(!cut&&cid!=='bell'&&!(STREET[cid]||{}).vinyl){ box(.05,.2,.75,blackM,hw,B.base+.36,-.5); box(.05,.2,.75,blackM,-hw,B.base+.36,-.5); } // generic side intake, only where no vinyl runs // bell's intake sits inside its C-sweep
  box(1.6,.2,.3,blackM,0,B.base+.08,-Rr+.1,0,true); box(2.0,.12,.5,blackM,0,B.base+.01,F-.26,0,true);
  const hx=B.w*.36;
  // headlight units: glossy housing, two projector lenses and an LED running-light strip
  [1,-1].forEach(sd=>{ box(.56,.13,.12,lensM,sd*hx,B.headY,F-.17,sd*.38,true);
    [.1,-.1].forEach(o=>{ const l=new THREE.Mesh(new THREE.CircleGeometry(.045,16),headM); l.position.set(sd*hx+o*Math.cos(.38),B.headY-.005,F-.1+o*sd*Math.sin(.38)*-1); g.add(l); });
    box(.5,.018,.03,headM,sd*hx,B.headY+.075,F-.14,sd*.38); });
  // taillights: full-width bar plus two clusters, third brake light, reverse lights
  box(B.w*.95,.035,.05,tailM,0,B.tailY,-Rr-.03);
  [1,-1].forEach(sd=>{ box(.46,.1,.05,lensM,sd*B.w*.33,B.tailY-.05,-Rr-.02,0,true); box(.4,.03,.02,tailM,sd*B.w*.33,B.tailY-.03,-Rr-.05); box(.4,.02,.02,tailM,sd*B.w*.33,B.tailY-.08,-Rr-.05);
    box(.12,.04,.02,headM,sd*B.w*.16,B.base+.2,-Rr-.04); });
  if(def.widebody){ // bolt-on fender flares, hood vents, canards
    [[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([sx,sz])=>{ const fl=box(.24,.36,1.3,paint,sx*(B.w/2+.1),B.wr+.28,sz*B.wb); fl.rotation.x=sz*.04; });
    [.34,-.34].forEach(x=>{ const v=box(.36,.04,.5,blackM,x,.93,.95); v.rotation.x=.12; });
    [1,-1].forEach(sx=>{ const c=box(.34,.03,.14,blackM,sx*(B.w/2-.05),B.headY-.18,B.front-.2,0,true); c.rotation.z=sx*.25; }); }
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
  if(cid==='overload'){ // quad-motor prototype: carbon aero, cyan fin edge and tail bar, NACA ducts, nose flaps, "3K" roof mark, cyan hub rings (in the wheel loop)
    const acc=new THREE.MeshBasicMaterial({color:def.accent,toneMapped:false});
    box(B.w*.96,.03,.34,carbonM,0,B.base,F-.1); strip(0,B.cw*.5,cb[0]+.15,cb[2]-.25,carbonM,6,roofY);
    const mark=new THREE.Mesh(new THREE.PlaneGeometry(.5,.25),decal(256,128,(c,w,h)=>{ c.fillStyle='#2fe6ff'; c.font='900 100px "Arial Narrow",Arial,sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('3K',w/2,h/2+6); }));
    mark.position.set(0,roofY(.2)+.02,.2); mark.rotation.x=-Math.PI/2; g.add(mark);
    const fe=box(.05,.02,1.5,acc,0,1.24,-1.6); fe.rotation.x=.22; // lit top edge on the dorsal fin
    box(B.w*.9,.03,.04,acc,0,B.tailY+.07,-Rr-.08);
    [1,-1].forEach(sd=>{ box(.03,.3,.04,acc,sd*B.w*.47,B.tailY-.06,-Rr-.06); box(.22,.012,.4,carbonM,sd*.34,deckY(1.5)+.008,1.5).rotation.x=-Math.atan2(deckY(1.7)-deckY(1.3),.4); });
    for(let i=0;i<3;i++) box(B.w*.6,.02,.1,carbonM,0,B.base+.16+i*.06,F-.02-i*.04).rotation.x=-.4;
  }
  if(def.wing){ const wy=B.wingY, wz=B.wingZ;
    if(B.swan||def.swanWing){ [.5,-.5].forEach(x=>{ const p=box(.06,.62,.14,blackM,x,wy-.25,wz+.12); p.rotation.x=.35; }); const w=box(2.1,.06,.55,blackM,0,wy,wz); w.rotation.x=-.12;
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
  if(!['noctis','bell','passyunk','zenkai'].includes(cid)) [1,-1].forEach(sd=>pipe(sd*.45,B.base+.22,-Rr-.02,.055)); // those carry their own center exits
  for(let i=0;i<5;i++) box(.025,.12,.4,trimM,-.5+i*.25,B.base+.02,-Rr+.12);
  if(!cut){ let yTop=9; for(let z=-B.wb;z<=B.wb;z+=.2) yTop=Math.min(yTop,deckY(z)); const y0=B.base+.14, y1=Math.min(yTop-.14,y0+.5); // flat flank
    flank=(sd,z)=>[[sd*(B.w/2+.146),y0],[sd*(B.w/2+.146),y1]]; }
  }
  streetStyle(g,def,B,cid,flank||((sd,z)=>[[sd*(B.w/2+.146),B.base+.14],[sd*(B.w/2+.146),B.base+.5]]));
  g.add(shadowPlane(B.w+1.05,(B.front+B.rear)*1.24));
  [[B.tr,B.wb],[-B.tr,B.wb],[B.tr,-B.wb],[-B.tr,-B.wb]].forEach(([x,z])=>{ const s=shadowPlane(.9,1.1); s.position.set(x,.025,z); g.add(s); }); // wheel contact shadows
  const rimM=def.bronze?bronzeM():new THREE.MeshStandardMaterial({color:def.rim,metalness:def.chrome?1:.8,roughness:def.chrome?.08:.3});
  const calM=new THREE.MeshStandardMaterial({color:def.caliper,roughness:.4,metalness:.2});
  const wheels=[], steers=[], wr=B.wr, sc=wr/.37;
  [[B.tr,B.wb],[-B.tr,B.wb],[B.tr,-B.wb],[-B.tr,-B.wb]].forEach(([x,z],i)=>{
    const holder=new THREE.Group(); holder.position.set(x,wr,z); g.add(holder);
    const spin=new THREE.Group(); spin.scale.setScalar(sc); holder.add(spin);
    const openTire=cid==='wisp'||cid==='autobahn'; // open-faced tire: the rotor and caliper show between the spokes
    const tire=new THREE.Mesh(openTire?wispTireGeo():TIRE_GEO,openTire?tireTreadM:[tireTreadM,tireSideM,tireSideM]); tire.rotation.z=Math.PI/2; spin.add(tire);
    if(cid==='wisp'){ // the lime sidewall from the reference, on the outer face of the tire
      const sx=Math.sign(x), band=new THREE.Mesh(WISP_BAND_GEO,WISP_LIME); band.rotation.y=Math.PI/2*sx; band.position.x=sx*.154; spin.add(band); }
    const side=Math.sign(x);
    const barrel=new THREE.Mesh(BARREL_GEO,barrelM); barrel.rotation.z=Math.PI/2; barrel.position.x=side*.05; spin.add(barrel);
    const rotor=new THREE.Mesh(ROTOR_GEO,[barrelM,rotorM,rotorM]); rotor.rotation.z=Math.PI/2; rotor.position.x=side*.02; spin.add(rotor);
    if(!['forged','six','wisp','abs','turbine'].includes((STREET[cid]||{}).wheel)){ const disc=new THREE.Mesh(new THREE.RingGeometry(.2,.27,28),rimM); disc.rotation.y=side*Math.PI/2; disc.position.x=side*.14; spin.add(disc); } // forged wheels are open between the spokes
    const lip=new THREE.Mesh(new THREE.TorusGeometry(.29,.025,6,28),def.rimLip?new THREE.MeshStandardMaterial({color:def.rimLip,roughness:.35,metalness:.3}):rimM); lip.rotation.y=Math.PI/2; lip.position.x=side*.155; spin.add(lip);
    wheelStyle(spin,side,(STREET[cid]||{}).wheel,rimM,def);
    if(def.lowPro) spin.children.forEach(o=>{ if(o!==tire&&o!==barrel&&o!==rotor){ o.scale.y*=1.2; o.scale.z*=1.2; } }); // bigger rim inside the same tire: thin sidewall
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.04,12),cid==='hikari'?rimM:calM);
    // hikari: gunmetal centre, the red is on the calipers
    hub.rotation.z=Math.PI/2; hub.position.x=side*.17; spin.add(hub);
    if(cid!=='wisp') for(let k=0;k<5;k++){ const a=k/5*Math.PI*2, nut=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.03,6),chromeTrimM); nut.rotation.z=Math.PI/2; nut.position.set(side*(cid==='hikari'?.184:.165),Math.cos(a)*.085,Math.sin(a)*.085); spin.add(nut); }
    if(cid==='autobahn'){ // big red monobloc caliper hugging the rotor at the trailing edge, as in the wheel reference
      const cg=WHEEL_GEO.wispCal||(WHEEL_GEO.wispCal=(()=>{ const sh=new THREE.Shape(); sh.absarc(0,0,.255,.55,1.45,false); sh.absarc(0,0,.175,1.45,.55,true);
        const g=new THREE.ExtrudeGeometry(sh,{depth:.06,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:3,curveSegments:16}); g.translate(0,0,-.03); g.rotateY(Math.PI/2); return g; })());
      const cal=new THREE.Mesh(cg,calM); cal.position.x=side*.07; cal.scale.setScalar(sc); holder.add(cal); }
    else if(cid==='wisp'){ // six-piston monobloc caliper: an arc hugging the rotor, lime with a black bridge, sat at the trailing edge
      const cg=WHEEL_GEO.wispCal||(WHEEL_GEO.wispCal=(()=>{ const sh=new THREE.Shape(); sh.absarc(0,0,.255,.55,1.45,false); sh.absarc(0,0,.175,1.45,.55,true);
        const g=new THREE.ExtrudeGeometry(sh,{depth:.06,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:3,curveSegments:16}); g.translate(0,0,-.03); g.rotateY(Math.PI/2); return g; })());
      const cal=new THREE.Mesh(cg,WISP_LIME); cal.position.x=side*.065; cal.scale.setScalar(sc); holder.add(cal); }
    else { const cal=new THREE.Mesh(new THREE.BoxGeometry(.07,.2,.18),calM); cal.position.set(side*.06,.14*sc,-.06); holder.add(cal); }
    if(cid==='split'){ const k=new THREE.Mesh(new THREE.BoxGeometry(.02,.16,.03),chromeTrimM); k.position.x=side*.19; spin.add(k); const h=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.03,8),chromeTrimM); h.rotation.z=Math.PI/2; h.position.x=side*.185; spin.add(h); } // knock-off spinner
    if(cid==='overload'){ const hr=new THREE.Mesh(new THREE.RingGeometry(.075,.1,24),new THREE.MeshBasicMaterial({color:def.accent,toneMapped:false,side:THREE.DoubleSide})); hr.rotation.y=side*Math.PI/2; hr.position.x=side*.19; spin.add(hr); } // lit motor ring
    const cam=(STREET[cid]||{}).camber; if(cam) holder.rotation.z=side*cam; // stance: tops of the wheels tucked in
    wheels.push(spin); if(i<2) steers.push(holder);
  });
  mergeByMaterial(g); wheels.forEach(w=>{ splitMulti(w); mergeByMaterial(w); }); // perf: tire/rotor material groups fold in with the rest of the wheel
  return {group:g,wheels,steers,paint,def};
}
// everyday traffic car: boxy, generic
const trafficBodyGeo=new THREE.BoxGeometry(1.86,.72,4.5), trafficCabGeo=new THREE.BoxGeometry(1.62,.58,2.3), trafficWheelGeo=new THREE.CylinderGeometry(.34,.34,.26,14);
const trafficGlassM=new THREE.MeshStandardMaterial({color:0x07090d,metalness:.9,roughness:.15});
let TRAFFIC_WHEELS_GEO=null;
function buildTrafficCar(color){
  const g=new THREE.Group();
  const m=new THREE.MeshStandardMaterial({color,metalness:.55,roughness:.35});
  const b=new THREE.Mesh(trafficBodyGeo,m); b.position.y=.62; g.add(b);
  const c=new THREE.Mesh(trafficCabGeo,trafficGlassM); c.position.set(0,1.26,-.25); g.add(c);
  const hl=new THREE.Mesh(new THREE.BoxGeometry(1.5,.12,.05),headM); hl.position.set(0,.72,2.26); g.add(hl);
  const tl=new THREE.Mesh(new THREE.BoxGeometry(1.6,.1,.05),tailM); tl.position.set(0,.8,-2.26); g.add(tl);
  [[.6,.75,2.3,0xdfe9ff,1.3],[-.6,.75,2.3,0xdfe9ff,1.3],[.62,.8,-2.32,0xff2030,.9],[-.62,.8,-2.32,0xff2030,.9]].forEach(a=>{ const s=glowSprite(a[3],a[4]); s.position.set(a[0],a[1],a[2]); g.add(s); });
  // perf: the four plain tires are one mesh (a spinning untextured cylinder looks the same standing still): 1 draw call, not 4
  if(!TRAFFIC_WHEELS_GEO) TRAFFIC_WHEELS_GEO=mergeGeos([[.9,1.45],[-.9,1.45],[.9,-1.45],[-.9,-1.45]].map(([x,z])=>trafficWheelGeo.clone().rotateZ(Math.PI/2).translate(x,.34,z)));
  g.add(new THREE.Mesh(TRAFFIC_WHEELS_GEO,tireM));
  g.add(shadowPlane(2.7,5.6)); rigLights(g,null,true);
  return {group:g,wheels:[]};
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
// raised pavement markers along the lane lines: tiny unlit studs that pick out the lanes at night. Keep their color
// under the bloom threshold: a sub-pixel stud feeding the bloom mips smears into dark blocks around it
const STUD_GEO=new THREE.BoxGeometry(.14,.04,.09), XAX=new THREE.Vector3(1,0,0);
function roadStuds(tr,S,offs,col,every){ const mat=new THREE.MeshBasicMaterial({color:col,toneMapped:false}), step=Math.max(1,Math.round((every||12)/tr.ds)), q=new THREE.Quaternion(), rv=new THREE.Vector3(), one=new THREE.Vector3(1,1,1), arr=[];
  for(let i=0;i<tr.N;i+=step){ const p=tr.pts[i], r=tr.R[i]; rv.set(r.x,0,r.z).normalize(); q.setFromUnitVectors(XAX,rv);
    offs.forEach(o=>arr.push(new THREE.Matrix4().compose(new THREE.Vector3(p.x+r.x*o,p.y+.035,p.z+r.z*o),q,one))); }
  return instAll(S,STUD_GEO,mat,arr); }

/* ---- Event 01: Harbor Line tunnel ---- */
/* ---- shared street dressing (threejs-geometry: InstancedMesh + setColorAt) ----
   parkedCars: [{x,z,ry}] -> instanced sedans in varied paint. streetFurniture: sidewalk line -> hydrants, cans, news boxes.
   sodiumLot: orange lot lights with ground pools. Each returns nothing; everything is added to S in a handful of draw calls. */
const PARK_COLS=[0x1a1c20,0xc9ced6,0x6a0f14,0x1c2e52,0x3a3d42,0xe8eaee,0x0f3a2a,0x5a4a32,0x8a8f96,0x2a2230];
function instPlace(S,geo,mat,list,colors){ if(!list.length) return null; const im=new THREE.InstancedMesh(geo,mat,list.length), m4=new THREE.Matrix4(), q=new THREE.Quaternion(), e=new THREE.Euler(), p=new THREE.Vector3(), sc=new THREE.Vector3();
  list.forEach((o,i)=>{ p.set(o.x,o.y||0,o.z); e.set(0,o.ry||0,0); q.setFromEuler(e); sc.set(o.s||1,o.sy||o.s||1,o.s||1); m4.compose(p,q,sc); im.setMatrixAt(i,m4); if(colors) im.setColorAt(i,new THREE.Color(colors[i])); });
  if(colors) im.instanceColor.needsUpdate=true; S.add(im); return im; }
function parkedCars(S,spots,seed){ const R=rng(seed||7), cols=spots.map(()=>PARK_COLS[R()*PARK_COLS.length|0]);
  if(kitParts('ParkSedan')&&kitParts('ParkSUV')){ const sed=[], suv=[], cs=[], cu=[];
    spots.forEach((o,i)=>{ const m=kitAt(o.x,o.z,o.ry||0); if(R()<.3){ suv.push(m); cu.push(cols[i]); } else { sed.push(m); cs.push(cols[i]); } });
    const LODP={far:160,keys:['CARPAINT','CARGLASS']}; kitInst(S,'ParkSedan',kitMats(),sed,cs,'CARPAINT',LODP); kitInst(S,'ParkSUV',kitMats(),suv,cu,'CARPAINT',LODP); return; }
  const body=new THREE.BoxGeometry(1.8,.62,4.4); body.translate(0,.62,0);
  const cab=new THREE.CylinderGeometry(.62,.8,.5,4,1); cab.rotateY(Math.PI/4); cab.scale(1.2,1,2.3); cab.translate(0,1.18,-.25);
  instPlace(S,body,new THREE.MeshStandardMaterial({color:0xffffff,metalness:.55,roughness:.32,envMapIntensity:1.1}),spots,cols);
  instPlace(S,cab,new THREE.MeshStandardMaterial({color:0x0a0d12,metalness:.8,roughness:.12}),spots);
  const wl=[]; spots.forEach(o=>{ const c=Math.cos(o.ry||0), sn=Math.sin(o.ry||0); [[-.86,1.4],[.86,1.4],[-.86,-1.4],[.86,-1.4]].forEach(([a,b])=>wl.push({x:o.x+a*c+b*sn,z:o.z-a*sn+b*c,y:.32,ry:o.ry})); });
  instPlace(S,new THREE.CylinderGeometry(.33,.33,.24,10).rotateZ(Math.PI/2),new THREE.MeshStandardMaterial({color:0x0b0b0c,roughness:.9}),wl);
  const tl=spots.map(o=>({x:o.x-Math.sin(o.ry||0)*2.21,z:o.z-Math.cos(o.ry||0)*2.21,y:.78,ry:o.ry}));
  instPlace(S,new THREE.BoxGeometry(1.5,.08,.03),new THREE.MeshBasicMaterial({color:0x5a0a10}),tl); }
function streetFurniture(S,x0,zA,zB,step,seed){ const R=rng(seed||3), hyd=[], cans=[], news=[];
  for(let z=zA;z<zB;z+=step){ const r=R(), o={x:x0+(R()-.5)*.6,z:z+(R()-.5)*step*.4,ry:R()*6};
    if(r<.35) hyd.push(o); else if(r<.75) cans.push(o); else news.push(o); }
  instPlace(S,new THREE.CylinderGeometry(.14,.18,.75,8).translate(0,.375,0),new THREE.MeshStandardMaterial({color:0xb8201c,roughness:.5,metalness:.2}),hyd);
  instPlace(S,new THREE.CylinderGeometry(.3,.26,.95,10).translate(0,.475,0),new THREE.MeshStandardMaterial({color:0x1d3a2a,roughness:.7,metalness:.3}),cans);
  instPlace(S,new THREE.BoxGeometry(.5,1.0,.45).translate(0,.5,0),new THREE.MeshStandardMaterial({color:0x2a4a8a,roughness:.5,metalness:.2}),news); }
function sodiumLot(S,spots){ instPlace(S,new THREE.CylinderGeometry(.1,.14,8,6).translate(0,4,0),new THREE.MeshStandardMaterial({color:0x2a2e35,metalness:.6,roughness:.5}),spots);
  instPlace(S,new THREE.BoxGeometry(.9,.2,.5),new THREE.MeshBasicMaterial({color:0xffb45a,toneMapped:false}),spots.map(o=>({x:o.x,z:o.z,y:8.05})));
  instPlace(S,new THREE.PlaneGeometry(18,18).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:poolTex,color:0xb06a28,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}),spots.map(o=>({x:o.x,z:o.z,y:.05})));
  const fp=[]; spots.forEach(o=>fp.push(o.x,7.9,o.z)); const fg=new THREE.BufferGeometry(); fg.setAttribute('position',new THREE.Float32BufferAttribute(fp,3));
  S.add(new THREE.Points(fg,new THREE.PointsMaterial({map:glowTex,color:0xffb45a,size:3,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}))); }
function buildTunnel(){
  /* Event 01, rebuilt as a real immersed-tube road tunnel. Borrowed from the vetted blender-skills (ideas only, no code):
     product-polish -> a key/fill/rim/bounce rig and no noisy normal maps on glossy surfaces (they read as dotty reflections);
     polyhaven-studio-setup -> light and reflect from an environment map (ENV.tunnel, baked from the tube's own strips);
     polyhaven-texture-apply -> full PBR sets on the big surfaces (glazed tile, painted concrete, ribbed soffit).
     Adapted to r128 with the threejs-lighting/materials/textures skills: canvas PBR maps, data maps left linear, instancing. */
  const ctrl=[[0,0,0],[0,0,-260],[60,6,-420],[220,10,-470],[380,6,-400],[430,0,-240],[360,-4,-80],[420,0,80],[380,6,240],[220,10,300],[60,4,260],[-40,0,140]].map(p=>new THREE.Vector3(p[0],p[1],p[2]));
  const curve=new THREE.CatmullRomCurve3(ctrl,true,'centripetal');
  const tr=makeTrack(curve.getSpacedPoints(1600).slice(0,1600),8,7.5);
  const W=tr.W,H=tr.H, WR=W+1.4, WL=W+.3; // walls: the service walkway on the +r side pushes that wall out
  const S=new THREE.Scene();
  S.fog=new THREE.FogExp2(0x1a2029,.0052); S.background=new THREE.Color(0x0b0e13); S.environment=ENV.tunnel;
  S.userData.bloom={strength:.74,radius:.5,threshold:.84}; S.userData.lens={streak:.3,ghost:.6,halo:.4,dirt:.5,th:.06}; // white-tiled tunnel: keep the lens quieter
  // four-point rig: soft cool key from the strips overhead, faint fill, a rim from behind the cars, warm bounce off the road
  S.add(new THREE.HemisphereLight(0xcfdcf0,0x2a2218,.62));
  const key=new THREE.DirectionalLight(0xe8f0ff,.55); key.position.set(0,1,.15); S.add(key);
  const rim=new THREE.DirectionalLight(0x9fc4ff,.35); rim.position.set(0,.4,-1); S.add(rim);
  const dataTex=(c,rx,ry)=>{ const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.anisotropy=8; t.repeat.set(rx||1,ry||1); return t; }; // linear: bump/roughness
  const colTex=(c,rx,ry)=>{ const t=CT(c,true); t.anisotropy=8; t.repeat.set(rx||1,ry||1); return t; };                                        // sRGB: albedo/emissive
  // ---- road: fresh asphalt, lane lines, no bump (product-polish: noisy normals on a glossy surface = dotty glints) ----
  // painted asphalt: aggregate, polished tire tracks in each lane, oil drips down the lane centres, patches, cracks,
  // expansion joints. The roughness map shares the UVs, so the tracks read glossy and mirror the strip lights.
  const RU=[.19,.5,.81], rr=rng(1101);
  const roadTex=CT(canvasTex(256,512,(g,w,h)=>{
    g.fillStyle='#1c1f24'; g.fillRect(0,0,w,h);
    for(let i=0;i<9000;i++){ const v=20+rr()*34; g.fillStyle=`rgba(${v},${v+2},${v+6},.55)`; g.fillRect(rr()*w,rr()*h,1.3,1.3); }
    RU.forEach(u=>{ [-.055,.055].forEach(o=>{ const x=w*(u+o); const gr=g.createLinearGradient(x-9,0,x+9,0); gr.addColorStop(0,'rgba(8,9,11,0)'); gr.addColorStop(.5,'rgba(8,9,11,.55)'); gr.addColorStop(1,'rgba(8,9,11,0)'); g.fillStyle=gr; g.fillRect(x-9,0,18,h); });
      for(let k=0;k<26;k++){ g.fillStyle=`rgba(4,5,6,${.25+rr()*.35})`; g.beginPath(); g.ellipse(w*u+(rr()-.5)*6,rr()*h,2+rr()*3,4+rr()*8,0,0,7); g.fill(); } }); // oil drips
    [[.04,.1,.28,.16],[.55,.52,.3,.1],[.2,.8,.2,.12]].forEach(([u,v,du,dv])=>{ g.fillStyle='rgba(38,41,46,.7)'; g.fillRect(w*u,h*v,w*du,h*dv); g.strokeStyle='rgba(10,11,13,.8)'; g.lineWidth=1.5; g.strokeRect(w*u,h*v,w*du,h*dv); }); // patch repairs
    g.strokeStyle='rgba(6,7,8,.7)'; g.lineWidth=1; for(let k=0;k<7;k++){ let x=rr()*w, y=rr()*h; g.beginPath(); g.moveTo(x,y); for(let j=0;j<6;j++){ x+=(rr()-.5)*14; y+=6+rr()*10; g.lineTo(x,y); } g.stroke(); } // cracks
    g.fillStyle='rgba(8,9,11,.85)'; g.fillRect(0,h*.5-1,w,3);                                                                   // expansion joint
    g.fillStyle='rgba(235,240,248,.88)'; g.fillRect(w*.035,0,4,h); g.fillRect(w*.965-4,0,4,h);
    g.fillStyle='rgba(235,240,248,.72)'; [.34,.66].forEach(u=>g.fillRect(w*u-2,0,4,h*.45)); }),true);
  const roadRough=dataTex(canvasTex(256,512,(g,w,h)=>{ g.fillStyle='#b4b4b4'; g.fillRect(0,0,w,h);
    for(let i=0;i<6000;i++){ const v=150+rr()*70|0; g.fillStyle=`rgb(${v},${v},${v})`; g.fillRect(rr()*w,rr()*h,1.3,1.3); }
    RU.forEach(u=>[-.055,.055].forEach(o=>{ const x=w*(u+o); const gr=g.createLinearGradient(x-10,0,x+10,0); gr.addColorStop(0,'rgba(40,40,40,0)'); gr.addColorStop(.5,'rgba(40,40,40,.85)'); gr.addColorStop(1,'rgba(40,40,40,0)'); g.fillStyle=gr; g.fillRect(x-10,0,20,h); }));
    g.fillStyle='#e0e0e0'; g.fillRect(w*.035,0,4,h); g.fillRect(w*.965-4,0,4,h); [.34,.66].forEach(u=>g.fillRect(w*u-2,0,4,h*.45)); }));
  ribbon(tr,S,-W-.3,W+.3,.01,.01,new THREE.MeshStandardMaterial({map:roadTex,roughnessMap:roadRough,roughness:.52,metalness:.22,envMapIntensity:1.3,color:0xa9aeb6,side:THREE.DoubleSide}),24); // damp: the strips smear across it
  // ---- walls: glazed white tile to 3.6 m with a harbor-blue band; painted concrete panels above; ribbed dark soffit ----
  // ribbon UVs: u runs up the wall (yA->yB), v along the tube every vScale meters
  const tileC=canvasTex(256,256,(g,w,h)=>{ g.fillStyle='#c4c9cf'; g.fillRect(0,0,w,h); const n=16, t=w/n;
    for(let i=0;i<n;i++) for(let j=0;j<n;j++){ const v=196+((i*37+j*53)%9); g.fillStyle=`rgb(${v},${v+3},${v+7})`; g.fillRect(i*t+1,j*t+1,t-2,t-2); }
    g.fillStyle='#1f5f8e'; g.fillRect(w*.24,0,t*1.2,h); g.fillStyle='#2a7ab0'; g.fillRect(w*.24+t*1.4,0,t*.35,h);                       // blue band, up the u axis
    g.fillStyle='rgba(80,70,60,.18)'; g.fillRect(0,0,t*1.4,h); });                                                                          // road grime at the foot
  const tileB=canvasTex(256,256,(g,w,h)=>{ g.fillStyle='#fff'; g.fillRect(0,0,w,h); g.fillStyle='#000'; const t=w/16; for(let i=0;i<=16;i++){ g.fillRect(i*t-1,0,2,h); g.fillRect(0,i*t-1,w,2); } });
  const tileM=new THREE.MeshStandardMaterial({map:colTex(tileC),bumpMap:dataTex(tileB),bumpScale:.018,roughness:.36,metalness:0,envMapIntensity:.85,side:THREE.DoubleSide});
  const panelC=canvasTex(256,256,(g,w,h)=>{ g.fillStyle='#4a525c'; g.fillRect(0,0,w,h);
    for(let i=0;i<900;i++){ const v=64+Math.random()*22; g.fillStyle=`rgba(${v},${v+6},${v+12},.35)`; g.fillRect(Math.random()*w,Math.random()*h,2,2); }
    g.fillStyle='#2a3038'; g.fillRect(0,0,w,3); g.fillRect(0,h/2-1,w,3);                                                                   // panel joints along the tube
    g.fillStyle='rgba(20,22,26,.35)'; for(let k=0;k<5;k++) g.fillRect(Math.random()*w*.2,Math.random()*h,w*.18,8); });
  const panelM=new THREE.MeshStandardMaterial({map:colTex(panelC),roughness:.85,metalness:.05,side:THREE.DoubleSide});
  const soffitC=canvasTex(256,256,(g,w,h)=>{ g.fillStyle='#15181d'; g.fillRect(0,0,w,h); g.fillStyle='#0b0d10'; for(let j=0;j<h;j+=32) g.fillRect(0,j,w,10);
    g.fillStyle='#262b33'; g.fillRect(w*.28,0,6,h); g.fillRect(w*.72-6,0,6,h); });                                                           // rib joints across, cable runs along
  const barrierM=new THREE.MeshStandardMaterial({color:0x2a2f36,roughness:.55,metalness:.3,side:THREE.DoubleSide});
  const curbTopM=new THREE.MeshStandardMaterial({color:0x6b7078,roughness:.9,side:THREE.DoubleSide});
  const railM=new THREE.MeshStandardMaterial({color:0xc9ced6,metalness:.85,roughness:.3,side:THREE.DoubleSide});
  const glowLine=c=>new THREE.MeshBasicMaterial({color:c,toneMapped:false,side:THREE.DoubleSide});
  [-1,1].forEach(sd=>{ const o=sd*(sd>0?WR:WL);
    ribbon(tr,S,o,o,0,.35,barrierM);                  // curb / plinth
    ribbon(tr,S,o,o,.35,3.6,tileM,3.3);               // glazed tile
    ribbon(tr,S,o,o,3.6,H,panelM,12);                 // painted panels
    ribbon(tr,S,sd*(o*sd-.02),sd*(o*sd-.02),3.58,3.66,glowLine(0x9fd0ff)); // wall-wash line at the tile cap
    ribbon(tr,S,sd*(o*sd-.35),sd*(o*sd-.02),H-1.05,H-1.05,barrierM);      // cable tray
  });
  // the service walkway: raised curb, walking surface, a handrail on the wall
  ribbon(tr,S,W+.3,W+.3,0,.3,curbTopM); ribbon(tr,S,W+.3,WR,.3,.3,curbTopM);
  ribbon(tr,S,WR-.08,WR-.08,1.02,1.08,railM);
  { const g=new THREE.MeshStandardMaterial({map:colTex(soffitC,1,1),roughness:.9,side:THREE.DoubleSide}); g.map.repeat.set(1,1); ribbon(tr,S,-WL,WR,H,H,g,8); }
  const f=mkF(), m4=new THREE.Matrix4(), q=new THREE.Quaternion(), sc=new THREE.Vector3(1,1,1), p=new THREE.Vector3(), basis=new THREE.Matrix4(), nr=new THREE.Vector3();
  // orientQ maps local +x to -r, so a wall plane on the -r wall faces +r with rotateY(-PI/2), and vice versa
  const place=(arr,s,x,y,scale)=>{ frame(s,f,tr); orientQ(f,q,basis,nr); p.copy(f.p).addScaledVector(f.r,x); p.y+=y; m4.compose(p,q,scale||sc); arr.push(m4.clone()); };
  const inst=(geo,mat,arr)=>{ if(!arr.length) return null; const im=new THREE.InstancedMesh(geo,mat,arr.length); arr.forEach((m,i)=>im.setMatrixAt(i,m)); S.add(im); return im; };
  // ---- continuous LED strips (the key light), with their streaks on the road ----
  const lightM=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false});
  const strips=[], st=[]; for(let s=0;s<tr.L;s+=13) [-3.4,3.4].forEach(x=>{ place(strips,s,x,H-.08); place(st,s,x,.04); });
  inst(new THREE.BoxGeometry(.4,.08,8),lightM,strips); lampStreaks(S,st,true);
  // ---- tunnel furniture ----
  const darkMetal=new THREE.MeshStandardMaterial({color:0x3a4048,metalness:.7,roughness:.4});
  const fans=[], fanRings=[]; for(let s=60;s<tr.L-40;s+=150) [-2.2,2.2].forEach(x=>{ place(fans,s,x,H-1.1); place(fanRings,s-1.7,x,H-1.1); place(fanRings,s+1.7,x,H-1.1); });
  inst(new THREE.CylinderGeometry(.62,.62,3.2,16).rotateX(Math.PI/2),darkMetal,fans);                        // jet fans, in pairs
  inst(new THREE.TorusGeometry(.64,.07,6,20),new THREE.MeshStandardMaterial({color:0x8a939e,metalness:.8,roughness:.3}),fanRings);
  // reflective road studs on the lane lines and edge lines, drain grates in both gutters, soot above the jet fans
  { const studs=[], amber=[], drains=[], soot=[], lane=u=>-W-.3+u*(2*W+.6);
    for(let s=0;s<tr.L;s+=12){ [.34,.66].forEach(u=>place(studs,s,lane(u),.03)); [.035,.965].forEach(u=>place(amber,s+6,lane(u)+(u<.5?.14:-.14),.03)); }
    for(let s=15;s<tr.L;s+=30) [-(W-.05),W+.05].forEach(x=>place(drains,s,x,.018));
    for(let s=60;s<tr.L-40;s+=150) [-1,1].forEach(sd=>place(soot,s,sd*(sd>0?WR-.04:WL-.04),H-2.2));
    inst(new THREE.BoxGeometry(.14,.035,.1),new THREE.MeshBasicMaterial({color:0xeaf4ff,toneMapped:false}),studs);
    inst(new THREE.BoxGeometry(.14,.035,.1),new THREE.MeshBasicMaterial({color:0xffb020,toneMapped:false}),amber);
    const grateT=CT(canvasTex(64,32,(g,w,h)=>{ g.fillStyle='#0b0c0e'; g.fillRect(0,0,w,h); g.fillStyle='#3a3f46'; for(let x=2;x<w;x+=6) g.fillRect(x,2,3,h-4); g.strokeStyle='#4a5058'; g.lineWidth=2; g.strokeRect(1,1,w-2,h-2); }));
    inst(new THREE.PlaneGeometry(.5,1.1).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({map:grateT,metalness:.6,roughness:.5}),drains);
    const sootT=CT(canvasTex(64,128,(g,w,h)=>{ const gr=g.createRadialGradient(w/2,h*.35,2,w/2,h*.45,h*.6); gr.addColorStop(0,'rgba(6,7,8,.7)'); gr.addColorStop(1,'rgba(6,7,8,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); }));
    inst(new THREE.PlaneGeometry(6,3.2).rotateY(Math.PI/2),new THREE.MeshBasicMaterial({map:sootT,transparent:true,depthWrite:false,side:THREE.DoubleSide}),soot); }
  const hangers=[]; for(let s=60;s<tr.L-40;s+=150) [-2.2,2.2].forEach(x=>place(hangers,s,x,H-.4)); inst(new THREE.BoxGeometry(.12,.7,.12),darkMetal,hangers);
  // lane-control signals over each lane: green arrows (the left lane shows a yellow merge arrow near the bends)
  const arrowT=(c,diag)=>CT(canvasTex(64,64,(g,w,h)=>{ g.fillStyle='#050607'; g.fillRect(0,0,w,h); g.strokeStyle=c; g.lineWidth=7; g.lineCap='round';
    g.beginPath(); if(diag){ g.moveTo(18,16); g.lineTo(46,46); g.moveTo(46,26); g.lineTo(46,46); g.lineTo(26,46); } else { g.moveTo(32,12); g.lineTo(32,50); g.moveTo(18,36); g.lineTo(32,50); g.lineTo(46,36); } g.stroke(); }));
  const sigBox=[], sigG=[], sigY=[], sigBeam=[];
  for(let s=110;s<tr.L-60;s+=230){ place(sigBeam,s,(WR-WL)/2,H-.9,new THREE.Vector3(1,1,1)); [-5.5,0,5.5].forEach((x,i)=>{ place(sigBox,s,x,H-1.55); place(i===0&&(Math.round(s/230)%2)?sigY:sigG,s-.18,x,H-1.55); }); }
  inst(new THREE.BoxGeometry(2*W+1.2,.25,.3),darkMetal,sigBeam); inst(new THREE.BoxGeometry(1,1,.3),darkMetal,sigBox);
  const sigGeo=new THREE.PlaneGeometry(.86,.86).rotateY(Math.PI); // faces oncoming traffic
  inst(sigGeo,new THREE.MeshBasicMaterial({map:arrowT('#35ff7a'),toneMapped:false}),sigG); inst(sigGeo,new THREE.MeshBasicMaterial({map:arrowT('#ffc21a',true),toneMapped:false}),sigY);
  // emergency exits on the left wall (green running-man boxes, door frames); SOS cabinets on the walkway side
  const exitT=CT(canvasTex(128,48,(g,w,h)=>{ g.fillStyle='#0a8a3a'; g.fillRect(0,0,w,h); g.fillStyle='#eafff0'; g.font='900 26px "Arial Narrow",Arial,sans-serif'; g.textBaseline='middle'; g.fillText('EXIT',44,25);
    g.lineWidth=4; g.strokeStyle='#eafff0'; g.lineCap='round'; g.beginPath(); g.arc(20,11,4,0,7); g.moveTo(20,16); g.lineTo(16,28); g.lineTo(24,40); g.moveTo(16,28); g.lineTo(8,38); g.moveTo(19,20); g.lineTo(28,24); g.moveTo(19,20); g.lineTo(10,22); g.stroke(); }));
  const sosT=CT(canvasTex(64,96,(g,w,h)=>{ g.fillStyle='#ff7a14'; g.fillRect(0,0,w,h); g.fillStyle='#1a0c02'; g.font='900 22px Arial,sans-serif'; g.textAlign='center'; g.fillText('SOS',w/2,30); g.fillRect(14,44,36,40); g.fillStyle='#ffd2a0'; g.fillRect(20,50,24,8); }));
  const doors=[], exitsS=[], sos=[];
  for(let s=90;s<tr.L-40;s+=180){ place(doors,s,-(WL-.05),1.25); place(exitsS,s,-(WL-.06),2.85); }
  for(let s=45;s<tr.L-20;s+=120) place(sos,s,WR-.06,1.3);
  inst(new THREE.PlaneGeometry(1.9,2.8).rotateY(-Math.PI/2),new THREE.MeshStandardMaterial({color:0x22262c,roughness:.6,metalness:.5}),doors.map(m=>m.clone().multiply(new THREE.Matrix4().makeTranslation(.03,.1,0)))); // frame, just behind the door (local +x is toward this wall)
  inst(new THREE.PlaneGeometry(1.5,2.5).rotateY(-Math.PI/2),new THREE.MeshStandardMaterial({color:0x173326,roughness:.5,metalness:.4,emissive:0x04140a}),doors);
  inst(new THREE.PlaneGeometry(1.3,.5).rotateY(-Math.PI/2),new THREE.MeshBasicMaterial({map:exitT,toneMapped:false}),exitsS);
  inst(new THREE.PlaneGeometry(.64,.96).rotateY(Math.PI/2),new THREE.MeshBasicMaterial({map:sosT,toneMapped:false}),sos);
  // distance markers every 100 m on the tile (upper right)
  const dm=[]; for(let s=100;s<tr.L;s+=100) dm.push(s);
  dm.forEach(s=>{ frame(s,f,tr); orientQ(f,q,basis,nr); const m=new THREE.Mesh(new THREE.PlaneGeometry(.9,.5),new THREE.MeshBasicMaterial({map:CT(signCanvas(String(s),{w:128,h:64,bg:'#101418',color:'#dfe8f2',size:40}))}));
    m.position.copy(f.p).addScaledVector(f.r,WR-.07); m.position.y+=2.6; m.quaternion.copy(q); m.rotateY(Math.PI/2); S.add(m); });
  // ---- atmosphere pass (threejs-materials/textures/postprocessing): wet road, light shafts, accent lines, dust ----
  { // standing water: mirror-dark alpha blobs just above the asphalt, so the strips and tail lights reflect in patches
    const blob=dataTex(canvasTex(128,128,(g,w,h)=>{ g.fillStyle='#000'; g.fillRect(0,0,w,h); const R=rng(77);
      for(let k=0;k<9;k++){ const x=w*(.25+R()*.5), y=h*(.25+R()*.5), r=w*(.12+R()*.2), gr=g.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,'#fff'); gr.addColorStop(.7,'#bbb'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); } }));
    blob.wrapS=blob.wrapT=THREE.ClampToEdgeWrapping; blob.repeat.set(1,1);
    const pud=[], R=rng(4242); for(let s=18;s<tr.L-10;s+=17+R()*20){ const w=2+R()*3.5; place(pud,s,(R()-.5)*2*(W-1.4),.022,new THREE.Vector3(w,1,w*(1.2+R()))); }
    inst(new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({color:0x06080b,roughness:.03,metalness:.55,envMapIntensity:2.4,alphaMap:blob,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}),pud); }
  { // light shafts: crossed, additive trapezoids under every strip, bright at the fitting and gone by the road
    const shaftT=colTex(canvasTex(64,128,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'rgba(215,232,255,.95)'); gr.addColorStop(.35,'rgba(170,200,240,.35)'); gr.addColorStop(1,'rgba(120,150,200,0)');
      g.fillStyle=gr; g.fillRect(0,0,w,h); g.globalCompositeOperation='destination-in'; const m=g.createLinearGradient(0,0,w,0); m.addColorStop(0,'rgba(0,0,0,0)'); m.addColorStop(.5,'#000'); m.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=m; g.fillRect(0,0,w,h); }));
    shaftT.wrapS=shaftT.wrapT=THREE.ClampToEdgeWrapping; shaftT.repeat.set(1,1);
    const sh=H-.5, geo=new THREE.PlaneGeometry(1,sh,1,1), P=geo.attributes.position; for(let i=0;i<P.count;i++){ const top=P.getY(i)>0; P.setX(i,P.getX(i)*(top?.5:3.2)); } // narrow at the lamp, wide on the road
    const cross=geo.clone().rotateY(Math.PI/2), both=[geo,cross], shafts=[];
    for(let s=0;s<tr.L;s+=13) [-3.4,3.4].forEach(x=>place(shafts,s,x,.3+sh/2));
    const shaftM=new THREE.MeshBasicMaterial({map:shaftT,transparent:true,opacity:.17,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:true});
    both.forEach(g=>{ const im=inst(g,shaftM,shafts); if(im) im.renderOrder=2; }); }
  // harbor-blue accent lines where the walls meet the soffit, and a low cyan curb line on the walkway
  [-1,1].forEach(sd=>{ const o=sd*(sd>0?WR:WL); ribbon(tr,S,sd*(o*sd-.03),sd*(o*sd-.03),H-.14,H-.06,glowLine(0x3a9cff)); });
  ribbon(tr,S,W+.31,W+.31,.2,.26,glowLine(0x48f0ff));
  { // dust motes hanging in the strip light
    const R=rng(909), pos=[]; for(let i=0;i<1800;i++){ frame(R()*tr.L,f,tr); const x=(R()-.5)*2*W, y=.6+R()*(H-1.2); pos.push(f.p.x+f.r.x*x,f.p.y+y,f.p.z+f.r.z*x); }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    S.add(new THREE.Points(g,new THREE.PointsMaterial({map:glowTex,color:0xbfd6ff,size:.14,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}))); }
  // ---- start gantry and grid ----
  frame(0,f,tr); orientQ(f,q,basis,nr);
  const gan=new THREE.Mesh(new THREE.BoxGeometry(2*W,.35,.35),new THREE.MeshBasicMaterial({color:0xff2a3a,toneMapped:false}));
  gan.position.copy(f.p); gan.position.y+=H-.6; gan.quaternion.copy(q); S.add(gan);
  addStartLine(S,f,q,2*W);
  return {scene:S,track:tr,traffic:[],cams:[],update:null,introCrane:true};
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
/* a leafy crown: three merged blobs, noisy radius, darker underside via vertex colors */
function leafyCrown(r,seed,det){ const R=rng(seed||3), parts=[[0,0,0,1],[.55,.25,.2,.7],[-.45,.3,-.25,.72],[.1,.55,-.4,.6]], pos=[], col=[], idx=[];
  const nrm=[]; parts.forEach(([ox,oy,oz,k])=>{ const g=new THREE.IcosahedronGeometry(r*k,det===undefined?2:det), p=g.attributes.position, base=pos.length/3;
    for(let i=0;i<p.count;i++){ const x=p.getX(i),y=p.getY(i),z=p.getZ(i), n=1+.14*Math.sin(x*3.1+z*2.3)*Math.cos(y*2.7), X=x*n+ox*r, Y=y*n*.82+oy*r, Z=z*n+oz*r; pos.push(X,Y,Z);
      const l=Math.hypot(x,y,z)||1; nrm.push(x/l,y/l,z/l); // radial normals: smooth shading across the non-indexed faces
      const sh=clamp(.55+.45*(Y/(r*1.3)),.35,1)*(.85+R()*.3); col.push(.55*sh,.8*sh,.5*sh); }
    const ix=g.index?g.index.array:[...Array(p.count).keys()]; for(let i=0;i<ix.length;i++) idx.push(base+ix[i]); g.dispose(); });
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setAttribute('color',new THREE.Float32BufferAttribute(col,3)); g.setAttribute('normal',new THREE.Float32BufferAttribute(nrm,3)); g.setIndex(idx); return g; }
/* ---- Roosevelt Blvd kit (Blender build, models/blvd_kit.glb): streetlight, guardrail, trees, guide sign ----
   Modeled in Blender from street photos of the Boulevard; each asset is an Empty with its parts parented.
   kitParts bakes each part into asset space once; kitInst lays an asset out as one InstancedMesh per part (threejs-geometry). */
const KIT_CACHE={};
function kitParts(name){ if(KIT_CACHE[name]!==undefined) return KIT_CACHE[name];
  const M=window.AH_MODELS||{}; let src=null, root=null; for(const k of ['blvd','mtairy','philly','calder']){ const r=M[k]&&M[k].getObjectByName(name); if(r){ src=M[k]; root=r; break; } } if(!root) return (null);
  src.updateMatrixWorld(true); const inv=new THREE.Matrix4().copy(root.matrixWorld).invert(), parts=[];
  root.traverse(o=>{ if(o.isMesh) parts.push({geo:o.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld)),key:(o.material&&o.material.name||'GALV').split('.')[0]}); });
  // perf: fold every part that shares a material slot into one geometry, so an asset costs one draw call per material
  // instead of one per Blender object (a gas station was ~150 draw calls, a parked car ~20)
  const byKey=new Map(); parts.forEach(p=>{ if(!byKey.has(p.key)) byKey.set(p.key,[]); byKey.get(p.key).push(p.geo); });
  const merged=[]; byKey.forEach((geos,key)=>merged.push({geo:geos.length>1?mergeGeos(geos):geos[0],key}));
  return (KIT_CACHE[name]=merged); }
/* Merge BufferGeometries into one indexed geometry (position/normal/uv, plus color when every part has it). */
function mergeGeos(geos){ let nv=0, ni=0; const hasC=geos.every(g=>g.attributes.color&&g.attributes.color.itemSize===3);
  geos.forEach(g=>{ if(!g.attributes.normal) g.computeVertexNormals(); const c=g.attributes.position.count; nv+=c; ni+=g.index?g.index.count:c; });
  const pos=new Float32Array(nv*3), nor=new Float32Array(nv*3), uv=new Float32Array(nv*2), col=hasC?new Float32Array(nv*3):null, idx=nv>65535?new Uint32Array(ni):new Uint16Array(ni);
  let v=0, k=0; const rd=(a,i,j)=>j===0?a.getX(i):j===1?a.getY(i):a.getZ(i);
  geos.forEach(g=>{ const P=g.attributes.position, N=g.attributes.normal, U=g.attributes.uv, C=g.attributes.color, c=P.count;
    for(let i=0;i<c;i++){ for(let j=0;j<3;j++){ pos[(v+i)*3+j]=rd(P,i,j); nor[(v+i)*3+j]=rd(N,i,j); if(col) col[(v+i)*3+j]=rd(C,i,j); } if(U){ uv[(v+i)*2]=U.getX(i); uv[(v+i)*2+1]=U.getY(i); } }
    if(g.index){ const I=g.index; for(let i=0;i<I.count;i++) idx[k++]=I.getX(i)+v; } else for(let i=0;i<c;i++) idx[k++]=i+v;
    v+=c; g.dispose(); });
  const out=new THREE.BufferGeometry(); out.setAttribute('position',new THREE.BufferAttribute(pos,3)); out.setAttribute('normal',new THREE.BufferAttribute(nor,3)); out.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  if(col) out.setAttribute('color',new THREE.BufferAttribute(col,3)); out.setIndex(new THREE.BufferAttribute(idx,1)); out.computeBoundingSphere(); return out; }
function kitInst(S,name,mats,list,colors,colorKey,lod){ const parts=kitParts(name); if(!parts||!list.length) return false;
  // perf: long layouts (parked cars, guardrail, trees) split into tiles so off-screen / fogged-out tiles are culled.
  // With `lod` ({far, keys}) each tile is a THREE.LOD: past `far` meters only the listed material parts are drawn
  // (a parked car keeps its body and glass; tires, trim and lenses drop out where they'd be a pixel or two anyway).
  const tiles=kitTiles(list,lod?80:220), v=new THREE.Vector3();
  const build=(ix,keys,parent)=>parts.forEach(p=>{ const m=mats[p.key]; if(!m||(keys&&!keys.includes(p.key))) return; const im=new THREE.InstancedMesh(p.geo,m,ix.length); ix.forEach((j,i)=>im.setMatrixAt(i,list[j]));
    if(colors&&p.key===colorKey){ const c=new THREE.Color(); ix.forEach((j,i)=>im.setColorAt(i,c.setHex(colors[j]))); im.instanceColor.needsUpdate=true; } parent.add(im); });
  tiles.forEach(ix=>{ if(!lod){ build(ix,null,S); return; }
    const ctr=new THREE.Vector3(); ix.forEach(j=>ctr.add(v.setFromMatrixPosition(list[j]))); ctr.divideScalar(ix.length);
    const L=new THREE.LOD(); L.position.copy(ctr); const near=new THREE.Group(), far=new THREE.Group(); near.position.copy(ctr).negate(); far.position.copy(near.position);
    build(ix,null,near); build(ix,lod.keys,far); L.addLevel(near,0); L.addLevel(far,lod.far); S.add(L); });
  return true; }
function kitTiles(list,T){ T=T||220; if(list.length<40) return [list.map((_,i)=>i)];
  const v=new THREE.Vector3(), cells=new Map(); list.forEach((m,i)=>{ v.setFromMatrixPosition(m); const k=Math.floor(v.x/T)+','+Math.floor(v.z/T); if(!cells.has(k)) cells.set(k,[]); cells.get(k).push(i); });
  return [...cells.values()]; }
/* ---- Philly Classic landmark kit (Blender build, models/philly_kit.glb): City Hall, the Art Museum, four Boathouse Row
   variants, a Ben Franklin Bridge tower. Material names from tools/blender/philly_kit.py map onto these (threejs-materials):
   warm uplit stone, slate mansards that pick up the env map, lit windows and LED lines that bloom (unlit, toneMapped off). */
let PK_MATS=null;
function phillyKitMats(){ if(PK_MATS) return PK_MATS; const D=THREE.DoubleSide, std=o=>new THREE.MeshStandardMaterial(Object.assign({side:D},o));
  return PK_MATS={STONE:upLit(std({color:0xcfc3a8,emissive:0x5a4428,emissiveIntensity:.16,roughness:.8}),{k:.42,h:22}),
    STONEHI:upLit(std({color:0xe6dabd,emissive:0x7a5a32,emissiveIntensity:.24,roughness:.7}),{k:.5,h:22}),
    GRANITE:std({color:0x4a4744,roughness:.9}), SLATE:std({color:0x1a2230,metalness:.45,roughness:.38,envMapIntensity:1.4}),
    WIN:new THREE.MeshBasicMaterial({color:0xffc88a,toneMapped:false,side:D}), GAP:std({color:0x050506,roughness:1}),
    BRONZE:std({color:0x5a3e22,emissive:0x2a1808,metalness:.8,roughness:.4}), GOLD:std({color:0xd8b04a,emissive:0x6a4a10,metalness:1,roughness:.3}),
    SAND:upLit(std({color:0xc9a26c,emissive:0x8a5a24,emissiveIntensity:.22,roughness:.65}),{k:.5,h:12}),
    ROOFBLUE:std({color:0x2d6488,emissive:0x0a1e2c,metalness:.3,roughness:.35,envMapIntensity:1.3}),
    LED:new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false,side:D}), WOOD:std({color:0x2a2c33,roughness:.85}),
    TRIM:std({color:0x8a8a86,roughness:.7}), STEEL:std({color:0x2f5d9e,emissive:0x0a1a33,emissiveIntensity:1,metalness:.6,roughness:.45})}; }
/* street-level uplight on facades (threejs-shaders via onBeforeCompile): a warm wash that falls off with height, and on
   Philly's Avenue of the Arts some blocks pick the magenta/violet architectural uplights instead (hashed per 38 m cell). */
const UP_DEF={k:.3,h:10,a:0xffa55a,b:0xc85aff,mix:0};
function upLit(mat,o){ o=Object.assign({},UP_DEF,o); const U={uUp:{value:o.k},uUpH:{value:o.h},uUpA:{value:new THREE.Color(o.a)},uUpB:{value:new THREE.Color(o.b)},uUpMix:{value:o.mix}};
  mat.userData.up=U;
  mat.onBeforeCompile=sh=>{ Object.assign(sh.uniforms,mat.userData.up);
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vUpW;').replace('#include <project_vertex>',
      '#include <project_vertex>\n{ vec4 wp=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nwp=instanceMatrix*wp;\n#endif\nvUpW=(modelMatrix*wp).xyz; }');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vUpW; uniform float uUp,uUpH,uUpMix; uniform vec3 uUpA,uUpB;').replace('#include <emissivemap_fragment>',
      '#include <emissivemap_fragment>\n{ float hU=fract(sin(dot(floor(vUpW.xz/38.0),vec2(12.9898,78.233)))*43758.5453); vec3 upC=mix(uUpA,uUpB,step(1.0-uUpMix,hU));\n  totalEmissiveRadiance+=upC*exp(-max(vUpW.y,0.0)/uUpH)*uUp*(0.25+diffuseColor.rgb*2.2); }'); };
  mat.customProgramCacheKey=()=>'upLit'; return mat; }
let KIT_MATS=null; // one shared material set for the Blender kits
function kitMats(){ if(KIT_MATS) return KIT_MATS;
  const lamp=new THREE.MeshBasicMaterial({color:0xfff1dc,toneMapped:false});
  return KIT_MATS={GALV:new THREE.MeshStandardMaterial({color:0x9aa1aa,metalness:.85,roughness:.36,envMapIntensity:1.2}),LAMP:lamp,
    DARK:new THREE.MeshStandardMaterial({color:0x0c0d0f,metalness:.4,roughness:.5}),CONCRETE:new THREE.MeshStandardMaterial({color:0x8e867a,roughness:.9}),
    BARK:new THREE.MeshStandardMaterial({color:0x2a2119,roughness:1}),LEAF:new THREE.MeshStandardMaterial({color:0x1f3d1f,roughness:.95,flatShading:true}),
    NEEDLE:new THREE.MeshStandardMaterial({color:0x13301d,roughness:.95,flatShading:true}),SIGNBACK:new THREE.MeshStandardMaterial({color:0x7c838c,metalness:.7,roughness:.4}),
    CARPAINT:new THREE.MeshStandardMaterial({color:0xffffff,metalness:.55,roughness:.3,envMapIntensity:1.2}),CARGLASS:new THREE.MeshStandardMaterial({color:0x07090c,metalness:.8,roughness:.08}),
    TYRE:new THREE.MeshStandardMaterial({color:0x0b0b0c,roughness:.9}),TRIM_DARK:new THREE.MeshStandardMaterial({color:0x101113,metalness:.3,roughness:.5}),
    LENSW:new THREE.MeshStandardMaterial({color:0xc8ccd2,metalness:.3,roughness:.15}),LENSR:new THREE.MeshStandardMaterial({color:0x5a0a0e,roughness:.3,emissive:0x2a0206}),
    STONE:new THREE.MeshStandardMaterial({color:0x6b6258,roughness:.95}),WHITE:new THREE.MeshStandardMaterial({color:0xdfe3e8,metalness:.1,roughness:.5}),
    PUMP:new THREE.MeshStandardMaterial({color:0x12151a,metalness:.4,roughness:.4}),SCREEN:new THREE.MeshBasicMaterial({color:0x8fd0ff,toneMapped:false}),
    BRICK:new THREE.MeshStandardMaterial({color:0x5a2a1e,roughness:.9}),STOREGLASS:new THREE.MeshBasicMaterial({color:0xffe6bf,toneMapped:false}),
    FASCIA:new THREE.MeshStandardMaterial({color:0x17181b,metalness:.2,roughness:.6}),PRECAST:new THREE.MeshStandardMaterial({color:0x9d9282,roughness:.85}),
    ENTRY:new THREE.MeshBasicMaterial({color:0xd8ecff,toneMapped:false}),ROOF:new THREE.MeshStandardMaterial({color:0x0b0b0d,roughness:1}),
    SCHIST:new THREE.MeshStandardMaterial({color:0x4a4841,roughness:.95}),BUFF:new THREE.MeshStandardMaterial({color:0x9c8566,roughness:.85}),
    LIMESTONE:new THREE.MeshStandardMaterial({color:0xa9a193,roughness:.8}),TRIM_LIGHT:new THREE.MeshStandardMaterial({color:0xd9d4c8,roughness:.6}),
    SLATE:new THREE.MeshStandardMaterial({color:0x22262d,metalness:.15,roughness:.6}),WOOD:new THREE.MeshStandardMaterial({color:0x3a2618,roughness:.8}),
    WINLIT:new THREE.MeshBasicMaterial({color:0xffc98a,toneMapped:false}),WINDARK:new THREE.MeshStandardMaterial({color:0x0a0d12,metalness:.6,roughness:.12}),
    AWNING:new THREE.MeshStandardMaterial({color:0xffffff,roughness:.85,side:THREE.DoubleSide})}; }
// yaw that turns a kit asset (facade on local +x) to face direction (dx,dz)
const kitYawTo=(dx,dz)=>Math.atan2(-dz,dx);
const kitAt=(x,z,ry,s)=>{ const m=new THREE.Matrix4().makeTranslation(x,0,z); if(ry) m.multiply(new THREE.Matrix4().makeRotationY(ry)); if(s) m.multiply(new THREE.Matrix4().makeScale(s,s,s)); return m; };
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
  S.fog=new THREE.FogExp2(0x1a1c26,0.0036); S.environment=ENV.street; addDome(S);
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
  const lotM=wetRoad(new THREE.MeshStandardMaterial({map:null,color:0x9aa0aa,roughness:.7,metalness:.05}));
  const concreteM=new THREE.MeshStandardMaterial({color:0x5b616b,roughness:.9});
  const curbM=new THREE.MeshStandardMaterial({color:0x4a4f57,roughness:.92});
  const grassT=CT(canvasTex(128,128,(g,w,h)=>{ g.fillStyle='#1b2a17'; g.fillRect(0,0,w,h);
    for(let i=0;i<5000;i++){ const v=Math.random(); g.fillStyle=v<.5?'rgba(40,62,30,.7)':v<.8?'rgba(22,36,18,.7)':'rgba(62,78,40,.55)'; g.fillRect(Math.random()*w,Math.random()*h,1,2+Math.random()*2); } }),true);
  grassT.repeat.set(1,1);
  const grassM=new THREE.MeshStandardMaterial({map:grassT,color:0x9aa890,roughness:1});
  const groundM=new THREE.MeshStandardMaterial({map:grassT,color:0x383e3a,roughness:1});
  const stallT=CT(canvasTex(256,256,(g,w,h)=>{ g.drawImage(asphaltTex.image,0,0,w,h); g.fillStyle='rgba(225,228,232,.75)';
    for(let y=0;y<h;y+=32) g.fillRect(0,y,52,3); for(let y=0;y<h;y+=32) g.fillRect(w-52,y,52,3); g.fillStyle='rgba(255,210,60,.6)'; g.fillRect(w/2-2,0,4,h); }),true);

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
  lotM.map=stallT; [-1,1].forEach(sd=>{ quad(sd*14,sd*35,ZMIN,ZMAX,0,asphaltM); quad(sd*35,sd*112,ZMIN,ZMAX,.004,lotM,16); quad(sd*112,sd*700,-1500,1500,-.02,groundM,6); });
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
  { const railM=new THREE.MeshStandardMaterial({color:0xaeb4bc,metalness:.85,roughness:.3}), postM=new THREE.MeshStandardMaterial({color:0x6a7078,metalness:.6,roughness:.5});
    const posts=[]; segsAll.forEach(([za,zb])=>{ [-1,1].forEach(sd=>{ box(.08,.3,za-zb-2,railM,sd*35.4,.62,(za+zb)/2);
      for(let z=za-2;z>zb+2;z-=4){ pv.set(sd*35.5,.35,z); m4.compose(pv,new THREE.Quaternion(),one); posts.push(m4.clone()); } }); });
    mkInst(new THREE.BoxGeometry(.12,.7,.12),postM,posts); }
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
  const galvM=new THREE.MeshStandardMaterial({color:0x9aa1aa,metalness:.85,roughness:.36,envMapIntensity:1.2});
  const KM={GALV:galvM,LAMP:lampM,DARK:new THREE.MeshStandardMaterial({color:0x0c0d0f,metalness:.4,roughness:.5}),CONCRETE:new THREE.MeshStandardMaterial({color:0x8e867a,roughness:.9}),
    BARK:new THREE.MeshStandardMaterial({color:0x2a2119,roughness:1}),LEAF:new THREE.MeshStandardMaterial({color:0x1f3d1f,roughness:.95,flatShading:true}),NEEDLE:new THREE.MeshStandardMaterial({color:0x13301d,roughness:.95,flatShading:true}),
    SIGNBACK:new THREE.MeshStandardMaterial({color:0x7c838c,metalness:.7,roughness:.4})};
  const kitLamps=poles.map(m=>m.clone().multiply(new THREE.Matrix4().makeTranslation(0,-5,0)));
  if(!kitInst(S,'LampTwin',KM,kitLamps)){ // procedural fallback
    mkInst(new THREE.CylinderGeometry(.14,.2,10,8),poleM,poles);
    mkInst(new THREE.BoxGeometry(7.6,.14,.2),poleM,arms);
    mkInst(new THREE.BoxGeometry(1.1,.22,.5),lampM,heads); }
  const poolGeo=new THREE.PlaneGeometry(16,16); poolGeo.rotateX(-Math.PI/2);
  // the Boulevard's twin-arm heads: a sodium/LED mix, each head's pool, cone and flare in its own color (light as art)
  const lampCol=lampColors(heads.length,.55,1915);
  lampPools(S,pools,lampCol,28);
  lampStreaks(S,pools); lampCones(S,heads,lampCol);
  lampFlares(S,flarePos,lampCol,3.4);

  // median trees
  const trunks=[], crowns=[];
  for(let z=ZMAX-29;z>ZMIN;z-=21){ if(inBand(z)) continue; [-1,1].forEach(sd=>{ const s=.8+R_()*.5;
    pv.set(sd*16.5,1.5,z); m4.compose(pv,new THREE.Quaternion(),one); trunks.push(m4.clone());
    pv.set(sd*16.5,4.3,z); m4.compose(pv,new THREE.Quaternion().setFromEuler(new THREE.Euler(R_(),R_()*3,0)),new THREE.Vector3(s*1.1,s,s*1.1)); crowns.push(m4.clone()); }); }
  if(kitParts('Conifer')&&kitParts('Broadleaf')){ // Blender trees: tall conifers and shade trees, as on the medians in the photos
    const con=[], brd=[]; trunks.forEach((t,i)=>{ const tz=new THREE.Vector3().setFromMatrixPosition(t).z, clash=Math.abs(((tz-(ZMAX-8))%42+42)%42)<5||Math.abs(((tz-(ZMAX-8))%42+42)%42)>37; // keep clear of the lamp poles
      const s=.75+R_()*.45, m=t.clone().multiply(new THREE.Matrix4().makeTranslation(0,-1.5,clash?10:0)).multiply(new THREE.Matrix4().makeRotationY(R_()*6.28)).multiply(new THREE.Matrix4().makeScale(s,s*(.9+R_()*.25),s));
      (i%3===1?brd:con).push(m); });
    kitInst(S,'Conifer',KM,con); kitInst(S,'Broadleaf',KM,brd); }
  else { mkInst(new THREE.CylinderGeometry(.16,.22,3,6),new THREE.MeshStandardMaterial({color:0x1d1813,roughness:1}),trunks);
    mkInst(leafyCrown(2.3,7),new THREE.MeshStandardMaterial({color:0x2a4a2c,roughness:.95,vertexColors:true}),crowns); }

  // street dressing: parked cars in the lots, sodium lot lights, sidewalk furniture, shrubs on the medians
  let PARK_SPOTS=[]; const GAS_Z=[];
  { const spots=[], lamps=[], shrubs=[];
    [-1,1].forEach(sd=>{ [40,46,52].forEach((x,row)=>{ for(let z=ZMIN+12;z<ZMAX-12;z+=2.9){ if(inBand(z)||R_()>.52) continue; spots.push({x:sd*x,z,ry:(row%2?0:Math.PI)+(R_()-.5)*.08}); } });
      for(let z=ZMIN+30;z<ZMAX;z+=64){ if(!inBand(z)) lamps.push({x:sd*49,z}); }
      streetFurniture(S,sd*34.3,ZMIN+10,ZMAX-10,11,sd>0?11:12);
      for(let z=ZMAX-18;z>ZMIN;z-=7){ if(inBand(z)) continue; shrubs.push({x:sd*(16.5+(R_()-.5)*2.4),z,y:.35,s:.5+R_()*.4,ry:R_()*6}); } });
    const joints=[], gut=[]; [-1,1].forEach(sd=>{ for(let z=ZMIN+2;z<ZMAX-2;z+=1.8){ if(inBand(z)) continue; joints.push({x:sd*33,z,y:.155}); } segsAll.forEach(([za,zb])=>gut.push({x:sd*31.05,z:(za+zb)/2,y:.02,sy:1,s:1,len:za-zb})); });
    instPlace(S,new THREE.BoxGeometry(3.9,.012,.05),new THREE.MeshStandardMaterial({color:0x26292e,roughness:1}),joints);
    gut.forEach(o=>box(.35,.03,o.len,new THREE.MeshStandardMaterial({color:0x121417,roughness:.6}),o.x,.02,o.z));
    PARK_SPOTS=spots; sodiumLot(S,lamps); // cars are placed after the buildings, so they can keep clear of the gas stations
    instPlace(S,new THREE.IcosahedronGeometry(1,0),new THREE.MeshStandardMaterial({color:0x1f3a22,roughness:1,flatShading:true}),shrubs); }

  // signs
  function faceRoad(mesh,sd){ mesh.rotation.y=-sd*Math.PI/2; return mesh; }
  { // Blender W-beam guardrail along the sidewalk edge, corrugated face to the road
    const gr=[]; segsAll.forEach(([za,zb])=>[-1,1].forEach(sd=>{ for(let z=za-2;z>zb+2;z-=4.04) gr.push(new THREE.Matrix4().makeTranslation(sd*35.3,0,z).multiply(new THREE.Matrix4().makeRotationY(sd>0?Math.PI:0))); }));
    kitInst(S,'Guardrail',KM,gr);
    // single-post green guide signs on the outer sidewalk, facing oncoming race traffic
    [[1,140,'Cottman Av','NEXT LEFT'],[1,-560,'US 1 North','Trenton'],[-1,-140,'Harbison Av','1/2 MILE'],[-1,560,'US 1 South','Center City']].forEach(([sd,z,l1,l2])=>{
      if(!kitParts('GuideSign')) return; const ft=CT(signCanvas2(l1,l2)); ft.flipY=false; const face=new THREE.MeshBasicMaterial({map:ft,toneMapped:false}); // glTF UV convention: no flipY
      kitInst(S,'GuideSign',Object.assign({},KM,{SIGN:face}),[new THREE.Matrix4().makeTranslation(sd*34.8,0,z).multiply(new THREE.Matrix4().makeRotationY(sd>0?0:Math.PI))]); }); }
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
    if(kitParts('StripBay')){ let z0=zc-L2/2, nb=shops;
      if(title&&kitParts('MallAnchor')){ // department-store anchor at the north end, as at the mall on Cottman
        kitInst(S,'MallAnchor',kitMats(),[kitAt(sd*72,zc+L2/2-32,sd>0?Math.PI:0)]);
        signPlane(title,22,1.8,sd*71.68,9.4,zc+L2/2-32,sd,{bg:'#101114',color:'#f4f7ff',size:60,border:false,glow:8}); nb=Math.max(0,Math.floor((L2-66)/10)); }
      const names=[], open=[], on=[], off=[]; for(let i=0;i<nb;i++){ names.push(STORES[R_()*STORES.length|0]); open.push(R_()<.75); (open[i]?on:off).push(kitAt(sd*69,z0+5+i*10,sd>0?Math.PI:0)); }
      const km=kitMats(); kitInst(S,'StripBay',km,on); kitInst(S,'StripBay',Object.assign({},km,{STOREGLASS:new THREE.MeshStandardMaterial({color:0x0b0e12,metalness:.6,roughness:.15}),LAMP:km.FASCIA}),off);
      if(nb){ const bw=nb*80, sc=canvasTex(bw,64,(g)=>{ g.fillStyle='#07080a'; g.fillRect(0,0,bw,64); g.textAlign='center'; g.textBaseline='middle';
          for(let i=0;i<nb;i++){ const c=SIGNCOL[(i+(R_()*6|0))%6]; g.font='800 30px "Arial Narrow",Arial,sans-serif'; g.shadowColor=c; g.shadowBlur=open[i]?12:0; g.fillStyle=open[i]?c:'#2a2a2a'; g.fillText(names[i],i*80+40,34,74); } });
        const sm=new THREE.Mesh(new THREE.PlaneGeometry(nb*10,1.1),new THREE.MeshBasicMaterial({map:CT(sc),toneMapped:false})); sm.position.set(sd*68.7,4.4,z0+nb*5); faceRoad(sm,sd); S.add(sm); }
      if(title&&!kitParts('MallAnchor')){ box(.5,9,.5,poleM,sd*37,4.5,zc+L2/2-4); signPlane(title,5.5,1.6,sd*37-sd*.3,9.4,zc+L2/2-4,sd,{bg:'#10141c',color:'#f4f7ff',size:52,border:true}); }
      lotLight(sd,zc-L2/4); lotLight(sd,zc+L2/4); return; }
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
  function lotLight(sd,z){ if(kitInst(S,'LotPole',kitMats(),[kitAt(sd*48,z,Math.PI/2)])){
      const p=new THREE.Mesh(poolGeo,new THREE.MeshBasicMaterial({map:poolTex,color:0x8a9cc0,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false})); p.scale.set(1.4,1,1.4); p.position.set(sd*48,.03,z); S.add(p);
      [-1.3,1.3].forEach(dz=>{ const fl=glowSprite(0xe6eeff,2.6); fl.position.set(sd*48,11.7,z+dz); S.add(fl); }); return; }
    box(.2,8,.2,poleM,sd*48,4,z); const h=box(1.4,.2,.6,lampM,sd*48,8,z); void h;
    const p=new THREE.Mesh(poolGeo,new THREE.MeshBasicMaterial({map:poolTex,color:0x7a8fb8,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false})); p.position.set(sd*48,.03,z); S.add(p);
    const fl=glowSprite(0xe6eeff,2.4); fl.position.set(sd*48,7.9,z); S.add(fl); }
  function gas(sd,zc){ const x=sd*56; GAS_Z.push([sd,zc]);
    if(kitInst(S,'GasStation',kitMats(),[kitAt(x,zc,sd>0?Math.PI:0)])){
      const pool=new THREE.Mesh(new THREE.PlaneGeometry(22,32),new THREE.MeshBasicMaterial({map:poolTex,color:0xdfe8ff,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false})); pool.rotation.x=-Math.PI/2; pool.position.set(x,.04,zc); S.add(pool);
      signPlane('BLVD FUEL  ·  MARKET',16,.85,sd*71.7,5.05,zc,sd,{bg:'#0b0e14',color:'#7dffcf',size:48,glow:10});
      box(.4,10,.4,poleM,sd*37,5,zc+13); signPlane('FUEL',3,1.6,sd*36.7,10.2,zc+13,sd,{bg:'#0b0e14',color:'#7dffcf',size:70,glow:14});
      signPlane('3.49  3.89  4.19',3,.7,sd*36.7,8.9,zc+13,sd,{bg:'#0b0e14',color:'#ffd23b',size:40}); return; }
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
      if(sd<0&&z<BAND_C[0]-4){ stripMall(sd,z-70,130,'ROOSEVELT MALL'); z-=150; continue; }
      if(t<.34) len=55+R_()*40; else if(t<.6) len=45+R_()*40; else if(t<.72) len=32; else if(t<.82) len=46; else if(t<.9) len=34; else len=22+R_()*20;
      if(z-len<nextBand){ len=z-nextBand; if(len<16){ z=nextBand-.01; continue; } }
      const zc=z-len/2;
      if(t<.34&&len>=28) rowhomes(sd,zc,len-4); else if(t<.6&&len>=30) stripMall(sd,zc,len-6); else if(t<.72&&len>=30) gas(sd,zc); else if(t<.82&&len>=44) dealer(sd,zc); else if(t<.9&&len>=32) diner(sd,zc); else emptyLot(sd,zc,len);
      z-=len+4; } });

  parkedCars(S,PARK_SPOTS.filter(o=>!GAS_Z.some(([sd,zc])=>Math.sign(o.x)===sd&&Math.abs(o.z-zc)<17)),41);

  // distant low skyline + scattered window lights
  const sky=[], winPts=[];
  for(let i=0;i<90;i++){ const sd=R_()<.5?-1:1, x=sd*(170+R_()*300), z=-1300+R_()*1500, h=6+R_()*16*(R_()<.08?4:1), w=14+R_()*30, d=14+R_()*30;
    pv.set(x,h/2,z); m4.compose(pv,new THREE.Quaternion(),new THREE.Vector3(w,h,d)); sky.push(m4.clone());
    for(let k=0;k<8;k++) winPts.push(x-sd*w/2*1.01,1+R_()*(h-2),z+(R_()-.5)*d); }
  { const winT=CT(canvasTex(64,64,(g,w,h)=>{ g.fillStyle='#000'; g.fillRect(0,0,w,h); for(let y=4;y<h;y+=12) for(let x=3;x<w;x+=10) if(Math.random()<.35){ g.fillStyle=Math.random()<.8?'#ffcf8a':'#cfe3ff'; g.fillRect(x,y,5,6); } }),true);
    winT.repeat.set(3,2); mkInst(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0x10131a,roughness:.95,emissive:0xffffff,emissiveMap:winT,emissiveIntensity:.55}),sky); }
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
/* building facades: one 512px tile = 32 m, so 16 bays of 2 m and 10 floors of 3.2 m. Color map carries masonry,
   sills, mullions and blinds; the emissive map lights about a third of the rooms with warm or cool interiors that fade
   toward the ceiling (threejs-textures: CanvasTexture color + emissive pair, RepeatWrapping). */
function facadeTex(style){
  const P={glass:{bg:'#0e1622',win:'#1c2a3e',lit:['#dfe9ff','#cfe0ff','#fff1d6'],p:.3,bays:16,fl:10},
           brick:{bg:'#43291f',win:'#161110',lit:['#ffd79a','#ffc57a','#ffe6bf'],p:.3,bays:12,fl:10},
           stone:{bg:'#554e44',win:'#171614',lit:['#ffe2b0','#fff1d6','#cfe0ff'],p:.28,bays:12,fl:10},
           hall:{bg:'#7a6b55',win:'#2a2218',lit:['#ffd89a','#ffe2b0','#ffcf85'],p:.8,bays:8,fl:8}}[style];
  const W=512, bw=W/P.bays, fh=W/P.fl, R=rng(style.length*97+13), cells=[];
  // light as art: rooms are not one color. Mostly warm tungsten/LED, some cool office fluorescents, the blue flicker of a
  // TV in a dark room; brightness varies a lot; office towers leave whole floors lit (cleaning crews, late shifts)
  const RV=rng(style.length*31+7), FLU='#e4f2ff', TV='#6f8fd8';
  for(let fl=0;fl<P.fl;fl++){ const floorLit=style==='glass'&&RV()<.1, floorTone=RV()<.5?FLU:P.lit[0];
    for(let b=0;b<P.bays;b++){ const on=R()<P.p*(fl%3===0?.7:1), col=P.lit[(R()*3)|0], blind=R()*.6, bright=.55+R()*.45, k=RV();
      if(floorLit) cells.push({on:RV()<.85,col:floorTone,blind:RV()*.15,bright:.5+RV()*.3});
      else cells.push({on,col:style==='hall'?col:k<.1?TV:k<.24?FLU:col,blind,bright:on&&k<.1?bright*.6:bright*(.75+RV()*.25)}); } }
  const draw=(g,em)=>{ g.fillStyle=em?'#000':P.bg; g.fillRect(0,0,W,W);
    if(!em&&style!=='glass'){ for(let i=0;i<2200;i++){ const v=R()*.12; g.fillStyle=`rgba(0,0,0,${v})`; g.fillRect(R()*W,R()*W,3,1.5); } } // masonry grain
    for(let fl=0;fl<P.fl;fl++) for(let b=0;b<P.bays;b++){ const c=cells[fl*P.bays+b], x=b*bw, y=fl*fh;
      const wx=style==='glass'?x+1.5:x+bw*.22, ww=style==='glass'?bw-3:bw*.56, wy=style==='glass'?y+3:y+fh*.2, wh=style==='glass'?fh-6:fh*.6;
      if(em){ if(!c.on) continue;
        const gr=g.createLinearGradient(0,wy,0,wy+wh); gr.addColorStop(0,c.col); gr.addColorStop(1,'rgba(0,0,0,0)');
        g.globalAlpha=c.bright; g.fillStyle=c.col; g.fillRect(wx,wy+wh*c.blind,ww,wh*(1-c.blind)); // lit room below a half-drawn blind
        g.globalAlpha=c.bright*.35; g.fillStyle=gr; g.fillRect(wx,wy,ww,wh*c.blind); g.globalAlpha=1; }
      else { g.fillStyle=c.on?(style==='glass'?'#2a3c54':'#231c16'):P.win; g.fillRect(wx,wy,ww,wh);
        g.fillStyle='rgba(255,255,255,.05)'; g.fillRect(wx,wy,ww,wh*.18); // sky reflection at the top of the pane
        if(c.on){ g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(wx,wy,ww,wh*c.blind); }
        if(style==='hall'){ g.fillStyle=P.bg; g.beginPath(); g.moveTo(wx,wy); g.lineTo(wx,wy+ww*.5); g.arc(wx+ww/2,wy+ww*.5,ww/2,Math.PI,0); g.lineTo(wx+ww,wy); g.fill(); }
        g.fillStyle=style==='glass'?'#0a0f16':'rgba(0,0,0,.55)'; g.fillRect(wx+ww/2-.8,wy,1.6,wh); // mullion
        if(style!=='glass'){ g.fillStyle='rgba(255,255,255,.1)'; g.fillRect(wx-2,wy+wh,ww+4,2.5); } } } // sill
    if(!em){ g.fillStyle=style==='glass'?'rgba(120,150,190,.12)':'rgba(0,0,0,.3)'; for(let fl=0;fl<P.fl;fl++) g.fillRect(0,fl*fh+fh-3,W,3); } // floor bands
  };
  const t=(em)=>CT(canvasTex(W,W,g=>draw(g,em)),true);
  return {map:t(false),emis:t(true)};
}
function signCanvas2(l1,l2,o){ o=o||{}; return canvasTex(512,160,(g,w,h)=>{ g.fillStyle=o.bg||'#0f5a32'; g.fillRect(0,0,w,h);
  g.strokeStyle=o.color||'#f4f7f2'; g.lineWidth=4; g.strokeRect(8,8,w-16,h-16); g.fillStyle=o.color||'#f4f7f2'; g.textAlign='center'; g.textBaseline='middle';
  g.font='800 58px "Arial Narrow",Arial,sans-serif'; g.fillText(l1,w/2,58,w*.9); g.font='700 36px "Arial Narrow",Arial,sans-serif'; g.fillText(l2,w/2,116,w*.9); }); }

// Harbor Line tunnel under the Delaware (Event 01): ramps down on the Philly side, back up in Camden
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
  tunnel:true, decoBridge:true, blvd:{xw:-80,xe:-20,z0:-1368,z1:-835}, steam:22};
const GAUNTLET_CFG={banner:'THE GAUNTLET',start:[40,20],
  corners:[[430,20,30],[430,-340,30],[-80,-340,30],[-80,20,30]],
  yAt:()=>0, zMin:-1600, ZS:ZS_BASE, jerseyMaxX:3000, noTraffic:true, arena:true,
  trackX:(x,zc)=>(x===-80&&zc>-340&&zc<20)||(x===430&&zc>-340&&zc<20),
  trackZ:(z,xc)=>(z===20&&xc>-80&&xc<430)||(z===-340&&xc>-80&&xc<430),
  skip:[], excl:[],
  gantries:[[120,-340,'THE GAUNTLET','12 IN · ONE OUT EVERY LAP'],[-80,-150,'THE GAUNTLET','DON\'T BE LAST']],
  roads:[{ew:1,c:20,dir:1,a:-80,b:430},{ew:1,c:-340,dir:-1,a:-80,b:430},{ew:0,c:-80,dir:1,a:-340,b:20},{ew:0,c:430,dir:-1,a:-340,b:20}],
  cams:[]};
/* Event 05: waterfront sprint around the container yard with a chicane notch (≈1.4 km). */
const DOCKSIDE_CFG={banner:'EVENT 05 · DOCKSIDE DASH',start:[160,-340],
  corners:[[340,-340,18],[340,-160,15],[250,-160,12],[250,-250,12],[160,-250,12],[160,-160,12],[-80,-160,15],[-80,-340,18]],
  yAt:()=>0, zMin:-520, ZS:ZS_BASE.slice(0,8), jerseyMaxX:520, noTraffic:true, dockside:true,
  trackX:(x,zc)=>(x===-80&&zc>-340&&zc<-160)||(x===340&&zc>-340&&zc<-160)||((x===160||x===250)&&zc>-250&&zc<-160),
  trackZ:(z,xc)=>(z===-340&&xc>-80&&xc<340)||(z===-160&&((xc>-80&&xc<160)||(xc>250&&xc<340)))||(z===-250&&xc>160&&xc<250),
  skip:[[70,340,-340,-250],[-260,520,-800,-340]], excl:[],
  gantries:[[250,-340,'DOCKSIDE DASH','CONTAINER YARD  →'],[-80,-250,'WATERFRONT','FULL THROTTLE']],
  roads:[{ew:1,c:-340,dir:1,a:-80,b:340},{ew:1,c:-160,dir:-1,a:-80,b:160},{ew:0,c:-80,dir:-1,a:-340,b:-160},{ew:0,c:340,dir:1,a:-340,b:-160}],
  cams:[[40,-160,0,1]]};
/* Event 06: Center City mix with a raised skyline straight (≈4 km). */
const SKYLINE_CFG={banner:'EVENT 06 · SKYLINE CIRCUIT',start:[40,20],
  corners:[[430,20,30],[430,-340,30],[-80,-340,30],[-80,470,30],[720,470,30],[720,20,30]],
  yAt:(x,z)=>{ const sm=(a,b,v)=>{ const t=clamp((v-a)/(b-a),0,1); return t*t*(3-2*t); }; return 12*sm(-40,130,x)*sm(250,420,z); }, /* ramps up South St and back down 6th St (was a 12 m step) */ zMin:-1600, ZS:ZS_BASE.concat([470,560]), jerseyMaxX:820, noTraffic:true, skyline:true,
  trackX:(x,zc)=>(x===-80&&zc>-340&&zc<470)||(x===430&&zc>-340&&zc<20)||(x===720&&zc>-340&&zc<470),
  trackZ:(z,xc)=>(z===20&&xc>-80&&xc<430)||(z===-340&&xc>-80&&xc<430)||(z===470&&xc>-80&&xc<720),
  skip:[], excl:[],
  gantries:[[430,-340,'SKYLINE CIRCUIT','ELEVATED RUN  ↑'],[720,470,'BROAD ST','HARD BRAKING']],
  roads:[{ew:1,c:20,dir:1,a:-80,b:430},{ew:1,c:-340,dir:-1,a:-80,b:430},{ew:1,c:470,dir:-1,a:-80,b:720},{ew:0,c:-80,dir:1,a:-340,b:470},{ew:0,c:430,dir:-1,a:-340,b:20},{ew:0,c:720,dir:1,a:-340,b:470}],
  cams:[[430,-340,0,-1],[720,470,0,1]]};
/* Event 07: one long lap — blvd, bridge, Camden, tunnel, 15th St (≈10.5 km). */
const MIDNIGHT_CFG={banner:'EVENT 07 · MIDNIGHT EXPRESS',start:[-20,-1950],
  corners:[[-20,-800,30],[720,-800,30],[720,-300,30],[2480,-300,30],[2480,470,30],[-80,470,30],[-80,-2300,30],[-20,-2300,30]],
  yAt:(x,z)=>z<-250&&z>-360&&x>760?bridgeY(x):(z>400?tunnelY(x):0), zMin:-2600, ZS:[-880,-800,...ZS_BASE,470,560,650], jerseyMaxX:1990,
  trackX:(x,zc)=>(x===-80&&zc>-880&&zc<470)||(x===720&&zc>-800&&zc<-250)||(x===2480&&zc>-300&&zc<470),
  trackZ:(z,xc)=>(z===-800&&xc>-20&&xc<720)||(z===470&&((xc>-80&&xc<820)||(xc>1960&&xc<2480))),
  skip:[[-80,70,-880,-800]], excl:[[800,1040,455,485],[1720,2000,455,485]], holes:[[815,885,462.6,477.4],[1895,1965,462.6,477.4]],
  gantries:[[860,-300,'MIDNIGHT EXPRESS','CAMDEN STRAIGHT  ↑'],[-20,-1000,'ROOSEVELT BLVD','US 1 SOUTH'],[2480,200,'HARBOR LINE TUNNEL','PHILADELPHIA  ←'],[-80,-1600,'ROOSEVELT BLVD','NORTHEAST PHILA  ↑']],
  roads:[{ew:1,c:-800,dir:1,a:-20,b:720},{ew:1,c:470,dir:-1,a:-80,b:820},{ew:0,c:-80,dir:-1,a:-800,b:470},{ew:0,c:720,dir:1,a:-800,b:-300}],
  cams:[[-20,-1050,1,0],[400,-800,0,1],[400,470,0,-1]],
  tunnel:true, decoBridge:true, blvd:{xw:-80,xe:-20,z0:-2268,z1:-835}, express:true};
/* Event 08: Philly landmark tour (≈8.8 km / lap). Roosevelt Blvd south, Kelly Drive past Boathouse Row, 6th St,
   the Ben Franklin Bridge, down past the stadium, back across the Delaware on the I-95 viaduct, then up Broad St past
   City Hall and the Art Museum steps to the Boulevard U-turn. */
function phViaductY(x){ const sm=(a,b)=>{ const t=clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); }; return 16*sm(90,360)*(1-sm(2140,2410)); }
const PHILLY_CFG={banner:'EVENT 08 · PHILLY CLASSIC',start:[-20,-1150],
  corners:[[-20,-700,35],[720,-700,35],[720,-300,35],[2480,-300,35],[2480,450,35],[-80,450,35],[-80,-1400,30],[-20,-1400,30]],
  yAt:(x,z)=>z<-250&&z>-360&&x>760?bridgeY(x):(z>400?phViaductY(x):0), zMin:-2400, ZS:[-880,-800,...ZS_BASE,450,560,650], jerseyMaxX:1990,
  trackX:(x,zc)=>(x===-80&&zc>-1400&&zc<450)||(x===720&&zc>-700&&zc<-250)||(x===2480&&zc>-300&&zc<450),
  trackZ:(z,xc)=>(z===-700&&xc>-20&&xc<720)||(z===450&&xc>-80&&xc<2480),
  skip:[[-80,70,-880,-700],[70,720,-800,-700],[-260,-80,-700,-430],[2300,2480,-70,290]], excl:[],
  gantries:[[-20,-1050,'ROOSEVELT BLVD','US 1 SOUTH · CENTER CITY'],[260,-700,'KELLY DRIVE','BOATHOUSE ROW  →'],[1300,-300,'BEN FRANKLIN BRIDGE','CAMDEN · DELAWARE  ↑'],
    [2480,-120,'SPORTS COMPLEX','SOUTH PHILLY  ↓'],[1900,450,'I-95 SOUTH','DELAWARE EXPRESSWAY'],[-80,260,'BROAD STREET','CITY HALL · LOVE PARK'],[-80,-440,'ART MUSEUM','ROCKY STEPS  ←'],[-80,-1250,'PHILLY CLASSIC','FULL GRID · ALL CARS']],
  roads:[{ew:1,c:-700,dir:1,a:-20,b:720},{ew:0,c:-80,dir:-1,a:-700,b:450},{ew:0,c:720,dir:1,a:-700,b:-300},{ew:0,c:2480,dir:1,a:-300,b:450}],
  cams:[[-20,-1150,1,0],[420,-700,0,1],[-80,150,-1,0],[2480,-200,1,0]],
  decoBridge:true, philly:true, blvd:{xw:-80,xe:-20,z0:-1368,z1:-735},
  // magazine look: blue-hour sky over a warm city glow, sodium streets, uplit facades with violet accents, a teal/amber grade and grain
  sky:[[0,'#03061a'],[.42,'#0b1838'],[.7,'#1d2a55'],[.86,'#4a3a62'],[1,'#8a4a4a']], fog:0x1d2440, fogD:.0021, sodium:true,
  uplight:{k:.6,h:7,mix:.24,a:0xffa15a,b:0xb45cff}, grade:{shadow:[.84,.97,1.22],high:[1.16,1.0,.83],sat:1.22,vig:.52,grain:.045},
  bloom:{strength:.9,radius:.55,threshold:.74}, fireworks:[[-50,92,-520],[330,95,-760],[1380,90,-120],[1900,92,420],[-80,98,120],[2480,92,40]]};
function installRoadHazards(tr,S,sNear,list,f,q,basis,nr,W){
  const add=(geo,mat,x,y,z)=>{ const m=new THREE.Mesh(geo,mat); m.position.set(x,y,z); S.add(m); return m; };
  const bumpTex=CT(canvasTex(128,32,(g,w,h)=>{ g.fillStyle='#3a3835'; g.fillRect(0,0,w,h); g.fillStyle='#ffd23b'; for(let i=0;i<6;i++) g.fillRect(i*22+4,10,12,12); }),true);
  const bumpM=new THREE.MeshStandardMaterial({map:bumpTex,roughness:.88,metalness:.05});
  const holeM=new THREE.MeshStandardMaterial({color:0x070708,roughness:1,metalness:0});
  const rimM=new THREE.MeshStandardMaterial({color:0x3a3d42,roughness:.95});
  const out=[];
  list.forEach((item,i)=>{ const x=item[0],z=item[1], lane=item[2]||0, type=item[3]||'bump', s=sNear(x,z), w=type==='bump'?3.4:2.6;
    out.push({id:i,s,x:lane,type,w,_cd:0});
    frame(s,f,tr); orientQ(f,q,basis,nr);
    if(type==='bump'){
      const strip=new THREE.Mesh(new THREE.BoxGeometry(W*1.15,.12,.62),bumpM);
      strip.position.copy(f.p).addScaledVector(f.r,lane); strip.position.y+=.06; strip.quaternion.copy(q); S.add(strip);
      const warn=add(new THREE.PlaneGeometry(1.1,.55),new THREE.MeshBasicMaterial({map:CT(signCanvas('BUMP',{bg:'#ffd23b',color:'#101114',size:52})),toneMapped:false}),f.p.x,f.p.y+2.2,f.p.z);
      warn.quaternion.copy(q); warn.rotateX(-Math.PI/2); warn.position.y+=.4;
    } else {
      const hole=new THREE.Mesh(new THREE.CylinderGeometry(.75,.85,.1,14),holeM);
      hole.position.copy(f.p).addScaledVector(f.r,lane); hole.position.y+=.03; S.add(hole);
      const rim=new THREE.Mesh(new THREE.TorusGeometry(.82,.08,8,20),rimM); rim.rotation.x=Math.PI/2; rim.position.copy(hole.position); rim.position.y+=.02; S.add(rim);
      const crack=add(new THREE.CircleGeometry(1.05,16),new THREE.MeshBasicMaterial({color:0x121316,transparent:true,opacity:.85}),hole.position.x,hole.position.y+.04,hole.position.z); crack.rotation.x=-Math.PI/2;
    } });
  return out;
}
function hazardCrossed(s0,s1,hs,w){
  const hw=(w||3)*.55;
  if(s1>=s0) return hs>=s0-hw&&hs<=s1+hw;
  return hs>=s0-hw||hs<=s1+hw;
}
function applyRoadHazard(r,h){
  const spd=r.v;
  if(h.type==='bump'){
    if(spd>14){ r.v*=clamp(1-.06*(spd/55), .86, .97); r.slip+=.05; r.bumpT=.2; if(r.isP&&spd>32){ shake=Math.max(shake,.35); sfx.hit(); } }
  } else {
    r.v*=clamp(.9-spd/500, .72, .88); r.vx+=(Math.random()-.5)*7; r.slip+=clamp(.12+spd/120,.12,.35); r.bumpT=-.16;
    if(r.isP){ shake=Math.max(shake,.65); sfx.hit(); toast(spd>40?'Pothole. Suspension didn\'t like that.':'Pothole. Watch the patched asphalt.'); }
  }
}
function checkRoadHazards(r,prevDist){
  if(mode!=='race'||!EV.roadHazards||!TR) return;
  const L=TR.L, s0=((prevDist%L)+L)%L, s1=((r.dist%L)+L)%L;
  for(const h of EV.roadHazards){
    if(h._cd>ghostT) continue;
    if(!hazardCrossed(s0,s1,h.s,h.w)) continue;
    if(Math.abs(r.x-(h.x||0))>2.9) continue;
    h._cd=ghostT+2.2;
    applyRoadHazard(r,h);
  }
}
/* ---- Events 11-14 mechanics: ice, Crowd Roar pads, El columns, the freight crossing, hills and air time.
   Every one is keyed off a field the event's builder returns, so the older events never touch them. ---- */
const AIR_G=20; // arcade gravity for air time: real g made the ridge jumps hang for two seconds
function trackS(d){ const L=TR.L; return ((d%L)+L)%L; }
function levelGrip(r){ let g=1; if(EV.surf){ const s=trackS(r.dist); for(const z of EV.surf) if(s>=z.s0&&s<=z.s1){ g=z.grip; break; } } return r.airT>.08?g*.06:g; } // a hop shorter than that is just the suspension
function levelPhysics(r,prevDist){
  const s0=trackS(prevDist), s1=trackS(r.dist);
  if(EV.pads) for(const p of EV.pads){ if(!hazardCrossed(s0,s1,p.s,2)||Math.abs(r.x-p.x)>p.hw||r.airT>0) continue; r.padCd=r.padCd||{}; if((r.padCd[p.s]||-1)>ghostT) continue; r.padCd[p.s]=ghostT+3;
    const br=bracketOf(r), kick=br==='chase'?11:(br==='pack'?8:6); r.v=Math.min(r.v+kick,Math.max(r.v,r.def.top*1.22)); r.nitro=Math.min(Math.max(1,r.nitro),r.nitro+.18); r.fxSling=Math.max(r.fxSling,.35);
    if(r.isP&&mode==='race'){ const T=padSport(p.team); toast(`${T.chant}! The grid pushes you on.`); flash(.12); burst(.9,'bandpass',520,900,.42,.6,0,pinkBuf); shake=Math.max(shake,.25); } }
  if(EV.surf&&r.isP&&mode==='race'&&levelGrip(r)<1&&!(r.airT>0)){ const s=trackS(r.dist), z=EV.surf.find(q=>s>=q.s0&&s<=q.s1)||EV.surf[0], key=Math.floor(r.dist/TR.L)+':'+(z.name||''); if(r.iceLap!==key){ r.iceLap=key; toast(z.msg||'Ice on the road. Easy on the wheel.'); } }
  if(EV.pillars) for(const c of EV.pillars){ if(!hazardCrossed(s0,s1,c.s,1.2)||Math.abs(r.x-c.x)>c.hw+.95||r.airT>0||(r.pillarS===c.s&&r.pillarT>ghostT)) continue;
    const sd=r.x>=c.x?1:-1, sh=r.fxShield>0&&r.shieldMode!=='rear'; r.pillarS=c.s; r.pillarT=ghostT+1; // one hit per column, then you're bounced clear
    r.x=c.x+sd*(c.hw+1.1); r.vx=sd*8; if(!sh){ r.v*=.6; if(r.isP) r.hits++; } r.slip+=.5;
    frame(r.dist,F2); tmpV.copy(F2.p).addScaledVector(F2.r,c.x); tmpV.y+=1; emitSparks(tmpV,F2.t,40,r.v*.3);
    if(r.isP&&mode==='race'){ shake=1.1; sfx.hit(); toast(sh?'Shield took the column.':'Hit an El column. Pick a side.'); } }
  if(EV.crossing&&mode==='race'){ const X=EV.crossing, st=X.state(), stop=X.s-3;
    if(r.waitX){ if(st.closed){ r.dist=r.waitD; r.v=0; r.vx*=.5; } else r.waitX=false; }
    else if(st.closed&&s0<=stop&&s1>=stop-40&&s1<X.s+2){ let line=stop; for(const w of racers) if(w!==r&&w.waitX&&Math.abs(w.x-r.x)<2.2) line=Math.min(line,trackS(w.waitD)-5.4);
      if(s1>=line&&s0<=line+.5){ r.dist-=s1-line; r.v=0; r.vx=0; r.waitX=true; r.waitD=r.dist;
        if(r.isP){ toast('Freight train. The gates are down, you wait.'); sfx.horn(); shake=.5; } } }
    else if(st.warn&&st.t>XING.warn+1.6&&s0<X.s&&s1>=X.s){ r.v*=.88; frame(r.dist,F2); tmpV.copy(F2.p).addScaledVector(F2.r,r.x); tmpV.y+=1.2; emitSparks(tmpV,F2.t,30,r.v*.25);
      if(r.isP){ toast('Ran the gates. That arm is going to leave a mark.'); r.hits++; shake=.6; sfx.hit(); } } }
}
// Manayunk: follow the road until it drops away faster than gravity can pull you down, then fly until you land
function airStep(r,dt){
  const gy=frame(r.dist,F2).p.y;
  if(r.hy===undefined||!(dt>0)){ r.hy=gy; r.vy=0; r.airT=0; return; }
  if(r.airT>0){ r.vy-=AIR_G*dt; r.hy+=r.vy*dt; r.airT+=dt;
    if(r.hy<=gy){ const hard=-r.vy, t=r.airT; r.hy=gy; r.vy=0; r.airT=0;
      if(t>.25){ r.slip+=.35; r.bumpT=.16; r.vx*=.6; if(hard>9) r.v*=.94;
        tmpV.copy(F2.p).addScaledVector(F2.r,r.x); emitSparks(tmpV,F2.t,18,r.v*.2);
        if(t>.5) r.nitro=Math.min(Math.max(1,r.nitro),r.nitro+Math.min(.35,t*.2));
        if(r.isP&&mode==='race'){ shake=Math.max(shake,.4+Math.min(.6,hard/20)); sfx.hit(); if(t>.5) toast(`${t.toFixed(1)}s of air. Boost for sticking the landing.`); } } } }
  else { const vg=(gy-r.hy)/dt; if(vg<r.vy-AIR_G*dt*1.2&&r.v>18){ r.airT=1e-4; r.hy+=r.vy*dt; } else { r.vy=vg; r.hy=gy; } }
}
// what the AI does about the columns, the gates and the pads
function levelAI(r,tx){ const L=TR.L, s=trackS(r.dist); let vCap;
  if(EV.pads&&r.mood&&r.mood.mood!=='lead') for(const p of EV.pads){ let d=p.s-s; if(d<0) d+=L; if(d>8&&d<70&&Math.abs(p.x-r.x)<2.6){ tx=lerp(tx,p.x,.6); break; } } // only the pad in your own lane
  if(EV.pillars) for(const c of EV.pillars){ let d=c.s-s; if(d<-L/2) d+=L; if(d<-2||d>60) continue;
    // under the El you stay on your side of the columns: no crossing over between posts
    const sd=Math.abs(r.x-c.x)>.4?Math.sign(r.x-c.x):(r.off>=0?1:-1);
    if(Math.sign(tx-c.x)!==sd||Math.abs(tx-c.x)<c.hw+2.3) tx=c.x+sd*Math.max(c.hw+2.7,Math.abs(tx-c.x)); break; }
  if(EV.crossing){ const X=EV.crossing, st=X.state(), d=X.s-3-s; if(d>0&&d<240){ const tArr=d/Math.max(r.v,6), bold=(r.mood&&r.mood.mood==='allin')||r.def.id==='wild', tA=(st.t+tArr)%XING.cyc;
    if(st.closed||(tA>=XING.close-(bold?0:1)&&tA<XING.open)) vCap=Math.sqrt(Math.max(0,2*26*(d-1))); } }
  return {tx,vCap}; }
function holdTraffic(o){ const X=EV.crossing, st=X.state(), d=X.s-7-trackS(o.dist); o.v0=o.v0||o.v;
  o.v=(st.closed||st.warn)&&d>-1&&d<30?Math.max(0,Math.min(o.v0,d*.7)):o.v0; }
function buildKnockout(){ return buildCity(GAUNTLET_CFG); }
function buildDockside(){ return buildCity(DOCKSIDE_CFG); }
function buildSkyline(){ return buildCity(SKYLINE_CFG); }
function buildMidnight(){ return buildCity(MIDNIGHT_CFG); }
function buildBridge(){ return buildCity(BRIDGE_CFG); }
function buildGrand(){ return buildCity(GRAND_CFG); }
function buildPhiladelphia(){ return buildCity(PHILLY_CFG); }
function buildCity(C){
  const V=(x,z)=>new THREE.Vector2(x,z);
  const path=filletPath(V(C.start[0],C.start[1]),C.corners.map(([x,z,r])=>[V(x,z),r]),1);
  const tr=makeTrack(resample3(path,C.yAt),7,6);
  const W=tr.W, R_=rng(1776);
  const sNear=(x,z)=>{ let bi=0,bd=1e18; for(let k=0;k<tr.N;k++){ const p=tr.pts[k], d=(p.x-x)*(p.x-x)+(p.z-z)*(p.z-z); if(d<bd){ bd=d; bi=k; } } return bi*tr.ds; };
  const S=new THREE.Scene();
  S.userData.bloom={strength:.9,radius:.5,threshold:.72};
  const SKY=C.sky||[[0,'#02040a'],[.5,'#0a1224'],[.78,'#1e2336'],[1,'#3a2c2c']];
  S.background=CT(canvasTex(8,256,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); SKY.forEach(([t,c])=>gr.addColorStop(t,c)); g.fillStyle=gr; g.fillRect(0,0,w,h); }));
  S.fog=new THREE.FogExp2(C.fog||0x151b2b,C.fogD||0.0024); if(C.grade) S.userData.grade=C.grade; if(C.bloom) S.userData.bloom=C.bloom; S.environment=ENV.street; addDome(S);
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
  const waterN=WETMAPS.normal.clone(); waterN.needsUpdate=true; waterN.repeat.set(60,120); // ripples: the wet-asphalt normal field, tiled small and scrolled (EXTRA below)
  flat(BR.river[0],BR.river[1],C.zMin,1400,-6,new THREE.MeshStandardMaterial({color:0x04080d,metalness:.9,roughness:.12,normalMap:waterN,normalScale:new THREE.Vector2(.5,.5),envMapIntensity:1.4}));
  const bankM=new THREE.MeshStandardMaterial({color:0x2a2d33,roughness:.95,side:THREE.DoubleSide});
  [BR.river[0],BR.river[1]].forEach(x=>{ const g=new THREE.PlaneGeometry(1400-C.zMin,6); g.rotateY(Math.PI/2); mesh(g,bankM,x,-3,(1400+C.zMin)/2); });

  // ---- road: asphalt with lane lines, curbs, sidewalks ----
  const roadTex=CT(canvasTex(256,512,(g,w,h)=>{ g.fillStyle='#16181c'; g.fillRect(0,0,w,h);
    for(let i=0;i<6000;i++){ const v=18+Math.random()*28; g.fillStyle=`rgba(${v},${v+2},${v+6},.65)`; g.fillRect(Math.random()*w,Math.random()*h,1.6,1.6); }
    g.fillStyle='rgba(232,234,238,.85)'; g.fillRect(w*.03,0,4,h); g.fillRect(w*.97-4,0,4,h);
    g.fillStyle='rgba(232,234,238,.75)'; [.34,.66].forEach(u=>g.fillRect(w*u-2,0,4,h*.4));
    [.19,.5,.81].forEach(u=>[-.055,.055].forEach(o=>{ const x=w*(u+o), gr=g.createLinearGradient(x-9,0,x+9,0); gr.addColorStop(0,'rgba(6,7,9,0)'); gr.addColorStop(.5,'rgba(6,7,9,.5)'); gr.addColorStop(1,'rgba(6,7,9,0)'); g.fillStyle=gr; g.fillRect(x-9,0,18,h); })); // tire tracks
    [[.06,.12,.3,.14],[.56,.6,.26,.1]].forEach(([u,v,du,dv])=>{ g.fillStyle='rgba(36,39,44,.75)'; g.fillRect(w*u,h*v,w*du,h*dv); g.strokeStyle='rgba(8,9,11,.85)'; g.lineWidth=1.5; g.strokeRect(w*u,h*v,w*du,h*dv); }); // patches
    [[.5,.35],[.19,.82]].forEach(([u,v])=>{ g.fillStyle='#0c0d10'; g.beginPath(); g.arc(w*u,h*v,11,0,7); g.fill(); g.strokeStyle='#3a3e45'; g.lineWidth=2; g.stroke(); g.strokeStyle='#23262b'; g.lineWidth=1; for(let k=-8;k<=8;k+=4){ g.beginPath(); g.moveTo(w*u-8,h*v+k); g.lineTo(w*u+8,h*v+k); g.stroke(); } }); // manhole covers
    g.fillStyle='rgba(0,0,0,.14)'; for(let i=0;i<5;i++) g.fillRect(w*(.18+i*.15),0,12,h); }),true);
  const roadMat=wetRoad(new THREE.MeshStandardMaterial({map:roadTex,roughness:.45,metalness:.15,side:THREE.DoubleSide}));
  ribbon(tr,S,-W-.3,W+.3,.01,.01,roadMat,24);
  roadStuds(tr,S,[.34,.66].map(u=>-W-.3+(2*W+.6)*u),0x9098a4,9);
  // sidewalks: 1.4 m concrete slabs with joints, a strip of brick pavers at the curb, weathering; granite curb
  const walkT=CT(canvasTex(128,256,(g,w,h)=>{ g.fillStyle='#4a4d54'; g.fillRect(0,0,w,h); const R=rng(71);
    for(let i=0;i<2600;i++){ const v=60+R()*30|0; g.fillStyle=`rgba(${v},${v+2},${v+6},.45)`; g.fillRect(R()*w,R()*h,1.5,1.5); }
    g.fillStyle='#3a2a24'; g.fillRect(0,0,w*.16,h); g.fillStyle='#24190f'; for(let y=0;y<h;y+=10){ g.fillRect(0,y,w*.16,1.5); g.fillRect(((y/10)%2)*w*.08,y,1.5,10); }
    g.fillStyle='#2a2c31'; for(let y=0;y<h;y+=h/4) g.fillRect(w*.16,y,w,2); g.fillRect(w*.58,0,2,h);
    for(let k=0;k<6;k++){ g.fillStyle=`rgba(20,22,26,${.2+R()*.2})`; g.beginPath(); g.ellipse(w*(.3+R()*.6),R()*h,6+R()*14,4+R()*10,0,0,7); g.fill(); } }),true);
  const walkM=new THREE.MeshStandardMaterial({map:walkT,roughness:.92,side:THREE.DoubleSide}), curbM=new THREE.MeshStandardMaterial({color:0x5e636b,roughness:.8,metalness:.05,side:THREE.DoubleSide});
  [-1,1].forEach(sd=>{ ribbon(tr,S,sd*(W+.3),sd*(W+4.5),.16,.16,walkM,5.6); ribbon(tr,S,sd*(W+.3),sd*(W+.3),0,.16,curbM); });
  // street furniture along both sidewalks, facing the road
  { const hyd=[], cans=[], news=[], R=rng(1777), step=Math.max(1,Math.round(17/tr.ds));
    for(let i=0;i<tr.N;i+=step){ const p=tr.pts[i], r=tr.R[i], sd=i%(2*step)?1:-1, off=sd*(W+3.9+R()*.3), o={x:p.x+r.x*off,y:p.y+.16,z:p.z+r.z*off,ry:Math.atan2(r.x,r.z)};
      if(Math.abs(p.y)>1.5) continue; const k=R(); (k<.3?hyd:k<.75?cans:news).push(o); }
    instPlace(S,new THREE.CylinderGeometry(.14,.18,.75,8).translate(0,.375,0),new THREE.MeshStandardMaterial({color:0xb8201c,roughness:.5,metalness:.2}),hyd);
    instPlace(S,new THREE.CylinderGeometry(.3,.26,.95,10).translate(0,.475,0),new THREE.MeshStandardMaterial({color:0x1d3a2a,roughness:.7,metalness:.3}),cans);
    instPlace(S,new THREE.BoxGeometry(.5,1.0,.45).translate(0,.5,0),new THREE.MeshStandardMaterial({color:0x2a4a8a,roughness:.5,metalness:.2}),news); }
  const addStart=()=>{ frame(0,f,tr); orientQ(f,q,basis,nr); addStartLine(S,f,q,2*W);
    const red=new THREE.MeshBasicMaterial({color:0xff2a3a,toneMapped:false});
    [-1,1].forEach(sd=>{ const p=f.p.clone().addScaledVector(f.r,sd*(W+1.6)); boxM(.5,8.4,.5,blackM,p.x,4.2,p.z); });
    const beam=boxM(2*W+3.6,.5,.5,red,f.p.x,8.4,f.p.z); beam.quaternion.copy(q);
    const ban=new THREE.Mesh(new THREE.PlaneGeometry(10,1.4),new THREE.MeshBasicMaterial({map:CT(signCanvas('AFTERHOURS  ·  '+C.banner,{bg:'#07080a',color:'#f4f7ff',size:50})),toneMapped:false}));
    ban.position.set(f.p.x,7.2,f.p.z); ban.quaternion.copy(q); ban.rotateY(Math.PI); S.add(ban); };
  addStart();

  // ---- city blocks, merged into a few draw calls ----
  const UPL=Object.assign({},UP_DEF,C.uplight||{});
  const FAC={}; ['glass','brick','stone','hall'].forEach(k=>{ const t=facadeTex(k); FAC[k]={mat:upLit(new THREE.MeshStandardMaterial({map:t.map,emissive:0xffffff,emissiveMap:t.emis,emissiveIntensity:k==='hall'?1.0:.85,roughness:k==='glass'?.35:.85,metalness:k==='glass'?.5:.05}),k==='glass'?Object.assign({},UPL,{k:UPL.k*.5}):UPL),pos:[],nor:[],uv:[]}; });
  const trims=[]; // cornices and string courses: silhouette and a ledge that catches the street light
  const skyMat=FAC.glass.mat.clone(); skyMat.fog=false; FAC.sky={mat:skyMat,pos:[],nor:[],uv:[]};
  FAC.roof={mat:new THREE.MeshStandardMaterial({color:0x0b0c0f,roughness:1}),pos:[],nor:[],uv:[]};
  // storefronts, four kinds stacked in one atlas (light as art): 0 a warm deli, 1 a cold-white pharmacy/convenience store,
  // 2 closed for the night behind a roll-down grille with light leaking through the slats, 3 a dim amber tavern with a
  // red neon script in the window. Each row is one 128 px band; storefront() picks a band per shop.
  const storeRow=(g,em,kind)=>{ g.fillStyle=em?'#000':'#17181c'; g.fillRect(0,0,512,128);
    const C=[['#ffe7c2','#6a5a48','#dfeaff'],['#f2f8ff','#9aa8b8','#eaf4ff'],null,['#ffae5a','#5a2a10','#ffb870']][kind];
    [[12,210],[290,210]].forEach(([x,w],i)=>{ const y=30, h=88;
      if(kind===2){ // roll-down security grille
        if(em){ g.fillStyle='rgba(255,214,150,.22)'; for(let k=0;k<h;k+=6) g.fillRect(x+2,y+k,w-4,1.4); }
        else { g.fillStyle='#4a4d52'; g.fillRect(x,y,w,h); g.fillStyle='#2c2e32'; for(let k=0;k<h;k+=6) g.fillRect(x,y+k,w,2); g.fillStyle='#7a5a20'; g.fillRect(x+w/2-6,y+h-8,12,6); }
        return; }
      if(em){ const gr=g.createLinearGradient(0,y,0,y+h); gr.addColorStop(0,i?C[2]:C[0]); gr.addColorStop(1,C[1]); g.fillStyle=gr; g.globalAlpha=kind===3?.7:1; g.fillRect(x,y,w,h); g.globalAlpha=1;
        g.fillStyle='rgba(0,0,0,.55)'; for(let k=0;k<3;k++) g.fillRect(x+8,y+30+k*18,w-16,4); // shelves / bottles in silhouette
        for(let k=0;k<5;k++) g.fillRect(x+14+k*38,y+62,14,26);
        if(kind===3&&i===0){ g.strokeStyle='#ff3a4a'; g.lineWidth=4; g.shadowColor='#ff2030'; g.shadowBlur=10; g.beginPath(); g.moveTo(x+40,y+22); g.bezierCurveTo(x+70,y+2,x+90,y+40,x+120,y+18); g.bezierCurveTo(x+140,y+6,x+160,y+30,x+180,y+16); g.stroke(); g.shadowBlur=0; } }
      else { g.fillStyle='#0c1016'; g.fillRect(x,y,w,h); g.fillStyle='rgba(255,255,255,.06)'; g.fillRect(x,y,w,12); }
      g.fillStyle=em?'#000':'#2b2e35'; for(let k=1;k<4;k++) g.fillRect(x+k*w/4-1.5,y,3,h); g.fillRect(x,y+h-3,w,3); });
    if(em){ g.fillStyle=kind===2?'rgba(255,214,150,.15)':kind===1?'#e8f2ff':'#ffd9a0'; g.fillRect(232,40,46,78); } else { g.fillStyle='#1c2028'; g.fillRect(230,36,50,92); g.fillStyle='#3a3f48'; g.fillRect(268,80,6,3); } // door
    if(!em){ g.fillStyle='#2b2d33'; g.fillRect(0,0,512,22); g.fillStyle='#4a4e57'; g.fillRect(0,22,512,3); } }; // signband + ledge
  const storeTex=(em)=>CT(canvasTex(512,512,(g)=>{ for(let k=0;k<4;k++){ g.save(); g.translate(0,k*128); storeRow(g,em,k); g.restore(); } }),true);
  const RSTORE=rng(4417); // separate stream, so picking a shop kind doesn't reshuffle the city
  FAC.store={mat:new THREE.MeshStandardMaterial({map:storeTex(false),emissive:0xffffff,emissiveMap:storeTex(true),emissiveIntensity:.8,roughness:.5,metalness:.1}),pos:[],nor:[],uv:[]};
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
  const beacons=[], roofAC=[], roofTank=[];
  function block(b,x0,x1,z0,z1,h,y0){ y0=y0||0; const y1=y0+h, T=32, uo=(R_()*8|0)/8, va=y0/T, vb=y1/T;
    faceQuad(b,'s',x0,x1,y0,y1,z1,uo,uo+(x1-x0)/T,va,vb); faceQuad(b,'n',x0,x1,y0,y1,z0,uo,uo+(x1-x0)/T,va,vb);
    faceQuad(b,'e',z0,z1,y0,y1,x1,uo,uo+(z1-z0)/T,va,vb); faceQuad(b,'w',z0,z1,y0,y1,x0,uo,uo+(z1-z0)/T,va,vb);
    const r=FAC.roof; r.pos.push(x0,y1,z1,x1,y1,z1,x1,y1,z0,x0,y1,z1,x1,y1,z0,x0,y1,z0); for(let i=0;i<6;i++) r.nor.push(0,1,0); r.uv.push(0,0,1,0,1,1,0,0,1,1,0,1);
    if(h>80) beacons.push((x0+x1)/2,y1+1.5,(z0+z1)/2);
    if(b!==FAC.store&&b!==FAC.sky&&b!==FAC.glass&&b!==FAC.hall&&x1-x0>6&&z1-z0>6){ const cx=(x0+x1)/2, cz=(z0+z1)/2;
      trims.push(new THREE.Matrix4().compose(new THREE.Vector3(cx,y1-.35,cz),new THREE.Quaternion(),new THREE.Vector3(x1-x0+1.1,1.1,z1-z0+1.1)));
      trims.push(new THREE.Matrix4().compose(new THREE.Vector3(cx,y1-1.3,cz),new THREE.Quaternion(),new THREE.Vector3(x1-x0+.5,.35,z1-z0+.5)));
      if(h>14&&!y0) trims.push(new THREE.Matrix4().compose(new THREE.Vector3(cx,6.9,cz),new THREE.Quaternion(),new THREE.Vector3(x1-x0+.4,.45,z1-z0+.4))); }
    if(b!==FAC.store&&b!==FAC.sky&&x1-x0>10&&z1-z0>10){ const n=1+(R_()*3|0); // rooftop plant: AC units, and water tanks on the mid-rise masonry
      for(let k=0;k<n;k++) roofAC.push([x0+3+R_()*(x1-x0-6),y1,z0+3+R_()*(z1-z0-6),1.6+R_()*2.2]);
      if(h<60&&b!==FAC.glass&&R_()<.35) roofTank.push([x0+4+R_()*(x1-x0-8),y1,z0+4+R_()*(z1-z0-8)]); } }
  function storefront(face,a0,a1,pc,china){ const out={s:.06,n:-.06,e:.06,w:-.06}[face], len=a1-a0; if(len<6) return;
    const kind=RSTORE(), kv=kind<.42?0:kind<.64?1:kind<.84?2:3; faceQuad(FAC.store,face,a0,a1,0,4.2,pc+out,0,len/16,1-(kv+1)/4+.002,1-kv/4-.002);
    const i=china?12+(R_()*4|0):(R_()*12|0), u0=(i%4)/4, v1=1-(i>>2)/4, sw=Math.min(8,len-2), c=(a0+a1)/2;
    faceQuad(FAC.sign,face,c-sw/2,c+sw/2,4.6,6.1,pc+out*2,u0,u0+.25,v1-.25,v1); }
  const styleAt=(x)=>{ const r=R_(); if(x>1700) return r<.7?'brick':'stone'; if(x<250) return r<.5?'glass':(r<.8?'stone':'brick'); if(x<600) return r<.2?'glass':(r<.6?'stone':'brick'); return r<.8?'brick':'stone'; };
  const heightAt=(x)=>{ const r=R_(); if(x>1700) return 8+r*24+(R_()<.08?40:0); if(x<-80) return 40+r*110+(R_()<.2?80:0); if(x<250) return 24+r*70+(R_()<.12?60:0); if(x<600) return 16+r*38; return 10+r*18; };
  function fillLot(x0,x1,z0,z1,fronts,china,row){
    if(row){ const h=8+R_()*6; block(R_()<.75?FAC.brick:FAC.stone,x0+1,x1-1,z0+1,z1-1,h);
      if(R_()<.35&&(fronts.n||fronts.s||fronts.e||fronts.w)){ const face=fronts.s?'s':fronts.n?'n':fronts.e?'e':'w';
        const pc=face==='s'?z1-1:face==='n'?z0+1:face==='e'?x1-1:x0+1, a0=face==='e'||face==='w'?z0+2:x0+2, a1=face==='e'||face==='w'?z1-2:x1-2;
        storefront(face,a0,a1,pc,false); }
      return; }
    const nx=Math.max(1,Math.min(3,Math.round((x1-x0)/30))), nz=(z1-z0)>50?2:1, wx=(x1-x0)/nx, wz=(z1-z0)/nz;
    for(let i=0;i<nx;i++) for(let j=0;j<nz;j++){
      const bx0=x0+i*wx+(i?.8:0), bx1=x0+(i+1)*wx-(i<nx-1?.8:0), bz0=z0+j*wz+(j?.8:0), bz1=z0+(j+1)*wz-(j<nz-1?.8:0), xc=(bx0+bx1)/2;
      block(FAC[styleAt(xc)],bx0,bx1,bz0,bz1,heightAt(xc));
      if(fronts.n&&j===0) storefront('n',bx0,bx1,bz0,china); if(fronts.s&&j===nz-1) storefront('s',bx0,bx1,bz1,china);
      if(fronts.w&&i===0) storefront('w',bz0,bz1,bx0,china); if(fronts.e&&i===nx-1) storefront('e',bz0,bz1,bx1,china); } }
  const trackX=C.trackX, trackZ=C.trackZ;
  const SKIP=[[-80,70,-160,20],[720,810,-340,20],[720,810,20,110],[-170,-80,-160,-70],[160,250,20,110],[-260,-170,-70,20],[-350,-260,20,110],[-350,-260,-160,-70],[-440,-350,-250,-160]].concat(C.skip);
  const EXCL=[[720,3300,-366,-274]].concat(C.excl);
  // a filleted corner cuts inside the lot's corner (r 27-62 m with a 13 m setback): pull any lot corner that would sit
  // on the road or sidewalk back diagonally until it clears
  const trSub=tr.pts.filter((p,i)=>i%3===0), clearR=W+4.8;
  function clearCorners(r){ for(let it=0;it<4;it++){ let moved=false;
    [[0,2],[0,3],[1,2],[1,3]].forEach(([ix,iz])=>{ const cx=r[ix], cz=r[iz]; let bd=1e18;
      for(const p of trSub){ const d=(p.x-cx)*(p.x-cx)+(p.z-cz)*(p.z-cz); if(d<bd) bd=d; }
      const d=Math.sqrt(bd); if(d>=clearR) return; const k=(clearR-d)*.75+.5; r[ix]+=ix?-k:k; r[iz]+=iz===3?-k:k; moved=true; });
    if(!moved) return; } }
  function grid(XS,ZS,row){
    for(let i=0;i<XS.length-1;i++) for(let j=0;j<ZS.length-1;j++){
      const xa=XS[i],xb=XS[i+1],za=ZS[j],zb=ZS[j+1];
      if(SKIP.some(s=>xa>=s[0]&&xb<=s[1]&&za>=s[2]&&zb<=s[3])) continue;
      const xc=(xa+xb)/2, zc=(za+zb)/2, tw=trackX(xa,zc), te=trackX(xb,zc), tn=trackZ(za,xc), ts=trackZ(zb,xc);
      const x0=xa+(tw?13:8), x1=xb-(te?13:8), z0=za+(tn?13:8), z1=zb-(ts?13:8);
      let rects=[[x0,x1,z0,z1]];
      EXCL.forEach(e=>{ rects=rects.flatMap(r=>{ if(r[1]<=e[0]||r[0]>=e[1]||r[3]<=e[2]||r[2]>=e[3]) return [r];
        const o=[]; if(e[2]-r[2]>14) o.push([r[0],r[1],r[2],e[2]]); if(r[3]-e[3]>14) o.push([r[0],r[1],e[3],r[3]]); return o; }); });
      rects.forEach(r=>{ const fr={w:tw&&r[0]===x0,e:te&&r[1]===x1,n:tn&&r[2]===z0,s:ts&&r[3]===z1}; clearCorners(r);
        if(r[1]-r[0]>6&&r[3]-r[2]>6) fillLot(r[0],r[1],r[2],r[3],fr,(tn||ts)&&za<-250&&xc>250&&xc<520,row); });
    } }
  const ZS=C.ZS;
  grid(C.nwGrid?[-170,-80,70,160,250,340,430,520,610,720,810,900,990]:[-800,-710,-620,-530,-440,-350,-260,-170,-80,70,160,250,340,430,520,610,720,810,900,990],ZS);
  grid([1760,1850,1940,2030,2120,2210,2300,2390,2480,2570],ZS);
  if(C.nwGrid) grid(C.nwGrid.XS,C.nwGrid.ZS,true);

  // ---- landmarks ----
  // City Hall: stone base, corner pavilions, clock tower, cupola and the William Penn statue
  const H=FAC.hall, hx=-3, hz=-72;
  const hallKit=kitInst(S,'CityHall',phillyKitMats(),[new THREE.Matrix4().makeTranslation(hx,0,hz)]);
  if(!hallKit){
  block(H,hx-42,hx+42,hz-42,hz+42,34);
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>block(H,hx+a*42-(a>0?16:0),hx+a*42+(a<0?16:0),hz+b*42-(b>0?16:0),hz+b*42+(b<0?16:0),44));
  block(H,hx-13,hx+13,hz-13,hz+13,62,34); block(H,hx-11,hx+11,hz-11,hz+11,12,96);
  }
  const clockTex=CT(canvasTex(128,128,(g)=>{ g.fillStyle='#fff3d6'; g.beginPath(); g.arc(64,64,62,0,7); g.fill(); g.strokeStyle='#2a2218'; g.lineWidth=5;
    for(let i=0;i<12;i++){ const a=i/12*Math.PI*2; g.beginPath(); g.moveTo(64+Math.cos(a)*50,64+Math.sin(a)*50); g.lineTo(64+Math.cos(a)*58,64+Math.sin(a)*58); g.stroke(); }
    g.lineWidth=6; g.beginPath(); g.moveTo(64,64); g.lineTo(64,24); g.moveTo(64,64); g.lineTo(90,76); g.stroke(); }));
  const clockM=new THREE.MeshBasicMaterial({map:clockTex,toneMapped:false});
  const clock=(x,y,z,ry,r)=>{ const c=mesh(new THREE.CircleGeometry(r,32),clockM,x,y,z); c.rotation.y=ry; };
  if(hallKit){ const cy=90, co=12.08; clock(hx,cy,hz+co,0,4.4); clock(hx,cy,hz-co,Math.PI,4.4); clock(hx+co,cy,hz,Math.PI/2,4.4); clock(hx-co,cy,hz,-Math.PI/2,4.4);
    [[0,1],[0,-1],[1,0],[-1,0]].forEach(([a,b])=>{ const g=glowSprite(0xfff0c8,11); g.position.set(hx+a*13,cy,hz+b*13); g.material.opacity=.6; S.add(g); }); // clock glow
    [[-46,-46],[46,-46],[-46,46],[46,46],[0,-47],[0,47],[-47,0],[47,0]].forEach(([a,b])=>{ const g=glowSprite(0xffcf8a,9); g.position.set(hx+a,1.5,hz+b); g.material.opacity=.7; S.add(g); }); } // floodlight heads
  else {
  clock(hx,102,hz+11.1,0,4.6); clock(hx,102,hz-11.1,Math.PI,4.6); clock(hx+11.1,102,hz,Math.PI/2,4.6); clock(hx-11.1,102,hz,-Math.PI/2,4.6);
  const goldStone=new THREE.MeshStandardMaterial({color:0xb09a74,emissive:0x5a4426,emissiveIntensity:.8,roughness:.7});
  mesh(new THREE.CylinderGeometry(8,10,18,8),goldStone,hx,117,hz); mesh(new THREE.CylinderGeometry(2.5,8,14,8),goldStone,hx,133,hz);
  const bronze=new THREE.MeshStandardMaterial({color:0x6a4a2a,emissive:0x3a2410,metalness:.8,roughness:.4});
  mesh(new THREE.CylinderGeometry(1,1.4,7,8),bronze,hx,143.5,hz); mesh(new THREE.SphereGeometry(1.1,10,8),bronze,hx,147.6,hz); }
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
  [331.6,348.4].forEach(x=>boxM(1.4,9,1.4,redM,x,4.5,-322)); boxM(19.4,1,1.2,redM,340,9,-322); // posts on the sidewalks, clear of the road edge
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
  const concrete=new THREE.MeshStandardMaterial({color:0x50545c,roughness:.9,side:THREE.DoubleSide});
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
  const towerKit=kitInst(S,'BFBTower',Object.assign({},phillyKitMats(),{STEEL:steel}),BR.towers.map(x=>new THREE.Matrix4().makeTranslation(x,-8,-320)));
  BR.towers.forEach(x=>{
    if(towerKit){ boxM(18,9,86,stone,x,-4,-320); const bc=glowSprite(0xff2030,3); bc.position.set(x,106.5,-320); S.add(bc);
      [-285,-355].forEach(z=>{ const g=glowSprite(0x9fc8ff,22); g.position.set(x,4,z); g.material.opacity=.5; S.add(g); }); return; } // floodlit legs
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
  const SOD=!!C.sodium; // Philly: warm high-pressure sodium on the landmark streets, like the Broad St photos
  const poleM=new THREE.MeshStandardMaterial({color:0x2a2e35,metalness:.7,roughness:.4}), lampM=new THREE.MeshBasicMaterial({color:SOD?0xffd6a0:0xeaf2ff,toneMapped:false});
  const poles=[],arms=[],heads=[],pools=[],flare=[],lampSt=[];
  for(let s=10;s<tr.L;s+=32){ frame(s,f,tr); if(f.p.y<-.3) continue; orientQ(f,q,basis,nr);
    [-1,1].forEach(sd=>{ const b=f.p.clone().addScaledVector(f.r,sd*(W+3.4));
      pv.copy(b); pv.y+=4.5; m4.compose(pv,q,one); poles.push(m4.clone());
      pv.copy(b).addScaledVector(f.r,-sd*1.7); pv.y+=9; m4.compose(pv,q,one); arms.push(m4.clone());
      pv.copy(b).addScaledVector(f.r,-sd*3.4); pv.y+=8.85; m4.compose(pv,q,one); heads.push(m4.clone()); flare.push(pv.x,pv.y-.15,pv.z);
      pv.y=f.p.y+.05; m4.compose(pv,new THREE.Quaternion(),one); pools.push(m4.clone()); m4.compose(pv,q,one); lampSt.push(m4.clone()); }); }
  // light as art: each lamp is sodium, LED or metal-halide (mostly sodium on the Philly board) and its head, pool, cone
  // and flare all carry that color, so a street reads as a run of individual lamps instead of one uniform tint
  const lampCol=lampColors(heads.length,SOD?.72:.3,1776);
  mkInst(new THREE.CylinderGeometry(.14,.2,9,8),poleM,poles); mkInst(new THREE.BoxGeometry(3.6,.14,.2),poleM,arms);
  lampM.color.setHex(0xffffff); const headIM=mkInst(new THREE.BoxGeometry(1.1,.2,.5),lampM,heads);
  lampCol.forEach((c,i)=>{ const m=Math.max(c.r,c.g,c.b); headIM.setColorAt(i,new THREE.Color(c.r/m*.35+.65,c.g/m*.35+.65,c.b/m*.35+.65)); }); // hot core: near white, tinted
  lampPools(S,pools,lampCol,26);
  lampStreaks(S,lampSt); lampCones(S,heads,lampCol);
  lampFlares(S,flare,lampCol,SOD?3.6:3.2);
  { const acM=new THREE.MeshStandardMaterial({color:0x5a5f68,roughness:.7,metalness:.4}), woodM=new THREE.MeshStandardMaterial({color:0x3a2c20,roughness:.95}), legM=new THREE.MeshStandardMaterial({color:0x22252a,roughness:.8,metalness:.5});
    mkInst(new THREE.BoxGeometry(1,1,1),acM,roofAC.map(([x,y,z,sz])=>{ pv.set(x,y+sz*.35,z); m4.compose(pv,new THREE.Quaternion(),new THREE.Vector3(sz,sz*.7,sz*1.3)); return m4.clone(); }));
    mkInst(new THREE.CylinderGeometry(2.1,2.1,4.2,14),woodM,roofTank.map(([x,y,z])=>{ pv.set(x,y+5.4,z); m4.compose(pv,new THREE.Quaternion(),one); return m4.clone(); }));
    mkInst(new THREE.ConeGeometry(2.3,1.3,14),legM,roofTank.map(([x,y,z])=>{ pv.set(x,y+8.15,z); m4.compose(pv,new THREE.Quaternion(),one); return m4.clone(); }));
    mkInst(new THREE.CylinderGeometry(.12,.12,3.3,5),legM,roofTank.flatMap(([x,y,z])=>[[1,1],[1,-1],[-1,1],[-1,-1]].map(([a,c])=>{ pv.set(x+a*1.4,y+1.65,z+c*1.4); m4.compose(pv,new THREE.Quaternion(),one); return m4.clone(); }))); }
  const bcg=new THREE.BufferGeometry(); bcg.setAttribute('position',new THREE.Float32BufferAttribute(beacons,3));
  const beaconM=new THREE.PointsMaterial({map:glowTex,color:0xff2a2a,size:6,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}); S.add(new THREE.Points(bcg,beaconM));

  // ---- intersections: crosswalks, signals, street-name blades ----
  const lamp={r:new THREE.MeshBasicMaterial({color:0x1a1a1a,toneMapped:false}),y:new THREE.MeshBasicMaterial({color:0x1a1a1a,toneMapped:false}),g:new THREE.MeshBasicMaterial({color:0x1a1a1a,toneMapped:false})};
  const zX=[], zZ=[], lampGeo=new THREE.CircleGeometry(.15,12);
  const NAMES_X=Object.assign({70:'13th St',160:'12th St',250:'11th St',340:'10th St',430:'9th St',520:'8th St',610:'7th St',720:'6th St',810:'5th St'},C.namesX||{});
  const NAMES_Z=Object.assign({'-800':'Spring Garden St','-700':'Green St','-610':'Buttonwood St','-520':'Callowhill St','-430':'Vine St','-340':'Race St','-250':'Cherry St','-160':'Arch St','-70':'JFK Blvd',
    '20':'Market St','110':'Chestnut St','200':'Walnut St','290':'Locust St','380':'Spruce St','470':'South St'},C.namesZ||{});
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
    Object.keys(names).forEach(k=>{ const c=+k; if(c<=lo||c>=hi) return; if(C.yAt(rd.ew?c:rd.c,rd.ew?rd.c:c)>.5) return; // no street-level crossing under an elevated stretch
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
  EXTRA.push(dt=>{ waterN.offset.x+=dt*.004; waterN.offset.y+=dt*.011; });
  if(C.steam){ // manhole steam: plumes of soft additive points rising out of vents in the road, lit by the street lights
    const PL=C.steam, NP=26, pos=new Float32Array(PL*NP*3), col=new Float32Array(PL*NP*3), life=new Float32Array(PL*NP), src=[], R=rng(2031);
    for(let k=0;k<PL;k++){ const sK=tr.L*(k+.5)/PL+(R()-.5)*40; frame(sK,f,tr); if(f.p.y<-.3||f.p.y>2){ src.push(null); continue; } const x=(R()<.5?-1:1)*(W-1.4-R()*2);
      src.push([f.p.x+f.r.x*x,f.p.y,f.p.z+f.r.z*x]); const lid=mesh(new THREE.CircleGeometry(.55,16).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({color:0x121417,metalness:.7,roughness:.4}),src[k][0],f.p.y+.02,src[k][2]); void lid; }
    for(let i=0;i<PL*NP;i++) life[i]=R();
    const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.BufferAttribute(pos,3)); sg.setAttribute('color',new THREE.BufferAttribute(col,3));
    const pts=new THREE.Points(sg,new THREE.PointsMaterial({map:glowTex,size:5.6,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false})); pts.frustumCulled=false; S.add(pts);
    EXTRA.push(dt=>{ for(let k=0;k<PL;k++){ const c=src[k]; for(let j=0;j<NP;j++){ const i=k*NP+j;
        if(!c){ pos[i*3+1]=-999; continue; }
        life[i]+=dt*.28; if(life[i]>1) life[i]-=1; const t=life[i], sway=Math.sin(t*6+j)*.5*t;
        pos[i*3]=c[0]+sway+(j%3-1)*.2*t*3; pos[i*3+1]=c[1]+.2+t*5.5; pos[i*3+2]=c[2]+Math.cos(t*5+j)*.4*t;
        const a=Math.sin(Math.PI*t)*.34; col[i*3]=a*.85; col[i*3+1]=a*.9; col[i*3+2]=a; } }
      sg.attributes.position.needsUpdate=true; sg.attributes.color.needsUpdate=true; }); }
  if(C.tunnel) tunnelDress();
  if(C.blvd) blvdDress(C.blvd);
  if(C.decoBridge) decoBridge();
  if(C.fireworks){ // fireworks: pooled bursts of additive points that expand, drop under gravity and fade
    const NB=6, NP=110, pos=new Float32Array(NB*NP*3), col=new Float32Array(NB*NP*3), vel=new Float32Array(NB*NP*3), R=rng(1776), PAL=[[1,.3,.3],[1,.85,.3],[.4,.8,1],[.8,.4,1],[.4,1,.55],[1,1,1]];
    const bursts=[]; for(let b=0;b<NB;b++) bursts.push({t:-R()*5,col:PAL[0]});
    const fg=new THREE.BufferGeometry(); fg.setAttribute('position',new THREE.BufferAttribute(pos,3)); fg.setAttribute('color',new THREE.BufferAttribute(col,3));
    const fw=new THREE.Points(fg,new THREE.PointsMaterial({map:glowTex,size:26,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false})); fw.frustumCulled=false; S.add(fw);
    const flashS=glowSprite(0xffffff,260); flashS.material.fog=false; flashS.material.opacity=0; S.add(flashS);
    EXTRA.push(dt=>{ let fl=0;
      bursts.forEach((b,bi)=>{ b.t+=dt; if(b.t<0) return;
        if(b.t>4.2||!b.o){ const site=C.fireworks[R()*C.fireworks.length|0]; b.o=[site[0]+(R()-.5)*120,site[1]+R()*50,site[2]+(R()-.5)*120]; b.col=PAL[R()*PAL.length|0]; b.t=0;
          for(let j=0;j<NP;j++){ const i=bi*NP+j, th=R()*Math.PI*2, ph=Math.acos(2*R()-1), sp=34+R()*10; vel.set([Math.sin(ph)*Math.cos(th)*sp,Math.cos(ph)*sp,Math.sin(ph)*Math.sin(th)*sp],i*3); pos.set(b.o,i*3); } }
        const k=Math.max(0,1-b.t/4.2), a=b.t<.12?1.6:k*k; if(b.t<.2){ fl=Math.max(fl,1-b.t/.2); flashS.position.set(b.o[0],b.o[1],b.o[2]); flashS.material.color.setRGB(b.col[0],b.col[1],b.col[2]); }
        for(let j=0;j<NP;j++){ const i=(bi*NP+j)*3, tw=(j%7===0&&b.t>1.5)?(Math.sin(b.t*40+j)>0?1:.2):1;
          vel[i]*=1-dt*.9; vel[i+1]=vel[i+1]*(1-dt*.9)-9.8*dt*.6; vel[i+2]*=1-dt*.9; pos[i]+=vel[i]*dt; pos[i+1]+=vel[i+1]*dt; pos[i+2]+=vel[i+2]*dt;
          col[i]=b.col[0]*a*tw; col[i+1]=b.col[1]*a*tw; col[i+2]=b.col[2]*a*tw; } });
      flashS.material.opacity=fl*.35; fg.attributes.position.needsUpdate=true; fg.attributes.color.needsUpdate=true; }); }
  if(C.express){ // a lit PATCO train running the bridge tracks beside the race, and a moon glade on the Delaware
    const tf=mkF(), tq=new THREE.Quaternion(), winT=CT(canvasTex(256,64,(g,w,h)=>{ g.fillStyle='#b8bec6'; g.fillRect(0,0,w,h); g.fillStyle='#8a1c2a'; g.fillRect(0,h*.72,w,6);
      for(let x=8;x<w-8;x+=22){ g.fillStyle='#ffe9c2'; g.fillRect(x,14,16,22); } g.fillStyle='#1a1c20'; g.fillRect(w*.47,10,14,h-16); }));
    const carM=[new THREE.MeshStandardMaterial({color:0xb8bec6,metalness:.7,roughness:.35}),new THREE.MeshStandardMaterial({color:0xb8bec6,metalness:.7,roughness:.35}),new THREE.MeshStandardMaterial({color:0x5a5f66,metalness:.6,roughness:.5}),new THREE.MeshStandardMaterial({color:0x2a2c30}),
      new THREE.MeshStandardMaterial({map:winT,emissive:0xffffff,emissiveMap:winT,emissiveIntensity:.55,metalness:.4,roughness:.4}),new THREE.MeshStandardMaterial({map:winT,emissive:0xffffff,emissiveMap:winT,emissiveIntensity:.55,metalness:.4,roughness:.4})];
    const cars=[]; for(let i=0;i<4;i++){ const c=new THREE.Mesh(new THREE.BoxGeometry(16,3.4,3.1),[carM[0],carM[1],carM[2],carM[3],carM[4],carM[5]]); c.geometry.rotateY(Math.PI/2); S.add(c); cars.push(c); }
    const head=glowSprite(0xfff1d6,5); S.add(head);
    let bA=-1,bB=-1; for(let sK=0;sK<tr.L;sK+=5){ frame(sK,tf,tr); if(tf.p.y>6&&tf.p.z<-250){ if(bA<0) bA=sK; bB=sK; } } const span=Math.max(1,bB-bA+80); // the bridge's elevated stretch
    let ts=0; EXTRA.push(dt=>{ ts=(ts+dt*24)%span; cars.forEach((c,i)=>{ const sK=bA-40+ts-i*16.6; frame(sK,tf,tr); const on=tf.p.y>6&&tf.p.z<-250; c.visible=on; if(!on) return;
        orientQ(tf,tq,basis,nr); c.position.copy(tf.p).addScaledVector(tf.r,-16.15); c.position.y+=2.0; c.quaternion.copy(tq); if(i===0){ head.visible=on; head.position.copy(c.position).addScaledVector(tf.t,8.3); } }); if(!cars[0].visible) head.visible=false; });
    const glade=new THREE.Mesh(new THREE.PlaneGeometry(90,1400).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:CT(canvasTex(32,256,(g,w,h)=>{ const R=rng(9); g.fillStyle='#000'; g.fillRect(0,0,w,h); for(let i=0;i<500;i++){ const y=R()*h, a=.2+.8*(y/h); g.fillStyle=`rgba(220,230,255,${a*R()})`; g.fillRect(w/2+(R()-.5)*w*(1-y/h*.6),y,2+R()*6,1); } })),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
    glade.position.set((BR.river[0]+BR.river[1])/2+120,-5.9,-900); glade.rotation.y=-.5; S.add(glade); }
  if(C.dockside) docksideDress();
  if(C.skyline) skylineDress();
  if(C.philly) phillyDress();
  const arena=C.arena?arenaDress():null;

  function phillyDress(){
    const gold=new THREE.MeshStandardMaterial({color:0xd8b27a,emissive:0x8a5a24,emissiveIntensity:.9,roughness:.65}); // the museum's uplit sandstone
    const goldHi=new THREE.MeshStandardMaterial({color:0xf0cf94,emissive:0xb07a34,emissiveIntensity:1.1,roughness:.55});
    const stepM=new THREE.MeshStandardMaterial({color:0x8a8478,emissive:0x2a2418,roughness:.9});
    const bronze=new THREE.MeshStandardMaterial({color:0x6a4a2a,metalness:.75,roughness:.35,emissive:0x1a1006});
    const concrete=new THREE.MeshStandardMaterial({color:0x7a7e86,roughness:.9,side:THREE.DoubleSide});
    const warmLamp=0xffc98a;
    // ---- Philadelphia Museum of Art on top of the Rocky Steps, facing Broad St ----
    flat(-128,-90,-640,-490,.03,new THREE.MeshStandardMaterial({color:0x3a3630,roughness:.85})); // plaza
    for(let i=0;i<18;i++){ const h=(i+1)*.42; boxM(1.5,h,64,stepM,-129-i*1.5,h/2,-565); } // the steps, climbing west
    const tY=18*.42; boxM(16,tY,110,stepM,-164,tY/2,-565); // terrace
    const PK=phillyKitMats();
    if(kitInst(S,'ArtMuseum',PK,[new THREE.Matrix4().makeTranslation(-190,tY,-565)])){ // temple front, wings round the courtyard
      boxM(66,tY,132,stepM,-189,tY/2,-565); [-1,1].forEach(sd=>boxM(11.6,tY,34,stepM,-150.2,tY/2,-565+sd*49));  // podium under the kit
      [[-150,-600],[-150,-530],[-140,-614],[-140,-516],[-160,-565]].forEach(([x,z])=>{ const g=glowSprite(0xffc27a,8); g.position.set(x,tY+.8,z); g.material.opacity=.7; S.add(g); }); } // column flood heads
    else {
    boxM(56,15,74,gold,-200,tY+7.5,-565); boxM(58,1.4,76,goldHi,-200,tY+15.7,-565); // central pavilion + cornice
    for(let i=0;i<8;i++){ const z=-594+i*(58/7); mesh(new THREE.CylinderGeometry(.85,.95,12,12),goldHi,-170,tY+6,z); } // colonnade
    { const sh=new THREE.Shape(); sh.moveTo(-31,0); sh.lineTo(31,0); sh.lineTo(0,6.5); sh.lineTo(-31,0);
      const pm=mesh(new THREE.ExtrudeGeometry(sh,{depth:3,bevelEnabled:false}),goldHi,-173,tY+16.4,-565); pm.rotation.y=Math.PI/2; } // pediment
    [-1,1].forEach(sd=>{ boxM(46,13,26,gold,-186,tY+6.5,-565+sd*52); boxM(48,1.2,28,goldHi,-186,tY+13.6,-565+sd*52); // wings wrapping the courtyard
      for(let i=0;i<4;i++) mesh(new THREE.CylinderGeometry(.7,.8,10,10),goldHi,-162,tY+5,-565+sd*(42+i*6)); });
    }
    [[-128,-600],[-128,-530],[-150,-620],[-150,-510],[-165,-565]].forEach(([x,z])=>{ const g=glowSprite(warmLamp,16); g.position.set(x,3,z); S.add(g); }); // uplights
    const pma=mesh(new THREE.PlaneGeometry(22,2.2),new THREE.MeshBasicMaterial({map:CT(signCanvas2('PHILADELPHIA MUSEUM OF ART','THE ROCKY STEPS',{bg:'#120c06',color:'#ffd9a0'})),toneMapped:false}),-100,3.4,-565); pma.rotation.y=Math.PI/2;
    // Rocky, arms up, at the foot of the steps
    boxM(2.4,1.6,2.4,stepM,-110,.8,-522);
    mesh(new THREE.CylinderGeometry(.34,.28,1.5,10),bronze,-110,2.45,-522); mesh(new THREE.SphereGeometry(.26,10,8),bronze,-110,3.45,-522);
    [-1,1].forEach(sd=>{ const arm=mesh(new THREE.CylinderGeometry(.09,.09,1.1,6),bronze,-110,3.5,-522+sd*.42); arm.rotation.x=sd*.45;
      mesh(new THREE.CylinderGeometry(.12,.12,1.4,6),bronze,-110,1.0+.62,-522+sd*.15); });
    { const g=glowSprite(warmLamp,4); g.position.set(-106,2,-522); S.add(g); }
    // ---- Boathouse Row on the Schuylkill, along Kelly Drive ----
    flat(64,726,-800,-772,-1.6,new THREE.MeshStandardMaterial({color:0x04070c,metalness:.95,roughness:.06})); // river
    flat(64,726,-772,-742,.02,new THREE.MeshStandardMaterial({color:0x2a2e34,roughness:.9})); // bank
    const houseM=new THREE.MeshStandardMaterial({color:0x22262e,roughness:.8}), roofM=new THREE.MeshStandardMaterial({color:0x14171c,roughness:.7});
    const HUES=[0xffffff,0xffe2a8,0x7fe8ff,0xff7ad0,0xffffff,0xa6ff9a,0xffd060,0xffffff,0x9fb4ff,0xff9a6a,0xffffff,0x7fe8ff];
    const outlines=new Map(); const lineM=c=>{ if(!outlines.has(c)) outlines.set(c,new THREE.MeshBasicMaterial({color:c,toneMapped:false})); return outlines.get(c); };
    const BHV=['Boathouse_A','Boathouse_B','Boathouse_C','Boathouse_D'], BHW={Boathouse_A:34,Boathouse_B:36,Boathouse_C:40,Boathouse_D:36};
    if(kitParts('Boathouse_A')){ const lists={}, cols={};
      for(let i=0;i<12;i++){ const x=96+i*52, zc=-758, v=BHV[(i*3+(i>>2))%4], w=BHW[v], c=HUES[i];
        (lists[v]=lists[v]||[]).push(new THREE.Matrix4().makeTranslation(x,0,zc)); (cols[v]=cols[v]||[]).push(c);
        const r=glowSprite(c,9); r.position.set(x,5,zc+10); r.material.opacity=.55; S.add(r);
        flat(x-w/2,x+w/2,-800,-774,-1.55,new THREE.MeshBasicMaterial({map:poolTex,color:c,transparent:true,opacity:.4,blending:THREE.AdditiveBlending,depthWrite:false})); }
      BHV.forEach(v=>kitInst(S,v,PK,lists[v]||[],cols[v],'LED'));
      const trees=[]; for(let x=70;x<=700;x+=9){ const R2=rng(x); trees.push(new THREE.Matrix4().compose(new THREE.Vector3(x+R2()*4,0,-770-R2()*2),new THREE.Quaternion().setFromAxisAngle(UP,R2()*6),new THREE.Vector3().setScalar(1.3+R2()*.6))); }
      kitInst(S,'Broadleaf',kitMats(),trees); } // the dark tree line behind the row, as in every night photo
    else
    for(let i=0;i<12;i++){ const x=96+i*52, w=34+(i%3)*4, h=6+(i%2)*2.4, d=16, zc=-758, c=HUES[i], L=lineM(c), rh=4.2+(i%2);
      boxM(w,h,d,houseM,x,h/2,zc);
      const roof=new THREE.CylinderGeometry(1,1,w,3,1); roof.rotateZ(Math.PI/2); const rf=mesh(roof,roofM,x,h+rh*.5,zc); rf.scale.set(1,rh,d*.58);
      // LED outlines: eaves, corners, and both roof slopes on the road-facing side
      boxM(w+.3,.12,.12,L,x,h,zc+d/2); boxM(w+.3,.12,.12,L,x,h,zc-d/2); boxM(w+.3,.12,.12,L,x,h+rh,zc);
      [-1,1].forEach(sx=>{ boxM(.12,h,.12,L,x+sx*w/2,h/2,zc+d/2);
        const sl=boxM(.12,.12,Math.hypot(d/2,rh)+.2,L,x,h+rh/2,zc+sx*d/4); sl.rotation.x=-sx*Math.atan2(rh,d/2); });
      for(let k=1;k<4;k++) boxM(1.6,1.8,.05,lineM(0xffe2a8),x-w/2+k*w/4,h*.45,zc+d/2+.03); // lit windows
      const r=glowSprite(c,5); r.position.set(x,h*.6,zc+d/2+2); S.add(r);
      const refl=flat(x-w/2,x+w/2,-800,-774,-1.55,new THREE.MeshBasicMaterial({map:poolTex,color:c,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false})); void refl; }
    const kd=mesh(new THREE.PlaneGeometry(12,1.8),new THREE.MeshBasicMaterial({map:CT(signCanvas2('BOATHOUSE ROW','KELLY DRIVE · SCHUYLKILL RIVER',{bg:'#0a0d12',color:'#e6f2ff'})),toneMapped:false}),400,3,-743.5); void kd;
    // ---- South Philly stadium beside the Camden leg ----
    const st=new THREE.Group(); st.position.set(2382,0,110); st.scale.set(1,1,.78); S.add(st);
    const wallM=new THREE.MeshStandardMaterial({color:0x3a4250,roughness:.7,side:THREE.DoubleSide}), seatM=new THREE.MeshStandardMaterial({color:0x0e3a4a,roughness:.8,side:THREE.DoubleSide});
    const add=(geo,m,y)=>{ const o=new THREE.Mesh(geo,m); o.position.y=y; st.add(o); return o; };
    add(new THREE.CylinderGeometry(78,78,22,48,1,true),wallM,11);
    add(new THREE.CylinderGeometry(76,42,19,48,1,true),seatM,11.5);
    add(new THREE.TorusGeometry(78,.6,6,64),new THREE.MeshBasicMaterial({color:0x44e8ff,toneMapped:false}),22).rotation.x=Math.PI/2;
    add(new THREE.TorusGeometry(78,.35,6,64),new THREE.MeshBasicMaterial({color:0x44e8ff,toneMapped:false}),8).rotation.x=Math.PI/2;
    const field=add(new THREE.CircleGeometry(42,40),new THREE.MeshStandardMaterial({color:0x1f7a3a,emissive:0x0c4a1e,emissiveIntensity:1.2,roughness:.9}),2); field.rotation.x=-Math.PI/2;
    for(let k=0;k<6;k++){ const a=k/6*Math.PI*2+.26, tx=Math.cos(a)*72, tz=Math.sin(a)*72;
      const mast=new THREE.Mesh(new THREE.BoxGeometry(1.2,38,1.2),concrete); mast.position.set(tx,19,tz); st.add(mast);
      const panel=new THREE.Mesh(new THREE.BoxGeometry(7,3.6,.6),new THREE.MeshBasicMaterial({color:0xf4f8ff,toneMapped:false})); panel.position.set(tx*.97,38,tz*.97); panel.lookAt(0,20,0); st.add(panel);
      const gl=glowSprite(0xeaf4ff,18); gl.position.set(tx*.95,38,tz*.95); st.add(gl); }
    const sp=mesh(new THREE.PlaneGeometry(26,3.4),new THREE.MeshBasicMaterial({map:CT(signCanvas2('SOUTH PHILLY','SPORTS COMPLEX',{bg:'#06131a',color:'#7ff0ff'})),toneMapped:false}),2462,25,110); sp.rotation.y=Math.PI/2;
    // ---- I-95 viaduct back across the Delaware: deck, lit parapets, piers ----
    const onV=p=>p.z>400&&p.y>.6;
    const VW=W+4.7; // outside the sidewalk
    [-1,1].forEach(sd=>{ const o=sd*VW;
      ribbonF(tr,S,concrete,(k,p)=>onV(p)?[o,p.y-1.8,o,p.y+1.25]:null);
      ribbonF(tr,S,new THREE.MeshBasicMaterial({color:0xffcf8a,toneMapped:false,side:THREE.DoubleSide}),(k,p)=>onV(p)?[sd*(VW-.08),p.y+1.1,sd*(VW-.08),p.y+1.2]:null); });
    ribbonF(tr,S,concrete,(k,p)=>onV(p)?[-VW,p.y-1.8,VW,p.y-1.8]:null);
    const piers=[], caps=[];
    for(let s2=0;s2<tr.L;s2+=42){ frame(s2,f,tr); if(!onV(f.p)||f.p.y<3) continue; orientQ(f,q,basis,nr);
      const base=f.p.x>BR.river[0]-10&&f.p.x<BR.river[1]+10?-6:0, h=f.p.y-1.8-base;
      [-1,1].forEach(sd=>{ pv.copy(f.p).addScaledVector(f.r,sd*(W-1)); pv.y=base+h/2; m4.compose(pv,q,new THREE.Vector3(1,h,1)); piers.push(m4.clone()); });
      pv.copy(f.p); pv.y-=2.5; m4.compose(pv,q,one); caps.push(m4.clone()); }
    mkInst(new THREE.BoxGeometry(2.4,1,2.4),concrete,piers); mkInst(new THREE.BoxGeometry(2*VW,1.4,2.8),concrete,caps);
  }

  function docksideDress(){
    const stackM=new THREE.MeshStandardMaterial({color:0x1a4a6a,metalness:.55,roughness:.4});
    const boxC=new THREE.MeshStandardMaterial({color:0x8a4a18,metalness:.35,roughness:.75});
    [[110,-300,3,2.6,6],[150,-290,2.4,5.2,6],[200,-305,3,2.6,7],[240,-285,2.8,5.2,6],[290,-300,2.4,2.6,5],[310,-280,3,5.2,6]].forEach(([x,z,w,h,d])=>{
      boxM(w,h,d,stackM,x,h/2,z); boxM(w*.92,h*.9,d*.95,boxC,x,h/2,z); });
    flat(90,320,-322,-268,.05,new THREE.MeshBasicMaterial({map:poolTex,color:0x3a5a78,transparent:true,opacity:.45,blending:THREE.AdditiveBlending,depthWrite:false}));
    const sg=mesh(new THREE.PlaneGeometry(8,1.6),new THREE.MeshBasicMaterial({map:CT(signCanvas2('PORT RICHMOND','CONTAINER YARD',{bg:'#0a0d12',color:'#e6f2ff'})),toneMapped:false}),200,6,-326); sg.rotation.y=Math.PI;
    // ---- the port south of the loop: container stacks, a quay with two ship-to-shore cranes, a docked ship, sodium masts ----
    const R=rng(505), LINES=[0x1f5a8a,0xb8391e,0x2f7a3a,0xd8a41c,0x5a5f66,0x8a1c2a,0xe6e8ea,0x1a2a4a,0xcf6a1c,0x0f6a6a];
    const corrT=CT(canvasTex(128,64,(g,w,h)=>{ g.fillStyle='#d8d8d8'; g.fillRect(0,0,w,h); for(let x=0;x<w;x+=5){ g.fillStyle='#9a9a9a'; g.fillRect(x,0,2,h); g.fillStyle='#f0f0f0'; g.fillRect(x+2,0,1,h); }
      g.fillStyle='#6a6a6a'; g.fillRect(0,0,w,4); g.fillRect(0,h-4,w,4); g.fillStyle='#fff'; g.font='900 16px Arial,sans-serif'; g.fillText(['MAERSKA','OCEANIC','HAPAG','CMC','EVERLINE'][R()*5|0],10,38); }));
    const cM=new THREE.MeshStandardMaterial({map:corrT,roughness:.6,metalness:.35}), c40=new THREE.BoxGeometry(12.2,2.6,2.44).translate(0,1.3,0), c20=new THREE.BoxGeometry(6.1,2.6,2.44).translate(0,1.3,0);
    const L40=[], L20=[], k40=[], k20=[];
    for(let z=-372;z>-440;z-=3.1){ if(z<-400&&z>-406) continue; for(let x=-60;x<330;x+=13.2){ if(R()<.15) continue; const hN=1+(R()*4|0), big=R()<.7;
        for(let lv=0;lv<hN;lv++){ const c=LINES[R()*LINES.length|0]; if(big){ L40.push({x,y:lv*2.62,z}); k40.push(c); } else { [-3.1,3.1].forEach(o=>{ L20.push({x:x+o,y:lv*2.62,z}); k20.push(LINES[R()*LINES.length|0]); }); } } } }
    instPlace(S,c40,cM,L40,k40); instPlace(S,c20,cM,L20,k20);
    flat(-260,520,-462,-449,.02,new THREE.MeshStandardMaterial({color:0x3a3d42,roughness:.9}));                                         // quay apron
    boxM(780,4,1.2,new THREE.MeshStandardMaterial({color:0x2a2c30,roughness:.9}),130,-1.9,-462.6);                                          // quay wall
    flat(-400,700,-800,-463,-2.4,new THREE.MeshStandardMaterial({color:0x04080d,metalness:.9,roughness:.12,normalMap:waterN,normalScale:new THREE.Vector2(.5,.5),envMapIntensity:1.4}));
    const craneR=new THREE.MeshStandardMaterial({color:0xb8201c,roughness:.5,metalness:.5}), craneW=new THREE.MeshStandardMaterial({color:0xe6e8ea,roughness:.5,metalness:.4}), beacons=[];
    [40,210].forEach(cx=>{ [-9,9].forEach(dx=>[-445,-460].forEach(z=>boxM(1.4,38,1.4,craneR,cx+dx,19,z)));
      [-445,-460].forEach(z=>boxM(20,1.6,1.6,craneR,cx,24,z)); boxM(20,2,17,craneW,cx,38.5,-452.5); boxM(3.4,2.2,70,craneW,cx,40.2,-492); boxM(3.4,1.4,22,craneW,cx,40,-432);
      boxM(5,4,5,craneW,cx,43,-450); const cab=boxM(3,2,3,new THREE.MeshStandardMaterial({color:0x1a2230,emissive:0x2a4a66}),cx,37.6,-470); void cab;
      [[cx,44.5,-450],[cx,41.6,-527],[cx,41.4,-421]].forEach(b=>beacons.push(b)); });
    const hull=new THREE.MeshStandardMaterial({color:0x14181e,roughness:.7,metalness:.4});
    boxM(190,11,28,hull,140,1.5,-492); boxM(190,1.2,28.4,new THREE.MeshStandardMaterial({color:0x6a1a1a,roughness:.8}),140,-3.5,-492);
    const sup=boxM(14,16,22,craneW,40,15,-492); void sup; boxM(14.2,.6,22.2,new THREE.MeshBasicMaterial({color:0xffe2a8,toneMapped:false}),40,12,-492);
    const S40=[], sk=[]; for(let x=60;x<225;x+=12.6) for(let z=-503;z<-481;z+=2.5){ const hN=2+(R()*4|0); for(let lv=0;lv<hN;lv++){ S40.push({x,y:7+lv*2.62,z}); sk.push(LINES[R()*LINES.length|0]); } }
    instPlace(S,c40,cM,S40,sk);
    const bp=[]; beacons.forEach(b=>bp.push(...b)); const bg=new THREE.BufferGeometry(); bg.setAttribute('position',new THREE.Float32BufferAttribute(bp,3));
    const bM=new THREE.PointsMaterial({map:glowTex,color:0xff2a2a,size:6,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}); S.add(new THREE.Points(bg,bM));
    let bt=0; EXTRA.push(dt=>{ bt+=dt; bM.opacity=(bt%1.4)<.5?1:.15; });
    sodiumLot(S,[[-40,-395],[70,-420],[180,-395],[290,-420]].map(([x,z])=>({x,z})));
  }
  function skylineDress(){
    const rail=new THREE.MeshStandardMaterial({color:0x9aa1ab,metalness:.8,roughness:.25,side:THREE.DoubleSide}), up=p=>p.y>1.2;
    // the viaduct itself: parapet rails, an amber light line, a deck fascia and underside, and piers down to the street
    [-1,1].forEach(sd=>{ ribbonF(tr,S,rail,(k,p)=>up(p)?[sd*(W+3.8),p.y+.4,sd*(W+3.8),p.y+1.1]:null);
      ribbonF(tr,S,new THREE.MeshBasicMaterial({color:0xffcf8a,toneMapped:false,side:THREE.DoubleSide}),(k,p)=>up(p)?[sd*(W+3.85),p.y+.55,sd*(W+3.85),p.y+.62]:null);
      ribbonF(tr,S,curbM,(k,p)=>up(p)?[sd*(W+4.5),p.y+.16,sd*(W+4.5),p.y-1.3]:null); });
    ribbonF(tr,S,new THREE.MeshStandardMaterial({color:0x1a1d22,roughness:.9,side:THREE.DoubleSide}),(k,p)=>up(p)?[-(W+4.5),p.y-1.3,W+4.5,p.y-1.3]:null);
    const piers=[]; for(let s=0;s<tr.L;s+=28){ frame(s,f,tr); if(f.p.y<3.5) continue; orientQ(f,q,basis,nr);
      [-1,1].forEach(sd=>{ pv.copy(f.p).addScaledVector(f.r,sd*(W-1)); const h=f.p.y-1.3; pv.y=h/2; m4.compose(pv,q,new THREE.Vector3(1,h,1)); piers.push(m4.clone()); }); }
    mkInst(new THREE.BoxGeometry(1.4,1,1.4),curbM,piers);
    const glow=glowSprite(0xffcf8a,12); glow.position.set(720,18,470); S.add(glow);
    // lit billboards on poles beside the elevated run, at driver eye level
    const ADS=[['NIGHTSHIFT ENERGY','#ff2fb4','#0a0612'],['TORQ TIRES','#ffd23b','#111'],['PHL 24/7','#2fe6ff','#061018'],['KAIZEN AUTO','#f4f7ff','#8a1c2a'],['GRIP OR DIE','#7dff9a','#07120a'],['AFTERHOURS FM 104.7','#ff9a3c','#140a04']];
    let ai=0; for(let s=60;s<tr.L;s+=95){ frame(s,f,tr); if(f.p.y<6) continue; orientQ(f,q,basis,nr); const sd=ai%2?1:-1, [txt,fg,bg]=ADS[ai++%ADS.length];
      const b=f.p.clone().addScaledVector(f.r,sd*(W+9)); boxM(.6,f.p.y+4,.6,poleM,b.x,(f.p.y+4)/2,b.z);
      const bd=new THREE.Mesh(new THREE.PlaneGeometry(12,4),new THREE.MeshBasicMaterial({map:CT(signCanvas(txt,{w:512,h:170,bg,color:fg,size:62})),toneMapped:false,side:THREE.DoubleSide}));
      bd.position.set(b.x,f.p.y+6,b.z); bd.quaternion.copy(q); bd.rotateY(Math.PI+sd*.5); S.add(bd); const gl=glowSprite(new THREE.Color(fg).getHex(),14); gl.position.copy(bd.position); S.add(gl); }
    // news helicopter tracking the race: body, spinning rotor, strobes, a searchlight on the road near the player
    const heli=new THREE.Group(), hb=new THREE.MeshStandardMaterial({color:0x1a2230,metalness:.6,roughness:.35});
    const body=new THREE.Mesh(new THREE.SphereGeometry(1.4,14,10),hb); body.scale.set(1,.9,1.8); heli.add(body);
    const boom=new THREE.Mesh(new THREE.CylinderGeometry(.18,.3,5,8),hb); boom.rotation.x=Math.PI/2; boom.position.z=-3.6; heli.add(boom);
    const rotor=new THREE.Mesh(new THREE.BoxGeometry(11,.06,.4),blackM); rotor.position.y=1.5; heli.add(rotor); const rotor2=rotor.clone(); rotor2.rotation.y=Math.PI/2; rotor.add(rotor2); rotor2.position.set(0,0,0);
    const skid=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,3.4),blackM); [-.9,.9].forEach(x=>{ const k=skid.clone(); k.position.set(x,-1.4,0); heli.add(k); });
    const strobeR=glowSprite(0xff2020,2.2), strobeW=glowSprite(0xffffff,2.6); strobeR.position.set(0,-1.2,-.2); strobeW.position.set(0,.3,-6); heli.add(strobeR); heli.add(strobeW);
    const beamM=addMat({map:coneTex,color:0xeaf2ff,opacity:.14,side:THREE.DoubleSide}), beam=new THREE.Mesh(LAMPCONE_GEO,beamM); beam.scale.set(1.1,1.8,1.1); beam.position.y=-8; beam.rotation.x=-.5; heli.add(beam);
    const spot=new THREE.Mesh(new THREE.PlaneGeometry(14,14).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:poolTex,color:0xdfe9ff,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false})); S.add(spot);
    heli.position.set(200,48,0); S.add(heli); let ht=0; const tgt=new THREE.Vector3(), hdir=new THREE.Vector3();
    EXTRA.push(dt=>{ ht+=dt; rotor.rotation.y+=dt*28; strobeR.material.opacity=(ht%1)<.12?1:.1; strobeW.material.opacity=((ht+.5)%1.3)<.08?1:.05;
      const fp=player&&player.m?player.m.group.position:null; if(!fp) return;
      player.m.group.getWorldDirection(hdir); tgt.copy(fp).addScaledVector(hdir,38); tgt.x+=Math.sin(ht*.4)*10; tgt.y=fp.y+16+Math.sin(ht*.7)*2; heli.position.lerp(tgt,1-Math.exp(-dt*1.2));
      heli.lookAt(fp.x,heli.position.y,fp.z); heli.rotateY(Math.PI); heli.rotateX(-.12);
      spot.position.set(lerp(heli.position.x,fp.x,.8),fp.y+.08,lerp(heli.position.z,fp.z,.8)); });
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
    // crowd behind the barriers on both sidewalks, phone flashes twinkling in it, four searchlights sweeping the sky
    { const R=rng(4242), ppl=[], heads=[], cols=[], step=Math.max(1,Math.round(1.1/tr.ds)), CL=[0x1a1c22,0x2a2f3a,0x6a1c1c,0x1c3a5e,0xd8d8d8,0x3a3d42,0xc9a23a,0x2a4a2a,0xff2fb4,0x2fe6ff];
      for(let i=0;i<tr.N;i+=step) [-1,1].forEach(sd=>{ if(R()>.72) return; const p=tr.pts[i], r=tr.R[i], off=sd*(W+1.3+R()*2.6), h=.85+R()*.25;
        const o={x:p.x+r.x*off,y:p.y+.16,z:p.z+r.z*off,ry:R()*6,s:1,sy:h}; ppl.push(o); heads.push({x:o.x,y:o.y+1.62*h,z:o.z}); cols.push(CL[R()*CL.length|0]); });
      instPlace(S,new THREE.CylinderGeometry(.2,.17,1.5,6).translate(0,.75,0),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.85}),ppl,cols);
      instPlace(S,new THREE.IcosahedronGeometry(.13,1),new THREE.MeshStandardMaterial({color:0x6a4a3a,roughness:.8}),heads); // perf: 80-tri heads (thousands of them), not 860
      const NF=160, fp=new Float32Array(NF*3), fc=new Float32Array(NF*3), fsrc=[]; for(let i=0;i<NF;i++){ const h=heads[R()*heads.length|0]; fsrc.push(h); fp.set([h.x,h.y+.35,h.z],i*3); }
      const fg=new THREE.BufferGeometry(); fg.setAttribute('position',new THREE.BufferAttribute(fp,3)); fg.setAttribute('color',new THREE.BufferAttribute(fc,3));
      const fl=new THREE.Points(fg,new THREE.PointsMaterial({map:glowTex,size:2.2,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false})); fl.frustumCulled=false; S.add(fl);
      const searchM=addMat({map:coneTex,color:0xdfe9ff,opacity:.1,side:THREE.DoubleSide}), piv=[];
      [[462,52],[462,-372],[-112,-372],[-112,52]].forEach(([x,z],k)=>{ const g=new THREE.Group(); g.position.set(x,2,z); const c=new THREE.Mesh(LAMPCONE_GEO,searchM); c.rotation.x=Math.PI; c.scale.set(1.2,9,1.2); c.position.y=38; g.add(c); S.add(g); piv.push({g,ph:k*1.7}); });
      let t=0; EXTRA.push(dt=>{ t+=dt; for(let i=0;i<NF;i++){ const on=R()<.012?1:fc[i*3]*.82; fc[i*3]=fc[i*3+1]=fc[i*3+2]=on; } fg.attributes.color.needsUpdate=true;
        piv.forEach(o=>{ o.g.rotation.z=Math.sin(t*.35+o.ph)*.5; o.g.rotation.x=Math.cos(t*.27+o.ph)*.4; }); }); }
    return {canvas:cv,tex};
  }

  // flush merged city geometry
  if(trims.length) mkInst(new THREE.BoxGeometry(1,1,1),upLit(new THREE.MeshStandardMaterial({color:0x4d4a45,roughness:.8}),UPL),trims);
  Object.values(FAC).forEach(b=>{ if(!b.pos.length) return; const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(b.pos,3)); g.setAttribute('normal',new THREE.Float32BufferAttribute(b.nor,3)); g.setAttribute('uv',new THREE.Float32BufferAttribute(b.uv,2));
    S.add(new THREE.Mesh(g,b.mat)); });

  const roadHazards=C.hazards?installRoadHazards(tr,S,sNear,C.hazards,f,q,basis,nr,W):[];

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
  return {scene:S,track:tr,traffic:obst,update,sNear,koScreen:arena,roadHazards,
    cams:camAt.map(([x,z])=>({s:sNear(x,z)})),
    resetTraffic(){ [.06,.19,.3,.45,.58,.72,.86].forEach((u,i)=>{ const o=obst[i]; if(!o) return; o.dist=u*tr.L; o.x=[-3.6,3.6,0,-3.6,3.6,0,-3.6][i]; o.v=12+R_()*4; }); }};
}

/* ---------------- EVENTS 11-14: bespoke open-air scenes on one shared kit ----------------
   Ideas from the level recon (all Green in the vetting pass, ideas only, no code copied):
   crowd boost pads + a low-grip ice strip  lyndonxn/turbo-kart-gp (加速带, 冰面低抓地)
   crests that throw the car in the air     yjj0339/apex-horizon (腾空跳跃), stuntrally/stuntrally3 jumps
   a sky that changes during the race       duguhuangya/neon-rush-3d (动态场景), mikkel-thiemann/MikkelRacer (Tageszeit)
   laps that get harder as the race runs    tuanzi188/car (动态危险事件, 逐圈强化) */
function streetTex(o){ o=o||{}; return CT(canvasTex(256,512,(g,w,h)=>{ g.fillStyle=o.base||'#16181c'; g.fillRect(0,0,w,h);
  for(let i=0;i<6000;i++){ const v=18+Math.random()*28; g.fillStyle=`rgba(${v},${v+2},${v+6},.65)`; g.fillRect(Math.random()*w,Math.random()*h,1.6,1.6); }
  g.fillStyle=o.edge||'rgba(232,234,238,.85)'; g.fillRect(w*.03,0,4,h); g.fillRect(w*.97-4,0,4,h);
  if(o.center){ g.fillStyle=o.center; g.fillRect(w*.5-5,0,3,h); g.fillRect(w*.5+2,0,3,h); }
  else { g.fillStyle='rgba(232,234,238,.75)'; [.34,.66].forEach(u=>g.fillRect(w*u-2,0,4,h*.4)); }
  g.fillStyle='rgba(0,0,0,.22)'; for(let i=0;i<5;i++) g.fillRect(w*(.18+i*.15),0,12,h); }),true); }
function sceneKit(o){
  const S=new THREE.Scene();
  S.userData.bloom=Object.assign({strength:.9,radius:.5,threshold:.72},o.bloom||{});
  S.background=new THREE.Color(o.bg||0x0a1224); S.fog=new THREE.FogExp2(o.fog||0x151b2b,o.fogD||.0024); S.environment=ENV.street;
  if(o.dome!==false) addDome(S);
  const hemi=new THREE.HemisphereLight(o.sky||0x8fa6cc,o.ground||0x0b0d12,o.hemi||.65); S.add(hemi);
  const moon=new THREE.DirectionalLight(o.moon||0xbcd0ff,o.moonI||.35); moon.position.set(-1,2,1); S.add(moon);
  const K={S,hemi,moon,f:mkF(),q:new THREE.Quaternion(),basis:new THREE.Matrix4(),nr:new THREE.Vector3(),m4:new THREE.Matrix4(),pv:new THREE.Vector3(),one:new THREE.Vector3(1,1,1),R:rng(o.seed||7),tr:null,fac:{},extra:[]};
  K.mesh=(geo,mat,x,y,z)=>{ const m=new THREE.Mesh(geo,mat); m.position.set(x,y,z); S.add(m); return m; };
  K.box=(w,h,d,mat,x,y,z)=>K.mesh(new THREE.BoxGeometry(w,h,d),mat,x,y,z);
  K.flat=(x0,x1,z0,z1,y,mat)=>{ const g=new THREE.PlaneGeometry(x1-x0,z1-z0); g.rotateX(-Math.PI/2); return K.mesh(g,mat,(x0+x1)/2,y,(z0+z1)/2); };
  K.inst=(geo,mat,arr)=>instAll(S,geo,mat,arr);
  K.glow=(c,s,x,y,z)=>{ const g=glowSprite(c,s); g.position.set(x,y,z); S.add(g); return g; };
  K.sign=(canvas,w,h,x,y,z,ry,opts)=>{ const m=K.mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial(Object.assign({map:CT(canvas),toneMapped:false,side:THREE.DoubleSide},opts||{})),x,y,z); m.rotation.y=ry||0; return m; };
  K.track=(pts,W,H)=>{ const tr=makeTrack(pts,W,H||6); K.tr=tr; K.W=tr.W; return tr; };
  K.sNear=(x,z)=>{ const tr=K.tr; let bi=0,bd=1e18; for(let k=0;k<tr.N;k++){ const p=tr.pts[k], d=(p.x-x)*(p.x-x)+(p.z-z)*(p.z-z); if(d<bd){ bd=d; bi=k; } } return bi*tr.ds; };
  K.at=(s,x,dy)=>{ frame(s,K.f,K.tr); orientQ(K.f,K.q,K.basis,K.nr); return K.pv.copy(K.f.p).addScaledVector(K.f.r,x||0).setY(K.f.p.y+(dy||0)); };
  // road, curbs, sidewalks; skip(p) leaves the sidewalk off (bridges, tunnels)
  K.road=(opts)=>{ opts=opts||{}; const tr=K.tr, W=tr.W;
    const mat=wetRoad(new THREE.MeshStandardMaterial({map:streetTex(opts.tex),roughness:.45,metalness:.15,side:THREE.DoubleSide}));
    ribbon(tr,S,-W-.3,W+.3,.01,.01,mat,24);
    if(opts.studs!==false){ const yc=opts.tex&&opts.tex.center; roadStuds(tr,S,yc?[0]:[.34,.66].map(u=>-W-.3+(2*W+.6)*u),yc?0xb08030:0x9098a4,yc?11:9); } // amber between a double yellow
    const walkM=new THREE.MeshStandardMaterial({color:opts.walk||0x3a3d44,roughness:.9,side:THREE.DoubleSide}), curbM=new THREE.MeshStandardMaterial({color:opts.curb||0x6e737c,roughness:.85,side:THREE.DoubleSide});
    const sk=opts.skip||(()=>false);
    [-1,1].forEach(sd=>{ ribbonF(tr,S,walkM,(k,p)=>sk(p,k)?null:[sd*(W+.3),p.y+.16,sd*(W+4.5),p.y+.16]); ribbonF(tr,S,curbM,(k,p)=>sk(p,k)?null:[sd*(W+.3),p.y,sd*(W+.3),p.y+.16]);
      if(opts.skirt) ribbonF(tr,S,opts.skirt,(k,p)=>sk(p,k)?null:[sd*(W+4.5),p.y+.16,sd*(W+16),p.y-2.2]); });
    K.roadMat=mat; K.walkM=walkM; K.curbM=curbM; return mat; };
  // street lights along the course; returns the materials so a level can dim them (First Light)
  K.lights=(opts)=>{ opts=opts||{}; const tr=K.tr, W=tr.W, f=K.f, q=K.q, pv=K.pv, m4=K.m4, one=K.one, sk=opts.skip||(()=>false);
    const poleM=new THREE.MeshStandardMaterial({color:opts.pole||0x2a2e35,metalness:.7,roughness:.4}), lampM=new THREE.MeshBasicMaterial({color:opts.color||0xeaf2ff,toneMapped:false});
    const poles=[],arms=[],heads=[],pools=[],flare=[],st=[];
    for(let s=opts.from||10;s<tr.L;s+=opts.every||32){ frame(s,f,tr); if(sk(f.p,s)) continue; orientQ(f,q,K.basis,K.nr);
      (opts.sides||[-1,1]).forEach(sd=>{ const b=f.p.clone().addScaledVector(f.r,sd*(W+3.4));
        pv.copy(b); pv.y+=4.5; m4.compose(pv,q,one); poles.push(m4.clone());
        pv.copy(b).addScaledVector(f.r,-sd*1.7); pv.y+=9; m4.compose(pv,q,one); arms.push(m4.clone());
        pv.copy(b).addScaledVector(f.r,-sd*3.4); pv.y+=8.85; m4.compose(pv,q,one); heads.push(m4.clone()); flare.push(pv.x,pv.y-.15,pv.z);
        pv.y=f.p.y+.05; m4.compose(pv,new THREE.Quaternion(),one); pools.push(m4.clone()); m4.compose(pv,q,one); st.push(m4.clone()); }); }
    K.inst(new THREE.CylinderGeometry(.14,.2,9,8),poleM,poles); K.inst(new THREE.BoxGeometry(3.6,.14,.2),poleM,arms); K.inst(new THREE.BoxGeometry(1.1,.2,.5),lampM,heads);
    const poolGeo=new THREE.PlaneGeometry(15,15); poolGeo.rotateX(-Math.PI/2);
    const poolM=fogAdd(new THREE.MeshBasicMaterial({map:lampPoolTex,color:opts.pool||0x7a8fb8,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false})); poolGeo.scale(1.35,1,1.35); // inverse-square pool, fades into the haze
    K.inst(poolGeo,poolM,pools); const streaks=lampStreaks(S,st), cones=lampCones(S,heads,opts.color?heads.map(()=>new THREE.Color(opts.color)):null);
    const fl=new THREE.BufferGeometry(); fl.setAttribute('position',new THREE.Float32BufferAttribute(flare,3));
    const flareM=new THREE.PointsMaterial({map:glowTex,color:opts.color||0xdfe9ff,size:3,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}); S.add(new THREE.Points(fl,flareM));
    return {poleM,lampM,poolM,flareM,streaks,cones}; };
  K.gantry=(s,l1,l2,o2)=>{ const W=K.tr.W; K.at(s,0); const f=K.f, poleM=new THREE.MeshStandardMaterial({color:0x08090b,metalness:.4,roughness:.55});
    [-1,1].forEach(sd=>{ const p=f.p.clone().addScaledVector(f.r,sd*(W+2)); K.box(.4,9.6,.4,poleM,p.x,f.p.y+4.8,p.z); });
    const beam=K.box(2*W+4.4,.4,.4,poleM,f.p.x,f.p.y+9.6,f.p.z); beam.quaternion.copy(K.q);
    const sg=new THREE.Mesh(new THREE.PlaneGeometry(10,3.1),new THREE.MeshBasicMaterial({map:CT(signCanvas2(l1,l2,o2)),toneMapped:false}));
    sg.position.set(f.p.x,f.p.y+7.8,f.p.z); sg.quaternion.copy(K.q); sg.rotateY(Math.PI); S.add(sg); return sg; };
  K.start=(banner)=>{ const W=K.tr.W; K.at(0,0); const f=K.f; addStartLine(S,f,K.q,2*W);
    const red=new THREE.MeshBasicMaterial({color:0xff2a3a,toneMapped:false});
    [-1,1].forEach(sd=>{ const p=f.p.clone().addScaledVector(f.r,sd*(W+1.6)); K.box(.5,8.4,.5,blackM,p.x,f.p.y+4.2,p.z); });
    const beam=K.box(2*W+3.6,.5,.5,red,f.p.x,f.p.y+8.4,f.p.z); beam.quaternion.copy(K.q);
    const ban=new THREE.Mesh(new THREE.PlaneGeometry(10,1.4),new THREE.MeshBasicMaterial({map:CT(signCanvas('AFTERHOURS  ·  '+banner,{bg:'#07080a',color:'#f4f7ff',size:50})),toneMapped:false}));
    ban.position.set(f.p.x,f.p.y+7.2,f.p.z); ban.quaternion.copy(K.q); ban.rotateY(Math.PI); S.add(ban); };
  // merged night buildings at any angle: facades from facadeTex, one draw call per style
  K.facM=(style)=>{ if(!K.fac[style]){ const t=facadeTex(style); K.fac[style]={mat:new THREE.MeshStandardMaterial({map:t.map,emissive:0xffffff,emissiveMap:t.emis,emissiveIntensity:.95,roughness:style==='glass'?.35:.85,metalness:style==='glass'?.5:.05}),pos:[],nor:[],uv:[]}; }
    return K.fac[style]; };
  const roofB={mat:new THREE.MeshStandardMaterial({color:0x0b0c0f,roughness:1}),pos:[],nor:[],uv:[]};
  const quad=(b,A,B,C,D,n,uv)=>{ const e1=[B[0]-A[0],B[1]-A[1],B[2]-A[2]], e2=[D[0]-A[0],D[1]-A[1],D[2]-A[2]], cr=[e1[1]*e2[2]-e1[2]*e2[1],e1[2]*e2[0]-e1[0]*e2[2],e1[0]*e2[1]-e1[1]*e2[0]];
    const flip=cr[0]*n[0]+cr[1]*n[1]+cr[2]*n[2]<0, [a,bb,c,d]=flip?[A,D,C,B]:[A,B,C,D], [ua,ub,uc,ud]=flip?[uv[0],uv[3],uv[2],uv[1]]:uv;
    b.pos.push(...a,...bb,...c,...a,...c,...d); for(let i=0;i<6;i++) b.nor.push(...n); b.uv.push(...ua,...ub,...uc,...ua,...uc,...ud); };
  K.obox=(style,cx,cz,yaw,w,d,h,y0)=>{ y0=y0||0; const b=K.facM(style), c=Math.cos(yaw), s=Math.sin(yaw), T=32, uo=(K.R()*8|0)/8, y1=y0+h;
    const P=(lx,lz)=>[cx+lx*c+lz*s,cz-lx*s+lz*c], pts=[P(-w/2,-d/2),P(w/2,-d/2),P(w/2,d/2),P(-w/2,d/2)];
    for(let i=0;i<4;i++){ const a=pts[i], e=pts[(i+1)%4], len=Math.hypot(e[0]-a[0],e[1]-a[1]), mx=(a[0]+e[0])/2-cx, mz=(a[1]+e[1])/2-cz, ml=Math.hypot(mx,mz)||1;
      quad(b,[a[0],y0,a[1]],[e[0],y0,e[1]],[e[0],y1,e[1]],[a[0],y1,a[1]],[mx/ml,0,mz/ml],[[uo,y0/T],[uo+len/T,y0/T],[uo+len/T,y1/T],[uo,y1/T]]); }
    quad(roofB,[pts[0][0],y1,pts[0][1]],[pts[1][0],y1,pts[1][1]],[pts[2][0],y1,pts[2][1]],[pts[3][0],y1,pts[3][1]],[0,1,0],[[0,0],[1,0],[1,1],[0,1]]); };
  // a distant skyline: towers drawn without fog so they read as a silhouette of lit windows on the horizon
  // (keep them inside the camera's 1600 m far plane)
  K.skyline=(o)=>{ if(!K.fac.skyfar){ const t=facadeTex('glass'); K.fac.skyfar={mat:new THREE.MeshStandardMaterial({map:t.map,emissive:0xffffff,emissiveMap:t.emis,emissiveIntensity:.55,roughness:.35,metalness:.5,fog:false}),pos:[],nor:[],uv:[]}; }
    const R=rng(o.seed||11), tops=[];
    for(let i=0;i<o.n;i++){ const u=(R()-.5)*2, v=(R()-.5)*2, core=1-Math.abs(u)*.7, h=(o.h[0]+(o.h[1]-o.h[0])*Math.pow(R(),1.6))*core, wd=o.wd||[22,48], w=wd[0]+R()*(wd[1]-wd[0]), d=wd[0]+R()*(wd[1]-wd[0])*.8;
      const x=o.cx+u*o.sx, z=o.cz+v*o.sz; K.obox('skyfar',x,z,(R()-.5)*.3,w,d,h,0); if(h>o.h[1]*.6) tops.push([x,h,z]); }
    tops.forEach(([x,h,z])=>{ const g=glowSprite(0xff2a2a,7); g.position.set(x,h+3,z); g.material.fog=false; S.add(g); }); };
  // a row of buildings facing the road on one side, from s0 to s1 (setback measured from the centerline)
  // true when a footprint (center c, length along t, depth along r) keeps every corner and edge midpoint off the
  // road and sidewalk: frontage on the inside of a bend (or near another leg of the loop) would otherwise sit on it
  K.clearOf=(c,t,r,len,dep,min)=>{ const tr=K.tr, m2=min*min;
    for(const [a,b] of [[-1,-1],[-1,1],[1,-1],[1,1],[0,-1],[0,1],[-1,0],[1,0]]){ const x=c.x+t.x*a*len/2+r.x*b*dep/2, z=c.z+t.z*a*len/2+r.z*b*dep/2;
      for(let k=0;k<tr.N;k+=2){ const p=tr.pts[k], dx=p.x-x, dz=p.z-z; if(dx*dx+dz*dz<m2) return false; } } return true; };
  K.frontage=(s0,s1,side,o2)=>{ o2=o2||{}; const W=K.tr.W; let s=s0;
    while(s<s1){ const len=(o2.len||[14,26])[0]+K.R()*((o2.len||[14,26])[1]-(o2.len||[14,26])[0]); const sm=s+len/2; K.at(sm,side*(W+(o2.set||6)));
      const yaw=Math.atan2(K.f.t.x,K.f.t.z), dep=(o2.dep||[12,20])[0]+K.R()*((o2.dep||[12,20])[1]-(o2.dep||[12,20])[0]), h=(o2.h||[8,16])[0]+K.R()*((o2.h||[8,16])[1]-(o2.h||[8,16])[0]);
      const c=K.pv.clone().addScaledVector(K.f.r,side*dep/2), st=o2.styles||['brick','stone'];
      if((!o2.gap||K.R()>o2.gap)&&K.clearOf(c,K.f.t,K.f.r,len-1.2,dep,W+4.4)) K.obox(st[(K.R()*st.length)|0],c.x,c.z,yaw,dep,len-1.2,h,(o2.y0!==undefined?o2.y0:K.f.p.y-.5));
      s+=len+(o2.space||1); } };
  K.flush=()=>{ Object.values(K.fac).concat([roofB]).forEach(b=>{ if(!b.pos.length) return; const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(b.pos,3)); g.setAttribute('normal',new THREE.Float32BufferAttribute(b.nor,3)); g.setAttribute('uv',new THREE.Float32BufferAttribute(b.uv,2));
    S.add(new THREE.Mesh(g,b.mat)); }); };
  K.traffic=(n,cols)=>{ const obst=[]; cols=cols||[0xd2b23a,0x2a2f38,0xcfd2d8,0x1c3a5a,0x6b1d1d,0xe8e8e8];
    for(let i=0;i<n;i++){ const c=buildTrafficCar(cols[i%cols.length]); S.add(c.group); obst.push({tr:true,m:c,dist:0,x:0,v:14,vx:0,hitCd:0,isP:false,yaw:0,steer:0}); } return obst; };
  return K;
}
// a simple loop through (x,z) control points, spaced ~1 m for makeTrack
function loopPts(ctrl,yf){ const c=new THREE.CatmullRomCurve3(ctrl.map(p=>new THREE.Vector3(p[0],0,p[1])),true,'centripetal'), N=Math.round(c.getLength());
  return c.getSpacedPoints(N).slice(0,N).map(p=>{ p.y=yf?yf(p.x,p.z):0; return p; }); }

/* ---- Event 10: Game Night, the South Philly Sports Complex ----
   Broad St south, Zinkoff Blvd through the arena's ice tunnel, 11th St, Pattison Ave between the football
   stadium and the ballpark (live Jumbotron overhead), Darien St, then Packer Ave past the tailgate lots.
   Every team in town has a Crowd Roar pad in its colors; the ballpark fires off the fireworks on a lead change. */
const SPORTS={birds:{css:'#18b3a6',c:0x18b3a6,chant:'GO BIRDS'},phils:{css:'#e81828',c:0xe81828,chant:'RING THE BELL'},sixers:{css:'#1d6fd6',c:0x1d6fd6,chant:'TRUST THE PROCESS'},
  flyers:{css:'#f74902',c:0xf74902,chant:'LET\'S GO FLYERS'},union:{css:'#d8bf7a',c:0xd8bf7a,chant:'DOOP DOOP DOOP'}};
const NEON_SPORTS={pulse:{css:'#ff2fb4',c:0xff2fb4,chant:'PULSE GRID'},sync:{css:'#2fe6ff',c:0x2fe6ff,chant:'GHOST SYNC'},void:{css:'#b45cff',c:0xb45cff,chant:'VOID DRIFT'}};
function padSport(team){ return SPORTS[team]||NEON_SPORTS[team]; }
// real team palettes for the buildings (SPORTS.*.c stays the bright pad / firework color)
const TEAM_PAL={sixers:['#006bb6','#ed174c','#ffffff'],flyers:['#f74902','#0b0b0d','#ffffff'],birds:['#004c54','#a5acaf','#0b0b0d'],phils:['#e81828','#002d72','#ffffff']};
/* stadium marks: close to each club's look (colors, shapes, lettering style) without copying the actual logos */
const EMBLEM_CACHE={};
function teamEmblem(team){ if(EMBLEM_CACHE[team]) return EMBLEM_CACHE[team]; const P=TEAM_PAL[team];
  return EMBLEM_CACHE[team]=canvasTex(256,256,(g,w,h)=>{ g.fillStyle='#05070a'; g.fillRect(0,0,w,h); const cx=w/2, cy=h/2;
    const star=(x,y,r,c)=>{ g.fillStyle=c; g.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r*.45:r; g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr); } g.closePath(); g.fill(); };
    if(team==='sixers'){ // blue ball, red seams, ring of stars, "76"
      g.fillStyle=P[0]; g.beginPath(); g.arc(cx,cy,104,0,7); g.fill(); g.strokeStyle=P[2]; g.lineWidth=6; g.stroke();
      for(let i=0;i<13;i++){ const a=i/13*Math.PI*2-Math.PI/2; star(cx+Math.cos(a)*86,cy+Math.sin(a)*86,9,P[2]); }
      g.fillStyle=P[1]; g.beginPath(); g.arc(cx,cy,62,0,7); g.fill(); g.strokeStyle='#0b0b0d'; g.lineWidth=3; g.beginPath(); g.moveTo(cx-62,cy); g.lineTo(cx+62,cy); g.moveTo(cx,cy-62); g.lineTo(cx,cy+62); g.stroke();
      g.fillStyle=P[2]; g.font='900 64px "Arial Black",Arial,sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('76',cx,cy+4); }
    else if(team==='flyers'){ // orange "P" on its side with speed wings and a dot
      g.fillStyle=P[1]; g.beginPath(); g.arc(cx,cy,110,0,7); g.fill(); g.strokeStyle=P[0]; g.lineWidth=5; g.stroke();
      g.fillStyle=P[0]; for(let k=0;k<4;k++){ g.beginPath(); g.moveTo(34+k*6,96+k*22); g.lineTo(150,96+k*22); g.lineTo(150,110+k*22); g.lineTo(46+k*6,110+k*22); g.closePath(); g.fill(); }
      g.beginPath(); g.moveTo(120,60); g.lineTo(186,60); g.bezierCurveTo(232,60,232,150,186,150); g.lineTo(150,150); g.lineTo(150,200); g.lineTo(120,200); g.closePath(); g.fill();
      g.fillStyle=P[1]; g.beginPath(); g.arc(172,105,22,0,7); g.fill(); g.fillStyle=P[0]; g.beginPath(); g.arc(172,105,11,0,7); g.fill(); }
    else if(team==='birds'){ // midnight green disc, silver-white eagle head in profile facing left
      g.fillStyle=P[0]; g.beginPath(); g.arc(cx,cy,110,0,7); g.fill(); g.strokeStyle=P[1]; g.lineWidth=7; g.stroke();
      g.fillStyle='#f4f7f6'; g.beginPath(); g.moveTo(46,122); g.bezierCurveTo(70,78,120,56,168,62); g.bezierCurveTo(200,66,214,92,206,120);
      g.lineTo(226,150); g.bezierCurveTo(200,146,190,176,196,206); g.bezierCurveTo(150,186,118,160,100,148); g.lineTo(46,150); g.bezierCurveTo(60,140,62,130,46,122); g.closePath(); g.fill();
      g.fillStyle=P[1]; g.beginPath(); g.moveTo(46,122); g.lineTo(96,128); g.lineTo(46,150); g.bezierCurveTo(60,140,62,130,46,122); g.fill(); // beak
      g.fillStyle=P[0]; g.beginPath(); g.moveTo(104,98); g.lineTo(138,92); g.lineTo(118,108); g.closePath(); g.fill(); // eye
      g.strokeStyle=P[1]; g.lineWidth=4; for(let k=0;k<3;k++){ g.beginPath(); g.moveTo(150+k*14,112+k*6); g.lineTo(210-k*4,130+k*14); g.stroke(); } }
    else { // phils: cream field, red script-style P, navy star
      g.fillStyle='#f6f1e6'; g.beginPath(); g.arc(cx,cy,110,0,7); g.fill(); g.strokeStyle=P[1]; g.lineWidth=6; g.stroke();
      g.save(); g.translate(cx+6,cy+10); g.transform(1,0,-.28,1,0,0); g.fillStyle=P[0]; g.font='italic 900 190px Georgia,"Times New Roman",serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('P',0,0); g.restore();
      star(cx+44,cy-30,18,P[1]); }
  }); }
function padCanvas(team){ const T=SPORTS[team]; return canvasTex(256,256,(g,w,h)=>{ g.fillStyle='rgba(0,0,0,0)'; g.clearRect(0,0,w,h);
  g.strokeStyle=T.css; g.lineWidth=10; g.shadowColor=T.css; g.shadowBlur=18; g.strokeRect(12,12,w-24,h-24);
  g.fillStyle=T.css; for(let k=0;k<3;k++){ const y=190-k*58; g.beginPath(); g.moveTo(40,y); g.lineTo(128,y-44); g.lineTo(216,y); g.lineTo(216,y-16); g.lineTo(128,y-60); g.lineTo(40,y-16); g.closePath(); g.fill(); } }); }
function buildGameNight(){
  const K=sceneKit({bg:0x0a1020,fog:0x141a2a,fogD:.0021,hemi:.75,bloom:{strength:1,radius:.55,threshold:.68},seed:1948}), S=K.S, V=(x,z)=>new THREE.Vector2(x,z);
  const tr=K.track(resample3(filletPath(V(0,-240),[[0,340,30],[450,340,30],[450,90,28],[820,90,28],[820,-310,30],[360,-310,24],[290,-240,24]].map(([x,z,r])=>[V(x,z),r]),1),()=>0),7,6), W=tr.W;
  K.flat(-700,1500,-900,1000,-.03,new THREE.MeshStandardMaterial({color:0x0c0e12,roughness:.95,metalness:.05}));
  K.road({tex:{center:'rgba(255,196,60,.85)'}}); K.start('EVENT 10 · GAME NIGHT');
  K.skyline({cx:360,cz:-1010,sx:300,sz:110,n:34,h:[40,240],seed:1682}); // Center City, straight up Broad St
  K.lights({every:30,color:0xf2f6ff,pool:0x8fa2c8});
  const lotM=new THREE.MeshStandardMaterial({color:0x1b1e24,roughness:.8}), concrete=new THREE.MeshStandardMaterial({color:0x6c7078,roughness:.9,side:THREE.DoubleSide});
  const glowM=c=>new THREE.MeshBasicMaterial({color:c,toneMapped:false});
  const shaftM=addMat({map:coneTex,color:0xeaf2ff,opacity:.07,side:THREE.DoubleSide}), UPV=new THREE.Vector3(0,1,0);
  const mast=(x,z,h,c,tx,tz)=>{ K.box(1.2,h,1.2,concrete,x,h/2,z); K.box(7,3.4,1,glowM(0xf4f8ff),x,h,z); K.glow(c||0xeaf4ff,20,x,h,z);
    if(tx===undefined) return; // volumetric shaft from the light bank down onto the field (threejs-lighting: fake it, no real spot)
    const d=new THREE.Vector3(tx-x,-h+2,tz-z), len=d.length(); d.normalize();
    const cone=new THREE.Mesh(new THREE.CylinderGeometry(len*.2,1.6,len,20,1,true),shaftM); cone.quaternion.setFromUnitVectors(UPV,d); cone.position.set(x+d.x*len/2,h+d.y*len/2,z+d.z*len/2); S.add(cone); };
  // ---- helpers: rounded-rectangle footprints extruded upward, facade textures with lit concourses ----
  const rrShape=(w,d,r)=>{ const sh=new THREE.Shape(), x=w/2, z=d/2; sh.moveTo(-x+r,-z); sh.lineTo(x-r,-z); sh.quadraticCurveTo(x,-z,x,-z+r); sh.lineTo(x,z-r); sh.quadraticCurveTo(x,z,x-r,z);
    sh.lineTo(-x+r,z); sh.quadraticCurveTo(-x,z,-x,z-r); sh.lineTo(-x,-z+r); sh.quadraticCurveTo(-x,-z,-x+r,-z); return sh; };
  const upExtrude=(sh,h)=>{ const g=new THREE.ExtrudeGeometry(sh,{depth:h,bevelEnabled:false,curveSegments:10}); g.rotateX(-Math.PI/2); return g; }; // footprint in x/z, rises 0..h
  const ribbon=(w,d,r,t,y,col)=>{ const o=rrShape(w+t,d+t,r+t/2); o.holes.push(rrShape(w-.2,d-.2,r)); const m=new THREE.Mesh(upExtrude(o,.9),glowM(col)); return m; };
  const facade=(draw,rx,ry)=>{ const map=CT(canvasTex(256,128,(g,w,h)=>draw(g,w,h,false)),true), em=CT(canvasTex(256,128,(g,w,h)=>draw(g,w,h,true)),true);
    [map,em].forEach(t=>t.repeat.set(rx,ry)); return {map,em}; };
  const screen=(x,y,z,w,h,ry,tex)=>{ const m=K.mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,toneMapped:false}),x,y,z); m.rotation.y=ry; return m; };
  // ---- the arena (Sixers + Flyers): rounded glass-and-stone box, LED ribbons, corner screens; the ice tunnel under its loading deck on Zinkoff ----
  const A={x:225,z:200}, AW=128, AD=100, AR=22;
  const glassF=facade((g,w,h,em)=>{ g.fillStyle=em?'#000':'#0d1624'; g.fillRect(0,0,w,h);
    g.fillStyle=em?'#ffd9a0':'#3a4a60'; g.fillRect(0,h*.22,w,h*.42); if(em){ g.fillStyle='#fff1d6'; for(let i=0;i<14;i++) g.fillRect(Math.random()*w,h*.3,6+Math.random()*10,h*.26); }
    g.fillStyle=em?'#000':'#1a2230'; for(let x=0;x<w;x+=16) g.fillRect(x,0,3,h); },1/16,1/10);
  const stoneF=facade((g,w,h,em)=>{ g.fillStyle=em?'#000':'#b8a88c'; g.fillRect(0,0,w,h); if(em) return; g.fillStyle='rgba(60,50,40,.35)'; for(let y=0;y<h;y+=16) g.fillRect(0,y,w,2); for(let x=0;x<w;x+=64) g.fillRect(x,0,2,h); },1/24,1/18);
  K.mesh(upExtrude(rrShape(AW,AD,AR),10),new THREE.MeshStandardMaterial({map:glassF.map,emissive:0xffffff,emissiveMap:glassF.em,emissiveIntensity:.9,roughness:.25,metalness:.5}),A.x,0,A.z);
  K.mesh(upExtrude(rrShape(AW+3,AD+3,AR+1.5),18),new THREE.MeshStandardMaterial({map:stoneF.map,roughness:.85}),A.x,10,A.z);
  K.mesh(upExtrude(rrShape(AW+6,AD+6,AR+3),1.4),new THREE.MeshStandardMaterial({color:0x1a1e25,roughness:.7,metalness:.3}),A.x,28,A.z); // flat roof with a lip
  K.mesh(upExtrude(rrShape(AW-30,AD-30,AR),4),new THREE.MeshStandardMaterial({color:0x252a32,roughness:.8}),A.x,29.4,A.z);             // roof plant
  [[TEAM_PAL.flyers[0],26.4],[TEAM_PAL.sixers[0],12.4],[TEAM_PAL.sixers[1],11.2]].forEach(([c,y])=>{ const r=ribbon(AW+3,AD+3,AR+1.5,.9,y,new THREE.Color(c)); r.position.set(A.x,y,A.z); S.add(r); });
  const scrT={sixers:CT(teamEmblem('sixers')),flyers:CT(teamEmblem('flyers'))}, arenaScr=[];
  [[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([sx,sz],i)=>{ const x=A.x+sx*(AW/2-AR*.29+3.6), z=A.z+sz*(AD/2-AR*.29+3.6); // clear of the curved corner (a flat panel's edges sag ~1.2 m into it)
    arenaScr.push(screen(x,19,z,15,15,Math.atan2(sx,sz),i%2?scrT.flyers:scrT.sixers)); });
  K.sign(signCanvas2('SOUTH PHILLY ARENA','SIXERS · FLYERS · TONIGHT',{bg:'#0b1220',color:TEAM_PAL.flyers[0]}),40,9,A.x-AW/2-1.6,19,A.z,-Math.PI/2);
  K.sign(signCanvas2('THE ARENA','HOME OF THE SIXERS & FLYERS',{bg:'#0b1220',color:'#9fc8ff'}),40,9,A.x,19,A.z+AD/2+1.6,0);
  const deckM=new THREE.MeshStandardMaterial({color:0x2a2f38,roughness:.7,metalness:.3});
  K.box(140,1.6,34,deckM,235,7.6,340); K.box(140,.3,1,glowM(0x6fd8ff),235,6.7,324); K.box(140,.3,1,glowM(0x6fd8ff),235,6.7,356);
  for(let x=170;x<=300;x+=26) [324,356].forEach(z=>K.box(1.4,7,1.4,concrete,x,3.5,z));
  const tunLights=[]; for(let x=172;x<300;x+=9){ K.box(.4,.1,5,glowM(0xcff4ff),x,6.75,337); K.box(.4,.1,5,glowM(0xcff4ff),x,6.75,343); tunLights.push(x); }
  const iceTex=CT(canvasTex(256,256,(g,w,h)=>{ g.fillStyle='#dff4ff'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(120,170,210,.55)'; g.lineWidth=1.2;
    for(let i=0;i<90;i++){ g.beginPath(); const x=Math.random()*w, y=Math.random()*h; g.moveTo(x,y); g.bezierCurveTo(x+40*Math.random(),y+20*Math.random(),x+80*Math.random(),y-20*Math.random(),x+120*Math.random(),y+10*Math.random()); g.stroke(); }
    g.fillStyle='rgba(214,24,44,.7)'; g.fillRect(0,h/2-4,w,8); g.fillStyle='rgba(29,111,214,.7)'; g.fillRect(0,h*.2,w,5); g.fillRect(0,h*.8,w,5); }),true);
  iceTex.repeat.set(1,6);
  const ice=K.flat(175,295,333,347,.03,new THREE.MeshStandardMaterial({map:iceTex,roughness:.04,metalness:.25,transparent:true,opacity:.82,envMapIntensity:2})); ice.material.map.rotation=Math.PI/2;
  K.sign(signCanvas2('ZAMBONI TUNNEL','ICE ON THE ROAD · EASY ON IT',{bg:'#0a1a2a',color:'#bfeaff'}),14,4.4,165,4.6,340,-Math.PI/2);
  // ---- the football stadium (Birds): oval bowl in midnight-green glass, the two swept silver wing canopies over the
  //      sidelines, end-zone video boards, a striped field with green end zones ----
  const L={x:640,z:250}, LA=96, LB=74, bowlH=26;
  const greenF=facade((g,w,h,em)=>{ g.fillStyle=em?'#000':TEAM_PAL.birds[0]; g.fillRect(0,0,w,h); g.fillStyle=em?'#0a3a36':'#0f6a70'; g.fillRect(0,h*.15,w,h*.55);
    if(em){ g.fillStyle='#bff3ea'; for(let i=0;i<10;i++) g.fillRect(Math.random()*w,h*.25,5,h*.3); }
    g.fillStyle=em?'#000':'#a5acaf'; for(let x=0;x<w;x+=22) g.fillRect(x,0,4,h); },40,1);
  { const f=new THREE.CylinderGeometry(1,1,bowlH,72,1,true); f.scale(LA,1,LB); K.mesh(f,new THREE.MeshStandardMaterial({map:greenF.map,emissive:0xffffff,emissiveMap:greenF.em,emissiveIntensity:.8,roughness:.35,metalness:.5,side:THREE.DoubleSide}),L.x,bowlH/2,L.z);
    const seats=new THREE.CylinderGeometry(.97,.6,bowlH-2,72,1,true); seats.scale(LA,1,LB); K.mesh(seats,new THREE.MeshStandardMaterial({color:0x1d4a4e,roughness:.85,side:THREE.DoubleSide}),L.x,bowlH/2+1,L.z);
    const rim=new THREE.TorusGeometry(1,.012,6,96); rim.rotateX(Math.PI/2); rim.scale(LA+.4,1,LB+.4); [[bowlH,SPORTS.birds.c],[9,0xc8d0d6]].forEach(([y,c])=>K.mesh(rim.clone(),glowM(c),L.x,y,L.z)); }
  { const fc=canvasTex(512,224,(g,w,h)=>{ for(let i=0;i<12;i++){ g.fillStyle=i%2?'#1e7a38':'#228a40'; g.fillRect(i*w/12,0,w/12+1,h); }
      g.fillStyle=TEAM_PAL.birds[0]; g.fillRect(0,0,w*.09,h); g.fillRect(w*.91,0,w*.09,h);
      g.strokeStyle='rgba(255,255,255,.85)'; g.lineWidth=2; g.strokeRect(2,6,w-4,h-12); for(let i=1;i<10;i++){ const x=w*.09+i*w*.082; g.beginPath(); g.moveTo(x,6); g.lineTo(x,h-6); g.stroke(); }
      g.fillStyle='#f4f7f6'; g.font='900 30px "Arial Black",Arial,sans-serif'; g.textAlign='center'; g.textBaseline='middle';
      [[w*.045,-1],[w*.955,1]].forEach(([x,r])=>{ g.save(); g.translate(x,h/2); g.rotate(r*Math.PI/2); g.fillText('BIRDS',0,0); g.restore(); });
      g.drawImage(teamEmblem('birds'),w/2-44,h/2-44,88,88); });
    const field=K.mesh(new THREE.PlaneGeometry(112,49),new THREE.MeshStandardMaterial({map:CT(fc),emissive:0xffffff,emissiveMap:CT(fc),emissiveIntensity:.35,roughness:.9}),L.x,1.2,L.z); field.rotation.x=-Math.PI/2; }
  // the wings: a silver canopy over each sideline that sweeps up at both ends (the Linc's signature silhouette)
  { const wingM=new THREE.MeshStandardMaterial({color:0xb4bcc4,metalness:.75,roughness:.28,side:THREE.DoubleSide,emissive:0x0c2a2c});
    [-1,1].forEach(sd=>{ const n=28, pos=[], idx=[], edge=[];
      for(let i=0;i<=n;i++){ const u=i/n*2-1, x=L.x+u*LA*.92, lift=u*u;
        pos.push(x,bowlH+2+lift*9,L.z+sd*(LB*.62-lift*6), x,bowlH+7+lift*16,L.z+sd*(LB+6-lift*10)); edge.push(new THREE.Vector3(x,bowlH+2+lift*9,L.z+sd*(LB*.62-lift*6)));
        if(i<n){ const a=i*2; idx.push(a,a+1,a+2,a+1,a+3,a+2); } }
      const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setIndex(idx); g.computeVertexNormals(); S.add(new THREE.Mesh(g,wingM));
      S.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(edge),48,.45,6,false),glowM(SPORTS.birds.c))); // lit leading edge
      for(let u=-.7;u<=.71;u+=.35){ const x=L.x+u*LA*.92; K.box(1.2,bowlH+8,1.2,wingM,x,(bowlH+8)/2,L.z+sd*(LB+3)); } }); }
  { const eb=CT(canvasTex(512,224,(g,w,h)=>{ g.fillStyle='#05070a'; g.fillRect(0,0,w,h); g.drawImage(teamEmblem('birds'),14,12,200,200);
      g.fillStyle='#f4f7f6'; g.font='900 52px "Arial Narrow",Arial,sans-serif'; g.textAlign='left'; g.textBaseline='middle'; g.fillText('GO BIRDS',228,88,270);
      g.fillStyle='#a5acaf'; g.font='800 28px "Arial Narrow",Arial,sans-serif'; g.fillText('FLY · EAGLES · FLY',236,150); }));
    [-1,1].forEach(sd=>{ const x=L.x+sd*(LA-8); screen(x,bowlH+10,L.z,30,13,sd>0?-Math.PI/2:Math.PI/2,eb); [-10,10].forEach(o=>K.box(1,bowlH+4,1,concrete,x+sd*.8,(bowlH+4)/2,L.z+o)); }); }
  for(let k=0;k<6;k++){ const a=k/6*Math.PI*2+.26; mast(L.x+Math.cos(a)*(LA+10),L.z+Math.sin(a)*(LB+10),44,0xeaf4ff,L.x+Math.cos(a)*30,L.z+Math.sin(a)*20); }
  { const gl=glowSprite(0xdfe9ff,320); gl.material.fog=false; gl.material.opacity=.35; gl.position.set(L.x,60,L.z); S.add(gl); }
  K.sign(signCanvas2('GO BIRDS','E · A · G · L · E · S',{bg:'#003a40',color:'#dff7f4'}),30,9,L.x,bowlH-9,L.z-LB-1.2,Math.PI); // on the facade, under the wing
  // ---- the ballpark (Phils): red brick wall with arches, red seats around the plate, the diamond, a navy outfield wall,
  //      the scoreboard in left-center and the neon Liberty Bell that swings on a lead change ----
  // home plate at B, the field fans out toward -z (theta around PI in three's cylinder angles; CircleGeometry/RingGeometry
  // angles live in the xy plane, so the same direction is theta PI/2 there), the seats wrap the plate on the +z side
  const B={x:620,z:-110}, seatM=new THREE.MeshStandardMaterial({color:0x5e0c16,roughness:.8,side:THREE.DoubleSide});
  const brickF=facade((g,w,h,em)=>{ g.fillStyle=em?'#000':'#7a2a1e'; g.fillRect(0,0,w,h); if(!em){ g.fillStyle='rgba(30,10,8,.35)'; for(let y=0;y<h;y+=6) g.fillRect(0,y,w,1); }
      for(let x=18;x<w;x+=64){ g.fillStyle=em?'#ffcf9a':'#2a0c0a'; g.beginPath(); g.moveTo(x,h); g.lineTo(x,h*.45); g.arc(x+14,h*.45,14,Math.PI,0); g.lineTo(x+28,h); g.fill(); } },26,1);
  K.mesh(new THREE.CylinderGeometry(73,73,22,48,1,true,-.66*Math.PI,1.32*Math.PI),new THREE.MeshStandardMaterial({map:brickF.map,emissive:0xffffff,emissiveMap:brickF.em,emissiveIntensity:.8,roughness:.9,side:THREE.DoubleSide}),B.x,11,B.z);
  K.mesh(new THREE.CylinderGeometry(70,32,20,40,1,true,-.66*Math.PI,1.32*Math.PI),seatM,B.x,10,B.z);
  K.mesh(new THREE.CylinderGeometry(112,104,7,30,1,true,.76*Math.PI,.48*Math.PI),seatM,B.x,3.5,B.z); // outfield bleachers
  { const rim=new THREE.Mesh(new THREE.TorusGeometry(73.2,.5,6,60,1.32*Math.PI),glowM(SPORTS.phils.c)); rim.rotation.x=Math.PI/2; rim.rotation.z=.5*Math.PI-.66*Math.PI; rim.position.set(B.x,22,B.z); S.add(rim); }
  { const stripes=CT(canvasTex(64,64,(g,w,h)=>{ g.fillStyle='#1f7436'; g.fillRect(0,0,w,h); g.fillStyle='#248440'; g.fillRect(0,0,w/2,h); }),true); stripes.repeat.set(10,10);
    const grass=K.mesh(new THREE.CircleGeometry(100,40,.25*Math.PI,.5*Math.PI),new THREE.MeshStandardMaterial({map:stripes,emissive:0x0f4a20,emissiveIntensity:1.1,roughness:.9}),B.x,.4,B.z); grass.rotation.x=-Math.PI/2;
    const track=K.mesh(new THREE.RingGeometry(95,100,40,1,.25*Math.PI,.5*Math.PI),new THREE.MeshStandardMaterial({color:0x7a4a2a,emissive:0x2a1406,roughness:1}),B.x,.45,B.z); track.rotation.x=-Math.PI/2; }
  // infield: dirt diamond, grass square, bases, mound (home at B, second base 38 m out along -z)
  { const dirtM=new THREE.MeshStandardMaterial({color:0x8a5530,emissive:0x2a1406,roughness:1});
    const dirt=K.mesh(new THREE.CircleGeometry(36,32,.25*Math.PI,.5*Math.PI),dirtM,B.x,.5,B.z); dirt.rotation.x=-Math.PI/2;
    const inf=K.flat(-13,13,-13,13,.55,new THREE.MeshStandardMaterial({color:0x248440,emissive:0x0f4a20,roughness:.9})); inf.position.set(B.x,.55,B.z-19.4); inf.rotation.y=Math.PI/4;
    [[0,0],[19.4,-19.4],[0,-38.8],[-19.4,-19.4]].forEach(([x,z])=>K.box(.8,.12,.8,new THREE.MeshBasicMaterial({color:0xffffff}),B.x+x,.62,B.z+z));
    const mound=K.mesh(new THREE.CylinderGeometry(2.8,3,.4,16),dirtM,B.x,.62,B.z-18.4); void mound; }
  K.mesh(new THREE.CylinderGeometry(100.5,100.5,3,40,1,true,.75*Math.PI,.5*Math.PI),new THREE.MeshStandardMaterial({color:0x14264a,roughness:.8,side:THREE.DoubleSide}),B.x,1.9,B.z); // padded outfield wall
  [-.6,-.3,.3,.6,.8,1.2].forEach(k=>{ const a=k*Math.PI; mast(B.x+Math.sin(a)*(k>.7?118:82),B.z+Math.cos(a)*(k>.7?118:82),44,0xffe8e8,B.x,B.z-45); });
  { const gl=glowSprite(0xffe8e0,300); gl.material.fog=false; gl.material.opacity=.3; gl.position.set(B.x,55,B.z-45); S.add(gl); }
  { const sa=.84*Math.PI, sx=B.x+124*Math.sin(sa), sz=B.z+124*Math.cos(sa), face=Math.atan2(B.x-sx,B.z-sz);
    const sb=CT(canvasTex(512,256,(g,w,h)=>{ g.fillStyle='#07090c'; g.fillRect(0,0,w,h); g.drawImage(teamEmblem('phils'),14,20,210,210);
      g.fillStyle='#f6f1e6'; g.font='italic 900 76px Georgia,"Times New Roman",serif'; g.textAlign='left'; g.textBaseline='middle'; g.fillText('Phils',240,86);
      g.fillStyle=TEAM_PAL.phils[0]; g.font='800 26px "Arial Narrow",Arial,sans-serif'; g.fillText('RED OCTOBER · RING THE BELL',244,150);
      g.fillStyle='#ffd23b'; g.font='800 22px "Courier New",monospace'; g.fillText('1 2 3 4 5 6 7 8 9  R H E',244,196); }));
    const scr=screen(sx,32,sz,34,17,face,sb); void scr; [-12,12].forEach(o=>K.box(1.2,24,1.2,concrete,sx+Math.cos(face)*o,12,sz-Math.sin(face)*o)); }
  const bx=B.x+112*Math.sin(1.12*Math.PI), bz=B.z+112*Math.cos(1.12*Math.PI);
  const bellG=new THREE.Group(); bellG.position.set(bx,40,bz); S.add(bellG);
  K.box(1.6,40,1.6,concrete,bx,20,bz);
  const bell=new THREE.Mesh(new THREE.PlaneGeometry(18,18),new THREE.MeshBasicMaterial({map:CT(canvasTex(256,256,(g,w,h)=>{ g.strokeStyle='#ff3a3a'; g.shadowColor='#ff3a3a'; g.shadowBlur=16; g.lineWidth=9;
    g.beginPath(); g.moveTo(128,24); g.bezierCurveTo(70,30,74,120,56,176); g.lineTo(34,208); g.lineTo(222,208); g.lineTo(200,176); g.bezierCurveTo(182,120,186,30,128,24); g.stroke();
    g.beginPath(); g.arc(128,222,14,0,7); g.stroke(); g.beginPath(); g.moveTo(150,70); g.lineTo(138,120); g.lineTo(156,150); g.stroke(); })),transparent:true,toneMapped:false,side:THREE.DoubleSide,depthWrite:false}));
  bell.position.y=-10; bellG.add(bell); bellG.rotation.y=Math.PI*.2;
  K.sign(signCanvas2('THE BALLPARK','RING THE BELL',{bg:'#2a060a',color:'#ffd6d6'}),26,8,B.x,14,B.z+74,0);
  // ---- Crowd Roar pads: one lane each, so you pick your team ----
  const pads=[], padT={};
  const pad=(x,z,lane,team)=>{ const s=K.sNear(x,z); K.at(s,lane); const m=new THREE.Mesh(new THREE.PlaneGeometry(4.6,6),new THREE.MeshBasicMaterial({map:padT[team]||(padT[team]=CT(padCanvas(team))),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));
    m.position.copy(K.pv); m.position.y+=.05; m.quaternion.copy(K.q); m.rotateX(-Math.PI/2); m.rotateZ(Math.PI); S.add(m); pads.push({s,x:lane,hw:2.5,team,m}); };
  pad(0,40,-3.4,'sixers'); pad(0,90,3.4,'flyers'); pad(0,220,-3.4,'flyers'); pad(0,260,3.4,'sixers');
  pad(560,90,3.4,'birds'); pad(610,90,-3.4,'phils'); pad(700,90,3.4,'birds'); pad(750,90,-3.4,'phils');
  pad(600,-310,3.4,'union'); pad(160,-240,-3.4,'phils'); pad(120,-240,3.4,'birds');
  // ---- Jumbotron over Pattison Ave: live standings ----
  const jc=canvasTex(512,192,()=>{}), jt=CT(jc), js=K.sNear(505,90); K.at(js,0);
  [-1,1].forEach(sd=>{ const p=K.f.p.clone().addScaledVector(K.f.r,sd*(W+2.6)); K.box(.7,15,.7,blackM,p.x,7.5,p.z); });
  const jb=K.box(2*W+6,.6,.6,blackM,K.f.p.x,15,K.f.p.z); jb.quaternion.copy(K.q);
  const jsc=new THREE.Mesh(new THREE.PlaneGeometry(13,4.9),new THREE.MeshBasicMaterial({map:jt,toneMapped:false,side:THREE.DoubleSide})); jsc.position.set(K.f.p.x,12,K.f.p.z); jsc.quaternion.copy(K.q); jsc.rotateY(Math.PI); S.add(jsc);
  // ---- tailgate lots: parked cars, team tents, grills with smoke ----
  const tents=[], grills=[], parked=[], pcol=[], PCOL=[0x2a2f38,0x9aa1ab,0x5a1a1a,0x1c2f4a,0xd8dade,0x0b3a3f,0x14306b].map(c=>new THREE.Color(c));
  const lot=(x0,x1,z0,z1)=>{ K.flat(x0,x1,z0,z1,.02,lotM);
    for(let x=x0+8;x<x1-6;x+=7) [z0+7,z1-7].forEach((z,i)=>{ if(K.R()<.3) return; K.pv.set(x,.62,z); K.m4.compose(K.pv,new THREE.Quaternion().setFromAxisAngle(UP,i?Math.PI:0),K.one); parked.push(K.m4.clone()); pcol.push(PCOL[(K.R()*7)|0]); });
    for(let k=0;k<Math.floor((x1-x0)/40);k++){ const team=Object.keys(SPORTS)[(K.R()*5)|0], x=x0+20+k*40+K.R()*10, z=(z0+z1)/2+(K.R()-.5)*8;
      const t=K.mesh(new THREE.ConeGeometry(3.4,3,4),new THREE.MeshStandardMaterial({color:SPORTS[team].c,emissive:SPORTS[team].c,emissiveIntensity:.35,roughness:.7}),x,1.5,z); t.rotation.y=Math.PI/4; tents.push(t);
      grills.push(K.glow(0xff7a2a,2.6,x+5,1,z)); } };
  lot(380,800,-400,-332); lot(40,400,-200,-40); lot(470,800,352,420);
  { const bodies=new THREE.InstancedMesh(trafficBodyGeo,new THREE.MeshStandardMaterial({metalness:.55,roughness:.35}),parked.length), cabs=[];
    parked.forEach((m,i)=>{ bodies.setMatrixAt(i,m); bodies.setColorAt(i,pcol[i]); const c=m.clone(); c.multiply(new THREE.Matrix4().makeTranslation(0,.64,-.25)); cabs.push(c); });
    S.add(bodies); K.inst(trafficCabGeo,trafficGlassM,cabs); }
  const smokeM=new THREE.SpriteMaterial({map:smokeTex,color:0x9aa2ae,transparent:true,depthWrite:false,opacity:.35});
  const puffs=grills.map((g,i)=>{ const s=new THREE.Sprite(smokeM.clone()); s.scale.setScalar(3); s.position.copy(g.position); S.add(s); return {s,base:g.position.clone(),t:i*.37}; });
  // ---- Broad St west side: FDR Park trees, the subway entrance, the greased poles ----
  const trunks=[], crowns=[];
  for(let z=-230;z<340;z+=16) for(let k=0;k<3;k++){ const x=-26-k*22-K.R()*8; K.pv.set(x,2,z+K.R()*8); K.m4.compose(K.pv,new THREE.Quaternion(),K.one); trunks.push(K.m4.clone());
    K.pv.y=5.4; K.m4.compose(K.pv,new THREE.Quaternion(),new THREE.Vector3(1,.9,1).multiplyScalar(.8+K.R()*.5)); crowns.push(K.m4.clone()); }
  K.inst(new THREE.CylinderGeometry(.18,.24,4,6),new THREE.MeshStandardMaterial({color:0x2a221c,roughness:1}),trunks);
  K.inst(new THREE.IcosahedronGeometry(2.6,0),new THREE.MeshStandardMaterial({color:0x16301f,roughness:1,flatShading:true}),crowns);
  K.box(6,3,4,new THREE.MeshStandardMaterial({color:0x2a2e35}),-16,1.5,120); K.glow(0xff8a1a,4,-16,4,117.8);
  K.sign(signCanvas2('BROAD ST LINE','NRG STATION · SPORTS COMPLEX',{bg:'#ff7a00',color:'#101114'}),7,2.2,-13.5,4.6,120,Math.PI/2);
  K.sign(signCanvas2('POLES GREASED','BY ORDER OF THE CITY',{bg:'#1a1a1a',color:'#ffd23b'}),5,1.6,-12.4,3.2,-60,Math.PI/2);
  mast(40,-120,34); mast(400,-120,34); mast(40,-20,30); mast(620,390,30);
  // ---- gantries ----
  K.gantry(K.sNear(0,-100),'BROAD STREET','SPORTS COMPLEX  ↓',{bg:'#0f5a32'}); K.gantry(K.sNear(90,340),'ZINKOFF BLVD','ARENA · ICE TUNNEL  →',{bg:'#0b2a44',color:'#cfefff'});
  K.gantry(K.sNear(450,200),'11TH STREET','PATTISON AVE  ↑'); K.gantry(K.sNear(820,-80),'DARIEN ST','PACKER AVE · I-95  ↑'); K.gantry(K.sNear(560,-310),'PACKER AVE','TAILGATE LOTS  ←',{bg:'#2a1c06',color:'#ffd9a0'});
  K.flush();
  // ---- fireworks over the ballpark: on every lead change, and now and then just because ----
  const FW=[], FN=110;
  for(let i=0;i<5;i++){ const pos=new Float32Array(FN*3), vel=new Float32Array(FN*3), g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const m=new THREE.PointsMaterial({map:glowTex,size:3.4,color:0xffffff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,fog:false});
    const p=new THREE.Points(g,m); p.frustumCulled=false; S.add(p); FW.push({pos,vel,g,m,t:0}); }
  const cols=[SPORTS.phils.c,0xffffff,SPORTS.birds.c,SPORTS.sixers.c,SPORTS.flyers.c,0xffd23b];
  function launch(){ const b=FW.find(o=>o.t<=0)||FW[0], x=B.x-60+Math.random()*120, y=70+Math.random()*30, z=B.z-40+Math.random()*80; b.t=2.4; b.m.color.setHex(cols[(Math.random()*cols.length)|0]);
    for(let i=0;i<FN;i++){ const u=Math.random()*2-1, a=Math.random()*Math.PI*2, r=Math.sqrt(1-u*u), sp=15+Math.random()*7; b.vel.set([Math.cos(a)*r*sp,u*sp,Math.sin(a)*r*sp],i*3); b.pos.set([x,y,z],i*3); } }
  let jT=0, fwT=3, lead=null, bellA=0, padT0=0;
  function drawJumbo(){ const g=jc.getContext('2d'); g.fillStyle='#05070a'; g.fillRect(0,0,512,192); g.strokeStyle='#18b3a6'; g.lineWidth=4; g.strokeRect(5,5,502,182);
    g.textBaseline='alphabetic'; g.font='800 22px "Arial Narrow",Arial,sans-serif'; g.fillStyle='#ffd23b'; g.textAlign='left'; g.fillText('GAME NIGHT · LIVE',18,32);
    const on=mode==='race'&&racers.length?standings().slice(0,4):[];
    if(!on.length){ g.fillStyle='#f4f7ff'; g.font='900 64px "Arial Narrow",Arial,sans-serif'; g.fillText('GO BIRDS',18,120); g.font='700 24px "Arial Narrow",Arial,sans-serif'; g.fillStyle='#e81828'; g.fillText('RING THE BELL · LET\'S GO FLYERS',18,164); }
    else on.forEach((r,i)=>{ g.fillStyle=r.isP?'#ffd23b':'#f4f7ff'; g.font='800 30px "Arial Narrow",Arial,sans-serif'; g.fillText(`${i+1}  ${r.isP?'YOU':(r.def.tag||r.def.name)}`,18+(i%2)*250,82+(i>>1)*50); });
    jt.needsUpdate=true; }
  drawJumbo();
  function update(dt){
    jT-=dt; if(jT<=0){ jT=.5; drawJumbo(); }
    if(mode==='race'&&racers.length&&countdown<=0){ const l=standings()[0]; if(lead&&l!==lead){ launch(); launch(); bellA=.5; } lead=l; } else lead=null;
    fwT-=dt; if(fwT<=0){ fwT=5+Math.random()*6; launch(); }
    FW.forEach(b=>{ if(b.t<=0) return; b.t-=dt; b.m.opacity=clamp(b.t/1.4,0,1); for(let i=0;i<FN;i++){ b.vel[i*3+1]-=7*dt; for(let k=0;k<3;k++){ b.vel[i*3+k]*=1-.9*dt; b.pos[i*3+k]+=b.vel[i*3+k]*dt; } } b.g.attributes.position.needsUpdate=true; });
    bellA*=Math.pow(.35,dt); bellG.rotation.z=Math.sin(ghostT*6)*bellA;
    padT0+=dt; pads.forEach((p,i)=>{ p.m.material.opacity=.55+.45*Math.max(0,Math.sin(padT0*5-i)); });
    puffs.forEach(o=>{ o.t+=dt*.4; const k=o.t%1; o.s.position.set(o.base.x+k*2,o.base.y+k*7,o.base.z); o.s.material.opacity=.35*(1-k); o.s.scale.setScalar(2+k*5); });
    tents.forEach((t,i)=>{ t.material.emissiveIntensity=.3+.15*Math.sin(ghostT*2+i); });
    const flip=Math.floor(ghostT/4)%2; arenaScr.forEach((m,i)=>{ const want=(i+flip)%2?scrT.flyers:scrT.sixers; if(m.material.map!==want){ m.material.map=want; m.material.needsUpdate=true; } });
  }
  return {scene:S,track:tr,traffic:[],update,sNear:K.sNear,cams:[],pads,surf:[{s0:K.sNear(176,340),s1:K.sNear(294,340),grip:.5,name:'ice'}]};
}

/* ---- Event 11: Manayunk Wall ----
   Main St along the canal, then straight up The Wall (Levering St, ~11%), over the crest at the top and along
   the Manayunk Ave ridge, down Green Lane and back to Main St. Hills are real here: climbs slow you, and the
   crests throw you in the air (no steering, no throttle until you land; big air refills some boost). */
const MW_CTRL=[[-620,40],[-300,62],[0,42],[300,22],[420,-40],[440,-200],[400,-330],[250,-380],[0,-400],[-250,-390],[-470,-330],[-600,-220],[-680,-80]];
const MW_KEYS=[[-620,40,0],[300,22,0],[420,-40,1],[440,-200,20],[415,-300,31],[400,-330,32],[330,-365,26],[250,-380,24],[120,-392,28.5],[40,-398,23],[-120,-398,27],[-250,-390,23],[-470,-330,21],[-560,-262,12],[-600,-220,9],[-680,-80,1.5],[-660,0,0]];
function buildManayunk(){
  const K=sceneKit({bg:0x0b0f1c,fog:0x171a26,fogD:.0026,hemi:.6,sky:0x9fa8c8,seed:1683}), S=K.S;
  // lay the loop flat, then lift it onto the height keys (linear between keys, lightly smoothed so crests stay sharp)
  const pts=loopPts(MW_CTRL), n=pts.length, near=(x,z)=>{ let bi=0,bd=1e18; pts.forEach((p,i)=>{ const d=(p.x-x)**2+(p.z-z)**2; if(d<bd){ bd=d; bi=i; } }); return bi; };
  const keys=MW_KEYS.map(([x,z,y])=>[near(x,z),y]).sort((a,b)=>a[0]-b[0]), raw=new Float32Array(n);
  for(let i=0;i<n;i++){ let j=keys.findIndex(k=>k[0]>i); const a=j<=0?keys[keys.length-1]:keys[j-1], b=j<0?keys[0]:keys[j];
    let span=b[0]-a[0]; if(span<=0) span+=n; let u=i-a[0]; if(u<0) u+=n; raw[i]=lerp(a[1],b[1],u/span); }
  pts.forEach((p,i)=>{ let s=0; for(let j=-5;j<=5;j++) s+=raw[(i+j+n)%n]; p.y=s/11; });
  const tr=K.track(pts,6.5,6), W=tr.W, mainEnd=K.sNear(300,22);
  // ground: the hillside is interpolated from the road heights around it (inverse distance, cubed so it stays local)
  const sub=pts.filter((p,i)=>i%6===0), tg=new THREE.PlaneGeometry(1900,1300,76,52); tg.rotateX(-Math.PI/2); tg.translate(-100,0,-150);
  const tp=tg.attributes.position;
  for(let i=0;i<tp.count;i++){ const x=tp.getX(i), z=tp.getZ(i); let ws=0, ys=0, dmin=1e9;
    for(const p of sub){ const d=Math.hypot(p.x-x,p.z-z); if(d<dmin) dmin=d; if(d>420) continue; const w=1/Math.pow(d+4,3); ws+=w; ys+=w*p.y; }
    let y=(ws?ys/ws:0)-1.4-Math.max(0,dmin-60)*.01; if(z>78&&x>-900) y=Math.min(y,-4.5); tp.setY(i,y); }
  tg.computeVertexNormals(); K.mesh(tg,new THREE.MeshStandardMaterial({color:0x10150f,roughness:1}),0,0,0);
  const waterN=WETMAPS.normal.clone(); waterN.needsUpdate=true; waterN.repeat.set(40,40);
  const water=new THREE.MeshStandardMaterial({color:0x04080d,metalness:.9,roughness:.12,normalMap:waterN,normalScale:new THREE.Vector2(.45,.45),envMapIntensity:1.4});
  K.flat(-1400,1200,82,900,-2.4,water);
  K.road({tex:{},skirt:new THREE.MeshStandardMaterial({color:0x151a14,roughness:1,side:THREE.DoubleSide}),walk:0x48443c});
  ribbonF(tr,S,water,(k,p)=>k*tr.ds<mainEnd?[W+6.2,p.y-1.1,W+11,p.y-1.1]:null); // the Manayunk Canal, just past the towpath
  ribbonF(tr,S,new THREE.MeshStandardMaterial({color:0x5a5448,roughness:.95,side:THREE.DoubleSide}),(k,p)=>k*tr.ds<mainEnd?[W+11,p.y-1.1,W+11,p.y+.2]:null);
  K.start('EVENT 11 · MANAYUNK WALL');
  K.lights({every:34,color:0xffd2a0,pool:0xb08a58,pole:0x1f2226});
  // Main St: three- and four-story shops on the hill side, stone mills across the canal
  K.frontage(20,mainEnd-30,-1,{set:5.2,h:[9,15],dep:[12,18],len:[10,18],styles:['brick','stone','brick']});
  K.frontage(40,mainEnd-40,1,{set:13,h:[12,22],dep:[20,32],len:[30,60],space:14,gap:.25,styles:['stone']});
  // rowhouses stepping up the Wall and along the ridge
  K.frontage(mainEnd+120,tr.L-260,-1,{set:5,h:[7,10],dep:[9,12],len:[5,6.5],space:.15,gap:.08,styles:['brick','brick','stone']});
  K.frontage(mainEnd+140,tr.L-300,1,{set:5,h:[7,10],dep:[9,12],len:[5,6.5],space:.15,gap:.12,styles:['brick','stone']});
  const BARS=['TAVERN','TAPROOM','BREWPUB','PIZZA','GALLERY','OYSTERS','CAFE','RECORDS'], BC=['#ffcf6a','#ff6fd8','#6fe3ff','#ff3b3b','#7dff9a','#f4f7ff'];
  for(let s=60,i=0;s<mainEnd-40;s+=88,i++){ K.at(s,-(W+4.9),3.6); const n2=K.f.r.clone(); K.sign(signCanvas(BARS[i%BARS.length],{bg:'#07080a',color:BC[i%BC.length],size:54,glow:14}),4.6,1,K.pv.x,K.pv.y,K.pv.z,Math.atan2(n2.x,n2.z)); }
  // the Manayunk Bridge: concrete arches over Main St and the river, blue light along the deck
  const bc=new THREE.MeshStandardMaterial({color:0x8a8478,roughness:.85,emissive:0x1a1814}), bridgeX=-380, deckY=26, piers=[];
  for(let z=-230;z<=560;z+=46) if(Math.abs(z-58)>18) piers.push(z);
  K.box(9,2.2,560+240,bc,bridgeX,deckY,165); K.box(.3,.3,800,new THREE.MeshBasicMaterial({color:0x4fb4ff,toneMapped:false}),bridgeX-4.6,deckY+1.3,165); K.box(.3,.3,800,new THREE.MeshBasicMaterial({color:0x4fb4ff,toneMapped:false}),bridgeX+4.6,deckY+1.3,165);
  piers.forEach((z,i)=>{ K.box(6,deckY+6,5,bc,bridgeX,deckY/2-3,z); if(i){ const z0=piers[i-1], r=(z-z0)/2; const a=K.mesh(new THREE.TorusGeometry(r,1.1,6,18,Math.PI),bc,bridgeX,deckY-1.2-r*.35,(z+z0)/2); a.rotation.y=Math.PI/2; a.scale.y=.65; } });
  K.sign(signCanvas2('MANAYUNK BRIDGE','TRAIL · SCHUYLKILL RIVER',{bg:'#0a1420',color:'#9fd8ff'}),12,3.6,bridgeX-4.7,deckY-4.4,58,-Math.PI/2);
  // church spire on the ridge, and trees across the hillside
  { const spirePts=[0,0,5,0,4,3,1.8,16,.5,28,0,33].reduce((a,v,i,arr)=>{ if(i%2===0) a.push(new THREE.Vector2(v,arr[i+1])); return a; },[]);
    K.obox('stone',100,-452,0,24,40,18,24); K.mesh(new THREE.LatheGeometry(spirePts,16),new THREE.MeshStandardMaterial({color:0x2c3138,roughness:.75,metalness:.15}),100,42,-462);
    K.glow(0xffe2b0,10,100,50,-462); }
  const trunks=[], crowns=[];
  for(let i=0;i<260;i++){ const x=-760+K.R()*1260, z=-560+K.R()*560; let dmin=1e9, y=0; for(const p of sub){ const d=Math.hypot(p.x-x,p.z-z); if(d<dmin){ dmin=d; y=p.y; } } if(dmin<30||z>70) continue;
    K.pv.set(x,y+.6,z); K.m4.compose(K.pv,new THREE.Quaternion(),K.one); trunks.push(K.m4.clone()); K.pv.y+=3.6; K.m4.compose(K.pv,new THREE.Quaternion(),new THREE.Vector3(1,1,1).multiplyScalar(.9+K.R()*.8)); crowns.push(K.m4.clone()); }
  K.inst(new THREE.CylinderGeometry(.2,.28,4.2,6),new THREE.MeshStandardMaterial({color:0x221b15,roughness:1}),trunks);
  K.inst(new THREE.IcosahedronGeometry(2.8,0),new THREE.MeshStandardMaterial({color:0x17281a,roughness:1,flatShading:true}),crowns);
  // festoon string lights zig-zagging across Main St between the shopfronts: sagging wires with warm bulbs
  { const bulbs=[], wires=[], bc=[], WARM=[[1,.78,.45],[1,.62,.3],[1,.86,.6]];
    for(let s=40,k=0;s<mainEnd-40;s+=14,k++){ const a=K.at(s,-(W+4.6),6.4).clone(), b=K.at(s+10,W+5.6,6.4).clone(), pts=[];
      for(let t=0;t<=16;t++){ const u=t/16, p=a.clone().lerp(b,u); p.y-=Math.sin(Math.PI*u)*1.1; pts.push(p); if(t%2===0&&t>0&&t<16){ bulbs.push(p.x,p.y-.12,p.z); const c=WARM[(t+k)%3]; bc.push(...c); } }
      wires.push(pts); }
    const wg=new THREE.BufferGeometry(), wp=[]; wires.forEach(pts=>{ for(let t=0;t<pts.length-1;t++) wp.push(pts[t].x,pts[t].y,pts[t].z,pts[t+1].x,pts[t+1].y,pts[t+1].z); });
    wg.setAttribute('position',new THREE.Float32BufferAttribute(wp,3)); S.add(new THREE.LineSegments(wg,new THREE.LineBasicMaterial({color:0x14161a})));
    const bg=new THREE.BufferGeometry(); bg.setAttribute('position',new THREE.Float32BufferAttribute(bulbs,3)); bg.setAttribute('color',new THREE.Float32BufferAttribute(bc,3));
    S.add(new THREE.Points(bg,new THREE.PointsMaterial({map:glowTex,size:1.1,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false})));
    S.add(new THREE.Points(bg,new THREE.PointsMaterial({color:0xfff2d8,size:.16,vertexColors:false}))); }
  K.gantry(K.sNear(-200,60),'MAIN STREET','MANAYUNK · CANAL  →',{bg:'#0f5a32'});
  K.gantry(K.sNear(430,-110),'THE WALL','11% GRADE · KEEP IT PINNED',{bg:'#ffd23b',color:'#101114'});
  K.gantry(K.sNear(180,-386),'MANAYUNK AVE','CRESTS · AIR TIME',{bg:'#2a1c06',color:'#ffd9a0'});
  K.gantry(K.sNear(-520,-300),'GREEN LANE','STEEP DESCENT  ↓',{bg:'#0f5a32'});
  K.flush();
  TUN.capture();
  const update=dt=>{ TUN.update(dt,cam.position); waterN.offset.x+=dt*.004; waterN.offset.y+=dt*.01; };
  return {scene:S,track:tr,traffic:[],update,sNear:K.sNear,cams:[],slopeG:1.5,airtime:true};
}

/* ---- Event 09: Mt Airy Run, Northwest Philly (≈2.6 km / lap) ----
   Built on the shared scene kit, the way the threejs-skills pack recommends for a big static night scene:
   one lofted road ribbon, instanced houses/trees/props, merged facades, canvas textures for cobbles, schist and
   shopfronts, and no real-time point lights (lamps, porches and fireflies are baked glow sprites and light pools).
   Up the cobbles and trolley rails of Germantown Ave past the shops, left along W Mt Airy Ave under the stone
   twins and street trees, down the S-bends of Lincoln Drive through the Wissahickon gorge and under the Walnut
   Lane Bridge, then back up Johnson St to the Avenue. */
const MA_CTRL=[[8,-150],[20,-300],[40,-600],[-60,-680],[-300,-700],[-450,-690],[-560,-620],[-600,-480],[-680,-360],[-620,-240],[-700,-120],[-640,20],[-520,90],[-300,110],[-120,90],[-20,40],[0,-20]];
const MA_KEYS=[[8,-150,3],[20,-300,6],[40,-600,13],[-60,-680,14],[-300,-700,13],[-450,-690,12],[-560,-620,8],[-600,-480,3],[-680,-360,-1],[-620,-240,-4],[-700,-120,-6],[-640,20,-7],[-520,90,-5],[-300,110,-2.5],[-120,90,-.5],[-20,40,0],[0,-20,1]];
function buildMtAiry(){
  const K=sceneKit({bg:0x080c16,fog:0x121826,fogD:.0034,hemi:.55,sky:0x8a9cc0,ground:0x0a0c0a,seed:1911,bloom:{strength:.85,threshold:.7}}), S=K.S;
  // road heights from the keys (linear between keys, then smoothed)
  const pts=loopPts(MA_CTRL), n=pts.length, near=(x,z)=>{ let bi=0,bd=1e18; pts.forEach((p,i)=>{ const d=(p.x-x)**2+(p.z-z)**2; if(d<bd){ bd=d; bi=i; } }); return bi; };
  const keys=MA_KEYS.map(([x,z,y])=>[near(x,z),y]).sort((a,b)=>a[0]-b[0]), raw=new Float32Array(n);
  for(let i=0;i<n;i++){ let j=keys.findIndex(k=>k[0]>i); const a=j<=0?keys[keys.length-1]:keys[j-1], b=j<0?keys[0]:keys[j];
    let span=b[0]-a[0]; if(span<=0) span+=n; let u=i-a[0]; if(u<0) u+=n; raw[i]=lerp(a[1],b[1],u/span); }
  pts.forEach((p,i)=>{ let s=0; for(let j=-20;j<=20;j++) s+=raw[(i+j+n)%n]; p.y=s/41; });
  const tr=K.track(pts,6,6), W=tr.W, L=tr.L, f=K.f, pv=K.pv, m4=K.m4, one=K.one, q0=new THREE.Quaternion();
  // legs by distance along the lap
  const sA=K.sNear(-40,-676), sB=K.sNear(-540,-640), sC=K.sNear(-620,40);
  const leg=s=>{ s=((s%L)+L)%L; return s<sA?'gtn':s<sB?'ave':s<sC?'lincoln':'johnson'; };
  const legK=k=>leg(k*tr.ds), inLin=(p,k)=>legK(k)==='lincoln';
  const sub=pts.filter((p,i)=>i%8===0);
  const nearRoad=(x,z)=>{ let bd=1e18,bi=0; for(let i=0;i<sub.length;i++){ const p=sub[i], d=(p.x-x)**2+(p.z-z)**2; if(d<bd){ bd=d; bi=i; } } return {d:Math.sqrt(bd),p:sub[bi],s:bi*8*tr.ds}; };

  // ---- terrain: follows the road, falls away into the Wissahickon on the creek side of Lincoln Drive ----
  const tg=new THREE.PlaneGeometry(1500,1300,90,78); tg.rotateX(-Math.PI/2); tg.translate(-330,0,-300);
  const tp=tg.attributes.position, tcol=[];
  for(let i=0;i<tp.count;i++){ const x=tp.getX(i), z=tp.getZ(i); let ws=0, ys=0;
    for(const p of sub){ const d=Math.hypot(p.x-x,p.z-z); if(d>380) continue; const w=1/Math.pow(d+4,3); ws+=w; ys+=w*p.y; }
    const nr=nearRoad(x,z); let y=(ws?ys/ws:0)-.6;
    if(leg(nr.s)==='lincoln'){ frame(nr.s,f,tr); const side=(x-nr.p.x)*f.r.x+(z-nr.p.z)*f.r.z; // +r is the creek side
      if(side>W+2) y-=Math.min(9,(side-W-2)*.45)*(side<70?1:Math.max(0,1-(side-70)/60)); else if(side<-(W+2)) y+=Math.min(10,(-side-W-2)*.3); }
    else if(nr.d>W+6) y+=Math.min(3,(nr.d-W-6)*.03);
    // the grid is ~17 m a cell, so a hillside vertex beside the road gets interpolated up through the lane:
    // cap the terrain under a gentle slope away from the road edge (a steeper cap still pokes through along the chord)
    y=Math.min(y,nr.p.y-.45+Math.max(0,nr.d-(W+1))*.1);
    tp.setY(i,y); const g=.06+.04*Math.sin(x*.05)*Math.cos(z*.04); tcol.push(g*.8,g*1.25,g*.75); }
  tg.setAttribute('color',new THREE.Float32BufferAttribute(tcol,3)); tg.computeVertexNormals();
  const terrY=(x,z)=>{ const ix=clamp(Math.round((x-(350-1450))/2900*170),0,170), iz=clamp(Math.round((z-(-100-1350))/2700*156),0,156); return tp.getY(iz*171+ix); };
  K.mesh(tg,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}),0,0,0);

  // ---- road: yellow double center line, sidewalks except along Lincoln Drive ----
  const grassT=CT(canvasTex(128,128,(g,w,h)=>{ g.fillStyle='#1b2a17'; g.fillRect(0,0,w,h);
    for(let i=0;i<5000;i++){ const v=Math.random(); g.fillStyle=v<.5?'rgba(40,62,30,.7)':v<.8?'rgba(22,36,18,.7)':'rgba(62,78,40,.55)'; g.fillRect(Math.random()*w,Math.random()*h,1,2+Math.random()*2); } }),true);
  K.road({tex:{center:'rgba(255,205,60,.85)'},walk:0x5a554c,curb:0x7a7e84,skip:inLin});
  // Germantown Ave: Belgian-block cobbles and SEPTA trolley rails over the asphalt
  const cobT=CT(canvasTex(128,128,(g,w,h)=>{ g.fillStyle='#262422'; g.fillRect(0,0,w,h);
    for(let y=0;y<h;y+=8) for(let x=-((y/8)%2)*6;x<w;x+=12){ const v=58+((x*31+y*17)%34); g.fillStyle=`rgb(${v},${v-3},${v-7})`; g.fillRect(x+1,y+1,10,6); } }),true);
  const cobM=wetRoad(new THREE.MeshStandardMaterial({map:cobT,roughness:.5,metalness:.1,side:THREE.DoubleSide}));
  const inGtn=k=>legK(k)==='gtn'&&k*tr.ds>25&&k*tr.ds<sA-25;
  ribbonF(tr,S,cobM,(k,p)=>inGtn(k)?[-W,p.y+.02,W,p.y+.02]:null,3);
  const railM=new THREE.MeshStandardMaterial({color:0xc4cad2,metalness:1,roughness:.18});
  [-3.72,-2.28,2.28,3.72].forEach(o=>ribbonF(tr,S,railM,(k,p)=>inGtn(k)?[o-.05,p.y+.045,o+.05,p.y+.045]:null));
  // lawns in front of the houses on the residential streets
  const lawnM=new THREE.MeshStandardMaterial({map:grassT,color:0x8aa080,roughness:1,side:THREE.DoubleSide});
  const resK=k=>{ const l=legK(k); return l==='ave'||l==='johnson'; };
  [-1,1].forEach(sd=>ribbonF(tr,S,lawnM,(k,p)=>resK(k)?[sd*(W+4.5),p.y+.14,sd*(W+11),p.y+.1]:null,6));

  // ---- Lincoln Drive: schist retaining wall on the hill, post-and-rail fence and the creek on the other side ----
  const schistT=CT(canvasTex(256,128,(g,w,h)=>{ g.fillStyle='#3e3e3a'; g.fillRect(0,0,w,h);
    for(let y=0;y<h;y+=9) for(let x=-((y*7)%22);x<w;x+=18+((x*y)%9)){ const v=50+((x*13+y*7)%46); g.fillStyle=`rgb(${v},${v-1},${v-6})`; g.fillRect(x+1,y+1,16+((x+y)%6),7); }
    g.fillStyle='rgba(20,40,20,.35)'; for(let i=0;i<60;i++) g.fillRect(Math.random()*w,Math.random()*h,6,3); }),true);
  const schistM=new THREE.MeshStandardMaterial({map:schistT,roughness:.95,side:THREE.DoubleSide});
  ribbonF(tr,S,schistM,(k,p)=>inLin(p,k)?[-(W+.4),p.y-.2,-(W+.4),p.y+3.2]:null,6);
  ribbonF(tr,S,schistM,(k,p)=>inLin(p,k)?[-(W+.4),p.y+3.2,-(W+1.4),p.y+3.4]:null,6);
  const shoulderM=new THREE.MeshStandardMaterial({color:0x151a12,roughness:1,side:THREE.DoubleSide});
  ribbonF(tr,S,shoulderM,(k,p)=>inLin(p,k)?[W+.3,p.y+.01,W+14,p.y-6]:null,8);
  const woodM=new THREE.MeshStandardMaterial({color:0x4a3a2a,roughness:.9});
  ribbonF(tr,S,woodM,(k,p)=>inLin(p,k)?[W+1.1,p.y+.75,W+1.1,p.y+.95]:null,4);
  ribbonF(tr,S,woodM,(k,p)=>inLin(p,k)?[W+1.1,p.y+.35,W+1.1,p.y+.5]:null,4);
  const posts=[]; for(let s=sB+4;s<sC-4;s+=3){ K.at(s,W+1.1,.55); m4.compose(pv,K.q,one); posts.push(m4.clone()); }
  K.inst(new THREE.BoxGeometry(.18,1.1,.18),woodM,posts);
  const creekM=new THREE.MeshStandardMaterial({color:0x06101a,metalness:.9,roughness:.06,emissive:0x0a1826,emissiveIntensity:.5,side:THREE.DoubleSide});
  ribbonF(tr,S,creekM,(k,p)=>inLin(p,k)?[W+13,p.y-5.4,W+25,p.y-5.4]:null,10);

  // ---- Germantown Ave: three-storey stone and brick shops tight to the sidewalk, lit shop windows, blade signs ----
  const SHOPS=['CAFE','BOOKS','HARDWARE','PIZZA','TAVERN','BAKERY','VINTAGE','RECORDS','DELI','THEATRE','FLOWERS','BIKES','TACOS','WINE BAR'], SC=['#ffcf6a','#ff6fd8','#6fe3ff','#ff3b3b','#7dff9a','#f4f7ff'];
  const MA_KIT=!!(kitParts('ShopSchist')&&kitParts('ShopBrick')&&kitParts('Theatre'));
  if(MA_KIT){ // Blender kit: three-storey schist and brick shops tight to the sidewalk, the deco theatre halfway up the Avenue
    const km=kitMats(), AWC=[0x2d5a3a,0x7a1e22,0x1e3a5e,0x2a2a2e,0x6a4a1e,0x3c2a4a], sTh=sA*.52, bands=[];
    const put=(s,sd,into,col)=>{ K.at(s,sd*(W+4.6)); const r=K.f.r, d={x:-sd*r.x,z:-sd*r.z}, c=pv.clone().addScaledVector(r,sd*6.5);
      if(!K.clearOf(c,K.f.t,r,8.8,13,W+4.4)) return false; into.m.push(new THREE.Matrix4().makeTranslation(pv.x,K.f.p.y-.3,pv.z).multiply(new THREE.Matrix4().makeRotationY(kitYawTo(d.x,d.z)))); into.c.push(col); return {x:pv.x,y:K.f.p.y,z:pv.z,d}; };
    const S1={m:[],c:[]}, S2={m:[],c:[]};
    [-1,1].forEach(sd=>{ for(let s=24;s<sA-30;s+=9.2){ if(sd<0&&Math.abs(s-sTh)<16) continue; const col=AWC[K.R()*AWC.length|0], r=put(s,sd,K.R()<.55?S1:S2,col); if(r) bands.push(r); } });
    kitInst(S,'ShopSchist',km,S1.m,S1.c,'AWNING'); kitInst(S,'ShopBrick',km,S2.m,S2.c,'AWNING');
    { K.at(sTh,-(W+4.6)); const r=K.f.r, d={x:r.x,z:r.z}; kitInst(S,'Theatre',km,[new THREE.Matrix4().makeTranslation(pv.x,K.f.p.y-.3,pv.z).multiply(new THREE.Matrix4().makeRotationY(kitYawTo(d.x,d.z)))]);
      const ry=Math.atan2(d.x,d.z), mp=pv.clone().addScaledVector(r,3.3); K.sign(signCanvas('SEDGWICK',{bg:'#0b0908',color:'#ffd89a',size:66,glow:18}),14,1.1,mp.x,K.f.p.y+4.15,mp.z,ry);
      K.glow(0xffd9a0,14,mp.x,K.f.p.y+4.4,mp.z); }
    bands.forEach((b,i)=>{ const nm=SHOPS[i%SHOPS.length], c=SC[i%SC.length]; const ry=Math.atan2(b.d.x,b.d.z);
      K.sign(signCanvas(nm,{bg:'#0d0e10',color:c,size:48,glow:10}),6,.62,b.x+b.d.x*.24,b.y+3.4,b.z+b.d.z*.24,ry); }); }
  else {
  K.frontage(20,sA-30,-1,{set:5,h:[8,13],dep:[12,16],len:[7,12],space:.15,styles:['stone','brick','brick']});
  K.frontage(20,sA-30,1,{set:5,h:[8,13],dep:[12,16],len:[7,12],space:.15,styles:['stone','brick','stone']}); }
  const shopT=(em)=>CT(canvasTex(128,512,(g,w,h)=>{ g.fillStyle=em?'#000':'#16171a'; g.fillRect(0,0,w,h);
    const cols=['#ffe7c2','#dfeaff','#ffd9a0','#fff1d6'];
    for(let y=6,i=0;y<h-30;y+=64,i++){ const c=cols[i%4];
      if(em){ const gr=g.createLinearGradient(10,0,110,0); gr.addColorStop(0,'#5a4a38'); gr.addColorStop(1,c); g.fillStyle=gr; g.fillRect(10,y,100,50);
        g.fillStyle='rgba(0,0,0,.5)'; for(let k=0;k<3;k++) g.fillRect(24+k*26,y+4,4,42); }
      else { g.fillStyle='#0c1016'; g.fillRect(10,y,100,50); g.fillStyle='rgba(255,255,255,.07)'; g.fillRect(96,y,14,50); }
      g.fillStyle=em?'#000':'#2c2f36'; g.fillRect(10,y+24,100,3); g.fillRect(110,y,10,50); } }),true);
  const shopM=new THREE.MeshStandardMaterial({map:shopT(false),emissive:0xffffff,emissiveMap:shopT(true),emissiveIntensity:.8,roughness:.4,metalness:.1,side:THREE.DoubleSide});
  if(!MA_KIT) [-1,1].forEach(sd=>ribbonF(tr,S,shopM,(k,p)=>inGtn(k)?[sd*(W+4.55),p.y+.35,sd*(W+4.55),p.y+3.8]:null,20));
  for(let s=40,i=0;s<sA-40;s+=46,i++){ const sd=i%2?1:-1; K.at(s,sd*(W+3.6),4.6); const t=K.f.t;
    K.sign(signCanvas(SHOPS[i%SHOPS.length],{bg:'#07080a',color:SC[i%SC.length],size:54,glow:14}),2.6,.7,pv.x,pv.y,pv.z,Math.atan2(t.x,t.z));
    K.glow(new THREE.Color(SC[i%SC.length]).getHex(),2.4,pv.x,pv.y,pv.z); }
  // trolley catenary: poles and two contact wires
  const catM=new THREE.MeshStandardMaterial({color:0x22262c,metalness:.6,roughness:.4}), cpoles=[];
  for(let s=30;s<sA-20;s+=32) [-1,1].forEach(sd=>{ K.at(s,sd*(W+3.9),3.6); m4.compose(pv,K.q,one); cpoles.push(m4.clone()); });
  K.inst(new THREE.CylinderGeometry(.11,.14,7.2,6),catM,cpoles);
  [-3,3].forEach(o=>ribbonF(tr,S,catM,(k,p)=>inGtn(k)?[o-.02,p.y+6.4,o+.02,p.y+6.44]:null));

  // ---- the stone twins: W Mt Airy Ave and Johnson St. Schist fronts, gable roofs, porches with a lamp on ----
  const slateM=new THREE.MeshStandardMaterial({color:0x2a2f36,roughness:.7,metalness:.15}), trimM2=new THREE.MeshStandardMaterial({color:0xd8d2c4,roughness:.7});
  const roofGeo=(()=>{ const sh=new THREE.Shape(); sh.moveTo(-.5,0); sh.lineTo(.5,0); sh.lineTo(0,.5); sh.lineTo(-.5,0); const g=new THREE.ExtrudeGeometry(sh,{depth:1,bevelEnabled:false}); g.translate(0,0,-.5); return g; })();
  const roofs=[], porchRoofs=[], porchPosts=[], chimneys=[], lamps=[];
  const twins=[];
  const houses=(s0,s1,sd)=>{ for(let s=s0;s<s1;s+=15.5){ if(K.R()<.08) continue;
      if(kitParts('StoneTwin')){ K.at(s,sd*(W+12.5),0); const r=K.f.r, t=K.f.t, d={x:-sd*r.x,z:-sd*r.z}, y0=K.f.p.y-.4;
        twins.push(new THREE.Matrix4().makeTranslation(pv.x,y0,pv.z).multiply(new THREE.Matrix4().makeRotationY(kitYawTo(d.x,d.z))));
        [-2.7,4.1].forEach(o=>{ if(K.R()<.8) lamps.push([pv.x+d.x*.5+t.x*o,y0+2.8,pv.z+d.z*.5+t.z*o]); }); continue; }
      K.at(s,sd*(W+16.5),0); const c=pv.clone(), t=K.f.t, yaw=Math.atan2(t.x,t.z), y0=K.f.p.y-.4, w=13, d=11, h=7.5+K.R()*1.5;
      K.obox(K.R()<.75?'stone':'brick',c.x,c.z,yaw,d,w,h,y0);
      const qy=new THREE.Quaternion().setFromAxisAngle(THREE.Object3D.DefaultUp,yaw);
      pv.set(c.x,y0+h,c.z); m4.compose(pv,qy,new THREE.Vector3(d+.8,6,w+.4)); roofs.push(m4.clone()); // ridge runs along the street
      K.at(s,sd*(W+9.6),0); const pc=pv.clone(); pv.set(pc.x,y0+3.2,pc.z); m4.compose(pv,qy,new THREE.Vector3(3,.18,w-1)); porchRoofs.push(m4.clone());
      [-1,0,1].forEach(o=>{ const px=pc.clone().addScaledVector(K.f.t,o*(w/2-1)).addScaledVector(K.f.r,sd*-1.3); pv.set(px.x,y0+1.6,px.z); m4.compose(pv,qy,one); porchPosts.push(m4.clone()); });
      const ch=c.clone().addScaledVector(K.f.t,(K.R()-.5)*w*.6); pv.set(ch.x,y0+h+3.4,ch.z); m4.compose(pv,qy,one); chimneys.push(m4.clone());
      if(K.R()<.8){ const lp=pc.clone().addScaledVector(K.f.r,sd*1.2); lamps.push([lp.x,y0+2.7,lp.z]); } } };
  [-1,1].forEach(sd=>{ houses(sA+50,sB-45,sd); houses(sC+45,L-70,sd); });
  kitInst(S,'StoneTwin',kitMats(),twins);
  K.inst(roofGeo,slateM,roofs); K.inst(new THREE.BoxGeometry(1,1,1),slateM,porchRoofs);
  K.inst(new THREE.CylinderGeometry(.12,.12,3.2,6),trimM2,porchPosts); K.inst(new THREE.BoxGeometry(1,2.4,1),new THREE.MeshStandardMaterial({color:0x5a4a3e,roughness:.95}),chimneys);
  { const lg=new THREE.BufferGeometry(); lg.setAttribute('position',new THREE.Float32BufferAttribute(lamps.flat(),3));
    S.add(new THREE.Points(lg,new THREE.PointsMaterial({map:glowTex,color:0xffc98a,size:3.4,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}))); }

  // ---- St Michael's spire at the corner of the Avenue and Mt Airy Ave ----
  { const spirePts=[0,0,4.6,0,3.8,3,1.7,15,.5,26,0,30].reduce((a,v,i,arr)=>{ if(i%2===0) a.push(new THREE.Vector2(v,arr[i+1])); return a; },[]);
    const y0=pts[near(-60,-680)].y; K.obox('stone',-20,-742,0,26,40,16,y0-.5);
    K.mesh(new THREE.LatheGeometry(spirePts,16),slateM,-20,y0+15.5,-756);
    const cross=new THREE.MeshStandardMaterial({color:0xe8e2d4,metalness:.4,roughness:.4,emissive:0x6a6048,emissiveIntensity:.5});
    K.box(.2,2.4,.2,cross,-20,y0+46.7,-756); K.box(1.2,.18,.18,cross,-20,y0+47.2,-756); K.glow(0xffe2b0,9,-20,y0+30,-756); }

  // ---- the Walnut Lane Bridge: a concrete arch high over Lincoln Drive and the creek ----
  { const sb=K.sNear(-640,-180); K.at(sb,0,0); const c=pv.clone(), r=K.f.r.clone(), t=K.f.t.clone(), yaw=Math.atan2(r.x,r.z);
    const conc=new THREE.MeshStandardMaterial({color:0x6e6a62,roughness:.92,emissive:0x0c0b09}), R0=54, cy=c.y-16;
    const arch=K.mesh(new THREE.TorusGeometry(R0,1.6,8,40,Math.PI),conc,c.x,cy,c.z); arch.rotation.y=yaw-Math.PI/2;
    const deckY=cy+R0+4; const deck=K.box(4.2,1.6,130,conc,c.x,deckY,c.z); deck.rotation.y=yaw;
    for(let o=-48;o<=48;o+=8){ const hy=cy+Math.sqrt(Math.max(0,R0*R0-o*o)); const col=K.box(1.2,deckY-hy,1.2,conc,c.x+r.x*o,(hy+deckY)/2,c.z+r.z*o); void col; }
    [-1,1].forEach(sd=>{ K.box(.3,1.2,130,conc,c.x+t.x*sd*2,deckY+1.3,c.z+t.z*sd*2).rotation.y=yaw; });
    for(let o=-60;o<=60;o+=15){ K.glow(0xffd9a0,3.5,c.x+r.x*o+t.x*2.2,deckY+2.4,c.z+r.z*o+t.z*2.2); }
    K.sign(signCanvas2('WALNUT LANE BRIDGE','WISSAHICKON VALLEY PARK',{bg:'#0f3a24',color:'#e8f2e4'}),9,2.6,c.x-t.x*2.2,deckY-1.8,c.z-t.z*2.2,Math.atan2(-t.x,-t.z)); }

  // ---- trees: street trees over the sidewalks, and the Wissahickon woods ----
  const trunks=[], crowns=[], crowns2=[];
  const tree=(x,y,z,sc,alt)=>{ pv.set(x,y+2.1*sc,z); m4.compose(pv,q0,new THREE.Vector3(sc,sc,sc)); trunks.push(m4.clone());
    pv.set(x,y+5.4*sc,z); m4.compose(pv,new THREE.Quaternion().setFromAxisAngle(THREE.Object3D.DefaultUp,K.R()*6.3),new THREE.Vector3(sc,.9*sc,sc)); (alt?crowns2:crowns).push(m4.clone()); };
  for(let s=10;s<L;s+=14){ const l=leg(s); if(l==='lincoln'||(l==='gtn'&&s>25&&s<sA-25)) continue; [-1,1].forEach((sd,i)=>{ K.at(s+(i?7:0),sd*(W+5.2),0); tree(pv.x,K.f.p.y,pv.z,1.25+K.R()*.35,i); }); }
  for(let i=0;i<2400&&crowns.length+crowns2.length<900;i++){ const gorge=i%3===0, x=gorge?-860+K.R()*380:-1000+K.R()*1250, z=gorge?-700+K.R()*780:-930+K.R()*1100, nr=nearRoad(x,z); const l=leg(nr.s);
    if(nr.d<(l==='lincoln'?W+7:W+26)) continue; if(l==='gtn'&&nr.d<60) continue;
    let y=0;
    const gx=Math.round((x+330+750)/1500*90), gz=Math.round((z+300+650)/1300*78); const vi=clamp(gz,0,78)*91+clamp(gx,0,90); y=tp.getY(vi);
    tree(x,y-.4,z,1.1+K.R()*1.1,K.R()<.5); }
  K.inst(new THREE.CylinderGeometry(.18,.26,4.2,6),new THREE.MeshStandardMaterial({color:0x221b15,roughness:1}),trunks);
  K.inst(leafyCrown(1.9,11,1),new THREE.MeshStandardMaterial({color:0x2a4a2c,roughness:.95,vertexColors:true}),crowns);
  K.inst(leafyCrown(1.7,23,1),new THREE.MeshStandardMaterial({color:0x34562e,roughness:.95,vertexColors:true}),crowns2);

  // ---- light: warm street lamps in town, a sparse line of them down the gorge, fireflies in the woods ----
  K.lights({every:34,color:0xffd2a0,pool:0xb08a58,pole:0x1f2226,skip:(p,s)=>leg(s)==='lincoln'});
  K.lights({every:64,color:0xffd2a0,pool:0x9a7a50,pole:0x1f2226,sides:[-1],skip:(p,s)=>leg(s)!=='lincoln'});
  const ffPos=[]; for(let i=0;i<260;i++){ const s=sB+K.R()*(sC-sB); K.at(s,(K.R()<.5?-1:1)*(W+4+K.R()*30),.6+K.R()*3); ffPos.push(pv.x,pv.y,pv.z); }
  const ffG=new THREE.BufferGeometry(); ffG.setAttribute('position',new THREE.Float32BufferAttribute(ffPos,3));
  const ffM=new THREE.PointsMaterial({map:glowTex,color:0xd8ff7a,size:.9,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}); S.add(new THREE.Points(ffG,ffM));
  // gorge mist: soft layered sheets hanging low over the creek side of Lincoln Drive, drifting slowly
  const mistT=CT(canvasTex(256,128,(g,w,h)=>{ const R=rng(88); for(let i=0;i<40;i++){ const x=R()*w, y=h*.35+R()*h*.4, r=20+R()*50, gr=g.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,'rgba(200,215,235,.22)'); gr.addColorStop(1,'rgba(200,215,235,0)'); g.fillStyle=gr; g.fillRect(x-r,y-r,2*r,2*r); } }));
  const mistM=new THREE.MeshBasicMaterial({map:mistT,transparent:true,depthWrite:false,opacity:.75,side:THREE.DoubleSide}), mists=[];
  for(let s=sB+20;s<sC-20;s+=38){ [1,1.6].forEach((k,j)=>{ K.at(s+j*19,(W+10)*k,1.2+j*1.4); const m=new THREE.Mesh(new THREE.PlaneGeometry(60,9),mistM); m.position.copy(pv); m.rotation.y=Math.atan2(K.f.t.x,K.f.t.z)+Math.PI/2; S.add(m); mists.push({m,x:pv.x,ph:K.R()*6}); }); }
  // falling leaves around the player: an autumn swirl recentered on the car, warm colors, normal blending so they read against light
  const NL=220, lp=new Float32Array(NL*3), lv=new Float32Array(NL*3), lc=new Float32Array(NL*3), LC=[[.62,.26,.08],[.78,.44,.1],[.52,.12,.06],[.7,.58,.16],[.36,.2,.08]];
  for(let i=0;i<NL;i++){ lp.set([(K.R()-.5)*70,K.R()*14,(K.R()-.5)*70],i*3); lv.set([(K.R()-.5)*1.2,-.6-K.R()*.8,(K.R()-.5)*1.2],i*3); lc.set(LC[K.R()*LC.length|0],i*3); }
  const leafT=CT(canvasTex(32,32,(g,w,h)=>{ g.fillStyle='#fff'; g.beginPath(); g.ellipse(16,16,13,7,.6,0,7); g.fill(); }));
  const lg=new THREE.BufferGeometry(); lg.setAttribute('position',new THREE.BufferAttribute(lp,3)); lg.setAttribute('color',new THREE.BufferAttribute(lc,3));
  const leaves=new THREE.Points(lg,new THREE.PointsMaterial({map:leafT,size:.32,vertexColors:true,transparent:true,alphaTest:.3})); leaves.frustumCulled=false; S.add(leaves);

  K.start('EVENT 09 · MT AIRY RUN');
  K.gantry(90,'GERMANTOWN AVE','MT AIRY · CHESTNUT HILL  ↑',{bg:'#0f5a32'});
  K.gantry(sA+80,'W MT AIRY AVE','LINCOLN DR  →',{bg:'#0f5a32'});
  K.gantry(sB+60,'LINCOLN DRIVE','WISSAHICKON · S-CURVES',{bg:'#2a1c06',color:'#ffd9a0'});
  K.gantry(sC+70,'JOHNSON ST','GERMANTOWN AVE  →',{bg:'#0f5a32'});
  K.flush();
  // speed bumps on the residential streets, potholes on the Avenue and the Drive (positions are distances along the lap)
  const hz=[[.1,0,'pothole'],[.16,3,'pothole'],[.22,-3,'pothole']].map(([u,x,t])=>[u*sA,x,t])
    .concat([[.25,0,'bump'],[.5,0,'bump'],[.75,-3,'pothole']].map(([u,x,t])=>[sA+u*(sB-sA),x,t]))
    .concat([[.2,3,'pothole'],[.45,-3,'pothole'],[.7,3,'pothole']].map(([u,x,t])=>[sB+u*(sC-sB),x,t]))
    .concat([[.3,0,'bump'],[.55,-3,'pothole'],[.75,0,'bump']].map(([u,x,t])=>[sC+u*(L-sC),x,t]));
  const roadHazards=installRoadHazards(tr,S,s=>s,hz.map(([s,x,t])=>[s,0,x,t]),mkF(),new THREE.Quaternion(),new THREE.Matrix4(),new THREE.Vector3(),W);
  let T=0; const update=dt=>{ T+=dt; ffM.opacity=.45+.35*Math.sin(T*2.3)*Math.sin(T*.7+1);
    mists.forEach(o=>{ o.m.position.x=o.x+Math.sin(T*.08+o.ph)*6; });
    const c=player&&player.m?player.m.group.position:null; if(!c) return; leaves.position.copy(c);
    for(let i=0;i<NL;i++){ const k=i*3; lp[k]+=(lv[k]+Math.sin(T*1.7+i)*.6)*dt; lp[k+1]+=lv[k+1]*dt; lp[k+2]+=(lv[k+2]+Math.cos(T*1.3+i)*.6)*dt;
      if(lp[k+1]<0) lp[k+1]+=14; if(lp[k]>35) lp[k]-=70; if(lp[k]<-35) lp[k]+=70; if(lp[k+2]>35) lp[k+2]-=70; if(lp[k+2]<-35) lp[k+2]+=70; }
    lg.attributes.position.needsUpdate=true; };
  return {scene:S,track:tr,traffic:[],update,sNear:K.sNear,cams:[],roadHazards,slopeG:1.1,legS:{sA,sB,sC}};
}

/* ---- Event 12: Under the El, Kensington ----
   Kensington Ave runs under the Market-Frankford El, with the steel columns down the middle of the road: pick a
   side and stay out of the posts. El trains rumble overhead. Then Lehigh Ave over the freight line (the gates
   come down every forty seconds and a train rolls into the yard), down Aramingo Ave and back along Allegheny. */
const EL={a:[-600,680],len:1980,y:9.4};           // the El's centerline runs along x+z=80
const XING={cyc:40,warn:21.5,close:25.2,open:36}; // freight crossing clock, in seconds
function buildKensington(){
  const K=sceneKit({bg:0x0b0a10,fog:0x1c1712,fogD:.0028,hemi:.5,sky:0xc8a07a,ground:0x0b0907,seed:1907,bloom:{strength:1,radius:.5,threshold:.7}}), S=K.S, V=(x,z)=>new THREE.Vector2(x,z);
  const tr=K.track(resample3(filletPath(V(-80,160),[[400,-320,30],[770,-320,28],[770,210,28],[190,210,22],[130,270,20],[-240,320,26]].map(([x,z,r])=>[V(x,z),r]),1),()=>0),7,6), W=tr.W;
  const onEl=p=>Math.abs(p.x+p.z-80)<.8, d=new THREE.Vector3(1,0,-1).normalize(), side=new THREE.Vector3(.7071,0,.7071), elYaw=Math.atan2(d.x,d.z);
  const elP=(u,lat)=>new THREE.Vector3(EL.a[0]+d.x*u+side.x*lat,0,EL.a[1]+d.z*u+side.z*lat);
  K.flat(-900,1300,-1000,900,-.03,new THREE.MeshStandardMaterial({color:0x0d0c0b,roughness:.95}));
  K.road({tex:{center:'rgba(255,196,60,.85)'},walk:0x3a3833,studs:false}); // the El columns stand on the center line
  K.start('EVENT 12 · UNDER THE EL');
  K.lights({every:30,color:0xffc07a,pool:0xb07a3a,skip:p=>onEl(p)});
  // ---- the El: deck, girders, columns at the curbs and down the median, sodium lamps hung underneath ----
  const steel=new THREE.MeshStandardMaterial({color:0x2f4a44,metalness:.6,roughness:.5});
  const mid=elP(EL.len/2,0);
  const deck=K.box(15,1.2,EL.len,steel,mid.x,EL.y+.6,mid.z); deck.rotation.y=elYaw;
  [-7.2,7.2].forEach(l=>{ const g=elP(EL.len/2,l), b=K.box(.6,2.4,EL.len,steel,g.x,EL.y-.2,g.z); b.rotation.y=elYaw; });
  [-2.4,2.4].forEach(l=>{ const g=elP(EL.len/2,l); [-.72,.72].forEach(o=>{ const rl=K.box(.12,.16,EL.len,new THREE.MeshStandardMaterial({color:0x9aa1ab,metalness:1,roughness:.3}),g.x+side.x*o,EL.y+1.3,g.z+side.z*o); rl.rotation.y=elYaw; }); });
  const cols=[], lamps=[], pillars=[], q=new THREE.Quaternion().setFromAxisAngle(UP,elYaw);
  const clear=(p,r)=>{ const s=K.sNear(p.x,p.z); frame(s,K.f,tr); return K.f.p.distanceTo(p.setY(0))>r; };
  for(let u=8;u<EL.len;u+=16){ [-8.6,8.6].forEach(l=>{ const p=elP(u,l); if(!clear(p.clone(),W+1.6)) return; p.y=EL.y/2; K.m4.compose(p,q,K.one); cols.push(K.m4.clone()); });
    const lp=elP(u,0); lp.y=EL.y-.6; K.m4.compose(lp,q,K.one); lamps.push(K.m4.clone()); }
  for(let s=40;s<tr.L-60;s+=16){ frame(s,K.f,tr); if(!onEl(K.f.p)) continue; /* none on the starting grid */ const p=K.f.p.clone(); p.y=EL.y/2; K.m4.compose(p,q,K.one); cols.push(K.m4.clone()); pillars.push({s,x:0,hw:.62}); }
  K.inst(new THREE.BoxGeometry(.9,EL.y,.9),steel,cols);
  K.inst(new THREE.BoxGeometry(1.8,.5,1.8),new THREE.MeshStandardMaterial({color:0xd8b020,roughness:.6}),pillars.map(p=>{ frame(p.s,K.f,tr); const v=K.f.p.clone(); v.y=.25; return new THREE.Matrix4().compose(v,q,K.one); }));
  K.inst(new THREE.BoxGeometry(1.2,.2,.5),new THREE.MeshBasicMaterial({color:0xffb45a,toneMapped:false}),lamps);
  lampCones(S,lamps.map(m=>m.clone().multiply(new THREE.Matrix4().makeTranslation(0,4.4,0))));
  { const pools=lamps.filter((m,i)=>i%2===0).map(m=>{ const v=new THREE.Vector3().setFromMatrixPosition(m); v.y=.05; return new THREE.Matrix4().compose(v,new THREE.Quaternion(),K.one); }); const g=new THREE.PlaneGeometry(16,16); g.rotateX(-Math.PI/2);
    K.inst(g,new THREE.MeshBasicMaterial({map:poolTex,color:0xc07a30,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}),pools); }
  // crosstie shadows: the sodium lamps under the deck throw the El's ties onto the road as dark slats
  { const sl=[]; for(let u=1;u<EL.len;u+=1.25){ const p=elP(u,0); p.y=.045; sl.push(new THREE.Matrix4().compose(p,q,K.one)); }
    K.inst(new THREE.PlaneGeometry(15.6,.55).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.42,depthWrite:false}),sl); }
  // graffiti tags on the column bases, four hands
  { const TAGS=[['KNSGTN','#ff3bd4','#1a1a1a'],['EL BOYZ','#3bf2ff','#2a1a3a'],['NO SLEEP','#ffe03b','#2a0a0a'],['FRNKFRD','#7dff6a','#0a1a2a']];
    TAGS.forEach(([t,c,o],k)=>{ const tex=CT(canvasTex(128,96,(g,w,h)=>{ g.font='italic 900 30px "Arial Black",Arial,sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.lineWidth=7; g.strokeStyle=o; g.save(); g.translate(w/2,h/2); g.rotate(-.18); g.strokeText(t,0,0); g.fillStyle=c; g.fillText(t,0,0); g.restore(); }));
      const ms=cols.filter((m,n)=>n%4===k).map(m=>m.clone().multiply(new THREE.Matrix4().makeTranslation(0,-EL.y/2+1.5,.456)));
      K.inst(new THREE.PlaneGeometry(1.05,.8),new THREE.MeshStandardMaterial({map:tex,transparent:true,roughness:.8,polygonOffset:true,polygonOffsetFactor:-2}),ms); }); }
  // ---- El trains: two four-car sets, one each way ----
  const winTex=CT(canvasTex(256,64,(g,w,h)=>{ g.fillStyle='#1a1d22'; g.fillRect(0,0,w,h); g.fillStyle='#fff3d6'; for(let i=0;i<8;i++) g.fillRect(8+i*31,18,22,22); g.fillStyle='#2f6fd6'; g.fillRect(0,48,w,6); }));
  const carM=new THREE.MeshStandardMaterial({color:0xc8ccd2,metalness:.7,roughness:.35,emissive:0xffffff,emissiveMap:winTex,emissiveIntensity:1,map:winTex});
  const trains=[[-2.4,1,0],[2.4,-1,EL.len*.55]].map(([lat,dir,u0])=>{ const g=new THREE.Group(); for(let i=0;i<4;i++){ const c=new THREE.Mesh(new THREE.BoxGeometry(3,3.3,14.6),carM); c.position.set(0,1.65,-dir*i*15.2); g.add(c); }
    const hl=glowSprite(0xfff4d6,5); hl.position.set(0,1.6,dir*7.6); g.add(hl); g.rotation.y=elYaw; S.add(g); return {g,lat,dir,u:u0,v:21}; });
  const sparkN=60, spPos=new Float32Array(sparkN*3), spVel=new Float32Array(sparkN*3), spG=new THREE.BufferGeometry(); spG.setAttribute('position',new THREE.BufferAttribute(spPos,3));
  for(let i=0;i<sparkN;i++) spPos[i*3+1]=-99;
  const spk=new THREE.Points(spG,new THREE.PointsMaterial({map:glowTex,color:0xffc070,size:.5,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false})); spk.frustumCulled=false; S.add(spk); let spI=0;
  // ---- neighborhood: rowhomes and corner stores under the El, murals, warehouses on Lehigh, strip mall on Aramingo ----
  const sElA=tr.L-190, sElB=K.sNear(400,-320)-30;
  K.frontage(0,sElB,-1,{set:5.6,h:[8,12],dep:[10,14],len:[6,9],space:.3,gap:.1,styles:['brick','brick','stone']});
  K.frontage(0,sElB,1,{set:5.6,h:[8,12],dep:[10,14],len:[6,9],space:.3,gap:.1,styles:['brick','stone']});
  K.frontage(sElA,tr.L-20,1,{set:5.6,h:[8,12],dep:[10,14],len:[6,9],space:.3,styles:['brick']});
  const sLeh0=K.sNear(430,-320), sLeh1=K.sNear(740,-320), sAra0=K.sNear(770,-290), sAra1=K.sNear(770,180), sAll0=K.sNear(740,210), sAll1=K.sNear(220,210);
  K.frontage(sLeh0,K.sNear(610,-320),-1,{set:8,h:[10,16],dep:[30,50],len:[40,70],space:6,styles:['stone','brick']});
  K.frontage(K.sNear(670,-320),sLeh1,-1,{set:8,h:[10,16],dep:[30,50],len:[40,70],space:6,styles:['stone','brick']});
  K.frontage(sAra0,sAra1,-1,{set:40,h:[6,8],dep:[26,34],len:[50,90],space:8,styles:['glass','stone']});
  K.flat(770+W+4.5,770+44,-280,170,.02,new THREE.MeshStandardMaterial({color:0x1b1c20,roughness:.85}));
  K.frontage(sAll0,sAll1,-1,{set:5.4,h:[8,11],dep:[10,13],len:[5,6.5],space:.12,gap:.06,styles:['brick']});
  K.frontage(sAll0,sAll1,1,{set:5.4,h:[8,11],dep:[10,13],len:[5,6.5],space:.12,gap:.06,styles:['brick','stone']});
  // fill the bare stretches: the far side of Kensington Ave by the line, Allegheny back round to the El, and the
  // inside of Lehigh (clear of the freight tracks) and Aramingo
  K.frontage(sElA,tr.L-20,-1,{set:5.6,h:[8,12],dep:[10,14],len:[6,9],space:.3,gap:.1,styles:['brick','stone']});
  [-1,1].forEach(sd=>K.frontage(sAll1+10,sElA-10,sd,{set:5.4,h:[8,11],dep:[10,13],len:[5,6.5],space:.12,gap:.08,styles:sd>0?['brick','stone']:['brick']}));
  K.frontage(sLeh0+12,K.sNear(612,-320),1,{set:7,h:[9,14],dep:[18,30],len:[24,44],space:4,styles:['brick','stone']});
  K.frontage(K.sNear(668,-320),sLeh1-12,1,{set:7,h:[9,14],dep:[18,30],len:[24,44],space:4,styles:['brick','stone']});
  K.frontage(sAra0+12,sAra1-12,1,{set:6,h:[8,13],dep:[14,22],len:[18,36],space:3,styles:['brick','stone']});
  const STORE=['CHECK CASHING','PIZZA · HOAGIES','BEER DELI','CHINESE FOOD','PAWN','TATTOO','CORNER STORE','WATER ICE','BARBER'], SC=['#7dff9a','#ff3b3b','#ffd23b','#ff6fd8','#6fe3ff','#f4f7ff'];
  for(let s=30,i=0;s<sElB-20;s+=52,i++){ const sd=i%2?1:-1; K.at(s,sd*(W+5.1),4.4); const r=K.f.r.clone().multiplyScalar(-sd); K.sign(signCanvas(STORE[i%STORE.length],{bg:'#07080a',color:SC[i%SC.length],size:46,glow:14}),5,1.1,K.pv.x,K.pv.y,K.pv.z,Math.atan2(r.x,r.z)); }
  const MUR=[['#ff6f3c','#ffd23b','#2f6fd6'],['#7dff9a','#1d6fd6','#ff6fd8'],['#e81828','#f4f7ff','#18b3a6']];
  [[120,-1],[300,1],[tr.L-120,1]].forEach(([s,sd],i)=>{ const c=MUR[i%3]; K.at(s,sd*(W+5.5),6.5); const r=K.f.r.clone().multiplyScalar(-sd);
    K.sign(canvasTex(512,256,(g,w,h)=>{ g.fillStyle=c[0]; g.fillRect(0,0,w,h); for(let k=0;k<14;k++){ g.fillStyle=c[k%3]; g.beginPath(); g.arc(Math.random()*w,Math.random()*h,20+Math.random()*80,0,7); g.fill(); }
      g.fillStyle='#101114'; g.font='900 64px "Arial Narrow",Arial,sans-serif'; g.textAlign='center'; g.fillText(['KENSINGTON','LOVE LETTER','WE ARE HERE'][i],w/2,h*.62); }),12,6,K.pv.x,K.pv.y,K.pv.z,Math.atan2(r.x,r.z),{toneMapped:true}); });
  // ---- the freight crossing on Lehigh Ave, and the rail yard inside the loop ----
  const XS=K.sNear(640,-320), railM=new THREE.MeshStandardMaterial({color:0x8a8e94,metalness:1,roughness:.3}), tieM=new THREE.MeshStandardMaterial({color:0x2a2018,roughness:1});
  [638.3,641.7].forEach(x=>K.box(.14,.14,1400,railM,x,.08,-420));
  { const ties=[]; for(let z=-1100;z<280;z+=1.4) if(Math.abs(z+320)>W+.6) ties.push(new THREE.Matrix4().makeTranslation(640,.04,z)); // one instanced draw instead of ~860 boxes
    const im=new THREE.InstancedMesh(new THREE.BoxGeometry(4.2,.12,.3),tieM,ties.length); ties.forEach((m,i)=>im.setMatrixAt(i,m)); im.frustumCulled=false; S.add(im); }
  [647,655].forEach(x=>[-.8,.8].forEach(o=>K.box(.14,.14,290,railM,x+o,.08,-160)));
  const FRC=[0x5a2a1a,0x2a3a4a,0x4a4a1a,0x6a3a1a,0x1a3a2a];
  for(let k=0;k<11;k++){ const x=[647,655][k%2], z=-280+k*24; if(z>-40) break; K.box(3.1,3.8,14.4,new THREE.MeshStandardMaterial({color:FRC[k%5],roughness:.8,metalness:.3}),x,2.2,z); }
  const flashM=[0,1].map(()=>new THREE.MeshBasicMaterial({color:0x220000,toneMapped:false})), flashG=[0,1].map(()=>[]);
  const gates=[];
  [[630,1],[650,-1]].forEach(([x,sd])=>{ const zc=-320+sd*(W+2.2);
    K.box(.3,4.6,.3,new THREE.MeshStandardMaterial({color:0xe8e8e8}),x,2.3,zc);
    K.sign(canvasTex(256,256,(g,w,h)=>{ g.fillStyle='rgba(0,0,0,0)'; g.clearRect(0,0,w,h); g.save(); g.translate(128,128); [1,-1].forEach(a=>{ g.save(); g.rotate(a*Math.PI/4); g.fillStyle='#f4f4f4'; g.fillRect(-120,-22,240,44); g.fillStyle='#101114'; g.font='900 34px Arial'; g.textAlign='center'; g.fillText(a>0?'RAILROAD':'CROSSING',0,12); g.restore(); }); g.restore(); }),2.4,2.4,x,4.9,zc,sd>0?-Math.PI/2:Math.PI/2,{transparent:true});
    [0,1].forEach(i=>{ const l=K.mesh(new THREE.CircleGeometry(.24,14),flashM[i],x+(sd>0?-.2:.2),3.2,zc-.45+i*.9); l.rotation.y=sd>0?-Math.PI/2:Math.PI/2; flashG[i].push(K.glow(0xff2020,2.2,x+(sd>0?-.3:.3),3.2,zc-.45+i*.9)); });
    const piv=new THREE.Group(); piv.position.set(x,1.4,zc); S.add(piv);
    const arm=new THREE.Mesh(new THREE.BoxGeometry(.18,.18,2*W+1.4),new THREE.MeshBasicMaterial({map:CT(canvasTex(256,16,(g,w)=>{ for(let i=0;i<8;i++){ g.fillStyle=i%2?'#d42020':'#f4f4f4'; g.fillRect(i*w/8,0,w/8,16); } })),toneMapped:false}));
    arm.position.z=-sd*(W+.7); piv.add(arm); gates.push(piv); });
  const train=new THREE.Group(); S.add(train);
  { const loco=new THREE.Mesh(new THREE.BoxGeometry(3.2,4.4,18),new THREE.MeshStandardMaterial({color:0x1a2a4a,metalness:.4,roughness:.6})); loco.position.set(0,2.6,-9); train.add(loco);
    const cab=new THREE.Mesh(new THREE.BoxGeometry(3.2,1.2,4),new THREE.MeshStandardMaterial({color:0xd8b020})); cab.position.set(0,5.2,-2.5); train.add(cab);
    const hl=glowSprite(0xfff6de,8); hl.position.set(0,3.4,.2); train.add(hl);
    for(let i=0;i<8;i++){ const c=new THREE.Mesh(new THREE.BoxGeometry(3.1,3.9,14.4),new THREE.MeshStandardMaterial({color:FRC[i%5],roughness:.8,metalness:.3})); c.position.set(0,2.3,-19-i*15.2); train.add(c); } }
  train.position.x=640; train.visible=false;
  // ---- traffic, gantries ----
  const obst=K.traffic(5);
  K.gantry(K.sNear(100,-20),'KENSINGTON AVE','UNDER THE EL · STAY OFF THE POSTS',{bg:'#0f5a32'});
  K.gantry(K.sNear(520,-320),'LEHIGH AVE','RAIL CROSSING AHEAD',{bg:'#ffd23b',color:'#101114'});
  K.gantry(K.sNear(770,0),'ARAMINGO AVE','PORT RICHMOND  ↓',{bg:'#0f5a32'}); K.gantry(K.sNear(450,210),'ALLEGHENY AVE','KENSINGTON  ←',{bg:'#0f5a32'});
  K.flush();
  let xt=0, bellT=0, rumbleT=0;
  const state=()=>{ const t=((xt%XING.cyc)+XING.cyc)%XING.cyc; return {t,warn:t>=XING.warn&&t<XING.close,closed:t>=XING.close&&t<XING.open}; };
  function update(dt){
    xt+=dt; const st=state(), t=st.t;
    const down=clamp(t<XING.warn?0:t<XING.warn+2.4?(t-XING.warn)/2.4:t<XING.open?1:1-(t-XING.open)/1.6,0,1);
    gates.forEach(g=>g.rotation.x=Math.PI/2*(1-down));
    const blink=(st.warn||st.closed)&&((t*2)|0)%2; flashM.forEach((m,i)=>m.color.setHex((st.warn||st.closed)&&(i?blink:!blink)?0xff2020:0x220000)); flashG.forEach((arr,i)=>arr.forEach(s=>s.visible=!!((st.warn||st.closed)&&(i?blink:!blink))));
    train.visible=t>19&&t<38.6; if(train.visible) train.position.z=-345+(t-25.2)*18;
    if((st.warn||st.closed)&&cam.position.distanceTo(new THREE.Vector3(640,2,-320))<160){ bellT-=dt; if(bellT<=0){ bellT=.5; tone(1250,.09,.07,'triangle',{attack:.002}); } }
    trains.forEach(o=>{ o.u=(o.u+o.dir*o.v*dt+EL.len)%EL.len; const p=elP(o.u,o.lat); o.g.position.set(p.x,EL.y+1.2,p.z);
      if(Math.random()<dt*6){ for(let k=0;k<4;k++){ const i=spI++%sparkN; spPos.set([p.x+(Math.random()-.5)*3,EL.y-.2,p.z+(Math.random()-.5)*3],i*3); spVel.set([(Math.random()-.5)*3,-1-Math.random()*2,(Math.random()-.5)*3],i*3); } }
      if(mode==='race'&&cam.position.distanceTo(o.g.position)<45){ rumbleT-=dt; if(rumbleT<=0){ rumbleT=.45; burst(.5,'lowpass',160,60,.22); } } });
    for(let i=0;i<sparkN;i++){ if(spPos[i*3+1]<-50) continue; spVel[i*3+1]-=12*dt; for(let k=0;k<3;k++) spPos[i*3+k]+=spVel[i*3+k]*dt; if(spPos[i*3+1]<0) spPos[i*3+1]=-99; }
    spG.attributes.position.needsUpdate=true;
  }
  return {scene:S,track:tr,traffic:obst,update,sNear:K.sNear,cams:[],pillars,crossing:{s:XS,state},
    resetTraffic(){ xt=Math.random()*14; [.12,.3,.46,.64,.82].forEach((u,i)=>{ const o=obst[i]; o.dist=u*tr.L; o.x=i%2?3.6:-3.6; o.v=o.v0=11+Math.random()*4; }); }};
}

/* ---- Event 13: First Light, Kelly Drive and MLK Drive ----
   Three laps of the river loop, starting at 5:40 in the morning. The sky comes up as the race runs out: blue
   hour, pink, then the sun over the river on the last lap, and the street lights click off. River fog lifts,
   crews row out from Boathouse Row, and the city wakes up: no traffic on lap one, a few cars on lap two, rush hour on lap three. */
const FL_CTRL=[[130,650],[190,380],[90,100],[160,-240],[60,-580],[130,-880],[60,-1000],[-60,-1010],[-110,-900],[-170,-600],[-80,-250],[-160,100],[-60,390],[-100,640],[-40,760],[60,770]];
const FL_RIVER=[[20,1300],[10,900],[20,650],[60,380],[0,100],[30,-240],[-50,-580],[10,-880],[0,-1150],[-40,-1600]];
const FL_KEYS=[ // progress through the race -> sky and light
 [0,{top:0x03050d,hor:0x0d1426,fog:0x0c1220,fd:.0034,hemi:.42,sun:0,lamp:1,sunY:-120}],
 [.35,{top:0x0a1030,hor:0x3a2a50,fog:0x1f2338,fd:.003,hemi:.58,sun:.08,lamp:1,sunY:-80}],
 [.65,{top:0x1a2a5a,hor:0xd86a5a,fog:0x5a4a58,fd:.0024,hemi:.85,sun:.45,lamp:.7,sunY:-10}],
 [.85,{top:0x3a6ab0,hor:0xffb070,fog:0x9a8278,fd:.0018,hemi:1.05,sun:1,lamp:0,sunY:70}],
 [1,{top:0x5a8ad0,hor:0xffd6a0,fog:0xb0a090,fd:.0014,hemi:1.2,sun:1.3,lamp:0,sunY:150}]];
function dawnAt(p){ let i=0; while(i<FL_KEYS.length-2&&p>FL_KEYS[i+1][0]) i++; const [pa,A]=FL_KEYS[i], [pb,B]=FL_KEYS[i+1], t=clamp((p-pa)/(pb-pa),0,1), o={};
  Object.keys(A).forEach(k=>{ o[k]=['top','hor','fog'].includes(k)?new THREE.Color(A[k]).lerp(new THREE.Color(B[k]),t):lerp(A[k],B[k],t); }); return o; }
function buildFirstLight(){
  const K=sceneKit({bg:0x0d1426,fog:0x0c1220,fogD:.0034,hemi:.42,dome:false,seed:1854,bloom:{strength:.85,radius:.5,threshold:.74}}), S=K.S;
  const bump=(x,z)=>{ const sm=t=>{ t=clamp(t,0,1); return t*t*(3-2*t); }; return 4.5*sm((-905-z)/55)*Math.max(0,1-(x/115)**2)+4.5*sm((z-705)/45)*Math.max(0,1-((x-10)/115)**2); };
  const tr=K.track(loopPts(FL_CTRL,bump),7,6), W=tr.W;
  // the river: terrain carved out along the centerline, one water plane over it
  const rc=new THREE.CatmullRomCurve3(FL_RIVER.map(([x,z])=>new THREE.Vector3(x,0,z))).getSpacedPoints(160);
  const rDist=(x,z)=>{ let m=1e9; for(const p of rc){ const d=(p.x-x)**2+(p.z-z)**2; if(d<m) m=d; } return Math.sqrt(m); };
  const tg=new THREE.PlaneGeometry(1400,2800,56,112); tg.rotateX(-Math.PI/2); tg.translate(0,0,-150); const tp=tg.attributes.position;
  for(let i=0;i<tp.count;i++){ const d=rDist(tp.getX(i),tp.getZ(i)); tp.setY(i,d<52?-3.2:d<66?lerp(-3.2,-.05,(d-52)/14):-.05); }
  tg.computeVertexNormals(); const groundM=new THREE.MeshStandardMaterial({color:0x121812,roughness:1}); K.mesh(tg,groundM,0,0,0);
  const waterN=WETMAPS.normal.clone(); waterN.needsUpdate=true; waterN.repeat.set(70,145); // river ripples: the wet-asphalt normal field, tiled small and scrolled downstream
  const waterM=new THREE.MeshStandardMaterial({color:0x04070c,metalness:.9,roughness:.1,normalMap:waterN,normalScale:new THREE.Vector2(.45,.45),envMapIntensity:1.2}); K.flat(-700,700,-1600,1300,-1.5,waterM);
  const bridge=p=>p.y>.4;
  K.road({skip:bridge,walk:0x3c4046});
  const truss=new THREE.MeshStandardMaterial({color:0x3a5a7a,metalness:.6,roughness:.45,side:THREE.DoubleSide}), para=new THREE.MeshStandardMaterial({color:0x8a8478,roughness:.9,side:THREE.DoubleSide});
  [-1,1].forEach(sd=>{ ribbonF(tr,S,para,(k,p)=>bridge(p)?[sd*(W+.6),p.y-1.4,sd*(W+.6),p.y+1.05]:null); ribbonF(tr,S,para,(k,p)=>bridge(p)?[sd*(W+.6),p.y-1.4,-sd*(W+.6),p.y-1.4]:null); });
  for(let s=0;s<tr.L;s+=7){ frame(s,K.f,tr); if(!bridge(K.f.p)||K.f.p.z>0) continue; orientQ(K.f,K.q,K.basis,K.nr);
    [-1,1].forEach(sd=>{ const b=K.f.p.clone().addScaledVector(K.f.r,sd*(W+.8)); const post=K.box(.35,6,.35,truss,b.x,b.y+3,b.z); post.quaternion.copy(K.q);
      const br=K.box(.25,7.6,.25,truss,b.x,b.y+3,b.z); br.quaternion.copy(K.q); br.rotateX(((s/7)|0)%2?.72:-.72); const top=K.box(.4,.4,7,truss,b.x,b.y+6,b.z); top.quaternion.copy(K.q); }); }
  K.start('EVENT 13 · FIRST LIGHT');
  const lit=K.lights({every:34,color:0xffe0b0,pool:0xb09070,skip:bridge});
  // ---- sky: our own dome so the whole thing can brighten; stars fade, the sun comes up in the east ----
  const domeG=new THREE.SphereGeometry(1400,48,24), dc=new Float32Array(domeG.attributes.position.count*3); domeG.setAttribute('color',new THREE.BufferAttribute(dc,3));
  const dome=new THREE.Mesh(domeG,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false})); dome.renderOrder=-1; dome.frustumCulled=false; S.add(dome); S.userData.dome=dome;
  const starP=[]; { const R=rng(5); for(let i=0;i<600;i++){ const a=R()*Math.PI*2, e=.12+R()*1.3; starP.push(Math.cos(a)*Math.cos(e)*1300,Math.sin(e)*1300,Math.sin(a)*Math.cos(e)*1300); } }
  const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.Float32BufferAttribute(starP,3));
  const starM=new THREE.PointsMaterial({color:0xdfe6ff,size:1.6,sizeAttenuation:false,fog:false,transparent:true,depthWrite:false}); const stars=new THREE.Points(sg,starM); stars.renderOrder=-1; dome.add(stars);
  const sun=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffd08a,fog:false,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})); sun.scale.setScalar(260); dome.add(sun);
  const sunL=new THREE.DirectionalLight(0xffc89a,0); sunL.position.set(1,.25,-.2); S.add(sunL);
  const sunDir=new THREE.Vector3(), tmpC=new THREE.Color(), vtx=domeG.attributes.position;
  function paint(D){ sunDir.set(1200,D.sunY,-300).normalize(); sun.position.set(1200,D.sunY,-300); sun.material.opacity=clamp((D.sunY+60)/80,0,1);
    for(let i=0;i<vtx.count;i++){ const x=vtx.getX(i)/1400, y=vtx.getY(i)/1400, z=vtx.getZ(i)/1400, e=y;
      if(e<0) tmpC.copy(D.hor).multiplyScalar(.55); else tmpC.copy(D.hor).lerp(D.top,Math.pow(clamp(e*2.4,0,1),.7));
      const g=Math.pow(Math.max(0,x*sunDir.x+y*sunDir.y+z*sunDir.z),6)*D.sun; tmpC.r+=g*1; tmpC.g+=g*.62; tmpC.b+=g*.3;
      dc[i*3]=tmpC.r; dc[i*3+1]=tmpC.g; dc[i*3+2]=tmpC.b; }
    domeG.attributes.color.needsUpdate=true; }
  // ---- Boathouse Row on the river side of Kelly Drive, lights on until the sun is up ----
  const outlineM=new THREE.MeshBasicMaterial({color:0xfff2d0,toneMapped:false}), houseM=new THREE.MeshStandardMaterial({color:0x3a3e46,roughness:.8}), roofM=new THREE.MeshStandardMaterial({color:0x1a1d22,roughness:.7});
  const outl=[];
  for(let i=0;i<8;i++){ const s=K.sNear(170,600)+i*34; K.at(s,-(W+14)); const yaw=Math.atan2(K.f.t.x,K.f.t.z), c=K.pv.clone(), h=6+(i%2)*2, w=26, dep=14;
    const g=new THREE.Group(); g.position.copy(c); g.rotation.y=yaw; S.add(g);
    const add=(geo,m,x,y,z)=>{ const o=new THREE.Mesh(geo,m); o.position.set(x,y,z); g.add(o); return o; };
    add(new THREE.BoxGeometry(dep,h,w),houseM,0,h/2,0); const rf=add(new THREE.CylinderGeometry(1,1,w,3,1),roofM,0,h+2.4,0); rf.rotation.x=Math.PI/2; rf.scale.set(dep*.58,1,3.2); rf.rotation.y=0;
    [[dep+.3,.14,.14,0,h,w/2],[dep+.3,.14,.14,0,h,-w/2],[.14,.14,w+.3,dep/2,h,0],[.14,.14,w+.3,-dep/2,h,0],[.14,.14,w+.3,0,h+4.8,0]].forEach(([a,b,cc,x,y,z])=>outl.push(add(new THREE.BoxGeometry(a,b,cc),outlineM,x,y,z)));
    [-1,1].forEach(sz=>[-1,1].forEach(sx=>outl.push(add(new THREE.BoxGeometry(.14,h,.14),outlineM,sx*dep/2,h/2,sz*w/2)))); }
  K.sign(signCanvas2('BOATHOUSE ROW','KELLY DRIVE · SCHUYLKILL RIVER',{bg:'#0a0d12',color:'#e6f2ff'}),12,3.6,...K.at(K.sNear(170,560),W+5,3).toArray(),0);
  // ---- the Art Museum on its hill past the south bridge, the Water Works at the dam ----
  const gold=new THREE.MeshStandardMaterial({color:0xd8b27a,emissive:0x8a5a24,emissiveIntensity:.8,roughness:.65});
  K.box(140,10,70,new THREE.MeshStandardMaterial({color:0x2a2a24,roughness:1}),0,5,1010); K.box(60,16,40,gold,0,18,1015); [-1,1].forEach(sd=>K.box(36,14,34,gold,sd*48,17,1000));
  for(let i=0;i<8;i++) K.mesh(new THREE.CylinderGeometry(.9,1,12,10),gold,-24+i*6.9,16,993);
  const white=new THREE.MeshStandardMaterial({color:0xe8e2d4,emissive:0x5a5448,emissiveIntensity:.45,roughness:.6});
  [[-70,860],[-52,880]].forEach(([x,z])=>{ K.box(14,6,10,white,x,3,z); for(let i=0;i<4;i++) K.mesh(new THREE.CylinderGeometry(.4,.45,5,8),white,x-5+i*3.3,2.5,z+5.4); });
  K.skyline({cx:170,cz:1470,sx:190,sz:50,n:36,h:[22,115],wd:[10,24],seed:1776}); // Center City behind the Art Museum, scaled down to read as distant inside the far plane
  // ---- Fairmount Park woods on both banks ----
  const trunks=[], crowns=[], TR_=rng(21);
  for(let i=0;i<900;i++){ const x=-560+TR_()*1120, z=-1300+TR_()*2250; if(rDist(x,z)<70) continue; const s=K.sNear(x,z); frame(s,K.f,tr); if(K.f.p.distanceTo(K.pv.set(x,K.f.p.y,z))<W+9) continue;
    K.pv.set(x,2,z); K.m4.compose(K.pv,new THREE.Quaternion(),K.one); trunks.push(K.m4.clone()); K.pv.y=5.6; K.m4.compose(K.pv,new THREE.Quaternion(),new THREE.Vector3(1,1.1,1).multiplyScalar(.8+TR_()*.7)); crowns.push(K.m4.clone()); }
  K.inst(new THREE.CylinderGeometry(.2,.28,4.2,6),new THREE.MeshStandardMaterial({color:0x221b15,roughness:1}),trunks);
  const leafM=new THREE.MeshStandardMaterial({color:0x1a3020,roughness:1,flatShading:true}); K.inst(new THREE.IcosahedronGeometry(3,0),leafM,crowns);
  // ---- river fog and rowing crews ----
  const fogM=new THREE.MeshBasicMaterial({map:smokeTex,color:0xc8d4e8,transparent:true,opacity:.35,depthWrite:false});
  const fogs=[]; for(let i=0;i<34;i++){ const p=rc[4+((i*4)%150)], m=K.mesh(new THREE.PlaneGeometry(150,36),fogM,p.x+(K.R()-.5)*40,-.6+K.R()*1.4,p.z); m.rotation.x=-Math.PI/2; m.rotation.z=K.R()*3; fogs.push(m); }
  // sun glitter: two sets of additive sparks on the river that shimmer against each other once the sun is up
  const glints=[0,1].map(k=>{ const gp=[], R=rng(40+k); for(let i=0;i<1400;i++){ const p=rc[4+Math.floor(R()*150)]; gp.push(p.x+(R()-.5)*90,-1.4,p.z+(R()-.5)*20); }
    const gg=new THREE.BufferGeometry(); gg.setAttribute('position',new THREE.Float32BufferAttribute(gp,3));
    const pts=new THREE.Points(gg,new THREE.PointsMaterial({map:glowTex,color:0xffc890,size:2.4,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending})); S.add(pts); return pts.material; });
  const shellM=new THREE.MeshStandardMaterial({color:0xe8e4d8,roughness:.4}), oarM=new THREE.MeshStandardMaterial({color:0xf4f4f4,roughness:.5});
  const crews=[0,1,2,3].map(i=>{ const g=new THREE.Group(); g.add(new THREE.Mesh(new THREE.BoxGeometry(.6,.35,14),shellM)); const oars=[];
    for(let k=0;k<4;k++) [-1,1].forEach(sd=>{ const piv=new THREE.Group(); piv.position.set(sd*.3,.2,-4.5+k*3); const o=new THREE.Mesh(new THREE.BoxGeometry(3.6,.06,.12),oarM); o.position.x=sd*1.8; piv.add(o); g.add(piv); oars.push({piv,sd}); });
    S.add(g); return {g,oars,u:.15+i*.18,v:.0022+i*.0003,ph:i}; });
  // ---- traffic that arrives with the morning ----
  const obst=K.traffic(7,[0xd8dade,0x2a2f38,0x9aa1ab,0x1c3a5a,0xc9b28a,0x5a1a1a,0xd2b23a]);
  const park=o=>{ o.out=true; o.dist=-1e7; o.m.group.visible=false; };
  K.gantry(K.sNear(160,200),'KELLY DRIVE','BOATHOUSE ROW · EAST FALLS  ↑',{bg:'#0f5a32'}); K.gantry(K.sNear(100,-900),'FALLS BRIDGE','MLK DRIVE  ←',{bg:'#0f5a32'});
  K.gantry(K.sNear(-150,-500),'MLK DRIVE','ART MUSEUM  ↓',{bg:'#0f5a32'}); K.gantry(K.sNear(-110,500),'FIRST LIGHT','SUNRISE 6:42 AM',{bg:'#2a1206',color:'#ffd6a0'});
  K.flush();
  let pS=.35, awake=0;
  function update(dt){
    const racing=mode==='race'&&player&&racers.length, prog=racing?(countdown>0?0:clamp(player.dist/(laps()*tr.L),0,1)):.35;
    pS+=(prog-pS)*Math.min(1,dt*(racing?.8:3)); const D=dawnAt(pS);
    paint(D); S.background.copy(D.hor); S.fog.color.copy(D.fog); S.fog.density=D.fd; K.hemi.intensity=D.hemi; sunL.intensity=D.sun*1.1; starM.opacity=clamp(1-pS*1.6,0,1);
    S.userData.bloom.threshold=.74+pS*.14; S.userData.bloom.strength=.85-pS*.3;
    lit.lampM.color.setScalar(.1+.9*D.lamp); lit.poolM.opacity=.5*D.lamp; lit.flareM.opacity=D.lamp; if(lit.cones) lit.cones.visible=D.lamp>.4; if(lit.streaks) lit.streaks.visible=D.lamp>.4;
    outlineM.color.setRGB(1,.95,.82).multiplyScalar(.15+.85*D.lamp); groundM.color.setHex(0x121812).lerp(new THREE.Color(0x3a4a2a),pS*.8); leafM.color.setHex(0x1a3020).lerp(new THREE.Color(0x3a5a2a),pS);
    waterM.color.setHex(0x04070c).lerp(D.hor,.25*pS); fogM.opacity=.35*(1-pS*.95); waterN.offset.x+=dt*.003; waterN.offset.y-=dt*.01;
    glints.forEach((m,k)=>{ m.opacity=clamp(D.sun-.2,0,1)*(.55+.45*Math.sin(ghostT*7+k*Math.PI)); m.color.copy(D.hor).lerp(tmpC.setHex(0xfff0d0),.5); });
    crews.forEach(c=>{ c.u=(c.u+c.v*dt)%1; const k=c.u*(rc.length-2), i=Math.floor(k), a=rc[i], b=rc[i+1]; c.g.position.set(lerp(a.x,b.x,k-i)+(c.ph%2?14:-14),-1.3,lerp(a.z,b.z,k-i)); c.g.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);
      const st=Math.sin(ghostT*3.2+c.ph); c.oars.forEach(o=>{ o.piv.rotation.y=o.sd*st*.5; o.piv.rotation.z=o.sd*(st>0?.05:-.12); }); });
    const lap=racing?clamp(Math.floor(Math.max(0,player.dist)/tr.L),0,2):0, want=[0,3,7][lap];
    if(racing&&want>awake){ for(let i=awake;i<want;i++){ const o=obst[i]; o.out=false; o.m.group.visible=true; o.dist=player.dist+260+(i-awake)*190; o.x=i%2?3.6:-3.6; o.v=12+Math.random()*4; }
      awake=want; if(player&&!player.finished) toast(want<7?'The city\'s waking up. Early traffic on the Drive.':'Rush hour. Everybody\'s on the Drive.'); }
  }
  paint(dawnAt(.35));
  return {scene:S,track:tr,traffic:obst,update,sNear:K.sNear,cams:[],dawn:true,
    resetTraffic(){ awake=0; pS=mode==='race'||mode==='loading'?0:.35; obst.forEach(park); }};
}

/* ---- Event 14: Neon Core — cyberpunk mash of Skyline (elevated run), Dockside (yard chicane),
   and Under the El (overhead rail + median hazards), plus a Harbor-style neon tube.
   Track design cues from player/community favorites: rhythm (straight → technical → recovery),
   readable neon landmarks, risk/reward boost grids, and one timed gate without cheap traps. ---- */
function neonPadCanvas(team){ const T=padSport(team); return canvasTex(256,256,(g,w,h)=>{ g.fillStyle='rgba(0,0,0,0)'; g.clearRect(0,0,w,h);
  g.strokeStyle=T.css; g.lineWidth=8; g.shadowColor=T.css; g.shadowBlur=22; g.strokeRect(10,10,w-20,h-20);
  g.fillStyle=T.css; for(let k=0;k<4;k++){ const y=200-k*48; g.beginPath(); g.moveTo(48,y); g.lineTo(128,y-36); g.lineTo(208,y); g.lineTo(208,y-12); g.lineTo(128,y-48); g.lineTo(48,y-12); g.closePath(); g.fill(); } }); }
function buildNeonCore(){
  const K=sceneKit({bg:0x04040c,fog:0x180a20,fogD:.0026,hemi:.42,sky:0x7030a0,ground:0x06040a,moon:0xd080ff,moonI:.32,seed:2077,bloom:{strength:1.12,radius:.6,threshold:.6}}), S=K.S, V=(x,z)=>new THREE.Vector2(x,z);
  const sm=(a,b,v)=>{ const t=clamp((v-a)/(b-a),0,1); return t*t*(3-2*t); };
  const raw=resample3(filletPath(V(-80,140),[[720,140,30],[720,-300,28],[420,-300,22],[420,-160,16],[280,-160,14],[280,-260,12],[200,-260,12],[200,-160,14],[80,-160,14],
    [80,-320,16],[-80,-320,18],[-80,140,24]].map(([x,z,r])=>[V(x,z),r]),1),()=>0);
  const pts=raw.map(p=>{ p.y=14*sm(400,720,p.x)*sm(-310,150,p.z); return p; });
  const tr=K.track(pts,7,6.8), W=tr.W, f=K.f, q=K.q, pv=K.pv, m4=K.m4, one=K.one;
  const onDeck=p=>p.y>8, onHyper=p=>Math.abs(p.z+300)<10&&p.x>430&&p.x<700, inTube=p=>p.x<-60&&p.z>-255&&p.z<-105; // tube = the west straight (x -80), the only long straight the loop has left
  K.flat(-900,1500,-900,700,-.04,new THREE.MeshStandardMaterial({color:0x06050a,roughness:.95,metalness:.08}));
  K.road({tex:{center:'rgba(255,80,220,.75)'},walk:0x1a1820,curb:0x3a3848,studs:false,skip:p=>inTube(p)});
  K.start('EVENT 14 · NEON CORE');
  K.lights({every:28,color:0xff80e8,pool:0x8040a0,pole:0x1a1020,skip:p=>inTube(p)||onDeck(p)});
  K.skyline({cx:520,cz:-720,sx:420,sz:160,n:42,h:[55,280],wd:[18,52],seed:2077});
  // elevated mag-deck rails (Skyline Circuit)
  const railM=new THREE.MeshStandardMaterial({color:0x9aa1ab,metalness:.85,roughness:.22,side:THREE.DoubleSide}), glowLine=c=>new THREE.MeshBasicMaterial({color:c,toneMapped:false,side:THREE.DoubleSide});
  [-1,1].forEach(sd=>{ ribbonF(tr,S,railM,(k,p)=>onDeck(p)?[sd*(W+3.6),p.y+.35,sd*(W+3.6),p.y+1.05]:null);
    ribbonF(tr,S,glowLine(0xff40c8),(k,p)=>onDeck(p)?[sd*(W+3.65),p.y+.5,sd*(W+3.65),p.y+.58]:null);
    ribbonF(tr,S,K.curbM,(k,p)=>onDeck(p)?[sd*(W+4.4),p.y+.14,sd*(W+4.4),p.y-1.2]:null); });
  ribbonF(tr,S,new THREE.MeshStandardMaterial({color:0x121018,roughness:.92,side:THREE.DoubleSide}),(k,p)=>onDeck(p)?[-(W+4.4),p.y-1.2,W+4.4,p.y-1.2]:null);
  const piers=[]; for(let s=0;s<tr.L;s+=26){ frame(s,f,tr); if(!onDeck(f.p)) continue; orientQ(f,q,K.basis,K.nr); [-1,1].forEach(sd=>{ pv.copy(f.p).addScaledVector(f.r,sd*(W-1)); pv.y=(f.p.y-1.2)/2; m4.compose(pv,q,new THREE.Vector3(1,f.p.y-1.1,1)); piers.push(m4.clone()); }); }
  K.inst(new THREE.BoxGeometry(1.2,1,1.2),new THREE.MeshStandardMaterial({color:0x2a2438,roughness:.7,metalness:.4}),piers);
  // hyperloop deck + median columns (Under the El)
  const HY={y:11.2,x0:424,x1:716,z:-300}, steel=new THREE.MeshStandardMaterial({color:0x3a2850,metalness:.65,roughness:.45}); HY.len=HY.x1-HY.x0; // the deck runs along x, centered on the road (z -300), only where the road is
  K.box(HY.len,.9,14,steel,(HY.x0+HY.x1)/2,HY.y+.45,HY.z); [-6.5,6.5].forEach(l=>K.box(HY.len,2.2,.55,steel,(HY.x0+HY.x1)/2,HY.y-.1,HY.z+l));
  const cols=[], lamps=[], pillars=[];
  for(let x=HY.x0;x<HY.x1;x+=14){ [-7.2,7.2].forEach(l=>cols.push(new THREE.Matrix4().makeTranslation(x,HY.y/2,HY.z+l))); lamps.push(new THREE.Matrix4().makeTranslation(x,HY.y-.5,HY.z)); } // columns stand outside the road; the median posts are the pillar hazards below
  for(let s=40;s<tr.L-60;s+=15){ frame(s,f,tr); if(!onHyper(f.p)) continue; pv.copy(f.p); pv.y=HY.y/2; cols.push(new THREE.Matrix4().compose(pv,new THREE.Quaternion(),one)); pillars.push({s,x:0,hw:.62}); }
  K.inst(new THREE.BoxGeometry(.85,HY.y,.85),steel,cols);
  K.inst(new THREE.BoxGeometry(1.6,.45,1.6),new THREE.MeshStandardMaterial({color:0xff40c8,emissive:0xff40c8,emissiveIntensity:.35,roughness:.5}),pillars.map(p=>{ frame(p.s,f,tr); return new THREE.Matrix4().makeTranslation(f.p.x,.25,f.p.z); }));
  K.inst(new THREE.BoxGeometry(1.1,.18,.5),new THREE.MeshBasicMaterial({color:0xff9aef,toneMapped:false}),lamps);
  lampCones(S,lamps.map(m=>{ const v=new THREE.Vector3().setFromMatrixPosition(m); v.y+=4.2; return new THREE.Matrix4().makeTranslation(v.x,v.y,v.z); }));
  // neon tube (Harbor Line tunnel, recolored)
  const tWall=new THREE.MeshStandardMaterial({color:0x1a1028,roughness:.35,metalness:.55,emissive:0x401060,emissiveIntensity:.4,side:THREE.DoubleSide});
  const tStripe=glowLine(0x2fe6ff), tMagenta=glowLine(0xff2fb4);
  [-1,1].forEach(sd=>{ const o=sd*(W+.25);
    ribbonF(tr,S,tWall,(k,p)=>inTube(p)?[o,p.y+.1,o,p.y+6.8]:null);
    ribbonF(tr,S,tStripe,(k,p)=>inTube(p)?[sd*(W+.22),p.y+1.2,sd*(W+.22),p.y+1.35]:null);
    ribbonF(tr,S,tMagenta,(k,p)=>inTube(p)?[sd*(W+.22),p.y+6.5,sd*(W+.22),p.y+6.65]:null); });
  ribbonF(tr,S,new THREE.MeshBasicMaterial({color:0x050508,side:THREE.DoubleSide}),(k,p)=>inTube(p)?[-W-.3,p.y+6.8,W+.3,p.y+6.8]:null);
  const strips=[], st=[]; for(let s=0;s<tr.L;s+=11){ frame(s,f,tr); if(!inTube(f.p)) continue; orientQ(f,q,K.basis,K.nr); [-3.2,3.2].forEach(x=>{ pv.copy(f.p).addScaledVector(f.r,x); pv.y+=6.55; m4.compose(pv,q,one); strips.push(m4.clone()); pv.y=f.p.y+.05; m4.compose(pv,q,one); st.push(m4.clone()); }); }
  K.inst(new THREE.BoxGeometry(.35,.06,7),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}),strips); lampStreaks(S,st,true);
  // container yard chicane dressing (Dockside Dash)
  const corrT=CT(canvasTex(128,64,(g,w,h)=>{ g.fillStyle='#101018'; g.fillRect(0,0,w,h); g.fillStyle='#ff2fb4'; g.font='900 14px monospace'; g.fillText(['NEON','VOID','SYNTH','KAIZEN'][Math.random()*4|0],8,38); }));
  const cM=new THREE.MeshStandardMaterial({map:corrT,roughness:.45,metalness:.55,emissive:0xffffff,emissiveMap:corrT,emissiveIntensity:.35});
  const L40=[]; for(let x=304;x<398;x+=13) for(let z=-292;z<-172;z+=2.8){ const n=2+(K.R()*3|0); for(let lv=0;lv<n;lv++) L40.push(new THREE.Matrix4().makeTranslation(x,lv*2.6+1.2,z)); } // the old loop never ran (z started below its own limit); stacks stay clear of the road edges
  K.inst(new THREE.BoxGeometry(12.2,2.6,2.44).translate(0,1.3,0),cM,L40);
  K.flat(260,440,-310,-150,.02,new THREE.MeshStandardMaterial({color:0x121018,roughness:.85}));
  // holo billboards + megacity facades
  K.frontage(0,K.sNear(400,-300),-1,{set:6,h:[10,18],dep:[12,20],len:[8,14],styles:['glass','glass','stone'],gap:.08});
  K.frontage(K.sNear(720,-80),tr.L-40,1,{set:7,h:[12,22],dep:[14,24],len:[10,18],styles:['glass'],gap:.05});
  const ADS=[['SYNTH SOUL','#ff2fb4','#0a0410'],['GHOSTLINE VPN','#2fe6ff','#040818'],['NEON CORE','#b45cff','#080410'],['AFTERHOURS 2077','#ffd23b','#100804'],['VOID RUNNER','#7dff9a','#041008']];
  let ai=0; for(let s=50;s<tr.L;s+=88){ frame(s,f,tr); if(onDeck(f.p)||inTube(f.p)) continue; orientQ(f,q,K.basis,K.nr); const sd=ai%2?1:-1, [txt,fg,bg]=ADS[ai++%ADS.length];
    K.at(s,sd*(W+8),5); K.sign(signCanvas(txt,{w:480,h:140,bg,color:fg,size:58,glow:18}),11,3.2,K.pv.x,K.pv.y,K.pv.z,Math.atan2(K.f.r.x*sd,K.f.r.z*sd)); K.glow(new THREE.Color(fg).getHex(),12,K.pv.x,K.pv.y+1,K.pv.z); }
  // Pulse Grid boost pads (Game Night mechanic, cyber palette)
  const pads=[], padT={};
  const pad=(x,z,lane,team)=>{ const s=K.sNear(x,z); K.at(s,lane); const m=new THREE.Mesh(new THREE.PlaneGeometry(4.8,6.2),new THREE.MeshBasicMaterial({map:padT[team]||(padT[team]=CT(neonPadCanvas(team))),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));
    m.position.copy(K.pv); m.position.y+=.05; m.quaternion.copy(K.q); m.rotateX(-Math.PI/2); m.rotateZ(Math.PI); S.add(m); pads.push({s,x:lane,hw:2.5,team,m}); };
  pad(620,140,3.4,'pulse'); pad(620,140,-3.4,'sync'); pad(520,-305,3.4,'void'); pad(350,-160,-3.4,'pulse'); pad(120,-170,3.4,'sync');
  // cargo-lock gate (freight crossing from Under the El)
  const XS=K.sNear(240,-260), gates=[], XP=new THREE.Vector3(240,2,-260); // on the straight between the two chicane corners; the freight line runs along z at x 240
  [[230,1],[250,-1]].forEach(([x,sd])=>{ const zc=-260+sd*(W+2);
    K.box(.28,4.8,.28,new THREE.MeshStandardMaterial({color:0x9080a0,metalness:.7,roughness:.35}),x,2.4,zc);
    const piv=new THREE.Group(); piv.position.set(x,1.5,zc); S.add(piv);
    const arm=new THREE.Mesh(new THREE.BoxGeometry(.16,.16,2*W+1.2),new THREE.MeshBasicMaterial({map:CT(canvasTex(256,16,(g,w)=>{ for(let i=0;i<8;i++){ g.fillStyle=i%2?'#ff2fb4':'#2fe6ff'; g.fillRect(i*w/8,0,w/8,16); } })),toneMapped:false}));
    arm.position.z=-sd*(W+.6); piv.add(arm); gates.push(piv); });
  const cargo=new THREE.Group(); S.add(cargo);
  for(let i=0;i<6;i++){ const c=new THREE.Mesh(new THREE.BoxGeometry(3,3.6,13),new THREE.MeshStandardMaterial({color:[0x2a1040,0x401060,0x102040][i%3],emissive:0x401080,emissiveIntensity:.25,roughness:.5,metalness:.4})); c.position.set(0,2,-9-i*15); cargo.add(c); }
  cargo.position.x=240; cargo.visible=false;
  { const rM=new THREE.MeshStandardMaterial({color:0x8a8e94,metalness:1,roughness:.3}); [238.3,241.7].forEach(x=>K.box(.14,.14,380,rM,x,.1,-235)); }
  K.gantry(K.sNear(600,130),'MAG-DECK','ELEVATED RUN · FULL BOOST',{bg:'#2a0840',color:'#ff9af0'});
  K.gantry(K.sNear(350,-295),'DATA PORT','CONTAINER CHICANE',{bg:'#0a1830',color:'#2fe6ff'});
  K.gantry(K.sNear(520,-305),'HYPERLOOP','STAY OFF THE CORE POSTS',{bg:'#1a0828',color:'#ff2fb4'});
  K.gantry(K.sNear(-80,-272),'NEON TUBE','LOW GRIP · KEEP IT STRAIGHT',{bg:'#060818',color:'#b45cff'});
  K.gantry(K.sNear(262,-260),'CARGO LOCK','BEAT THE GATE OR WAIT',{bg:'#ffd23b',color:'#101114'});
  K.flush();
  const obst=K.traffic(4,[0x2a1838,0x401050,0x1a2840,0x302050]);
  const sTube0=K.sNear(-80,-255), sTube1=K.sNear(-80,-105);
  let xt=0, padT0=0, bellT=0;
  const state=()=>{ const t=((xt%XING.cyc)+XING.cyc)%XING.cyc; return {t,warn:t>=XING.warn&&t<XING.close,closed:t>=XING.close&&t<XING.open}; };
  function update(dt){
    xt+=dt; padT0+=dt; pads.forEach((p,i)=>{ p.m.material.opacity=.5+.5*Math.max(0,Math.sin(padT0*4.5-i)); });
    const st=state(), t=st.t, down=clamp(t<XING.warn?0:t<XING.warn+2.4?(t-XING.warn)/2.4:t<XING.open?1:1-(t-XING.open)/1.6,0,1);
    gates.forEach(g=>g.rotation.x=Math.PI/2*(1-down));
    cargo.visible=t>19&&t<38.6; if(cargo.visible) cargo.position.z=-285+(t-25.2)*18; // front car is ~34 m short of the crossing when the gates close, same timing as Under the El
    if((st.warn||st.closed)&&mode==='race'&&cam.position.distanceTo(XP)<160){ bellT-=dt; if(bellT<=0){ bellT=.5; tone(1250,.09,.07,'triangle',{attack:.002}); } }
  }
  return {scene:S,track:tr,traffic:obst,update,sNear:K.sNear,cams:[{s:K.sNear(680,120)},{s:K.sNear(400,-280)}],pads,pillars,crossing:{s:XS,state},
    surf:[{s0:sTube0,s1:sTube1,grip:.58,name:'neon'}],
    resetTraffic(){ xt=Math.random()*12; [.14,.32,.55,.78].forEach((u,i)=>{ const o=obst[i]; o.dist=u*tr.L; o.x=i%2?3.6:-3.6; o.v=11+Math.random()*5; }); }};
}

/* ---- Event 15: Calder Basin, an original port city (≈5.6 km / lap) ----
   Designed from what racers say makes a map stick (Midnight Club II's Paris and Tokyo, Burnout Paradise, Trackmania):
   long, readable straights where top speed matters, one technical sector that rewards skill, a landmark for every sector so
   you always know where you are, and a pace curve of fast -> technical -> fastest -> hardest -> payoff -> fastest again.
   Quay Run (600 m straight under the cranes) -> Container Maze chicane -> Steel Bridge (970 m flat out, a crest at mid-span
   that throws you in the air) -> Old Town cobbled switchbacks and the bell-tower hairpin -> Highway 9, an elevated viaduct
   along the ridge with a 360 m straight and a big 180-degree sweeper -> the Calder Tunnel, 600 m through the hill in a long
   curve (white panel tube, hex-lattice gallery in the middle) -> out of the hill and down the S-bends to the quay.
   The look follows the Midjourney key frames in levels/calder-basin-asset-pack.md; the landmarks are the Blender kit
   (models/calder_kit.glb, tools/blender/calder_kit.py). Everything has a procedural fallback if the kit has not loaded. */
const CB_CORNERS=[[0,-700,60],[170,-700,26],[215,-655,26],[300,-655,26],[345,-700,26],[560,-700,70],[560,400,60],[430,400,28],[430,540,28],[300,540,28],
  [300,690,24],[230,690,22],[230,630,22],[110,630,35],[110,900,50],[-820,900,220],[-820,420,220],[-120,240,140],[0,60,90]];
const CB_KEYS=[[0,-40,0],[0,-700,0],[345,-700,0],[560,-640,0],[560,-480,13],[560,-250,13],[560,-220,15.5],[560,-190,13],[560,120,13],[560,300,2],[560,400,2.5],
  [430,400,5],[430,540,9],[300,540,13],[300,690,18],[230,690,19.5],[230,630,21],[110,630,24],[110,900,30],[-300,900,31],[-640,900,30],[-820,760,26],
  [-820,560,20],[-700,420,14],[-380,320,7],[-200,265,4],[0,60,.5]];
const CB_SPAN=p=>Math.abs(p.x-560)<4&&p.z>-472&&p.z<112; // the bridge deck over the channel (no sidewalks, no lamp posts)
/* ---- the Calder Tunnel, round 2: built straight from the Midjourney tunnel frames (levels/calder-basin-asset-pack.md, T1-T4).
   Five acts along ~750 m: a brushed-titanium lens hood with a copper lip ring -> the copper fin vault through the long bend
   (thousands of angled fins in a slow spiral, glowing on their inner edges, a light pulse running down the tube) -> the
   cliff gallery on the straight (white vault, sweeping light lines, floor-to-ceiling glass looking down at the harbor)
   -> the cyan hex-lattice vault on black steel ribs -> the exit hood with a cyan lip ring.
   threejs-geometry: every surface is generated along the track frame (no kit parts), chunked ~60 m so the frustum culls it.
   threejs-shaders: the fins carry aGlow/aS attributes; onBeforeCompile adds the edge glow and the travelling pulse.
   threejs-textures: canvas hex lattice (albedo + emissive pair). threejs-lighting/materials: each act's glossy road and
   metals reflect a cube capture of that act (CubeCamera -> PMREM), so the fins and the hexes really show in the asphalt. */
function calderSections(tr,sT0,sT1){ const F=mkF(); let sBend=sT0+200;
  for(let s=sT0+150;s<sT1-200;s+=2){ frame(s,F,tr); if(Math.abs(F.k)<.0008){ sBend=s; break; } }
  const sF0=sT0+30, sF1=Math.min(sBend+30,sT1-330), sG0=sF1+16, sG1=Math.min(sG0+175,sT1-140), sH0=sG1+16, sH1=sT1-30;
  frame((sG0+sG1)/2,F,tr); return {sF0,sF1,sG0,sG1,sH0,sH1,gal:F.r.z>0?-1:1}; } // gal: the harbor (south, -z) side, as a sign on the track's right vector
function calderTunnel(K,tr,sT0,sT1,C){
  const S=K.S, W=tr.W, F=mkF(), V3=THREE.Vector3, D2=THREE.DoubleSide, PI=Math.PI;
  const A=10.6, B=8.2, FD=1.9, AS=A+FD+.25, BS=B+FD+.25; // fin vault inner ellipse, fin depth, the shell behind the fins
  const tf=(v,s)=>typeof v==='function'?v(s):v;
  // a strip of the elliptical vault x=a cos t, y=b sin t (t=0 on the right base, PI on the left), over one or more s spans
  const vaultGeo=(spans,ds,t0,t1,nt,a,b,vS,extra)=>{ const pos=[], uv=[], idx=[]; let base=0;
    spans.forEach(([c0,c1])=>{ let row=0;
      for(let s=c0;;s+=ds){ const ss=Math.min(s,c1); frame(ss,F,tr); const ta=tf(t0,ss), tb=tf(t1,ss), aa=tf(a,ss), bb=tf(b,ss);
        for(let j=0;j<=nt;j++){ const t=ta+(tb-ta)*j/nt, x=aa*Math.cos(t), y=bb*Math.sin(t); pos.push(F.p.x+F.r.x*x,F.p.y+y,F.p.z+F.r.z*x); uv.push(j/nt,ss/vS); }
        if(row){ const o=base+(row-1)*(nt+1); for(let j=0;j<nt;j++) idx.push(o+j,o+nt+1+j,o+j+1, o+j+1,o+nt+1+j,o+nt+2+j); }
        row++; if(ss>=c1) break; }
      base+=row*(nt+1); });
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2)); g.setIndex(idx); g.computeVertexNormals(); return g; };
  const add=(g,m,ro)=>{ const me=new THREE.Mesh(g,m); if(ro) me.renderOrder=ro; S.add(me); return me; };
  const vault=(s0,s1,ds,t0,t1,nt,a,b,mat,vS)=>{ const out=[]; for(let c=s0;c<s1-.01;c+=60) out.push(add(vaultGeo([[c,Math.min(s1,c+60)]],ds,t0,t1,nt,a,b,vS||12),mat)); return out; };
  // an end wall between two vault ellipses at one station (closes the step where acts of different size meet)
  const cap=(s,a0,b0,a1,b1,mat,t0,t1)=>{ t0=t0===undefined?-.05:t0; t1=t1===undefined?PI+.05:t1; const nt=40, pos=[], idx=[]; frame(s,F,tr);
    for(let j=0;j<=nt;j++){ const t=t0+(t1-t0)*j/nt, c=Math.cos(t), sn=Math.sin(t); [[a0,b0],[a1,b1]].forEach(([a,b])=>pos.push(F.p.x+F.r.x*a*c,F.p.y+b*sn,F.p.z+F.r.z*a*c)); if(j) idx.push(2*j-2,2*j-1,2*j, 2*j-1,2*j+1,2*j); }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setIndex(idx); g.computeVertexNormals(); return add(g,mat); };
  const bands=(list,w,t0,t1,nt,a,b,mat)=>add(vaultGeo(list.map(s=>[s,s+w]),w,t0,t1,nt,a,b,1),mat); // thin rings across the vault (light rings, ribs, mullions)
  const glowM=c=>new THREE.MeshBasicMaterial({color:c,toneMapped:false,side:D2});
  const COP=0xffa45c, CYAN=0x5ff2ff, WARMW=0xffe6c4;
  const env=[]; // [s, material list] per act, filled by cube captures at the end

  // ---------- road: black glass-smooth asphalt, edge LEDs, dark shoulders (one material per act so each reflects its own act) ----------
  const rT=CT(canvasTex(256,512,(g,w,h)=>{ g.fillStyle='#0c0d10'; g.fillRect(0,0,w,h); const R=rng(733);
    for(let i=0;i<7000;i++){ const v=14+R()*22; g.fillStyle=`rgba(${v},${v},${v+3},.5)`; g.fillRect(R()*w,R()*h,1.2,1.2); }
    g.fillStyle='rgba(236,238,244,.9)'; g.fillRect(w*.035,0,4,h); g.fillRect(w*.965-4,0,4,h);
    g.fillStyle='rgba(255,196,64,.9)'; g.fillRect(w*.5-7,0,4,h); g.fillRect(w*.5+3,0,4,h); }),true);
  const roadM=()=>new THREE.MeshStandardMaterial({map:rT,color:0xb4b8c0,roughness:.13,metalness:.42,envMapIntensity:1.7,side:D2});
  const shM=()=>new THREE.MeshStandardMaterial({color:0x16171a,roughness:.32,metalness:.4,envMapIntensity:1.2,side:D2});
  const acts=[[sT0-22,C.sG0-8,COP],[C.sG0-8,C.sG1+8,WARMW],[C.sG1+8,sT1+22,CYAN]];
  const actMats=acts.map(([a,b,col])=>{ const rm=roadM(), sm=shM(), inA=k=>{ const s=k*tr.ds; return s>=a&&s<b; };
    ribbonF(tr,S,rm,(k,p)=>inA(k)?[-W-.3,p.y+.014,W+.3,p.y+.014]:null,24);
    [-1,1].forEach(sd=>{ ribbonF(tr,S,sm,(k,p)=>inA(k)?[sd*(W+.3),p.y+.012,sd*(AS+.3),p.y+.012]:null,8);
      ribbonF(tr,S,glowM(col),(k,p)=>inA(k)?[sd*(W+.55),p.y+.03,sd*(W+.75),p.y+.03]:null);              // LED line set in the shoulder
      ribbonF(tr,S,glowM(col),(k,p)=>inA(k)&&!(col===WARMW&&sd===C.gal)?[sd*(A-.15),p.y+.55,sd*(A-.15),p.y+.62]:null); }); // low wall-wash line
    return [rm,sm]; });
  { const st=[]; for(let s=sT0;s<sT1;s+=9) [-1,1].forEach(sd=>{ K.at(s,sd*3.6,0); K.pv.y=K.f.p.y+.03; st.push(new THREE.Matrix4().compose(K.pv.clone(),K.q.clone(),K.one)); }); lampStreaks(S,st,true); }

  // hex lattice canvases (threejs-textures: albedo + emissive pair, tileable 2x2 periods); pal = [centre, mid, edge] rgb
  const R6=64, HW=384, HH=222, hexPath=(g,cx,cy,r)=>{ g.beginPath(); for(let i=0;i<6;i++){ const a=i*PI/3; g.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a)); } g.closePath(); };
  const hexCells=(g,fn)=>{ for(let cx=-R6*3;cx<HW+R6*3;cx+=R6*1.5) for(let cy=-HH;cy<HH*2;cy+=R6*Math.sqrt(3)){ const col=Math.round(cx/(R6*1.5)), y=cy+(col%2?R6*Math.sqrt(3)/2:0); fn(cx,y); } };
  const hexTex=(pal,cell,seed)=>{ const a=CT(canvasTex(HW,HH,(g,w,h)=>{ g.fillStyle='#07090b'; g.fillRect(0,0,w,h); hexCells(g,(x,y)=>{ hexPath(g,x,y,R6-7); g.fillStyle=cell; g.fill(); }); }),true);
    const e=CT(canvasTex(HW,HH,(g,w,h)=>{ g.fillStyle='#000'; g.fillRect(0,0,w,h); const R=rng(seed);
      hexCells(g,(x,y)=>{ const gr=g.createRadialGradient(x,y,2,x,y,R6), k=R()<.07?.35:1, c=v=>`rgba(${v.map(q=>q*k|0).join(',')},1)`; gr.addColorStop(0,c(pal[0])); gr.addColorStop(.55,c(pal[1])); gr.addColorStop(1,c(pal[2]));
        hexPath(g,x,y,R6-7); g.fillStyle=gr; g.fill(); }); }),true); return [a,e]; };
  const [hexA,hexE]=hexTex([[235,255,255],[150,236,246],[20,90,110]],'#9fb4b8',616), [cuA,cuE]=hexTex([[255,214,160],[214,120,60],[70,26,8]],'#b07850',617);
  hexA.repeat.set(5,1); hexE.repeat.set(5,1); cuA.repeat.set(5,1); cuE.repeat.set(5,1);
  const hexVS=HH/HW*((PI-2*.44)*9.6)/5;
  const hexM=new THREE.MeshStandardMaterial({map:hexA,emissiveMap:hexE,emissive:0xffffff,emissiveIntensity:1.25,roughness:.3,metalness:.55,envMapIntensity:1.1,side:D2});
  const cuHexM=new THREE.MeshStandardMaterial({map:cuA,emissiveMap:cuE,emissive:0xffffff,emissiveIntensity:.9,roughness:.28,metalness:.75,envMapIntensity:1.2,side:D2});
  // ---------- portals: the lens hood (Midjourney portal frames: titanium shell, copper lining, ring light, hex throat) ----------
  const tiM=new THREE.MeshStandardMaterial({color:0x9da3ad,metalness:.88,roughness:.28,envMapIntensity:1.35,side:D2});
  const cuM=new THREE.MeshStandardMaterial({color:0xc07a4c,emissive:0x2a1006,metalness:.92,roughness:.24,envMapIntensity:1.5,side:D2}); // the copper lining
  const tiDark=new THREE.MeshStandardMaterial({color:0x2b2e33,metalness:.8,roughness:.35,envMapIntensity:1.2,side:D2});
  const hood=(sP,dir,col)=>{ const NT=44, NU=16, pos=[], idx=[], lip=[], inset=[], P=new V3();
    for(let i=0;i<=NU;i++){ const u=i/NU;
      for(let j=0;j<=NT;j++){ const t=-.06+(PI+.12)*j/NT, st=Math.max(0,Math.sin(t)), reach=3+18*Math.pow(st,.85), s=sP+dir*reach*(1-u), k=1+.62*Math.pow(1-u,2)*(.55+.45*st);
        frame(s,F,tr); const x=AS*k*Math.cos(t), y=BS*k*Math.sin(t); P.set(F.p.x+F.r.x*x,F.p.y+y,F.p.z+F.r.z*x); pos.push(P.x,P.y,P.z); if(i===0) lip.push(P.clone()); if(i===6) inset.push(P.clone()); }
      if(i){ const o=(i-1)*(NT+1); for(let j=0;j<NT;j++) idx.push(o+j,o+NT+1+j,o+j+1, o+j+1,o+NT+1+j,o+NT+2+j); } }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setIndex(idx); g.computeVertexNormals(); add(g,col===COP?cuM:tiM);
    const og=g.clone(), op=og.attributes.position, on=og.attributes.normal; // a second skin 0.9 m out, so the lip reads as a thick shell
    for(let i=0;i<op.count;i++){ const s=on.getY(i)<0?-1:1; op.setXYZ(i,op.getX(i)+on.getX(i)*.9*s,op.getY(i)+on.getY(i)*.9*s,op.getZ(i)+on.getZ(i)*.9*s); } og.computeVertexNormals(); add(og,tiM);
    add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(lip),120,.42,10,false),glowM(col));
    add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(inset),120,.26,8,false),glowM(col));
    const lc=lip[lip.length>>1]; K.glow(col,30,lc.x,lc.y+1,lc.z); };
  hood(sT0+2,-1,COP); hood(sT1-2,1,CYAN);
  // the throats: a smooth titanium tube with light rings receding into the hill (Midjourney portal frame: rings inside)
  [[sT0+2,C.sF0,COP,cuHexM],[C.sH1,sT1-2,CYAN,null]].forEach(([a,b,col,hm])=>{ vault(a,b,2,.3,PI-.3,30,AS,BS,hm||hexM,hexVS*1.3); [[-.04,.3],[PI-.3,PI+.04]].forEach(([t0,t1])=>vault(a,b,3,t0,t1,6,AS,BS,col===COP?cuM:tiDark,8));
    const rs=[]; for(let s=a+4;s<b-1;s+=5) rs.push(s); bands(rs,.4,-.04,PI+.04,48,AS-.12,BS-.12,glowM(col)); });

  // ---------- act 1: the copper fin vault (Midjourney fin frame, the hero shot) ----------
  vault(C.sF0,C.sF1,3,-.05,PI+.05,36,AS+.15,BS+.15,new THREE.MeshStandardMaterial({color:0x140b06,emissive:0x2a1206,roughness:.7,side:D2}),10); // the warm glow behind the fins
  const TU={uT:{value:0},uFC:{value:new THREE.Color(COP)},uFK:{value:1}};
  const finM=new THREE.MeshStandardMaterial({color:0xd8b494,roughness:.36,metalness:.5,envMapIntensity:1.3,side:D2});
  finM.onBeforeCompile=sh=>{ Object.assign(sh.uniforms,TU);
    sh.vertexShader='attribute float aGlow; attribute float aS; varying float vGlow; varying float vFS;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvGlow=aGlow; vFS=aS;');
    sh.fragmentShader='uniform float uT,uFK; uniform vec3 uFC; varying float vGlow; varying float vFS;\n'+sh.fragmentShader.replace('#include <emissivemap_fragment>',
      '#include <emissivemap_fragment>\n{ float ph=fract((vFS-uT*70.)/180.)-.5, pulse=exp(-ph*ph*1100.);\n  totalEmissiveRadiance+=uFC*uFK*(pow(vGlow,3.)*(1.25+2.4*pulse)+pow(vGlow,.6)*.12+.03); }'); };
  finM.customProgramCacheKey=()=>'cbFin';
  { const NF=34, T0=-.02, T1=PI+.02, dT=(T1-T0)/NF, TW=.55, LEAN=1.35, step=1.45;
    for(let c=C.sF0;c<C.sF1-1;c+=48){ const pos=[], glow=[], ss=[], idx=[], c1=Math.min(C.sF1-1,c+48), fr=[mkF(),mkF(),mkF(),mkF()];
      const pt=(f,t,a,b)=>{ const x=a*Math.cos(t), y=b*Math.sin(t); pos.push(f.p.x+f.r.x*x,f.p.y+y,f.p.z+f.r.z*x); };
      for(let s=c;s<c1;s+=step){ frame(s,fr[0],tr); frame(s+TW,fr[1],tr); frame(s-LEAN,fr[2],tr); frame(s+TW-LEAN,fr[3],tr); const roll=((s*.0105)%dT+dT)%dT;
        for(let j=-1;j<NF;j++){ let ta=T0+roll+j*dT, tb=ta+dT*.9; if(tb<T0||ta>T1) continue; ta=Math.max(ta,T0); tb=Math.min(tb,T1); const n=pos.length/3;
          pt(fr[0],ta,A,B); pt(fr[1],tb,A,B); pt(fr[3],tb,A+FD,B+FD); pt(fr[2],ta,A+FD,B+FD); glow.push(1,1,0,0); ss.push(s,s+TW,s+TW-LEAN,s-LEAN);
          idx.push(n,n+1,n+2,n,n+2,n+3); } }
      const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setAttribute('aGlow',new THREE.Float32BufferAttribute(glow,1));
      g.setAttribute('aS',new THREE.Float32BufferAttribute(ss,1)); g.setIndex(idx); g.computeVertexNormals(); add(g,finM); } }
  env.push([lerp(C.sF0,C.sF1,.45),[finM,tiM,tiDark,cuM,cuHexM,...actMats[0]]]);

  // ---------- collars between the acts: a short dark-titanium tube with three light rings in the colour of the next act ----------
  [[C.sF1,C.sG0,WARMW],[C.sG1,C.sH0,CYAN]].forEach(([a,b,col])=>{ vault(a,b,2,-.04,PI+.04,40,A+.3,B+.3,tiDark,8); bands([a+3,a+7.5,a+12],.5,-.04,PI+.04,48,A+.18,B+.18,glowM(col)); });

  cap(C.sF0,AS-.2,BS-.2,AS+.2,BS+.2,tiDark); cap(C.sF1,A+.3,B+.3,AS+.2,BS+.2,tiDark); cap(C.sH0,A,B,A+.35,B+.35,tiDark); cap(C.sH1,A,B,AS+.05,BS+.05,tiDark);
  // ---------- act 2: the cliff gallery (Midjourney glass frame): white vault, sweeping light lines, glass on the harbor side ----------
  const gA=A+.2, gB=B+.7, TG=1.95, solid=C.gal<0?[0,TG]:[PI-TG,PI], glassR=C.gal<0?[TG,PI]:[0,PI-TG];
  const grooveT=CT(canvasTex(256,8,(g,w,h)=>{ g.fillStyle='#c79a74'; g.fillRect(0,0,w,h); for(let x=0;x<w;x+=4){ g.fillStyle=x%8?'#a87a58':'#d8ad86'; g.fillRect(x,0,1.5,h); } }),true); grooveT.repeat.set(30,1);
  const whiteM=new THREE.MeshStandardMaterial({map:grooveT,color:0xd0a07a,emissive:0x2e170a,roughness:.3,metalness:.55,envMapIntensity:1.45,side:D2}); // satin bronze, fine grooves along the tube
  vault(C.sG0,C.sG1,2,solid[0],solid[1],30,gA,gB,whiteM,12);
  vault(C.sG0,C.sG1,4,solid[0],solid[1],20,gA+.6,gB+.6,new THREE.MeshStandardMaterial({color:0xcfd2d6,roughness:.4,metalness:.3,side:D2}),12); // outer skin, seen from the valley
  const glassM=new THREE.MeshStandardMaterial({color:0x22313f,metalness:.95,roughness:.04,transparent:true,opacity:.16,depthWrite:false,envMapIntensity:2.2,side:D2});
  vault(C.sG0,C.sG1,4,glassR[0],glassR[1],14,gA,gB,glassM,12).forEach(m=>{ m.renderOrder=3; });
  { const ms=[]; for(let s=C.sG0;s<C.sG1;s+=3.4) ms.push(s); bands(ms,.14,glassR[0],glassR[1],14,gA-.05,gB-.05,tiDark); } // mullions
  K.at(C.sG0,0); // floor out to the glass and a warm sill line along its foot
  ribbonF(tr,S,glowM(WARMW),(k,p)=>{ const s=k*tr.ds; return s>C.sG0&&s<C.sG1?[C.gal*(gA-.3),p.y+.08,C.gal*(gA-.3),p.y+.18]:null; });
  { const lines=[[.5,0],[.82,1.7],[1.12,3.1],[1.42,4.4],[1.7,5.9]].map(([t,ph])=>[C.gal<0?t:PI-t,ph]), lineM=glowM(0xfff1dc);
    lines.forEach(([tc,ph],i)=>{ const th=s=>tc+.17*Math.sin(s/(23+i*3)+ph)*(i===0?.4:1); vault(C.sG0+1,C.sG1-1,1.5,s=>th(s)-.011,s=>th(s)+.011,1,gA-.04,gB-.04,lineM,12); }); }
  [C.sG0,C.sG1].forEach(s=>cap(s,gA-.05,gB-.05,A+.35,B+.35,tiDark));
  { const st=[]; for(let s=C.sG0+2;s<C.sG1;s+=3.2){ K.at(s,-C.gal*(W+.65),.03); st.push(new THREE.Matrix4().compose(K.pv.clone(),K.q.clone(),K.one)); }
    K.inst(new THREE.BoxGeometry(.22,.05,.22),glowM(0xffa040),st); } // amber studs down the inside shoulder
  env.push([lerp(C.sG0,C.sG1,.5),[whiteM,glassM,...actMats[1]]]);

  // ---------- act 3: the hex vault (Midjourney hex frame): backlit hex lattice on black ribs, dark panels with cyan lines ----------
  const TH=.44; vault(C.sH0,C.sH1,2,TH,PI-TH,30,A,B,hexM,hexVS);
  const panelM=new THREE.MeshStandardMaterial({color:0x101317,roughness:.16,metalness:.7,envMapIntensity:1.5,side:D2});
  [[0,TH],[PI-TH,PI]].forEach(([a,b])=>vault(C.sH0,C.sH1,3,a-.03,b,8,A,B,panelM,12));
  { const cy=glowM(CYAN); [.12,.3,PI-.3,PI-.12].forEach(t=>vault(C.sH0,C.sH1,4,t-.006,t+.006,1,A-.05,B-.05,cy,12)); }
  { const rs=[]; for(let s=C.sH0+2;s<C.sH1;s+=7.5) rs.push(s); bands(rs,.5,-.03,PI+.03,40,A-.32,B-.32,new THREE.MeshStandardMaterial({color:0x08090a,metalness:.7,roughness:.4,side:D2})); }
  env.push([lerp(C.sH0,C.sH1,.5),[hexM,panelM,...actMats[2]]]);

  // ---------- haze: motes hanging in the light, copper in the fins, cyan in the hex vault ----------
  [[C.sF0,C.sF1,0xffb27a],[C.sH0,C.sH1,0x9ff4ff]].forEach(([a,b,col],ii)=>{ const R=rng(90+ii), pos=[];
    for(let i=0;i<(b-a)*4;i++){ frame(a+R()*(b-a),F,tr); const x=(R()-.5)*2*(A-1), y=.5+R()*(B-1.5); pos.push(F.p.x+F.r.x*x,F.p.y+y,F.p.z+F.r.z*x); }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    S.add(new THREE.Points(g,new THREE.PointsMaterial({map:glowTex,color:col,size:.16,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false}))); });

  // ---------- per-act reflections: one cube capture in each act, run once (threejs-lighting: CubeCamera -> PMREM) ----------
  const capture=()=>{ env.forEach(([s,mats])=>{ const rt=new THREE.WebGLCubeRenderTarget(128,{format:THREE.RGBAFormat,type:THREE.HalfFloatType,generateMipmaps:true,minFilter:THREE.LinearMipmapLinearFilter});
    const cc=new THREE.CubeCamera(.3,1500,rt); frame(s,F,tr); cc.position.set(F.p.x,F.p.y+1.3,F.p.z); S.add(cc);
    try{ cc.update(renderer,S); const e=pmrem.fromCubemap(rt.texture).texture; mats.forEach(m=>{ m.envMap=e; m.needsUpdate=true; }); }catch(err){ console.warn('calder env capture',err); }
    S.remove(cc); rt.dispose(); }); };

  // ---------- fog by act (read off the camera, so photo-mode and replays get it too) ----------
  const tp=[]; for(let s=sT0-40;s<sT1+40;s+=4){ frame(s,F,tr); tp.push(F.p.x,F.p.z,s); }
  const fog0=S.fog.color.clone(), d0=S.fog.density, fc=new THREE.Color(), FOGS=[[0x2c180c,.0072],[0x2a2430,.0026],[0x0a2328,.0064]];
  const update=(dt,camP)=>{ TU.uT.value+=dt; let bs=-1, bd=900;
    for(let i=0;i<tp.length;i+=3){ const d=(tp[i]-camP.x)**2+(tp[i+1]-camP.z)**2; if(d<bd){ bd=d; bs=tp[i+2]; } }
    let col=fog0, den=d0;
    if(bs>sT0-10&&bs<sT1+10){ const q=bs<C.sG0-4?0:bs<C.sH0-4?1:2, ed=Math.min(bs-(sT0-10),sT1+10-bs), k=clamp(ed/25,0,1); fc.setHex(FOGS[q][0]); col=fc.lerp(fog0,1-k); den=lerp(d0,FOGS[q][1],k); }
    const a=1-Math.exp(-dt*3); S.fog.color.lerp(col,a); S.fog.density=lerp(S.fog.density,den,a); };
  return {capture,update}; }
function buildCalder(){
  const K=sceneKit({bg:0x1a1626,fog:0x3a2c36,fogD:.0014,hemi:.72,sky:0xffb88a,ground:0x0c0d12,moon:0xffc08a,moonI:.5,seed:1515,dome:false,bloom:{strength:.8,threshold:.74}}), S=K.S, V=(x,z)=>new THREE.Vector2(x,z);
  // dusk sky from the Midjourney quay and ridge frames: blue-violet overhead to an orange-red band on the horizon (draw() keeps it on the camera)
  const sky=new THREE.Mesh(new THREE.SphereGeometry(1300,32,16),new THREE.MeshBasicMaterial({side:THREE.BackSide,depthWrite:false,fog:false,map:CT(canvasTex(16,512,(g,w,h)=>{
    const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#070b22'); gr.addColorStop(.26,'#18204a'); gr.addColorStop(.38,'#3a2c58'); gr.addColorStop(.45,'#a24a50');
    gr.addColorStop(.485,'#f0784a'); gr.addColorStop(.503,'#ffc27a'); gr.addColorStop(.52,'#3a2a30'); gr.addColorStop(1,'#120e12'); g.fillStyle=gr; g.fillRect(0,0,w,h); }))}));
  sky.renderOrder=-10; S.add(sky); S.userData.dome=sky;
  // the lap: exact straights from the fillet path, heights from the keys (sharp around the bridge crest, smooth everywhere else)
  const pts=resample3(filletPath(V(0,-40),CB_CORNERS.map(([x,z,r])=>[V(x,z),r]),1),()=>0), n=pts.length;
  const near=(x,z)=>{ let bi=0,bd=1e18; pts.forEach((p,i)=>{ const d=(p.x-x)**2+(p.z-z)**2; if(d<bd){ bd=d; bi=i; } }); return bi; };
  const keys=CB_KEYS.map(([x,z,y])=>[near(x,z),y]).sort((a,b)=>a[0]-b[0]), raw=new Float32Array(n), crest=near(560,-220);
  for(let i=0;i<n;i++){ let j=keys.findIndex(k=>k[0]>i); const a=j<=0?keys[keys.length-1]:keys[j-1], b=j<0?keys[0]:keys[j];
    let span=b[0]-a[0]; if(span<=0) span+=n; let u=i-a[0]; if(u<0) u+=n; raw[i]=lerp(a[1],b[1],u/span); }
  pts.forEach((p,i)=>{ const w=Math.abs(i-crest)<45?4:18; let s=0; for(let j=-w;j<=w;j++) s+=raw[(i+j+n)%n]; p.y=s/(2*w+1); });
  const tr=K.track(pts,7,6), W=tr.W, L=tr.L, f=K.f, pv=K.pv, m4=K.m4, one=K.one;
  // sectors by distance along the lap
  const sBr0=K.sNear(560,-472), sBr1=K.sNear(560,112), sOT0=K.sNear(500,400), sOT1=K.sNear(110,860),
    sHw0=K.sNear(30,900), sHw1=K.sNear(-820,640), sT0=sHw1, sT1=K.sNear(-330,306), sHex0=lerp(sT0,sT1,.38), sHex1=lerp(sT0,sT1,.62);
  const CS=calderSections(tr,sT0,sT1), inGal=s=>s>CS.sF1-6&&s<CS.sH0+6;
  const inHw=s=>s>sHw0&&s<sHw1, inTun=s=>s>sT0&&s<sT1, noWalk=(p,k)=>{ const s=(k||0)*tr.ds; return CB_SPAN(p)||inHw(s)||inTun(s); };
  const sub=pts.filter((p,i)=>i%8===0), land=sub.filter(p=>!CB_SPAN(p));
  const nearRoad=(x,z)=>{ let bd=1e18,bi=0; for(let i=0;i<sub.length;i++){ const p=sub[i], d=(p.x-x)**2+(p.z-z)**2; if(d<bd){ bd=d; bi=i; } } return {d:Math.sqrt(bd),p:sub[bi],s:bi*8*tr.ds}; };
  const water=(x,z)=>z<-833||(x>433&&z>-468&&z<108);

  // ---- terrain: hugs the road, falls away under Highway 9 (it reads as a viaduct over the valley), stands 22 m over the
  //      Calder Tunnel, and drops into the harbor and the channel ----
  const tg=new THREE.PlaneGeometry(2900,2700,170,156); tg.rotateX(-Math.PI/2); tg.translate(350,0,-100);
  const tp=tg.attributes.position, tcol=[];
  for(let i=0;i<tp.count;i++){ const x=tp.getX(i), z=tp.getZ(i); let ws=0, ys=0;
    for(const p of land){ const d=Math.hypot(p.x-x,p.z-z); if(d>420) continue; const w=1/Math.pow(d+4,3); ws+=w; ys+=w*p.y; }
    const nr=nearRoad(x,z); let y=(ws?ys/ws:0)-.5;
    let gl=null; if(inGal(nr.s)&&nr.d<320){ frame(nr.s,f,tr); gl=((x-nr.p.x)*f.r.x+(z-nr.p.z)*f.r.z)*CS.gal; } // lateral, + toward the harbor
    if(gl!==null&&gl>-26) y=nr.p.y-5-Math.max(0,gl-14)*.2;                                             // the cliff ledge under the glass gallery
    else if(inTun(nr.s)&&nr.d<180) y=Math.max(y,nr.p.y+22-Math.max(0,nr.d-60)*.12);                       // the hill over the tunnel
    else if(nr.d<W+60&&Math.min(Math.abs(nr.s-sT0),Math.abs(nr.s-sT1))<50&&nr.d>W+12) y=Math.max(y,nr.p.y+Math.min(16,(nr.d-W-12)*.5)); // hillside shoulders around the portals
    else if(inHw(nr.s)&&nr.s>sHw0+120) y=Math.min(y,nr.p.y-15+Math.min(8,nr.d*.03));                 // valley under the viaduct
    else if(!CB_SPAN(nr.p)) y=Math.min(y,nr.p.y-.45+Math.max(0,nr.d-(W+1))*.1);
    if(water(x,z)) y=-7;
    tp.setY(i,y); const yard=z<-470&&!water(x,z), g=.05+.03*Math.sin(x*.05)*Math.cos(z*.04);
    if(yard) tcol.push(.11,.11,.12); else tcol.push(g*.95,g*1.15,g*.8); }
  tg.setAttribute('color',new THREE.Float32BufferAttribute(tcol,3)); tg.computeVertexNormals();
  const terrY=(x,z)=>{ const ix=clamp(Math.round((x-(350-1450))/2900*170),0,170), iz=clamp(Math.round((z-(-100-1350))/2700*156),0,156); return tp.getY(iz*171+ix); };
  K.mesh(tg,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95}),0,0,0);
  const waterN=WETMAPS.normal.clone(); waterN.needsUpdate=true; waterN.repeat.set(60,60);
  const waterM=new THREE.MeshStandardMaterial({color:0x0a0c14,metalness:.9,roughness:.1,normalMap:waterN,normalScale:new THREE.Vector2(.4,.4),envMapIntensity:1.5});
  K.flat(-1100,1900,-1500,-831,-2.5,waterM); K.flat(431,1900,-470,110,-2.5,waterM);
  const concrete=new THREE.MeshStandardMaterial({color:0x6c6a66,roughness:.9}), stoneM=new THREE.MeshStandardMaterial({color:0x6b6258,roughness:.95});
  K.box(3000,4,2,concrete,400,-1.6,-832); K.box(2,4,580,concrete,432,-1.6,-180); K.box(1470,4,2,concrete,1166,-1.6,-470); K.box(1470,4,2,concrete,1166,-1.6,110);
  K.box(34,15,14,stoneM,560,5.6,-478); K.box(34,15,14,stoneM,560,5.6,118); // bridge abutments

  // ---- road: double yellow; sidewalks in the city, none on the bridge, the highway or in the tunnel ----
  K.road({tex:{center:'rgba(255,205,60,.85)'},walk:0x55524c,curb:0x7a7e84,skip:noWalk});
  K.start('EVENT 15 · CALDER BASIN');
  const gratT=CT(canvasTex(128,128,(g,w,h)=>{ g.fillStyle='#1d2024'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(120,128,138,.55)'; g.lineWidth=1;
    for(let k=0;k<w;k+=6){ g.beginPath(); g.moveTo(k+.5,0); g.lineTo(k+.5,h); g.stroke(); } g.strokeStyle='rgba(80,86,94,.6)'; for(let k=0;k<h;k+=16){ g.beginPath(); g.moveTo(0,k+.5); g.lineTo(w,k+.5); g.stroke(); }
    g.fillStyle='rgba(240,240,236,.85)'; g.fillRect(w*.25-2,0,4,h*.5); g.fillRect(w*.75-2,0,4,h*.5); g.fillStyle='rgba(255,205,60,.9)'; g.fillRect(w*.5-5,0,3,h); g.fillRect(w*.5+2,0,3,h); }),true);
  const gratM=new THREE.MeshStandardMaterial({map:gratT,metalness:.75,roughness:.35,side:THREE.DoubleSide});
  ribbonF(tr,S,gratM,(k,p)=>CB_SPAN(p)?[-W,p.y+.02,W,p.y+.02]:null,8);
  const deckM=new THREE.MeshStandardMaterial({color:0x2a2c30,roughness:.8,side:THREE.DoubleSide}), barrierM=new THREE.MeshStandardMaterial({color:0x8a8780,roughness:.85,side:THREE.DoubleSide});
  const onDeck=(k,p)=>CB_SPAN(p)||inHw(k*tr.ds);
  ribbonF(tr,S,deckM,(k,p)=>onDeck(k,p)?[-W-3.2,p.y-1.9,W+3.2,p.y-1.9]:null);
  [-1,1].forEach(sd=>{ ribbonF(tr,S,deckM,(k,p)=>onDeck(k,p)?[sd*(W+3.2),p.y-1.9,sd*(W+3.2),p.y+.05]:null);
    ribbonF(tr,S,barrierM,(k,p)=>onDeck(k,p)?[sd*(W+2.9),p.y,sd*(W+2.9),p.y+1.05]:null); ribbonF(tr,S,barrierM,(k,p)=>onDeck(k,p)?[sd*(W+2.9),p.y+1.05,sd*(W+3.3),p.y+1.05]:null);
    ribbonF(tr,S,deckM,(k,p)=>onDeck(k,p)?[sd*W,p.y+.012,sd*(W+2.9),p.y+.012]:null); });                  // paved shoulder
  for(let z=-360;z<=0;z+=120){ K.at(K.sNear(560,z),0); const y=K.f.p.y-1.9; [-5,5].forEach(dx=>K.box(4,y+7,5,stoneM,560+dx,(y-7)/2,z)); }
  const cobT=CT(canvasTex(128,128,(g,w,h)=>{ g.fillStyle='#2a2620'; g.fillRect(0,0,w,h);
    for(let y=0;y<h;y+=8) for(let x=-((y/8)%2)*6;x<w;x+=12){ const v=64+((x*31+y*17)%34); g.fillStyle=`rgb(${v+6},${v-2},${v-14})`; g.fillRect(x+1,y+1,10,6); } }),true);
  const cobM=wetRoad(new THREE.MeshStandardMaterial({map:cobT,roughness:.5,metalness:.1,side:THREE.DoubleSide}));
  const inOT=k=>{ const s=k*tr.ds; return s>sOT0+20&&s<sOT1-20; };
  ribbonF(tr,S,cobM,(k,p)=>inOT(k)?[-W,p.y+.02,W,p.y+.02]:null,3);
  K.lights({every:36,color:0xffc27a,pool:0xa87848,pole:0x23262b,skip:(p,s)=>CB_SPAN(p)||inTun(s)});

  // ---- the Blender kit: materials for its slots ----
  const km=Object.assign({},kitMats(),{CRANE:new THREE.MeshStandardMaterial({color:0xa8281a,metalness:.55,roughness:.42,envMapIntensity:1.1}),
    STEEL:new THREE.MeshStandardMaterial({color:0x4a4f56,metalness:.85,roughness:.35}),REDLAMP:new THREE.MeshBasicMaterial({color:0xff2a1a,toneMapped:false}),
    CLOCK:new THREE.MeshBasicMaterial({color:0xfff0d0,toneMapped:false}),GLASS:new THREE.MeshBasicMaterial({color:0xffe2b0,toneMapped:false}),
    LED:new THREE.MeshBasicMaterial({color:0xf4f8ff,toneMapped:false}),AMBER:new THREE.MeshBasicMaterial({color:0xff9a3a,toneMapped:false}),
    WARM:new THREE.MeshStandardMaterial({color:0x2a241c,emissive:0xffd6a0,emissiveIntensity:.6,roughness:.6,side:THREE.DoubleSide}),PANEL:new THREE.MeshStandardMaterial({color:0xe4e7ec,metalness:.12,roughness:.28,emissive:0x34363c,side:THREE.DoubleSide}),
    HONEY:new THREE.MeshStandardMaterial({color:0xb48c5c,roughness:.9}),TILE:new THREE.MeshStandardMaterial({color:0x7a3a22,roughness:.85}),
    IRON:new THREE.MeshStandardMaterial({color:0x0b0b0d,metalness:.6,roughness:.45}),WOODSH:new THREE.MeshStandardMaterial({color:0x22403a,roughness:.8}),
    PAINT:new THREE.MeshStandardMaterial({color:0xffffff,metalness:.35,roughness:.6})});
  const KIT=!!(kitParts('GantryCrane')&&kitParts('TrussArch')&&kitParts('Container'));
  const place=(x,y,z,yaw,sx,sy)=>new THREE.Matrix4().makeTranslation(x,y,z).multiply(new THREE.Matrix4().makeRotationY(yaw||0)).multiply(new THREE.Matrix4().makeScale(sx||1,sy||1,1));
  const onTrack=(s,x,dy,flip,sc)=>{ K.at(s,x||0,dy||0); const q=K.q.clone(); if(flip) q.multiply(new THREE.Quaternion().setFromAxisAngle(UP,Math.PI)); return new THREE.Matrix4().compose(K.pv.clone(),q,sc||one); };
  const aviation=[];
  // ---- Quay: ship-to-shore cranes along the water, booms out over the harbor (Midjourney quay frame: two red portals dead ahead off the grid) ----
  const cranes=[-80,100,280,460].map(x=>place(x,0,-812,kitYawTo(0,-1)));
  if(KIT) kitInst(S,'GantryCrane',km,cranes);
  else [-80,100,280,460].forEach(x=>{ [-9,9].forEach(dz=>[-14,14].forEach(dx=>K.box(1.6,34,1.6,km.CRANE,x+dx,17,-812+dz))); K.box(8,2.6,80,km.CRANE,x,38,-830); });
  [-80,100,280,460].forEach(x=>{ aviation.push(K.glow(0xff3020,5,x,63,-814)); K.glow(0xffd8a0,22,x,33,-812); });
  K.box(250,9,30,new THREE.MeshStandardMaterial({color:0x1a1d22,metalness:.4,roughness:.6}),190,1.5,-858); K.box(250,1.2,30.4,new THREE.MeshStandardMaterial({color:0x6a1a14,roughness:.8}),190,-2.4,-858);
  K.box(18,16,26,new THREE.MeshStandardMaterial({color:0xd8d8d2,roughness:.7}),310,14,-858); K.box(18.2,1.2,26.2,km.GLASS,310,20,-858);
  // ---- Container yard (Midjourney yard frames): tall stacks tinted per box, red/white kerbs and striped barrier walls, flood masts ----
  const CC=[0x8a2a1e,0x1f4a7a,0x2f6a3a,0x6a6e74,0xc0661e,0xd8d8d2,0x7a1e3a,0x0f5a6a,0x9a7a2a,0x2a5a8a], boxes=[], cols=[];
  const stack=(x,z,yaw,h,y0)=>{ for(let k=0;k<h;k++){ boxes.push(place(x,(y0||0)+k*2.62,z,yaw)); cols.push(CC[(K.R()*CC.length)|0]); } };
  for(let bx=30;bx<500;bx+=17) for(let bz=-790;bz<-490;bz+=42){ const c=nearRoad(bx+6,bz+19); if(c.d<W+12||c.d>80||K.R()<.2) continue;
    for(let r=0;r<5;r++) for(let l=0;l<3;l++){ const x=bx+r*2.8, z=bz+l*12.8, d=nearRoad(x,z).d; if(d<W+9) continue; stack(x,z,0,2+((K.R()*(d<30?4:6))|0)); } }
  for(let r=0;r<10;r++) for(let l=0;l<12;l++) stack(80+l*12.8,-846-r*2.6,Math.PI/2,2+((K.R()*2)|0),6); // on the ship
  for(let r=0;r<2;r++) stack(262+r*2.8,-590,0,7);
  if(KIT) kitInst(S,'Container',km,boxes,cols,'PAINT',{far:110,keys:['PAINT']});
  else { const im=K.inst(new THREE.BoxGeometry(2.44,2.59,12.19).translate(0,1.3,0),km.PAINT,boxes); if(im){ const c=new THREE.Color(); cols.forEach((h,i)=>im.setColorAt(i,c.setHex(h))); im.instanceColor.needsUpdate=true; } }
  K.box(6.2,.7,12.6,new THREE.MeshBasicMaterial({color:0xff7a1a,toneMapped:false}),263.4,15.2,-590); K.glow(0xff8a2a,26,263,16,-590);
  const sYd0=K.sNear(0,-560), sYd1=K.sNear(540,-700), inYd=k=>{ const s=k*tr.ds; return s>sYd0&&s<sYd1; };
  const kerbT=CT(canvasTex(64,64,(g,w,h)=>{ g.fillStyle='#d8261e'; g.fillRect(0,0,w,h); g.fillStyle='#f2f2ee'; g.fillRect(0,0,w,h/2); }),true);
  const kerbM=new THREE.MeshStandardMaterial({map:kerbT,roughness:.6,side:THREE.DoubleSide});
  [-1,1].forEach(sd=>{ ribbonF(tr,S,kerbM,(k,p)=>inYd(k)?[sd*(W-.7),p.y+.03,sd*(W+.25),p.y+.07]:null,2);
    ribbonF(tr,S,kerbM,(k,p)=>inYd(k)?[sd*(W+4.5),p.y+.16,sd*(W+4.5),p.y+1.3]:null,3); });
  const masts=[]; for(let s=sYd0+40;s<sYd1;s+=90) [-1,1].forEach(sd=>{ K.at(s,sd*(W+16)); masts.push(place(K.pv.x,K.f.p.y,K.pv.z,0)); K.glow(0xffe2b8,24,K.pv.x,K.f.p.y+31,K.pv.z); });
  if(kitParts('FloodMast')) kitInst(S,'FloodMast',km,masts);
  // ---- Steel Bridge: five 120 m K-truss arch spans (Midjourney bridge frames), scaled to the deck and pitched with it ----
  const spans=[-420,-300,-180,-60,60].map(z=>{ K.at(K.sNear(560,z),0); const y=K.f.p.y; K.at(K.sNear(560,z-50),0); const y0=K.f.p.y; K.at(K.sNear(560,z+50),0); const y1=K.f.p.y;
    return new THREE.Matrix4().makeTranslation(560,y-.4,z).multiply(new THREE.Matrix4().makeRotationX(-Math.atan2(y1-y0,100))).multiply(new THREE.Matrix4().makeScale((W+3.6)/9.6,1,1)); });
  if(KIT) kitInst(S,'TrussArch',km,spans);
  else spans.forEach(m=>{ const p=new THREE.Vector3().setFromMatrixPosition(m); [-1,1].forEach(sd=>{ const a=K.mesh(new THREE.TorusGeometry(60,.9,6,40,Math.PI),km.CRANE,p.x+sd*(W+3.6),p.y,p.z); a.rotation.y=Math.PI/2; a.scale.y=.45; }); });
  [-420,-300,-180,-60,60].forEach(z=>{ K.at(K.sNear(560,z),0); [-1,1].forEach(sd=>aviation.push(K.glow(0xff3020,4,560+sd*(W+3.6),K.f.p.y+28,z))); });
  { const poleM=new THREE.MeshStandardMaterial({color:0x2a2e35,metalness:.7,roughness:.4}); // tall single-arm lamps on the parapets, as in the frames
    for(let s=sBr0+20;s<sBr1;s+=40){ const sd=(Math.round(s/40)%2)?1:-1; K.at(s,sd*(W+3.1)); const b=K.pv.clone(), y0=K.f.p.y; K.box(.25,11,.25,poleM,b.x,y0+5.5,b.z);
      const h=b.clone().addScaledVector(K.f.r,-sd*2.4); K.box(.5,.2,.5,km.LAMP,h.x,y0+10.8,h.z); K.glow(0xffc27a,7,h.x,y0+10.6,h.z); } }
  // ---- Old Town (Midjourney frames): honey-stone houses with arched doors, outside stairs and iron balconies tight to the
  //      cobbles, the slender bell tower over the plaza ----
  const OT_KIT=!!kitParts('OTHouse'), houses=[];
  if(OT_KIT) [-1,1].forEach(sd=>{ for(let s=sOT0+30;s<sOT1-20;s+=9.4){ K.at(s,sd*(W+4.6)); const r=K.f.r, d={x:-sd*r.x,z:-sd*r.z}, c=pv.clone().addScaledVector(r,sd*5.2);
    if(!K.clearOf(c,K.f.t,r,9,10,W+4.4)) continue; houses.push(place(pv.x,K.f.p.y-.25,pv.z,kitYawTo(d.x,d.z),1,.85+K.R()*.45)); } });
  if(houses.length) kitInst(S,'OTHouse',km,houses);
  else { K.frontage(sOT0+30,sOT1-20,-1,{set:5,h:[10,19],dep:[10,15],len:[8,14],space:.3,gap:.1,styles:['stone','brick','stone']});
    K.frontage(sOT0+30,sOT1-20,1,{set:5,h:[10,19],dep:[10,15],len:[8,14],space:.3,gap:.1,styles:['stone','brick']}); }
  { const ty=pts[near(300,620)].y; if(kitParts('ClockTower')) kitInst(S,'ClockTower',km,[place(365,ty-1,615,0)]);
    else { K.box(7,44,7,km.HONEY,365,ty+21,615); K.box(7.4,3.2,7.4,km.CLOCK,365,ty+28,615); }
    K.glow(0xfff0d0,14,365,ty+28,615); K.flat(330,400,585,650,ty-.4,new THREE.MeshStandardMaterial({map:cobT,roughness:.6})); }
  const BARS=['TRATTORIA','OYSTER BAR','CAFE','TAVERN','BAKERY','WINE','RECORDS','PIZZA'], BC=['#ffcf6a','#ff8a5a','#6fe3ff','#f4f7ff','#7dff9a'];
  for(let s=sOT0+60,i=0;s<sOT1-60;s+=70,i++){ const sd=i%2?1:-1; K.at(s,sd*(W+4.9),3.6); const r=K.f.r.clone();
    K.sign(signCanvas(BARS[i%BARS.length],{bg:'#07080a',color:BC[i%BC.length],size:52,glow:12}),4.6,1,K.pv.x,K.pv.y,K.pv.z,Math.atan2(-sd*r.x,-sd*r.z)); }
  // ---- the Belvedere pavilion on the crest where the old town meets Highway 9 (Midjourney ridge frames), cypresses down the hill ----
  if(kitParts('Belvedere')){ const y=pts[near(110,900)].y; kitInst(S,'Belvedere',km,[place(175,y-.8,975,kitYawTo(-1,-1))]); K.glow(0xffffff,30,175,y+10,975); }
  { const cyp=[], R2=K.R; for(let i=0;i<700;i++){ const x=-900+R2()*1250, z=180+R2()*900, nr=nearRoad(x,z); if(nr.d<W+10||nr.d>220) continue;
      if(inGal(nr.s)&&nr.d<16) continue; cyp.push(place(x,terrY(x,z)-.3,z,R2()*6,1,.8+R2()*.6)); }
    if(kitParts('Cypress')) kitInst(S,'Cypress',km,cyp,null,null,{far:160,keys:['LEAF']});
    else { const g=new THREE.ConeGeometry(1.5,14,7); g.translate(0,7,0); K.inst(g,new THREE.MeshStandardMaterial({color:0x16281c,roughness:1,flatShading:true}),cyp); } }
  // ---- Highway 9: elevated viaduct on hammerhead piers, sound walls on the outside of the sweeper (Midjourney highway frame) ----
  { const cols2=[], caps=[]; for(let s=sHw0+120;s<sHw1-10;s+=42){ K.at(s,0); const y=K.f.p.y, g=y-15+4; // ground under the deck (matches the valley above)
      caps.push(onTrack(s,0,-1.9)); cols2.push(new THREE.Matrix4().compose(new THREE.Vector3(K.f.p.x,g,K.f.p.z),K.q.clone(),new THREE.Vector3(1,Math.max(1,y-4.6-g),1))); }
    if(kitParts('PierCap')){ kitInst(S,'PierCap',km,caps); kitInst(S,'PierColumn',km,cols2); }
    else cols2.forEach(m=>{ const p=new THREE.Vector3().setFromMatrixPosition(m); K.box(3,16,2.2,concrete,p.x,p.y+8,p.z); });
    const wallT=CT(canvasTex(128,64,(g,w,h)=>{ g.fillStyle='#5f646b'; g.fillRect(0,0,w,h); g.fillStyle='#4a4f56'; for(let x=0;x<w;x+=16) g.fillRect(x,0,2,h); g.fillStyle='#7a8088'; g.fillRect(0,0,w,4); }),true);
    const wallM=new THREE.MeshStandardMaterial({map:wallT,roughness:.8,side:THREE.DoubleSide}), sWall0=K.sNear(-560,900);
    ribbonF(tr,S,wallM,(k,p)=>{ const s=k*tr.ds; return s>sWall0&&s<sHw1-30?[W+3.2,p.y+1,W+3.2,p.y+4.6]:null; },4); }
  const TUN=calderTunnel(K,tr,sT0,sT1,CS);
  // the city across the harbor, straight ahead off the grid and off the bridge
  K.skyline({cx:420,cz:-1420,sx:560,sz:110,n:46,h:[28,170],seed:1516});
  // brake boards into the big stops (quay corner, bridge exit, the end of the highway straight): 150 / 100 / 50 m
  [[K.sNear(0,-640),1],[K.sNear(560,340),-1],[K.sNear(-600,900),1]].forEach(([s0,sd])=>[150,100,50].forEach(d=>{ K.at(s0-d,sd*(W+2.2)); const t=K.f.t, p=K.pv.clone();
    K.box(.16,2.2,.16,blackM,p.x,K.f.p.y+1.1,p.z); K.sign(signCanvas(String(d),{bg:'#f4f7ff',color:'#101114',size:70}),1.7,1,p.x,K.f.p.y+2.6,p.z,Math.atan2(-t.x,-t.z)); }));
  K.gantry(K.sNear(0,-300),'CALDER QUAY','CONTAINER YARD  →',{bg:'#7a1a12'});
  K.gantry(K.sNear(560,-580),'STEEL BRIDGE','1 KM · FULL THROTTLE',{bg:'#0f5a32'});
  K.gantry(K.sNear(530,400),'OLD TOWN','COBBLES · HAIRPINS',{bg:'#2a1c06',color:'#ffd9a0'});
  K.gantry(K.sNear(-80,900),'HIGHWAY 9 WEST','CALDER TUNNEL 2 KM',{bg:'#0f5a32'});
  K.gantry(K.sNear(-820,720),'CALDER TUNNEL',Math.round((sT1-sT0)/50)*50+' M · STAY IN LANE',{bg:'#0f5a32'});
  K.flush();
  const obst=K.traffic(5); let bt=0;
  TUN.capture();
  const update=dt=>{ TUN.update(dt,cam.position); waterN.offset.x+=dt*.004; waterN.offset.y+=dt*.01; bt+=dt;
    const on=(bt%1.6)<.8; km.REDLAMP.color.setHex(on?0xff2a1a:0x3a0806); aviation.forEach(g=>{ g.visible=on; }); };
  return {scene:S,track:tr,traffic:obst,update,sNear:K.sNear,cams:[],slopeG:1.2,airtime:true,tunS:[[sT0,sT1]],calderS:Object.assign({sT0,sT1},CS),
    surf:[{s0:sBr0,s1:sBr1,grip:.94,name:'grating',msg:'Steel grating on the bridge. Light hands.'},{s0:sOT0+20,s1:sOT1-20,grip:.86,name:'cobble',msg:'Cobbles in the Old Town. Less grip.'}],
    resetTraffic(){ [.05,.26,.48,.7,.9].forEach((u,i)=>{ const o=obst[i]; o.dist=u*tr.L; o.x=i%2?3.6:-3.6; o.v=o.v0=13+Math.random()*5; }); }};
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
   specs:'1.4 KM LOOP / 3 LAPS / 7 CARS / NO TRAFFIC',
   note:'chicane tight.\nwater open.',load:'Dockside Dash. Three laps through the yard and the waterfront.'},
  {id:'skyline',build:buildSkyline,open:true,laps:2,name:'Skyline Circuit',kick:'Event 06',loc:'Center City',when:'Streets and the elevated run',
   caption:'A medium mix of technical streets and fast avenues. A sweeping elevated section frames the city before a hard braking zone into South Street.',
   specs:'4.0 KM LOOP / 2 LAPS / 7 CARS / NO TRAFFIC / 2 SPEED CAMERAS',
   note:'save brakes\nfor South St',load:'Skyline Circuit. Two laps of streets and the elevated straight.'},
  {id:'midnight',build:buildMidnight,open:true,laps:1,name:'Midnight Express',kick:'Event 07',loc:'All night',when:'Blvd, bridge, Camden, tunnel',
   caption:'The longest, fastest, most playful course in one lap: long boost-friendly straights, the Harbor Line tunnel, sweeping bends, and a high-speed run to the line.',
   specs:'10.6 KM / 1 LAP / 7 CARS / LIVE TRAFFIC / 3 SPEED CAMERAS',
   note:'one lap.\nall of it.',load:'Midnight Express. Ten kilometers, one lap, no shortcuts.'},
  {id:'philly',build:buildPhiladelphia,open:true,fullGrid:true,laps:3,name:'Philly Classic',kick:'Event 08',loc:'City to Camden',when:'Roosevelt Blvd to the Ben Franklin Bridge',
   caption:'Three laps through the landmarks: down Roosevelt Blvd, along Kelly Drive past the lights of Boathouse Row, over the Ben Franklin Bridge, past the South Philly stadium, back across the Delaware on the I-95 viaduct, then up Broad Street past City Hall and the Rocky Steps. Every car in the archive starts on the same grid.',
   specs:'8.8 KM LOOP / 3 LAPS / FULL GRID / LIVE TRAFFIC / 4 SPEED CAMERAS',
   note:'all cars.\nflat out.',load:'Philly Classic. Three laps, full grid, landmark straights.'},
  {id:'mtairy',build:buildMtAiry,open:true,laps:3,name:'Mt Airy Run',kick:'Event 09',loc:'Northwest Philly',when:'Germantown Ave, Mt Airy Ave, Lincoln Dr',
   caption:'Three laps of Northwest Philly: up the cobbles and trolley rails of Germantown Ave past the lit shops, along W Mt Airy Ave under the stone twins and street trees, then down the S-bends of Lincoln Drive through the Wissahickon gorge, under the Walnut Lane Bridge, and back up Johnson St. Speed bumps and potholes punish anyone still on the gas.',
   specs:'2.7 KM LOOP / 3 LAPS / 7 CARS / COBBLES & TROLLEY RAILS / GORGE S-BENDS / BUMPS & POTHOLES',
   note:'bumps.\npotholes.\nreal life.',load:'Mt Airy Run. Germantown and Lincoln Dr. Mind the asphalt.'},
  {id:'gamenight',build:buildGameNight,open:true,laps:2,name:'Game Night',kick:'Event 10',loc:'South Philly',when:'The Sports Complex, every team in town',
   caption:'Two laps of the Sports Complex with every team in town. Down Broad St, through the Zamboni tunnel under the arena (ice on the road), then Pattison Ave under a live Jumbotron. Every team has Crowd Roar pads in its colors, and a lead change sets off the fireworks.',
   specs:'2.9 KM LOOP / 2 LAPS / 7 CARS / CROWD ROAR PADS / ICE TUNNEL / LIVE JUMBOTRON',
   note:'ride the\ncrowd.',load:'Game Night at the Sports Complex. Ride the crowd, mind the ice.'},
  {id:'manayunk',build:buildManayunk,open:true,laps:3,name:'Manayunk Wall',kick:'Event 11',loc:'Northwest Philly',when:'Main St, The Wall, Green Lane',
   caption:'Three laps of Manayunk: flat out down Main St beside the canal, then straight up The Wall. Climbs cost you speed, and the crests on the ridge throw you in the air. No steering until you land, and big air refills some boost.',
   specs:'2.7 KM LOOP / 3 LAPS / 7 CARS / 32 M CLIMB / CRESTS & AIR TIME',
   note:'land it\nstraight.',load:'Manayunk Wall. Climb it flat out and land it straight.'},
  {id:'el',build:buildKensington,open:true,laps:3,name:'Under the El',kick:'Event 12',loc:'Kensington',when:'Kensington Ave, Lehigh Ave, Aramingo Ave',
   caption:'Three laps under the Market-Frankford El. The steel columns run down the middle of Kensington Ave, so pick a side and stay off the posts. On Lehigh Ave the freight gates come down every forty seconds. Beat the gates or wait for the train.',
   specs:'2.8 KM LOOP / 3 LAPS / 7 CARS / LIVE TRAFFIC / MEDIAN COLUMNS / FREIGHT CROSSING',
   note:'beat the\ngates.',load:'Under the El. Stay off the posts, beat the gates.'},
  {id:'firstlight',build:buildFirstLight,open:true,laps:3,name:'First Light',kick:'Event 13',loc:'Kelly & MLK Drive',when:'Starts 5:40 AM, sunrise on the last lap',
   caption:'Three laps of Kelly Drive and MLK Drive, starting in the dark. The sun comes up as the race runs out, the street lights click off and the fog lifts off the river. The city wakes up too: no traffic on lap one, rush hour by lap three.',
   specs:'3.6 KM LOOP / 3 LAPS / 7 CARS / SUNRISE DURING THE RACE / TRAFFIC BUILDS EVERY LAP',
   note:'get it done\nbefore rush\nhour.',load:'First Light. Kelly Drive at dawn, beat the rush hour.'},
  {id:'neoncore',build:buildNeonCore,open:true,laps:2,name:'Neon Core',kick:'Event 14',loc:'Synth District',when:'Mag-deck, data port, hyperloop, neon tube',
   caption:'A cyberpunk circuit stitched from the best of the city: a Skyline-style elevated mag-deck straight, a Dockside-tight container chicane, Under-the-El hyperloop columns down the middle, and a Harbor-style neon tube with low grip. Pulse Grid pads and a timed cargo lock keep the lap rhythm changing.',
   specs:'3.1 KM LOOP / 2 LAPS / 7 CARS / LIVE TRAFFIC / PULSE GRID PADS / MEDIAN POSTS / CARGO LOCK / NEON TUBE',
   note:'deck.\nchicane.\ntube.',load:'Neon Core. Two laps through the Synth District.'},
  {id:'calder',build:buildCalder,open:true,laps:2,name:'Calder Basin',kick:'Event 15',loc:'Calder Basin',when:'The quay, the Steel Bridge, Old Town, Highway 9, the Calder Tunnel',
   caption:'An original port city at dusk. Flat out down the quay under the gantry cranes, through the container chicane, then a full kilometer over the red Steel Bridge with a crest that throws you in the air. Climb the cobbled switchbacks of Old Town past the bell tower, take Highway 9 along the ridge, sweep through the futuristic Calder Tunnel and drop back to the water.',
   specs:'5.6 KM LOOP / 2 LAPS / 7 CARS / LIGHT TRAFFIC / 1 KM BRIDGE STRAIGHT / ELEVATED HIGHWAY / 600 M TUNNEL',
   note:'save boost\nfor the\nbridge',load:'Calder Basin. Quay, bridge, old town, highway, tunnel. Two laps.'}
];
/* Events are built on demand and released when you move to another one. Building every city at boot held
   eight full worlds in memory at once, which is enough to make a phone kill the page when a race starts. */
let SETUP_READY=false;
/* A3: three.js hands out monotonically increasing ids per resource type, so anything created while an event builds falls in an id
   window. releaseEvent only disposes resources inside those windows; module-level shared geometry/materials/textures are never freed. */
function idMark(){ return [new THREE.MeshBasicMaterial().id,new THREE.BufferGeometry().id,new THREE.Texture().id]; }
function ownWindow(e,a){ const b=idMark(); (e._own||(e._own=[])).push([a,b]); }
function inOwn(e,k,id){ return !!e._own&&e._own.some(w=>id>w[0][k]&&id<=w[1][k]); }
function finishEvent(e){ if(e._ready||!e.scene) return; e._ready=true; const a=idMark(); if(e.setup) e.setup(); addChevrons(e); ownWindow(e,a); }
function ensureEvent(e){ if(!e.scene){ const a=idMark(); Object.assign(e,e.build()); ownWindow(e,a); e._ready=false; } if(SETUP_READY) finishEvent(e); return e; }
function releaseEvent(e){ const S=e.scene; if(!S) return; if(fxGroup.parent===S) S.remove(fxGroup);
  const disp=(t)=>{ if(t&&t.dispose&&inOwn(e,2,t.id)&&!(t.userData&&t.userData.shared)) t.dispose(); };
  S.traverse(o=>{ if(o.geometry&&inOwn(e,1,o.geometry.id)&&!o.geometry.userData.shared) o.geometry.dispose(); (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{ if(!m||!inOwn(e,0,m.id)||(m.userData&&m.userData.shared)) return;
    ['map','emissiveMap','normalMap','roughnessMap','bumpMap'].forEach(k=>disp(m[k])); m.dispose(); }); });
  disp(S.background);
  ['scene','track','traffic','update','cams','resetTraffic','sNear','koScreen','pickups','chevrons','turns','roadHazards','pads','surf','slopeG','airtime','pillars','crossing','tunS','calderS','dawn','introCrane','legS','padsHit','_own'].forEach(k=>delete e[k]); e._ready=false; }
function releaseOthers(){ EVENTS.forEach(e=>{ if(e.scene&&e.scene!==RS) releaseEvent(e); }); }
ensureEvent(EVENTS[0]);
const KO_MAPS=[
 {id:'arena',eventId:'ko',name:'City Hall Arena',km:'1.7'},
 {id:'dockside',eventId:'dockside',name:'Dockside Dash',km:'1.4'},
 {id:'skyline',eventId:'skyline',name:'Skyline Circuit',km:'4.0'},
 {id:'midnight',eventId:'midnight',name:'Midnight Express',km:'10.6'}
];
let koMapI=0;
function resolveEventForStart(ev,koMap){ return ev&&ev.knockout?{bindKo:true,koMap:koMap}:{bindKo:false}; }
function bindKoTrack(i){
  koMapI=(i+KO_MAPS.length)%KO_MAPS.length;
  const map=KO_MAPS[koMapI], base=EVENTS.find(e=>e.id==='ko'), track=EVENTS.find(e=>e.id===map.eventId);
  if(!base||!track) return;
  ensureEvent(track);
  EV=Object.assign({},base,{name:'The Gauntlet · '+map.name,load:`Twelve cars on ${map.name}. Sector checkpoints on long maps.`,track:track.track,scene:track.scene,traffic:track.traffic,update:track.update,sNear:track.sNear,koScreen:track.koScreen,cams:track.cams,pickups:track.pickups,turns:track.turns,chevrons:track.chevrons,resetTraffic:track.resetTraffic,id:'ko',knockout:true});
  RS=EV.scene; TR=EV.track; RS.add(fxGroup); traffic=EV.traffic||[]; if(EV.resetTraffic) EV.resetTraffic();
  releaseOthers();
}
/* ---- power-ups on the racing surface (any car can grab them) ---- */
const PU_TYPES={refill:{c:0x5fe6ff,css:'#5fe6ff',label:'Refill',tag:'REFILL'},long:{c:0xb28cff,css:'#b28cff',label:'Long Boost',tag:'LONG BOOST'},over:{c:0xffb020,css:'#ffb020',label:'Overdrive',tag:'OVERDRIVE'},
  sling:{c:0xff3b4a,css:'#ff3b4a',label:'Slingshot',tag:'SLINGSHOT'},shield:{c:0x7dff9a,css:'#7dff9a',label:'Shield',tag:'SHIELD'},
  shock:{c:0xff6fd8,css:'#ff6fd8',label:'Shockwave',tag:'SHOCKWAVE'},grip:{c:0x4f7bff,css:'#4f7bff',label:'Grip Tires',tag:'GRIP'},
  wispflux:{c:0x7dffef,css:'#7dffef',label:'Feather Flux',tag:'FEATHER FLUX'},stratossurge:{c:0xff9a3c,css:'#ff9a3c',label:'Strato Surge',tag:'STRATO SURGE'},
  desperate:{c:0xff4466,css:'#ff4466',label:'Desperation',tag:'LAST-CHANCE'},
  echoboost:{c:0xc77dff,css:'#c77dff',label:'Echo Boost',tag:'ECHO BOOST'},
  tempest:{c:0xff2438,css:'#ff2438',label:'Tempest',tag:'TEMPEST'},
  jam:{c:0xf2f04a,css:'#f2f04a',label:'Signal Jam',tag:'SIGNAL JAM'},slick:{c:0xe8ecf5,css:'#e8ecf5',label:'Oil Slick',tag:'OIL SLICK'},
  payback:{c:0xff5a1f,css:'#ff5a1f',label:'Payback',tag:'PAYBACK'},ghost:{c:0xd13bff,css:'#d13bff',label:'Ghost Lane',tag:'GHOST LANE'}};
const PU_DESC='Power-ups: cyan refills boost, violet makes it last, amber raises top speed, red slingshots you forward, green shields you from hits, pink blasts the cars around you, blue adds grip, yellow jams another car\'s boost, silver drops an oil slick behind you, orange makes your next hit from behind steal speed, purple lets you drive through traffic.Feather Flux, Strato Surge and Tempest gems are locked to Wisp 07, Stratos V and Tempesta SV. Last-Chance (red) hunts last place; Echo Boost (violet) hunts the last two — for 15s you copy every power-up taken by anyone ahead of you.';
const puGeo=new THREE.OctahedronGeometry(.62,0), puRing=new THREE.TorusGeometry(1.15,.07,6,28);
function addPickups(ev,list){
  ev.pickups=[]; const f=mkF();
  const tr=ev.track; if(!list.some(i=>i[2]==='tempest')){ // Tempest gem at the start of the longest straight
    let run=0, st=0, best=0, bl=0; for(let k=0;k<tr.N*2;k++){ if(Math.abs(tr.K[k%tr.N])<.004){ if(!run) st=k; run++; if(run>bl&&run<=tr.N){ bl=run; best=st; } } else run=0; }
    list=list.concat([[(best*tr.ds+25)%tr.L,-2.4,'tempest',{car:'tempesta',sig:1}]]); }
  list=autoPickupSpots(list,tr.L); // jam, slick, payback and ghost gems on every map
  list.forEach(item=>{ const s=item[0],x=item[1],type=item[2],opts=item[3]||{}; frame(s,f,ev.track); const T=PU_TYPES[type];
    const g=new THREE.Group(); g.position.copy(f.p).addScaledVector(f.r,x);
    const gem=new THREE.Mesh(puGeo,new THREE.MeshStandardMaterial({color:T.c,emissive:T.c,emissiveIntensity:opts.sig?2.1:1.5,metalness:.3,roughness:.2})); gem.position.y=1.3; g.add(gem);
    const gl=glowSprite(T.c,(opts.last||opts.lastTwo)?4.2:3.4); gl.position.y=1.3; g.add(gl);
    const ring=new THREE.Mesh(puRing,new THREE.MeshBasicMaterial({color:T.c,toneMapped:false,transparent:true,opacity:(opts.last||opts.lastTwo)?.88:.75})); ring.rotation.x=Math.PI/2; ring.position.y=.07; g.add(ring);
    const lab=addLabel(g,T.tag,T.css); lab.position.y=2.55;
    ev.scene.add(g); ev.pickups.push({s,x,homeS:s,homeX:x,type,g,gem,ring,cd:0,homing:false,carId:opts.car||null,lastOnly:!!opts.last,lastTwo:!!opts.lastTwo,sig:!!opts.sig}); });
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
      const walled=ev.id==='tunnel'||f.p.y<-1; // hang them over the curb, clear of the lane; tunnels keep them tight to the wall
      m.position.copy(f.p).addScaledVector(f.r,t.dir*(walled?W-.1:W+.7)); m.position.y+=2.6; m.quaternion.copy(q); m.rotateY(Math.PI+t.dir*.35); ev.scene.add(m);
      ev.chevrons.push({m,y:m.position.y,i:ev.chevrons.length}); }
    // one big chevron hanging over the road at the entry
    frame(t.s0-55,f,tr); orientQ(f,q,b,nr);
    const big=new THREE.Mesh(new THREE.PlaneGeometry(4.2,2.6),new THREE.MeshBasicMaterial({map:CHEV_TEX[t.dir],transparent:true,toneMapped:false,depthWrite:false}));
    big.position.copy(f.p).addScaledVector(f.r,t.dir*1.5); big.position.y+=Math.min(tr.H-1.8,5.2); big.quaternion.copy(q); big.rotateY(Math.PI); ev.scene.add(big);
    ev.chevrons.push({m:big,y:big.position.y,i:ev.chevrons.length,big:true});
  });
}
EVENTS[0].setup=()=>addPickups(EVENTS[0],[[300,-3,'refill'],[460,0,'sling'],[540,-3,'wispflux',{car:'wisp',sig:1}],[620,3,'over'],[790,-3,'shield'],[950,0,'long'],[980,3,'stratossurge',{car:'stratos',sig:1}],[1120,3,'grip'],[1280,-3,'refill'],[1360,3,'echoboost',{lastTwo:1}],[1420,0,'desperate',{last:1}],[1450,0,'shock'],[1600,3,'over'],[1760,-3,'sling'],[1900,0,'long']]);
EVENTS[1].setup=()=>addPickups(EVENTS[1],[[250,-3.4,'refill'],[560,3.4,'long'],[720,-3.4,'wispflux',{car:'wisp',sig:1}],[1000,0,'over'],[1400,-3.4,'refill'],[1800,3.4,'over'],[2050,-3.4,'echoboost',{lastTwo:1}],[2100,0,'desperate',{last:1}],[2200,0,'long'],[2700,-3.4,'over'],[2950,3.4,'stratossurge',{car:'stratos',sig:1}],[3100,3.4,'refill'],
  [400,0,'sling'],[780,-3.4,'shield'],[1200,3.4,'grip'],[1600,0,'shock'],[2000,-3.4,'sling'],[2450,3.4,'shield'],[2900,0,'shock']]);
EVENTS[2].setup=()=>{ const at=EVENTS[2].sNear;
  addPickups(EVENTS[2],[[at(200,20),-3.6,'refill'],[at(470,20),3.6,'sling'],[at(640,20),0,'grip'],[at(720,-150),0,'shield'],[at(880,-300),-3.6,'over'],
    [at(1150,-300),3.6,'long'],[at(1380,-300),0,'sling'],[at(1640,-300),-3.6,'shock'],[at(1880,-300),0,'grip'],[at(1700,-340),3.6,'refill'],
    [at(1400,-340),0,'over'],[at(1100,-340),-3.6,'sling'],[at(560,-340),3.6,'shield'],[at(200,-340),0,'shock'],[at(-80,-160),0,'grip']]); }
EVENTS[4].setup=()=>{ const at=EVENTS[4].sNear;
  addPickups(EVENTS[4],[[at(150,20),-3.6,'refill'],[at(330,20),3.6,'sling'],[at(430,-90),0,'shield'],[at(430,-250),-3.6,'shock'],
    [at(320,-340),3.6,'over'],[at(160,-340),0,'grip'],[at(10,-340),-3.6,'long'],[at(-80,-230),3.6,'sling'],[at(-80,-80),0,'refill']]); }
EVENTS[3].setup=()=>{ const at=EVENTS[3].sNear;
  addPickups(EVENTS[3],[[at(-20,-1300),-3.6,'refill'],[at(-20,-950),3.6,'sling'],[at(200,-800),0,'shield'],[at(560,-800),-3.6,'grip'],[at(720,-600),3.6,'over'],
    [at(720,-420),0,'refill'],[at(900,-300),-3.6,'long'],[at(1200,-300),3.6,'sling'],[at(1500,-300),0,'shock'],[at(1800,-300),-3.6,'grip'],
    [at(2030,-100),3.6,'shield'],[at(2030,250),0,'refill'],[at(1600,470),-3.6,'over'],[at(1300,470),3.6,'sling'],[at(1000,470),0,'shock'],
    [at(600,470),-3.6,'refill'],[at(250,470),3.6,'shield'],[at(-80,200),0,'grip'],[at(-80,-300),-3.6,'long'],[at(-80,-650),3.6,'shock'],[at(-80,-1100),0,'over']]); }
EVENTS[5].setup=()=>{ const at=EVENTS[5].sNear;
  addPickups(EVENTS[5],[[at(40,-340),-3.4,'refill'],[at(260,-340),3.4,'sling'],[at(340,-250),0,'grip'],[at(300,-160),-3.4,'over'],[at(250,-205),3.4,'shield'],
    [at(205,-250),0,'long'],[at(160,-205),-3.4,'shock'],[at(60,-160),3.4,'refill'],[at(-80,-250),0,'sling']]); }
EVENTS[6].setup=()=>{ const at=EVENTS[6].sNear;
  addPickups(EVENTS[6],[[at(200,20),-3.6,'refill'],[at(430,-120),3.6,'sling'],[at(430,-340),0,'shield'],[at(160,-340),-3.6,'grip'],[at(-80,120),3.6,'over'],
    [at(-80,470),0,'long'],[at(430,470),-3.6,'refill'],[at(720,470),3.6,'shock'],[at(720,200),0,'sling'],[at(430,20),-3.6,'over']]); }
EVENTS[7].setup=()=>{ const at=EVENTS[7].sNear;
  addPickups(EVENTS[7],[[at(-20,-1700),-3.6,'refill'],[at(-20,-950),3.6,'sling'],[at(400,-800),0,'shield'],[at(720,-500),-3.6,'grip'],[at(1200,-300),3.6,'long'],
    [at(1800,-300),0,'over'],[at(2300,-300),-3.6,'sling'],[at(2480,-50),3.6,'shock'],[at(2480,300),0,'refill'],[at(1600,470),-3.6,'shield'],
    [at(1000,470),3.6,'grip'],[at(500,470),0,'long'],[at(-80,250),-3.6,'over'],[at(-80,-400),3.6,'sling'],[at(-80,-1200),0,'refill'],[at(-80,-2000),-3.6,'shock']]); }
EVENTS[8].setup=()=>{ const at=EVENTS[8].sNear;
  addPickups(EVENTS[8],[[at(-20,-1050),-3.4,'refill'],[at(-20,-850),3.4,'long'],[at(200,-700),0,'sling'],[at(520,-700),-3.4,'over'],[at(720,-480),3.4,'grip'],
    [at(1100,-300),0,'refill'],[at(1550,-300),-3.4,'long'],[at(2100,-300),3.4,'over'],[at(2480,0),0,'shield'],[at(2480,300),-3.4,'sling'],
    [at(2000,450),3.4,'shock'],[at(1400,450),0,'long'],[at(800,450),-3.4,'refill'],[at(250,450),3.4,'over'],[at(-80,300),-3.4,'grip'],[at(-80,-100),3.4,'over'],[at(-80,-800),0,'shock'],[at(-80,-1200),-3.4,'sling'],
    [at(-20,-1150),0,'desperate',{last:1}],[at(-20,-980),3.4,'echoboost',{lastTwo:1}],[at(520,-700),3.4,'wispflux',{car:'wisp',sig:1}],[at(1700,-300),-3.4,'stratossurge',{car:'stratos',sig:1}]]); }
EVENTS[9].setup=()=>{ const at=EVENTS[9].sNear;
  addPickups(EVENTS[9],[[at(20,-300),-3.2,'refill'],[at(34,-480),3.2,'grip'],[at(-300,-700),0,'shield'],[at(-450,-690),-3.2,'sling'],
    [at(-600,-480),0,'over'],[at(-620,-240),3.2,'refill'],[at(-700,-120),-3.2,'long'],[at(-520,90),0,'shock'],[at(-300,110),3.2,'sling'],[at(-120,90),-3.2,'over'],
    [at(8,-150),0,'desperate',{last:1}],[at(-640,20),0,'echoboost',{lastTwo:1}],[at(28,-420),-3.2,'wispflux',{car:'wisp',sig:1}],
    [at(-380,-698),3.2,'stratossurge',{car:'stratos',sig:1}]]); }
const evById=id=>EVENTS.find(e=>e.id===id);
evById('gamenight').setup=()=>{ const E=evById('gamenight'), at=E.sNear;
  addPickups(E,[[at(0,-150),-3.4,'refill'],[at(0,150),0,'sling'],[at(200,340),-3.4,'grip'],[at(380,340),3.4,'shield'],[at(450,200),0,'over'],[at(520,90),-3.4,'long'],
    [at(820,0),3.4,'shock'],[at(820,-200),-3.4,'refill'],[at(700,-310),0,'sling'],[at(480,-310),3.4,'over'],[at(200,-240),-3.4,'grip'],
    [at(0,-60),0,'desperate',{last:1}],[at(0,300),3.4,'echoboost',{lastTwo:1}],[at(640,90),0,'wispflux',{car:'wisp',sig:1}],[at(820,-120),0,'stratossurge',{car:'stratos',sig:1}]]); };
evById('manayunk').setup=()=>{ const E=evById('manayunk'), at=E.sNear;
  addPickups(E,[[at(-450,50),-3.2,'refill'],[at(-150,55),3.2,'over'],[at(150,30),0,'sling'],[at(430,-120),-3.2,'refill'],[at(250,-380),3.2,'grip'],[at(0,-400),0,'shield'],
    [at(-250,-390),-3.2,'shock'],[at(-600,-220),3.2,'long'],[at(-670,-60),0,'over'],
    [at(-300,62),0,'desperate',{last:1}],[at(440,-200),3.2,'echoboost',{lastTwo:1}],[at(50,44),-3.2,'wispflux',{car:'wisp',sig:1}],[at(-120,-398),3.2,'stratossurge',{car:'stratos',sig:1}]]); };
evById('el').setup=()=>{ const E=evById('el'), at=E.sNear;
  addPickups(E,[[at(40,40),-3.6,'refill'],[at(160,-80),3.6,'sling'],[at(300,-220),-3.6,'grip'],[at(520,-320),0,'over'],[at(770,-150),-3.6,'shield'],[at(770,80),3.6,'long'],
    [at(600,210),0,'shock'],[at(350,210),-3.6,'refill'],[at(-160,240),3.6,'over'],
    [at(700,-320),0,'desperate',{last:1}],[at(770,0),0,'echoboost',{lastTwo:1}],[at(240,-160),3.6,'wispflux',{car:'wisp',sig:1}],[at(450,210),3.6,'stratossurge',{car:'stratos',sig:1}]]); };
evById('firstlight').setup=()=>{ const E=evById('firstlight'), at=E.sNear;
  addPickups(E,[[at(190,380),-3.6,'refill'],[at(90,100),3.6,'over'],[at(160,-240),0,'sling'],[at(60,-580),-3.6,'grip'],[at(130,-880),3.6,'long'],[at(0,-1005),0,'shield'],
    [at(-170,-600),-3.6,'shock'],[at(-80,-250),3.6,'refill'],[at(-160,100),0,'over'],[at(-60,390),-3.6,'sling'],[at(10,765),3.6,'grip'],
    [at(150,520),0,'desperate',{last:1}],[at(-120,-900),0,'echoboost',{lastTwo:1}],[at(120,-60),-3.6,'wispflux',{car:'wisp',sig:1}],[at(-120,-80),3.6,'stratossurge',{car:'stratos',sig:1}]]); };
evById('calder').setup=()=>{ const E=evById('calder'), at=E.sNear;
  addPickups(E,[[at(0,-300),-3.6,'refill'],[at(0,-560),3.6,'sling'],[at(110,-700),0,'grip'],[at(258,-655),0,'shield'],[at(460,-700),-3.6,'over'],
    [at(560,-560),3.6,'long'],[at(560,-330),-3.6,'sling'],[at(560,-60),3.6,'refill'],[at(560,250),0,'shock'],[at(430,470),-3.2,'grip'],[at(300,610),3.2,'over'],
    [at(110,760),0,'refill'],[at(-200,900),-3.6,'long'],[at(-480,900),3.6,'sling'],[at(-800,820),0,'shield'],[at(-820,560),-3.6,'refill'],[at(-600,380),3.6,'over'],
    [at(-250,270),0,'shock'],[at(-60,160),3.6,'grip'],
    [at(0,-200),0,'desperate',{last:1}],[at(560,-420),0,'echoboost',{lastTwo:1}],[at(560,-150),-3.6,'wispflux',{car:'wisp',sig:1}],[at(-380,900),3.6,'stratossurge',{car:'stratos',sig:1}]]); };
SETUP_READY=true; EVENTS.forEach(e=>{ if(e.scene) finishEvent(e); });
const puHomF=mkF(), puHomT=new THREE.Vector3();
function raceFieldN(){ return EV.knockout?koActive().length:racers.filter(x=>!x.finished&&!x.out).length; }
function chaseEligible(p){
  if(mode!=='race'||!racers.length||(!p.lastOnly&&!p.lastTwo)) return [];
  const st=standings(), n=raceFieldN(), k=p.lastTwo?2:1;
  return st.slice(Math.max(0,n-k)).filter(r=>r&&!r.finished&&!r.out);
}
function chaseTargetForPickup(p,i,L){
  let best=null,bd=1e9;
  chaseEligible(p).forEach(r=>{
    r.puCd=r.puCd||{};
    if((r.puCd[i]||-1)>ghostT) return;
    const s0=((r.dist%L)+L)%L, along=Math.abs(trackGapSigned(p.s,s0,L));
    if(along<bd){ bd=along; best=r; }
  });
  return best;
}
function trackGapSigned(a,b,L){ let d=b-a; while(d>L/2) d-=L; while(d<-L/2) d+=L; return d; }
function placePickupMesh(p,s,x){ frame(s,puHomF,TR); p.g.position.copy(puHomF.p).addScaledVector(puHomF.r,x); p.g.position.y=puHomF.p.y; }
function racerPickupPoint(r,out){ frame(r.dist,puHomF,TR); out.copy(puHomF.p).addScaledVector(puHomF.r,r.x); out.y+=1.3; }
function grantPickup(r,p,i){
  r.puCd=r.puCd||{}; r.puCd[i]=ghostT+6; p.cd=.35; p.g.visible=false; p.homing=false; p.s=p.homeS; p.x=p.homeX;
  applyPU(r,(EV.knockout&&KO&&!KO.done&&KO.mod&&KO.mod.pu)||p.type);
}
function updateHomingPickups(dt){
  if(mode!=='race'||!EV.pickups||!TR) return;
  const L=TR.L;
  EV.pickups.forEach((p,i)=>{
    if((!p.lastOnly&&!p.lastTwo)||p.cd>0||!p.g.visible) return;
    const tgt=chaseTargetForPickup(p,i,L);
    if(!tgt){ p.homing=false; placePickupMesh(p,p.homeS,p.homeX); return; }
    const sT=((tgt.dist%L)+L)%L, along=Math.abs(trackGapSigned(p.s,sT,L));
    if(!p.homing){
      if(along>240){ placePickupMesh(p,p.homeS,p.homeX); return; }
      p.homing=true;
      if(tgt.isP&&!p.chaseWarn){
        p.chaseWarn=true;
        toast(p.lastTwo?'Echo Boost is coming to you.':'Last-Chance is coming to you.');
        tone(p.lastTwo?880:640,.12,.22,'sine');
      }
    }
    const gap=trackGapSigned(p.s,sT,L);
    const chase=Math.min(Math.abs(gap),(tgt.v+110)*dt);
    if(chase>0) p.s=((p.s+Math.sign(gap||1)*chase)%L+L)%L;
    p.x=lerp(p.x,tgt.x,1-Math.exp(-dt*4.2));
    placePickupMesh(p,p.s,p.x);
    racerPickupPoint(tgt,puHomT);
    p.g.position.lerp(puHomT,1-Math.exp(-dt*7.5));
    p.gem.position.y=1.3+Math.sin(ghostT*5+i)*.35;
    if(p.g.position.distanceTo(puHomT)<3.6||along<5) grantPickup(tgt,p,i);
  });
}
function resetPickups(){ clearSlicks(); (EV.pickups||[]).forEach(p=>{ p.cd=0; p.g.visible=true; p.homing=false; p.chaseWarn=false; p.s=p.homeS; p.x=p.homeX; }); }
function worldFx(dt){
  updateHomingPickups(dt); updateSlicks(dt);
  (EV.pickups||[]).forEach(p=>{ if((p.lastOnly||p.lastTwo)&&p.homing){ p.gem.rotation.y+=dt*3.4; p.gem.rotation.x+=dt*1.1; p.ring.scale.setScalar(1.15+Math.sin(ghostT*6)*.12); return; }
    p.gem.rotation.y+=dt*2.2; p.gem.rotation.x+=dt*.7; p.gem.position.y=1.3+Math.sin(ghostT*3+p.s)*.22; p.ring.scale.setScalar(1+Math.sin(ghostT*4+p.s)*.08);
    if(p.cd>0){ p.cd-=dt; if(p.cd<=0){ p.g.visible=true; p.homing=false; p.chaseWarn=false; p.s=p.homeS; p.x=p.homeX; } } });
  (EV.chevrons||[]).forEach(c=>{ c.m.material.opacity=c.big?.6+.4*Math.max(0,Math.sin(ghostT*5)):.3+.7*Math.max(0,Math.sin(ghostT*7-c.i*.8)); c.m.position.y=c.y+Math.sin(ghostT*2+c.i)*.12; });
}
function checkPickups(r){
  if(!EV.pickups||r.def.noBoost) return; const L=TR.L, s0=((r.dist%L)+L)%L;
  r.puCd=r.puCd||{}; // every car can take each pickup once per pass; the gem just blinks when someone does
  EV.pickups.forEach((p,i)=>{ if((r.puCd[i]||-1)>ghostT) return;
    if(p.lastOnly||p.lastTwo) return;
    if(p.carId&&(r.def.chassisId||r.def.id)!==p.carId) return;
    let d=Math.abs(s0-p.s); d=Math.min(d,L-d);
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
 grip:{front:['Grip Tires','45% more grip for 8s.'],pack:['Slicks','More grip and no scrub through corners for 8s.'],chase:['Rails','80% more grip, and walls can\'t slow you for 6s.']},
 wispflux:{front:['Feather Flux','Wisp-only: violent boost and grip for 5.5s.'],pack:['Feather Flux','Wisp-only: violent boost and grip for 5.5s.'],chase:['Feather Flux','Wisp-only: violent boost and grip for 5.5s.']},
 tempest:{front:['Tempest','Tempesta-only.'],pack:['Tempest','Tempesta-only.'],chase:['Tempest','Tempesta-only.']},
 stratossurge:{front:['Strato Surge','Stratos-only: flat-out overdrive and long boost for 7s.'],pack:['Strato Surge','Stratos-only: flat-out overdrive and long boost for 7s.'],chase:['Strato Surge','Stratos-only: flat-out overdrive and long boost for 7s.']},
 desperate:{front:['Last-Chance','Last place only: random rescue.'],pack:['Last-Chance','Last place only: random rescue.'],chase:['Last-Chance','Last place only: random rescue.']},
 echoboost:{front:['Echo Boost','Last two only: copy boosts from ahead for 15s.'],pack:['Echo Boost','Last two only: copy boosts from ahead for 15s.'],chase:['Echo Boost','Last two only: copy boosts from ahead for 15s.']},
 jam:{front:['Counter-Jam','The car right behind you loses its boost for 3.5s.'],pack:['Signal Jam','The car just ahead loses its boost for 3.5s.'],chase:['Blackout','The leader loses its boost for 4.5s.']},
 slick:{front:['Wide Spill','A wide oil slick behind you. Cars through it lose speed and grip.'],pack:['Oil Slick','An oil slick behind you. Cars through it lose speed and grip.'],chase:['Spill Trail','Two oil slicks behind you. Cars through them lose speed and grip.']},
 payback:{front:['Payback','Next car you hit from behind loses speed, plus a short boost. 3s.'],pack:['Payback','Shielded 4.5s: cars you hit from behind lose speed. Plus a boost.'],chase:['Revenge','Shielded 6s: cars you hit from behind lose speed. Plus a big boost.']},
 ghost:{front:['Ghost Lane','Traffic passes through you for 4s.'],pack:['Ghost Lane','Traffic passes through you for 6s.'],chase:['Ghost Run','Traffic passes through you for 8s.']}
};
const ECHO_SKIP=new Set(['echoboost','jam','slick','payback','ghost']);
function echoBoostFrom(src,type){
  if(mode!=='race'||src._puEcho||ECHO_SKIP.has(type)) return;
  const order=standings(), i=order.indexOf(src);
  if(i<0) return;
  for(let j=i+1;j<order.length;j++){
    const o=order[j];
    if(!o||o.finished||o.out||(o.fxEcho||0)<=0) continue;
    if(type==='wispflux'&&(o.def.chassisId||o.def.id)!=='wisp') continue;
    if(type==='stratossurge'&&(o.def.chassisId||o.def.id)!=='stratos') continue;
    if(type==='tempest'&&(o.def.chassisId||o.def.id)!=='tempesta') continue;
    o._puEcho=true; applyPU(o,type); o._puEcho=false;
    if(o.isP){ const lab=PU_TYPES[type]?.label||type; toast(`Echo Boost copied ${lab} from ahead.`); flash(.15); }
  }
}
function carClass(d){ const m=d.mass||1; if(m>=1.35) return 'heavy'; if(d.grip>=32) return 'nimble'; if((d.nitro||1)>=1.2||d.top>=92) return 'muscle'; return 'balanced'; }
function bracketOf(r){ if(mode!=='race'||!racers.length) return 'pack'; const n=EV.knockout?koActive().length:racers.length, pl=standings().indexOf(r)+1; return pl<=2?'front':(pl>=n-1?'chase':'pack'); }
function nextAhead(r,maxD){ let best=null,bd=maxD; for(const o of racers){ if(o===r||o.finished) continue; const g=o.dist-r.dist; if(g>2&&g<bd){ bd=g; best=o; } } return best; }
function shieldVs(c,o){ if(!(c.fxShield>0)) return false; return c.shieldMode==='rear'?o.dist<c.dist:true; }
function applyPU(r,type){
  if(type==='wispflux'||type==='stratossurge'||type==='tempest'||type==='desperate'||type==='echoboost') return applySigPU(r,type);
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
    case 'jam': { // cuts one car's boost: the leader if you're at the back, the chaser if you're up front, otherwise the car ahead
      const t=jamTarget(r,br);
      if(!t) twist='Nobody in range.';
      else if(t.fxShield>0&&t.shieldMode!=='rear') twist=`${t.def.tag||t.def.name} was shielded.`;
      else { t.fxJam=(br==='chase'?4.5:3.5)*J; t.nitro=Math.max(0,t.nitro-.3*J); twist=`Jammed ${t.def.tag||t.def.name}.`;
        if(t.isP){ toast(`${r.def.tag||r.def.name} jammed your boost.`); shake=.5; sfx.hit(.6,0); } }
      break; }
    case 'slick':
      dropSlick(r,br==='chase'?2:1,br==='front');
      if(cls==='heavy') twist='Leaky tank: the slick lasts longer.';
      break;
    case 'payback': // a ram shield plus a boost: whoever you hit from behind pays for it
      r.shieldMode='ram'; r.shieldMass=cls==='heavy'?7:4.5; r.fxShield=Math.max(r.fxShield,(br==='front'?3:(br==='chase'?6:4.5))*J);
      r.fxOver=Math.max(r.fxOver,3*J); r.overMul=Math.max(r.overMul||1,br==='chase'?1.14:1.1);
      r.nitro=Math.min(1.4,Math.max(r.nitro,0)+(br==='chase'?.5:.3));
      if(cls==='heavy') twist='Wrecking ball: you shove much harder.';
      break;
    case 'ghost':
      r.fxGhost=(br==='front'?4:(br==='chase'?8:6))*J;
      if(cls==='nimble'){ r.fxGhost+=2; twist='Featherweight: lasts 2s longer.'; }
      break;
  }
  const key={refill:'refill',long:'long',over:'over',sling:'sling',shield:'shield',grip:'grip',shock:'shock',jam:'jam',slick:'slick',payback:'payback',ghost:'ghost'}[type];
  r.fxName[key]=(jack?'Jackpot ':'')+V[0];
  r.puLog=r.puLog||{}; const combo=`${type}/${br}/${cls}${jack?'/J':''}`; r.puLog[combo]=(r.puLog[combo]||0)+1;
  if(mode!=='race') return;
  if(r.isP){ toast(`${jack?'JACKPOT. ':''}${V[0]}. ${V[1]}${twist?' '+twist:''}`); if(type==='sling') shake=br==='chase'?.9:.6;
    sfx.powerup(jack); flash(jack?.35:.18); }
  else if(player&&type!=='shock'&&Math.abs(r.dist-player.dist)<70&&r.def.tag) persona(r,`${r.def.tag} grabbed ${jack?'a jackpot ':''}${V[0]}.`);
  if(r.isP) tapeLog('powerup',{who:'YOU',tag:(jack?'Jackpot ':'')+V[0]});
  if(!r._puEcho) echoBoostFrom(r,type);
}
function applySigPU(r,type){
  const br=bracketOf(r), V=PU_VARIANTS[type][br]; r.fxName=r.fxName||{}; let title=V[0], body=V[1];
  if(type==='wispflux'){
    r.nitro=Math.max(r.nitro,1.12); r.fxWisp=5.5; r.fxNosMul=5.5; r.gripMul=1.9; r.fxGrip=5.5; r.noScrub=true;
    body='Feather-light grip and boost hits like a cannon for 5.5s. Tank refills slowly — spend it here.';
  } else if(type==='tempest'){
    r.fxTempest=9; r.nitro=Math.max(r.nitro,1); r.gripMul=1.6; r.fxGrip=9;
    body='The storm breaks. Hold on.';
  } else if(type==='stratossurge'){
    r.nitro=Math.max(r.nitro,.9); r.overMul=1.28; r.fxOver=7; r.fxLong=7; r.drainMul=.2; r.draftRange=44; r.overAcc=6;
    body='Top speed, long boost, and mega draft for 7s. Built for holding flat.';
  } else if(type==='echoboost'){
    r.fxEcho=15;
    title='Echo Boost';
    body='For 15 seconds, every power-up grabbed by anyone ahead of you is copied to you.';
  } else if(type==='desperate'){
    const roll=Math.random();
    if(roll<.38){
      title='Hail Mary Boost'; r.fxLong=11; r.drainMul=0; r.nitro=Math.max(r.nitro,1.35); r.fxRegen=4;
      body='Last place only: boost does not drain for 11s, tank overfilled.';
    } else if(roll<.72){
      title='Desperation Catapult'; r.fxSling=1.6; r.v=Math.min(r.v+28,r.def.top*1.35);
      const t=nextAhead(r,200); if(t){ r.towT=3.2; r.towTarget=t; }
      body='Last place only: launched forward and towed toward the pack.';
    } else {
      title='Chaos Draw'; const pick=['refill','long','over','sling','grip'][Math.floor(Math.random()*5)];
      applyPU(r,pick); r.fxName.desperate=title;
      if(r.isP) toast(`Last-Chance: rerolled into ${(r.fxName[pick]||pick)}.`); return;
    }
  }
  r.fxName[type==='desperate'?'desperate':type]=title;
  r.puLog=r.puLog||{}; r.puLog[`${type}/${br}`]=(r.puLog[`${type}/${br}`]||0)+1;
  if(mode!=='race') return;
  if(r.isP){ toast(`${title}. ${body}`); if(type==='echoboost') sfx.powerup(false); else tone(type==='desperate'?720:960,.14,.28,'triangle'); flash(type==='desperate'?.32:.2); }
  else if(player&&Math.abs(r.dist-player.dist)<70&&r.def.tag) persona(r,`${r.def.tag} grabbed ${title}.`);
  if(r.isP) tapeLog('powerup',{who:'YOU',tag:title});
  if(!r._puEcho&&type!=='echoboost') echoBoostFrom(r,type);
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
/* ---- Signal Jam, Oil Slick, Payback, Ghost Lane: the power-ups that go with the Grudge / Hunter / Rabbit / Weaver drivers ---- */
function jamTarget(r,br){
  const ok=o=>o!==r&&!o.finished&&!o.out&&!(TAG&&o.team===r.team);
  if(r.def.id==='hunter'){ const l=leaderOf(r); if(l) return l; }                     // the Hunter always jams the leader
  if(r.def.id==='grudge'&&r.grudge&&ok(r.grudge)) return r.grudge;                    // the Grudge jams whoever passed it
  if(br==='chase'){ for(const o of standings()) if(ok(o)) return o; return null; }    // from the back: the leader
  let best=null, bd=br==='front'?70:100;
  for(const o of racers){ if(!ok(o)) continue; const g=br==='front'?r.dist-o.dist:o.dist-r.dist; if(g>2&&g<bd){ bd=g; best=o; } }   // front: the chaser, pack: the car ahead
  return best;
}
const slicks=[], slickGeo=new THREE.CircleGeometry(2.2,28), slickRingGeo=new THREE.RingGeometry(1.95,2.2,28);
const slF=mkF(), slQ=new THREE.Quaternion(), slB=new THREE.Matrix4(), slN=new THREE.Vector3();
function dropSlick(r,n,wide){
  const L=TR.L, scene=EV.scene||RS;
  for(let i=0;i<n;i++){
    const s=(((r.dist-9-i*16)%L)+L)%L; frame(s,slF);
    const body=new THREE.Mesh(slickGeo,new THREE.MeshBasicMaterial({color:0x0a0910,transparent:true,opacity:.86,depthWrite:false,side:THREE.DoubleSide}));
    const ring=new THREE.Mesh(slickRingGeo,new THREE.MeshBasicMaterial({color:0xe8ecf5,transparent:true,opacity:.45,depthWrite:false,toneMapped:false,side:THREE.DoubleSide}));
    const g=new THREE.Group(); g.add(body); g.add(ring); g.scale.setScalar(wide?1.3:1);
    orientQ(slF,slQ,slB,slN); g.quaternion.copy(slQ); g.rotateX(-Math.PI/2);        // lay the disc flat on the road
    g.position.copy(slF.p).addScaledVector(slF.r,r.x); g.position.y+=.07; scene.add(g);
    slicks.push({s,x:r.x,t:r.mass>=1.35?20:14,wide:!!wide,owner:r,g,body,ring,scene});
  }
}
function clearSlicks(){ slicks.splice(0).forEach(h=>{ h.scene.remove(h.g); h.body.material.dispose(); h.ring.material.dispose(); }); }
function updateSlicks(dt){
  if(!slicks.length) return;
  const L=TR.L, racing=mode==='race';
  for(let i=slicks.length-1;i>=0;i--){ const h=slicks[i];
    h.t-=dt; const fade=clamp(h.t/2,0,1); h.body.material.opacity=.86*fade; h.ring.material.opacity=(.35+.15*Math.sin(ghostT*5))*fade;
    if(h.t<=0){ h.scene.remove(h.g); h.body.material.dispose(); h.ring.material.dispose(); slicks.splice(i,1); continue; }
    if(!racing) continue;
    const half=h.wide?2.7:2.1;
    for(const o of racers){ if(o===h.owner||o.finished||o.out||(o.slickCd||0)>ghostT||(o.fxShield>0&&o.shieldMode!=='rear')) continue;
      const dd=Math.abs((((o.dist-h.s)%L)+L*1.5)%L-L*.5);
      if(dd<3.2&&Math.abs(o.x-h.x)<half){ o.slickCd=ghostT+1.6; o.v*=.72; o.vx+=(o.x>=h.x?1:-1)*7;
        if(o.isP){ toast(`Oil. ${h.owner.def.tag||h.owner.def.name}'s slick got you.`); shake=.8; sfx.hit(.5,0); }
        else if(player&&Math.abs(o.dist-player.dist)<70&&o.def.tag) persona(o,`${o.def.tag} hit the oil.`); } } }
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
// tire marks: a ring buffer of rubber quads laid behind the rear wheels while a car is sliding or locking up
const SK=1400, skPos=new Float32Array(SK*12).fill(-999), skIdx=[]; for(let i=0;i<SK;i++){ const a=i*4; skIdx.push(a,a+2,a+1,a+1,a+2,a+3); }
const skGeo=new THREE.BufferGeometry(); skGeo.setAttribute('position',new THREE.BufferAttribute(skPos,3)); skGeo.setIndex(skIdx);
const skMesh=new THREE.Mesh(skGeo,new THREE.MeshBasicMaterial({color:0x040405,transparent:true,opacity:.58,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,side:THREE.DoubleSide}));
skMesh.frustumCulled=false; fxGroup.add(skMesh);
let skI=0, skDirty=false; const skW=new THREE.Vector3(), skS=new THREE.Vector3();
function resetSkids(){ skPos.fill(-999); skDirty=true; racers.forEach(r=>r.skidP=null); }
function skidStep(r,B){ // uses headV/leftV from poseAt
  const on=(r.lat>.45||r.brk>.75&&r.v>25)&&!(r.airT>.05)&&r.m.group.position.distanceToSquared(cam.position)<150*150;
  if(!on){ r.skidP=null; return; }
  if(!r.skidP) r.skidP=[new THREE.Vector3(),new THREE.Vector3(),false];
  const P=r.skidP, pos=r.m.group.position;
  for(let w=0;w<2;w++){ const sd=w?1:-1; skW.copy(pos).addScaledVector(leftV,sd*(B.tr||1)).addScaledVector(headV,-(B.wb||1.4)); skW.y=pos.y+.02;
    if(!P[2]){ P[w].copy(skW); continue; }
    const d=P[w].distanceTo(skW); if(d<.3&&w===1) return; if(d<.3) continue;
    // a segment must run roughly along the car's heading: a shove sideways starts a new mark instead of bridging to it
    if(d<8&&skS.subVectors(skW,P[w]).dot(headV)>.7*d){ skS.copy(leftV).multiplyScalar(.12); const o=(skI++%SK)*12, a=P[w], b=skW;
      skPos.set([a.x-skS.x,a.y,a.z-skS.z, a.x+skS.x,a.y,a.z+skS.z, b.x-skS.x,b.y,b.z-skS.z, b.x+skS.x,b.y,b.z+skS.z],o); skDirty=true; }
    P[w].copy(skW); }
  P[2]=true; }
const RN=1400, rainPos=new Float32Array(RN*6), rainP=new Float32Array(RN*3), rainGeo=new THREE.BufferGeometry();
rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPos,3));
const rain=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0xaec2dc,transparent:true,opacity:.34,depthWrite:false}));
rain.frustumCulled=false; rain.visible=false; fxGroup.add(rain);
const rainLast=new THREE.Vector3(), rainVel=new THREE.Vector3(); let rainReady=false;
function inTunnel(){ if(EV.id==='tunnel') return true; const r=player||racers[0]; if(!r) return false; if(EV.tunS){ const s=trackS(r.dist); if(EV.tunS.some(z=>s>z[0]&&s<z[1])) return true; } return frame(r.dist,F2).p.y<-6; }
function updateRain(dt){
  const show=LOOK.wet&&(mode==='race'||mode==='loading'||mode==='events')&&!inTunnel(); rain.visible=show;
  AX.rain=show; // the rain beds are mixed in audioTick
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
  EVI=(i+EVENTS.length)%EVENTS.length; EV=ensureEvent(EVENTS[EVI]); RS=EV.scene; TR=EV.track; RS.add(fxGroup); releaseOthers();
  traffic=EV.traffic; EV.traffic.forEach(o=>{ o.m.group.visible=true; }); if(EV.resetTraffic) EV.resetTraffic();
  slData.forEach(d=>d.s=-1e9); resetSkids();
}
TR=EV.track; RS.add(fxGroup);

/* ---------------- STUDIO (magazine photos) ---------------- */
const studio=new THREE.Scene();
studio.fog=new THREE.Fog(0x05070a,10,34);
studio.background=new THREE.Color(0x05070a);
studio.userData.bloom={strength:.4,radius:.4,threshold:.88}; studio.userData.lens={streak:.35,ghost:.5,halo:0,dirt:0,th:.06,tint:[.85,.9,1]}; // magazine studio: clean glass, a hint of streak
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
const GLB_SHELL_KEY=new Map([[wispGlbShell,'wisp'],[granfourGlbShell,'granfour'],[kageShell,'kage'],[volcanoShell,'volcano'],[overloadGlbShell,'overload'],[autobahnGlbShell,'autobahn']]);
window.AH_MODEL_READY=key=>{ // slow connections boot before every model has downloaded; swap the real body in as soon as it lands
  CARS.forEach((d,i)=>{ if(GLB_SHELL_KEY.get(SHELLS[d.sculpt])!==key) return; const old=studioCars[i], nc=buildCar(d,{cut:true});
    nc.group.visible=old.group.visible; nc.group.rotation.copy(old.group.rotation); studio.remove(old.group); studio.add(nc.group); studioCars[i]=nc; }); };
const dust=new THREE.Group(); studio.add(dust);
for(let i=0;i<26;i++){ const d=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTex,color:0xe8dccb,transparent:true,depthWrite:false,opacity:.5}));
  d.position.set(1.5+Math.random()*5,.3+Math.random()*1.2,-2.5+Math.random()*4); d.scale.setScalar(1.5+Math.random()*2.5); d.userData.v=.2+Math.random()*.5; dust.add(d); }
const horizon=new THREE.Mesh(new THREE.CylinderGeometry(40,40,6,48,1,true),new THREE.MeshBasicMaterial({color:0x1d2a24,side:THREE.BackSide,fog:false}));
horizon.position.y=2; studio.add(horizon);
/* ---- Wisp 07's own car-select set, from Paris's fourth reference: the car parked at a curb on a wet Belgian-block street
   at night. Flagstone sidewalk and granite curb in the foreground, autumn trees lit warm from below, glass towers with lit
   floors against a violet sky, street lamps and sagging wires, pink neon shopfronts and a graffiti shutter across the road.
   threejs-textures: every surface is a CanvasTexture (color, plus a roughness/bump map so the stones read wet and the
   joints dry). threejs-lighting: magenta and blue point lights paint the flank the way the reference does; they stay in
   the studio at zero intensity on the other pages so switching cars never recompiles shaders. ---- */
const wispSet=new THREE.Group(); wispSet.visible=false; studio.add(wispSet);
const wispLights=[[0xff3fb4,2.4,9,-3.4,1.4,3.4],[0xff55d0,1.1,10,-.6,3.6,-3.6],[0x4c7cff,1.8,14,4.6,2.6,-1.6],[0xffa860,1.4,10,-3.2,5.8,-7]].map(([c,i,d,x,y,z])=>{
  const L=new THREE.PointLight(c,0,d,2); L.position.set(x,y,z); L.userData.on=i; studio.add(L); return L; });
(function(){
  const rnd=(a,b)=>a+Math.random()*(b-a);
  // stones: color + a matching gray map (bright stone = high, dark joint = low) used as bump, and inverted for roughness
  const stones=(n,draw)=>{ const col=canvasTex(n,n,(g,w,h)=>draw(g,w,h,false)), gray=canvasTex(n,n,(g,w,h)=>draw(g,w,h,true)), rough=canvasTex(n,n,(g,w,h)=>{ g.drawImage(gray,0,0); g.globalCompositeOperation='difference'; g.fillStyle='#fff'; g.fillRect(0,0,w,h);
      g.globalCompositeOperation='source-over'; g.fillStyle='rgba(0,0,0,.45)'; g.fillRect(0,0,w,h); }); return {col:CT(col,true),gray:CT(gray,true),rough:CT(rough,true)}; };
  const blocks=stones(1024,(g,w,h,gr)=>{ g.fillStyle=gr?'#000':'#07080c'; g.fillRect(0,0,w,h); const rows=20, bh=h/rows;
    for(let r=0;r<rows;r++){ let x=-Math.random()*40; while(x<w){ const bw=rnd(38,62), sh=gr?Math.round(rnd(150,235)):null;
        g.fillStyle=gr?`rgb(${sh},${sh},${sh})`:`hsl(${rnd(215,250)},${rnd(8,20)}%,${rnd(13,24)}%)`;
        const x0=x+rnd(2,4), y0=r*bh+rnd(2,4), ww=bw-rnd(4,7), hh=bh-rnd(4,7), rr=7; g.beginPath(); g.moveTo(x0+rr,y0); g.arcTo(x0+ww,y0,x0+ww,y0+hh,rr); g.arcTo(x0+ww,y0+hh,x0,y0+hh,rr); g.arcTo(x0,y0+hh,x0,y0,rr); g.arcTo(x0,y0,x0+ww,y0,rr); g.fill();
        if(!gr){ g.fillStyle='rgba(255,255,255,.05)'; g.fillRect(x0+4,y0+3,ww-8,3); } x+=bw; } } });
  [blocks.col,blocks.gray,blocks.rough].forEach(t=>t.repeat.set(14,14));
  const road=new THREE.Mesh(new THREE.PlaneGeometry(56,56),new THREE.MeshStandardMaterial({map:blocks.col,bumpMap:blocks.gray,bumpScale:.03,roughnessMap:blocks.rough,roughness:.55,metalness:.15,envMapIntensity:1.6}));
  road.rotation.x=-Math.PI/2; road.position.set(12,0,-10); wispSet.add(road);
  const flags=stones(1024,(g,w,h,gr)=>{ g.fillStyle=gr?'#000':'#0b0a0f'; g.fillRect(0,0,w,h); const n=5, cs=w/n;
    for(let i=0;i<n;i++) for(let j=0;j<n;j++){ const sh=gr?Math.round(rnd(160,230)):null; g.fillStyle=gr?`rgb(${sh},${sh},${sh})`:`hsl(${rnd(220,260)},${rnd(6,14)}%,${rnd(20,30)}%)`;
      const jx=()=>rnd(-10,10); g.beginPath(); g.moveTo(i*cs+6+jx(),j*cs+6+jx()); g.lineTo((i+1)*cs-6+jx(),j*cs+6+jx()); g.lineTo((i+1)*cs-6+jx(),(j+1)*cs-6+jx()); g.lineTo(i*cs+6+jx(),(j+1)*cs-6+jx()); g.closePath(); g.fill();
      if(!gr){ for(let k=0;k<40;k++){ g.fillStyle=`rgba(255,255,255,${rnd(.01,.05)})`; g.fillRect(i*cs+rnd(10,cs-10),j*cs+rnd(10,cs-10),rnd(2,10),rnd(2,6)); } } } });
  [flags.col,flags.gray,flags.rough].forEach(t=>t.repeat.set(6,10));
  const walk=new THREE.Mesh(new THREE.BoxGeometry(12,.14,46),new THREE.MeshStandardMaterial({map:flags.col,bumpMap:flags.gray,bumpScale:.025,roughnessMap:flags.rough,roughness:.5,metalness:.1,envMapIntensity:1.5}));
  walk.position.set(-7.55,.07,-6); wispSet.add(walk);
  const curb=new THREE.Mesh(new THREE.BoxGeometry(.24,.16,46),new THREE.MeshStandardMaterial({color:0x6a6878,roughness:.32,metalness:.1})); curb.position.set(-1.5,.08,-6); wispSet.add(curb);
  // far sidewalk and the shopfronts across the street
  const walk2=walk.clone(); walk2.position.set(14.5,.07,-6); wispSet.add(walk2);
  const shopM=new THREE.MeshStandardMaterial({color:0x0b0910,roughness:.95}); const glowM=c=>new THREE.MeshBasicMaterial({color:c,toneMapped:false});
  [[-12,0xff3fb8],[-4,0xff6ad6],[3.5,0x4f8bff],[11,0xff3fb8]].forEach(([z,c],i)=>{ const f=new THREE.Mesh(new THREE.BoxGeometry(.4,4.2,7.2),shopM); f.position.set(9.4,2.1,z); wispSet.add(f);
    const win=new THREE.Mesh(new THREE.PlaneGeometry(5.4,1.9),new THREE.MeshBasicMaterial({color:new THREE.Color(c).multiplyScalar(.1)})); win.position.set(9.18,1.3,z); win.rotation.y=-Math.PI/2; wispSet.add(win);
    const bar=new THREE.Mesh(new THREE.BoxGeometry(.06,.06,5.6),glowM(c)); bar.position.set(9.16,2.42,z); wispSet.add(bar);
    const pool=glowSprite(c,3.4); pool.position.set(8.8,2.3,z); wispSet.add(pool); });
  { const ring=new THREE.Mesh(new THREE.TorusGeometry(.55,.05,10,48),glowM(0xb6ff2a)); ring.position.set(9.1,3.1,-12.6); ring.rotation.y=Math.PI/2; wispSet.add(ring); // round lime neon sign
    const sg=glowSprite(0xb6ff2a,2.4); sg.position.set(9,3.1,-12.6); wispSet.add(sg); }
  { const sh=new THREE.Mesh(new THREE.PlaneGeometry(3.4,2.6),new THREE.MeshStandardMaterial({roughness:.6,metalness:.4,map:CT(canvasTex(512,384,(g,w,h)=>{ // roll-up shutter with tags
      for(let y=0;y<h;y+=12){ g.fillStyle=(y/12)%2?'#3b3a44':'#4a4954'; g.fillRect(0,y,w,12); }
      [['#ff3fb8','NITE'],['#9dff1c','WSP'],['#4fd0ff','07']].forEach(([c,t],i)=>{ g.save(); g.translate(60+i*150,140+i*60); g.rotate(-.12+i*.08); g.font='900 italic 92px Arial'; g.lineWidth=10; g.strokeStyle='#111'; g.strokeText(t,0,0); g.fillStyle=c; g.fillText(t,0,0); g.restore(); }); }))}));
    sh.position.set(9.16,1.3,5.6); sh.rotation.y=-Math.PI/2; wispSet.add(sh); }
  // trees: dark trunks, crowns of jittered icosahedra in autumn orange and neon-washed pink (vertex colors, one draw call)
  const crowns=[], trunks=[];
  [[-3.0,-6],[-3.0,-15],[-3.0,-24],[-3.0,9],[8.3,-2],[8.3,-12.5],[8.3,-22],[8.3,6.5]].forEach(([x,z],ti)=>{
    const tg=new THREE.CylinderGeometry(.1,.17,3.6,10); tg.translate(x,1.8,z); trunks.push(tg);
    for(let k=0;k<9;k++){ const r=rnd(.9,1.5), gq=new THREE.IcosahedronGeometry(r,1), P=gq.attributes.position;
      for(let i=0;i<P.count;i++) P.setXYZ(i,P.getX(i)*rnd(.85,1.15),P.getY(i)*rnd(.75,1.05),P.getZ(i)*rnd(.85,1.15));
      gq.translate(x+rnd(-1.3,1.3),rnd(3.6,5.6),z+rnd(-1.3,1.3)); gq.computeVertexNormals();
      const c=new THREE.Color().setHSL(Math.random()<.18?rnd(.93,.97):rnd(.02,.08),rnd(.75,.95),rnd(.3,.46)), col=new Float32Array(P.count*3);
      for(let i=0;i<P.count;i++){ const v=rnd(.75,1.1); col[i*3]=c.r*v; col[i*3+1]=c.g*v; col[i*3+2]=c.b*v; }
      gq.setAttribute('color',new THREE.BufferAttribute(col,3)); crowns.push(gq); } });
  const leafM=new THREE.MeshStandardMaterial({vertexColors:true,flatShading:true,roughness:.85,emissive:0x7a2a08,emissiveIntensity:.45});
  wispSet.add(new THREE.Mesh(mergeGeos(crowns),leafM));
  wispSet.add(new THREE.Mesh(mergeGeos(trunks),new THREE.MeshStandardMaterial({color:0x1a1210,roughness:.9})));
  // street lamps and the wires strung between them
  const poleM=new THREE.MeshStandardMaterial({color:0x15151a,metalness:.6,roughness:.4}), heads=[];
  [[-2.4,-10,1],[-2.4,-26,1],[8.6,-17,-1],[8.6,1.5,-1]].forEach(([x,z,sd])=>{ const p=new THREE.Mesh(new THREE.CylinderGeometry(.07,.1,7,10),poleM); p.position.set(x,3.5,z); wispSet.add(p);
    const arm=new THREE.Mesh(new THREE.BoxGeometry(1.6,.07,.07),poleM); arm.position.set(x+sd*.75,6.9,z); wispSet.add(arm);
    const hd=new THREE.Mesh(new THREE.BoxGeometry(.5,.12,.24),glowM(0xffd9a8)); hd.position.set(x+sd*1.45,6.82,z); wispSet.add(hd); heads.push(hd.position);
    const gl=glowSprite(0xffc890,3.2); gl.position.copy(hd.position); wispSet.add(gl); });
  const wireM=new THREE.MeshBasicMaterial({color:0x0a0812});
  [[[-2.4,7.4,-10],[8.6,7.6,-17]],[[-2.4,7.2,-26],[8.6,7.5,-17]],[[-2.4,7.6,-10],[-2.4,7.5,-26]],[[8.6,7.3,1.5],[-2.4,7.1,-10]]].forEach(([a,b])=>{
    const m=new THREE.Vector3((a[0]+b[0])/2,Math.min(a[1],b[1])-.7,(a[2]+b[2])/2);
    wispSet.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(...a),m,new THREE.Vector3(...b)),24,.012,4,false),wireM)); });
  // towers: lit floors on a canvas grid, unlit so they glow against the sky; fog off so they read through the haze
  const towerTex=(warm)=>CT(canvasTex(256,512,(g,w,h)=>{ g.fillStyle='#0b0a16'; g.fillRect(0,0,w,h);
    for(let y=4;y<h;y+=9) for(let x=3;x<w;x+=7){ if(Math.random()<.42){ const v=rnd(.5,1); g.fillStyle=Math.random()<(warm?.4:.1)?`rgba(255,200,140,${v})`:`rgba(190,215,255,${v})`; g.fillRect(x,y,5,6); } }
    g.fillStyle='rgba(140,120,255,.06)'; for(let x=0;x<w;x+=14) g.fillRect(x,0,1,h); }));
  const TT=[towerTex(false),towerTex(true),towerTex(false)];
  [[34,-34,14,96],[48,-12,16,70],[22,-52,12,120],[58,-44,18,84],[38,-70,15,110],[8,-66,13,78],[66,-18,14,58],[-6,-58,12,64]].forEach(([x,z,wd,ht],i)=>{
    const t=TT[i%3].clone(); t.needsUpdate=true; t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(wd/14,ht/40);
    const tw=new THREE.Mesh(new THREE.BoxGeometry(wd,ht,wd),new THREE.MeshBasicMaterial({map:t,color:0xb8b0d8,fog:false})); tw.position.set(x,ht/2-2,z); tw.rotation.y=rnd(-.3,.3); wispSet.add(tw);
    const cap=new THREE.Mesh(new THREE.BoxGeometry(wd*.3,.3,.3),glowM(0xff3048)); cap.position.set(x,ht-1.8,z); wispSet.add(cap); });
  // sky dome: deep blue overhead fading to violet and a pink haze on the horizon
  wispSet.add(new THREE.Mesh(new THREE.SphereGeometry(220,32,16),new THREE.MeshBasicMaterial({side:THREE.BackSide,fog:false,depthWrite:false,map:CT(canvasTex(8,256,(g,w,h)=>{
    const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#070818'); gr.addColorStop(.32,'#1b1648'); gr.addColorStop(.47,'#3b2a74'); gr.addColorStop(.5,'#6a3c8c'); gr.addColorStop(.53,'#1a1024'); gr.addColorStop(1,'#050308'); g.fillStyle=gr; g.fillRect(0,0,w,h); }))})));
  // a parked car up the street, and wet reflections: long additive streaks under the lamps and the neon
  const pk=buildTrafficCar(0x1c1a22); pk.group.position.set(-.4,0,-11.5); pk.group.rotation.y=.02; wispSet.add(pk.group);
  const streakM=c=>new THREE.MeshBasicMaterial({map:glowTex,color:c,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false});
  [[7.6,-12,0xff3fb8,1.6,9],[7.6,-4,0xff6ad6,1.4,8],[7.6,3.5,0x4f8bff,1.4,8],[7.0,-17,0xffc890,.9,10],[-1.2,-10,0xffc890,.8,9],[-.8,3,0xff3fb4,2.4,6],[2.2,-1,0x4c7cff,2,7]].forEach(([x,z,c,w,l])=>{
    const st=new THREE.Mesh(new THREE.PlaneGeometry(w,l),streakM(c)); st.rotation.x=-Math.PI/2; st.position.set(x,.012,z); wispSet.add(st); });
})();

function setWorld(w){
  const WT={
    flash:{env:ENV.flash,bg:0x0b0705,hemi:[0xffd9b0,.5],key:[0xfff0dc,2.6],rim:[0xff8a3a,1.2],floor:[0x2a2622,.7],strips:0,bokeh:1,streaks:0,dust:0,hz:0,exp:1.15,near:10,far:34},
    ice:  {env:ENV.ice,bg:0x070a0f,hemi:[0xcfe0ff,.6],key:[0xdfeaff,1.1],rim:[0x9fc4ff,1.6],floor:[0x10141a,.28],strips:1,bokeh:0,streaks:1,dust:0,hz:0,exp:1.05,near:10,far:34},
    wisp: {env:ENV.pinkcity,bg:0x140c26,hemi:[0x8a70ff,.32],key:[0xffe6f4,.45],rim:[0x7a8cff,1.3],floor:[0x120c18,.2],strips:0,bokeh:0,streaks:0,dust:0,hz:0,exp:1.0,near:16,far:90,set:1,
      grade:{shadow:[.96,.88,1.22],high:[1.06,1.0,1.06],sat:1.2,vig:.5,grain:0}},
    neon: {env:ENV.ice,bg:0x0a0612,hemi:[0xe0c8ff,.5],key:[0xf2e8ff,1.3],rim:[0xc04cff,1.1],floor:[0x120c18,.2],strips:1,bokeh:1,streaks:1,dust:0,hz:0,exp:1.08,near:10,far:34},
    white:{env:ENV.ice,bg:0x8d9cae,hemi:[0xe6eef8,.7],key:[0xffffff,1.2],rim:[0xcfe0ff,1.4],floor:[0x7f8c9b,.5],strips:0,bokeh:0,streaks:0,dust:0,hz:0,exp:.95,near:12,far:48},
    desert:{env:ENV.street,bg:0x2b3a44,hemi:[0xbcd0e0,.9],key:[0xfff1e0,1.6],rim:[0x9fc0d8,.8],floor:[0xb3aa9e,.95],strips:0,bokeh:0,streaks:0,dust:1,hz:1,exp:1.0,near:14,far:60}
  }; const W=WT[w]||WT.ice; const c=W;   // unknown world key falls back to ice
  studio.environment=c.env; studio.fog.color.set(c.bg); studio.background.set(c.bg); studio.fog.near=c.near; studio.fog.far=c.far;
  sHemi.color.set(c.hemi[0]); sHemi.intensity=c.hemi[1]; sKey.color.set(c.key[0]); sKey.intensity=c.key[1]; sRim.color.set(c.rim[0]); sRim.intensity=c.rim[1];
  floorM.color.set(c.floor[0]); floorM.roughness=c.floor[1]; floorM.metalness=w==='desert'?0:.6;
  wispSet.visible=!!c.set; floor.visible=!c.set; wispLights.forEach(L=>{ L.intensity=c.set?L.userData.on:0; });
  if(c.grade) studio.userData.grade=c.grade; else delete studio.userData.grade;
  stripsG.visible=!!c.strips; bokeh.visible=!!c.bokeh; floorStreaks.visible=!!c.streaks; dust.visible=!!c.dust; horizon.visible=!!c.hz;
  renderer.toneMappingExposure=c.exp;
  document.body.classList.toggle('warm',w==='flash'||w==='desert');
}

/* ---------------- CAMERA + POST ---------------- */
const cam=new THREE.PerspectiveCamera(60,1,.1,1600);
function aspect(){ return innerWidth/innerHeight; }
let composer=null, renderPass=null, bloomPass=null, flarePass=null, gradePass=null, glowOn=true;
/* LOOK: "Clear" (default) tones the haze down in every race: no grain, half bloom, thinner fog, neutral tint, lighter vignette and fringing.
   "Cinematic" keeps each level's authored look. The car-select studio always keeps its magazine grade. Saved in SAVE.look. */
let CLEAR=SAVE.look!=='cine';
const CLR={bloom:.5,bloomR:.8,bloomT:.14,fog:.6,shadow:.15,high:.4,sat:.5,vig:.4,ca:.3,wet:.3};
document.body.classList.toggle('clear',CLEAR);
/* POST STACK (one MSAA scene pass, then): bloom (UnrealBloom, soft knee) -> lens pass (quarter-res: anamorphic streak, ghosts, halo,
   all read from the bloom's own blurred mips, no extra scene renders) -> grade (rain-on-lens refraction, radial speed blur with
   spectral chromatic aberration, flare + lens dirt, split tone, filmic contrast/lift, highlight shoulder, vignette, grain, dither, sRGB).
   Flares key off point lights only: a narrow bloom mip minus a wide one cancels big bright surfaces (white paint, lit walls) and keeps lamps.
   Per event: scene.userData.grade {shadow,high,sat,vig,grain,con,lift}, .bloom {strength,radius,threshold,knee},
   .lens {streak,ghost,halo,dirt,th,tint}. PHONE skips the lens pass and compiles the lens/rain code out of the grade. */
const GRADE_DEF={shadow:[.9,1,1.14],high:[1.1,1.02,.9],sat:1.12,vig:.42,grain:0,con:.16,lift:.012}; // scenes override with userData.grade
const LENS_DEF={streak:.4,ghost:.8,halo:.6,dirt:.7,th:.06,tint:[.78,.86,1]}; // scenes override with userData.lens (0 turns a part off)
const FLARE_SHADER={uniforms:{t1:{value:null},t2:{value:null},t3:{value:null},t4:{value:null},uTexel:{value:new THREE.Vector2(1/320,1/180)},
  uTh:{value:.02},uStreak:{value:1},uGhost:{value:1},uHalo:{value:1},uAspect:{value:16/9},uTint:{value:new THREE.Vector3(.78,.86,1)}},
  vertexShader:'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader:`uniform sampler2D t1,t2,t3,t4; uniform vec2 uTexel; uniform float uTh,uStreak,uGhost,uHalo,uAspect; uniform vec3 uTint; varying vec2 vUv;
  vec3 pk1(vec2 u){ return max(texture2D(t1,u).rgb-texture2D(t3,u).rgb*1.15-uTh,0.); } // point lights only (narrow mip minus wide mip)
  vec3 pk2(vec2 u){ return max(texture2D(t2,u).rgb-texture2D(t4,u).rgb*1.15-uTh,0.); }
  float edge(vec2 u){ vec2 e=smoothstep(0.,.08,u)*smoothstep(1.,.92,u); return e.x*e.y; }
  void main(){
    vec3 acc=vec3(0.);
    if(uStreak>0.){ // anamorphic streak: long horizontal smear of the light, desaturated toward a cool-neutral tint
      vec3 s=vec3(0.); float ws=0.;
      for(int i=-12;i<=12;i++){ float x=float(i), w=exp(-abs(x)*.14); s+=pk1(vUv+vec2(x*uTexel.x*3.2,0.))*w; ws+=w; }
      s/=ws; float sl=dot(s,vec3(.2126,.7152,.0722)); acc+=mix(vec3(sl),s,.35)*uTint*uStreak*3.2; }
    vec2 g=vec2(1.)-vUv, gv=(vec2(.5)-g)*.46;
    if(uGhost>0.){ // ghosts: soft copies of the lights mirrored through the lens centre, faint warm-to-cool coating tints
      for(int i=1;i<5;i++){ vec2 su=g+gv*float(i); float d=length(su-.5)*1.414, w=pow(max(1.-d,0.),2.5)*edge(su);
        acc+=pk2(su)*w*mix(vec3(1.,.8,.55),vec3(.55,.8,1.),float(i-1)/3.)*uGhost*1.6; } }
    if(uHalo>0.){ // halo ring with a touch of dispersion
      vec2 hv=normalize((vec2(.5)-g)*vec2(uAspect,1.)+1e-5)/vec2(uAspect,1.)*.42, hu=g+hv; float w=pow(max(1.-length(hu-.5)*1.6,0.),4.)*edge(hu);
      vec2 dv=hv*.03; acc+=vec3(pk2(hu+dv).r,pk2(hu).g,pk2(hu-dv).b)*w*uHalo*1.2; }
    gl_FragColor=vec4(acc,1.);
  }`};
const GRADE_SHADER={uniforms:{tDiffuse:{value:null},uSpeed:{value:0},uBoost:{value:0},uHit:{value:0},uWet:{value:0},
  uShadow:{value:new THREE.Vector3(.9,1,1.14)},uHigh:{value:new THREE.Vector3(1.1,1.02,.9)},uSat:{value:1.12},uVig:{value:.42},uGrain:{value:0},uTime:{value:0},
  uCon:{value:.16},uLift:{value:.012},uCA:{value:1},tFlare:{value:null},tWide:{value:null},tDirt:{value:null},tDrops:{value:null},uFlare:{value:0},uDirt:{value:0},uRain:{value:0},uClock:{value:0},uAspect:{value:16/9}},
  defines:{LENS:PHONE?0:1},
  vertexShader:'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader:`uniform sampler2D tDiffuse,tFlare,tWide,tDirt,tDrops; uniform float uSpeed,uBoost,uHit,uWet,uSat,uVig,uGrain,uTime,uCon,uLift,uFlare,uDirt,uRain,uClock,uAspect,uCA;
  uniform vec3 uShadow,uHigh; varying vec2 vUv;
  float h12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
  void main(){
    vec2 uv=vUv; float drop=0.; vec2 dn=vec2(0.);
  #if LENS
    if(uRain>.001){ // rain on the lens: two drop layers fading in and out of step, each drop refracts the frame behind it
      vec2 du=vec2(vUv.x*uAspect,vUv.y)*.85; float ph=uClock*.11, fa=smoothstep(0.,.35,fract(ph))*smoothstep(1.,.65,fract(ph)), fb=smoothstep(0.,.35,fract(ph+.5))*smoothstep(1.,.65,fract(ph+.5));
      vec3 a=texture2D(tDrops,du).rgb, b=texture2D(tDrops,du*1.31+vec2(.37,.61)).rgb;
      float ma=a.b*fa, mb=b.b*fb; drop=max(ma,mb)*uRain; dn=((a.rg*2.-1.)*ma+(b.rg*2.-1.)*mb)*uRain;
      uv-=dn*.022; }
  #endif
    vec2 c=uv-.5; float r=length(c);
    float bl=(uSpeed*.022+uBoost*.03)*smoothstep(.12,.75,r);
    float ca=(.0014+uSpeed*.0032+uBoost*.006+uHit*.012)*r*r*4.*uCA; // lateral colour stays near zero mid-frame and opens up with speed
    vec3 col;
    if(bl<.0004) col=vec3(texture2D(tDiffuse,uv+c*ca).r,texture2D(tDiffuse,uv).g,texture2D(tDiffuse,uv-c*ca).b); // perf: three taps when not blurring
    else { vec3 s=vec3(0.), ws=vec3(0.); // radial speed blur, each tap weighted along a spectrum so the blur itself carries the fringing
      for(int i=0;i<8;i++){ float t=float(i)/7.; vec3 w=vec3(1.-t,1.-abs(2.*t-1.),t)+.3; s+=texture2D(tDiffuse,uv-c*(bl*t)+c*ca*(1.-2.*t)).rgb*w; ws+=w; }
      col=s/ws; }
  #if LENS
    if(uFlare>0.){ float dirt=texture2D(tDirt,vUv).r; vec3 fl=texture2D(tFlare,vUv).rgb;
      col+=fl*uFlare*(1.+dirt*uDirt*3.)+texture2D(tWide,vUv).rgb*dirt*uDirt*.55; } // lens dirt lights up only where bright light falls on it
    if(drop>.001){ col*=1.-.22*drop*clamp(length(dn)*1.6,0.,1.); col+=drop*.05*pow(max(dot(normalize(dn+1e-4),vec2(-.45,.89)),0.),6.)*vec3(.9,.95,1.); }
  #endif
    float l=dot(col,vec3(.2126,.7152,.0722));
    vec3 shadowTint=mix(uShadow,vec3(.86,.98,1.18),uWet), highTint=uHigh;
    col*=mix(shadowTint,highTint,smoothstep(.04,.55,l));
    col=max(mix(vec3(l),col,uSat),0.);
    vec3 ov=max(col-.82,0.); col=min(col,.82)+ov/(1.+ov*2.2); // highlight shoulder: bloom and flares roll off instead of clipping flat
    vec3 p=sqrt(clamp(col,0.,1.)); col=mix(p,p*p*(3.-2.*p),uCon); col*=col; // filmic S-curve in perceptual space
    col=col*(1.-uLift)+uLift*shadowTint*.8; // printed-page blacks: a hair lifted and tinted, never crushed
    col*=1.-(uVig+uBoost*.1)*smoothstep(.38,.92,r*1.2);
    float gn=h12(gl_FragCoord.xy+fract(uTime)*317.)-.5;
    col+=gn*uGrain*(.35+.65*(1.-smoothstep(0.,.6,l)));
    gl_FragColor=LinearTosRGB(vec4(col,1.)); // perf: gamma folded in here, one full-screen pass fewer
    gl_FragColor.rgb+=(h12(gl_FragCoord.yx+fract(uTime)*91.)-.5)/255.; // dither the 8-bit output so night gradients don't band
  }`};
/* lens textures, drawn once: dirt (soft smudges + specks, grey mask) and rain drops (RG = refraction normal, B = drop mask) */
function lensDirtTex(){ const R=rng(77); return new THREE.CanvasTexture(canvasTex(512,288,(g,w,h)=>{ g.fillStyle='#000'; g.fillRect(0,0,w,h);
  for(let i=0;i<46;i++){ const x=R()*w, y=R()*h, r=10+R()*R()*70, a=.05+R()*.16, gr=g.createRadialGradient(x,y,0,x,y,r);
    gr.addColorStop(0,`rgba(255,255,255,${a})`); gr.addColorStop(.6,`rgba(255,255,255,${a*.45})`); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(x-r,y-r,r*2,r*2); }
  g.strokeStyle='rgba(255,255,255,.05)'; g.lineCap='round'; for(let i=0;i<7;i++){ g.lineWidth=6+R()*18; g.beginPath(); const x=R()*w, y=R()*h; g.moveTo(x,y); g.quadraticCurveTo(x+R()*90-45,y+R()*60-30,x+R()*160-80,y+R()*80-40); g.stroke(); }
  for(let i=0;i<140;i++){ g.fillStyle=`rgba(255,255,255,${.1+R()*.35})`; g.beginPath(); g.arc(R()*w,R()*h,.6+R()*1.6,0,7); g.fill(); } })); }
function lensDropTex(){ const W=512,H=256,c=document.createElement('canvas'); c.width=W; c.height=H; const g=c.getContext('2d'), im=g.createImageData(W,H), d=im.data, R=rng(91);
  for(let i=0;i<W*H;i++){ d[i*4]=d[i*4+1]=128; d[i*4+2]=0; d[i*4+3]=255; }
  for(let k=0;k<70;k++){ const cx=R()*W, cy=R()*H, rad=2.5+R()*R()*11, sy=1+R()*.35;
    for(let y=Math.floor(cy-rad*sy);y<=cy+rad*sy;y++) for(let x=Math.floor(cx-rad);x<=cx+rad;x++){
      const dx=(x-cx)/rad, dy=(y-cy)/(rad*sy), q=dx*dx+dy*dy; if(q>=1) continue; const X=(x+W)%W, Y=(y+H)%H, o=(Y*W+X)*4, m=Math.min(1,(1-q)*6);
      d[o]=128+dx*120*m; d[o+1]=128-dy*120*m; d[o+2]=Math.max(d[o+2],255*m); } }
  g.putImageData(im,0,0); const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.generateMipmaps=false; t.minFilter=THREE.LinearFilter; return t; }
try{
  if(THREE.EffectComposer&&THREE.RenderPass&&THREE.UnrealBloomPass&&THREE.ShaderPass&&THREE.GammaCorrectionShader){
    let rt; // WebGL2: 4x MSAA on the composer targets so edges stay clean through bloom and grading
    if(renderer.capabilities.isWebGL2&&THREE.WebGLMultisampleRenderTarget){ const pr=renderer.getPixelRatio();
      rt=new THREE.WebGLMultisampleRenderTarget(innerWidth*pr,innerHeight*pr,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat}); rt.samples=PHONE?2:4; }
    composer=new THREE.EffectComposer(renderer,rt);
    renderPass=new THREE.RenderPass(studio,cam); composer.addPass(renderPass);
    bloomPass=new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.8,.45,.8); composer.addPass(bloomPass);
    { const bs=bloomPass.setSize.bind(bloomPass); bloomPass.setSize=()=>bs(innerWidth,innerHeight); } // bloom stays at screen-pixel size whatever the render scale, so the glow never changes width
    if(!PHONE){ // lens pass: quarter-res, fixed to screen pixels like the bloom, so the frame pacer's scale changes never touch it
      class LensPass extends THREE.Pass{
        constructor(){ super(); this.needsSwap=false; this.rt=new THREE.WebGLRenderTarget(4,4,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat,depthBuffer:false});
          this.rt.texture.generateMipmaps=false; this.mat=new THREE.ShaderMaterial(FLARE_SHADER); this.mat.depthTest=this.mat.depthWrite=false; this.q=new THREE.FullScreenQuad(this.mat); }
        setSize(){ const w=Math.max(4,Math.round(innerWidth/4)), h=Math.max(4,Math.round(innerHeight/4)); this.rt.setSize(w,h); this.mat.uniforms.uTexel.value.set(1/w,1/h); this.mat.uniforms.uAspect.value=w/h; }
        render(r){ const v=bloomPass.renderTargetsVertical, u=this.mat.uniforms; u.t1.value=v[1].texture; u.t2.value=v[2].texture; u.t3.value=v[3].texture; u.t4.value=v[4].texture;
          r.setRenderTarget(this.rt); this.q.render(r); } }
      flarePass=new LensPass(); flarePass.setSize(); composer.addPass(flarePass); }
    gradePass=new THREE.ShaderPass(GRADE_SHADER); composer.addPass(gradePass); // last pass: grades, then encodes to sRGB on screen
    if(flarePass){ const u=gradePass.uniforms; u.tFlare.value=flarePass.rt.texture; u.tWide.value=bloomPass.renderTargetsVertical[3].texture; u.tDirt.value=lensDirtTex(); u.tDrops.value=lensDropTex(); }
  }
}catch(e){ composer=null; flarePass=null; }
if(!composer){ const b=$('#glow'); if(b) b.style.display='none'; }
else composer.setPixelRatio(renderer.getPixelRatio()); // with a custom (MSAA) target the composer ignores the renderer's ratio; keep them in step so the pacer drives both
/* dev hook, only with ?dev in the URL: pin the camera anywhere on a level for screenshots / look-dev. Never touched in normal play. */
const DEV=/[?&]dev\b/.test(location.search)?{hold:null}:null;
if(DEV) window.AHDEV={
  state:()=>({mode,ev:EV&&EV.id,L:TR&&TR.L,wet:LOOK.wet}),
  pick:id=>{ const i=EVENTS.findIndex(e=>e.id===id); if(i<0) return false; EVI=i; if(mode==='events') renderEvent(0,true); return true; },
  dry:()=>setWeather(false), wet:()=>setWeather(true),
  cam:(p,l,fov)=>{ DEV.hold={p,l,fov}; },
  track:(s,x,h,back,ahead,fov)=>{ const F=mkF(); frame(s-(back||0),F); const P=F.p.clone().addScaledVector(F.r,x||0); P.y+=h||2;
    frame(s+(ahead||30),F); const Lk=F.p.clone(); Lk.y+=1; DEV.hold={p:P.toArray(),l:Lk.toArray(),fov}; return DEV.hold; },
  free:()=>{ DEV.hold=null; DEV.scam=null; },
  car:()=>{ if(!player||!player.m) return null; const g=player.m.group, d=new THREE.Vector3(0,0,1).applyQuaternion(g.quaternion); return {p:g.position.toArray(),d:d.toArray()}; }, // look-dev: where the player car sits and faces
  scam:(p,l,fov)=>{ DEV.scam={p,l,roll:0,fov:fov||30}; },
  ev:()=>EV};
const CULL_V=new THREE.Vector3(); let DRAW_RACING=false;
function draw(scene){
  if(DEV&&DEV.hold&&scene!==studio){ const H=DEV.hold; cam.position.fromArray(H.p); cam.lookAt(H.l[0],H.l[1],H.l[2]); if(H.fov&&cam.fov!==H.fov){ cam.fov=H.fov; cam.updateProjectionMatrix(); } }
  if(scene.userData.dome) scene.userData.dome.position.copy(cam.position);
  const clr=CLEAR&&scene!==studio, fog0=scene.fog, fd0=clr&&fog0&&fog0.isFogExp2?fog0.density:0; if(fd0) fog0.density=fd0*CLR.fog; // Clear: thinner fog for this frame only (restored after the render, so levels that animate their fog are unaffected)
  if(scene!==studio) WETFX.frame(scene,cam,racers,traffic); // wet roads: pick the lamps and car lights the road reflects this frame
  { const f=scene.fog; CULL.far=!f?Infinity:f.isFogExp2?(f.density>0?2.6/f.density:Infinity):f.far; cam.getWorldPosition(CULL_V); CULL.x=CULL_V.x; CULL.y=CULL_V.y; CULL.z=CULL_V.z; cam.getWorldDirection(CULL_V); CULL.fx=CULL_V.x; CULL.fy=CULL_V.y; CULL.fz=CULL_V.z; }
  const racing=mode==='race'&&!!composer&&glowOn; if(racing!==DRAW_RACING){ DRAW_RACING=racing; document.body.classList.toggle('racing',racing); } // CSS grain off while racing, shader grain instead
  if(gradePass){ const u=gradePass.uniforms, pl=mode==='race'&&player?player:null;
    u.uSpeed.value=lerp(u.uSpeed.value,pl?STAGE.blur[pl.stage||0]*.85:0,.06); u.uBoost.value=lerp(u.uBoost.value,pl&&pl.nosOn?1:0,.12);
    u.uHit.value=Math.min(1,shake); u.uWet.value=(LOOK.wet&&scene!==studio?1:0)*(clr?CLR.wet:1); u.uCA.value=clr?CLR.ca:1;
    const gd=scene.userData.grade||GRADE_DEF, sh=gd.shadow||GRADE_DEF.shadow, hi=gd.high||GRADE_DEF.high;
    const sat=gd.sat!==undefined?gd.sat:GRADE_DEF.sat, vig=gd.vig!==undefined?gd.vig:GRADE_DEF.vig;
    if(clr){ u.uShadow.value.set(1+(sh[0]-1)*CLR.shadow,1+(sh[1]-1)*CLR.shadow,1+(sh[2]-1)*CLR.shadow); u.uHigh.value.set(1+(hi[0]-1)*CLR.high,1+(hi[1]-1)*CLR.high,1+(hi[2]-1)*CLR.high);
      u.uSat.value=1+(sat-1)*CLR.sat; u.uVig.value=vig*CLR.vig; u.uGrain.value=0; }
    else { u.uShadow.value.fromArray(sh); u.uHigh.value.fromArray(hi); u.uSat.value=sat; u.uVig.value=vig; u.uGrain.value=Math.max(gd.grain||0,DRAW_RACING?.022:0); }
    u.uTime.value=(u.uTime.value+.137)%1;
    u.uCon.value=gd.con!==undefined?gd.con:GRADE_DEF.con; u.uLift.value=gd.lift!==undefined?gd.lift:GRADE_DEF.lift;
    if(flarePass){ const ln=scene.userData.lens||LENS_DEF, f=flarePass.mat.uniforms, st=scene===studio; // studio: the lens is cleaner, no rain on it
      f.uStreak.value=ln.streak!==undefined?ln.streak:LENS_DEF.streak; f.uGhost.value=ln.ghost!==undefined?ln.ghost:LENS_DEF.ghost; f.uHalo.value=ln.halo!==undefined?ln.halo:LENS_DEF.halo; f.uTh.value=ln.th!==undefined?ln.th:LENS_DEF.th;
      f.uTint.value.fromArray(ln.tint||LENS_DEF.tint); u.uFlare.value=(st?.45:1+u.uBoost.value*.25)*(clr?.7:1); u.uDirt.value=(ln.dirt!==undefined?ln.dirt:1)*(st?.25:LOOK.wet?.8:.5);
      u.uRain.value=lerp(u.uRain.value,LOOK.wet&&!st&&(mode==='race'||mode==='loading'||mode==='highlight')&&!inTunnel()?1:0,.03); u.uClock.value=performance.now()/1000; u.uAspect.value=aspect(); } }
  if(composer&&glowOn){ renderPass.scene=scene; const b=scene.userData.bloom||{strength:.5,radius:.4,threshold:.85};
    bloomPass.strength=clr?b.strength*CLR.bloom:b.strength; bloomPass.radius=clr?b.radius*CLR.bloomR:b.radius; bloomPass.threshold=clr?Math.min(.95,b.threshold+CLR.bloomT):b.threshold; bloomPass.highPassUniforms.smoothWidth.value=b.knee!==undefined?b.knee:.1; // soft knee: glow eases in instead of snapping on at the threshold
    composer.render(); }
  else renderer.render(scene,cam);
  if(fd0) fog0.density=fd0;
}
function resize(){ renderer.setSize(innerWidth,innerHeight,false); if(composer) composer.setSize(innerWidth,innerHeight); cam.aspect=aspect(); cam.updateProjectionMatrix(); }
addEventListener('resize',resize); resize();
/* ---------------- FRAME PACER (perf) ----------------
   Dynamic resolution: the render scale follows the frame time so the game holds 60 fps on whatever GPU it lands on.
   If frames run long (under ~55 fps) for half a second the pixel ratio steps down; after 4 s of clean 60 fps it steps
   back up (to 1.5x on high-DPI screens when the GPU has room). A step up that immediately causes drops becomes a ceiling for 2 min,
   so it never see-saws. Loading, boot and tab switches (huge gaps) are ignored. */
const PR_MAX=PHONE?Math.min(window.devicePixelRatio||1,1):Math.min(window.devicePixelRatio||1,1.5), PR_MIN=Math.min(PR_MAX,PHONE?.75:.7); // phone floor was .6, which upscaled everything into soft blocks
const PACE={ema:16.7,over:0,hold:0,ceil:PR_MAX,ceilT:0,lastUp:-1e9,clock:0};
function setPR(pr){ pr=Math.round(clamp(pr,PR_MIN,PACE.ceil)*20)/20; if(Math.abs(pr-renderer.getPixelRatio())<.01) return false;
  renderer.setPixelRatio(pr); if(composer&&composer.setPixelRatio) composer.setPixelRatio(pr); resize(); return true; }
function pace(ms){ if(!(ms>0)||ms>250||document.hidden){ PACE.over=PACE.hold=0; return; }
  PACE.clock+=ms; PACE.ema+=(ms-PACE.ema)*.1; const pr=renderer.getPixelRatio();
  if(PACE.ceil<PR_MAX&&PACE.clock-PACE.ceilT>120000) PACE.ceil=PR_MAX;
  if(PACE.ema>18.2){ PACE.hold=0; PACE.over+=ms;
    if(PACE.over>500){ PACE.over=0; if(PACE.clock-PACE.lastUp<3000){ PACE.ceil=Math.max(PR_MIN,pr-.05); PACE.ceilT=PACE.clock; }
      if(setPR(pr*.85)) PACE.ema=16.7; } }
  else { PACE.over=Math.max(0,PACE.over-ms*.5);
    if(PACE.ema<17.3){ PACE.hold+=ms; if(PACE.hold>4000){ PACE.hold=0; if(pr<PACE.ceil&&setPR(pr+.1)) PACE.lastUp=PACE.clock; } } else PACE.hold=0; } }
if(DEV) window.AHDEV.pace=()=>({pr:renderer.getPixelRatio(),ema:+PACE.ema.toFixed(2),ceil:PACE.ceil,max:PR_MAX});
// HUD writes only when the value changes: no per-frame DOM churn (style recalcs and garbage) while racing
function setT(el,t){ if(el.textContent!==t) el.textContent=t; }
function setH(el,h){ if(el._h===h&&el.innerHTML===el._s) return; el.innerHTML=h; el._h=h; el._s=el.innerHTML; }
function hfovToV(h){ return THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(h)/2)/cam.aspect)); }

/* ---------------- AUDIO ---------------- */
let AC=null, master, sfxBus, wxBus, musBus, rvSend=null, noiseBuf, pinkBuf, soundOn=true;
// buses: sfxBus (one-shots) and wxBus (engine, tires, wind, rain, rival voices) feed master -> comp -> limiter.
// musBus carries the music so it can sit a little lower under the engine at speed and dip on impacts
function axNoise(ctx){ // procedural noise beds, built once per context (no sample files)
  const sr=ctx.sampleRate, n=sr*2, o={};
  o.nz=ctx.createBuffer(1,n,sr); const w=o.nz.getChannelData(0); for(let i=0;i<n;i++) w[i]=Math.random()*2-1;
  o.pk=ctx.createBuffer(1,n,sr); const p=o.pk.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for(let i=0;i<n;i++){ const x=Math.random()*2-1; b0=.99886*b0+x*.0555179; b1=.99332*b1+x*.0750759; b2=.969*b2+x*.153852; b3=.8665*b3+x*.3104856;
    b4=.55*b4+x*.5329522; b5=-.7616*b5-x*.016898; p[i]=(b0+b1+b2+b3+b4+b5+b6+x*.5362)*.11; b6=x*.115926; }
  o.rn=ctx.createBuffer(1,n,sr); const d=o.rn.getChannelData(0); // rain: quiet bed plus sparse droplet ticks, each a few ms of decaying noise
  for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*.05;
  for(let i=0;i<n-300;){ i+=1+(-Math.log(1-Math.random())*(sr/150))|0; const a=.25+Math.random()*.75, len=60+(Math.random()*160|0);
    for(let j=0;j<len&&i+j<n;j++) d[i+j]+=(Math.random()*2-1)*a*Math.exp(-j/(len*.28)); }
  return o;
}
function initAudio(){
  if(AC) { axResume(); return; }
  try{ AC=new (window.AudioContext||window.webkitAudioContext)({latencyHint:'interactive'}); }catch(e){ try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e2){ return; } }
  const nb=axNoise(AC); noiseBuf=nb.nz; pinkBuf=nb.pk;
  const comp=AC.createDynamicsCompressor(); comp.threshold.value=-20; comp.knee.value=14; comp.ratio.value=3.2; comp.attack.value=.002; comp.release.value=.18;
  const lim=AC.createDynamicsCompressor(); lim.threshold.value=-3; lim.knee.value=0; lim.ratio.value=20; lim.attack.value=.001; lim.release.value=.09; // brick-wall catch for stacked hits + boost
  master=AC.createGain(); master.gain.value=.52;
  sfxBus=AC.createGain(); sfxBus.gain.value=.88;
  wxBus=AC.createGain(); wxBus.gain.value=soundOn?1:0;
  musBus=AC.createGain(); musBus.gain.value=1;
  const masterEQ=AC.createBiquadFilter(); masterEQ.type='lowshelf'; masterEQ.frequency.value=120; masterEQ.gain.value=2.5;
  sfxBus.connect(masterEQ); masterEQ.connect(master); wxBus.connect(master); musBus.connect(master); master.connect(comp); comp.connect(lim); lim.connect(AC.destination);
  if(!PHONE){ // tunnel / underpass tail on the car beds only; silent (and free) in the open
    const rv=AC.createConvolver(), len=AC.sampleRate*1.3|0, ir=AC.createBuffer(2,len,AC.sampleRate);
    for(let c=0;c<2;c++){ const d=ir.getChannelData(c); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6); }
    rv.buffer=ir; rvSend=AC.createGain(); rvSend.gain.value=0; wxBus.connect(rvSend); rvSend.connect(rv); rv.connect(master); }
  axBuild(nb);
  musicInit(AC,musBus); setInterval(musicTick,30);
  // mobile: iOS can park the context ('interrupted'/'suspended') after a call or tab switch; the next touch brings it back
  ['pointerdown','touchend','keydown'].forEach(ev=>window.addEventListener(ev,axResume,{passive:true,capture:true}));
  // a hidden tab used to keep droning the last engine note; suspend the whole context instead
  document.addEventListener('visibilitychange',()=>{ if(!AC) return; if(document.hidden){ if(AC.state==='running'&&AC.suspend){ const p=AC.suspend(); if(p&&p.catch) p.catch(()=>{}); } } else axResume(); });
}
function axResume(){ if(AC&&!document.hidden&&AC.state!=='running'&&AC.resume){ const p=AC.resume(); if(p&&p.catch) p.catch(()=>{}); } }
function sfxOut(node){ node.connect(sfxBus||master); }
function envAD(g,t,a,d,peak){ g.gain.setValueAtTime(.001,t); g.gain.exponentialRampToValueAtTime(Math.max(peak,.002),t+a); g.gain.exponentialRampToValueAtTime(.001,t+a+d); }
function burst(dur,type,f0,f1,vol,q,pan,buf){
  if(!AC||!soundOn) return; const t=AC.currentTime, n=AC.createBufferSource(); n.buffer=buf||noiseBuf;
  const bf=AC.createBiquadFilter(); bf.type=type; bf.Q.value=q||1.2; bf.frequency.setValueAtTime(f0,t); bf.frequency.exponentialRampToValueAtTime(Math.max(f1,20),t+dur);
  const g=AC.createGain(); envAD(g,t,Math.min(.012,dur*.08),dur,vol);
  n.connect(bf); bf.connect(g);
  if(pan!==undefined&&AC.createStereoPanner){ const sp=AC.createStereoPanner(); sp.pan.value=clamp(pan,-1,1); g.connect(sp); sfxOut(sp); }
  else sfxOut(g);
  n.start(t); n.stop(t+dur+.08);
}
function tone(f,dur,vol,type,opts){
  if(!AC||!soundOn) return; opts=opts||{}; const t=AC.currentTime, det=opts.det||0, f2=f*(opts.ratio||1);
  [f,f2].forEach((freq,i)=>{ if(!freq||(i&&opts.solo)) return; const o=AC.createOscillator(), g=AC.createGain(), fl=AC.createBiquadFilter();
    o.type=type||'sine'; o.frequency.setValueAtTime(freq+(i?det:0),t);
    if(opts.slide) o.frequency.exponentialRampToValueAtTime(opts.slide,t+dur);
    fl.type=opts.filter||'lowpass'; fl.frequency.value=opts.cut||Math.min(12000,freq*4+800); fl.Q.value=opts.q||.7;
    const v=vol*(i?opts.mix||.45:1); envAD(g,t,opts.attack||.008,dur,v);
    o.connect(fl); fl.connect(g); sfxOut(g); o.start(t); o.stop(t+dur+.06); });
}
const sfx={
  shutter(){
    burst(.018,'highpass',4200,9000,.22,2.8,-.15,noiseBuf);
    burst(.045,'bandpass',1800,5200,.38,2.2,.12,noiseBuf);
    tone(2400,.04,.08,'sine',{attack:.001,cut:6000}); tone(980,.06,.06,'triangle',{attack:.002,cut:4000});
  },
  page(){
    burst(.12,'bandpass',280,1400,.28,1.1,0,pinkBuf);
    burst(.22,'lowpass',900,220,.18,.8,0,pinkBuf);
    tone(180,.14,.12,'sine',{attack:.004,cut:500,slide:90});
  },
  // k scales with how hard the hit was (defaults to the player's speed), pan places it left/right of the car
  hit(k,pan){
    k=k===undefined?clamp((player?player.v:40)/55,.45,1.25):clamp(k,.3,1.4);
    pan=pan===undefined?clamp((player?(player.vx||0):0)*.09,-.7,.7):pan;
    burst(.09,'lowpass',520,60,.55*k,1.4,pan,pinkBuf);                                  // body thud
    burst(.05,'bandpass',900,2800,.32*k,2.5,pan,noiseBuf);                              // crack
    burst(.12+.14*k,'bandpass',1800,260,.2*k,.8,pan,noiseBuf);                          // crunch tail
    tone(95,.34,.42*k,'sine',{attack:.002,cut:280,q:2,slide:42});                       // chassis boom
    tone(210,.18,.14*k,'triangle',{attack:.003,cut:900,ratio:1.5,det:3});
    tone(560+Math.random()*80,.26,.07*k,'triangle',{attack:.001,cut:3400,ratio:2.62,det:3,mix:.5}); // sheet-metal ring
    setTimeout(()=>burst(.2,'highpass',5200,8800,.09*k,1.2,pan,noiseBuf),45);           // trim and glass
    if(typeof AX!=='undefined') AX.hitD=Math.min(1,.5+.5*k);                            // music ducks for a beat
  },
  pop(k){ k=k||1; burst(.06,'bandpass',1100+Math.random()*500,380,.2*k,1.8,(Math.random()-.5)*.3,noiseBuf); tone(130+Math.random()*50,.07,.12*k,'sawtooth',{attack:.001,cut:700,slide:55,q:1,solo:1}); },   // exhaust backfire
  bov(k){ k=clamp(k||.8,.3,1); burst(.38,'bandpass',3400,1500,.17*k,1.4,0,noiseBuf); setTimeout(()=>burst(.14,'bandpass',3000,1800,.08*k,1.6,0,noiseBuf),150); tone(1900,.2,.015*k,'sine',{attack:.004,slide:900,cut:6000,solo:1}); }, // blow-off chuff + flutter
  clunk(k){ k=k||1; tone(110,.07,.07*k,'sine',{attack:.001,cut:400,slide:60,solo:1}); burst(.03,'lowpass',900,300,.07*k,1,0,pinkBuf); },   // gear change
  nosOn(){ burst(.4,'bandpass',400,3400,.22,1.1,0,noiseBuf); tone(78,.45,.22,'sine',{attack:.01,slide:46,cut:260}); burst(.18,'lowpass',2200,300,.2,1,0,pinkBuf); },
  pass(pan,k){ k=k||.6; burst(.38,'bandpass',2600,520,.2*k,.8,pan||0,noiseBuf); tone(64,.22,.2*k,'sine',{attack:.004,slide:40,cut:200,solo:1}); }, // pressure thump as a car streaks past
  horn(){
    tone(392,.42,.14,'sawtooth',{attack:.04,cut:2200,slide:360,q:1.2});
    tone(311,.42,.11,'sawtooth',{attack:.04,cut:1800,slide:280,ratio:1,det:-2});
    tone(784,.25,.06,'sine',{attack:.05,cut:4000,ratio:2,mix:.4});
    burst(.35,'bandpass',400,1200,.12,1,0,pinkBuf);
  },
  beep(hi){
    if(hi){
      tone(880,.08,.12,'sine',{attack:.002,cut:5000});
      tone(1320,.55,.22,'sine',{attack:.008,cut:8000,slide:1760});
      tone(1760,.35,.14,'triangle',{attack:.01,cut:9000,ratio:1.5,det:4});
      burst(.15,'highpass',2000,6500,.1,1.2,0,noiseBuf);
    } else {
      tone(520,.07,.14,'sine',{attack:.001,cut:3000,slide:440});
      tone(780,.12,.08,'triangle',{attack:.002,cut:4000,ratio:1.33,mix:.5});
    }
  },
  powerup(jack){
    const f=jack?1040:880;
    tone(f,.14,.18,'sine',{attack:.006,cut:7000});
    tone(f*1.5,.2,.14,'triangle',{attack:.01,cut:9000,ratio:1.5,det:5});
    if(jack){ setTimeout(()=>tone(1560,.18,.16,'sine',{attack:.008,cut:9000}),85); setTimeout(()=>{ tone(2080,.22,.12,'sine',{attack:.01,cut:10000}); burst(.12,'highpass',3000,8000,.15,1.5,0,noiseBuf); },190); }
    else setTimeout(()=>tone(1320,.16,.12,'sine',{attack:.008,cut:8000}),75);
  }
};
/* ---- vehicle audio ----
   Engine: a firing-order pulse train (PeriodicWave per cylinder layout, fundamental = rpm/120) through a muffler lowpass,
   a sweeping exhaust resonance and a soft clipper. rpm comes from speed through a per-car gear model (gear count and redline read
   from the spec sheet), load from acceleration/brake/boost. Turbo whistle + blow-off, supercharger or hybrid whine, e-motor whine for
   EVs, backfire pops, rev limiter. Tires, wind, rain, wall scrape are persistent filtered-noise beds. Rivals and traffic are a
   pool of 3 (2 on phones) spatial voices with doppler. Nothing here allocates nodes per frame; only one-shots (pops, impacts) do. */
const AX={frame:0,stamp:-9,on:false,v:0,rain:false,tun:false,gate:-1,E:null,B:null,V:[],cid:null,prof:null,K:PHONE?2:3,
  st:{g:0,shiftT:0,shift:0,blip:0},rn:0,load:.3,ld0:.3,accS:0,pv:0,boost:0,nos:0,nosPrev:false,revT:0,gust:0,wetS:0,scr:0,airS:0,
  hitD:0,prevLd:0,popCd:0,bovCd:0,passCd:0,dEng:0,errs:0,camP:null,camV:null,pickN:0,wasLive:false,spk:0,skip:0};
const axTrafficProf={layout:'i4',cyl:4,idle:880,red:6400,gears:6,turbo:0,sc:0,hyb:0,ev:0,pops:0};
// non-zero-safe param writers: a NaN or Infinity pitch throws in setTargetAtTime and used to abort the rest of the frame
function pset(p,v,t,tc,eps){ if(p.setTargetAtTime===undefined) p=p.gain; if(!(v===v)||v===Infinity||v===-Infinity) return; if(p._v!==undefined&&Math.abs(p._v-v)<=(eps||1e-4)+.002*Math.abs(v)) return; p._v=v; if(tc>0) p.setTargetAtTime(v,t,tc); else p.setValueAtTime(v,t); }
function pf(p,v,t,tc){ if(!(v===v)||v===Infinity||v===-Infinity) return; if(tc>0) p.setTargetAtTime(v,t,tc); else p.setValueAtTime(v,t); }

const ENG_PROF={};
function engProfile(cid){
  if(ENG_PROF[cid]) return ENG_PROF[cid];
  const sh=(typeof SHEETS!=='undefined'&&SHEETS[cid])||{}, s=(sh.engine||'').toLowerCase(), gb=(sh.gearbox||'').toLowerCase();
  const p={layout:'v8',cyl:8,idle:820,red:7000,gears:7,turbo:/turbo/.test(s)?1:0,sc:/supercharged/.test(s)?1:0,hyb:/e-motor|e-axle/.test(s)?1:0,ev:0,pops:1};
  if(/e-motor|axial-flux/.test(s)&&!/\d\.\dl/.test(s)){ p.ev=1; p.layout='ev'; p.cyl=1; p.pops=0; p.turbo=0; p.sc=0; p.hyb=0; }
  else { const m=/w16/.test(s)?['w16',16,6800,780]:/v12/.test(s)?['v12',12,8600,880]:/v8/.test(s)?['v8',8,7200,820]:/flat-six/.test(s)?['f6',6,8100,850]:/v6/.test(s)?['v6',6,7500,850]:/inline-four/.test(s)?['i4',4,7400,900]:null;
    if(m){ p.layout=m[0]; p.cyl=m[1]; p.red=m[2]; p.idle=m[3]; } }
  const g=/(\d+)-speed/.exec(gb); p.gears=p.ev?1:g?clamp(+g[1],4,10):/single/.test(gb)?1:6;
  return (ENG_PROF[cid]=p);
}
function axFire(layout){ // [phase in the 720 degree cycle, amplitude] per cylinder; bank order and odd-fire spacing give each layout its own burble
  const P=[], reg=(n,amps)=>{ for(let k=0;k<n;k++) P.push([k/n,amps[k%amps.length]]); };
  switch(layout){
    case 'v8': reg(8,[1,.62,1,1,.62,.62,.62,1]); break;               // cross-plane: uneven bank sequence is the V8 rumble
    case 'v6': [0,150,240,390,480,630].forEach((d,k)=>P.push([d/720,k%2?.8:1])); break; // odd-fire 90 degree V6
    case 'f6': reg(6,[1,.78]); break;
    case 'v12': reg(12,[1,.9]); break;
    case 'w16': reg(16,[1,.9,.96,.84]); break;
    default: reg(4,[1,.88,.96,.84]);                                  // inline-four: strong second order
  }
  return P;
}
function axWave(ctx,layout,bright){ // one PeriodicWave per (layout, brightness) per context; bright: 0 body, 1 edge, 2 mid (rival voices)
  const key=layout+bright, c=ctx._axw||(ctx._axw={}); if(c[key]) return c[key];
  const H=72, re=new Float32Array(H+1), im=new Float32Array(H+1);
  if(layout==='ev'){ const h=bright===1?[0,1,.5,.6,.1,.4,0,.3,0,.2]:[0,1,.38,.2,.05,.14,0,.08]; h.forEach((a,n)=>{ im[n]=a; }); }
  else { const P=axFire(layout), sig=(bright===1?.065:bright===2?.1:.15)/P.length;
    for(let n=1;n<=H;n++){ const env=Math.exp(-.5*Math.pow(2*Math.PI*n*sig,2))*Math.pow(n,-.12); let a=0,b=0;
      for(let k=0;k<P.length;k++){ const ph=2*Math.PI*n*P[k][0]; a+=P[k][1]*Math.cos(ph); b+=P[k][1]*Math.sin(ph); }
      re[n]=a*env; im[n]=b*env; } }
  return (c[key]=ctx.createPeriodicWave(re,im));
}
function axCurve(){ const n=512, c=new Float32Array(n); for(let i=0;i<n;i++){ const x=i/(n-1)*2-1; c[i]=Math.tanh(1.6*x)/Math.tanh(1.6); } return c; }
// small node helpers shared by the builders (they take the context so the same code renders offline for tests)
const axG=(ctx,v,to)=>{ const n=ctx.createGain(); n.gain.value=v; if(to) n.connect(to); return n; };
const axF=(ctx,type,fr,q,to)=>{ const n=ctx.createBiquadFilter(); n.type=type; n.frequency.value=fr; n.Q.value=q; if(to) n.connect(to); return n; };
const axS=(ctx,buf)=>{ const n=ctx.createBufferSource(); n.buffer=buf; n.loop=true; n.start(); return n; };
const axO=(ctx,type,to)=>{ const n=ctx.createOscillator(); n.type=type; n.frequency.value=60; if(to) n.connect(to); n.start(); return n; };

function buildEngine(ctx,dest,nb){
  const out=axG(ctx,0,dest), ws=ctx.createWaveShaper(); ws.curve=axCurve(); ws.connect(out);
  const pre=axG(ctx,1,ws), peak=axF(ctx,'peaking',400,2.5,pre); peak.gain.value=4.5;
  const lp=axF(ctx,'lowpass',1400,.9,peak), mix=axG(ctx,1,lp), E={ctx,out,pre,peak,lp,mix,pr:null};
  E.gBody=axG(ctx,0,mix); E.body=axO(ctx,'sine',E.gBody);
  E.gEdge=axG(ctx,0,mix); E.edge=axO(ctx,'sine',E.gEdge);
  E.gSub=axG(ctx,0,mix);  E.sub=axO(ctx,'sine',E.gSub);
  E.airF=axF(ctx,'bandpass',900,.8); E.gAir=axG(ctx,0,mix); E.airF.connect(E.gAir); axS(ctx,nb.pk).connect(E.airF);
  E.gAux=axG(ctx,0,out); E.aux=axO(ctx,'sine',E.gAux);                 // turbo whistle, supercharger or hybrid whine, past the muffler
  E.gSp=axG(ctx,0,out); E.spF=axF(ctx,'bandpass',4200,1,E.gSp); axS(ctx,nb.nz).connect(E.spF); // turbo spool air
  E.gNos=axG(ctx,0,out); E.nosF=axF(ctx,'bandpass',900,.7,E.gNos); axS(ctx,nb.pk).connect(E.nosF); // nitrous roar
  return E;
}
function engSetProf(E,pr){
  E.pr=pr; E.body.setPeriodicWave(axWave(E.ctx,pr.layout,0)); E.edge.setPeriodicWave(axWave(E.ctx,pr.layout,1));
  E.aux.type=pr.sc?'triangle':'sine';
}
// s: {rpm, frac 0..1 (rpm position between idle and redline), load 0..1, boost, nos, v01 (EV), lvl}
function engApply(E,s,t,tc){
  const pr=E.pr, L=clamp(s.load,0,1), fr=clamp(s.frac,0,1.05), nos=s.nos||0;
  if(pr.ev){
    const v=clamp(s.v01,0,1.3), w=140+1100*v;
    pf(E.body.frequency,w,t,tc); pf(E.edge.frequency,w*2.003,t,tc); pf(E.sub.frequency,55+110*v,t,tc);
    pset(E.gBody,.3*(.3+.7*L),t,tc); pset(E.gEdge,.1*L*(.35+.65*fr),t,tc); pset(E.gSub,.22*(.5+.5*L),t,tc);
    pset(E.lp.frequency,1500+3500*fr,t,tc,1); pset(E.peak.gain,0,t,tc,.01); pset(E.pre.gain,1,t,tc);
    pset(E.gAir.gain,.01+.02*fr,t,tc); pset(E.gAux.gain,0,t,tc); pset(E.gSp.gain,0,t,tc);
  } else {
    const fc=s.rpm/120, fire=fc*pr.cyl;
    pf(E.body.frequency,fc,t,tc); pf(E.edge.frequency,fc,t,tc); pf(E.sub.frequency,Math.max(28,fire*.5),t,tc);
    pset(E.gBody,.5*(.72+.28*L),t,tc); pset(E.gEdge,.34*L*(.25+.75*fr)+.1*nos,t,tc); pset(E.gSub,.42*(1-.45*fr)*(.5+.5*L),t,tc);
    pset(E.lp.frequency,420+(1400+3600*L)*(.3+.7*fr)+700*nos,t,tc,1);
    pset(E.peak.frequency,clamp(fire*2,150,1600),t,tc,1); pset(E.peak.gain,4.5,t,tc,.01);
    pset(E.pre.gain,1+1.6*L*fr+1.2*nos,t,tc);
    pset(E.gAir.gain,(.012+.055*L)*(.35+.65*fr),t,tc);
    const b=clamp(s.boost,0,1);
    if(pr.turbo){ pf(E.aux.frequency,1500+3600*b,t,tc); pset(E.gAux.gain,.022*b*(.35+.65*L),t,tc); pset(E.spF.frequency,3800+2000*b,t,tc,1); pset(E.gSp.gain,.03*b*L,t,tc); }
    else if(pr.sc){ pf(E.aux.frequency,clamp(s.rpm/60*26,300,6500),t,tc); pset(E.gAux.gain,.016*L*(.3+.7*fr),t,tc); pset(E.gSp.gain,0,t,tc); }
    else if(pr.hyb){ pf(E.aux.frequency,380+2200*clamp(s.v01,0,1.3),t,tc); pset(E.gAux.gain,.011*(.4+.6*L),t,tc); pset(E.gSp.gain,0,t,tc); }
    else { pset(E.gAux.gain,0,t,tc); pset(E.gSp.gain,0,t,tc); }
  }
  pset(E.nosF.frequency,500+1900*nos,t,tc,1); pset(E.gNos.gain,.16*nos,t,tc);
  pset(E.out.gain,s.lvl,t,tc);
}

// tires, wind, rain, wall scrape: three shared noise sources fanned out through filters (no per-frame nodes)
function buildBeds(ctx,dest,nb){
  const B={ctx}, pk=axS(ctx,nb.pk), nz=axS(ctx,nb.nz), rn=axS(ctx,nb.rn);
  B.gRoad=axG(ctx,0,dest);  B.roadF=axF(ctx,'bandpass',300,.7,B.gRoad); pk.connect(B.roadF);          // tire roar
  B.gSpray=axG(ctx,0,dest); pk.connect(axF(ctx,'highpass',1800,.6,B.gSpray));                          // wet-road spray hiss
  B.gWL=axG(ctx,0,dest);    B.wlF=axF(ctx,'lowpass',500,.6,B.gWL); pk.connect(B.wlF);                   // wind body
  B.gWH=axG(ctx,0,dest);    B.whF=axF(ctx,'bandpass',1800,1.6,B.gWH); nz.connect(B.whF);                // wind whistle
  B.gSq=axG(ctx,0,dest);    B.sqF=axF(ctx,'bandpass',1500,5.5,B.gSq);                                   // cornering squeal: two detuned saws + grit
  B.sq1=axO(ctx,'sawtooth',B.sqF); B.sq2=axO(ctx,'sawtooth',B.sqF);
  B.gSqN=axG(ctx,0,dest);   B.sqNF=axF(ctx,'bandpass',2600,3.2,B.gSqN); nz.connect(B.sqNF);
  B.gSk=axG(ctx,0,dest);    B.skF=axF(ctx,'bandpass',1300,1.5,B.gSk); pk.connect(B.skF);                // braking skid: rubbery
  B.gScr=axG(ctx,0,dest);   B.scrF=axF(ctx,'bandpass',1700,2.4,B.gScr); nz.connect(B.scrF);              // wall scrape: grit + metal groan
  B.gScO=axG(ctx,0,dest);   B.scO=axO(ctx,'sawtooth',axF(ctx,'lowpass',900,.8,B.gScO)); B.scO.frequency.value=150;
  B.gRH=axG(ctx,0,dest);    nz.connect(axF(ctx,'highpass',2800,.4,B.gRH));                             // rain hiss
  B.gRD=axG(ctx,0,dest);    B.rdF=axF(ctx,'bandpass',3600,.6,B.gRD); rn.connect(B.rdF);                 // droplets
  B.gRR=axG(ctx,0,dest);    pk.connect(axF(ctx,'bandpass',900,.9,B.gRR));                               // drumming on roof and hood
  return B;
}
// s: {v01, w (wind 0..1), wet, lat, brk, scr, air, rain, gust, jit}
function bedApply(B,s,t,tc){
  const g=1-.92*s.air, v=s.v01, w=s.w, wet=s.wet, lat=clamp(s.lat,0,1), brk=clamp(s.brk,0,1);
  pset(B.roadF.frequency,140+380*Math.min(v,1.2),t,tc,2); pset(B.gRoad,.13*Math.pow(Math.min(v,1.2),1.15)*(1-.3*wet)*g,t,tc);
  pset(B.gSpray,.095*Math.pow(Math.min(v,1.2),1.1)*wet*g,t,tc);
  pset(B.wlF.frequency,330+1100*w,t,tc,2); pset(B.gWL,.24*Math.pow(w,1.2),t,tc);
  pset(B.whF.frequency,1500+2400*w,t,tc,2); pset(B.gWH,.075*Math.pow(w,2.4)*(1+.25*s.gust),t,tc);
  const f=700+700*lat+320*Math.min(v,1.2)+s.jit*30;
  pf(B.sq1.frequency,f,t,tc); pf(B.sq2.frequency,f*1.013,t,tc); pset(B.sqF.frequency,f*1.6,t,tc,2);
  pset(B.gSq,.1*Math.pow(lat,1.2)*(1-.4*wet)*g,t,tc); pset(B.gSqN,.085*lat*g,t,tc);
  pset(B.skF.frequency,1200+800*Math.min(v,1.2),t,tc,2); pset(B.gSk,.11*brk*Math.min(v,1)*g,t,tc);
  pset(B.scrF.frequency,1700+350*s.jit,t,tc,2); pset(B.gScr,.16*s.scr,t,tc); pset(B.gScO,.05*s.scr,t,tc);
  pset(B.gRH,.034*s.rain*(1+.5*w),t,tc); pset(B.gRD,.05*s.rain,t,tc); pset(B.gRR,.03*s.rain*(.6+.4*w),t,tc);
}

// a spatial voice for one nearby rival or traffic car
function buildVoice(ctx,dest,nb,hrtf){
  const V={ctx}, pan=ctx.createPanner();
  pan.panningModel=hrtf?'HRTF':'equalpower'; pan.distanceModel='inverse'; pan.refDistance=6; pan.rolloffFactor=1.5; pan.maxDistance=10000; pan.connect(dest);
  V.pan=pan; V.lp=axF(ctx,'lowpass',6000,.6,pan);
  V.g=axG(ctx,0,V.lp); V.osc=axO(ctx,'sine',V.g);                          // pulse-train engine
  V.gN=axG(ctx,0,V.lp); V.nF=axF(ctx,'bandpass',900,.8,V.gN); axS(ctx,nb.pk).connect(V.nF); // tire / air whoosh scaled by closing speed
  V.src=null; V.freeAt=0; V.st={g:0,shiftT:0,shift:0,blip:0}; V.rn=0; V.ld=.4; V.pv=0; V.dop=1; V.rad=0; V.last=null; V.prof=null;
  return V;
}
function axPos(p,x,y,z){ if(p.positionX){ p.positionX.value=x; p.positionY.value=y; p.positionZ.value=z; } else if(p.setPosition) p.setPosition(x,y,z); }
function axBuild(nb){
  AX.E=buildEngine(AC,wxBus,nb); engSetProf(AX.E,engProfile('__none')); AX.cid='__none'; AX.prof=ENG_PROF.__none;
  AX.B=buildBeds(AC,wxBus,nb);
  AX.V=[]; for(let i=0;i<AX.K;i++) AX.V.push(buildVoice(AC,wxBus,nb,!PHONE));
}

// gear model: gear tops follow top*((g+1)/n)^.72, so the low gears span wide rpm ranges and the top gears sit close together.
// Returns rpm position (0..~1.1) in the current gear and flags st.shift = +1 / -1 on a gear change.
function gearStep(st,pr,v,top,dt){
  const n=pr.gears;
  if(pr.ev||n<2){ st.g=0; return clamp(v/top,0,1.3); }
  const gt=g=>top*Math.pow((g+1)/n,.72); let g=st.g|0, was=g;
  while(g<n-1&&v>gt(g)*.985) g++;
  while(g>0&&v<gt(g-1)*.82) g--;
  if(g!==was){ st.shift=g>was?1:-1; st.shiftT=g>was?.17:.11; if(g<was) st.blip=.16; }
  st.g=g; let rn=v/gt(g);
  if(g===0&&v<14) rn=Math.max(rn,.1+.22*(st.launch||0)); // clutch slip off the line
  if(st.shiftT>0) st.shiftT-=dt; if(st.blip>0) st.blip-=dt;
  return rn;
}
function axSetCar(cid){ AX.cid=cid; AX.prof=engProfile(cid); engSetProf(AX.E,AX.prof); AX.st={g:0,shiftT:0,shift:0,blip:0}; AX.rn=0; AX.boost=0; }
// engine(v,on) / screech(a) keep their old signatures (callers across the game), but the sound is now produced by audioTick()
function engine(v,on){ AX.v=v; AX.on=!!on; AX.stamp=AX.frame; }
function screech(a){ AX.slip=a; }
function audioTick(dt){
  if(!AC||!AX.E) return; AX.frame++;
  if(PHONE){ AX.skip+=dt; if(AX.frame&1) return; dt=AX.skip; AX.skip=0; } // phones update the audio params at half rate
  try{ axTick(Math.max(dt,1/240)); }catch(e){ if(AX.errs++<3) console.warn('audio tick failed',e); }
}
const AXR=new THREE.Vector3(), AXU=new THREE.Vector3(), AXF=new THREE.Vector3();
let AXFR=null;
function axTick(dt){
  if(!AXFR) AXFR=mkF();
  const t=AC.currentTime, race=mode==='race', E=AX.E, B=AX.B;
  const live=AX.on&&AX.frame-AX.stamp<=3;
  const sg=soundOn?1:0; if(sg!==AX.gate){ AX.gate=sg; wxBus.gain.setTargetAtTime(sg,t,.04); }
  const r=(race||mode==='loading')?player:null, k=1-Math.exp(-dt*8);
  // --- world state shared by the beds ---
  if(race&&(AX.frame&7)===0) AX.tun=EV.id==='tunnel'||(!!player&&frame(player.dist,AXFR).p.y<-6); // own scratch frame: no shared-state surprises mid-loop
  if(!race&&mode!=='loading') AX.tun=false;
  AX.wetS+=((LOOK.wet?1:0)-AX.wetS)*(1-Math.exp(-dt*2));
  AX.gust+=((Math.random()*2-1)-AX.gust)*.04;
  let lvl=0, v=0, frac=0, w=0, lat=0, brk=0, air=0, scrT=0;
  if(live&&r){
    const def=r.def, cid=def.chassisId||def.id; if(cid!==AX.cid) axSetCar(cid);
    const pr=AX.prof, top=Math.max(def.top||80,35)*1.25, st=AX.st, rev=race&&countdown>0; // top gear reaches the redline 25% above the car's top speed, so boost pushes it into the limiter
    v=AX.v; const nosOn=!!r.nosOn;
    // load: auto-throttle is always on, so read it from what the car is doing
    const acc=(v-AX.pv)/Math.max(dt,1e-3); AX.pv=v; AX.accS+=(clamp(acc,-60,60)-AX.accS)*(1-Math.exp(-dt*6));
    air=r.airT>.08?1:0;
    let ld0=rev?(v>20?.85:.18):(r.brk>.2?0:air?.15:(AX.accS<-4?0:clamp(.42+AX.accS/22,0,1)));
    if(nosOn&&!rev) ld0=1;
    AX.ld0=ld0; AX.load+=(ld0-AX.load)*(1-Math.exp(-dt*(ld0>AX.load?9:14)));
    // rpm position
    let rn;
    if(rev){ AX.revT+=((v>20?1:0)-AX.revT)*(1-Math.exp(-dt*7)); rn=.08+.62*AX.revT+(Math.random()-.5)*.03*(.4+AX.revT); st.g=0; }
    else { AX.revT=0; st.launch=ld0; rn=gearStep(st,pr,v,top,dt); }
    if(st.blip>0) rn+=.12*(st.blip/.16);
    if(air) rn+=.14;
    let rnE=rn; if(rn>1.0&&!pr.ev) rnE=.965+.035*(Math.sin(AX.frame*1.9)>0?1:0); // rev limiter bounce
    AX.rn+=(rnE-AX.rn)*(1-Math.exp(-dt/(rnE>AX.rn?.05:.1)));
    frac=AX.rn; let L=AX.load; if(st.shiftT>0) L*=.25; // torque cut mid-shift
    // forced induction and nitrous
    const bT=nosOn?1:AX.load*Math.pow(clamp(frac,0,1),1.2);
    AX.boost+=(bT-AX.boost)*(1-Math.exp(-dt/(bT>AX.boost?.55:.25)));
    AX.nos+=((nosOn?1:0)-AX.nos)*(1-Math.exp(-dt/(nosOn?.12:.35)));
    if(nosOn&&!AX.nosPrev&&!rev) sfx.nosOn(); else if(!nosOn&&AX.nosPrev&&!rev&&!pr.ev) sfx.bov(.8);
    AX.nosPrev=nosOn;
    // gearbox and exhaust events
    AX.popCd-=dt; AX.bovCd-=dt;
    if(st.shift){ if(st.shift>0){ sfx.clunk(.7);
        if(pr.pops&&AX.ld0>.5&&frac>.55&&AX.popCd<=0&&(AX.nos>.5||Math.random()<.4)){ AX.popCd=.22; sfx.pop(1); if(Math.random()<.5) setTimeout(()=>sfx.pop(.7),55); }
        if(pr.turbo&&AX.boost>.6&&AX.bovCd<=0&&Math.random()<.55){ AX.bovCd=.5; sfx.bov(AX.boost); } }
      else sfx.clunk(.45); st.shift=0; }
    if(pr.turbo&&AX.prevLd>.6&&ld0<.15&&AX.boost>.5&&AX.bovCd<=0){ AX.bovCd=.5; sfx.bov(AX.boost); }
    if(pr.pops&&ld0<.1&&frac>.5&&!rev&&AX.popCd<=0&&Math.random()<dt*(pr.layout==='v8'?5:2.6)){ AX.popCd=.12; sfx.pop(.55+frac*.5); } // overrun burble
    AX.prevLd=ld0;
    // pitch: idle lope, tiny drift; slow-motion finish drops the whole car in pitch
    const pk=.6+.4*slowmo, jit=1+(.012*(1-clamp(frac,0,1))*Math.sin(AX.frame*.31)+(Math.random()-.5)*.003);
    const rpm=(pr.idle+(pr.red-pr.idle)*clamp(frac,0,1.05))*jit*pk;
    lvl=.085*(.55+.45*L);
    engApply(E,{rpm,frac,load:L,boost:AX.boost,nos:AX.nos,v01:v/top,lvl},t,.03);
    w=clamp(v/120,0,1); lat=race&&!rev?clamp(r.lat||0,0,1):0; brk=race&&!rev&&r.brk>.2&&v>35?1:0;
    if(race&&!rev&&v>8){ const lim=TR.W-1.1; if(Math.abs(r.x)>lim-.15||r.hitCd>.22) scrT=clamp(v/50,.3,1); }
  } else { if(AX.wasLive) engApply(E,{rpm:900,frac:0,load:0,boost:0,nos:0,v01:0,lvl:0},t,.05); AX.nosPrev=false; AX.revT=0; }
  AX.wasLive=live&&!!r;
  AX.scr+=(scrT-AX.scr)*(1-Math.exp(-dt/(scrT>AX.scr?.03:.14)));
  AX.airS+=(air-AX.airS)*k;
  bedApply(B,{v01:v/90,w,wet:AX.wetS,lat,brk,scr:AX.scr,air:AX.airS,rain:AX.rain&&soundOn?1:0,gust:AX.gust,jit:Math.random()},t,.04);
  // --- spatial rivals and traffic ---
  axVoices(t,dt,race&&live);
  // --- mix: music sits a little lower under the engine at speed, and dips on impacts ---
  const eng=live&&race?clamp(.25+.75*clamp(v/100,0,1)+.25*AX.nos,0,1):0;
  AX.dEng+=(eng-AX.dEng)*(1-Math.exp(-dt*2));
  pset(musBus.gain,1-.24*AX.dEng-.4*AX.hitD,t,.12,.01); AX.hitD=Math.max(0,AX.hitD-dt*2.2);
  if(M&&M.level===2&&race&&live){ const cut=MT().levels[2].cut; if((AX.frame&3)===0) pf(M.arpF.frequency,cut*(.6+.9*clamp(v/100,0,1)),t,.5); } // filters open with speed, like the score's /afterhours/speed hook
  if(rvSend) pset(rvSend.gain,AX.tun&&race?.3:0,t,.25,.01);
  AX.spk=v;
}
// pick the nearest few cars and give them the voice pool; voices are re-pointed, never created or destroyed
function axVoices(t,dt,on){
  const V=AX.V;
  if(!on){ for(const q of V){ if(q.src){ q.src=null; q.freeAt=t+.1; pset(q.g.gain,0,t,.03); pset(q.gN.gain,0,t,.03); } } AX.camP=null; return; }
  const cp=cam.position, lt=cp.x, ly=cp.y, lz=cp.z;
  let cvx=0,cvy=0,cvz=0;
  if(AX.camP){ const dx=lt-AX.camP.x, dy=ly-AX.camP.y, dz=lz-AX.camP.z; if(dx*dx+dy*dy+dz*dz<900){ cvx=dx/dt; cvy=dy/dt; cvz=dz/dt; } } else AX.camP={x:0,y:0,z:0}; // a camera cut is not a doppler event
  AX.camP.x=lt; AX.camP.y=ly; AX.camP.z=lz;
  cam.getWorldDirection(AXF); AXU.set(0,1,0).applyQuaternion(cam.quaternion); AXR.crossVectors(AXF,AXU);
  const L=AC.listener;
  if(L.positionX){ L.positionX.value=lt; L.positionY.value=ly; L.positionZ.value=lz; L.forwardX.value=AXF.x; L.forwardY.value=AXF.y; L.forwardZ.value=AXF.z; L.upX.value=AXU.x; L.upY.value=AXU.y; L.upZ.value=AXU.z; }
  else if(L.setPosition){ L.setPosition(lt,ly,lz); L.setOrientation(AXF.x,AXF.y,AXF.z,AXU.x,AXU.y,AXU.z); }
  if((AX.pickN++%6)===0) axPick(t);
  AX.passCd-=dt;
  for(const q of V){
    if(!q.src){ pset(q.g.gain,0,t,.03); pset(q.gN.gain,0,t,.03); continue; }
    const s=q.src, g=s.m.group, p=g.position, isR=!s.tr;
    if(isR&&s.out){ q.src=null; q.freeAt=t+.1; continue; }
    let dx=p.x-lt, dy=p.y-ly, dz=p.z-lz; const d=Math.max(.5,Math.sqrt(dx*dx+dy*dy+dz*dz)); dx/=d; dy/=d; dz/=d;
    let vx=0,vy=0,vz=0; if(q.last){ vx=(p.x-q.last.x)/dt; vy=(p.y-q.last.y)/dt; vz=(p.z-q.last.z)/dt; if(vx*vx+vy*vy+vz*vz>160000){ vx=vy=vz=0; } } else q.last={x:0,y:0,z:0};
    q.last.x=p.x; q.last.y=p.y; q.last.z=p.z;
    const rx=vx-cvx, ry=vy-cvy, rz=vz-cvz, vrel=Math.sqrt(rx*rx+ry*ry+rz*rz), rad=rx*dx+ry*dy+rz*dz; // rad>0: moving apart
    const dopT=clamp(343/(343+rad),.65,1.5); q.dop+=((dopT===dopT?dopT:1)-q.dop)*(1-Math.exp(-dt/.05));
    // engine voice from the car's own speed and spec
    const pr=q.prof, top=Math.max((s.def&&s.def.top)||40,30)*1.25, sv=s.v||0;
    const acc=(sv-q.pv)/Math.max(dt,1e-3); q.pv=sv; q.ld+=((s.nosOn?1:clamp(.45+acc/24,0,1))-q.ld)*(1-Math.exp(-dt*5));
    const rn=gearStep(q.st,pr,sv,top,dt); q.rn+=(Math.min(rn,1)-q.rn)*(1-Math.exp(-dt/(rn>q.rn?.06:.12)));
    const fb=pr.ev?clamp(sv/top,0,1.3):0;
    const f=(pr.ev?140+1500*fb:(pr.idle+(pr.red-pr.idle)*q.rn)/120)*q.dop;
    pf(q.osc.frequency,f,t,.03);
    const base=isR?.4:.3; pset(q.g.gain,base*(.5+.5*q.ld)*(pr.ev?.7:1),t,.04);
    // air absorption with distance, and a muffled tone when the car is behind the camera (the chase view puts rivals both ways)
    const front=dx*AXF.x+dy*AXF.y+dz*AXF.z;
    pset(q.lp.frequency,clamp((1500+7500*(front*.5+.5))/(1+d/50),600,9000),t,.05,5);
    // tire and air whoosh scales with closing speed
    const wh=Math.pow(clamp((vrel-6)/55,0,1),1.3)*(isR?.55:.8);
    pset(q.gN.gain,wh*.5,t,.05); pset(q.nF.frequency,500+vrel*26,t,.05,5);
    axPos(q.pan,p.x,p.y+.5,p.z);
    // the pressure thump as a fast car passes close
    if(q.rad<-2&&rad>=-2&&d<10&&vrel>12&&AX.passCd<=0){ AX.passCd=.3; const pn=clamp((dx*AXR.x+dy*AXR.y+dz*AXR.z)*1.6,-.9,.9); sfx.pass(pn,clamp(vrel/55,.25,1)); }
    q.rad=rad;
  }
}
function axPick(t){
  const V=AX.V, cp=cam.position, MAXD=95*95, cand=[];
  const add=(s,bias)=>{ const p=s.m.group.position, dx=p.x-cp.x, dy=p.y-cp.y, dz=p.z-cp.z, d2=dx*dx+dy*dy+dz*dz; if(d2<MAXD) cand.push([d2-bias,s]); };
  for(const s of racers){ if(s===player||s.out||!s.m.group.visible) continue; add(s,300); }
  for(const s of traffic){ if(s.out||!s.m.group.visible) continue; add(s,0); }
  cand.sort((a,b)=>a[0]-b[0]); const want=cand.slice(0,AX.K).map(c=>c[1]);
  for(const q of V){ if(q.src&&want.indexOf(q.src)<0){ q.src=null; q.freeAt=t+.08; } }
  for(const s of want){ if(V.some(q=>q.src===s)) continue;
    const q=V.find(o=>!o.src&&o.freeAt<=t); if(!q) break;
    q.src=s; q.last=null; q.rad=0; q.dop=1; q.pv=s.v||0; q.st={g:0,shiftT:0,shift:0,blip:0}; q.rn=0; q.ld=.4;
    q.prof=s.tr?axTrafficProf:engProfile((s.def&&(s.def.chassisId||s.def.id))||'__none');
    q.osc.setPeriodicWave(axWave(AC,q.prof.layout,2)); }
}
if(DEV) window.AHDEV.audio={AX,sfx,go:()=>{ if(mode==='loading') startRace(); },engProfile,axWave,buildEngine,engSetProf,engApply,buildBeds,bedApply,gearStep,axNoise,state:()=>({ctx:AC&&AC.state,mode,nR:racers.length,nT:traffic.length,pick:AX.pickN,live:AX.on,fr:AX.frame-AX.stamp,near:racers.filter(s=>s!==player).map(s=>Math.round(s.m.group.position.distanceTo(cam.position))),gear:AX.st.g,rn:+AX.rn.toFixed(3),load:+AX.load.toFixed(2),boost:+AX.boost.toFixed(2),nos:+AX.nos.toFixed(2),cid:AX.cid,layout:AX.prof&&AX.prof.layout,voices:AX.V.map(q=>q.src?{id:(q.src.def&&q.src.def.id)||'traffic',dop:+q.dop.toFixed(3),rn:+q.rn.toFixed(2)}:null),errs:AX.errs,tun:AX.tun,rain:AX.rain})};

/* ---------------- MUSIC ---------------- */
// procedural night-drive synthwave in A minor, 16-bar form. menus get pads, arp and a soft melody;
// loading and the countdown build with a riser, and the full band drops on GO (bar 0 lands on the green light)
const MUS={
  bpm:112,
  // 8-bar cycle: Am F C G | Am F G E
  chords:[[45,[57,60,64]],[41,[57,60,65]],[48,[55,60,64]],[43,[55,59,62]],[45,[57,60,64]],[41,[57,60,65]],[43,[55,59,62]],[40,[56,59,64]]],
  arp:[0,1,2,3,4,3,2,1,0,2,3,5,4,2,1,2],
  // [step, midi, length in 16ths] per bar
  lead:[
    [[0,76,6],[6,74,2],[8,72,4],[12,69,4]], [[0,72,6],[6,74,2],[8,76,8]],
    [[0,79,6],[6,77,2],[8,76,4],[12,74,4]], [[0,74,12],[12,71,4]],
    [[0,76,4],[4,81,4],[8,79,4],[12,76,4]], [[0,77,6],[6,76,2],[8,72,8]],
    [[0,74,6],[6,76,2],[8,79,8]],            [[0,80,8],[8,76,4],[12,71,4]]],
  levels:[
    {out:.55,pad:.9,arp:.55,bass:.7,lead:.6,kit:0, hat:.6,cut:900},   // menus and results
    {out:.55,pad:.9,arp:.8, bass:.8,lead:0, kit:.7,hat:.9,cut:1800},  // loading and countdown
    {out:.42,pad:.6,arp:.75,bass:1, lead:1, kit:1, hat:1, cut:3200}]  // racing
};
// COLD SWITCH: original track in the style Paris asked for (124 BPM, B minor, icy half-time opening, then a beat
// switch). Bells, dark pads and an 808 carry the first part of the race; once the player passes switchAt of the
// race the drums cut out for half a bar under a riser, then a harder double-time groove with a gliding 808 takes over.
const ICE={
  bpm:124, switchAt:.35,
  // 4-bar cycle: Bm  G  Em  F#
  chords:[[47,[59,62,66]],[43,[59,62,67]],[40,[59,64,67]],[42,[58,61,66]]],
  // bell motif, [step, midi] per bar
  bells:[[[0,83],[3,86],[6,85],[10,81]], [[0,79],[3,81],[6,78],[12,74]], [[0,79],[3,83],[6,81],[10,76]], [[0,78],[4,82],[8,85],[12,82]]],
  arp:[0,1,2,1,3,2,1,2,0,1,2,4,3,2,1,2],
  kickB:[0,3,7,10], snareB:[4,12],
  levels:[
    {out:.5, pad:.9,arp:.4, bass:.7,lead:.8,kit:0, hat:.5,cut:800},   // menus and results
    {out:.5, pad:.9,arp:.5, bass:.8,lead:.8,kit:.7,hat:.8,cut:1400},  // loading and countdown
    {out:.44,pad:.7,arp:.75,bass:1, lead:1, kit:1, hat:1, cut:3000}]  // racing
};
const MUS_THEMES={ice:{name:'Cold Switch',def:ICE},night:{name:'Night Drive',def:MUS}};
let musTheme=MUS_THEMES[SAVE.musTheme]?SAVE.musTheme:'ice';
const MT=()=>MUS_THEMES[musTheme].def;
let M=null, musicOn=SAVE.musicOff?false:true;
const mf=m=>440*Math.pow(2,(m-69)/12);
function musicInit(ctx,dest){
  const sr=ctx.sampleRate, g=(v,to)=>{ const n=ctx.createGain(); n.gain.value=v; if(to) n.connect(to); return n; };
  const out=g(0,dest), duck=g(1,out);
  const rev=ctx.createConvolver(), len=sr*2.4|0, ir=ctx.createBuffer(2,len,sr);
  for(let c=0;c<2;c++){ const d=ir.getChannelData(c); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2); }
  rev.buffer=ir; rev.connect(g(.3,out));
  const dl=ctx.createDelay(1.5), dlF=ctx.createBiquadFilter(), fb=g(.34);
  dl.delayTime.value=60/MT().bpm*.75; dlF.type='lowpass'; dlF.frequency.value=2400;
  dl.connect(dlF); dlF.connect(fb); fb.connect(dl); dlF.connect(g(.26,duck));
  const L={}; ['pad','arp','bass','lead','kit','hat'].forEach(k=>{ L[k]=g(0,k==='kit'||k==='hat'?out:duck); });
  L.pad.connect(rev); L.lead.connect(rev); L.lead.connect(dl); L.arp.connect(dl);
  const arpF=ctx.createBiquadFilter(); arpF.type='lowpass'; arpF.frequency.value=900; arpF.Q.value=4; arpF.connect(L.arp);
  const nb=ctx.createBuffer(1,sr,sr), w=nb.getChannelData(0); for(let i=0;i<w.length;i++) w[i]=Math.random()*2-1;
  M={ctx,out,duck,L,arpF,nb,dl,step:0,bar:0,nextT:0,level:-1,vol:-1,cd:false,sw:0};
}
function mVoice(t,midi,dur,vol,types,to,o){
  const c=M.ctx, g=c.createGain(), f=c.createBiquadFilter(), a=o.atk||.005, r=o.rel||.08, end=t+Math.max(dur,a+.01);
  f.type='lowpass'; f.Q.value=o.q||.8; f.frequency.setValueAtTime(o.cut||4000,t);
  if(o.cutEnd) f.frequency.exponentialRampToValueAtTime(o.cutEnd,end);
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+a); g.gain.linearRampToValueAtTime(vol*(o.sus||1),end); g.gain.linearRampToValueAtTime(0,end+r);
  f.connect(g); g.connect(to);
  (o.dets||[0]).forEach((d,i)=>{ const os=c.createOscillator(); os.type=types[i%types.length]; os.frequency.value=mf(midi); os.detune.value=d;
    os.connect(f); os.start(t); os.stop(end+r+.05); });
}
function mNoise(t,dur,type,f0,f1,vol,q,to,atk){
  const c=M.ctx, n=c.createBufferSource(), f=c.createBiquadFilter(), g=c.createGain();
  n.buffer=M.nb; n.loop=true; f.type=type; f.Q.value=q; f.frequency.setValueAtTime(f0,t); f.frequency.exponentialRampToValueAtTime(f1,t+dur);
  g.gain.setValueAtTime(atk?.0001:vol,t); if(atk) g.gain.exponentialRampToValueAtTime(vol,t+atk); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  n.connect(f); f.connect(g); g.connect(to); n.start(t); n.stop(t+dur+.02);
}
const mDrum={
  kick(t,v){ const c=M.ctx, o=c.createOscillator(), g=c.createGain();
    o.frequency.setValueAtTime(165,t); o.frequency.exponentialRampToValueAtTime(42,t+.12);
    g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.001,t+.4);
    o.connect(g); g.connect(M.L.kit); o.start(t); o.stop(t+.42);
    mNoise(t,.015,'highpass',3000,3000,v*.25,.7,M.L.kit);
    M.duck.gain.setValueAtTime(.35,t); M.duck.gain.linearRampToValueAtTime(1,t+.24); },
  snare(t,v){ mNoise(t,.22,'bandpass',1900,1400,v,.7,M.L.kit);
    const c=M.ctx, o=c.createOscillator(), g=c.createGain(); o.type='triangle';
    o.frequency.setValueAtTime(200,t); o.frequency.exponentialRampToValueAtTime(150,t+.1);
    g.gain.setValueAtTime(v*.6,t); g.gain.exponentialRampToValueAtTime(.001,t+.12); o.connect(g); g.connect(M.L.kit); o.start(t); o.stop(t+.14); },
  hat(t,v,open){ mNoise(t,open?.16:.04,'highpass',7200,9000,v,.9,M.L.hat); },
  crash(t){ mNoise(t,1.8,'highpass',4200,2600,.14,.5,M.L.hat); },
  riser(t,d){ mNoise(t,d,'bandpass',300,5200,.16,2.2,M.L.hat,d*.9); }
};
function musicWanted(){
  if(mode==='race') return countdown>0?1:2;
  if(mode==='highlight') return 2;
  return mode==='loading'?1:0;
}
function mSetLevel(lv,t){
  const P=MT().levels[lv];
  Object.keys(M.L).forEach(k=>M.L[k].gain.setTargetAtTime(P[k],t,lv===2?.02:.6));
  M.arpF.frequency.setTargetAtTime(P.cut,t,lv===2?.05:.8);
  if(lv===2&&M.level!==2){ M.step=0; M.bar=0; M.sw=0; mDrum.crash(t); mDrum.kick(t,.9); }
  if(lv!==2) M.sw=0;
  M.level=lv;
}
// switch the track from the top bar; the new tempo takes over on the next step
function setMusicTheme(id){
  if(!MUS_THEMES[id]) return; musTheme=id; SAVE.musTheme=id; persist();
  if(M){ const t=M.ctx.currentTime; M.dl.delayTime.setTargetAtTime(60/MT().bpm*.75,t,.1); M.step=0; M.bar=0; M.sw=0; const lv=M.level; M.level=-1; if(lv>=0) mSetLevel(lv,t); }
}
function mStep(t){
  if(musTheme==='ice') return mStepIce(t);
  const s=M.step%16, bar=M.bar%16, ch=MUS.chords[bar%8], root=ch[0], pad=ch[1], lv=M.level, sp=60/MUS.bpm/4;
  if(s===0) pad.forEach(n=>mVoice(t,n,sp*16,.045,['sawtooth'],M.L.pad,{dets:[-10,10],atk:.5,rel:.9,cut:lv===2?1500:900,q:.6}));
  const tones=pad.map(n=>n+12).concat(pad.map(n=>n+24));
  mVoice(t,tones[MUS.arp[s]],sp*.9,.05,['square'],M.arpF,{rel:.05,cut:8000});
  if(lv>=1){
    if(lv===2||s%2===0) mVoice(t,root+(s%4===2?12:0),sp*.85,s%4===0?.09:.13,['sawtooth','square'],M.L.bass,{dets:[0,-6],cut:1100,cutEnd:220,q:3,rel:.03});
  } else if(s===0||s===8||s===14){
    mVoice(t,root+(s===14?12:0),sp*(s===0?8:s===8?6:2),.12,['sawtooth','sine'],M.L.bass,{dets:[0,0],cut:500,atk:.02,rel:.2,sus:.6});
  }
  if(lv===2){
    if(s%4===0) mDrum.kick(t,.85);
    if(s===4||s===12) mDrum.snare(t,.32);
    if(bar===15&&s>=8&&s!==12) mDrum.snare(t,.06+(s-8)*.025);
    mDrum.hat(t,s%4===2?.09:.035,s%4===2);
  } else if(s%4===2) mDrum.hat(t,.04,lv===1);
  if(bar>=8&&lv!==1) MUS.lead[bar%8].forEach(([st,n,len])=>{ if(st!==s) return;
    if(lv===2) mVoice(t,n,sp*len,.05,['sawtooth'],M.L.lead,{dets:[-8,8],atk:.02,rel:.3,cut:3400,cutEnd:1500,q:1.5,sus:.8});
    else mVoice(t,n-12,sp*len,.07,['triangle'],M.L.lead,{atk:.03,rel:.5,cut:2200,sus:.7}); });
  M.step++; if(M.step%16===0) M.bar++;
}
// 808: sine body plus a quiet triangle an octave up so it still reads on phone speakers; optional glide to another note
function m808(t,midi,dur,vol,glide){
  const c=M.ctx, o=c.createOscillator(), o2=c.createOscillator(), g=c.createGain(), g2=c.createGain(), f=c.createBiquadFilter(), end=t+dur;
  o.type='sine'; o2.type='triangle'; o.frequency.setValueAtTime(mf(midi),t); o2.frequency.setValueAtTime(mf(midi+12),t);
  if(glide){ [[o,0],[o2,12]].forEach(([os,up])=>{ os.frequency.setValueAtTime(mf(midi+up),t+dur*.45); os.frequency.exponentialRampToValueAtTime(mf(glide+up),t+dur*.8); }); }
  f.type='lowpass'; f.frequency.value=900; g2.gain.value=.18;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.004); g.gain.setTargetAtTime(vol*.55,t+.05,.25);
  g.gain.setValueAtTime(vol*.5,end); g.gain.linearRampToValueAtTime(0,end+.08);
  o.connect(g); o2.connect(g2); g2.connect(g); g.connect(f); f.connect(M.L.bass);
  o.start(t); o2.start(t); o.stop(end+.12); o2.stop(end+.12);
}
function mClap(t,v){ [0,.011,.023].forEach((d,i)=>mNoise(t+d,i<2?.03:.18,'bandpass',1300,1000,v*(i<2?.7:1),1.1,M.L.kit)); }
const ICE_KICK_LEN={0:3,3:4,7:3,10:6};
function mStepIce(t){
  const s=M.step%16, bar=M.bar, ch=ICE.chords[bar%4], root=ch[0], pad=ch[1], lv=M.level, sp=60/ICE.bpm/4;
  // the beat switch follows race progress: drums drop for half a bar under a riser, the new groove lands on the bar
  const prog=(mode==='race'&&player&&TR&&TR.L&&countdown<=0)?clamp(player.dist/(laps()*TR.L),0,1):0;
  if(lv===2&&M.sw===0&&s===8&&prog>=ICE.switchAt){ M.sw=1; mDrum.riser(t,sp*8); }
  if(s===0&&M.sw===1){ M.sw=2; mDrum.crash(t); }
  const hot=M.sw===2, drop=M.sw===1;
  if(s===0) pad.forEach(n=>mVoice(t,n,sp*16,.04,['sawtooth'],M.L.pad,{dets:[-12,12],atk:hot?.08:.7,rel:1.1,cut:hot?2000:lv===2?1100:750,q:.6}));
  // bell motif with a quiet partial above it for the icy shimmer
  if(!drop) ICE.bells[bar%4].forEach(([st,n])=>{ if(st!==s) return; const v=lv===2?.05:.04;
    mVoice(t,n,sp*3,v,['sine'],M.L.lead,{atk:.003,rel:.7,sus:.2,cut:6000});
    mVoice(t,n+19,sp*1.5,v*.3,['sine'],M.L.lead,{atk:.002,rel:.4,sus:.1,cut:9000}); });
  if(hot){ const tones=pad.map(n=>n+12).concat(pad.map(n=>n+24));
    mVoice(t,tones[ICE.arp[s]],sp*.8,.045,['square','sawtooth'],M.arpF,{dets:[0,5],rel:.04,cut:7000}); }
  else if(lv>=1&&s%4===2) mVoice(t,pad[(s>>2)%3]+24,sp*2,.03,['triangle'],M.arpF,{atk:.01,rel:.3,cut:5000});
  if(!drop){
    if(hot){
      if(ICE_KICK_LEN[s]){ mDrum.kick(t,.9); m808(t,root,sp*ICE_KICK_LEN[s],.32,s===10&&bar%2===1?root+12:0); }
      if(ICE.snareB.includes(s)){ mDrum.snare(t,.28); mClap(t,.3); }
      mDrum.hat(t,s%2?.035:.07,false);
      if(s===6) mDrum.hat(t,.06,true);
      if(s>=14&&bar%2===1){ mDrum.hat(t+sp/3,.04,false); mDrum.hat(t+sp*2/3,.05,false); }
      if(bar%8===7&&s>=12) mDrum.snare(t,.05+(s-12)*.03);
    } else if(lv===2){
      if(s===0||s===10) mDrum.kick(t,.8);
      if(s===0) m808(t,root,sp*9,.3,0);
      if(s===10) m808(t,root,sp*5,.24,bar%4===3?root-2:0);
      if(s===8){ mDrum.snare(t,.24); mClap(t,.22); }
      if(s%2===0) mDrum.hat(t,s%4===0?.05:.03,false);
      if(s===14&&bar%2===1){ mDrum.hat(t+sp/2,.035,false); mDrum.hat(t+sp,.03,false); }
    } else {
      if(s===0) m808(t,root,sp*12,lv===1?.22:.16,0);
      if(lv===1&&s%4===2) mDrum.hat(t,.035,false);
    }
  }
  M.step++; if(M.step%16===0) M.bar++;
}
function musicTick(){
  if(!M) return; const now=M.ctx.currentTime, sp=60/MT().bpm/4;
  const vol=soundOn&&musicOn&&!document.hidden?MT().levels[Math.max(M.level,0)].out:0;
  if(vol!==M.vol){ M.out.gain.setTargetAtTime(vol,now,.3); M.vol=vol; }
  if(M.nextT<now) M.nextT=now+.05;
  while(M.nextT<now+.12){
    const lv=musicWanted(), cd=mode==='race'&&countdown>0;
    if(lv!==M.level) mSetLevel(lv,M.nextT);
    if(cd&&!M.cd) mDrum.riser(M.nextT,Math.max(countdown-.1,.5));
    M.cd=cd; mStep(M.nextT); M.nextT+=sp;
  }
}

/* ---------------- RACERS ---------------- */
let racers=[], player=null;
const F=mkF(), F2=mkF(), tmpV=new THREE.Vector3(), headV=new THREE.Vector3(), leftV=new THREE.Vector3(), upV=new THREE.Vector3(), mat=new THREE.Matrix4();
function clearRacers(){ racers.forEach(r=>{ r.scene.remove(r.m.group); if(r.trail) r.scene.remove(r.trail.mesh); r.m.group.traverse(o=>{ if(o.geometry&&!o.isSprite&&!o.geometry.userData.shared) o.geometry.dispose(); }); }); racers=[]; } // GLB car geometry is shared and cached: keep it on the GPU between races
function addRacer(def,isP,dist,x,skill){
  const m=buildCar(def,isP?undefined:{lod:true}); /* rivals get the light GLB twin (see glbParts) */ RS.add(m.group); const rig=rigLights(m.group,BODIES[def.body||'wedge'],false,carNitroColor(def)), trail=makeTrail(); RS.add(trail.mesh);
  if(isP){ const h=hist(def.id); m.paint.roughness=clamp(def.rough+h.hits*.004,0,.6); }
  const r={def,m,scene:RS,isP,dist,x,vx:0,v:0,steer:0,nitro:1,hitCd:0,slip:0,yaw:0,bumpT:0,finished:false,finishT:0,laps:[],lapStart:0,hits:0,top:0,skill:skill||1,off:(Math.random()-.5)*3,wob:Math.random()*10,draft:0,burst:0,lit:false,fxLong:0,fxOver:0,fxSling:0,fxShield:0,fxGrip:0,fxRegen:0,fxNosMul:0,towT:0,fxName:{},mass:(def.P&&def.P.mass)||def.mass||1,startDelay:def.P?(def.P.start<0?Math.random()*.55:def.P.start):0,grudge:{}};
  if(def.P) r.label=addLabel(m.group,def.tag,def.color);
  r.rig=rig; r.trail=trail;
  r.bubble=new THREE.Mesh(shieldGeo,shieldMat); r.bubble.position.y=.8; r.bubble.visible=false; m.group.add(r.bubble);
  racers.push(r); return r;
}
let personaT=0, boardT=0;
function standings(){ if(EV.knockout){ const on=racers.filter(r=>!r.out).sort((a,b)=>b.dist-a.dist), off=racers.filter(r=>r.out).sort((a,b)=>b.outAt-a.outAt); return on.concat(off); }
  return racers.slice().sort((a,b)=>(b.finished?1e9-b.finishT:b.dist)-(a.finished?1e9-a.finishT:a.dist)); }
function persona(r,msg,force){ if(mode!=='race'||raceT<2) return; if(TAG&&player&&r.team===player.team) return; if(!force&&((r.tc||0)>raceT||personaT>raceT)) return; r.tc=raceT+11; personaT=raceT+3; toast(msg); }
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
  bruiser:{temper:1,bank:.15,defend:.6},closer:{temper:.6,bank:.6,defend:.5},wild:{temper:1.1,bank:.05,defend:.2},
  grudge:{temper:1,bank:.2,defend:.3},hunter:{temper:.85,bank:.3,defend:.4},rabbit:{temper:.4,bank:.5,defend:.7},weaver:{temper:.6,bank:.3,defend:.3}};
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
  const near=racers.filter(o=>o!==r&&!o.finished&&!o.out&&o.dist-r.dist>-8&&o.dist-r.dist<45).length;
  switch(p.type){
    case 'shock': v+=near?(M.mood==='attack'||M.mood==='allin'?9:4):-6; break;
    case 'sling': case 'over': v+=D*5+(M.mood==='attack'?3:0); break;
    case 'shield': v+=M.mood==='defend'?6:(M.mood==='lead'&&M.gapB<1.6?4:0); break;
    case 'grip': v+=Math.abs(kAhead(r.dist+dd,40))>.006?3:0; break;
    case 'refill': v+=r.nitro<.3&&(M.mood==='allin'||M.mood==='attack'||M.mood==='push')?5:0; break;
    case 'long': v+=M.mood==='lead'||M.mood==='defend'?3:0; break;
    case 'jam': v+=near?(M.mood==='attack'||M.mood==='allin'?7:3):-5; if(r.def.id==='hunter'||r.def.id==='grudge') v+=4; break;
    case 'slick': v+=M.mood==='defend'?8:(M.gapB<1.2?4:-3); if(r.def.id==='wall'||r.def.id==='rabbit') v+=3; break;
    case 'payback': v+=(r.stung>0?8:1); if(r.def.id==='grudge') v+=5; else if(r.def.id==='bruiser') v+=3; break;
    case 'ghost': { let n=0; for(const t of traffic){ const g=t.dist-r.dist; if(g>0&&g<110) n++; } v+=n>3?6:-2; if(r.def.id==='weaver') v+=4; break; } }
  const nA=EV.knockout?koActive().length:racers.length, br=M.place<=2?'front':(M.place>=nA-1?'chase':'pack');
  if(br==='chase'){ if(p.type==='shock') v+=10; if(p.type==='sling') v+=5; if(p.type==='refill') v+=3; }   // lightning, catapult, overflow
  else if(br==='front'){ if(p.type==='shock') v+=M.gapB<1.2?6:-4; if(p.type==='shield') v+=3; }           // wake, rear guard
  if(M.mood==='lead'&&p.type!=='shield') v-=3;          // leaders don't wander off the line
  return v;
}
const VCAP=190; // hard ceiling, ~425 mph: stacked boosts can't run away past what the sim and camera handle
function stepRacer(r,dt,inp){
  const d=r.def, W=TR.W, L=TR.L, G=d.grip*(r.fxGrip>0?(r.gripMul||1.45):1)*(EV.knockout&&KO?KO.gripMul:1)*levelGrip(r), shielded=(r.fxShield>0&&r.shieldMode!=='rear')||(r.fxGrip>0&&r.railsWall);
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
        if(tgt){ tx=tgt.x; gain=.4; if(gapP<10&&r.nitro>.2) wantN=true;
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
        if(Math.random()<.36*dt) r.burst=1.2+Math.random();
        if(pl&&gapP>-14&&gapP<0) persona(r,`${d.tag} is coming up the outside.`);
        break;
      case 'grudge': { // remembers whoever just passed it, then runs that car down and leans on it
        if(r.stung>2&&r.stungBy&&!r.stungBy.finished) r.grudge=r.stungBy;
        const g=r.grudge;
        if(g&&!g.finished){ const gap=g.dist-r.dist;
          if(gap<-8){ if(g===pl) persona(r,`${d.tag} got even with you.`,true); r.grudge=null; }
          else if(gap<60){ tx=g.x; gain=.58; chasing=g; if(gap<45&&r.nitro>.1) wantN=true;
            if(g===pl) persona(r,`${d.tag} is coming for you.`); } }
        break; }
      case 'hunter': { // always goes after whoever is leading: trails it, then pulls out alongside
        const lead=leaderOf(r);
        if(lead){ const gap=lead.dist-r.dist;
          if(gap<110){ if(gap<90&&r.nitro>.05) wantN=true;
            if(gap<45){ tx=gap<14?lead.x+(lead.x>0?-3.2:3.2):lead.x; gain=.46; chasing=lead;
              if(lead===pl) persona(r,`${d.tag} has locked onto you.`); } } }
        break; }
      case 'rabbit': { // bolts early to build a gap, then fades so the pack can reel it in
        const prog=r.dist/(laps()*TR.L);
        if(prog<.3){ vF=1.065; wantN=Math.abs(ka)<.004; }
        else if(prog>.6) vF=.975;
        break; }
      case 'weaver': { // threads the clearest lane through traffic and slower cars
        if(!(r.fxGhost>0)){
          const obs=traffic.concat(racers.filter(o=>o!==r&&!o.finished));
          const lane=pickClearLane([-5.2,-2.6,0,2.6,5.2].map(x=>clamp(x,-W+1.6,W-1.6)),obs,((r.dist%L)+L)%L,L,70,r.x);
          tx=lerp(tx,lane,.8); gain=.5; vF=1.02;
          if(pl&&gapP<0&&gapP>-12&&Math.random()<.006) persona(r,`${d.tag} is threading through.`); }
        break; }
      case 'apex': // pure line; takes the inside when it's reeling you in
        if(pl&&gapP<0&&gapP>-16&&Math.abs(kn)>.002){ tx=clamp(line*1.3,-5.2,5.2); persona(r,`${d.tag} is diving to the inside.`); }
        break;
    }
    // tag team: tuck in behind your teammate for the team draft, or hold a line it can tuck in behind
    if(TAG&&racing&&r.mateR&&!r.mateR.finished){ const m=r.mateR, g=m.dist-r.dist; if(g>4&&g<40) tx=lerp(tx,m.x,.55); else if(g<-4&&g>-30) tx=lerp(tx,m.x,.3); }
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
    for(const o of racers.concat(traffic)){ if(o===r||o===chasing||(o.tr&&r.fxGhost>0)) continue; const dd=o.dist-r.dist, dx=o.x-r.x;
      if(dd>0&&dd<(o.tr?26:15*(1-.45*D))&&Math.abs(dx)<2.8&&(o.tr||dd<puDD)){ tx=o.x+(o.x>0?-3.4:3.4); } }  // a pickup closer than the car ahead wins
    for(const h of slicks){ if(h.owner===r) continue; const dd=(((h.s-r.dist)%L)+L)%L;   // steer around oil
      if(dd<22&&Math.abs(h.x-r.x)<2.9) tx=h.x+(h.x>0?-3.4:3.4); }
    let xCap; if(EV.pads||EV.pillars||EV.crossing){ const lv=levelAI(r,tx); tx=lv.tx; xCap=lv.vCap; }
    let rubber=1; if(pl) rubber=1+clamp((pl.dist-r.dist)/420,-.08,.1)*P.rubber;
    const corner=aiCornerPlan(r,d,P,ka,turnHint,evB,rubber,vF,G,M);
    if(corner.inApproach&&corner.lineShift) tx+=corner.lineShift;
    tx=clamp(tx,-W+1.4,W-1.4);
    const ac=r.v*r.v*k*.5;
    steer=clamp(-ac/G+(tx-r.x)*gain-r.vx*.14+bias,-1,1);
    brakeAmt=corner.brake;
    if(xCap!==undefined&&r.v>xCap) brakeAmt=Math.max(brakeAmt,clamp((r.v-xCap)/10,.35,1));
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
  // digital steering: build lock at a steady rate, but let go and counter-steer quicker so corrections feel crisp
  r.steer=inp?lerp(r.steer,steer,1-Math.exp(-dt*(Math.abs(steer)<Math.abs(r.steer)||steer*r.steer<0?16:10))):steer;
  if(d.noBoost||r.fxJam>0) nitro=false;
  const cap=d.vcap||VCAP;
  const nosVmax=d.nosVmax||1.22, nosV=nitro?nosVmax*(r.fxWisp>0?1.1:1):1;
  let vmax0=d.top*(r.koTop||1)*(EV.knockout&&KO&&!KO.done?KO.topMul:1)*nosV*(r.fxOver>0?(r.overMul||1.14):1)*(r.fxSling>0?1.3:1);
  // outlaw ceilings: a storm window (own gem), running last, or a long clean streak
  let surge=0;
  if(r.fxTempest>0){ vmax0=Math.max(vmax0,d.sigTop); surge=55; }
  if(d.lastTop&&mode==='race'&&raceT>(r.startDelay||0)+3&&!r.finished){
    if(racers.every(o=>o===r||o.out||o.dist>r.dist)){ if(!(r.mantisT>0)&&r.isP) toast('MANTIS LT. Unleashed.'); r.mantisT=2.5; }
    if(r.mantisT>0){ vmax0=Math.max(vmax0,d.lastTop); surge=Math.max(surge,24); } }
  if(d.cleanTop){
    if(r.hits!==r._hits||brakeAmt>.3){ if(r.isP&&r.clean>12) toast('AUTOBAHN 63. Clean streak broken.'); r.clean=0; r._hits=r.hits; }
    else if(mode==="race"&&raceT>(r.startDelay||0)) r.clean=(r.clean||0)+dt;
    const cp=Math.pow(clamp(((r.clean||0)-4)/40,0,1),1.3);
    if(cp>0){ vmax0=Math.max(vmax0,lerp(d.top,d.cleanTop,cp)); surge=Math.max(surge,16*cp); }
    if(cp>=1&&!r.unres&&r.isP){ r.unres=true; toast('AUTOBAHN 63. Unrestricted.'); } if(cp<1) r.unres=false; }
  const vmax=Math.min(cap,vmax0);
  let a=d.acc*Math.pow(Math.max(0,1-r.v/vmax),d.accCurve||1); if(r.v>vmax) a=r.v>cap?-60:-10;
  if(surge&&r.v<vmax) a+=surge*(1-r.v/vmax);
  const nosAcc=(d.nosAccMul||1)*(r.fxNosMul>0?1.35:1)*(r.fxWisp>0?1.12:1);
  if(nitro) a+=14*d.nitro*nosAcc;
  if(r.fxOver>0) a+=5+(r.overAcc||0);
  if(r.towT>0&&r.towTarget){ const g=r.towTarget.dist-r.dist; if(g>8&&g<220) a+=16; else r.towT=0; }
  if(r.fxSling>0) a+=22;
  if(TAG&&r.mateR&&!r.mateR.finished&&!r.finished){ const m=r.mateR, g=m.dist-r.dist; // teammates pull each other along
    if(g>3&&g<26&&Math.abs(m.x-r.x)<2.2){ r.draft=Math.max(r.draft,6.5); r.nitro=Math.min(Math.max(1,r.nitro),r.nitro+.1*dt); r.teamDraft=raceT+.3; } }
  if(r.draft>0){ a+=r.draft; r.draft=0; }
  if(brakeAmt>0) a=-40*brakeAmt;
  if(r.airT>.08) a=Math.min(a,0)*.15; // nothing to push against in the air
  else if(EV.slopeG) a-=9.81*F.t.y*EV.slopeG;
  if(mode==='race'&&raceT<r.startDelay) a=0;
  r.v=clamp(r.v+a*dt,0,cap+2);
  if(nitro) r.nitro=Math.max(0,r.nitro-.3*dt*(d.nosDrainMul||1)*(r.fxLong>0?(r.drainMul!==undefined?r.drainMul:.35):1));
  else if(r.nitro>1) r.nitro=Math.max(1,r.nitro-.015*dt);
  r.nosOn=nitro;
  ['fxLong','fxOver','fxSling','fxShield','fxGrip','fxRegen','fxNosMul','fxWisp','fxEcho','towT','fxTempest','mantisT','fxJam','fxGhost'].forEach(k=>{ if(r[k]>0) r[k]-=dt; });
  const ac=r.v*r.v*k*.5;
  const latDamp=inp?2.7:3.2, vSteer=inp?17:18, steerMul=inp?1.05:1;
  const sa=r.steer*G*Math.min(1,r.v/vSteer)*steerMul;
  r.vx+=(sa+ac-r.vx*latDamp)*dt;
  r.x+=r.vx*dt;
  r.lat=clamp((Math.abs(ac)-G*.72)/(G*.4),0,1)*(r.v>30?1:0); r.brk=brakeAmt;
  r.slip=r.lat + (brake&&r.v>35?.6:0);
  if(r.fxGrip>0&&r.noScrub) r.slip*=.3;
  const regenMul=d.nitroRegenMul!==undefined?d.nitroRegenMul:1;
  const regen=r.noRegen&&r.fxOver>0?0:(.035+r.slip*.12)*dt*(r.isP?1:1.2)*(r.fxRegen>0?2.5:1)*regenMul*(koMod('nitro')?2:1);
  r.nitro=d.noBoost?0:Math.min(Math.max(1,r.nitro),r.nitro+regen);
  const lim=W-1.1; r.hitCd-=dt;
  if(Math.abs(r.x)>lim){ const sd=Math.sign(r.x); r.x=sd*lim;
    if(r.hitCd<=0&&Math.abs(r.vx)>3){ if(!shielded){ r.v*=1-clamp(Math.abs(r.vx)/60,.04,.12); r.hits++; } r.hitCd=.35; // a glancing scrape costs less than a square hit
      if(r.isP){ shake=shielded?.25:.7; sfx.hit(); }
      tmpV.copy(F.p).addScaledVector(F.r,r.x+sd*1); tmpV.y+=.4; emitSparks(tmpV,F.t,26,r.v*.25); }
    else if(Math.random()<.5){ tmpV.copy(F.p).addScaledVector(F.r,r.x+sd*1); tmpV.y+=.4; emitSparks(tmpV,F.t,2,r.v*.2); if(!shielded) r.v*=1-.25*dt; }
    r.vx*=-.3; }
  const prevDist=r.dist, prevLap=Math.floor(r.dist/L);
  r.dist+=r.v*dt/Math.max(.6,1+r.x*k);
  checkRoadHazards(r,prevDist);
  if(EV.airtime) airStep(r,dt);
  if(EV.pads||EV.surf||EV.pillars||EV.crossing) levelPhysics(r,prevDist);
  r.top=Math.max(r.top,r.v);
  checkPickups(r);
  const lap=Math.floor(r.dist/L);
  if(lap>prevLap&&lap>=1&&mode==='race'){ r.laps.push(raceT-r.lapStart); r.lapStart=raceT;
    if(r.isP&&lap<laps()&&!EV.knockout) toast(`Lap ${lap+1}. ${fmt(r.laps[r.laps.length-1])}`); }
  if(!r.finished&&r.dist>=laps()*L&&mode==='race'){ r.finished=true; r.finishT=raceT; }
  if(r.isP&&mode==='race'&&EV.cams.length&&!r.finished){ const a0=((prevDist%L)+L)%L, b0=((r.dist%L)+L)%L;
    EV.cams.forEach(c=>{ const crossed=a0<=b0?(a0<c.s&&c.s<=b0):(a0<c.s||c.s<=b0); if(crossed&&r.v>44.7){ camFlashes++; flash(.55); sfx.shutter(); toast(`Speed camera. ${Math.round(r.v*2.237)} mph.`); } }); }
}
function stepTraffic(o,dt){ frame(o.dist,F); if(EV.crossing&&!o.out) holdTraffic(o); o.dist+=o.v*dt/Math.max(.6,1+o.x*F.k); o.hitCd-=dt; }
function collide(){
  const all=racers.concat(traffic);
  for(let i=0;i<all.length;i++) for(let j=i+1;j<all.length;j++){
    const a=all[i],b=all[j]; if(a.tr&&b.tr) continue; if(a.out||b.out) continue; if(!a.tr&&!b.tr&&koMod('ghost')) continue;
    let dd=a.dist-b.dist; const L=TR.L; dd=((dd%L)+L*1.5)%L-L*.5;
    const dx=a.x-b.x;
    if(Math.abs(dd)<4.5&&Math.abs(dx)<2.05){
      if((a.tr||b.tr)&&(a.tr?b:a).fxGhost>0) continue;   // Ghost Lane: traffic passes straight through
      if(a.tr||b.tr){ const car=a.tr?b:a, t=a.tr?a:b, ddx=car.x-t.x, sgn=ddx>=0?1:-1;
        car.x=t.x+sgn*2.06; car.vx=sgn*4; const behind=((car.dist-t.dist)%L+L*1.5)%L-L*.5<0;
        if(shieldVs(car,t)) t.v=Math.max(t.v,car.v*.6); else if(behind) car.v=Math.min(car.v,t.v*.85+1); else car.v*=.97;
        if(car.hitCd<=0){ car.hitCd=.45; frame(t.dist,F); tmpV.copy(F.p).addScaledVector(F.r,(car.x+t.x)/2); tmpV.y+=.6; emitSparks(tmpV,F.t,34,car.v*.3);
          if(car.isP){ if(!shieldVs(car,t)) car.hits++; shake=shieldVs(car,t)?.3:1; sfx.hit(shieldVs(car,t)?.6:clamp(car.v/45,.6,1.3),clamp((t.x-car.x)*.35,-.8,.8)); setTimeout(()=>sfx.horn(),120); } }
        continue; }
      const ov=(2.05-Math.abs(dx))*(dx>=0?1:-1), ma=(a.mass||1)*(shieldVs(a,b)?(a.shieldMass||4):1), mb=(b.mass||1)*(shieldVs(b,a)?(b.shieldMass||4):1); a.x+=ov*mb/(ma+mb); b.x-=ov*ma/(ma+mb);
      const t=a.vx, sg=Math.sign(dx||1); a.vx=b.vx*.6+sg*2*mb/ma*1.4; b.vx=t*.6-sg*2*ma/mb*1.4;
      const back=dd<0?a:b, fore=back===a?b:a; if(!shieldVs(back,fore)) back.v*=.985;
      if(back.fxShield>0&&back.shieldMode==='ram'&&!(fore.fxShield>0)&&(back.ramCd||0)<=raceT){ back.ramCd=raceT+.8; fore.v*=.8; back.v=Math.max(back.v,fore.v/.8+2);
        frame(fore.dist,F); tmpV.copy(F.p).addScaledVector(F.r,fore.x); tmpV.y+=.5; emitSparks(tmpV,F.t,40,back.v*.3);
        if(fore.isP){ toast(`Rammed by ${back.def.tag}. It took your speed.`); shake=1; } else if(back.isP) toast(`Rammed ${fore.def.tag}. Speed stolen.`); }
      if((a.isP||b.isP)&&(a.hitCd<=0)){ a.hitCd=.3; b.hitCd=.3; sfx.hit(clamp((a.isP?a:b).v/70,.4,1),clamp(((a.isP?b:a).x-(a.isP?a:b).x)*.35,-.8,.8)); shake=.5;
        frame((a.dist+b.dist)/2,F); tmpV.copy(F.p).addScaledVector(F.r,(a.x+b.x)/2); tmpV.y+=.5; emitSparks(tmpV,F.t,30,a.v*.3); if(a.isP&&!shieldVs(a,b)) a.hits++; if(b.isP&&!shieldVs(b,a)) b.hits++; }
      if(!a.tr&&!b.tr&&raceT<9&&raceT>0&&raceTape&&!raceTape.battle){ raceTape.battle=true; tapeLog('battle',{a:a.def.tag,b:b.def.tag}); }
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
  skidStep(r,BODIES[r.def.body||'wedge']);
  if(EV.airtime&&r.hy!==undefined){ r.m.group.position.y=r.hy; if(r.airT>0) r.m.group.rotateX(-clamp(r.vy/Math.max(r.v,10),-.35,.35)*.6); }
  // weight transfer: the body squats under power and dives under braking (smoothed so hits don't snap it)
  if(dt>0){ const la=(r.v-(r.pv===undefined?r.v:r.pv))/dt; r.accS=lerp(r.accS||0,clamp(la,-45,35),1-Math.exp(-dt*7)); if(!(r.airT>0)) r.m.group.rotateX(clamp(-r.accS*.0007,-.018,.026)); } r.pv=r.v;
  if(r.label){ const cd=r.m.group.position.distanceTo(cam.position); r.label.material.opacity=clamp((cd-5)/7,0,1)*clamp((170-cd)/50,0,1); } // no screen-filling tag when a car is on your bumper
  if(r.bumpT){ r.bumpT-=dt; r.m.group.position.y+=Math.sin(clamp(r.bumpT*38,0,12))*(r.bumpT>0?.14:-.1)*clamp(Math.abs(r.bumpT)/.2,0,1); }
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
let ghostRec=[], ghostData=null, ghostCar=null, ghostIdx=0;
function ghostKey(){ return 'afterhours.ghost.'+EV.id; }
function loadGhost(){ try{ ghostData=JSON.parse(localStorage.getItem(ghostKey())||'null'); }catch(e){ ghostData=null; } return ghostData; }
function ghostifyMaterial(mat){
  if(!mat) return mat;
  const ghostOne=m=>{
    if(!m||typeof m.clone!=='function') return m;
    const c=m.clone(); c.transparent=true; c.opacity=.28; c.depthWrite=false; return c;
  };
  return Array.isArray(mat)?mat.map(ghostOne):ghostOne(mat);
}
function spawnGhost(){
  if(ghostCar){ ghostCar.scene.remove(ghostCar.group); ghostCar=null; }
  if(!ghostData||!ghostData.s||ghostData.s.length<4) return;
  const def=CARS.find(c=>c.id===ghostData.car)||CARS[0], m=buildCar(def);
  m.group.traverse(o=>{ if(o.isSprite){ o.visible=false; return; } if(o.material) o.material=ghostifyMaterial(o.material); });
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
let raceTape=null, tapeAcc=0, tapeLeader=null, tapePlace=0, hiPlay=null, hiCars=[], reportSkip=true;
function tapeReset(){
  raceTape={snaps:[],events:[],margin:null,battle:false};
  tapeLeader=null; tapePlace=0; tapeAcc=0; reportSkip=true;
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
  pick('hottag','THE HOT TAG',e=>`Hot tag into the ${e.car}, partner in range.`);
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
  const rw=$('#rWatch'); if(rw) rw.style.display=(raceTape&&raceTape.snaps&&raceTape.snaps.length>=2)?'':'none';
}
function dropHiCars(){ // borrowed racer meshes stay owned by clearRacers; only cars built for the replay are removed and freed
  hiCars.forEach(c=>{ if(c.own){ if(c.group.parent) c.group.parent.remove(c.group); c.group.traverse(o=>{ if(o.geometry&&!o.isSprite&&!o.geometry.userData.shared) o.geometry.dispose(); }); } });
  hiCars=[];
  racers.forEach(r=>{ r.m.group.visible=true; if(r.trail) r.trail.mesh.visible=true; });
}
function endHighlight(){
  dropHiCars();
  hiPlay=null; mode='results'; $('#hMsg').textContent=''; show('results'); draw(studio);
}
function playHighlight(h){
  if(!raceTape||!h) return;
  hiPlay={t0:Math.max(0,h.t-2.2),t1:h.t+3.8,t:Math.max(0,h.t-2.2),ids:h.ids&&h.ids.length?h.ids:['player']};
  dropHiCars();
  racers.forEach(r=>{ r.m.group.visible=false; if(r.trail) r.trail.mesh.visible=false; });
  const idSet=new Set(hiPlay.ids);
  idSet.forEach(id=>{
    const r=id==='player'?player:racers.find(x=>x.def.id===id);
    if(r&&r.m){ r.m.group.visible=true; hiCars.push({id,group:r.m.group,wheels:r.m.wheels}); return; }
    const m=buildCar(CARS[0]); RS.add(m.group); hiCars.push({id,group:m.group,wheels:m.wheels,own:true});
  });
  mode='highlight'; show('hud'); $('#hMsg').textContent=h.title; camSnap=true;
}
function highlightStep(dt){
  if(!hiPlay) return;
  hiPlay.t+=dt;
  const row=snapAt(hiPlay.t); if(!row){ endHighlight(); return; }
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
function updateFx(dt,focus){ if(skDirty){ skGeo.attributes.position.needsUpdate=true; skDirty=false; }
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
    if(d.s<focus.dist-6||d.s>focus.dist+400+focus.v){ d.s=focus.dist+30+focus.v*.5+Math.random()*(140+focus.v*.8); d.x=(Math.random()*2-1)*(W+.1); d.y=.3+Math.random()*(H-.8); }
    frame(d.s,F2); p.copy(F2.p).addScaledVector(F2.r,d.x); p.y+=d.y; orientQ(F2,q,b,nr); sc.set(1,1,len);
    m4.compose(p,q,sc); slMesh.setMatrixAt(i,m4); }
  slMesh.instanceMatrix.needsUpdate=true;
}

/* ---------------- INPUT ---------------- */
const keys={};
const pads={left:false,right:false,brake:false,nitro:false};
addEventListener('keydown',e=>{ keys[e.code]=true;
  if(mode==='select'&&e.code==='KeyI'){ sheetOpen?closeSheet():openSheet(); }
  if(mode==='select'){ if(e.code==='ArrowRight') turn(1); if(e.code==='ArrowLeft') turn(-1); if(e.code==='Enter') openEvents(); if(e.code==='KeyV') openShowcase(); }
  if(mode==='showcase'){ if(e.code==='ArrowRight') turnShowcase(1); if(e.code==='ArrowLeft') turnShowcase(-1); if(e.code==='Enter') openEvents(); if(e.code==='Escape') backFromShowcase(); }
  else if(mode==='events'){ if(e.code==='ArrowRight') turnEvent(1); if(e.code==='ArrowLeft') turnEvent(-1); if(e.code==='Enter'){ tagPick=null; startLoading(); } if(e.code==='Escape') backToArchive(); }
  else if(mode==='tagteam'){ if(e.code==='Enter') startTagTeam(); if(e.code==='Escape') backFromTag(); }
  else if(mode==='race'&&e.code==='KeyT'&&!e.repeat) tagSwap(false);
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
function flash(strength){ const f=$('#flash'); f.classList.remove('go'); f.style.opacity=strength||1; void f.offsetWidth; f.classList.add('go'); f.style.opacity=0; }
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
let STUDIO_WARM=false;
function enter(){ initAudio(); closeSheet(); sfx.shutter(); flash(1); mode='select'; show('select'); if(!STUDIO_WARM){ STUDIO_WARM=true; try{ renderer.compile(studio,cam); }catch(err){} } renderPage(0); } // A3: studio shaders compile once, behind the flash
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
  resetStudioOrbit();
  camSnap=true; modeT=0;
}
let studioYaw=0, studioPitch=0;
function resetStudioOrbit(){
  studioYaw=studioPitch=0;
  studioCars.forEach(c=>{ c.group.rotation.x=0; c.group.rotation.y=0; });
}
function applyStudioOrbit(){
  const c=studioCars[page]; if(!c) return;
  c.group.rotation.y=studioYaw; c.group.rotation.x=studioPitch;
}
let showcaseOrbit=null;
function ensureShowcaseOrbit(){
  if(showcaseOrbit) return showcaseOrbit;
  if(!THREE.OrbitControls) return null;
  const dom=$('#cStage')||canvas;
  showcaseOrbit=new THREE.OrbitControls(cam,dom);
  showcaseOrbit.enableDamping=true;
  showcaseOrbit.dampingFactor=.06;
  showcaseOrbit.enablePan=false;
  showcaseOrbit.minDistance=3;
  showcaseOrbit.maxDistance=18;
  showcaseOrbit.minPolarAngle=.08;
  showcaseOrbit.maxPolarAngle=Math.PI-.08;
  showcaseOrbit.rotateSpeed=.72;
  showcaseOrbit.enabled=false;
  return showcaseOrbit;
}
function resetShowcaseOrbit(){
  const d=CARS[page], oc=ensureShowcaseOrbit(); if(!oc) return;
  resetStudioOrbit();
  const c=(DEV&&DEV.scam)||d.cam, mul=cam.aspect<1?Math.min(2.1,.85/Math.pow(cam.aspect,.85)):1;
  oc.target.set(c.l[0],c.l[1],c.l[2]);
  oc.object.position.set(c.p[0]*mul,c.p[1]*(cam.aspect<1?1.08:1),c.p[2]*mul);
  oc.update();
}
function renderShowcase(dir){
  const d=CARS[page];
  setWorld(d.world);
  studioCars.forEach((c,i)=>{ c.group.visible=i===page; c.paint.roughness=clamp(c.def.rough+hist(c.def.id).hits*.004,0,.6); });
  $('#cHead').innerHTML=`<span class="k">${esc(d.kick)}</span><span>${esc(d.name)}</span>`;
  $('#cSpecs').textContent=d.specs;
  $('#cCap').textContent=d.caption;
  $('#cPg').innerHTML=`${String(page+1).padStart(2,'0')} <em>/ ${String(CARS.length).padStart(2,'0')}</em>`;
  if(dir) animIn([['#cHead',''],['#cFoot','d1']],dir);
  resetShowcaseOrbit();
  modeT=0;
}
function openShowcase(){ initAudio(); closeSheet(); sfx.shutter(); flash(.85); mode='showcase'; show('showcase'); renderShowcase(0); const oc=ensureShowcaseOrbit(); if(oc) oc.enabled=true; }
function backFromShowcase(){ const oc=ensureShowcaseOrbit(); if(oc) oc.enabled=false; mode='select'; show('select'); flash(.85); sfx.shutter(); renderPage(0); camSnap=true; }
function turnShowcase(dir){ page=(page+dir+CARS.length)%CARS.length; sfx.page(); setTimeout(()=>sfx.shutter(),60); flash(.75); renderShowcase(dir); }
let sheetOpen=false;
function renderSheet(dir){
  const d=CARS[page], sh=SHEETS[d.id]||{};
  $('#shKick').textContent=`Spec sheet, ${String(page+1).padStart(2,'0')} of ${String(CARS.length).padStart(2,'0')}`;
  $('#shName').textContent=d.name;
  const rows=[['Engine',sh.engine],['Power',sh.power],['Torque',sh.torque],['0–60 mph',sh.zero],['Top speed',sh.vmax],['Weight',sh.weight],['Drivetrain',sh.drive],['Gearbox',sh.gearbox]];
  const bars=[['Speed',d.top/112],['Acceleration',d.acc/42],['Grip',d.grip/36],['Boost',d.nitro/1.55],['Weight',(d.mass||1)/2],['Handling',(d.grip/36)*(1.15-((d.mass||1)-1)*.35)]];
  $('#shBody').innerHTML=rows.map((r,i)=>`<div class="srow sline" style="--sx:${(dir||1)*30}px;animation-delay:${i*35}ms"><span>${r[0]}</span><b>${esc(r[1]||'—')}</b></div>`).join('')+
    `<div class="sbars">${bars.map(b=>`<div class="sbar">${b[0]}<i><b data-w="${Math.round(clamp(b[1],0,1)*100)}"></b></i></div>`).join('')}</div>`;
  $('#shPg').textContent=`${String(page+1).padStart(2,'0')} / ${String(CARS.length).padStart(2,'0')}`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>document.querySelectorAll('#shBody .sbar i b').forEach(b=>b.style.width=b.dataset.w+'%')));
}
function openSheet(){ sheetOpen=true; renderSheet(1); $('#sheet').classList.add('open'); $('#sheet').setAttribute('aria-hidden','false'); sfx.page(); }
function closeSheet(){ sheetOpen=false; $('#sheet').classList.remove('open'); $('#sheet').setAttribute('aria-hidden','true'); }
function turn(dir){ page=(page+dir+CARS.length)%CARS.length; sfx.page(); setTimeout(()=>sfx.shutter(),60); flash(.95); renderPage(dir); if(sheetOpen) renderSheet(dir); }
function openEvents(){ initAudio(); closeSheet(); sel=page; const oc=ensureShowcaseOrbit(); if(oc) oc.enabled=false; sfx.shutter(); flash(1); mode='events'; show('events'); renderEvent(0,true); }
function eventPageHtml(){ return `${EVI+1} <em>/ ${EVENTS.length}</em>`; }
function renderEventRoster(){
  const el=$('#eRoster'); if(!el) return;
  el.innerHTML=EVENTS.map((e,i)=>{
    const tag=e.kick==='Tournament'?'Gauntlet':e.kick.replace('Event ','Ev ');
    return `<button type="button" class="epick${i===EVI?' on':''}" data-i="${i}"><b>${esc(tag)}</b> ${esc(e.name)}</button>`;
  }).join('');
  el.querySelectorAll('.epick').forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; if(i===EVI) return; EVI=i; sfx.page(); renderEvent(0,true); });
}
function renderEvent(dir,force){
  if(force||dir) { setEvent(EVI); setupAttract(CARS[sel]); try{ renderer.compile(RS,cam); }catch(err){} } // A3: build this city's shaders now, behind the page-turn flash, not on the first visible frame
  const e=EV;
  $('#eHead').innerHTML=`<span class="k">${esc(e.kick)}</span><span>${esc(e.name)}</span>`;
  $('#eStamp').innerHTML=`${esc(e.loc)}<small>${esc(e.when)}</small>`;
  $('#eNote').innerHTML=esc(e.note)+handArrow;
  $('#eSpecs').textContent=e.specs; $('#eCap').textContent=e.caption;
  const g=loadGhost();
  $('#eGhost').textContent=g?`Your ghost: ${fmt(g.t)} in the ${(CARS.find(c=>c.id===g.car)||CARS[0]).name}. Beat it and it gets replaced.`:'No ghost yet. Your first finish becomes the one to beat.';
  $('#eGhost').textContent+=' On the grid: Apex, The Wall, Leech, Bruiser, The Closer, Wildcard. Big grids add Grudge, Hunter, Rabbit and Weaver. '+PU_DESC;
  $('#eTag').style.display=e.knockout?'none':'';
  if(e.knockout){ bindKoTrack(koMapI); $('#eGhost').textContent='Pick a map on the next screen. Short loops use lap checkpoints; long courses knock out at sectors so you are not running 110 km. Round rules: '+KO_MODS.filter(m=>m.id!=='clean').map(m=>m.name).join(', ')+', and a Final Duel for the last two.'; }
  $('#ePg').innerHTML=eventPageHtml();
  renderEventRoster();
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
function startGauntlet(){ tagPick=null; bindKoTrack(koMapI); startLoading(); }
function backToArchive(){ TAG=null; engine(0,false); screech(0); mode='select'; show('select'); flash(.9); sfx.shutter(); renderPage(0); }
$('#prev').onclick=()=>turn(-1); $('#next').onclick=()=>turn(1);
$('#specBtn').onclick=()=>sheetOpen?closeSheet():openSheet(); $('#shClose').onclick=closeSheet;
$('#shPrev').onclick=()=>turn(-1); $('#shNext').onclick=()=>turn(1);
(function(){ const el=$('#sheet'); let x0=null,y0=0;
  el.addEventListener('pointerdown',e=>{ if(e.target.closest('button')) return; x0=e.clientX; y0=e.clientY; e.stopPropagation(); });
  el.addEventListener('pointerup',e=>{ if(x0===null) return; const dx=e.clientX-x0, dy=e.clientY-y0; x0=null; e.stopPropagation();
    if(dy>60&&dy>Math.abs(dx)) closeSheet(); else if(Math.abs(dx)>40) turn(dx<0?1:-1); }); })();
$('#race').onclick=()=>openEvents();
$('#showcaseBtn').onclick=()=>openShowcase();
$('#cBack').onclick=()=>backFromShowcase();
$('#cPrev').onclick=()=>turnShowcase(-1);
$('#cNext').onclick=()=>turnShowcase(1);
$('#cRace').onclick=()=>openEvents();
$('#ePrev').onclick=()=>turnEvent(-1); $('#eNext').onclick=()=>turnEvent(1);
$('#eGo').onclick=()=>{ tagPick=null; EV.knockout?openGauntlet():startLoading(); }; $('#eBack').onclick=()=>backToArchive();
$('#eTag').onclick=()=>{ if(!EV.knockout) openTagTeam(); };
$('#tStart').onclick=()=>startTagTeam(); $('#tBack').onclick=()=>backFromTag();
$('#tagBtn').addEventListener('pointerdown',e=>{ e.preventDefault(); tagSwap(false); });
$('#gBack').onclick=()=>{ mode='events'; show('events'); renderEvent(0,true); };
$('#gStart').onclick=()=>startGauntlet();
$('#snd').onclick=()=>{ soundOn=!soundOn; $('#snd').textContent=soundOn?'Sound on':'Sound off'; };
$('#mus').textContent=musicOn?'Music on':'Music off';
$('#mus').onclick=()=>{ musicOn=!musicOn; SAVE.musicOff=!musicOn; persist(); $('#mus').textContent=musicOn?'Music on':'Music off'; };
const trackLabel=()=>{ const b=$('#track'); if(b) b.textContent='Track: '+MUS_THEMES[musTheme].name; };
trackLabel();
if($('#track')) $('#track').onclick=()=>{ setMusicTheme(musTheme==='ice'?'night':'ice'); trackLabel(); };
$('#glow').onclick=()=>{ glowOn=!glowOn; $('#glow').textContent=glowOn?'Glow on':'Glow off'; };
if($('#look')){ const lookLabel=()=>{ $('#look').textContent='Look: '+(CLEAR?'Clear':'Cinematic'); document.body.classList.toggle('clear',CLEAR); };
  lookLabel(); $('#look').onclick=()=>{ CLEAR=!CLEAR; SAVE.look=CLEAR?'clear':'cine'; persist(); lookLabel(); }; }
$('#tap').onclick=()=>{ if(bootReady) enter(); };
function bindTap(id,fn){ // fires on pointerup so a canvas swipe can't swallow the tap; click still covers keyboard (Enter/Space)
  const el=$(id); let tapT=0;
  el.addEventListener('pointerdown',e=>{ if(e.button!==0) return; e.stopPropagation(); });
  el.addEventListener('pointerup',e=>{
    if(e.button!==0) return;
    e.preventDefault(); e.stopPropagation();
    tapT=performance.now(); fn();
  });
  el.addEventListener('click',e=>{ e.stopPropagation(); if(performance.now()-tapT>600) fn(); });
}
bindTap('#quit',()=>{ endGhost(); dropHiCars(); hiPlay=null; backToArchive(); });
bindTap('#rBack',()=>backToArchive());
bindTap('#rAgain',()=>startLoading());
bindTap('#rBack2',()=>backToArchive());
bindTap('#rAgain2',()=>startLoading());
bindTap('#rSkip',()=>{ reportSkip=true; showResultsClassic(true); });
bindTap('#rView',()=>{ reportSkip=false; showResultsClassic(false); });
bindTap('#rWatch',()=>{ const b=$('#rHiList button'); if(b) b.click(); else showResultsClassic(true); });
let sx=null, sy=0, swipeEl=null;
['#events'].forEach(id=>{ const el=$(id); el.style.pointerEvents='auto';
  el.addEventListener('pointerdown',e=>{ if(e.target.closest('button')) return; sx=e.clientX; sy=e.clientY; swipeEl=id; }); });
addEventListener('pointerup',e=>{ if(sx===null) return; const dx=e.clientX-sx, dy=e.clientY-sy; sx=null;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)&&mode==='events'&&swipeEl==='#events') turnEvent(dx<0?1:-1); });

let studioPtr=null;
function studioPtrTarget(e){
  if(sheetOpen||mode==='showcase'||mode!=='select'&&mode!=='results') return false;
  if(e.target.closest('button,.actions,.magact,.foot')) return false;
  const t=e.target;
  if(mode==='select') return t===canvas||t.id==='sStage'||!!t.closest('#select');
  return t===canvas||!!t.closest('#results');
}
function studioPtrDown(e){
  if(studioPtr) return;
  if(!studioPtrTarget(e)) return;
  e.stopPropagation();
  studioPtr={x:e.clientX,y:e.clientY,yaw:studioYaw,pitch:studioPitch,intent:null,id:e.pointerId,el:e.currentTarget};
  const hit=$('#sStage'); if(hit) hit.classList.remove('dragging');
  try{ e.currentTarget.setPointerCapture(e.pointerId); }catch(_){}
}
function studioPtrMove(e){
  if(!studioPtr||studioPtr.id!==e.pointerId) return;
  const dx=e.clientX-studioPtr.x, dy=e.clientY-studioPtr.y;
  if(studioPtr.intent==null){
    if(Math.hypot(dx,dy)<14) return;
    studioPtr.intent=Math.abs(dx)>Math.abs(dy)*1.45?'swipe':'orbit';
    if(studioPtr.intent==='orbit'){ const hit=$('#sStage'); if(hit) hit.classList.add('dragging'); }
  }
  if(studioPtr.intent!=='orbit') return;
  studioYaw=studioPtr.yaw-dx*.014;
  studioPitch=clamp(studioPtr.pitch-dy*.01,-.38,.28);
  applyStudioOrbit();
}
function studioPtrUp(e){
  if(!studioPtr||studioPtr.id!==e.pointerId) return;
  const dx=e.clientX-studioPtr.x, dy=e.clientY-studioPtr.y, intent=studioPtr.intent;
  studioPtr=null;
  const hit=$('#sStage'); if(hit) hit.classList.remove('dragging');
  const horiz=Math.abs(dx)>36&&Math.abs(dx)>Math.abs(dy)*1.2;
  if((intent==='swipe'||intent==null)&&horiz&&mode==='select') turn(dx<0?1:-1);
}
[canvas,$('#sStage')].forEach(el=>{ if(!el) return;
  el.addEventListener('pointerdown',studioPtrDown);
  el.addEventListener('pointermove',studioPtrMove);
  el.addEventListener('pointerup',studioPtrUp);
  el.addEventListener('pointercancel',studioPtrUp); });
$('#select').style.pointerEvents='auto';
$('#select').addEventListener('pointerdown',studioPtrDown);
$('#select').addEventListener('pointermove',studioPtrMove);
$('#select').addEventListener('pointerup',studioPtrUp);
$('#select').addEventListener('pointercancel',studioPtrUp);
$('#results').style.pointerEvents='auto';
$('#results').addEventListener('pointerdown',studioPtrDown);
$('#results').addEventListener('pointermove',studioPtrMove);
$('#results').addEventListener('pointerup',studioPtrUp);
$('#results').addEventListener('pointercancel',studioPtrUp);

function startLoading(){
  initAudio(); sfx.shutter(); flash(1);
  if(mode!=='events') { const rs=resolveEventForStart(EVENTS[EVI],koMapI); if(rs.bindKo) bindKoTrack(rs.koMap); else setEvent(EVI); setupAttract(CARS[sel]); }
  mode='loading'; modeT=0; show('loading');
  setWeather(EV.id!=='tunnel'&&Math.random()<.45);
  const mate=tagPick&&!EV.knockout?CARS.find(c=>c.id===tagPick.partner):null;
  $('#ldwhere').textContent=EV.name+(mate?' · Tag team':''); $('#ldsub').textContent=`${EV.load} You're in the ${CARS[sel].name}${mate?`, tagging with the ${mate.name}`:''}.${LOOK.wet?' Rain tonight, the roads are wet.':''}`;
}
function endGhost(){ if(ghostCar){ ghostCar.scene.remove(ghostCar.group); ghostCar=null; } }
function startRace(){
  clearRacers(); resetSkids();
  const me=CARS[sel], R_=id=>RIVALS.find(r=>r.id===id), taken=[me.id]; RIVAL_BOSS=Math.random()<.15; TAG=null;
  if(tagPick&&!EV.knockout) tagGrid(me);
  else if(EV.knockout){ // every car in the archive on one grid; the six personas spread across the eleven rivals
    const others=CARS.filter(c=>c.id!==me.id).sort(()=>Math.random()-.5), per=RIVALS.map(r=>r.id).sort(()=>Math.random()-.5), pSlot=6+Math.floor(Math.random()*4);
    for(let i=0,oi=0;i<12;i++){ const dist=-5-i*5.5, x=i%2?2.6:-2.6;
      if(i===pSlot){ player=addRacer(me,true,dist,x,1); continue; }
      const car=others[oi], P=R_(per[oi%per.length]); oi++;
      addRacer(Object.assign({},car,{id:P.id,chassisId:car.id,tag:car.name,color:P.color,car:car.name,P:Object.assign({},P.P,{mass:car.mass||1}),mass:car.mass||1,rivalNote:car.rival}),false,dist,x,.975+Math.random()*.02); }
  } else if(EV.fullGrid){
    const lineup=CARS.filter(c=>c.id!==me.id).sort(()=>Math.random()-.5);
    const pSlot=4+Math.floor(Math.random()*Math.max(1,lineup.length-8));
    lineup.splice(pSlot,0,me);
    const per=RIVALS.map(r=>r.id).sort(()=>Math.random()-.5);
    lineup.forEach((car,i)=>{ const dist=-5-i*5.2, x=i%2?2.8:-2.8;
      if(car.id===me.id){ player=addRacer(me,true,dist,x,1); return; }
      const shell=R_(per[i%per.length]);
      addRacer(Object.assign({},car,{chassisId:car.id,tag:car.name,car:car.name,P:Object.assign({},shell.P,{mass:car.mass||1}),mass:car.mass||1,rivalNote:car.rival}),false,dist,x,.975+Math.random()*.025); });
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
  personaT=0; boardT=0; resetPickups(); racers.forEach(r=>{ r.fxLong=r.fxOver=r.fxSling=r.fxShield=r.fxGrip=r.fxRegen=r.fxNosMul=r.fxWisp=r.fxEcho=r.towT=r.fxTempest=r.mantisT=r.fxJam=r.fxGhost=r.clean=0; r._hits=r.hits; r.fxName={}; });
  if(EV.resetTraffic) EV.resetTraffic();
  const boss=racers.find(r=>!r.isP&&['overload','volcano','zephyr','hikari'].includes(r.def.chassisId));
  if(boss&&!EV.knockout) setTimeout(()=>{ if(mode!=='race') return; const id=boss.def.chassisId;
    toast(id==='zephyr'?`${boss.def.tag} brought the ZEPHYR 960. Nine hundred and sixty on the grid.`:(id==='volcano'?`${boss.def.tag} brought the VOLCANO P1.`:id==='hikari'?`${boss.def.tag} brought the HIKARI 91. Lamps up.`:`${boss.def.tag} brought the OVERLOAD 3K. Three thousand horsepower on the grid.`)); },4200);
  if(EV.knockout||TAG){ ghostData=null; endGhost(); } else { loadGhost(); spawnGhost(); } ghostRec=[]; camFlashes=0;
  document.body.classList.toggle('tagmode',!!TAG); $('#hTag').className='tagbox'; camTag.t=0;
  tapeReset(); KO=null; LOOK.lightsOut=false; applyLights(); if(EV.knockout) koStart();
  if(player) applyNitroHud(player.def);
  try{ renderer.compile(RS,cam); }catch(e){} // perf: build every shader for this grid and track now, not as each car or prop first comes into view mid-race
  mode='race'; show('hud'); countdown=3.6; raceT=0; finishHold=0; slowmo=1; camSnap=true; shake=0;
  $('#hGhost').textContent=''; $('#hMsg').textContent='3'; sfx.beep(false); flash(.9);
}
function finishRace(){
  mode='results'; show('results'); sfx.shutter(); flash(1); engine(0,false); screech(0);
  if(EV.knockout){ finishKnockout(); return; }
  if(TAG){ finishTagTeam(); return; }
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

/* ---------------- TAG TEAM ----------------
   Four teams of two on any regular event. You drive one car and the AI drives your partner; press T (or Tag)
   to jump into the other car whenever you like. Tag while your partner is within 30 m for a HOT TAG: the car
   you jump into gets full boost and a slingshot. From further away it's a cold tag, no bonus. Teammates draft
   each other harder than rivals do, and the AI lines up nose to tail with its partner to use it. When the car
   you're driving finishes, you're tagged into your partner for the anchor leg. Points go 10-8-6-5-4-3-2-1 and
   the best team total wins.
   Recon: team scoring from SuperTuxKart's team worlds (capture_the_flag / soccer, KART_TEAM_RED / BLUE), the
   baton hand-off from the pt-BR relay exercises (corrida de revezamento), and drafting as a team resource from
   sny9brian7/jockey-race-game (スリップストリームで消耗-40%). */
const TEAMS=[{name:'AFTERHOURS',color:'#f4f7ff'},{name:'CLEAN LINES',color:'#9fd3ff',ids:['apex','closer']},{name:'BLOCK PARTY',color:'#ff5a5a',ids:['wall','bruiser']},{name:'LOOSE ENDS',color:'#ffd23b',ids:['leech','wild']}];
const TEAM_PTS=[10,8,6,5,4,3,2,1], TAG_HOT=30, TAG_CD=4;
const TEAM_P={line:.95,offScale:.25,wobble:.1,risk:1,rubber:1.7,gain:.36,mass:1,start:.1,nitro:'exit',seek:.5};
const CLASS_TAG={heavy:'HEAVY',nimble:'NIMBLE',muscle:'MUSCLE',balanced:'BALANCED'};
let tagPick=null, TAG=null;
const camTag={t:0,from:new THREE.Vector3(),look:new THREE.Vector3()};
// partners come from the regular archive: the outlaw cars are player-only, and your partner is AI half the time
function suggestPartner(me){ const want={heavy:'nimble',nimble:'heavy',muscle:'nimble',balanced:'muscle'}[carClass(me)];
  return CARS.find(c=>c.id!==me.id&&!c.outlaw&&carClass(c)===want&&c.id!=='overload'&&c.id!=='volcano'&&c.id!=='zephyr'&&c.id!=='hikari')||CARS.find(c=>c.id!==me.id&&!c.outlaw&&c.id!=='zephyr'); }
function openTagTeam(){ initAudio(); closeSheet(); sfx.shutter(); flash(1); mode='tagteam'; show('tagteam');
  const me=CARS[sel]; if(!tagPick||tagPick.me!==me.id) tagPick={me:me.id,partner:suggestPartner(me).id}; renderTagTeam(); }
function renderTagTeam(){ const me=CARS[sel], sug=suggestPartner(me).id;
  $('#tEv').textContent=EV.name;
  $('#tSub').textContent=`You drive the ${me.name}, the AI drives your partner. Press T (or Tag) to jump into the other car. Tag within ${TAG_HOT} m for a hot tag: full boost and a slingshot. Four teams of two, points 10-8-6-5-4-3-2-1.`;
  $('#tCars').innerHTML=CARS.filter(c=>c.id!==me.id&&!c.outlaw).map(c=>`<button type="button" class="gmap${c.id===tagPick.partner?' on':''}" data-id="${c.id}"><b>${esc(c.name)}</b><span>${CLASS_TAG[carClass(c)]} · ${Math.round(c.top*2.237*1.1)} mph</span>${c.id===sug?'<i>GOOD MATCH</i>':''}</button>`).join('');
  $('#tCars').querySelectorAll('button').forEach(b=>b.onclick=()=>{ tagPick.partner=b.dataset.id; sfx.page(); renderTagTeam(); }); }
function startTagTeam(){ if(!tagPick) tagPick={me:CARS[sel].id,partner:suggestPartner(CARS[sel]).id}; startLoading(); }
function backFromTag(){ mode='events'; show('events'); renderEvent(0,true); }
function tagGrid(me){
  const partner=CARS.find(c=>c.id===tagPick.partner&&c.id!==me.id&&!c.outlaw)||suggestPartner(me), taken=[me.id,partner.id], R_=id=>RIVALS.find(r=>r.id===id);
  TAG={cd:0,swaps:0,hot:0,anchor:false};
  const teams=TEAMS.map((t,i)=>i?t.ids.map(id=>Object.assign(buildRivalForEvent(R_(id),EV.id,taken),{color:t.color})):[
    Object.assign({},me,{P:Object.assign({},TEAM_P,{mass:me.mass||1}),tag:'YOU',color:t.color,car:me.name}),
    Object.assign({},partner,{P:Object.assign({},TEAM_P,{mass:partner.mass||1}),tag:'PARTNER',color:t.color,car:partner.name})]);
  const order=[1,2,3].sort(()=>Math.random()-.5); order.splice(1+Math.floor(Math.random()*2),0,0); // your team starts mid-grid
  order.forEach((ti,row)=>teams[ti].forEach((def,j)=>{ const r=addRacer(def,ti===0&&j===0,-5-row*11-j*5.5,j?2.6:-2.6,ti===0?1:.975+Math.random()*.02); r.team=ti; if(r.isP) r.startDelay=0; }));
  racers.forEach(r=>{ r.mateR=racers.find(o=>o!==r&&o.team===r.team)||null; });
  player=racers.find(r=>r.isP);
}
function tagSwap(forced){
  if(!TAG||mode!=='race'||countdown>0||!player) return;
  const mate=player.mateR; if(!mate) return;
  if(!forced){ if(mate.finished){ toast('Your partner already finished.'); return; } if(TAG.cd>raceT){ toast(`Tag ready in ${Math.ceil(TAG.cd-raceT)}s.`); return; } }
  const gap=Math.abs(mate.dist-player.dist), hot=!forced&&gap<TAG_HOT, out=player;
  camTag.from.copy(cam.position); camTag.look.copy(camLook); camTag.t=.45;
  out.isP=false; out.lit=false; mate.isP=true; mate.startDelay=0; player=mate;
  if(hot){ mate.nitro=Math.max(mate.nitro,1); mate.fxSling=Math.max(mate.fxSling,1.1); mate.v=Math.min(mate.v+8,Math.max(mate.v,mate.def.top*1.2)); out.fxRegen=Math.max(out.fxRegen,4); TAG.hot++;
    toast(`HOT TAG. You're in the ${mate.def.name}. Full boost and a slingshot.`); sfx.powerup(true); flash(.3); shake=.5; tapeLog('hottag',{car:mate.def.name}); }
  else { toast(forced?`Anchor leg. You're in the ${mate.def.name}. Bring it home.`:`Cold tag. You're in the ${mate.def.name}.`); sfx.shutter(); flash(.15); }
  TAG.cd=raceT+TAG_CD; TAG.swaps+=forced?0:1; tapePlace=0;
}
function tagProjection(){ const st=standings(), pts=TEAMS.map(()=>0); st.forEach((r,i)=>{ pts[r.team]+=TEAM_PTS[i]||0; });
  return TEAMS.map((t,i)=>({i,t,pts:pts[i]})).sort((a,b)=>b.pts-a.pts); }
function finishTagTeam(){
  const L=TR.L, est=r=>r.finished?r.finishT:raceT+(laps()*L-r.dist)/Math.max(r.v,30);
  const order=racers.slice().sort((a,b)=>est(a)-est(b)); order.forEach((r,i)=>r.pts=TEAM_PTS[i]||0);
  const table=TEAMS.map((t,i)=>{ const cars=racers.filter(r=>r.team===i); return {i,t,cars,pts:cars.reduce((a,r)=>a+r.pts,0),best:Math.min(...cars.map(r=>order.indexOf(r)))}; }).sort((a,b)=>b.pts-a.pts||a.best-b.best);
  const place=table.findIndex(x=>x.i===0)+1, mine=table[place-1], won=place===1, t=Math.max(...mine.cars.map(est));
  const me=mine.cars.find(r=>r.def.tag==='YOU'), mate=mine.cars.find(r=>r.def.tag==='PARTNER');
  const h=hist(me.def.id); h.runs++; h.hits+=me.hits+mate.hits; if(won){ h.wins++; h.winAt=EV.name+' (tag team)'; } h.last=place; persist();
  $('#rPlace').textContent='P'+place;
  $('#rHead').textContent=won?`Team AFTERHOURS takes ${EV.name} with ${mine.pts} points`:`${table[0].t.name} take ${EV.name} on ${table[0].pts} points`;
  $('#rStamp').innerHTML=(won?'Tag team win':`Team P${place}`)+`<small>${esc(EV.kick)} · Tag team</small>`;
  $('#rTbl').innerHTML=`<dt>Team points</dt><dd>${mine.pts} (P${place} of ${TEAMS.length})</dd><dt>${esc(me.def.name)}</dt><dd>P${order.indexOf(me)+1} · ${me.pts} pts</dd><dt>${esc(mate.def.name)}</dt><dd>P${order.indexOf(mate)+1} · ${mate.pts} pts</dd><dt>Tags</dt><dd>${TAG.swaps} (${TAG.hot} hot)</dd><dt>Team time</dt><dd>${fmt(t)}</dd>`;
  $('#rLog').textContent=won?'the whole team gets a stamp.':(TAG.hot?'good tags. run it back.':`tag inside ${TAG_HOT} m. hot tags win this.`);
  $('#rOrder').innerHTML=table.map((x,k)=>`<li${x.i===0?' class="me"':''}><b>${k+1}</b><span style="color:${x.t.color}">${esc(x.t.name)}</span> <em>${x.pts} pts · ${x.cars.map(r=>esc(x.i===0?r.def.name:r.def.tag)).join(' + ')}</em></li>`).join('');
  finishRaceReport(place,t,'0');
  $('#rMagSub').textContent=`${EV.name.toUpperCase()} · TAG TEAM · P${place} / ${TEAMS.length}`;
  if(!won) $('#rMagHead').textContent=`TEAM P${place} / ${TEAMS.length}`;
  page=sel; setWorld('flash'); studioCars.forEach((c,i)=>{ c.group.visible=i===sel; c.paint.roughness=clamp(c.def.rough+h.hits*.004,0,.6); });
  camSnap=true; modeT=0;
}

/* ---------------- CAMERA RIGS ---------------- */
const tgt=new THREE.Vector3();
const camOff=new THREE.Vector3(), camAim=new THREE.Vector3(); let camSnapAim=true;
function chaseCam(dt,r,inp){
  frame(r.dist,F);
  headV.copy(F.t).multiplyScalar(Math.cos(r.yaw*.6)).addScaledVector(F.r,Math.sin(r.yaw*.6)).normalize();
  const pos=r.m.group.position, boost=inp&&inp.nitro&&r.nitro>0?1:0;
  tgt.copy(pos).addScaledVector(headV,-(7.2+boost*.8)).addScaledVector(UP,2.3);
  // smooth the camera's offset from the car, not its world position: a world-space lerp trails v/9 m behind
  // (20 m at 400 mph), swinging the camera through buildings on bends
  if(camSnap||!camOff.lengthSq()){ camOff.subVectors(tgt,pos); camSnap=false; camSnapAim=true; } else camOff.lerp(tmpV.subVectors(tgt,pos),1-Math.exp(-dt*9));
  camPos.copy(pos).add(camOff);
  cam.position.copy(camPos);
  if(shake>0){ cam.position.x+=(Math.random()-.5)*shake*.5; cam.position.y+=(Math.random()-.5)*shake*.4; shake=Math.max(0,shake-dt*2.2); }
  camLook.copy(pos).addScaledVector(headV,8).addScaledVector(UP,1);
  // look into the bend (and over the crest) a little: aim part-way at the road further ahead
  { const la=clamp(12+r.v*.16,12,36); frame(r.dist+la,F2); tmpV.copy(F2.p).addScaledVector(F2.r,r.x*.5); tmpV.y+=1+(pos.y-F.p.y);
    tmpV.sub(pos).setLength(8).add(pos); camAim.lerp(tmpV.sub(camLook),camSnapAim?1:1-Math.exp(-dt*5)); camSnapAim=false; camLook.addScaledVector(camAim,.28); }
  if(camTag.t>0){ camTag.t=Math.max(0,camTag.t-dt); const k=1-Math.pow(camTag.t/.45,2); cam.position.lerpVectors(camTag.from,cam.position,k); camLook.lerpVectors(camTag.look,camLook,k); }
  cam.lookAt(camLook); cam.rotateZ(-r.steer*.05-r.vx*.004);
  const h=78+26*(1-Math.exp(-r.v/75))+boost*8; // widens with speed, then levels off instead of fish-eyeing past 300 mph
  cam.fov=lerp(cam.fov,clamp(hfovToV(h),52,98),1-Math.exp(-dt*4)); cam.updateProjectionMatrix();
}
/* countdown reveal for boards that ask for it (EV.introCrane): the crane shot from the blender-skills set, adapted to a
   road tube. Starts low in front of the car looking back at it, then rises and swings round into the chase position
   by the time the lights go green, easing out so the hand-off to chaseCam is seamless. */
const craneOff=new THREE.Vector3(), craneLook=new THREE.Vector3();
function craneIntro(r){ const k=clamp(1-(countdown-.6)/3,0,1), e=k*k*(3-2*k); if(e>=1) return;
  frame(r.dist,F); const pos=r.m.group.position, side=r.x>0?-1:1;
  // orbit, don't cut: angle, radius and height ease separately so the camera swings round the car instead of through it
  craneOff.subVectors(cam.position,pos); const endA=Math.atan2(craneOff.dot(F.r),craneOff.dot(F.t)), endR=Math.hypot(craneOff.dot(F.r),craneOff.dot(F.t)), endY=craneOff.y;
  let startA=Math.atan2(side*3.2,9); if(Math.abs(endA-startA)>Math.PI) startA+=startA<endA?Math.PI*2:-Math.PI*2;
  const ang=lerp(startA,endA,e), rad=Math.max(5.2,lerp(9.6,endR,e)), y=lerp(.45,endY,e*e);                  // low -> high: the crane move
  cam.position.copy(pos).addScaledVector(F.t,Math.cos(ang)*rad).addScaledVector(F.r,Math.sin(ang)*rad); cam.position.y=pos.y+y;
  craneLook.copy(pos); craneLook.y+=.8; tmpV.copy(craneLook).lerp(camLook,e); cam.lookAt(tmpV); }
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
  const c=hero?{p:[4.2,1.1,-3.6],l:[0,.6,-.3],roll:-.1,fov:32}:(DEV&&DEV.scam)||d.cam; // ?dev: AHDEV.scam() holds a close-up
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
// substep the physics so no car moves more than ~1.5 m per step: at 400+ mph a single 33 ms step is 6 m,
// which made corner forces explode (wall-to-wall pinballing) and let cars tunnel through each other
function stepPhysics(sdt,inp){
  let vTop=0; racers.forEach(r=>{ if(!r.out&&r.v>vTop) vTop=r.v; });
  const nSub=clamp(Math.ceil(vTop*sdt/1.5),1,8), h=sdt/nSub;
  for(let si=0;si<nSub;si++){
    raceT+=h;
    racers.forEach(r=>{ if(r.out) return; if(r.finished&&!r.isP){ r.v*=Math.pow(.99,1/nSub); } stepRacer(r,h,r.isP&&!r.finished?inp:(r.isP?{steer:0,brake:true,nitro:false}:null)); });
    traffic.forEach(o=>stepTraffic(o,h));
    collide(); if(EV.knockout) koStep(h);
  }
}
function loop(now){
  requestAnimationFrame(loop);
  const rawMs=now-last;
  let dt=Math.min(.033,rawMs/1000); last=now;
  const uiDt=Math.min(.25,rawMs/1000); // wall-clock (capped) for loading/countdown/highlight/toast timers so slow frames don't stretch them
  if(mode==='race'||mode==='highlight'){ if(PACE.mode!==mode){ PACE.mode=mode; PACE.ema=16.7; PACE.over=PACE.hold=0; } pace(rawMs); } else if(PACE.mode){ PACE.mode=null; PACE.ema=16.7; PACE.over=PACE.hold=0; } // A3: menu/transition frames never count toward pixel-ratio steps
  modeT+=uiDt; ghostT+=dt;
  if(toastT>0){ toastT-=uiDt; if(toastT<=0) $('#hToast').style.opacity=0; }

  if(mode==='boot'||mode==='loading'||mode==='events'||mode==='gauntlet'||mode==='tagteam'){
    attractStep(dt);
    if(mode==='boot'){ bootP=Math.min(1,(now-bootStart)/2200); { const b0=window.AH_ASSETS?AH_ASSETS.bootShare*AH_ASSETS.progress():0; $('#bootbar').style.width=((b0+(1-b0)*bootP)*100)+'%'; } if(bootP>=1&&!bootReady){ bootReady=true; $('#tap').classList.add('ready'); } }
    else if(mode==='loading'){ $('#ldbar').style.width=Math.min(100,modeT/3.6*100)+'%'; engine(player.v*.7,true); if(modeT>3.6) startRace(); }
    else engine(0,false);
    if(mode!=='race'&&mode!=='highlight') draw(RS);
  }
  else if(mode==='highlight'){
    highlightStep(uiDt);
  }
  else if(mode==='showcase'){
    const oc=showcaseOrbit;   // created once in openShowcase
    if(oc){ oc.enabled=true; oc.update(); }
    sKey.position.copy(cam.position).add(new THREE.Vector3(0,2,0));
    floorStreaks.children.forEach((b,i)=>{ b.position.z+=dt*(2+i%4); if(b.position.z>12) b.position.z=-12; });
    bokeh.rotation.y+=dt*.02;
    draw(studio);
  }
  else if(mode==='select'||mode==='results'){
    if(showcaseOrbit&&showcaseOrbit.enabled) showcaseOrbit.enabled=false;
    studioCam(dt,CARS[page],mode==='results');
    draw(studio);
  }
  else if(mode==='race'){
    const inp=readInput();
    const sdt=dt*slowmo;
    if(EV.update) EV.update(sdt); worldFx(sdt);
    if(countdown>0){
      const prev=Math.ceil(countdown-.6); countdown-=uiDt; const c=Math.ceil(countdown-.6);
      if(c!==prev){ if(c>0){ $('#hMsg').textContent=c; sfx.beep(false); } else { $('#hMsg').textContent='Go'; sfx.beep(true); } }
      if(countdown<=0) $('#hMsg').textContent='';
      racers.forEach(r=>{ if(!r.out) poseRacer(r,0); }); traffic.forEach(o=>poseTraffic(o,0));
      engine(8+(inp.nitro?30:0)+Math.random()*3,true);
    } else {
      stepPhysics(sdt,inp);
      racers.forEach(r=>{ if(!r.out) poseRacer(r,sdt); }); traffic.forEach(o=>poseTraffic(o,sdt));
      engine(player.v,true); screech(clamp(player.slip,0,1));
      if(!player.finished) tapeSample(sdt);
      if(TAG&&player.finished&&!TAG.anchor&&player.mateR&&!player.mateR.finished){ TAG.anchor=true; tagSwap(true); }
      if(player.finished){ if(finishHold===0){ $('#hMsg').textContent=EV.knockout?(player.out?'Out':'Winner'):'Finish'; sfx.beep(true); } finishHold+=uiDt; slowmo=lerp(slowmo,EV.knockout&&player.out?.8:.3,1-Math.exp(-uiDt*3)); if(finishHold>(EV.knockout&&player.out?3.4:2.2)) finishRace(); }
      for(const o of racers){ if(o===player||o.out) continue; const dd=o.dist-player.dist; if(dd>3&&dd<(player.fxOver>0&&player.draftRange?player.draftRange:18)&&Math.abs(o.x-player.x)<2.2){ player.nitro=Math.min(Math.max(1,player.nitro),player.nitro+.12*sdt); } }
    }
    if(mode==='race'){
      if(ghostCar&&ghostData){ const g=ghostState(raceT);
        if(g){ ghostCar.group.visible=true; poseAt(ghostCar.group,g.dist,g.x,g.yaw,0); ghostCar.wheels.forEach(w=>w.rotation.x+=player.v*sdt/.37);
          if(countdown<=0&&!player.finished){ const gap=(g.dist-player.dist)/Math.max(player.v,15); const el=$('#hGhost'); setT(el,gap>0?`Ghost ahead ${gap.toFixed(1)}s`:`Ghost behind ${(-gap).toFixed(1)}s`); el.classList.toggle('ahead',gap<=0); } }
        else ghostCar.group.visible=false; }
      const focus=EV.knockout&&player.out?(koLeader()||player):player;
      updateFx(sdt,focus); chaseCam(dt,focus,player.out?null:inp);
      if(countdown>0&&EV.introCrane&&focus===player) craneIntro(player);
      if(EV.knockout&&KO&&KO.bannerT>0){ KO.bannerT-=uiDt; if(KO.bannerT<=0) $('#hRound').className='round'; }
      const place=standings().indexOf(player)+1, nOn=EV.knockout?koActive().length:racers.length;
      setH($('#hPos'),`${place}<small>/${nOn}</small>`);
      const danger=EV.knockout&&KO&&!KO.done&&!player.out&&countdown<=0&&place>=nOn-(koMod('double')?1:0);
      $('#hPos').classList.toggle('danger',!!danger);
      if(danger&&KO.warned!==KO.round){ KO.warned=KO.round; toast('You\'re in the knockout zone. Get out of last.'); }
      if(TAG) racers.forEach(r=>{ if(r.label&&r.team===0) r.label.visible=!r.isP; });
      boardT-=dt; if(boardT<=0&&TAG){ boardT=.25; tapeWatchStandings(); const st=standings(), proj=tagProjection(), m=player.mateR, gap=m?m.dist-player.dist:0, ready=TAG.cd<=raceT, hot=m&&!m.finished&&Math.abs(gap)<TAG_HOT;
        $('#hBoard').innerHTML=proj.map((x,k)=>`<li class="team${k===proj.length-1?' last':''}"><i class="tm" style="background:${x.t.color}"></i>${esc(x.t.name)} ${x.pts}</li>`).join('')+
          st.map((r,i)=>`<li class="${r.isP?'me':''}"><b>${i+1}</b><i class="tm" style="background:${TEAMS[r.team].color}"></i>${r.isP?'YOU':r===m?'PARTNER':esc(r.def.tag)}</li>`).join('');
        const el=$('#hTag'); el.className='tagbox on'+(hot&&ready&&countdown<=0?' hot':'');
        el.innerHTML=m?`<span>PARTNER · ${esc(m.def.name)}</span><b>${m.finished?'finished':(gap>=0?'+':'−')+Math.abs(Math.round(gap))+' m'}</b><em>${m.finished?'anchor leg':!ready?`tag in ${Math.ceil(TAG.cd-raceT)}s`:hot?'HOT TAG · T':'cold tag · T'}</em>`:''; }
      else if(boardT<=0){ boardT=.25; tapeWatchStandings(); const st=standings(); $('#hBoard').innerHTML=st.map((r,i)=>`<li class="${r.isP?'me':''}${r.out?' out':''}"><b>${i+1}</b>${r.isP?'YOU':esc(r.def.tag)}${r.out?'':(EV.knockout&&KO&&!KO.done&&countdown<=0&&i>=nOn-(koMod('double')?2:1)?'<em class="m-ko">KO</em>':(!r.isP&&r.mood&&countdown<=0?`<em class="m-${r.mood.mood}">${MOOD_TAG[r.mood.mood]}</em>`:''))}</li>`).join(''); }
      if(EV.knockout&&KO){
        if(KO.done) setT($('#hLap'),'Tournament over');
        else if(koUsesSectors()) setT($('#hLap'),`Round ${KO.round} / Sector ${KO.round} · ${nOn} left`);
        else setT($('#hLap'),`Round ${KO.round} · ${nOn} left`);
        setT($('#hGhost'),KO.done?'':KO.mod.name);
      }
      else setT($('#hLap'),`Lap ${clamp(Math.floor(Math.max(0,player.dist)/TR.L)+1,1,laps())} of ${laps()}`);
      setT($('#hTime'),fmt(raceT));
      setT($('#hSpd'),String(Math.round(player.v*2.237)));
      { const st=player.stage||0, el=$('#hStg'); if(el.dataset.s!==String(st)){ el.dataset.s=st; el.className='stg s'+st; [...el.children].forEach((c,i)=>c.classList.toggle('on',i<st)); $('#hSpd').className='s'+st; } }
      { const nw=Math.min(100,Math.round(player.nitro*1000)/10)+'%', nb=$('#hNos'); if(nb.style.width!==nw) nb.style.width=nw; nb.classList.toggle('over',player.nitro>1.001); }
      const nt=nextTurn(player), tw=$('#hTurn');
      if(nt&&countdown<=0){ const tc='turn on '+(nt.dir>0?'l':'r'); if(tw.className!==tc) tw.className=tc; setH(tw,`<i>${nt.dir>0?'‹‹‹':'›››'}</i><span>${nt.d>0?Math.round(nt.d)+' m':'now'}</span>`); } else if(tw.className!=='turn') tw.className='turn';
      const fx=[], FN=player.fxName||{}, FXL=[['fxLong','long','#b28cff'],['fxOver','over','#ffb020'],['fxSling','sling','#ff3b4a'],['fxShield','shield','#7dff9a'],['fxGrip','grip','#4f7bff'],['fxRegen','refill','#5fe6ff'],['fxNosMul','refill','#5fe6ff'],['towT','sling','#ff3b4a'],['fxJam','jam','#f2f04a'],['fxGhost','ghost','#d13bff']];
      FXL.forEach(([k,n,c])=>{ if(player[k]>0) fx.push(`<b style="color:${c}">${esc((k==='fxNosMul'?'Supercharged':k==='towT'?'Tow':FN[n])||PU_TYPES[n].label)} ${Math.ceil(player[k])}s</b>`); });
      if(player.nitro>1.001) fx.push(`<b style="color:#ffe08a">Overflow ${Math.round(player.nitro*100)}%</b>`);
      if(TAG&&player.teamDraft>raceT) fx.push('<b style="color:#f4f7ff">Team draft</b>');
      if(player.airT>.15) fx.push(`<b style="color:#9fd3ff">Air ${player.airT.toFixed(1)}s</b>`);
      setH($('#hFx'),fx.join(''));
      draw(RS);
    }
  }
  audioTick(dt);
}
requestAnimationFrame(loop);
};
/* bootstrap: the Blender-built models were already downloading (js/assets.js runs first); decode them, then start the game.
   Waits for every model so kits are there when an event is built, but only gives up after 8 s with NO new bytes (30 s cap). */
(function(){ const A=window.AH_ASSETS; let started=false; const go=()=>{ if(started) return; started=true; if(A) A.gameBooted=true; window.AFTERHOURS_BOOT(); };
  window.AH_MODELS=window.AH_MODELS||{};
  if(!A||!THREE.GLTFLoader||location.protocol==='file:'){ go(); return; }
  const t0=performance.now(), watch=setInterval(()=>{ const now=performance.now(); if(started||now-A.lastByteAt>8000||now-t0>30000){ clearInterval(watch); go(); } },500);
  window.AH_MODELS_LOD=window.AH_MODELS_LOD||{};
  A.load((k,scene,isLod)=>{ if(isLod){ window.AH_MODELS_LOD[k]=scene; return; } window.AH_MODELS[k]=scene; if(started&&window.AH_MODEL_READY) window.AH_MODEL_READY(k); }).then(()=>{ clearInterval(watch); go(); });
})();
