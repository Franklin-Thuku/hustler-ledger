"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const timeframes = ["Daily", "Weekly", "Monthly"];
const paymentMethods = [
  { id: "mpesa", label: "M-PESA", icon: "📱" },
  { id: "cash", label: "Hard Cash", icon: "💵" },
  { id: "bank", label: "Bank/Paybill", icon: "🏛️" },
];

export default function LedgerSetup() {
  const [target, setTarget] = useState(5000);
  const [timeframe, setTimeframe] = useState("Weekly");
  const [activeChannels, setActiveChannels] = useState<string[]>([]);
  const [showPermission, setShowPermission] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();
  const step = 3; // Final Step of the Progress System

  const toggleChannel = (id: string) => {
    setActiveChannels(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleFinalActivation = async () => {
    setIsSyncing(true);
    const hasSmsSupport = 'OTPCredential' in window;
    await new Promise(resolve => setTimeout(resolve, 2000)); // Professional delay

    localStorage.setItem("target_revenue", target.toString());
    localStorage.setItem("target_period", timeframe);
    localStorage.setItem("channels", JSON.stringify(activeChannels));
    localStorage.setItem("sms_api_supported", hasSmsSupport ? "true" : "false");
    
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#060807] pt-20 pb-24 px-6 relative overflow-hidden">
      
      {/* 1. TRIPLE-BAR PROGRESS */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-[280px] flex gap-2">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex-1">
            <div className={`h-[3px] rounded-full transition-all duration-700 ${num <= step ? 'bg-hustler-lime shadow-[0_0_12px_#a3e635]' : 'bg-white/5'}`} />
          </div>
        ))}
      </div>

      <div className="max-w-md mx-auto">
        <header className="mb-12">
          <h1 className="hustler-incredible !text-4xl text-left">
            Set Your <br />Target.
          </h1>
          <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mt-4">Section 03: Final Configuration</p>
        </header>

        <section className="space-y-12">
          {/* Timeframe Selector */}
          <div>
            <label className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block ml-1">Select Period</label>
            <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
              {timeframes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${
                    timeframe === t ? "bg-white text-jungle shadow-lg" : "text-white/30"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Input - High Contrast */}
          <div>
            <label className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block ml-1">
              {timeframe} Goal (KES)
            </label>
            <div className="relative">
              <input 
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full bg-transparent text-white text-6xl font-black italic focus:outline-none border-b-2 border-white/5 focus:border-hustler-lime pb-4 transition-colors"
              />
              <input 
                type="range" min="500" max="250000" step="500" value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full h-1 mt-8 bg-white/5 rounded-lg appearance-none cursor-pointer accent-hustler-lime"
              />
            </div>
          </div>

          {/* Money Channels - Glass Tiles */}
          <div>
            <label className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block ml-1">Active Channels</label>
            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => {
                const isActive = activeChannels.includes(method.id);
                return (
                  <button
                    key={method.id}
                    onClick={() => toggleChannel(method.id)}
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 ${
                      isActive ? "border-hustler-lime bg-hustler-lime/5 text-white" : "border-white/5 bg-white/[0.02] text-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl grayscale group-active:grayscale-0">{method.icon}</span>
                      <span className={`font-bold italic uppercase tracking-tighter ${isActive ? 'text-hustler-lime' : ''}`}>{method.label}</span>
                    </div>
                    {isActive && <div className="w-2 h-2 rounded-full bg-hustler-lime animate-pulse" />}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <button
          onClick={() => setShowPermission(true)}
          disabled={activeChannels.length === 0}
          className={`w-full mt-16 py-6 rounded-full font-[950] text-sm uppercase tracking-widest italic transition-all ${
            activeChannels.length > 0 ? "bg-hustler-lime text-jungle shadow-[0_20px_50px_rgba(163,230,53,0.2)]" : "bg-white/5 text-white/5"
          }`}
        >
          {activeChannels.length > 0 ? "Unlock My Bankable Future" : "Configure Channels"}
        </button>
      </div>

      {/* --- ANIMATED PERMISSION MODAL --- */}
      <AnimatePresence>
        {showPermission && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isSyncing && setShowPermission(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#0d1412] rounded-t-[3.5rem] p-10 border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-10" />
              
              <div className="text-center">
                <div className="w-24 h-24 bg-hustler-lime/5 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                  <span className="text-4xl">{isSyncing ? "⚡" : "🔒"}</span>
                  {isSyncing && (
                    <motion.div 
                      animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="absolute inset-0 border-t-2 border-hustler-lime rounded-full"
                    />
                  )}
                </div>

                <h2 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-4">
                  {isSyncing ? "Syncing Identity" : "Data Authorization"}
                </h2>
                <p className="text-white/40 text-sm font-medium mb-12 leading-relaxed px-4">
                  {isSyncing 
                    ? "Generating your bankable score using verified transaction data." 
                    : "Hustler Ledger uses verified SMS data to build your financial identity automatically."}
                </p>

                {!isSyncing && (
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleFinalActivation}
                      className="w-full bg-white text-jungle py-6 rounded-full font-[950] text-sm uppercase tracking-widest italic shadow-2xl"
                    >
                      Grant Access & Activate
                    </button>
                    <button onClick={() => setShowPermission(false)} className="text-white/20 font-black uppercase tracking-[0.4em] text-[9px] py-4">
                      Cancel Request
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}