"""
Transaction Service
Handles parsing, schema validation, normalization, and preset loading for financial transaction data.
Supports pre-configured presets: 'ramesh' (street vendor), 'priya' (gig delivery), 'arun' (freelancer).
"""

import os
import io
import pandas as pd
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")

PRESET_FILES = {
    "ramesh": {
        "file": "sample_street_vendor_ramesh.csv",
        "name": "Ramesh Kumar",
        "business": "Shree Balaji Chai Stall",
        "type": "street_food",
        "min_balance": 11500.0
    },
    "priya": {
        "file": "sample_gig_delivery_priya.csv",
        "name": "Priya Sharma",
        "business": "Swiggy & Zomato Partner",
        "type": "gig_delivery",
        "min_balance": 6400.0
    },
    "arun": {
        "file": "sample_volatile_freelancer_arun.csv",
        "name": "Arun Verma",
        "business": "Artisan Carpentry & Woodcraft",
        "type": "artisan_freelance",
        "min_balance": 3200.0
    }
}

class TransactionRecord(BaseModel):
    txn_id: str
    date: str
    direction: str
    amount: float
    category: str
    description: str
    counterparty: str

def parse_transaction_csv(file_bytes: bytes) -> pd.DataFrame:
    """
    Parses CSV bytes into a clean, normalized transactions DataFrame.
    """
    df = pd.read_csv(io.BytesIO(file_bytes))
    
    # Required columns check
    required_cols = {"date", "amount", "direction"}
    if not required_cols.issubset(set(df.columns)):
        raise ValueError(f"Uploaded CSV must contain columns: {required_cols}. Found: {list(df.columns)}")

    df["date"] = pd.to_datetime(df["date"]).dt.strftime("%Y-%m-%d")
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0.0)
    df["direction"] = df["direction"].astype(str).str.upper()

    if "category" not in df.columns:
        df["category"] = "GENERAL"
    if "description" not in df.columns:
        df["description"] = "Transaction record"
    if "counterparty" not in df.columns:
        df["counterparty"] = "Third_Party"
    if "txn_id" not in df.columns:
        df["txn_id"] = [f"TXN_{i+1:05d}" for i in range(len(df))]

    # Deduplicate by txn_id if present
    df = df.drop_duplicates(subset=["txn_id"]).reset_index(drop=True)
    return df

def load_preset_transactions(preset_id: str) -> tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Loads pre-packaged authentic synthetic transactions for instant demonstration.
    """
    preset_key = preset_id.lower().strip()
    if preset_key not in PRESET_FILES:
        preset_key = "ramesh"

    meta = PRESET_FILES[preset_key]
    csv_path = os.path.join(DATA_DIR, meta["file"])
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Preset file not found: {csv_path}")

    df = pd.read_csv(csv_path)
    return df, meta
