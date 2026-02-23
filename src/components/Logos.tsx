"use client";
import { motion } from "framer-motion";

const brands = ["M-PESA", "EQUITY", "KCB", "CO-OP", "SAFARICOM"];

export default function Logos() {
  return (
    <section className="py-12 bg-[#0a0f0d] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-gray-500 text-xs font-bold tracking-[0.3em] uppercase mb-8">
          Integratable with your favorite platforms
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale contrast-125">
          {brands.map((brand) => (
            <span key={brand} className="text-white text-xl md:text-2xl font-black italic tracking-tighter">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}