import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function MembershipsManagement() {
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  const membershipsList = trpc.memberships.list.useQuery();
  const updateStatus = trpc.memberships.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      membershipsList.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar status");
    },
  });

  const filteredMemberships = membershipsList.data?.filter((m) => {
    if (selectedStatus === "all") return true;
    return m.status === selectedStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-50 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "approved":
        return "Aprovado";
      case "rejected":
        return "Rejeitado";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Gerenciar Filiações
        </h2>
        <p className="text-text-secondary mb-6">
          Total de solicitações: {membershipsList.data?.length || 0}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "all" as const, label: "Todas" },
          { id: "pending" as const, label: "Pendentes" },
          { id: "approved" as const, label: "Aprovadas" },
          { id: "rejected" as const, label: "Rejeitadas" },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedStatus(filter.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === filter.id
                ? "bg-primary text-white"
                : "bg-gray-bg text-text-secondary hover:bg-gray-border"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Memberships List */}
      <div className="space-y-4">
        {membershipsList.isLoading ? (
          <p className="text-center text-text-secondary">Carregando filiações...</p>
        ) : filteredMemberships && filteredMemberships.length > 0 ? (
          filteredMemberships.map((membership) => (
            <Card key={membership.id} className="p-6 border-0 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h3 className="font-bold text-text-primary text-lg">
                    {membership.name}
                  </h3>
                  <div className="mt-3 space-y-2 text-sm">
                    <p className="text-text-secondary">
                      <span className="font-medium">Email:</span> {membership.email}
                    </p>
                    {membership.phone && (
                      <p className="text-text-secondary">
                        <span className="font-medium">Telefone:</span> {membership.phone}
                      </p>
                    )}
                    {membership.cpf && (
                      <p className="text-text-secondary">
                        <span className="font-medium">CPF:</span> {membership.cpf}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <div
                    className={`px-4 py-2 rounded-full border text-sm font-medium ${getStatusColor(
                      membership.status || ""
                    )}`}
                  >
                    {getStatusLabel(membership.status || "")}
                  </div>

                  {membership.status === "pending" && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white gap-2"
                        onClick={() =>
                          updateStatus.mutate({
                            id: membership.id,
                            status: "approved" as const,
                          })
                        }
                        disabled={updateStatus.isPending}
                      >
                        <Check className="w-4 h-4" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white gap-2"
                        onClick={() =>
                          updateStatus.mutate({
                            id: membership.id,
                            status: "rejected" as const,
                          })
                        }
                        disabled={updateStatus.isPending}
                      >
                        <X className="w-4 h-4" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-xs text-text-secondary border-t border-gray-border pt-3">
                Solicitado em:{" "}
                {new Date(membership.createdAt).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-text-secondary py-8">
            Nenhuma filiação nesta categoria
          </p>
        )}
      </div>
    </div>
  );
}
