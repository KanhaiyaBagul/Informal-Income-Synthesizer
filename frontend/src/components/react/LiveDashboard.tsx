import React, { useEffect, useState } from 'react';

interface MonthlySummary {
  month_period: string;
  gross_receipts: number;
  operating_expenses: number;
  debt_emi_payments: number;
  net_operating_surplus: number;
  customer_tx_count: number;
}

interface ShapAttribution {
  feature_name: string;
  feature_label: string;
  feature_value: number;
  shap_value: number;
  value_formatted?: string;
  feature_value_formatted?: string;
  impact_direction?: string;
}

interface RuleResult {
  rule_id: string;
  rule_name: string;
  is_passed?: boolean;
  passed?: boolean;
  actual_value_formatted?: string;
  actual_value?: any;
  target_threshold?: string;
  threshold_condition?: string;
  description?: string;
}

interface AssessmentData {
  assessment_id: string;
  applicant_name: string;
  business_name: string;
  business_type: string;
  income_synthesis: {
    average_monthly_gross_receipts: number;
    average_monthly_expenses: number;
    average_monthly_debt_emi: number;
    average_monthly_net_surplus: number;
    net_surplus_ratio: number;
    income_volatility_cv: number;
    min_observed_balance: number;
    total_tx_count: number;
    data_coverage_months: number;
    coverage_reliability_percent: number;
    monthly_trend: MonthlySummary[];
    anomaly_flags: string[];
  };
  financial_health_score: {
    overall_score: number;
    health_band: string;
    pillar_scores: Record<string, number>;
    strengths: string[];
    risk_factors: string[];
  };
  credit_risk_ml: {
    repayment_probability_percent: number;
    default_probability_percent: number;
    risk_tier: string;
    model_version: string;
    baseline_expected_probability: number;
    attributions: ShapAttribution[];
  };
  underwriting_decision: {
    decision_status: string;
    passed_count?: number;
    rules_passed_count?: number;
    total_rules_count: number;
    criteria_evaluated?: RuleResult[];
    rule_results?: RuleResult[];
    primary_reason_codes?: string[];
    reason_codes?: string[];
    actionable_next_steps?: string[];
    actionable_recommendations?: string[];
    fraud_risk_level?: string;
  };
  loan_sizing?: {
    is_eligible_for_loan: boolean;
    max_recommended_loan_inr: number;
    recommended_tenure_months: number;
    max_safe_monthly_emi_inr: number;
    risk_adjusted_apr_percent: number;
    expected_total_repayment_inr: number;
    debt_service_burden_ratio: number;
    pricing_tier: string;
    underwriting_notes: string;
  };
  fraud_audit?: {
    is_suspicious: boolean;
    risk_score_penalty: number;
    flags_triggered: string[];
    customer_concentration_ratio: number;
    max_counterparty_share_percent: number;
    velocity_spike_ratio: number;
    audit_summary: string;
  };
}

