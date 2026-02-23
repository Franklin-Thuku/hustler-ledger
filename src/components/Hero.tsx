"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const targetRef = useRef(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.4], [0, -20]);

  const handleStartLedger = () => {
    router.push("/onboarding");
  };

  return (
    <section ref={targetRef} className="relative h-[150vh] w-full bg-forest">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center px-4 overflow-hidden">
        <motion.div 
          style={{ opacity, scale, y }} 
          className="w-full max-w-4xl text-center flex flex-col items-center"
        >
          <h1 className="text-[2.8rem] leading-[1.1] md:text-8xl font-black text-white tracking-tighter uppercase italic md:leading-[0.95] mb-6">
            <span className="text-lime neon-glow">Empowering</span> <br />
            Informal Sector.
          </h1>
          
          <p className="text-white/80 text-lg md:text-2xl max-w-2xl mx-auto leading-snug md:leading-relaxed mb-10 px-2">
            Building Financial Identities for Growth. The ledger that turns your daily hustle into a bankable future.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full max-w-[280px] sm:max-w-none justify-center">
            <motion.button 
              onClick={handleStartLedger}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="bg-lime text-forest px-10 py-5 rounded-full font-black text-xl shadow-2xl whitespace-nowrap"
            >
              Start My Ledger
            </motion.button>

            <motion.button 
              onClick={() => setIsDemoOpen(true)}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }} 
              whileTap={{ scale: 0.95 }}
              className="border border-white/20 text-white px-10 py-5 rounded-full font-bold text-lg backdrop-blur-sm whitespace-nowrap"
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}