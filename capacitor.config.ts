import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // Reverse-domain identifier for the native app. Change to your own bundle id
  // before shipping (must match the App ID you register in Apple Developer).
  appId: "ai.checkbox.tanstackstarter",
  appName: "TanStack Starter",
  // Static web assets Capacitor copies into the native project. Produced by
  // `pnpm build:mobile` (TanStack Start SPA build -> www/ with index.html).
  webDir: "www",
  // Assets are served from capacitor://localhost (Capacitor's default iOS
  // scheme), so the shell's absolute paths like /assets/*.js resolve correctly
  // inside the WebView.
  //
  // To talk to a backend, point fetches at your deployed HTTPS API. The bundled
  // app has no SSR server, so server-side data must come from a remote origin
  // (configure CORS to allow the capacitor://localhost / https://localhost
  // WebView origin). For live-reload against the Vite dev server during
  // development you can temporarily set e.g.:
  //   server: { url: "http://<your-LAN-ip>:3000", cleartext: true }
};

export default config;
