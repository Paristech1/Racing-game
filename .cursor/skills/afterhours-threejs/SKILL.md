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

## Related skills

Load from `.cursor/skills/` as needed:

- Scene/camera/renderer → `threejs-fundamentals`
- Track meshes / instancing → `threejs-geometry`
- Car paint / street materials → `threejs-materials`, `threejs-textures`
- Night lighting → `threejs-lighting`
- Bloom / composer → `threejs-postprocessing`
- Pointer / raycast (if adding 3D picks) → `threejs-interaction`

Upstream skill docs target Three.js **r160+ modules**; always translate to **r128 globals** using this file.
