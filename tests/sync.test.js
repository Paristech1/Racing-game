import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  bossIdListsInSource,
  extractExportedFunctionSource,
  extractFunctionSource,
  readRepoFile,
  stripForCompare,
  stripFunctionBody,
} from './extract.mjs';

const AFTERHOURS = readRepoFile('js/afterhours.js');
const LOGIC = readRepoFile('js/logic.mjs');

/** Pairs kept in sync between the monolith and logic.mjs (names match unless noted). */
const SAME_NAME_PAIRS = [
  'scorePickup',
  'rng',
  'fmt',
  'esc',
  'kfCR',
  'frame',
  'makeTrack',
  'pickClearLane',
  'autoPickupSpots',
  'resolveEventForStart',
];

function normalizePair(name, ahSrc, logicSrc) {
  let a = stripForCompare(ahSrc);
  let b = stripForCompare(logicSrc);
  if (name === 'frame') {
    a = a.replace(/tr=tr\|\|TR;?/, '');
  }
  return { a, b };
}

describe('logic.mjs stays aligned with afterhours.js', () => {
  it('duplicated function bodies match (whitespace-stripped)', () => {
    for (const name of SAME_NAME_PAIRS) {
      const ah = extractFunctionSource(AFTERHOURS, name);
      const logic = extractExportedFunctionSource(LOGIC, name);
      assert.ok(ah, `afterhours.js missing function ${name}`);
      assert.ok(logic, `logic.mjs missing export function ${name}`);
      const { a, b } = normalizePair(name, ah, logic);
      assert.equal(a, b, `${name} drifted between afterhours.js and logic.mjs`);
    }
  });

  it('rivalChassisEligible boss gate matches', () => {
    const ah = extractFunctionSource(AFTERHOURS, 'rivalChassisEligible');
    const logic = extractFunctionSource(LOGIC, 'rivalChassisEligible');
    assert.ok(ah && logic);
    const a = stripFunctionBody(ah).replace(/RIVAL_BOSS/g, 'rivalBoss');
    const b = stripFunctionBody(logic);
    assert.equal(a, b);
  });

  it('histRecord matches SAVE hist() migration', () => {
    const ah = extractFunctionSource(AFTERHOURS, 'hist');
    const logic = extractExportedFunctionSource(LOGIC, 'histRecord');
    assert.ok(ah && logic);
    const a = stripFunctionBody(ah);
    const b = stripFunctionBody(logic);
    assert.equal(a, b);
  });

  it('buildRivalForEvent scoring loop matches monolith', () => {
    const ah = extractFunctionSource(AFTERHOURS, 'buildRivalForEvent');
    const logic = extractExportedFunctionSource(LOGIC, 'buildRivalForEvent');
    assert.ok(ah && logic);
    const ahCore = stripForCompare(ah)
      .replace(/CARS/g, 'cars')
      .replace(/EVENT_CAR_BIAS/g, 'eventCarBias')
      .replace(/RIVAL_CAR_PREF/g, 'rivalCarPref')
      .replace(/Math\.random\(\)/g, 'rand()');
    const logicCore = stripForCompare(logic)
      .replace(/options\.random\|\|Math\.random/g, 'rand')
      .replace(/options\.rivalBoss===true/g, 'rivalBoss')
      .replace(/constrivalBoss=rivalBoss;/, 'constrivalBoss=options.rivalBoss===true;');
    const ahLoop = ahCore.slice(ahCore.indexOf('for(constcofcars)'), ahCore.indexOf('taken.push'));
    const logicLoop = logicCore.slice(logicCore.indexOf('for(constcofcars)'), logicCore.indexOf('taken.push'));
    assert.equal(ahLoop, logicLoop);
  });

  it('koCheckpoint and koUsesSectors formulas match', () => {
    const ahKo = stripForCompare(extractFunctionSource(AFTERHOURS, 'koCheckpoint'));
    const logicKo = stripForCompare(extractExportedFunctionSource(LOGIC, 'koCheckpoint'));
    assert.ok(ahKo.includes('round*(L/11)'));
    assert.ok(logicKo.includes('round*(L/11)'));

    const ahSec = stripForCompare(extractFunctionSource(AFTERHOURS, 'koUsesSectors'));
    const logicSec = stripForCompare(extractExportedFunctionSource(LOGIC, 'koUsesSectors'));
    assert.ok(ahSec.includes('L>2500'));
    assert.ok(logicSec.includes('trackLength>2500'));
  });
});

