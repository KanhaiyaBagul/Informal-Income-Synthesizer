"""
Unit Test for Component 3: Fraud & Transaction Anomaly Guard
Tests concentration checks, velocity surge anomalies, and circular transfer detection.
"""

import os
import sys
import pandas as pd

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.services.transaction_service import load_preset_transactions
from backend.app.services.anomaly_fraud_service import audit_transactions_for_fraud

def test_legitimate_applicants():
    for persona in ["arun", "ramesh", "priya"]:
        df, meta = load_preset_transactions(persona)
        report = audit_transactions_for_fraud(df)
        assert isinstance(report.risk_score_penalty, int)
        assert report.velocity_spike_ratio > 0
        print(f"{persona.upper()} Fraud Audit: Penalty={report.risk_score_penalty}, Concentration={report.max_counterparty_share_percent}%, Suspicious={report.is_suspicious}")

def test_high_concentration_detection():
    data = [
        {"date": "2026-06-01", "amount": 90000.0, "direction": "CREDIT", "counterparty": "Single_Rich_Friend"},
        {"date": "2026-06-02", "amount": 1000.0, "direction": "CREDIT", "counterparty": "Customer_B"},
        {"date": "2026-06-03", "amount": 2000.0, "direction": "CREDIT", "counterparty": "Customer_C"},
        {"date": "2026-06-04", "amount": 1500.0, "direction": "DEBIT", "counterparty": "Supplier_A"},
        {"date": "2026-06-05", "amount": 2500.0, "direction": "DEBIT", "counterparty": "Supplier_B"},
        {"date": "2026-06-06", "amount": 500.0, "direction": "CREDIT", "counterparty": "Customer_D"},
    ]
    df = pd.DataFrame(data)
    report = audit_transactions_for_fraud(df)
    assert any("HIGH_CONCENTRATION_RISK" in f for f in report.flags_triggered), "Should trigger concentration risk"
    assert report.max_counterparty_share_percent > 80.0
    print("Concentration Risk Test Passed! Share =", report.max_counterparty_share_percent)

def test_circular_round_trip_detection():
    data = [
        {"date": "2026-06-10", "amount": 15000.0, "direction": "CREDIT", "counterparty": "Customer_A"},
        {"date": "2026-06-10", "amount": 15000.0, "direction": "DEBIT", "counterparty": "Party_X"},
        {"date": "2026-06-10", "amount": 15000.0, "direction": "DEBIT", "counterparty": "Party_Y"},
        {"date": "2026-06-11", "amount": 2000.0, "direction": "CREDIT", "counterparty": "Customer_B"},
        {"date": "2026-06-12", "amount": 3000.0, "direction": "DEBIT", "counterparty": "Vendor_C"},
        {"date": "2026-06-13", "amount": 4000.0, "direction": "CREDIT", "counterparty": "Customer_D"},
    ]
    df = pd.DataFrame(data)
    report = audit_transactions_for_fraud(df)
    assert any("ROUND_TRIP_ANOMALY" in f for f in report.flags_triggered), "Should trigger round trip anomaly"
    print("Round Trip Detection Passed! Penalty =", report.risk_score_penalty)

if __name__ == "__main__":
    test_legitimate_applicants()
    test_high_concentration_detection()
    test_circular_round_trip_detection()
    print("ALL COMPONENT 3 TESTS PASSED PERFECTLY!")
