"""
FraudxAI - Synthetic Financial Transaction Dataset Generator
GIBC V2 Hackathon - Track 02: Applied (Finance)

Generates realistic banking transactions with business-readable features and
probabilistic fraud generation based on authentic card fraud typologies:
- Card Cloning / Skimming
- Card-Not-Present (CNP) Account Takeover
- Travel & Velocity Anomalies
- High-Value Deviation
"""

import numpy as np
import pandas as pd
from typing import Tuple


def generate_fraud_dataset(
    n_samples: int = 100000,
    random_state: int = 42
) -> pd.DataFrame:
    """
    Generates a synthetic financial fraud dataset with 8 business features.
    
    Features:
    - amount: Transaction amount in USD ($0.01 - 50,000.00)
    - distance_from_home: Distance in km from cardholder primary residence
    - distance_from_last_tx: Distance in km from previous confirmed transaction
    - ratio_to_median_price: Ratio of current purchase amount to historical median
    - repeat_retailer: 1 if merchant has prior purchase history, 0 if first-time
    - used_chip: 1 if physical EMV chip cryptogram validated, 0 otherwise
    - used_pin: 1 if PIN entered at terminal, 0 otherwise
    - online_order: 1 if Card-Not-Present (CNP/e-commerce), 0 if physical POS
    - fraud: Binary target (0 = Legitimate, 1 = Fraudulent)
    """
    rng = np.random.default_rng(random_state)

    # 1. Base Feature Generation with Financial Distributions
    # Distance from home (log-normal: mostly close, rare domestic/foreign travel)
    distance_from_home = np.clip(rng.lognormal(mean=2.2, sigma=1.4, size=n_samples), 0.1, 8000.0)
    
    # Distance from last transaction (log-normal: mostly consecutive local purchases)
    distance_from_last_tx = np.clip(rng.lognormal(mean=1.2, sigma=1.6, size=n_samples), 0.0, 10000.0)
    
    # Ratio to median price (Pareto / lognormal: mostly near 1.0x, long tail for large spikes)
    ratio_to_median_price = np.clip(rng.lognormal(mean=0.2, sigma=0.85, size=n_samples), 0.05, 75.0)
    
    # Base median price per customer profile (~$45)
    baseline_median_price = rng.gamma(shape=3.0, scale=15.0, size=n_samples)
    amount = np.clip(baseline_median_price * ratio_to_median_price, 0.50, 50000.0)
    
    # Binary transactional indicators
    repeat_retailer = rng.binomial(n=1, p=0.88, size=n_samples)
    online_order = rng.binomial(n=1, p=0.62, size=n_samples)
    
    # EMV Chip and PIN usage conditioned on transaction channel
    # CNP / Online orders cannot use physical chip or hardware PIN
    used_chip = np.zeros(n_samples, dtype=int)
    used_pin = np.zeros(n_samples, dtype=int)
    
    physical_pos_mask = (online_order == 0)
    used_chip[physical_pos_mask] = rng.binomial(n=1, p=0.82, size=np.sum(physical_pos_mask))
    used_pin[physical_pos_mask] = rng.binomial(n=1, p=0.45, size=np.sum(physical_pos_mask))

    # 2. Risk Scoring & Latent Fraud Probability Computation
    # Formulate structural vulnerability vectors reflecting real banking fraud:
    
    # Velocity Anomaly Score: High distance from last transaction
    velocity_risk = np.where(distance_from_last_tx > 500.0, 2.8, 0.0) + \
                    np.where(distance_from_last_tx > 1500.0, 2.5, 0.0)
    
    # Spending Deviation Score: Significant deviation from historical median
    price_deviation_risk = np.where(ratio_to_median_price > 4.0, 2.2, 0.0) + \
                           np.where(ratio_to_median_price > 10.0, 3.0, 0.0)
    
    # Authentication Weakness: Card Present without EMV chip / PIN (Skimming vulnerability)
    auth_weakness_risk = np.where(
        (online_order == 0) & (used_chip == 0) & (used_pin == 0),
        3.2,
        0.0
    )
    
    # CNP / E-Commerce Risk: Online order at non-repeat retailer with large amount
    cnp_risk = np.where(
        (online_order == 1) & (repeat_retailer == 0) & (ratio_to_median_price > 3.0),
        3.4,
        0.0
    )
    
    # Distance from Home Anomaly
    foreign_geo_risk = np.where(distance_from_home > 1200.0, 1.8, 0.0)

    # Risk Mitigating Factors
    mitigation = np.zeros(n_samples)
    mitigation += np.where(used_pin == 1, -3.5, 0.0)          # Verified PIN strongly mitigates
    mitigation += np.where(used_chip == 1, -1.8, 0.0)         # EMV cryptogram reduces skimming
    mitigation += np.where(repeat_retailer == 1, -1.2, 0.0)    # Known merchant
    mitigation += np.where(ratio_to_median_price < 1.2, -1.0, 0.0) # Normal spending level

    # Logit calculation
    base_logit = -4.2  # Unconditional base logit targeting ~7-8% overall fraud rate
    total_logit = (
        base_logit +
        velocity_risk +
        price_deviation_risk +
        auth_weakness_risk +
        cnp_risk +
        foreign_geo_risk +
        mitigation +
        rng.normal(0, 0.5, size=n_samples)  # Unobserved stochastic variation
    )

    # Sigmoid function for probability
    fraud_prob = 1.0 / (1.0 + np.exp(-total_logit))
    fraud = rng.binomial(n=1, p=fraud_prob)

    df = pd.DataFrame({
        "amount": np.round(amount, 2),
        "distance_from_home": np.round(distance_from_home, 2),
        "distance_from_last_tx": np.round(distance_from_last_tx, 2),
        "ratio_to_median_price": np.round(ratio_to_median_price, 2),
        "repeat_retailer": repeat_retailer,
        "used_chip": used_chip,
        "used_pin": used_pin,
        "online_order": online_order,
        "fraud": fraud
    })

    return df


if __name__ == "__main__":
    print("Generating benchmark dataset...")
    data = generate_fraud_dataset(n_samples=100000, random_state=42)
    fraud_rate = (data["fraud"].mean()) * 100
    print(f"Dataset generated with {len(data):,} transactions.")
    print(f"Overall Fraud Rate: {fraud_rate:.2f}% ({data['fraud'].sum():,} fraudulent transactions)")
    print("\nFeature Summary:")
    print(data.describe().T[["mean", "std", "min", "50%", "max"]])
