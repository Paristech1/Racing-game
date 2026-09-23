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

- **Event 03: The Bridge Run.** Center City to Camden, 3 laps. It starts beside City Hall, runs down Market St, and turns up 6th past Independence Mall and the Liberty Bell. Then it climbs onto the Ben Franklin Bridge for a 1.3 km straightaway over the Delaware. You U-turn at the Camden toll plaza, come back over the bridge, and return along Race St through Chinatown and down 15th past LOVE Park. It has live traffic, working signals, and two speed cameras.

- **Event 04: The Long Night.** Every level in one 8 km loop, 2 laps. It starts on Roosevelt Blvd (a divided road with a tree median, strip malls, a gas station and a speed camera). Then it runs down Spring Garden and 6th St, over the Ben Franklin Bridge to Camden (with westbound traffic on the other deck), and down the Camden waterfront. The return goes back under the Delaware through the Harbor Line tunnel, then along South St and up 15th past City Hall and LOVE Park.

Harbor Line, Roosevelt Blvd and The Long Night are 2 laps; The Bridge Run is 3. Every event has 7 cars, and floating chevrons warn you about hard corners.

## Power-ups

Every car can take each power-up once per pass (the gem blinks when someone does), and rivals grab them too. What a power-up does depends on **where you are in the race** and **what you're driving**.

| Power-up | FRONT (P1–2) | PACK (P3–5) | CHASE (last two) |
|----------|--------------|-------------|------------------|
| Cyan Refill | **Top-Off:** full boost | **Refill:** full boost, 2.5× recharge for 5 s | **Overflow:** boost to 140% |
| Violet Long Boost | **Cruise Control:** slow drain for 8 s | **Long Boost:** +25% boost, slow drain for 8 s | **Endless:** no drain at all for 5 s |
| Amber Overdrive | **Overdrive:** +14% top speed for 5 s | **Slipstream:** +14% top speed and draft from twice as far for 6 s | **Redline:** +22% top speed for 4 s, no boost recharge |
| Red Slingshot | **Kick:** a small shove | **Slingshot:** launched forward | **Catapult:** launched and towed toward the car ahead |
| Green Shield | **Rear Guard:** 9 s, blocks hits from behind and shockwaves | **Shield:** 6 s, walls and contact can't slow you | **Battering Ram:** 5 s, hit a car from behind to steal its speed |
| Pink Shockwave | **Wake:** slows everyone behind you | **Shockwave:** slows everyone around you | **Lightning:** strikes the leaders wherever they are |
| Blue Grip | **Grip Tires:** +45% grip for 8 s | **Slicks:** more grip and no scrub in corners for 8 s | **Rails:** +80% grip and walls can't slow you for 6 s |

Your car's class adds a twist. **Heavy** cars (Richmond, Dune-R, Sovereign, Gran Four) get Diesel (Long Boost lasts longer), Freight Train (Slingshot plows through traffic), Bulldozer (Shield shoves harder), Quake (bigger Shockwave) and Downforce (more grip). **Nimble** cars (Vanta LM, Kern RS, Passyunk R, Zenkai 37) get Short Shift (a punchier Overdrive), Featherweight (a bigger Slingshot) and Glue (longer Grip). **Muscle** cars (Noctis GT, Bell 76, Split 63) get Supercharged (Refill makes boost hit harder), Big Block (more Overdrive) and Siphon (Shockwave steals boost). And 1 pickup in 8 is a **Jackpot** at 1.5× strength. That's 21 position variants, 11 class twists, and over 100 combinations in play.

## Cars

Kage R · Noctis GT · Vanta LM · Kern RS (shown in cutaway) · Dune-R · Sovereign · Gran Four · Bell 76 · Passyunk R · Richmond · Zenkai 37 · Split 63

- **Bell 76:** blue and gold, the highest top speed and the biggest boost in the game. Built for the bridge.
- **Passyunk R:** a light hot hatch with the most grip and acceleration.
- **Richmond:** the heaviest vehicle, a pickup truck that shoves everything else out of the way.
- **Zenkai 37:** a red widebody coupe with fender flares, a bolted wing, hood vents and six-spoke wheels.
- **Split 63:** a black split-window restomod with chrome bumpers, side-exit pipes and red-lipped wheels.

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

Each start, rivals **draw a chassis from the archive** (no duplicate picks on the grid) weighted for the event: grip and balance on Harbor Line, top speed and nitro on the Boulevard and the Bridge Run. They **slow for upcoming corners**, **fight each other** (THE WALL blocks any chaser, LEECH drafts whoever is ahead, BRUISER sideswipes side-by-side traffic), and **score power-up detours** instead of blindly swerving.

Rivals also **react to their position**. Four times a second, each one checks its place, the gaps to the cars around it, how much race is left, and whether it just got passed. That sets a desperation level and a mood, and the leaderboard shows each rival's current mood:

| Mood | When | What it does |
|------|------|--------------|
| LEAD | Out front, or comfortably placed | Drives clean, keeps a boost reserve, rarely detours for power-ups |
| DEFEND | Someone within ~0.6 s behind | Covers the chaser's line, boosts to break the tow, goes for Shields |
| ATTACK | A car within ~0.7 s ahead | Boosts on straights to make the pass, goes for Shockwaves and Slingshots |
| PUSH | Behind with a gap to close | Spends boost above its reserve and takes bigger power-up detours |
| ALL-IN | Desperate, usually late or just passed | Empties the tank even into corners, brakes later, and will make contact |

Each persona bends differently. Wildcard and Bruiser go all-in quickly, and The Wall defends hardest. The Closer keeps the biggest boost reserve until it's desperate, and Apex stays the calmest.

## Graphics

- **4× MSAA** through the whole post-processing chain (WebGL2), then bloom and a cinematic grade: split-tone color, vignette, edge chromatic aberration, and radial speed blur that ramps with speed and boost.
- **Wet asphalt:** puddled roughness and normal maps on the roads, plus long light streaks under every streetlight, tunnel strip and taillight.
- **Rain nights:** open-air events have a 45% chance of rain, shown on the loading screen. You get rain streaks, tire spray, a rain audio bed, wetter roads and stronger reflections. Rain stops inside tunnels.
- **Light and atmosphere:** volumetric cones under streetlights, headlight beams and road throw from every car, taillight trails at speed, exhaust flames while boosting, and a night-sky dome with stars, a moon and clouds lit by the city.

## Saved in your browser

Your race history is saved in your browser: runs, wins, best time per event, and hit count (hits wear the paint). The game also saves a **ghost** of your best run on each event, and it races alongside you next time.

## Project layout

```
index.html           screens and HUD markup
css/afterhours.css   magazine and HUD styling
js/afterhours.js     game: cars, tracks, AI, physics, audio, UI
```
