# How the game runs

## Boot sequence

1. **`js/assets.js`** (in `index.html` before Three.js) starts downloading every GLB listed in `js/model-manifest.js`.
2. The **boot screen** (`#boot`) shows real download progress on `#bootbar`.
3. Three.js r128 and post-processing scripts load from CDN.
4. **`js/afterhours.js`** initializes the renderer, builds shared materials, and waits for user tap **Open the issue**.

Until the player leaves boot, heavy event geometry is **not** built. Events are created on demand when selected (see [Codebase map](03-Codebase-Map.md)).

## Screens (UI modes)

Screens are `<section class="screen">` elements. `show(id)` toggles `.on` on one screen at a time.

Typical flow:

```
boot → archive (car pick) → event roster → event detail → loading → race → results
```

Other surfaces:

- **Bottom sheet** (`#sheet`) — car spec “magazine” pages (swipe / arrows).
- **Settings sheet** (`#settingsSheet`) — glow, look, rival difficulty, music, etc.
- **In-race HUD** — speed, boost, position, tag-team partner info when enabled.

`mode` in JS tracks coarse state: browsing vs `race`. The render loop always runs; during menus the studio camera orbits the selected car.

## Picking a car

- `CARS` is the archive array (stats, body profile keys, outlaw flags, etc.).
- Swiping on the canvas or using arrows changes index; **vertical drag** orbits the studio camera, **horizontal** changes car (see AGENTS.md testing note).
- **Specs** opens the sheet with bars for top speed, grip, boost, weight.

## Picking an event

- `EVENTS` entries include metadata (`name`, `kick`, `caption`, `specs`, `load` text) and a **`build`** function.
- `ensureEvent(ev)` calls `ev.build()` once, then `finishEvent` (chevrons, baked racing line, optional `setup`).
- Leaving an event calls `releaseEvent` to dispose GPU resources in that event’s id window—important on phones.

## Starting a race

1. Loading screen shows event copy (`ev.load`).
2. Grid size comes from `fieldSizeForEvent` (per-event save + presets 4/7/12/max).
3. Rivals spawn via persona grid or full archive (Gauntlet / Philly Classic).
4. Shaders compile up front to avoid mid-race hitches.
5. `mode = 'race'`; physics step runs in `requestAnimationFrame`.

## During the race

Each frame (simplified):

1. Read input (keyboard, touch pads).
2. `stepRacer` for player and each AI car (steer, throttle auto, boost, drift, collisions).
3. Traffic / hazards / pickups / tag-team rules.
4. Update camera chase, audio, HUD (DOM updates only when values change).
5. Render via `EffectComposer` (bloom, grade, speed blur).

## After the race

Results screen updates `SAVE` history (runs, wins, best lap per event, hit count). A **ghost** of your best lap may be stored and replayed on the next run.

## Gauntlet (knockout)

`EVENTS` entry `ko` sets `knockout: true`. Laps are effectively unlimited until one car remains; each lap can apply a random **rule modifier** (nitro rain, lights out, etc.). See README tournament table.

Next: [Codebase map](03-Codebase-Map.md)
