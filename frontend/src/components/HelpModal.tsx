"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle, X, Sliders, Activity, FileCheck, Server, Sparkles, GitCompare } from "lucide-react";

export const HelpModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating Action Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 border border-zinc-700 dark:border-zinc-300 shadow-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-400 active:scale-95"
          aria-label="Open User Guide & Documentation"
          title="Dashboard User Guide"
        >
          <HelpCircle className="w-6 h-6 transition-transform group-hover:rotate-12" />

          {/* Hover Tooltip */}
          <span className="absolute right-14 px-2.5 py-1 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-800 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            User Guide & Docs
          </span>
        </button>
      </div>

      {/* Modal Backdrop & Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs print:hidden animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    FraudxAI — Quick Operational Guide
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    How to interact with the dashboard, read XAI attributions, and export audit memos
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-zinc-600 dark:text-zinc-300">
              {/* Step 1: Sandbox & Presets */}
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span>1. Transaction Sandbox & 1-Click Presets</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      Step 1
                    </span>
                  </h4>
                  <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    Choose one of the 4 benchmark presets (e.g. <em>Card Cloning</em>, <em>Routine Supermarket</em>, <em>CNP Takeover</em>, or <em>Domestic Travel</em>) or manually adjust the 8 sliders and switches (amount, distances, chip, PIN, channel). Then click <strong>"Execute Risk & Compliance Analysis"</strong>.
                  </p>
                </div>
              </div>

              {/* Step 2: XAI & Gauge */}
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span>2. Understanding Risk Scores & SHAP Attributions</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                      Step 2
                    </span>
                  </h4>
                  <ul className="text-xs space-y-1 text-zinc-500 dark:text-zinc-400 list-disc list-inside">
                    <li>
                      <strong>Radial Risk Gauge:</strong> Reflects calibrated XGBoost probability: <em>Low (&lt;35% - Auto-Approved)</em>, <em>Medium (35-70% - 2FA Challenge)</em>, and <em>Critical (&ge;70% - Blocked)</em>.
                    </li>
                    <li>
                      <strong>Divergent SHAP Bars:</strong> Shows exact mathematical causality with a center 0.0 baseline. <span className="text-rose-500 font-semibold">Red bars (+φ)</span> indicate features that increase fraud risk; <span className="text-emerald-500 font-semibold">Green bars (-φ)</span> indicate legitimate mitigating factors.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 3: Actionable Recourse & What-If Engine */}
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <GitCompare className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span>3. Actionable Recourse & What-If Engine (Right to Recourse)</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      Step 3
                    </span>
                  </h4>
                  <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    Directly addresses banking regulatory mandates under <strong>CFPB Reg B (§ 1002.9)</strong> and <strong>EU GDPR Article 22(3)</strong>: resolving <em>&ldquo;What exact, minimal modifications would turn this adverse block into an approval?&rdquo;</em>
                  </p>
                  <ul className="text-xs space-y-1 text-zinc-500 dark:text-zinc-400 list-disc list-inside">
                    <li>
                      <strong>Actionable Levers:</strong> Calculates minimal interventions (e.g. <em>EMV Chip & PIN insertion</em>, <em>Merchant Whitelisting</em>, or <em>Transit Velocity &lt;15 km</em>).
                    </li>
                    <li>
                      <strong>Live Risk Reduction Delta:</strong> Quantifies simulated drops (e.g., from <strong>89% to 22% Auto-Approved</strong>).
                    </li>
                    <li>
                      <strong>1-Click Workbench Patching:</strong> Click <strong>&ldquo;Apply What-If Intervention&rdquo;</strong> to instantly simulate the counterfactual parameters and observe the decision change live.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 4: Legal Compliance Memo */}
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span>4. Statutory Regulatory Memo & PDF Export</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      Step 4
                    </span>
                  </h4>
                  <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    The AI synthesizes the mathematical proof and actionable recourse pathways into an auditable document complying with <strong>CFPB Circular 2023-03 (adverse reasons)</strong>, <strong>FinCEN SAR (5 W&apos;s)</strong>, and <strong>GDPR Article 22(3) (Right to Recourse)</strong>. Click <strong>&quot;Export PDF / Print&quot;</strong> to generate a clean, vector document ready for legal archiving.
                  </p>
                </div>
              </div>

              {/* Step 5: Multi-Provider Failover */}
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span>5. High-Availability Multi-Provider Telemetry</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      Step 5
                    </span>
                  </h4>
                  <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    The audit telemetry bar displays the active provider (<strong>Groq</strong> for ultra-fast &lt;3s inference, <strong>Featherless.ai</strong>, <strong>Adaption Labs</strong>, or <strong>Deterministic Offline Engine</strong>) with automatic failover to guarantee zero downtime.
                  </p>
                  <div className="pt-1">
                    <a
                      href="https://my-app-1ombyk.adaptionlabs.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white underline transition-colors"
                    >
                      <span>Open Adaption Labs Ops Portal (Score 10/10)</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> GIBC V2 Hackathon • Track 02 (Finance)
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Got it, close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
