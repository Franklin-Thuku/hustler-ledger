"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Features() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const phone1Y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const phone2Y = useTransform(scrollYProgress, [0, 1], [250, -250]);

  return (
    <section ref={ref} className="py-24 bg-white overflow-hidden perspective-1000">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Content */}
        <div>
          <h2 className="text-forest text-5xl md:text-7xl font-extrabold tracking-tighter leading-none">
            Build a Financial <br />
            <span className="opacity-30">Identity.</span>
          </h2>
          <p className="mt-8 text-gray-600 text-xl leading-relaxed max-w-md">
            We convert your daily cash flow into a verified credit score. No more being "invisible" to banks.
          </p>
          
          <div className="mt-12 space-y-4">
            {['Transaction Tracking', 'Credit Score Generation', 'Instant Statements'].map((item, i) => (
              <motion.div 
                key={item} 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-forest/5 border border-forest/10 hover:bg-lime/10 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-lime flex items-center justify-center text-forest font-bold group-hover:scale-110 transition-transform">✓</div>
                <span className="font-bold text-forest text-lg">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Interactive Phones */}
        <div className="relative h-[600px] md:h-[800px] flex items-center justify-center">
          
          {/* Phone Mockup 1: Transaction Ledger */}
          <motion.div 
            style={{ y: phone1Y }}
            whileHover={{ scale: 1.05, rotateY: -10, rotateX: 5 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute left-0 top-0 w-3/5 aspect-[9/19] bg-forest rounded-[3rem] border-[8px] border-forest-light shadow-2xl overflow-hidden cursor-pointer z-20"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="w-12 h-2 bg-white/20 rounded-full mx-auto mb-8" />
              <div className="space-y-4">
                <div className="h-24 w-full bg-lime/10 rounded-2xl border border-lime/20 p-4">
                    <div className="h-2 w-1/2 bg-lime/40 rounded mb-2" />
                    <div className="h-4 w-3/4 bg-lime rounded" />
                </div>
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                    <div className="w-8 h-8 rounded bg-white/10" />
                    <div className="flex-1 space-y-2">
                        <div className="h-2 w-1/2 bg-white/20 rounded" />
                        <div className="h-1 w-1/3 bg-white/10 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Phone Mockup 2: Credit Score */}
          <motion.div 
            style={{ y: phone2Y }}
            whileHover={{ scale: 1.05, rotateY: 10, rotateX: 5 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute right-0 top-20 w-3/5 aspect-[9/19] bg-white rounded-[3rem] border-[8px] border-gray-100 shadow-2xl overflow-hidden cursor-pointer z-10"
          >
            <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 rounded-full border-[10px] border-lime flex items-center justify-center mb-4">
                    <span className="text-forest text-4xl font-black">785</span>
                </div>
                <p className="text-forest font-black uppercase tracking-tighter text-xl">Excellent</p>
                <div className="mt-6 w-full space-y-2">
                    <div className="h-2 w-full bg-gray-100 rounded" />
                    <div className="h-2 w-4/5 bg-gray-100 rounded" />
                </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}