"use client";
import { motion } from "framer-motion";

const brands = ["M-PESA", "KCB BANK", "EQUITY", "SAFARICOM", "KRA", "VISA"];

export default function LogoTicker() {
  return (
    <section className="py-12 bg-[#0a0f0d] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-gray-500 text-xs font-bold tracking-[0.3em] uppercase mb-10">
          Powering the next generation of African commerce
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-20 grayscale hover:opacity-50 transition-opacity cursor-default">
          {brands.map((brand) => (
            <span key={brand} className="text-white text-xl md:text-3xl font-black italic tracking-tighter">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}