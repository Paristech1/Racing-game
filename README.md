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
| Tag your partner (Tag Team) | T | Tag |
| Turn pages (archive / events) | ← → | Swipe |
| Spec sheet | I | Specs |
| Confirm | Enter | Race this car / Race here |

The car accelerates on its own. Boost refills over time, faster while you slide through corners or draft behind another car.

## Events

- **Event 01: Harbor Line, Tunnel 7.** A 2.1 km lit tunnel loop with no traffic.
- **Event 02: Roosevelt Blvd.** A mile of the Boulevard between Harbison and Cottman, with a U-turn at each end. It has live traffic in the race lanes, express lanes dropping under the Cottman bridge, working signals, and four speed cameras.

- **Event 03: The Bridge Run.** Center City to Camden, 3 laps. It starts beside City Hall, runs down Market St, and turns up 6th past Independence Mall and the Liberty Bell. Then it climbs onto the Ben Franklin Bridge for a 1.3 km straightaway over the Delaware. You U-turn at the Camden toll plaza, come back over the bridge, and return along Race St through Chinatown and down 15th past LOVE Park. It has live traffic, working signals, and two speed cameras.

- **Event 04: The Long Night.** Every level in one 8 km loop, 2 laps. It starts on Roosevelt Blvd (a divided road with a tree median, strip malls, a gas station and a speed camera). Then it runs down Spring Garden and 6th St, over the Ben Franklin Bridge to Camden (with westbound traffic on the other deck), and down the Camden waterfront. The return goes back under the Delaware through the Harbor Line tunnel, then along South St and up 15th past City Hall and LOVE Park.

- **Event 08: Philly Classic.** The full archive on one grid, 3 laps of an 8.8 km landmark tour:
  - Down Roosevelt Blvd, then along Kelly Drive past the outline lights of Boathouse Row on the Schuylkill.
  - Down 6th St and over the Ben Franklin Bridge, then south past a floodlit South Philly stadium.
  - Back across the Delaware on a 16 m-high I-95 viaduct with lit parapets.
  - Up Broad St past City Hall and the golden, uplit Art Museum, with Rocky at the foot of the steps, to the Boulevard U-turn.

- **Event 10: Mt Airy Run.** Northwest Philly, 3 laps of a 2.7 km loop with real hills. Up the Belgian-block cobbles and trolley rails of Germantown Ave between lit shops, along W Mt Airy Ave past the stone twins (porches lit, slate roofs, street trees), then down the S-bends of Lincoln Drive through the Wissahickon gorge, beside a schist wall, a wooden fence and the creek, with fireflies in the woods. The Drive passes under the Walnut Lane Bridge's concrete arch, then climbs back up Johnson St. Speed bumps and potholes on every leg.

- **Event 11: Game Night.** The South Philly Sports Complex with every team in town, 2 laps of 2.9 km. Down Broad St past FDR Park and the subway entrance, then through the Zamboni tunnel under the arena, where there's ice on the road and your grip halves. Pattison Ave runs between the football stadium and the ballpark under a live Jumbotron with the standings, and Packer Ave runs past the tailgate lots.
  - **Crowd Roar pads** in each team's colors (Birds, Phils, Sixers, Flyers, Union). Each pad covers one lane, so you pick your team. Driving over one gives you a burst of speed and boost, and it's bigger the further back you are.
  - The ballpark sets off fireworks and swings its neon Liberty Bell every time the lead changes.

- **Event 12: Manayunk Wall.** 3 laps, 2.7 km. Flat out down Main St beside the canal and under the Manayunk Bridge, then straight up The Wall (a 32 m climb), along the Manayunk Ave ridge and down Green Lane. The hills are real on this track:
  - Climbs slow you down.
  - The crests throw you in the air. There's no steering or throttle until you land, and a hard landing costs speed.
  - Air time longer than half a second refills some boost.

- **Event 13: Under the El.** Kensington, 3 laps, 2.8 km, with live traffic.
  - On Kensington Ave the Market-Frankford El runs overhead, and its steel columns run down the middle of the road. Pick a side: hitting a column costs 40% of your speed. El trains rumble overhead and throw sparks.
  - On Lehigh Ave the freight gates come down every 40 seconds and a train rolls through to the rail yard. Get through before the arms drop (clipping them costs speed), or wait at the gate for the train to pass. Rivals time the gates too.
  - Then down Aramingo Ave and back along Allegheny Ave.

