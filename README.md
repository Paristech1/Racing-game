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

- **Cyan: Refill.** Fills your boost.
- **Violet: Long Boost.** Boost drains slower for 8 s.
- **Amber: Overdrive.** Raises top speed for 5 s.
- **Red: Slingshot.** An instant burst of speed plus hard acceleration for 1.4 s.
- **Green: Shield.** For 6 s, walls and contact don't slow you, and you shove other cars aside.
- **Pink: Shockwave.** Slows and pushes every car near you and knocks out part of their boost. Shields block it.
- **Blue: Grip Tires.** 45% more cornering grip for 8 s.

Rivals grab them too, including the Shockwave.

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

## Saved in your browser

Your race history is saved in your browser: runs, wins, best time per event, and hit count (hits wear the paint). The game also saves a **ghost** of your best run on each event, and it races alongside you next time.

## Project layout

```
index.html           screens and HUD markup
css/afterhours.css   magazine and HUD styling
js/afterhours.js     game: cars, tracks, AI, physics, audio, UI
```
