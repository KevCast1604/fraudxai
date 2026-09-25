"use client";

import React, { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Printer, Copy, Check, FileCheck2, ShieldAlert, Award, Maximize2, Minimize2 } from "lucide-react";

interface ComplianceViewerProps {
  memoMarkdown: string;
  auditId: string;
  timestamp: string;
  riskScore: number;
  riskTier: string;
}

// Convert raw ISO timestamps into human-friendly English
function formatFriendlyDate(isoString: string): string {
  if (!isoString) return "Date unavailable";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return isoString;
  }
}

// Replace raw code identifiers like `used_pin` or `online_order` with natural English
function humanizeMemoMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(/`used_pin`/g, "**Cardholder Security PIN**")
    .replace(/\bused_pin\b/g, "Cardholder Security PIN")
    .replace(/`used_chip`/g, "**EMV Chip Security**")
    .replace(/\bused_chip\b/g, "EMV Chip Security")
    .replace(/`online_order`/g, "**Online Purchase (E-Commerce)**")
    .replace(/\bonline_order\b/g, "Online Purchase (E-Commerce)")
    .replace(/`repeat_retailer`/g, "**Familiar Store (Repeat Retailer)**")
    .replace(/\brepeat_retailer\b/g, "Familiar Store (Repeat Retailer)")
    .replace(/`ratio_to_median_price`/g, "**Spending vs. 90-Day Habitual Average**")
    .replace(/\bratio_to_median_price\b/g, "Spending vs. 90-Day Habitual Average")
    .replace(/`distance_from_home`/g, "**Distance from Registered Address**")
    .replace(/\bdistance_from_home\b/g, "Distance from Registered Address")
    .replace(/`distance_from_last_tx`/g, "**Distance from Previous Purchase**")
    .replace(/\bdistance_from_last_tx\b/g, "Distance from Previous Purchase")
    .replace(/`amount`/g, "**Transaction Amount**")
    .replace(/\bamount\b/g, "Transaction Amount");
}

