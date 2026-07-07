import React, { useState } from "react";
import { BookMetadata, NovelCharacter } from "@sdkwork/sdkwork-canvas-pc-core/src/types";
import { Users, Plus, Trash, Sparkles, UserCheck, ShieldAlert, Sparkle, Tag, Quote, Edit, Check } from "lucide-react";

interface CharacterBibleProps {
  book: BookMetadata;
  onUpdateBook: (updates: Partial<BookMetadata>) => void;
}

const portraitOptions = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop"
];

const mockAiSuggestions = [
  {
    name: "Cyrus Locke",
    role: "Silent Assassin / Deuteragonist",
    description: "An outcast engineer from the High Citadel whose tongue was silver-plated to prevent him speaking of state designs. He communicates entirely through rhythmic mechanical finger-tapping codes.",
    traits: ["Stoic", "Cybernetic Mouth", "Genius Mechanic", "Nocturnal"]
  },
  {
    name: "Elizabeth Ross (Valkyrie)",
    role: "Revolutionary Commander",
    description: "A former brass-guards captain who defected when ordered to flood the Low Pits. She carries a double-linked pneumatic saber and leads the Cog-Rebel Vanguard with pride.",
    traits: ["Courageous", "Tactician", "Pneumatic Saber", "Defector"]
  },
  {
    name: "Tobias the Clock-Maker",
    role: "Eccentric Mentor",
    description: "An 80-year-old grandfather figure who remembers the epoch before the Grand Balance Wheel was anchored. He claims there is a mechanical turtle that carries the city core in its steel shell.",
    traits: ["Clairvoyant", "Senile Genius", "Watchmaker", "Smelling of Oil"]
  }
];

