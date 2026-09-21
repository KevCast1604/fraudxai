# Contexto y Especificación de Proyecto: FraudxAI

Documento base de requerimientos técnicos, reglas de competencia y arquitectura de software para el agente de desarrollo.

---

## 1. Contexto de la Competencia

* **Hackathon:** Global Innovation Build Challenge (GIBC) V2.
* **Track:** Track 02: Applied (Medical Technology & Finance).
* **Plazo de entrega de sumisiones:** Finaliza el 1 de octubre de 2026 a las 10:45 AM GMT-5.
* **Criterios:** Innovation & Impact, Technical Feasibility, Rigor & Validation, Presentation.

---

## 2. Definición del Producto

* **Project Name:** FraudxAI: Explainable AI for Risk & Compliance
* **Elevator Pitch:** An end-to-end fraud detection pipeline powered by XGBoost and SHAP that generates automated, auditable compliance memos for financial analysts.
* **Problema:** Regulaciones bancarias exigen justificar el motivo detrás de transacciones denegadas. Los modelos tradicionales operan como cajas negras.
* **Solución:** Clasificador XGBoost + explicabilidad matemática con SHAP + memorando de auditoría regulatoria generado por un LLM vía Groq.

---

## 3. Arquitectura del Sistema

1. Transacción de Entrada (features numéricas/financieras).
2. Pipeline ML (XGBoost) -> Probabilidad de riesgo.
3. Motor XAI (SHAP TreeExplainer) -> Atribución de variables locales.
4. Agente de Compliance (Groq API - Llama 3.1) -> Memorando formal.
5. UI / Dashboard -> Indicadores, barras SHAP y descarga de informe.

---

## 4. Stack Técnico

* Python, xgboost, shap, scikit-learn, pandas, numpy, joblib.
* Backend: FastAPI con esquemas Pydantic.
* LLM: Groq SDK (llama-3.1-8b-instant).
* Frontend: Next.js con Tailwind CSS o Streamlit.

---

## 5. Requisitos de Entrega en Devpost

1. Project Description técnica.
2. Repositorio público en GitHub con licencia open source (MIT/Apache 2.0) y README completo.
3. Video de demostración de 2 a 5 minutos en YouTube/Vimeo.
4. Built With completo.
5. Mínimo 3 capturas de pantalla de la interfaz y métricas.
