"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function RegisterBusiness() {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const step = 1; 

  return (
    <main className="min-h-screen bg-[#0a0f0d] flex flex-col items-center justify-center px-6 relative">
      
      {/* 1. Progress Bars */}
      <div className="absolute top-12 w-full max-w-md flex gap-3 px-4">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex-1">
            <div className={`h-1.5 rounded-full transition-all duration-500 ${num <= step ? 'bg-lime shadow-[0_0_10px_#c1ff72]' : 'bg-white/10'}`} />
          </div>
        ))}
      </div>

      {/* 2. The Visible Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-[#121815] border border-white/10 p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
      >
        <header className="mb-10 text-left">
          <h1 className="text-white text-4xl font-black uppercase italic tracking-tighter">
            Register Business
          </h1>
          <p className="text-white/40 text-sm mt-2 font-bold tracking-widest uppercase">Step 01: Core Details</p>
        </header>
        
        <form className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Business Title</label>
            <input 
              type="text"
              value={formData.title}
              className="w-full bg-white text-black rounded-2xl p-5 text-lg font-bold outline-none border-4 border-transparent focus:border-lime/40 transition-all shadow-inner"
              placeholder="e.g. Mama Mboga Fresh"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Brief Description</label>
            <textarea 
              value={formData.description}
              rows={4}
              className="w-full bg-white text-black rounded-2xl p-5 text-lg font-bold outline-none border-4 border-transparent focus:border-lime/40 transition-all resize-none shadow-inner"
              placeholder="What do you sell or do?"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Solid Lime Button for maximum visibility */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="w-full bg-lime text-[#062d1a] py-6 rounded-full font-[950] text-xl uppercase italic shadow-[0_20px_50px_rgba(193,255,114,0.2)] mt-6"
          >
            Continue
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}