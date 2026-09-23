"""
FraudxAI - Analysis API Endpoints
GIBC V2 Hackathon - Track 02: Applied (Finance)
"""

from datetime import datetime, timezone
import uuid
import logging
from fastapi import APIRouter, HTTPException

try:
    from app.schemas.transaction import TransactionInput, AnalysisResponse, SimulateResponse
    from app.services.ml_service import ml_service
    from app.services.compliance_agent import compliance_agent
except ModuleNotFoundError:
    from backend.app.schemas.transaction import TransactionInput, AnalysisResponse, SimulateResponse
    from backend.app.services.ml_service import ml_service
    from backend.app.services.compliance_agent import compliance_agent

router = APIRouter()
logger = logging.getLogger("fraudxai.endpoints.analyze")


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_transaction(tx: TransactionInput) -> AnalysisResponse:
    """
    Analyzes a financial transaction:
    1. Evaluates fraud risk probability using calibrated XGBoost classifier.
    2. Calculates exact local feature attributions using SHAP TreeExplainer.
    3. Computes actionable counterfactual recourse pathways (Right to Recourse).
    4. Synthesizes an auditable compliance memorandum via Resilient LLM Agent.
    """
    try:
        # Generate unique audit reference ID and UTC timestamp
        audit_id = f"ACM-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        timestamp = datetime.now(timezone.utc).isoformat()

        # Step 1 & 2: XGBoost & SHAP local decomposition
        risk_score, risk_tier, regulatory_action, shap_factors = ml_service.predict_and_explain(tx)

        # Step 3: Counterfactual Actionable Recourse Computation (Right to Recourse)
        actionable_recourse = ml_service.compute_actionable_recourse(
            tx=tx,
            current_risk=risk_score,
            current_tier=risk_tier,
            shap_factors=shap_factors,
        )

        # Step 4: Resilient LLM compliance memorandum generation
        memo_result = await compliance_agent.generate_compliance_memo(
            audit_id=audit_id,
            timestamp=timestamp,
            tx=tx,
            risk_score=risk_score,
            risk_tier=risk_tier,
            regulatory_action=regulatory_action,
            base_value=ml_service.base_value,
            shap_factors=shap_factors,
            preferred_provider=getattr(tx, "provider", None),
            preferred_model=getattr(tx, "model", None),
            actionable_recourse=actionable_recourse,
        )

        factors_data = [
            f.model_dump() if hasattr(f, "model_dump") else f.dict() if hasattr(f, "dict") else f
            for f in shap_factors
        ]
        telemetry_obj = memo_result["telemetry"]
        telemetry_data = (
            telemetry_obj.model_dump()
            if hasattr(telemetry_obj, "model_dump")
            else telemetry_obj.dict()
            if hasattr(telemetry_obj, "dict")
            else telemetry_obj
        )

        return AnalysisResponse(
            audit_id=audit_id,
            timestamp=timestamp,
            risk_score=risk_score,
            risk_tier=risk_tier,
            regulatory_action=regulatory_action,
            base_value=ml_service.base_value,
            shap_factors=factors_data,
            compliance_memo=memo_result["memo"],
            telemetry=telemetry_data,
            actionable_recourse=actionable_recourse,
        )

    except Exception as exc:
        logger.error(f"Error analyzing transaction: {exc}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal fraud analysis pipeline error: {str(exc)}"
        )


@router.post("/simulate", response_model=SimulateResponse)
async def simulate_transaction(tx: TransactionInput) -> SimulateResponse:
    """
    Ultra-fast (<5ms) simulation and counterfactual calculation without LLM call.
    Returns predicted risk score, SHAP attributions, and actionable recourse pathways.
    """
    try:
        risk_score, risk_tier, regulatory_action, shap_factors = ml_service.predict_and_explain(tx)
        actionable_recourse = ml_service.compute_actionable_recourse(
            tx=tx,
            current_risk=risk_score,
            current_tier=risk_tier,
            shap_factors=shap_factors,
        )
        return SimulateResponse(
            risk_score=risk_score,
            risk_tier=risk_tier,
            regulatory_action=regulatory_action,
            base_value=ml_service.base_value,
            shap_factors=shap_factors,
            actionable_recourse=actionable_recourse,
        )
    except Exception as exc:
        logger.error(f"Error simulating transaction: {exc}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Transaction simulation error: {str(exc)}"
        )


@router.get("/health")
async def health_check():
    """System health check and loaded model diagnostics."""
    return {
        "status": "healthy",
        "service": "FraudxAI Backend",
        "model_loaded": ml_service.model is not None,
        "explainer_loaded": ml_service.explainer is not None,
        "base_value": ml_service.base_value,
        "active_features": ml_service.feature_columns,
    }
