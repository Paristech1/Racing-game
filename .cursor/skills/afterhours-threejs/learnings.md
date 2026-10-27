# afterhours-threejs learnings

One dated line per lesson: symptom → cause → fix, with measured counts. Newest at the bottom. Merge or delete lines that stop being true.

- 2026-10-27: `renderer.info.render` read after a race frame showed only a few calls → `info` resets on every `render()` and the composer renders several passes → read counts through `AHDEV.perf()`, which holds the reset for one `draw()`.
- 2026-10-27: Roosevelt Blvd at ~2,000–2,650 draw calls → instancing is done per block, not per level: 1,510 `InstancedMesh`, 337 holding one copy, 247 holding 2–4 → batch by (geometry, material) across the whole level before adding detail.
- 2026-10-27: 1,165 materials on Blvd but only 375 distinct parameter sets (790 duplicates; Last Call 480) → materials are created per prop instead of per role → cache materials by parameters.
- 2026-10-27: leak check (tunnel → blvd → tunnel) grew GPU geometries 724 → 750 and textures 212 → 225, and tunnel alone shows 315 geometries on a first visit but 724 after visiting every event → something survives `releaseEvent` (suspects: per-car canvas textures, LOD twins, label sprites). Not fixed yet; find the owner before adding more kits.
