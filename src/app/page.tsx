import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import LogoTicker from "../components/LogoTicker"; // New
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer"; // New
import WhatsApp from "../components/WhatsApp";

export default function Home() {
  return (
    <main className="bg-[#0a0f0d]">
      <Navbar />
      <Hero />
      <LogoTicker /> 
      <HowItWorks />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
      <WhatsApp />
    </main>
  );
}