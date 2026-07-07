import React from "react";
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  MoveUp,
  MoveDown,
  Pencil,
  Plus,
  Trash,
  FolderUp,
  MoreHorizontal
} from "lucide-react";
import { Note } from "@sdkwork/sdkwork-canvas-pc-core/src/types";
import { cn } from "@sdkwork/sdkwork-canvas-pc-commons/src/lib/utils";
import { useTranslation } from "react-i18next";

interface FolderItemProps {
  coll: Note;
  level?: number;
  activeNoteId: string | null;
  setActiveNoteId: (id: string | null) => void;
  canvas: Note[];
  expandedCollections: Record<string, boolean>;
  toggleCollection: (collectionId: string, e: React.MouseEvent) => void;
  editingCollectionId: string | null;
  setEditingCollectionId: (id: string | null) => void;
  editingCollectionTitle: string;
  setEditingCollectionTitle: (title: string) => void;
  startRenameCollection: (id: string, currentTitle: string, e: React.MouseEvent) => void;
  saveRenameCollection: (id: string) => void;
  moveCollection: (collectionId: string, direction: "up" | "down", e: React.MouseEvent) => void;
  handleCreateInCollection: (collectionId: string, e: React.MouseEvent) => void;
  handleCreateSubCollection: (parentId: string, e: React.MouseEvent) => void;
  handleDeleteNoteWithSubcanvas: (noteId: string) => void;
  moveChildNote: (childId: string, direction: "up" | "down") => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  onOpenMenu: (e: React.MouseEvent, type: 'collection' | 'chapter', id: string) => void;
}

