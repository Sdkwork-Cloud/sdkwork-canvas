import React, { useRef, useEffect, useState } from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import CodeBlock from "@tiptap/extension-code-block";
import { ReactNodeViewRenderer } from "@tiptap/react";
import Editor from "@monaco-editor/react";
import { Copy, Check } from "lucide-react";

import { useTheme } from "@sdkwork/sdkwork-canvas-pc-core/src/theme";

export const MonacoCodeBlock = (props: NodeViewProps) => {
  const { node, view, getPos, updateAttributes } = props;
  const { theme } = useTheme();
  const isDark =
    theme === "dark" || document.documentElement.classList.contains("dark");
  const editorRef = useRef<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (node.textContent !== currentValue) {
        editorRef.current.setValue(node.textContent);
      }
    }
  }, [node.textContent]);

  const handleChange = (value: string | undefined) => {
    if (value === undefined) return;
    const pos = getPos();
    if (typeof pos !== "number") return;

    if (node.textContent === value) return;

    const tr = view.state.tr;
    const start = pos + 1;
    const end = pos + props.node.nodeSize - 1;
    tr.replaceWith(start, end, value ? view.state.schema.text(value) : []);
    view.dispatch(tr);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(node.textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NodeViewWrapper
      className="code-block my-6 border border-border-subtle rounded-xl overflow-hidden shadow-sm"
      contentEditable="false"
      suppressContentEditableWarning={true}
    >
      <div className="bg-surface-panel px-4 py-2 flex justify-between items-center text-xs text-text-secondary border-b border-border-subtle relative z-10">
        <select
          contentEditable={false}
          suppressContentEditableWarning={true}
          value={node.attrs.language || "javascript"}
          onChange={(event) =>
            updateAttributes({ language: event.target.value })
          }
          className="bg-transparent outline-none cursor-pointer text-text-primary px-2 py-1 hover:bg-surface-sidebar rounded transition-colors"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="json">JSON</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="cpp">C++</option>
          <option value="markdown">Markdown</option>
          <option value="sql">SQL</option>
        </select>

        <button
          onClick={copyToClipboard}
          className="p-1.5 hover:bg-surface-sidebar rounded text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#07C160]" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="h-80" contentEditable={false} suppressContentEditableWarning={true}>
        <Editor
          height="100%"
          language={node.attrs.language || "javascript"}
          theme={isDark ? "vs-dark" : "light"}
          defaultValue={node.textContent}
          onChange={handleChange}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            padding: { top: 16, bottom: 16 },
            lineHeight: 24,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
          }}
        />
      </div>
    </NodeViewWrapper>
  );
};

export const CustomCodeBlock = CodeBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(MonacoCodeBlock);
  },
});
