import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663206559842/i3TzkeMe6jQM3myXMV2Pah/logo_sindafis_6a469ff2.png";

const menuItems = [
  { label: "Início", href: "#home" },
  { label: "O Sindicato", href: "#about" },
  { label: "Filie-se", href: "#membership" },
  { label: "Notícias", href: "#news" },
  { label: "Convênios", href: "#partnerships" },
  { label: "Parceiros", href: "#partners" },
  { label: "Transparência", href: "#transparency" },
  { label: "Contato", href: "#contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-border shadow-sm">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src={LOGO_URL}
            alt="SINDAFIS"
            className="h-12 md:h-16 w-auto"
          />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-text-primary hover:text-primary hover:bg-primary-light rounded-md transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-bg transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-text-primary" />
          ) : (
            <Menu className="w-6 h-6 text-text-primary" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-border">
          <nav className="container py-4 flex flex-col gap-2">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-text-primary hover:text-primary hover:bg-primary-light rounded-md transition-colors block"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
