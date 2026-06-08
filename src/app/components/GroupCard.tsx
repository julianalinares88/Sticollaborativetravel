import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Users, ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";

interface GroupCardProps {
  emoji: string;
  name: string;
  coverImage: string;
  totalMembers: number;
  respondedMembers: number;
  status: "pending" | "waiting" | "ready";
  onCompletePreferences?: () => void;
}

const statusConfig = {
  pending: {
    label: "Pendiente responder",
    color: "bg-secondary/20 text-secondary-foreground border-secondary/30",
    icon: Clock,
    buttonText: "Completar preferencias",
    buttonStyle: "bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-lg",
  },
  waiting: {
    label: "Esperando integrantes",
    color: "bg-accent/20 text-accent-foreground border-accent/50",
    icon: Users,
    buttonText: "Ver grupo",
    buttonStyle: "bg-white border-2 border-border text-foreground hover:bg-muted",
  },
  ready: {
    label: "Resultados disponibles",
    color: "bg-green-100 text-green-700 border-green-300",
    icon: Sparkles,
    buttonText: "Ver resultados",
    buttonStyle: "bg-gradient-to-r from-accent to-accent/90 text-white hover:shadow-lg",
  },
};

export function GroupCard({
  emoji,
  name,
  coverImage,
  totalMembers,
  respondedMembers,
  status,
  onCompletePreferences,
}: GroupCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const progress = (respondedMembers / totalMembers) * 100;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        <div className="absolute top-4 right-4">
          <div className={`px-4 py-2 rounded-full border backdrop-blur-sm ${config.color}`}>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Icon className="w-4 h-4" />
              {config.label}
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{emoji}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Users className="w-4 h-4" />
                <span>{totalMembers} integrantes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso del grupo</span>
            <span className="font-semibold text-foreground">
              {respondedMembers} de {totalMembers} respondieron
            </span>
          </div>

          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {progress === 100 && (
            <div className="flex items-center gap-2 text-green-600 text-sm pt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Todos han respondido</span>
            </div>
          )}
        </div>

        <button
          onClick={status === "pending" ? onCompletePreferences : undefined}
          className={`w-full py-3 rounded-2xl transition-all flex items-center justify-center gap-2 group/btn ${config.buttonStyle}`}
        >
          {config.buttonText}
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
