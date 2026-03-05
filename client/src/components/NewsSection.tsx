import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Mock data - will be replaced with real data from API
const mockNews = [
  {
    id: 1,
    title: "SINDAFIS promove assembleia geral para discutir pautas 2026",
    excerpt: "Reunião acontecerá no próximo mês com discussão de temas importantes para a categoria",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    date: "2026-03-05",
  },
  {
    id: 2,
    title: "Novo convênio com instituição financeira beneficia filiados",
    excerpt: "Acordo oferece taxas especiais e condições diferenciadas para membros do sindicato",
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop",
    date: "2026-03-01",
  },
  {
    id: 3,
    title: "Transparência: Relatório financeiro de 2025 disponível",
    excerpt: "Confira o balanço completo das atividades e finanças do sindicato no ano passado",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    date: "2026-02-28",
  },
];

export default function NewsSection() {
  const mainNews = mockNews[0];
  const secondaryNews = mockNews.slice(1, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Últimas Notícias
          </h2>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary-dark hover:bg-primary-light"
          >
            Ver todas <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Main News */}
        <div className="mb-12">
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-full min-h-80">
                <img
                  src={mainNews.coverImage}
                  alt={mainNews.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-primary font-semibold mb-3">
                    {formatDate(mainNews.date)}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
                    {mainNews.title}
                  </h3>
                  <p className="text-text-secondary text-lg leading-relaxed mb-6">
                    {mainNews.excerpt}
                  </p>
                </div>
                <Button className="w-fit bg-primary hover:bg-primary-dark text-white font-semibold">
                  Ler matéria completa
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary News */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondaryNews.map((news) => (
            <Card
              key={news.id}
              className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={news.coverImage}
                  alt={news.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-6">
                <p className="text-xs text-primary font-semibold mb-2">
                  {formatDate(news.date)}
                </p>
                <h4 className="text-lg font-bold text-text-primary mb-3">
                  {news.title}
                </h4>
                <p className="text-sm text-text-secondary mb-4">
                  {news.excerpt}
                </p>
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary-dark p-0"
                >
                  Ler mais <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
