---
name: afterhours-threejs
description: AFTERHOURS racing game Three.js stack and file layout. Use whenever editing 3D, rendering, tracks, cars, post-processing, or UI tied to the canvas in this repository.
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
