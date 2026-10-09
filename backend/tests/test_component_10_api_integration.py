"""
Integration Test for Component 10: Unified API Orchestrator (backend/main.py)
Tests end-to-end evaluation, loan sizing sync, fraud audit sync, batch processing, and multilingual letter endpoints.
"""

import sys
import os
import io

HACK_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if HACK_DIR not in sys.path:
    sys.path.insert(0, HACK_DIR)

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

DATA_DIR = os.path.join(HACK_DIR, "backend", "data")
RAMESH_CSV = os.path.join(DATA_DIR, "sample_street_vendor_ramesh.csv")
ARUN_CSV = os.path.join(DATA_DIR, "sample_volatile_freelancer_arun.csv")
PRIYA_CSV = os.path.join(DATA_DIR, "sample_gig_delivery_priya.csv")


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"
    print("PASS: test_health")


def test_preset_ramesh():
    res = client.post("/api/assessments/preset", json={"preset_id": "ramesh"})
    assert res.status_code == 200
    data = res.json()
    assert data["applicant_name"] == "Ramesh Kumar"
    assert "loan_sizing" in data
    assert data["loan_sizing"]["is_eligible_for_loan"] is True
    assert data["loan_sizing"]["max_recommended_loan_inr"] > 0
    assert "fraud_audit" in data
    assert data["fraud_audit"]["is_suspicious"] is False
    assert data["underwriting_decision"]["decision_status"] == "ELIGIBLE"
    assert data["underwriting_decision"]["approved_loan_offer"] is not None
    print(f"PASS: test_preset_ramesh -> Loan Max: INR {data['loan_sizing']['max_recommended_loan_inr']:,.0f}")


def test_upload_arun():
    with open(ARUN_CSV, "rb") as f:
        file_bytes = f.read()
    
    res = client.post(
        "/api/assessments/upload",
        files={"file": ("sample_volatile_freelancer_arun.csv", file_bytes, "text/csv")},
        data={
            "applicant_name": "Arun Verma",
            "business_name": "Artisan Carpentry",
            "business_type": "artisan_freelance",
            "min_ledger_balance": 4500.0
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert data["applicant_name"] == "Arun Verma"
    assert data["income_synthesis"]["average_monthly_gross_receipts"] > 25000.0
    assert "loan_sizing" in data
    assert "fraud_audit" in data
    print(f"PASS: test_upload_arun -> FHS: {data['financial_health_score']['overall_score']}, Decision: {data['underwriting_decision']['decision_status']}")


def test_batch_processing():
    with open(RAMESH_CSV, "rb") as f1, open(PRIYA_CSV, "rb") as f2:
        b1 = f1.read()
        b2 = f2.read()
    
    files = [
        ("files", ("ramesh_vendor.csv", b1, "text/csv")),
        ("files", ("priya_delivery.csv", b2, "text/csv"))
    ]
    res = client.post("/api/assessments/batch", files=files)
    assert res.status_code == 200
    batch_data = res.json()
    assert batch_data["total_processed"] == 2
    assert len(batch_data["results"]) == 2
    assert batch_data["total_credit_extended_inr"] > 0
    print(f"PASS: test_batch_processing -> Processed {batch_data['total_processed']} applicants, Total credit: INR {batch_data['total_credit_extended_inr']:,.0f}")


def test_multilingual_letters():
    # Hindi via GET query
    res_hi = client.get("/api/decisions/ramesh/letter?language=hi")
    assert res_hi.status_code == 200
    hi_data = res_hi.json()
    assert hi_data["language"] == "hi"
    assert "हिंदी" in hi_data["language_display_name"]
    assert "सत्यापित वित्तीय आंकड़े" in hi_data["full_letter_text"]

    # Marathi via POST body
    res_mr = client.post("/api/decisions/ramesh/letter", json={"language": "mr", "tone": "borrower"})
    assert res_mr.status_code == 200
    mr_data = res_mr.json()
    assert mr_data["language"] == "mr"
    assert "मराठी" in mr_data["language_display_name"]
    assert "सत्यापित आर्थिक आकडेवारी" in mr_data["full_letter_text"]

    print("PASS: test_multilingual_letters")


if __name__ == "__main__":
    test_health()
    test_preset_ramesh()
    test_upload_arun()
    test_batch_processing()
    test_multilingual_letters()
    print("\nALL COMPONENT 10 TESTS PASSED SUCCESSFULLY!")
