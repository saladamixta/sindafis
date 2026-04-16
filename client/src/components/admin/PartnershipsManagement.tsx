import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function PartnershipsManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    website: "",
    category: "",
  });

  const partnershipsList = trpc.partnerships.list.useQuery();
  const createPartnership = trpc.partnerships.create.useMutation({
    onSuccess: () => {
      toast.success("Convênio criado com sucesso!");
      partnershipsList.refetch();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar convênio");
    },
  });

  const updatePartnership = trpc.partnerships.update.useMutation({
    onSuccess: () => {
      toast.success("Convênio atualizado com sucesso!");
      partnershipsList.refetch();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar convênio");
    },
  });

  const deletePartnership = trpc.partnerships.delete.useMutation({
    onSuccess: () => {
      toast.success("Convênio deletado com sucesso!");
      partnershipsList.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao deletar convênio");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      logo: "",
      website: "",
      category: "",
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updatePartnership.mutateAsync({
        id: editingId,
        ...formData,
      });
    } else {
      await createPartnership.mutateAsync(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">
          Gerenciar Convênios
        </h2>
        <Button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-primary hover:bg-primary-dark text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Convênio
        </Button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <Card className="p-6 border-0 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Nome da Empresa
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nome da empresa"
                required
              />
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
                placeholder="Descrição do convênio"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Categoria
              </label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Ex: Financeiro, Saúde, Educação"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                URL do Logo
              </label>
              <Input
                value={formData.logo}
                onChange={(e) =>
                  setFormData({ ...formData, logo: e.target.value })
                }
                placeholder="https://..."
                type="url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Website
              </label>
              <Input
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="https://..."
                type="url"
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
                disabled={createPartnership.isPending || updatePartnership.isPending}
              >
                {editingId ? "Atualizar" : "Criar"} Convênio
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Partnerships List */}
      <div className="space-y-4">
        {partnershipsList.isLoading ? (
          <p className="text-center text-text-secondary">Carregando convênios...</p>
        ) : partnershipsList.data && partnershipsList.data.length > 0 ? (
          partnershipsList.data.map((item) => (
            <Card key={item.id} className="p-4 border-0 shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-text-primary">{item.name}</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {item.category}
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
                        name: item.name,
                        description: item.description || "",
                        logo: item.logo || "",
                        website: item.website || "",
                        category: item.category || "",
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
                    onClick={() => deletePartnership.mutate(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-text-secondary py-8">
            Nenhum convênio criado ainda
          </p>
        )}
      </div>
    </div>
  );
}
