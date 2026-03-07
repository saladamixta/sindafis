import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";

type FeedItem = {
  id: number;
  title: string;
  slug: string | null;
  excerpt: string | null;
  coverImage: string | null;
  published: Date | string | null;
  createdAt: Date | string;
};

export default function Noticias() {
  const [, setLocation] = useLocation();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const feedQuery = trpc.news.listFeed.useInfiniteQuery(
    { limit: 6, offset: 0 },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore && lastPage.nextOffset !== null
          ? { limit: 6, offset: lastPage.nextOffset }
          : undefined;
      },
    }
  );

  const items = useMemo<FeedItem[]>(() => {
    return feedQuery.data?.pages.flatMap((page) => page.items as FeedItem[]) ?? [];
  }, [feedQuery.data]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const siteUrl = window.location.origin;
    const canonicalUrl = `${siteUrl}/noticias`;
    const ogImage = `${siteUrl}/og-home.jpg`;

    const ensureMeta = (attr: "name" | "property", value: string, content: string) => {
      let el = document.head.querySelector(`meta[${attr}="${value}"]`) as HTMLMetaElement | null;

      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }

      el.setAttribute("content", content);
    };

    const ensureCanonical = (href: string) => {
      let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }

      link.setAttribute("href", href);
    };

    document.title = "Últimas Notícias | SINDAFIS";

    ensureCanonical(canonicalUrl);

    ensureMeta(
      "name",
      "description",
      "Acompanhe as últimas notícias do SINDAFIS"
    );

    ensureMeta("property", "og:locale", "pt_BR");
    ensureMeta("property", "og:type", "website");
    ensureMeta("property", "og:title", "Últimas Notícias | SINDAFIS");
    ensureMeta(
      "property",
      "og:description",
      "Acompanhe as últimas notícias do SINDAFIS"
    );
    ensureMeta("property", "og:url", canonicalUrl);
    ensureMeta("property", "og:site_name", "SINDAFIS");
    ensureMeta("property", "og:image", ogImage);
    ensureMeta("property", "og:image:alt", "Últimas Notícias do SINDAFIS");

    ensureMeta("name", "twitter:card", "summary_large_image");
    ensureMeta("name", "twitter:title", "Últimas Notícias | SINDAFIS");
    ensureMeta(
      "name",
      "twitter:description",
      "Acompanhe as últimas notícias do SINDAFIS"
    );
    ensureMeta("name", "twitter:image", ogImage);
  }, []);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;
    if (!feedQuery.hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (feedQuery.isFetchingNextPage) return;

        feedQuery.fetchNextPage();
      },
      {
        root: null,
        rootMargin: "300px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [feedQuery.hasNextPage, feedQuery.isFetchingNextPage, feedQuery.fetchNextPage]);

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const goTo = (slug?: string | null) => {
    if (!slug) return;
    setLocation(`/noticias/${encodeURIComponent(slug)}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <section className="py-10 md:py-14">
          <div className="container">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="mb-6 text-primary hover:text-primary-dark p-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>

            <div className="mb-10 md:mb-12">
              <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-3">
                Últimas Notícias
              </h1>
              <p className="text-base md:text-lg text-text-secondary max-w-2xl">
                Acompanhe os comunicados e notícias do SINDAFIS, da mais recente para a mais antiga.
              </p>
            </div>

            {feedQuery.isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl overflow-hidden border border-gray-200 bg-white">
                    <div className="h-56 bg-gray-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-40" />
                      <div className="h-6 bg-gray-200 rounded w-full" />
                      <div className="h-6 bg-gray-200 rounded w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {feedQuery.isError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Não foi possível carregar as notícias agora.
              </div>
            ) : null}

            {!feedQuery.isLoading && !feedQuery.isError && items.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-text-secondary">
                Nenhuma notícia publicada no momento.
              </div>
            ) : null}

            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-[2px] cursor-pointer rounded-2xl"
                    onClick={() => goTo(item.slug)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && goTo(item.slug)}
                  >
                    <div className="bg-gray-100 h-56 overflow-hidden">
                      {item.coverImage ? (
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-green-50">
                          <span className="text-green-800 font-bold text-lg">SINDAFIS</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-sm text-primary font-medium mb-3">
                        <Calendar className="w-4 h-4" />
                        {formatDate(item.published || item.createdAt)}
                      </div>

                      <h2 className="text-xl font-bold text-text-primary leading-snug line-clamp-3">
                        {item.title}
                      </h2>

                      {item.excerpt ? (
                        <p className="mt-3 text-sm text-text-secondary leading-relaxed line-clamp-3">
                          {item.excerpt}
                        </p>
                      ) : null}
                    </div>
                  </Card>
                ))}
              </div>
            ) : null}

            <div ref={loadMoreRef} className="h-10" />

            {feedQuery.isFetchingNextPage ? (
              <div className="flex items-center justify-center pt-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-text-secondary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Carregando mais notícias...
                </div>
              </div>
            ) : null}

            {!feedQuery.hasNextPage && items.length > 0 ? (
              <p className="text-center text-sm text-text-secondary pt-6">
                Você chegou ao final das notícias.
              </p>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
