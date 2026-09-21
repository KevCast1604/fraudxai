"""
FraudxAI - Fine-Tuning Dataset Generator for Adaption Labs
GIBC V2 Hackathon - Track 02: Applied (Finance)

Generates standardized instruction-tuning datasets (train.jsonl & val.jsonl)
pairing realistic transaction cases + SHAP attributions with legally rigorous
regulatory compliance memoranda under GDPR Art. 22, CFPB Reg B, and FinCEN SAR standards.
"""

import json
import os
import random
import uuid
from datetime import datetime, timezone
import numpy as np

# Ensure sys.path includes backend
import sys
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.schemas.transaction import TransactionInput
from app.services.ml_service import ml_service
from app.services.prompt_templates import (
    SYSTEM_COMPLIANCE_PROMPT,
    build_compliance_user_prompt,
    build_deterministic_offline_memo,
)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")


def create_sample_transaction(scenario_type: str, rng: random.Random) -> TransactionInput:
    """Generates synthetic transactions across distinct banking typologies."""
    if scenario_type == "cloning_attack":
        return TransactionInput(
            amount=round(rng.uniform(1500.0, 8500.0), 2),
            distance_from_home=round(rng.uniform(250.0, 1500.0), 1),
            distance_from_last_tx=round(rng.uniform(350.0, 2200.0), 1),
            ratio_to_median_price=round(rng.uniform(6.0, 18.0), 1),
            repeat_retailer=0,
            used_chip=0,
            used_pin=0,
            online_order=0,
        )
    elif scenario_type == "cnp_account_takeover":
        return TransactionInput(
            amount=round(rng.uniform(1800.0, 6000.0), 2),
            distance_from_home=0.0,
            distance_from_last_tx=0.0,
            ratio_to_median_price=round(rng.uniform(5.5, 14.0), 1),
            repeat_retailer=0,
            used_chip=0,
            used_pin=0,
            online_order=1,
        )
    elif scenario_type == "travel_medium_risk":
        return TransactionInput(
            amount=round(rng.uniform(180.0, 750.0), 2),
            distance_from_home=round(rng.uniform(80.0, 450.0), 1),
            distance_from_last_tx=round(rng.uniform(25.0, 120.0), 1),
            ratio_to_median_price=round(rng.uniform(1.8, 3.8), 1),
            repeat_retailer=0,
            used_chip=1,
            used_pin=0,
            online_order=0,
        )
    else:  # legitimate_routine
        return TransactionInput(
            amount=round(rng.uniform(15.0, 180.0), 2),
            distance_from_home=round(rng.uniform(0.5, 15.0), 1),
            distance_from_last_tx=round(rng.uniform(0.1, 8.0), 1),
            ratio_to_median_price=round(rng.uniform(0.6, 1.4), 1),
            repeat_retailer=1,
            used_chip=1,
            used_pin=1,
            online_order=rng.choice([0, 1]),
        )


def build_finetune_example(tx: TransactionInput) -> dict:
    audit_id = f"ACM-20260921-{uuid.uuid4().hex[:6].upper()}"
    timestamp = datetime.now(timezone.utc).isoformat()

    risk_score, risk_tier, regulatory_action, shap_factors = ml_service.predict_and_explain(tx)

    user_prompt = build_compliance_user_prompt(
        audit_id=audit_id,
        timestamp=timestamp,
        tx=tx,
        risk_score=risk_score,
        risk_tier=risk_tier,
        regulatory_action=regulatory_action,
        base_value=ml_service.base_value,
        shap_factors=shap_factors,
    )

    assistant_memo = build_deterministic_offline_memo(
        audit_id=audit_id,
        timestamp=timestamp,
        tx=tx,
        risk_score=risk_score,
        risk_tier=risk_tier,
        regulatory_action=regulatory_action,
        base_value=ml_service.base_value,
        shap_factors=shap_factors,
    )

    return {
        "messages": [
            {"role": "system", "content": SYSTEM_COMPLIANCE_PROMPT.strip()},
            {"role": "user", "content": user_prompt.strip()},
            {"role": "assistant", "content": assistant_memo.strip()},
        ]
    }


def generate_finetune_files(n_train: int = 200, n_val: int = 30, seed: int = 42):
    os.makedirs(DATA_DIR, exist_ok=True)
    rng = random.Random(seed)

    scenarios = [
        "cloning_attack",
        "cnp_account_takeover",
        "travel_medium_risk",
        "legitimate_routine",
    ]

    print(f"Generating {n_train} training and {n_val} validation examples...")

    train_data = []
    for _ in range(n_train):
        scen = rng.choice(scenarios)
        tx = create_sample_transaction(scen, rng)
        train_data.append(build_finetune_example(tx))

    val_data = []
    for _ in range(n_val):
        scen = rng.choice(scenarios)
        tx = create_sample_transaction(scen, rng)
        val_data.append(build_finetune_example(tx))

    train_file = os.path.join(DATA_DIR, "train.jsonl")
    val_file = os.path.join(DATA_DIR, "val.jsonl")
    combined_file = os.path.join(DATA_DIR, "dataset.jsonl")

    with open(train_file, "w", encoding="utf-8") as f:
        for ex in train_data:
            f.write(json.dumps(ex, ensure_ascii=False) + "\n")

    with open(val_file, "w", encoding="utf-8") as f:
        for ex in val_data:
            f.write(json.dumps(ex, ensure_ascii=False) + "\n")

    with open(combined_file, "w", encoding="utf-8") as f:
        for ex in train_data + val_data:
            f.write(json.dumps(ex, ensure_ascii=False) + "\n")

    print("\nSUCCESS! Generated Fine-Tuning Files for Adaption Labs:")
    print(f"  * Train File:    {train_file} ({len(train_data)} examples)")
    print(f"  * Val File:      {val_file} ({len(val_data)} examples)")
    print(f"  * Combined File: {combined_file} ({len(train_data) + len(val_data)} examples)")


if __name__ == "__main__":
    generate_finetune_files()
