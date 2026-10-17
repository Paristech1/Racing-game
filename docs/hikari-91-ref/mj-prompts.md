# Hikari 91 — Midjourney prompt pack (hero rebuild, ~80k tris)

Today Hikari 91 is built procedurally in `hikariShell()` (js/afterhours.js); it has no Blender GLB.

## Car spec card
- Name: HIKARI 91 (original design, late-80s Japanese fastback drift coupe)
- Body: long low nose, straight beltline, hatch to the tail, riveted bolt-on over-fenders with black leading-edge trim
- Details: pop-up headlamps flipped up (one big clear lamp each), amber bumper corners, carbon splitter and skirts, round tail lamps in black bezels, ducktail plus GT wing on stands
- Paint: satin violet, lime brush slashes along the doors climbing over the rear quarter
- Wheels: six-spoke, gunmetal centre, red calipers
- Tier: T4 hero, target ~80k tris
- Assumptions: neutral gray studio for reference frames; lamps shown UP in the main frames, one extra prompt for lamps DOWN

## Single angles (feed Blender)
```
late-80s fastback drift coupe, riveted widebody fenders, pop-up headlights up, GT wing, satin violet with lime brush slashes, high detail hero game car, front three-quarter view, gray studio background --ar 16:9 --style raw --no text, people
```
```
late-80s fastback drift coupe, riveted widebody fenders, pop-up headlights up, GT wing, satin violet with lime brush slashes, high detail hero game car, rear three-quarter view, gray studio background --ar 16:9 --style raw --no text, people
```
```
late-80s fastback drift coupe, riveted widebody fenders, pop-up headlights up, GT wing, satin violet with lime brush slashes, high detail hero game car, pure side profile, gray studio background --ar 16:9 --style raw --no text, people
```
```
late-80s fastback drift coupe, riveted widebody fenders, pop-up headlights up, GT wing, satin violet with lime brush slashes, high detail hero game car, head-on view, gray studio background --ar 16:9 --style raw --no text, people
```
```
late-80s fastback drift coupe, riveted widebody fenders, pop-up headlights up, GT wing, satin violet with lime brush slashes, high detail hero game car, top-down view, gray studio background --ar 16:9 --style raw --no text, people
```

## Turnaround and clay
```
late-80s fastback drift coupe, riveted widebody fenders, pop-up headlights up, GT wing, satin violet with lime brush slashes, high detail hero game car, car turnaround sheet, front side rear views, gray studio background --ar 16:9 --style raw --no text, people, cropped wheels
```
```
late-80s fastback drift coupe, riveted widebody fenders, pop-up headlights up, GT wing, gray clay render, no textures, high detail hero game car, car turnaround sheet, front side rear views, gray studio background --ar 16:9 --style raw --no text, people, cropped wheels
```

## Details and second lamp state
```
late-80s fastback drift coupe, pop-up headlights down, riveted widebody fenders, satin violet, high detail hero game car, front three-quarter view, gray studio background --ar 16:9 --style raw --no text, people
```
```
six-spoke gunmetal wheel on widebody drift coupe, red caliper, drilled disc, riveted fender edge, high detail hero game car, side-on, gray background --ar 1:1 --style raw --no text
```
```
front of late-80s drift coupe, pop-up headlights up, amber bumper corners, carbon splitter, high detail hero game car, straight-on, dark studio --ar 3:2 --style raw --no text
```
```
rear of late-80s drift coupe, GT wing on stands, round tail lamps in black bezels, twin exhaust tips, diffuser, high detail hero game car, straight-on, gray background --ar 3:2 --style raw --no text
```

## Hero
```
late-80s fastback drift coupe, riveted widebody fenders, pop-up headlights up, satin violet with lime brush slashes, wet night street, sodium streetlights, purple shadows, acid green accent light, low three-quarter angle, magazine photo --ar 4:5 --stylize 350 --no text, people
```

## Modeling notes (not for Midjourney)
- Body shell ~34k, over-fenders 4 x ~2.5k, wheels+tires 4 x ~4k, canopy+glass ~5k, pop-up lamps 2 x ~2k, wing+stands ~3k, splitter/skirts/diffuser ~5k, rear lamps+exhaust ~3k.
- Keep material names (PAINT, CARBON, GLASS, GLOSSBLACK, GAP, HEAD, TAIL, CHROME, LENS) as the contract with js/afterhours.js. Lime slashes stay a texture (vinyl) so the game keeps its own stripe material.
- Wheels separate meshes (the game spins and cambers them); pop-up lamp pods separate so the rig stays flexible.
