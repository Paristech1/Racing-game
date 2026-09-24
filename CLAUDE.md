# CLAUDE.md

@AGENTS.md

## Three.js skills are required

The Three.js skills in `.claude/skills/` (symlinks to `.cursor/skills/`, from [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills)) must be used for any 3D work in this repo: cars, tracks, lighting, materials, textures, post FX or canvas interaction.

1. Invoke **`afterhours-threejs`** first. It maps the upstream r160+ module examples onto this repo's global THREE r128 build.
2. Then invoke the `threejs-*` skill for the area you are changing (e.g. `threejs-materials` for paint or carbon, `threejs-geometry` for body shapes, `threejs-lighting` for lamps and glow).
3. Adapt the examples to global `THREE` r128. Never add `import` statements or `three/addons/` paths.
