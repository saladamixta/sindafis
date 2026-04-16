import { trpc } from "@/lib/trpc";

export default function PartnershipsSection() {
  const { data = [] } = trpc.partnerships.list.useQuery();

  if (!data.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Convênios e Parceiros</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
        {data.map((item) => (
          <a key={item.id} href={item.website} target="_blank">
            <img
              src={item.logo}
              className="h-16 object-contain mx-auto hover:scale-105 transition"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
