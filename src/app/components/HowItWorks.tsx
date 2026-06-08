import { Users, UserPlus, ClipboardList, MapPin } from "lucide-react";

const steps = [
  {
    icon: Users,
    title: "Crea un grupo",
    description: "Inicia creando un grupo de viaje con un nombre y destino tentativo"
  },
  {
    icon: UserPlus,
    title: "Invita a tus amigos",
    description: "Comparte el enlace del grupo con todos los que quieran viajar contigo"
  },
  {
    icon: ClipboardList,
    title: "Respondan preferencias",
    description: "Cada miembro completa un cuestionario sobre sus gustos de viaje"
  },
  {
    icon: MapPin,
    title: "Reciban recomendaciones",
    description: "Nuestro algoritmo sugiere destinos perfectos para todo el grupo"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-cyan-50/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Cómo funciona
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            En cuatro pasos simples, organiza el viaje perfecto para tu grupo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-border h-full space-y-4">
                  <div className="relative">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-cyan-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground pt-2">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
