# AFTERHOURS — Issue 01

A playable three.js street racing prototype inspired by the [Claude design session](https://claude.ai/share/fa63898b-ab8d-49ee-983e-0aad1adc3ddf).

## Play online (GitHub Pages)

**https://paristech1.github.io/Racing-game/**

Requires an internet connection for three.js (CDN), post-processing scripts, and Google Fonts.

If the link is not live yet: in the repo go to **Settings → Pages**, set **Source** to **GitHub Actions** (or deploy from branch `main` / root). The `Deploy to GitHub Pages` workflow runs on every push to `main`.

## Play locally

```bash
python3 -m http.server 8080
```

Open http://localhost:8080

## Controls

| Action | Keyboard | Touch |
|--------|----------|-------|
| Steer | ← → or A D | ◀ ▶ pads |
| Brake | ↓ or S | BRAKE |
| Boost | Space | BOOST |

The car auto-accelerates. Drift through corners and draft behind rivals to refill boost.

## Events

- **Harbor Line — Tunnel 7** — icy tunnel loop, cold blue lighting
- **Event 02 — The Boulevard** — Roosevelt Blvd-inspired divided highway with traffic, signals, and lit facades

## Cars

- **Kage R** — agile tunnel machine
- **Vanta LM** — balanced Harbor Line pick
- **Noctis GT** — warm street-meet GT

Race history, best times, and ghost replays are saved in your browser.
