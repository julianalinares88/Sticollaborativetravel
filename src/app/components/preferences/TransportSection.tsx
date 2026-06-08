import { useState } from "react";
import { Plane, Car } from "lucide-react";

export function TransportSection() {
  const [planeWilling, setPlaneWilling] = useState<boolean | null>(null);
  const [roadTripOk, setRoadTripOk] = useState<boolean | null>(null);

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl mb-2">
          <Plane className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
          Hablemos de transporte
        </h2>
        <p className="text-lg text-muted-foreground">
          Esto nos ayuda a encontrar el destino perfecto
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              ¿Estás dispuesto a viajar en avión?
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPlaneWilling(true)}
              className={`p-4 rounded-xl border-2 transition-all ${
                planeWilling === true
                  ? "border-blue-500 bg-blue-100 shadow-md"
                  : "border-border bg-white hover:border-blue-300"
              }`}
            >
              <div className="text-3xl mb-2">✈️</div>
              <div className="font-semibold text-foreground">Sí, sin problema</div>
            </button>

            <button
              onClick={() => setPlaneWilling(false)}
              className={`p-4 rounded-xl border-2 transition-all ${
                planeWilling === false
                  ? "border-blue-500 bg-blue-100 shadow-md"
                  : "border-border bg-white hover:border-blue-300"
              }`}
            >
              <div className="text-3xl mb-2">🚗</div>
              <div className="font-semibold text-foreground">
                Prefiero por tierra
              </div>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              ¿Te molesta un viaje largo por carretera?
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setRoadTripOk(true)}
              className={`p-4 rounded-xl border-2 transition-all ${
                roadTripOk === true
                  ? "border-orange-500 bg-orange-100 shadow-md"
                  : "border-border bg-white hover:border-orange-300"
              }`}
            >
              <div className="text-3xl mb-2">😊</div>
              <div className="font-semibold text-foreground text-sm">
                Me encanta
              </div>
            </button>

            <button
              onClick={() => setRoadTripOk(null)}
              className={`p-4 rounded-xl border-2 transition-all ${
                roadTripOk === null
                  ? "border-orange-500 bg-orange-100 shadow-md"
                  : "border-border bg-white hover:border-orange-300"
              }`}
            >
              <div className="text-3xl mb-2">😐</div>
              <div className="font-semibold text-foreground text-sm">Es ok</div>
            </button>

            <button
              onClick={() => setRoadTripOk(false)}
              className={`p-4 rounded-xl border-2 transition-all ${
                roadTripOk === false
                  ? "border-orange-500 bg-orange-100 shadow-md"
                  : "border-border bg-white hover:border-orange-300"
              }`}
            >
              <div className="text-3xl mb-2">😫</div>
              <div className="font-semibold text-foreground text-sm">
                Prefiero no
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
