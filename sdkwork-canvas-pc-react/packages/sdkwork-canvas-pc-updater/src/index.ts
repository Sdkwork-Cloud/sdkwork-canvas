export const canvas_UPDATER_PACKAGE = '@sdkwork/canvas-pc-updater';

export type NotesUpdateChannel = 'stable' | 'beta' | 'internal';

export interface NotesUpdateManifest {
  version: string;
  channel: NotesUpdateChannel;
  publishedAt: string;
  canvas?: string;
}

export interface NotesUpdaterService {
  checkForUpdates(channel: NotesUpdateChannel): Promise<NotesUpdateManifest | null>;
  applyUpdate(version: string): Promise<void>;
}
