# Power-ups and physics

## Driving model (player and AI)

- **Auto throttle** — you steer, brake, boost, and drift; the car accelerates on its own.
- **Boost** refills over time; faster while drifting or drafting.
- **Drift (handbrake X):** slide at speed, charge DRIFT chip, release for speed burst (see README for timings). No charge during nitro; wall contact cancels.
- **Flow:** clean fast driving adds small top-speed steps; contact or walls reset.

Physics uses **substeps** so stacked speed effects do not tunnel through walls (`VCAP` ~425 mph ceiling documented in README).

## Position-aware pickups

Each gem type changes effect by race position bucket:

| Bucket | Positions |
|--------|-----------|
| FRONT | P1–2 |
| PACK | P3–5 |
| CHASE | Last two |

Full table is in README (Refill vs Top-Off vs Overflow, etc.). Implementation maps player/AI position when activating.

**Class twists** (heavy / nimble / muscle) modify duration or strength.

**Jackpot:** ~1 in 8 pickups at 1.5× strength.

Echo Boost mode omits the four auto gems (jam, slick, payback, ghost).

## Global hazards

- **Walls** scrub speed unless shielded / rails grip.
- **Oil** — spin and heavy slow; rivals path around.
- **Signal jam** — drains target boost; shielded cars ignore.
- **Traffic** — speed cameras, lane traffic, columns (Under the El), freight gates.

Event-specific: ice (Game Night tunnel), crowd pads, pulse grid (Neon Core), Calder tunnel grip, Manayunk air time, First Light traffic ramp.

## Tag Team (physics-relevant bits)

- **Hot tag** within 30 m → full boost + slingshot on entry car.
- **Cold tag** farther → no bonus.
- **Team draft** stronger between partners.
- **Anchor leg:** finishing in one car forces tag into partner for the final segment.

Scoring is team points, not only P1.

## Ghost replay

Best lap stored per event in `SAVE`; playback car follows recorded inputs/transform. Does not affect collision with live racers (visual reference).

## `logic.mjs` overlap

Formatting time (`fmt`), RNG for deterministic tests, field size, and some pickup/knockout math live in `logic.mjs` for unit tests. Gameplay-critical tuning still lives in `stepRacer` and pickup activation in `afterhours.js`.

Next: [Graphics, audio, performance](08-Graphics-Audio-Performance.md)
