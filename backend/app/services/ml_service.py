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
    from app.schemas.transaction import TransactionInput, ShapFactor, RecourseIntervention, ActionableRecourse
except ModuleNotFoundError:
    from backend.app.schemas.transaction import TransactionInput, ShapFactor, RecourseIntervention, ActionableRecourse

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

    def compute_actionable_recourse(
        self,
        tx: TransactionInput,
        current_risk: float,
        current_tier: str,
        shap_factors: List[ShapFactor] = None,
    ) -> List[ActionableRecourse]:
        """
        Calculates actionable counterfactual recourse interventions (Right to Recourse).
        Identifies minimal feature changes required to overturn an adverse block or reduce risk to LOW / AUTO_APPROVED.
        Directly satisfies CFPB Circular 2023-03, US ECOA Reg B (§ 1002.9), and GDPR Article 22(3).
        """
        if current_tier == "LOW" and current_risk < 0.35:
            # Low risk transactions require no adverse recourse
            return []

        candidates = []

        # 1. Strong Cardholder Authentication (PIN / 3DSecure)
        if tx.used_pin == 0:
            if tx.online_order == 1:
                candidates.append({
                    "recourse_id": "rc-3ds-otp",
                    "title": "3D-Secure 2.0 / Cardholder OTP Verification",
                    "category": "AUTHENTICATION",
                    "description": "Complete out-of-band mobile biometric challenge or SMS OTP to authoritatively verify online cardholder presence.",
                    "regulatory_remedy": "CFPB Reg B § 1002.9(a)(2) & PSD2 Strong Customer Authentication (SCA)",
                    "patch": {"used_pin": 1},
                    "interventions": [
                        RecourseIntervention(
                            feature="used_pin",
                            label="Authentication Security (3D-Secure / PIN)",
                            current_value="Unauthenticated / Bypass",
                            target_value="3D-Secure 2.0 Verified (SCA)",
                            intervention_type="AUTHENTICATION",
                        )
                    ],
                })
            else:
                if tx.used_chip == 0:
                    candidates.append({
                        "recourse_id": "rc-emv-chip-pin",
                        "title": "Cryptographic EMV Chip & PIN Authentication",
                        "category": "HARDWARE_EMV",
                        "description": "Insert physical cryptographic EMV chip and validate cardholder secret PIN at the point-of-sale terminal.",
                        "regulatory_remedy": "CFPB Circular 2023-03 & EMV Cryptographic Terminal Protocol",
                        "patch": {"used_chip": 1, "used_pin": 1},
                        "interventions": [
                            RecourseIntervention(
                                feature="used_chip",
                                label="EMV Chip Hardware",
                                current_value="Magnetic Stripe (Unvalidated)",
                                target_value="Cryptographic EMV Chip Verified",
                                intervention_type="HARDWARE_EMV",
                            ),
                            RecourseIntervention(
                                feature="used_pin",
                                label="Cardholder Secret PIN",
                                current_value="No PIN Entered",
                                target_value="Encrypted PIN Verified",
                                intervention_type="AUTHENTICATION",
                            ),
                        ],
                    })
                else:
                    candidates.append({
                        "recourse_id": "rc-pin-stepup",
                        "title": "Cardholder PIN Step-Up Challenge",
                        "category": "AUTHENTICATION",
                        "description": "Enter authorized cardholder PIN on POS terminal to provide authoritative two-factor proof.",
                        "regulatory_remedy": "CFPB Reg B § 1002.9 Consumer Recourse Protocol",
                        "patch": {"used_pin": 1},
                        "interventions": [
                            RecourseIntervention(
                                feature="used_pin",
                                label="Cardholder Secret PIN",
                                current_value="No PIN Entered",
                                target_value="Encrypted PIN Verified",
                                intervention_type="AUTHENTICATION",
                            )
                        ],
                    })

        # 2. Merchant Whitelisting & Trust Verification
        if tx.repeat_retailer == 0:
            candidates.append({
                "recourse_id": "rc-merchant-whitelist",
                "title": "Merchant Whitelisting & History Confirmation",
                "category": "MERCHANT_TRUST",
                "description": "Cardholder confirms merchant identity in banking app, establishing verified payee trust status.",
                "regulatory_remedy": "GDPR Art. 22(3) Right to Contestation & Cardholder Merchant Whitelisting",
                "patch": {"repeat_retailer": 1},
                "interventions": [
                    RecourseIntervention(
                        feature="repeat_retailer",
                        label="Merchant Interaction History",
                        current_value="New / Unrecognized Merchant",
                        target_value="Verified Repeat / Whitelisted Retailer",
                        intervention_type="MERCHANT_TRUST",
                    )
                ],
            })

        # 3. Transit Velocity & Geolocation Verification (< 15 km)
        if tx.distance_from_last_tx > 15.0:
            target_dist = round(min(10.0, max(0.5, tx.distance_from_home)), 1)
            candidates.append({
                "recourse_id": "rc-transit-velocity",
                "title": "Geographic Velocity Clearance (< 15 km)",
                "category": "GEOLOCATION",
                "description": f"Confirm normal transit route sequence or geographic location within {target_dist:.1f} km.",
                "regulatory_remedy": "CFPB Circular 2023-03 Geographic Exception & Velocity Clearance Protocol",
                "patch": {"distance_from_last_tx": target_dist},
                "interventions": [
                    RecourseIntervention(
                        feature="distance_from_last_tx",
                        label="Transit Velocity (Distance from Last Tx)",
                        current_value=f"{tx.distance_from_last_tx:,.1f} km",
                        target_value=f"{target_dist:.1f} km (Proximity Cleared)",
                        intervention_type="GEOLOCATION",
                    )
                ],
            })

        # 4. Multi-Factor Combination Recourse
        if tx.used_pin == 0 and (tx.repeat_retailer == 0 or tx.distance_from_last_tx > 15.0 or tx.used_chip == 0):
            if tx.online_order == 1:
                candidates.append({
                    "recourse_id": "rc-combo-3ds-merchant",
                    "title": "3D-Secure 2.0 + Trusted Merchant Registration",
                    "category": "STEP_UP_PROTOCOL",
                    "description": "Simultaneously authenticate cardholder via 3D-Secure OTP and save merchant to trusted payee whitelist.",
                    "regulatory_remedy": "Federal Reserve SR 26-2 & PSD2 Multi-Factor Exception Recourse",
                    "patch": {"used_pin": 1, "repeat_retailer": 1},
                    "interventions": [
                        RecourseIntervention(
                            feature="used_pin",
                            label="3D-Secure / OTP Verification",
                            current_value="Unauthenticated",
                            target_value="3DS 2.0 Biometric/OTP Confirmed",
                            intervention_type="AUTHENTICATION",
                        ),
                        RecourseIntervention(
                            feature="repeat_retailer",
                            label="Merchant Whitelist",
                            current_value="New Merchant",
                            target_value="Registered Trusted Retailer",
                            intervention_type="MERCHANT_TRUST",
                        ),
                    ],
                })
            else:
                target_dist = round(min(10.0, tx.distance_from_last_tx), 1)
                patch = {"used_chip": 1, "used_pin": 1}
                intervs = [
                    RecourseIntervention(
                        feature="used_chip",
                        label="EMV Chip Hardware",
                        current_value="Magnetic Stripe",
                        target_value="Validated Chip Inserted",
                        intervention_type="HARDWARE_EMV",
                    ),
                    RecourseIntervention(
                        feature="used_pin",
                        label="Cardholder Secret PIN",
                        current_value="No PIN",
                        target_value="Cardholder PIN Verified",
                        intervention_type="AUTHENTICATION",
                    ),
                ]
                if tx.distance_from_last_tx > 15.0:
                    patch["distance_from_last_tx"] = target_dist
                    intervs.append(
                        RecourseIntervention(
                            feature="distance_from_last_tx",
                            label="Transit Velocity",
                            current_value=f"{tx.distance_from_last_tx:,.1f} km",
                            target_value=f"{target_dist:.1f} km (Proximity Cleared)",
                            intervention_type="GEOLOCATION",
                        )
                    )
                candidates.append({
                    "recourse_id": "rc-combo-emv-velocity",
                    "title": "Full EMV Chip, PIN & Velocity Verification",
                    "category": "STEP_UP_PROTOCOL",
                    "description": "Complete full physical hardware validation (Chip + PIN) with confirmed geographic consistency.",
                    "regulatory_remedy": "Federal Reserve SR 26-2 & CFPB Circular 2023-03 Right to Recourse",
                    "patch": patch,
                    "interventions": intervs,
                })

        # 5. Spending Threshold / Partial Capture
        if tx.ratio_to_median_price > 3.0:
            target_ratio = 1.2
            target_amount = round(tx.amount * (target_ratio / tx.ratio_to_median_price), 2)
            candidates.append({
                "recourse_id": "rc-spending-cap",
                "title": "Transaction Split / Spend Cap Adjustment",
                "category": "SPENDING_LIMIT",
                "description": f"Split transaction value to ${target_amount:,.2f} USD within baseline 1.2x median spending limit.",
                "regulatory_remedy": "CFPB Reg E § 1005.11 Consumer Recourse Protocol",
                "patch": {"ratio_to_median_price": target_ratio, "amount": target_amount},
                "interventions": [
                    RecourseIntervention(
                        feature="ratio_to_median_price",
                        label="Spending Ratio to Median",
                        current_value=f"{tx.ratio_to_median_price:.1f}x baseline",
                        target_value=f"{target_ratio:.1f}x baseline",
                        intervention_type="SPENDING_LIMIT",
                    ),
                    RecourseIntervention(
                        feature="amount",
                        label="Transaction Amount",
                        current_value=f"${tx.amount:,.2f} USD",
                        target_value=f"${target_amount:,.2f} USD",
                        intervention_type="SPENDING_LIMIT",
                    ),
                ],
            })

        # Evaluate candidate simulations against model
        recourse_results: List[ActionableRecourse] = []
        base_features = {
            "amount": tx.amount,
            "distance_from_home": tx.distance_from_home,
            "distance_from_last_tx": tx.distance_from_last_tx,
            "ratio_to_median_price": tx.ratio_to_median_price,
            "repeat_retailer": int(tx.repeat_retailer),
            "used_chip": int(tx.used_chip),
            "used_pin": int(tx.used_pin),
            "online_order": int(tx.online_order),
        }

        for cand in candidates:
            sim_features = {**base_features, **cand["patch"]}
            df_sim = pd.DataFrame([sim_features])[self.feature_columns]
            proba = float(self.model.predict_proba(df_sim)[0, 1])
            sim_score = round(proba, 4)
            delta = round(current_risk - sim_score, 4)

            # Determine simulated tier & action
            if sim_score < 0.35:
                sim_tier = "LOW"
                sim_action = "AUTO_APPROVED"
            elif sim_score < 0.70:
                sim_tier = "MEDIUM"
                sim_action = "REQUIRE_2FA_OR_MANUAL_REVIEW"
            else:
                sim_tier = "CRITICAL"
                sim_action = "PREVENTIVE_BLOCK_AND_SAR_REFERRAL"

            # Filter candidates that reduce risk meaningfully
            if delta > 0.02 or (current_risk >= 0.35 and sim_score < 0.35):
                recourse_results.append(
                    ActionableRecourse(
                        recourse_id=cand["recourse_id"],
                        title=cand["title"],
                        description=cand["description"],
                        category=cand["category"],
                        simulated_risk_score=sim_score,
                        simulated_risk_tier=sim_tier,
                        simulated_action=sim_action,
                        risk_delta=delta,
                        target_achieved=sim_score < 0.35,
                        interventions=cand["interventions"],
                        regulatory_remedy=cand["regulatory_remedy"],
                        patch_features=cand["patch"],
                    )
                )

        # Sort: first those achieving target (<0.35 LOW risk), then highest risk reduction delta
        recourse_results.sort(
            key=lambda r: (1 if r.target_achieved else 0, r.risk_delta),
            reverse=True,
        )

        return recourse_results


# Singleton instance
ml_service = MLService()
