import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildRivalForEvent,
  clamp,
  esc,
  eventAiBias,
  fmt,
  frame,
  histRecord,
  kfCR,
  koCheckpoint,
  koPick,
  koUsesSectors,
  clampFieldSize,
  fieldSizeChoices,
  fieldSizeForRace,
  lapsForEvent,
  maxRaceFieldSize,
  lerp,
  makeTrack,
  mkFrame,
  NEW_PU_SPOTS,
  autoPickupSpots,
  pickClearLane,
  resolveEventForStart,
  rng,
  scorePickup,
  Vec3,
} from '../js/logic.mjs';
import { APEX_RIVAL, EVENT_CAR_BIAS, KO_FINAL, KO_MODS, RIVAL_CAR_PREF, TEST_CARS } from './fixtures.mjs';

describe('clamp / lerp / rng', () => {
  it('clamp pins values inside range', () => {
    assert.equal(clamp(5, 0, 10), 5);
    assert.equal(clamp(-1, 0, 10), 0);
    assert.equal(clamp(99, 0, 10), 10);
  });

  it('lerp interpolates endpoints', () => {
    assert.equal(lerp(0, 10, 0), 0);
    assert.equal(lerp(0, 10, 1), 10);
    assert.equal(lerp(0, 10, 0.5), 5);
  });

  it('rng is deterministic for a seed', () => {
    const a = rng(42);
    const b = rng(42);
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    assert.deepEqual(seqA, seqB);
    assert.ok(seqA.every(v => v >= 0 && v < 1));
  });

  it('different seeds produce different sequences', () => {
    const seq = n => {
      const r = rng(n);
      return [r(), r(), r(), r()];
    };
    assert.notDeepEqual(seq(1), seq(2));
  });

  it('seed 0 is not a constant stream', () => {
    const r = rng(0);
    const vals = [r(), r(), r(), r(), r()];
    assert.ok(new Set(vals).size > 1, 'rng(0) should vary across calls');
  });
});

describe('fmt / esc', () => {
  it('formats race times like the HUD', () => {
    assert.equal(fmt(0), '0:00.0');
    assert.equal(fmt(-3), '0:00.0');
    assert.equal(fmt(65.25), '1:05.3');
    assert.equal(fmt(9.04), '0:09.0');
  });

  it('escapes HTML in UI strings', () => {
    assert.equal(esc('a & b'), 'a &amp; b');
    assert.equal(esc('<script>'), '&lt;script&gt;');
  });
});

describe('field size / grid picker', () => {
  const stubCars = [{ id: 'a' }, { id: 'b' }, { id: 'c', outlaw: true }, { id: 'd' }];

  it('maxRaceFieldSize skips outlaw cars', () => {
    assert.equal(maxRaceFieldSize(stubCars), 3);
  });

  it('clampFieldSize pins to 4..max', () => {
    assert.equal(clampFieldSize(7, 20), 7);
    assert.equal(clampFieldSize(99, 20), 20);
    assert.equal(clampFieldSize(2, 20), 4);
    assert.equal(clampFieldSize(undefined, 20), 7);
  });

  it('fieldSizeChoices adds archive max when missing from presets', () => {
    assert.deepEqual(fieldSizeChoices(20), [4, 7, 10, 12, 15, 20]);
    assert.deepEqual(fieldSizeChoices(23), [4, 7, 10, 12, 15, 20, 23]);
  });

  it('fieldSizeForRace locks knockout at 12', () => {
    assert.equal(fieldSizeForRace({ knockout: true }, 7, 23), 12);
    assert.equal(fieldSizeForRace({ id: 'blvd' }, 15, 23), 15);
  });
});

