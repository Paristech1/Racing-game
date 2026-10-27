// Perf report: drives the game headless (?dev), races every event and samples AHDEV.perf() at three points on the lap
// (8%, 42%, 76% of the length), then writes docs/perf-report.md: renderer counts per event against the budgets in
// .cursor/skills/afterhours-threejs/SKILL.md, plus a leak check (load A, load B, back to A: GPU geometry/texture counts
// must come back down). Counts are exact in headless SwiftShader; frame times are not, so none are reported.
// usage: node tools/perf_report.mjs [eventId ...]
// env: PLAYWRIGHT (path to playwright's index.mjs), CHROME (chromium binary), THREE_VENDOR (local three@0.128.0 package
// dir; without it the CDN is used). Same conventions as tools/track_report.mjs.
import http from 'node:http';
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PW = process.env.PLAYWRIGHT || '/opt/npm-tools/node_modules/playwright/index.mjs';
const CHROME = process.env.CHROME || '';
const VENDOR = process.env.THREE_VENDOR || '/home/claude/vendor/package';
const { chromium } = await import(PW);

// Desktop budgets for the worst active-play view (threejs-game-skills technical-art.md, adapted). Over budget is not a
// failure, it is a tradeoff that has to be written down in the level doc.
const BUDGET = { calls: 300, tris: 750000, geometries: 300, textures: 60, materials: 150, transparent: 40 };

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.glb': 'model/gltf-binary', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const srv = http.createServer((q, s) => {
  const p = join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  const f = existsSync(p) && statSync(p).isDirectory() ? join(p, 'index.html') : p;
  if (!existsSync(f)) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' }); s.end(readFileSync(f));
});
await new Promise(r => srv.listen(0, r));
const browser = await chromium.launch({ executablePath: CHROME && existsSync(CHROME) ? CHROME : undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.setDefaultTimeout(180000);
await page.addInitScript(() => { let s = 12345; Math.random = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; });
if (existsSync(VENDOR)) {
  await page.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/(.*)/, (rt, rq) => rt.fulfill({ path: join(VENDOR, 'build', rq.url().split('/').pop()) }));
  await page.route(/cdn\.jsdelivr\.net\/npm\/three@0\.128\.0\/(.*)/, (rt, rq) => rt.fulfill({ path: join(VENDOR, rq.url().split('three@0.128.0/')[1]) }));
}
await page.route(/fonts\.(googleapis|gstatic)\.com/, rt => rt.fulfill({ status: 200, contentType: 'text/css', body: '' }));
const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.goto(`http://localhost:${srv.address().port}/index.html?dev`, { waitUntil: 'domcontentloaded', timeout: 180000 });
await page.waitForFunction(() => window.AHDEV && window.AHDEV.perf, null, { timeout: 180000 });
await page.waitForFunction(() => !window.AH_ASSETS || window.AH_ASSETS.progress() >= 1, null, { timeout: 180000 }).catch(() => {});

const race = async id => {
  await page.evaluate(i => AHDEV.race(i), id);
  await page.waitForFunction(() => AHDEV.state().mode === 'race', null, { timeout: 120000 });
  await page.evaluate(() => AHDEV.skipCount && AHDEV.skipCount());
  return page.evaluate(() => AHDEV.state().L);
};
const ids = process.argv.slice(2).length ? process.argv.slice(2) : await page.evaluate(() => AHDEV.events());
const rows = [];
for (const id of ids) {
  try {
    const L = await race(id), smp = [];
    for (const f of [0.08, 0.42, 0.76]) {
      await page.evaluate(s => AHDEV.tp(s, 0, 40), L * f);
      await page.waitForTimeout(600);
      smp.push(await page.evaluate(() => AHDEV.perf()));
    }
    const worst = k => Math.max(...smp.map(s => s[k] || 0));
    rows.push({ id, L: Math.round(L), calls: worst('calls'), tris: worst('tris'), geometries: worst('geometries'), textures: worst('textures'),
      programs: worst('programs'), objects: smp[1].objects, instanced: smp[1].instanced, instances: smp[1].instances,
      materials: smp[1].materials, transparent: smp[1].transparent });
  } catch (e) { rows.push({ id, error: String(e.message || e).slice(0, 160) }); }
  console.error(id, JSON.stringify(rows.at(-1)));
}
// leak check: the first two events that loaded, A -> B -> A
let leak = null;
const ok = rows.filter(r => !r.error);
if (ok.length >= 2) {
  const [a, b] = ok;
  const mem = () => page.evaluate(() => { const p = AHDEV.perf(); return { geometries: p.geometries, textures: p.textures, programs: p.programs }; });
  await race(a.id); const m1 = await mem(); await race(b.id); await race(a.id); const m2 = await mem();
  leak = { a: a.id, b: b.id, before: m1, after: m2 };
}
await browser.close(); srv.close();

const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : n >= 1e4 ? Math.round(n / 1e3) + 'k' : String(n);
const cell = (r, k) => (r[k] > BUDGET[k] ? `**${fmt(r[k])}**` : fmt(r[k]));
let md = `# Perf report

Generated by \`node tools/perf_report.mjs\` from \`AHDEV.perf()\` (open the game with \`?dev\` to call it live). Each event is
raced headless at 1280x720, pixel ratio 1, and sampled at 8%, 42% and 76% of the lap; renderer counts are the worst of the
three, scene counts are from the middle sample. Counts are exact; headless frame times are not, so none are listed.
**Bold** is over the desktop budget (calls ${BUDGET.calls}, triangles ${fmt(BUDGET.tris)}, GPU geometries ${BUDGET.geometries},
textures ${BUDGET.textures}, unique materials ${BUDGET.materials}, transparent materials ${BUDGET.transparent}); an overrun is a tradeoff to
write down in the level doc, not an automatic failure. Read it with the budget section of \`.cursor/skills/afterhours-threejs/SKILL.md\`.

| Event | Length | Draw calls | Triangles | GPU geos | Textures | Programs | Objects | Instanced meshes (instances) | Materials | Transparent |
|---|---|---|---|---|---|---|---|---|---|---|
`;
for (const r of rows) md += r.error ? `| \`${r.id}\` | error: ${r.error} |||||||||\n`
  : `| \`${r.id}\` | ${r.L} m | ${cell(r, 'calls')} | ${cell(r, 'tris')} | ${cell(r, 'geometries')} | ${cell(r, 'textures')} | ${r.programs} | ${r.objects} | ${r.instanced} (${fmt(r.instances)}) | ${cell(r, 'materials')} | ${cell(r, 'transparent')} |\n`;
if (leak) md += `\n## Leak check\n\nLoad \`${leak.a}\`, then \`${leak.b}\`, then \`${leak.a}\` again. GPU geometries ${leak.before.geometries} → ${leak.after.geometries}, textures ${leak.before.textures} → ${leak.after.textures}, programs ${leak.before.programs} → ${leak.after.programs}. Growth here means an event's resources outlive it.\n`;
if (errs.length) md += `\n## Page errors\n\n${[...new Set(errs)].slice(0, 10).map(e => '- ' + e).join('\n')}\n`;
writeFileSync(join(ROOT, 'docs/perf-report.md'), md);
console.log('wrote docs/perf-report.md');
