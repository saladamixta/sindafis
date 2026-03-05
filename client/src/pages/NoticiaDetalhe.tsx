import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";

export default function NoticiaDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { data: noticia, isLoading } = trpc.news.getBySlug.useQuery(slug ?? "");

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
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container pt-32 pb-16">
          <div className="animate-pulse max-w-3xl mx-auto space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-64 bg-gray-200 rounded" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Notícia não encontrada</h1>
          <Button onClick={() => setLocation("/")} className="bg-primary hover:bg-primary-dark text-white">
            Voltar ao início
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-3xl mx-auto">

          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-8 text-primary hover:text-primary-dark p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar às notícias
          </Button>

          <article>
            <div className="flex items-center gap-2 text-sm text-primary font-semibold mb-4">
              <Calendar className="w-4 h-4" />
              {formatDate(noticia.published || noticia.createdAt)}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 leading-tight">
              {noticia.title}
            </h1>

            {noticia.excerpt && (
              <p className="text-xl text-text-secondary leading-relaxed mb-8 border-l-4 border-primary pl-6">
                {noticia.excerpt}
              </p>
            )}

            {noticia.coverImage && (
              <div className="mb-8 rounded-xl overflow-hidden">
                <img
                  src={noticia.coverImage}
                  alt={noticia.title}
                  className="w-full h-72 md:h-96 object-cover"
                />
              </div>
            )}

            <div
              className="prose prose-lg max-w-none text-text-primary leading-relaxed"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {noticia.content}
            </div>
          </article>

          <div className="mt-12 pt-8 border-t border-gray-border">
            <Button
              onClick={() => setLocation("/")}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