describe('lapsForEvent / histRecord', () => {
  it('uses event laps when set', () => {
    assert.equal(lapsForEvent({ laps: 3 }), 3);
    assert.equal(lapsForEvent({}), 2);
    assert.equal(lapsForEvent(null, 5), 5);
  });

  it('migrates legacy best lap into bestBy.tunnel', () => {
    const save = { kage: { runs: 1, best: 42.5 } };
    const h = histRecord(save, 'kage');
    assert.equal(h.bestBy.tunnel, 42.5);
    assert.equal(save.kage, h);
  });

  it('does not overwrite an existing bestBy entry', () => {
    const save = { tunnel: { runs: 2, bestBy: { tunnel: 40.1, blvd: 55 } } };
    const h = histRecord(save, 'tunnel');
    assert.equal(h.bestBy.tunnel, 40.1);
    assert.equal(h.bestBy.blvd, 55);
  });

  it('creates default stats for a brand-new id', () => {
    const save = {};
    const h = histRecord(save, 'newid');
    assert.equal(h.runs, 0);
    assert.equal(h.wins, 0);
    assert.equal(h.hits, 0);
    assert.equal(h.last, 0);
    assert.deepEqual(h.bestBy, {});
    assert.equal(save.newid, h);
  });
});

describe('buildRivalForEvent', () => {
  it('never assigns outlaw or boss-only cars without rivalBoss', () => {
    const rand = rng(7);
    for (let i = 0; i < 20; i++) {
      const taken = [];
      const r = buildRivalForEvent(
        APEX_RIVAL,
        'tunnel',
        taken,
        TEST_CARS,
        EVENT_CAR_BIAS,
        RIVAL_CAR_PREF,
        { random: rand }
      );
      assert.notEqual(r.chassisId, 'hellbound');
      assert.notEqual(r.chassisId, 'zephyr');
    }
    const exhausted = ['kage', 'vanta'];
    const fallback = buildRivalForEvent(
      APEX_RIVAL,
      'tunnel',
      exhausted,
      TEST_CARS,
      EVENT_CAR_BIAS,
      RIVAL_CAR_PREF,
      { random: () => 0 }
    );
    assert.notEqual(fallback.chassisId, 'hellbound');
    assert.notEqual(fallback.chassisId, 'zephyr');
  });

  it('preserves rival persona id and tag on the chassis', () => {
    const taken = [];
    const r = buildRivalForEvent(
      APEX_RIVAL,
      'tunnel',
      taken,
      TEST_CARS.filter(c => !c.outlaw && c.id !== 'zephyr'),
      EVENT_CAR_BIAS,
      RIVAL_CAR_PREF,
      { random: () => 0 }
    );
    assert.equal(r.id, 'apex');
    assert.equal(r.tag, 'APEX');
    assert.ok(r.chassisId === 'vanta' || r.chassisId === 'kage');
  });

  it('rivalBoss allows boss-only chassis like zephyr', () => {
    const taken = [];
    const cars = [
      { id: 'kage', name: 'KAGE', grip: 30, top: 90, nitro: 1, mass: 1, rival: 'note' },
      { id: 'zephyr', name: 'ZEPHYR', grip: 31, top: 429, nitro: 1.45, mass: 0.22, rival: 'note' },
    ];
    const r = buildRivalForEvent(
      APEX_RIVAL,
      'tunnel',
      taken,
      cars,
      EVENT_CAR_BIAS,
      RIVAL_CAR_PREF,
      { rivalBoss: true, random: () => 0 }
    );
    assert.equal(r.chassisId, 'zephyr');
  });

  it('preferred car ids win ties on score', () => {
    const twinA = { id: 'plain', name: 'PLAIN', grip: 30, top: 90, nitro: 1, mass: 1, rival: 'note' };
    const twinB = { id: 'vanta', name: 'VANTA', grip: 30, top: 90, nitro: 1, mass: 1, rival: 'note' };
    const taken = [];
    const r = buildRivalForEvent(
      APEX_RIVAL,
      'tunnel',
      taken,
      [twinA, twinB],
      EVENT_CAR_BIAS,
      RIVAL_CAR_PREF,
      { random: () => 0 }
    );
    assert.equal(r.chassisId, 'vanta');
  });

  it('pushes chosen chassis id onto taken', () => {
    const taken = ['kage'];
    buildRivalForEvent(
      APEX_RIVAL,
      'tunnel',
      taken,
      TEST_CARS.filter(c => !c.outlaw && c.id !== 'zephyr'),
      EVENT_CAR_BIAS,
      RIVAL_CAR_PREF,
      { random: () => 0 }
    );
    assert.equal(taken.length, 2);
    assert.ok(taken.includes('kage'));
    assert.notEqual(taken[1], 'kage');
  });

  it('mass is rival P.mass times chassis mass', () => {
    const taken = [];
    const r = buildRivalForEvent(
      { ...APEX_RIVAL, P: { ...APEX_RIVAL.P, mass: 2 } },
      'tunnel',
      taken,
      [{ id: 'zephyr', name: 'ZEPHYR', grip: 31, top: 429, nitro: 1.45, mass: 0.5, rival: 'note' }],
      EVENT_CAR_BIAS,
      RIVAL_CAR_PREF,
      { rivalBoss: true, random: () => 0 }
    );
    assert.equal(r.mass, 1);
  });
});

