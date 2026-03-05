import { Card } from "@/components/ui/card";
import { Download, FileText, BarChart3, BookOpen } from "lucide-react";
import { useState } from "react";

// Mock data - will be replaced with real data from API
const mockDocuments = {
  accounts: [
    {
      id: 1,
      title: "Prestação de Contas 2025",
      year: 2025,
      url: "#",
    },
    {
      id: 2,
      title: "Prestação de Contas 2024",
      year: 2024,
      url: "#",
    },
  ],
  reports: [
    {
      id: 3,
      title: "Relatório Financeiro 2025",
      year: 2025,
      url: "#",
    },
    {
      id: 4,
      title: "Relatório Financeiro 2024",
      year: 2024,
      url: "#",
    },
  ],
  documents: [
    {
      id: 5,
      title: "Estatuto Social",
      url: "#",
    },
    {
      id: 6,
      title: "Atas de Assembleia 2025",
      url: "#",
    },
  ],
};

const categories = [
  {
    id: "accounts",
    title: "Prestação de Contas",
    icon: FileText,
  },
  {
    id: "reports",
    title: "Relatórios Financeiros",
    icon: BarChart3,
  },
  {
    id: "documents",
    title: "Estatuto e Atas",
    icon: BookOpen,
  },
];

export default function TransparencySection() {
  const [activeCategory, setActiveCategory] = useState("accounts");

  const getDocuments = () => {
    return mockDocuments[activeCategory as keyof typeof mockDocuments] || [];
  };

  return (
    <section className="py-16 md:py-24 bg-gray-bg">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-12">
          Documentos de Transparência
        </h2>

        {/* Category Tabs */}
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

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getDocuments().length > 0 ? (
            getDocuments().map((doc) => (
              <Card
                key={doc.id}
                className="p-6 border-0 shadow-md hover:shadow-lg transition-all cursor-pointer bg-white rounded-lg"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-text-primary text-lg">
                      {doc.title}
                    </h4>
                    {"year" in doc && (
                      <p className="text-sm text-text-secondary mt-1">
                        {doc.year}
                      </p>
                    )}
                  </div>
                </div>
                <button className="w-full mt-4 py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Baixar
                </button>
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
