import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Sparkles, Users } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-white via-orange-50/30 to-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Planeación colaborativa</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            Encuentra un destino que{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              todos quieran vivir
            </span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
            Organiza viajes en grupo sin discusiones. Nuestro sistema analiza las preferencias de todos y recomienda destinos que realmente funcionen para el grupo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 group"
            >
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Crear grupo
            </button>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white border-2 border-primary/20 text-foreground rounded-full text-lg hover:border-primary/40 hover:bg-orange-50/50 transition-all"
            >
              Unirse a un grupo
            </button>
          </div>

          <div className="flex items-center gap-8 pt-4">
            <div>
              <div className="text-3xl font-bold text-foreground">12K+</div>
              <div className="text-sm text-muted-foreground">Grupos activos</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div>
              <div className="text-3xl font-bold text-foreground">45K+</div>
              <div className="text-sm text-muted-foreground">Viajes organizados</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl"></div>
          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758599669493-1a88651306cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxMHx8ZnJpZW5kcyUyMHRyYXZlbGluZyUyMGJlYWNoJTIwc3Vuc2V0JTIwZ3JvdXB8ZW58MXx8fHwxNzc5OTE0NTI1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Friends celebrating at sunset"
                className="w-full h-64 object-cover rounded-3xl shadow-lg"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1599828586134-fbaff96c63d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtb3VudGFpbiUyMGFkdmVudHVyZSUyMGhpa2luZyUyMGZyaWVuZHN8ZW58MXx8fHwxNzc5OTE0NTI3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Friends hiking mountains"
                className="w-full h-48 object-cover rounded-3xl shadow-lg"
              />
            </div>
            <div className="space-y-4 pt-8">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1562960032-108a6c6c4896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmcmllbmRzJTIwdHJhdmVsaW5nJTIwYmVhY2glMjBzdW5zZXQlMjBncm91cHxlbnwxfHx8fDE3Nzk5MTQ1MjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Group on beach"
                className="w-full h-48 object-cover rounded-3xl shadow-lg"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1718119617938-2a3b376fb7d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb2xvbWJpYSUyMHRvdXJpc20lMjBjb2xvcmZ1bCUyMGN1bHR1cmV8ZW58MXx8fHwxNzc5OTE0NTI1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Colorful culture"
                className="w-full h-64 object-cover rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
