import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import QuickNavCards from "@/components/QuickNavCards";
import Footer from "@/components/Footer";
import NewsSection from "@/components/NewsSection";
import PartnershipsSection from "@/components/PartnershipsSection";
import TransparencySection from "@/components/TransparencySection";
import MembershipCTA from "@/components/MembershipCTA";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Add top padding to account for fixed header */}
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
