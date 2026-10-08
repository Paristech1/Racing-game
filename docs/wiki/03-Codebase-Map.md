# Codebase map

Almost everything lives in **`js/afterhours.js`** (~8k+ lines). Use search rather than reading top to bottom.

## Top-level data

| Symbol | Role |
|--------|------|
| `CARS` | Archive definitions (physics, body key, wheel style, outlaw/boss flags) |
| `BODIES` | Loft profiles for procedural car shells |
| `EVENTS` | `{ id, build, name, laps?, open?, knockout?, ... }` |
| `RIVALS` | AI personas (APEX, THE WALL, …) with behavior hooks |
| `SAVE` | Persisted player data (mirrored to `localStorage` key `afterhours.v1`) |
| `EV` | Current event object |
| `TR` | Active track runtime (`track` spline, width, hazards, traffic) |
| `R` | Racers array during a race |

## 3D and rendering

| Area | Search for |
|------|------------|
| Renderer / composer | `EffectComposer`, `UnrealBloomPass`, `composer` |
| Shared materials | `paint`, `wetRoad`, `makeEnv` |
| Car mesh | `buildCar`, `profileGeo`, `mergeByMaterial` |
| GLB cars/kits | `glbParts`, `kitParts`, `AH_MODELS` |
| City builder | `buildCity`, `PHILLY_CFG`, instancing helpers inside |
| Per-event build | `buildTunnel`, `buildBlvd`, `buildCalder`, … |
| Lighting / FX | `LAMPCONE`, rain, `WETFX`, headlight beams |

**Important:** helpers like `box`, `strip`, `deckY` often live **inside** `buildCar` or `buildCity`. You cannot call them from elsewhere unless you hoist or duplicate.

## Gameplay

| Area | Search for |
|------|------------|
| Player input | `keydown`, `.pad`, drift key |
| Physics step | `stepRacer`, `VCAP`, substeps |
| Draft / slipstream | draft helpers near AI section |
| Drift turbo / flow | adapted from ZER0-G (see README) |
| Pickups | `pickups`, `scorePickup`, position tables |
| Traffic | per-event `traffic` arrays and update fns |
| Tag team | `TAG`, `hot tag`, team points |
| Ghost replay | ghost recording / playback symbols |

## AI

| Area | Search for |
|------|------------|
| Chassis pick | `buildRivalForEvent`, `EVENT_CAR_BIAS` |
| Corner plan | `aiCornerPlan`, `kAvgOf` |
| Moods | LEAD / DEFEND / ATTACK / PUSH / ALL-IN |
| Persona quirks | comments on `RIVALS` entries |

## UI

| Area | Search for |
|------|------------|
| Screen switch | `show(`, `screen` class |
| Event roster | `#eRoster`, swipe handlers |
| Settings | `openSettings`, `#diff` |
| HUD | `#hPos`, speedo, boost bar |
| Audio | `AC`, music tracks `MT()` |

## `js/logic.mjs`

Pure functions duplicated in `afterhours.js` for testing:

- `rng`, `fmt`, `esc`, `clamp`, `lerp`
- Field size: `fieldSizeForEvent`, `clampFieldSize`, `fieldSizeChoices`
- Rival chassis eligibility, boss lists, knockout helpers

When you change behavior in one place, **update the other** or CI sync tests fail.

## `js/assets.js`

Runs early:

- Fetches GLBs in parallel
- Applies meshopt decoder when THREE arrives
- Widens quantized attributes (r128 quirk documented in `afterhours-threejs` skill)

## Files you rarely touch

- `js/ui-fx.js` — optional neon-glass UI experiment hooks
- `design/` — UI prototype deck (not production game)
- `tools/track_report.mjs` — generates `docs/track-report.md`

Next: [Adding an event](04-Adding-an-Event.md)
