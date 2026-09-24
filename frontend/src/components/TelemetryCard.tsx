"use client";

import React from "react";
import { Activity, CheckCircle2, AlertTriangle, Zap, Server, Settings2 } from "lucide-react";
import { AuditTelemetry } from "@/types";

interface TelemetryCardProps {
  telemetry: AuditTelemetry;
  onOpenSettings?: () => void;
}

export const TelemetryCard: React.FC<TelemetryCardProps> = ({ telemetry, onOpenSettings }) => {
  return (
    <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-5 shadow-xl print:hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-zinc-100 dark:border-zinc-800/80 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono">
            System & Evaluation Telemetry
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-[11px] font-mono font-bold transition-all cursor-pointer shadow-2xs"
              title="Open AI Provider selection sidebar"
            >
              <Settings2 className="w-3.5 h-3.5 text-zinc-500" />
              <span>Change Provider / Settings</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
        {/* Active Provider */}
        <div
          onClick={onOpenSettings}
          className={`p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 ${
            onOpenSettings ? "cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors group" : ""
          }`}
          title={onOpenSettings ? "Click to change provider" : undefined}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-sans uppercase tracking-wider block">
              AI Provider
            </span>
            {onOpenSettings && (
              <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Edit ↗
              </span>
            )}
          </div>
          <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 font-mono mt-1 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            {telemetry.provider}
          </span>
        </div>

        {/* Model Architecture */}
        <div className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40">
          <span className="text-[10px] text-zinc-400 font-sans uppercase tracking-wider block">
            Drafting Model
          </span>
          <span
            className="font-bold text-xs text-zinc-900 dark:text-zinc-100 font-mono mt-1 inline-block truncate max-w-[160px]"
            title={telemetry.model}
          >
            {telemetry.model}
          </span>
        </div>

        {/* Inference Latency */}
        <div className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40">
          <span className="text-[10px] text-zinc-400 font-sans uppercase tracking-wider block">
            Response Time
          </span>
          <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 font-mono mt-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            {telemetry.latency_ms} ms
          </span>
        </div>

        {/* Failover Status */}
        <div className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40">
          <span className="text-[10px] text-zinc-400 font-sans uppercase tracking-wider block">
            Server Status
          </span>
          <span className="mt-1 flex items-center gap-1 text-xs font-sans font-bold">
            {telemetry.fallback_triggered ? (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Failover Backup Active
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Primary Server Nominal
              </span>
            )}
          </span>
        </div>
      </div>

      {telemetry.fallback_reason && (
        <div className="mt-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 font-sans flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
          <div>
            <strong>Failover Notice:</strong> {telemetry.fallback_reason}
          </div>
        </div>
      )}
    </div>
  );
};
