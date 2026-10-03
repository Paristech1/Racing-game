import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { describe, it } from 'node:test';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifestSrc = readFileSync(join(root, 'js/model-manifest.js'), 'utf8');
const MANIFEST = JSON.parse(manifestSrc.slice(manifestSrc.indexOf('{'), manifestSrc.lastIndexOf('}') + 1));

function glbJson(buf) {
  assert.equal(buf.toString('latin1', 0, 4), 'glTF', 'not a GLB');
  const len = buf.readUInt32LE(12);
  return JSON.parse(buf.toString('utf8', 20, 20 + len));
}
const files = [
  ...readdirSync(join(root, 'models')).filter((f) => f.endsWith('.glb')),
  ...readdirSync(join(root, 'models/lod')).filter((f) => f.endsWith('.glb')).map((f) => 'lod/' + f),
];

describe('model pipeline (tools/optimize_models.sh)', () => {
  it('finds the GLBs', () => assert.ok(files.length >= 8));
  for (const f of files) {
    const buf = readFileSync(join(root, 'models', f));
    it(`${f} is meshopt-compressed (run tools/optimize_models.sh after a Blender export)`, () => {
      const j = glbJson(buf);
      assert.ok((j.extensionsRequired || []).includes('EXT_meshopt_compression'));
      assert.ok(!(j.images || []).length, 'these models are geometry-only; textures would need KTX2 / a size budget');
    });
    it(`${f} matches js/model-manifest.js (bytes + hash)`, () => {
      const m = MANIFEST[f];
      assert.ok(m, 'missing from manifest: re-run tools/optimize_models.sh');
      assert.equal(m.bytes, buf.length);
      assert.equal(m.v, crypto.createHash('sha1').update(buf).digest('hex').slice(0, 8));
    });
  }
  it('every manifest entry has a file', () => {
    for (const k of Object.keys(MANIFEST)) assert.ok(files.includes(k), k + ' in manifest but not on disk');
  });
  it('total critical download stays under budget (10 MB, Threejs-Punk ships its whole game in ~15 MB)', () => {
    const total = Object.entries(MANIFEST).filter(([k]) => !k.startsWith('lod/')).reduce((s, [, v]) => s + v.bytes, 0);
    assert.ok(total < 10e6, `models are ${(total / 1e6).toFixed(1)} MB`);
  });
  it('index.html loads the asset pipeline before three.js and the meshopt decoder after GLTFLoader', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');
    const at = (s) => html.indexOf(s);
    assert.ok(at('js/assets.js') > 0 && at('js/assets.js') < at('three.min.js'));
    assert.ok(at('libs/meshopt_decoder.js') > at('loaders/GLTFLoader.js') && at('libs/meshopt_decoder.js') < at('js/afterhours.js'));
  });
});
