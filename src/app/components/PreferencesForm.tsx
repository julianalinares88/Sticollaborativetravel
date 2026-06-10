import { useEffect, useState } from "react";
import { Sparkles, X, Loader2, Check } from "lucide-react";
import { PreferencesSection, PREFERENCE_ITEMS } from "./preferences/PreferencesSection";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

interface PreferencesFormProps {
  onClose: () => void;
}

export function PreferencesForm({ onClose }: PreferencesFormProps) {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true); // cargando preferencias existentes
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar preferencias existentes (para editar y volver más tarde)
  useEffect(() => {
    let active = true;
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) return;
      if (error) {
        setError("No se pudieron cargar tus preferencias.");
      } else if (data) {
        const loaded: Record<string, number> = {};
        for (const item of PREFERENCE_ITEMS) {
          const v = (data as Record<string, unknown>)[item.key];
          if (typeof v === "number") loaded[item.key] = v;
        }
        setRatings(loaded);
      }
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [user]);

  const handleRate = (key: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [key]: rating }));
    setSaved(false);
  };

  const ratedCount = PREFERENCE_ITEMS.filter((i) => ratings[i.key]).length;
  const allRated = ratedCount === PREFERENCE_ITEMS.length;
  const progress = (ratedCount / PREFERENCE_ITEMS.length) * 100;

  const handleSave = async () => {
    if (!user || !allRated || saving) return;
    setSaving(true);
    setError(null);

    const row: Record<string, number | string> = { user_id: user.id };
    for (const item of PREFERENCE_ITEMS) row[item.key] = ratings[item.key];

    const { error } = await supabase
      .from("user_preferences")
      .upsert(row, { onConflict: "user_id" });

    setSaving(false);
    if (error) {
      setError("No se pudieron guardar tus preferencias. Intenta de nuevo.");
    } else {
      setSaved(true);
      setTimeout(() => onClose(), 1200);
    }
  };

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
                {ratedCount} de {PREFERENCE_ITEMS.length} calificadas
              </div>
            </div>

            <div className="w-12"></div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-8">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-3" />
                Cargando tus preferencias…
              </div>
            ) : (
              <PreferencesSection ratings={ratings} onRate={handleRate} />
            )}
          </div>

          {!loading && (
            <div className="flex flex-col gap-3 pb-8">
              {error && (
                <div className="rounded-2xl bg-destructive/10 text-destructive text-sm px-4 py-3">
                  {error}
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={!allRated || saving || saved}
                className="w-full px-8 py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Guardando…
                  </>
                ) : saved ? (
                  <>
                    <Check className="w-5 h-5" />
                    ¡Guardado!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {allRated
                      ? "Guardar preferencias"
                      : `Califica las ${PREFERENCE_ITEMS.length} (${ratedCount}/${PREFERENCE_ITEMS.length})`}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}