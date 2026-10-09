"""
Credit Risk Evaluation Service
Loads calibrated XGBoost model and SHAP TreeExplainer to evaluate probability of repayment,
risk tier assignment, and feature attributions.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List
from pydantic import BaseModel

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "ml", "artifacts")

MODEL_PATH = os.path.join(ARTIFACTS_DIR, "calibrated_pipeline.joblib")
BASE_XGB_PATH = os.path.join(ARTIFACTS_DIR, "risk_model_xgboost.joblib")
SHAP_PATH = os.path.join(ARTIFACTS_DIR, "shap_explainer.joblib")
BASELINE_PATH = os.path.join(ARTIFACTS_DIR, "baseline_value.json")
FEATURES_PATH = os.path.join(ARTIFACTS_DIR, "feature_names.json")

class ShapFeatureAttribution(BaseModel):
    feature_name: str
    feature_label: str
    feature_value: float
    feature_value_formatted: str
    shap_value: float # Contribution in log-odds space
    impact_direction: str # "REDUCES_RISK" (positive force) or "INCREASES_RISK" (negative force)
    impact_magnitude: str # "HIGH", "MODERATE", "LOW"
    human_explanation: str


class CreditRiskEvaluationResult(BaseModel):
    repayment_probability_percent: float # e.g. 78.5%
    default_risk_probability_percent: float # e.g. 21.5%
    risk_tier: str # "TIER_1_PRIME", "TIER_2_MODERATE", "TIER_3_ELEVATED"
    baseline_probability_percent: float
    model_version: str
    shap_baseline_log_odds: float
    attributions: List[ShapFeatureAttribution]
    plain_language_narrative: str


def _format_feature(name: str, val: float) -> tuple[str, str]:
    labels = {
        "monthly_gross_receipts": ("Monthly Gross Turnover", f"INR {val:,.0f}"),
        "monthly_operating_expenses": ("Operating Expenses", f"INR {val:,.0f}"),
        "net_surplus_ratio": ("Operating Surplus Ratio", f"{val*100:.1f}%"),
        "income_volatility_cv": ("Income Volatility (CV)", f"{val:.3f}"),
        "debt_to_surplus_ratio": ("Debt Burden Ratio", f"{val*100:.1f}%"),
        "reserve_buffer_days": ("Reserve Liquidity Days", f"{val:.1f} days"),
        "tx_frequency_monthly": ("Monthly UPI Velocity", f"{int(val)} txns"),
        "data_coverage_months": ("Statement Coverage", f"{int(val)} months")
    }
    return labels.get(name, (name, str(val)))


def evaluate_credit_risk(features_dict: Dict[str, float]) -> CreditRiskEvaluationResult:
    """
    Evaluates credit repayment probability and SHAP attribution for input features.
    """
    model = joblib.load(MODEL_PATH)
    explainer = joblib.load(SHAP_PATH)
    with open(FEATURES_PATH, "r") as f:
        feature_names = json.load(f)
    with open(BASELINE_PATH, "r") as f:
        baseline_info = json.load(f)

    # Prepare DataFrame matching training schema
    row = {col: float(features_dict.get(col, 0.0)) for col in feature_names}
    X = pd.DataFrame([row])[feature_names]

    # Predict calibrated probability
    prob_repaid = float(model.predict_proba(X)[0, 1])
    prob_default = float(1.0 - prob_repaid)

    # Determine risk tier
    if prob_repaid >= 0.75:
        tier = "TIER_1_LOW_RISK"
    elif prob_repaid >= 0.60:
        tier = "TIER_2_MODERATE_RISK"
    else:
        tier = "TIER_3_ELEVATED_RISK"

    # Compute SHAP values
    shap_vals = explainer(X)
    raw_shap_arr = shap_vals.values[0]

    attributions = []
    top_positive = []
    top_negative = []

    for name, val, sv in zip(feature_names, X.iloc[0], raw_shap_arr):
        label, formatted = _format_feature(name, val)
        is_positive = (sv >= 0)
        direction = "REDUCES_RISK" if is_positive else "INCREASES_RISK"
        mag = "HIGH" if abs(sv) >= 0.20 else ("MODERATE" if abs(sv) >= 0.08 else "LOW")

        # Explain in human language
        if name == "debt_to_surplus_ratio":
            exp = "Low ongoing EMI obligations strongly support repayment capacity." if is_positive else "Existing loan EMIs consume a high share of surplus, constraining borrowing capacity."
        elif name == "income_volatility_cv":
            exp = "Predictable and regular monthly cashflow bolsters confidence." if is_positive else "High month-to-month receipt fluctuations present seasonal repayment risk."
        elif name == "reserve_buffer_days":
            exp = "Healthy liquidity reserve provides a safety buffer against dry days." if is_positive else "Thin cash reserves leave minimal cushion against unforeseen expenses."
        elif name == "net_surplus_ratio":
            exp = "Strong net operating margin provides ample discretionary surplus." if is_positive else "Narrow profit margin leaves little room for debt servicing."
        elif name == "data_coverage_months":
            exp = "Multi-month verifiable history demonstrates stability." if is_positive else "Short statement window limits historical certainty."
        else:
            exp = f"Feature contribution pushes risk rating {'favorably' if is_positive else 'unfavorably'}."

        attr = ShapFeatureAttribution(
            feature_name=name,
            feature_label=label,
            feature_value=round(val, 4),
            feature_value_formatted=formatted,
            shap_value=round(float(sv), 4),
            impact_direction=direction,
            impact_magnitude=mag,
            human_explanation=exp
        )
        attributions.append(attr)

        if is_positive:
            top_positive.append((abs(sv), label))
        else:
            top_negative.append((abs(sv), label))

    # Sort attributions by absolute impact magnitude
    attributions.sort(key=lambda a: abs(a.shap_value), reverse=True)
    top_positive.sort(reverse=True)
    top_negative.sort(reverse=True)

    pos_summary = ", ".join([p[1] for p in top_positive[:2]]) if top_positive else "steady basic activity"
    neg_summary = ", ".join([n[1] for n in top_negative[:2]]) if top_negative else "no major penalties"

    narrative = (
        f"The credit-risk model estimates a {prob_repaid*100:.1f}% probability of timely repayment ({tier.replace('_', ' ')}). "
        f"The baseline population expectation is {baseline_info['expected_probability']*100:.1f}%. "
        f"Primary positive contributors boosting the score above baseline are {pos_summary}. "
        f"Factors exerting downward drag are {neg_summary}."
    )

    return CreditRiskEvaluationResult(
        repayment_probability_percent=round(prob_repaid * 100.0, 1),
        default_risk_probability_percent=round(prob_default * 100.0, 1),
        risk_tier=tier,
        baseline_probability_percent=round(baseline_info["expected_probability"] * 100.0, 1),
        model_version="XGBoost-AltCredit-v1.0",
        shap_baseline_log_odds=round(baseline_info["expected_value_log_odds"], 4),
        attributions=attributions,
        plain_language_narrative=narrative
    )
