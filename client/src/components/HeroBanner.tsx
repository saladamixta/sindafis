import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

// Usando uma imagem de skyline urbano como placeholder
const HERO_IMAGE = "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=600&fit=crop";

export default function HeroBanner() {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
      }}
    >
      {/* Overlay escuro para melhor legibilidade */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            SINDAFIS – Sindicato dos
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Auditores Fiscais de Campo Grande
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-12 leading-relaxed font-medium">
            Representando e fortalecendo os auditores fiscais do município
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-dark text-white font-semibold text-lg px-8 py-6 rounded-lg transition-all hover:shadow-lg"
              onClick={() => handleScroll("membership")}
            >
              Filie-se
            </Button>
            <Button
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-semibold text-lg px-8 py-6 rounded-lg transition-all"
              onClick={() => handleScroll("news")}
            >
              Ver Notícias
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center animate-bounce">
            <ChevronDown className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </section>
  );
}
