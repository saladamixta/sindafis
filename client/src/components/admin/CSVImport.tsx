import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Upload, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import Papa from "papaparse";

interface CSVRow {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  professionalRegistration?: string;
}

/**
 * Componente de Importação CSV para Filiados
 * Permite importar múltiplos filiados via arquivo CSV
 */
export default function CSVImport() {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const importMutation = trpc.memberships.importCSV.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.successCount} filiados importados com sucesso!`);
      if (data.errorCount > 0) {
        toast.warning(`${data.errorCount} registros com erro`);
      }
      setFile(null);
      setCSVData([]);
      setPreview(false);
      setErrors([]);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao importar CSV");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      toast.error("Por favor, selecione um arquivo CSV");
      return;
    }

    setFile(selectedFile);
    setErrors([]);

    // Parse CSV
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const data = (results.data as any[]).filter(
          (row) => Object.values(row).some((v) => v)
        ) as CSVRow[];
        const validationErrors: string[] = [];

        // Validar dados
        data.forEach((row, index) => {
          const name = row.name as string | undefined;
          const email = row.email as string | undefined;
          
          if (!name || !name.trim()) {
            validationErrors.push(`Linha ${index + 2}: Nome é obrigatório`);
          }
          if (!email || !email.trim()) {
            validationErrors.push(`Linha ${index + 2}: Email é obrigatório`);
          } else if (!email.includes("@")) {
            validationErrors.push(`Linha ${index + 2}: Email inválido`);
          }
        });

        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          toast.error(`${validationErrors.length} erros encontrados`);
        }

        setCSVData(data);
        setPreview(true);
      },
      error: (error: any) => {
        toast.error(`Erro ao processar CSV: ${error.message}`);
      },
    });
  };

  const handleImport = () => {
    if (csvData.length === 0) {
      toast.error("Nenhum dado para importar");
      return;
    }

    if (errors.length > 0) {
      toast.error("Corrija os erros antes de importar");
      return;
    }

    // Filtrar e garantir tipos corretos
    const validData = csvData
      .filter((row) => row.name && row.email)
      .map((row) => ({
        name: row.name || "",
        email: row.email || "",
        phone: row.phone,
        cpf: row.cpf,
        professionalRegistration: row.professionalRegistration,
      }));

    importMutation.mutate({ csvData: validData })
  };

  const downloadTemplate = () => {
    const template = `name,email,phone,cpf,professionalRegistration
João Silva,joao@example.com,67999999999,12345678900,AUDIT-001
Maria Santos,maria@example.com,67988888888,98765432100,AUDIT-002`;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(template)
    );
    element.setAttribute("download", "template_filiados.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("Template baixado!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Importar Filiados via CSV
        </h2>
        <p className="text-text-secondary">
          Importe múltiplos filiados de uma vez usando um arquivo CSV
        </p>
      </div>

      {/* Upload Section */}
      <Card className="p-6 border-2 border-dashed border-gray-border hover:border-primary transition-colors">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold text-text-primary">Selecione um arquivo CSV</p>
              <p className="text-sm text-text-secondary">
                Ou arraste e solte um arquivo aqui
              </p>
            </div>
          </div>

          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="cursor-pointer"
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={downloadTemplate}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Baixar Template
            </Button>
          </div>
        </div>
      </Card>

      {/* Errors */}
      {errors.length > 0 && (
        <Card className="p-4 bg-red-50 border-l-4 border-red-600">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-2">Erros encontrados:</h4>
              <ul className="text-sm text-red-800 space-y-1">
                {errors.slice(0, 5).map((error, i) => (
                  <li key={i}>• {error}</li>
                ))}
                {errors.length > 5 && (
                  <li>• ... e mais {errors.length - 5} erros</li>
                )}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Preview */}
      {preview && csvData.length > 0 && errors.length === 0 && (
        <Card className="p-6 bg-green-50 border-l-4 border-green-600">
          <div className="flex gap-3 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900">
                {csvData.length} registros prontos para importar
              </h4>
              <p className="text-sm text-green-800">
                Verifique os dados abaixo antes de confirmar
              </p>
            </div>
          </div>

          {/* Data Preview Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-green-200">
                  <th className="text-left py-2 px-3 font-semibold text-green-900">Nome</th>
                  <th className="text-left py-2 px-3 font-semibold text-green-900">Email</th>
                  <th className="text-left py-2 px-3 font-semibold text-green-900">Telefone</th>
                  <th className="text-left py-2 px-3 font-semibold text-green-900">CPF</th>
                  <th className="text-left py-2 px-3 font-semibold text-green-900">Registro</th>
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 10).map((row, i) => (
                  <tr key={i} className="border-b border-green-100 hover:bg-green-100/50">
                    <td className="py-2 px-3 text-green-900">{(row.name as string) || ""}</td>
                    <td className="py-2 px-3 text-green-900 text-xs">{(row.email as string) || ""}</td>
                    <td className="py-2 px-3 text-green-900 text-xs">{(row.phone as string) || "-"}</td>
                    <td className="py-2 px-3 text-green-900 text-xs">{(row.cpf as string) || "-"}</td>
                    <td className="py-2 px-3 text-green-900 text-xs">
                      {(row.professionalRegistration as string) || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {csvData.length > 10 && (
            <p className="text-sm text-green-800 mt-3">
              ... e mais {csvData.length - 10} registros
            </p>
          )}
        </Card>
      )}

      {/* Import Button */}
      {preview && csvData.length > 0 && errors.length === 0 && (
        <div className="flex gap-2">
          <Button
            onClick={handleImport}
            disabled={importMutation.isPending}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            {importMutation.isPending ? "Importando..." : "Confirmar Importação"}
          </Button>
          <Button
            onClick={() => {
              setFile(null);
              setCSVData([]);
              setPreview(false);
              setErrors([]);
            }}
            variant="outline"
          >
            Cancelar
          </Button>
        </div>
      )}

      {/* Instructions */}
      <Card className="p-4 bg-blue-50 border-l-4 border-blue-600">
        <h4 className="font-semibold text-blue-900 mb-2">Formato do CSV:</h4>
        <p className="text-sm text-blue-800 mb-3">
          O arquivo deve conter as seguintes colunas (a primeira linha deve ser o cabeçalho):
        </p>
        <ul className="text-sm text-blue-800 space-y-1 font-mono bg-white p-3 rounded border border-blue-200">
          <li>• <span className="font-semibold">name</span> (obrigatório)</li>
          <li>• <span className="font-semibold">email</span> (obrigatório)</li>
          <li>• <span className="font-semibold">phone</span> (opcional)</li>
          <li>• <span className="font-semibold">cpf</span> (opcional)</li>
          <li>• <span className="font-semibold">professionalRegistration</span> (opcional)</li>
        </ul>
      </Card>
    </div>
  );
}
