import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PanelLeftOpen,
  Save,
  Sparkles,
  BookOpen,
  Edit3,
  FileText,
  Layout,
  Eye,
  Send,
  List as ListIcon,
  Download,
} from "lucide-react";
import { cn } from "@sdkwork/sdkwork-canvas-pc-commons/src/lib/utils";
import { useNotes } from "@sdkwork/sdkwork-canvas-pc-core/src/store";
import { PublishModal } from "./PublishModal";

export function EditorHeader({
  title,
  viewMode,
  setViewMode,
  isAIWritingPanelOpen,
  setIsAIWritingPanelOpen,
  isOutlineOpen,
  setIsOutlineOpen,
}: {
  title: string;
  viewMode: "edit" | "split" | "preview";
  setViewMode: (v: "edit" | "split" | "preview") => void;
  isAIWritingPanelOpen: boolean;
  setIsAIWritingPanelOpen: (v: boolean) => void;
  isOutlineOpen: boolean;
  setIsOutlineOpen: (v: boolean) => void;
}) {
  const { t } = useTranslation("editor");
  const { t: tCommon } = useTranslation("common");
  const { isSidebarOpen, setSidebarOpen, canvas, activeNoteId, updateNote, setActiveNoteId } = useNotes();
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const activeNote = canvas.find((n) => n.id === activeNoteId);

  const handleExportMarkdown = () => {
    if (!activeNote) return;
    const currentTitle = activeNote.title || tCommon("untitledNote");
    const content = activeNote.content || "";
    
    let markdownText = "";
    if (content.trim().startsWith("# ")) {
      markdownText = content;
    } else {
      markdownText = `# ${currentTitle}\n\n${content}`;
    }
    
    const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    const safeFilename = (activeNote.title || "untitled").replace(/[\\/:*?"<>|]/g, "_") + ".md";
    link.setAttribute("download", safeFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-14 flex-shrink-0 border-b border-border-subtle flex items-center justify-between px-6 bg-surface-main z-10 w-full overflow-hidden">
      {/* Left Area - Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {!isSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 rounded hover:bg-surface-sidebar-hover text-text-tertiary transition-colors shrink-0"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-1.5 text-xs text-text-tertiary hidden sm:flex min-w-0">
          <FileText className="w-3.5 h-3.5 shrink-0" />
          {activeNote?.parentId ? (
            <button
              onClick={() => setActiveNoteId(activeNote.parentId!)}
              className="hover:text-[#07C160] hover:underline cursor-pointer transition-all shrink-0 font-semibold"
            >
              {canvas.find((n) => n.id === activeNote.parentId)?.title || t("collectionDraft", "Collection")}
            </button>
          ) : activeNote?.isCollection ? (
            <span className="shrink-0 font-semibold text-[#07C160]">{t("collectionDraft", "Collection Outline")}</span>
          ) : (
            <span className="shrink-0">{t("prd", "PRD")}</span>
          )}
          <span className="shrink-0 mx-1">/</span>
          <span className="text-sm font-medium text-text-primary truncate max-w-[120px] md:max-w-[200px]">
            {title || tCommon("untitledNote")}
          </span>
        </div>
      </div>

      {/* Center Area - View Modes Segmented Control */}
      <div className="hidden md:flex justify-center px-4 shrink-0">
        <div className="flex items-center p-1 bg-surface-sidebar rounded-lg">
          <button
            onClick={() => setViewMode("edit")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-shadow whitespace-nowrap",
              viewMode === "edit"
                ? "bg-surface-main text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {t("edit")}
          </button>
          <button
            onClick={() => setViewMode("split")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-shadow whitespace-nowrap",
              viewMode === "split"
                ? "bg-surface-main text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary",
            )}
            title={t("splitView")}
          >
            <Layout className="w-3.5 h-3.5" />
            {t("split")}
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-shadow whitespace-nowrap",
              viewMode === "preview"
                ? "bg-surface-main text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            {t("preview")}
          </button>
        </div>
      </div>

      {/* Right Area - Actions */}
      <div className="flex items-center justify-end gap-2.5 min-w-0 flex-1">
        <button
          onClick={() => {
            setIsOutlineOpen(!isOutlineOpen);
            if (isAIWritingPanelOpen) setIsAIWritingPanelOpen(false);
          }}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0",
            isOutlineOpen
              ? "text-text-primary"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          <ListIcon className="w-4 h-4" />
          <span>{t("outlineView")}</span>
        </button>

        <button
          onClick={() => {
            setIsAIWritingPanelOpen(!isAIWritingPanelOpen);
            if (isOutlineOpen) setIsOutlineOpen(false);
          }}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium transition-colors mr-1 whitespace-nowrap shrink-0",
            isAIWritingPanelOpen
              ? "text-[#3169e1]"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t("aiAssistant")}</span>
        </button>



        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#07C160] hover:bg-[#07C160]/10 rounded-md transition-colors border border-[#07C160]/30 whitespace-nowrap shrink-0"
        >
          <Send className="w-3 h-3" />
          <span>{t("publish")}</span>
        </button>

        <button
          onClick={handleExportMarkdown}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-sidebar-hover rounded-md transition-colors border border-border-subtle whitespace-nowrap shrink-0"
          title={t("exportMarkdown", "Export Markdown")}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden lg:inline whitespace-nowrap">{t("exportMarkdown", "Export Markdown")}</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#3169e1] text-white rounded-md shadow-sm hover:brightness-105 transition-colors whitespace-nowrap shrink-0">
          <Save className="w-3.5 h-3.5" />
          <span>{tCommon("save")}</span>
        </button>
      </div>

      {activeNote && (
        <PublishModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          note={activeNote}
        />
      )}
    </header>
  );
}
