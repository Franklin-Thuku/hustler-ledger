import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import LogoTicker from "../components/LogoTicker";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import WhatsApp from "../components/WhatsApp";

export default function Home() {
  return (
    <main className="bg-forest relative">
      <Navbar /> {/* Header */}
      <Hero />
      <LogoTicker /> 
      <HowItWorks />
      <Features /> {/* White background section handled in component */}
      <Testimonials />
      <CTA />
      <Footer /> {/* Footer */}
      <WhatsApp />
    </main>
  );
}