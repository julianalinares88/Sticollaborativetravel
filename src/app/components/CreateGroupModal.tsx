import { useState } from "react";
import { X, Users, Sparkles, ArrowRight } from "lucide-react";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (groupName: string, groupCode: string, groupEmoji: string) => void;
}

export function CreateGroupModal({ isOpen, onClose, onGroupCreated }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `TRAVEL-${Math.floor(Math.random() * 900) + 100}`;

    const emojiMap: Record<string, string> = {
      beach: "🌴",
      nature: "🌿",
      adventure: "⛰️",
      culture: "🏛️",
      nightlife: "🎉",
      mixed: "✨",
    };

    const emoji = emojiMap[groupType] || "✈️";

    onGroupCreated(groupName, code, emoji);
    setGroupName("");
    setGroupType("");
  };

  const handleClose = () => {
    setGroupName("");
    setGroupType("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 -z-10"></div>

        <div className="relative p-8">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Crear grupo
            </h2>
            <p className="text-muted-foreground">
              Organiza tu próxima aventura con amigos
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Nombre del grupo
              </label>
              <input
                type="text"
                placeholder="Ej: Viaje Cartagena 2026"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                className="w-full px-4 py-4 bg-muted border-0 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Cantidad aproximada de integrantes
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Users className="w-5 h-5" />
                </div>
                <input
                  type="number"
                  placeholder="4"
                  min="2"
                  max="50"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-muted border-0 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Tipo de viaje{" "}
                <span className="text-muted-foreground font-normal">(opcional)</span>
              </label>
              <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
                className="w-full px-4 py-4 bg-muted border-0 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="">Selecciona un tipo</option>
                <option value="beach">🌴 Playa</option>
                <option value="nature">🌿 Naturaleza</option>
                <option value="adventure">⛰️ Aventura</option>
                <option value="culture">🏛️ Cultura</option>
                <option value="nightlife">🎉 Vida nocturna</option>
                <option value="mixed">✨ Mixto</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-8"
            >
              Crear grupo
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