describe('scorePickup', () => {
  const P = { seek: 0.5, risk: 1, nitro: 'exit' };
  const racer = { def: { id: 'apex', chassisId: 'kage' }, x: 0, nitro: 0.2 };

  it('rejects pickups on cooldown or wrong car', () => {
    assert.equal(scorePickup(racer, { cd: 1, s: 20, x: 0, type: 'refill' }, P, 0, 100), -999);
    assert.equal(
      scorePickup(racer, { cd: 0, s: 20, x: 0, type: 'refill', carId: 'noctis' }, P, 0, 100),
      -999
    );
  });

  it('scores nearby desperate pickups higher than distant refill', () => {
    const near = scorePickup(racer, { cd: 0, s: 30, x: 0.5, type: 'desperate' }, P, 0, 200);
    const far = scorePickup(racer, { cd: 0, s: 30, x: 8, type: 'refill' }, P, 0, 200);
    assert.ok(near > far);
  });

  it('wraps distance along track length', () => {
    const ahead = scorePickup(racer, { cd: 0, s: 10, x: 0, type: 'long' }, P, 195, 200);
    assert.ok(ahead > -999);
  });

  it('rejects lastOnly and lastTwo pickups', () => {
    const base = { cd: 0, s: 30, x: 0, type: 'long' };
    assert.equal(scorePickup(racer, { ...base, lastOnly: true }, P, 0, 200), -999);
    assert.equal(scorePickup(racer, { ...base, lastTwo: true }, P, 0, 200), -999);
  });

  it('enforces along-track distance window (5–72 m)', () => {
    const base = { cd: 0, x: 0, type: 'long' };
    assert.equal(scorePickup(racer, { ...base, s: 4.9 }, P, 0, 200), -999);
    assert.ok(scorePickup(racer, { ...base, s: 5 }, P, 0, 200) > -999);
    assert.ok(scorePickup(racer, { ...base, s: 72 }, P, 0, 200) > -999);
    assert.equal(scorePickup(racer, { ...base, s: 72.1 }, P, 0, 200), -999);
  });

  it('penalizes refill when nitro is already high', () => {
    const p = { cd: 0, s: 30, x: 0, type: 'refill' };
    const low = { ...racer, nitro: 0.5 };
    const high = { ...racer, nitro: 0.9 };
    const lowSc = scorePickup(low, p, P, 0, 200);
    const highSc = scorePickup(high, p, P, 0, 200);
    assert.equal(lowSc - highSc, 9);
  });

  it('apex loses value when far off the racing line', () => {
    const apexRacer = { def: { id: 'apex', chassisId: 'kage' }, x: 0, nitro: 0.5 };
    const wildRacer = { def: { id: 'wild', chassisId: 'kage' }, x: 0, nitro: 0.5 };
    const pu = { cd: 0, s: 30, x: 4, type: 'long' };
    const apexSc = scorePickup(apexRacer, pu, P, 0, 200);
    const wildSc = scorePickup(wildRacer, pu, P, 0, 200);
    assert.equal(wildSc - apexSc, 5);
  });

  it('wildcard persona gets a flat +2 bonus', () => {
    const wild = { def: { id: 'wild', chassisId: 'kage' }, x: 0, nitro: 0.5 };
    const apex = { def: { id: 'apex', chassisId: 'kage' }, x: 0, nitro: 0.5 };
    const pu = { cd: 0, s: 30, x: 0, type: 'long' };
    assert.equal(scorePickup(wild, pu, P, 0, 200) - scorePickup(apex, pu, P, 0, 200), 2);
  });
});

