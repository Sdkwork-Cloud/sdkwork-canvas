import React, { useMemo } from "react";
import { ChevronRight, List as ListIcon, X } from "lucide-react";
import { cn } from "@sdkwork/sdkwork-canvas-pc-commons/src/lib/utils";
import { useTranslation } from "react-i18next";

interface EditorOutlineProps {
  content: string;
  onClose: () => void;
}

interface OutlineItem {
  id: string;
  level: number;
  text: string;
}

export function EditorOutline({ content, onClose }: EditorOutlineProps) {
  const { t } = useTranslation("outline");

  const items = useMemo(() => {
    if (!content) return [];
    const lines = content.split("\n");
    const outlines: OutlineItem[] = [];

    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,3})\s+(.*)$/);
      if (match) {
        outlines.push({
          id: `heading-${index}`,
          level: match[1].length,
          text: match[2].trim(),
        });
      }
    });

    return outlines;
  }, [content]);

  return (
    <div className="w-full h-full bg-surface-sidebar border-l border-border-subtle flex flex-col shadow-xl">
      <div className="px-4 py-4 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-primary font-medium">
          <ListIcon className="w-4 h-4" />
          <span>{t("title")}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-main transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {items.length === 0 ? (
          <div className="text-sm text-text-tertiary text-center mt-10">
            {t("emptyState")}
            <br />
            {t("emptyStateHint")}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "py-1.5 px-2 rounded-md hover:bg-surface-main cursor-pointer transition-colors text-sm text-text-secondary hover:text-text-primary truncate",
                  item.level === 1
                    ? "font-medium text-text-primary mt-2 first:mt-0"
                    : "",
                  item.level === 2 ? "pl-4" : "",
                  item.level === 3 ? "pl-8 text-xs" : "",
                )}
                title={item.text}
              >
                {item.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
