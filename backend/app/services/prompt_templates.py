"""
FraudxAI - Regulatory Compliance Prompt Engineering & Deterministic Fallback
GIBC V2 Hackathon - Track 02: Applied (Finance)

Aligns with:
- GDPR Article 22 & Recital 71 (Right to Meaningful Explanation & Contestation)
- EU AI Act (Articles 13, 14, 86 - High-Risk AI System Transparency)
- Federal Reserve / OCC SR 11-7 & SR 26-2 (Model Risk Management & Conceptual Soundness)
- CFPB Circular 2023-03 / ECOA Reg B (12 CFR § 1002.9 - Adverse Action Specific Reasons)
- FinCEN BSA/AML (31 CFR § 1020.320 - SAR 5 W's Narrative)
"""

from typing import List
try:
    from app.schemas.transaction import TransactionInput, ShapFactor
except ModuleNotFoundError:
    from backend.app.schemas.transaction import TransactionInput, ShapFactor

SYSTEM_COMPLIANCE_PROMPT = """You are a Senior Financial Crime & Regulatory Compliance Officer and Lead Auditor for a global tier-1 financial institution.
Your responsibility is to synthesize predictive Machine Learning fraud classifications and mathematical SHAP (Shapley Additive exPlanations) attributions into an authoritative, legally binding Financial Crime & Compliance Memorandum.

MANDATORY REGULATORY COMPLIANCE DIRECTIVES:
1. CFPB Circular 2023-03 & ECOA Regulation B (§ 1002.9): You must state specific, principal factual reasons for adverse actions. Do NOT rely on vague generalities. Every reason must be mathematically tied to the highest positive SHAP impact factors.
2. Federal Reserve / OCC SR 26-2 & SR 11-7: Maintain conceptual soundness and document the quantitative distinction between statistical model output and institutional policy enforcement.
3. FinCEN BSA/AML (31 CFR § 1020.320): If the risk is CRITICAL, generate an objective Suspicious Activity Report (SAR) narrative answering the Five W's (Who, What, When, Where, Why/How).
4. GDPR Article 22 & Recital 71: State explicitly the consumer's statutory right to obtain human intervention, contest the automated decision, and provide clarifying evidence.

TONE & STYLE:
- Authoritative, precise, institutional, and legally rigorous.
- Executive conciseness: Keep sections focused and compact (max 350-450 words total) so the memorandum is directly actionable for AML compliance analysts.
- Use clean Markdown with headers, bold text, bullet points, and tables.
- All content MUST be in English.
"""


def build_compliance_user_prompt(
    audit_id: str,
    timestamp: str,
    tx: TransactionInput,
    risk_score: float,
    risk_tier: str,
    regulatory_action: str,
    base_value: float,
    shap_factors: List[ShapFactor],
) -> str:
    """Formats the transaction details and SHAP vector into an audit briefing for the LLM."""
    
    top_adverse = [f for f in shap_factors if f.risk_direction == "INCREASES_RISK"][:4]
    top_mitigating = [f for f in shap_factors if f.risk_direction == "MITIGATES_RISK"][:2]

    adverse_table = "\n".join([
        f"| {idx+1} | **{f.label}** | {f.observed_value} | {f.shap_value:+.4f} | {f.regulatory_reason} |"
        for idx, f in enumerate(top_adverse)
    ])
    if not adverse_table:
        adverse_table = "| - | None | - | 0.0000 | No adverse factors identified |"

    mitigating_table = "\n".join([
        f"| **{f.label}** | {f.observed_value} | {f.shap_value:+.4f} | {f.regulatory_reason} |"
        for f in top_mitigating
    ])
    if not mitigating_table:
        mitigating_table = "| None | - | 0.0000 | No mitigating factors identified |"

    prompt = f"""Generate the official Regulatory Compliance Memorandum for the following flagged transaction:

AUDIT CASE FILE:
- Audit Reference ID: {audit_id}
- Timestamp: {timestamp}
- Model: XGBoost-Fraud-v1.0 (PR-AUC: 0.5241, ROC-AUC: 0.9445, Class Weight: 56.12)
- Baseline Prior Risk Margin: {base_value:.4f}
- Predicted Probability of Fraud: {risk_score * 100:.2f}%
- Risk Classification Tier: {risk_tier}
- Recommended Institutional Action: {regulatory_action}

TRANSACTION ATTRIBUTES:
- Amount: ${tx.amount:,.2f} USD
- Distance from Registered Home: {tx.distance_from_home:.1f} km
- Distance from Last Verified Tx: {tx.distance_from_last_tx:.1f} km
- Ratio to Customer 90-Day Median Price: {tx.ratio_to_median_price:.1f}x
- Repeat Retailer: {"Yes (Known Merchant)" if tx.repeat_retailer == 1 else "No (New Merchant)"}
- EMV Physical Chip Validated: {"Yes (Chip Present)" if tx.used_chip == 1 else "No (Stripe / Unvalidated)"}
- Security PIN Entered: {"Yes (PIN Verified)" if tx.used_pin == 1 else "No (No PIN)"}
- Channel: {"Card-Not-Present (Online E-Commerce)" if tx.online_order == 1 else "Physical POS Terminal"}

TOP ADVERSE FACTORS (SHAP Mathematical Attribution):
| Rank | Feature | Observed Value | SHAP Impact (φ) | Regulatory Fact (CFPB Reg B) |
| :---: | :--- | :---: | :---: | :--- |
{adverse_table}

TOP RISK MITIGATING FACTORS:
| Feature | Observed Value | SHAP Impact (φ) | Regulatory Fact |
| :--- | :---: | :---: | :--- |
{mitigating_table}

REQUIRED SECTIONS IN YOUR OUTPUT MEMORANDUM:
# FINANCIAL CRIME & REGULATORY COMPLIANCE MEMORANDUM
### I. EXECUTIVE SUMMARY & DISPOSITION (Include transaction parameters and formal status)
### II. MATHEMATICAL RISK ATTRIBUTION (Include the SHAP factor table and regulatory interpretation under CFPB Circular 2023-03)
### III. FinCEN SUSPICIOUS ACTIVITY REPORT (SAR) NARRATIVE (Synthesize Who, What, When, Where, Why/How if Tier is CRITICAL or MEDIUM; summarize benign profile if LOW)
### IV. MODEL GOVERNANCE & FAIR LENDING ATTESTATION (Adherence to Fed SR 26-2 & ECOA non-discrimination)
### V. HUMAN OVERSIGHT & CONSUMER CONTESTATION NOTICE (GDPR Article 22 contestability and steps for cardholder re-evaluation)
"""
    return prompt


