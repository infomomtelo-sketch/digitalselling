import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BentoProducts from "@/components/BentoProducts";
import Testimonials from "@/components/Testimonials";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <BentoProducts />
      <Testimonials />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
