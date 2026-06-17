import { Link, createFileRoute } from "@tanstack/react-router";

import { Page } from "@/components/page";
import { NOTES, formatNoteDate, notePreview } from "@/lib/notes";
import { setDirection } from "@/lib/transitions";

export const Route = createFileRoute("/_tabs/notes")({
  component: NotesList,
});

function NotesList() {
  return (
    <Page>
      <main className="page notes-page">
        <h1>Notes</h1>
        <ul className="notes-list">
          {NOTES.map((note) => (
            <li key={note.id}>
              <Link
                to="/notes/$noteId"
                params={{ noteId: note.id }}
                className="note-row"
                // Forward push; cap-router-outlet animates the page slide.
                onClick={() => setDirection("forward")}
              >
                <span className="note-row-title">{note.title}</span>
                <span className="note-row-meta">
                  <span className="note-row-date">{formatNoteDate(note.updatedAt)}</span>
                  <span className="note-row-preview">{notePreview(note.body)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </Page>
  );
}
