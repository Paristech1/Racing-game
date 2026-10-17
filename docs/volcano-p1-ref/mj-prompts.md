# Volcano P1 — Midjourney prompt pack (hero rebuild, ~80k tris)

## Car spec card
- Name: VOLCANO P1 (original design, no real-car base)
- Body: mid-engine hybrid hypercar, low and wide, visor canopy, swan-neck rear wing
- Paint: volcano yellow clearcoat over bare carbon lower body
- Wheels: 10-spoke split chrome/white rims, drilled carbon-ceramic discs, red calipers
- Lights: slim LED front lamps, full-width red tail bar
- Tier: T4 hero, target ~80k tris (game build today: 33,206 tris, LOD 14,539)
- Assumptions: no livery stripes, plate "P1 GTR" kept out of prompts, neutral gray studio for reference frames

## Turnaround and clay
```
original mid-engine hybrid hypercar, visor canopy, swan-neck rear wing, bare carbon lower body, volcano yellow paint, high detail hero game car, car turnaround sheet, front side rear views, gray studio background --ar 16:9 --style raw --no text, people, cropped wheels
```
```
original mid-engine hybrid hypercar, visor canopy, swan-neck rear wing, gray clay render, no textures, high detail hero game car, car turnaround sheet, front side rear views, gray studio background --ar 16:9 --style raw --no text, people, cropped wheels
```

## Single angles (feed Blender)
```
original mid-engine hybrid hypercar, visor canopy, swan-neck rear wing, volcano yellow over bare carbon, high detail hero game car, front three-quarter view, gray studio background --ar 16:9 --style raw --no text, people
```
```
original mid-engine hybrid hypercar, visor canopy, swan-neck rear wing, volcano yellow over bare carbon, high detail hero game car, rear three-quarter view, gray studio background --ar 16:9 --style raw --no text, people
```
```
original mid-engine hybrid hypercar, visor canopy, swan-neck rear wing, volcano yellow over bare carbon, high detail hero game car, pure side profile, gray studio background --ar 16:9 --style raw --no text, people
```
```
original mid-engine hybrid hypercar, visor canopy, swan-neck rear wing, volcano yellow over bare carbon, high detail hero game car, head-on view, gray studio background --ar 16:9 --style raw --no text, people
```
```
original mid-engine hybrid hypercar, visor canopy, swan-neck rear wing, volcano yellow over bare carbon, high detail hero game car, top-down view, gray studio background --ar 16:9 --style raw --no text, people
```

## Details
```
10-spoke split chrome wheel on original yellow hypercar, drilled carbon-ceramic disc, red caliper, high detail hero game car, side-on, gray background --ar 1:1 --style raw --no text
```
```
front of original yellow hypercar, slim LED headlights, carbon splitter, large lower intakes, high detail hero game car, straight-on, dark studio --ar 3:2 --style raw --no text
```
```
rear of original yellow hypercar, swan-neck wing, full-width red taillight bar, center exhaust, diffuser, high detail hero game car, straight-on, gray background --ar 3:2 --style raw --no text
```

## Hero
```
original mid-engine hybrid hypercar, visor canopy, swan-neck rear wing, volcano yellow over bare carbon, wet night street, sodium streetlights, purple shadows, acid green accent light, low three-quarter angle, magazine photo --ar 4:5 --stylize 350 --no text, people
```

## Modeling notes (not for Midjourney)
- Body shell ~38k, wheels+tires 4 x ~5k, discs/calipers ~6k, canopy+glass ~4k, wing ~3k, lamps/intakes/diffuser ~7k, interior hint ~2k.
- Keep material names PAINT, CARBON, GLASS, GLOSSBLACK, GAP, HEAD, TAIL, CHROME, LENS (contract with js/afterhours.js).
- Wheels stay separate meshes; the game spins them.

## Iteration menu
| Tweak | How |
|---|---|
| Change one detail | Same prompt and `--seed`, edit one phrase |
| Keep the car, change mood | Favorite as `--oref`, swap lighting words |
| Explore alternatives | `--chaos 20` or Vary (Subtle) |
| Lock the look | Save a favorite as `--sref` for every angle |
| Fix one bad view | Regenerate only that single-angle prompt |
