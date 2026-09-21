# **FraudxAI: Arquitectura Técnica y Especificación de la Solución**

Documento de diseño de sistemas, modelado matemático y contratos de interfaz para la implementación de **FraudxAI** en el marco del Track 02 (Applied \- Finance) de GIBC V2.

## ---

**1\. Declaración del Problema y Enfoque**

### **1.1. La Falla Estructural en Detección de Fraude Tradicional**

Los sistemas de detección de fraude basados en Machine Learning enfrentan un dilema regulatorio crítico:

> * **El problema de la "Caja Negra" (Black-Box):** Los modelos complejos como Gradient Boosted Trees o Redes Neuronales producen probabilidades continuas (ej. P(fraude) \= 0.93), pero no exponen los factores causales subyacentes.  
> * **Exigencia Regulatoria:** Marcos de cumplimiento financiero y normativas de protección de datos exigen el "derecho a la explicación" ante el bloqueo de cuentas o transacciones. Bloquear una operación legítima sin justificación auditable acarrea multas por fricción con el cliente y sanciones normativas.

### **1.2. La Solución FraudxAI**

FraudxAI desacopla el proceso en tres capas complementarias y deterministas:

> 1. **Scoring de Riesgo:** Clasificación probabilística mediante un modelo XGBoost optimizado para clases fuertemente desbalanceadas.  
> 2. **Atribución Causal Matemática:** Extracción de valores SHAP (SHapley Additive exPlanations) a nivel de instancia para medir el aporte exacto de cada variable a la decisión.  
> 3. **Generación Automatizada de Memorandos:** Síntesis del vector de atribución mediante un LLM configurado como Agente de Compliance, que produce un memorando formal de auditoría listo para firma y archivo legal.

## ---

**2\. Pipeline de Datos y Machine Learning**

### **2.1. Vector de Características (Features Legibles de Negocio)**

A diferencia de los conjuntos anonimizados con PCA (V1, ..., V28), este pipeline opera sobre variables con semántica financiera directa:

> * amount: Monto de la transacción en USD ($0.01 \- 50,000.00)  
> * distance\_from\_home: Distancia en km desde el domicilio registrado  
> * distance\_from\_last\_tx: Distancia en km desde la última transacción válida  
> * ratio\_to\_median\_price: Razón entre el monto actual y la mediana de compra del cliente  
> * repeat\_retailer: Comercio habitual del titular de la cuenta (0 o 1\)  
> * used\_chip: Transacción validada con chip físico EMV (0 o 1\)  
> * used\_pin: Transacción validada mediante PIN de seguridad (0 o 1\)  
> * online\_order: Transacción en comercio electrónico (CNP) (0 o 1\)

### **2.2. Modelo Predictivo (XGBoost Classifier)**

> * **Función Objetivo:** Maximizar la métrica PR-AUC (Precision-Recall AUC) y ROC-AUC, priorizando un alto Recall.  
> * **Estrategia de Desbalance:** Ajuste del parámetro scale\_pos\_weight \= N\_legitimas / N\_fraude.  
> * **Hiperparámetros de Referencia:** max\_depth: 4 a 6, learning\_rate: 0.05 a 0.08, n\_estimators: 150 con early stopping.

## ---

**3\. Motor de Interpretabilidad Matemática (XAI)**

### **3.1. Teoría de Shapley Additive exPlanations (SHAP)**

El modelo descompone la predicción puntual como una suma de la expectativa base y las contribuciones individuales de cada variable. Las contribuciones positivas aumentan el riesgo, y las negativas lo mitigan.

### **3.2. Reglas de Severidad y Extracción de Factores**

> * **BAJO (P \< 0.35):** Transacción aprobada automáticamente.  
> * **MEDIO (0.35 \<= P \< 0.70):** Alerta amarilla, requiere verificación secundaria (2FA o revisión manual).  
> * **CRÍTICO (P \>= 0.70):** Bloqueo preventivo inmediato y emisión obligatoria del memorando de auditoría.

## ---

**4\. Agente de Auditoría y Compliance (Capa LLM)**

### **4.1. Arquitectura de Inferencia con Tolerancia a Fallos**

Para garantizar disponibilidad, el sistema opera con dos proveedores:

> 1. **Endpoint Primario:** Featherless AI (Meta-Llama-3.1-8B-Instruct)  
> 2. **Endpoint Secundario (Fallback):** Groq Cloud (llama-3.1-8b-instant)

### **4.2. Estructura Formal del Memorando Generado**

> * Cabecera de Cumplimiento  
> * Fundamento Estadístico  
> * Análisis de Riesgo Contextual  
> * Disposición Regulatoria

## ---

**5\. Contratos de Interfaz (API Schemas) y Frontend**

El backend en FastAPI expondrá el endpoint POST /api/v1/analyze recibiendo las variables en formato JSON y devolviendo la probabilidad de riesgo, los top features de SHAP y el reporte legal en formato Markdown.

El frontend en Next.js constará de tres paneles visuales:

> 1. **Panel de Simulación:** Sliders y botones de preconfiguración (ej. "Ataque de clonación de tarjeta").  
> 2. **Cuadrante SHAP:** Medidor de riesgo radial y gráfico de barras divergentes para los valores probabilísticos.  
> 3. **Visor de Cumplimiento:** Lectura del memorando formal con opción de descarga en PDF o documento de texto.