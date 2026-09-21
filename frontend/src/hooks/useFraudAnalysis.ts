"use client";

import { useState, useCallback, useEffect } from "react";
import { TransactionFeatures, PRESET_SCENARIOS, PresetScenario, AnalysisResponse } from "@/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export function useFraudAnalysis() {
  const [features, setFeatures] = useState<TransactionFeatures>(PRESET_SCENARIOS[0].features);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_SCENARIOS[0].id);
  const [selectedProvider, setSelectedProvider] = useState<string>("featherless");
  const [selectedModel, setSelectedModel] = useState<string>("Qwen/Qwen2.5-7B-Instruct");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyPreset = useCallback((preset: PresetScenario) => {
    setFeatures({ ...preset.features });
    setSelectedPresetId(preset.id);
  }, []);

  const updateFeature = useCallback((key: keyof TransactionFeatures, value: number) => {
    setSelectedPresetId("custom");
    setFeatures((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFeatures = useCallback(() => {
    applyPreset(PRESET_SCENARIOS[0]);
  }, [applyPreset]);

  const runAnalysis = useCallback(async (providerOverride?: string, modelOverride?: string) => {
    setIsAnalyzing(true);
    setError(null);

    // Strictly ensure providerOverride is a string (never a DOM/React SyntheticEvent)
    const validProvider =
      typeof providerOverride === "string" && providerOverride.trim().length > 0
        ? providerOverride.trim()
        : selectedProvider;

    const validModel =
      typeof modelOverride === "string" && modelOverride.trim().length > 0
        ? modelOverride.trim()
        : selectedModel;

    const payload = {
      ...features,
      provider: validProvider,
      model: validModel || undefined,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server responded with status ${res.status}`);
      }

      const data: AnalysisResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to analyze transaction";
      console.error("Fraud analysis error:", err);
      setError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  }, [features, selectedProvider, selectedModel]);

  // Run initial analysis automatically on mount
  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    features,
    selectedPresetId,
    selectedProvider,
    setSelectedProvider,
    selectedModel,
    setSelectedModel,
    isAnalyzing,
    result,
    error,
    applyPreset,
    updateFeature,
    resetFeatures,
    runAnalysis,
  };
}
