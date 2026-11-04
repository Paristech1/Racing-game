# Save data and settings

## Storage

Player progress is stored in **`localStorage`** under key **`afterhours.v1`**.

`persist()` stringifies `SAVE` after meaningful changes (race end, settings, field size).

### Typical `SAVE` fields

| Field | Meaning |
|-------|---------|
| Per-car id (`SAVE[carId]`) | `runs`, `wins`, `hits`, `last` race time, `bestBy` lap map per event |
| `diff` | Rookie / street / outlaw |
| `fieldBy` | Grid size per event id (e.g. Calder 20) |
| `fieldN` | Legacy global field size (fallback) |
| Ghost blobs | Per-event best replay data (see ghost code in `afterhours.js`) |
| Settings flags | Glow, look, music, sound, voice, track preference |

**Hits** increment on wall/contact — affects paint wear presentation.

There is no server sync; clearing site data resets the archive stats.

## Settings sheet

Opened from in-game menu; rows map to buttons in `index.html`:

- **Glow** — post bloom on/off
- **Look** — Clear vs Cinematic
- **Rivals** — difficulty tier
- **Music / Sound / Voice** — audio buses
- **Track** — music playlist mode

`settings-open` body class blocks interaction with the scene behind the sheet.

## Field size

Before a race, event footer lets you pick grid count (4, 7, 12, or archive max). Stored in `SAVE.fieldBy[eventId]`.

Knockout (`ko`) forces 12 cars regardless.

`fieldSizeForEvent` in `logic.mjs` documents precedence: per-event save → legacy `fieldN` → `ev.defaultField` → 7.

## Privacy

No accounts, no analytics in repo code — everything stays in the browser.

Next: [Contributing with agents](10-Contributing-with-Agents.md)
