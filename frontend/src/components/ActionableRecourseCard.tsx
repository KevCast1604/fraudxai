"use client";

import React, { useState, useId } from "react";
import {
  GitCompare,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sliders,
  RotateCcw,
} from "lucide-react";
import { ActionableRecourse, TransactionFeatures } from "@/types";

interface ActionableRecourseCardProps {
  currentRiskScore: number;
  currentRiskTier: "LOW" | "MEDIUM" | "CRITICAL";
  recourses: ActionableRecourse[];
  isAnalyzing: boolean;
  onApplyRecourse: (patch: Partial<TransactionFeatures>) => void;
}

export const ActionableRecourseCard: React.FC<ActionableRecourseCardProps> = ({
  currentRiskScore,
  currentRiskTier,
  recourses = [],
  isAnalyzing,
  onApplyRecourse,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [justAppliedId, setJustAppliedId] = useState<string | null>(null);

  const activeRecourse = recourses[selectedIdx] || recourses[0];
  const isLowRisk = currentRiskTier === "LOW" && currentRiskScore < 0.35;

  const handleApply = (recourse: ActionableRecourse) => {
    setJustAppliedId(recourse.recourse_id);
    onApplyRecourse(recourse.patch_features);
    setTimeout(() => {
      setJustAppliedId(null);
    }, 1500);
  };

  const getShortTitle = (r: ActionableRecourse): string => {
    const id = r.recourse_id.toLowerCase();
    const title = r.title.toLowerCase();
    if (id.includes("emv-velocity") || (title.includes("velocity") && title.includes("chip"))) {
      return "Chip + PIN + Velocity";
    }
    if (id.includes("chip-pin") || title.includes("emv chip")) {
      return "EMV Chip & PIN";
    }
    if (id.includes("pin-stepup") || title.includes("pin step-up")) {
      return "Cardholder PIN";
    }
    if (id.includes("combo-3ds") || (title.includes("3d-secure") && title.includes("merchant"))) {
      return "3DS + Whitelist";
    }
    if (id.includes("3ds") || title.includes("3d-secure") || title.includes("otp")) {
      return "3D-Secure 2FA";
    }
    if (id.includes("whitelist") || title.includes("whitelist")) {
      return "Merchant Whitelist";
    }
    if (id.includes("velocity") || title.includes("velocity")) {
      return "Velocity Clearance";
    }
    if (id.includes("spending") || title.includes("split") || title.includes("cap")) {
      return "Split / Spend Cap";
    }
    return r.title.split(" (")[0].slice(0, 22);
  };

  return (
    <div className="relative rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl overflow-hidden transition-all flex flex-col justify-between">

      {/* Header bar */}
      <div className="px-4 sm:px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-sans">
              Actionable Recourse
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
              Identifies the minimum required modifications to reduce risk and qualify for approval.
            </p>
          </div>
        </div>

        {recourses.length > 0 && !isLowRisk && (
          <div className="text-xs font-sans text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700">
            {recourses.length} {recourses.length === 1 ? "Path Available" : "Remediation Paths"}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        {/* State A: Currently Low Risk / Approved */}
        {isLowRisk ? (
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 flex items-start gap-3.5 text-zinc-800 dark:text-zinc-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-sans">
                  Transaction Approved
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium">
                  Risk &lt; 35%
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                The current transaction risk score ({(currentRiskScore * 100).toFixed(1)}%) conforms to standard portfolio risk tolerance. All regulatory security baselines under CFPB Reg B are met, and no adverse action remedies are legally required.
              </p>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 pt-1 font-sans">
                Tip: Select an elevated risk scenario in the simulator to view counterfactual remediation pathways.
              </div>
            </div>
          </div>
        ) : recourses.length === 0 ? (
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-xs text-zinc-500 dark:text-zinc-400">
            Computing counterfactual scenarios for this transaction profile...
          </div>
        ) : (
          /* State B: Elevated / Critical Risk with Actionable Recourse Pathways */
          <div className="space-y-4">
            {/* Pathway Selector Grid - 100% width, no overflow clipping */}
            {recourses.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                {recourses.map((recourse, idx) => {
                  const isSelected = selectedIdx === idx;
                  const deltaPercent = (recourse.risk_delta * 100).toFixed(0);
                  const shortTitle = getShortTitle(recourse);

                  return (
                    <button
                      key={recourse.recourse_id}
                      type="button"
                      onClick={() => setSelectedIdx(idx)}
                      title={recourse.title}
                      className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between gap-1.5 ${
                        isSelected
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
                          : "bg-white dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 w-full">
                        <span className="font-mono text-[9px] uppercase tracking-wider font-bold opacity-75">
                          Pathway #{idx + 1}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded ${
                            isSelected
                              ? "bg-emerald-500 text-white"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          -{deltaPercent}%
                        </span>
                      </div>

                      <div className="text-xs font-bold leading-tight truncate w-full" title={recourse.title}>
                        {shortTitle}
                      </div>

                      <div className="flex items-center gap-1 text-[9px] font-mono">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            recourse.target_achieved ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        <span
                          className={
                            isSelected
                              ? "text-zinc-300 dark:text-zinc-600 font-medium"
                              : "text-zinc-500 dark:text-zinc-400"
                          }
                        >
                          {recourse.target_achieved ? "Auto-Approve" : `Tier: ${recourse.simulated_risk_tier}`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active Pathway Detail Hero */}
            {activeRecourse && (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60 p-4 space-y-3.5">
                {/* Top: Before vs After Risk Transformation Gauge Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
                  <div className="flex items-center gap-3">
                    {/* Before */}
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono tracking-wider">
                        Current Risk
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-black font-mono text-rose-600 dark:text-rose-400">
                          {(currentRiskScore * 100).toFixed(1)}%
                        </span>
                        <span className="text-[10px] font-bold uppercase text-rose-500/80 dark:text-rose-400/80">
                          ({currentRiskTier})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 shrink-0">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>

                    {/* After */}
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">
                        Simulated Recourse
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                          {(activeRecourse.simulated_risk_score * 100).toFixed(1)}%
                        </span>
                        <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                          ({activeRecourse.simulated_risk_tier})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delta & Target Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                    <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Δ -{(activeRecourse.risk_delta * 100).toFixed(1)}% Risk
                    </span>
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3" />
                      {activeRecourse.target_achieved
                        ? "Overturns Adverse Block"
                        : "Significantly Mitigates Exposure"}
                    </span>
                  </div>
                </div>

                {/* Middle: Feature Intervention Pills (What changes) */}
                <div>
                  <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
                    Prescribed Counterfactual Interventions:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeRecourse.interventions.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 text-xs flex flex-col justify-between"
                      >
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-[11px]">
                          {item.label}
                        </span>

                        <div className="mt-1 flex items-center gap-2 text-[11px] font-mono">
                          <span className="line-through text-rose-500/80 dark:text-rose-400/80 bg-rose-500/5 px-1.5 py-0.5 rounded">
                            {item.current_value}
                          </span>
                          <span className="text-zinc-400">➔</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {item.target_value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom: Action description & Statutory remedy */}
                <div className="text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60">
                  <p>
                    <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                      Operational Action:
                    </strong>{" "}
                    {activeRecourse.description}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono mt-1">
                    Statutory Authority: {activeRecourse.regulatory_remedy}
                  </p>
                </div>

                {/* Interactive Apply Button */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <span className="text-sm text-zinc-400 font-sans hidden sm:inline">
                    Click to simulate this exact recourse pathway in the workbench:
                  </span>

                  <button
                    type="button"
                    onClick={() => handleApply(activeRecourse)}
                    disabled={isAnalyzing}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold font-sans transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 disabled:opacity-50"
                  >
                    {justAppliedId === activeRecourse.recourse_id ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 animate-bounce" />
                        <span>Recourse Applied!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Apply What-If Intervention</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
