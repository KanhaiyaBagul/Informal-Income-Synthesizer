"""
Unit Test for Component 9: Multilingual Adverse Action Notice Generator (adverse_action_service.py)
Tests letter generation across English, Hindi, and Marathi.
"""

import sys
import os

HACK_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if HACK_DIR not in sys.path:
    sys.path.insert(0, HACK_DIR)

from backend.app.services.adverse_action_service import generate_adverse_action_notice, AdverseActionNotice


def test_english_letter_generation():
    shap_factors = [
        {"feature_name": "income_volatility_cv", "shap_value": 0.42, "direction": "INCREASES_RISK"},
        {"feature_name": "debt_to_surplus_ratio", "shap_value": 0.31, "direction": "INCREASES_RISK"},
        {"feature_name": "net_surplus_ratio", "shap_value": -0.15, "direction": "REDUCES_RISK"}
    ]
    reasons = ["INSUFFICIENT_NET_CASHFLOW", "EXCESSIVE_LEVERAGE"]
    steps = [
        "Increase daily sales or lower recurring operational costs.",
        "Pay down existing micro-loans to release monthly debt servicing obligations."
    ]

    notice = generate_adverse_action_notice(
        applicant_name="Arun Verma",
        business_name="Artisan Carpentry",
        decision_status="CONDITIONAL_APPROVAL",
        fhs_score=58,
        repayment_prob_percent=59.4,
        monthly_gross=32297.0,
        monthly_surplus=10228.0,
        shap_factors=shap_factors,
        reason_codes=reasons,
        actionable_steps=steps,
        language="en"
    )

    print("EN Notice ID:", notice.notice_id)
    assert notice.language == "en"
    assert "Arun Verma" in notice.full_letter_text
    assert "32,297" in notice.full_letter_text
    assert "10,228" in notice.full_letter_text
    assert "58/100" in notice.full_letter_text
    assert len(notice.key_negative_drivers) >= 2
    assert "volatility" in notice.key_negative_drivers[0].lower()
    print("PASS: test_english_letter_generation")


def test_hindi_letter_generation():
    shap_factors = [
        {"feature_name": "income_volatility_cv", "shap_value": 0.42, "direction": "INCREASES_RISK"},
        {"feature_name": "reserve_buffer_days", "shap_value": 0.28, "direction": "INCREASES_RISK"}
    ]
    reasons = ["BELOW_FHS_BENCHMARK"]
    steps = ["दैनिक डिजिटल लेन-देन बनाए रखें।"]

    notice = generate_adverse_action_notice(
        applicant_name="रमेश कुमार",
        business_name="रमेश चाय कार्नर",
        decision_status="NOT_ELIGIBLE",
        fhs_score=52,
        repayment_prob_percent=54.2,
        monthly_gross=45000.0,
        monthly_surplus=5500.0,
        shap_factors=shap_factors,
        reason_codes=reasons,
        actionable_steps=steps,
        language="hi"
    )

    print("HI Notice ID:", notice.notice_id)
    assert notice.language == "hi"
    assert notice.language_display_name == "हिंदी (Hindi)"
    assert "रमेश कुमार" in notice.full_letter_text
    assert "45,000" in notice.full_letter_text
    assert "52 / 100" in notice.full_letter_text or "52/100" in notice.full_letter_text
    assert any("उतार-चढ़ाव" in d for d in notice.key_negative_drivers)
    print("PASS: test_hindi_letter_generation")


def test_marathi_letter_generation():
    shap_factors = [
        {"feature_name": "debt_to_surplus_ratio", "shap_value": 0.35, "direction": "INCREASES_RISK"}
    ]
    reasons = ["EXCESSIVE_LEVERAGE"]
    steps = ["कर्जाचे हप्ते कमी करा."]

    notice = generate_adverse_action_notice(
        applicant_name="प्रिया कांबळे",
        business_name="प्रिया लॉजिस्टिक्स",
        decision_status="NOT_ELIGIBLE",
        fhs_score=61,
        repayment_prob_percent=58.1,
        monthly_gross=28000.0,
        monthly_surplus=7000.0,
        shap_factors=shap_factors,
        reason_codes=reasons,
        actionable_steps=steps,
        language="mr"
    )

    print("MR Notice ID:", notice.notice_id)
    assert notice.language == "mr"
    assert notice.language_display_name == "मराठी (Marathi)"
    assert "प्रिया कांबळे" in notice.full_letter_text
    assert "28,000" in notice.full_letter_text
    assert any("कर्ज" in d for d in notice.key_negative_drivers)
    print("PASS: test_marathi_letter_generation")


if __name__ == "__main__":
    test_english_letter_generation()
    test_hindi_letter_generation()
    test_marathi_letter_generation()
    print("\nALL COMPONENT 9 TESTS PASSED SUCCESSFULLY!")