describe('boss car id list is identical everywhere', () => {
  const CANON = "['overload','volcano','zephyr','hikari']";

  it('array literals and eligibility checks use the same four ids', () => {
    const ahLists = bossIdListsInSource(AFTERHOURS);
    assert.ok(ahLists.length >= 2, 'expected boss lists in afterhours.js');
    for (const list of ahLists) {
      assert.equal(stripForCompare(list), stripForCompare(CANON));
    }
    const logicEligible = extractFunctionSource(LOGIC, 'rivalChassisEligible');
    assert.ok(logicEligible.includes('overload'));
    assert.ok(logicEligible.includes('hikari'));
    const logicNorm = stripForCompare(logicEligible);
    assert.ok(logicNorm.includes("c.id==='overload'"));
    assert.ok(logicNorm.includes("c.id==='hikari'"));
  });
});

describe('every rival persona and power-up is fully wired in the monolith', () => {
  const slice = (from, to) => {
    const a = AFTERHOURS.indexOf(from);
    const b = AFTERHOURS.indexOf(to, a);
    assert.ok(a >= 0 && b > a, `could not find ${from} .. ${to}`);
    return AFTERHOURS.slice(a, b);
  };
  const keys = (src, re) => [...src.matchAll(re)].map(m => m[1]);

  const personaIds = keys(slice('const RIVALS=[', '].map(r=>Object.assign(r,{name:r.car}))'), /^ \{id:'(\w+)',\s*tag:/gm);

  it('RIVALS lists the six originals plus Grudge, Hunter, Rabbit and Weaver', () => {
    for (const id of ['apex', 'wall', 'leech', 'bruiser', 'closer', 'wild', 'grudge', 'hunter', 'rabbit', 'weaver']) {
      assert.ok(personaIds.includes(id), `RIVALS is missing ${id}`);
    }
    assert.equal(new Set(personaIds).size, personaIds.length, 'duplicate persona id');
  });

  it('every persona has seek, temper, corner-approach and car-preference entries', () => {
    const seek = slice('const SEEK={', '}; RIVALS.forEach');
    const temper = slice('const TEMPER={', 'const MOOD_TAG');
    const corner = slice('const CORNER_APPROACH={', 'function aiCornerPlan');
    const pref = slice('const RIVAL_CAR_PREF={', 'let RIVAL_BOSS');
    for (const id of personaIds) {
      assert.ok(new RegExp(`\\b${id}:[.\\d]`).test(seek), `SEEK missing ${id}`);
      assert.ok(new RegExp(`\\b${id}:\\{temper:`).test(temper), `TEMPER missing ${id}`);
      assert.ok(new RegExp(`\\b${id}:\\{zone:`).test(corner), `CORNER_APPROACH missing ${id}`);
      assert.ok(new RegExp(`\\b${id}:\\{gripW:`).test(pref), `RIVAL_CAR_PREF missing ${id}`);
    }
  });

  it('big grids draw from the whole persona roster, not a hard-coded six', () => {
    assert.ok(!/per=\['apex'/.test(AFTERHOURS), 'a grid still hard-codes the six original personas');
    assert.ok(!/per\[(?:oi|i)%6\]/.test(AFTERHOURS), 'a grid still wraps personas at 6');
  });

  it('every power-up type has three bracket variants', () => {
    const types = keys(slice('const PU_TYPES={', 'const PU_DESC'), /(\w+):\{c:0x/g);
    const variants = slice('const PU_VARIANTS={', 'const ECHO_SKIP');
    for (const t of ['jam', 'slick', 'payback', 'ghost']) assert.ok(types.includes(t), `PU_TYPES missing ${t}`);
    for (const t of types) {
      assert.ok(new RegExp(`\\b${t}:\\{front:\\[[^\\n]*pack:\\[[^\\n]*chase:\\[`).test(variants), `PU_VARIANTS incomplete for ${t}`);
    }
  });

  it('the new power-ups have an effect, an AI valuation and are kept out of Echo Boost', () => {
    const apply = extractFunctionSource(AFTERHOURS, 'applyPU');
    const mood = extractFunctionSource(AFTERHOURS, 'moodPickup');
    for (const t of ['jam', 'slick', 'payback', 'ghost']) {
      assert.ok(apply.includes(`case '${t}'`), `applyPU has no case for ${t}`);
      assert.ok(mood.includes(`case '${t}'`), `moodPickup has no case for ${t}`);
    }
    const skip = slice('const ECHO_SKIP=', ');');
    for (const t of ['jam', 'slick', 'payback', 'ghost']) assert.ok(skip.includes(`'${t}'`), `ECHO_SKIP missing ${t}`);
  });
});
