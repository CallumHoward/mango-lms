import { createFileRoute, useRouter } from "@tanstack/react-router";

import { Page } from "@/components/page";
import { formatNoteDate, getNote } from "@/lib/notes";
import { setDirection } from "@/lib/transitions";
import { useNativeNavbar } from "@/lib/use-native-navbar";

export const Route = createFileRoute("/notes/$noteId")({
  component: NoteDetail,
});

function NoteDetail() {
  const { noteId } = Route.useParams();
  const note = getNote(noteId);
  const router = useRouter();

  // Native Liquid Glass navbar + back button (hides the tab bar); no-op on web.
  // The interactive edge swipe-back is handled by the cap-router-outlet.
  useNativeNavbar(note?.title ?? "Note");

  const goBack = () => {
    // Pop: history.back() so the outlet animates back and the URL stays in sync
    // (matches what the swipe gesture does internally).
    setDirection("back");
    if (router.history.canGoBack()) router.history.back();
    else void router.navigate({ to: "/notes" });
  };

  return (
    <Page>
      <main className="page note-detail">
        {/* Web back affordance; hidden on native where the navbar provides it. */}
        <button type="button" className="back-link" onClick={goBack}>
          ‹ Notes
        </button>
        {note ? (
          <article>
            <h1>{note.title}</h1>
            <p className="note-detail-date">{formatNoteDate(note.updatedAt)}</p>
            <p className="note-detail-body">{note.body}</p>
          </article>
        ) : (
          <p>Note not found.</p>
        )}
      </main>
    </Page>
  );
}
