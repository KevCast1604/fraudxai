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
            <div className="absolute inset-0 rounded-lg bg-cyan-500/10 dark:bg-cyan-400/20 blur-xs transition-opacity group-hover:opacity-100" />
            <ShieldCheck className="w-5 h-5 text-cyan-500 dark:text-cyan-400 relative z-10 transition-transform group-hover:scale-110" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight font-mono text-zinc-950 dark:text-zinc-50">
                Fraud<span className="text-cyan-600 dark:text-cyan-400">xAI</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider font-sans uppercase bg-zinc-100 dark:bg-zinc-800/90 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                System Online
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans tracking-tight hidden sm:block">
              Explainable Risk Intelligence & Regulatory Audit System
            </p>
          </div>
        </div>

        {/* System telemetry pills */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-100/80 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-[11px] font-sans text-zinc-600 dark:text-zinc-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>XGBoost Classifier • TreeSHAP Explainer</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 dark:bg-zinc-900 border border-zinc-800 dark:border-zinc-700 text-[11px] font-sans text-zinc-100">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Regulatory Standards:</span>
            <span className="text-zinc-300 font-semibold">CFPB & GDPR Art. 22</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-sans">
            <Activity className="w-3.5 h-3.5" />
            <span className="font-semibold">GIBC-V2</span>
          </div>

          <a
            href="https://my-app-1ombyk.adaptionlabs.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors shadow-xs"
            title="Open Adaption Labs Ops Portal"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Adaption Labs Portal</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-indigo-200/60 dark:bg-indigo-800/80 font-mono">10/10</span>
          </a>
        </div>
      </div>
    </header>
  );
};
