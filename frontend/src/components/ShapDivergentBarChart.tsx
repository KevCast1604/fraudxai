"use client";

import React, { useMemo } from "react";
import { ShapFactor } from "@/types";
import { ArrowLeftRight, TrendingDown, TrendingUp, Info } from "lucide-react";

interface ShapDivergentBarChartProps {
  factors: ShapFactor[];
  baseValue?: number;
}

export const ShapDivergentBarChart: React.FC<ShapDivergentBarChartProps> = ({
  factors,
  baseValue = 0.0,
}) => {
  // Sort factors by magnitude |shap_value| descending
  const sortedFactors = useMemo(() => {
    return [...factors].sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value));
  }, [factors]);

  // Max absolute SHAP value for dynamic scale normalization
  const maxAbsShap = useMemo(() => {
    const max = Math.max(...factors.map((f) => Math.abs(f.shap_value)), 0.1);
    return Math.ceil(max * 10) / 10;
  }, [factors]);

  return (
    <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-5 shadow-xl flex flex-col justify-between h-full min-h-0">
      {/* Top Section: Header + Scale Axis (shrink-0) */}
      <div className="shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80 gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono">
                Why did the system make this decision? (Key Factors)
              </h3>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
              Breakdown of purchase details that either raised alerts or confirmed the transaction was authentic.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-sans shrink-0">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="w-3 h-3" />
              <span>Reduces Risk (Safe)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
              <TrendingUp className="w-3 h-3" />
              <span>Increases Risk (Suspicious)</span>
            </div>
          </div>
        </div>

        {/* Scale Axis Header */}
        <div className="grid grid-cols-12 gap-2 text-[10px] font-sans text-zinc-400 pt-2.5 pb-2 border-b border-zinc-100 dark:border-zinc-800/60 items-center">
          <div className="col-span-12 sm:col-span-5 uppercase tracking-wider font-semibold">
            Factor & Observed Value
          </div>
          <div className="col-span-8 sm:col-span-5 grid grid-cols-2 text-center">
            <div className="text-right pr-2 text-emerald-600/80 dark:text-emerald-400/80 font-mono">
              ← -{maxAbsShap.toFixed(1)} (Safe)
            </div>
            <div className="text-left pl-2 text-rose-600/80 dark:text-rose-400/80 font-mono">
              +{maxAbsShap.toFixed(1)} (Risk) →
            </div>
          </div>
          <div className="col-span-4 sm:col-span-2 text-right uppercase tracking-wider font-semibold">
            Impact
          </div>
        </div>
      </div>

      {/* Middle Section: Scrollable Feature Attribution Rows with Dedicated Scrollbar */}
      <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/50 my-1 pr-1.5 max-h-[380px] lg:max-h-[420px] xl:max-h-[480px]">
        {sortedFactors.map((item) => {
          const isPositive = item.shap_value >= 0;
          const barWidthPercent = (Math.abs(item.shap_value) / maxAbsShap) * 100;

          return (
            <div
              key={item.feature}
              className="py-2.5 px-1.5 group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 rounded-lg transition-all"
            >
              <div className="grid grid-cols-12 gap-2 items-center">
                {/* Feature Name and Observed Value */}
                <div className="col-span-12 sm:col-span-5 pr-2">
                  <div
                    className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors break-words font-sans"
                    title={item.label}
                  >
                    {item.label}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-sans text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-zinc-400">Recorded:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-[10px]">
                      {item.observed_value}
                    </span>
                  </div>
                </div>

                {/* Divergent Bar Visualization */}
                <div className="col-span-8 sm:col-span-5 flex h-6 items-center relative">
                  {/* Center Line 0.0 */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-zinc-300 dark:bg-zinc-700 z-10" />

                  {/* Left Half: Mitigating Negative SHAP */}
                  <div className="w-1/2 h-full flex justify-end items-center pr-[1px]">
                    {!isPositive && (
                      <div
                        style={{ width: `${Math.min(100, barWidthPercent)}%` }}
                        className="h-3.5 bg-gradient-to-l from-emerald-500 to-teal-400 rounded-l-md transition-all duration-700 ease-out shadow-xs group-hover:brightness-110"
                        title={`Reduces fraud risk: -${Math.abs(item.shap_value).toFixed(4)}`}
                      />
                    )}
                  </div>

                  {/* Right Half: Positive Risk Inducing SHAP */}
                  <div className="w-1/2 h-full flex justify-start items-center pl-[1px]">
                    {isPositive && (
                      <div
                        style={{ width: `${Math.min(100, barWidthPercent)}%` }}
                        className="h-3.5 bg-gradient-to-r from-rose-500 to-red-400 rounded-r-md transition-all duration-700 ease-out shadow-xs group-hover:brightness-110"
                        title={`Increases fraud risk: +${item.shap_value.toFixed(4)}`}
                      />
                    )}
                  </div>
                </div>

                {/* Numerical Badge */}
                <div className="col-span-4 sm:col-span-2 text-right">
                  <span
                    className={`inline-block font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                      isPositive
                        ? "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20"
                        : "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    }`}
                  >
                    {isPositive ? `+${item.shap_value.toFixed(3)}` : item.shap_value.toFixed(3)}
                  </span>
                </div>
              </div>

              {/* Regulatory / Explanatory Reason: Always fully visible without cutoff */}
              {item.regulatory_reason && (
                <div className="mt-1.5 text-[10px] sm:text-[11px] text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed bg-zinc-50/80 dark:bg-zinc-950/40 p-2.5 rounded-md border border-zinc-200/60 dark:border-zinc-800/60">
                  <span className="font-sans text-[10px] font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mr-1.5">
                    Explanation:
                  </span>
                  <span className="break-words">{item.regulatory_reason}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Section: Footer Attribution Note (shrink-0) */}
      <div className="shrink-0 mt-2.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] font-sans text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span>Average baseline portfolio risk: <strong className="text-zinc-700 dark:text-zinc-300 font-mono">{baseValue.toFixed(4)}</strong></span>
        </div>
        <span>Transparent explanation complying with consumer fair lending & banking laws</span>
      </div>
    </div>
  );
};
