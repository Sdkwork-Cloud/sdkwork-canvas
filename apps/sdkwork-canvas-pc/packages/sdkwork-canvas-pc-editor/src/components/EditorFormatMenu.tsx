import React, { useState } from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  Link as LinkIcon,
  Code,
  Sparkles,
  Wand2,
  ListPlus,
  Loader2,
  MoreHorizontal,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@sdkwork/sdkwork-canvas-pc-commons/src/lib/utils";
import { useTranslation } from "react-i18next";
import { AIClient } from "@sdkwork/sdkwork-canvas-pc-core/src/api";

export function EditorFormatMenu({ editor, onOpenAIPanel }: { editor: any; onOpenAIPanel?: () => void }) {
  const { t } = useTranslation("editor");
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);

  React.useEffect(() => {
    const handleSelectionUpdate = () => setTimeout(() => setShowAIMenu(false), 0);
    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor]);

  const MenuButton = ({ onClick, isActive, icon: Icon, label }: any) => (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "p-1.5 rounded-md transition-colors flex items-center justify-center relative",
        isActive
          ? "bg-surface-main text-text-primary shadow-sm ring-1 ring-border-subtle"
          : "text-text-secondary hover:text-text-primary hover:bg-surface-sidebar-hover",
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt(t("urlLink", "URL Link"), previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleAIAction = async (action: any) => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, " ");

    setIsAILoading(true);
    try {
      const result = await AIClient.editText(text, action);
      editor.chain().focus().insertContentAt({ from, to }, result).run();
    } catch (err) {
      console.error(err);
      alert("AI Action Failed");
    } finally {
      setIsAILoading(false);
      setShowAIMenu(false);
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      // @ts-ignore
      tippyOptions={{
        duration: 100,
        placement: "top",
        animation: "shift-away",
      }}
      className={cn(
        "flex flex-col gap-1 z-50 shadow-2xl rounded-lg border border-border-subtle bg-surface-sidebar overflow-hidden",
        showAIMenu ? "w-[280px]" : "max-w-max",
      )}
    >
      {showAIMenu ? (
        <div className="p-2 flex flex-col gap-1 w-full relative">
          {isAILoading && (
            <div className="absolute inset-0 z-10 bg-surface-sidebar/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
              <div className="flex items-center gap-2 text-[#3169e1] font-medium text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </div>
            </div>
          )}
          <div className="px-2 py-1 text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">
            {t("aiActions", "AI Actions")}
          </div>
          <button
            onClick={() => handleAIAction("improve")}
            className="flex items-center gap-2 w-full p-2 text-sm text-left hover:bg-surface-main rounded-md text-text-primary"
          >
            <Wand2 className="w-4 h-4 text-[#3169e1]" /> {t("improveWriting", "Improve writing")}
          </button>
          <button
            onClick={() => handleAIAction("continue")}
            className="flex items-center gap-2 w-full p-2 text-sm text-left hover:bg-surface-main rounded-md text-text-primary"
          >
            <Wand2 className="w-4 h-4 text-[#3169e1]" /> {t("continueWriting", "Continue writing")}
          </button>
          <button
            onClick={() => handleAIAction("expand")}
            className="flex items-center gap-2 w-full p-2 text-sm text-left hover:bg-surface-main rounded-md text-text-primary"
          >
            <ListPlus className="w-4 h-4 text-[#3169e1]" /> {t("makeLonger", "Make longer")}
          </button>
          <button
            onClick={() => handleAIAction("summarize")}
            className="flex items-center gap-2 w-full p-2 text-sm text-left hover:bg-surface-main rounded-md text-text-primary"
          >
            <MoreHorizontal className="w-4 h-4 text-[#3169e1]" /> {t("summarize", "Summarize")}
          </button>
          <button
            onClick={() => handleAIAction("translate")}
            className="flex items-center gap-2 w-full p-2 text-sm text-left hover:bg-surface-main rounded-md text-text-primary"
          >
            <ArrowRightLeft className="w-4 h-4 text-[#3169e1]" /> {t("translate", "Translate")}
          </button>
          <div className="w-full h-px bg-border-subtle my-1" />
          <button
            onClick={() => onOpenAIPanel?.()}
            className="flex items-center gap-2 w-full p-2 text-sm text-left hover:bg-surface-main rounded-md text-text-primary"
          >
            <Sparkles className="w-4 h-4 text-purple-500" /> {t("openAiChat", "Open AI Chat...")}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-[2px] p-1.5">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={Bold}
            label={t("bold", "Bold")}
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={Italic}
            label={t("italic", "Italic")}
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            icon={UnderlineIcon}
            label={t("underline", "Underline")}
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={Strikethrough}
            label={t("strikethrough", "Strikethrough")}
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
            icon={Highlighter}
            label={t("highlight", "Highlight")}
          />
          <div className="w-px h-4 bg-border-subtle mx-2" />
          <MenuButton
            onClick={setLink}
            isActive={editor.isActive("link")}
            icon={LinkIcon}
            label={t("link", "Link")}
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            icon={Code}
            label={t("code", "Code")}
          />
          <div className="w-px h-4 bg-border-subtle mx-2" />
          <button
            onClick={() => setShowAIMenu(true)}
            className="px-2 py-1.5 rounded-md text-[#3169e1] font-medium text-sm flex items-center gap-1.5 hover:bg-surface-main transition-colors flex-shrink-0 whitespace-nowrap"
            title={t("askAi", "Ask AI")}
          >
            <Sparkles className="w-4 h-4" />
            {t("askAi", "Ask AI")}
          </button>
        </div>
      )}
    </BubbleMenu>
  );
}
