# Contributing with agents

This repo is tuned for **Cursor Cloud Agents** and Claude Code working on GitHub.

## Read first

1. **[AGENTS.md](../../AGENTS.md)** — product summary, test commands, branch naming.
2. **[afterhours-threejs skill](../../.cursor/skills/afterhours-threejs/SKILL.md)** — mandatory before any 3D change.
3. Pick a **`threejs-*`** skill matching your task (materials, geometry, lighting, postprocessing, interaction).

Upstream skills describe **r160+ ESM**; you must translate to **global THREE r128** and `examples/js/` addons loaded in `index.html`.

## Branch and PR flow

- Branch names: `cursor/<description>-d068` (or assigned suffix) or `claude/...` per session.
- Open **draft PRs** against `main`; merge deploys to GitHub Pages via Actions.

## Testing expectations

| Change type | Verify |
|-------------|--------|
| JS/CSS gameplay | `python3 -m http.server 8080`, bump `?v=`, hard refresh |
| Track/event | Event picker → load → console clean, loading copy correct |
| Car studio | Swipe changes car; vertical drag still orbits |
| Logic shared with tests | `npm test` if you touched `logic.mjs` or mirrored helpers |
| GLB | `tools/optimize_models.sh`, commit manifest |

You asked for **education wikis, not new unit tests** — existing CI tests remain; agents should not expand test suites unless you request it.

## Common agent mistakes

1. **Importing Three modules** — use globals, not `import`.
2. **Calling `buildCity` helpers globally** — they are scoped inside the function.
3. **Forgetting cache bust** — `index.html` `?v=` for JS/CSS; manifest for models.
4. **Committing raw GLB** — always run optimize script.
5. **Building all events at boot** — use `ensureEvent` / `releaseEvent` patterns.
6. **Reading GLB geometry too early** — wait for assets widen pass.

## Design prototypes

`design/` holds UI experiments (deck, concepts). Production UI is `index.html` + `css/afterhours.css` + relevant handlers in `afterhours.js`.

## Where to document player-facing changes

- **README.md** — controls, event blurbs, car list (players read this).
- **docs/wiki/** — how the code works (you read this).

When you add an event or major feature, update both.

Back to [Wiki home](Home.md)
