# Rivals and AI

Rivals are not “the same car with a different color.” Each has a **persona**, a **mood** that changes during the race, and **event-aware** chassis and line choice.

## Personas (`RIVALS`)

| Tag | Idea |
|-----|------|
| APEX | Racing line, precise braking, inside passes |
| THE WALL | Blocks when you're on their tail |
| LEECH | Drafts then slingshots |
| BRUISER | Heavy contact when alongside |
| THE CLOSER | Saves boost, attacks late |
| WILDCARD | Late brakes, random boost, mistakes |
| GRUDGE | Hunts whoever just passed them |
| HUNTER | Targets the leader |
| RABBIT | Fast start, fades for pack catch-up |
| WEAVER | Picks lanes through traffic |

Classic 7-car events draw from the first six; full-grid / Gauntlet shuffles all ten.

## Chassis selection

On grid spawn, each rival **draws a car** from the archive:

- No duplicate chassis on the same grid (when possible).
- **Event bias** (`EVENT_CAR_BIAS`, `EVENT_CAR_PREF`): e.g. grip tracks favor nimble cars; Blvd favors top speed.
- Boss cars gated by `rivalChassisEligible` and `RIVAL_BOSS`.

`buildRivalForEvent` ties persona + car + difficulty pace.

## Difficulty

`SAVE.diff`: **Rookie**, **Street**, **Outlaw** scales AI pace multipliers (`DIFF` table). Settings sheet exposes this as “Rivals: …”.

## Moods (every ~250 ms)

Each rival evaluates position, gaps, time remaining, recent passes → **desperation** + **mood**:

| Mood | Typical trigger | Behavior |
|------|-----------------|----------|
| LEAD | Comfortable P1/P2 | Clean driving, boost reserve, few pickup detours |
| DEFEND | Chaser within ~0.6 s | Block line, break tow, seek Shield |
| ATTACK | Target within ~0.7 s ahead | Boost on straights, Shockwave / Slingshot |
| PUSH | Gap to close | Spend boost, wider pickup detours |
| ALL-IN | Late race / just passed | Late braking, contact, empty boost tank |

Personas bend thresholds (Wildcard and Bruiser spike desperation faster; Closer hoards boost).

Leaderboard can show rival mood strings in the HUD.

## Corner braking (`aiCornerPlan`)

Separate from mood: rivals **slow for upcoming curvature** using a precomputed curvature average along the track (`kAvgOf`). Constants in `AIT` tune how early they brake. Design goal: catch blind hairpins without making AI slower everywhere than the old pace.

Open-air events use `eventAiBias()` to tweak straight vs tight weighting.

## Power-up decisions

`scorePickup` weighs detour cost vs benefit using position, mood, and persona. Examples:

- Defender seeks **Shield**.
- Attacker seeks **Shockwave** / **Slingshot**.
- Desperate rivals take bigger detours.

Auto-placed gems (jam, slick, payback, ghost) exist on every track via `autoPickupSpots`.

## Traffic and each other

- THE WALL blocks any chaser, not only the player.
- LEECH drafts whoever is ahead.
- BRUISER sideswipes in pack traffic.
- WEAVER evaluates lane occupancy (`pickClearLane`).

## Knockout (Gauntlet)

When in the elimination zone, desperation spikes; HUD highlights the at-risk car. Random **round rules** modify physics (nitro rain, ghost lap, etc.)—see README tournament table.

## Tuning tips

- If rivals feel timid on a new track, check **racing line** bake (`bakeLine`) and curvature samples—not just `AIT.brk`.
- If they ignore a chicane, ensure corners are represented in the track polyline resolution (`ds`).
- For boss nights, set loading warnings when `RIVAL_BOSS` draws outlaw chassis.

Next: [Power-ups and physics](07-Power-Ups-and-Physics.md)
