#!/usr/bin/env bash
# Prepares the static web assets that Capacitor bundles into the native app.
#
# TanStack Start (SPA mode) prerenders a client-only shell into
# `.output/public`. Capacitor's `webDir` needs a plain folder with an
# `index.html` entry point, so we copy the build output into `www/` and promote
# the prerendered shell (`_shell.html`) to `index.html`.
#
# Run via `pnpm build:mobile` (which builds first). Safe to re-run.
set -euo pipefail

SOURCE=".output/public"
DEST="www"

if [ ! -d "$SOURCE" ]; then
  echo "[prepare-mobile] Missing $SOURCE. Run \`pnpm build\` first (or use \`pnpm build:mobile\`)." >&2
  exit 1
fi

# Start from a clean web root so removed assets don't linger between builds.
rm -rf "$DEST"
mkdir -p "$DEST"
cp -R "$SOURCE/." "$DEST/"

if [ ! -f "$DEST/index.html" ]; then
  if [ ! -f "$DEST/_shell.html" ]; then
    echo "[prepare-mobile] Neither index.html nor _shell.html found in $SOURCE." >&2
    echo "[prepare-mobile] Is SPA mode enabled in vite.config.ts (tanstackStart({ spa: { enabled: true } }))?" >&2
    exit 1
  fi
  # The SPA shell boots the client router for every route, so it works as the
  # single entry point inside the WebView.
  cp "$DEST/_shell.html" "$DEST/index.html"
fi

echo "[prepare-mobile] Web assets ready in $DEST/ (index.html present)."
