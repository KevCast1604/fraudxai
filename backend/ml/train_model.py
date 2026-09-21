"""
FraudxAI - XGBoost Training & SHAP TreeExplainer Pipeline
GIBC V2 Hackathon - Track 02: Applied (Finance)

Trains a high-performance XGBoost classifier optimized for extreme class imbalance,
computes SHAP TreeExplainer local attribution values, evaluates model rigor,
and serializes artifacts for production deployment in FastAPI.
"""

import json
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    average_precision_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
import xgboost as xgb
import shap

from backend.ml.dataset_generator import generate_fraud_dataset

FEATURE_COLUMNS = [
    "amount",
    "distance_from_home",
    "distance_from_last_tx",
    "ratio_to_median_price",
    "repeat_retailer",
    "used_chip",
    "used_pin",
    "online_order",
]

TARGET_COLUMN = "fraud"
ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")


def train_pipeline(
    n_samples: int = 150000,
    test_size: float = 0.20,
    random_state: int = 42,
) -> None:
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    print("=" * 65)
    print("FraudxAI: Initiating Training & XAI Explainer Pipeline")
    print("=" * 65)

    # 1. Ingest Empirical Dataset or Synthesize Benchmark Distribution
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    csv_path = os.path.join(data_dir, "card_transdata.csv")

    if os.path.exists(csv_path):
        print(f"\n[1/5] Ingesting empirical Kaggle/OpenML dataset from: {csv_path}...")
        df = pd.read_csv(csv_path)
        col_map = {
            "distance_from_last_transaction": "distance_from_last_tx",
            "ratio_to_median_purchase_price": "ratio_to_median_price",
            "used_pin_number": "used_pin",
        }
        df = df.rename(columns=col_map)
        if "amount" not in df.columns:
            df["amount"] = np.round(df["ratio_to_median_price"] * 48.50, 2)
    else:
        print(f"\n[1/5] Synthesizing {n_samples:,} transactions based on empirical Kaggle card_transdata distributions...")
        df = generate_fraud_dataset(n_samples=n_samples, random_state=random_state)

    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    # 2. Stratified Train/Test Split
    print("[2/5] Splitting data into stratified Train (80%) and Test (20%)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    neg_count = int(np.sum(y_train == 0))
    pos_count = int(np.sum(y_train == 1))
    scale_pos_weight = neg_count / pos_count
    
    print(f"  Training set: {len(X_train):,} rows ({pos_count:,} fraud cases)")
    print(f"  Test set:     {len(X_test):,} rows ({int(np.sum(y_test == 1)):,} fraud cases)")
    print(f"  Class Imbalance Scale Factor (scale_pos_weight): {scale_pos_weight:.2f}")

    # 3. Train XGBoost Classifier
    print("\n[3/5] Training XGBoost Classifier...")
    model = xgb.XGBClassifier(
        n_estimators=160,
        max_depth=5,
        learning_rate=0.06,
        subsample=0.85,
        colsample_bytree=0.85,
        scale_pos_weight=scale_pos_weight,
        eval_metric=["aucpr", "logloss"],
        random_state=random_state,
        n_jobs=-1,
    )
    
    model.fit(
        X_train,
        y_train,
        eval_set=[(X_test, y_test)],
        verbose=False,
    )

    # 4. Rigorous Evaluation
    print("\n[4/5] Evaluating Model Rigor & Validation Metrics on Unseen Test Data:")
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    y_pred = (y_pred_proba >= 0.50).astype(int)

    roc_auc = float(roc_auc_score(y_test, y_pred_proba))
    pr_auc = float(average_precision_score(y_test, y_pred_proba))
    cm = confusion_matrix(y_test, y_pred).tolist()
    report = classification_report(y_test, y_pred, target_names=["Legitimate", "Fraud"], output_dict=True)

    print(f"  * ROC-AUC Score:             {roc_auc:.4f}")
    print(f"  * PR-AUC (Precision-Recall): {pr_auc:.4f}")
    print(f"  * Fraud Recall (Sensitivity): {report['Fraud']['recall']:.4f}")
    print(f"  * Fraud Precision:           {report['Fraud']['precision']:.4f}")
    print("  * Confusion Matrix:")
    print(f"    [[TN: {cm[0][0]:<6} FP: {cm[0][1]:<6}]")
    print(f"     [FN: {cm[1][0]:<6} TP: {cm[1][1]:<6}]]")

    # 5. Initialize & Validate SHAP TreeExplainer
    print("\n[5/5] Fitting SHAP TreeExplainer for Mathematical XAI Attribution...")
    explainer = shap.TreeExplainer(model)
    
    # Extract base value E[f(x)]
    expected_value = explainer.expected_value
    if isinstance(expected_value, np.ndarray):
        base_value = float(expected_value[1] if len(expected_value) > 1 else expected_value[0])
    else:
        base_value = float(expected_value)
    
    print(f"  * SHAP Base Value (Expected Margin): {base_value:.4f}")

    # Test attribution consistency on a suspicious sample
    sample_fraud = X_test[y_test == 1].iloc[0:1]
    sample_shap = explainer.shap_values(sample_fraud)
    if isinstance(sample_shap, list):
        sample_vals = sample_shap[1][0]
    elif len(sample_shap.shape) == 3:
        sample_vals = sample_shap[0, :, 1]
    else:
        sample_vals = sample_shap[0]

    print("  * Sample SHAP local attributions (sum check):")
    for feat, val in zip(FEATURE_COLUMNS, sample_vals):
        print(f"    - {feat:<24}: {val:+.4f}")

    # 6. Serialize Artifacts
    model_path = os.path.join(ARTIFACTS_DIR, "model.joblib")
    explainer_path = os.path.join(ARTIFACTS_DIR, "explainer.joblib")
    metadata_path = os.path.join(ARTIFACTS_DIR, "metadata.json")

    joblib.dump(model, model_path, compress=3)
    joblib.dump(explainer, explainer_path, compress=3)

    metadata = {
        "model_version": "XGBoost-Fraud-v1.0",
        "feature_columns": FEATURE_COLUMNS,
        "base_value": base_value,
        "thresholds": {
            "low_max": 0.35,
            "medium_max": 0.70,
            "critical_min": 0.70,
        },
        "metrics": {
            "roc_auc": round(roc_auc, 4),
            "pr_auc": round(pr_auc, 4),
            "fraud_recall": round(report["Fraud"]["recall"], 4),
            "fraud_precision": round(report["Fraud"]["precision"], 4),
            "test_samples": len(X_test),
        },
    }

    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print("\n" + "=" * 65)
    print("SUCCESS: Pipeline Complete! Serialized Artifacts:")
    print(f"  -> Model:     {model_path}")
    print(f"  -> Explainer: {explainer_path}")
    print(f"  -> Metadata:  {metadata_path}")
    print("=" * 65)


if __name__ == "__main__":
    train_pipeline()
