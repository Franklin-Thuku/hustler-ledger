"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CTA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleDownload = async () => {
    // 1. Try to trigger the "App Install" if the browser is ready
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        return; // Stop here if they accepted the PWA install
      }
    }

    // 2. FALLBACK: If PWA isn't ready, trigger a direct file download
    // This will make the phone start downloading the .apk file immediately
    const link = document.createElement('a');
    link.href = '/hustler-ledger.apk'; 
    link.download = 'hustler-ledger.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-20 px-6">
      <motion.div className="max-w-7xl mx-auto bg-lime rounded-[3rem] p-12 text-center">
        <h2 className="text-forest text-5xl font-black mb-8 italic">Ready to grow?</h2>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="bg-forest text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl"
        >
          Download for Android
        </motion.button>
      </motion.div>
    </section>
  );
}