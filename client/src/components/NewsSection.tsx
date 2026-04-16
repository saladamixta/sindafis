import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function NewsSection() {
  const { data } = trpc.news.listFeed.useQuery({
    limit: 6,
    offset: 0,
  });

  const news = data?.items ?? [];

  if (!news.length) return null;

  const [main, ...others] = news;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Últimas Notícias</h2>

      <div className="grid md:grid-cols-3 gap-6">

        {/* PRINCIPAL */}
        {main && (
          <Link href={`/noticias/${main.slug}`}>
            <a className="md:col-span-2 group bg-white rounded-xl overflow-hidden shadow-lg">

              <div className="relative">
                <img
                  src={main.coverImage}
                  className="w-full h-[340px] object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold leading-snug line-clamp-2 group-hover:text-green-700">
                  {main.title}
                </h3>

                <p className="text-gray-600 mt-2 line-clamp-3">
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
                  className="w-28 h-20 object-cover rounded"
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
