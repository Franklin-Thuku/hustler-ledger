"use client";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center backdrop-blur-md bg-forest/80 border border-white/10 p-4 rounded-2xl shadow-2xl">
        <div className="text-white font-black text-xl tracking-tighter">
          HUSTLER<span className="text-lime">LEDGER</span>
        </div>
        
        {/* Hidden on small phones, shows on PC */}
        <div className="hidden md:flex gap-8 text-white/70 text-sm font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-lime transition-colors">Features</a>
          <a href="#" className="hover:text-lime transition-colors">Testimonials</a>
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="bg-lime text-forest px-6 py-2 rounded-xl font-bold text-sm"
        >
          Get App
        </motion.button>
      </div>
    </nav>
  );
}