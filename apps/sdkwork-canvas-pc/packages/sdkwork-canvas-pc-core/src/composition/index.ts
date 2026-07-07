import { AIClient, NoteService } from "../api";
import { NotesProvider } from "../store";
import { ThemeProvider } from "../theme";

export type CanvasPcCoreComposition = {
  aiClient: typeof AIClient;
  noteService: typeof NoteService;
  providers: {
    NotesProvider: typeof NotesProvider;
    ThemeProvider: typeof ThemeProvider;
  };
};

export function createCanvasPcCoreComposition(): CanvasPcCoreComposition {
  return {
    aiClient: AIClient,
    noteService: NoteService,
    providers: {
      NotesProvider,
      ThemeProvider,
    },
  };
}
