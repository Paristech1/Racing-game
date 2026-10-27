---
name: afterhours-threejs
description: AFTERHOURS racing game Three.js stack, file layout and car-building helpers. Always use first, before any other threejs-* skill, whenever editing 3D, rendering, tracks, cars, post-processing, or UI tied to the canvas in this repository.
---

# AFTERHOURS Three.js context

This repo is **not** a Vite/ESM Three.js app. Adapt patterns from the `threejs-*` skills in `.cursor/skills/` to this stack.

## Stack

| Topic | This project |
| --- | --- |
| Three.js | **r128**, global `THREE` via script tag (cdnjs) |
| Add-ons | Legacy **`examples/js/`** on jsDelivr (same r128), e.g. `EffectComposer.js`, `UnrealBloomPass.js` — **not** `three/addons/` imports |
| Entry | `index.html` → `js/afterhours.js?v=N` (bump `N` when JS changes) |
| Styles | `css/afterhours.css?v=N` |
| Structure | Single IIFE in `afterhours.js` (`'use strict'`, no exports). Helpers like `mesh()` are often **scoped inside** `buildCity()` — do not call them from sibling functions unless you duplicate or hoist a shared helper |

## Dev server

```bash
python3 -m http.server 8080
```

Open http://localhost:8080 — needs egress to cdnjs, jsDelivr, and Google Fonts.

## Where things live

- **Cars / archive UI:** `CARS`, `renderPage`, studio camera on `#gl` canvas
- **Events / tracks:** `EVENTS[]` with `{ id, build, setup, name, kick, ... }`; each `build()` returns `{ scene, track, ... }` via `buildCity(CFG)` or bespoke builders
- **City tracks:** `buildCity(C)` + configs like `PHILLY_CFG`, `MTAIRY_CFG` (corners, `yAt`, hazards, props)
- **Race loop:** mode `race`, `TR` track, `EV` current event, physics in same file
- **Post FX:** `EffectComposer` + bloom; scene `userData.bloom` thresholds per event

## Blender models and the asset pipeline

