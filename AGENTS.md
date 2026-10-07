# AGENTS.md — AFTERHOURS Racing Game

Instructions for Cloud Agents and other coding agents working in this repository.

## Product

Browser-only street racing game (`index.html`, `js/afterhours.js`, `css/afterhours.css`). Deployed via GitHub Actions to GitHub Pages on push to `main`.

## Environment

See `.cursor/environment.json`: static site served with `python3 -m http.server 8080`. No build step.

## Three.js skills

This repo vendors Three.js agent skills under **`.cursor/skills/`**, symlinked into **`.claude/skills/`** so Claude Code loads the same files (from the [threejs-skills](https://github.com/CloudAI-X/threejs-skills) collection; originally documented as `pinkforest/threejs-playground`).

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

## Other agent skills

Vendored under **`.cursor/skills/`** (symlinked from **`.claude/skills/`**). See `.cursor/skills/ATTRIBUTION.md` for licenses and sources.

### Skill security review (SkillSpector)

| Skill | Use when |
| --- | --- |
| **`skill-inspector`** | Deciding if a skill folder or download is safe to install — static scan + source review |

### Engineering habits (Waza)

| Skill | Use when |
| --- | --- |
| `think` | Before building something new — pressure-test design and produce an implementation plan |
| `ui` | Distinctive frontend UI (not generic defaults) |
| `check` | After a task — diff review, verification, release/maintainer actions |
| `hunt` | Bugs/regressions — root cause before any fix |
| `write` | Natural Chinese/English prose edits |
| `learn` | Six-phase research in an unfamiliar domain |
| `read` | Summarize or extract Markdown from URLs/PDFs |
| `health` | Agent/project health audit (instructions, verifiers, maintainability) |

### Cybersecurity (818 skills)

Flat layout: `.cursor/skills/<skill-name>/SKILL.md`. Scan descriptions or use `.cursor/skills/cybersecurity-index.json`. Covers DFIR, cloud, AppSec, threat hunting, GRC, etc. **Lawful, authorized use only** (pen testing, IR, research with permission). For MCP server trust, prefer **`skill-inspector`** or `auditing-mcp-servers-for-tool-poisoning` over generic debugging skills.

## Testing

0. **Unit tests:** `npm test` (Node built-in test runner; pure logic in `js/logic.mjs`, specs in `tests/`).
1. Serve locally (`python3 -m http.server 8080`).
2. Hard-refresh or bump `?v=` on script/css in `index.html` after JS/CSS changes.
3. For track/event work: open event picker, load the new event, confirm no console errors and correct headline/lap loading text.
4. For car-select / canvas gestures: verify swipe changes cars without breaking orbit.

## Git

Use branch names `cursor/<description>-b80a` (Cursor) or the `claude/…` branch the session assigns (Claude Code). Open PRs against `main` for production deploy.
