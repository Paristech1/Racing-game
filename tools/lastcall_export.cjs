// Exports Event 16 Last Call's geometry straight from js/afterhours.js (the game is the source of truth): the lap with its
// loops, the four shortcut branches, sectors and per-branch checks. Writes docs/lastcall/layout.json for
// tools/lastcall_design.py (plan, profile, course sheet). Needs the three@0.128.0 package: THREE_PKG=<dir> (default
// /home/claude/vendor/package, `npm pack three@0.128.0`). usage: node tools/lastcall_export.cjs
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), PKG = process.env.THREE_PKG || '/home/claude/vendor/package';
global.THREE = require(path.join(PKG, 'build/three.js'));
const js = fs.readFileSync(path.join(ROOT, 'js/afterhours.js'), 'utf8');
const grab = name => { const a = js.indexOf('function ' + name + '('); if (a < 0) throw new Error(name); let i = js.indexOf('{', a), d = 0; for (; i < js.length; i++) { if (js[i] == '{') d++; else if (js[i] == '}') { d--; if (!d) break; } } return js.slice(a, i + 1); };
const cst = name => { const a = js.indexOf('const ' + name + '='); return js.slice(a, js.indexOf('];', a) + 2); };
let src = 'const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)); const lerp=(a,b,t)=>a+(b-a)*t; const UP=new THREE.Vector3(0,1,0);\nconst mkF=()=>({p:new THREE.Vector3(),t:new THREE.Vector3(),r:new THREE.Vector3(),u:new THREE.Vector3(0,1,0),k:0});\n';
src += ['makeTrack', 'frame', 'filletPath', 'resample3', 'inLoop', 'lcHeights', 'lcLoopPts', 'lcResample', 'lcGeometry', 'lcBranch'].map(grab).join('\n');
src += '\n' + ['LC_CORNERS', 'LC_KEYS', 'LC_LOOPS', 'LC_BRANCHES', 'LC_DROPS'].map(cst).join('\n') + '\n' + js.slice(js.indexOf('const LC_TABLES='), js.indexOf('}};', js.indexOf('const LC_TABLES=')) + 3) + '\nmodule.exports={lcGeometry,makeTrack,lcBranch,frame,mkF,LC_BRANCHES,LC_DROPS,LC_TABLES};';
const tmp = path.join(require('os').tmpdir(), 'lastcall_mod.cjs'); fs.writeFileSync(tmp, src);
const M = require(tmp), G = M.lcGeometry(), tr = M.makeTrack(G.pts, 7, 6.5, { up: G.up }), f = M.mkF();
const r1 = v => Math.round(v * 10) / 10;
const near = (x, z) => { let bi = 0, bd = 1e18; for (let i = 0; i < tr.N; i++) { const p = tr.pts[i], d = (p.x - x) ** 2 + (p.z - z) ** 2; if (d < bd) { bd = d; bi = i; } } return Math.round(bi * tr.ds); };
const SECTORS = [['Center City', 0, 20], ['Ben Franklin Bridge', 770, -300], ['Camden', 1990, -300], ['Harbor Line Tunnel', 2040, -762], ['Port Richmond', 905, -1205],
  ['Roosevelt Blvd', 940, -2500], ['Hunting Park', -500, -2500], ['Mt Airy', -1000, -2502], ['Wissahickon', -1470, -1932], ['Kelly Drive', -660, -1720], ['Parkway', -300, -470]];
const branches = M.LC_BRANCHES.map(sp => { const b = M.lcBranch(tr, sp), bt = b.tr; let kmax = 0; for (let i = 0; i < bt.N; i++) kmax = Math.max(kmax, Math.abs(bt.K[i]));
  let clear = 1e9; for (let i = b.peel + 5; i < bt.N - b.peel - 5; i += 2) { const p = bt.pts[i]; for (let k = 0; k < tr.N; k += 2) { const q = tr.pts[k]; if (Math.abs(q.y - p.y) > 5) continue; clear = Math.min(clear, Math.hypot(q.x - p.x, q.z - p.z)); } }
  M.frame(b.s0, f, tr); const a0 = bt.T[0].angleTo(f.t) * 57.3; M.frame(b.s1, f, tr); const a1 = bt.T[bt.N - 1].angleTo(f.t) * 57.3;
  const main = ((b.s1 - b.s0) % tr.L + tr.L) % tr.L;
  return { id: b.id, name: b.name, side: b.side > 0 ? 'right' : 'left', s0: Math.round(b.s0), s1: Math.round(b.s1), L: Math.round(bt.L), main: Math.round(main), save: Math.round(main - bt.L), minR: Math.round(1 / kmax),
    clearance: r1(clear), endAngles: [r1(a0), r1(a1)], ymin: r1(Math.min(...bt.pts.map(p => p.y))), pts: bt.pts.filter((p, i) => i % 4 == 0).map(p => [r1(p.x), r1(p.y), r1(p.z)]) }; });
const out = { L: Math.round(tr.L), loops: tr.loops.map(([a, b], i) => { let h = 0; for (let k = Math.round(a); k < b; k++) h = Math.max(h, tr.pts[k].y - tr.pts[Math.round(a)].y); return { name: ['THE HALO', 'THE RING'][i], s0: Math.round(a), s1: Math.round(b), h: r1(h) }; }),
  sectors: SECTORS.map(([n, x, z]) => ({ name: n, s: near(x, z) })).sort((a, b) => a.s - b.s), branches,
  plan: tr.pts.filter((p, i) => i % 6 == 0).map((p, i) => [r1(p.x), Math.round(p.y * 100) / 100, r1(p.z), Math.round(tr.K[i * 6] * 1e4) / 1e4]) };
out.sectors.forEach((s, i, a) => { s.len = ((a[(i + 1) % a.length].s - s.s) % out.L + out.L) % out.L; });
const secAt = s => { let n = out.sectors[out.sectors.length - 1].name; out.sectors.forEach(x => { if (x.s <= s) n = x.name; }); return n; };
out.tables = M.LC_TABLES;
out.drops = M.LC_DROPS.map(d => { if (typeof d[0] === 'string') { const lp = out.loops[d[0] === 'HALO' ? 0 : 1]; return { style: d[1], n: d[2].length, slots: d[3], s: lp.s0, where: 'top of ' + lp.name }; }
  const br = d[5] && [1, 2, 4].includes(d[5]) ? branches[M.LC_BRANCHES.findIndex(b => b.id === d[5])] : null, s = br ? br.s0 : near(d[0], d[1]);
  return { style: d[2], n: d[3].length, slots: d[4], s, where: br ? br.name : secAt(s) }; }).sort((a, b) => a.s - b.s);
fs.writeFileSync(path.join(ROOT, 'docs/lastcall/layout.json'), JSON.stringify(out));
console.log('lap', out.L, 'm; loops', JSON.stringify(out.loops)); branches.forEach(b => console.log(b.name.padEnd(16), 'saves', b.save, 'm, min R', b.minR, 'm, clear', b.clearance, 'm, end angles', b.endAngles.join('/'), 'deg'));
