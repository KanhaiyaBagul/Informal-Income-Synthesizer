"""
Loan Sizing, Tenure, and Risk-Adjusted Pricing Engine
Adapted from OpenCredit and CréditScore AI architectures.
Calculates maximum safe borrowing capacity, recommended EMI, APR, and term length.
"""

from typing import Dict, Any
from pydantic import BaseModel

class LoanOfferRecommendation(BaseModel):
    is_eligible_for_loan: bool
    max_recommended_loan_inr: float
    recommended_tenure_months: int
    max_safe_monthly_emi_inr: float
    risk_adjusted_apr_percent: float
    expected_total_repayment_inr: float
    debt_service_burden_ratio: float
    pricing_tier: str
    underwriting_notes: str

def calculate_loan_sizing(
    monthly_gross: float,
    monthly_surplus: float,
    monthly_existing_emi: float,
    repayment_prob_percent: float,
    fhs_score: int,
    volatility_cv: float
) -> LoanOfferRecommendation:
    """
    Computes loan sizing based on debt-service capacity and risk tier.
    Rule: Safe EMI must not exceed 35% of unencumbered net surplus.
    """
    if monthly_surplus <= 1000 or repayment_prob_percent < 50.0 or fhs_score < 40:
        return LoanOfferRecommendation(
            is_eligible_for_loan=False,
            max_recommended_loan_inr=0.0,
            recommended_tenure_months=0,
            max_safe_monthly_emi_inr=0.0,
            risk_adjusted_apr_percent=0.0,
            expected_total_repayment_inr=0.0,
            debt_service_burden_ratio=0.0,
            pricing_tier="INELIGIBLE",
            underwriting_notes="Net operating cashflow surplus is insufficient to support debt servicing."
        )

    # Safe monthly EMI capacity: 35% of net surplus minus volatility discount
    volatility_discount = max(0.70, 1.0 - (volatility_cv * 0.5))
    safe_emi = round(monthly_surplus * 0.35 * volatility_discount, 2)

    # Determine risk-adjusted tenure and APR
    if repayment_prob_percent >= 75.0 and fhs_score >= 75:
        pricing_tier = "PRIME_TIER_A"
        apr = 14.5  # 14.5% p.a.
        tenure_months = 12
    elif repayment_prob_percent >= 60.0 and fhs_score >= 60:
        pricing_tier = "STANDARD_TIER_B"
        apr = 18.0  # 18.0% p.a.
        tenure_months = 6
    else:
        pricing_tier = "NEAR_PRIME_TIER_C"
        apr = 24.0  # 24.0% p.a.
        tenure_months = 3

    # Present value of annuity for loan principal
    monthly_rate = (apr / 100.0) / 12.0
    if monthly_rate > 0:
        principal = safe_emi * ((1.0 - (1.0 + monthly_rate) ** (-tenure_months)) / monthly_rate)
    else:
        principal = safe_emi * tenure_months

    # Cap maximum loan to 3x monthly gross receipts for informal businesses
    max_cap = monthly_gross * 3.0
    final_principal = round(min(principal, max_cap), -2)  # Round to nearest 100
    total_repayment = round(safe_emi * tenure_months, 2)

    notes = (
        f"Approved for {pricing_tier.replace('_', ' ')}. "
        f"Safe debt servicing capacity capped at INR {safe_emi:,.0f}/mo across {tenure_months} months."
    )

    return LoanOfferRecommendation(
        is_eligible_for_loan=True,
        max_recommended_loan_inr=final_principal,
        recommended_tenure_months=tenure_months,
        max_safe_monthly_emi_inr=safe_emi,
        risk_adjusted_apr_percent=apr,
        expected_total_repayment_inr=total_repayment,
        debt_service_burden_ratio=round((safe_emi + monthly_existing_emi) / max(1.0, monthly_surplus), 3),
        pricing_tier=pricing_tier,
        underwriting_notes=notes
    )
