import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Waves, TreePine, Mountain, Landmark, Music } from "lucide-react";

const categories = [
  {
    icon: Waves,
    title: "Playa",
    image: "https://images.unsplash.com/photo-1583377585350-58a76bfbdb27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwdHJhdmVsaW5nJTIwYmVhY2glMjBzdW5zZXQlMjBncm91cHxlbnwxfHx8fDE3Nzk5MTQ1MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    gradient: "from-blue-500 to-cyan-400"
  },
  {
    icon: TreePine,
    title: "Naturaleza",
    image: "https://images.unsplash.com/photo-1704610077766-7a5e0535638c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGFkdmVudHVyZSUyMGhpa2luZyUyMGZyaWVuZHN8ZW58MXx8fHwxNzc5OTE0NTI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    gradient: "from-green-500 to-emerald-400"
  },
  {
    icon: Mountain,
    title: "Aventura",
    image: "https://images.unsplash.com/photo-1582866143347-8f3efbeb44c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtb3VudGFpbiUyMGFkdmVudHVyZSUyMGhpa2luZyUyMGZyaWVuZHN8ZW58MXx8fHwxNzc5OTE0NTI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    gradient: "from-orange-500 to-red-400"
  },
  {
    icon: Landmark,
    title: "Cultura",
    image: "https://images.unsplash.com/photo-1570197820006-3e46f5ee01bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjb2xvbWJpYSUyMHRvdXJpc20lMjBjb2xvcmZ1bCUyMGN1bHR1cmV8ZW58MXx8fHwxNzc5OTE0NTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    gradient: "from-purple-500 to-pink-400"
  },
  {
    icon: Music,
    title: "Vida nocturna",
    image: "https://images.unsplash.com/photo-1545128485-c400e7702796?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGxpZmUlMjBwYXJ0eSUyMGZyaWVuZHMlMjBkYW5jaW5nfGVufDF8fHx8MTc3OTkxNDUyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    gradient: "from-violet-500 to-fuchsia-400"
  }
];

export function TravelCategories() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Explora por categoría
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encuentra el tipo de experiencia perfecta para tu grupo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl h-80 cursor-pointer"
              >
                <ImageWithFallback
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-40 group-hover:opacity-50 transition-opacity`}></div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    {category.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
