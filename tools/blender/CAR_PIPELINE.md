# AFTERHOURS Car Pipeline: Reference to In-Game

Oct 1, 2026 · @Paris

## What success looks like

A car counts as done when its silhouette, lamps, grille and door lines sit on the Midjourney reference in a camera-matched overlay. It must also render cleanly in the real game and ship to `main` only after Paris signs off. Gran Four v3 reached that point on Oct 1, 2026 (merge `38995b1`).

The pipeline has five hand-offs: Midjourney references → a traced key table → a Blender build script (`tools/blender/<car>.py` on `carlib.py`) → a packed GLB in `models/` → a GLB shell in `js/afterhours.js`. A compare loop sits between the build script and the GLB: build, overlay against the reference, fix the biggest mismatch, repeat. Every step runs on a feature branch (`claude/<car>-blender-wip` on the Mac, or `cursor/<description>-<id>` in Cloud Agent) until sign-off.

```text
Refs → trace keys → <car>.py (carlib) ⇄ overlay loop → GLB → *GlbShell + BODIES + CARS → game verify → merge main
```

The loop between the build script and the overlay is where the work happens. Nothing moves to export until the red reference lines sit on the model.

**In-repo guardrail:** for GLB cars, the vinyl side-section sampler in `js/afterhours.js` must duplicate the Blender `HW` / `YS` / `YB` tables. `npm test` runs `tests/car-pipeline.test.js` to enforce that. See the file map at the end of this doc.

## Step 0: Gather references

The build is only as exact as the references, so collect at least 8 shots of the same car before modeling. Use the `afterhours-car-prompts` skill to write the Midjourney prompts, then reuse a favorite with `--oref` so every angle shows one design.

