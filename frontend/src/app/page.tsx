"use client";

import React, { useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { SimulationPanel } from "@/components/SimulationPanel";
import { RadialRiskGauge } from "@/components/RadialRiskGauge";
import { ShapDivergentBarChart } from "@/components/ShapDivergentBarChart";
import { ComplianceViewer } from "@/components/ComplianceViewer";
import { TelemetryCard } from "@/components/TelemetryCard";
import { useFraudAnalysis } from "@/hooks/useFraudAnalysis";
import { ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Home() {
  const {
    features,
    selectedPresetId,
    isAnalyzing,
    result,
    error,
    applyPreset,
    updateFeature,
    resetFeatures,
    runAnalysis,
  } = useFraudAnalysis();

  // Friendly human translation of actions
  const friendlyAction = useMemo(() => {
    if (!result) return "";
    switch (result.regulatory_action) {
      case "AUTO_APPROVED":
        return "Safe to Approve (Low Risk)";
      case "REQUIRE_2FA_OR_MANUAL_REVIEW":
        return "Requires 2FA Confirmation or Review";
      case "PREVENTIVE_BLOCK_AND_SAR_REFERRAL":
        return "Recommended Preventive Block";
      default:
        return result.regulatory_action.replace(/_/g, " ");
    }
  }, [result]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans tech-grid-pattern relative selection:bg-cyan-500/20 selection:text-cyan-900 dark:selection:text-cyan-200">
      {/* Ambient Top Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-5xl h-64 bg-radial from-cyan-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Command Navbar */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Cockpit Context Banner */}
        <section className="print:hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-xs shadow-cyan-500 animate-pulse" />
                <span className="text-[11px] font-sans uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold">
                  Financial Security & Fraud Detection Intelligence
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
                Transaction Risk Assessment 
              </h1>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-sans">
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-2xs font-medium">
                Consumer Protection (CFPB & GDPR)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-2xs font-medium">
                Transparent Audit Trail
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                Model ROC-AUC: 94.4%
              </span>
            </div>
          </div>
        </section>

        {/* Backend Connection Diagnostic Banner */}
        {error && (
          <section className="print:hidden">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-200 flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold uppercase tracking-wider font-sans">Backend Notice:</span>{" "}
                <span>{error}</span>
                <div className="mt-1 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                  Ensure the FastAPI backend is running on <code className="bg-rose-500/10 px-1 py-0.5 rounded">http://localhost:8000</code>.
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 1. Transaction Simulation Workbench */}
        <section className="print:hidden">
          <SimulationPanel
            features={features}
            selectedPresetId={selectedPresetId}
            isAnalyzing={isAnalyzing}
            onApplyPreset={applyPreset}
            onUpdateFeature={updateFeature}
            onAnalyze={runAnalysis}
            onReset={resetFeatures}
          />
        </section>

        {/* 2. Real-Time Explainability Quadrant (Instrument Dial + Feature Attribution) */}
        {result && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden">
            {/* Left Column: Radial Risk Gauge and Decision Plaque */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex-1">
                <RadialRiskGauge score={result.risk_score} />
              </div>

              {/* Official Decision & Case Info Plaque */}
              <div className="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl flex flex-col justify-between text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span className="font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono text-xs">
                      Official Decision & Case File
                    </span>
                  </div>
                  <span className="text-[10px] font-sans text-emerald-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                </div>

                <div className="mt-4 space-y-2.5 font-sans text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/60">
                    <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">RECOMMENDED ACTION:</span>
                    <span className="font-bold text-zinc-950 dark:text-zinc-50 text-right">
                      {friendlyAction}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/60">
                    <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">TRACKING ID:</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-mono font-semibold text-[11px]">
                      {result.audit_id}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/60">
                    <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">GOVERNANCE BASIS:</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium text-[11px]">
                      CFPB Circular 2023-03 & GDPR Art. 22
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: SHAP Local Attribution Waterfall Matrix */}
            <div className="lg:col-span-7 flex flex-col">
              <ShapDivergentBarChart
                factors={result.shap_factors}
                baseValue={result.base_value}
              />
            </div>
          </section>
        )}

        {/* 3. System & Evaluation Telemetry */}
        {result && (
          <section className="print:hidden">
            <TelemetryCard telemetry={result.telemetry} />
          </section>
        )}

        {/* 4. Official Compliance Memorandum & Export */}
        {result && (
          <section>
            <ComplianceViewer
              memoMarkdown={result.compliance_memo}
              auditId={result.audit_id}
              timestamp={result.timestamp}
              riskScore={result.risk_score}
              riskTier={result.risk_tier}
            />
          </section>
        )}
      </main>

      {/* Cockpit Footer */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 py-8 mt-12 bg-white/70 dark:bg-zinc-950/80 backdrop-blur-md text-xs text-zinc-400 print:hidden transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-sans">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            <span>
              <strong>FraudxAI</strong> • Explainable AI for Risk & Regulatory Compliance
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-zinc-500 dark:text-zinc-400">
            <span>Banking Governance & Adverse Action Audit</span>
            <span>•</span>
            <span>MIT Open Source License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
