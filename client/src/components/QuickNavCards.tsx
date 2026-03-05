import { Card } from "@/components/ui/card";
import { FileText, Users, Lock, Newspaper } from "lucide-react";

const quickNavItems = [
  {
    id: "membership",
    title: "Filie-se",
    description: "Solicite sua filiação ao sindicato",
    icon: Users,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "partnerships",
    title: "Convênios",
    description: "Conheça nossos convênios exclusivos",
    icon: FileText,
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    id: "transparency",
    title: "Transparência",
    description: "Acesse relatórios e documentos",
    icon: Lock,
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    id: "news",
    title: "Comunicados",
    description: "Últimas notícias e comunicados",
    icon: Newspaper,
    color: "bg-orange-50",
    iconColor: "text-orange-600",
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
    <section className="py-16 md:py-24 bg-gray-bg">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary text-center mb-12">
          Navegação Rápida
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${item.color} border-0`}
                onClick={() => handleCardClick(item.id)}
              >
                <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary">
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
