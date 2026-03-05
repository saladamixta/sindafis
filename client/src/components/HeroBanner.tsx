import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function HeroBanner() {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-primary-light to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary opacity-5 rounded-full -ml-36 -mb-36"></div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
            SINDAFIS
          </h1>
          <h2 className="text-xl md:text-2xl text-text-secondary mb-8 font-medium">
            Sindicato dos Auditores Fiscais de Campo Grande
          </h2>
          <p className="text-lg text-text-secondary mb-12 leading-relaxed">
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
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary-light font-semibold text-lg px-8 py-6 rounded-lg transition-all"
              onClick={() => handleScroll("news")}
            >
              Ver Notícias
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center animate-bounce">
            <ChevronDown className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}
