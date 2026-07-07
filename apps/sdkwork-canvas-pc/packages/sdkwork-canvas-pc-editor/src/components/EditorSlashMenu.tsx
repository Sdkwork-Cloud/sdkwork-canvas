import React from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Video,
  Paperclip,
  CheckSquare,
  List,
  ListOrdered,
  Sparkles,
} from "lucide-react";
import { cn } from "@sdkwork/sdkwork-canvas-pc-commons/src/lib/utils";
import { useTranslation } from "react-i18next";
import { AIClient } from "@sdkwork/sdkwork-canvas-pc-core/src/api";

export function EditorSlashMenu({ editor }: { editor: any }) {
  const { t } = useTranslation("editor");

  const BlockMenuItem = ({
    onClick,
    icon: Icon,
    title,
    description,
    colorClass = "group-hover:text-[#07C160]",
  }: any) => (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-surface-main text-left transition-colors group"
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 flex items-center justify-center rounded bg-surface-sidebar border border-border-subtle group-hover:border-border-active transition-colors",
          colorClass,
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-sm font-medium text-text-primary">{title}</div>
        <div className="text-xs text-text-tertiary">{description}</div>
      </div>
    </button>
  );

  const handleAIGenerateFromEmpty = async () => {
    const promptText = window.prompt(
      "What would you like the AI to write about?",
      "A short summary of note taking apps...",
    );
    if (!promptText) return;

    // Use current cursor position to insert text
    const { from } = editor.state.selection;
    editor.chain().focus().insertContent("...AI is thinking...").run();

    try {
      // Create a mock generation prompt response.
      const result = await AIClient.generateText(promptText, "article");
      const insertedTextLength = "...AI is thinking...".length;
      editor
        .chain()
        .focus()
        .deleteRange({ from, to: from + insertedTextLength })
        .insertContent(result)
        .run();
    } catch (e) {
      alert("Generate failed");
    }
  };

  const insertImage = () => {
    const url = window.prompt(t("urlLink", "URL Link"));
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertVideo = () => {
    const url = window.prompt(t("videoLink", "Enter video URL (.mp4, YouTube, etc.)"));
    if (url) {
      editor
        .chain()
        .focus()
        .insertContent(`<p><a href="${url}">${t("videoAttachment", "[Video Attachment]")} ${url}</a></p>`)
        .run();
    }
  };

  const insertFile = () => {
    const url = window.prompt(t("fileLink", "Enter file URL"));
    if (url) {
      editor
        .chain()
        .focus()
        .insertContent(`<p><a href="${url}">${t("fileAttachment", "[File Attachment]")} ${url}</a></p>`)
        .run();
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ state }) => {
        const { $from } = state.selection;
        const currentLineText = $from.parent.textContent;
        return currentLineText === "/";
      }}
      // @ts-ignore
      tippyOptions={{
        duration: 100,
        placement: "bottom-start",
        animation: "shift-away",
      }}
      className="flex flex-col gap-1 p-2 bg-surface-sidebar border border-border-subtle rounded-xl shadow-2xl min-w-[300px] max-h-[400px] overflow-y-auto custom-scrollbar z-50 transform -translate-x-4"
    >
      <div className="px-2 pb-1 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
        {t("aiAssistant", "AI Assistant")}
      </div>
      <BlockMenuItem
        onClick={() => {
          editor
            .chain()
            .focus()
            .deleteRange({
              from: editor.state.selection.from - 1,
              to: editor.state.selection.from,
            })
            .run();
          handleAIGenerateFromEmpty();
        }}
        icon={Sparkles}
        title={t("askAiToWrite", "Ask AI to write...")}
        description={t("generateWithAi", "Generate content with AI.")}
        colorClass="group-hover:text-purple-500"
      />
      <div className="w-full h-px bg-border-subtle my-1" />
      <div className="px-2 pb-1 pt-1 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
        {t("basicBlocks", "Basic blocks")}
      </div>
      <BlockMenuItem
        onClick={() => {
          editor
            .chain()
            .focus()
            .deleteRange({
              from: editor.state.selection.from - 1,
              to: editor.state.selection.from,
            })
            .setParagraph()
            .run();
        }}
        icon={Type}
        title={t("textBlock", "Text")}
        description={t("textBlockDesc", "Just start writing with plain text.")}
      />
      <BlockMenuItem
        onClick={() => {
          editor
            .chain()
            .focus()
            .deleteRange({
              from: editor.state.selection.from - 1,
              to: editor.state.selection.from,
            })
            .toggleHeading({ level: 1 })
            .run();
        }}
        icon={Heading1}
        title={t("heading1", "Heading 1")}
        description={t("heading1Desc", "Big section heading.")}
      />
      <BlockMenuItem
        onClick={() => {
          editor
            .chain()
            .focus()
            .deleteRange({
              from: editor.state.selection.from - 1,
              to: editor.state.selection.from,
            })
            .toggleHeading({ level: 2 })
            .run();
        }}
        icon={Heading2}
        title={t("heading2", "Heading 2")}
        description={t("heading2Desc", "Medium section heading.")}
      />
      <BlockMenuItem
        onClick={() => {
          editor
            .chain()
            .focus()
            .deleteRange({
              from: editor.state.selection.from - 1,
              to: editor.state.selection.from,
            })
            .toggleHeading({ level: 3 })
            .run();
        }}
        icon={Heading3}
        title={t("heading3", "Heading 3")}
        description={t("heading3Desc", "Small section heading.")}
      />
      <div className="w-full h-px bg-border-subtle my-1" />
      <div className="px-2 py-1 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
        {t("mediaAttachment", "Media & Attachments")}
      </div>
      <BlockMenuItem
        onClick={() => {
          editor
            .chain()
            .focus()
            .deleteRange({
              from: editor.state.selection.from - 1,
              to: editor.state.selection.from,
            })
            .run();
          insertImage();
        }}
        icon={ImageIcon}
        title={t("image", "Image")}
        description={t("imageDesc", "Upload or embed with a link")}
        colorClass="group-hover:text-blue-500"
      />
      <BlockMenuItem
        onClick={() => {
          editor
            .chain()
            .focus()
            .deleteRange({
              from: editor.state.selection.from - 1,
              to: editor.state.selection.from,
            })
            .run();
          insertVideo();
        }}
        icon={Video}
        title={t("video", "Video")}
        description={t("videoDesc", "Embed from YouTube, Vimeo...")}
        colorClass="group-hover:text-red-500"
      />
      <BlockMenuItem
        onClick={() => {
          editor
            .chain()
            .focus()
            .deleteRange({
              from: editor.state.selection.from - 1,
              to: editor.state.selection.from,
            })
            .run();
          insertFile();
        }}
        icon={Paperclip}
        title={t("file", "File")}
        description={t("fileDesc", "Upload PDF, DOC, ZIP...")}
        colorClass="group-hover:text-yellow-600"
      />
      <div className="w-full h-px bg-border-subtle my-1" />
      <div className="px-2 py-1 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
        {t("lists", "Lists")}
      </div>
      <BlockMenuItem
        onClick={() => {
          editor
            .chain()
            .focus()
            .deleteRange({
              from: editor.state.selection.from - 1,
              to: editor.state.selection.from,
            })
            .toggleTaskList()
            .run();
        }}
        icon={CheckSquare}
        title={t("todoList", "To-do list")}
        description={t("todoListDesc", "Track tasks with a to-do list.")}
      />
      <BlockMenuItem
        onClick={() => {
          editor
            .chain()
            .focus()
            .deleteRange({
              from: editor.state.selection.from - 1,
              to: editor.state.selection.from,
            })
            .toggleBulletList()
            .run();
        }}
        icon={List}
        title={t("bulletedList", "Bulleted list")}
        description={t("bulletedListDesc", "Create a simple bulleted list.")}
      />
      <BlockMenuItem
        onClick={() => {
          editor
            .chain()
            .focus()
            .deleteRange({
              from: editor.state.selection.from - 1,
              to: editor.state.selection.from,
            })
            .toggleOrderedList()
            .run();
        }}
        icon={ListOrdered}
        title={t("numberedList", "Numbered list")}
        description={t("numberedListDesc", "Create a list with numbering.")}
      />
    </BubbleMenu>
  );
}
