import { useState } from "react";
import { Heart } from "lucide-react";

const preferences = [
  { emoji: "🌴", label: "Playa" },
  { emoji: "⛰️", label: "Montaña" },
  { emoji: "🌿", label: "Naturaleza" },
  { emoji: "🪂", label: "Aventura" },
  { emoji: "🧘", label: "Descanso" },
  { emoji: "🌃", label: "Vida nocturna" },
  { emoji: "🏛️", label: "Cultura" },
  { emoji: "🍲", label: "Gastronomía" },
  { emoji: "🛍️", label: "Compras" },
  { emoji: "📸", label: "Instagrammable" },
  { emoji: "☀️", label: "Clima cálido" },
  { emoji: "💸", label: "Económico" },
  { emoji: "✈️", label: "Fácil acceso" },
  { emoji: "👥", label: "Bueno para amigos" },
  { emoji: "🎓", label: "Bueno para universitarios" },
  { emoji: "💕", label: "Plan romántico" },
  { emoji: "🥾", label: "Actividad física" },
];

export function PreferencesSection() {
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const handleRating = (label: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [label]: rating }));
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl mb-2">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
          ¿Qué te emociona más?
        </h2>
        <p className="text-lg text-muted-foreground">
          Califica del 1 al 5 lo que más te gusta
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span className="flex items-center gap-2">
            <span className="text-lg">😴</span>
            Meh
          </span>
          <span className="flex items-center gap-2">
            Me encanta
            <span className="text-lg">🤩</span>
          </span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {preferences.map((pref) => (
          <div
            key={pref.label}
            className="bg-white rounded-2xl p-4 border border-border hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{pref.emoji}</span>
                <span className="font-semibold text-foreground">{pref.label}</span>
              </div>
              {ratings[pref.label] && (
                <div className="text-sm text-muted-foreground">
                  {ratings[pref.label]}/5
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRating(pref.label, rating)}
                  className={`flex-1 h-10 rounded-xl transition-all ${
                    ratings[pref.label] >= rating
                      ? "bg-gradient-to-r from-primary to-accent shadow-md transform scale-105"
                      : "bg-muted hover:bg-primary/10"
                  }`}
                >
                  <span
                    className={`text-lg ${
                      ratings[pref.label] >= rating ? "scale-125" : ""
                    } transition-transform inline-block`}
                  >
                    {ratings[pref.label] >= rating ? "⭐" : "☆"}
                  </span>
                </button>
              ))}
            </div>

            {pref.label === "Actividad física" && (
              <div className="mt-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-3 border border-green-200">
                <div className="text-xs text-muted-foreground text-center">
                  <span className="font-semibold">1 = </span>
                  No quiero caminar nada 🛋️
                  <span className="mx-2">•</span>
                  <span className="font-semibold">5 = </span>
                  Amo las actividades físicas 🏃‍♂️
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
