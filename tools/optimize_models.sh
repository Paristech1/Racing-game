#!/usr/bin/env bash
# Compress models/*.glb with meshopt + quantization and refresh js/model-manifest.js. See tools/optimize/optimize_models.mjs.
# Usage: tools/optimize_models.sh [--check] [--force] [models/foo.glb ...]
set -euo pipefail
export AH_CWD="$PWD"
cd "$(dirname "$0")/optimize"
[ -d node_modules ] || npm install --no-audit --no-fund --silent
exec node optimize_models.mjs "$@"
