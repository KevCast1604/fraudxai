"use client";

import React, { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SimulationPanel } from "@/components/SimulationPanel";
import { RadialRiskGauge } from "@/components/RadialRiskGauge";
import { ShapDivergentBarChart } from "@/components/ShapDivergentBarChart";
import { ComplianceViewer } from "@/components/ComplianceViewer";
import { TelemetryCard } from "@/components/TelemetryCard";
import { HelpModal } from "@/components/HelpModal";
import { ProviderSidebar } from "@/components/ProviderSidebar";
import { ActionableRecourseCard } from "@/components/ActionableRecourseCard";
import { useFraudAnalysis } from "@/hooks/useFraudAnalysis";
import { ShieldCheck, AlertCircle, CheckCircle2, Cpu, RefreshCw } from "lucide-react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const {
    features,
    selectedPresetId,
    selectedProvider,
    setSelectedProvider,
    setSelectedModel,
    isAnalyzing,
    result,
    error,
    applyPreset,
    updateFeature,
    applyRecoursePatch,
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
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans tech-grid-pattern relative selection:bg-zinc-800 selection:text-white dark:selection:bg-zinc-200 dark:selection:text-zinc-900">
      {/* Subtle Monochrome Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-5xl h-64 bg-radial from-zinc-300/20 dark:from-zinc-800/30 to-transparent blur-3xl pointer-events-none -z-10 print:hidden" />

      {/* Main Command Navbar */}
      <Navbar />

      <main className="flex-1 max-w-[1620px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 print:max-w-none print:w-full print:p-0 print:m-0 print:space-y-0">
        {/* Cockpit Context Banner */}
        <section className="print:hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500 animate-pulse" />
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

        {/* Core Split-Cockpit Grid: Simulator (Left) and Instant Diagnostic (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print:hidden">
          {/* Left Column: 1. Transaction Simulation Workbench */}
          <div className="lg:col-span-6 flex flex-col print:hidden lg:sticky lg:top-6">
            <SimulationPanel
              features={features}
              selectedPresetId={selectedPresetId}
              isAnalyzing={isAnalyzing}
              onApplyPreset={applyPreset}
              onUpdateFeature={updateFeature}
              onAnalyze={() => runAnalysis()}
              onReset={resetFeatures}
            />
          </div>

          {/* Right Column: 2. Real-Time Explainability Quadrant (Instrument Dial + Feature Attribution) */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {/* Active Analysis Loading Indicator Banner */}
            {isAnalyzing && (
              <section className="print:hidden shrink-0">
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/90 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200 shrink-0">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-zinc-50 font-mono flex items-center gap-2">
                        <span>Audit Pipeline Running</span>
                        <span className="inline-block w-2 h-2 rounded-full bg-zinc-500 animate-ping" />
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans mt-0.5">
                        Decomposing local SHAP attributions and drafting statutory compliance memorandum via{" "}
                        <strong className="text-zinc-900 dark:text-zinc-100 font-mono font-semibold">
                          {selectedProvider === "groq"
                            ? "Groq Cloud LPU (~2s)"
                            : selectedProvider === "offline"
                            ? "Deterministic Safety Net (<5ms)"
                            : "Featherless.ai (~20s)"}
                        </strong>
                        ...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-800 dark:text-zinc-200 bg-zinc-200/80 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 font-bold uppercase tracking-wider shrink-0">
                    In-Flight Processing
                  </div>
                </div>
              </section>
            )}

            {result && (
              <div className={isAnalyzing ? "opacity-50 pointer-events-none transition-opacity duration-300 flex-1 flex flex-col gap-5 min-h-0" : "transition-opacity duration-300 flex-1 flex flex-col gap-5 min-h-0"}>
                {/* Hero Verdict: Radial Risk Gauge and Decision Plaque Side-by-Side */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0 print:hidden">
                  <div className="h-full">
                    <RadialRiskGauge score={result.risk_score} />
                  </div>

                  {/* Official Decision & Case Info Plaque */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl flex flex-col justify-between text-xs h-full">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                        <span className="font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono text-xs">
                          Official Decision & Case File
                        </span>
                      </div>
                      <span className="text-[10px] font-sans text-emerald-500 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    </div>

                    <div className="my-auto py-2 space-y-2.5 font-sans text-xs">
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
                </section>

                {/* SHAP Local Attribution Waterfall Matrix */}
                <section className="min-h-0 flex flex-col print:hidden">
                  <ShapDivergentBarChart
                    factors={result.shap_factors}
                    baseValue={result.base_value}
                  />
                </section>

                {/* Actionable Counterfactual Recourse (What-If Engine) */}
                <section className="print:hidden">
                  <ActionableRecourseCard
                    currentRiskScore={result.risk_score}
                    currentRiskTier={result.risk_tier}
                    recourses={result.actionable_recourse || []}
                    isAnalyzing={isAnalyzing}
                    onApplyRecourse={applyRecoursePatch}
                  />
                </section>
              </div>
            )}
          </div>
        </div>

        {/* Full-Width Telemetry & Compliance Sections Below Cockpit */}
        {result && (
          <div className={isAnalyzing ? "opacity-50 pointer-events-none transition-opacity duration-300 space-y-6 print:space-y-0 print:w-full" : "transition-opacity duration-300 space-y-6 print:space-y-0 print:w-full"}>
            {/* 3. System & Evaluation Telemetry */}
            <section className="print:hidden">
              <TelemetryCard
                telemetry={result.telemetry}
                onOpenSettings={() => setIsSidebarOpen(true)}
              />
            </section>

            {/* 4. Official Compliance Memorandum & Export */}
            <section className="print:w-full print:p-0 print:m-0">
              <ComplianceViewer
                memoMarkdown={result.compliance_memo}
                auditId={result.audit_id}
                timestamp={result.timestamp}
                riskScore={result.risk_score}
                riskTier={result.risk_tier}
              />
            </section>
          </div>
        )}
      </main>

      {/* Floating Engine Hub Trigger Tab (Right Edge of Screen) */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-white/95 dark:bg-zinc-900/95 border-l-2 border-y border-zinc-400 dark:border-zinc-600 hover:border-zinc-900 dark:hover:border-zinc-100 text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white px-2 py-3.5 rounded-l-xl shadow-2xl flex flex-col items-center gap-2 cursor-pointer group print:hidden transition-all backdrop-blur-md"
        title="Open AI Provider & Inference Engine Settings"
      >
        <Cpu className="w-4 h-4 text-zinc-700 dark:text-zinc-300 group-hover:scale-125 transition-transform" />
        <span className="[writing-mode:vertical-rl] text-[9px] font-mono font-bold tracking-widest uppercase rotate-180 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
          Engine Hub
        </span>
      </button>

      {/* Cockpit Footer */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 py-8 mt-12 bg-white/70 dark:bg-zinc-950/80 backdrop-blur-md text-xs text-zinc-400 print:hidden transition-colors">
        <div className="max-w-[1620px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-sans">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
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

      {/* Slide-out Provider & Engine Hub Sidebar */}
      <ProviderSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentProvider={selectedProvider}
        onSelectProvider={(prov, model) => {
          setSelectedProvider(prov);
          if (model) setSelectedModel(model);
        }}
        telemetry={result?.telemetry}
        isAnalyzing={isAnalyzing}
        onReanalyze={(provOverride) =>
          runAnalysis(typeof provOverride === "string" ? provOverride : undefined)
        }
      />

      {/* Floating Help & User Guide Modal */}
      <HelpModal />
    </div>
  );
}
