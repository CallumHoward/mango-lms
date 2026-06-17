# iOS (Capacitor)

This app is a TanStack Start web app wrapped as a native iOS app with
[Capacitor](https://capacitorjs.com/). Capacitor loads a **static client build**
in a native `WKWebView`, so the app is built in **SPA mode** (no SSR server at
runtime).

## How it fits together

- `vite.config.ts` enables SPA mode **only for the mobile build** (gated behind
  the `MOBILE_BUILD=true` env var that `build:mobile` sets). The default
  `pnpm build` keeps SSR; the mobile build prerenders a client-only shell
  (`.output/public/_shell.html`) that boots the router on the client for every
  route.
- `scripts/prepare-mobile.sh` copies `.output/public` into `www/` and promotes
  the shell to `www/index.html` (Capacitor's required entry point).
- `capacitor.config.ts` points `webDir` at `www/`.
- `www/` is git-ignored; the `ios/` native project is committed (its build
  artifacts and generated config are excluded by Capacitor's `ios/.gitignore`).

## Scripts

| Script              | What it does                                             |
| ------------------- | -------------------------------------------------------- |
| `pnpm build:mobile` | Build the web app and stage `www/` for Capacitor.        |
| `pnpm ios:add`      | Build + scaffold the native `ios/` project (first time). |
| `pnpm ios:sync`     | Build + copy web assets and native deps into `ios/`.     |
| `pnpm ios:open`     | Open the project in Xcode.                               |

## First-time setup (requires macOS)

The native `ios/` project is already generated (via `pnpm ios:add`) and tracked
in git. Capacitor 8 manages iOS dependencies with **Swift Package Manager**
(`ios/App/CapApp-SPM/Package.swift`) — **CocoaPods is not required**.

Building and running on a simulator/device requires the **full Xcode app** (the
Command Line Tools alone are not enough — they lack `xcodebuild` and the iOS
SDK/simulators). Install Xcode from the Mac App Store, then point the toolchain
at it:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
xcodebuild -runFirstLaunch
```

Then build and run:

```bash
pnpm install
pnpm ios:sync   # build web assets + sync into ios/ (resolves SPM packages)
pnpm ios:open   # open in Xcode — pick a simulator, press Run
```

> If you ever need to regenerate the native project from scratch, delete `ios/`
> and run `pnpm ios:add`.

## Day-to-day

Two loops, pick by need:

**Live reload (fast — recommended while developing).** Points the native WebView
at the Vite dev server, so edits hot-reload in the simulator/device with no
rebuild:

```bash
pnpm ios:dev                    # simulator (Xcode device picker)
pnpm ios:dev --target <udid>    # skip the picker (list: pnpm exec cap run ios --list)
```

Stop with Ctrl+C (it tears the dev server down). The build it produces is
dev-only — it trusts the dev-server origin over cleartext http; never ship it.

> Port 3000 busy (e.g. Docker)? Override: `PORT=3005 pnpm ios:dev`. For a
> physical device, also pass your Mac's LAN IP: `HOST=192.168.1.23 pnpm ios:dev`
> (the device must be on the same network).

**Bundled build (what you ship).** Rebuilds the static assets into the app:

```bash
pnpm ios:sync   # rebuild web + sync into ios/
pnpm ios:open   # run from Xcode
```

## Talking to a backend

The bundled app has **no SSR server**. Any server-side data must come from a
**deployed HTTPS API**. Because the WebView origin is `capacitor://localhost`,
configure your API's CORS to allow it. Avoid TanStack `createServerFn` / server
routes for data the mobile app needs — use client-side fetches against the
remote API instead.

### Live reload against the dev server (optional)

For fast iteration you can point the native app at the running Vite dev server
instead of the bundled assets. Temporarily add to `capacitor.config.ts`:

```ts
server: { url: "http://<your-LAN-ip>:3000", cleartext: true }
```

Run `pnpm dev`, `pnpm ios:sync`, then launch from Xcode. Remove this before
producing a release build.
