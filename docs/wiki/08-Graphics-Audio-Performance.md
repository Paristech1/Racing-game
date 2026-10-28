# Graphics, audio, and performance

## Rendering stack

- **WebGL2** renderer on `#gl` canvas.
- **MSAA 4×** through the post chain.
- **EffectComposer** passes: bloom (`UnrealBloomPass`), color grade (split tone, vignette, chromatic aberration), radial speed blur tied to velocity/boost.
- **Film grain:** CSS grain in menus; shader grain during race (`document.body.racing`).

Scene objects can set `userData.bloom` thresholds for selective glow (headlights, neon, tunnel strips).

## Materials and atmosphere

- **Wet roads:** roughness/normal maps + streak textures under lights; rain events increase wetness.
- **Rain:** streak particles, spray, audio bed; disabled in tunnels.
- **Fog + culling:** instances culled by fog opacity; far geometry skipped.
- **Night sky:** dome with stars/moon; event-specific env maps (`ENV.ice`, `ENV.tunnel`, …).

## Phone tier

`PHONE` / `PHONE_TIER` reduce detail (loft segments, wet FX resolution, some particle counts) on coarse pointers and narrow screens.

## 60 fps strategy (README summary)

| Technique | Purpose |
|-----------|---------|
| Dynamic resolution scale | Drops to 0.7× when frame time slips; climbs to 1.5× on headroom |
| Merged kit meshes | One draw call per material per kit chunk |
| Instancing | Trees, guardrails, parked cars in tiles |
| Prewarm shaders | Compile at start line |
| DOM HUD diffing | Touch text nodes only when values change |
| Event release | Drop unused city GPU data when leaving event |

## Asset loading

`js/assets.js` parallelizes GLB fetch before THREE exists. Boot bar reflects byte progress. Meshopt decoder is tiny (~21 KB) vs Draco.

**Do not** read quantized GLB attributes on CPU before the widen pass in assets (documented in afterhours-threejs skill).

## Audio

Web Audio API (`AC`) with guarded resume on visibility. Music layers by event level; SFX for UI, boost, collisions. Rain loop when weather roll succeeds.

Settings: music, sound, voice, track selection (auto vs specific playlist).

## Bloom / “Glow” setting

User can disable glow for clarity or performance; composer path respects flag.

## Clear vs Cinematic look

Toggles post strength / grain — `CLEAR` flag and settings row “Look: Clear”.

## When you add VFX

1. Prefer reusing `addMat`, `fogAdd`, `edgeFade` patterns.
2. Mark additive lights with fog defines so they fade in distance.
3. Test with dynamic resolution on — bloom pass uses screen pixels, not internal scale quirks.
4. Bump `index.html` cache version after shader edits in `afterhours.js`.

Next: [Save data and settings](09-Save-Data-and-Settings.md)
