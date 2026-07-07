import React, { createContext, useContext, useEffect, useState } from "react";
import { Note } from "./types";
import { NoteService } from "./api";

interface NotesContextType {
  canvas: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  activeNoteId: string | null;
  setActiveNoteId: (id: string | null) => void;
  createNote: (initialData?: Partial<Note>) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isLoading: boolean;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [canvas, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    async function loadNotes() {
      setIsLoading(true);
      const loadedNotes = await NoteService.getNotes();
      setNotes(loadedNotes);
      if (loadedNotes.length > 0) setActiveNoteId(loadedNotes[0].id);
      setIsLoading(false);
    }
    loadNotes();
  }, []);

  // Sync to localstorage just for development mock persistence,
  // normally handled completely by backend
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("sdkwork-canvas-data", JSON.stringify(canvas));
    }
  }, [canvas, isLoading]);

  const createNote = async (initialData?: Partial<Note>) => {
    const newNote = await NoteService.createNote(initialData);
    if (newNote.parentId) {
      setNotes((prev) => {
        // Find is there any siblings under the same collections
        const reversedIndex = [...prev].reverse().findIndex((n) => n.parentId === newNote.parentId);
        if (reversedIndex !== -1) {
          // If yes, insert the newly created chapter right after the last sibling
          const actualIndex = prev.length - 1 - reversedIndex;
          const copy = [...prev];
          copy.splice(actualIndex + 1, 0, newNote);
          return copy;
        } else {
          // If no siblings exist yet, find where the parent collection is and insert directly after it!
          const parentIdx = prev.findIndex((n) => n.id === newNote.parentId);
          if (parentIdx !== -1) {
            const copy = [...prev];
            copy.splice(parentIdx + 1, 0, newNote);
            return copy;
          }
          return [...prev, newNote];
        }
      });
    } else {
      setNotes((prev) => [newNote, ...prev]);
    }
    setActiveNoteId(newNote.id);
    return newNote;
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    // Optimistic UI update
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note,
      ),
    );

    // Fire off to service
    await NoteService.updateNote(id, updates);
  };

  const deleteNote = async (id: string) => {
    // Optimistic UI update
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }

    // Fire off to service
    await NoteService.deleteNote(id);
  };

  return (
    <NotesContext.Provider
      value={{
        canvas,
        setNotes,
        activeNoteId,
        setActiveNoteId,
        createNote,
        updateNote,
        deleteNote,
        isSidebarOpen,
        setSidebarOpen,
        isLoading,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) throw new Error("useNotes must be used within NotesProvider");
  return context;
}
