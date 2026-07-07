import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import CharacterCount from "@tiptap/extension-character-count";
import { Markdown } from "tiptap-markdown";
import { CustomCodeBlock } from "./CustomCodeBlock";
import { useTranslation } from "react-i18next";
import { EditorFormatMenu } from "./EditorFormatMenu";
import { EditorSlashMenu } from "./EditorSlashMenu";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  onOpenAIPanel?: () => void;
}

export function TiptapEditor({
  content,
  onChange,
  onOpenAIPanel,
}: TiptapEditorProps) {
  const { t } = useTranslation("editor");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CustomCodeBlock,
      Placeholder.configure({
        placeholder: 'Type "/" for commands',
        emptyEditorClass: "is-editor-empty",
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-[#07C160] underline decoration-[#07C160]/30 underline-offset-4 hover:decoration-[#07C160]",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class:
            "rounded-xl border border-border-subtle max-h-[500px] w-auto data-active:border-[#07C160]",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-yellow-200 dark:bg-yellow-800/50 rounded px-1",
        },
      }),
      Typography,
      CharacterCount,
      Markdown,
    ],
    content,
    onUpdate: ({ editor }) => {
      // @ts-ignore
      const markdown = editor.storage.markdown.getMarkdown();
      setTimeout(() => {
        onChange(markdown);
      }, 0);
    },
    editorProps: {
      attributes: {
        className:
          "prose prose-slate dark:prose-invert max-w-none w-full focus:outline-none text-lg leading-relaxed text-text-primary prose-p:my-2 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-text-primary prose-a:text-[#07C160] prose-img:cursor-pointer pb-64",
      },
      handleKeyDown: (view, event) => {
        // Prevent default / behavior to just type it, the floating menu automatically handles showing.
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      // @ts-ignore
      const currentMarkdown = editor.storage.markdown.getMarkdown();
      if (currentMarkdown !== content) {
        // @ts-ignore
        editor.commands.setContent(content, false);
      }
    }
  }, [content, editor]);

  return (
    <div className="w-full relative group flex-1 flex flex-col tiptap-editor-container">
      {editor && <EditorFormatMenu editor={editor} onOpenAIPanel={onOpenAIPanel} />}
      {editor && <EditorSlashMenu editor={editor} />}

      <div
        className="flex-1 flex flex-col w-full h-full cursor-text"
        onClick={() => {
          if (editor && !editor.isFocused) {
            editor.commands.focus("end");
          }
        }}
      >
        <EditorContent
          editor={editor}
          className="outline-none flex-1 flex flex-col h-full w-full"
        />
      </div>

      {/* Editor Footer / Character Count */}
      {editor && (
        <div className="mt-8 pt-4 border-t border-border-subtle flex items-center justify-end text-xs text-text-tertiary select-none opacity-50 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-4">
            <span>{editor.storage.characterCount.words()} {t("words", "words")}</span>
            <span>{editor.storage.characterCount.characters()} {t("chars", "chars")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
