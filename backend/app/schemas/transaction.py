"""
Pydantic Schemas for FraudxAI API
GIBC V2 Hackathon - Track 02: Applied (Finance)
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class TransactionInput(BaseModel):
    """Transaction features submitted for fraud analysis and compliance auditing."""
    amount: float = Field(..., ge=0.01, le=100000.0, description="Transaction amount in USD", example=4250.00)
    distance_from_home: float = Field(..., ge=0.0, le=20000.0, description="Distance from registered home in km", example=380.5)
    distance_from_last_tx: float = Field(..., ge=0.0, le=20000.0, description="Distance from last valid transaction in km", example=460.2)
    ratio_to_median_price: float = Field(..., ge=0.01, le=500.0, description="Ratio to customer 90-day median purchase price", example=11.4)
    repeat_retailer: int = Field(..., ge=0, le=1, description="1 if habitual retailer, 0 if new merchant", example=0)
    used_chip: int = Field(..., ge=0, le=1, description="1 if physical EMV chip validated, 0 otherwise", example=0)
    used_pin: int = Field(..., ge=0, le=1, description="1 if security PIN entered, 0 otherwise", example=0)
    online_order: int = Field(..., ge=0, le=1, description="1 if Card-Not-Present (e-commerce), 0 if physical POS", example=0)
    provider: Optional[str] = Field("featherless", description="Target LLM provider: featherless, groq, or offline")
    model: Optional[str] = Field(None, description="Optional custom model override")


class ShapFactor(BaseModel):
    """Local attribution factor produced by SHAP TreeExplainer."""
    feature: str = Field(..., description="Machine-readable feature key")
    label: str = Field(..., description="Human-readable financial feature name")
    observed_value: str = Field(..., description="Formatted observed value with units")
    shap_value: float = Field(..., description="Additive contribution to margin score")
    risk_direction: str = Field(..., description="'INCREASES_RISK' or 'MITIGATES_RISK'")
    regulatory_reason: str = Field(..., description="Statutory compliance description under CFPB Reg B / SR 26-2")


class RecourseIntervention(BaseModel):
    """Specific feature adjustment proposed to achieve counterfactual risk reduction."""
    feature: str = Field(..., description="Feature key being modified")
    label: str = Field(..., description="Human-readable feature name")
    current_value: str = Field(..., description="Current observed feature value")
    target_value: str = Field(..., description="Recommended counterfactual feature value")
    intervention_type: str = Field(..., description="Category: AUTHENTICATION, HARDWARE_EMV, MERCHANT_TRUST, GEOLOCATION, etc.")


class ActionableRecourse(BaseModel):
    """Counterfactual recourse path to overturn adverse block or reduce elevated risk (CFPB Reg B / GDPR Art. 22)."""
    recourse_id: str = Field(..., description="Unique recourse scenario identifier")
    title: str = Field(..., description="Actionable title for the recourse path")
    description: str = Field(..., description="Operational explanation of what cardholder or bank can do")
    category: str = Field(..., description="Primary category of the intervention")
    simulated_risk_score: float = Field(..., description="Simulated fraud probability after applying intervention")
    simulated_risk_tier: str = Field(..., description="LOW, MEDIUM, or CRITICAL after intervention")
    simulated_action: str = Field(..., description="Prescribed institutional action after intervention")
    risk_delta: float = Field(..., description="Reduction in fraud probability (positive indicates risk reduced)")
    target_achieved: bool = Field(..., description="True if simulated risk score drops to LOW (<0.35)")
    interventions: List[RecourseIntervention] = Field(..., description="List of concrete parameter modifications")
    regulatory_remedy: str = Field(..., description="Statutory compliance citation under CFPB Reg B / GDPR Art. 22(3)")
    patch_features: dict = Field(..., description="Raw dictionary of feature key-values to apply to simulation")


class AuditTelemetry(BaseModel):
    """Inference telemetry and audit trail metadata."""
    provider: str = Field(..., description="LLM provider executed (featherless, groq, adaption_labs, or offline_fallback)")
    model: str = Field(..., description="Model identifier used for the compliance memo")
    latency_ms: int = Field(..., description="End-to-end LLM processing latency in milliseconds")
    fallback_triggered: bool = Field(..., description="True if primary provider timed out or failed")
    fallback_reason: Optional[str] = Field(None, description="Diagnostic error details if failover occurred")


class AnalysisResponse(BaseModel):
    """Comprehensive fraud analysis response with risk scoring, XAI attribution, legal memo, and actionable recourse."""
    audit_id: str = Field(..., description="Unique compliance audit identifier (ACM-...)")
    timestamp: str = Field(..., description="ISO 8601 UTC timestamp of decision")
    risk_score: float = Field(..., ge=0.0, le=1.0, description="Predicted fraud probability (0.0 to 1.0)")
    risk_tier: str = Field(..., description="LOW (<0.35), MEDIUM (0.35-0.70), or CRITICAL (>=0.70)")
    regulatory_action: str = Field(..., description="Prescribed institutional action (AUTO_APPROVED, REQUIRE_2FA, PREVENTIVE_BLOCK)")
    base_value: float = Field(..., description="Expected baseline portfolio margin score")
    shap_factors: List[ShapFactor] = Field(..., description="Decomposed feature contributions ranked by absolute impact")
    compliance_memo: str = Field(..., description="Generated legal compliance memorandum in Markdown")
    telemetry: AuditTelemetry = Field(..., description="Execution telemetry and audit provenance")
    actionable_recourse: List[ActionableRecourse] = Field(
        default_factory=list,
        description="Actionable counterfactual interventions to overturn adverse decision"
    )


class SimulateResponse(BaseModel):
    """Ultra-fast (<5ms) simulation and counterfactual calculation response without LLM call."""
    risk_score: float = Field(..., ge=0.0, le=1.0, description="Predicted fraud probability (0.0 to 1.0)")
    risk_tier: str = Field(..., description="LOW (<0.35), MEDIUM (0.35-0.70), or CRITICAL (>=0.70)")
    regulatory_action: str = Field(..., description="Prescribed institutional action")
    base_value: float = Field(..., description="Expected baseline portfolio margin score")
    shap_factors: List[ShapFactor] = Field(..., description="Decomposed feature contributions")
    actionable_recourse: List[ActionableRecourse] = Field(..., description="Actionable counterfactual recourse paths")
