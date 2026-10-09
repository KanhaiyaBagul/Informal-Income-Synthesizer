"""
Multilingual Adverse Action Notice & Credit Disclosure Service
Generates formal, transparent, and auditable adverse action and credit assessment letters
in English, Hindi (हिंदी), and Marathi (मराठी) based strictly on deterministic policy criteria,
FHS scores, and TreeSHAP attribution drivers.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid
import os
from pydantic import BaseModel

class AdverseActionNotice(BaseModel):
    notice_id: str
    language: str  # "en", "hi", "mr"
    language_display_name: str
    date_issued: str
    applicant_name: str
    business_name: str
    decision_status: str
    verdict_summary: str
    fhs_score: int
    repayment_probability_percent: float
    key_negative_drivers: List[str]
    actionable_remediation: List[str]
    full_letter_text: str
    regulatory_disclaimer: str


DRIVER_TRANSLATIONS = {
    "income_volatility_cv": {
        "en": "High month-to-month cashflow volatility and fluctuating receipts",
        "hi": "महीने-दर-महीने नकदी प्रवाह में अत्यधिक उतार-चढ़ाव (High Volatility)",
        "mr": "दरमहा रोख प्रवाहात जास्त चढ-उतार (High Cashflow Volatility)"
    },
    "debt_to_surplus_ratio": {
        "en": "Elevated debt servicing obligations relative to operating surplus",
        "hi": "मासिक शुद्ध अधिशेष की तुलना में अत्यधिक ऋण किस्तें (Debt Burden)",
        "mr": "मासिक शिल्लकीच्या तुलनेत कर्जाचे हप्ते जास्त असणे (Debt Burden)"
    },
    "monthly_operating_expenses": {
        "en": "Operating expenses consuming a high fraction of gross turnover",
        "hi": "कुल आय की तुलना में परिचालन व्यय का उच्च अनुपात (High Expenses)",
        "mr": "एकूण उत्पन्नाच्या तुलनेत व्यवसायाचा खर्च जास्त असणे (High Expenses)"
    },
    "net_surplus_ratio": {
        "en": "Constrained operating profit margin after vendor disbursements",
        "hi": "व्यावसायिक भुगतानों के बाद कम शुद्ध लाभ मार्जिन (Low Margin)",
        "mr": "सर्व खर्च वजा जाता शिल्लक नफा कमी असणे (Low Net Margin)"
    },
    "reserve_buffer_days": {
        "en": "Low minimum daily ledger balance and limited liquidity cushion",
        "hi": "कम न्यूनतम बैंक शेष और सीमित आपातकालीन तरलता (Low Liquidity Buffer)",
        "mr": "खात्यात कमी किमान शिल्लक आणि आपत्कालीन निधीचा अभाव (Low Liquidity)"
    },
    "tx_frequency_monthly": {
        "en": "Infrequent digital transaction history across observation period",
        "hi": "अवलोकन अवधि के दौरान डिजिटल यूपीआई लेन-देन की कम संख्या",
        "mr": "निरीक्षण कालावधीत डिजिटल व्यवहारांची संख्या कमी असणे"
    },
    "data_coverage_months": {
        "en": "Short observed statement history window",
        "hi": "विवरण इतिहास की छोटी अवलोकन अवधि (कम से कम 3-6 महीने आवश्यक)",
        "mr": "बँक विवरणाचा कालावधी कमी असणे (किमान ३-६ महिने आवश्यक)"
    }
}


def _translate_feature(feature_name: str, lang: str) -> str:
    clean_name = feature_name.lower().strip()
    if clean_name in DRIVER_TRANSLATIONS:
        return DRIVER_TRANSLATIONS[clean_name].get(lang, DRIVER_TRANSLATIONS[clean_name]["en"])
    return feature_name.replace("_", " ").title()


def generate_adverse_action_notice(
    applicant_name: str,
    business_name: str,
    decision_status: str,
    fhs_score: int,
    repayment_prob_percent: float,
    monthly_gross: float,
    monthly_surplus: float,
    shap_factors: List[Dict[str, Any]],
    reason_codes: List[str],
    actionable_steps: List[str],
    language: str = "en",
    tone: str = "borrower"
) -> AdverseActionNotice:
    """
    Builds an explainable and auditable credit notice in English, Hindi, or Marathi.
    Uses strictly grounded facts without external hallucination.
    """
    notice_id = f"AAN_{uuid.uuid4().hex[:8].upper()}"
    date_str = datetime.now().strftime("%d %B %Y")
    lang = language.lower() if language.lower() in ["en", "hi", "mr"] else "en"

    # Extract top negative SHAP factors (those with negative impact or highest contribution to risk)
    negative_drivers = []
    for factor in shap_factors:
        impact = str(factor.get("direction", "")).upper()
        weight = float(factor.get("shap_value", 0.0))
        # In risk modeling, either positive shap value (increases risk) or negative impact label
        if "INCREASES_RISK" in impact or weight > 0.05 or "NEGATIVE" in impact:
            feat_name = factor.get("feature_name", factor.get("feature", "unknown"))
            translated_desc = _translate_feature(feat_name, lang)
            negative_drivers.append(translated_desc)
    
    if not negative_drivers:
        # Fallback to reason codes
        for code in reason_codes:
            if code != "ALL_POLICY_PREREQUISITES_SATISFIED":
                negative_drivers.append(code.replace("_", " ").title())
    
    if not negative_drivers:
        negative_drivers = ["General policy threshold requirements"] if lang == "en" else [
            "सामान्य नीति मानदंड आवश्यकताएं" if lang == "hi" else "सामान्य धोरण निकष आवश्यकता"
        ]

    # Map Language Display
    display_names = {"en": "English", "hi": "हिंदी (Hindi)", "mr": "मराठी (Marathi)"}
    lang_name = display_names.get(lang, "English")

    if lang == "hi":
        status_label = "अपात्र / सशर्त समीक्षा" if decision_status != "ELIGIBLE" else "ऋण सुविधा हेतु पात्र"
        verdict = (
            f"आपके आवेदन की समीक्षा EquiScore वैकल्पिक क्रेडिट मूल्यांकन प्रणाली द्वारा की गई। "
            f"वर्तमान वित्तीय स्वास्थ्य स्कोर {fhs_score}/100 और अनुमानित पुनर्भुगतान संभावना {repayment_prob_percent:.1f}% प्राप्त हुई।"
        )
        disclaimer = (
            "यह सूचना भारतीय रिज़र्व बैंक (RBI) डिजिटल लेंडिंग दिशानिर्देशों के अनुरूप पूर्ण पारदर्शिता के लिए उत्पन्न की गई है। "
            "यह आधिकारिक क्रेडिट ब्यूरो रिपोर्ट (CIBIL/Experian) नहीं है, बल्कि वास्तविक नकदी प्रवाह आधारित व्याख्यात्मक मूल्यांकन है।"
        )
        letter_lines = [
            f"सूचना संदर्भ: {notice_id}",
            f"दिनांक: {date_str}",
            f"प्राप्तकर्ता: {applicant_name} ({business_name})",
            "",
            f"विषय: सूक्ष्म-ऋण पात्रता निर्णय एवं पारदर्शी व्याख्यात्मक विवरण",
            "",
            f"प्रिय {applicant_name},",
            "",
            verdict,
            "",
            "निर्णय को प्रभावित करने वाले मुख्य वित्तीय कारक (Key Risk Drivers):",
        ]
        for i, d in enumerate(negative_drivers[:3], 1):
            letter_lines.append(f"  {i}. {d}")
        letter_lines.append("")
        letter_lines.append("वित्तीय स्वास्थ्य में सुधार हेतु अनुशंसित कदम (Actionable Remediation):")
        for i, s in enumerate(actionable_steps[:3], 1):
            letter_lines.append(f"  {i}. {s}")
        letter_lines.append("")
        letter_lines.append("सत्यापित वित्तीय आंकड़े:")
        letter_lines.append(f"  • औसत मासिक कुल आय (Gross Receipts): INR {monthly_gross:,.0f}")
        letter_lines.append(f"  • औसत मासिक शुद्ध अधिशेष (Net Surplus): INR {monthly_surplus:,.0f}")
        letter_lines.append(f"  • वित्तीय स्वास्थ्य समग्र स्कोर (FHS): {fhs_score} / 100")
        letter_lines.append("")
        letter_lines.append("EquiScore XAI क्रेडिट अंडरराइटिंग इंजन")
        full_text = "\n".join(letter_lines)

    elif lang == "mr":
        status_label = "अपात्र / सशर्त पुनरावलोकन" if decision_status != "ELIGIBLE" else "सूक्ष्म कर्जासाठी पात्र"
        verdict = (
            f"आपल्या अर्जाचे परीक्षण EquiScore पर्यायी क्रेडिट मूल्यांकन प्रणालीद्वारे करण्यात आले. "
            f"सध्याचा आर्थिक आरोग्य गुण {fhs_score}/100 आणि परतफेड संभाव्यता {repayment_prob_percent:.1f}% नोंदवली गेली आहे."
        )
        disclaimer = (
            "ही सूचना रिझर्व्ह बँक ऑफ इंडिया (RBI) डिजिटल कर्ज मार्गदर्शक तत्त्वांचे पालन करून पारदर्शकतेसाठी तयार केली आहे. "
            "हा अधिकृत ब्युरो अहवाल नसून रोख प्रवाह डेटावर आधारित पारदर्शक मूल्यांकन आहे."
        )
        letter_lines = [
            f"सूचना संदर्भ: {notice_id}",
            f"दिनांक: {date_str}",
            f"अर्जदार: {applicant_name} ({business_name})",
            "",
            f"विषय: कर्ज पात्रता निर्णय आणि पारदर्शक स्पष्टीकरण पत्र",
            "",
            f"आदरणीय {applicant_name},",
            "",
            verdict,
            "",
            "निर्णयावर परिणाम करणारे मुख्य आर्थिक घटक (Key Risk Drivers):",
        ]
        for i, d in enumerate(negative_drivers[:3], 1):
            letter_lines.append(f"  {i}. {d}")
        letter_lines.append("")
        letter_lines.append("आर्थिक स्थिती सुधारण्यासाठी कृती आराखडा (Remediation Steps):")
        for i, s in enumerate(actionable_steps[:3], 1):
            letter_lines.append(f"  {i}. {s}")
        letter_lines.append("")
        letter_lines.append("सत्यापित आर्थिक आकडेवारी:")
        letter_lines.append(f"  • सरासरी मासिक एकूण महसूल (Gross Turnover): INR {monthly_gross:,.0f}")
        letter_lines.append(f"  • सरासरी मासिक शिल्लक नफा (Net Surplus): INR {monthly_surplus:,.0f}")
        letter_lines.append(f"  • आर्थिक आरोग्य समग्र गुण (FHS Score): {fhs_score} / 100")
        letter_lines.append("")
        letter_lines.append("EquiScore XAI क्रेडिट अंडररायटिंग इंजिन")
        full_text = "\n".join(letter_lines)

    else:
        # Default English
        status_label = "Ineligible / Conditional Underwriting Review" if decision_status != "ELIGIBLE" else "Eligible for Micro-Credit Facility"
        verdict = (
            f"Your application was evaluated using the EquiScore Explainable AI underwriting framework. "
            f"The assessment produced an overall Financial Health Score of {fhs_score}/100 and a calibrated repayment probability of {repayment_prob_percent:.1f}%."
        )
        disclaimer = (
            "This adverse action and disclosure notice is issued in alignment with RBI Digital Lending Fair Practice Guidelines. "
            "This document is an alternative cashflow assessment and does not constitute a traditional credit bureau inquiry."
        )
        letter_lines = [
            f"Notice Reference: {notice_id}",
            f"Date Issued: {date_str}",
            f"Applicant: {applicant_name} ({business_name})",
            "",
            f"Subject: Micro-Credit Assessment Disclosure & Reason Notice",
            "",
            f"Dear {applicant_name},",
            "",
            verdict,
            "",
            "Primary Determinants Influencing the Underwriting Policy (SHAP Drivers):",
        ]
        for i, d in enumerate(negative_drivers[:3], 1):
            letter_lines.append(f"  {i}. {d}")
        letter_lines.append("")
        letter_lines.append("Actionable Steps to Improve Eligibility Benchmarks:")
        for i, s in enumerate(actionable_steps[:3], 1):
            letter_lines.append(f"  {i}. {s}")
        letter_lines.append("")
        letter_lines.append("Verified Cashflow Summary:")
        letter_lines.append(f"  • Average Monthly Gross Receipts: INR {monthly_gross:,.0f}")
        letter_lines.append(f"  • Average Monthly Net Surplus: INR {monthly_surplus:,.0f}")
        letter_lines.append(f"  • Financial Health Score (FHS): {fhs_score} / 100")
        letter_lines.append("")
        letter_lines.append("EquiScore XAI Underwriting Engine")
        full_text = "\n".join(letter_lines)

    return AdverseActionNotice(
        notice_id=notice_id,
        language=lang,
        language_display_name=lang_name,
        date_issued=date_str,
        applicant_name=applicant_name,
        business_name=business_name,
        decision_status=decision_status,
        verdict_summary=verdict,
        fhs_score=fhs_score,
        repayment_probability_percent=repayment_prob_percent,
        key_negative_drivers=negative_drivers[:4],
        actionable_remediation=actionable_steps[:4],
        full_letter_text=full_text,
        regulatory_disclaimer=disclaimer
    )
