import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function NewsSection() {
  const { data: newsList, isLoading } = trpc.news.list.useQuery();

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (!newsList || newsList.length === 0) {
    return null;
  }

  const mainNews = newsList[0];
  const secondaryNews = newsList.slice(1, 3);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Últimas Notícias
          </h2>
          <Button variant="ghost" className="text-primary hover:text-primary-dark hover:bg-primary-light">
            Ver todas <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="mb-12">
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-full min-h-80 bg-gray-100">
                {mainNews.coverImage ? (
                  <img src={mainNews.coverImage} alt={mainNews.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green-50">
                    <span className="text-green-800 font-bold text-xl">SINDAFIS</span>
                  </div>
                )}
              </div>
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-primary font-semibold mb-3">
                    {formatDate(mainNews.published || mainNews.createdAt)}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">{mainNews.title}</h3>
                  <p className="text-text-secondary text-lg leading-relaxed mb-6">{mainNews.excerpt}</p>
                </div>
                <Button className="w-fit bg-primary hover:bg-primary-dark text-white font-semibold">
                  Ler matéria completa
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {secondaryNews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secondaryNews.map((news) => (
              <Card key={news.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {news.coverImage ? (
                    <img src={news.coverImage} alt={news.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-green-50">
                      <span className="text-green-800 font-bold">SINDAFIS</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs text-primary font-semibold mb-2">
                    {formatDate(news.published || news.createdAt)}
                  </p>
                  <h4 className="text-lg font-bold text-text-primary mb-3">{news.title}</h4>
                  <p className="text-sm text-text-secondary mb-4">{news.excerpt}</p>
                  <Button variant="ghost" className="text-primary hover:text-primary-dark p-0">
                    Ler mais <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
