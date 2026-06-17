import { createFileRoute } from "@tanstack/react-router";

import { Page } from "@/components/page";

export const Route = createFileRoute("/_tabs/about")({
  component: About,
});

function About() {
  return (
    <Page>
      <main className="page">
        <h1>About</h1>
        <p>A placeholder about page.</p>
      </main>
    </Page>
  );
}
