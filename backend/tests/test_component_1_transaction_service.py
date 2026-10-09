"""
Unit Test for Component 1: Transaction Ingestion & Direction Normalization
Verifies dynamic alias matching, amount cleaning, direction normalization, and counterparty preservation.
"""

import os
import sys
import pandas as pd

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.services.transaction_service import (
    parse_transaction_csv,
    load_preset_transactions
)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

def test_preset_arun_ingestion():
    df, meta = load_preset_transactions("arun")
    assert len(df) == 319, f"Expected 319 rows for Arun, got {len(df)}"
    assert "date" in df.columns
    assert "amount" in df.columns
    assert "direction" in df.columns
    assert "counterparty" in df.columns
    assert meta["name"] == "Arun Verma"

def test_preset_ramesh_ingestion():
    df, meta = load_preset_transactions("ramesh")
    assert len(df) == 1357, f"Expected 1357 rows for Ramesh, got {len(df)}"
    assert meta["name"] == "Ramesh Kumar"

def test_preset_priya_ingestion():
    df, meta = load_preset_transactions("priya")
    assert len(df) == 749, f"Expected 749 rows for Priya, got {len(df)}"
    assert meta["name"] == "Priya Sharma"

def test_dirty_csv_bytes_normalization():
    dirty_csv = (
        'Txn Date,Amount (INR),Dr/Cr Type,Payer Name,Remarks\n'
        '2026-06-01,"1,500.50",cr,Customer_ABC,Store Sale\n'
        '2026-06-02,"- 450.00",dr,Vendor_XYZ,Inventory Purchase\n'
        '2026-06-03,"3,200.00",CR,Customer_DEF,Catering Deposit\n'
        '2026-06-04,"1,200.00",DR,Bank_EMI,Loan Auto-Debit\n'
    ).encode("utf-8")

    norm_df = parse_transaction_csv(dirty_csv)
    assert len(norm_df) == 4
    assert list(norm_df["direction"]) == ["CREDIT", "DEBIT", "CREDIT", "DEBIT"]
    assert norm_df.loc[0, "amount"] == 1500.50
    assert norm_df.loc[1, "amount"] == 450.00
    assert norm_df.loc[0, "counterparty"] == "Customer_ABC"
    assert norm_df.loc[1, "counterparty"] == "Vendor_XYZ"
    print("Component 1 Dirty CSV Test Passed!")

if __name__ == "__main__":
    test_preset_arun_ingestion()
    test_preset_ramesh_ingestion()
    test_preset_priya_ingestion()
    test_dirty_csv_bytes_normalization()
    print("ALL COMPONENT 1 TESTS PASSED PERFECTLY!")
