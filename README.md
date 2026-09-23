# AFTERHOURS — Issue 01

A three.js night street-racing game presented as an underground car magazine. Browse the archive, pick a machine, pick tonight's event, and race six rivals.

## Play online (GitHub Pages)

**https://paristech1.github.io/Racing-game/**

Requires an internet connection for three.js r128 (cdnjs + jsDelivr) and Google Fonts.

If the link is not live yet: in the repo go to **Settings → Pages**, set **Source** to **GitHub Actions**. The `Deploy to GitHub Pages` workflow runs on every push to `main`.

## Play locally

```bash
python3 -m http.server 8080
```

Open http://localhost:8080

## Controls

| Action | Keyboard | Touch |
|--------|----------|-------|
| Steer | ← → or A D | ◀ ▶ pads |
| Brake | ↓ or S | Brake |
| Boost | Space or Shift | Boost |
| Turn pages (archive / events) | ← → | Swipe |
| Spec sheet | I | Specs |
| Confirm | Enter | Race this car / Race here |

The car accelerates on its own. Boost refills over time, faster while you slide through corners or draft behind another car.

## Events

- **Event 01: Harbor Line, Tunnel 7.** A 2.1 km lit tunnel loop with no traffic.
- **Event 02: Roosevelt Blvd.** A mile of the Boulevard between Harbison and Cottman, with a U-turn at each end. It has live traffic in the race lanes, express lanes dropping under the Cottman bridge, working signals, and four speed cameras.

Both events are 2 laps with 7 cars. Floating chevrons warn you about hard corners.

## Power-ups

- **Cyan: Refill.** Fills your boost.
- **Violet: Long Boost.** Boost drains slower for 8 s.
- **Amber: Overdrive.** Raises top speed for 5 s.

Rivals grab them too.

## Cars

Kage R · Noctis GT · Vanta LM · Kern RS (shown in cutaway) · Dune-R · Sovereign · Gran Four

Each car has its own speed, grip, boost, and weight. Press **Specs** for the full sheet.

## Rivals

| Tag | Personality |
|-----|-------------|
| APEX | Follows the racing line, brakes precisely, dives inside when catching you |
| THE WALL | Blocks your line when you're right behind it |
| LEECH | Sits in your slipstream, then slingshots past |
| BRUISER | Heavy car that leans on you when you're alongside |
| THE CLOSER | Cruises early, then empties its boost late in the race |
| WILDCARD | Brakes late, makes random mistakes, fires random boost bursts |

## Saved in your browser

Your race history is saved in your browser: runs, wins, best time per event, and hit count (hits wear the paint). The game also saves a **ghost** of your best run on each event, and it races alongside you next time.

## Project layout

```
index.html           screens and HUD markup
css/afterhours.css   magazine and HUD styling
js/afterhours.js     game: cars, tracks, AI, physics, audio, UI
```
