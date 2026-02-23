"use client";
import { motion } from "framer-motion";

export default function Features() {
  return (
    <section className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* Incredible Word Styling */}
        <div className="z-20">
          <h2 className="text-jungle text-[clamp(2.5rem,7vw,4.5rem)] font-black italic uppercase leading-[0.8] tracking-tighter mb-8">
            Build a <br />
            <span className="hustler-incredible">Financial Identity.</span>
          </h2>
          <p className="text-gray-400 text-xl mb-12 max-w-md font-medium">
            We convert your daily cash flow into a verified credit score.
          </p>
          <div className="space-y-4">
            {["Transaction Tracking", "Credit Score Generation"].map((item) => (
              <div key={item} className="flex items-center gap-4 bg-gray-50 p-5 rounded-[2rem] border border-gray-100 font-black italic text-jungle/60">
                <div className="w-6 h-6 rounded-full bg-hustler-lime flex items-center justify-center text-jungle">✓</div>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* The Layered Phone Stack */}
        <div className="relative h-[650px] flex items-center justify-center md:justify-end md:pr-40">
          
          {/* Peeping White Phone (Behind) - Pulled Out significantly */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 220, opacity: 1 }} /* Pulled out further for full visibility */
            className="absolute w-64 h-[520px] bg-white border-[1px] border-gray-200 rounded-[3rem] shadow-2xl z-0 flex flex-col items-center justify-center p-8"
          >
            <div className="text-center breathe">
              <span className="text-7xl font-black italic text-jungle leading-none">785</span>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-hustler-lime mt-4">EXCELLENT</p>
            </div>
            <div className="w-full mt-12 space-y-3 opacity-10">
               <div className="h-2 bg-gray-300 rounded-full w-20 mx-auto" />
               <div className="h-10 bg-gray-100 rounded-2xl w-full" />
            </div>
          </motion.div>

          {/* Primary Jungle Phone (Front) */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="w-72 h-[560px] bg-jungle rounded-[3.5rem] border-[10px] border-jungle shadow-[0_50px_100px_rgba(0,0,0,0.4)] z-10 p-8 relative"
          >
            <div className="h-1.5 w-14 bg-white/10 rounded-full mx-auto mb-12" />
            <div className="bg-hustler-lime/20 h-14 w-full rounded-2xl mb-8 flex items-center px-5">
               <div className="h-2.5 w-24 bg-hustler-lime rounded-full" />
            </div>
            <div className="space-y-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-white/[0.03] rounded-3xl border border-white/5" />
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}