export default function LiveDashboard() {
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [activeSource, setActiveSource] = useState<string>('arun');
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showLetterModal, setShowLetterModal] = useState<boolean>(false);
  const [letterLanguage, setLetterLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [letterData, setLetterData] = useState<any>(null);
  const [letterLoading, setLetterLoading] = useState<boolean>(false);

  // Switch between CSV datasets
  const switchCsvDataset = async (key: string) => {
    setActiveSource(key);
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`http://localhost:8000/api/assessments/${key}`);
      if (res.ok) {
        const data: AssessmentData = await res.json();
        setAssessment(data);
        localStorage.setItem('equiscore_current_assessment', JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('equiscore_assessment_updated', { detail: data }));
      } else {
        throw new Error(`Failed to load dataset: ${res.statusText}`);
      }
    } catch (e: any) {
      setFetchError(e.message || "Could not load dataset from backend.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdverseActionLetter = async (lang: 'en' | 'hi' | 'mr') => {
    setLetterLanguage(lang);
    setLetterLoading(true);
    try {
      const aid = assessment?.assessment_id || activeSource;
      const res = await fetch(`http://localhost:8000/api/decisions/${aid}/letter?language=${lang}`);
      if (res.ok) {
        const data = await res.json();
        setLetterData(data);
      }
    } catch (err) {
      console.error("Failed to fetch adverse action letter", err);
    } finally {
      setLetterLoading(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setFetchError(null);
      const params = new URLSearchParams(window.location.search);
      const queryId = params.get('id');
      const queryPersona = params.get('persona');

      // 1. If explicit queryId is in URL, fetch that assessment directly from backend
      if (queryId) {
        try {
          const res = await fetch(`http://localhost:8000/api/assessments/${queryId}`);
          if (res.ok) {
            const data: AssessmentData = await res.json();
            setAssessment(data);
            setActiveSource('custom');
            localStorage.setItem('equiscore_current_assessment', JSON.stringify(data));
            window.dispatchEvent(new CustomEvent('equiscore_assessment_updated', { detail: data }));
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Could not fetch queryId assessment", e);
        }
      }

      // 2. If explicit queryPersona is in URL, fetch that persona CSV from backend
      if (queryPersona) {
        try {
          const res = await fetch(`http://localhost:8000/api/assessments/${queryPersona.toLowerCase()}`);
          if (res.ok) {
            const data: AssessmentData = await res.json();
            setAssessment(data);
            setActiveSource(queryPersona.toLowerCase());
            localStorage.setItem('equiscore_current_assessment', JSON.stringify(data));
            window.dispatchEvent(new CustomEvent('equiscore_assessment_updated', { detail: data }));
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Could not fetch queryPersona assessment", e);
        }
      }

      // 3. Check if localStorage has an active uploaded assessment with real ID
      const cached = localStorage.getItem('equiscore_current_assessment');
      if (cached) {
        try {
          const parsed: AssessmentData = JSON.parse(cached);
          if (parsed && parsed.assessment_id && parsed.income_synthesis) {
            setAssessment(parsed);
            if (parsed.applicant_name?.toLowerCase().includes('arun')) setActiveSource('arun');
            else if (parsed.applicant_name?.toLowerCase().includes('ramesh')) setActiveSource('ramesh');
            else if (parsed.applicant_name?.toLowerCase().includes('priya')) setActiveSource('priya');
            else setActiveSource('custom');
            window.dispatchEvent(new CustomEvent('equiscore_assessment_updated', { detail: parsed }));
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Failed to parse cached assessment", e);
        }
      }

      // 4. Fallback: Fetch Arun's real CSV statement directly from backend
      try {
        const res = await fetch('http://localhost:8000/api/assessments/arun');
        if (res.ok) {
          const data: AssessmentData = await res.json();
          setAssessment(data);
          setActiveSource('arun');
          localStorage.setItem('equiscore_current_assessment', JSON.stringify(data));
          window.dispatchEvent(new CustomEvent('equiscore_assessment_updated', { detail: data }));
        } else {
          setFetchError("Unable to load financial assessment from backend.");
        }
      } catch (err: any) {
        setFetchError("Backend server offline. Please verify FastAPI is running at http://localhost:8000.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
        <p className="text-sm font-mono text-neutral-400">Loading verified CSV assessment from backend engine...</p>
      </div>
    );
  }

  if (fetchError || !assessment) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-neutral-400 font-mono text-sm">{fetchError || "Assessment data could not be loaded."}</p>
        <button
          onClick={() => switchCsvDataset('arun')}
          className="btn-white text-xs py-2 px-4 shadow-white-glow"
        >
          Retry with sample_volatile_freelancer_arun.csv
        </button>
      </div>
    );
  }

  const { income_synthesis, financial_health_score, credit_risk_ml, underwriting_decision } = assessment;
  const isEligible = underwriting_decision.decision_status.includes('ELIGIBLE') || underwriting_decision.decision_status.includes('PRE-APPROVED');
  const operatingMargin = ((income_synthesis.average_monthly_net_surplus / Math.max(1, income_synthesis.average_monthly_gross_receipts)) * 100).toFixed(1);

  const activeFilename = 
    activeSource === 'arun' ? 'sample_volatile_freelancer_arun.csv' :
    activeSource === 'ramesh' ? 'sample_street_vendor_ramesh.csv' :
    activeSource === 'priya' ? 'sample_gig_delivery_priya.csv' :
    'custom_uploaded_statement.csv';

  return (
    <div className="space-y-6">
      {/* Active CSV Dataset Selector Bar */}
      <div className="p-4 bg-[#0A0A0A] border border-[#222222] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Active CSV Statement Source</span>
            <p className="text-xs font-bold text-white mt-0.5 font-mono">
              backend/data/{activeFilename} • <strong className="text-white">{income_synthesis.total_tx_count.toLocaleString()} real rows</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-500 font-mono hidden md:inline">Switch File:</span>
          <button
            type="button"
            onClick={() => switchCsvDataset('arun')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              activeSource === 'arun'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'bg-[#141414] text-neutral-400 hover:text-white border border-[#262626]'
            }`}
          >
            📄 Arun (319 txns)
          </button>
          <button
            type="button"
            onClick={() => switchCsvDataset('ramesh')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              activeSource === 'ramesh'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'bg-[#141414] text-neutral-400 hover:text-white border border-[#262626]'
            }`}
          >
            📄 Ramesh (1,357 txns)
          </button>
          <button
            type="button"
            onClick={() => switchCsvDataset('priya')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              activeSource === 'priya'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'bg-[#141414] text-neutral-400 hover:text-white border border-[#262626]'
            }`}
          >
            📄 Priya (749 txns)
          </button>
          <a
            href="/upload"
            className="px-3 py-1.5 rounded-full text-xs font-mono bg-black text-white hover:border-white border border-[#333333] transition-all flex items-center gap-1"
          >
            <span>⬆</span> Upload CSV
          </a>
        </div>
      </div>

      {/* Welcome & Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider text-neutral-400">Verified Dossier</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1A1A1A] text-neutral-300 border border-[#2E2E2E]">
              ID: {assessment.assessment_id}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            {assessment.applicant_name} — {assessment.business_name}
          </h2>
          <p className="text-xs text-text-secondary mt-1 font-light">
            Archetype: <span className="text-white font-medium capitalize">{assessment.business_type.replace('_', ' ')}</span> • {income_synthesis.data_coverage_months} Months Verified • {income_synthesis.total_tx_count.toLocaleString()} Normalized Transactions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold font-mono border ${
            isEligible 
              ? 'bg-white text-black border-white' 
              : 'bg-[#181818] text-white border-[#333333]'
          }`}>
            Status: <strong>{underwriting_decision.decision_status}</strong>
          </span>
          <a href="/upload" className="btn-dark text-xs py-1.5 px-3">
            Upload Another Statement
          </a>
          <a 
            href={`http://localhost:8000/api/reports/${assessment.assessment_id}/download`} 
            target="_blank" 
            rel="noreferrer"
            className="btn-white text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <span>↓</span> Download PDF Passport
          </a>
        </div>
      </div>

      {/* Top 5 Key Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: FHS Score */}
        <div className="card-mono flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>Health Score</span>
            <span className="cursor-pointer text-neutral-500 hover:text-white" title="Deterministic 5-pillar composite index (0-100)">ⓘ</span>
          </div>
          <div>
            <p className="num-mono text-3xl font-extrabold text-white">
              {financial_health_score.overall_score}
              <span className="text-neutral-500 text-sm font-normal">/100</span>
            </p>
            <p className="text-[11px] text-neutral-300 font-semibold mt-1">
              {financial_health_score.health_band}
            </p>
          </div>
        </div>

        {/* Card 2: Monthly Gross Receipts */}
        <div className="card-mono flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>Monthly Gross</span>
            <span className="cursor-pointer text-neutral-500 hover:text-white" title="Synthesized customer gross revenue">ⓘ</span>
          </div>
          <div>
            <p className="num-mono text-3xl font-extrabold text-white">
              ₹{Math.round(income_synthesis.average_monthly_gross_receipts).toLocaleString()}
            </p>
            <p className="text-[11px] text-neutral-400 mt-1 font-mono">
              {Math.round(income_synthesis.total_tx_count / Math.max(1, income_synthesis.data_coverage_months))} txns/mo avg
            </p>
          </div>
        </div>

        {/* Card 3: Net Cash Surplus */}
        <div className="card-mono flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>Net Surplus</span>
            <span className="cursor-pointer text-neutral-500 hover:text-white" title="Gross receipts minus operating outflows">ⓘ</span>
          </div>
          <div>
            <p className="num-mono text-3xl font-extrabold text-white">
              ₹{Math.round(income_synthesis.average_monthly_net_surplus).toLocaleString()}
            </p>
            <p className="text-[11px] text-neutral-400 mt-1 font-mono">
              {operatingMargin}% operating margin
            </p>
          </div>
        </div>

        {/* Card 4: Repayment Confidence */}
        <div className="card-mono flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>ML Confidence</span>
            <span className="cursor-pointer text-neutral-500 hover:text-white" title="Calibrated XGBoost repayment probability">ⓘ</span>
          </div>
          <div>
            <p className="num-mono text-3xl font-extrabold text-white">
              {credit_risk_ml.repayment_probability_percent}%
            </p>
            <p className="text-[11px] text-neutral-300 font-semibold mt-1">
              {credit_risk_ml.risk_tier}
            </p>
          </div>
        </div>

        {/* Card 5: Volatility CV */}
        <div className="card-mono flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>Volatility (CV)</span>
            <span className="cursor-pointer text-neutral-500 hover:text-white" title="Month-to-month coefficient of variation">ⓘ</span>
          </div>
          <div>
            <p className="num-mono text-3xl font-extrabold text-white">
              {income_synthesis.income_volatility_cv.toFixed(3)}
            </p>
            <p className="text-[11px] text-neutral-300 font-semibold mt-1">
              {income_synthesis.income_volatility_cv < 0.20 ? 'High Cashflow Stability' : 'Moderate Volatility'}
            </p>
          </div>
        </div>
      </div>

      {/* Loan Offer Sizing & Fraud Integrity Audit Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loan Sizing Card */}
        <div className="card-mono flex flex-col justify-between border-l-4 border-l-white">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-neutral-400">Component 7 Engine</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-black font-mono">
                  {assessment.loan_sizing?.pricing_tier?.replace(/_/g, ' ') || 'STANDARD TIER'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">Debt Capacity Sizing</span>
            </div>
            
            <h4 className="text-sm font-bold text-white mb-1">Approved Credit Sizing & EMI Offer</h4>
            <p className="text-xs text-neutral-400 font-light mb-4">
              Safe credit ceiling constrained to ≤35% of unencumbered operating surplus and 3x monthly turnover.
            </p>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#222222]">
              <div>
                <span className="text-[11px] text-neutral-500 font-mono block">Max Credit Facility</span>
                <span className="num-mono text-2xl font-black text-white">
                  ₹{Math.round(assessment.loan_sizing?.max_recommended_loan_inr || 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-500 font-mono block">Safe Monthly EMI</span>
                <span className="num-mono text-2xl font-black text-white">
                  ₹{Math.round(assessment.loan_sizing?.max_safe_monthly_emi_inr || 0).toLocaleString()}
                  <span className="text-xs text-neutral-400 font-normal">/mo</span>
                </span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-500 font-mono block">Risk-Adjusted APR</span>
                <span className="num-mono text-lg font-bold text-white">
                  {assessment.loan_sizing?.risk_adjusted_apr_percent || 18.0}% <span className="text-xs text-neutral-500 font-normal">p.a.</span>
                </span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-500 font-mono block">Tenure Term</span>
                <span className="num-mono text-lg font-bold text-white">
                  {assessment.loan_sizing?.recommended_tenure_months || 6} Months
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span>Debt-Burden Ratio: <strong className="text-white">{((assessment.loan_sizing?.debt_service_burden_ratio || 0.25) * 100).toFixed(1)}%</strong></span>
            <span>Expected Total: <strong className="text-white">₹{Math.round(assessment.loan_sizing?.expected_total_repayment_inr || 0).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Fraud & Anomaly Audit Card */}
        <div className="card-mono flex flex-col justify-between border-l-4 border-l-neutral-600">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-neutral-400">Component 3 Guard</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  assessment.fraud_audit?.is_suspicious 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                    : 'bg-white/10 text-white border border-white/20'
                }`}>
                  {assessment.fraud_audit?.is_suspicious ? 'HIGH ANOMALY RISK' : 'INTEGRITY VERIFIED'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">Anti-Syndicate Audit</span>
            </div>

            <h4 className="text-sm font-bold text-white mb-1">Transaction Integrity & Flow Audit</h4>
            <p className="text-xs text-neutral-400 font-light mb-4">
              Real-time screening for circular round-trips, velocity surges, and single-payer revenue clustering.
            </p>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#222222]">
              <div>
                <span className="text-[11px] text-neutral-500 font-mono block">Top Payer Concentration</span>
                <span className="num-mono text-2xl font-black text-white">
                  {((assessment.fraud_audit?.customer_concentration_ratio || 0.15) * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">Policy Benchmark: ≤60%</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-500 font-mono block">Velocity Spike Ratio</span>
                <span className="num-mono text-2xl font-black text-white">
                  {(assessment.fraud_audit?.velocity_spike_ratio || 1.0).toFixed(2)}x
                </span>
                <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">Spike Threshold: ≥3.5x</span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>Score Penalty: <strong className="text-white">-{assessment.fraud_audit?.risk_score_penalty || 0} pts</strong></span>
            <span className="truncate max-w-[220px]" title={assessment.fraud_audit?.audit_summary}>
              {assessment.fraud_audit?.flags_triggered?.length ? `${assessment.fraud_audit.flags_triggered.length} Flags Triggered` : 'Clean Cashflow Patterns'}
            </span>
          </div>
        </div>
      </div>

      {/* Reconstructed Monthly Cashflow Ledger */}
      <div className="bg-[#0E0E0E] border border-[#222222] rounded-2xl overflow-hidden shadow-card-subtle">
        <div className="p-6 border-b border-[#222222] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Reconstructed Monthly Cashflow Ledger
              <span className="px-2 py-0.5 rounded-full text-xs bg-black text-neutral-400 font-mono border border-[#262626]">
                {income_synthesis.data_coverage_months} Months Verified
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-light">
              Aggregated from verified transactions in {activeFilename}.
            </p>
          </div>
          <a 
            href={`http://localhost:8000/api/reports/${assessment.assessment_id}/download`} 
            target="_blank" 
            rel="noreferrer"
            className="text-xs font-semibold text-white hover:underline flex items-center gap-1.5 font-mono"
          >
            <span>↓</span> Official PDF Dossier
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A0A0A] text-neutral-400 uppercase tracking-wider text-[11px] border-b border-[#222222]">
              <tr>
                <th className="py-3 px-6 font-semibold">Month Period</th>
                <th className="py-3 px-6 font-semibold">Gross Receipts</th>
                <th className="py-3 px-6 font-semibold">Operating Costs</th>
                <th className="py-3 px-6 font-semibold">Debt EMI</th>
                <th className="py-3 px-6 font-semibold">Net Operating Surplus</th>
                <th className="py-3 px-6 font-semibold">Operating Margin</th>
                <th className="py-3 px-6 font-semibold">Fidelity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222] font-medium font-mono">
              {income_synthesis.monthly_trend && income_synthesis.monthly_trend.length > 0 ? (
                income_synthesis.monthly_trend.map((row) => {
                  const margin = row.gross_receipts > 0 
                    ? ((row.net_operating_surplus / row.gross_receipts) * 100).toFixed(1) 
                    : '0.0';
                  return (
                    <tr key={row.month_period} className="hover:bg-[#141414] transition-colors">
                      <td className="py-4 px-6 text-white">{row.month_period}</td>
                      <td className="py-4 px-6 text-white">₹{Math.round(row.gross_receipts).toLocaleString()}</td>
                      <td className="py-4 px-6 text-neutral-400">₹{Math.round(row.operating_expenses).toLocaleString()}</td>
                      <td className="py-4 px-6 text-neutral-400">₹{Math.round(row.debt_emi_payments || 0).toLocaleString()}</td>
                      <td className="py-4 px-6 text-white font-bold">₹{Math.round(row.net_operating_surplus).toLocaleString()}</td>
                      <td className="py-4 px-6 text-neutral-300">{margin}%</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20">
                          VERIFIED CSV
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 px-6 text-center text-neutral-500">
                    No monthly breakdown records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dual Bottom Section: SHAP Waterfall forces + Underwriting Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: SHAP Feature Attributions */}
        <div className="lg:col-span-7 bg-[#0E0E0E] border border-[#222222] rounded-2xl p-6 shadow-card-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
              <div>
                <span className="text-xs font-mono uppercase text-neutral-400">Explainable AI (XAI)</span>
                <h3 className="text-base font-bold text-white mt-0.5">SHAP Feature Attribution Forces</h3>
              </div>
              <span className="text-xs text-neutral-500 font-mono">TreeExplainer Margin</span>
            </div>

            <p className="text-xs text-neutral-400 my-4 font-light">
              Directional impact of {assessment.applicant_name}'s alternative cashflow features against the baseline model expectation.
            </p>

            {/* Attributions List */}
            <div className="space-y-3 pt-2">
              {credit_risk_ml.attributions && credit_risk_ml.attributions.length > 0 ? (
                credit_risk_ml.attributions.map((a) => {
                  const isPos = a.shap_value >= 0;
                  const pct = Math.min(100, Math.round(Math.abs(a.shap_value) * 100));
                  const displayVal = (a as any).feature_value_formatted || a.value_formatted || a.feature_value;
                  return (
                    <div key={a.feature_name || a.feature_label} className="p-3 rounded-xl bg-black border border-[#222222]">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-white">{a.feature_label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-neutral-500">{displayVal}</span>
                          <span className="num-mono font-bold text-white">
                            {isPos ? '+' : ''}{a.shap_value.toFixed(3)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-[#222222] rounded-full overflow-hidden flex">
                        <div
                          className={`h-full rounded-full transition-all ${isPos ? 'bg-white' : 'bg-neutral-600'}`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-neutral-500">Attributions pending feature extraction.</p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#222222] text-xs text-neutral-500 font-mono">
            Baseline Expectation: <strong className="text-white">{credit_risk_ml.baseline_expected_probability || 61.5}%</strong> • Calibrated Prediction: <strong className="text-white">{credit_risk_ml.repayment_probability_percent}%</strong>
          </div>
        </div>

        {/* Right Column: Policy Underwriting Checklist */}
        <div className="lg:col-span-5 bg-[#0E0E0E] border border-[#222222] rounded-2xl p-6 shadow-card-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
              <div>
                <span className="text-xs font-mono uppercase text-neutral-400">Underwriting Rules</span>
                <h3 className="text-base font-bold text-white mt-0.5">Policy Criteria Checklist</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 font-mono">
                {underwriting_decision.passed_count ?? underwriting_decision.rules_passed_count ?? 5} / {underwriting_decision.total_rules_count ?? 5} PASSED
              </span>
            </div>

            <div className="divide-y divide-[#222222] text-xs py-2">
              {((underwriting_decision.criteria_evaluated || underwriting_decision.rule_results || []) as any[]).map((r: any) => {
                const isPassed = r.is_passed !== undefined ? r.is_passed : r.passed;
                const thresh = r.target_threshold || r.threshold_condition;
                const actVal = r.actual_value_formatted || r.actual_value;
                return (
                  <div key={r.rule_id} className="py-3 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white">{r.rule_name}</p>
                      <p className="text-neutral-500 text-[11px] font-mono">Threshold: {thresh}</p>
                    </div>
                    <span className={`font-bold text-xs font-mono ${isPassed ? 'text-white' : 'text-neutral-500'}`}>
                      {isPassed ? '✓ PASSED' : '✗ FAILED'} ({actVal})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#222222] space-y-2">
            <button
              type="button"
              onClick={() => {
                setShowLetterModal(true);
                fetchAdverseActionLetter(letterLanguage);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-[#333333] hover:border-white text-xs font-mono text-white bg-black hover:bg-[#141414] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>📄</span> Adverse Action / Credit Reason Letter (EN/HI/MR)
            </button>
            <a 
              href={`/simulator?id=${assessment.assessment_id}`} 
              className="w-full btn-white text-xs py-2.5 flex items-center justify-center"
            >
              Open What-If Simulator for {assessment.applicant_name.split(' ')[0]} ➔
            </a>
          </div>
        </div>
      </div>

      {/* Multilingual Adverse Action & Disclosure Notice Modal */}
      {showLetterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E0E0E] border border-[#333333] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[#222222] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">RBI Fair Lending Practice Disclosure</span>
                <h3 className="text-base font-bold text-white mt-0.5">Adverse Action & Underwriting Reason Letter</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLetterModal(false)}
                className="w-8 h-8 rounded-full bg-black border border-[#333333] text-neutral-400 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Language Switcher Tabs */}
            <div className="flex items-center gap-2 p-4 bg-[#080808] border-b border-[#222222]">
              <span className="text-xs text-neutral-400 font-mono">Language:</span>
              <button
                type="button"
                onClick={() => fetchAdverseActionLetter('en')}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  letterLanguage === 'en' ? 'bg-white text-black font-bold' : 'bg-black text-neutral-400 hover:text-white border border-[#262626]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => fetchAdverseActionLetter('hi')}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  letterLanguage === 'hi' ? 'bg-white text-black font-bold' : 'bg-black text-neutral-400 hover:text-white border border-[#262626]'
                }`}
              >
                हिंदी (Hindi)
              </button>
              <button
                type="button"
                onClick={() => fetchAdverseActionLetter('mr')}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  letterLanguage === 'mr' ? 'bg-white text-black font-bold' : 'bg-black text-neutral-400 hover:text-white border border-[#262626]'
                }`}
              >
                मराठी (Marathi)
              </button>
            </div>

            {/* Letter Body */}
            <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs text-neutral-300 leading-relaxed bg-[#050505] flex-1">
              {letterLoading ? (
                <div className="py-12 text-center text-neutral-500 font-mono">
                  Loading verified regulatory disclosure notice...
                </div>
              ) : letterData ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-black border border-[#222222] flex items-center justify-between">
                    <span>Notice ID: <strong className="text-white">{letterData.notice_id}</strong></span>
                    <span>Date: <strong className="text-white">{letterData.date_issued}</strong></span>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-sm text-neutral-200 leading-relaxed">
                    {letterData.full_letter_text}
                  </pre>
                  <div className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800 text-[11px] text-neutral-400">
                    {letterData.regulatory_disclaimer}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-neutral-500">
                  Click a language tab to generate letter.
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-[#222222] bg-[#0A0A0A] flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 font-mono">RBI Digital Lending Guidelines Compliant</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (letterData?.full_letter_text) {
                      navigator.clipboard.writeText(letterData.full_letter_text);
                      alert("Letter copied to clipboard!");
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-black border border-[#333333] hover:border-white text-white text-xs font-mono cursor-pointer"
                >
                  📋 Copy Text
                </button>
                <button
                  type="button"
                  onClick={() => setShowLetterModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs font-mono cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
