import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function NewsSection() {
  const { data, isLoading } = trpc.news.listFeed.useQuery({
    limit: 6,
    offset: 0,
  });

  const news = data?.items ?? [];

  if (isLoading) return <div className="p-6">Carregando...</div>;
  if (!news.length) return <div className="p-6">Sem notícias</div>;

  const [main, ...others] = news;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Últimas Notícias</h2>

      <div className="grid md:grid-cols-3 gap-6">

        {/* 🔥 CARD PRINCIPAL */}
        {main && (
          <Link href={`/noticias/${main.slug}`}>
            <a className="md:col-span-2 bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">

              {/* IMAGEM */}
              <div className="relative h-[320px]">
                <img
                  src={main.coverImage}
                  className="w-full h-full object-cover"
                />

                {/* OVERLAY GRADIENTE */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* TÍTULO SOBRE IMAGEM */}
                <div className="absolute bottom-0 p-5 text-white">
                  <h3 className="text-xl md:text-2xl font-bold leading-tight line-clamp-3">
                    {main.title}
                  </h3>
                </div>
              </div>

              {/* TEXTO ABAIXO */}
              <div className="p-5">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {main.excerpt}
                </p>
              </div>

            </a>
          </Link>
        )}

        {/* 🔹 LATERAIS */}
        <div className="flex flex-col gap-4">
          {others.slice(0, 3).map((item) => (
            <Link key={item.id} href={`/noticias/${item.slug}`}>
              <a className="flex gap-3 bg-white p-3 rounded-lg shadow hover:shadow-md transition">

                <img
                  src={item.coverImage}
                  className="w-24 h-20 object-cover rounded"
                />

                <div className="flex flex-col justify-center">
                  <h4 className="font-semibold text-sm line-clamp-2">
                    {item.title}
                  </h4>

                  <p className="text-xs text-gray-500 line-clamp-2">
                    {item.excerpt}
                  </p>
                </div>

              </a>
            </Link>
          ))}
        </div>

      </div>

      <div className="mt-6 text-right">
        <Link href="/noticias">
          <a className="text-blue-600 hover:underline">
            Ver todas as notícias →
          </a>
        </Link>
      </div>
    </section>
  );
}
