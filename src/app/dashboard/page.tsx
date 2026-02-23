"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [bizData, setBizData] = useState({ name: "Hustler", target: 5000, period: "Weekly" });
  const [currentSales, setCurrentSales] = useState(0);

  useEffect(() => {
    // 1. Pull the data we initialized in Step 1 & 2
    const name = localStorage.getItem("biz_name") || "Your Hustle";
    const target = Number(localStorage.getItem("target_revenue")) || 5000;
    const period = localStorage.getItem("target_period") || "Weekly";
    
    setBizData({ name, target, period });

    // 2. Simulate the 'Handshake' result by showing initial verified sales
    const timer = setTimeout(() => setCurrentSales(target * 0.42), 1000);
    return () => clearTimeout(timer);
  }, []);

  const percentage = Math.min((currentSales / bizData.target) * 100, 100);

  return (
    <main className="min-h-screen bg-[#0a0f0d] text-white p-6 pb-32">
      {/* HEADER: Identity */}
      <header className="flex justify-between items-center mb-12 pt-4">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
            {bizData.name}
          </h1>
          <p className="text-lime text-[10px] font-black uppercase tracking-widest">Verified Identity</p>
        </div>
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
          <span className="text-xl">👤</span>
        </div>
      </header>

      {/* PROGRESS: The Growth Circle */}
      <section className="relative flex flex-col items-center justify-center mb-16">
        <svg className="w-72 h-72 transform -rotate-90">
          <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
          <motion.circle
            cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="10" fill="transparent"
            strokeDasharray="816.8"
            initial={{ strokeDashoffset: 816.8 }}
            animate={{ strokeDashoffset: 816.8 - (816.8 * percentage) / 100 }}
            transition={{ duration: 2.5, ease: "circOut" }}
            className="text-lime"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.h2 
            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-black italic tracking-tighter"
          >
            {Math.round(percentage)}%
          </motion.h2>
          <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
            {bizData.period} Progress
          </span>
        </div>
      </section>

      {/* STATS: Verifiable Cash Flow */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem]">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-2">Collected</p>
          <p className="text-xl font-black italic">KES {currentSales.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem]">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-2">To Goal</p>
          <p className="text-xl font-black italic text-lime">KES {(bizData.target - currentSales).toLocaleString()}</p>
        </div>
      </div>

      {/* SCORE: The Hustler Score Badge */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        className="bg-gradient-to-r from-lime/20 to-transparent border border-lime/30 p-6 rounded-[2.5rem] flex justify-between items-center"
      >
        <div>
          <h3 className="text-white font-black italic uppercase tracking-tight text-lg">Hustler Score</h3>
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Bankability: High</p>
        </div>
        <div className="text-4xl font-black italic text-lime neon-glow">742</div>
      </motion.div>

      {/* FAB: Quick Entry Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        className="fixed bottom-10 right-8 w-20 h-20 bg-lime text-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(193,255,114,0.3)] z-50"
      >
        <span className="text-5xl font-light mb-1">+</span>
      </motion.button>
    </main>
  );
}