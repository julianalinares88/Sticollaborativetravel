import { ArrowLeft, MapPin, TrendingUp, PartyPopper } from "lucide-react";
import type { RecommendResponse } from "../lib/recommendations";
import { ChatAdvisor } from "./ChatAdvisor";

interface RecommendationViewProps {
  result: RecommendResponse;
  onBack: () => void;
}

const algoStyles: Record<string, { gradient: string; emoji: string }> = {
  cosine_average: { gradient: "from-primary to-accent", emoji: "🧭" },
  min_misery: { gradient: "from-blue-500 to-cyan-500", emoji: "🤝" },
  fair_compromise: { gradient: "from-purple-500 to-pink-500", emoji: "⚖️" },
  weighted_majority: { gradient: "from-orange-500 to-amber-500", emoji: "🗳️" },
};

export function RecommendationView({ result, onBack }: RecommendationViewProps) {
  const algos = result.algorithms ?? [];
  const destinations = algos.map((a) => a.destination);
  const allAgree =
    destinations.length > 0 && destinations.every((d) => d === destinations[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al grupo
        </button>

        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Destinos recomendados</h1>
          <p className="text-lg text-muted-foreground">
            Cada algoritmo propone el mejor destino para el grupo
          </p>
        </div>

        {allAgree && (
          <div className="mb-8 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/20 p-6 text-center">
            <PartyPopper className="w-8 h-8 mx-auto text-primary mb-2" />
            <h2 className="text-2xl font-bold text-foreground">
              ¡Todos los algoritmos coinciden!
            </h2>
            <p className="text-muted-foreground">
              El grupo está muy alineado: los cuatro apuntan a {destinations[0]}.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {algos.map((a) => {
            const style =
              algoStyles[a.algorithm_key] ?? { gradient: "from-primary to-accent", emoji: "✨" };
            return (
              <div
                key={a.algorithm_key}
                className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden"
              >
                <div className={`p-5 bg-gradient-to-r ${style.gradient} text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{style.emoji}</span>
                      <span className="font-semibold">{a.name}</span>
                    </div>
                    <div className="text-sm bg-white/20 rounded-full px-3 py-1 font-semibold">
                      {a.compatibility}%
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="text-2xl font-bold text-foreground">{a.destination}</h3>
                  </div>
                  <div className="text-sm text-muted-foreground">{a.department}</div>
                  {a.description && (
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                  )}

                  <div className="rounded-2xl bg-muted p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Por qué
                    </div>
                    <p className="text-sm text-muted-foreground">{a.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <ChatAdvisor
            destinations={Array.from(
              new Set(algos.map((a) => `${a.destination} (${a.department})`))
            )}
          />
        </div>
      </div>
    </div>
  );
}