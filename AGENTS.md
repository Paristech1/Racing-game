# AGENTS.md — AFTERHOURS Racing Game

Instructions for Cloud Agents and other coding agents working in this repository.

## Product

Browser-only street racing game (`index.html`, `js/afterhours.js`, `css/afterhours.css`). Deployed via GitHub Actions to GitHub Pages on push to `main`.

## Environment

See `.cursor/environment.json`: static site served with `python3 -m http.server 8080`. No build step.

## Three.js skills

This repo vendors Three.js agent skills under **`.cursor/skills/`** (from the [threejs-skills](https://github.com/CloudAI-X/threejs-skills) collection; originally documented as `pinkforest/threejs-playground`).

| Skill | Use when |
| --- | --- |
| **`afterhours-threejs`** | **Always read first** for this codebase — r128 globals, monolith layout, cache busting |
| `threejs-fundamentals` | Scenes, cameras, renderer, transforms |
| `threejs-geometry` | Meshes, BufferGeometry, instancing |
| `threejs-materials` | Materials and PBR |
| `threejs-lighting` | Lights and shadows |
| `threejs-textures` | Textures and UVs |
| `threejs-animation` | Keyframe / skeletal animation |
| `threejs-loaders` | GLTF and loaders (rare here; mostly procedural geometry) |
| `threejs-shaders` | Custom GLSL |
| `threejs-postprocessing` | EffectComposer, bloom, passes |
| `threejs-interaction` | Raycasting and controls |

Before changing 3D code, read **`afterhours-threejs`** and the most relevant `threejs-*` skill, then adapt examples to **global THREE r128** (not ESM `three/addons/`).

## Testing

1. Serve locally (`python3 -m http.server 8080`).
2. Hard-refresh or bump `?v=` on script/css in `index.html` after JS/CSS changes.
3. For track/event work: open event picker, load the new event, confirm no console errors and correct headline/lap loading text.
4. For car-select / canvas gestures: verify swipe changes cars without breaking orbit.

## Git

Use branch names `cursor/<description>-b80a`. Open PRs against `main` for production deploy.
