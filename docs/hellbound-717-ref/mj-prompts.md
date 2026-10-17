# Hellbound 717 — Midjourney prompt pack (hero rebuild, ~80k tris)

Today Hellbound 717 is built procedurally in `hellboundShell()` (js/afterhours.js). `tools/blender/hellbound_717.py` (v2) exists but no `models/hellbound*.glb` has been exported yet.

## Car spec card
- Name: HELLBOUND 717 (original design, widebody supercharged muscle coupe, outlaw car, no boost)
- Body: long hood with centre power bulge, blower with six velocity stacks through it, shark nose, short fastback cabin, ducktail
- Details: slim slot headlamps over a big black grille, strutted carbon splitter, bolt-on riveted flares, quad side exits ahead of the rear wheels, recessed full-width tail bar
- Paint: deep red with twin black stripes
- Wheels: five-spoke black deep-dish, red calipers
- Tier: T4 hero, target ~80k tris
- Assumptions: neutral gray studio for reference frames; no wing (the game build has none)

## Single angles (feed Blender)
```
widebody supercharged muscle coupe, shark nose, hood blower with velocity stacks, riveted flares, ducktail, deep red with twin black stripes, high detail hero game car, front three-quarter view, gray studio background --ar 16:9 --style raw --no text, people
```
```
widebody supercharged muscle coupe, shark nose, hood blower with velocity stacks, riveted flares, ducktail, deep red with twin black stripes, high detail hero game car, rear three-quarter view, gray studio background --ar 16:9 --style raw --no text, people
```
```
widebody supercharged muscle coupe, shark nose, hood blower with velocity stacks, riveted flares, ducktail, deep red with twin black stripes, high detail hero game car, pure side profile, gray studio background --ar 16:9 --style raw --no text, people
```
```
widebody supercharged muscle coupe, shark nose, hood blower with velocity stacks, riveted flares, ducktail, deep red with twin black stripes, high detail hero game car, head-on view, gray studio background --ar 16:9 --style raw --no text, people
```
```
widebody supercharged muscle coupe, shark nose, hood blower with velocity stacks, riveted flares, ducktail, deep red with twin black stripes, high detail hero game car, top-down view, gray studio background --ar 16:9 --style raw --no text, people
```

## Turnaround and clay
```
widebody supercharged muscle coupe, shark nose, hood blower with velocity stacks, riveted flares, ducktail, deep red with twin black stripes, high detail hero game car, car turnaround sheet, front side rear views, gray studio background --ar 16:9 --style raw --no text, people, cropped wheels
```
```
widebody supercharged muscle coupe, shark nose, hood blower with velocity stacks, riveted flares, ducktail, gray clay render, no textures, high detail hero game car, car turnaround sheet, front side rear views, gray studio background --ar 16:9 --style raw --no text, people, cropped wheels
```

## Details
```
five-spoke black deep-dish wheel on widebody muscle coupe, red caliper, drilled disc, riveted flare edge, high detail hero game car, side-on, gray background --ar 1:1 --style raw --no text
```
```
front of widebody muscle coupe, shark nose, slim slot headlamps, big black grille, strutted carbon splitter, high detail hero game car, straight-on, dark studio --ar 3:2 --style raw --no text
```
```
rear of widebody muscle coupe, ducktail, recessed full-width tail bar, quad side exits, diffuser, high detail hero game car, straight-on, gray background --ar 3:2 --style raw --no text
```

## Hero
```
widebody supercharged muscle coupe, deep red with twin black stripes, hood blower with velocity stacks, wet night street, sodium streetlights, purple shadows, acid green accent light, low three-quarter angle, magazine photo --ar 4:5 --stylize 350 --no text, people
```

## Modeling notes (not for Midjourney)
- Body shell ~36k, flares 4 x ~2.5k, wheels+tires 4 x ~4.5k, blower and stacks ~4k, canopy+glass ~4k, grille/splitter/ducts ~5k, tail bar/diffuser/exits ~4k.
- Material-name contract with js/afterhours.js as for the other GLB cars (PAINT, CARBON, GLASS, GLOSSBLACK, GAP, HEAD, TAIL, CHROME, LENS). Wheels separate meshes.
- Build on the existing `hellbound_717.py` v2 on `carlib.py`; raise densities and add real wheels, interior and shut lines.
