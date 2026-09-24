"use client";

import React from "react";
import { Play, Sparkles, SlidersHorizontal, RotateCcw, CheckCircle2, RefreshCw } from "lucide-react";
import { TransactionFeatures, PRESET_SCENARIOS, PresetScenario } from "@/types";

interface SimulationPanelProps {
  features: TransactionFeatures;
  selectedPresetId: string;
  isAnalyzing: boolean;
  onApplyPreset: (preset: PresetScenario) => void;
  onUpdateFeature: (key: keyof TransactionFeatures, value: number) => void;
  onAnalyze: () => void;
  onReset: () => void;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  features,
  selectedPresetId,
  isAnalyzing,
  onApplyPreset,
  onUpdateFeature,
  onAnalyze,
  onReset,
}) => {
  return (
    <div className="relative rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl overflow-hidden transition-all flex flex-col">
      {/* Clean hairline top border */}
      <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-800" />

      {/* Control Panel Header */}
      <div className="px-4 sm:px-5 py-3 border-b border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono">
                Transaction Simulator & Risk Assessment
              </h2>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 font-semibold">
                LIVE
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
              Change transaction details to see in real-time how the fraud prevention system responds.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-sans transition-all hover:border-zinc-300 dark:hover:border-zinc-600 cursor-pointer shadow-2xs"
          title="Reset all values to default baseline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Values</span>
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* SECTION 1: BENCHMARK PRESETS */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">
                [01]
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono flex items-center gap-1.5">
                Ready-to-Use Test Scenarios
              </span>
            </div>
            <span className="text-[12px] text-zinc-400 font-sans hidden sm:inline">
              Click any scenario to test the system in one click
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_SCENARIOS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              const isCritical = preset.expectedOutcome === "BLOCK";
              const isReview = preset.expectedOutcome === "REVIEW";

              const friendlyBadge = isCritical
                ? "High Risk"
                : isReview
                ? "Medium Risk"
                : "Low Risk";

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onApplyPreset(preset)}
                  title={`${preset.name}: ${preset.description}`}
                  className={`group relative text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "border-zinc-900 dark:border-zinc-100 bg-zinc-100/90 dark:bg-zinc-800/80 shadow-sm ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
                      : "border-zinc-200 dark:border-zinc-800/90 bg-zinc-50/60 dark:bg-zinc-950/40 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60"
                  }`}
                >
                  <div>
                    {/* Top Row: Name + Indicator */}
                    <div className="flex items-start justify-between gap-1.5 mb-1">
                      <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                        {preset.name}
                      </span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 shadow-xs shrink-0 mt-1" />
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed mt-1">
                      {preset.description}
                    </p>
                  </div>

                  {/* Bottom Row: Tier Badge + Metric */}
                  <div className="mt-2.5 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/60 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-tight border ${
                        isCritical
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          : isReview
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {friendlyBadge}
                    </span>

                    <span className="text-[11px] font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                      ${preset.features.amount.toFixed(0)} USD
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: TRANSACTION DETAILS */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">
                [02]
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono">
                Transaction Details
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-sans">
              Drag sliders to adjust amounts and distances
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {/* Amount Slider */}
            <div className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-950/30 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                  Transaction Amount
                </label>
                <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-2xs">
                  ${features.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15000"
                step="5"
                value={features.amount}
                onChange={(e) => onUpdateFeature("amount", parseFloat(e.target.value))}
                className="w-full accent-zinc-900 dark:accent-zinc-100 cursor-pointer h-1.5"
              />
              <div className="grid grid-cols-3 text-[10px] font-sans text-zinc-400 dark:text-zinc-500 pt-0.5">
                <span className="text-left">$1 Small</span>
                <span className="text-center">$5,000 Average</span>
                <span className="text-right">$15,000+ High Amount</span>
              </div>
            </div>

            {/* Ratio to Median Spend */}
            <div className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-950/30 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                  Spending vs. Customer 90-Day Habitual Average
                </label>
                <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-2xs">
                  {features.ratio_to_median_price.toFixed(1)}x of usual spend
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="25"
                step="0.1"
                value={features.ratio_to_median_price}
                onChange={(e) => onUpdateFeature("ratio_to_median_price", parseFloat(e.target.value))}
                className="w-full accent-zinc-900 dark:accent-zinc-100 cursor-pointer h-1.5"
              />
              <div className="grid grid-cols-3 text-[10px] font-sans text-zinc-400 dark:text-zinc-500 pt-0.5">
                <span className="text-left">0.1x (Typical)</span>
                <span className="text-center">5.0x (Elevated)</span>
                <span className="text-right text-rose-500 dark:text-rose-400 font-semibold">25.0x (Acute Anomaly)</span>
              </div>
            </div>

            {/* Distance from Home */}
            <div className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-950/30 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                  Distance from Customer Home
                </label>
                <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-2xs">
                  {features.distance_from_home.toFixed(1)} km
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="5"
                value={features.distance_from_home}
                onChange={(e) => onUpdateFeature("distance_from_home", parseFloat(e.target.value))}
                className="w-full accent-zinc-900 dark:accent-zinc-100 cursor-pointer h-1.5"
              />
              <div className="grid grid-cols-3 text-[10px] font-sans text-zinc-400 dark:text-zinc-500 pt-0.5">
                <span className="text-left">0 km (Local)</span>
                <span className="text-center">500 km (Regional)</span>
                <span className="text-right">2,000+ km (Long Distance)</span>
              </div>
            </div>

            {/* Distance from Last Transaction */}
            <div className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-950/30 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                  Distance from Previous Purchase
                </label>
                <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-2xs">
                  {features.distance_from_last_tx.toFixed(1)} km
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="5"
                value={features.distance_from_last_tx}
                onChange={(e) => onUpdateFeature("distance_from_last_tx", parseFloat(e.target.value))}
                className="w-full accent-zinc-900 dark:accent-zinc-100 cursor-pointer h-1.5"
              />
              <div className="grid grid-cols-3 text-[10px] font-sans text-zinc-400 dark:text-zinc-500 pt-0.5">
                <span className="text-left">0 km (Same Merchant)</span>
                <span className="text-center">500 km (Normal Travel)</span>
                <span className="text-right text-rose-500 dark:text-rose-400 font-semibold">2,000+ km (Suspicious Jump)</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: CARD SECURITY & CHANNEL */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">
                [03]
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono">
                Card Security & Purchase Channel
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-sans">
              Click any card to turn On or Off (Yes / No)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Repeat Retailer */}
            <button
              type="button"
              onClick={() => onUpdateFeature("repeat_retailer", features.repeat_retailer === 1 ? 0 : 1)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                features.repeat_retailer === 1
                  ? "border-emerald-500/60 bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 shadow-2xs"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-wider text-zinc-400 font-medium">
                  Merchant History
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    features.repeat_retailer === 1 ? "bg-emerald-500 shadow-xs shadow-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                />
              </div>
              <div className="mt-1.5">
                <div className="text-xs font-bold font-sans">
                  {features.repeat_retailer === 1 ? "✓ Frequent Store" : "✗ New Store"}
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                  {features.repeat_retailer === 1 ? "Customer shopped here before" : "First purchase at this store"}
                </div>
              </div>
            </button>

            {/* Chip EMV */}
            <button
              type="button"
              onClick={() => onUpdateFeature("used_chip", features.used_chip === 1 ? 0 : 1)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                features.used_chip === 1
                  ? "border-emerald-500/60 bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 shadow-2xs"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-wider text-zinc-400 font-medium">
                  Card Chip Security
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    features.used_chip === 1 ? "bg-emerald-500 shadow-xs shadow-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                />
              </div>
              <div className="mt-1.5">
                <div className="text-xs font-bold font-sans">
                  {features.used_chip === 1 ? "✓ Chip Verified" : "✗ Swipe Only (No Chip)"}
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                  {features.used_chip === 1 ? "Physical card chip verified" : "Magnetic stripe, easier to clone"}
                </div>
              </div>
            </button>

            {/* Security PIN */}
            <button
              type="button"
              onClick={() => onUpdateFeature("used_pin", features.used_pin === 1 ? 0 : 1)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                features.used_pin === 1
                  ? "border-emerald-500/60 bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 shadow-2xs"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-wider text-zinc-400 font-medium">
                  Security PIN
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    features.used_pin === 1 ? "bg-emerald-500 shadow-xs shadow-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                />
              </div>
              <div className="mt-1.5">
                <div className="text-xs font-bold font-sans">
                  {features.used_pin === 1 ? "✓ PIN Entered" : "✗ No PIN Entered"}
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                  {features.used_pin === 1 ? "Cardholder entered secret PIN" : "No PIN required or bypassed"}
                </div>
              </div>
            </button>

            {/* Purchase Channel */}
            <button
              type="button"
              onClick={() => onUpdateFeature("online_order", features.online_order === 1 ? 0 : 1)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                features.online_order === 1
                  ? "border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-wider text-zinc-400 font-medium">
                  Purchase Channel
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    features.online_order === 1 ? "bg-zinc-700 dark:bg-zinc-300 shadow-xs" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                />
              </div>
              <div className="mt-1.5">
                <div className="text-xs font-bold font-sans">
                  {features.online_order === 1 ? "🌐 Online (E-Commerce)" : "💳 In-Store (Physical)"}
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                  {features.online_order === 1 ? "Web or mobile app order" : "Physical in-person card terminal"}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* CTA Trigger Bar */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-sans text-zinc-500 dark:text-zinc-400">
            {isAnalyzing ? (
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-zinc-500 animate-ping" />
                <span>Running XGBoost + SHAP TreeExplainer & drafting legal compliance memo...</span>
              </div>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Ready to evaluate transaction risk and draft the explanation report.</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-sans font-bold text-xs shadow-lg transition-all cursor-pointer border ${
              isAnalyzing
                ? "bg-zinc-800 text-white border-zinc-700 animate-pulse"
                : "bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 shadow-zinc-950/10 hover:scale-[1.02] active:scale-[0.98] border-zinc-800 dark:border-zinc-200"
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Evaluating Risk & Drafting Memo...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current text-zinc-100 dark:text-zinc-900" />
                <span>Analyze Transaction Risk</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
