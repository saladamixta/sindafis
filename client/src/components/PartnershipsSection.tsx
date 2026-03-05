import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function PartnershipsSection() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { data: partnerships, isLoading } = trpc.partnerships.list.useQuery();

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("partnerships-carousel");
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === "left" ? scrollPosition - scrollAmount : scrollPosition + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-12" />
            <div className="grid grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!partnerships || partnerships.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-12">
          Convênios e Parceiros
        </h2>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerships.map((partner) => (
            <Card
              key={partner.id}
              className="p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-0 bg-white rounded-lg"
              onClick={() => partner.website && window.open(partner.website, "_blank")}
            >
              {partner.logo ? (
                <img src={partner.logo} alt={partner.name} className="h-16 w-auto mb-4 object-contain" />
              ) : (
                <div className="h-16 w-32 mb-4 bg-green-50 rounded flex items-center justify-center">
                  <span className="text-green-800 font-bold text-sm">{partner.name}</span>
                </div>
              )}
              <h3 className="font-bold text-text-primary">{partner.name}</h3>
              {partner.category && (
                <p className="text-xs text-text-secondary mt-1">{partner.category}</p>
              )}
            </Card>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="relative">
            <div
              id="partnerships-carousel"
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
            >
              {partnerships.map((partner) => (
                <Card
                  key={partner.id}
                  className="flex-shrink-0 w-48 p-6 flex flex-col items-center justify-center text-center border-0 snap-center bg-white rounded-lg"
                >
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className="h-14 w-auto mb-4 object-contain" />
                  ) : (
                    <div className="h-14 w-28 mb-4 bg-green-50 rounded flex items-center justify-center">
                      <span className="text-green-800 font-bold text-xs">{partner.name}</span>
                    </div>
                  )}
                  <h3 className="font-bold text-text-primary text-sm">{partner.name}</h3>
                </Card>
              ))}
            </div>
            <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors z-10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors z-10">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
