import { trpc } from "@/lib/trpc";

export default function PartnershipsSection() {
  const { data = [] } = trpc.partnerships.list.useQuery();

  if (!data.length) return null;

  // separa por categoria (se tiver)
  const grouped = data.reduce((acc: any, item: any) => {
    const key = item.category || "Outros";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8">Convênios e Parceiros</h2>

      {Object.entries(grouped).map(([category, items]: any) => (
        <div key={category} className="mb-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {category}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
            {items.map((item: any) => (
              <a
                key={item.id}
                href={item.website}
                target="_blank"
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition flex items-center justify-center group"
              >
                <img
                  src={item.logo}
                  alt={item.name}
                  className="h-14 object-contain grayscale group-hover:grayscale-0 transition"
                />
              </a>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