| Shot | Why it matters | Must show |
| --- | --- | --- |
| Side-on (or as close as you can get) | Sets every proportion: wheelbase, overhangs, roof, belt, cowl, hood | Both wheels, full length, flat to camera |
| Front three-quarter | Nose, grille, lamps, hood shape, front fender | Front wheel and the whole nose |
| Rear, straight on | Tail lamps, deck, spoiler, diffuser, pipes, rear glass | Ground under the tires |
| Rear three-quarter | Haunches and how the tail wraps the corners | Rear wheel and tail lamp |
| Nose close-up | Grille slats, lamp DRL shape, intakes | Square-on to the front |
| Blueprint or annotated sheet | Names each feature, so nothing gets missed | Callouts (#01–#11 on Gran Four) |

- Put the raw images in one folder (Gran Four used `~/Downloads/carpics`, 11 images) and connect it to the session.
- Copy the crops used for matching into `tools/blender/refs/` (`gf_side.png`, `gf_front34.png`, `gf_rear.png`), so the next session can rebuild without the originals.
- The side-on shot is the one to fight for. Without it, proportions are a guess, and we lost several rounds to that on Gran Four.

## Step 1: Tools and setup

The best setup has Blender open on the Mac with the MCP server running, so the build happens in a viewport Paris can watch. A headless copy of the game in the cloud serves as the final check.

1. Open Blender 5.2 on the Mac, hover the 3D viewport, press **N**, open the **BlenderMCP** tab and click **Connect to MCP server** (port **9876**). If the tab is missing: Edit → Preferences → Add-ons → search "MCP" → enable.
2. Link the chat to the Mac (Claude desktop app) and connect the reference folder.
3. Work on a branch: `git checkout -b claude/<car>-blender-wip`. Never build on `main`.
4. Push the build script and the reference crops to that branch. Blender then fetches them by commit SHA (`raw.githubusercontent.com/<owner>/<repo>/<sha>/…`), which avoids stale caches.
5. Backup path when the Mac isn't available: `pip install bpy` (Blender as a Python module, 5.2.2 on Python 3.13) and build headless with `/tmp/build.py <car>.py`. That takes about 20 s per full-detail build.
6. Real-game check: Playwright with the preinstalled Chromium (`/opt/pw-browsers`) serving the repo through request routing. three r128 is served from the npm package, because the CDN is blocked. Load with `?dev`, then pin the turntable yaw and snap the studio camera (otherwise shots land mid-move).

Cloud Agent: `python3 -m http.server 8080`, open the car archive, hard-refresh after bumping `afterhours.js?v=` in `index.html`.

## Step 2: Trace proportions from the side-on shot

Measure before modeling: this one step fixed more than every earlier round of eyeballing combined. The wheels are the ruler.

1. Crop the side-on panel and draw a labelled 10 px grid over it (a few lines of PIL).
2. Read both wheel centres and the tire radius in pixels. Set the real wheel radius (Gran Four: 0.40 m), then scale = radius px ÷ 0.40. That gave 130 px/m.
3. Convert every feature to game units: height = (ground y − y) ÷ scale, z = (x − wheelbase-centre x) ÷ scale. Front is +z, x is width, y is up.
4. Write the readings straight into the script's key tables:

| Feature | Gran Four reading | Key it feeds |
| --- | --- | --- |
| Wheelbase | 3.12 m (axles ±1.56) | `WB`, `BODIES.wb` |
| Front / rear overhang | 0.93 m / 0.75 m | `Z1`, `Z0` |
| Roof peak | 1.39 m at z −0.22 | `CH` |
| Windshield base (cowl) | 1.01 m at z 1.22, over the front wheel | `CH` end, `CZ1` |
| Beltline | ~1.03 m | `YT` along the doors |
| Hood at nose | 0.72 m | `YT` front keys |
| Door lines | front 0.8, B-pillar −0.3, rear −1.18 | shut-line cuts |
| Sill | 0.12–0.15 m | `YB` |

A side-on AI image still has slight perspective, so treat readings as ±3 cm. The overlay loop in Step 4 settles the rest.

## Step 3: Build the body in Blender with carlib

Copy the closest existing script (`autobahn_63.py` for four-doors, `gran_four.py` now) and change its keys. Don't start from a blank file or a hand-made three.js shell. The carlib loft plus boolean cuts is what gives the Wisp, AUTOBAHN and Gran Four their quality.

Build order inside the script:

1. **Body loft:** `car.build_body` with `HW` (half width), `YB` (floor), `YS` (shoulder), `YT` (deck/hood top). Then the shaping functions: `dome` (hood), `tumble` (how far the upper side leans in), `feature` (shoulder crease), `swage` (concave lower doors) and `lean` (nose/tail rake).
2. **Wheel arches:** cut at the traced axles, then `arch_liners`.
3. **Pockets:** recesses that follow the skin (grille, corner intakes, lamp slots, rear lower band), plus `strip_cut` shut lines for the doors and hood. Then `apply_cuts()`.
4. **Cabin:** `build_cabin` with the traced roofline `CH`, the `dlo` window outline, `pillars`, and the cabin widths `cw`/`rw`. Rear glass runs down to the spoiler lip.
5. **Details:** grille slats (rounded rods so each one catches light), DRL tube, projectors, lens grid, splitter following the bumper footprint, sills, mirrors, tail clusters, light bar, diffuser strakes, pipes, spoiler, interior.
6. **Finish:** `skin_normals()` so the cut panels shade as one surface, then print the station z values (head, tail) that the game needs.

Material names are the contract with the game: `PAINT GLASS GLOSSBLACK GAP HEAD TAIL TAILW CHROME LENS SATIN GRILLE YELLOW REFLECT INTERIOR`. A new name means a new entry in the shell's `MATS` map.

## Step 4: The camera-matched overlay loop

Never judge the model by eye from an arbitrary angle. Put a Blender camera where the reference camera was, render, and lay the reference over the render. Every miss then shows up as a measurable offset.

1. **Match the camera.**
   - Side view: an orthographic camera with `ortho_scale` = crop width ÷ px-per-metre, centred on the traced wheelbase centre.
   - Three-quarter views: pick 6–8 points you can find in both images (wheel centres, grille centre, roof peak, lamp corner, splitter corner, spoiler tip). Solve camera position, aim and focal length with least squares (scipy). Gran Four's front three-quarter solved to a 49 mm lens.
   - Rear: a straight-on camera, tuned by eye until the exhausts and lamps line up.
2. **Render and compare** from the scene camera (`render.opengl`, overlays off, stand-in wheels on) in two modes:
   - Red edges: reference outlines traced in red over the render. Best for silhouettes, door lines and lamps.
   - 50/50 mix. Best for volumes, glass and the overall read.
3. **Fix the biggest miss first,** in this order: wheelbase and axles → roofline and cowl → belt and side height → nose and hood height → grille and lamps → tail lamps and rear glass → small trim.
4. **Commit, push, rebuild by SHA, and re-render.** One change per loop keeps cause and effect clear.

Stop when the red lines sit on the model in the side, front three-quarter and rear views. Remaining offsets should come only from the AI image's own perspective.

## Step 5: Export and wire into the game

The game is a single file running global three r128, so the model goes in as a GLB plus a small shell function. The car's procedural shell stays in as a fallback.

1. **Export:** dump the meshes per material with `dump_mesh.dump(objs)`, then `python3 tools/blender/pack_glb.py dump.json models/<car>.glb`. Gran Four: 146k tris, 3.8 MB.
2. **Loader:** add `['<key>','models/<car>.glb?v=N']` to the GLTFLoader `want` list. Bump `v` on every re-export.
3. **Body entry:** `BODIES.<car>` with `wr`, `wb`, `tr`, `front` and `rear` copied from the script. The game places the wheels from these, so they must match the Blender axles exactly.
4. **Shell:** `<car>GlbShell(g,def,B,paint,glass)`. It maps Blender material names to game materials, tunes the paint (matte = no clear coat), places the lamp glow sprites at the printed stations, and returns a `sec(z)` sampler with the same `HW`/`YS`/`YB` keys as the Blender script (kept in sync by `tests/car-pipeline.test.js`). It falls back to the old shell if the GLB hasn't loaded. Register it in `SHELLS` and `GLB_SHELL_KEY`.
5. **Car def:** in `CARS`, set paint colour, rim, caliper and accent, and a `STREET` wheel style (Gran Four got a new `turbine` style).
6. **Cache bust:** bump `js/afterhours.js?v=N` in `index.html`.

Only use helpers the shell's own kit provides. Gran Four v2 called `K.plate`, which exists only after `outlawKit`, and that crashed the game at boot.

## Step 6: Verify in the real game and ship

The game's own render is the final word, because the car-select studio lights paint very differently from Blender. Gran Four's mid-gray `0x484946` came out near white.

1. `node --check js/afterhours.js` and `npm test`.
2. Boot the game headless with `?dev`, page to the car (Gran Four is index 6), and check the console shows no errors.
3. Shoot the same views as the references: front three-quarter, side, rear, rear three-quarter. Put them in a side-by-side board next to the design.
4. Tune game-only things here: paint value under the studio lights, glass opacity, wheel track, rim finish, lamp glow size.
5. Commit and push to the feature branch. Send Paris the board and leave the model open in his Blender scene.
6. **Only after Paris says merge:** `git merge --no-ff` into `main`, push, then check that GitHub Actions passes "Unit tests" and "Deploy to GitHub Pages".

## Mistakes we made and how to avoid them

Most of the lost time came from building before measuring and judging renders that weren't checked against the reference.

| Mistake | What it cost | Do this instead |
| --- | --- | --- |
| Hand-built three.js shell (v2) instead of the Blender pipeline | A blobby car Paris rejected | Start every car from a carlib script |
| Pushed v2 to `main` untested | Game crashed at boot (`K.plate is not a function`) | Boot it headless first; `main` only after sign-off |
| Eyeballed proportions from three-quarter shots | Nose too tall, cabin too far back, hood too long | Trace the side-on shot (Step 2) before anything else |
| Compared renders from mismatched cameras | Fixes chased camera error, not shape error | Solve the camera, then use red-edge overlays (Step 4) |
| Judged shape in flat, blown-out lighting | Couldn't see forms; paint read white | Clay or material preview plus overlays; tune paint in the game last |
| Screenshots taken mid camera move | Shots looked wrong for no reason | Pin turntable yaw and snap the camera in look-dev |
| Too few references | Guessing on side and rear | Collect 8–11 shots up front (Step 0) |
| Stop-hook "unpushed" warnings | Confusion | Push with `-u` once so the branch tracks its remote |

## Quick checklist for the next car

- [ ] 8+ Midjourney shots of one design, including a true side-on and a straight rear
- [ ] Reference folder connected; crops saved to `tools/blender/refs/`
- [ ] Blender open on the Mac, MCP connected on port 9876
- [ ] `claude/<car>-blender-wip` branch created
- [ ] Side-on traced: wheelbase, overhangs, roof, cowl, belt, hood, sill, door lines
- [ ] `<car>.py` copied from the closest script; keys replaced with the trace
- [ ] Side, front three-quarter and rear cameras matched; red lines sit on the model in all three
- [ ] GLB packed; loader entry, `BODIES`, shell, `SHELLS`, `GLB_SHELL_KEY`, `CARS`, wheel style, cache bust
- [ ] `npm test` passes, game boots headless with no console errors
- [ ] Side-by-side board sent to Paris; model left open in his Blender
- [ ] Paris says merge → merge to `main`, push, Pages deploy green

## In-repo file map (Gran Four v3)

| Reference file | Used for |
| --- | --- |
| `refs/granfour_sheet.jpg` | Four-view turnaround |
| `refs/granfour_blueprint.png` | Feature callouts |
| `refs/gf_side.png` | Side trace (130 px/m) |
| `refs/gf_front34.png`, `gf_front34_low.png` | Nose / grille |
| `refs/gf_rear.png`, `gf_rear_blueprint.png`, `gf_nose_blueprint.png` | Tail, lamps |

| In-game hook | Location |
| --- | --- |
| Blender source | `tools/blender/gran_four.py` |
| GLB | `models/gran_four.glb` |
| Shell + vinyl keys | `granfourGlbShell`, `GF_HW` / `GF_YS` / `GF_YB` |
| Physics profile | `BODIES.granfour`, `CARS[]` `granfour` |
| Wheels | `wheelStyle` `'turbine'` |
| Loader | `want[]` → `models/gran_four.glb?v=3` |

Other GLB bodies: Volcano P1, Kage R, Wisp 07, AUTOBAHN 63 — same pattern; see `tools/blender/README.md`.
