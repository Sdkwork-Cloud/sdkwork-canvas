import React, { useState } from "react";
import { BookMetadata, Chapter } from "@sdkwork/sdkwork-canvas-pc-core/src/types";
import { 
  Trophy, 
  Target, 
  Clock, 
  Notebook, 
  Plus, 
  Trash, 
  Search, 
  Compass, 
  FileEdit, 
  Flame, 
  CheckCircle2, 
  Clock3 
} from "lucide-react";
import { format } from "date-fns";

interface BookDashboardProps {
  book: BookMetadata;
  coverUrl?: string;
  onUpdateBook: (updates: Partial<BookMetadata>) => void;
  onSelectChapter: (chapterId: string) => void;
}

export function BookDashboard({ book, coverUrl, onUpdateBook, onSelectChapter }: BookDashboardProps) {
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate stats
  const totalChapters = book.chapters.length;
  const totalWords = book.chapters.reduce((sum, ch) => sum + (ch.wordCount || 0), 0);
  const targetWords = book.targetWordCount || 50000;
  const progressPercent = Math.min(Math.round((totalWords / targetWords) * 100), 100);
  const estReadingTimeMin = Math.ceil(totalWords / 300); // 300 words per minute average reading speed

  // Completed vs Draft chapters
  const completedChaptersCount = book.chapters.filter(ch => ch.status === "completed").length;

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newChapterTitle.trim() || `Chapter ${totalChapters + 1}`;
    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      title,
      content: `## ${title}\n\nStart writing here...`,
      status: "draft",
      wordCount: 3,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedChapters = [...book.chapters, newChapter];
    onUpdateBook({
      chapters: updatedChapters,
      currentChapterId: newChapter.id,
      activeTab: "write",
    });
    setNewChapterTitle("");
  };

  const handleDeleteChapter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chapter? This cannot be undone.")) {
      const updatedChapters = book.chapters.filter(ch => ch.id !== id);
      const nextActiveId = book.currentChapterId === id
        ? (updatedChapters[0]?.id || undefined)
        : book.currentChapterId;
        
      onUpdateBook({
        chapters: updatedChapters,
        currentChapterId: nextActiveId,
      });
    }
  };

  const handleToggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedChapters = book.chapters.map(ch => {
      if (ch.id === id) {
        const nextStatus = ch.status === "completed" ? "draft" : "completed";
        return { ...ch, status: nextStatus as "draft" | "completed" };
      }
      return ch;
    });
    onUpdateBook({ chapters: updatedChapters });
  };

  const filteredChapters = book.chapters.filter(ch => 
    ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ch.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Upper Jumbotron Info */}
      <div className="flex flex-col md:flex-row gap-6 bg-surface-sidebar border border-border-subtle p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-[#07C160]/5 rounded-full blur-3xl pointer-events-none"></div>
        {coverUrl && (
          <div className="w-full md:w-32 h-44 rounded-lg overflow-hidden border border-border-subtle shadow-md shrink-0 bg-surface-panel">
            <img src={coverUrl} alt="Book Cover" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
          </div>
        )}
        
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-[#07C160]/10 text-[#07C160] rounded-full">
              {book.genre || "Creative Suite"}
            </span>
            <span className="text-xs text-text-tertiary font-mono">Pen name: <span className="text-text-secondary font-medium font-sans">{book.penName || "Unknown Author"}</span></span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Novel Workspace Console
            </h1>
            <textarea
              className="w-full text-sm text-text-secondary bg-transparent border-none focus:ring-0 resize-none outline-none p-0 custom-scrollbar max-h-24 leading-relaxed"
              placeholder="Add a detailed book summary/synopsis to help anchor the AI writer and plot engine..."
              value={book.synopsis || ""}
              onChange={(e) => onUpdateBook({ synopsis: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <div className="bg-surface-panel p-3 rounded-lg border border-border-subtle/50 text-center">
              <div className="text-[10px] text-text-tertiary uppercase font-semibold">Total Chapters</div>
              <div className="text-lg font-bold text-text-primary mt-0.5">{totalChapters}</div>
            </div>
            <div className="bg-surface-panel p-3 rounded-lg border border-border-subtle/50 text-center">
              <div className="text-[10px] text-text-tertiary uppercase font-semibold">Total Word Count</div>
              <div className="text-lg font-bold text-text-primary mt-0.5">{totalWords.toLocaleString()}</div>
            </div>
            <div className="bg-surface-panel p-3 rounded-lg border border-border-subtle/50 text-center">
              <div className="text-[10px] text-text-tertiary uppercase font-semibold">Completion %</div>
              <div className="text-lg font-bold text-[#07C160] mt-0.5">{progressPercent}%</div>
            </div>
            <div className="bg-surface-panel p-3 rounded-lg border border-border-subtle/50 text-center">
              <div className="text-[10px] text-text-tertiary uppercase font-semibold">Est. Read Time</div>
              <div className="text-lg font-bold text-text-primary mt-0.5">{estReadingTimeMin} min</div>
            </div>
          </div>
        </div>
      </div>

      {/* Novel Progress Meter / Custom Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-sidebar border border-border-subtle p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-purple-500" />
            <h3 className="text-sm font-semibold text-text-secondary">Writing Goal Target</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Goal: {targetWords.toLocaleString()} words</span>
              <span>{progressPercent}% Met</span>
            </div>
            <div className="w-full bg-border-subtle h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-500 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-border-subtle/50 pt-3">
            <span className="text-xs text-text-tertiary">Configure target:</span>
            <input 
              type="number" 
              className="w-24 bg-surface-panel text-xs text-right border border-border-subtle rounded px-2 py-1 outline-none focus:border-purple-500 text-text-primary"
              value={book.targetWordCount || ""}
              onChange={(e) => onUpdateBook({ targetWordCount: parseInt(e.target.value) || 0 })}
              placeholder="e.g. 50000"
            />
          </div>
        </div>

        <div className="bg-surface-sidebar border border-border-subtle p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-sm font-semibold text-text-secondary">Manuscript Status</h3>
          </div>
          <div className="space-y-1.5 text-xs text-text-secondary">
            <div className="flex justify-between">
              <span>Completed Chapters:</span>
              <span className="font-semibold text-[#07C160]">{completedChaptersCount} / {totalChapters}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Chapter Length:</span>
              <span className="font-semibold">{totalChapters > 0 ? Math.round(totalWords / totalChapters) : 0} words</span>
            </div>
            <div className="flex justify-between">
              <span>Pen name & authorship:</span>
              <input 
                type="text"
                className="bg-transparent text-right outline-none font-medium text-text-primary w-28 placeholder-text-tertiary border-b border-dashed border-border-subtle focus:border-text-secondary"
                value={book.penName || ""}
                onChange={(e) => onUpdateBook({ penName: e.target.value })}
                placeholder="Author"
              />
            </div>
          </div>
          <div className="mt-3 border-t border-border-subtle/50 pt-2 flex items-center justify-between text-[11px] text-text-tertiary leading-none">
            <span>Dynamic compilation logic</span>
            <span className="text-[#07C160] bg-[#07C160]/10 px-1.5 py-0.5 rounded font-mono">v1.1</span>
          </div>
        </div>

        <div className="bg-surface-sidebar border border-border-subtle p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-5 h-5 text-[#07C160]" />
            <h3 className="text-sm font-semibold text-text-secondary">Genre Classification</h3>
          </div>
          <div className="space-y-3">
            <select
              value={book.genre || ""}
              onChange={(e) => onUpdateBook({ genre: e.target.value })}
              className="w-full bg-surface-panel border border-border-subtle text-xs rounded p-2 text-text-primary outline-none focus:border-[#07C160]"
            >
              <option value="Fiction / Novel">Standard Fiction</option>
              <option value="Science Fiction / Steampunk">Science Fiction / Steampunk</option>
              <option value="Fantasy / Epoch Novel">Fantasy / High Epic</option>
              <option value="Mystery / Thriller Noir">Mystery / Noir Thriller</option>
              <option value="Article Collection / PRD Depot">Collection of Articles</option>
              <option value="Personal Journal / Blog Series">Personal Journal Series</option>
            </select>
          </div>
          <div className="mt-3 border-t border-border-subtle/50 pt-3 text-[11px] text-text-tertiary flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>AI writing contextual anchors aligned</span>
          </div>
        </div>
      </div>

      {/* Quickstart Companion Guide */}
      <div className="bg-[#07C160]/5 border border-[#07C160]/20 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[#07C160]/10 text-[#07C160]">
            <Compass className="w-4 h-4" />
          </span>
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">💡 Quickstart Guide</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-main p-3.5 rounded-lg border border-border-subtle/60 text-xs space-y-1">
            <div className="font-bold text-text-primary flex items-center gap-1.5">
              <span className="w-4 h-4 bg-[#07C160]/10 text-[#07C160] rounded-full flex items-center justify-center font-mono text-[10px]">1</span>
              <span>Drafting Mode</span>
            </div>
            <p className="text-text-tertiary leading-relaxed">
              Click <b>"Write"</b> above. Manage chapters on the left sidebar. The right side is a clean editor with AI assistance.
            </p>
          </div>
          <div className="bg-surface-main p-3.5 rounded-lg border border-border-subtle/60 text-xs space-y-1">
            <div className="font-bold text-text-primary flex items-center gap-1.5">
              <span className="w-4 h-4 bg-[#07C160]/10 text-[#07C160] rounded-full flex items-center justify-center font-mono text-[10px]">2</span>
              <span>Characters</span>
            </div>
            <p className="text-text-tertiary leading-relaxed">
              Go to the <b>"Characters"</b> tab to add cast details to guide AI generations.
            </p>
          </div>
          <div className="bg-surface-main p-3.5 rounded-lg border border-border-subtle/60 text-xs space-y-1">
            <div className="font-bold text-text-primary flex items-center gap-1.5">
              <span className="w-4 h-4 bg-[#07C160]/10 text-[#07C160] rounded-full flex items-center justify-center font-mono text-[10px]">3</span>
              <span>Storyboard</span>
            </div>
            <p className="text-text-tertiary leading-relaxed">
              Use the <b>"Storyboard"</b> to plan plots and worldbuilding over multiple cards.
            </p>
          </div>
        </div>
      </div>

      {/* Chapters Deck List */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Notebook className="w-4 h-4 text-text-secondary" />
            <span className="text-sm font-bold text-text-primary uppercase tracking-wider">Chapter List Index</span>
            <span className="text-xs bg-surface-sidebar border border-border-subtle text-text-secondary px-2 py-0.5 rounded-full font-mono">{totalChapters} total</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input 
                type="text" 
                placeholder="Search chapters..."
                className="w-full sm:w-48 bg-surface-sidebar border border-border-subtle rounded-md pl-8 pr-2.5 py-1 text-xs text-text-primary outline-none focus:border-[#07C160]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <form onSubmit={handleAddChapter} className="flex gap-2 w-full sm:w-auto">
              <input 
                type="text" 
                placeholder="New Chapter Title..."
                className="flex-1 sm:w-44 bg-surface-sidebar border border-border-subtle rounded-md p-1 px-2.5 text-xs text-text-primary outline-none focus:border-[#07C160]"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
              />
              <button 
                type="submit"
                className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-[#07C160] hover:bg-[#07C160]/90 text-white rounded-md shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>
          </div>
        </div>

        {/* List mapping */}
        {filteredChapters.length === 0 ? (
          <div className="text-center p-12 bg-surface-sidebar border border-dashed border-border-subtle rounded-xl text-text-tertiary text-sm">
            {searchQuery ? "No chapters match your filter." : "Create your first chapter to start building your book draft!"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChapters.map((ch, idx) => (
              <div 
                key={ch.id}
                onClick={() => onSelectChapter(ch.id)}
                className="group p-4 bg-surface-sidebar border border-border-subtle hover:border-border-active hover:shadow-md rounded-xl cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#07C160]/40 group-hover:bg-[#07C160] transition-colors"></div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2 pl-2">
                    <span className="text-[10px] text-text-tertiary uppercase font-mono tracking-wider">Chapter #{idx + 1}</span>
                    <button 
                      onClick={(e) => handleToggleStatus(ch.id, e)}
                      className="transition-opacity group-hover:opacity-100 focus:opacity-100"
                      title={ch.status === "completed" ? "Mark as draft" : "Mark as completed"}
                    >
                      {ch.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-[#07C160]" />
                      ) : (
                        <Clock3 className="w-4 h-4 text-text-tertiary/60 hover:text-text-primary" />
                      )}
                    </button>
                  </div>
                  <h4 className="text-sm font-semibold text-text-primary line-clamp-1 pl-2">{ch.title}</h4>
                  <p className="text-xs text-text-tertiary line-clamp-2 pl-2 leading-relaxed">
                    {ch.content.replace(/[#*`]/g, "").substring(0, 100) || "No content written yet."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border-subtle/50 flex justify-between items-center text-[10px] text-text-tertiary pl-2">
                  <span className="font-mono">{ch.wordCount || 0} words</span>
                  <div className="flex items-center gap-2">
                    <span>{format(ch.updatedAt, "MMM d, HH:mm")}</span>
                    <button 
                      onClick={(e) => handleDeleteChapter(ch.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-panel rounded text-red-500 hover:text-red-700 transition-opacity"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