describe('kfCR', () => {
  it('interpolates through keyframes', () => {
    const keys = [[0, 0], [1, 10], [2, 0]];
    assert.equal(kfCR(keys, 0), 0);
    assert.equal(kfCR(keys, 1), 10);
    const mid = kfCR(keys, 0.5);
    assert.ok(mid > 0 && mid < 10);
  });
});

describe('makeTrack / frame', () => {
  it('closes the loop and wraps distance', () => {
    const pts = [new Vec3(0, 0, 0), new Vec3(50, 0, 0), new Vec3(50, 0, 50), new Vec3(0, 0, 50)];
    const tr = makeTrack(pts, 12, 0);
    assert.ok(tr.L > 0);
    assert.equal(tr.N, 4);
    const o = mkFrame();
    frame(0, o, tr);
    const start = o.p.x + o.p.z;
    frame(tr.L, o, tr);
    const end = o.p.x + o.p.z;
    assert.ok(Math.abs(start - end) < 0.01);
  });

  it('handles negative distance via modulo', () => {
    const pts = [new Vec3(0, 0, 0), new Vec3(40, 0, 0)];
    const tr = makeTrack(pts, 10, 0);
    const a = mkFrame();
    const b = mkFrame();
    frame(-5, a, tr);
    frame(tr.L - 5, b, tr);
    assert.ok(Math.abs(a.p.x - b.p.x) < 0.01);
  });

  it('curvature sign follows loop direction (CCW left / CW right)', () => {
    const N = 32;
    const R = 50;
    const ccw = [];
    for (let i = 0; i < N; i++) {
      const t = (-i / N) * 2 * Math.PI;
      ccw.push(new Vec3(R * Math.cos(t), 0, R * Math.sin(t)));
    }
    const cw = [...ccw].reverse();
    const trCCW = makeTrack(ccw, 12, 0);
    const trCW = makeTrack(cw, 12, 0);
    const sumK = tr => tr.K.reduce((s, k) => s + k, 0);
    assert.ok(sumK(trCCW) > 0);
    assert.ok(sumK(trCW) < 0);
  });

  it('wraps multi-lap distance (e.g. 3.5 laps)', () => {
    const pts = [new Vec3(0, 0, 0), new Vec3(50, 0, 0), new Vec3(50, 0, 50), new Vec3(0, 0, 50)];
    const tr = makeTrack(pts, 12, 0);
    const half = mkFrame();
    const many = mkFrame();
    frame(0.5 * tr.L, half, tr);
    frame(3.5 * tr.L, many, tr);
    assert.ok(Math.abs(half.p.x - many.p.x) < 0.05);
    assert.ok(Math.abs(half.p.z - many.p.z) < 0.05);
  });
});

describe('knockout helpers', () => {
  it('koUsesSectors only on long knockout tracks', () => {
    assert.equal(koUsesSectors({ knockout: true }, 3000), true);
    assert.equal(koUsesSectors({ knockout: true }, 2000), false);
    assert.equal(koUsesSectors({ knockout: false }, 9000), false);
    assert.equal(koUsesSectors({ knockout: true }, 2500), false);
    assert.equal(koUsesSectors({ knockout: true }, 2501), true);
  });

  it('koCheckpoint splits long maps into eleven sectors', () => {
    assert.equal(koCheckpoint(3, 3300, true), 900);
    assert.equal(koCheckpoint(2, 1200, false), 2400);
  });

  it('koCheckpoint supports half-round marks for Time Bomb', () => {
    assert.equal(koCheckpoint(2.5, 3300, true), 750);
    assert.equal(koCheckpoint(1.5, 1000, false), 1500);
  });

  it('koPick returns final duel for two cars', () => {
    assert.equal(koPick(2, { round: 5, lastId: 'clean' }, KO_MODS, KO_FINAL).id, 'final');
  });

  it('koPick never repeats the previous mod and blocks bomb/double on round 1', () => {
    const state = { round: 1, lastId: 'clean' };
    for (let i = 0; i < 50; i++) {
      const mod = koPick(8, state, KO_MODS, KO_FINAL, rng(100 + i));
      assert.notEqual(mod.id, 'clean');
      assert.notEqual(mod.id, 'double');
      assert.notEqual(mod.id, 'bomb');
    }
  });
});

