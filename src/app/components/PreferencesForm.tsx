import { useState } from "react";
import { ArrowRight, ArrowLeft, Sparkles, X } from "lucide-react";
import { BudgetSection } from "./preferences/BudgetSection";
import { DurationSection } from "./preferences/DurationSection";
import { TransportSection } from "./preferences/TransportSection";
import { PreferencesSection } from "./preferences/PreferencesSection";
import { LoadingScreen } from "./preferences/LoadingScreen";

interface PreferencesFormProps {
  onClose: () => void;
}

export function PreferencesForm({ onClose }: PreferencesFormProps) {
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const totalSteps = 4;

  const handleNext = () => {
    if (step === totalSteps) {
      setIsComplete(true);
      setTimeout(() => {
        onClose();
        setStep(1);
        setIsComplete(false);
      }, 3000);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(Math.max(1, step - 1));
  };

  if (isComplete) {
    return <LoadingScreen />;
  }

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 overflow-y-auto">
      <div className="min-h-screen p-6 flex flex-col">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8 pt-4">
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white border border-border hover:bg-muted transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            <div className="flex-1 mx-6">
              <div className="h-2 bg-white/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-muted-foreground text-center mt-2">
                Paso {step} de {totalSteps}
              </div>
            </div>

            <div className="w-12"></div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-8">
            {step === 1 && <BudgetSection />}
            {step === 2 && <DurationSection />}
            {step === 3 && <TransportSection />}
            {step === 4 && <PreferencesSection />}
          </div>

          <div className="flex gap-4 pb-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-8 py-4 bg-white border border-border text-foreground rounded-2xl hover:bg-muted transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Anterior
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
            >
              {step === totalSteps ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  Finalizar
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
