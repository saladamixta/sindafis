import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Seja parte do SINDAFIS
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Junte-se a centenas de auditores fiscais que confiam em nossa representação e fortaleça sua carreira.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1 text-white" />
                  <span className="text-base">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            {!showForm && (
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 font-semibold text-lg px-8 py-6 rounded-lg transition-all"
                onClick={() => setShowForm(true)}
              >
                Filie-se agora
              </Button>
            )}
          </div>

          {/* Right side - Form */}
          {showForm && (
            <div className="bg-white rounded-lg p-8 shadow-2xl">
              <MembershipForm />
              <button
                onClick={() => setShowForm(false)}
                className="mt-4 w-full text-center text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Voltar
              </button>
            </div>
          )}
        </div>

        {/* Additional Info */}
        {!showForm && (
          <p className="mt-12 text-white/80 text-sm text-center">
            Dúvidas? Entre em contato conosco pelo email <strong>contato@sindafis.org.br</strong> ou telefone <strong>(67) 3333-4444</strong>
          </p>
        )}
      </div>
    </section>
  );
}
