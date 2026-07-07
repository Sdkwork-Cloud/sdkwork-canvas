import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  PanelLeftClose,
  Trash,
  ChevronRight,
  ChevronDown,
  BookOpen,
  FileText,
  FolderOpen,
  MoveUp,
  MoveDown,
  X,
  FolderInput,
  FolderUp,
  Pencil
} from "lucide-react";
import { useNotes } from "@sdkwork/sdkwork-canvas-pc-core/src/store";
import { WechatTheme } from "@sdkwork/sdkwork-canvas-pc-core/src/types";
import { cn } from "@sdkwork/sdkwork-canvas-pc-commons/src/lib/utils";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { TemplateCategoryModal } from "./TemplateCategoryModal";
import { NoteItemRow } from "./NoteItemRow";
import { FolderItem } from "./FolderItem";

export function NotesListSidebar() {
  const {
    canvas,
    setNotes,
    activeNoteId,
    setActiveNoteId,
    createNote,
    updateNote,
    deleteNote,
    setSidebarOpen,
    isLoading,
  } = useNotes();
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [movingNoteId, setMovingNoteId] = useState<string | null>(null);
  const { t } = useTranslation("common");
  const { t: tEditor } = useTranslation("editor");

  const [sidebarTab, setSidebarTab] = useState<"individual" | "collection">("individual");
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({
    "coll-whispering-gears": true, // open by default for excellent onboarding UX
  });
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [editingCollectionTitle, setEditingCollectionTitle] = useState("");

  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);

  const [contextMenu, setContextMenu] = useState<{
    id: string;
    type: 'note' | 'collection' | 'chapter';
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    document.addEventListener("click", closeMenu);
    document.addEventListener("scroll", closeMenu, true);
    return () => {
      document.removeEventListener("click", closeMenu);
      document.removeEventListener("scroll", closeMenu, true);
    };
  }, []);

  const handleOpenMenu = (e: React.MouseEvent, type: 'note' | 'collection' | 'chapter', id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      id,
      type,
      x: e.clientX,
      y: e.clientY
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      // 64px is approximately the width of the NavigationSidebar
      const newWidth = e.clientX - 64;
      if (newWidth >= 180 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
      }
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  const startRenameCollection = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCollectionId(id);
    setEditingCollectionTitle(currentTitle);
  };

  const saveRenameCollection = (id: string) => {
    if (editingCollectionTitle.trim()) {
      updateNote(id, { title: editingCollectionTitle.trim() });
    }
    setEditingCollectionId(null);
  };

  const moveCollection = (collectionId: string, direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    const targetColl = canvas.find((n) => n.id === collectionId);
    if (!targetColl) return;

    let siblings = [];
    if (targetColl.parentId) {
      siblings = canvas.filter((n) => n.parentId === targetColl.parentId);
    } else {
      siblings = canvas.filter((n) => n.isCollection && !n.parentId);
    }
    
    const index = siblings.findIndex((n) => n.id === collectionId);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= siblings.length) return;

    const siblingA = siblings[index];
    const siblingB = siblings[targetIndex];

    setNotes((prevNotes) => {
      const idxA = prevNotes.findIndex((n) => n.id === siblingA.id);
      const idxB = prevNotes.findIndex((n) => n.id === siblingB.id);
      if (idxA === -1 || idxB === -1) return prevNotes;

      const copy = [...prevNotes];
      const temp = copy[idxA];
      copy[idxA] = copy[idxB];
      copy[idxB] = temp;
      return copy;
    });
  };

  // Auto-expand collection folder when a collection or chapter gets selected
  useEffect(() => {
    if (activeNoteId) {
      let current = canvas.find((n) => n.id === activeNoteId);
      if (current && (current.isCollection || current.parentId)) {
        setSidebarTab("collection");
        setExpandedCollections((prev) => {
          const next = { ...prev };
          let madeChanges = false;
          
          if (current.isCollection && !next[current.id]) {
            next[current.id] = true;
            madeChanges = true;
          }
          
          let parentId = current.parentId;
          while (parentId) {
            if (!next[parentId]) {
              next[parentId] = true;
              madeChanges = true;
            }
            const parentNode = canvas.find(n => n.id === parentId);
            parentId = parentNode?.parentId || null;
          }
          
          return madeChanges ? next : prev;
        });
      }
    }
  }, [activeNoteId, canvas]);

  const filteredNotes = canvas.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleCollection = (collectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCollections((prev) => ({
      ...prev,
      [collectionId]: !prev[collectionId],
    }));
  };

  const handleCreateSubCollection = (parentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSidebarTab("collection");
    setExpandedCollections((prev) => ({ ...prev, [parentId]: true }));
    const count = canvas.filter((n) => n.parentId === parentId && n.isCollection).length;
    createNote({
      title: `${t("untitledCollection")} ${count + 1}`,
      parentId: parentId,
      isCollection: true,
      content: `# ${t("untitledCollection")}`
    });
  };

  const handleCreateInCollection = (collectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSidebarTab("collection");
    setExpandedCollections((prev) => ({ ...prev, [collectionId]: true }));
    const count = canvas.filter((n) => n.parentId === collectionId).length;
    createNote({
      title: tEditor("chapterNumPrefix") + ` ${count + 1} ` + tEditor("chapterNumSuffix") + ` / Chapter ${count + 1}`,
      parentId: collectionId,
      content: `## ${tEditor("chapterNumPrefix")} ${count + 1} ${tEditor("chapterNumSuffix")}\n\n${tEditor("startTyping")}`
    });
  };

  const moveChildNote = (childId: string, direction: "up" | "down") => {
    const targetChild = canvas.find((n) => n.id === childId);
    if (!targetChild || !targetChild.parentId) return;

    const parentId = targetChild.parentId;
    const siblings = canvas.filter((n) => n.parentId === parentId);
    const index = siblings.findIndex((n) => n.id === childId);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= siblings.length) return;

    const siblingA = siblings[index];
    const siblingB = siblings[targetIndex];

    setNotes((prevNotes) => {
      const idxA = prevNotes.findIndex((n) => n.id === siblingA.id);
      const idxB = prevNotes.findIndex((n) => n.id === siblingB.id);
      if (idxA === -1 || idxB === -1) return prevNotes;

      const copy = [...prevNotes];
      const temp = copy[idxA];
      copy[idxA] = copy[idxB];
      copy[idxB] = temp;
      return copy;
    });
  };

  const handleDeleteNoteWithSubcanvas = (noteId: string) => {
    const targetNode = canvas.find((n) => n.id === noteId);
    if (!targetNode) return;

    if (targetNode.isCollection) {
      if (
        confirm(
          t("deleteCollectionConfirm", { title: targetNode.title })
        )
      ) {
        const children = canvas.filter((n) => n.parentId === noteId);
        children.forEach((child) => deleteNote(child.id));
        deleteNote(noteId);
      }
    } else {
      deleteNote(noteId);
    }
  };

  const handleAddNewItem = () => {
    if (sidebarTab === "collection") {
      setIsTemplateModalOpen(true);
    } else {
      createNote({ title: t("untitledNote") });
    }
  };

  return (
    <div
      style={{ width: `${sidebarWidth}px` }}
      className={cn(
        "flex-shrink-0 flex flex-col border-r h-full z-10 relative",
        WechatTheme.sidebarMid,
        WechatTheme.border,
      )}
    >
      {/* Resizer Handle */}
      <div 
        onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
        className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#07C160]/50 z-50 transform translate-x-1/2 transition-colors"
      />

      {/* Title Header with Inline Search Option */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-border-subtle/10 shrink-0">
        {isSearching ? (
          <div className="flex-1 flex items-center gap-2 animate-fade-in">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                autoFocus
                placeholder={t("searchPlaceHolder")}
                className="w-full bg-surface-panel border border-border-subtle/80 text-xs rounded-md py-1.5 pl-8 pr-7 outline-none text-text-primary placeholder-text-tertiary focus:border-[#07C160] focus:ring-1 focus:ring-[#07C160]/20 transition-all font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-0.5 rounded-full hover:bg-surface-sidebar-hover transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setIsSearching(false);
                setSearch("");
              }}
              className="text-xs font-semibold text-text-secondary hover:text-[#07C160] px-1.5 py-1 hover:bg-surface-sidebar-hover rounded transition-colors shrink-0"
            >
              {t("cancel")}
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-sm font-bold text-text-primary select-none flex items-center gap-1.5">
              <span>{t("workspace")}</span>
            </h2>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setIsSearching(true)}
                className="p-1 hover:bg-surface-sidebar-hover rounded text-text-secondary hover:text-[#07C160] transition-colors"
                title={t("searchPlaceHolder")}
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-surface-sidebar-hover rounded text-text-secondary hover:text-text-primary transition-colors"
                title={t("collapseSidebar")}
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
              <button
                onClick={handleAddNewItem}
                className="p-1 hover:bg-surface-sidebar-hover rounded text-[#07C160] hover:scale-110 transition-all"
                title={sidebarTab === "collection" ? t("newCollection") : t("newNote")}
              >
                <Plus className="w-4.5 h-4.5 font-bold" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Tab Controls */}
      <div className="px-4 pb-2 flex gap-1 border-b border-border-subtle/30">
        <button
          onClick={() => setSidebarTab("individual")}
          className={cn(
            "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all text-center flex items-center justify-center gap-1 cursor-pointer",
            sidebarTab === "individual"
              ? "bg-[#07C160]/10 text-[#07C160] font-bold"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-sidebar-hover"
          )}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t("individualTab")}</span>
        </button>
        <button
          onClick={() => setSidebarTab("collection")}
          className={cn(
            "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all text-center flex items-center justify-center gap-1 cursor-pointer",
            sidebarTab === "collection"
              ? "bg-[#07C160]/10 text-[#07C160] font-bold"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-sidebar-hover"
          )}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t("collectionTab")}</span>
        </button>
      </div>

      {/* Primary Nodes List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-px relative">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex flex-col gap-2">
                <div className="h-3 bg-border-subtle rounded w-1/4"></div>
                <div className="h-4 bg-border-subtle rounded w-3/4"></div>
                <div className="h-2 bg-border-subtle rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : sidebarTab === "individual" ? (
          // Tab left: flat individual canvas list
          filteredNotes.filter((n) => !n.isCollection && !n.parentId).length === 0 ? (
            <div className="text-center mt-10 text-xs text-text-tertiary px-4 leading-normal">
              {t("noNotesFound")}
            </div>
          ) : (
            filteredNotes
              .filter((n) => !n.isCollection && !n.parentId)
              .map((note) => (
                <NoteItemRow
                  key={note.id}
                  note={note}
                  activeNoteId={activeNoteId}
                  setActiveNoteId={setActiveNoteId}
                  movingNoteId={movingNoteId}
                  setMovingNoteId={setMovingNoteId}
                  updateNote={updateNote}
                  onDeleteNote={handleDeleteNoteWithSubcanvas}
                  canvas={canvas}
                  onOpenMenu={handleOpenMenu}
                />
              ))
          )
        ) : (
          // Tab right: Tree structured list
          filteredNotes.filter((n) => n.isCollection === true && !n.parentId).length === 0 ? (
            <div className="text-center mt-10 text-xs text-text-tertiary px-4 leading-normal">
              {t("noCollectionFound")}
            </div>
          ) : (
            (() => {
              const collectionList = filteredNotes.filter((n) => n.isCollection === true && !n.parentId);
              return collectionList.map((coll, collIdx) => (
                <FolderItem
                  key={coll.id}
                  coll={coll}
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
                  onOpenMenu={handleOpenMenu}
                />
              ));
            })()
          )
        )}
      </div>

      <TemplateCategoryModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />

      {/* Global Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-[100] min-w-[160px] bg-surface-main border border-border-subtle/80 shadow-2xl rounded-xl py-1.5 text-xs text-text-primary animate-in fade-in zoom-in-95 duration-100 font-medium"
          style={{
            top: `${Math.min(contextMenu.y, window.innerHeight - 200)}px`,
            left: `${Math.min(contextMenu.x, window.innerWidth - 180)}px`,
          }}
          onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          {(() => {
            const targetNote = canvas.find(n => n.id === contextMenu.id);
            if (!targetNote) return null;

            if (contextMenu.type === 'note') {
              return (
                <>
                  <button
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-sidebar-hover hover:text-[#07C160] flex items-center gap-2 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMovingNoteId(contextMenu.id);
                      setContextMenu(null);
                    }}
                  >
                    <FolderInput className="w-3.5 h-3.5" />
                    {t("moveToCollection")}
                  </button>
                  <div className="h-[1px] bg-border-subtle/40 my-1 mx-2" />
                  <button
                    className="w-full text-left px-3 py-1.5 hover:bg-red-500/10 text-red-500 flex items-center gap-2 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNoteWithSubcanvas(contextMenu.id);
                      setContextMenu(null);
                    }}
                  >
                    <Trash className="w-3.5 h-3.5" />
                    {t("delete")}
                  </button>
                </>
              );
            }

            if (contextMenu.type === 'collection') {
              let siblingCollections = [];
              if (targetNote.parentId) {
                siblingCollections = canvas.filter((n) => n.parentId === targetNote.parentId);
              } else {
                siblingCollections = canvas.filter((n) => n.isCollection && !n.parentId);
              }
              const collIdx = siblingCollections.findIndex(c => c.id === contextMenu.id);
              
              return (
                <>
                  <button
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-sidebar-hover hover:text-[#07C160] flex items-center gap-2 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateSubCollection(contextMenu.id, e);
                      setContextMenu(null);
                    }}
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    {t("newSubCollection", "新建子合集")}
                  </button>
                  <div className="h-[1px] bg-border-subtle/40 my-1 mx-2" />
                  <button
                    disabled={collIdx === 0}
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-sidebar-hover disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveCollection(contextMenu.id, "up", e);
                      setContextMenu(null);
                    }}
                  >
                    <MoveUp className="w-3.5 h-3.5 text-text-tertiary" />
                    {t("moveUp")}
                  </button>
                  <button
                    disabled={collIdx === siblingCollections.length - 1}
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-sidebar-hover disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveCollection(contextMenu.id, "down", e);
                      setContextMenu(null);
                    }}
                  >
                    <MoveDown className="w-3.5 h-3.5 text-text-tertiary" />
                    {t("moveDown")}
                  </button>
                  <button
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-sidebar-hover hover:text-[#07C160] flex items-center gap-2 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      startRenameCollection(contextMenu.id, targetNote.title, e);
                      setContextMenu(null);
                    }}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    {t("renameCollection")}
                  </button>
                  {targetNote.parentId && (
                    <button
                      className="w-full text-left px-3 py-1.5 hover:bg-surface-sidebar-hover hover:text-[#07C160] flex items-center gap-2 transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateNote(contextMenu.id, { parentId: undefined });
                        setContextMenu(null);
                      }}
                    >
                      <FolderUp className="w-3.5 h-3.5" />
                      {t("removeToStandalone")}
                    </button>
                  )}
                  <div className="h-[1px] bg-border-subtle/40 my-1 mx-2" />
                  <button
                    className="w-full text-left px-3 py-1.5 hover:bg-red-500/10 text-red-500 flex items-center gap-2 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNoteWithSubcanvas(contextMenu.id);
                      setContextMenu(null);
                    }}
                  >
                    <Trash className="w-3.5 h-3.5" />
                    {t("deleteCollection")}
                  </button>
                </>
              );
            }

            if (contextMenu.type === 'chapter') {
              const children = canvas.filter(n => n.parentId === targetNote.parentId);
              const chIdx = children.findIndex(c => c.id === contextMenu.id);
              
              return (
                <>
                  <button
                    disabled={chIdx === 0}
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-sidebar-hover disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveChildNote(contextMenu.id, "up");
                      setContextMenu(null);
                    }}
                  >
                    <MoveUp className="w-3.5 h-3.5 text-text-tertiary" />
                    {t("moveUp")}
                  </button>
                  <button
                    disabled={chIdx === children.length - 1}
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-sidebar-hover disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveChildNote(contextMenu.id, "down");
                      setContextMenu(null);
                    }}
                  >
                    <MoveDown className="w-3.5 h-3.5 text-text-tertiary" />
                    {t("moveDown")}
                  </button>
                  <button
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-sidebar-hover hover:text-[#07C160] flex items-center gap-2 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateNote(contextMenu.id, { parentId: undefined });
                      setContextMenu(null);
                    }}
                  >
                    <FolderUp className="w-3.5 h-3.5" />
                    {t("removeToStandalone")}
                  </button>
                  <div className="h-[1px] bg-border-subtle/40 my-1 mx-2" />
                  <button
                    className="w-full text-left px-3 py-1.5 hover:bg-red-500/10 text-red-500 flex items-center gap-2 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNoteWithSubcanvas(contextMenu.id);
                      setContextMenu(null);
                    }}
                  >
                    <Trash className="w-3.5 h-3.5" />
                    {t("deleteChapterAction")}
                  </button>
                </>
              );
            }
            return null;
          })()}
        </div>
      )}
    </div>
  );
}
