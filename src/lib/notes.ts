// Mock notes data. Swap for a real store/API later; the UI only depends on
// the Note shape and the two helpers below.
export interface Note {
  id: string;
  title: string;
  body: string;
  /** ISO timestamp of the last edit. */
  updatedAt: string;
}

export const NOTES: readonly Note[] = [
  {
    id: "groceries",
    title: "Groceries",
    body: "Oat milk, sourdough, eggs, spinach, parmesan, cherry tomatoes, coffee beans.",
    updatedAt: "2026-06-10T18:30:00Z",
  },
  {
    id: "standup",
    title: "Standup notes",
    body: "Shipped the native tab bar. Today: notes list + detail transitions. Blocked on nothing.",
    updatedAt: "2026-06-10T08:05:00Z",
  },
  {
    id: "book-ideas",
    title: "Book ideas",
    body: "A history of the WebView. Why every native shell eventually grows a plugin ecosystem.",
    updatedAt: "2026-06-08T21:12:00Z",
  },
  {
    id: "trip",
    title: "Weekend trip",
    body: "Leave Friday after lunch. Pack rain shell. Charge the camera. Book the Saturday walk.",
    updatedAt: "2026-06-07T12:00:00Z",
  },
  {
    id: "liquid-glass",
    title: "Liquid Glass notes",
    body: "System material only on native views. Tab bar + navbar get it free on iOS 26.",
    updatedAt: "2026-06-05T16:45:00Z",
  },
];

export function getNote(id: string): Note | undefined {
  return NOTES.find((note) => note.id === id);
}

/** First line / short preview of a note's body for list rows. */
export function notePreview(body: string, max = 80): string {
  const firstLine = body.split("\n")[0]?.trim() ?? "";
  return firstLine.length > max ? `${firstLine.slice(0, max - 1)}…` : firstLine;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export function formatNoteDate(updatedAt: string): string {
  return dateFormatter.format(new Date(updatedAt));
}
