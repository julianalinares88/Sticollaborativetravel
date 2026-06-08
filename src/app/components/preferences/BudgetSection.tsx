import { useState } from "react";
import { DollarSign } from "lucide-react";

const budgetOptions = [
  {
    label: "Menos de $500.000",
    value: "low",
    emoji: "💰",
    color: "from-green-500 to-emerald-400",
  },
  {
    label: "$500.000 – $1.000.000",
    value: "medium",
    emoji: "💵",
    color: "from-blue-500 to-cyan-400",
  },
  {
    label: "$1.000.000 – $2.000.000",
    value: "high",
    emoji: "💸",
    color: "from-purple-500 to-pink-400",
  },
  {
    label: "Más de $2.000.000",
    value: "premium",
    emoji: "💎",
    color: "from-orange-500 to-red-400",
  },
];

export function BudgetSection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-2">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
          ¿Cuál es tu presupuesto aproximado?
        </h2>
        <p className="text-lg text-muted-foreground">
          Por persona, para todo el viaje
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {budgetOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelected(option.value)}
            className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
              selected === option.value
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border bg-white hover:border-primary/30"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`text-5xl`}>{option.emoji}</div>
              <div className="font-semibold text-foreground">{option.label}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
