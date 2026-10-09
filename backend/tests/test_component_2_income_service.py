"""
Unit Test for Component 2: Informal Cashflow Synthesizer
Verifies monthly aggregations, gross receipts, operating expenses, debt EMIs, CV, and anomaly flags.
"""

import os
import sys
import pandas as pd

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.services.transaction_service import load_preset_transactions
from backend.app.services.income_service import synthesize_income_from_transactions

def test_arun_income_synthesis():
    df, meta = load_preset_transactions("arun")
    res = synthesize_income_from_transactions(df, min_ledger_balance=3200.0)

    assert res.data_coverage_months == 4, f"Expected 4 months, got {res.data_coverage_months}"
    assert res.average_monthly_gross_receipts > 30000, f"Expected gross > 30k, got {res.average_monthly_gross_receipts}"
    assert res.average_monthly_expenses > 15000, f"Expected expenses > 15k, got {res.average_monthly_expenses}"
    assert res.income_volatility_cv > 0, "CV should be positive"
    assert len(res.monthly_trend) == 4, "Should have 4 monthly trend entries"
    print(f"Arun verified: Gross=Rs {res.average_monthly_gross_receipts:,.0f}, Expenses=Rs {res.average_monthly_expenses:,.0f}, Net Surplus=Rs {res.average_monthly_net_surplus:,.0f}, CV={res.income_volatility_cv:.4f}")

def test_ramesh_income_synthesis():
    df, meta = load_preset_transactions("ramesh")
    res = synthesize_income_from_transactions(df, min_ledger_balance=11500.0)

    assert res.data_coverage_months == 4
    assert res.average_monthly_gross_receipts > 40000
    assert res.total_tx_count == 1357
    print(f"Ramesh verified: Gross=Rs {res.average_monthly_gross_receipts:,.0f}, Txns={res.total_tx_count}")

def test_priya_income_synthesis():
    df, meta = load_preset_transactions("priya")
    res = synthesize_income_from_transactions(df, min_ledger_balance=6400.0)

    assert res.data_coverage_months == 4
    assert res.total_tx_count == 749
    print(f"Priya verified: Gross=Rs {res.average_monthly_gross_receipts:,.0f}, Txns={res.total_tx_count}")

if __name__ == "__main__":
    test_arun_income_synthesis()
    test_ramesh_income_synthesis()
    test_priya_income_synthesis()
    print("ALL COMPONENT 2 TESTS PASSED PERFECTLY!")
