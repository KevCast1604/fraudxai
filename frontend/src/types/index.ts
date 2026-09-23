export type LLMProvider = "featherless" | "groq" | "offline";

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  name: string;
  description: string;
  badge: string;
  badgeColor: string;
  speed: string;
  isDefault?: boolean;
}

export interface TransactionFeatures {
  amount: number;
  distance_from_home: number;
  distance_from_last_tx: number;
  ratio_to_median_price: number;
  repeat_retailer: number;
  used_chip: number;
  used_pin: number;
  online_order: number;
  provider?: string;
  model?: string;
}

export interface ShapFactor {
  feature: string;
  label: string;
  observed_value: string;
  shap_value: number;
  risk_direction: "INCREASES_RISK" | "MITIGATES_RISK";
  regulatory_reason: string;
}

export interface RecourseIntervention {
  feature: string;
  label: string;
  current_value: string;
  target_value: string;
  intervention_type: string;
}

export interface ActionableRecourse {
  recourse_id: string;
  title: string;
  description: string;
  category: string;
  simulated_risk_score: number;
  simulated_risk_tier: "LOW" | "MEDIUM" | "CRITICAL";
  simulated_action: string;
  risk_delta: number;
  target_achieved: boolean;
  interventions: RecourseIntervention[];
  regulatory_remedy: string;
  patch_features: Partial<TransactionFeatures>;
}

export interface AuditTelemetry {
  provider: string;
  model: string;
  latency_ms: number;
  fallback_triggered: boolean;
  fallback_reason?: string | null;
}

export interface AnalysisResponse {
  audit_id: string;
  timestamp: string;
  risk_score: number;
  risk_tier: "LOW" | "MEDIUM" | "CRITICAL";
  regulatory_action: string;
  base_value: number;
  shap_factors: ShapFactor[];
  compliance_memo: string;
  telemetry: AuditTelemetry;
  actionable_recourse?: ActionableRecourse[];
}

export interface SimulateResponse {
  risk_score: number;
  risk_tier: "LOW" | "MEDIUM" | "CRITICAL";
  regulatory_action: string;
  base_value: number;
  shap_factors: ShapFactor[];
  actionable_recourse: ActionableRecourse[];
}

export interface PresetScenario {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  expectedOutcome: "APPROVE" | "REVIEW" | "BLOCK";
  features: TransactionFeatures;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "card-cloning",
    name: "Physical Card Cloning Attack",
    badge: "CRITICAL RISK",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    description: "Impossible geographic jump from previous transaction (460 km away), 11x spending spike, magnetic stripe used at unfamiliar POS with no PIN.",
    expectedOutcome: "BLOCK",
    features: {
      amount: 4250.00,
      distance_from_home: 380.5,
      distance_from_last_tx: 460.2,
      ratio_to_median_price: 11.4,
      repeat_retailer: 0,
      used_chip: 0,
      used_pin: 0,
      online_order: 0,
    },
  },
  {
    id: "legitimate-grocery",
    name: "Regular Supermarket Routine",
    badge: "LOW RISK",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description: "Daily routine purchase near cardholder home, habitual retailer, verified with physical EMV chip and personal PIN.",
    expectedOutcome: "APPROVE",
    features: {
      amount: 54.80,
      distance_from_home: 2.1,
      distance_from_last_tx: 0.8,
      ratio_to_median_price: 0.95,
      repeat_retailer: 1,
      used_chip: 1,
      used_pin: 1,
      online_order: 0,
    },
  },
  {
    id: "cnp-velocity",
    name: "E-Commerce Account Takeover (CNP)",
    badge: "CRITICAL RISK",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    description: "Card-Not-Present high-value transaction for luxury goods at unfamiliar online retailer with 7.5x historical spend.",
    expectedOutcome: "BLOCK",
    features: {
      amount: 3150.00,
      distance_from_home: 0.0,
      distance_from_last_tx: 0.0,
      ratio_to_median_price: 7.5,
      repeat_retailer: 0,
      used_chip: 0,
      used_pin: 0,
      online_order: 1,
    },
  },
  {
    id: "travel-ambiguity",
    name: "Domestic Travel / Step-Up Auth",
    badge: "MEDIUM RISK",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    description: "Cardholder traveling domestically, chip used at new retailer with moderately elevated amount. Prescribes 2FA step-up challenge.",
    expectedOutcome: "REVIEW",
    features: {
      amount: 320.00,
      distance_from_home: 145.0,
      distance_from_last_tx: 52.0,
      ratio_to_median_price: 2.4,
      repeat_retailer: 0,
      used_chip: 1,
      used_pin: 0,
      online_order: 0,
    },
  },
];