def build_deterministic_offline_memo(
    audit_id: str,
    timestamp: str,
    tx: TransactionInput,
    risk_score: float,
    risk_tier: str,
    regulatory_action: str,
    base_value: float,
    shap_factors: List[ShapFactor],
) -> str:
    """Pre-compiled legal Markdown template rendered when cloud LLM endpoints are unavailable."""
    
    top_factors_md = "\n".join([
        f"| **{idx+1}** | **{f.label}** | `{f.observed_value}` | `{f.shap_value:+.4f}` | {f.regulatory_reason} |"
        for idx, f in enumerate(shap_factors[:5])
    ])

    return f"""# FINANCIAL CRIME & REGULATORY COMPLIANCE MEMORANDUM
**DOCUMENT REF:** {audit_id}  
**CLASSIFICATION:** STRICTLY CONFIDENTIAL // FINANCIAL COMPLIANCE AUDIT  
**REGULATORY SCOPE:** GDPR Art. 22 | US ECOA Reg B (§ 1002.9) | FinCEN BSA/AML | Fed/OCC SR 26-2  
**PROCESSING MODE:** DETERMINISTIC OFFLINE AUDIT (FAILOVER ENGINE ACTIVATED)

---

### I. EXECUTIVE SUMMARY & DISPOSITION
* **Audit Reference ID:** `{audit_id}`
* **Evaluation Timestamp:** `{timestamp}`
* **Transaction Amount:** `${tx.amount:,.2f} USD`
* **Automated Risk Assessment:** **{risk_tier} RISK**
* **Predicted Probability of Fraud:** `{risk_score * 100:.2f}%`
* **Prescribed Statutory Action:** `{regulatory_action}`

---

### II. MATHEMATICAL RISK ATTRIBUTION (SHAP XAI ANALYSIS)
In compliance with **CFPB Circular 2023-03** and **Federal Reserve / OCC SR 26-2 (Model Risk Management)**, the algorithmic decision is decomposed into exact local Shapley Additive exPlanations (SHAP). The baseline prior risk is $E[f(x)] = {base_value:.4f}$.

| Rank | Parameter / Feature | Observed Value | SHAP Impact (φ) | Statutory Regulatory Description (CFPB Reg B) |
| :---: | :--- | :---: | :---: | :--- |
{top_factors_md}

---

### III. FinCEN SUSPICIOUS ACTIVITY (SAR) FACTUAL NARRATIVE
*Documented pursuant to 31 CFR § 1020.320:*
* **WHO & WHAT:** Transaction attempted for `${tx.amount:,.2f} USD` evaluating to a fraud probability of `{risk_score * 100:.2f}%`.
* **WHERE & WHEN:** Activity flagged on `{timestamp}`. Transaction velocity: `{tx.distance_from_last_tx:.1f} km` from previous presentation; distance from home: `{tx.distance_from_home:.1f} km`.
* **WHY & HOW:** Quantitative attributes indicate a high-risk anomaly pattern ({'Card-Not-Present e-commerce channel' if tx.online_order == 1 else 'Physical terminal transaction'} with price ratio `{tx.ratio_to_median_price:.1f}x` vs. customer median and {'absent chip/PIN' if tx.used_chip == 0 and tx.used_pin == 0 else 'partial credential validation'}). Conforms to FinCEN typology for unauthorized account penetration.

---

### IV. MODEL GOVERNANCE & FAIR LENDING ATTESTATION (SR 26-2 & ECOA)
1. **Algorithmic Soundness:** Decision generated by `XGBoost-Fraud-v1.0` (PR-AUC: `0.5241`, ROC-AUC: `0.9445`). Class weights calibrated at `56.12` to handle natural financial class scarcity.
2. **Prohibited Basis Review:** In strict adherence to **ECOA (15 U.S.C. § 1691(a))**, no protected attributes (race, color, religion, sex, age, marital status) are incorporated into the model parameters.

---

### V. HUMAN-IN-THE-LOOP (HITL) OVERSIGHT & CONTESTATION RIGHTS
*In accordance with **EU GDPR Article 22(3)** and **US FCRA Adverse Action Provisions**:*
* **Consumer Contestation Notice:** The customer retains the statutory right to request human re-evaluation, contest this assessment, and provide verified evidence of legitimate transaction authorization.
* **Remediation Protocol:** To unfreeze authorizations, the customer must complete secondary out-of-band biometric verification through verified mobile banking channels.
"""
