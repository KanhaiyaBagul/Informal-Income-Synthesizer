"""
Unit Test for Component 7: Loan Sizing, Safe EMI & APR Pricing Engine
Tests loan eligibility, principal present value calculations, tenure, and APR pricing tiers.
"""

import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.services.loan_sizing_service import calculate_loan_sizing

def test_arun_loan_offer():
    offer = calculate_loan_sizing(
        monthly_gross=32297.0,
        monthly_surplus=10228.0,
        monthly_existing_emi=4500.0,
        repayment_prob_percent=67.0,
        fhs_score=67,
        volatility_cv=0.0755
    )
    assert offer.is_eligible_for_loan is True
    assert offer.pricing_tier == "STANDARD_TIER_B"
    assert offer.recommended_tenure_months == 6
    assert offer.risk_adjusted_apr_percent == 18.0
    assert offer.max_recommended_loan_inr > 15000.0
    assert offer.max_safe_monthly_emi_inr <= 10228.0 * 0.35 + 1.0
    print(f"Arun Loan Offer Verified: Principal=Rs {offer.max_recommended_loan_inr:,.0f}, Tenure={offer.recommended_tenure_months} mo, EMI=Rs {offer.max_safe_monthly_emi_inr:,.0f}/mo @ {offer.risk_adjusted_apr_percent}% APR")

def test_ramesh_prime_offer():
    offer = calculate_loan_sizing(
        monthly_gross=42995.0,
        monthly_surplus=24495.0,
        monthly_existing_emi=3500.0,
        repayment_prob_percent=78.2,
        fhs_score=88,
        volatility_cv=0.045
    )
    assert offer.is_eligible_for_loan is True
    assert offer.pricing_tier == "PRIME_TIER_A"
    assert offer.recommended_tenure_months == 12
    assert offer.risk_adjusted_apr_percent == 14.5
    assert offer.max_recommended_loan_inr > 70000.0
    print(f"Ramesh Loan Offer Verified: Principal=Rs {offer.max_recommended_loan_inr:,.0f}, Tenure={offer.recommended_tenure_months} mo, EMI=Rs {offer.max_safe_monthly_emi_inr:,.0f}/mo @ {offer.risk_adjusted_apr_percent}% APR")

def test_ineligible_borrower():
    offer = calculate_loan_sizing(
        monthly_gross=12000.0,
        monthly_surplus=500.0,
        monthly_existing_emi=2000.0,
        repayment_prob_percent=35.0,
        fhs_score=30,
        volatility_cv=0.60
    )
    assert offer.is_eligible_for_loan is False
    assert offer.max_recommended_loan_inr == 0.0
    assert offer.pricing_tier == "INELIGIBLE"
    print("Ineligible Borrower Test Passed: Correctly blocked from debt overhang.")

if __name__ == "__main__":
    test_arun_loan_offer()
    test_ramesh_prime_offer()
    test_ineligible_borrower()
    print("ALL COMPONENT 7 TESTS PASSED PERFECTLY!")
