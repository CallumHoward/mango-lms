import { createFileRoute } from "@tanstack/react-router";

import { Page } from "@/components/page";

export const Route = createFileRoute("/_tabs/")({
  component: Home,
});

function Home() {
  return (
    <Page>
      <main className="page">
        <h1>Home</h1>
        <p>Welcome — this is the home tab.</p>
      </main>
    </Page>
  );
}
