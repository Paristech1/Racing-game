# AFTERHOURS — code audit: dead code + gameplay/UX bugs

**Status:** audit only — no game code changed in the PR that adds this file. Implement fixes on a new branch from `main` using **Part C** below.

Scope: `js/afterhours.js` (8158 lines), `js/assets.js`, `js/logic.mjs`, `index.html`, `css/afterhours.css`.
Method: ESLint `no-unused-vars`/`no-undef`/`no-dupe-keys` over the monolith, cross-reference of HTML ids / CSS selectors,
a full read of the state machine (menus, race loop, results, highlights, Gauntlet, Tag team), and a headless-Chrome run
of an instrumented copy of the site (boot -> select -> events -> race -> results -> highlights -> run it back -> Gauntlet).
`npm test` passes (89/89) on `main` at `ab7841f`.

Line numbers refer to `js/afterhours.js` on `main`.

---------------------------------------------------------------------------------------------------------------------

## PART A — Bugs affecting gameplay / UX (ordered by impact)

### A1. Gauntlet map picker is ignored: every tournament runs on City Hall Arena  [CONFIRMED at runtime]
Repro (headless): pick Dockside in the picker -> preview shows `The Gauntlet · Dockside Dash`, L=1337 m ->
press Start -> loading screen shows `The Gauntlet`, L=1695 m (arena) -> race is on the arena.

Cause: `bindKoTrack()` (5524) builds a *detached copy* `EV=Object.assign({},base,...)` pointing at the picked map's scene,
then `releaseOthers()` frees the base `ko` event's scene. `startGauntlet()` (7604) then calls `startLoading()` (7711),
which does `if(mode!=='events'){ setEvent(EVI); ... }`. `mode` is `'gauntlet'`, so `setEvent(4)` runs,
`ensureEvent(EVENTS[4])` finds no scene and **rebuilds the arena**, overwriting `EV`, and `releaseOthers()` frees the map
the player just picked. Same thing happens on "Run it back" from a Gauntlet results screen (mode `'results'`).
Side effect: two full city builds + two releases back to back = a multi-second main-thread stall right after pressing Start.

Fix direction:
- In `startLoading()` do not call `setEvent()` when the current `EV` is already the right event. Simplest:
  `if(mode!=='events' && !(EV && EV.knockout && EV.scene===RS)) { setEvent(EVI); setupAttract(CARS[sel]); }`
  or, cleaner, give `bindKoTrack` ownership: `if(EVENTS[EVI].knockout) bindKoTrack(koMapI); else setEvent(EVI);`
- Audit every other `setEvent(EVI)` call site for the same assumption (`renderEvent` 7581, `startLoading` 7713).
- Add a unit test in `tests/` if `bindKoTrack`/`startLoading` logic is extracted to `logic.mjs` (recommended: a pure
  `resolveEventForStart(mode, ev, evi, koMapI)` helper).

### A2. Loading, countdown and highlight timers are frame-count based, not wall-clock  [CONFIRMED]
`loop()` (8053) clamps `dt=Math.min(.033, rawMs/1000)`. `modeT`, `countdown`, `finishHold`, `hiPlay.t`, `toastT`, `KO.bannerT`
all accumulate this clamped `dt`. On a device running at 20 fps the 3.6 s loading screen takes ~11 s, the 3-2-1 countdown
~6 s, a 6 s highlight ~9 s; during a shader-compile stall (see A3) the bar simply stops. Users read this as a freeze.
In the headless run (7 fps) the loading screen never finished in 60 s.

Fix direction:
- Keep the clamped `dt` for physics, but drive UI timers from `rawMs` (capped at e.g. 250 ms so a backgrounded tab does
  not skip the countdown): `const uiDt=Math.min(.25,rawMs/1000); modeT+=uiDt; ...`.
- Specifically: `modeT` (loading bar + `startRace` trigger at 8064), `countdown` (8089), `finishHold`/`slowmo` lerp (8100),
  `hiPlay.t` (7396), `toastT`, `KO.bannerT`, `camTag.t`, `attractStep` can stay on `dt`.

### A3. Multi-second main-thread stalls at scene/race transitions ("menu hiccups", "freeze after race")  [CONFIRMED]
Measured in the instrumented run (software GL inflates numbers, but the *shape* is the problem):
- first `draw()` after an event is built: 2.4 s – 6.9 s (all shaders for the new city compile on first frame)
- `startRace()`: 170 ms building 7 cars + 1.0 s `renderer.compile(RS,cam)`; 12-car Gauntlet grids are worse
- first frame on the results screen: 2.2 s (studio shaders re-compiled, see A4)
- a car-page turn in the archive: up to 1.2 s on the first visit of a page (new shell materials compile)

