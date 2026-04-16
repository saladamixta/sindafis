import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NoticiaDetalhe() {
  const [, params] = useRoute("/noticias/:slug");

  const { data, isLoading } = trpc.news.getBySlug.useQuery(
    { slug: params?.slug || "" },
    { enabled: !!params?.slug }
  );

  if (isLoading) return <div className="p-10">Carregando...</div>;
  if (!data) return <div className="p-10">Notícia não encontrada</div>;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">

      <Header />

      <main className="flex-1">

        <div className="max-w-4xl mx-auto px-4 py-10">

          {/* VOLTAR */}
          <a
            href="/noticias"
            className="text-sm text-green-700 hover:underline mb-4 inline-block"
          >
            ← Voltar às notícias
          </a>

          {/* DATA */}
          <p className="text-sm text-gray-500 mb-2">
            {new Date(data.publishedAt).toLocaleDateString("pt-BR")}
          </p>

          {/* TÍTULO */}
          <h1 className="text-3xl font-bold mb-6 leading-tight text-gray-900">
            {data.title}
          </h1>

          {/* IMAGEM */}
          {data.coverImage && (
            <div className="mb-8">
              <img
                src={data.coverImage}
                className="w-full rounded-xl object-cover max-h-[420px]"
              />
            </div>
          )}

          {/* CONTEÚDO */}
          <div
            className="prose max-w-none prose-img:rounded-lg prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />

          {/* COMPARTILHAMENTO */}
          <div className="mt-12 p-5 bg-white border rounded-xl shadow-sm">
            <p className="text-sm mb-4 font-semibold text-gray-700">
              Compartilhar esta notícia
            </p>

            <div className="flex gap-2 flex-wrap">

              <a
                href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
              >
                WhatsApp
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
              >
                Facebook
              </a>

              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                className="bg-black text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
              >
                X
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
                className="bg-gray-200 px-4 py-2 rounded-md text-sm hover:bg-gray-300"
              >
                Copiar link
              </button>

            </div>
          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}
