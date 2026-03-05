import { Mail, Phone, MapPin } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663206559842/i3TzkeMe6jQM3myXMV2Pah/logo_sindafis_f42930f5.png";

export default function Footer() {
  return (
    <footer className="bg-text-primary text-white py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <img
              src={LOGO_URL}
              alt="SINDAFIS"
              className="h-12 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-sm text-gray-300">
              Sindicato dos Auditores Fiscais de Campo Grande - MS
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-primary-light transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary-light transition-colors">
                  O Sindicato
                </a>
              </li>
              <li>
                <a href="#membership" className="hover:text-primary-light transition-colors">
                  Filie-se
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-primary-light transition-colors">
                  Notícias
                </a>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Informações</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#partnerships" className="hover:text-primary-light transition-colors">
                  Convênios
                </a>
              </li>
              <li>
                <a href="#partners" className="hover:text-primary-light transition-colors">
                  Parceiros
                </a>
              </li>
              <li>
                <a href="#transparency" className="hover:text-primary-light transition-colors">
                  Transparência
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary-light transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <a href="mailto:contato@sindafis.org.br" className="hover:text-primary-light transition-colors">
                  contato@sindafis.org.br
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                <a href="tel:+556733334444" className="hover:text-primary-light transition-colors">
                  (67) 3333-4444
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Campo Grande, MS</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2026 SINDAFIS. Todos os direitos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#privacy" className="hover:text-primary-light transition-colors">
                Política de Privacidade
              </a>
              <a href="#terms" className="hover:text-primary-light transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
