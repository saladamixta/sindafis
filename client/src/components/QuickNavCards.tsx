import { Card } from "@/components/ui/card";
import { Handshake, Users, FileText, Megaphone, ChevronRight } from "lucide-react";

const quickNavItems = [
  {
    id: "membership",
    title: "Filie-se",
    description: "Solicite sua filiação ao sindicato e acesse todos os benefícios",
    icon: Users,
  },
  {
    id: "partnerships",
    title: "Convênios",
    description: "Conheça nossos convênios exclusivos e descontos especiais",
    icon: Handshake,
  },
  {
    id: "transparency",
    title: "Transparência",
    description: "Acesse relatórios financeiros e documentos públicos",
    icon: FileText,
  },
  {
    id: "news",
    title: "Comunicados",
    description: "Acompanhe as últimas notícias e comunicados importantes",
    icon: Megaphone,
  },
];

export default function QuickNavCards() {
  const handleCardClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className={[
                  "group relative p-6 cursor-pointer transition-all",
                  "bg-white border border-border shadow-sm",
                  "hover:shadow-xl hover:-translate-y-2 hover:border-primary/40",
                  "rounded-xl overflow-hidden",
                ].join(" ")}
                onClick={() => handleCardClick(item.id)}
              >
                {/* filete verde no topo */}
                <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

                <div className="flex items-start justify-between mb-4">
                  {/* ícone maior, verde, com badge */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  <ChevronRight className="w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
                </div>

                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
