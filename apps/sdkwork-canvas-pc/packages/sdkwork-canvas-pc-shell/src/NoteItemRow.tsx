import React from "react";
import { Trash, FolderInput, X, FileText, MoreHorizontal } from "lucide-react";
import { Note } from "@sdkwork/sdkwork-canvas-pc-core/src/types";
import { cn } from "@sdkwork/sdkwork-canvas-pc-commons/src/lib/utils";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface NoteItemRowProps {
  note: Note;
  activeNoteId: string | null;
  setActiveNoteId: (id: string | null) => void;
  movingNoteId: string | null;
  setMovingNoteId: (id: string | null) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  canvas: Note[];
  onOpenMenu: (e: React.MouseEvent, type: 'note', id: string) => void;
}

export function NoteItemRow({
  note,
  activeNoteId,
  setActiveNoteId,
  movingNoteId,
  setMovingNoteId,
  updateNote,
  onDeleteNote,
  canvas,
  onOpenMenu,
}: NoteItemRowProps) {
  const { t } = useTranslation("common");
  const isSelected = activeNoteId === note.id;

  return (
    <div
      onClick={() => setActiveNoteId(note.id)}
      onContextMenu={(e) => onOpenMenu(e, 'note', note.id)}
      className={cn(
        "group px-4 py-3 cursor-pointer transition-colors relative border-l-4",
        isSelected
          ? "bg-surface-sidebar-active border-[#07C160]"
          : "border-transparent hover:bg-surface-sidebar-hover"
      )}
    >
      <div className="flex-1 min-w-0 pr-4">
        <div
          className={cn(
            "text-[10px] font-semibold mb-1 uppercase tracking-wider flex items-center gap-1",
            isSelected ? "text-[#07C160]" : "text-text-secondary"
          )}
        >
          {note.content.length > 50 ? t("aiWriting") : t("draft")}
        </div>
        <div
          className={cn(
            "text-sm font-medium truncate",
            isSelected ? "text-text-primary" : "text-text-secondary"
          )}
        >
          {note.title || t("untitledNote")}
        </div>
        <div className="text-[11px] text-text-tertiary mt-1">
          {t("updated")} {format(new Date(note.createdAt), "MMM d, yyyy")}
        </div>
      </div>

      {/* Action Buttons on Hover */}
      <div className="opacity-0 group-hover:opacity-100 absolute right-1 top-3 transition-opacity flex items-center bg-gradient-to-l from-surface-sidebar-hover via-surface-sidebar-hover to-transparent pl-4 pr-1 z-10">
        <button
          onClick={(e) => onOpenMenu(e, 'note', note.id)}
          className="p-1 rounded text-text-secondary hover:bg-black/5 dark:hover:bg-white/10 hover:text-text-primary transition-all"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Absolute Folder Relocator Dropdown Portal */}
      {movingNoteId === note.id && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-4 top-11 bg-surface-main text-text-primary border border-border-subtle shadow-xl rounded-xl p-2 z-30 min-w-[200px] max-w-[240px] animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="text-[10px] font-bold text-text-tertiary px-2 pb-1.5 pt-0.5 border-b border-border-subtle/40 mb-1 flex items-center justify-between">
            <span>{t("moveToCollectionTitle")}</span>
            <X
              className="w-3 h-3 hover:text-text-primary cursor-pointer transition-colors"
              onClick={() => setMovingNoteId(null)}
            />
          </div>
          <div className="max-h-[140px] overflow-y-auto space-y-0.5 custom-scrollbar">
            {canvas.filter((n) => n.isCollection).length === 0 ? (
              <div className="text-[10px] text-text-tertiary p-2 text-center font-semibold">
                {t("noCollectionAvailable")}
              </div>
            ) : (
              canvas
                .filter((n) => n.isCollection)
                .map((coll) => {
                  let pathTitle = coll.title || t("untitledCollection");
                  let currentParentId = coll.parentId;
                  while (currentParentId) {
                    const parentColl = canvas.find(n => n.id === currentParentId);
                    if (parentColl) {
                      pathTitle = `${parentColl.title || t("untitledCollection")} / ${pathTitle}`;
                      currentParentId = parentColl.parentId;
                    } else {
                      break;
                    }
                  }
                  
                  return (
                    <button
                      key={coll.id}
                      onClick={() => {
                        updateNote(note.id, { parentId: coll.id });
                        setMovingNoteId(null);
                      }}
                      className="w-full text-left px-2 py-1.5 hover:bg-[#07C160]/10 hover:text-[#07C160] rounded-lg text-[11px] font-bold text-text-secondary transition-all truncate"
                    >
                      📁 {pathTitle}
                    </button>
                  );
                })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
