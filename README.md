# FraudxAI: Explainable AI for Risk & Compliance

[![GIBC V2 Track 02](https://img.shields.io/badge/GIBC%20V2-Track%2002%3A%20Applied%20(Finance)-4F46E5.svg?style=for-the-badge)](https://devpost.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Python 3.12+](https://img.shields.io/badge/Python-3.12%2B-3776AB.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-3.2.0-EB5424.svg?style=for-the-badge)](https://xgboost.readthedocs.io/)
[![SHAP](https://img.shields.io/badge/SHAP-TreeExplainer-22C55E.svg?style=for-the-badge)](https://shap.readthedocs.io/)

> **Global Innovation Build Challenge (GIBC) V2 — Track 02: Applied (Medical Technology & Finance)**  
> An end-to-end financial fraud detection and regulatory compliance pipeline powered by **XGBoost** and **SHAP TreeExplainer**. FraudxAI translates mathematical local feature attributions into auditable, legally binding compliance memorandums and actionable counterfactual remedies for financial analysts and bank auditors.

---

## 1. Executive Summary & Problem Statement

Modern machine learning fraud classifiers (Gradient Boosted Trees, Deep Neural Networks) present an existential regulatory vulnerability in high-stakes financial operations:

* **The "Black-Box" Vulnerability:** Traditional ML classifiers output continuous probability scores (e.g., $P(\text{fraud}) = 0.94$), but fail to expose the causal reasons behind adverse decisions.
* **Strict Statutory Banking Regulations:**
  * **CFPB Circular 2023-03 & US ECOA Reg B (12 CFR § 1002.9):** Creditors must state specific, factual principal reasons for adverse actions. Vague checklist explanations or uninterpretable scores are unlawful.
  * **EU GDPR Article 22 & Recital 71:** Enforces an individual's "Right to Explanation" and the legal right to contest automated profiling decisions.
  * **Federal Reserve / OCC SR 11-7 & SR 26-2 (Model Risk Management):** Requires conceptual soundness, rigorous benchmarking, and transparent separation between statistical scoring and policy interventions.
  * **FinCEN BSA/AML (31 CFR § 1020.320):** Demands factual Suspicious Activity Report (SAR) narratives documenting the *Five W's* (*Who, What, When, Where, Why/How*).

### The FraudxAI Solution
**FraudxAI** bridges the divide between cutting-edge machine learning and banking regulatory compliance through three deterministic layers:
1. **Calibrated Risk Scoring:** An XGBoost Classifier tuned with high class-imbalance weighting (`scale_pos_weight = 56.12`), achieving **ROC-AUC: 0.9445** and **Fraud Recall: 86.10%** on empirical benchmark card transactions.
2. **Mathematical Local Attribution (XAI):** `SHAP TreeExplainer` deconstructs predictions into exact additive contributions $\sum_{i=1}^{M} \phi_i + \phi_0 = f(x)$ in under 5 ms, satisfying additive invariance.
3. **Resilient Compliance Orchestrator:** An intelligent multi-tier LLM engine integrating **Adaption Labs**, **Groq Cloud LPUs**, and **Featherless.ai**, backed by an infallible deterministic offline engine guaranteeing zero downtime.
4. **Actionable Counterfactual Recourse:** A "What-If" remediation engine computing the exact behavioral modifications required to legitimately clear flagged transactions.

---

## 2. Visual Interface & Technical Setup in Action

Here is a visual overview of the FraudxAI institutional risk platform:

### 2.1. Master Risk Assessment Cockpit & Radial Gauge
Interactive transaction simulator featuring 8 transparent financial parameters, 4 attack presets, real-time probability gauge, and official decision plaque.

<!-- [IMAGE PLACEHOLDER: Master Risk Cockpit] -->
> 📸 **(Here goes image: FraudxAI Master Cockpit — Interactive sliders, radial risk speedometer, and verified governance decision card)**

---

### 2.2. Mathematical Explainability Quadrant (SHAP Divergent Matrix)
Sub-5ms local attribution decomposing risk into exact additive contributions. Red bars highlight risk drivers; green bars highlight mitigating factors.

<!-- [IMAGE PLACEHOLDER: SHAP Divergent Matrix] -->
> 📸 **(Here goes image: SHAP Local Attribution Waterfall & Divergent Bar Chart showing exact feature contributions)**

---

### 2.3. Actionable Counterfactual Recourse Engine
Algorithmic guidance providing cardholders and compliance officers with verified remediation paths (e.g., verifying physical chip and PIN) to remediate false positives.

<!-- [IMAGE PLACEHOLDER: Actionable Recourse Cards] -->
> 📸 **(Here goes image: Actionable Counterfactual Recourse Cards demonstrating simulated risk score drop from 94% to 8%)**

---

### 2.4. Statutory Compliance Memorandum & Vector PDF Export
Formally formatted compliance audit memo satisfying CFPB Reg B § 1002.9 and FinCEN SAR standards, exportable as an institutional 300+ DPI vector PDF.

<!-- [IMAGE PLACEHOLDER: Compliance Memo & PDF Export] -->
> 📸 **(Here goes image: Generated Statutory Compliance Memorandum and Vector PDF Export preview)**

---

### 2.5. Model Rigor & Validation Curves
Empirical training and validation metrics showing ROC-AUC and Precision-Recall evaluation curves.

<!-- [IMAGE PLACEHOLDER: Model Curves] -->
> 📸 **(Here goes image: XGBoost ROC-AUC Curve (0.9445) and Precision-Recall Curve on stratified test benchmark)**

---

## 3. AdaptionLabs Integration

FraudxAI leverages **AdaptionLabs** as an advanced AI orchestration and adaptive inference provider for generating regulatory compliance memorandums.

* **Platform Link:** [https://adaptionlabs.ai/](https://adaptionlabs.ai/)

### How AdaptionLabs Powers FraudxAI
1. **Adaptive LLM Routing & Serving:** AdaptionLabs delivers low-latency model execution optimized for complex structured prompt templates containing SHAP mathematical attribution vectors.
2. **Deterministic Compliance Guardrails:** Enables reproducible token outputs adhering strictly to statutory legal frameworks (ECOA Reg B, FinCEN SAR narratives, and GDPR Article 22).
3. **Telemetry & Execution Monitoring:** Captures millisecond-level inference timings and fallback triggers within FraudxAI's telemetry monitoring system.

<!-- [IMAGE PLACEHOLDER: AdaptionLabs Dashboard] -->
> 📸 **(Here goes image: AdaptionLabs Platform Dashboard & Model Pipeline Configuration)**

<!-- [IMAGE PLACEHOLDER: AdaptionLabs Telemetry] -->
> 📸 **(Here goes image: AdaptionLabs Real-time LLM Inference Telemetry & Token Latency)**

---

## 4. System Architecture

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
                             │  Actionable Recourse Synthesizer │
                             │  (Counterfactual "What-If" Path) │
                             └────────────────┬─────────────────┘
                                              │
                                              ▼
                             ┌──────────────────────────────────┐
                             │    Resilient Compliance Agent    │
                             │ (SR 26-2, CFPB Reg B, GDPR A22)  │
                             └────────────────┬─────────────────┘
                                              │
                ┌─────────────────────────────┼─────────────────────────────┐
                ▼                             ▼                             ▼
       [ Adaption Labs ]              [ Groq Cloud LPU ]             [ Featherless.ai ]
       (Adaptive Compute)          (qwen/qwen3.8-27b)             (Qwen2.5-7B-Instruct)
       (https://adaptionlabs.ai)   (~1.5s Token Latency)          (Open-Weights Catalog)
                                              │
                           ┌──────────────────┴──────────────────┐
                           ▼                                     ▼
             [ Tier-4 Deterministic Offline ]          [ Next.js 16 + React 19 ]
               (Zero-Downtime Rule Engine)              * Radial Risk Speedometer
               (< 5ms Execution Guarantee)              * Divergent SHAP Bar Chart
                                                        * 300+ DPI Legal Vector PDF
```

---

## 5. Feature Vector & Business Semantics

Unlike obfuscated PCA datasets ($V_1, \dots, V_{28}$), FraudxAI operates exclusively on transparent financial variables that banking investigators can understand:

| Feature | Data Type | Range / Format | Semantic Business Meaning |
| :--- | :--- | :--- | :--- |
| `amount` | `float` | $0.01 – $50,000.00 | Transaction value in USD |
| `distance_from_home` | `float` | 0.0 – 20,000.0 km | Distance from cardholder's verified billing domicile |
| `distance_from_last_tx` | `float` | 0.0 – 20,000.0 km | Physical distance from previous valid transaction (Transit Velocity) |
| `ratio_to_median_price`| `float` | 0.01 – 500.0x | Departure ratio against customer's 90-day purchase baseline median |
| `repeat_retailer` | `int` | 0 or 1 | Known merchant history (1) vs. unverified first-time counterparty (0) |
| `used_chip` | `int` | 0 or 1 | Physical EMV chip cryptogram validation |
| `used_pin` | `int` | 0 or 1 | Two-factor personal identification number verified at POS |
| `online_order` | `int` | 0 or 1 | Card-Not-Present (CNP e-commerce) (1) vs. Physical POS terminal (0) |

---

## 6. Empirical Dataset & Machine Learning Rigor

FraudxAI is trained and evaluated on the **Kaggle / OpenML Credit Card Fraud Prediction Benchmark** (`card_transdata.csv` / OpenML Dataset ID 43924), consisting of 1,000,000 empirical card transactions with business-readable features.

### Benchmark Validation Results
* **Empirical Dataset:** Kaggle / OpenML `card_transdata.csv` (1,000,000 records)
* **ROC-AUC Score:** **0.9445** (94.45% Area Under the ROC Curve)
* **PR-AUC (Precision-Recall):** **0.5241** (Substantial separation under extreme sparsity)
* **Fraud Recall (Sensitivity):** **0.8610** (Catches 86.1% of fraudulent transactions to minimize False Negatives)
* **Class Imbalance Scale Factor (`scale_pos_weight`):** **56.12**
* **SHAP Additive Invariant:** Verified mathematically ($|\sum \phi_i + E[f(x)] - f(x)| < 10^{-4}$)

> **Hackathon Ethics Compliance:** All data is de-identified and public. FraudxAI is a regulatory simulation sandbox and is never deployed on live patients or unmonitored production funds.

---

## 7. Prerequisites & Setup Instructions

Judges and evaluators can launch FraudxAI locally in under 5 minutes.

### 7.1. Prerequisites
* **Python:** 3.12 or newer
* **Node.js:** 20.x or newer (with npm)
* **Git**

---

### 7.2. Backend Setup (FastAPI & ML Engine)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KevCast1604/fraudxai.git
   cd fraudxai
   ```

2. **Navigate to the backend directory and set up a virtual environment:**
   ```bash
   cd backend
   
   # Windows (PowerShell):
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   
   # Linux / macOS:
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **(Optional) Configure API Keys in `.env`:**
   ```bash
   cp .env.example .env
   ```
   *Note: If no API keys are configured, FraudxAI automatically operates in its high-speed **Deterministic Offline Fallback Engine** (`< 5ms`), allowing full evaluation without any external cloud credentials.*

5. **Start the FastAPI backend server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   * The backend will be live at `http://localhost:8000`
   * Interactive Swagger Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
   * API Health Check: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

### 7.3. Frontend Setup (Next.js 16 Dashboard)

1. **Open a new terminal window and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Launch the development server:**
   ```bash
   npm run dev
   ```

4. **Open the application in your browser:**
   ```text
   http://localhost:3000
   ```

---

## 8. Usage Guidelines & Evaluator Walkthrough

Judges can execute the following scenarios to test the full capability of FraudxAI:

### Scenario A: Testing Attack Presets
1. On the left **Transaction Simulation Workbench**, select the preset **"Physical Card Cloning Attack"**.
2. Notice how the features adjust (impossible geographic jump: 460 km, 11.4x spending spike, no chip, no PIN).
3. Click **"Run Full Regulatory Audit"**.
4. Observe:
   * **Radial Risk Speedometer:** Climbs to ~94% (CRITICAL RISK).
   * **Official Decision Plaque:** Displays `PREVENTIVE_BLOCK_AND_SAR_REFERRAL`.
   * **SHAP Divergent Chart:** Identifies `distance_from_last_tx` and `ratio_to_median_price` as dominant positive risk drivers.

### Scenario B: Testing Actionable Counterfactual Recourse ("What-If" Remediation)
1. In the Critical Risk state, scroll down to the **Actionable Recourse (What-If Remediation)** section.
2. Select **"Present Physical EMV Chip & Enter PIN"**.
3. Click **"Apply Counterfactual Patch & Re-evaluate"**.
4. Watch the risk score plummet in real-time to **~8% (AUTO_APPROVED)**, demonstrating transparent algorithmic remedy for cardholders.

### Scenario C: Switching AI Providers via the Engine Hub
1. Click the floating **"Engine Hub"** button on the right edge of the screen.
2. Toggle between **Groq Cloud LPU** (ultra-fast, ~1.5s), **Featherless.ai**, or **Deterministic Offline** (< 5ms).
3. Re-run the audit to observe real-time telemetry updates (latency in ms, active model, and fallback status).

### Scenario D: Exporting Official Legal PDF
1. Scroll down to the **Statutory Compliance Memorandum**.
2. Click **"Export Audit Report"** in the top-right corner of the memorandum.
3. The system prints a high-resolution, vector-formatted legal compliance document formatted for compliance binders and regulatory audit submissions.

---

## 9. Complete List of Technologies & Tools ("Built With")

### 9.1. Technologies & Frameworks
* **[Python 3.12](https://www.python.org/):** Core runtime for machine learning, statistical explainer, and asynchronous backend services.
* **[TypeScript 5](https://www.typescriptlang.org/):** Type-safe frontend client architecture.
* **[FastAPI 0.141](https://fastapi.tiangolo.com/):** High-throughput asynchronous REST API framework with automatic OpenAPI documentation.
* **[Next.js 16.3 (App Router)](https://nextjs.org/):** React server-rendered and client-rendered enterprise dashboard framework.
* **[React 19](https://react.dev/):** UI library with concurrent rendering primitives.
* **[Tailwind CSS v4](https://tailwindcss.com/):** Modern utility-first CSS framework with tailored print media style rules.
* **[Uvicorn 0.53](https://www.uvicorn.org/):** Lightning-fast ASGI web server implementation.
* **[Node.js 20+](https://nodejs.org/):** JavaScript runtime environment.

### 9.2. Libraries & Packages
* **[XGBoost 3.2.0](https://xgboost.readthedocs.io/):** Optimized distributed gradient boosting library for tabular data classification.
* **[SHAP 0.51.0](https://shap.readthedocs.io/):** Game-theoretic local feature attribution via `TreeExplainer`.
* **[Scikit-Learn 1.9.1](https://scikit-learn.org/):** Stratified dataset splitting, PR-AUC, ROC-AUC, and precision-recall metrics evaluation.
* **[Pandas 3.0.6](https://pandas.pydata.org/):** High-performance tabular data structures and preprocessing pipelines.
* **[NumPy 2.4.6](https://numpy.org/):** Vectorized mathematical computing.
* **[Pydantic v2 (2.13.5)](https://docs.pydantic.dev/):** Strict data validation and schema serialization.
* **[HTTPX 0.28.1](https://www.python-httpx.org/):** Async HTTP client for multi-provider LLM API orchestration.
* **[Joblib 1.6.0](https://joblib.readthedocs.io/):** High-efficiency pipeline and model artifact compression and serialization.
* **[Lucide React 1.47](https://lucide.dev/):** Scalable vector UI icon system.
* **[React Markdown 10.1 & Remark GFM](https://github.com/remarkjs/react-markdown):** GitHub-flavored markdown legal memo parser and renderer.

### 9.3. Cloud APIs & AI Services
* **[Adaption Labs](https://adaptionlabs.ai/):** Adaptive LLM orchestration, model routing, and compliance memo evaluation engine.
* **[Groq Cloud](https://groq.com/):** High-speed Language Processing Unit (LPU) inference for real-time sub-2s memo drafting.
* **[Featherless.ai](https://featherless.ai/):** Serverless open-weights LLM inference platform.

### 9.4. Datasets
* **[Kaggle / OpenML Credit Card Fraud Prediction Benchmark](https://www.openml.org/search?type=data&status=active&id=43924):** OpenML Dataset ID 43924 (`card_transdata.csv`), comprising 1,000,000 empirical transaction records with 8 human-interpretable financial features.

### 9.5. AI Models & Architectures
* **XGBoost Decision Tree Ensemble:** Custom calibrated binary classifier with cost-sensitive `scale_pos_weight = 56.12`.
* **SHAP TreeExplainer:** Tree-SHAP mathematical explainer computing exact Shapley values.
* **Meta-Llama-3.1-8B-Instruct:** Primary instruction-tuned compliance reasoning LLM.
* **Qwen/Qwen2.5-7B-Instruct & qwen/qwen3.8-27b:** High-precision compliance drafting models.
* **Deterministic Rule Engine (v1.0):** Air-gapped fallback ensuring zero-failure statutory memo generation.

### 9.6. Hardware Used
* **Training & Development Workstation:** Intel Core i7 / AMD Ryzen 8-core multi-threaded CPU, 32 GB DDR5 RAM, NVIDIA GeForce RTX 30/40 Series GPU with CUDA acceleration.
* **Cloud Hardware Acceleration:** Groq LPU (Language Processing Unit) tensor streaming architecture for high-speed token generation.

---

## 10. Statutory Compliance Mapping

| Regulatory Authority | Statutory Mandate | FraudxAI Technical Implementation |
| :--- | :--- | :--- |
| **CFPB (12 CFR § 1002.9)** | Adverse Action Notice (ECOA Reg B) | Maps top positive SHAP factors ($\phi_i > 0$) directly to statutory principal reasons for adverse decisions. |
| **EU GDPR** | Article 22 & Recital 71 | Guarantees the "Right to Explanation" and generates actionable counterfactual remedies for contestation. |
| **Federal Reserve / OCC** | SR 11-7 & SR 26-2 (MRM) | Ensures model conceptual soundness, baseline prior tracking $E[f(x)]$, and strict additive invariance. |
| **FinCEN (31 CFR § 1020.320)** | Suspicious Activity Report (SAR) | Synthesizes the Five W's (*Who, What, When, Where, Why/How*) into an auditable compliance memo ready for regulatory filing. |

---

## 11. Team Members & Devpost Verification

### Project Team
* **Kevin Alexander Castañeda Llanos** — Lead Machine Learning Engineer & Full-Stack Architect  
  * *Devpost:* [KevCast1604](https://devpost.com/KevCast1604)  
  * *GitHub:* [@KevCast1604](https://github.com/KevCast1604)

> [!IMPORTANT]
> **Devpost Team Verification Notice:**  
> All team members are listed by their real full names. Each teammate needs a Devpost account and must be added to the submission, or they will not appear and will not receive a certificate. This is required for verification and for issuing official GIBC V2 certificates.

---

## 12. Repository Structure

```
fraudxai/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── endpoints/
│   │   │   │   └── analyze.py        # POST /api/v1/analyze, POST /api/v1/simulate, GET /api/v1/health
│   │   │   └── router.py             # Route registration
│   │   ├── core/
│   │   │   └── config.py             # Provider settings, timeouts, CORS
│   │   ├── schemas/
│   │   │   └── transaction.py        # Pydantic models (Input, Response, SHAP, Recourse, Telemetry)
│   │   ├── services/
│   │   │   ├── ml_service.py         # XGBoost scoring & SHAP TreeExplainer ranking
│   │   │   ├── recourse_service.py   # Counterfactual "What-If" remediation synthesizer
│   │   │   ├── prompt_templates.py   # Statutory prompt engineering (GDPR, FinCEN, CFPB)
│   │   │   └── compliance_agent.py   # Multi-provider client (Adaption -> Featherless -> Groq -> Offline)
│   │   └── main.py                   # FastAPI application entrypoint
│   ├── ml/
│   │   ├── dataset_generator.py      # High-fidelity banking transaction synthesizer
│   │   ├── train_model.py            # Training pipeline & joblib serialization
│   │   └── artifacts/
│   │       ├── model.joblib          # Calibrated XGBoost Classifier
│   │       ├── explainer.joblib      # Fitted SHAP TreeExplainer
│   │       └── metadata.json         # Model version and evaluation metrics
│   ├── requirements.txt              # Pinned Python dependencies
│   └── .env.example                  # Environment configuration template
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css           # Tailwind v4 + @media print vector rules
│   │   │   ├── layout.tsx            # Global metadata & typography
│   │   │   └── page.tsx              # Master dashboard cockpit
│   │   ├── components/
│   │   │   ├── Navbar.tsx            # Institutional header & hackathon badges
│   │   │   ├── SimulationPanel.tsx   # 8 interactive sliders + 4 preset scenario cards
│   │   │   ├── RadialRiskGauge.tsx   # Zero-dependency SVG risk speedometer
│   │   │   ├── ShapDivergentBarChart.tsx # Divergent horizontal bar chart (Red/Green)
│   │   │   ├── ActionableRecourseCard.tsx # Counterfactual remediation cards
│   │   │   ├── ComplianceViewer.tsx  # Markdown renderer + Vector PDF print engine
│   │   │   ├── TelemetryCard.tsx     # LLM provider execution telemetry & latency
│   │   │   ├── ProviderSidebar.tsx   # AI Engine Hub drawer (Adaption, Groq, Featherless, Offline)
│   │   │   └── HelpModal.tsx         # Comprehensive user guide modal
│   │   ├── hooks/
│   │   │   └── useFraudAnalysis.ts   # State management & backend integration
│   │   └── types/
│   │       └── index.ts              # TypeScript schemas & preset definitions
│   └── package.json                  # Node.js dependencies
│
├── FraudxAI_Spec.md                  # Hackathon requirements specification
├── FraudxAI_Especificacion_Tecnica.md # Technical specification document
├── LICENSE                           # MIT License
└── README.md                         # Main project documentation
```

---

## 13. License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
