import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { QrCode, Search, CheckCircle, AlertCircle } from "lucide-react";
import MembershipCard from "@/components/MembershipCard";

/**
 * Página pública para validar carteirinhas de filiados
 * Acessível via /validate ou /validate/:code
 */
export default function ValidateMembership() {
  const [searchCode, setSearchCode] = useState("");
  const [validatedMember, setValidatedMember] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateMutation = trpc.memberships.validate.useMutation({
    onSuccess: (data) => {
      setValidatedMember(data);
      toast.success("Carteirinha validada com sucesso!");
    },
    onError: (error) => {
      setValidatedMember(null);
      toast.error(error.message || "Erro ao validar carteirinha");
    },
    onSettled: () => {
      setIsValidating(false);
    },
  });

  const getByCodeQuery = trpc.memberships.getByCode.useQuery(
    { code: searchCode },
    { enabled: false }
  );

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) {
      toast.error("Digite um código de carteirinha");
      return;
    }

    setIsValidating(true);
    validateMutation.mutate({
      code: searchCode.trim(),
      validatedBy: "Portal de Validação",
    });
  };

  const handleScanQR = () => {
    toast.info("Funcionalidade de câmera em desenvolvimento");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-gray-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Validar Carteirinha
          </h1>
          <p className="text-text-secondary text-lg">
            Verifique a validade de uma carteirinha de filiado do SINDAFIS
          </p>
        </div>

        {/* Search Form */}
        <Card className="p-8 mb-8 border-0 shadow-lg">
          <form onSubmit={handleValidate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Código da Carteirinha
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ex: SINDAFIS-2026-00001"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                  className="flex-1"
                  disabled={isValidating}
                />
                <Button
                  type="submit"
                  disabled={isValidating}
                  className="gap-2 bg-primary hover:bg-primary-dark"
                >
                  <Search className="w-4 h-4" />
                  Validar
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-border">
              <p className="text-sm text-text-secondary mb-3">Ou escaneie o QR Code:</p>
              <Button
                type="button"
                variant="outline"
                onClick={handleScanQR}
                className="w-full gap-2"
              >
                <QrCode className="w-4 h-4" />
                Escanear QR Code
              </Button>
            </div>
          </form>
        </Card>

        {/* Resultado da Validação */}
        {validatedMember && (
          <Card className="p-8 border-0 shadow-lg mb-8">
            <div className="flex items-start gap-4 mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Carteirinha Válida
                </h2>
                <p className="text-text-secondary">
                  Filiado(a) tem direito aos benefícios do SINDAFIS
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-green-700 font-medium">Nome do Filiado</p>
                  <p className="text-lg font-bold text-green-900">{validatedMember.name}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700 font-medium">Código</p>
                  <p className="text-lg font-bold text-green-900 font-mono">
                    {validatedMember.membershipCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700 font-medium">Filiado Desde</p>
                  <p className="text-lg font-bold text-green-900">
                    {validatedMember.approvedAt
                      ? new Date(validatedMember.approvedAt).toLocaleDateString("pt-BR")
                      : "N/A"}
                  </p>
                </div>
                {validatedMember.expiresAt && (
                  <div>
                    <p className="text-sm text-green-700 font-medium">Válida Até</p>
                    <p className="text-lg font-bold text-green-900">
                      {new Date(validatedMember.expiresAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                ✓ Esta carteirinha foi validada em {new Date().toLocaleString("pt-BR")}
              </p>
            </div>
          </Card>
        )}

        {/* Mensagem de Erro */}
        {validateMutation.isError && (
          <Card className="p-8 border-0 shadow-lg mb-8 bg-red-50 border-l-4 border-red-600">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-red-900">Carteirinha Inválida</h2>
                <p className="text-red-800 mt-2">
                  {validateMutation.error?.message || "A carteirinha não pôde ser validada"}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Informações */}
        <Card className="p-6 border-0 shadow-lg bg-white">
          <h3 className="font-bold text-text-primary mb-4">Informações Importantes</h3>
          <ul className="space-y-3 text-sm text-text-secondary">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>
                Esta ferramenta permite validar carteirinhas de filiados do SINDAFIS
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>
                Digite o código da carteirinha ou escaneie o QR Code para validar
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>
                Apenas carteirinhas ativas e não expiradas serão validadas
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>
                Todas as validações são registradas para fins de auditoria
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
