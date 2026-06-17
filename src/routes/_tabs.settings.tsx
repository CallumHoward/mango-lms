import { createFileRoute } from "@tanstack/react-router";

import { Page } from "@/components/page";

export const Route = createFileRoute("/_tabs/settings")({
  component: Settings,
});

function Settings() {
  return (
    <Page>
      <main className="page">
        <h1>Settings</h1>
        <p>A placeholder settings page.</p>
      </main>
    </Page>
  );
}
