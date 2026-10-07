/* AFTERHOURS menu transitions, drawn with Shaders (shaders.com, MIT) on WebGPU.

   Two effects, menus only:
     - 'peel'    a paper page curls off from the bottom-right corner (opening the issue, tonight's events, the race report)
     - 'shutter' paper strips slide away in alternating directions (every other menu change)
   afterhours.js calls AH_FX.play(kind) from flash(); if it returns false the old CSS white flash runs instead.
   Nothing here runs during a race: flash() never asks for it in race/highlight mode, and both shaders sit paused between
   transitions so they cost no GPU time.

   Fallback is automatic: no WebGPU, reduced motion, a failed load or any GPU error leaves AH_FX.ready false.
   The 2.4 MB runtime is fetched only after the page has loaded and gone idle, so it never competes with the car GLBs. */
const FX = window.AH_FX = { ready: false, busy: false, play: () => false };

const PAPER = '#f4f2ed';
const PAPER_NG = '#0a1018'; // Neon + Glass: dark glass page curl
const DUR = { peel: 620, shutter: 440 };
const ngOn = () => document.body.classList.contains('ui-neon-glass');
const ngFx = c => {
  if (!c) return;
  if (ngOn()) c.style.boxShadow = 'inset 0 0 100px rgba(0,255,200,.12), inset 0 0 40px rgba(255,74,158,.08)';
  else c.style.boxShadow = '';
};

function canvasLayer(id) {
  const c = document.createElement('canvas');
  c.id = id;
  c.setAttribute('aria-hidden', 'true');
  c.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;display:block;pointer-events:none;z-index:61;visibility:hidden';
  document.body.appendChild(c);
  return c;
}

async function boot() {
  // software WebGPU (no real GPU) shares the GPU process with the game's WebGL and can knock it over: skip it
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter || adapter.isFallbackAdapter || (adapter.info && adapter.info.isFallbackAdapter)) return;
  const { createShader, createSharedDevice } = await import('./vendor/shaders-4.0.0.min.js');
  const gpu = await createSharedDevice();
  const fail = () => { FX.ready = false; };
  const opts = { gpu, disableTelemetry: true, onError: r => { if (!/recover/i.test(r)) fail(); } };

  const peelC = canvasLayer('fxPeel'), shutC = canvasLayer('fxShutter');
  const peel = await createShader(peelC, { components: [
    { type: 'PagePeel', id: 'fx', props: { corner: 'bottom-right', amount: 0, radius: 0.16, shading: 0.5, highlight: ngOn() ? 0.55 : 0.35, highlightSoftness: 0.15 },
      children: [{ type: 'SolidColor', props: { color: ngOn() ? PAPER_NG : PAPER } }] }
  ] }, opts);
  const shutter = await createShader(shutC, { components: [
    { type: 'SliceWipe', id: 'fx', props: { progress: 0, angle: 0, sliceCount: 7 },
      children: [{ type: 'SolidColor', props: { color: ngOn() ? PAPER_NG : PAPER } }] }
  ] }, opts);
  if (!peel || !shutter) return;
  peel.pause(); shutter.pause();

  const S = { peel: { sh: peel, c: peelC, key: 'amount' }, shutter: { sh: shutter, c: shutC, key: 'progress' } };
  FX.play = kind => {
    const s = S[kind] || S.shutter;
    if (!FX.ready || FX.busy) return false;
    try { s.sh.update('fx', { [s.key]: 0 }); s.sh.resume(); }
    catch (e) { FX.ready = false; return false; } // a dead GPU never blocks a menu change: the caller falls back to the CSS flash
    FX.busy = true;
    s.c.style.visibility = 'visible';
    ngFx(s.c);
    const t0 = performance.now(), T = DUR[kind] || DUR.shutter;
    const step = now => {
      const k = Math.min(1, (now - t0) / T), e = 1 - Math.pow(1 - k, 3); // ease-out: fast cover, soft settle
      let ok = true;
      try { s.sh.update('fx', { [s.key]: e }); } catch (err) { ok = false; FX.ready = false; }
      if (ok && k < 1) requestAnimationFrame(step);
      else { s.c.style.visibility = 'hidden'; ngFx(s.c); try { s.sh.pause(); } catch (err) {} FX.busy = false; }
    };
    requestAnimationFrame(step);
    return true;
  };
  FX.ready = true;
}

// kill switch: if the game's WebGL context is ever lost while these are on, the game reloads (afterhours.js) and the
// transitions stay off on this device from then on, so a GPU that can't run both never gets stuck in a reload loop
const OFF_KEY = 'ahFxOff';
const offHere = () => { try { return localStorage.getItem(OFF_KEY) === '1'; } catch (e) { return false; } };
const gl = document.getElementById('gl');
if (gl) gl.addEventListener('webglcontextlost', () => { if (FX.ready || FX.loading) { try { localStorage.setItem(OFF_KEY, '1'); } catch (e) {} } });

const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce && navigator.gpu && !offHere()) {
  const go = () => (window.requestIdleCallback || setTimeout)(() => (FX.loading = true, boot()).catch(() => { FX.ready = false; }).finally(() => { FX.loading = false; }), { timeout: 4000 });
  if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true });
}
