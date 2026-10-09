"""
Underwriting Decision & Policy Rules Service
Evaluates transparent eligibility rules against verified financial features and outputs
unambiguous reason codes, checklist statuses, and actionable next steps.
Separates normative credit policies from model predictions.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel
try:
    from .anomaly_fraud_service import AnomalyAuditReport
    from .loan_sizing_service import LoanOfferRecommendation
except ImportError:
    from backend.app.services.anomaly_fraud_service import AnomalyAuditReport
    from backend.app.services.loan_sizing_service import LoanOfferRecommendation

class PolicyCriterionResult(BaseModel):
    rule_id: str
    rule_name: str
    target_threshold: str
    actual_value_formatted: str
    is_passed: bool
    status_tag: str  # "PASSED", "WARNING", "FAILED"
    reason_code: str
    remediation_advice: str


class UnderwritingDecisionResult(BaseModel):
    decision_status: str  # "ELIGIBLE", "CONDITIONAL_APPROVAL", "NOT_ELIGIBLE"
    status_label: str
    status_badge_color: str  # "LIME", "AMBER", "RED"
    policy_version: str
    criteria_evaluated: List[PolicyCriterionResult]
    passed_count: int
    total_rules_count: int
    primary_reason_codes: List[str]
    actionable_next_steps: List[str]
    approved_loan_offer: Optional[LoanOfferRecommendation] = None
    fraud_risk_level: str = "CLEAN"  # "CLEAN", "WARNING", "HIGH_RISK"


def evaluate_underwriting_policy(
    monthly_gross: float,
    monthly_surplus: float,
    fhs_score: int,
    repayment_prob: float,
    debt_to_surplus_ratio: float,
    coverage_months: int,
    volatility_cv: float,
    fraud_report: Optional[AnomalyAuditReport] = None,
    loan_offer: Optional[LoanOfferRecommendation] = None
) -> UnderwritingDecisionResult:
    """
    Evaluates institutional lending policy criteria and returns auditable reason codes,
    incorporating fraud integrity checks and loan sizing terms.
    """
    criteria: List[PolicyCriterionResult] = []

    # Rule 1: Minimum Monthly Surplus >= INR 6,000
    r1_pass = monthly_surplus >= 6000.0
    criteria.append(PolicyCriterionResult(
        rule_id="RULE_01_SURPLUS",
        rule_name="Minimum Net Monthly Surplus",
        target_threshold=">= INR 6,000/mo",
        actual_value_formatted=f"INR {monthly_surplus:,.0f}/mo",
        is_passed=r1_pass,
        status_tag="PASSED" if r1_pass else "FAILED",
        reason_code="SURPLUS_SUFFICIENT" if r1_pass else "INSUFFICIENT_NET_CASHFLOW",
        remediation_advice="Increase daily sales or lower recurring operational costs to widen operating surplus."
    ))

    # Rule 2: Financial Health Score >= 65
    r2_pass = fhs_score >= 65
    criteria.append(PolicyCriterionResult(
        rule_id="RULE_02_FHS_THRESHOLD",
        rule_name="Composite Financial Health Score",
        target_threshold=">= 65 / 100",
        actual_value_formatted=f"{fhs_score} / 100",
        is_passed=r2_pass,
        status_tag="PASSED" if r2_pass else "FAILED",
        reason_code="FHS_THRESHOLD_MET" if r2_pass else "BELOW_FHS_BENCHMARK",
        remediation_advice="Maintain consistent weekly UPI transaction frequency and build liquid reserves."
    ))

    # Rule 3: Debt Burden <= 50% of Surplus
    r3_pass = debt_to_surplus_ratio <= 0.50
    criteria.append(PolicyCriterionResult(
        rule_id="RULE_03_DEBT_RATIO",
        rule_name="Debt Service-to-Surplus Ratio",
        target_threshold="<= 50% of surplus",
        actual_value_formatted=f"{debt_to_surplus_ratio*100:.1f}%",
        is_passed=r3_pass,
        status_tag="PASSED" if r3_pass else "FAILED",
        reason_code="DEBT_BURDEN_HEALTHY" if r3_pass else "EXCESSIVE_LEVERAGE",
        remediation_advice="Pay down existing micro-loans to release monthly debt servicing obligations."
    ))

    # Rule 4: Data Coverage >= 3 Months
    r4_pass = coverage_months >= 3
    criteria.append(PolicyCriterionResult(
        rule_id="RULE_04_COVERAGE",
        rule_name="Minimum Transaction Duration",
        target_threshold=">= 3 months continuous records",
        actual_value_formatted=f"{coverage_months} months observed",
        is_passed=r4_pass,
        status_tag="PASSED" if r4_pass else "WARNING",
        reason_code="STATEMENT_DURATION_ADEQUATE" if r4_pass else "INSUFFICIENT_HISTORY_WINDOW",
        remediation_advice="Provide at least 3 to 6 months of continuous digital transaction records."
    ))

    # Rule 5: Repayment Probability >= 60%
    r5_pass = repayment_prob >= 60.0
    criteria.append(PolicyCriterionResult(
        rule_id="RULE_05_ML_RISK",
        rule_name="Alternative Credit Model Confidence",
        target_threshold=">= 60.0% probability",
        actual_value_formatted=f"{repayment_prob:.1f}% probability",
        is_passed=r5_pass,
        status_tag="PASSED" if r5_pass else "FAILED",
        reason_code="ML_CREDIT_CONFIDENCE_MET" if r5_pass else "MODEL_HIGH_RISK_FLAG",
        remediation_advice="Stabilize day-to-day sales consistency to reduce model cashflow volatility penalties."
    ))

    # Rule 6: Fraud & Syndicate Integrity Audit
    fraud_risk_level = "CLEAN"
    r6_pass = True
    fraud_msg = "Clean - No suspicious patterns"
    fraud_remed = "Maintain clean digital cash transactions without counterparty clustering."
    
    if fraud_report is not None:
        if fraud_report.is_suspicious or fraud_report.risk_score_penalty >= 20:
            r6_pass = False
            fraud_risk_level = "HIGH_RISK"
            fraud_msg = f"Critical risk: {len(fraud_report.flags_triggered)} anomaly flags (penalty -{fraud_report.risk_score_penalty} pts)"
            fraud_remed = "Resolve circular transactions and provide verified invoices for major customer counterparties."
        elif fraud_report.risk_score_penalty > 0 or fraud_report.customer_concentration_ratio > 0.50:
            r6_pass = True  # Warning level
            fraud_risk_level = "WARNING"
            fraud_msg = f"Warning: concentration at {fraud_report.customer_concentration_ratio*100:.1f}% (penalty -{fraud_report.risk_score_penalty} pts)"
            fraud_remed = "Diversify customer payment sources to reduce counterparty concentration."

    criteria.append(PolicyCriterionResult(
        rule_id="RULE_06_FRAUD_INTEGRITY",
        rule_name="Transaction Integrity & Anti-Syndicate Audit",
        target_threshold="No critical circular flows or >60% concentration",
        actual_value_formatted=fraud_msg,
        is_passed=r6_pass,
        status_tag="PASSED" if (r6_pass and fraud_risk_level == "CLEAN") else ("WARNING" if fraud_risk_level == "WARNING" else "FAILED"),
        reason_code="INTEGRITY_VERIFIED" if r6_pass else "CRITICAL_FRAUD_OR_ANOMALY_RISK",
        remediation_advice=fraud_remed
    ))

    passed_count = sum(1 for c in criteria if c.is_passed)
    total_count = len(criteria)

    # Determine overall status with Fraud Override Guard
    if fraud_risk_level == "HIGH_RISK":
        status = "NOT_ELIGIBLE"
        label = "Declined — Critical Fraud or Anomaly Risk Flagged"
        color = "RED"
    elif passed_count == total_count:
        status = "ELIGIBLE"
        label = "Eligible for Micro-Credit Facility"
        color = "LIME"
    elif passed_count >= 4 and r1_pass:
        status = "CONDITIONAL_APPROVAL"
        label = "Conditional Approval / Manual Underwriter Review"
        color = "AMBER"
    else:
        status = "NOT_ELIGIBLE"
        label = "Eligibility Thresholds Not Met"
        color = "RED"

    # Assemble reasons and next steps
    reasons = [c.reason_code for c in criteria if not c.is_passed]
    if not reasons:
        reasons = ["ALL_POLICY_PREREQUISITES_SATISFIED"]

    next_steps = [c.remediation_advice for c in criteria if not c.is_passed]
    if not next_steps:
        next_steps = ["Proceed to review approved loan sizing offer and issue Digital Financial Passport."]

    # Sync approved loan offer according to final eligibility
    final_loan_offer = None
    if loan_offer is not None:
        if status == "NOT_ELIGIBLE":
            final_loan_offer = LoanOfferRecommendation(
                is_eligible_for_loan=False,
                max_recommended_loan_inr=0.0,
                recommended_tenure_months=0,
                max_safe_monthly_emi_inr=0.0,
                risk_adjusted_apr_percent=0.0,
                expected_total_repayment_inr=0.0,
                debt_service_burden_ratio=0.0,
                pricing_tier="INELIGIBLE",
                underwriting_notes=f"Loan offer withheld due to underwriting decline: {', '.join(reasons[:2])}"
            )
        else:
            final_loan_offer = loan_offer

    return UnderwritingDecisionResult(
        decision_status=status,
        status_label=label,
        status_badge_color=color,
        policy_version="MFI-Standard-Micro-Policy-2026.2",
        criteria_evaluated=criteria,
        passed_count=passed_count,
        total_rules_count=total_count,
        primary_reason_codes=reasons,
        actionable_next_steps=next_steps,
        approved_loan_offer=final_loan_offer,
        fraud_risk_level=fraud_risk_level
    )
