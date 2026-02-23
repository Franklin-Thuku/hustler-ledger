"use client";
import { motion } from "framer-motion";

const reviews = [
  { name: "Jane W.", role: "Wholesale Grocer", text: "I used to lose my records every month. Now my credit score is 750 and I just got a stock loan." },
  { name: "David M.", role: "Boda Boda Owner", text: "This ledger proved my income when the bank said no. I just added two more bikes to my fleet." },
  { name: "Sarah O.", role: "Salon Tech", text: "Simple, fast, and it actually works on my old Android phone. My business feels 'official' now." }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#0a0f0d]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-white text-4xl md:text-6xl font-black uppercase italic leading-none">
            Real Stories. <br />
            <span className="text-lime neon-glow">Real Growth.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-between"
            >
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                "{rev.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-lime to-forest flex items-center justify-center font-bold text-forest">
                  {rev.name[0]}
                </div>
                <div>
                  <h4 className="text-white font-bold">{rev.name}</h4>
                  <p className="text-lime text-xs font-bold uppercase tracking-widest">{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}