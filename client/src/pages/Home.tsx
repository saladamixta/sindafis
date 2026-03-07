import { useEffect } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import QuickNavCards from "@/components/QuickNavCards";
import Footer from "@/components/Footer";
import NewsSection from "@/components/NewsSection";
import PartnershipsSection from "@/components/PartnershipsSection";
import TransparencySection from "@/components/TransparencySection";
import MembershipCTA from "@/components/MembershipCTA";

export default function Home() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const siteUrl = window.location.origin;
    const canonicalUrl = `${siteUrl}/`;
    const ogImage = `${siteUrl}/og-home.jpg`;

    const ensureMeta = (attr: "name" | "property", value: string, content: string) => {
      let el = document.head.querySelector(`meta[${attr}="${value}"]`) as HTMLMetaElement | null;

      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }

      el.setAttribute("content", content);
    };

    const ensureCanonical = (href: string) => {
      let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }

      link.setAttribute("href", href);
    };

    document.title = "SINDAFIS | Sindicato dos Auditores Fiscais";

    ensureCanonical(canonicalUrl);

    ensureMeta(
      "name",
      "description",
      "Portal institucional do SINDAFIS com notícias, transparência, convênios e informações para filiados."
    );

    ensureMeta("property", "og:locale", "pt_BR");
    ensureMeta("property", "og:type", "website");
    ensureMeta("property", "og:title", "SINDAFIS | Sindicato dos Auditores Fiscais");
    ensureMeta(
      "property",
      "og:description",
      "Portal institucional do SINDAFIS com notícias, transparência, convênios e informações para filiados."
    );
    ensureMeta("property", "og:url", canonicalUrl);
    ensureMeta("property", "og:site_name", "SINDAFIS");
    ensureMeta("property", "og:image", ogImage);
    ensureMeta("property", "og:image:alt", "SINDAFIS");
    ensureMeta("property", "og:image:width", "1200");
    ensureMeta("property", "og:image:height", "630");

    ensureMeta("name", "twitter:card", "summary_large_image");
    ensureMeta("name", "twitter:title", "SINDAFIS | Sindicato dos Auditores Fiscais");
    ensureMeta(
      "name",
      "twitter:description",
      "Portal institucional do SINDAFIS com notícias, transparência, convênios e informações para filiados."
    );
    ensureMeta("name", "twitter:image", ogImage);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-16 md:pt-20">
        <section id="home">
          <HeroBanner />
        </section>

        <QuickNavCards />

        <section id="news">
          <NewsSection />
        </section>

        <section id="partnerships">
          <PartnershipsSection />
        </section>

        <section id="transparency">
          <TransparencySection />
        </section>

        <section id="membership">
          <MembershipCTA />
        </section>
      </main>

      <Footer />
    </div>
  );
}
