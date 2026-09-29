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
  lapsForEvent,
  lerp,
  makeTrack,
  mkFrame,
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

  it('rounds to one decimal before padding seconds (9.96 → 0:10.0)', () => {
    assert.equal(fmt(9.96), '0:10.0');
  });

  it('carries rounded seconds into minutes (59.96 → 1:00.0)', () => {
    assert.equal(fmt(59.96), '1:00.0');
  });

  it('escapes quotes for safe HTML attribute use', () => {
    assert.equal(esc('a "b" \'c\''), 'a &quot;b&quot; &#39;c&#39;');
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
});

describe('kfCR', () => {
  it('interpolates through keyframes', () => {
    const keys = [[0, 0], [1, 10], [2, 0]];
    assert.equal(kfCR(keys, 0), 0);
    assert.equal(kfCR(keys, 1), 10);
    const mid = kfCR(keys, 0.5);
    assert.ok(mid > 0 && mid < 10);
  });

  it('returns a finite value when two keys share the same z', () => {
    const v = kfCR([[2, 7], [2, 9]], 2);
    assert.ok(Number.isFinite(v));
    assert.equal(v, 7);
  });

  it('returns the lone key value when only one key is provided', () => {
    assert.equal(kfCR([[3.5, 42]], 0), 42);
    assert.equal(kfCR([[3.5, 42]], 99), 42);
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
});

describe('knockout helpers', () => {
  it('koUsesSectors only on long knockout tracks', () => {
    assert.equal(koUsesSectors({ knockout: true }, 3000), true);
    assert.equal(koUsesSectors({ knockout: true }, 2000), false);
    assert.equal(koUsesSectors({ knockout: false }, 9000), false);
  });

  it('koCheckpoint splits long maps into eleven sectors', () => {
    assert.equal(koCheckpoint(3, 3300, true), 900);
    assert.equal(koCheckpoint(2, 1200, false), 2400);
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

  it('koPick still returns a mod when the filtered pool is empty (n=3)', () => {
    const lone = [{ id: 'solo', name: 'Solo' }];
    const mod = koPick(3, { round: 2, lastId: 'solo' }, lone, KO_FINAL, () => 0);
    assert.ok(mod && typeof mod === 'object');
    assert.equal(mod.id, 'solo');
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
