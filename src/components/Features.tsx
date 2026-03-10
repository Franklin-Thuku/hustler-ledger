"use client";
import { motion } from "framer-motion";

export default function Features() {
  return (
    <section className="py-24 md:py-32 px-4 md:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        <div className="z-20 text-center md:text-left">
          <h2 className="text-jungle text-[clamp(2.5rem,8vw,4.5rem)] font-black italic uppercase leading-[0.85] tracking-tighter mb-8">
            Build a <br />
            <span className="hustler-incredible">Financial Identity.</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-md mx-auto md:mx-0 font-medium italic">
            Your daily hustle, now verified. Get the credit you deserve.
          </p>
          <div className="space-y-4 max-w-sm mx-auto md:mx-0">
            {["Transaction Tracking", "Credit Score Generation", "Instant Statements"].map((item) => (
              <div key={item} className="flex items-center gap-4 bg-gray-50 p-5 rounded-[2rem] border border-gray-100 font-black italic text-jungle/60">
                <div className="w-6 h-6 rounded-full bg-hustler-lime flex items-center justify-center text-jungle text-xs">✓</div>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Creative "Single Hero Phone" with Ghost Shadow */}
        <div className="relative h-[600px] flex items-center justify-center md:justify-end md:pr-20 mt-16 md:mt-0">
          
          {/* 1. Creative "Ghost Shadow" Peeking Behind */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.05, scale: 1.1, x: 40 }}
            className="absolute w-72 h-[560px] bg-jungle rounded-[3.5rem] blur-2xl z-0"
          />

          {/* 2. The Primary Jungle Phone */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="w-[280px] md:w-80 h-[560px] bg-jungle rounded-[3.5rem] border-[10px] border-jungle shadow-[0_50px_100px_rgba(0,0,0,0.4)] z-10 p-8 relative flex flex-col items-center"
          >
            {/* Phone Speaker */}
            <div className="h-1.5 w-14 bg-white/10 rounded-full mb-10" />

            {/* THE SCORE UI: Circular & Vibrant */}
            <div className="w-full bg-white/5 rounded-[2.5rem] border border-white/10 p-6 text-center backdrop-blur-md mb-6">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Hustler Score</p>
               <div className="w-32 h-32 rounded-full border-[10px] border-hustler-lime flex items-center justify-center mx-auto mb-4 breathe shadow-[0_0_30px_#a3e63550]">
                  <span className="text-5xl font-[950] italic text-white">785</span>
               </div>
               
               {/* Qualified Status Badge */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.5 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="inline-block bg-hustler-lime px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-jungle shadow-lg shadow-hustler-lime/20"
               >
                 Loan Qualified
               </motion.div>
            </div>

            {/* App Content Placeholders */}
            <div className="w-full space-y-4">
               <div className="h-16 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center px-4">
                  <div className="w-8 h-8 rounded bg-white/10 mr-4" />
                  <div className="h-2 w-24 bg-white/20 rounded-full" />
               </div>
               <div className="h-16 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center px-4">
                  <div className="w-8 h-8 rounded bg-white/10 mr-4" />
                  <div className="h-2 w-16 bg-white/20 rounded-full" />
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}