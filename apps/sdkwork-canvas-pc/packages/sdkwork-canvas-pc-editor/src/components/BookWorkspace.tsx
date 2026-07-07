import React from "react";
import { Note, BookMetadata, Chapter } from "@sdkwork/sdkwork-canvas-pc-core/src/types";
import { 
  BookDashboard 
} from "./BookDashboard";
import { 
  CharacterBible 
} from "./CharacterBible";
import { 
  StoryboardPlots 
} from "./StoryboardPlots";
import { 
  TiptapEditor 
} from "./TiptapEditor";
import { 
  Layout, 
  BookOpen, 
  Users, 
  LayoutGrid, 
  NotebookPen, 
  HelpCircle, 
  Plus, 
  ChevronRight, 
  Trash, 
  CheckCircle,
  Clock,
  Sparkles,
  ArrowLeftRight
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface BookWorkspaceProps {
  activeNote: Note;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  viewMode: "edit" | "split" | "preview";
  setViewMode: (mode: "edit" | "split" | "preview") => void;
  setIsAIWritingPanelOpen: (open: boolean) => void;
}

export function BookWorkspace({ 
  activeNote, 
  onUpdateNote,
  viewMode,
  setViewMode,
  setIsAIWritingPanelOpen
}: BookWorkspaceProps) {
  const book = activeNote.book;
  const { t } = useTranslation("common");

  if (!book || !book.isBook) {
    // If the note doesn't have BookMetadata, return an ultra-clear, gorgeous split-pane comparison screen
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-10 px-4 md:px-8 bg-surface-main max-w-5xl mx-auto h-full animate-fade-in">
        {/* Title Group */}
        <div className="text-center space-y-2.5 max-w-2xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#07C160]/10 text-[#07C160] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("multiChapterWritingSuite")}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
            {t("selectCreativeWorkflow")}
          </h2>
          <p className="text-xs md:text-sm text-text-tertiary">
            {t("bookModeDesc")}
          </p>
        </div>

        {/* Side-by-side comparative cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch mb-8">
          {/* Card left: Standard Single Note */}
          <div className="p-6 rounded-2xl bg-surface-sidebar border border-border-subtle flex flex-col justify-between relative group hover:border-text-secondary/50 transition-all">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary px-2 py-0.5 rounded bg-surface-panel border border-border-subtle">
                  {t("draft")}
                </span>
                <span className="text-xs text-[#07C160] font-medium">{t("standardDraftCurrent")}</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  {t("standardDraftTitle")}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {t("standardDraftDesc")}
                </p>
              </div>

              <div className="border-t border-border-subtle/50 my-4 pt-4 space-y-2 text-xs text-text-secondary font-sans leading-relaxed">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary"></span>
                  <span>{t("removeToStandalone")}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border-subtle/40 text-center text-xs text-text-tertiary italic">
              {t("standardDraftStatus")}
            </div>
          </div>

          {/* Card right: Advanced Structured Book Mode */}
          <div className="p-6 rounded-2xl bg-surface-sidebar border-2 border-[#07C160] shadow-md flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-[#07C160] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              ADVANCED
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#07C160] px-2 py-0.5 rounded bg-[#07C160]/10">
                  {t("bookModeTitle")}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  {t("bookModeTitle")}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {t("bookModeDesc")}
                </p>
              </div>

              {/* Major powerful features visual list */}
              <div className="border-t border-[#07C160]/20 my-4 pt-4 space-y-3.5">
                <div className="flex gap-2.5 items-start text-xs text-text-secondary">
                  <div className="p-1 rounded bg-[#07C160]/10 text-[#07C160] shrink-0">
                    <NotebookPen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-text-primary">{t("chapterLedgerFeature")}</span>
                    <p className="text-[11px] text-text-tertiary">{t("chapterLedgerDesc")}</p>
                  </div>
                </div>
                
                <div className="flex gap-2.5 items-start text-xs text-text-secondary">
                  <div className="p-1 rounded bg-[#07C160]/10 text-[#07C160] shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-text-primary">{t("characterBibleFeature")}</span>
                    <p className="text-[11px] text-text-tertiary">{t("characterBibleDesc")}</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start text-xs text-text-secondary">
                  <div className="p-1 rounded bg-[#07C160]/10 text-[#07C160] shrink-0">
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-text-primary">{t("storyboardFeature")}</span>
                    <p className="text-[11px] text-text-tertiary">{t("storyboardDesc")}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const initialBook: BookMetadata = {
                  isBook: true,
                  synopsis: "Jot down the central plot, world setting, or general outline of this book. This summary serves as a 'long-term memory' for the AI assistant, ensuring world consistency.",
                  targetWordCount: 50000,
                  genre: "Science Fiction / Steampunk",
                  penName: "Author Name",
                  activeTab: "dashboard",
                  chapters: [
                    {
                      id: "chapter-1",
                      title: "Chapter 1: The Inciting Incident",
                      content: "## Chapter 1: The Inciting Incident\n\nA new chapter unfolds here. Start your epic journey! You can use the AI assistant to refine your text, or map out characters and plots in Storyboard...",
                      status: "draft",
                      wordCount: 75,
                      createdAt: Date.now(),
                      updatedAt: Date.now()
                    }
                  ],
                  characters: [],
                  plots: [],
                  currentChapterId: "chapter-1"
                };
                onUpdateNote(activeNote.id, { book: initialBook });
              }}
              className="mt-6 w-full py-2.5 px-4 text-xs font-bold bg-[#07C160] hover:bg-[#07C160]/90 text-white rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" /> {t("convertBookAdvancedIntro")}
            </button>
          </div>
        </div>

        {/* Small tips */}
        <p className="text-[11px] text-text-tertiary text-center leading-relaxed">
          {t("backToBasicNoteTip")}
        </p>
      </div>
    );
  }

  const activeTab = book.activeTab || "dashboard";
  const chapters = book.chapters || [];
  const currentChapterId = book.currentChapterId || (chapters[0]?.id || "");
  const activeChapter = chapters.find(ch => ch.id === currentChapterId) || chapters[0];

  const handleUpdateBook = (updates: Partial<BookMetadata>) => {
    onUpdateNote(activeNote.id, {
      book: {
        ...book,
        ...updates
      }
    });
  };

  const handleSelectChapter = (chapterId: string) => {
    handleUpdateBook({
      currentChapterId: chapterId,
      activeTab: "write"
    });
  };

  const handleUpdateChapterContent = (text: string) => {
    if (!activeChapter) return;
    
    // Calculate simple word count (approximate by splits)
    const wordsNum = text.trim() ? text.trim().split(/\s+/).length : 0;
    
    const updatedChapters = chapters.map(ch => {
      if (ch.id === activeChapter.id) {
        return {
          ...ch,
          content: text,
          wordCount: wordsNum,
          updatedAt: Date.now()
        };
      }
      return ch;
    });

    handleUpdateBook({ chapters: updatedChapters });
  };

  const handleAddChapterQuick = () => {
    const nextIdx = chapters.length + 1;
    const title = `Chapter ${nextIdx}: New Chapter Draft`;
    const newCh: Chapter = {
      id: `chapter-${Date.now()}`,
      title,
      content: `## ${title}\n\nStart drafting your scene here...`,
      status: "draft",
      wordCount: 10,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    handleUpdateBook({
      chapters: [...chapters, newCh],
      currentChapterId: newCh.id
    });
  };

  const handleDeleteChapterQuick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chapter?")) {
      const remaining = chapters.filter(ch => ch.id !== id);
      const nextActive = currentChapterId === id 
        ? (remaining[0]?.id || undefined)
        : currentChapterId;
      handleUpdateBook({
        chapters: remaining,
        currentChapterId: nextActive
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Premium Tab bar inside editor workspace */}
      <div className="flex flex-wrap items-center justify-between border-b border-border-subtle px-6 bg-surface-sidebar py-2 gap-3">
        <div className="flex items-center gap-1">
          <BookOpen className="w-4 h-4 text-[#07C160]" />
          <span className="text-xs font-bold text-text-primary uppercase tracking-wide mr-4">📖 Book Workspace</span>
          
          <div className="flex items-center bg-surface-panel p-0.5 rounded-lg border border-border-subtle">
            <button
              onClick={() => handleUpdateBook({ activeTab: "dashboard" })}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === "dashboard"
                  ? "bg-[#07C160] text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => handleUpdateBook({ activeTab: "write" })}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === "write"
                  ? "bg-[#07C160] text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <NotebookPen className="w-3.5 h-3.5" />
              <span>Drafting</span>
            </button>
            <button
              onClick={() => handleUpdateBook({ activeTab: "characters" })}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === "characters"
                  ? "bg-[#07C160] text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Characters</span>
            </button>
            <button
              onClick={() => handleUpdateBook({ activeTab: "storyboard" })}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === "storyboard"
                  ? "bg-[#07C160] text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Storyboard</span>
            </button>
          </div>
        </div>

        {/* Toggle standard / book */}
        <button
          onClick={() => {
            if (confirm(t("convertBasicConfirm"))) {
              onUpdateNote(activeNote.id, { 
                book: undefined,
                content: chapters[0]?.content || activeNote.content // fall back to main contents
              });
            }
          }}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-text-tertiary hover:text-text-secondary hover:bg-surface-panel rounded-md transition-all border border-border-subtle"
          title={t("exitBookMode")}
        >
          <ArrowLeftRight className="w-3 h-3 text-[#07C160]" />
          <span>{t("exitBookMode")}</span>
        </button>
      </div>

      {/* Workspace Display Area */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar w-full h-full bg-surface-main">
        {activeTab === "dashboard" && (
          <BookDashboard
            book={book}
            coverUrl={activeNote.coverUrl}
            onUpdateBook={handleUpdateBook}
            onSelectChapter={handleSelectChapter}
          />
        )}

        {activeTab === "write" && (
          <div className="flex h-full min-h-[calc(100vh-16rem)] border border-border-subtle rounded-xl overflow-hidden bg-surface-main">
            {/* Embedded Left chapter selector */}
            <div className="w-60 border-r border-border-subtle bg-surface-sidebar shrink-0 flex flex-col h-full">
              <div className="p-3 border-b border-border-subtle flex items-center justify-between bg-surface-panel">
                <span className="text-[10px] font-bold text-text-primary uppercase tracking-wide">Chapter Ledger</span>
                <button
                  onClick={handleAddChapterQuick}
                  className="p-1 hover:bg-surface-sidebar hover:text-[#07C160] rounded text-[#07C160] transition-colors"
                  title="Add Chapter draft"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {chapters.length === 0 ? (
                  <div className="p-3 text-center text-xs text-text-tertiary italic">
                    No chapters. Click the plus icon to add one!
                  </div>
                ) : (
                  chapters.map((ch, idx) => {
                    const isCurrent = activeChapter && activeChapter.id === ch.id;
                    return (
                      <div
                        key={ch.id}
                        onClick={() => handleUpdateBook({ currentChapterId: ch.id })}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all relative group ${
                          isCurrent 
                            ? "bg-surface-panel border-l-4 border-[#07C160] shadow-sm" 
                            : "hover:bg-surface-panel/50 border-l-4 border-transparent"
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-1">
                          <div className={`text-xs font-semibold truncate ${isCurrent ? "text-text-primary" : "text-text-secondary"}`}>
                            {idx + 1}. {ch.title}
                          </div>
                          <div className="text-[10px] text-text-tertiary mt-0.5 flex items-center gap-1.5 leading-none">
                            <span className="font-mono">{ch.wordCount || 0} words</span>
                            <span>•</span>
                            <span className={ch.status === "completed" ? "text-[#07C160]" : "text-text-tertiary"}>
                              {ch.status === "completed" ? "Finished" : "Draft"}
                            </span>
                          </div>
                        </div>

                        {chapters.length > 1 && (
                          <button
                            onClick={(e) => handleDeleteChapterQuick(ch.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-sidebar text-red-500 rounded transition-opacity"
                            title="Delete chapter"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Editing arena */}
            <div className="flex-1 flex flex-col h-full bg-surface-main relative min-w-0">
              {activeChapter ? (
                <div className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar w-full h-full">
                  {/* Chapter Details strip */}
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-5 gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        className="text-lg font-bold text-text-primary bg-transparent border-none outline-none focus:ring-0 p-0 w-full"
                        value={activeChapter.title}
                        onChange={(e) => {
                          const updated = chapters.map(ch => ch.id === activeChapter.id ? { ...ch, title: e.target.value } : ch);
                          handleUpdateBook({ chapters: updated });
                        }}
                        placeholder="Chapter Title..."
                      />
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-text-tertiary">
                        <span className="bg-surface-sidebar border border-border-subtle rounded px-1.5 font-mono font-bold text-text-secondary">{activeChapter.wordCount || 0} Words</span>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                          <span>Auto-save to cloud synced</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const nextStatus: "draft" | "completed" = activeChapter.status === "completed" ? "draft" : "completed";
                          const updated = chapters.map(ch => ch.id === activeChapter.id ? { ...ch, status: nextStatus } : ch);
                          handleUpdateBook({ chapters: updated });
                        }}
                        className={`text-xs font-semibold px-2.5 py-1 rounded border transition-all ${
                          activeChapter.status === "completed"
                            ? "bg-[#07C160]/10 text-[#07C160] border-[#07C160]/30"
                            : "bg-surface-panel text-text-secondary border-border-subtle hover:text-text-primary"
                        }`}
                      >
                        {activeChapter.status === "completed" ? "✓ Finished" : "✓ Mark Finished"}
                      </button>

                      <button
                        onClick={() => setIsAIWritingPanelOpen(true)}
                        className="flex items-center gap-1 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1 rounded"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Assistant</span>
                      </button>
                    </div>
                  </div>

                  {/* Tiptap Integration */}
                  <div className="flex-1 flex flex-col relative w-full min-h-[350px]">
                    <TiptapEditor
                      content={activeChapter.content || ""}
                      onChange={handleUpdateChapterContent}
                      onOpenAIPanel={() => {
                        setIsAIWritingPanelOpen(true);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-text-tertiary">
                  <NotebookPen className="w-12 h-12 mb-2 opacity-25" />
                  <p className="text-xs">No active chapter available. Click positive icon on chapter list to add.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "characters" && (
          <CharacterBible
            book={book}
            onUpdateBook={handleUpdateBook}
          />
        )}

        {activeTab === "storyboard" && (
          <StoryboardPlots
            book={book}
            onUpdateBook={handleUpdateBook}
          />
        )}
      </div>
    </div>
  );
}
