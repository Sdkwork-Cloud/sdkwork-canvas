import React, { useState } from "react";
import { useNotes } from "@sdkwork/sdkwork-canvas-pc-core/src/store";
import { WechatTheme } from "@sdkwork/sdkwork-canvas-pc-core/src/types";
import { cn } from "@sdkwork/sdkwork-canvas-pc-commons/src/lib/utils";
import { NavigationSidebar } from "./NavigationSidebar";
import { NotesListSidebar } from "./NotesListSidebar";
import { SettingsModal } from "./SettingsModal";
import { useTranslation } from "react-i18next";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useNotes();
  const { t } = useTranslation("common");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full font-sans text-text-primary overflow-hidden bg-surface-base select-none">
      <div className="h-10 flex-shrink-0 flex items-center justify-between px-4 bg-surface-panel border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28c941]"></div>
          <span className="ml-4 text-xs font-medium text-text-secondary tracking-tight uppercase">
            {t("appName")}
          </span>
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <span className="w-2 h-2 rounded-full bg-[#07C160]"></span>
            {t("cloudSyncActive")}
          </div>
          <div className="flex items-center gap-4 border-l border-border-subtle pl-4">
            <svg
              className="w-4 h-4 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
            <div className="w-6 h-6 rounded bg-surface-sidebar border border-border-subtle text-text-secondary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {/* Absolute Left Navbar (WeChat style) */}
        <NavigationSidebar onOpenSettings={() => setIsSettingsOpen(true)} />

        {/* Conditionally rendered Middle List Bar */}
        {isSidebarOpen && <NotesListSidebar />}

        {/* Main Feature Area */}
        <main
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-300",
            WechatTheme.main,
          )}
        >
          {children}
        </main>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
