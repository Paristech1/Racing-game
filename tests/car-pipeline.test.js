import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  extractJsLoftConst,
  extractPyLoftTable,
  readRepoFile,
} from './extract.mjs';

const AFTERHOURS = readRepoFile('js/afterhours.js');

/** Blender HW/YS/YB must match the in-game vinyl side-section sampler for each GLB shell. */
const GLB_LOFT_CARS = [
  {
    id: 'granfour',
    py: 'tools/blender/gran_four.py',
    shell: 'granfourGlbShell',
    js: { HW: 'GF_HW', YS: 'GF_YS', YB: 'GF_YB' },
    pyKeys: { HW: 'HW', YS: 'YS', YB: 'YB' },
  },
  {
    id: 'autobahn',
    py: 'tools/blender/autobahn_63.py',
    shell: 'autobahnGlbShell',
    js: { HW: 'HS', YS: 'YS', YB: 'YB' },
    pyKeys: { HW: 'HW', YS: 'YS', YB: 'YB' },
  },
  {
    id: 'kage',
    py: 'tools/blender/kage_r.py',
    shell: 'kageShell',
    js: { HW: 'HS', YS: 'YS', YB: 'YB' },
    pyKeys: { HW: 'HW', YS: 'YS', YB: 'YB' },
  },
  {
    id: 'wisp',
    py: 'tools/blender/wisp_07.py',
    shell: 'wispGlbShell',
    js: { HW: 'HS', YS: 'YS', YB: 'YB' },
    pyKeys: { HW: 'HW', YS: 'YS', YB: 'YB' },
  },
];

describe('Blender car pipeline: reference loft keys match in-game vinyl samplers', () => {
  for (const car of GLB_LOFT_CARS) {
    it(`${car.id}: HW / YS / YB tables stay aligned`, () => {
      const pySrc = readRepoFile(car.py);
      for (const key of ['HW', 'YS', 'YB']) {
        const pyTable = extractPyLoftTable(pySrc, car.pyKeys[key]);
        const jsTable = extractJsLoftConst(AFTERHOURS, car.shell, car.js[key]);
        assert.ok(pyTable, `${car.py} missing ${car.pyKeys[key]}`);
        assert.ok(jsTable, `afterhours.js ${car.shell} missing const ${car.js[key]}`);
        assert.deepEqual(
          jsTable,
          pyTable,
          `${car.id} ${key}: update ${car.js[key]} in afterhours.js or ${car.pyKeys[key]} in ${car.py}`,
        );
      }
    });
  }
});

describe('GLB shell loader registry', () => {
  it('lists every shipped Blender body in the preload want[] table', () => {
    const wantBlock = AFTERHOURS.match(/const want=\[[\s\S]*?\];/);
    assert.ok(wantBlock);
    for (const id of ['volcano', 'kage', 'wisp', 'autobahn', 'granfour']) {
      assert.match(wantBlock[0], new RegExp(`['"]${id}['"]`), `missing GLB preload for ${id}`);
    }
  });
});
