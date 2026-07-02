import { createFileRoute } from "@tanstack/react-router";

import { m } from "#/paraglide/messages.js";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return <main>{m.hello_world()}</main>;
}