export function FolderItem({
  coll,
  level = 0,
  activeNoteId,
  setActiveNoteId,
  canvas,
  expandedCollections,
  toggleCollection,
  editingCollectionId,
  setEditingCollectionId,
  editingCollectionTitle,
  setEditingCollectionTitle,
  startRenameCollection,
  saveRenameCollection,
  moveCollection,
  handleCreateInCollection,
  handleCreateSubCollection,
  handleDeleteNoteWithSubcanvas,
  moveChildNote,
  updateNote,
  onOpenMenu,
}: FolderItemProps) {
  const { t } = useTranslation("common");
  const isOpen = expandedCollections[coll.id] || false;
  const children = canvas.filter((n) => n.parentId === coll.id);
  const hasChildren = children.length > 0;
  const isSelected = activeNoteId === coll.id;

  return (
    <div className="flex flex-col border-b border-border-subtle/20 pb-1.5">
      {/* Collection Parent Header Row */}
      <div
        onClick={() => setActiveNoteId(coll.id)}
        onContextMenu={(e) => onOpenMenu(e, 'collection', coll.id)}
        style={{ paddingLeft: `${Math.max(16, 16 + level * 16)}px` }}
        className={cn(
          "group pr-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors relative border-l-4 min-w-0",
          isSelected
            ? "bg-surface-sidebar-active/85 border-[#07C160]"
            : "border-transparent hover:bg-surface-sidebar-hover/60"
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1 pr-2">
          <button
            onClick={(e) => toggleCollection(coll.id, e)}
            className="p-0.5 rounded text-text-tertiary hover:bg-surface-sidebar transition-colors shrink-0"
          >
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#07C160]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-text-tertiary" />
            )}
          </button>
          <FolderOpen
            className={cn(
              "w-4 h-4 shrink-0 transition-colors",
              isSelected ? "text-[#07C160]" : "text-text-secondary"
            )}
          />
          {editingCollectionId === coll.id ? (
            <input
              type="text"
              value={editingCollectionTitle}
              onChange={(e) => setEditingCollectionTitle(e.target.value)}
              onBlur={() => saveRenameCollection(coll.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveRenameCollection(coll.id);
                } else if (e.key === "Escape") {
                  setEditingCollectionId(null);
                }
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-panel border border-border-subtle rounded px-1.5 py-0.5 text-xs text-text-primary focus:outline-none focus:border-[#07C160] w-full max-w-[145px] font-bold min-w-0 flex-1"
            />
          ) : (
            <div
              className={cn(
                "text-sm font-bold truncate flex-1 min-w-0",
                isSelected ? "text-text-primary" : "text-text-secondary"
              )}
              onDoubleClick={(e) => startRenameCollection(coll.id, coll.title, e)}
              title={t("doubleClickToRename")}
            >
              {coll.title || t("untitledCollection")}
            </div>
          )}
        </div>

        {/* Folder Hover Controls */}
        <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-0.5 z-10">
          <button
            onClick={(e) => handleCreateInCollection(coll.id, e)}
            className="p-1 text-[#07C160] hover:bg-black/5 dark:hover:bg-white/10 rounded transition-all"
            title={t("addNewChapter")}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => onOpenMenu(e, 'collection', coll.id)}
            className="p-1 text-text-tertiary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/10 rounded transition-all"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Chapters/Sub-Pages */}
      {isOpen && (
        <div className="flex flex-col mt-0.5 space-y-1">
          {!hasChildren ? (
            <div className="text-[11px] text-text-tertiary py-1.5 px-3 italic flex items-center justify-between ml-[28px]" style={{ paddingLeft: `${level * 16}px` }}>
              <span>{t("noSubchapters")}</span>
              <button
                onClick={(e) => handleCreateInCollection(coll.id, e)}
                className="text-[10px] text-[#07C160] hover:underline"
              >
                {t("addNewChapterQuick")}
              </button>
            </div>
          ) : (
            children.map((child, chIdx) => {
              if (child.isCollection) {
                return (
                  <FolderItem
                    key={child.id}
                    coll={child}
                    level={level + 1}
                    activeNoteId={activeNoteId}
                    setActiveNoteId={setActiveNoteId}
                    canvas={canvas}
                    expandedCollections={expandedCollections}
                    toggleCollection={toggleCollection}
                    editingCollectionId={editingCollectionId}
                    setEditingCollectionId={setEditingCollectionId}
                    editingCollectionTitle={editingCollectionTitle}
                    setEditingCollectionTitle={setEditingCollectionTitle}
                    startRenameCollection={startRenameCollection}
                    saveRenameCollection={saveRenameCollection}
                    moveCollection={moveCollection}
                    handleCreateInCollection={handleCreateInCollection}
                    handleCreateSubCollection={handleCreateSubCollection}
                    handleDeleteNoteWithSubcanvas={handleDeleteNoteWithSubcanvas}
                    moveChildNote={moveChildNote}
                    updateNote={updateNote}
                    onOpenMenu={onOpenMenu}
                  />
                );
              }
              const isChildSelected = activeNoteId === child.id;
              return (
                <div
                  key={child.id}
                  onClick={() => setActiveNoteId(child.id)}
                  onContextMenu={(e) => onOpenMenu(e, 'chapter', child.id)}
                  style={{ paddingLeft: `${Math.max(16, 32 + level * 16)}px` }}
                  className={cn(
                    "group/ch py-1.5 pr-2.5 cursor-pointer flex items-center justify-between gap-1 transition-all relative border-l-4 min-w-0",
                    isChildSelected
                      ? "bg-[#07C160]/10 text-text-primary border-[#07C160] font-medium"
                      : "border-transparent hover:bg-surface-sidebar-hover text-text-secondary"
                  )}
                >
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 pr-1">
                    <div className="font-mono text-[9px] text-[#07C160]/75 shrink-0 select-none bg-[#07C160]/5 px-1 rounded">
                      #{String(chIdx + 1).padStart(2, "0")}
                    </div>
                    <div
                      className={cn(
                        "text-xs truncate flex-1 min-w-0",
                        isChildSelected ? "text-text-primary font-bold" : "text-text-secondary"
                      )}
                    >
                      {child.title || t("untitledChildChapter")}
                    </div>
                  </div>

                  {/* Chapter Reorder Buttons & Action buttons */}
                  <div className="absolute right-1 opacity-0 group-hover/ch:opacity-100 transition-all flex items-center gap-0.5 z-10 bg-gradient-to-l from-surface-sidebar-hover via-surface-sidebar-hover to-transparent pl-4 pr-1">
                    <button
                      onClick={(e) => onOpenMenu(e, 'chapter', child.id)}
                      className="p-1 text-text-tertiary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/10 rounded"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
