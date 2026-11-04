# Getting started

## Play

**Online:** [GitHub Pages](https://paristech1.github.io/Racing-game/) (needs CDN + Google Fonts).

**Local:**

```bash
cd /path/to/Racing-game
python3 -m http.server 8080
```

Open http://localhost:8080

The game loads Three.js r128 from cdnjs/jsDelivr and fonts from Google. Offline play only works if those URLs are reachable.

## Repository layout (the important parts)

```
index.html              All screens (boot, archive, events, race HUD)
css/afterhours.css      Magazine UI, HUD, sheets
js/afterhours.js        Entire game (3D, physics, AI, audio, UI logic)
js/assets.js            Early GLB fetch + meshopt decode (runs before THREE)
js/logic.mjs            Pure helpers (field size, RNG, formatting, etc.)
js/model-manifest.js    Content hashes for model cache busting (generated)
models/                 Compressed GLBs (kits + car bodies)
models/lod/             Lower-poly car twins for rival traffic
tests/                  Node unit tests (optional for you; CI runs them)
tools/optimize_models.sh  Compress exports after Blender
tools/blender/          Authoring scripts for kits and cars
docs/wiki/              This wiki
.cursor/skills/         Three.js agent skills (read before 3D edits)
```

## Cache busting

When you change **JavaScript or CSS**, bump the `?v=` query on the script/link tags in `index.html`. Otherwise browsers keep an old `afterhours.js`.

When you change **GLB models**, run `tools/optimize_models.sh` from the repo root. It rewrites models in place, rebuilds `models/lod/`, and regenerates `js/model-manifest.js` (hashes replace hand-bumped `?v=` on models).

## npm

```bash
npm test
```

Runs Node’s built-in test runner against `js/logic.mjs` and sync checks vs `afterhours.js`. You do not need this to play locally; CI uses it on pull requests.

## Mental model

Think of AFTERHOURS as a **single-page app** where:

1. HTML defines **screens** (`section.screen`) and HUD chrome.
2. One WebGL canvas (`#gl`) draws cars and tracks for both the **car archive studio** and **races**.
3. State is mostly **plain objects** (`SAVE`, `EV`, `TR`, racer array `R`) mutated each frame—no React, no bundler.

Next: [How the game runs](02-How-The-Game-Runs.md)
