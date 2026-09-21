"use client";

import React from "react";
import { X, Check, Cpu, Zap, Shield, Server, ArrowRight, RefreshCw } from "lucide-react";
import { AuditTelemetry, LLMProvider } from "@/types";

interface ProviderSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentProvider: string;
  onSelectProvider: (provider: LLMProvider, model?: string) => void;
  telemetry?: AuditTelemetry;
  isAnalyzing: boolean;
  onReanalyze: (provider?: string) => void;
}

interface EngineOption {
  id: LLMProvider;
  name: string;
  badge: string;
  badgeColor: string;
  model: string;
  speed: string;
  description: string;
  isDefault?: boolean;
}

const ENGINE_OPTIONS: EngineOption[] = [
  {
    id: "featherless",
    name: "Featherless.ai",
    badge: "Default Engine",
    badgeColor: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
    model: "Qwen/Qwen2.5-7B-Instruct",
    speed: "~15 - 25s",
    description: "Open-weights serverless inference engine with high fidelity to CFPB, FinCEN SAR, and GDPR statutory formatting.",
    isDefault: true,
  },
  {
    id: "groq",
    name: "Groq Cloud LPU",
    badge: "Ultra-Fast Ingestion",
    badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    model: "qwen/qwen3.8-27b",
    speed: "~1.5 - 2.8s",
    description: "Hardware-accelerated LPUs (Language Processing Units) optimized for near-instant compliance memo generation.",
  },
  {
    id: "offline",
    name: "Deterministic Offline",
    badge: "Infallible Safety Net",
    badgeColor: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/30",
    model: "rule_based_v1.0",
    speed: "< 5ms",
    description: "Air-gapped statutory rule engine that guarantees 100% availability even during total cloud network disconnects.",
  },
];

export const ProviderSidebar: React.FC<ProviderSidebarProps> = ({
  isOpen,
  onClose,
  currentProvider,
  onSelectProvider,
  telemetry,
  isAnalyzing,
  onReanalyze,
}) => {
  const [selected, setSelected] = React.useState<LLMProvider>(() => {
    const p = (currentProvider || "").toLowerCase();
    if (p.includes("groq")) return "groq";
    if (p.includes("offline")) return "offline";
    return "featherless";
  });

  React.useEffect(() => {
    const p = (currentProvider || "").toLowerCase();
    if (p.includes("groq")) setSelected("groq");
    else if (p.includes("offline")) setSelected("offline");
    else setSelected("featherless");
  }, [currentProvider, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden print:hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-out Sidebar Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-white dark:bg-[#0c121e] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col transform transition ease-in-out duration-300">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono uppercase tracking-wider">
                  AI Provider & Engine Hub
                </h2>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Select drafting orchestrator & LLM architecture
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Active Telemetry Snapshot */}
            {telemetry && (
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                  Active Execution Telemetry
                </span>
                <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-400 text-[10px] block">Current Provider:</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {telemetry.provider}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[10px] block">Latency:</span>
                    <span className="font-mono font-bold text-amber-500 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {telemetry.latency_ms} ms
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-zinc-400 text-[10px] block">Loaded Model:</span>
                    <span className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300 truncate block">
                      {telemetry.model}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Provider Options */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                Choose Drafting Provider:
              </label>

              {ENGINE_OPTIONS.map((engine) => {
                const isSelected = selected === engine.id;

                return (
                  <div
                    key={engine.id}
                    onClick={() => {
                      setSelected(engine.id);
                      onSelectProvider(engine.id, engine.model);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-500/5 dark:bg-cyan-950/20 shadow-sm ring-1 ring-cyan-500/30"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                            isSelected
                              ? "border-cyan-500 bg-cyan-500 text-white"
                              : "border-zinc-400 dark:border-zinc-600"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-sans">
                          {engine.name}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono border font-medium ${engine.badgeColor}`}
                      >
                        {engine.badge}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 font-sans leading-relaxed">
                      {engine.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                      <span className="truncate max-w-[210px]" title={engine.model}>
                        Model: <strong className="text-zinc-800 dark:text-zinc-200">{engine.model}</strong>
                      </span>
                      <span className="flex items-center gap-1 text-zinc-500">
                        <Zap className="w-3 h-3 text-amber-500" />
                        {engine.speed}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resilient Failover Notice */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 font-sans">
              <div className="flex items-center gap-1.5 font-bold text-zinc-800 dark:text-zinc-200">
                <Server className="w-3.5 h-3.5 text-cyan-500" />
                <span>Automatic Dynamic Failover Active</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                If the chosen provider experiences a rate limit (429) or network timeout, the system automatically redirects the transaction to the next available tier without interrupting compliance auditing.
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex items-center gap-3">
            <button
              onClick={() => {
                onReanalyze(selected);
                onClose();
              }}
              disabled={isAnalyzing}
              className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>Apply & Run Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs font-semibold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
