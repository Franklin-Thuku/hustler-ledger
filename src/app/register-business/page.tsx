"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; //

export default function RegisterBusiness() {
  const router = useRouter(); //
  const [formData, setFormData] = useState({ title: "", description: "" });
  const step = 1; 

  // This function handles the click and moves the user to the next page
  const handleConfirmBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Business Registered:", formData);
    router.push("/ledger-setup"); // 
  };

  return (
    <main className="min-h-screen bg-[#060807] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#062d1a_0%,transparent_70%)] opacity-20 pointer-events-none" />

      {/* Progress Bars */}
      <div className="absolute top-10 w-full max-w-[280px] md:max-w-xs flex gap-2">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex-1">
            <div className={`h-[3px] rounded-full transition-all duration-700 ${num <= step ? 'bg-hustler-lime shadow-[0_0_12px_#a3e635]' : 'bg-white/5'}`} />
          </div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative z-10"
      >
        <header className="mb-12">
          <h1 className="hustler-incredible !text-3xl text-left">The <br />Identity.</h1>
          <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mt-4">Section 01: Business Profile</p>
        </header>
        
        {/* Fix: Added the onSubmit handler here */}
        <form onSubmit={handleConfirmBusiness} className="space-y-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Title</label>
            <input 
              type="text"
              required
              value={formData.title}
              className="w-full bg-white/[0.05] border border-white/5 rounded-2xl p-5 text-white font-medium outline-none focus:border-hustler-lime/50 focus:bg-white/[0.08] transition-all"
              placeholder="Business Name"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Description</label>
            <textarea 
              required
              value={formData.description}
              rows={4}
              className="w-full bg-white/[0.05] border border-white/5 rounded-2xl p-5 text-white font-medium outline-none focus:border-hustler-lime/50 focus:bg-white/[0.08] transition-all resize-none"
              placeholder="Give a brief description of your business..."
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-hustler-lime text-jungle py-6 rounded-full font-[950] text-sm uppercase tracking-widest italic shadow-[0_20px_40px_rgba(163,230,53,0.15)] mt-4"
          >
            Confirm Business
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}