"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";

interface RadialRiskGaugeProps {
  score: number; // Value between 0.00 and 1.00
  size?: number;
}

export const RadialRiskGauge: React.FC<RadialRiskGaugeProps> = ({ score, size = 230 }) => {
  const clampedScore = Math.max(0, Math.min(1, score));
  const radius = 94;
  const strokeWidth = 10;
  const arcLength = Math.PI * radius; // ~295.3
  const strokeDashoffset = arcLength * (1 - clampedScore);
  const needleAngle = -90 + clampedScore * 180;

  const getSeverity = (val: number) => {
    if (val < 0.35) {
      return {
        label: "LOW RISK",
        action: "Safe to Approve",
        icon: ShieldCheck,
        badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
        beaconColor: "bg-emerald-400 shadow-emerald-500",
        gradientId: "gaugeGradLow",
        accentHex: "#10b981",
      };
    }
    if (val < 0.70) {
      return {
        label: "MEDIUM RISK",
        action: "Requires 2FA Confirmation",
        icon: AlertTriangle,
        badgeColor: "text-amber-500 bg-amber-500/10 border-amber-500/30",
        beaconColor: "bg-amber-400 shadow-amber-500",
        gradientId: "gaugeGradMed",
        accentHex: "#f59e0b",
      };
    }
    return {
      label: "HIGH RISK",
      action: "Recommended Preventive Block",
      icon: ShieldAlert,
      badgeColor: "text-rose-500 bg-rose-500/10 border-rose-500/30",
      beaconColor: "bg-rose-400 shadow-rose-500",
      gradientId: "gaugeGradCrit",
      accentHex: "#f43f5e",
    };
  };

  const severity = getSeverity(clampedScore);
  const StatusIcon = severity.icon;

  return (
    <div className="relative flex flex-col items-center justify-between p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden h-full">
      {/* Header tag */}
      <div className="w-full flex items-center justify-between pb-2.5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: severity.accentHex }} />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-sans">
            Risk Determination
          </span>
        </div>
        <span className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">
          {(clampedScore * 100).toFixed(1)}%
        </span>
      </div>

      {/* Gauge Dial Container */}
      <div className="relative mt-2" style={{ width: size, height: size * 0.64 }}>
        <svg
          viewBox="0 0 280 170"
          className="w-full h-full overflow-visible"
          role="img"
          aria-label={`Fraud Risk: ${(clampedScore * 100).toFixed(1)}%`}
        >
          <defs>
            <linearGradient id="riskTrackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />   {/* Emerald */}
              <stop offset="50%" stopColor="#f59e0b" />  {/* Amber */}
              <stop offset="100%" stopColor="#f43f5e" /> {/* Rose */}
            </linearGradient>

            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={severity.accentHex} floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Tick Marks around Dial */}
          {[0, 20, 35, 50, 70, 85, 100].map((tick) => {
            const angle = -180 + (tick / 100) * 180;
            const rad = (angle * Math.PI) / 180;
            const innerR = 108;
            const outerR = tick === 35 || tick === 70 ? 116 : 113;
            const x1 = 140 + innerR * Math.cos(rad);
            const y1 = 145 + innerR * Math.sin(rad);
            const x2 = 140 + outerR * Math.cos(rad);
            const y2 = 145 + outerR * Math.sin(rad);
            const isHighlight = tick === 35 || tick === 70;

            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isHighlight ? (tick === 35 ? "#f59e0b" : "#f43f5e") : "#71717a"}
                strokeWidth={isHighlight ? 2 : 1}
                strokeOpacity={isHighlight ? 0.9 : 0.4}
              />
            );
          })}

          {/* Background Track */}
          <path
            d="M 46 145 A 94 94 0 0 1 234 145"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-zinc-200/80 dark:text-zinc-800/90"
          />

          {/* Threshold Zone Markers */}
          {/* 35% Amber Threshold Marker */}
          <circle cx="102" cy="62" r="3" className="fill-amber-400 stroke-1 stroke-white dark:stroke-zinc-900" />
          {/* 70% Rose Threshold Marker */}
          <circle cx="192" cy="71" r="3" className="fill-rose-500 stroke-1 stroke-white dark:stroke-zinc-900" />

          {/* Active Dynamic Risk Arc */}
          <path
            d="M 46 145 A 94 94 0 0 1 234 145"
            fill="none"
            stroke="url(#riskTrackGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
            style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1)" }}
          />

          {/* Needle Indicator */}
          <g
            style={{
              transform: `rotate(${needleAngle}deg)`,
              transformOrigin: "140px 145px",
              transition: "transform 900ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* Needle Body */}
            <polygon points="137,145 143,145 140,46" className="fill-zinc-900 dark:fill-zinc-100" />
            <line x1="140" y1="145" x2="140" y2="46" stroke="#a1a1aa" strokeWidth="1" />
            {/* Center Pivot Boss */}
            <circle cx="140" cy="145" r="9" className="fill-zinc-900 dark:fill-zinc-100" />
            <circle cx="140" cy="145" r="4" className="fill-zinc-400 dark:fill-zinc-500" />
          </g>
        </svg>

        {/* Boundary Ticks Text */}
        <div className="absolute -bottom-1 left-3 text-[10px] font-sans text-zinc-400">
          0% Safe
        </div>
        <div className="absolute -bottom-1 right-3 text-[10px] font-sans text-zinc-400">
          100% Fraud
        </div>
      </div>

      {/* Digital Readout Block */}
      <div className="w-full mt-1 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col items-center">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-zinc-950 dark:text-zinc-50">
            {(clampedScore * 100).toFixed(1)}
          </span>
          <span className="text-base font-bold font-mono text-zinc-400">%</span>
        </div>
        <span className="text-[10px] uppercase font-sans tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
          Calculated Fraud Probability
        </span>

        {/* Action Status Pill */}
        <div
          className={`mt-2 w-full py-1.5 px-2.5 rounded-lg border flex items-center justify-center gap-1.5 text-xs font-sans font-bold tracking-wide transition-all ${severity.badgeColor}`}
        >
          <StatusIcon className="w-3.5 h-3.5 shrink-0" />
          <span>{severity.label}</span>
          <span className="opacity-50">•</span>
          <span className="text-[10px] sm:text-[11px] font-medium tracking-normal">{severity.action}</span>
        </div>
      </div>
    </div>
  );
};
