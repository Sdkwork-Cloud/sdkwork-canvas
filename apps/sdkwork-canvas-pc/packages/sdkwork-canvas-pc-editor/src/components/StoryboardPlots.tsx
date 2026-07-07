import React, { useState } from "react";
import { BookMetadata, PlotCard } from "@sdkwork/sdkwork-canvas-pc-core/src/types";
import { Compass, Sparkles, Plus, Trash, LayoutGrid, Palette, BookOpen, Layers, Edit } from "lucide-react";

interface StoryboardPlotsProps {
  book: BookMetadata;
  onUpdateBook: (updates: Partial<BookMetadata>) => void;
}

const PLOT_TYPES = [
  { value: "plot", label: "Plot Beat", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { value: "climax", label: "Climax", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  { value: "twist", label: "Plot Twist", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { value: "world", label: "World Facts", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" }
];

export function StoryboardPlots({ book, onUpdateBook }: StoryboardPlotsProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [isAdding, setIsAdding] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [cardContent, setCardContent] = useState("");
  const [cardType, setCardType] = useState<"plot" | "climax" | "twist" | "world">("plot");
  
  // For editing
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardTitle.trim()) return;

    const newCard: PlotCard = {
      id: `plot-${Date.now()}`,
      title: cardTitle,
      content: cardContent.trim() || "Details here...",
      type: cardType
    };

    onUpdateBook({
      plots: [...book.plots, newCard]
    });

    setCardTitle("");
    setCardContent("");
    setIsAdding(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this narrative card?")) {
      onUpdateBook({
        plots: book.plots.filter(p => p.id !== id)
      });
      if (editingCardId === id) setEditingCardId(null);
    }
  };

  const handleUpdateCardField = (id: string, field: keyof PlotCard, value: any) => {
    const updatedPlots = book.plots.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    });
    onUpdateBook({ plots: updatedPlots });
  };

  const filteredPlots = book.plots.filter(p => 
    filterType === "all" ? true : p.type === filterType
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Narrative Board Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-border-subtle pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4 text-text-secondary" />
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Storyboard Planning Deck</h2>
          </div>
          <p className="text-xs text-text-tertiary">Map out chronologies, turning points, pacing guides, and setting facts in easy-to-use boards.</p>
        </div>

        <button
          onClick={() => {
            setEditingCardId(null);
            setIsAdding(true);
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#07C160] hover:bg-[#07C160]/90 text-xs font-semibold text-white rounded-md shadow-sm transition-all whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-3.5 h-3.5" /> Core Narrative Card
        </button>
      </div>

      {/* Categories filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterType("all")}
          className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
            filterType === "all"
              ? "bg-[#07C160] text-white border-transparent"
              : "bg-surface-sidebar border-border-subtle text-text-secondary hover:text-text-primary"
          }`}
        >
          Show All ({book.plots.length})
        </button>
        {PLOT_TYPES.map(type => (
          <button
            key={type.value}
            onClick={() => setFilterType(type.value)}
            className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
              filterType === type.value
                ? "bg-text-primary text-surface-main border-transparent"
                : "bg-surface-sidebar border-border-subtle text-text-secondary hover:text-text-primary"
            }`}
          >
            {type.label} ({book.plots.filter(p => p.type === type.value).length})
          </button>
        ))}
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
        {/* Create Card Panel */}
        {isAdding && (
          <form onSubmit={handleCreate} className="p-4 bg-surface-sidebar border border-[#07C160]/50 rounded-xl space-y-4 shadow-md transition-all shrink-0">
            <div className="flex justify-between items-center border-b border-border-subtle pb-2">
              <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#07C160]" /> Create Plot beat
              </span>
              <button 
                type="button" 
                className="text-xs text-text-tertiary hover:text-text-primary"
                onClick={() => setIsAdding(false)}
              >
                Close
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-text-tertiary uppercase font-bold">Card Title</label>
              <input
                type="text"
                placeholder="e.g. Inciting action"
                className="w-full px-2.5 py-1.5 bg-surface-panel border border-border-subtle rounded text-xs text-text-primary outline-none focus:border-[#07C160]"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-text-tertiary uppercase font-bold">Pacing Core Category</label>
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value as any)}
                className="w-full bg-surface-panel border border-border-subtle text-xs rounded p-1.5 text-text-primary outline-none focus:border-[#07C160]"
              >
                <option value="plot">Plot Beat</option>
                <option value="climax">Climax Point</option>
                <option value="twist">Narrative Twist</option>
                <option value="world">World Facts / History</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-text-tertiary uppercase font-bold">Slices, Summaries & Outlines</label>
              <textarea
                placeholder="Describe pacing outline or chapter connections..."
                className="w-full h-24 px-2.5 py-1.5 bg-surface-panel border border-border-subtle rounded text-xs text-text-primary outline-none focus:border-[#07C160] resize-none"
                value={cardContent}
                onChange={(e) => setCardContent(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-1.5 bg-[#07C160] hover:bg-[#07C160]/90 text-xs font-semibold text-white rounded shadow-sm transition-colors"
            >
              Add to Storyboard
            </button>
          </form>
        )}

        {/* Existing Card Maps */}
        {filteredPlots.length === 0 && !isAdding ? (
          <div className="col-span-full text-center p-12 bg-surface-sidebar border border-dashed border-border-subtle rounded-xl text-text-tertiary text-xs">
            No storyboard canvas of this type yet. Click "Core Narrative Card" above to start planning.
          </div>
        ) : (
          filteredPlots.map(plot => {
            const plotStyle = PLOT_TYPES.find(pt => pt.value === plot.type) || PLOT_TYPES[0];
            const isEditing = editingCardId === plot.id;

            return (
              <div
                key={plot.id}
                className="group p-4 bg-surface-sidebar border border-border-subtle hover:border-text-secondary hover:shadow-md rounded-xl transition-all relative flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold border tracking-wide uppercase font-sans ${plotStyle.color}`}>
                      {plotStyle.label}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        onClick={() => setEditingCardId(isEditing ? null : plot.id)}
                        className="p-1 hover:bg-surface-panel rounded text-text-tertiary hover:text-text-primary"
                        title="Edit plot card"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(plot.id, e)}
                        className="p-1 hover:bg-surface-panel rounded text-red-500 hover:text-red-600"
                        title="Delete card"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 bg-surface-panel border border-border-subtle rounded text-xs text-text-primary font-semibold outline-none"
                        value={plot.title}
                        onChange={(e) => handleUpdateCardField(plot.id, "title", e.target.value)}
                      />
                      <select
                        className="w-full p-1 bg-surface-panel border border-border-subtle rounded text-xs text-text-primary outline-none"
                        value={plot.type}
                        onChange={(e) => handleUpdateCardField(plot.id, "type", e.target.value as any)}
                      >
                        <option value="plot">Plot Beat</option>
                        <option value="climax">Climax</option>
                        <option value="twist">Plot Twist</option>
                        <option value="world">World Facts</option>
                      </select>
                      <textarea
                        className="w-full h-24 p-2 bg-surface-panel border border-border-subtle rounded text-xs text-text-secondary outline-none resize-none"
                        value={plot.content}
                        onChange={(e) => handleUpdateCardField(plot.id, "content", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setEditingCardId(null)}
                        className="text-[10px] bg-[#07C160] text-white px-2 py-1 rounded w-full font-bold"
                      >
                        Finished Editing
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-text-primary">{plot.title}</h4>
                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-6 white-space-pre-wrap whitespace-pre-line">
                        {plot.content}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border-subtle/40 text-[9px] text-text-tertiary font-mono uppercase tracking-wider flex justify-between items-center">
                  <span>Card ID: {plot.id.split("-")[1] || "seed"}</span>
                  <span>Aesthetics: Premium</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
