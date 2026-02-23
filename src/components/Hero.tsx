"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center bg-jungle">
      <div className="w-full max-w-5xl z-10">
        <header className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white hustler-heading"
          >
            EMPOWERING <br />
            <span className="breathe">INFORMAL SECTOR.</span>
          </motion.h1>
          
          <p className="text-white/80 mt-10 text-xl md:text-3xl font-medium tracking-tight">
            Building financial identities for <span className="text-hustler-lime font-black italic">Growth.</span>
          </p>
          <p className="text-white/40 mt-6 text-sm md:text-lg max-w-xl mx-auto leading-tight">
            The ledger that turns your daily hustle into a bankable future.
          </p>
        </header>

        <div className="flex flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#ffffff" }}
            onClick={() => router.push("/onboarding")}
            className="bg-hustler-lime text-jungle px-10 py-4 rounded-full font-black text-lg uppercase italic transition-all shadow-2xl"
          >
            Start My Ledger
          </motion.button>
          <button className="border border-white/10 text-white px-10 py-4 rounded-full font-bold text-base uppercase backdrop-blur-sm">
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
}