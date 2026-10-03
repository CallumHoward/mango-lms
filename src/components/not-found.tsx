import { m } from "#/paraglide/messages.js";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl text-gray-400">{m.page_not_found()}</p>
    </div>
  );
}
