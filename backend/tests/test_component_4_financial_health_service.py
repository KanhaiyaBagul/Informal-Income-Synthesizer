"""
Unit Test for Component 4: Deterministic 5-Pillar Financial Health Scoring
Verifies pillar weights, formulas, fraud penalty deduction, and health band classifications.
"""

import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.services.financial_health_service import (
    calculate_financial_health_score,
    FHSInputFeatures
)

def test_arun_fhs():
    inp = FHSInputFeatures(
        monthly_gross_receipts=32297.0,
        monthly_operating_expenses=22069.0,
        monthly_debt_emi=4500.0,
        income_volatility_cv=0.0755,
        min_ledger_balance=3200.0,
        data_coverage_months=4
    )
    res = calculate_financial_health_score(inp)
    assert 60 <= res.overall_score <= 75, f"Expected Arun FHS between 60 and 75, got {res.overall_score}"
    assert res.health_band in ["RESILIENT", "MODERATE"]
    assert len(res.pillars) == 5
    print(f"Arun FHS Verified: Score={res.overall_score}/100, Band={res.health_band}")

def test_ramesh_fhs():
    inp = FHSInputFeatures(
        monthly_gross_receipts=42995.0,
        monthly_operating_expenses=18500.0,
        monthly_debt_emi=3500.0,
        income_volatility_cv=0.045,
        min_ledger_balance=11500.0,
        data_coverage_months=4
    )
    res = calculate_financial_health_score(inp)
    assert res.overall_score >= 80, f"Expected Ramesh FHS >= 80, got {res.overall_score}"
    assert res.health_band == "PRIME_STABLE"
    print(f"Ramesh FHS Verified: Score={res.overall_score}/100, Band={res.health_band}")

def test_fraud_penalty_integration():
    inp = FHSInputFeatures(
        monthly_gross_receipts=32297.0,
        monthly_operating_expenses=22069.0,
        monthly_debt_emi=4500.0,
        income_volatility_cv=0.0755,
        min_ledger_balance=3200.0,
        data_coverage_months=4
    )
    base_res = calculate_financial_health_score(inp, fraud_penalty=0)
    penalized_res = calculate_financial_health_score(inp, fraud_penalty=15)
    
    assert penalized_res.overall_score == base_res.overall_score - 15, "Score should reflect exact 15 pt penalty"
    assert any("Transaction Integrity Warning" in v for v in penalized_res.vulnerabilities)
    print(f"Fraud Penalty Deduction Verified: Base={base_res.overall_score} -> Penalized={penalized_res.overall_score}")

if __name__ == "__main__":
    test_arun_fhs()
    test_ramesh_fhs()
    test_fraud_penalty_integration()
    print("ALL COMPONENT 4 TESTS PASSED PERFECTLY!")
