"use client";
import { motion } from "framer-motion";

const steps = [
  { 
    title: "Record your Hustle", 
    desc: "Log sales instantly. No more messy notebooks or lost receipts. Just clean, digital records.",
    img: "/step1.avif",
    tag: "STEP 01"
  },
  { 
    title: "Build your Score", 
    desc: "Our AI analyzes your data to build a financial ID that banks and suppliers actually trust.",
    img: "/step2.jpg",
    tag: "STEP 02"
  },
  { 
    title: "Scale to the Limit", 
    desc: "Access asset financing for new equipment or motorcycles to take your business to the next level.",
    img: "/step3.jpg", // Verified as .jpg
    tag: "STEP 03"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#0a0f0d]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-white text-5xl md:text-8xl font-black mb-24 text-center tracking-tighter uppercase italic neon-glow">
          The <span className="text-lime">Evolution.</span>
        </h2>

        {steps.map((step, i) => (
          <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center mb-40 last:mb-0`}>
            
            {/* Text Side - Optimized for Mobile Centering */}
            <motion.div 
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 text-center md:text-left"
            >
              <span className="text-lime font-mono font-bold tracking-[0.4em] text-sm mb-6 block">
                {step.tag}
              </span>
              <h3 className="text-white text-5xl md:text-7xl font-black mb-8 leading-[0.85] uppercase italic">
                {step.title}
              </h3>
              <p className="text-gray-300 text-xl leading-relaxed max-w-md mx-auto md:mx-0 font-medium">
                {step.desc}
              </p>
            </motion.div>

            {/* Image Side */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border-4 border-white/5 shadow-2xl group">
                <img 
                  src={step.img} 
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d]/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}