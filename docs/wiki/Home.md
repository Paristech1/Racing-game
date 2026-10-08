# AFTERHOURS Wiki

Welcome. This wiki explains **how the game is built and how to work on it**—not just what buttons do in a race (the [README](../../README.md) already covers player-facing detail).

## Who this is for

- You want to **add a track, car, or feature** without getting lost in `afterhours.js`.
- You want to understand **why** rivals dodge for power-ups, how ghosts are saved, or what happens when you swipe the event picker.
- You are using **Cursor / Claude agents** on this repo and want a map before you edit 3D code.

## Start here

| Page | What you'll learn |
|------|-------------------|
| [Getting started](01-Getting-Started.md) | Run locally, play online, cache busting, folder layout |
| [How the game runs](02-How-The-Game-Runs.md) | Boot → menus → race loop; modes and screens |
| [Codebase map](03-Codebase-Map.md) | Where cars, events, AI, physics, and UI live in one file |
| [Adding an event](04-Adding-an-Event.md) | `EVENTS[]`, `buildCity`, configs, testing checklist |
| [Cars and models](05-Cars-and-Models.md) | Procedural bodies, Blender GLBs, optimize pipeline |
| [Rivals and AI](06-Rivals-and-AI.md) | Personas, moods, chassis picks, corner braking |
| [Power-ups and physics](07-Power-Ups-and-Physics.md) | Position tables, drift/flow, speed substeps |
| [Graphics, audio, performance](08-Graphics-Audio-Performance.md) | Post FX, rain, 60 fps tricks, asset loading |
| [Save data and settings](09-Save-Data-and-Settings.md) | `localStorage`, ghosts, difficulty, field size |
| [Contributing with agents](10-Contributing-with-Agents.md) | `AGENTS.md`, Three.js skills, branch/PR flow |

## Quick facts

- **No build step.** Static files + `python3 -m http.server 8080`.
- **One big script:** almost all game code is `js/afterhours.js` (IIFE, global `THREE` r128).
- **Shared logic:** `js/logic.mjs` mirrors pure helpers for automated tests; the browser duplicates the same functions inline today.
- **3D content:** procedural city geometry in JS; hero kits and some cars from Blender → `models/*.glb` → `tools/optimize_models.sh`.

## Related docs

- [README](../../README.md) — full event list, controls, cars, rivals (player manual).
- [Track report](../track-report.md) — lap-length / geometry notes for tracks.
- [Blender tools README](../../tools/blender/README.md) — script → GLB mapping.
- [AGENTS.md](../../AGENTS.md) — instructions for coding agents on this repo.
