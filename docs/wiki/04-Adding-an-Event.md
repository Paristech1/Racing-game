# Adding an event

This is the usual path for a **new track** in AFTERHOURS.

## 1. Plan the route

- Define a **centerline** as polyline or spline samples (game space: **x** right, **y** up, **z** forward).
- Decide **width**, **laps**, **traffic** yes/no, **open** sky vs tunnel, and special hazards (columns, gates, ice, crowd pads).
- Sketch a **track plan** PNG optional (`docs/track-plans/`).

## 2. Choose a builder pattern

**A. City kit (`buildCity`)** — best for grid streets + props:

- Add a config object (e.g. `MY_CFG`) with corners, `yAt` height, lane count, prop placements.
- Reuse instancing patterns from `PHILLY_CFG`, `MTAIRY_CFG`, etc.
- Attach Blender kit GLBs via `kitParts('philly_kit', ...)` when you have authored assets.

**B. Bespoke `buildSomething()`** — tunnels, Calder, Game Night one-offs:

- Return `{ scene, track, ... }` like existing `buildTunnel`, `buildCalder`.
- Still hook into shared road materials (`wetRoad`), fog, and bloom thresholds.

## 3. Implement `build` and optional `setup`

```javascript
function buildMyEvent() {
  // return partial event object; ensureEvent merges via Object.assign
  return {
    scene: new THREE.Scene(),
    track: { /* spline, width, ds, ... */ },
    // traffic, pickups, update(), resetTraffic(), etc.
  };
}
```

- **`setup()`** — run once after scene is ready: spawn traffic, bind crossing timers, intro camera.
- **`update(dt)`** — per-frame ambient motion (trains, Jumbotron, sunrise in First Light).

## 4. Register in `EVENTS`

Add an object near the `EVENTS` array:

```javascript
{
  id: 'myevent',
  build: buildMyEvent,
  open: true,           // outdoor sky / rain eligible
  laps: 3,
  name: 'My Event',
  kick: 'Event NN',
  loc: '...',
  when: '...',
  caption: '...',
  specs: '...',
  note: '...',
  load: 'Loading line shown on race start.'
}
```

Flags you might need:

| Flag | Meaning |
|------|---------|
| `open: true` | Outdoor; rain chance; different env map |
| `fullGrid: true` | All archive cars on grid (Philly Classic) |
| `knockout: true` | Gauntlet rules (use `buildKnockout` pattern) |
| `defaultField: 20` | Calder-style larger grids |

## 5. UI surfacing

The event roster is driven by `EVENTS` order and metadata. No separate HTML per event.

- Add **track plan** image if you want the footer map: wire id to existing plan loader (search `trackPlanPNG`, event id).
- Bump **README** event bullet so players know it exists.

## 6. Pickups and chevrons

- `addChevrons(e)` runs in `finishEvent` if not already baked.
- Power-up gems: follow patterns in sibling events; `autoPickupSpots` adds jam/slick/payback/ghost on every map.
- Position-dependent pickup behavior is table-driven (see [Power-ups](07-Power-Ups-and-Physics.md)).

## 7. Memory lifecycle

Events are **built on demand** and **released** when switching (`releaseEvent`, `releaseOthers`). Do not store huge meshes on the global `EVENTS` entry outside the id-window disposal rules.

When adding kit GLBs, mark shared geometry `userData.shared = true` so rival car clears do not dispose kit meshes.

## 8. Testing checklist

1. `python3 -m http.server 8080` — hard refresh after `?v=` bump.
2. Open **events** screen → select new event → confirm headline and loading text.
3. Console: no `ReferenceError` during build (common mistake: calling `buildCity`-local helpers from outside).
4. Drive one lap: checkpoints, finish line, traffic collisions, pickups.
5. Phone tier: open on narrow viewport or emulate — watch for WebGL context loss on huge scenes.

## 9. Agent / 3D work

Before editing meshes or materials, read:

1. `.cursor/skills/afterhours-threejs/SKILL.md`
2. The relevant `threejs-*` skill (geometry, materials, lighting, postprocessing).

Never add ESM `import` from `three/addons`; use globals from `index.html`.

Next: [Cars and models](05-Cars-and-Models.md)