describe('eventAiBias', () => {
  it('favors straights on open courses', () => {
    const open = eventAiBias(true);
    const tight = eventAiBias(false);
    assert.ok(open.straight > tight.straight);
    assert.ok(open.tight < tight.tight);
  });
});

describe('pickClearLane (WEAVER)', () => {
  const lanes = [-5.2, -2.6, 0, 2.6, 5.2];
  const L = 2000;

  it('takes the open lane when traffic blocks the others', () => {
    const obs = [-5.2, -2.6, 0, 5.2].map(x => ({ dist: 30, x }));
    assert.equal(pickClearLane(lanes, obs, 0, L, 70, 0), 2.6);
  });

  it('stays put on an empty road', () => {
    assert.equal(pickClearLane(lanes, [], 0, L, 70, 2.6), 2.6);
  });

  it('prefers the lane whose blocker is farthest away', () => {
    const obs = [{ dist: 20, x: -2.6 }, { dist: 60, x: 2.6 }, { dist: 25, x: 0 }, { dist: 25, x: -5.2 }, { dist: 25, x: 5.2 }];
    assert.equal(pickClearLane(lanes, obs, 0, L, 70, 0), 2.6);
  });

  it('sees obstacles across the start/finish wrap', () => {
    const obs = [{ dist: 10, x: 0 }, { dist: 10, x: -2.6 }, { dist: 10, x: 2.6 }, { dist: 10, x: -5.2 }];
    assert.equal(pickClearLane(lanes, obs, L - 20, L, 70, 0), 5.2);
  });

  it('ignores cars behind and cars too close to count as ahead', () => {
    const obs = [{ dist: -30, x: 0 }, { dist: 2, x: 0 }];
    assert.equal(pickClearLane(lanes, obs, 0, L, 70, 0), 0);
  });
});

describe('autoPickupSpots (new power-up gems)', () => {
  it('adds all four new gems to an empty map', () => {
    const out = autoPickupSpots([], 2000);
    assert.deepEqual(out.map(i => i[2]).sort(), ['ghost', 'jam', 'payback', 'slick']);
    for (const [s] of out) assert.ok(s >= 0 && s < 2000);
  });

  it('does not touch the original list or duplicate a type that is already placed', () => {
    const base = [[100, 3, 'jam']];
    const out = autoPickupSpots(base, 2000);
    assert.equal(base.length, 1);
    assert.equal(out.filter(i => i[2] === 'jam').length, 1);
    assert.equal(out.length, 4);
  });

  it('keeps new gems at least 45 m from every other gem, including across the lap wrap', () => {
    const L = 1500;
    const base = [];
    for (const [, f] of NEW_PU_SPOTS) base.push([L * f, 0, 'refill']);
    base.push([L - 10, 0, 'refill']);
    const out = autoPickupSpots(base, L);
    const added = out.slice(base.length);
    assert.equal(added.length, 4);
    for (const a of added) {
      for (const o of out) {
        if (o === a) continue;
        const d = Math.abs(o[0] - a[0]);
        assert.ok(Math.min(d, L - d) >= 45, `${a[2]} sits ${Math.min(d, L - d)} m from ${o[2]}`);
      }
    }
  });
});

describe("resolveEventForStart", () => {
  it("knockout events rebind the picked Gauntlet map instead of setEvent", () => {
    assert.deepEqual(resolveEventForStart({ knockout: true }, 2), { bindKo: true, koMap: 2 });
  });
  it("normal events use setEvent", () => {
    assert.deepEqual(resolveEventForStart({ id: "dockside" }, 2), { bindKo: false });
    assert.deepEqual(resolveEventForStart(undefined, 1), { bindKo: false });
  });
});
