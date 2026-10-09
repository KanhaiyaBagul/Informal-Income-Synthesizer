"""
Fraud, Anomaly, and Anti-Syndicate Detection Engine
Adapted from OpenCredit UPI verification rules.
Detects circular transactions, extreme customer concentration, and velocity spikes.
"""

from typing import List, Dict, Any
import pandas as pd
import numpy as np
from pydantic import BaseModel

class AnomalyAuditReport(BaseModel):
    is_suspicious: bool
    risk_score_penalty: int
    flags_triggered: List[str]
    customer_concentration_ratio: float
    max_counterparty_share_percent: float
    velocity_spike_ratio: float
    audit_summary: str

def audit_transactions_for_fraud(df: pd.DataFrame) -> AnomalyAuditReport:
    """
    Audits normalized transaction DataFrame for fraudulent volume inflation,
    customer concentration risk, circular round-tripping, and velocity surges.
    """
    flags = []
    penalty = 0

    if df.empty or len(df) < 5:
        return AnomalyAuditReport(
            is_suspicious=False,
            risk_score_penalty=0,
            flags_triggered=["INSUFFICIENT_TRANSACTION_HISTORY"],
            customer_concentration_ratio=0.0,
            max_counterparty_share_percent=0.0,
            velocity_spike_ratio=1.0,
            audit_summary="Insufficient transaction rows for comprehensive fraud audit."
        )

    credits = df[df["direction"].str.upper() == "CREDIT"]
    total_credit_volume = float(credits["amount"].sum()) if not credits.empty else 1.0

    # 1. Customer Concentration Check (OpenCredit Rule: ELIG_CONCENTRATION)
    # Check if a single payer/customer accounts for > 60% of total revenue
    max_share = 0.0
    if "counterparty" in df.columns and not credits.empty:
        # Ignore generic placeholder labels
        valid_payers = credits[~credits["counterparty"].str.upper().isin(["THIRD_PARTY", "UNKNOWN", "NA", "N/A"])]
        if not valid_payers.empty:
            payer_grouped = valid_payers.groupby("counterparty")["amount"].sum()
            if not payer_grouped.empty:
                top_payer_volume = float(payer_grouped.max())
                top_payer_name = payer_grouped.idxmax()
                max_share = float(top_payer_volume / max(1.0, total_credit_volume))
                if max_share > 0.60:
                    flags.append(f"HIGH_CONCENTRATION_RISK: Single counterparty '{top_payer_name}' generates {max_share*100:.1f}% of total business revenue.")
                    penalty += 15

    # 2. Velocity Surge Anomaly
    # Check if transaction frequency in the last 15 days is >= 3.5x the historical daily rate
    df_sorted = df.copy()
    df_sorted["date_dt"] = pd.to_datetime(df_sorted["date"], errors="coerce")
    df_sorted = df_sorted.dropna(subset=["date_dt"]).sort_values("date_dt")

    velocity_spike = 1.0
    if len(df_sorted) >= 20:
        max_date = df_sorted["date_dt"].max()
        cutoff_recent = max_date - pd.Timedelta(days=15)
        recent_txns = df_sorted[df_sorted["date_dt"] >= cutoff_recent]
        prior_txns = df_sorted[df_sorted["date_dt"] < cutoff_recent]

        recent_daily_rate = len(recent_txns) / 15.0
        prior_days = max(1, (cutoff_recent - df_sorted["date_dt"].min()).days)
        prior_daily_rate = len(prior_txns) / float(prior_days)

        if prior_daily_rate > 0:
            velocity_spike = round(recent_daily_rate / prior_daily_rate, 2)
            if velocity_spike >= 3.5:
                flags.append(f"VELOCITY_SPIKE: Recent 15-day activity surged by {velocity_spike}x normal operating frequency.")
                penalty += 10

    # 3. Round-Trip Same-Day Reversal Detection
    # Look for matching debit and credit amounts within a 24-hour window
    circular_found = False
    for idx, row in credits.iterrows():
        amt = row["amount"]
        if amt < 500:
            continue  # Ignore trivial micro transactions
        matching_debits = df[
            (df["direction"].str.upper() == "DEBIT") &
            (df["amount"] == amt) &
            (df["date"] == row["date"])
        ]
        if len(matching_debits) >= 2:
            flags.append(f"ROUND_TRIP_ANOMALY: Suspected circular transfers of INR {amt:,.0f} detected on {row['date']}.")
            penalty += 20
            circular_found = True
            break

    is_suspicious = penalty >= 25
    summary = (
        "Passed integrity and anti-fraud checks with 0 anomalies." if not flags else
        f"Triggered {len(flags)} integrity warning(s) with cumulative risk penalty of -{penalty} pts."
    )

    return AnomalyAuditReport(
        is_suspicious=is_suspicious,
        risk_score_penalty=penalty,
        flags_triggered=flags,
        customer_concentration_ratio=round(max_share, 4),
        max_counterparty_share_percent=round(max_share * 100.0, 1),
        velocity_spike_ratio=velocity_spike,
        audit_summary=summary
    )
