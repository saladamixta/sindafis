import { trpc } from "@/lib/trpc";
import { useRoute } from "wouter";

export default function NoticiaDetalhe() {
  const [, params] = useRoute("/noticias/:slug");

  const { data, isLoading } = trpc.news.getBySlug.useQuery(
    params?.slug || "",
    {
      enabled: !!params?.slug,
    }
  );

  if (isLoading) return <div className="p-6">Carregando...</div>;
  if (!data) return <div className="p-6">Notícia não encontrada.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
          {data.title}
        </h1>

        {/* Data */}
        <div className="text-sm text-gray-500 mb-6">
          {new Date(data.createdAt).toLocaleDateString("pt-BR")}
        </div>

        {/* IMAGEM CORRIGIDA */}
        {data.coverImage && (
          <div className="mb-8">
            <img
              src={data.coverImage}
              className="w-full rounded-xl shadow-md max-h-[500px] object-contain bg-gray-200"
            />
          </div>
        )}

        {/* Conteúdo */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />

      </div>
    </div>
  );
}
