import React from "react";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Languages,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@sdkwork/sdkwork-canvas-pc-core/src/theme";
import { cn } from "@sdkwork/sdkwork-canvas-pc-commons/src/lib/utils";

export function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation("settings");
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[600px] bg-surface-main text-text-primary rounded-xl shadow-2xl border border-border-subtle flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="h-14 px-6 flex items-center justify-between border-b border-border-subtle bg-surface-panel">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-text-secondary" />
            {t("settings")}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-surface-sidebar transition-colors text-text-secondary"
            title={t("close")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-8 custom-scrollbar max-h-[70vh] overflow-y-auto">
          {/* Theme Section */}
          <section>
            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-4">
              {t("theme")}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <ThemeButton
                active={theme === "light"}
                onClick={() => setTheme("light")}
                icon={Sun}
                label={t("light")}
              />
              <ThemeButton
                active={theme === "dark"}
                onClick={() => setTheme("dark")}
                icon={Moon}
                label={t("dark")}
              />
              <ThemeButton
                active={theme === "system"}
                onClick={() => setTheme("system")}
                icon={Monitor}
                label={t("system")}
              />
            </div>
          </section>

          {/* Language Section */}
          <section>
            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-4">
              {t("language")}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <LanguageButton
                active={i18n.language.startsWith("en")}
                onClick={() => i18n.changeLanguage("en")}
                label={t("english")}
              />
              <LanguageButton
                active={i18n.language.startsWith("zh")}
                onClick={() => i18n.changeLanguage("zh")}
                label={t("chinese")}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ThemeButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 p-4 rounded-lg border transition-all",
        active
          ? "border-[#07C160] bg-[#07C160]/10 text-[#07C160]"
          : "border-border-subtle bg-surface-main text-text-secondary hover:border-text-tertiary",
      )}
    >
      <Icon className="w-6 h-6" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function LanguageButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg border transition-all justify-center",
        active
          ? "border-[#07C160] bg-[#07C160]/10 text-[#07C160]"
          : "border-border-subtle bg-surface-main text-text-secondary hover:border-text-tertiary",
      )}
    >
      <Languages className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
