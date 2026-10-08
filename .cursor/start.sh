#!/usr/bin/env bash
# Serve the static AFTERHOURS game. Safe to run again if port 8080 is open.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if python3 -c 'import socket;s=socket.socket();r=s.connect_ex(("127.0.0.1",8080));s.close();raise SystemExit(0 if r==0 else 1)'; then
  echo "web server already listening on 8080"
  exit 0
fi

echo "serving AFTERHOURS at http://127.0.0.1:8080"
exec python3 -m http.server 8080 --bind 0.0.0.0
