import React, { useState, useRef } from "react";
import { useNotes } from "@sdkwork/sdkwork-canvas-pc-core/src/store";
import {
  Sparkles,
  GripVertical,
  Image as ImageIcon,
  X,
  BookOpen,
  Plus,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Trash2,
  FolderPlus,
  ChevronRight,
  BookMarked,
  FileSignature
} from "lucide-react";
import { AIToolbar } from "./AIToolbar";
import { useTranslation } from "react-i18next";
import { EditorHeader } from "./components/EditorHeader";
import { TiptapEditor } from "./components/TiptapEditor";
import { EditorOutline } from "./components/EditorOutline";
import { BookWorkspace } from "./components/BookWorkspace";
import ReactMarkdown from "react-markdown";
import { cn } from "@sdkwork/sdkwork-canvas-pc-commons/src/lib/utils";

import remarkGfm from "remark-gfm";

export function EditorMain() {
  const { canvas, setNotes, activeNoteId, setActiveNoteId, createNote, deleteNote, updateNote } = useNotes();

  const getWordCount = (text: string): number => {
    if (!text) return 0;
    const cleanText = text.replace(/[\u4e00-\u9fa5]/g, " a ");
    const words = cleanText.trim().split(/\s+/).filter(Boolean);
    return words.length;
  };
  const [viewMode, setViewMode] = useState<"edit" | "split" | "preview">(
    "edit",
  );
  const [isAIWritingPanelOpen, setIsAIWritingPanelOpen] = useState(false);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(448);
  const [isHoveringTitleArea, setIsHoveringTitleArea] = useState(false);
  const isResizing = useRef(false);
  const { t } = useTranslation("editor");

  const activeNote = canvas.find((n) => n.id === activeNoteId);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    const startX = e.clientX;
    const startWidth = panelWidth;

    const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = startWidth - (mouseMoveEvent.clientX - startX);
      if (newWidth >= 200 && newWidth <= 800) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  if (!activeNote) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface-base text-text-tertiary">
        <Sparkles className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm">{t("selectNote")}</p>
      </div>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNote(activeNote.id, { title: e.target.value });
  };

  const handleContentChange = (content: string) => {
    updateNote(activeNote.id, { content });
  };

  const handleAIInsert = (text: string) => {
    const newContent = activeNote.content
      ? activeNote.content + "\n\n" + text
      : text;
    updateNote(activeNote.id, { content: newContent });
  };

  const handleAddCover = () => {
    const url = window.prompt(
      "Enter cover image URL",
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
    );
    if (url) {
      updateNote(activeNote.id, { coverUrl: url });
    }
  };

  const handleRemoveCover = () => {
    updateNote(activeNote.id, { coverUrl: undefined });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-main relative overflow-hidden">
      <EditorHeader
        title={activeNote.title}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isAIWritingPanelOpen={isAIWritingPanelOpen}
        setIsAIWritingPanelOpen={setIsAIWritingPanelOpen}
        isOutlineOpen={isOutlineOpen}
        setIsOutlineOpen={setIsOutlineOpen}
      />

      {/* Editor Body Area */}
      <div className="flex-1 flex relative overflow-hidden w-full h-full">
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface-main w-full h-full">
            <div
              className={cn(
                "w-full mx-auto min-h-full flex flex-col transition-all duration-300",
                viewMode === "split"
                  ? "max-w-none px-8"
                  : "max-w-4xl px-8 md:px-12",
              )}
            >
              {activeNote.coverUrl && (
                <div className="w-full h-48 md:h-64 mb-8 md:mb-12 relative group rounded-b-2xl overflow-hidden -mx-8 md:-mx-12 px-8 md:px-12 box-content">
                  <img
                    src={activeNote.coverUrl}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <button
                      onClick={handleAddCover}
                      className="px-3 py-1.5 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs font-medium rounded-md shadow-sm border border-white/10 transition-colors"
                    >
                      {t("changeCover", "Change Cover")}
                    </button>
                    <button
                      onClick={handleRemoveCover}
                      className="px-3 py-1.5 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs font-medium rounded-md shadow-sm border border-white/10 transition-colors"
                    >
                      {t("removeCover", "Remove")}
                    </button>
                  </div>
                </div>
              )}

              <div
                className={cn("relative pt-8", activeNote.coverUrl ? "pt-0" : "")}
                onMouseEnter={() => setIsHoveringTitleArea(true)}
                onMouseLeave={() => setIsHoveringTitleArea(false)}
              >
                {!activeNote.coverUrl && isHoveringTitleArea && (
                  <div className="absolute top-0 left-0 -mt-6">
                    <button
                      onClick={handleAddCover}
                      className="flex items-center gap-1.5 text-text-tertiary hover:text-[#07C160] transition-colors text-sm font-medium px-2 py-1 -ml-2 rounded hover:bg-surface-sidebar"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>{t("changeCover", "Add Cover")}</span>
                    </button>
                  </div>
                )}
                <textarea
                  className="w-full text-4xl md:text-[44px] font-bold border-none outline-none text-text-primary placeholder-text-tertiary bg-transparent mb-6 md:mb-8 leading-tight focus:outline-none focus:ring-0 resize-none overflow-hidden"
                  placeholder={t("untitled")}
                  value={activeNote.title}
                  onChange={(e) => {
                    handleTitleChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  rows={1}
                  onFocus={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                />
              </div>

              {/* Collection Hub Dashboard or Sub-Chapter Context Navigation */}
              {activeNote.isCollection && (
                <div className="mb-10 bg-surface-sidebar/30 rounded-xl border border-border-subtle/30 p-5 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-border-subtle/20">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono bg-[#07C160]/10 text-[#07C160] text-[9px] font-bold px-2 py-0.5 rounded-full select-none">
                          {t("collection")}
                        </span>
                        <span className="text-[10px] text-text-tertiary font-mono">
                          ID: {activeNote.id.substring(0, 8)}...
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-text-primary flex items-center gap-1.5 mt-1 line-clamp-1">
                        <BookMarked className="w-4 h-4 text-[#07C160]" />
                        <span>{t("quoteLeft", "“")}{activeNote.title || t('untitled')}{t("quoteRight", "”")} {t("collectionDraft")}</span>
                      </h3>
                    </div>
                    
                    <button
                      onClick={() => {
                        const count = canvas.filter((n) => n.parentId === activeNote.id).length;
                        createNote({
                          title: t("chapterNumPrefix") + ` ${count + 1} ` + t("chapterNumSuffix") + ` / Chapter ${count + 1}`,
                          parentId: activeNote.id,
                          content: `## ${t("chapterNumPrefix")} ${count + 1} ${t("chapterNumSuffix")}\n\n${t("startTyping")}`
                        });
                      }}
                      className="shrink-0 px-3 py-1.5 bg-[#07C160] hover:bg-[#07C160]/90 text-white rounded-md text-xs font-semibold shadow hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t("addChapter")}</span>
                    </button>
                  </div>

                  {/* Stats Cards Row */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 px-1">
                    <div className="flex items-center gap-2 pr-4 border-r border-border-subtle/30">
                      <BookOpen className="w-4 h-4 text-text-tertiary" />
                      <div>
                        <div className="text-[10px] text-text-tertiary font-medium">{t("recorded")}</div>
                        <div className="text-sm font-bold text-text-primary">
                          {canvas.filter((n) => n.parentId === activeNote.id).length} <span className="text-[10px] font-normal text-text-secondary">{t("chapterUnit")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pr-4 border-r border-border-subtle/30">
                      <FileSignature className="w-4 h-4 text-text-tertiary" />
                      <div>
                        <div className="text-[10px] text-text-tertiary font-medium">{t("totalWords")}</div>
                        <div className="text-sm font-bold text-text-primary">
                          {canvas
                            .filter((n) => n.parentId === activeNote.id)
                            .reduce((sum, n) => sum + getWordCount(n.content || ""), 0)
                            .toLocaleString()} <span className="text-[10px] font-normal text-text-secondary">{t("wordUnit")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-text-tertiary" />
                      <div>
                        <div className="text-[10px] text-text-tertiary font-medium">{t("lastUpdated")}</div>
                        <div className="text-xs font-bold text-text-secondary">
                          {new Date(
                            Math.max(
                              activeNote.updatedAt || 0,
                              ...canvas
                                .filter((n) => n.parentId === activeNote.id)
                                .map((n) => n.updatedAt || 0)
                            )
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chapter Roadmap Index */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <span>{t("chaptersTimeline")}</span>
                    </h4>

                    {canvas.filter((n) => n.parentId === activeNote.id).length === 0 ? (
                      <div className="text-center py-6 bg-surface-main rounded-lg border border-dashed border-border-subtle flex flex-col items-center justify-center gap-2">
                        <FolderPlus className="w-6 h-6 text-text-tertiary opacity-40" />
                        <p className="text-xs text-text-tertiary">{t("noChaptersHere")}</p>
                        <button
                          onClick={() => {
                            createNote({
                              title: t("chapterOneTitle"),
                              parentId: activeNote.id,
                              content: t("chapterOneContent")
                            });
                          }}
                          className="mt-1 text-[11px] font-bold text-[#07C160] hover:underline"
                        >
                          {t("addFirstChapter")}
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {canvas
                          .filter((n) => n.parentId === activeNote.id)
                          .map((child, childIdx, childArray) => {
                            const childWordCount = getWordCount(child.content || "");
                            
                            return (
                              <div
                                key={child.id}
                                onClick={() => setActiveNoteId(child.id)}
                                className="group relative bg-surface-main hover:bg-surface-main/80 hover:border-[#07C160]/40 border border-border-subtle p-3 rounded-lg cursor-pointer shadow-sm hover:shadow transition-all flex flex-col justify-between select-none"
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-mono text-[9px] font-bold text-[#07C160] bg-[#07C160]/10 px-1.5 py-0.5 rounded">
                                      {t("chapterNumPrefix")}{String(childIdx + 1).padStart(2, "0")} {t("chapterNumSuffix")}
                                    </span>
                                    <span className="text-[9px] text-text-tertiary font-semibold">
                                      {childWordCount} {t("wordUnit")}
                                    </span>
                                  </div>

                                  <h5 className="text-xs font-bold text-text-primary truncate mb-1 group-hover:text-[#07C160] transition-colors">
                                    {child.title || t("untitled")}
                                  </h5>
                                </div>

                                <div className="mt-4 pt-3 border-t border-border-subtle/45 flex items-center justify-between">
                                  <span className="text-[10px] text-text-tertiary flex items-center gap-1 group-hover:text-text-secondary transition-colors font-medium">
                                    <span>{t("expandEdit")}</span>
                                    <ChevronRight className="w-3 h-3 text-[#07C160]" />
                                  </span>

                                  {/* Reordering and Actions inside cards */}
                                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <button
                                      disabled={childIdx === 0}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const siblings = canvas.filter((n) => n.parentId === activeNote.id);
                                        const siblingA = siblings[childIdx];
                                        const siblingB = siblings[childIdx - 1];
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
                                      }}
                                      className="p-1 text-text-tertiary hover:text-text-primary disabled:opacity-30 rounded hover:bg-surface-sidebar/60 transition-colors"
                                      title={t("moveUp")}
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      disabled={childIdx === childArray.length - 1}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const siblings = canvas.filter((n) => n.parentId === activeNote.id);
                                        const siblingA = siblings[childIdx];
                                        const siblingB = siblings[childIdx + 1];
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
                                      }}
                                      className="p-1 text-text-tertiary hover:text-text-primary disabled:opacity-30 rounded hover:bg-surface-sidebar/60 transition-colors"
                                      title={t("moveDown")}
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(t("confirmDelete"))) {
                                          deleteNote(child.id);
                                        }
                                      }}
                                      className="p-1 text-text-tertiary hover:text-red-500 rounded hover:bg-surface-sidebar/60 ml-0.5 transition-colors"
                                      title={t("delete")}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeNote.parentId && (
                <div className="mb-6 flex items-center justify-between p-3.5 bg-[#07C160]/5 hover:bg-[#07C160]/10 border border-[#07C160]/15 rounded-xl transition-all cursor-pointer"
                  onClick={() => setActiveNoteId(activeNote.parentId!)}
                >
                  <div className="flex items-center gap-2 text-xs text-text-primary font-medium min-w-0">
                    <BookOpen className="w-4 h-4 text-[#07C160] shrink-0 animate-pulse" />
                    <span className="truncate">
                      {t("editingSubchapterOf")}
                      <span className="font-bold underline text-[#07C160] ml-1">
                        {t("quoteLeft", "“")}{canvas.find((n) => n.id === activeNote.parentId)?.title || t("collectionDraft")}{t("quoteRight", "”")}
                      </span>
                    </span>
                  </div>
                  <span className="text-[11px] text-[#07C160] font-bold shrink-0 flex items-center gap-0.5">
                    <span>{t("returnToCollection")}</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              )}

              {viewMode === "split" ? (
                <div className="flex-1 flex gap-8 w-full relative pb-32">
                  <div className="flex-1 min-w-0">
                    <textarea
                      className="w-full h-full min-h-[500px] bg-transparent resize-none outline-none font-mono text-[15px] leading-relaxed text-text-primary custom-scrollbar"
                      value={activeNote.content || ""}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder={t("untitled", "Type markdown here...")}
                    />
                  </div>
                  <div className="w-px bg-border-subtle shrink-0" />
                  <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar">
                    <div className="prose prose-slate dark:prose-invert max-w-none text-text-primary prose-headings:font-bold prose-headings:text-text-primary prose-a:text-[#07C160] text-lg leading-relaxed prose-pre:bg-surface-panel prose-pre:border prose-pre:border-border-subtle">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {activeNote.content || t("noContent")}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : viewMode === "preview" ? (
                <div className="prose prose-slate dark:prose-invert max-w-none text-text-primary prose-headings:font-bold prose-headings:text-text-primary prose-a:text-[#07C160] text-lg leading-relaxed prose-pre:bg-surface-panel prose-pre:border prose-pre:border-border-subtle flex-1 pb-32">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {activeNote.content || t("noContent")}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex-1 flex flex-col relative pb-32 w-full min-w-0">
                  <TiptapEditor
                    content={activeNote.content || ""}
                    onChange={handleContentChange}
                    onOpenAIPanel={() => {
                      setIsOutlineOpen(false);
                      setIsAIWritingPanelOpen(true);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

        {/* Outline Slide-in */}
        {isOutlineOpen && (
          <div
            className="flex-shrink-0 h-full relative z-10 flex"
            style={{ width: `${Math.min(panelWidth, 320)}px` }}
          >
            <div className="flex-1 h-full min-w-0 pl-1">
              <EditorOutline
                content={activeNote.content || ""}
                onClose={() => setIsOutlineOpen(false)}
              />
            </div>
          </div>
        )}

        {/* AI Writing Panel Slide-in */}
        {isAIWritingPanelOpen && (
          <div
            className="flex-shrink-0 h-full relative z-10 flex"
            style={{ width: `${panelWidth}px` }}
          >
            {/* Drag Handle */}
            <div
              className="w-1 h-full cursor-col-resize hover:bg-[#07C160] transition-colors absolute left-0 top-0 z-20 flex items-center justify-center group"
              onMouseDown={handleMouseDown}
            >
              <div className="opacity-0 group-hover:opacity-100 absolute left-1/2 -translate-x-1/2 flex items-center justify-center bg-surface-sidebar border border-border-subtle rounded text-text-tertiary shadow-sm h-8 w-4">
                <GripVertical className="w-3 h-3" />
              </div>
            </div>

            <div className="flex-1 h-full min-w-0 pl-1">
              <AIToolbar
                onInsert={handleAIInsert}
                onClose={() => setIsAIWritingPanelOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
