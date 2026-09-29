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
