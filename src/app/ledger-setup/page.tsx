"use client";
import { useState, useEffect } from "react";
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
  const [isSyncing, setIsSyncing] = useState(false); // New: Loading state for real sync
  const router = useRouter();

  const toggleChannel = (id: string) => {
    setActiveChannels(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleFinalActivation = async () => {
    setIsSyncing(true);
    
    // 1. Check for real WebOTP/SMS API Support
    const hasSmsSupport = 'OTPCredential' in window;
    
    // 2. Simulate the 'handshake' with the OS
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    // 3. Save critical setup data to LocalStorage
    localStorage.setItem("target_revenue", target.toString());
    localStorage.setItem("target_period", timeframe);
    localStorage.setItem("channels", JSON.stringify(activeChannels));
    localStorage.setItem("sms_api_supported", hasSmsSupport ? "true" : "false");
    
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#0a0f0d] pt-12 pb-24 px-6 relative overflow-hidden">
      <div className="max-w-md mx-auto">
        <header className="mb-12">
          <h1 className="text-white text-4xl font-black uppercase italic tracking-tighter">
            Target <br /><span className="text-white/40">Settings.</span>
          </h1>
        </header>

        <section className="space-y-10">
          {/* Timeframe Selector */}
          <div>
            <label className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Select Period</label>
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
              {timeframes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    timeframe === t ? "bg-white text-black shadow-lg" : "text-white/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Input */}
          <div>
            <label className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">
              {timeframe} Goal (KES)
            </label>
            <input 
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-full bg-transparent text-white text-5xl font-black italic focus:outline-none border-b-2 border-white/10 focus:border-lime pb-2 transition-colors"
            />
            <input 
              type="range" min="500" max="250000" step="500" value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-full h-1.5 mt-6 bg-white/10 rounded-lg appearance-none cursor-pointer accent-lime"
            />
          </div>

          {/* Money Channels */}
          <div>
            <label className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Active Channels</label>
            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => {
                const isActive = activeChannels.includes(method.id);
                return (
                  <button
                    key={method.id}
                    onClick={() => toggleChannel(method.id)}
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                      isActive ? "border-lime bg-lime/5 text-white" : "border-white/5 bg-white/[0.02] text-white/40"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-bold">{method.label}</span>
                    </div>
                    {isActive && <span className="text-lime font-black text-[10px] tracking-widest">ACTIVE</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <button
          onClick={() => setShowPermission(true)}
          disabled={activeChannels.length === 0}
          className={`w-full mt-12 py-6 rounded-full font-black text-xl transition-all shadow-2xl ${
            activeChannels.length > 0 ? "bg-lime text-black neon-glow" : "bg-white/5 text-white/10"
          }`}
        >
          Activate My Ledger
        </button>
      </div>

      {/* --- ANIMATED PERMISSION MODAL --- */}
      <AnimatePresence>
        {showPermission && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isSyncing && setShowPermission(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#0d1412] rounded-t-[3rem] p-10 border-t border-white/10"
            >
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-10" />
              
              <div className="text-center">
                <div className="w-20 h-20 bg-lime/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <span className="text-4xl">{isSyncing ? "⚡" : "🔒"}</span>
                  {isSyncing && (
                    <motion.div 
                      animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute inset-0 border-t-2 border-lime rounded-full"
                    />
                  )}
                </div>

                <h2 className="text-white text-3xl font-black italic uppercase leading-none mb-4">
                  {isSyncing ? "Initializing..." : "Final Confirmation"}
                </h2>
                <p className="text-white/40 text-lg mb-12 leading-relaxed">
                  {isSyncing 
                    ? "Syncing with your business channels to build your financial identity." 
                    : "Hustler Ledger needs to detect transaction SMS to build your Hustler Score automatically."}
                </p>

                {!isSyncing && (
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleFinalActivation}
                      className="w-full bg-white text-black py-6 rounded-full font-black text-xl shadow-2xl"
                    >
                      Allow & Continue
                    </button>
                    <button onClick={() => setShowPermission(false)} className="text-white/20 font-bold uppercase tracking-widest text-xs py-2">
                      Go back
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