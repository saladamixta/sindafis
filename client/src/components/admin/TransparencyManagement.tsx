import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const categories = [
  "Prestação de Contas",
  "Relatórios Financeiros",
  "Estatuto e Atas",
];

export default function TransparencyManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: categories[0],
    fileUrl: "",
    fileName: "",
    year: new Date().getFullYear(),
  });

  const documentsList = trpc.transparencyDocuments.list.useQuery();
  const createDocument = trpc.transparencyDocuments.create.useMutation({
    onSuccess: () => {
      toast.success("Documento criado com sucesso!");
      documentsList.refetch();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar documento");
    },
  });

  const updateDocument = trpc.transparencyDocuments.update.useMutation({
    onSuccess: () => {
      toast.success("Documento atualizado com sucesso!");
      documentsList.refetch();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar documento");
    },
  });

  const deleteDocument = trpc.transparencyDocuments.delete.useMutation({
    onSuccess: () => {
      toast.success("Documento deletado com sucesso!");
      documentsList.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao deletar documento");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: categories[0],
      fileUrl: "",
      fileName: "",
      year: new Date().getFullYear(),
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateDocument.mutateAsync({
        id: editingId,
        ...formData,
      });
    } else {
      await createDocument.mutateAsync(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">
          Gerenciar Documentos
        </h2>
        <Button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-primary hover:bg-primary-dark text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Documento
        </Button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <Card className="p-6 border-0 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Título
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Título do documento"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Descrição
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descrição do documento"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Ano
                </label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      year: parseInt(e.target.value),
                    })
                  }
                  min="2000"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Nome do Arquivo
                </label>
                <Input
                  value={formData.fileName}
                  onChange={(e) =>
                    setFormData({ ...formData, fileName: e.target.value })
                  }
                  placeholder="documento.pdf"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                URL do Arquivo
              </label>
              <Input
                value={formData.fileUrl}
                onChange={(e) =>
                  setFormData({ ...formData, fileUrl: e.target.value })
                }
                placeholder="https://..."
                type="url"
                required
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white"
                disabled={createDocument.isPending || updateDocument.isPending}
              >
                {editingId ? "Atualizar" : "Criar"} Documento
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Documents List */}
      <div className="space-y-4">
        {documentsList.isLoading ? (
          <p className="text-center text-text-secondary">Carregando documentos...</p>
        ) : documentsList.data && documentsList.data.length > 0 ? (
          documentsList.data.map((item) => (
            <Card key={item.id} className="p-4 border-0 shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-text-primary">{item.title}</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {item.category} • {item.year}
                  </p>
                  {item.description && (
                    <p className="text-sm text-text-secondary mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setFormData({
                        title: item.title,
                        description: item.description || "",
                        category: item.category,
                        fileUrl: item.fileUrl,
                        fileName: item.fileName || "",
                        year: item.year || new Date().getFullYear(),
                      });
                      setEditingId(item.id);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteDocument.mutate(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-text-secondary py-8">
            Nenhum documento criado ainda
          </p>
        )}
      </div>
    </div>
  );
}
