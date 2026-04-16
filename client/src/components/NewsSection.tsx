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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Últimas Notícias</h2>
        <Link href="/noticias">
          <a className="text-sm text-green-700 hover:underline">
            Ver todas →
          </a>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* PRINCIPAL */}
        {main && (
          <Link href={`/noticias/${main.slug}`}>
            <a className="md:col-span-2 group relative rounded-xl overflow-hidden shadow-lg">

              <img
                src={main.coverImage}
                className="w-full h-[360px] object-cover group-hover:scale-105 transition"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-0 p-6 text-white">
                <span className="text-xs uppercase opacity-80">
                  Destaque
                </span>

                <h3 className="text-2xl font-bold leading-tight line-clamp-3">
                  {main.title}
                </h3>

                <p className="text-sm opacity-90 line-clamp-2 mt-2">
                  {main.excerpt}
                </p>
              </div>
            </a>
          </Link>
        )}

        {/* LATERAIS */}
        <div className="flex flex-col gap-4">
          {others.slice(0, 4).map((item) => (
            <Link key={item.id} href={`/noticias/${item.slug}`}>
              <a className="flex gap-3 bg-white p-3 rounded-lg shadow hover:shadow-md transition group">

                <img
                  src={item.coverImage}
                  className="w-24 h-20 object-cover rounded group-hover:scale-105 transition"
                />

                <div>
                  <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-green-700">
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
    </section>
  );
}
