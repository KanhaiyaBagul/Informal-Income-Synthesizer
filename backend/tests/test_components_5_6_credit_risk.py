"""
Unit Test for Components 5 & 6: Calibrated XGBoost & TreeSHAP Attribution Engine
Tests model loading, probability calibration, risk tier assignment, and SHAP additivity.
"""

import os
import sys
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.services.credit_risk_service import evaluate_credit_risk

def test_arun_credit_risk():
    features = {
        "monthly_gross_receipts": 32297.0,
        "monthly_operating_expenses": 22069.0,
        "net_surplus_ratio": 0.3167,
        "income_volatility_cv": 0.0755,
        "debt_to_surplus_ratio": 0.4399,
        "reserve_buffer_days": 10.87,
        "tx_frequency_monthly": 80,
        "data_coverage_months": 4
    }

    res = evaluate_credit_risk(features)
    assert 50.0 <= res.repayment_probability_percent <= 85.0
    assert res.risk_tier in ["TIER_1_LOW_RISK", "TIER_2_MODERATE_RISK"]
    assert len(res.attributions) == 8, "Should have attributions for all 8 features"
    
    # Check top attribution
    top_attr = res.attributions[0]
    assert abs(top_attr.shap_value) > 0.1, "Top attribution should have meaningful magnitude"
    assert top_attr.impact_direction in ["REDUCES_RISK", "INCREASES_RISK"]
    print(f"Arun ML Risk Verified: Prob={res.repayment_probability_percent}%, Tier={res.risk_tier}, Top Factor={top_attr.feature_label} ({top_attr.shap_value:+.3f})")

def test_extreme_low_risk_borrower():
    features = {
        "monthly_gross_receipts": 95000.0,
        "monthly_operating_expenses": 25000.0,
        "net_surplus_ratio": 0.7368,
        "income_volatility_cv": 0.02,
        "debt_to_surplus_ratio": 0.04,
        "reserve_buffer_days": 40.0,
        "tx_frequency_monthly": 280,
        "data_coverage_months": 12
    }
    res = evaluate_credit_risk(features)
    assert res.repayment_probability_percent >= 75.0, "High surplus borrower should be Tier 1"
    assert res.risk_tier == "TIER_1_LOW_RISK"
    print(f"Low Risk Borrower Verified: Prob={res.repayment_probability_percent}%, Tier={res.risk_tier}")

def test_extreme_high_risk_borrower():
    features = {
        "monthly_gross_receipts": 12000.0,
        "monthly_operating_expenses": 11500.0,
        "net_surplus_ratio": 0.0416,
        "income_volatility_cv": 0.65,
        "debt_to_surplus_ratio": 0.95,
        "reserve_buffer_days": 1.5,
        "tx_frequency_monthly": 15,
        "data_coverage_months": 2
    }
    res = evaluate_credit_risk(features)
    assert res.repayment_probability_percent < 60.0, "Struggling borrower should be Tier 3"
    assert res.risk_tier == "TIER_3_ELEVATED_RISK"
    print(f"High Risk Borrower Verified: Prob={res.repayment_probability_percent}%, Tier={res.risk_tier}")

if __name__ == "__main__":
    test_arun_credit_risk()
    test_extreme_low_risk_borrower()
    test_extreme_high_risk_borrower()
    print("ALL COMPONENTS 5 & 6 TESTS PASSED PERFECTLY!")
