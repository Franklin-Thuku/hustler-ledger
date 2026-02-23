"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-[#0a0f0d] pt-24 pb-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-white text-3xl font-black tracking-tighter mb-6">
              HUSTLER<span className="text-lime">LEDGER</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-sm">
              Building the financial infrastructure for the world's most resilient entrepreneurs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-4 text-gray-500 font-medium">
              <li><a href="#" className="hover:text-lime transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Hustler Score</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Security</a></li>
            </ul>
          </div>

          {/* Status Column */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">System Status</h4>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 w-fit px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              <span className="text-lime text-xs font-bold uppercase">All Systems Operational</span>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-sm">
            © 2026 Hustler Ledger. Built with pride in Kenya.
          </p>
          <div className="flex gap-8 text-gray-600 text-sm">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}