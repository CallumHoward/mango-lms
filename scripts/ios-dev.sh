#!/usr/bin/env bash
# Live-reload dev loop for iOS. Runs the Vite dev server and points the native
# WebView at it, so edits hot-reload inside the simulator/device (Vite HMR) —
# no rebuild per change, unlike the bundled `pnpm ios:sync` flow.
#
# Usage:
#   pnpm ios:dev                      # simulator (Xcode device picker)
#   pnpm ios:dev --target <udid>      # skip the picker (see: cap run ios --list)
#   PORT=3005 pnpm ios:dev            # if port 3000 is taken (e.g. by Docker)
#   HOST=192.168.1.23 pnpm ios:dev    # physical device: use your Mac's LAN IP
#
# NOTE: dev-only. Live reload makes the app trust the dev-server origin over
# cleartext http; never ship a build made this way. Use `pnpm ios:sync` for a
# normal bundled build.
set -euo pipefail

PORT="${PORT:-3000}"
HOST="${HOST:-localhost}"

# cap run's sync step needs the webDir to exist; build it once if missing.
# (Live content is served by the dev server, not these files.)
if [ ! -d www ]; then
  echo "[ios:dev] www/ missing — building bundled assets once so 'cap run' can sync"
  pnpm build:mobile
fi

# Start Vite (bound to all interfaces so a physical device can reach it) in the
# background, and always tear it down on exit. --strictPort fails loudly instead
# of drifting to another port that the native app wouldn't be pointed at.
pnpm exec vite dev --port "$PORT" --strictPort --host &
DEV_PID=$!
trap 'kill "$DEV_PID" 2>/dev/null || true' EXIT INT TERM

echo "[ios:dev] waiting for Vite dev server on http://$HOST:$PORT ..."
until curl -sf "http://$HOST:$PORT" >/dev/null 2>&1; do sleep 0.5; done

echo "[ios:dev] dev server up — launching iOS with live reload (HOST=$HOST)"
pnpm exec cap run ios --live-reload --host "$HOST" --port "$PORT" "$@"
