# FraudxAI: Explainable AI for Risk & Compliance

[![GIBC V2 Track 02](https://img.shields.io/badge/GIBC%20V2-Track%2002%3A%20Applied%20(Finance)-indigo)](https://devpost.com)
[![Python 3.12+](https://img.shields.io/badge/Python-3.12%2B-blue.svg)](https://www.python.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-3.2.0-orange.svg)](https://xgboost.readthedocs.io/)
[![SHAP](https://img.shields.io/badge/SHAP-TreeExplainer-green.svg)](https://shap.readthedocs.io/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black.svg)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An end-to-end financial fraud detection pipeline powered by **XGBoost** and **SHAP** that translates mathematical feature attributions into automated, legally binding compliance memorandums for financial risk analysts and regulatory bank auditors.

---

## 1. Executive Summary & Problem Statement

Financial institutions face an existential regulatory dilemma:
* **The "Black-Box" Vulnerability:** Modern machine learning classifiers output continuous risk probabilities (e.g. $P(\text{fraud}) = 0.978$), but cannot explain the causal drivers behind denial decisions.
* **Mandatory Statutory Oversight:** Financial frameworks strictly prohibit unexplained algorithmic denial:
  * **CFPB Circular 2023-03 & US ECOA Reg B (§ 1002.9):** Creditors must disclose specific, factual principal reasons for adverse actions. Vague checklist explanations are unlawful.
  * **EU GDPR Article 22 & Recital 71:** Grants individuals the statutory "Right to Explanation" and the legal right to contest automated profiling decisions.
  * **Federal Reserve / OCC SR 11-7 & SR 26-2:** Mandates Model Risk Management (MRM) conceptual soundness and separation between statistical scores and policy interventions.
  * **FinCEN BSA/AML (31 CFR § 1020.320):** Demands factual Suspicious Activity Report (SAR) narratives documenting the *Five W's* (*Who, What, When, Where, Why/How*).

**FraudxAI** bridges the gap by decoupling the workflow into three deterministic layers:
1. **Calibrated Risk Scoring:** XGBoost Classifier optimized for extreme class imbalance (`scale_pos_weight = 56.12`), achieving **ROC-AUC: 0.9445** and **Fraud Recall: 86.10%**.
2. **Mathematical Local Attribution (XAI):** `SHAP TreeExplainer` decomposing predictions into exact additive contributions $\sum_{i=1}^{M} \phi_i + \phi_0 = f(x)$ in under 5 ms.
3. **Resilient Compliance Orchestrator:** Multi-provider LLM agent combining **Adaption Labs**, **Featherless.ai** (`Meta-Llama-3.1-8B-Instruct`), and **Groq Cloud** (`llama-3.1-8b-instant`), backed by a deterministic offline fallback engine ensuring zero downtime.

---

## 2. System Architecture

```
                                  [ Financial Transaction ]
                                (8 Semantic Business Features)
                                              │
                                              ▼
                             ┌──────────────────────────────────┐
                             │  FastAPI Backend (POST /analyze) │
                             └────────────────┬─────────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    ▼                                                   ▼
     ┌─────────────────────────────┐                     ┌─────────────────────────────┐
     │   XGBoost Classifier        │                     │     SHAP TreeExplainer      │
     │   Calibrated Probability    │──── Log-Odds ──────►│   Local Additive Vectors    │
     │   P(Fraud) = 0.00 to 1.00   │                     │      (φ_1, ..., φ_8)        │
     └──────────────┬──────────────┘                     └──────────────┬──────────────┘
                    │                                                   │
                    └─────────────────────────┬─────────────────────────┘
                                              │
                                              ▼
                             ┌──────────────────────────────────┐
                             │    Resilient Compliance Agent    │
                             │ (SR 26-2, CFPB Reg B, GDPR A22)  │
                             └────────────────┬─────────────────┘
                                              │
                ┌─────────────────────────────┼─────────────────────────────┐
                ▼                             ▼                             ▼
       [ Adaption Labs ]              [ Featherless.ai ]             [ Groq Cloud LPU ]
       (Adaptive Compute)          (Llama-3.1-8B-Instruct)        (llama-3.1-8b-instant)
                                              │
                           [ Tier-3 Deterministic Offline ]
                                (Zero-Failure Safety)
                                              │
                                              ▼
                             ┌──────────────────────────────────┐
                             │      Next.js 16 + React 19       │
                             │  * SVG Radial Risk Speedometer   │
                             │  * Divergent SHAP Bar Chart      │
                             │  * 300+ DPI Legal Vector PDF     │
                             └──────────────────────────────────┘
```

---

## 3. Feature Vector & Business Semantics

Unlike obfuscated PCA datasets ($V_1, \dots, V_{28}$), FraudxAI operates strictly on transparent financial variables:

| Feature | Type | Range / Format | Semantic Business Context |
| :--- | :--- | :--- | :--- |
| `amount` | `float` | $0.01 – 50,000.00 | Transaction value in USD |
| `distance_from_home` | `float` | 0.0 – 20,000.0 km | Distance from registered billing domicile |
| `distance_from_last_tx` | `float` | 0.0 – 20,000.0 km | Distance from previous verified card presentation (Transit Velocity) |
| `ratio_to_median_price` | `float` | 0.01 – 500.0x | Departure ratio from customer's 90-day purchase baseline median |
| `repeat_retailer` | `int` | 0 or 1 | Known merchant history vs. unverified first-time counterparty |
| `used_chip` | `int` | 0 or 1 | Physical EMV chip cryptogram validation |
| `used_pin` | `int` | 0 or 1 | Two-factor personal identification number verified at POS |
| `online_order` | `int` | 0 or 1 | Card-Not-Present (CNP e-commerce) vs. Physical POS terminal |

---

## 4. Empirical Dataset & ML Rigor

FraudxAI is designed for and evaluated on the **Kaggle / OpenML Credit Card Fraud Prediction Benchmark** (`card_transdata.csv` / OpenML ID 43924), consisting of 1,000,000 empirical card transactions with business-readable features. The pipeline supports both direct ingestion of `card_transdata.csv` and high-fidelity statistical generation conforming to the authentic empirical distributions.

```
Evaluating Model Rigor on Stratified Unseen Test Data:
* Empirical Benchmark:       card_transdata.csv (OpenML / Kaggle)
* ROC-AUC Score:             0.9445
* PR-AUC (Precision-Recall): 0.5241
* Fraud Recall:              0.8610 (Minimizing costly False Negatives)
* Class Weight Factor:       56.12  (Accounting for genuine 1.7% transaction sparsity)
* SHAP Additive Invariant:   Verified (|Σ φ_i + E[f(x)] - margin| < 1e-4)
```

> **Hackathon Rule Compliance:** All empirical data is fully de-identified and public. FraudxAI is a regulatory simulation sandbox and is never deployed on real patients or real money.

---

## 5. Repository Structure

```
fraudxai/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── endpoints/
│   │   │   │   └── analyze.py        # POST /api/v1/analyze & GET /api/v1/health
│   │   │   └── router.py             # Route registration
│   │   ├── core/
│   │   │   └── config.py             # Provider settings, timeouts, CORS
│   │   ├── schemas/
│   │   │   └── transaction.py        # Pydantic schemas (Request, Response, SHAP, Telemetry)
│   │   ├── services/
│   │   │   ├── ml_service.py         # XGBoost inference & SHAP TreeExplainer ranking
│   │   │   ├── prompt_templates.py   # Regulatory prompt engineering (GDPR, FinCEN, CFPB)
│   │   │   └── compliance_agent.py   # Multi-provider client (Adaption -> Featherless -> Groq -> Offline)
│   │   └── main.py                   # FastAPI application entrypoint
│   ├── ml/
│   │   ├── dataset_generator.py      # High-fidelity banking transaction synthesizer
│   │   ├── train_model.py            # Training pipeline & joblib serialization
│   │   └── artifacts/
│   │       ├── model.joblib          # Calibrated XGBoost Classifier
│   │       ├── explainer.joblib      # Fitted SHAP TreeExplainer
│   │       └── metadata.json         # Model version and evaluation metrics
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css           # Tailwind v4 + @media print vector rules
│   │   │   ├── layout.tsx            # Global metadata & typography
│   │   │   └── page.tsx              # Master dashboard
│   │   ├── components/
│   │   │   ├── Navbar.tsx            # Institutional header & hackathon badges
│   │   │   ├── SimulationPanel.tsx   # 8 interactive sliders + 4 preset scenario cards
│   │   │   ├── RadialRiskGauge.tsx   # Zero-dependency SVG risk speedometer
│   │   │   ├── ShapDivergentBarChart.tsx # Divergent horizontal bar chart (Red/Green)
│   │   │   ├── ComplianceViewer.tsx  # Markdown renderer + Vector PDF print engine
│   │   │   └── TelemetryCard.tsx     # LLM provider execution telemetry & latency
│   │   ├── hooks/
│   │   │   └── useFraudAnalysis.ts   # State management & backend integration
│   │   └── types/
│   │       └── index.ts              # TypeScript schemas & preset definitions
│   └── package.json
│
├── FraudxAI_Spec.md                  # Hackathon requirements specification
├── FraudxAI_Especificacion_Tecnica.md # Technical specification document
├── LICENSE                           # MIT License
└── README.md
```

---

## 6. Quickstart Guide

### Prerequisites
* Python 3.12+
* Node.js 20+ & npm

### Backend Setup

1. Navigate to the backend directory and activate the virtual environment:
   ```bash
   cd backend
   # Windows:
   .\venv\Scripts\Activate.ps1
   # Linux/macOS:
   source venv/bin/activate
   ```

2. (Optional) Configure LLM API Keys in `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your keys (`FEATHERLESS_API_KEY`, `GROQ_API_KEY`, and/or `ADAPTION_API_KEY`).  
   *Note: If no API keys are provided, FraudxAI automatically operates in its high-performance Deterministic Offline Fallback Mode.*

3. Start the FastAPI development server:
   ```bash
   uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   Interactive Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend Setup

1. Open a new terminal in the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Launch the Next.js development server:
   ```bash
   npm run dev
   ```
   Access the dashboard at [http://localhost:3000](http://localhost:3000)

---

## 7. Compliance Standard Mapping

| Regulatory Authority | Section / Mandate | FraudxAI Implementation |
| :--- | :--- | :--- |
| **CFPB (12 CFR § 1002.9)** | Adverse Action Specificity (Reg B) | Maps top positive SHAP factors ($\phi_i > 0$) directly to statutory denial reasons. |
| **EU GDPR** | Article 22 & Recital 71 | Explicit human-in-the-loop contestation procedure and meaningful automated logic explanation. |
| **Federal Reserve / OCC** | SR 11-7 / SR 26-2 (MRM) | Complete provenance logging, expected baseline prior $E[f(x)]$, and local additivity verification. |
| **FinCEN (31 CFR § 1020.320)** | Suspicious Activity Reporting (SAR) | Synthesizes the Five W's (*Who, What, When, Where, Why/How*) into a formal audit record. |

---

## 8. Built With

* **Machine Learning & XAI:** [XGBoost](https://xgboost.readthedocs.io/), [SHAP](https://shap.readthedocs.io/), [Scikit-Learn](https://scikit-learn.org/), [Pandas](https://pandas.pydata.org/), [NumPy](https://numpy.org/)
* **Backend:** [FastAPI](https://fastapi.tiangolo.com/), [Pydantic v2](https://docs.pydantic.dev/), [HTTPX](https://www.python-httpx.org/), [Uvicorn](https://www.uvicorn.org/)
* **LLM & Inference Infrastructure:** [Adaption Labs](https://adaptionlabs.ai/), [Featherless.ai](https://featherless.ai/), [Groq Cloud](https://groq.com/)
* **Frontend:** [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/), [React Markdown](https://github.com/remarkjs/react-markdown)

---

## 9. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
