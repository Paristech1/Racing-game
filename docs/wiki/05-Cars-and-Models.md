# Cars and models

AFTERHOURS mixes **procedural JS bodies** with **Blender-exported GLBs** for hero cars and city kits.

## Car definition (`CARS`)

Each entry includes roughly:

- **Identity:** `id`, display name, class (heavy / nimble / muscle implicit in stats).
- **Physics:** `top`, `acc`, `grip`, `nitro`, `mass`, sometimes `vcap` or outlaw specials.
- **Visuals:** `body` key into `BODIES`, `wheelStyle`, paint color, optional `chassisId` for rivals sharing a shell.

Outlaw / boss cars (`overload`, `volcano`, `zephyr`, `hikari`) only appear for rivals when `RIVAL_BOSS` is true (warning on loading screen).

## Procedural body pipeline

1. **`BODIES[bodyKey]`** — 2D profile points + canopy spline.
2. **`profileGeo`** extrudes with bevel → painted mesh.
3. **`buildCar(def, opts)`** adds lights, mirrors, wheels, and per-car `if (cid === '...')` details.
4. **`mergeByMaterial`** collapses draw calls to one mesh per material.

Side trim must sit at **`B.w/2 + 0.14`** or it hides inside paint (see afterhours-threejs skill).

### Adding detail to one car

Use `cid = def.chassisId || def.id` so AI rivals driving that chassis get the same mesh.

Reuse materials: `paint`, `carbonM`, `chromeTrimM`, `headM` / `tailM` (unlit, bloom-friendly).

## Blender cars

Scripts in `tools/blender/` output raw GLB → run **`tools/optimize_models.sh`**.

| Output | Script (see tools/blender/README.md) |
|--------|--------------------------------------|
| `kage_r.glb` | `kage_r.py` + `carlib.py` |
| `wisp_07.glb` | `wisp_07.py` |
| `volcano_p1.glb` | `volcano_p1.py` |
| `autobahn_63.glb` | `autobahn_63.py` |
| City kits | `philly_kit.py`, `blvd_kit.py`, `mtairy_kit.py`, `calder_*.py` |

**Coordinate contract:** Blender scripts use `G(x,y,z) = (x, -z, y)` so export lands in game space.

**Material names** (`PAINT`, `CARBON`, …) are swapped in JS for game materials.

Wheels: many Blender cars are **body only**; wheels are procedural in `buildCar` via `wheelStyle` cases.

## Loading in the browser

1. `assets.js` downloads GLB bytes early.
2. After THREE loads, GLTFLoader + meshopt decoder parse models into `AH_MODELS`.
3. Quantized attributes are widened to float32 before any CPU geometry read (`glbParts`, `mergeGeos`).

## LOD rivals

Full car GLBs live in `models/`. `tools/optimize_models.sh` writes **`models/lod/`** (~30% triangles).

`buildCar(def, { lod: true })` prefers LOD when `AH_MODELS_LOD` has finished downloading.

## Sculpted hypercars (Overload, Volcano)

Documented in README: cross-section lofting, tube lights, canvas carbon, fresnel clearcoat—patterns from the threejs-skills pack, implemented with r128 globals.

## Checklist: new archive car

1. Add `CARS` entry and `BODIES` profile (or hook GLB in `buildCar`).
2. Wheel style if non-default.
3. Rival bias entries in `EVENT_CAR_BIAS` / `RIVAL_CAR_PREF` if needed.
4. Spec sheet bars auto from stats.
5. Bump `index.html` `?v=` for JS; optimize + manifest for new GLB.
6. Verify in studio: orbit + swipe, night lighting, bloom on lamps.

Next: [Rivals and AI](06-Rivals-and-AI.md)
