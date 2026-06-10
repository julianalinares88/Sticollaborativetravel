import { useState, type ChangeEvent, type FormEvent } from "react";
import { X, Hash, ArrowRight, Loader2 } from "lucide-react";
import { joinGroupByCode } from "../lib/groups";

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoined: (group: { id: string; name: string; invite_code: string }) => void;
}

export function JoinGroupModal({ isOpen, onClose, onJoined }: JoinGroupModalProps) {
  const [code, setCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isJoining) return;
    setError(null);
    setIsJoining(true);
    const { data, error } = await joinGroupByCode(code);
    setIsJoining(false);
    if (error || !data) {
      setError(error ?? "No se pudo unir al grupo.");
      return;
    }
    setCode("");
    onJoined(data);
    onClose();
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-accent/20 via-secondary/20 to-primary/20 -z-10"></div>

        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center mb-4">
              <Hash className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Unirse a grupo</h2>
            <p className="text-muted-foreground">Ingresa el código que te compartieron</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-2xl bg-destructive/10 text-destructive text-sm px-4 py-3">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Código del grupo
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Hash className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="ABC123"
                  required
                  className="w-full pl-12 pr-4 py-5 bg-muted border-0 rounded-2xl focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all outline-none text-lg font-semibold tracking-widest uppercase"
                  maxLength={6}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                El código tiene 6 caracteres (letras y números)
              </p>
            </div>

            <div className="bg-gradient-to-r from-accent/10 to-secondary/10 rounded-2xl p-4 border border-accent/20">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    ¿No tienes un código?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Pídele al creador del grupo que te comparta el código de acceso
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isJoining || code.length < 6}
              className="w-full py-4 bg-gradient-to-r from-accent to-accent/90 text-white rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uniéndote...
                </>
              ) : (
                <>
                  Unirme
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              ¿Quieres crear tu propio grupo?{" "}
              <button onClick={onClose} className="text-primary hover:underline font-medium">
                Crear grupo
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}