Contributing causes:
1. `releaseEvent()` (5510) disposes **every** geometry/material/texture reachable from the old scene, including shared
   module-level ones (`STREAK_MAT`, `LAMPCONE_MAT`, `LAMPPOOL_MAT`, `kitMats()`, `phillyKitMats()`, `SHADOW_MAT`,
   `glowTex`, `smokeTex`, `CHEV_TEX`, `plateTex` cache, `CARTEX`, `TIRE_GEO`, `puGeo`/`puRing`, GLB parts cache,
   traffic-car geometry, the attract racers' car materials `carbonM`/`chromeTrimM`/`headM`/`tailM`, ...). three.js
   re-uploads/recompiles them on next use, so **every event page turn triggers a wave of shader recompiles and texture
   re-uploads** for things that were never meant to be freed.
2. Nothing is compiled ahead of time except the single `renderer.compile(RS,cam)` in `startRace`; the studio scene,
   HUD effects (`slMesh`, sparks, smoke, rain, shield bubble, crown sprite) and highlight cars all compile on first draw.
3. `flash()` (7457) adds `#gl.blur` (`filter: blur(10px) brightness(1.4)` on a full-screen WebGL canvas with a .45 s
   transition) on every page turn / shutter. On phones a CSS blur over a full-screen canvas costs tens of ms per frame.
4. `pace()` (6298) also runs in menus; each pixel-ratio step calls `resize()` -> `composer.setSize()` which reallocates
   the MSAA target, 5 bloom mips and the lens target (a hitch in itself), and the first heavy frame after a transition
   can trigger a step-down followed 4 s later by a step-up.

Fix direction (in order of payoff):
- Make `releaseEvent` only dispose what the event owns: tag event-owned resources (`userData.owned=true` when created
  inside `buildCity`/`sceneKit`/bespoke builders) and skip everything else, or keep a module-level `SHARED` WeakSet of
  materials/textures/geometries that must never be disposed. At minimum skip objects with `geometry.userData.shared`
  (already used by `clearRacers`) and any material/texture referenced from module scope.
- After building an event (in `renderEvent`/`setEvent`) call `renderer.compile(RS,cam)` once, and compile the studio
  scene once at boot, so compiles happen behind the loading/flash transition instead of on the first visible frame.
  Consider `KHR_parallel_shader_compile` is not available in r128; keep compiles off the first frame instead.
- Replace the `#gl.blur` filter in `flash()` with a cheap overlay (the white `#flash` div already exists) or a shader
  uniform in the grade pass (`uHit`-style). Remove `canvas.classList.add('blur')`.
- Gate `pace()` to `mode==='race'` (and `highlight`), and reset `PACE.ema/over/hold` on mode change so a transition
  frame never counts.
- `startRace`: build rival cars with `{lod:true}` (already), but pre-warm by building the grid during the loading screen
  (first frame of `loading`) instead of at `modeT>3.6`, so the bar has something real to show and the compile is hidden.

### A4. Results screen keeps the whole race resident and rebuilds cars for highlights  [design risk, mobile]
`finishRace()` (7763) switches to the studio scene but never calls `clearRacers()`/`endGhost()` on the race scene;
`playHighlight()` (7383) builds **full-detail** `buildCar(def)` copies on top of the still-resident racers, every time a
highlight is tapped; `hiCars` are only removed on `endHighlight`/quit, never disposed. On a phone that already holds
a full city + 7–15 cars + all studio cars, this is where OOM reloads (perceived as "the game froze/went black") are most
likely. Also visible: the real racers stay frozen on the track during a highlight replay.

Fix direction:
- In `playHighlight`, hide the live racers (`racers.forEach(r=>r.m.group.visible=false)`) and restore them in
  `endHighlight`; reuse the racer's own mesh for the replay instead of building a new car
  (`hiCars.push({id, group: racer.m.group, wheels: racer.m.wheels})`), falling back to `buildCar` only for cars that
  are not on the grid.
- Dispose `hiCars` geometry when removing them (mirror `clearRacers`).
- Reset `#hMsg` in `endHighlight` (it currently keeps the highlight title until the next race sets "3").
- After watching a highlight the player lands on the magazine page where "Run it back / Back to the archive" are hidden
  (`#rClassic` is `display:none` while the report is shown). Add those two buttons to `.magact` as well, or make
  `endHighlight` call `showResultsClassic(true)`.

### A5. Highlight replay can stall forever if the tape has no samples
`highlightStep()` (7394): `const row=snapAt(hiPlay.t); if(!row) return;` runs before the `t>=t1` check, so with an empty
`raceTape.snaps` the mode stays `'highlight'` with the HUD on and nothing drawn; only Quit escapes. Guard it:
`if(!row){ endHighlight(); return; }` and have `renderRaceReport` hide the Watch button when `raceTape.snaps.length<2`.

### A6. `collide()` dereferences `raceTape.battle` while `raceTape` can be null
7223: `if(!a.tr&&!b.tr&&raceT<9&&raceT>0&&!raceTape.battle)`. `raceTape` is `null` until the first `tapeReset()`; the
attract loop (boot/events/loading screens) runs `collide()` with `raceT` left over from the previous race, which is >9,
so it is only safe by accident. If `raceT` is ever reset to a small positive value outside a race this throws every frame
and freezes the attract scene. Fix: `raceTape&&!raceTape.battle`.

### A7. Wheel hub cap code swallowed by a comment (visual)
2870: `// hikari: gunmetal centre, the red is on the calipers hub.rotation.z=Math.PI/2; hub.position.x=side*.17; spin.add(hub);`
The three statements after the comment text are part of the comment, so the `hub` mesh is created and never added
(ESLint: `'hub' is assigned a value but never used`). Move the comment, keep the statements.

### A8. Duplicate `TRIM` key in `kitMats()` (visual)
3225 defines `TRIM` as dark gunmetal (`0x101113`, metal .3); 3230 redefines it as cream (`0xd9d4c8`). The second wins
for every kit (Blvd, Philly, Mt Airy), so any kit part named `TRIM` renders light. Decide which is intended per kit
(probably rename one to `TRIM_LIGHT`/`TRIM_DARK` and update the Blender kit material names in `tools/blender/*_kit.py`).

### A9. Smaller issues found while reading
- `setWorld(w)` (6109): unknown key -> `c.hemi[0]` TypeError. Add a fallback (`||W.ice`) so a new car with a typo in
  `world` cannot break `renderPage`.
- `renderEvent` (7589) builds `#eGhost` text with a hard-coded persona list; `#eGhost` is clamped to 2 lines on short
  landscape screens so the power-up legend is unreadable. Move `PU_DESC` to the spec sheet or a tap-to-expand.
- `knockOut()` parks a car at `r.dist=-1e7-...`; `standings()`/`updateMood()` still include it via `order` for
  non-knockout code paths (`moodPickup` uses `racers.filter(...)` without `!o.out`). Add `!o.out` filters in
  `nearestChaser`/`nearestAlongside`/`leaderOf`/`moodPickup` (near-count at 6981).
- `finishTagTeam()` (7950): `me=mine.cars.find(r=>r.def.tag==='YOU')` - if the player tagged and the anchor swap left
  `player` on the partner, stats (`hist`) are written to the *original* car only; intended? If not, use `player.def.id`.
- `releaseEvent` key list misses `introCrane`, `legS`, `pads`-related `padsHit` etc.; harmless but leaks the arrays.
- `addEventListener('keydown')` (7433): Enter on the results screen calls `startLoading()` even while a highlight is
  playing (`mode==='highlight'` is not handled), leaving `hiCars` in the race scene. Treat `highlight` like `results`.
- `index.html` loads `OrbitControls.js` only for the showcase; fine, but `ensureShowcaseOrbit()` is called every frame in
  `select`/`results` just to set `enabled=false` (7080). Create it once in `openShowcase` and drop the per-frame call.
- 404 in console on every load (favicon). Add `<link rel="icon" href="data:,">`.

---------------------------------------------------------------------------------------------------------------------

## PART B — Dead code

Verified with ESLint (`no-unused-vars`, args ignored) plus manual checks; **no `no-undef` errors**, so nothing below is
load-bearing. Safe to delete unless noted.

| Line | Symbol | Note |
| --- | --- | --- |
| 278 | `const GHOST_CAR` | never referenced (ghost uses the recorded car's def) |
| 2628 | `FORGED_BLACK` | material created at load, never used (also allocates a GPU-less object; harmless) |
| 2780 | `flares` helper inside `buildCar` | never called; it is documented in `.cursor/skills/afterhours-threejs/SKILL.md` — either delete and update the skill, or keep and mark intentional |
| 2870 | `hub` | see A7 — this is a bug, not dead code |
| 3752 | `const L=TR.L` in `hazardCrossed` | unused local |
| 4658 | `lit` in `buildGameNight` | result of `K.lights()` unused (side effect kept) — drop the binding |
| 4660 | `ringM` | unused helper |
| 4680 | `lowBand` | mesh is added via `K.mesh` side effect; drop the binding only |
| 4989 | `sch`, `brk`, `awC` in `buildMtAiry` | unused arrays |
| 5130 | `rust` in `buildKensington` | unused material |
| 5199 | `xb` | sign added by side effect; drop the binding |
| 5745 | `const BR_LABEL` | never referenced |
| 6313 | `rainBuf` | declared, never assigned/used |
| 6436 | `const AXV` | four `Vector3`s never used |
| 6612 | `ld` in `axTick` | unused local |
| 7020 | `const g=r.dist-tgt.dist` (wall persona) | unused |
| 7107 | `const vT=corner.vTarget` | unused |
| 7257 | `ghostAcc` | reset in `startRace`, never read |
| 7331 | `function racerLabel` | never called |
| 7541 | `h` in `renderShowcase` | `hist()` call result unused (the `forEach` below calls `hist` again) |

Other dead/duplicate material:
- `js/logic.mjs` duplicates ~10 functions from the monolith purely for tests; `tests/sync.test.js` enforces the copies
  stay in sync. This is intentional, but the drift-guard regexes in `tests/extract.mjs` (`stripForCompare`) are brittle.
  Longer-term: have `afterhours.js` consume `logic.mjs` (a tiny build step or a `<script type=module>` shim) and delete
  the copies.
- CSS: `:root[data-theme="dark"]` / `:root:not([data-theme="light"])` rules — `data-theme` is never set anywhere. Remove.
- CSS `#hud .lap{pointer-events:none}` is declared twice (108/110). Merge.
- `index.html`: `#cHint`, `#issue` are static; fine. `#grain`/`#vig` only styled. Fine.
- `tools/blender/`: `skyline_kit.py` and `hellbound_717.py` have no corresponding GLB in `models/` and no entry in
  `js/assets.js` `ORDER` — either unfinished or abandoned; confirm with the author before deleting.
- `window.AH_MODEL_READY` hot-swaps studio cars when a GLB lands late; `GLB_SHELL_KEY` lists 6 shells — keep.
- `DEV`/`window.AHDEV` (6248) is a documented look-dev hook behind `?dev`; keep.

---------------------------------------------------------------------------------------------------------------------

## PART C — Hand-off: what to do, in order

Agent brief (copy/paste):

1. Branch `cursor/gauntlet-map-and-menu-stalls-<suffix>` off `main`.
2. **A1** — fix `startLoading()` so it never calls `setEvent()` over a bound Gauntlet map; add a `tests/` case if the
   decision is moved to `logic.mjs`. Manual check: Gauntlet -> pick Dockside -> Start -> `#ldwhere` reads
   `The Gauntlet · Dockside Dash` and the HUD lap text says `Round 1 · 12 left` on the Dockside loop.
3. **A6, A5, A7, A8, A9 one-liners** — low-risk correctness fixes in the same PR.
4. **A2** — introduce `uiDt` (wall-clock, capped 250 ms) for loading/countdown/finish-hold/highlight/toast/banner timers.
   Manual check with Chrome DevTools CPU throttling 6x: countdown still takes ~3 s, loading ~3.6 s.
5. **A3.1** — scope `releaseEvent` disposal to event-owned resources. Verify with `renderer.info.programs.length`
   before/after turning event pages: it must not drop below the studio baseline and must not re-grow on return.
6. **A3.2–3.4** — `renderer.compile` after build and at boot for the studio; remove `#gl.blur`; gate `pace()` to race
   modes. Verify with the Performance panel: no long task > 100 ms when turning event pages after the first visit.
7. **A4** — reuse live racer meshes for highlights, hide/restore racers, dispose `hiCars`, show Run-it-back/Back on the
   report page, reset `#hMsg`.
8. **Part B** — delete the listed dead symbols (keep `flares` only if the skill doc is kept in sync); run `npm test`.
9. Bump `?v=` on `js/afterhours.js` and `css/afterhours.css` in `index.html` (AGENTS.md rule).

Conventions to respect: global THREE r128 (no imports), single IIFE, helpers scoped inside builders, keep diffs minimal,
read `.cursor/skills/afterhours-threejs/SKILL.md` before touching car/track code, `npm test` must stay green
(`tests/sync.test.js` will fail if a duplicated helper in `logic.mjs` is changed on one side only).

How I reproduced things, for whoever picks this up:
- Serve a copy of the repo and append a small `window.__AH` accessor inside the IIFE (getters for `mode`, `EV`, `TR`,
  `racers`, `player`, setters for `modeT`/`countdown`, and a `finishNow()` that teleports the grid to the finish). Drive it
  with puppeteer-core against `/usr/local/bin/google-chrome --headless=new --use-angle=swiftshader`. Expect ~7 fps, so
  always skip the loading timer by setting `modeT=3.55` and read state via the accessor rather than waiting on screens.
