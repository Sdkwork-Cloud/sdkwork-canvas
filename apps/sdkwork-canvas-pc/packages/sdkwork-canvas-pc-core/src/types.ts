export interface Chapter {
  id: string;
  title: string;
  content: string;
  status: "draft" | "completed";
  wordCount: number;
  synopsis?: string;
  createdAt: number;
  updatedAt: number;
}

export interface NovelCharacter {
  id: string;
  name: string;
  role: string; // "protagonist" | "antagonist" | "supporting" | "other"
  avatar?: string;
  description: string;
  traits: string[];
}

export interface PlotCard {
  id: string;
  title: string;
  content: string;
  type: "plot" | "climax" | "twist" | "world";
  chapterId?: string;
}

export interface BookMetadata {
  isBook: boolean;
  synopsis: string;
  targetWordCount: number;
  genre: string;
  penName: string;
  chapters: Chapter[];
  characters: NovelCharacter[];
  plots: PlotCard[];
  currentChapterId?: string;
  activeTab?: "dashboard" | "write" | "characters" | "storyboard";
}

export interface Note {
  id: string;
  title: string;
  content: string; // Markdown format
  createdAt: number;
  updatedAt: number;
  tags?: string[];
  coverUrl?: string;
  digest?: string;
  book?: BookMetadata;
  isCollection?: boolean;
  parentId?: string;
}

export type AIActionType = "summarize" | "improve" | "expand" | "translate" | "continue";
export type AIGenerateType = "article" | "news" | "novel" | "report";

export const WechatTheme = {
  sidebarLeft: "bg-surface-leftbar",
  sidebarLeftHover: "hover:bg-surface-leftbar-hover",
  sidebarMid: "bg-surface-sidebar",
  sidebarMidHover: "hover:bg-surface-sidebar-hover",
  sidebarMidActive: "bg-surface-main border-l-4 border-border-active",
  main: "bg-surface-main",
  primary: "bg-[#07C160] hover:brightness-105 text-white",
  textMain: "text-text-primary",
  textMuted: "text-text-tertiary",
  border: "border-border-subtle",
};
