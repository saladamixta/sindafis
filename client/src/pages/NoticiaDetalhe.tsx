import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  MessageCircle,
  Facebook,
  Link2,
  Instagram,
} from "lucide-react";

export default function NoticiaDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { data: noticia, isLoading } = trpc.news.getBySlug.useQuery(slug ?? "");
  const [copyFeedback, setCopyFeedback] = useState("");

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const currentUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const absoluteImageUrl = useMemo(() => {
    if (!noticia?.coverImage || typeof window === "undefined") return "";
    if (/^https?:\/\//i.test(noticia.coverImage)) return noticia.coverImage;
    return `${window.location.origin}${noticia.coverImage.startsWith("/") ? "" : "/"}${noticia.coverImage}`;
  }, [noticia?.coverImage]);

  const metaDescription = useMemo(() => {
    if (!noticia) {
      return "Acompanhe notícias e comunicados do SINDAFIS.";
    }

    const excerpt = noticia.excerpt?.trim();
    if (excerpt) return excerpt;

    const plainContent = noticia.content?.replace(/\s+/g, " ").trim() ?? "";
    return plainContent.slice(0, 160) || "Leia esta notícia no portal do SINDAFIS.";
  }, [noticia]);

  useEffect(() => {
    if (typeof document === "undefined") return;

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

    if (!noticia) {
      document.title = "Notícia | SINDAFIS";
      ensureMeta("name", "description", "Acompanhe notícias e comunicados do SINDAFIS.");
      return;
    }

    const pageTitle = `${noticia.title} | SINDAFIS`;

    document.title = pageTitle;
    ensureCanonical(currentUrl);

    ensureMeta("name", "description", metaDescription);

    ensureMeta("property", "og:type", "article");
    ensureMeta("property", "og:title", noticia.title);
    ensureMeta("property", "og:description", metaDescription);
    ensureMeta("property", "og:url", currentUrl);
    ensureMeta("property", "og:site_name", "SINDAFIS");

    if (absoluteImageUrl) {
      ensureMeta("property", "og:image", absoluteImageUrl);
      ensureMeta("property", "og:image:alt", noticia.title);
      ensureMeta("property", "og:image:width", "1200");
      ensureMeta("property", "og:image:height", "630");
    }

    ensureMeta("name", "twitter:card", absoluteImageUrl ? "summary_large_image" : "summary");
    ensureMeta("name", "twitter:title", noticia.title);
    ensureMeta("name", "twitter:description", metaDescription);

    if (absoluteImageUrl) {
      ensureMeta("name", "twitter:image", absoluteImageUrl);
    }
  }, [noticia, currentUrl, absoluteImageUrl, metaDescription]);

  const shareText = noticia?.title ?? "Notícia SINDAFIS";
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
  };

  const handleCopyLink = async (instagramMode = false) => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopyFeedback(instagramMode ? "Link copiado para colar no Instagram." : "Link copiado com sucesso.");
      window.setTimeout(() => setCopyFeedback(""), 2500);
    } catch {
      setCopyFeedback("Não foi possível copiar o link.");
      window.setTimeout(() => setCopyFeedback(""), 2500);
    }
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

          <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="text-lg font-bold text-text-primary mb-4">Compartilhar esta notícia</h3>

            <div className="flex flex-wrap gap-3">
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>

              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </a>

              <a
                href={shareLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity"
              >
                <span className="text-sm font-bold">X</span>
                X
              </a>

              <button
                type="button"
                onClick={() => handleCopyLink(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </button>

              <button
                type="button"
                onClick={() => handleCopyLink(false)}
                className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-primary font-medium hover:bg-primary hover:text-white transition-colors"
              >
                <Link2 className="w-4 h-4" />
                Copiar link
              </button>
            </div>

            {copyFeedback ? (
              <p className="mt-3 text-sm text-primary font-medium">{copyFeedback}</p>
            ) : null}
          </div>

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
