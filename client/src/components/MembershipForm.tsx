import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

export default function MembershipForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const createMembership = trpc.memberships.create.useMutation({
    onSuccess: () => {
      toast.success("Solicitação de filiação enviada com sucesso!");
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", cpf: "" });
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao enviar solicitação");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    await createMembership.mutateAsync(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <Card className="p-8 border-0 shadow-lg text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          Solicitação Enviada!
        </h3>
        <p className="text-text-secondary mb-4">
          Obrigado por se interessar em se filiar ao SINDAFIS. Sua solicitação foi
          recebida e será analisada em breve. Você receberá um email com a resposta.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8 border-0 shadow-lg">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Solicitar Filiação
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Nome Completo *
          </label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome completo"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Email *
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Telefone
            </label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(67) 99999-9999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              CPF
            </label>
            <Input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-all"
            disabled={createMembership.isPending}
          >
            {createMembership.isPending ? "Enviando..." : "Solicitar Filiação"}
          </Button>
        </div>

        <p className="text-xs text-text-secondary text-center">
          Seus dados serão utilizados apenas para processamento da filiação
        </p>
      </form>
    </Card>
  );
}
