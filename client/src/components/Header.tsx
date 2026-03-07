import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "wouter";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663206559842/i3TzkeMe6jQM3myXMV2Pah/logo_sindafis_6a469ff2.png";

const menuItems = [
  { label: "Início", href: "#home" },
  { label: "Filie-se", href: "#membership" },
  { label: "Notícias", href: "#news" },
  { label: "Convênios", href: "#partnerships" },
  { label: "Transparência", href: "#transparency" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const scrollToSection = (href: string) => {
    const id = href.replace("#", "");
    const runScroll = () => {
      const el = document.getElementById(id);
      if (!el) return;

      const headerOffset = 96;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    };

    if (location !== "/") {
      setLocation("/");
      window.setTimeout(runScroll, 250);
      return;
    }

    runScroll();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-border shadow-sm">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <button
          type="button"
          onClick={() => scrollToSection("#home")}
          className="flex-shrink-0"
          aria-label="Ir para o início"
        >
          <img
            src={LOGO_URL}
            alt="SINDAFIS"
            className="h-12 md:h-16 w-auto"
          />
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => scrollToSection(item.href)}
              className="px-3 py-2 text-sm font-medium text-text-primary hover:text-primary hover:bg-primary-light rounded-md transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-bg transition-colors"
          aria-label="Toggle menu"
          type="button"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-text-primary" />
          ) : (
            <Menu className="w-6 h-6 text-text-primary" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-border">
          <nav className="container py-4 flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToSection(item.href);
                }}
                className="px-4 py-2 text-sm font-medium text-left text-text-primary hover:text-primary hover:bg-primary-light rounded-md transition-colors block"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
