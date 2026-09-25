"use client";

import React from "react";
import { ShieldCheck, Cpu, Scale, Activity, ExternalLink } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <header className="w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50 print:hidden transition-colors">
      <div className="max-w-[1620px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-900 dark:bg-zinc-800 border border-zinc-700/60 shadow-inner group">
            <ShieldCheck className="w-5 h-5 text-zinc-100 dark:text-zinc-100 relative z-10 transition-transform group-hover:scale-110" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight font-mono text-zinc-950 dark:text-zinc-50">
                Fraud<span className="text-zinc-500 dark:text-zinc-400">xAI</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans tracking-tight hidden sm:block">
              Explainable Risk Intelligence & Regulatory Audit System
            </p>
          </div>
        </div>

        {/* System status pills */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-sans text-zinc-700 dark:text-zinc-300">
            <Scale className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden md:inline font-medium">Compliance:</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">CFPB / GDPR Art. 22</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Audit Engine Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
