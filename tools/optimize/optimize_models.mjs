#!/usr/bin/env node
/* AFTERHOURS model optimiser.
 *
 *   tools/optimize_models.sh              compress every models/*.glb in place (skips files already compressed)
 *   tools/optimize_models.sh --force      re-compress even if already compressed (LOSSY again: prefer re-exporting from Blender)
 *   tools/optimize_models.sh --check      verify only, change nothing
 *   tools/optimize_models.sh models/kage_r.glb ...   just those files
 *
 * What it does to each GLB (geometry only, these models carry no textures):
 *   1. weld     merge bit-identical vertices (lossless, shrinks the index buffer)
 *   2. reorder  vertex-cache / compression friendly order (lossless)
 *   3. quantize POSITION to 16-bit and NORMAL to 12-bit ints (per-mesh grid, compensated by the node transform)
 *   4. EXT_meshopt_compression on every buffer view (decoder: three@0.128.0/examples/js/libs/meshopt_decoder.js, 21 KB)
 * Node names, material names, scene hierarchy and triangle order of the Blender export are untouched, so js/afterhours.js
 * keeps finding kit assets by name and swapping materials by name. js/assets.js turns the quantized ints back into float32
 * after load (r128's BufferAttribute.getX() does not de-normalize).
 *
 * Car files (everything not *_kit.glb) also get a lighter twin in models/lod/<name>.glb (meshopt-simplified to ~30% of the
 * triangles within 5 mm), which the game loads in the background after boot and uses for the rival cars only.
 *
 * It also (re)writes js/model-manifest.js (byte sizes + content hash per file: real download progress and automatic
 * cache-busting, so nobody has to bump ?v=N by hand) and bumps that script's ?v= in index.html.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { weld, reorder, quantize, simplify } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const flag = n => args.includes(n);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const files0 = args.filter((a, i) => !a.startsWith('--') && !['--pos', '--normal', '--dir'].includes(args[i - 1]));
const DIR = path.resolve(process.env.AH_CWD || ROOT, opt('--dir', path.join(ROOT, 'models')));
const POS_BITS = +opt('--pos', 16), NRM_BITS = +opt('--normal', 12);
const FORCE = flag('--force'), CHECK = flag('--check'), NO_LOD = flag('--no-lod');
const LOD_RATIO = +opt('--lod-ratio', 0.3), LOD_ERROR = +opt('--lod-error', 0.001); // error is a fraction of the mesh extent (0.001 of a 5 m car = 5 mm)
const wantsLod = n => !NO_LOD && !/_kit\.glb$/.test(n); // cars get a distance-LOD twin; the street kits are already light and instanced

await MeshoptEncoder.ready; await MeshoptDecoder.ready; await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const log = (...a) => console.log(...a);
const kb = n => (n / 1024).toFixed(0).padStart(6) + ' KB';

// ---- verification: world-space position error and normal angle error, optimized vs the welded float reference ----
function worldMat(node) { return node.getWorldMatrix(); }
function xformPoint(m, x, y, z) { return [m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]]; }
function inv3T(m) { // inverse-transpose of the upper 3x3 (column-major 4x4 in, row-major 3x3 out as a function)
  const a = m[0], b = m[4], c = m[8], d = m[1], e = m[5], f = m[9], g = m[2], h = m[6], i = m[10];
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g, det = a * A + b * B + c * C || 1;
  const r = [A, B, C, -(b * i - c * h), a * i - c * g, -(a * h - b * g), b * f - c * e, -(a * f - c * d), a * e - b * d].map(v => v / det);
  return (x, y, z) => { const o = [r[0] * x + r[1] * y + r[2] * z, r[3] * x + r[4] * y + r[5] * z, r[6] * x + r[7] * y + r[8] * z], l = Math.hypot(...o) || 1; return [o[0] / l, o[1] / l, o[2] / l]; };
}
function compare(ref, got) {
  const st = { prims: 0, tris: 0, trisGot: 0, maxPos: 0, maxNrm: 0, sumNrm: 0, nN: 0, bboxRef: [1e9, 1e9, 1e9, -1e9, -1e9, -1e9] };
  const nr = ref.getRoot().listNodes().filter(n => n.getMesh()), ng = got.getRoot().listNodes().filter(n => n.getMesh());
  if (nr.length !== ng.length) throw new Error(`mesh node count differs ${nr.length} vs ${ng.length}`);
  nr.forEach((n, k) => {
    const g = ng[k]; if (n.getName() !== g.getName()) throw new Error(`node order/name differs: ${n.getName()} vs ${g.getName()}`);
    const mr = worldMat(n), mg = worldMat(g), tr = inv3T(mr), tg = inv3T(mg), pr = n.getMesh().listPrimitives(), pg = g.getMesh().listPrimitives();
    pr.forEach((p, j) => { const q = pg[j]; st.prims++;
      const ir = p.getIndices(), ig = q.getIndices(); st.tris += ir.getCount() / 3; st.trisGot += ig.getCount() / 3;
      const Pr = p.getAttribute('POSITION'), Pg = q.getAttribute('POSITION'), Nr = p.getAttribute('NORMAL'), Ng = q.getAttribute('NORMAL');
      if (Pr.getCount() !== Pg.getCount()) throw new Error('vertex count differs');
      const a = [0, 0, 0], b = [0, 0, 0];
      for (let v = 0; v < Pr.getCount(); v++) {
        Pr.getElement(v, a); Pg.getElement(v, b); const wa = xformPoint(mr, ...a), wb = xformPoint(mg, ...b);
        st.maxPos = Math.max(st.maxPos, Math.hypot(wa[0] - wb[0], wa[1] - wb[1], wa[2] - wb[2]));
        for (let c = 0; c < 3; c++) { st.bboxRef[c] = Math.min(st.bboxRef[c], wa[c]); st.bboxRef[c + 3] = Math.max(st.bboxRef[c + 3], wa[c]); }
        if (Nr && Ng) { Nr.getElement(v, a); Ng.getElement(v, b); const na = tr(...a), nb = tg(...b), d = Math.min(1, na[0] * nb[0] + na[1] * nb[1] + na[2] * nb[2]), ang = Math.acos(d) * 180 / Math.PI;
          st.maxNrm = Math.max(st.maxNrm, ang); st.sumNrm += ang; st.nN++; }
      } }); });
  const ext = Math.max(st.bboxRef[3] - st.bboxRef[0], st.bboxRef[4] - st.bboxRef[1], st.bboxRef[5] - st.bboxRef[2]);
  return { ...st, ext, meanNrm: st.sumNrm / Math.max(1, st.nN) };
}


// weld -> reorder -> quantize -> EXT_meshopt_compression, returns the GLB bytes (writes into `d` in place)
async function compress(d) {
  await d.transform(weld(), reorder({ encoder: MeshoptEncoder, target: 'size' }),
    quantize({ quantizePosition: POS_BITS, quantizeNormal: NRM_BITS, quantizeTexcoord: 12, quantizeColor: 8 }));
  if (!d.getRoot().listExtensionsUsed().some(e => e.extensionName === 'EXT_meshopt_compression'))
    d.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
  return Buffer.from(await io.writeBinary(d));
}
const tris = d => d.getRoot().listMeshes().reduce((n, m) => n + m.listPrimitives().reduce((k, p) => k + (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3, 0), 0);

// ---- main ----
const targets = (files0.length ? files0.map(f => path.resolve(process.env.AH_CWD || process.cwd(), f)) : fs.readdirSync(DIR).filter(f => f.endsWith('.glb')).sort().map(f => path.join(DIR, f)));
const manifest = {}; let before = 0, after = 0, skipped = 0, lodBytes = 0, worst = { pos: 0, nrm: 0 };
for (const file of targets) {
  const name = path.basename(file), src = fs.readFileSync(file); before += src.length;
  const doc = await io.readBinary(new Uint8Array(src));
  const done = doc.getRoot().listExtensionsUsed().some(e => e.extensionName === 'EXT_meshopt_compression');
  let out = src, regenLod = false;
  if (done && !FORCE) { skipped++; log(`${name.padEnd(18)} ${kb(src.length)}  already meshopt-compressed (use --force to redo)`); }
  else if (CHECK) { log(`${name.padEnd(18)} ${kb(src.length)}  NOT compressed (run without --check)`); }
  else {
    const ref = await io.readBinary(new Uint8Array(src));
    await ref.transform(weld(), reorder({ encoder: MeshoptEncoder, target: 'size' }));
    out = await compress(doc, ref);
    const back = await io.readBinary(new Uint8Array(out)), r = compare(ref, back);
    if (r.tris !== r.trisGot) throw new Error(`${name}: triangle count changed ${r.tris} -> ${r.trisGot}`);
    worst.pos = Math.max(worst.pos, r.maxPos / r.ext); worst.nrm = Math.max(worst.nrm, r.maxNrm);
    log(`${name.padEnd(18)} ${kb(src.length)} -> ${kb(out.length)}  (${(100 * out.length / src.length).toFixed(0)}%)  ${r.prims} prims ${r.tris} tris  maxPosErr ${(r.maxPos * 1000).toFixed(3)} mm (${(1e6 * r.maxPos / r.ext).toFixed(0)} ppm of extent)  normal err max ${r.maxNrm.toFixed(2)} deg mean ${r.meanNrm.toFixed(3)} deg`);
    fs.writeFileSync(file + '.tmp', out); fs.renameSync(file + '.tmp', file);
    regenLod = true;
  }
  if (wantsLod(name) && !CHECK && !path.relative(DIR, file).startsWith('lod')) {
    const lp = path.join(DIR, 'lod', name);
    if (regenLod || !fs.existsSync(lp)) { // simplify from the float source when we have it, else from the decoded compressed file
      const ld = await io.readBinary(new Uint8Array(src));
      const t0 = tris(ld);
      await ld.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: LOD_RATIO, error: LOD_ERROR }));
      const lo = await compress(ld); fs.mkdirSync(path.dirname(lp), { recursive: true }); fs.writeFileSync(lp, lo);
      log(`  lod/${name.padEnd(14)} ${kb(lo.length)}  ${t0} -> ${tris(ld)} tris (${(100 * tris(ld) / t0).toFixed(0)}%)`);
    }
    if (fs.existsSync(lp)) { const lb = fs.readFileSync(lp); lodBytes += lb.length; manifest['lod/' + name] = { bytes: lb.length, v: crypto.createHash('sha1').update(lb).digest('hex').slice(0, 8) }; }
  }
  after += out.length;
  manifest[name] = { bytes: out.length, v: crypto.createHash('sha1').update(out).digest('hex').slice(0, 8) };
}
log(`\nTOTAL ${(before / 1e6).toFixed(2)} MB -> ${(after / 1e6).toFixed(2)} MB across ${targets.length} files (${skipped} already compressed)` + (lodBytes ? ` + ${(lodBytes / 1e6).toFixed(2)} MB of lod/ twins (background download)` : ''));
if (worst.nrm) log(`worst quantization error: position ${(worst.pos * 1e6).toFixed(0)} ppm of mesh extent, normal ${worst.nrm.toFixed(2)} deg`);

if (!CHECK && !files0.length) { // manifest + cache-bust
  const js = `/* generated by tools/optimize_models.sh: byte sizes (real download progress) and content hashes (cache-busting). Do not edit. */\nwindow.AH_MANIFEST=${JSON.stringify(manifest)};\n`;
  const mp = path.join(ROOT, 'js/model-manifest.js'); const prev = fs.existsSync(mp) ? fs.readFileSync(mp, 'utf8') : '';
  if (prev !== js) fs.writeFileSync(mp, js);
  const h = crypto.createHash('sha1').update(js).digest('hex').slice(0, 6), ip = path.join(ROOT, 'index.html'); let html = fs.readFileSync(ip, 'utf8');
  const re = /(js\/model-manifest\.js\?v=)[0-9a-f]+/; if (re.test(html)) { const nh = html.replace(re, `$1${h}`); if (nh !== html) { fs.writeFileSync(ip, nh); log('index.html: model-manifest.js?v=' + h); } }
  else log('NOTE: index.html has no js/model-manifest.js script tag yet');
}
