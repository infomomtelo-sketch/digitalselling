import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { TrustBar, SalesToast } from "@/components/TrustSignals";
import BentoProducts from "@/components/BentoProducts";
import TemplateCarousel from "@/components/TemplateCarousel";
import Testimonials from "@/components/Testimonials";
import Features from "@/components/Features";
import EmailCapture from "@/components/EmailCapture";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustBar />
      <BentoProducts />
      <TemplateCarousel />
      <Testimonials />
      <Features />
      <EmailCapture />
      <Pricing />
      <CTA />
      <Footer />
      <SalesToast />
    </div>
  );
};

export default Index;
