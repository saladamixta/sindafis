import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "reports",
    title: "Relatórios Financeiros",
    icon: BarChart3,
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    id: "documents",
    title: "Estatuto e Atas",
    icon: BookOpen,
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

export default function TransparencySection() {
  const [activeCategory, setActiveCategory] = useState("accounts");

  const getDocuments = () => {
    return mockDocuments[activeCategory as keyof typeof mockDocuments] || [];
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Transparência
        </h2>
        <p className="text-text-secondary text-lg mb-12">
          Acesse documentos, relatórios e informações sobre a gestão do sindicato
        </p>

        {/* Category Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-6 rounded-lg transition-all text-left ${
                  activeCategory === category.id
                    ? "bg-primary text-white shadow-lg"
                    : `${category.color} text-text-primary hover:shadow-md`
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon
                    className={`w-6 h-6 flex-shrink-0 mt-1 ${
                      activeCategory === category.id
                        ? "text-white"
                        : category.iconColor
                    }`}
                  />
                  <div>
                    <h3 className="font-bold text-lg">{category.title}</h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Documents List */}
        <Card className="border-0 shadow-lg p-8">
          <div className="space-y-4">
            {getDocuments().length > 0 ? (
              getDocuments().map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-border rounded-lg hover:bg-gray-bg transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <FileText className="w-6 h-6 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-text-primary">
                        {doc.title}
                      </h4>
                      {"year" in doc && (
                        <p className="text-sm text-text-secondary">
                          Ano: {doc.year}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary-dark text-white gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Baixar
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-text-secondary py-8">
                Nenhum documento disponível nesta categoria
              </p>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