export const ComplianceViewer: React.FC<ComplianceViewerProps> = ({
  memoMarkdown,
  auditId,
  timestamp,
  riskScore,
  riskTier,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Clean formatted markdown without raw code variable names
  const readableMarkdown = useMemo(() => {
    return humanizeMemoMarkdown(memoMarkdown);
  }, [memoMarkdown]);

  const friendlyDate = useMemo(() => {
    return formatFriendlyDate(timestamp);
  }, [timestamp]);

  const handlePrint = () => {
    const originalTitle = document.title;
    const safeAuditId = auditId ? auditId.replace(/[^a-zA-Z0-9_-]/g, "_") : "Report";
    document.title = `FraudxAI-Audit-Report-${safeAuditId}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(readableMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const isCritical = riskTier === "CRITICAL";
  const isMedium = riskTier === "MEDIUM";

  const friendlyTier = isCritical
    ? "High Risk"
    : isMedium
    ? "Medium Risk"
    : "Low Risk";

  return (
    <div className="w-full rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden transition-all print:border-none print:shadow-none print:rounded-none print:bg-white print:overflow-visible print:w-full print:p-0 print:m-0">
      {/* Top Action Bar: Sticky during scroll, hidden during print */}
      <div className="sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 gap-3 print:hidden bg-zinc-50/95 dark:bg-zinc-950/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center border border-zinc-700/60">
            <FileCheck2 className="w-4 h-4 text-zinc-100" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-sans">
              Compliance & Audit Report
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
              Statutory memorandum documenting principal reasons and regulatory disclosures (CFPB & GDPR Art. 22).
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Expand / Compact View */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-xs"
            title={isExpanded ? "Switch to compact view" : "Expand to full document length"}
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>Compact</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>Expand</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          {/* Print / PDF Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-sans font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Scrollable Container with Custom Viewport Height */}
      <div
        className={`transition-all duration-300 ${
          isExpanded ? "max-h-none" : "max-h-[480px] overflow-y-auto"
        } print:max-h-none print:overflow-visible print:w-full print:p-0 print:m-0`}
      >

      {/* Official Audit Document Paper Layout */}
      <article
        id="compliance-document"
        className="p-6 sm:p-8 text-zinc-900 dark:text-zinc-100 print:text-black print:dark:text-black print:w-full print:max-w-none print:bg-white"
      >
        {/* Document Classification Header */}
        <div className="memo-avoid-break mb-6 pb-2 border-b border-zinc-200 dark:border-zinc-800 print:border-zinc-300 flex justify-between items-center text-xs font-sans text-zinc-500 dark:text-zinc-400 print:text-zinc-500">
          <span>Compliance & Risk Operations</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 print:text-black">
            Audit Documentation
          </span>
        </div>

        {/* Institutional Letterhead */}
        <header className="memo-avoid-break pb-6 mb-8 border-b border-zinc-200 dark:border-zinc-700 print:border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-950 dark:bg-zinc-800 border border-zinc-800 flex items-center justify-center print:border-black">
                <ShieldAlert className="w-5 h-5 text-zinc-100 print:text-black" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight uppercase font-sans text-zinc-950 dark:text-zinc-50 print:text-black">
                  Fraud Assessment & Adverse Action Report
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 print:text-zinc-600 font-sans mt-0.5">
                  Statutory evaluation documenting principal factual reasons under fair lending rules
                </p>
              </div>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 print:border-zinc-300 print:bg-white text-xs font-sans space-y-1.5 sm:text-right min-w-[240px]">
            <div className="flex justify-between sm:justify-end gap-3">
              <span className="text-zinc-400 font-bold uppercase text-[10px]">Tracking ID:</span>
              <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 print:text-black text-[11px]">
                {auditId}
              </span>
            </div>
            <div className="flex justify-between sm:justify-end gap-3">
              <span className="text-zinc-400 font-bold uppercase text-[10px]">Date & Time:</span>
              <span className="text-zinc-700 dark:text-zinc-300 print:text-black text-[11px] font-medium">
                {friendlyDate}
              </span>
            </div>
            <div className="flex justify-between sm:justify-end gap-3 items-center">
              <span className="text-zinc-400 font-bold uppercase text-[10px]">Risk Assessment:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[11px] print:text-black ${
                  isCritical
                    ? "text-rose-600 bg-rose-500/10"
                    : isMedium
                    ? "text-amber-600 bg-amber-500/10"
                    : "text-emerald-600 bg-emerald-500/10"
                }`}
              >
                {friendlyTier} ({(riskScore * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        </header>

        {/* Markdown Rendered Content with Sanitized Human Labels */}
        <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed space-y-5 print:text-[10pt] print:space-y-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ ...props }) => (
                <div className="overflow-x-auto my-6 rounded-lg border border-zinc-200 dark:border-zinc-800 print:border-zinc-300 print:overflow-visible print:my-4 print:w-full">
                  <table className="w-full text-xs font-sans print:text-[9.5pt] print:table-fixed" {...props} />
                </div>
              ),
              thead: ({ ...props }) => (
                <thead className="bg-zinc-100 dark:bg-zinc-800/80 print:bg-zinc-100 border-b border-zinc-200 dark:border-zinc-700 print:border-zinc-300" {...props} />
              ),
              th: ({ ...props }) => (
                <th className="p-2.5 text-left font-bold text-zinc-800 dark:text-zinc-200 print:text-black uppercase tracking-wider text-[11px] print:text-[9pt] print:p-2 print:break-words print:whitespace-normal" {...props} />
              ),
              td: ({ ...props }) => (
                <td className="p-2.5 border-b border-zinc-100 dark:border-zinc-800/60 print:border-zinc-300 text-zinc-700 dark:text-zinc-300 print:text-black print:text-[9.5pt] print:p-2 print:break-words print:whitespace-normal" {...props} />
              ),
              h1: ({ ...props }) => (
                <h1 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 print:text-black border-b border-zinc-200 dark:border-zinc-800 print:border-zinc-300 pb-2 mb-4 font-sans uppercase memo-avoid-break" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 print:text-black mt-6 mb-2 font-sans memo-avoid-break" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-800 dark:text-zinc-200 print:text-black mt-4 mb-1 font-sans memo-avoid-break" {...props} />
              ),
              p: ({ ...props }) => (
                <p className="text-zinc-700 dark:text-zinc-300 print:text-black leading-relaxed" {...props} />
              ),
              blockquote: ({ ...props }) => (
                <blockquote className="border-l-4 border-zinc-400 dark:border-zinc-600 print:border-zinc-400 bg-zinc-100/60 dark:bg-zinc-800/40 print:bg-zinc-50 p-3 rounded-r-lg italic text-xs my-3 text-zinc-700 dark:text-zinc-300 print:text-black memo-avoid-break" {...props} />
              ),
            }}
          >
            {readableMarkdown}
          </ReactMarkdown>
        </div>

        {/* Audit Verification Sign-off Footer */}
        <footer className="memo-avoid-break mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 print:border-zinc-400 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          <div>
            <div className="flex items-center gap-1.5 text-zinc-500 font-sans text-xs uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-zinc-500" />
              <span>Model Governance & Compliance (SR 26-2 & GDPR Art. 22)</span>
            </div>
            <p className="font-semibold text-zinc-800 dark:text-zinc-200 print:text-black mt-1">
              Generated by FraudxAI Risk Platform
            </p>
            <p className="text-zinc-500 text-xs font-sans mt-0.5">
              Model: XGBoost-Fraud-v1.0 (ROC-AUC: 94.4%) • Local Attribution: SHAP
            </p>
          </div>
          <div className="flex flex-col justify-end sm:text-right text-xs font-mono text-zinc-500">
            <div>Docket #{auditId}</div>
            <div>Statutory Audit Record • Confidential</div>
          </div>
        </footer>
      </article>
      </div>

      {/* Compact View Footer Bar */}
      {!isExpanded && (
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-950/60 flex items-center justify-between text-[11px] font-sans text-zinc-400 print:hidden px-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
            <span>Document docket viewing in compact mode (Scroll inside to review full memorandum).</span>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="text-zinc-900 dark:text-zinc-100 hover:underline font-semibold font-mono text-[10px] flex items-center gap-1 cursor-pointer"
          >
            <span>Expand Full Document</span>
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