- **Event 14: First Light.** Kelly Drive and MLK Drive, 3 laps of the 3.6 km river loop. The race starts at 5:40 AM in the dark, and the sun comes up as it runs out:
  - The sky goes from blue hour to pink to gold on the last lap. The street lights and the Boathouse Row outlines switch off at sunrise, and the fog lifts off the river while rowing crews head upstream.
  - The city wakes up with you: no traffic on lap 1, early commuters on lap 2, rush hour on lap 3.

- **Tournament: The Gauntlet.** All 12 cars on one grid, on a flood-lit 1.7 km knockout loop around City Hall (Market St, 9th St, Race St and 15th St), with neon barriers, floodlight towers and a live standings screen over the track. Each lap is a round: when everyone but the last car has crossed the line, that car is knocked out. The last car running wins. Every round rolls a new rule (never the same one twice in a row):

  | Rule | What happens |
  |------|--------------|
  | Clean Round | No tricks, just don't be last |
  | Double Knockout | The last two cars are out (5+ cars left) |
  | Time Bomb | The last car past the half-lap mark is out too (5+ cars left) |
  | Nitro Rain | Full boost for everyone, recharging twice as fast |
  | Lights Out | The city goes dark, headlights only |
  | Underdog | The last three cars get 10% more top speed |
  | Bounty | Take the lead and you get full boost and a shield |
  | Shock Season | Every pickup is a Shockwave |
  | Slingshot Alley | Every pickup is a Slingshot |
  | Ghost Lap | No contact, cars pass through each other |
  | Downpour | It starts raining and everyone loses grip |
  | Jackpot Lap | Every pickup is a jackpot |
  | Turbo Round | Everyone gets 12% more top speed |
  | Draft Frenzy | Slipstreams reach twice as far and pull twice as hard |
  | Final Duel | The last two cars get overfilled boost, and every pickup is a Slingshot |

  Rivals in the knockout zone get desperate as the lap runs out. The HUD flags the car in danger, and your position pulses red when it's you.

Harbor Line, Roosevelt Blvd and The Long Night are 2 laps; The Bridge Run is 3. Every event has 7 cars, and floating chevrons warn you about hard corners.

## Tag Team

Any regular event can be raced as **Tag Team**: press **Tag team** on the event page, then pick your partner car. The picker marks a good match for your car's class. Four teams of two go on the grid:

| Team | Cars |
|------|------|
| AFTERHOURS | you and your partner |
| CLEAN LINES | Apex and The Closer |
| BLOCK PARTY | The Wall and Bruiser |
| LOOSE ENDS | Leech and Wildcard |

- You drive one car and the AI drives the other. Press **T** (or the **Tag** pad) to jump into your partner's car at any time, with a 4-second cooldown between tags.
- **Hot tag:** tag while your partner is within 30 m, and the car you jump into gets full boost and a slingshot. From further away it's a **cold tag** with no bonus. The HUD shows your partner's gap and whether a hot tag is ready.
- **Team draft:** teammates pull each other along harder than rivals do, and refill each other's boost. AI teammates line up nose to tail to use it, and your partner lines up with you.
- **Anchor leg:** when the car you're driving finishes, you're tagged into your partner to bring it home.
- Points go 10-8-6-5-4-3-2-1 by finishing position, and the best team total wins. The board shows each team's projected points live, and the results page shows the team table.

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

Kage R · Noctis GT · Vanta LM · Kern RS (shown in cutaway) · Dune-R · Sovereign · Gran Four · Bell 76 · Passyunk R · Richmond · Zenkai 37 · Split 63 · Overload 3K · Wisp 07 · Stratos V · Volcano P1

