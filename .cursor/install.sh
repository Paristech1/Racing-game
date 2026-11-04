#!/usr/bin/env bash
# Idempotent Cloud Agent install: Node.js 22 on the default PATH.
# The game has no root npm dependencies. Unit tests use `node --test`.
set -euo pipefail

NODE_VERSION=22.22.2

node_major() {
  "$1" -p 'Number(process.versions.node.split(".")[0])' 2>/dev/null || echo 0
}

if ! [[ "$(node_major /usr/local/bin/node)" -ge 22 ]]; then
  tmp="$(mktemp -d)"
  curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
    -o "$tmp/node.tar.xz"
  sudo tar -xJf "$tmp/node.tar.xz" -C /usr/local --strip-components=1 --no-same-owner
  rm -rf "$tmp"
fi

echo "node $(/usr/local/bin/node -v)"
echo "npm $(/usr/local/bin/npm -v)"
test "$(node_major /usr/local/bin/node)" -ge 22