export function CharacterBible({ book, onUpdateBook }: CharacterBibleProps) {
  const [activeCharId, setActiveCharId] = useState<string | null>(book.characters[0]?.id || null);
  const [isAdding, setIsAdding] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // New character form inputs
  const [name, setName] = useState("");
  const [role, setRole] = useState("Supporting");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState(portraitOptions[0]);
  const [traitsList, setTraitsList] = useState("");

  const activeChar = book.characters.find(c => c.id === activeCharId);

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newChar: NovelCharacter = {
      id: `char-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      description: description.trim() || "No bio added yet.",
      avatar: avatar,
      traits: traitsList.split(/[,,，、\n]+/).map(t => t.trim()).filter(Boolean)
    };

    const updatedChars = [...book.characters, newChar];
    onUpdateBook({ characters: updatedChars });
    setActiveCharId(newChar.id);
    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setName("");
    setRole("Supporting");
    setDescription("");
    setAvatar(portraitOptions[Math.floor(Math.random() * portraitOptions.length)]);
    setTraitsList("");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this character study?")) {
      const updatedChars = book.characters.filter(c => c.id !== id);
      onUpdateBook({ characters: updatedChars });
      if (activeCharId === id) {
        setActiveCharId(updatedChars[0]?.id || null);
      }
    }
  };

  const handleUpdateActiveField = (field: keyof NovelCharacter, value: any) => {
    if (!activeChar) return;
    const updatedChars = book.characters.map(c => {
      if (c.id === activeChar.id) {
        return { ...c, [field]: value };
      }
      return c;
    });
    onUpdateBook({ characters: updatedChars });
  };

  // Trigger AI to help enrich character bios
  const handleAiEnrichBio = () => {
    if (!activeChar) return;
    setIsAiLoading(true);
    
    setTimeout(() => {
      // Simulate highly creative AI bio expansion
      const additions = [
        "\n\n**[AI Plot Attachment Points]**:\n- Silas finds a copper mechanical token with the character's family emblem in Sector 3.\n- Secretly harbors a fear of complete silence since the Great Steam Leak of '52.\n- Known to carry an antique magnifying monocle made of polished silver.",
        "\n\n**[AI Narrative Secrets]**:\n- Deeply regrets failing to salvage the Sector 4 secondary steam cylinder during the midwinter lockout.\n- Carries a secret blueprints blueprint for an over-driven boiler in their leather coat pocket.",
        "\n\n**[AI Dialog Hooks]**:\n- Speaks with a crisp accent, frequently using terms like 'equilibrium', 'friction', and 'mechanical fatigue'."
      ];
      
      const selectedAddition = additions[Math.floor(Math.random() * additions.length)];
      handleUpdateActiveField("description", activeChar.description + selectedAddition);
      
      // Also add a random trait
      const extraTraits = ["Meticulous", "High Pitch", "Slippery", "Paranoid", "Clockwork Eye"];
      const currentTraits = activeChar.traits || [];
      const unusedTraits = extraTraits.filter(t => !currentTraits.includes(t));
      if (unusedTraits.length > 0) {
        const randomTrait = unusedTraits[Math.floor(Math.random() * unusedTraits.length)];
        handleUpdateActiveField("traits", [...currentTraits, randomTrait]);
      }

      setIsAiLoading(false);
    }, 1200);
  };

  // Quick seed character suggestion
  const handleSeedAiCharacter = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      const chosen = mockAiSuggestions[Math.floor(Math.random() * mockAiSuggestions.length)];
      const randomAvatar = portraitOptions[Math.floor(Math.random() * portraitOptions.length)];
      
      const newChar: NovelCharacter = {
        id: `char-${Date.now()}`,
        name: chosen.name,
        role: chosen.role,
        description: chosen.description,
        avatar: randomAvatar,
        traits: chosen.traits
      };

      const updatedChars = [...book.characters, newChar];
      onUpdateBook({ characters: updatedChars });
      setActiveCharId(newChar.id);
      setIsAiLoading(false);
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh-14rem)] bg-surface-main relative animate-fade-in border border-border-subtle rounded-xl overflow-hidden mt-2">
      {/* Sidebar - Characters study index */}
      <div className="w-64 border-r border-border-subtle flex flex-col bg-surface-sidebar h-full shrink-0">
        <div className="p-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-text-secondary" />
            <span className="text-xs font-bold uppercase tracking-wider text-text-primary">Cast & Characters</span>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="p-1 hover:bg-surface-panel rounded text-[#07C160]"
            title="Add character card"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {book.characters.length === 0 ? (
            <div className="p-4 text-center text-xs text-text-tertiary">
              No character sheets yet. Create one!
            </div>
          ) : (
            book.characters.map(c => (
              <div
                key={c.id}
                onClick={() => {
                  setIsAdding(false);
                  setActiveCharId(c.id);
                }}
                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors relative group ${
                  !isAdding && activeCharId === c.id 
                    ? "bg-surface-panel border-l-4 border-[#07C160]" 
                    : "hover:bg-surface-panel/60 border-l-4 border-transparent"
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-border-subtle bg-surface-sidebar">
                  <img src={c.avatar || portraitOptions[0]} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-text-primary truncate">{c.name}</div>
                  <div className="text-[10px] text-text-tertiary truncate">{c.role}</div>
                </div>

                <button
                  onClick={(e) => handleDelete(c.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-sidebar rounded text-red-500 hover:text-red-600 transition-opacity absolute right-2"
                >
                  <Trash className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
        
        {/* Quick Seeding Banner */}
        <div className="p-3 bg-surface-panel border-t border-border-subtle text-center">
          <button
            onClick={handleSeedAiCharacter}
            disabled={isAiLoading}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-dashed border-[#07C160]/40 text-[#07C160] hover:text-white hover:bg-[#07C160] text-[11px] font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isAiLoading ? "Enrolling..." : "AI Generate Character"}
          </button>
        </div>
      </div>

      {/* Main Study Arena */}
      <div className="flex-1 flex flex-col h-full bg-surface-main p-6 overflow-y-auto custom-scrollbar">
        {isAdding ? (
          <form onSubmit={handleCreateNew} className="max-w-xl mx-auto space-y-5 w-full bg-surface-sidebar border border-border-subtle p-6 rounded-xl shadow-sm">
            <h3 className="text-base font-bold text-text-primary">Create Character Study Sheet</h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">Full Character Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-surface-panel border border-border-subtle rounded-md text-sm outline-none text-text-primary focus:border-[#07C160]"
                placeholder="e.g. Silas Vane"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Narrative Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-panel border border-border-subtle rounded-md text-sm outline-none text-text-primary focus:border-[#07C160]"
                >
                  <option value="Main Protagonist">Main Protagonist</option>
                  <option value="Main Antagonist">Main Antagonist</option>
                  <option value="Supporting Ally">Supporting Ally</option>
                  <option value="Love Interest">Love Interest</option>
                  <option value="Antihero / Mercenary">Antihero / Rogue</option>
                  <option value="Facilitator / Mentor">Mentor / Scholar</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Personality Traits (Comma Separated)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-surface-panel border border-border-subtle rounded-md text-sm outline-none text-text-primary focus:border-[#07C160]"
                  placeholder="Intellectual, Reckless, Observant"
                  value={traitsList}
                  onChange={(e) => setTraitsList(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">Avatar Portrait Card</label>
              <div className="flex flex-wrap gap-2.5">
                {portraitOptions.map(p => (
                  <div
                    key={p}
                    onClick={() => setAvatar(p)}
                    className={`w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 transition-all relative ${
                      avatar === p ? "border-[#07C160] scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={p} alt="avatar option" className="w-full h-full object-cover" />
                    {avatar === p && <Check className="w-3 h-3 absolute inset-0 m-auto text-white drop-shadow" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">Biography, Motives & Flaws</label>
              <textarea
                className="w-full h-32 px-3 py-2 bg-surface-panel border border-border-subtle rounded-md text-sm outline-none text-text-primary focus:border-[#07C160] resize-none"
                placeholder="Describe character motivations, inner vulnerabilities, key relationships..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-border-subtle text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-panel rounded-md transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#07C160] hover:bg-[#07C160]/90 text-xs font-semibold text-white rounded-md shadow-sm transition-all"
              >
                Save Sheet
              </button>
            </div>
          </form>
        ) : activeChar ? (
          <div className="space-y-6 max-w-2xl">
            {/* Header profile row */}
            <div className="flex flex-col sm:flex-row gap-5 items-center bg-surface-sidebar p-5 border border-border-subtle rounded-xl shadow-sm relative">
              <div className="w-20 h-20 rounded-full border-2 border-[#07C160]/30 overflow-hidden shadow shrink-0 bg-surface-panel">
                <img src={activeChar.avatar || portraitOptions[0]} alt={activeChar.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="space-y-1">
                  <input
                    type="text"
                    className="text-lg font-bold text-text-primary bg-transparent outline-none focus:border-b border-border-active w-full sm:w-auto p-0"
                    value={activeChar.name}
                    onChange={(e) => handleUpdateActiveField("name", e.target.value)}
                  />
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-0.5">
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-[#07C160]/10 text-[#07C160] px-2 py-0.5 rounded-full">
                      {activeChar.role}
                    </span>
                    <select
                      value={activeChar.role}
                      onChange={(e) => handleUpdateActiveField("role", e.target.value)}
                      className="bg-transparent text-[11px] text-text-tertiary font-medium outline-none border-b border-dashed border-border-subtle py-0.5 leading-none focus:border-text-secondary"
                    >
                      <option value="Main Protagonist">Main Protagonist</option>
                      <option value="Main Antagonist">Main Antagonist</option>
                      <option value="Supporting Ally">Supporting Ally</option>
                      <option value="Love Interest">Love Interest</option>
                      <option value="Antihero / Rogue">Antihero / Rogue</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-1 p-0.5">
                  {(activeChar.traits || []).length === 0 && (
                    <span className="text-xs text-text-tertiary italic">No traits tagged yet.</span>
                  )}
                  {(activeChar.traits || []).map(trait => (
                    <span 
                      key={trait} 
                      className="px-2 py-0.5 bg-surface-panel border border-border-subtle rounded text-[10px] text-text-secondary font-medium tracking-wide flex items-center gap-1.5"
                    >
                      <Tag className="w-2.5 h-2.5 text-text-tertiary" /> {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Assistant Banner */}
            <div className="border border-purple-500/20 bg-purple-500/5 p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="flex gap-2.5 items-start">
                <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-text-primary">Unlock AI Character Archetypes</p>
                  <p className="text-text-tertiary mt-0.5">Let the AI examine Silas, Lyra and Sterling’s records, and enrich this bio with secret plot hooks, motives, and dialogue traits!</p>
                </div>
              </div>
              <button
                onClick={handleAiEnrichBio}
                disabled={isAiLoading}
                className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-105 disabled:opacity-50 text-white rounded-lg text-[11px] font-bold shadow-sm shrink-0 whitespace-nowrap"
              >
                {isAiLoading ? "Processing Lore..." : "Enrich Bio via AI"}
              </button>
            </div>

            {/* Profile Bio Details */}
            <div className="space-y-2 bg-surface-sidebar/50 p-5 border border-border-subtle/60 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-text-secondary font-semibold border-b border-border-subtle pb-2 mb-2">
                <Quote className="w-4 h-4 text-text-tertiary" />
                <span>Biography, Motivations, Secrets & Psychological Hooks</span>
              </div>
              <textarea
                className="w-full bg-transparent min-h-[250px] resize-none outline-none text-sm text-text-secondary leading-relaxed p-0 border-none focus:ring-0 custom-scrollbar"
                placeholder="Explain Silas background or other cast character secrets here. Changes auto-save..."
                value={activeChar.description}
                onChange={(e) => handleUpdateActiveField("description", e.target.value)}
              />
            </div>
            
            {/* Traits editor */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary">Edit comma-separated traits list:</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 bg-surface-sidebar border border-border-subtle rounded text-xs text-text-primary outline-none focus:border-[#07C160]"
                value={(activeChar.traits || []).join(", ")}
                onChange={(e) => {
                  const arr = e.target.value.split(/[,,，、]+/).map(t => t.trim()).filter(Boolean);
                  handleUpdateActiveField("traits", arr);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-text-tertiary space-y-2 p-12">
            <Users className="w-8 h-8 opacity-25" />
            <p className="text-xs">No character sheet active. Click a character tab on the left list or create a brand new study.</p>
          </div>
        )}
      </div>
    </div>
  );
}