- **Bell 76:** blue and gold, the highest top speed and the biggest boost in the game. Built for the bridge.
- **Passyunk R:** a light hot hatch with the most grip and acceleration.
- **Richmond:** the heaviest vehicle, a pickup truck that shoves everything else out of the way.
- **Zenkai 37:** a red widebody coupe with fender flares, a bolted wing, hood vents and six-spoke wheels.
- **Split 63:** a black split-window restomod with chrome bumpers, side-exit pipes and red-lipped wheels.
- **Kage R:** a chopped silver wedge with a wide cab-forward greenhouse and a black roof, crossed nose to tail by an amber spine. It has slit LED headlights, NACA haunch scoops, a louvred deck and a ducktail airfoil.
- **Overload 3K:** a 3,000 hp quad-motor electric hypercar with a sculpted body: pontoon fenders, a tinted bubble canopy, a lit dorsal fin, and cyan light blades across the nose and along the rockers. It has camera pods for mirrors, a glowing diffuser and a swan-neck airfoil wing. The most powerful car in the game. Rivals only bring it now and then (you'll get a warning), but it's always in the Gauntlet.
- **Volcano P1:** a Volcano-yellow hybrid hypercar modeled on the McLaren P1, with its own sculpted body. The body is lofted from cross-sections, so it has tumblehome, a pinched waist, bulging haunches and fender peaks. It has a teardrop glass canopy with a body-colored roof and snorkel, tube-built light signatures (the smile intake, boomerang LEDs and a C-shaped tail light), and a raked carbon side scoop. At the back: a real airfoil-section active wing, a twill carbon-fibre splitter, louvres and diffuser, center-exit exhausts, and a fresnel rim on the paint so the shape reads at night. It has the highest top speed in the archive, flat out and on boost. Like the Overload, rivals only bring it on a boss night.

Every car has metallic-flake paint under a clear coat, and details down to the wheels:
- LED running lights and projector headlights, taillight clusters and a third brake light.
- Mirrors, panel gaps, door handles, window trim, license plates, exhaust tips and a rear diffuser.
- Treaded tires with lettered sidewalls, slotted brake rotors, deep rim barrels and lug nuts, plus contact shadows.

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
- **Speed stages:** headlight beams, beam cones, speed streaks, taillight trails and speed blur stay calm when you're cruising. They step up at about 90, 130 and 160 mph, and one more stage while boosting. A 4-pip meter under the speedometer shows the stage, turning amber and then red.
- **Light and atmosphere:** volumetric cones under streetlights, headlight beams and road throw from every car, taillight trails at speed, exhaust flames while boosting, and a night-sky dome with stars, a moon and clouds lit by the city.

## Sculpted cars and city detail

The Kage R, Overload 3K and Volcano P1 are built the way the [threejs-skills](https://github.com/CloudAI-X/threejs-skills) pack recommends:
- **Bodies** are lofted from dozens of cross-sections (custom BufferGeometry).
- **Light signatures** are tubes swept along curves.
- **Wings and scoops** are extruded airfoil and teardrop shapes.
- **Materials** include a canvas twill carbon fibre, and a fresnel rim injected into the clear-coat paint.

City boards also get:
- Realistic facades: 1–2 m windows with mullions, sills and lit rooms under blinds.
- Lit shop interiors.
- Rooftop AC units and water tanks.

Roosevelt Blvd and Mt Airy get leafy tree canopies, textured grass medians, striped lots and a guide rail.

## Speed ceiling

Stacked boosts (nitro, Overdrive, Slingshot and signature pickups) top out at about 425 mph. The physics splits each frame into substeps so no car moves more than about 1.5 m per step. The chase camera smooths its offset from the car rather than its world position, so it stays glued to the car at any speed.

## Saved in your browser

Your race history is saved in your browser: runs, wins, best time per event, and hit count (hits wear the paint). The game also saves a **ghost** of your best run on each event, and it races alongside you next time.

## Where the new ideas came from

Events 11–14 and Tag Team came out of a recon of racing-game repos on GitHub, searched in English, Portuguese (BR), Japanese, Chinese and German. Every repo was security-vetted and none of its code was copied. Only ideas were taken:
- Crowd pads and the ice strip: [turbo-kart-gp](https://github.com/lyndonxn/turbo-kart-gp) (boost strips, low-grip ice).
- Air time: [apex-horizon](https://github.com/yjj0339/apex-horizon) and [Stunt Rally 3](https://github.com/stuntrally/stuntrally3) (jumps).
- A sky that changes mid-race: [neon-rush-3d](https://github.com/duguhuangya/neon-rush-3d) and [MikkelRacer](https://github.com/mikkel-thiemann/MikkelRacer).
- Traffic that builds lap by lap: [car](https://github.com/tuanzi188/car) (hazards that escalate each lap).
- Tag Team:
  - team scoring from [SuperTuxKart](https://github.com/supertuxkart/stk-code) (red/blue team worlds);
  - the baton hand-off from Brazilian relay-race exercises ([corrida-revezamento](https://github.com/Davi-Cesar/corrida-revezamento));
  - drafting as a shared resource from [jockey-race-game](https://github.com/sny9brian7/jockey-race-game).

## Project layout

```
index.html           screens and HUD markup
css/afterhours.css   magazine and HUD styling
js/afterhours.js     game: cars, tracks, AI, physics, audio, UI
.cursor/skills/      Three.js agent skills (see AGENTS.md)
AGENTS.md            instructions for coding agents on this repo
```
