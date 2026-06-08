import { useState } from "react";
import { Calendar } from "lucide-react";

const durationOptions = [
  { label: "Fin de semana", value: "weekend", emoji: "🌅", days: "2-3 días" },
  { label: "3–5 días", value: "short", emoji: "🏖️", days: "Escapada corta" },
  { label: "1 semana", value: "week", emoji: "🌴", days: "7 días" },
  { label: "Más de 1 semana", value: "long", emoji: "✈️", days: "8+ días" },
];

export function DurationSection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-2xl mb-2">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
          ¿Cuánto tiempo tienes disponible?
        </h2>
        <p className="text-lg text-muted-foreground">
          Selecciona la duración ideal para tu viaje
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {durationOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelected(option.value)}
            className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
              selected === option.value
                ? "border-accent bg-accent/5 shadow-lg"
                : "border-border bg-white hover:border-accent/30"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="text-5xl">{option.emoji}</div>
              <div className="font-semibold text-foreground text-lg">
                {option.label}
              </div>
              <div className="text-sm text-muted-foreground">{option.days}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
