import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import NewsManagement from "@/components/admin/NewsManagement";
import PartnershipsManagement from "@/components/admin/PartnershipsManagement";
import TransparencyManagement from "@/components/admin/TransparencyManagement";
import MembershipsManagement from "@/components/admin/MembershipsManagement";
import { useLocation } from "wouter";

type AdminTab = "news" | "partnerships" | "transparency" | "memberships";

export default function Admin() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("news");

  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Carregando...</p>
        </div>
      </div>
    );
  }

  if (user && user.role !== "admin") {
    return null;
  }

  const tabs = [
    { id: "news" as AdminTab, label: "Notícias" },
    { id: "partnerships" as AdminTab, label: "Convênios" },
    { id: "transparency" as AdminTab, label: "Transparência" },
    { id: "memberships" as AdminTab, label: "Filiações" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Painel Administrativo
          </h1>
          <p className="text-text-secondary mt-2">
            Gerencie o conteúdo do site SINDAFIS
          </p>
        </div>

        {user ? (
          <>
            <div className="border-b border-gray-border">
              <div className="flex gap-4 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              {activeTab === "news" && <NewsManagement />}
              {activeTab === "partnerships" && <PartnershipsManagement />}
              {activeTab === "transparency" && <TransparencyManagement />}
              {activeTab === "memberships" && <MembershipsManagement />}
            </div>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
