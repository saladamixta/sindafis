import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

// Mock data - will be replaced with real data from API
const mockPartnerships = [
  {
    id: 1,
    name: "Banco XYZ",
    logo: "https://via.placeholder.com/200x100?text=Banco+XYZ",
    category: "Financeiro",
    website: "https://banco.com.br",
  },
  {
    id: 2,
    name: "Seguros ABC",
    logo: "https://via.placeholder.com/200x100?text=Seguros+ABC",
    category: "Seguros",
    website: "https://seguros.com.br",
  },
  {
    id: 3,
    name: "Educação Plus",
    logo: "https://via.placeholder.com/200x100?text=Educacao+Plus",
    category: "Educação",
    website: "https://educacao.com.br",
  },
  {
    id: 4,
    name: "Saúde Total",
    logo: "https://via.placeholder.com/200x100?text=Saude+Total",
    category: "Saúde",
    website: "https://saude.com.br",
  },
  {
    id: 5,
    name: "Viagens Mundo",
    logo: "https://via.placeholder.com/200x100?text=Viagens+Mundo",
    category: "Turismo",
    website: "https://viagens.com.br",
  },
  {
    id: 6,
    name: "Tech Solutions",
    logo: "https://via.placeholder.com/200x100?text=Tech+Solutions",
    category: "Tecnologia",
    website: "https://tech.com.br",
  },
];

export default function PartnershipsSection() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("partnerships-carousel");
    if (container) {
      const scrollAmount = 300;
      const newPosition =
        direction === "left"
          ? scrollPosition - scrollAmount
          : scrollPosition + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-bg">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Convênios e Parceiros
        </h2>
        <p className="text-text-secondary text-lg mb-12">
          Conheça nossos parceiros e aproveite benefícios exclusivos para filiados
        </p>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPartnerships.map((partner) => (
            <Card
              key={partner.id}
              className="p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-0"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-20 w-auto mb-4 object-contain"
              />
              <h3 className="font-bold text-text-primary mb-2">{partner.name}</h3>
              <p className="text-sm text-primary font-semibold mb-4">
                {partner.category}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary-light"
              >
                Conhecer
              </Button>
            </Card>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="relative">
            <div
              id="partnerships-carousel"
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
              style={{ scrollBehavior: "smooth" }}
            >
              {mockPartnerships.map((partner) => (
                <Card
                  key={partner.id}
                  className="flex-shrink-0 w-72 p-6 flex flex-col items-center justify-center text-center border-0 snap-center"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-20 w-auto mb-4 object-contain"
                  />
                  <h3 className="font-bold text-text-primary mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-primary font-semibold mb-4">
                    {partner.category}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary-light"
                  >
                    Conhecer
                  </Button>
                </Card>
              ))}
            </div>

            {/* Carousel controls */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors z-10"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors z-10"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
