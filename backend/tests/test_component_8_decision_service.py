"""
Unit Test for Component 8: Underwriting Decision Engine (decision_service.py)
Tests policy rule evaluation, fraud risk override, loan offer synchronization, and status labels.
"""

import sys
import os

# Add hack/ directory to sys.path so backend imports work reliably
HACK_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if HACK_DIR not in sys.path:
    sys.path.insert(0, HACK_DIR)

from backend.app.services.decision_service import evaluate_underwriting_policy, UnderwritingDecisionResult
from backend.app.services.anomaly_fraud_service import AnomalyAuditReport
from backend.app.services.loan_sizing_service import LoanOfferRecommendation


def test_eligible_prime_borrower():
    clean_fraud = AnomalyAuditReport(
        is_suspicious=False,
        risk_score_penalty=0,
        flags_triggered=[],
        customer_concentration_ratio=0.12,
        max_counterparty_share_percent=12.0,
        velocity_spike_ratio=1.05,
        audit_summary="Clean transaction pattern."
    )
    prime_offer = LoanOfferRecommendation(
        is_eligible_for_loan=True,
        max_recommended_loan_inr=85000.0,
        recommended_tenure_months=12,
        max_safe_monthly_emi_inr=7500.0,
        risk_adjusted_apr_percent=14.5,
        expected_total_repayment_inr=90000.0,
        debt_service_burden_ratio=0.25,
        pricing_tier="PRIME_TIER_A",
        underwriting_notes="Prime offer calculated."
    )

    result = evaluate_underwriting_policy(
        monthly_gross=65000.0,
        monthly_surplus=28000.0,
        fhs_score=84,
        repayment_prob=85.0,
        debt_to_surplus_ratio=0.15,
        coverage_months=4,
        volatility_cv=0.12,
        fraud_report=clean_fraud,
        loan_offer=prime_offer
    )

    print("Eligible Result:", result.decision_status, result.status_badge_color)
    assert result.decision_status == "ELIGIBLE"
    assert result.status_badge_color == "LIME"
    assert result.passed_count == 6
    assert result.total_rules_count == 6
    assert result.approved_loan_offer is not None
    assert result.approved_loan_offer.is_eligible_for_loan is True
    assert result.approved_loan_offer.max_recommended_loan_inr == 85000.0
    print("PASS: test_eligible_prime_borrower")


def test_fraud_override_to_ineligible():
    suspicious_fraud = AnomalyAuditReport(
        is_suspicious=True,
        risk_score_penalty=30,
        flags_triggered=["HIGH_CONCENTRATION_RISK: Single counterparty generates 85% of volume", "CIRCULAR_TRANSACTION_DETECTED"],
        customer_concentration_ratio=0.85,
        max_counterparty_share_percent=85.0,
        velocity_spike_ratio=4.2,
        audit_summary="High probability of synthetic revenue inflation."
    )
    prelim_offer = LoanOfferRecommendation(
        is_eligible_for_loan=True,
        max_recommended_loan_inr=50000.0,
        recommended_tenure_months=6,
        max_safe_monthly_emi_inr=5000.0,
        risk_adjusted_apr_percent=18.0,
        expected_total_repayment_inr=55000.0,
        debt_service_burden_ratio=0.30,
        pricing_tier="STANDARD_TIER_B",
        underwriting_notes="Standard offer."
    )

    # Even with high surplus and good scores, fraud MUST override decision to NOT_ELIGIBLE
    result = evaluate_underwriting_policy(
        monthly_gross=50000.0,
        monthly_surplus=25000.0,
        fhs_score=78,
        repayment_prob=72.0,
        debt_to_surplus_ratio=0.20,
        coverage_months=4,
        volatility_cv=0.15,
        fraud_report=suspicious_fraud,
        loan_offer=prelim_offer
    )

    print("Fraud Override Result:", result.decision_status, result.status_label)
    assert result.decision_status == "NOT_ELIGIBLE"
    assert result.status_badge_color == "RED"
    assert "Declined" in result.status_label
    assert result.fraud_risk_level == "HIGH_RISK"
    assert result.approved_loan_offer is not None
    assert result.approved_loan_offer.is_eligible_for_loan is False
    assert result.approved_loan_offer.max_recommended_loan_inr == 0.0
    print("PASS: test_fraud_override_to_ineligible")


def test_ineligible_due_to_cashflow_deficit():
    clean_fraud = AnomalyAuditReport(
        is_suspicious=False,
        risk_score_penalty=0,
        flags_triggered=[],
        customer_concentration_ratio=0.20,
        max_counterparty_share_percent=20.0,
        velocity_spike_ratio=1.0,
        audit_summary="Clean."
    )
    result = evaluate_underwriting_policy(
        monthly_gross=12000.0,
        monthly_surplus=3500.0,  # Below INR 6,000 threshold
        fhs_score=52,            # Below 65 threshold
        repayment_prob=54.0,     # Below 60% threshold
        debt_to_surplus_ratio=0.75, # Excessive debt
        coverage_months=2,       # Less than 3 months
        volatility_cv=0.45,
        fraud_report=clean_fraud,
        loan_offer=None
    )

    print("Cashflow Deficit Result:", result.decision_status, result.primary_reason_codes)
    assert result.decision_status == "NOT_ELIGIBLE"
    assert "INSUFFICIENT_NET_CASHFLOW" in result.primary_reason_codes
    assert "BELOW_FHS_BENCHMARK" in result.primary_reason_codes
    assert "EXCESSIVE_LEVERAGE" in result.primary_reason_codes
    print("PASS: test_ineligible_due_to_cashflow_deficit")


if __name__ == "__main__":
    test_eligible_prime_borrower()
    test_fraud_override_to_ineligible()
    test_ineligible_due_to_cashflow_deficit()
    print("\nALL COMPONENT 8 TESTS PASSED SUCCESSFULLY!")
