import { Card } from "@/components/ui/card";
import { Handshake, Users, FileText, Megaphone, ChevronRight } from "lucide-react";

const quickNavItems = [
  {
    id: "membership",
    title: "Filie-se",
    description: "Solicite sua filiação ao sindicato e acesse todos os benefícios",
    icon: Users,
    color: "bg-green-50",
    iconColor: "text-primary",
    borderColor: "border-l-4 border-primary",
  },
  {
    id: "partnerships",
    title: "Convênios",
    description: "Conheça nossos convênios exclusivos e descontos especiais",
    icon: Handshake,
    color: "bg-green-50",
    iconColor: "text-primary",
    borderColor: "border-l-4 border-primary",
  },
  {
    id: "transparency",
    title: "Transparência",
    description: "Acesse relatórios financeiros e documentos públicos",
    icon: FileText,
    color: "bg-green-50",
    iconColor: "text-primary",
    borderColor: "border-l-4 border-primary",
  },
  {
    id: "news",
    title: "Comunicados",
    description: "Acompanhe as últimas notícias e comunicados importantes",
    icon: Megaphone,
    color: "bg-green-50",
    iconColor: "text-primary",
    borderColor: "border-l-4 border-primary",
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
                className={`p-6 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-2 ${item.color} ${item.borderColor} border-0 rounded-lg`}
                onClick={() => handleCardClick(item.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center">
                    <Icon className={`w-7 h-7 ${item.iconColor}`} />
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-secondary" />
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
