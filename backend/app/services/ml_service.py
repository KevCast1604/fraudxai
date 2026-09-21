"""
FraudxAI - Machine Learning & SHAP Explainability Service
GIBC V2 Hackathon - Track 02: Applied (Finance)
"""

import json
import os
import logging
from typing import Dict, List, Tuple
import joblib
import numpy as np
import pandas as pd

try:
    from app.schemas.transaction import TransactionInput, ShapFactor
except ModuleNotFoundError:
    from backend.app.schemas.transaction import TransactionInput, ShapFactor

logger = logging.getLogger("fraudxai.ml_service")

ARTIFACTS_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "ml", "artifacts")
)

FEATURE_METADATA = {
    "amount": {
        "label": "Transaction Amount",
        "format": lambda v: f"${v:,.2f} USD",
        "regulatory_risk": "Transaction value represents extreme capital exposure.",
        "regulatory_mitigation": "Transaction value is consistent with micro-payment thresholds.",
    },
    "distance_from_home": {
        "label": "Distance from Home",
        "format": lambda v: f"{v:,.1f} km",
        "regulatory_risk": "Activity initiated outside registered domestic geographic cluster.",
        "regulatory_mitigation": "Proximity to primary residence substantiates authentic cardholder presence.",
    },
    "distance_from_last_tx": {
        "label": "Transit Velocity (Distance from Last Tx)",
        "format": lambda v: f"{v:,.1f} km",
        "regulatory_risk": "Physically impossible transit velocity between consecutive transactions.",
        "regulatory_mitigation": "Consistent geographic sequence with previous verified transaction.",
    },
    "ratio_to_median_price": {
        "label": "Spending Spike (Ratio to Median)",
        "format": lambda v: f"{v:.1f}x baseline",
        "regulatory_risk": "Acute departure from established 90-day cardholder median spending habit.",
        "regulatory_mitigation": "Purchase amount aligns with historical median spending baseline.",
    },
    "repeat_retailer": {
        "label": "Merchant History (Repeat Retailer)",
        "format": lambda v: "Yes (Known Merchant)" if int(v) == 1 else "No (New Merchant)",
        "regulatory_risk": "First-time merchant interaction across unverified merchant category code.",
        "regulatory_mitigation": "Established, repetitive purchase relationship with familiar merchant.",
    },
    "used_chip": {
        "label": "EMV Chip Security",
        "format": lambda v: "Yes (Validated Chip)" if int(v) == 1 else "No (Stripe / Unvalidated)",
        "regulatory_risk": "Card-present charge executed without cryptographic EMV chip validation.",
        "regulatory_mitigation": "Cryptographically validated EMV chip confirms physical card authenticity.",
    },
    "used_pin": {
        "label": "Cardholder PIN Verification",
        "format": lambda v: "Yes (Verified PIN)" if int(v) == 1 else "No PIN Provided",
        "regulatory_risk": "Transaction processed without two-factor knowledge authentication (PIN).",
        "regulatory_mitigation": "Knowledge-based PIN entry provides authoritative two-factor proof.",
    },
    "online_order": {
        "label": "Transaction Channel (CNP / E-Commerce)",
        "format": lambda v: "Card-Not-Present (Online)" if int(v) == 1 else "Physical POS Terminal",
        "regulatory_risk": "Card-Not-Present (CNP) e-commerce channel exhibits heightened exposure.",
        "regulatory_mitigation": "Physical point-of-sale interaction reduces remote skimming vectors.",
    },
}


