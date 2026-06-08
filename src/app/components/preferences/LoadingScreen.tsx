import { Sparkles, Globe, Heart, Map } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md px-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl animate-pulse"></div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="absolute top-0 left-1/4 animate-float" style={{ animationDelay: "0s" }}>
            <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary" />
            </div>
          </div>

          <div className="absolute top-0 right-1/4 animate-float" style={{ animationDelay: "0.5s" }}>
            <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-accent" />
            </div>
          </div>

          <div className="absolute bottom-0 left-1/3 animate-float" style={{ animationDelay: "1s" }}>
            <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
              <Map className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-foreground">
            Estamos encontrando el viaje ideal para tu grupo…
          </h2>
          <p className="text-lg text-muted-foreground">
            Analizando preferencias y destinos perfectos
          </p>
        </div>

        <div className="flex items-center gap-2 justify-center">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
