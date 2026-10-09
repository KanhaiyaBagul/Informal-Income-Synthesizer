"""
FastAPI Application Entrypoint
Explainable Alternative Credit Scoring & Informal Income Synthesizer
Modular Monolith API Gateway providing endpoints for income synthesis, FHS scoring,
XGBoost inference, SHAP explanations, Fairlearn audits, What-If simulations, and PDF passports.
"""

import os
import json
import uuid
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.app.services.transaction_service import (
    parse_transaction_csv,
    load_preset_transactions
)
from backend.app.services.income_service import (
    synthesize_income_from_transactions,
    IncomeSynthesisResult
)
from backend.app.services.financial_health_service import (
    calculate_financial_health_score,
    FHSInputFeatures,
    FHSAssessmentResult
)
from backend.app.services.credit_risk_service import (
    evaluate_credit_risk,
    CreditRiskEvaluationResult
)
from backend.app.services.decision_service import (
    evaluate_underwriting_policy,
    UnderwritingDecisionResult
)
from backend.app.services.scenario_service import (
    simulate_what_if_scenario,
    ScenarioInputDelta,
    ScenarioSimulationResult
)
from backend.app.services.passport_service import (
    generate_financial_passport_pdf
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "ml", "artifacts")

app = FastAPI(
    title="EquiScore - Explainable Alternative Credit Scoring API",
    description="Deterministic Financial Health Scoring, XGBoost Credit Risk, SHAP XAI, and Fairlearn Auditing.",
    version="1.0.0"
)

# CORS configuration for Astro frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store for assessments and temporary uploads
ASSESSMENT_STORE: Dict[str, Dict[str, Any]] = {}

class AssessmentRequest(BaseModel):
    preset_id: Optional[str] = "ramesh"
    min_ledger_balance: Optional[float] = 11500.0
    applicant_name: Optional[str] = "Ramesh Kumar"
    business_name: Optional[str] = "Shree Balaji Chai Stall"
    business_type: Optional[str] = "street_food"


class AssessmentUnifiedResponse(BaseModel):
    assessment_id: str
    applicant_name: str
    business_name: str
    business_type: str
    income_synthesis: IncomeSynthesisResult
    financial_health_score: FHSAssessmentResult
    credit_risk_ml: CreditRiskEvaluationResult
    underwriting_decision: UnderwritingDecisionResult


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "EquiScore Financial Health & XAI Engine",
        "version": "1.0.0",
        "ml_model": "Calibrated XGBoost-AltCredit-v1.0"
    }


@app.get("/api/presets")
def get_available_presets():
    return {
        "presets": [
            {
                "id": "ramesh",
                "name": "Ramesh Kumar",
                "business": "Shree Balaji Chai Stall",
                "type": "street_food",
                "description": "Daily UPI tea/snack receipts, moderate surplus, reliable recurring cashflow"
            },
            {
                "id": "priya",
                "name": "Priya Sharma",
                "business": "Swiggy & Zomato Partner",
                "type": "gig_delivery",
                "description": "Weekly platform payouts, lower operating overhead, lean reserve buffer"
            },
            {
                "id": "arun",
                "name": "Arun Verma",
                "business": "Artisan Carpentry & Woodcraft",
                "type": "artisan_freelance",
                "description": "Lumpy project disbursements, higher volatility, elevated debt-to-surplus"
            }
        ]
    }


@app.post("/api/assessments/preset", response_model=AssessmentUnifiedResponse)
def run_preset_assessment(req: AssessmentRequest):
    """
    Executes end-to-end evaluation on a pre-packaged authentic synthetic dataset.
    """
    df, meta = load_preset_transactions(req.preset_id or "ramesh")
    min_bal = req.min_ledger_balance or meta["min_balance"]
    name = req.applicant_name or meta["name"]
    biz = req.business_name or meta["business"]
    biz_type = req.business_type or meta["type"]

    return _orchestrate_assessment(df, min_bal, name, biz, biz_type)


