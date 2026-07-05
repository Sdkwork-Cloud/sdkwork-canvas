import { BookOpenText, CalendarClock, Clock3, FolderTree, Hash, Layers3, RefreshCcw, ShieldAlert, Text, Trash2 } from 'lucide-react';
import { Button, SurfaceCard } from '@sdkwork/canvas-pc-commons';
import { useNotesTranslation } from '@sdkwork/canvas-pc-i18n';
import type { Note, NoteFolder } from '@sdkwork/canvas-pc-types';
import {
  countNoteCharacters,
  countNoteWords,
  estimateReadingMinutes,
  extractNoteOutline,
  formatNoteDateTime,
  formatRelativeNoteTime,
  getNoteTaskProgress,
} from '../services';

interface NoteInspectorPanelProps {
  folders: NoteFolder[];
  note: Note | null;
  onDeletePermanently: (id: string) => void;
  onDraftChange: (patch: Partial<Note>) => void;
  onMoveToTrash: (id: string) => void;
  onRestoreNote: (id: string) => void;
}

const noteTypes: Array<Note['type']> = ['doc', 'article', 'novel', 'log', 'news', 'code'];

export function NoteInspectorPanel({
  folders,
  note,
  onDeletePermanently,
  onDraftChange,
  onMoveToTrash,
  onRestoreNote,
}: NoteInspectorPanelProps) {
  const { t, i18n } = useNotesTranslation();
  const outline = extractNoteOutline(note);
  const taskProgress = getNoteTaskProgress(note);

  if (!note) {
    return (
      <div className="flex h-full items-center justify-center px-2">
        <SurfaceCard className="w-full">
          <div className="space-y-3 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('canvas.inspector.eyebrow')}
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              {t('canvas.inspector.emptyTitle')}
            </h3>
            <p className="text-sm leading-7 text-[var(--text-secondary)]">
              {t('canvas.inspector.emptyDescription')}
            </p>
          </div>
        </SurfaceCard>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <SurfaceCard>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft-bg)] text-[var(--accent-soft-text)]">
            <Layers3 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('canvas.inspector.eyebrow')}
            </div>
            <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
              {t('canvas.inspector.title')}
            </h3>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <label className="space-y-2" data-slot="inspector-publish-status">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('canvas.inspector.publishStatus')}
            </span>
            <select
              value={note.publishStatus ?? 'draft'}
              disabled={Boolean(note.deletedAt)}
              onChange={(event) => onDraftChange({ publishStatus: event.target.value as Note['publishStatus'] })}
              className="w-full rounded-2xl border border-[var(--line-soft)] bg-[var(--panel-muted)] px-3 py-2.5 text-sm outline-none focus:border-primary-400"
            >
              <option value="draft">{t('canvas.publishStatus.draft')}</option>
              <option value="archived">{t('canvas.publishStatus.archived')}</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('canvas.inspector.type')}
            </span>
            <select
              value={note.type}
              disabled={Boolean(note.deletedAt)}
              onChange={(event) => onDraftChange({ type: event.target.value as Note['type'] })}
              className="w-full rounded-2xl border border-[var(--line-soft)] bg-[var(--panel-muted)] px-3 py-2.5 text-sm outline-none focus:border-primary-400"
            >
              {noteTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`canvas.types.${type}`)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('canvas.inspector.folder')}
            </span>
            <div className="relative">
              <FolderTree className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <select
                value={note.parentId ?? ''}
                disabled={Boolean(note.deletedAt)}
                onChange={(event) => onDraftChange({ parentId: event.target.value || null })}
                className="w-full rounded-2xl border border-[var(--line-soft)] bg-[var(--panel-muted)] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary-400"
              >
                <option value="">{t('canvas.inspector.rootFolder')}</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('canvas.inspector.tags')}
            </span>
            <div className="relative">
              <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={note.tags.join(', ')}
                disabled={Boolean(note.deletedAt)}
                onChange={(event) => {
                  const nextTags = event.target.value
                    .split(',')
                    .map((value) => value.trim())
                    .filter(Boolean);
                  onDraftChange({ tags: nextTags });
                }}
                placeholder={t('canvas.inspector.tagsPlaceholder')}
                className="w-full rounded-2xl border border-[var(--line-soft)] bg-[var(--panel-muted)] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary-400"
              />
            </div>
          </label>
          <div className="flex flex-wrap gap-2">
            {note.tags.length > 0 ? note.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--line-soft)] bg-[var(--panel-muted)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]"
              >
                #{tag}
              </span>
            )) : (
              <span className="text-xs text-[var(--text-muted)]">
                {t('canvas.inspector.tagsEmpty')}
              </span>
            )}
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {t('canvas.inspector.stats')}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[var(--panel-muted)] p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <Hash className="h-4 w-4" />
              {t('canvas.inspector.wordCount')}
            </div>
            <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">
              {countNoteWords(note)}
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--panel-muted)] p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <Text className="h-4 w-4" />
              {t('canvas.inspector.characters')}
            </div>
            <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">
              {countNoteCharacters(note)}
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--panel-muted)] p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <BookOpenText className="h-4 w-4" />
              {t('canvas.inspector.readingTime')}
            </div>
            <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">
              {estimateReadingMinutes(note)} {t('canvas.inspector.minutes')}
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--panel-muted)] p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <Clock3 className="h-4 w-4" />
              {t('canvas.inspector.lastEditedRelative')}
            </div>
            <div className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
              {formatRelativeNoteTime(note.updatedAt, i18n.language) || '-'}
            </div>
          </div>

          <div className="col-span-2 rounded-2xl bg-[var(--panel-muted)] p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <CalendarClock className="h-4 w-4" />
              {t('canvas.inspector.updatedAt')}
            </div>
            <div className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
              {formatNoteDateTime(note.updatedAt, i18n.language)}
            </div>
          </div>

          <div className="col-span-2 rounded-2xl bg-[var(--panel-muted)] p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <CalendarClock className="h-4 w-4" />
              {t('canvas.inspector.createdAt')}
            </div>
            <div className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
              {formatNoteDateTime(note.createdAt, i18n.language)}
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-4" data-slot="inspector-structure-card">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {t('canvas.inspector.structure')}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-[var(--panel-muted)] p-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('canvas.inspector.headings')}
            </div>
            <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">
              {outline.length}
            </div>
          </div>
          <div className="rounded-2xl bg-[var(--panel-muted)] p-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('canvas.inspector.taskProgress')}
            </div>
            <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">
              {taskProgress.completed}/{taskProgress.total}
            </div>
          </div>
          <div className="rounded-2xl bg-[var(--panel-muted)] p-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('canvas.inspector.taggedCount')}
            </div>
            <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">
              {note.tags.length}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('canvas.inspector.outline')}
            </div>
            <div className="text-xs font-semibold text-[var(--text-secondary)]">
              {taskProgress.total > 0 ? `${Math.round(taskProgress.ratio * 100)}%` : '0%'}
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--panel-muted)]">
            <div
              className="h-full rounded-full bg-primary-500 transition-[width]"
              style={{ width: `${taskProgress.total > 0 ? Math.max(6, Math.round(taskProgress.ratio * 100)) : 0}%` }}
            />
          </div>

          {outline.length > 0 ? (
            <div data-slot="inspector-outline-list" className="space-y-2">
              {outline.map((item) => (
                <div
                  key={`${item.anchor}-${item.level}`}
                  className="rounded-2xl border border-[var(--line-soft)] bg-[var(--panel-muted)] px-3 py-2 text-sm text-[var(--text-secondary)]"
                  style={{ paddingLeft: `${12 + ((item.level - 1) * 14)}px` }}
                >
                  {item.text}
                </div>
              ))}
            </div>
          ) : (
            <div
              data-slot="inspector-outline-list"
              className="rounded-2xl border border-dashed border-[var(--line-soft)] bg-[var(--panel-muted)] px-3 py-4 text-sm leading-7 text-[var(--text-muted)]"
            >
              {t('canvas.inspector.outlineEmpty')}
            </div>
          )}
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          <ShieldAlert className="h-4 w-4" />
          {t('canvas.inspector.dangerZone')}
        </div>

        <div className="mt-4 space-y-3">
          {note.deletedAt ? (
            <>
              <Button appearance="primary" className="w-full justify-center" onClick={() => onRestoreNote(note.id)}>
                <RefreshCcw className="h-4 w-4" />
                {t('canvas.actions.restore')}
              </Button>
              <Button className="w-full justify-center" onClick={() => onDeletePermanently(note.id)}>
                <Trash2 className="h-4 w-4" />
                {t('canvas.actions.deletePermanently')}
              </Button>
            </>
          ) : (
            <Button className="w-full justify-center" onClick={() => onMoveToTrash(note.id)}>
              <Trash2 className="h-4 w-4" />
              {t('canvas.actions.moveToTrash')}
            </Button>
          )}
        </div>
      </SurfaceCard>
    </div>
  );
}
