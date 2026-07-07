import React, { useState } from "react";
import {
  X,
  Plus,
  BookOpen,
  FolderLock,
  Compass,
  FileSignature,
  FileText,
  Sparkles,
  GraduationCap,
  ClipboardList,
  Utensils,
  TrendingUp,
  Check
} from "lucide-react";
import { cn } from "@sdkwork/sdkwork-canvas-pc-commons/src/lib/utils";
import { useNotes } from "@sdkwork/sdkwork-canvas-pc-core/src/store";
import { useTranslation } from "react-i18next";

interface TemplateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PresetTemplate {
  key: string;
  icon: React.ComponentType<any>;
  color: string;
  bgLight: string;
}

export function TemplateCategoryModal({ isOpen, onClose }: TemplateCategoryModalProps) {
  const { createNote, setActiveNoteId } = useNotes();
  const [selectedTemplateKey, setSelectedTemplateKey] = useState("prd");
  const [customTitle, setCustomTitle] = useState("");
  const [prebuildChapters, setPrebuildChapters] = useState(true);
  const { t } = useTranslation("templates");
  const { t: tCommon } = useTranslation("common");

  if (!isOpen) return null;

  const templates: PresetTemplate[] = [
    {
      key: "prd",
      icon: FileText,
      color: "#07C160",
      bgLight: "rgba(7, 193, 96, 0.08)"
    },
    {
      key: "story",
      icon: BookOpen,
      color: "#10B981",
      bgLight: "rgba(16, 185, 129, 0.08)"
    },
    {
      key: "thesis",
      icon: GraduationCap,
      color: "#3B82F6",
      bgLight: "rgba(59, 130, 246, 0.08)"
    },
    {
      key: "wiki",
      icon: FolderLock,
      color: "#2563EB",
      bgLight: "rgba(37, 99, 235, 0.08)"
    },
    {
      key: "weekly",
      icon: ClipboardList,
      color: "#F59E0B",
      bgLight: "rgba(245, 158, 11, 0.08)"
    },
    {
      key: "health",
      icon: TrendingUp,
      color: "#EC4899",
      bgLight: "rgba(236, 72, 153, 0.08)"
    },
    {
      key: "recipe",
      icon: Utensils,
      color: "#EF4444",
      bgLight: "rgba(239, 68, 68, 0.08)"
    },
    {
      key: "empty",
      icon: FileSignature,
      color: "#6B7280",
      bgLight: "rgba(107, 114, 128, 0.08)"
    }
  ];

  const currentTemplateObj = templates.find((t) => t.key === selectedTemplateKey) || templates[0];
  const currentTemplateData = t(`presets.${currentTemplateObj.key}`, { returnObjects: true }) as any;

  const handleCreate = async () => {
    const finalTitle = (customTitle || currentTemplateData.defaultTitle).trim();

    // 1. Create the parent Collection
    const parentNote = await createNote({
      title: finalTitle,
      isCollection: true,
      content: currentTemplateData.outlineContent,
    });

    if (parentNote) {
      // 2. Prebuild child chapters if user requested
      if (prebuildChapters && currentTemplateData.subChapters?.length > 0) {
        for (const chapter of currentTemplateData.subChapters) {
          await createNote({
            title: chapter.title,
            parentId: parentNote.id,
            content: chapter.content,
          });
        }
      }

      // 3. Make parent active so the workspace is beautifully entered
      setActiveNoteId(parentNote.id);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-[#000]/40 inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card - Compact design with balanced spacings */}
      <div className="relative w-full max-w-lg bg-surface-main text-text-primary rounded-2xl shadow-xl border border-border-subtle/80 flex flex-col overflow-hidden animate-in fade-in scale-in-95 duration-200">
        
        {/* Header */}
        <div className="h-14 px-5 border-b border-border-subtle/40 flex items-center justify-between bg-surface-panel/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#07C160]" />
            <h3 className="text-xs font-bold text-text-primary tracking-tight">
              {t("templateTitle")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-sidebar-hover transition-colors text-text-tertiary hover:text-text-primary cursor-pointer"
            title={tCommon("cancel")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          {/* Custom title input */}
          <div>
            <label className="block text-[10px] text-text-tertiary font-bold tracking-wider mb-1.5 uppercase">
              {t("templateFolderBookTitleLabel")}
            </label>
            <input
              type="text"
              className="w-full bg-surface-panel border border-border-subtle/80 text-xs rounded-xl py-2 px-3.5 outline-none text-text-primary placeholder-text-tertiary focus:border-[#07C160] focus:ring-1 focus:ring-[#07C160]/10 transition-all font-semibold"
              placeholder={currentTemplateData.defaultTitle}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
            />
          </div>

          {/* Quick Archetype Pills */}
          <div>
            <label className="block text-[10px] text-text-tertiary font-bold tracking-wider mb-1.5 uppercase">
              {t("selectCreativeArchetypeLabel")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((tpl) => {
                const Icon = tpl.icon;
                const isSelected = selectedTemplateKey === tpl.key;
                const tplData = t(`presets.${tpl.key}`, { returnObjects: true }) as any;

                return (
                  <button
                    key={tpl.key}
                    type="button"
                    onClick={() => {
                      setSelectedTemplateKey(tpl.key);
                      setCustomTitle("");
                    }}
                    className={cn(
                      "flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all relative select-none cursor-pointer",
                      isSelected
                        ? "border-[#07C160]/40 shadow-sm"
                        : "border-border-subtle/50 hover:bg-surface-sidebar-hover"
                    )}
                    style={{
                      backgroundColor: isSelected ? tpl.bgLight : undefined,
                    }}
                  >
                    <div
                      className={cn(
                        "p-1.5 rounded-lg text-xs shrink-0",
                        isSelected ? "text-white" : "text-text-secondary bg-surface-sidebar/70"
                      )}
                      style={{
                        backgroundColor: isSelected ? tpl.color : undefined,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-text-primary truncate">
                        {tplData.name}
                      </div>
                      <div className="text-[9px] text-text-tertiary truncate max-w-[120px]">
                        {tplData.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prebuild Toggle Switch */}
          <div className="border border-border-subtle/40 rounded-xl p-3 bg-surface-panel/10 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-text-primary">
                {t("automaticChaptersPrebuild")}
              </span>
              <p className="text-[10px] text-text-tertiary mt-0.5 max-w-[280px] leading-tight">
                {t("templatePrebuildDesc", { count: currentTemplateData.subChapters?.length || 0 })}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPrebuildChapters(!prebuildChapters)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out outline-none",
                prebuildChapters ? "bg-[#07C160]" : "bg-neutral-300 dark:bg-neutral-600"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-150 ease-in-out",
                  prebuildChapters ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {/* Submit Action */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-border-subtle text-xs font-semibold text-text-secondary rounded-xl hover:bg-surface-sidebar-hover transition-colors cursor-pointer"
            >
              {tCommon("cancel")}
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="flex-1 py-2 bg-[#07C160] hover:bg-[#07C160]/95 text-white text-xs font-bold rounded-xl shadow-sm hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 font-bold" />
              <span>{t("generateCollectionButton")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