@app.post("/api/assessments/upload", response_model=AssessmentUnifiedResponse)
async def upload_and_assess(
    file: UploadFile = File(...),
    applicant_name: str = Form("Independent Applicant"),
    business_name: str = Form("Retail Enterprise"),
    business_type: str = Form("retail_merchant"),
    min_ledger_balance: float = Form(8000.0)
):
    """
    Ingests user-uploaded statement CSV, categorizes transactions, and computes full assessment.
    """
    content = await file.read()
    try:
        df = parse_transaction_csv(content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV statement: {str(e)}")

    return _orchestrate_assessment(df, min_ledger_balance, applicant_name, business_name, business_type)


def _orchestrate_assessment(
    df,
    min_bal: float,
    applicant_name: str,
    business_name: str,
    business_type: str
) -> AssessmentUnifiedResponse:
    assessment_id = f"ASM_{uuid.uuid4().hex[:8].upper()}"

    # 1. Income Synthesis
    income_res = synthesize_income_from_transactions(df, min_ledger_balance=min_bal)

    # 2. Financial Health Score (Deterministic formula)
    fhs_inp = FHSInputFeatures(
        monthly_gross_receipts=income_res.average_monthly_gross_receipts,
        monthly_operating_expenses=income_res.average_monthly_expenses,
        monthly_debt_emi=income_res.average_monthly_debt_emi,
        income_volatility_cv=income_res.income_volatility_cv,
        min_ledger_balance=min_bal,
        data_coverage_months=income_res.data_coverage_months
    )
    fhs_res = calculate_financial_health_score(fhs_inp)

    # 3. Alternative Credit Risk ML (XGBoost + SHAP)
    ml_features = {
        "monthly_gross_receipts": income_res.average_monthly_gross_receipts,
        "monthly_operating_expenses": income_res.average_monthly_expenses,
        "net_surplus_ratio": income_res.net_surplus_ratio,
        "income_volatility_cv": income_res.income_volatility_cv,
        "debt_to_surplus_ratio": (income_res.average_monthly_debt_emi / max(1.0, income_res.average_monthly_net_surplus)),
        "reserve_buffer_days": (min_bal / max(100.0, income_res.average_monthly_expenses / 30.0)),
        "tx_frequency_monthly": int(income_res.total_tx_count / max(1, income_res.data_coverage_months)),
        "data_coverage_months": income_res.data_coverage_months
    }
    risk_res = evaluate_credit_risk(ml_features)

    # 4. Underwriting Decision Criteria
    debt_ratio = ml_features["debt_to_surplus_ratio"]
    decision_res = evaluate_underwriting_policy(
        monthly_gross=income_res.average_monthly_gross_receipts,
        monthly_surplus=income_res.average_monthly_net_surplus,
        fhs_score=fhs_res.overall_score,
        repayment_prob=risk_res.repayment_probability_percent,
        debt_to_surplus_ratio=debt_ratio,
        coverage_months=income_res.data_coverage_months,
        volatility_cv=income_res.income_volatility_cv
    )

    response_payload = AssessmentUnifiedResponse(
        assessment_id=assessment_id,
        applicant_name=applicant_name,
        business_name=business_name,
        business_type=business_type,
        income_synthesis=income_res,
        financial_health_score=fhs_res,
        credit_risk_ml=risk_res,
        underwriting_decision=decision_res
    )

    # Persist in session store
    ASSESSMENT_STORE[assessment_id] = response_payload.dict()
    return response_payload


@app.get("/api/assessments/{assessment_id}")
def get_assessment(assessment_id: str):
    if assessment_id not in ASSESSMENT_STORE:
        raise HTTPException(status_code=404, detail="Assessment not found.")
    return ASSESSMENT_STORE[assessment_id]


@app.post("/api/scenarios", response_model=ScenarioSimulationResult)
def run_scenario_simulation(delta: ScenarioInputDelta):
    """
    Evaluates isolated What-If scenario without mutating baseline record.
    """
    return simulate_what_if_scenario(delta)


@app.get("/api/fairness/audits")
def get_fairness_audit():
    """
    Retrieves Fairlearn model disparity audit report.
    """
    report_file = os.path.join(ARTIFACTS_DIR, "fairness_audit_report.json")
    if not os.path.exists(report_file):
        raise HTTPException(status_code=404, detail="Fairness audit report not found.")
    with open(report_file, "r") as f:
        return json.load(f)


@app.get("/api/reports/{assessment_id}/download")
def download_digital_passport(assessment_id: str):
    """
    Generates and downloads the authorized Digital Financial Passport PDF.
    """
    if assessment_id not in ASSESSMENT_STORE:
        # If not in store, generate default for Ramesh
        df, meta = load_preset_transactions("ramesh")
        default_res = _orchestrate_assessment(df, meta["min_balance"], meta["name"], meta["business"], meta["type"])
        data = default_res.dict()
    else:
        data = ASSESSMENT_STORE[assessment_id]

    top_shap = [
        (a["feature_label"], a["shap_value"])
        for a in data["credit_risk_ml"]["attributions"][:4]
    ]

    pdf_bytes = generate_financial_passport_pdf(
        applicant_name=data["applicant_name"],
        business_name=data["business_name"],
        business_type=data["business_type"],
        fhs_score=data["financial_health_score"]["overall_score"],
        health_band=data["financial_health_score"]["health_band"],
        monthly_gross=data["income_synthesis"]["average_monthly_gross_receipts"],
        monthly_expenses=data["income_synthesis"]["average_monthly_expenses"],
        monthly_surplus=data["income_synthesis"]["average_monthly_net_surplus"],
        volatility_cv=data["income_synthesis"]["income_volatility_cv"],
        repayment_prob=data["credit_risk_ml"]["repayment_probability_percent"],
        risk_tier=data["credit_risk_ml"]["risk_tier"],
        decision_status=data["underwriting_decision"]["decision_status"],
        top_strengths=data["financial_health_score"]["strengths"],
        top_shap_factors=top_shap,
        coverage_months=data["income_synthesis"]["data_coverage_months"]
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=Digital_Financial_Passport_{data['applicant_name'].replace(' ', '_')}.pdf"
        }
    )
