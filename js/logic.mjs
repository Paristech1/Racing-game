/**
 * Pure game logic shared by unit tests (and optionally the browser build).
 * Keep in sync with the matching helpers in afterhours.js when changing behavior.
 */

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;

export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function fmt(t) {
  if (!(t > 0) || !isFinite(t)) return '0:00.0';
  const m = Math.floor(t / 60);
  const s = t - m * 60;
  return m + ':' + (s < 10 ? '0' : '') + s.toFixed(1);
}

export function esc(s) {
  return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

export function lapsForEvent(ev, defaultLaps = 2) {
  return (ev && ev.laps) || defaultLaps;
}

/** Preset grid sizes offered before a race (player included). Knockout ignores these. */
export const FIELD_SIZE_PRESETS = [4, 7, 10, 12, 15, 20];

export function maxRaceFieldSize(cars) {
  return cars.filter(c => !c.outlaw).length;
}

export function clampFieldSize(n, max) {
  const cap = Math.max(4, max);
  const v = Math.round(n);
  const base = Number.isFinite(v) && v > 0 ? v : 7;
  return Math.max(4, Math.min(cap, base));
}

/** Preset buttons for the event screen; always includes the archive max when it is not already listed. */
export function fieldSizeChoices(max) {
  const cap = Math.max(4, max);
  const out = FIELD_SIZE_PRESETS.filter(v => v <= cap);
  if (!out.length || out[out.length - 1] !== cap) out.push(cap);
  return out;
}

/** Grid size for one level (player included). Uses save.fieldBy[eventId], then legacy fieldN, then ev.defaultField, then 7. */
export function fieldSizeForEvent(ev, save, maxCars) {
  if (ev && ev.knockout) return 12;
  const cap = Math.max(4, maxCars);
  const by = (save && save.fieldBy) || {};
  let n = by[ev && ev.id];
  if (n == null && save && save.fieldN != null) n = save.fieldN;
  if (n == null && ev && ev.defaultField != null) n = ev.defaultField;
  return clampFieldSize(n, cap);
}

/** @deprecated use fieldSizeForEvent */
export function fieldSizeForRace(ev, savedN, maxCars) {
  return fieldSizeForEvent(ev, { fieldN: savedN }, maxCars);
}

export function histRecord(save, id) {
  const h = save[id] || (save[id] = { runs: 0, wins: 0, hits: 0, last: 0 });
  if (!h.bestBy) {
    h.bestBy = {};
    if (h.best) h.bestBy.tunnel = h.best;
  }
  return h;
}

function rivalChassisEligible(c, rivalBoss) {
  if (c.outlaw) return false;
  if (
    (c.id === 'overload' || c.id === 'volcano' || c.id === 'zephyr' || c.id === 'hikari') &&
    !rivalBoss
  )
    return false;
  return true;
}

export function buildRivalForEvent(rival, eventId, taken, cars, eventCarBias, rivalCarPref, options = {}) {
  const eb = eventCarBias[eventId] || eventCarBias.tunnel;
  const rp = rivalCarPref[rival.id] || {};
  const rivalBoss = options.rivalBoss === true;
  const rand = options.random || Math.random;
  let best = null;
  let bestSc = -1e9;
  for (const c of cars) {
    if (taken.includes(c.id)) continue;
    if (!rivalChassisEligible(c, rivalBoss)) continue;
    const pref = rp.ids && rp.ids.includes(c.id) ? 9 : 0;
    const sc =
      c.grip * (eb.gripW || 1) * (rp.gripW || 1) +
      c.top * (eb.topW || 1) * (rp.topW || 1) +
      c.nitro * 18 * (eb.nitroW || 1) * (rp.nitroW || 1) +
      pref +
      rand() * 4;
    if (sc > bestSc) {
      bestSc = sc;
      best = c;
    }
  }
  const base =
    best ||
    cars.find(c => !taken.includes(c.id) && rivalChassisEligible(c, rivalBoss)) ||
    cars.find(c => rivalChassisEligible(c, rivalBoss)) ||
    cars[0];
  taken.push(base.id);
  return Object.assign({}, base, {
    id: rival.id,
    chassisId: base.id,
    tag: rival.tag,
    color: rival.color,
    car: base.name,
    P: rival.P,
    mass: (rival.P.mass || 1) * (base.mass || 1),
    rivalNote: base.rival,
  });
}

export function scorePickup(r, p, P, s0, L) {
  if (p.cd > 0) return -999;
  if (p.carId && (r.def.chassisId || r.def.id) !== p.carId) return -999;
  if (p.lastOnly || p.lastTwo) return -999;
  let dd = p.s - s0;
  if (dd < 0) dd += L;
  if (dd < 5 || dd > 72) return -999;
  const lat = Math.abs(p.x - r.x);
  const det = lat * 1.35 + dd * 0.045;
  let val = P.seek * 12;
  if (p.type === 'refill' && r.nitro > 0.82) val -= 9;
  if (p.type === 'long' && (P.nitro === 'pass' || P.nitro === 'reserve')) val += 2.5;
  if (p.type === 'over' && (P.nitro === 'eager' || P.nitro === 'burst')) val += 3;
  if (r.nitro < 0.35) val += 4;
  if (p.type === 'desperate' || p.type === 'echoboost') val += 14;
  if (p.type === 'wispflux' || p.type === 'stratossurge' || p.type === 'tempest') val += 6;
  if (r.def.id === 'wild') val += 2;
  if (r.def.id === 'apex' && lat > 3.2) val -= 3;
  return val - det * (1.1 - P.risk * 0.35);
}

export function kfCR(keys, z) {
  let i = 0;
  while (i < keys.length - 2 && z > keys[i + 1][0]) i++;
  const p0 = keys[Math.max(0, i - 1)];
  const p1 = keys[i];
  const p2 = keys[i + 1];
  const p3 = keys[Math.min(keys.length - 1, i + 2)];
  const t = clamp((z - p1[0]) / (p2[0] - p1[0]), 0, 1);
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1[1] +
      (-p0[1] + p2[1]) * t +
      (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
      (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
  );
}

export class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  distanceTo(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }
  crossVectors(a, b) {
    const ax = a.x;
    const ay = a.y;
    const az = a.z;
    const bx = b.x;
    const by = b.y;
    const bz = b.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }
  normalize() {
    const len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z) || 1;
    this.x /= len;
    this.y /= len;
    this.z /= len;
    return this;
  }
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }
  addScaledVector(v, s) {
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;
    return this;
  }
  lerpVectors(a, b, t) {
    this.x = a.x + (b.x - a.x) * t;
    this.y = a.y + (b.y - a.y) * t;
    this.z = a.z + (b.z - a.z) * t;
    return this;
  }
}