- `models/*.glb` are geometry-only, **meshopt-compressed and quantized** (`tools/optimize_models.sh`, about 5 MB for all of them). After a Blender export run that script (it also writes `models/lod/*.glb` rival-car twins and `js/model-manifest.js`); never bump the old `?v=` by hand and never commit a raw export (`npm test` fails on it).
- `js/assets.js` loads first in `index.html`, fetches the GLBs in parallel before three.js arrives, gives GLTFLoader the meshopt decoder (r128 supports `setMeshoptDecoder`), and widens the quantized int16 attributes back to float32 (r128's `BufferAttribute.getX()` does not de-normalize, and `glbParts` / `kitParts` / `mergeGeos` read geometry on the CPU). Do not read `AH_MODELS` geometry anywhere that runs before that widening.
- Rival cars call `buildCar(def,{lod:true})`; `glbParts(model,lod)` uses the `AH_MODELS_LOD` twin once it has downloaded and falls back to the full model. Shared GLB geometry is flagged `userData.shared` so `clearRacers` does not free it between races.
- r128 GLTFLoader supports Draco (`DRACOLoader`, ~330 KB wasm decoder), meshopt (21 KB decoder, what we use), `KHR_mesh_quantization`, `EXT_texture_webp` and `KHR_texture_basisu` through `BasisTextureLoader` (there is no `KTX2Loader` before r129). It does not know `KHR_materials_emissive_strength`. The current models have no textures; if one ever gets some, resize them (1024 px max) and use WebP or Basis.

## Building cars (`buildCar` in `afterhours.js`)

- **Body:** each car's silhouette is a `BODIES` entry (`pts` = body profile, `cab` = glass canopy, x runs rear to front). `profileGeo` extrudes it with a bevel, so the side face sits at `±(B.w/2 + .14)`. Put side trim at `B.w/2 + .14` to `.15`; anything under `.14` is hidden inside the paint.
- **Per-car details:** add an `if(cid==='<id>'){ ... }` block. Use `cid` (`def.chassisId || def.id`), not `def.id`, so rivals driving that chassis get the details too.
- **Helpers in scope:**
  - `box`: add a box mesh.
  - `deckY(z)` / `roofY(z)`: surface height sampled from the same splines the extrusion uses.
  - `strip(x, w, z0, z1, mat, n, top, t)`: a stripe, or a raised bulge with thickness `t`, laid over a curved surface.
  - `pipe`: an exhaust tip.
  - `flares`: wheel-arch cladding.
  - `decal(w, h, draw)`: a canvas-texture material for badges and numbers.
- **Shared materials:** `paint` (MeshPhysical clearcoat plus flake normal map), `carbonM` (canvas twill weave), `chromeTrimM`, `trimM`, `blackM`, `headM` / `tailM` (unlit, `toneMapped:false`, so they bloom), `gapM`.
- **Draw calls:** `mergeByMaterial` folds every direct child of the car group into one mesh per material. Reuse materials instead of creating new ones per part.
- **Speed:** `top`, `acc`, `grip`, `nitro` and `mass` drive the physics. `vcap` raises a car's own speed ceiling above the global `VCAP`. See `stepRacer` for the outlaw-car mechanics (`noBoost`, `sigTop`, `lastTop`, `cleanTop`).
- **Testing:** after a car change, bump `?v=` in `index.html`. Check the car in the car-select studio from two angles (drag vertically first to orbit; a horizontal drag changes car).

## Conventions when porting skill examples

1. Replace `import * as THREE from 'three'` — use global `THREE`.
2. Replace `import { X } from 'three/addons/...'` — use globals loaded in `index.html` before `afterhours.js`.
3. Prefer **instancing** and canvas textures (`CT`, `canvasTex`) patterns already in `buildCity` for city geometry.
4. New events: add config object, `buildX()` wrapper, `EVENTS` entry, README event line; test by opening events screen and loading the track (watch console for ReferenceErrors).
5. Keep diffs minimal; match naming and formatting of surrounding code.

## Render and performance rules

Adopted 2026-10-27 from the Utsubo "100 Three.js tips" (r186), threejs-game-skills, Threejs-Awesome-Graphics-Agent-Skills,
nixie-fx, the WebGPU/TSL skill and ai-dev-kit, filtered to what r128 can actually do here. Sources and what was left out:
the Project doc `upgrades/threejs-principles.md`.

### 1. Measure before and after every graphics change

- Open with `?dev` and call `AHDEV.perf()` in a race. It holds `renderer.info`'s reset for one whole `draw()`, so the
  counts cover the scene plus every composer pass (a plain `renderer.info` read only shows the last pass). It also
  returns a scene inventory: objects, instanced meshes and instance count, unique materials, transparent materials, lights.
- Run `node tools/perf_report.mjs [eventId ...]` for the table in `docs/perf-report.md` (all events, worst of three
  points on the lap, plus an A → B → A leak check). Counts are exact headless; frame times are not, so never quote
  headless FPS. Real frame time comes from a real device (`AHDEV.pace()` shows what the frame pacer did).
- Report before/after counts in the PR or level doc for any change to a level, a car kit, materials or post.

### 2. Budgets (desktop, worst active-play view)

| Metric | Budget | Why |
|---|---|---|
| Draw calls | ≤ 300 | CPU submit cost per call; triangles are cheaper than calls |
| Triangles | ≤ 750k | silhouettes near the camera, LOD or impostors behind |
| GPU geometries | ≤ 300 | `info.memory.geometries` |
| Textures | ≤ 60 | canvas textures included |
| Unique materials | ≤ 150 | each unique material is a state change and often a program |
| Transparent materials | ≤ 40 | no early depth reject, sorted every frame, overdraw |

Phones (`PHONE`): roughly half of each. Going over is allowed when it is written down as a tradeoff in the level doc;
silently going over is not. Baseline on 2026-10-27 (`docs/perf-report.md`): every event is over on materials and
transparent materials; Roosevelt Blvd is the worst on draw calls (about 2,000 to 2,650), Last Call on triangles (about
9 M), Calder second on both. The causes measured on Blvd: 1,510 instanced meshes of which 584 hold four copies or fewer,
and 1,165 materials of which 790 duplicate another one's parameters.

### 3. Draw calls first

- An `InstancedMesh` only pays when it holds many instances. Dozens of instanced meshes holding a handful of copies each
  cost as many calls as plain meshes; batch by (geometry, material) across the whole level, not per block or per prop.
- Static geometry that shares a material: merge it into one mesh per material at build time (`mergeGeos`, or
  `mergeByMaterial` as the cars already do). Keep collision data separate from the merged visual.
- One material per role, shared across the level (`bodyPrimary`, `trim`, `glass`, `emissiveSignal`, `groundContact`, …).
  Never `new THREE.Mesh*Material` inside a per-building or per-prop loop; look it up in a cache keyed by its parameters.
- `transparent:true` only when the material really blends (the 2026-10-27 audit found none left at opacity 1 with
  normal blending; keep it that way). Cut-outs (fences, foliage
  cards, decals with hard edges) → `alphaTest` instead of blending. Additive light (pools, beams, flares) stays
  transparent and tagged `FOG_ADD`.
- Static world objects: `matrixAutoUpdate=false` and one `updateMatrix()` after placement, so the scene graph stops
  recomposing thousands of matrices every frame. Anything that moves (traffic, racers, doors, lamps that sway) keeps it on.
- Culling: the custom fog-depth cull (`CULL`) only works with correct bounding spheres; recompute bounds after moving
  instances or editing positions.

### 4. Frame loop hygiene

- No allocation in per-frame code (`loop`, `stepRacer`, `poseRacer`, cameras, `updateFx`): reuse module-level scratch
  vectors. `new THREE.Vector3()` in a per-frame path is a GC hitch on phones.
- Simulation randomness goes through a seedable source (`AHDEV.sim` already swaps `Math.random` for a seeded one; new
  gameplay code should take a passed-in `rng` so replays, ghosts and future multiplayer stay reproducible).
- Physics currently substeps the render delta (`stepPhysics`). Before online multiplayer, move to a fixed step
  (e.g. 1/120 s accumulator) with render interpolation, so 60 Hz and 144 Hz players run the same simulation.
- Keep: delta capped at 33 ms, audio suspended on `visibilitychange`, `renderer.compile()` warm-up during loading,
  context-loss reload, frame pacer on pixel ratio. These already match the sources' advice.

### 5. Image pipeline

- Tone-map once (renderer ACES), bloom before grading, grain/lens last. Do not add a second tone mapper in a pass.
- No-post baseline: every level must read with post off. Fog, bloom, grain or tint never stand in for missing geometry;
  this is also why Clear is the default look.
- Every image effect gets a named on/off and its strength in the event's `userData` (`bloom`, `grade`, `lens`), so a
  pass can be isolated when tuning.

### 6. VFX (particles, sparks, skid marks, rain)

From nixie-fx's runtime contract, applied to our own code: one owner per effect system; update it exactly once per frame
with seconds; pool meshes and reuse geometry and material; seed anything random; stop ticking when hidden; free it with
the event in `releaseEvent`. Sharing a material does not merge draws on its own; a pooled system should render as one
instanced or points mesh.

### 7. Assets

- GLBs stay geometry-only, meshopt + quantized (`tools/optimize_models.sh`). Textures, if ever added: ≤ 1024 px, WebP or
  Basis (r128 has `BasisTextureLoader`, not `KTX2Loader`).
- Canvas textures: size to their largest on-screen footprint, power of two where mipmaps matter, `anisotropy` only on
  road and ground surfaces seen at grazing angles.
- Disposal: everything an event builds is freed by `releaseEvent` through `_own` windows; anything meant to survive
  (shared kit geometry, car materials) sets `userData.shared`. The perf report's leak check must not grow.

### Not for this repo (and why)

- WebGPU renderer, TSL, compute shaders, `BatchedMesh`, `Timer`, `compileAsync`, `KTX2Loader`, occlusion queries: all
  need r150+ ES modules. r128 globals, the fog `ShaderChunk` override and the `onBeforeCompile` patches would all have to
  be rewritten. Revisit only if draw calls stay over budget after section 3 is done, as a planned migration.
- nixie-fx as a library (ESM, modern three peer): use its contract (section 6), not the package.
- React Three Fiber tips, CDN/caching advice, AI asset generators (we use Midjourney → Blender).

## Learnings

Read `learnings.md` in this folder before 3D work and add one dated line at the end (symptom → cause → fix, with the
measured counts) whenever a rendering bug or perf fix lands. Merge or delete lines that stop being true.

## Related skills

Load from `.cursor/skills/` as needed:

- Scene/camera/renderer → `threejs-fundamentals`
- Track meshes / instancing → `threejs-geometry`
- Car paint / street materials → `threejs-materials`, `threejs-textures`
- Night lighting → `threejs-lighting`
- Bloom / composer → `threejs-postprocessing`
- Pointer / raycast (if adding 3D picks) → `threejs-interaction`

Upstream skill docs target Three.js **r160+ modules**; always translate to **r128 globals** using this file.
