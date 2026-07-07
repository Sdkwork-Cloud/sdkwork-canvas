import React, { useState } from "react";
import {
  X,
  Upload,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Send,
} from "lucide-react";
import { cn } from "@sdkwork/sdkwork-canvas-pc-commons/src/lib/utils";
import { Note } from "@sdkwork/sdkwork-canvas-pc-core/src/types";
import { useNotes } from "@sdkwork/sdkwork-canvas-pc-core/src/store";
import { useTranslation } from "react-i18next";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note;
}

export function PublishModal({ isOpen, onClose, note }: PublishModalProps) {
  const { t } = useTranslation("publish");
  const { updateNote } = useNotes();
  const [isPublishing, setIsPublishing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [digest, setDigest] = useState(note.digest || "");
  const [coverUrl, setCoverUrl] = useState(note.coverUrl || "");

  if (!isOpen) return null;

  const handlePublish = async () => {
    setIsPublishing(true);
    // Mock save to DB first
    updateNote(note.id, { digest, coverUrl });

    // Mock publish delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsPublishing(false);
    setSuccess(true);

    setTimeout(() => {
      onClose();
      // Reset state for next open if needed
      setTimeout(() => setSuccess(false), 300);
    }, 1500);
  };

  const handleUploadCover = () => {
    const url = window.prompt(
      t("enterCoverUrl", "Enter cover image URL"),
      coverUrl ||
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
    );
    if (url) {
      setCoverUrl(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-main w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="text-lg font-semibold text-text-primary">
            {t("title")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-sidebar transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-[#07C160] rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-text-primary">
                {t("success")}
              </h3>
              <p className="text-sm text-text-tertiary text-center">
                {t("successDesc")}
              </p>
            </div>
          ) : (
            <>
              {/* Cover Image Settings */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-primary">
                  {t("cover")}
                </label>
                <div
                  className={cn(
                    "w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group",
                    coverUrl
                      ? "border-transparent bg-surface-sidebar"
                      : "border-border-subtle hover:border-[#07C160] hover:bg-[#07C160]/5 bg-surface-sidebar",
                  )}
                  onClick={handleUploadCover}
                >
                  {coverUrl ? (
                    <>
                      <img
                        src={coverUrl}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium px-3 py-1.5 rounded-md bg-black/40 backdrop-blur-md">
                          {t("changeCover")}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-text-tertiary mb-2" />
                      <span className="text-sm text-text-secondary font-medium">
                        {t("clickToSetCover")}
                      </span>
                      <span className="text-xs text-text-tertiary mt-1">
                        {t("coverSizeSuggest")}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Title Info */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-primary">
                  {t("articleTitle")}
                </label>
                <input
                  type="text"
                  value={note.title}
                  disabled
                  className="w-full bg-surface-sidebar border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-secondary cursor-not-allowed"
                />
                <p className="text-xs text-text-tertiary">{t("changeTitleInEditor")}</p>
              </div>

              {/* Digest Info */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-primary">
                  {t("digest")}
                </label>
                <textarea
                  value={digest}
                  onChange={(e) => setDigest(e.target.value)}
                  placeholder={t("digestPlaceholder")}
                  className="w-full bg-surface-main border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-[#07C160]/50 focus:border-[#07C160] resize-none h-24"
                />
              </div>
            </>
          )}
        </div>

        {!success && (
          <div className="px-6 py-4 border-t border-border-subtle bg-surface-sidebar flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-text-tertiary">
              <div className="w-6 h-6 rounded bg-white shadow-sm flex items-center justify-center border border-border-subtle p-1">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/WeChat_logo.svg/1024px-WeChat_logo.svg.png"
                  alt="WeChat"
                  className="w-full h-full object-contain"
                />
              </div>
              <span>
                {t("syncTo")} <strong>{t("myAccount")}</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                disabled={isPublishing}
              >
                {t("cancel")}
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-[#07C160] hover:brightness-105 text-white rounded-lg shadow-sm transition-all disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("publishing")}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t("confirmPublish")}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
