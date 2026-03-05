import { Button } from "@/components/ui/button";
import { Users, CheckCircle } from "lucide-react";
import { useState } from "react";
import MembershipForm from "./MembershipForm";

const benefits = [
  "Representação legal e sindical",
  "Acesso a convênios exclusivos",
  "Participação em assembleias",
  "Suporte jurídico especializado",
  "Benefícios e descontos",
  "Rede de profissionais",
];

export default function MembershipCTA() {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary-dark text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -ml-36 -mb-36"></div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-8">
            <Users className="w-12 h-12 flex-shrink-0" />
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Filie-se ao SINDAFIS
              </h2>
              <p className="text-xl text-white/90">
                Junte-se a centenas de auditores fiscais que confiam em nossa representação
              </p>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons or Form */}
          {!showForm ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 font-semibold text-lg px-8 py-6 rounded-lg transition-all"
                onClick={() => setShowForm(true)}
              >
                Solicitar Filiação
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 rounded-lg transition-all"
              >
                Saiba Mais
              </Button>
            </div>
          ) : (
            <div className="max-w-md mx-auto bg-white rounded-lg p-6">
              <MembershipForm />
              <button
                onClick={() => setShowForm(false)}
                className="mt-4 w-full text-center text-gray-600 hover:text-gray-800 text-sm"
              >
                Voltar
              </button>
            </div>
          )}

          {/* Additional Info */}
          <p className="mt-8 text-white/80 text-sm">
            Dúvidas? Entre em contato conosco pelo email contato@sindafis.org.br ou telefone (67) 3333-4444
          </p>
        </div>
      </div>
    </section>
  );
}