class MLService:
    def __init__(self):
        self.model = None
        self.explainer = None
        self.metadata = {}
        self.feature_columns = [
            "amount",
            "distance_from_home",
            "distance_from_last_tx",
            "ratio_to_median_price",
            "repeat_retailer",
            "used_chip",
            "used_pin",
            "online_order",
        ]
        self.base_value = 0.0
        self._load_artifacts()

    def _load_artifacts(self):
        model_path = os.path.join(ARTIFACTS_DIR, "model.joblib")
        explainer_path = os.path.join(ARTIFACTS_DIR, "explainer.joblib")
        metadata_path = os.path.join(ARTIFACTS_DIR, "metadata.json")

        if not os.path.exists(model_path) or not os.path.exists(explainer_path):
            raise FileNotFoundError(
                f"Missing ML model or explainer artifacts in {ARTIFACTS_DIR}. "
                "Execute backend/ml/train_model.py first."
            )

        logger.info("Loading serialized XGBoost model and SHAP TreeExplainer...")
        self.model = joblib.load(model_path)
        self.explainer = joblib.load(explainer_path)

        if os.path.exists(metadata_path):
            with open(metadata_path, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)
                self.base_value = float(self.metadata.get("base_value", 0.0))
        logger.info("MLService initialized successfully.")

    def predict_and_explain(self, tx: TransactionInput) -> Tuple[float, str, str, List[ShapFactor]]:
        """
        Executes inference and calculates local SHAP feature attributions.
        
        Returns:
            risk_score (float): Model predicted fraud probability (0.0 to 1.0)
            risk_tier (str): LOW, MEDIUM, or CRITICAL
            regulatory_action (str): Prescribed action
            shap_factors (List[ShapFactor]): Decomposed factors ranked by absolute attribution
        """
        # 1. Prepare Feature DataFrame
        input_data = {
            "amount": [tx.amount],
            "distance_from_home": [tx.distance_from_home],
            "distance_from_last_tx": [tx.distance_from_last_tx],
            "ratio_to_median_price": [tx.ratio_to_median_price],
            "repeat_retailer": [int(tx.repeat_retailer)],
            "used_chip": [int(tx.used_chip)],
            "used_pin": [int(tx.used_pin)],
            "online_order": [int(tx.online_order)],
        }
        df = pd.DataFrame(input_data)[self.feature_columns]

        # 2. Probability Prediction
        proba = float(self.model.predict_proba(df)[0, 1])
        risk_score = round(proba, 4)

        # 3. Regulatory Tiers
        if risk_score < 0.35:
            risk_tier = "LOW"
            regulatory_action = "AUTO_APPROVED"
        elif risk_score < 0.70:
            risk_tier = "MEDIUM"
            regulatory_action = "REQUIRE_2FA_OR_MANUAL_REVIEW"
        else:
            risk_tier = "CRITICAL"
            regulatory_action = "PREVENTIVE_BLOCK_AND_SAR_REFERRAL"

        # 4. SHAP Local Attribution
        raw_shap = self.explainer.shap_values(df)
        if isinstance(raw_shap, list):
            shap_vals = raw_shap[1][0]
        elif len(raw_shap.shape) == 3:
            shap_vals = raw_shap[0, :, 1]
        else:
            shap_vals = raw_shap[0]

        # 5. Build ShapFactor objects with regulatory statutory descriptions
        factors: List[ShapFactor] = []
        for feat_name, shap_val in zip(self.feature_columns, shap_vals):
            meta = FEATURE_METADATA.get(feat_name, {})
            val = input_data[feat_name][0]
            val_formatted = meta["format"](val) if "format" in meta else str(val)
            direction = "INCREASES_RISK" if shap_val >= 0 else "MITIGATES_RISK"
            reason = meta["regulatory_risk"] if shap_val >= 0 else meta["regulatory_mitigation"]

            factors.append(
                ShapFactor(
                    feature=feat_name,
                    label=meta.get("label", feat_name),
                    observed_value=val_formatted,
                    shap_value=round(float(shap_val), 4),
                    risk_direction=direction,
                    regulatory_reason=reason,
                )
            )

        # Sort factors by absolute impact descending
        factors.sort(key=lambda f: abs(f.shap_value), reverse=True)

        return risk_score, risk_tier, regulatory_action, factors


# Singleton instance
ml_service = MLService()
