import React, { useState, useRef, useEffect } from "react";
import { AIClient } from "@sdkwork/sdkwork-canvas-pc-core/src/api";
import { AIGenerateType } from "@sdkwork/sdkwork-canvas-pc-core/src/types";
import {
  X,
  Loader2,
  Wand2,
  Type,
  FileText,
  Newspaper,
  Book,
  MessageSquare,
  Send,
  PenTool,
} from "lucide-react";
import { cn } from "@sdkwork/sdkwork-canvas-pc-commons/src/lib/utils";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";

type Tab = "write" | "chat";

export function AIToolbar({
  onInsert,
  onClose,
}: {
  onInsert: (text: string) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation("editor");
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<AIGenerateType>("article");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content: t("chatGreeting", "Hello! I can help you brainstorm, research, or review your writing. How can I assist you today?"),
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const result = await AIClient.generateText(prompt, type);
      setGeneratedText(result);
    } catch (err: any) {
      alert("Failed to generate text: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput;
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsChatLoading(true);

    try {
      // Wrap it in the generic prompt for this mock AI Client
      const result = await AIClient.generateText(userMessage, "article");
      setMessages((prev) => [...prev, { role: "assistant", content: result }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to generate response: " + err.message,
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "chat" && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  const types: { value: AIGenerateType; label: string; icon: any }[] = [
    { value: "article", label: t("article", "Article"), icon: FileText },
    { value: "news", label: t("news", "News"), icon: Newspaper },
    { value: "novel", label: t("novel", "Novel"), icon: Book },
    { value: "report", label: t("report", "Report"), icon: Type },
  ];

  return (
    <div className="w-full h-full border-l border-border-subtle bg-surface-panel flex flex-col shadow-sm transition-transform z-10 relative">
      <div className="h-14 flex items-center justify-between p-4 border-b border-border-subtle">
        <div className="flex bg-surface-sidebar p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("chat")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5",
              activeTab === "chat"
                ? "bg-surface-main text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-primary",
            )}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {t("chatMode", "Chat")}
          </button>
          <button
            onClick={() => setActiveTab("write")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5",
              activeTab === "write"
                ? "bg-surface-main text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-primary",
            )}
          >
            <PenTool className="w-3.5 h-3.5" />
            {t("writeMode", "Write")}
          </button>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-surface-sidebar rounded text-text-tertiary hover:text-text-primary"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {activeTab === "write" ? (
        <div className="p-4 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-2 mb-6">
            {types.map((tOption) => (
              <button
                key={tOption.value}
                onClick={() => setType(tOption.value)}
                className={cn(
                  "flex justify-center items-center gap-1.5 p-2 rounded border text-xs font-medium transition-colors",
                  type === tOption.value
                    ? "border-[#07C160] bg-[#07C160]/10 text-[#07C160]"
                    : "border-border-subtle bg-surface-main text-text-secondary hover:border-[#07C160] hover:text-text-primary",
                )}
              >
                <tOption.icon className="w-3.5 h-3.5" />
                {tOption.label}
              </button>
            ))}
          </div>

          <div className="relative mb-4 flex-1 flex flex-col">
            <textarea
              className="w-full h-32 p-3 text-xs rounded-lg border border-border-subtle bg-surface-main outline-none focus:border-[#07C160] resize-none text-text-primary mb-4"
              placeholder={t("askAiToWrite", "Ask AI to write...")}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full py-2.5 rounded-lg bg-[#07C160] text-white text-xs font-medium hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Wand2 className="w-3.5 h-3.5" />
              )}
              {isLoading
                ? t("generatingDraft", "Generating Draft...")
                : t("generateDraft", "Generate Draft")}
            </button>

            {generatedText && (
              <div className="mt-6 flex flex-col flex-1 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                    {t("preview", "Preview")}
                  </label>
                  <button
                    onClick={() => setGeneratedText("")}
                    className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    {t("clear", "Clear")}
                  </button>
                </div>
                <div className="flex-1 p-3 bg-surface-main border border-border-subtle rounded-lg text-xs text-text-primary overflow-y-auto custom-scrollbar mb-4 leading-relaxed whitespace-pre-wrap">
                  {generatedText}
                </div>
                <button
                  onClick={() => onInsert(generatedText)}
                  className="w-full py-2.5 rounded-lg border border-[#07C160] text-[#07C160] text-xs font-medium hover:bg-[#07C160]/5"
                >
                  {t("insertIntoDocument", "Insert into Document")}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex flex-col",
                  msg.role === "user" ? "items-end" : "items-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                    msg.role === "user"
                      ? "bg-[#07C160] text-white rounded-br-none"
                      : "bg-surface-main border border-border-subtle text-text-primary rounded-tl-none prose prose-sm dark:prose-invert prose-p:my-1",
                  )}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <Markdown>{msg.content}</Markdown>
                  )}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex flex-col items-start">
                <div className="max-w-[85%] rounded-2xl rounded-tl-none px-4 py-3 bg-surface-main border border-border-subtle text-text-primary flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 bg-surface-panel border-t border-border-subtle">
            <div className="relative flex items-center">
              <textarea
                className="w-full pl-3 pr-10 py-2.5 text-sm rounded-xl border border-border-subtle bg-surface-main outline-none focus:border-[#07C160] resize-none text-text-primary custom-scrollbar max-h-32 min-h-[44px]"
                placeholder={t("askAnything", "Ask me anything...")}
                value={chatInput}
                rows={1}
                onChange={(e) => {
                  setChatInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
              />
              <button
                onClick={handleSendChat}
                disabled={!chatInput.trim() || isChatLoading}
                className="absolute right-2 p-1.5 rounded-lg text-white bg-[#07C160] hover:brightness-105 disabled:opacity-50 disabled:bg-surface-sidebar disabled:text-text-tertiary transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[10px] text-text-tertiary text-center mt-2">
              Press Enter to send, Shift + Enter for new line
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
