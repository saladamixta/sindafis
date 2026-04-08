import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface MembershipCardProps {
  name: string;
  membershipCode: string;
  qrCodeUrl?: string;
  photoUrl?: string;
  approvedAt?: Date;
  expiresAt?: Date;
  status: string;
}

/**
 * Componente de Carteirinha Digital
 * Exibe a carteirinha do filiado com QR Code e código único
 */
export default function MembershipCard({
  name,
  membershipCode,
  qrCodeUrl,
  photoUrl,
  approvedAt,
  expiresAt,
  status,
}: MembershipCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(membershipCode);
    setCopied(true);
    toast.success("Código copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCard = () => {
    // Implementar download da carteirinha como PDF
    toast.info("Download em desenvolvimento");
  };

  const isExpired = expiresAt && new Date() > expiresAt;
  const isActive = status === "active" && !isExpired;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Carteirinha - Frente */}
      <Card className="bg-gradient-to-br from-primary to-primary-dark text-white p-8 rounded-xl shadow-2xl border-0 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Seção Esquerda - Foto e Info */}
          <div className="md:col-span-1 flex flex-col items-center">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={name}
                className="w-32 h-40 rounded-lg object-cover mb-4 border-4 border-white"
              />
            ) : (
              <div className="w-32 h-40 rounded-lg bg-white/20 mb-4 flex items-center justify-center border-4 border-white">
                <span className="text-white/50 text-sm text-center px-2">Sem foto</span>
              </div>
            )}
            <div className="text-center">
              <p className="text-xs text-white/70 uppercase tracking-wider">Filiado</p>
              <p className="font-bold text-lg mt-1">{name}</p>
            </div>
          </div>

          {/* Seção Central - QR Code */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            {qrCodeUrl ? (
              <div className="bg-white p-3 rounded-lg">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-32 h-32"
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white/50 text-xs text-center">QR Code</span>
              </div>
            )}
            <p className="text-xs text-white/70 mt-3 text-center">Escaneie para validar</p>
          </div>

          {/* Seção Direita - Informações */}
          <div className="md:col-span-1 flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <p className="text-xs text-white/70 uppercase tracking-wider">Código</p>
                <p className="font-mono font-bold text-lg break-all">{membershipCode}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-white/70 uppercase tracking-wider">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isActive ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                  <span className="font-semibold">
                    {isActive ? "Ativa" : isExpired ? "Expirada" : "Inativa"}
                  </span>
                </div>
              </div>

              {approvedAt && (
                <div className="mb-2">
                  <p className="text-xs text-white/70 uppercase tracking-wider">Desde</p>
                  <p className="font-semibold">
                    {new Date(approvedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}

              {expiresAt && (
                <div>
                  <p className="text-xs text-white/70 uppercase tracking-wider">Válida até</p>
                  <p className={`font-semibold ${isExpired ? "text-red-300" : ""}`}>
                    {new Date(expiresAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}
            </div>

            {/* Logo SINDAFIS */}
            <div className="text-center mt-4">
              <p className="text-xs text-white/70">SINDAFIS</p>
              <p className="text-xs text-white/70">Campo Grande - MS</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Ações */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Button
          onClick={handleCopyCode}
          variant="outline"
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar Código
            </>
          )}
        </Button>

        <Button
          onClick={handleDownloadCard}
          className="gap-2 bg-primary hover:bg-primary-dark"
        >
          <Download className="w-4 h-4" />
          Baixar Carteirinha
        </Button>
      </div>

      {/* Informações de Uso */}
      <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Como usar sua carteirinha:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Apresente a carteirinha nas empresas conveniadas para garantir seus benefícios</li>
          <li>✓ Escaneie o QR Code para validação rápida</li>
          <li>✓ Guarde seu código: {membershipCode}</li>
          <li>✓ Carteirinha válida até {expiresAt ? new Date(expiresAt).toLocaleDateString("pt-BR") : "indefinidamente"}</li>
        </ul>
      </Card>
    </div>
  );
}
