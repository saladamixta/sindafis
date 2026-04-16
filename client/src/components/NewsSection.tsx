import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

type News = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  createdAt: string;
};

export default function NewsSection() {
  const { data: news = [], isLoading } = useQuery<News[]>({
    queryKey: ["news-feed"],
    queryFn: async () => {
      const res = await fetch("/api/news");
      return res.json();
    },
  });

  if (isLoading) {
    return <div className="p-6">Carregando notícias...</div>;
  }

  if (!news.length) {
    return <div className="p-6">Nenhuma notícia encontrada.</div>;
  }

  const [main, ...others] = news;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Últimas Notícias</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Destaque */}
        {main && (
          <Link href={`/noticias/${main.slug}`}>
            <a className="md:col-span-2 block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
              {main.coverImage && (
                <img
                  src={main.coverImage}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">
                  {main.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {main.excerpt}
                </p>
              </div>
            </a>
          </Link>
        )}

        {/* Laterais */}
        <div className="flex flex-col gap-4">
          {others.slice(0, 3).map((item) => (
            <Link key={item.id} href={`/noticias/${item.slug}`}>
              <a className="flex gap-3 bg-white p-3 rounded-lg shadow hover:shadow-md transition">
                {item.coverImage && (
                  <img
                    src={item.coverImage}
                    className="w-24 h-20 object-cover rounded"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-sm">
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
