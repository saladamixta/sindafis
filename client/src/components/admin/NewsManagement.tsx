import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function NewsManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
  });

  const newsList = trpc.news.list.useQuery();
  const createNews = trpc.news.create.useMutation({
    onSuccess: () => {
      toast.success("Notícia criada com sucesso!");
      newsList.refetch();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar notícia");
    },
  });

  const updateNews = trpc.news.update.useMutation({
    onSuccess: () => {
      toast.success("Notícia atualizada com sucesso!");
      newsList.refetch();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar notícia");
    },
  });

  const deleteNews = trpc.news.delete.useMutation({
    onSuccess: () => {
      toast.success("Notícia deletada com sucesso!");
      newsList.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao deletar notícia");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateNews.mutateAsync({
        id: editingId,
        ...formData,
      });
    } else {
      await createNews.mutateAsync(formData);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">
          Gerenciar Notícias
        </h2>
        <Button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-primary hover:bg-primary-dark text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Notícia
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
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: generateSlug(e.target.value),
                  });
                }}
                placeholder="Título da notícia"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Slug
              </label>
              <Input
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="slug-da-noticia"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Resumo
              </label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Resumo da notícia"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Conteúdo
              </label>
              <Textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Conteúdo completo da notícia"
                rows={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                URL da Imagem de Capa
              </label>
              <Input
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
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
                disabled={createNews.isPending || updateNews.isPending}
              >
                {editingId ? "Atualizar" : "Criar"} Notícia
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* News List */}
      <div className="space-y-4">
        {newsList.isLoading ? (
          <p className="text-center text-text-secondary">Carregando notícias...</p>
        ) : newsList.data && newsList.data.length > 0 ? (
          newsList.data.map((item) => (
            <Card key={item.id} className="p-4 border-0 shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-text-primary">{item.title}</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {item.excerpt}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setFormData({
                        title: item.title,
                        slug: item.slug,
                        excerpt: item.excerpt || "",
                        content: item.content,
                        coverImage: item.coverImage || "",
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
                    onClick={() => deleteNews.mutate(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-text-secondary py-8">
            Nenhuma notícia criada ainda
          </p>
        )}
      </div>
    </div>
  );
}