const UP = new Vec3(0, 1, 0);

export function makeTrack(pts, W, H) {
  const N = pts.length;
  let L = 0;
  for (let i = 0; i < N; i++) L += pts[i].distanceTo(pts[(i + 1) % N]);
  const ds = L / N;
  const T = [];
  const R = [];
  const K = [];
  const raw = [];
  for (let i = 0; i < N; i++) {
    T.push(new Vec3().subVectors(pts[(i + 1) % N], pts[(i - 1 + N) % N]).normalize());
  }
  for (let i = 0; i < N; i++) {
    R.push(new Vec3().crossVectors(T[i], UP).normalize());
  }
  for (let i = 0; i < N; i++) {
    const a = T[(i - 1 + N) % N];
    const b = T[(i + 1) % N];
    raw.push(-Math.atan2(a.x * b.z - a.z * b.x, a.x * b.x + a.z * b.z) / (2 * ds));
  }
  const win = Math.max(4, Math.round(12 / ds));
  for (let i = 0; i < N; i++) {
    let s = 0;
    for (let j = -win; j <= win; j++) s += raw[(i + j + N) % N];
    K.push(s / (2 * win + 1));
  }
  let bi = 0;
  for (let k = 0; k < N; k++) if (Math.abs(K[k]) > Math.abs(K[bi])) bi = k;
  const kb = K[bi];
  if (Math.abs(kb) > 1e-6) {
    const cA = new Vec3().copy(pts[bi]).addScaledVector(R[bi], -1 / kb);
    const cB = new Vec3().copy(pts[bi]).addScaledVector(R[bi], 1 / kb);
    const mid = pts[(bi + Math.round(8 / ds)) % N];
    if (mid.distanceTo(cB) < mid.distanceTo(cA)) for (let k = 0; k < N; k++) K[k] = -K[k];
  }
  return { pts, T, R, K, L, N, ds, W, H };
}

export function frame(s, o, tr) {
  const L = tr.L;
  const N = tr.N;
  s = ((s % L) + L) % L;
  const f = (s / L) * N;
  const i = Math.floor(f) % N;
  const a = f - Math.floor(f);
  const j = (i + 1) % N;
  o.p.lerpVectors(tr.pts[i], tr.pts[j], a);
  o.t.lerpVectors(tr.T[i], tr.T[j], a).normalize();
  o.r.lerpVectors(tr.R[i], tr.R[j], a).normalize();
  o.k = tr.K[i] * (1 - a) + tr.K[j] * a;
  return o;
}

export function mkFrame() {
  return { p: new Vec3(), t: new Vec3(), r: new Vec3(), k: 0 };
}

export function koUsesSectors(ev, trackLength) {
  return !!(ev && ev.knockout && trackLength > 2500);
}

export function koCheckpoint(round, trackLength, useSectors) {
  const L = trackLength;
  return useSectors ? round * (L / 11) : round * L;
}

export function koPick(n, koState, mods, finalMod, random = Math.random) {
  if (n === 2) return finalMod;
  const pool = mods.filter(
    m =>
      m.id !== koState.lastId &&
      (!m.min || n >= m.min) &&
      !(koState.round === 1 && (m.id === 'double' || m.id === 'bomb'))
  );
  return pool[Math.floor(random() * pool.length)];
}

export function eventAiBias(evOpen) {
  return evOpen
    ? { straight: 1.06, tight: 0.93, line: 0.85 }
    : { straight: 0.97, tight: 1.06, line: 1.12 };
}

/* WEAVER lane choice: the lane with the most open road ahead, with a small pull toward where it already is.
   Duplicated in logic.mjs for the unit tests. */
export function pickClearLane(lanes,obs,s0,L,span,x0){
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
export const NEW_PU_SPOTS=[['jam',.16,-2.4],['slick',.36,2.4],['payback',.6,-2.4],['ghost',.8,2.4]];
export function autoPickupSpots(list,L){
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

/* Which loader startLoading() must use: a knockout event keeps the Gauntlet map the player picked. */
export function resolveEventForStart(ev,koMap){ return ev&&ev.knockout?{bindKo:true,koMap:koMap}:{bindKo:false}; }
