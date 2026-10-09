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
    Supports flexible column names, aliases, and direction values.
    """
    df = pd.read_csv(io.BytesIO(file_bytes))
    
    # Normalize column names: lowercase, strip, replace spaces/underscores
    col_map = {}
    for col in df.columns:
        norm = str(col).strip().lower().replace(" ", "_").replace("-", "_")
        col_map[norm] = col

    def find_matching_col(aliases: List[str]) -> Optional[str]:
        # 1. Exact match
        for a in aliases:
            if a in col_map:
                return col_map[a]
        # 2. Substring match (e.g., "amount" in "amount_(inr)")
        for norm_col, orig_col in col_map.items():
            for a in aliases:
                if a in norm_col:
                    return orig_col
        return None

    # Date column detection
    date_aliases = ["date", "txn_date", "transaction_date", "value_date", "posting_date", "time", "timestamp"]
    matched_date = find_matching_col(date_aliases)

    # Amount column detection
    amount_aliases = ["amount", "txn_amount", "transaction_amount", "value", "inr", "sum", "total"]
    matched_amount = find_matching_col(amount_aliases)

    # Direction column detection
    direction_aliases = ["direction", "type", "txn_type", "cr_dr", "cr/dr", "credit_debit", "flow", "action"]
    matched_direction = find_matching_col(direction_aliases)

    # Check minimum required: date and amount
    if not matched_date or not matched_amount:
        raise ValueError(
            f"Uploaded CSV must contain date and amount columns. Found: {list(df.columns)}. "
            "Accepted date headers: date, txn_date, transaction_date. Accepted amount headers: amount, txn_amount, value."
        )

    # Category and description detection
    category_aliases = ["category", "tag", "purpose", "txn_category", "remarks"]
    matched_category = find_matching_col(category_aliases)

    desc_aliases = ["description", "narration", "memo", "details", "note", "remarks"]
    matched_desc = find_matching_col(desc_aliases)

    id_aliases = ["txn_id", "id", "transaction_id", "reference", "ref_no", "utr", "order_id"]
    matched_id = find_matching_col(id_aliases)

    df = df.reset_index(drop=True)

    # Build normalized DataFrame
    norm_df = pd.DataFrame(index=df.index)
    norm_df["date"] = pd.to_datetime(df[matched_date], errors="coerce", format="mixed").dt.strftime("%Y-%m-%d")
    
    # Safe amount conversion
    import re
    def _clean_amt(val: Any) -> float:
        try:
            s = str(val).strip()
            cleaned = re.sub(r"[^\d.-]", "", s)
            return float(cleaned) if cleaned else 0.0
        except Exception:
            return 0.0

    raw_amount = df[matched_amount].apply(_clean_amt)

    # Handle direction
    if matched_direction:
        raw_dir = df[matched_direction].astype(str).str.upper().str.strip()
        # Normalize credit vs debit
        norm_dir = raw_dir.apply(
            lambda x: "CREDIT" if any(k in x for k in ["CR", "CREDIT", "DEP", "IN", "+", "RECEIVED"])
            else ("DEBIT" if any(k in x for k in ["DR", "DEBIT", "WDL", "OUT", "-", "PAID", "SPENT"])
            else "CREDIT")
        )
        norm_df["amount"] = raw_amount.abs()
        norm_df["direction"] = norm_dir
    else:
        # Infer direction from sign of amount if negative
        norm_df["direction"] = raw_amount.apply(lambda x: "DEBIT" if x < 0 else "CREDIT")
        norm_df["amount"] = raw_amount.abs()

    # Category
    if matched_category:
        norm_df["category"] = df[matched_category].astype(str).str.strip().str.upper()
    else:
        norm_df["category"] = "GENERAL"

    # Description
    if matched_desc:
        norm_df["description"] = df[matched_desc].astype(str).str.strip()
    else:
        norm_df["description"] = "Statement Transaction"

    # Counterparty / Payer detection
    counterparty_aliases = ["counterparty", "payer", "payee", "beneficiary", "sender", "receiver", "party", "customer"]
    matched_counterparty = find_matching_col(counterparty_aliases)
    if matched_counterparty:
        norm_df["counterparty"] = df[matched_counterparty].astype(str).str.strip()
    else:
        norm_df["counterparty"] = "Third_Party"

    # Txn ID
    if matched_id:
        norm_df["txn_id"] = df[matched_id].astype(str)
    else:
        norm_df["txn_id"] = [f"TXN_{i+1:05d}" for i in range(len(df))]

    # Drop invalid dates and zero amounts
    norm_df = norm_df.dropna(subset=["date"])
    norm_df = norm_df[norm_df["amount"] > 0]
    norm_df = norm_df.drop_duplicates(subset=["txn_id"]).reset_index(drop=True)

    if len(norm_df) == 0:
        raise ValueError("Uploaded CSV contains no valid transaction rows after normalization.")

    return norm_df

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
