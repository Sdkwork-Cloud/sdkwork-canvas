import React from "react";
import { BookText, Settings } from "lucide-react";
import { WechatTheme } from "@sdkwork/sdkwork-canvas-pc-core/src/types";
import { cn } from "@sdkwork/sdkwork-canvas-pc-commons/src/lib/utils";
import { useNotes } from "@sdkwork/sdkwork-canvas-pc-core/src/store";
import { useTranslation } from "react-i18next";

export function NavigationSidebar({
  onOpenSettings,
}: {
  onOpenSettings: () => void;
}) {
  const { setSidebarOpen, isSidebarOpen } = useNotes();
  const { t } = useTranslation("common");

  return (
    <div
      className={cn(
        "w-16 flex-shrink-0 flex flex-col items-center py-6 gap-8 z-20",
        WechatTheme.sidebarLeft,
      )}
    >
      {/* Profil Avatar Placeholder */}
      <div className="w-10 h-10 rounded shadow-lg flex items-center justify-center bg-[#07C160] text-white">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      </div>

      <div className="flex flex-col gap-6 text-text-tertiary">
        <NavIcon
          icon={BookText}
          label={t("canvas")}
          isActive
          onClick={() => setSidebarOpen(true)}
        />
      </div>

      <div className="mt-auto mb-4 text-text-tertiary flex flex-col gap-6">
        <NavIcon
          icon={Settings}
          label={t("settings")}
          onClick={onOpenSettings}
        />
      </div>
    </div>
  );
}

function NavIcon({
  icon: Icon,
  isActive,
  onClick,
  label,
}: {
  icon: any;
  isActive?: boolean;
  onClick?: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "p-2 rounded cursor-pointer transition-colors relative group",
        isActive
          ? "text-[#07C160]"
          : "hover:bg-surface-leftbar-hover hover:text-white",
      )}
    >
      <Icon className="w-6 h-6" strokeWidth={isActive ? 2 : 2.5} />
    </button>
  );
}
