import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

// Mock data - will be replaced with real data from API
const mockPartnerships = [
  {
    id: 1,
    name: "Unimedi",
    logo: "https://via.placeholder.com/150x80?text=Unimedi",
    category: "Saúde",
  },
  {
    id: 2,
    name: "Porto",
    logo: "https://via.placeholder.com/150x80?text=Porto",
    category: "Financeiro",
  },
  {
    id: 3,
    name: "Sicredi",
    logo: "https://via.placeholder.com/150x80?text=Sicredi",
    category: "Financeiro",
  },
  {
    id: 4,
    name: "Cassems",
    logo: "https://via.placeholder.com/150x80?text=Cassems",
    category: "Saúde",
  },
  {
    id: 5,
    name: "Banco XYZ",
    logo: "https://via.placeholder.com/150x80?text=Banco+XYZ",
    category: "Financeiro",
  },
  {
    id: 6,
    name: "Seguros ABC",
    logo: "https://via.placeholder.com/150x80?text=Seguros",
    category: "Seguros",
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
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-12">
          Convênios e Parceiros
        </h2>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {mockPartnerships.map((partner) => (
            <Card
              key={partner.id}
              className="p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-0 bg-white rounded-lg"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-16 w-auto mb-4 object-contain"
              />
              <h3 className="font-bold text-text-primary">{partner.name}</h3>
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
                  className="flex-shrink-0 w-48 p-6 flex flex-col items-center justify-center text-center border-0 snap-center bg-white rounded-lg"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-14 w-auto mb-4 object-contain"
                  />
                  <h3 className="font-bold text-text-primary text-sm">
                    {partner.name}
                  </h3>
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
