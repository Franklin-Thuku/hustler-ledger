"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleNext = () => {
    if (businessName && description) {
      localStorage.setItem("biz_name", businessName);
      localStorage.setItem("biz_desc", description);
      router.push("/ledger-setup");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0f0d] pt-12 md:pt-20 px-6"> {/* Swapped to Deep Black */}
      <div className="max-w-md mx-auto">
        <header className="mb-10">
          <div className="flex gap-2 mb-8">
            <div className="h-1.5 w-16 bg-lime rounded-full" />
            <div className="h-1.5 w-16 bg-white/20 rounded-full" />
            <div className="h-1.5 w-16 bg-white/20 rounded-full" />
          </div>
          <h1 className="text-white text-4xl md:text-5xl font-black uppercase italic leading-[0.9] tracking-tighter">
            Identify <br /><span className="text-white/40">Your Hustle.</span>
          </h1>
          <p className="text-white/70 mt-4 text-lg font-medium">
            Define your brand. This is how the financial world will recognize you.
          </p>
        </header>

        <div className="space-y-8 mb-12">
          
          <div>
            <label className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-3 block">Business Title</label>
            <input 
              type="text"
              placeholder="e.g. Juja Furniture Workshop"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white text-xl focus:outline-none focus:border-white/40 transition-all placeholder:text-white/10"
            />
          </div>

         
          <div>
            <label className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-3 block">Brief Description</label>
            <textarea 
              rows={3}
              placeholder="e.g. We design and sell custom wooden furniture for homes and offices."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-3xl p-4 text-white text-lg focus:outline-none focus:border-white/40 transition-all placeholder:text-white/10 resize-none"
            />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          disabled={!businessName || !description}
          className={`w-full py-6 rounded-full font-black text-xl transition-all shadow-2xl ${
            businessName && description 
            ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
            : "bg-white/5 text-white/20 cursor-not-allowed"
          }`}
        >
          Initialize Ledger
        </motion.button>
        
        <p className="text-center mt-8 text-white/20 text-xs font-bold uppercase tracking-widest">
          Step 1 of 3 • Secure Encryption Active
        </p>
      </div>
    </main>
  );
}