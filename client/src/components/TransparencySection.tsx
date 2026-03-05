import { Card } from "@/components/ui/card";
import { Download, FileText, BarChart3, BookOpen } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

const categories = [
  { id: "Prestação de Contas", title: "Prestação de Contas", icon: FileText },
  { id: "Relatórios Financeiros", title: "Relatórios Financeiros", icon: BarChart3 },
  { id: "Estatuto e Atas", title: "Estatuto e Atas", icon: BookOpen },
];

export default function TransparencySection() {
  const [activeCategory, setActiveCategory] = useState("Prestação de Contas");
  const { data: allDocuments, isLoading } = trpc.transparencyDocuments.list.useQuery();

  const filteredDocs = allDocuments?.filter(doc => doc.category === activeCategory) ?? [];

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-gray-bg">
        <div className="container">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-200 rounded" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gray-bg">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-12">
          Documentos de Transparência
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-6 rounded-lg transition-all text-left font-semibold flex items-center gap-3 ${
                  activeCategory === category.id
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white text-text-primary hover:shadow-md border border-gray-border"
                }`}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                <span>{category.title}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <Card key={doc.id} className="p-6 border-0 shadow-md hover:shadow-lg transition-all cursor-pointer bg-white rounded-lg">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-text-primary text-lg">{doc.title}</h4>
                    {doc.year && <p className="text-sm text-text-secondary mt-1">{doc.year}</p>}
                    {doc.description && <p className="text-sm text-text-secondary mt-1">{doc.description}</p>}
                  </div>
                </div>
                
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-4 py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Baixar
                </a>
              </Card>
            ))
          ) : (
            <p className="text-center text-text-secondary py-8 col-span-full">
              Nenhum documento disponível nesta categoria
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
