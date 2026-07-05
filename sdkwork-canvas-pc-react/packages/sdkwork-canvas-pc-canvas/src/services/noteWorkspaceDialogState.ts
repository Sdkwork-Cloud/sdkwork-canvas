import type { Note } from '@sdkwork/canvas-pc-types';
import type { NoteWorkspacePendingDialog } from './noteWorkspacePageActions';

type DialogNoteSummary = Pick<Note, 'id' | 'title'>;
type DialogFolderSummary = {
  id: string;
  name: string;
};

type NotesWorkspaceDialogTranslator = (
  key: string,
  options?: Record<string, unknown>,
) => string;

export interface NotesWorkspaceDialogState {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
}

export interface NotesWorkspaceDialogStateInput {
  pendingDialog: NoteWorkspacePendingDialog | null;
  canvas: DialogNoteSummary[];
  trashedNotes: DialogNoteSummary[];
  folders: DialogFolderSummary[];
  t: NotesWorkspaceDialogTranslator;
}

function createClosedDialogState(): NotesWorkspaceDialogState {
  return {
    open: false,
    title: '',
    description: '',
    confirmLabel: '',
  };
}

function resolveDialogNoteTitle(
  pendingDialog: Extract<NoteWorkspacePendingDialog, { kind: 'deleteNote' }>,
  canvas: DialogNoteSummary[],
  trashedNotes: DialogNoteSummary[],
  t: NotesWorkspaceDialogTranslator,
) {
  return (
    [...canvas, ...trashedNotes].find((note) => note.id === pendingDialog.noteId)?.title
    ?? t('canvas.defaults.docTitle')
  );
}

function resolveDialogFolderName(
  pendingDialog: Extract<NoteWorkspacePendingDialog, { kind: 'deleteFolder' }>,
  folders: DialogFolderSummary[],
  t: NotesWorkspaceDialogTranslator,
) {
  return (
    folders.find((folder) => folder.id === pendingDialog.folderId)?.name
    ?? t('canvas.defaults.folderTitle')
  );
}

export function buildNotesWorkspaceDialogState(
  input: NotesWorkspaceDialogStateInput,
): NotesWorkspaceDialogState {
  const { pendingDialog, canvas, trashedNotes, folders, t } = input;

  if (!pendingDialog) {
    return createClosedDialogState();
  }

  if (pendingDialog.kind === 'clearTrash') {
    return {
      open: true,
      title: t('canvas.dialogs.clearTrash.title'),
      description: t('canvas.dialogs.clearTrash.description'),
      confirmLabel: t('canvas.dialogs.clearTrash.confirm'),
    };
  }

  if (pendingDialog.kind === 'deleteNote') {
    return {
      open: true,
      title: t('canvas.dialogs.deleteNote.title'),
      description: t('canvas.dialogs.deleteNote.description', {
        title: resolveDialogNoteTitle(pendingDialog, canvas, trashedNotes, t),
      }),
      confirmLabel: t('canvas.dialogs.deleteNote.confirm'),
    };
  }

  return {
    open: true,
    title: t('canvas.dialogs.deleteFolder.title'),
    description: t('canvas.dialogs.deleteFolder.description', {
      name: resolveDialogFolderName(pendingDialog, folders, t),
    }),
    confirmLabel: t('canvas.dialogs.deleteFolder.confirm'),
  };
}
