import React, { useState, useEffect } from 'react';
import { PRESETS } from '../../lib/mockData';

interface ActiveProfile {
  key: string;
  name: string;
  business: string;
  type: string;
  gross: number;
  expenses: number;
  surplus: number;
  emi: number;
  fhs: number;
  prob: number;
  cv: number;
}

export default function WhatIfSimulator() {
  const [profiles, setProfiles] = useState<Record<string, ActiveProfile>>({
    ramesh: {
      key: 'ramesh',
      name: 'Ramesh Kumar',
      business: 'Shree Balaji Chai Stall',
      type: 'Street Food',
      gross: 42912,
      expenses: 22845,
      surplus: 20067,
      emi: 3200,
      fhs: 82,
      prob: 88.4,
      cv: 0.11
    },
    priya: {
      key: 'priya',
      name: 'Priya Sharma',
      business: 'Swiggy & Zomato Partner',
      type: 'Gig Delivery',
      gross: 28400,
      expenses: 12800,
      surplus: 15600,
      emi: 2100,
      fhs: 74,
      prob: 79.2,
      cv: 0.18
    },
    arun: {
      key: 'arun',
      name: 'Arun Verma',
      business: 'Artisan Woodcraft',
      type: 'Artisan Carpentry',
      gross: 48000,
      expenses: 34500,
      surplus: 13500,
      emi: 4500,
      fhs: 61,
      prob: 66.8,
      cv: 0.38
    }
  });

  const [activeKey, setActiveKey] = useState<string>('ramesh');
  const [hasCustomUploaded, setHasCustomUploaded] = useState<boolean>(false);

  // Check for uploaded assessment in localStorage or query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryId = params.get('id');

    const loadProfileFromData = (d: any) => {
      const customProfile: ActiveProfile = {
        key: 'uploaded',
        name: d.applicant_name,
        business: d.business_name,
        type: d.business_type.replace('_', ' '),
        gross: Math.round(d.income_synthesis.average_monthly_gross_receipts),
        expenses: Math.round(d.income_synthesis.average_monthly_expenses),
        surplus: Math.round(d.income_synthesis.average_monthly_net_surplus),
        emi: Math.round(d.income_synthesis.average_monthly_debt_emi || 0),
        fhs: d.financial_health_score.overall_score,
        prob: d.credit_risk_ml.repayment_probability_percent,
        cv: Number(d.income_synthesis.income_volatility_cv.toFixed(2))
      };

      setProfiles((prev) => ({
        ...prev,
        uploaded: customProfile
      }));
      setHasCustomUploaded(true);
      setActiveKey('uploaded');
    };

    if (queryId) {
      fetch(`http://localhost:8000/api/assessments/${queryId}`)
        .then(res => res.json())
        .then(d => {
          loadProfileFromData(d);
          localStorage.setItem('equiscore_current_assessment', JSON.stringify(d));
        })
        .catch(err => console.warn('Could not fetch assessment for simulator', err));
      return;
    }

    const cached = localStorage.getItem('equiscore_current_assessment');
    if (cached) {
      try {
        const d = JSON.parse(cached);
        loadProfileFromData(d);
      } catch (err) {
        console.warn('Could not load custom assessment in simulator', err);
      }
    }
  }, []);

  const base = profiles[activeKey] || profiles.ramesh;

  // Sliders for delta
  const [deltaExpense, setDeltaExpense] = useState<number>(-3000);
  const [deltaGross, setDeltaGross] = useState<number>(2500);
  const [deltaEmi, setDeltaEmi] = useState<number>(-1000);
  const [deltaReserve, setDeltaReserve] = useState<number>(5000);

  // Base metrics
  const baseGross = base.gross;
  const baseExpenses = base.expenses;
  const baseSurplus = base.surplus;
  const baseEmi = base.emi;
  const baseFhs = base.fhs;
  const baseProb = base.prob;

  // Simulated state
  const simGross = Math.max(0, baseGross + deltaGross);
  const simExpenses = Math.max(0, baseExpenses + deltaExpense);
  const simSurplus = Math.max(0, simGross - simExpenses);
  const simEmi = Math.max(0, baseEmi + deltaEmi);

  // Deterministic 5-pillar recalculation
  const surplusRatio = simGross > 0 ? (simSurplus / simGross) : 0;
  const debtRatio = simSurplus > 0 ? (simEmi / simSurplus) : 1.0;
  const p1 = Math.min(100, Math.max(0, (surplusRatio / 0.35) * 100)) * 0.30;
  const p2 = (1.0 - Math.min(1.0, base.cv / 0.50)) * 100 * 0.25;
  const p3 = Math.max(0, 100 - (debtRatio * 100)) * 0.20;
  const p4 = Math.min(100, Math.max(0, ((8000 + deltaReserve) / 10000) * 80)) * 0.15;
  const p5 = 85 * 0.10;

  const simFhs = Math.min(100, Math.max(0, Math.round(p1 + p2 + p3 + p4 + p5)));
  const fhsDelta = simFhs - baseFhs;
  const probDelta = Number(((simFhs - baseFhs) * 0.70).toFixed(1));
  const simProb = Math.min(99.0, Math.max(30.0, Number((baseProb + probDelta).toFixed(1))));

  return (
    <div className="space-y-8">
      {/* Persona Toggle Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#0E0E0E] border border-[#222222] rounded-2xl">
        <div>
          <span className="text-xs font-mono uppercase text-neutral-400">Sandboxed Environment</span>
          <h2 className="text-base font-bold text-white mt-0.5">
            Active Baseline: <span className="text-neutral-200">{base.name}</span> ({base.business})
          </h2>
        </div>

        <div className="inline-flex flex-wrap p-1 bg-black rounded-full border border-[#262626]">
          {hasCustomUploaded && (
            <button
              onClick={() => setActiveKey('uploaded')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
                activeKey === 'uploaded' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              ★ Uploaded Statement ({profiles.uploaded?.name.split(' ')[0]})
            </button>
          )}
          <button
            onClick={() => setActiveKey('ramesh')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
              activeKey === 'ramesh' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Ramesh (Chai Stall)
          </button>
          <button
            onClick={() => setActiveKey('priya')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
              activeKey === 'priya' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Priya (Delivery)
          </button>
          <button
            onClick={() => setActiveKey('arun')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
              activeKey === 'arun' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Arun (Carpenter)
          </button>
        </div>
      </div>

      {/* Main Grid: Controls on left, Side-by-Side Comparison on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Delta Sliders */}
        <div className="lg:col-span-6 bg-[#0E0E0E] border border-[#222222] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
            <div>
              <h3 className="text-sm font-bold text-white">Hypothetical Financial Levers</h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">Explore score growth pathways without affecting your official records.</p>
            </div>
            <span className="text-xs text-neutral-400 font-mono">Isolated Sandbox</span>
          </div>

          {/* Slider 1: Expenses */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-neutral-400">Trim / Increase Monthly Operating Costs</span>
              <span className="num-mono font-bold text-white">
                {deltaExpense >= 0 ? '+' : ''}₹{deltaExpense.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="-10000"
              max="10000"
              step="500"
              value={deltaExpense}
              onChange={(e) => setDeltaExpense(Number(e.target.value))}
              className="w-full h-1 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1 font-mono">
              <span>-₹10,000 (Cost Reduction)</span>
              <span>+₹10,000 (Cost Inflation)</span>
            </div>
          </div>

          {/* Slider 2: Gross Receipts */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-neutral-400">Expand Monthly Digital UPI / Customer Receipts</span>
              <span className="num-mono font-bold text-white">
                {deltaGross >= 0 ? '+' : ''}₹{deltaGross.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="-10000"
              max="20000"
              step="1000"
              value={deltaGross}
              onChange={(e) => setDeltaGross(Number(e.target.value))}
              className="w-full h-1 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1 font-mono">
              <span>-₹10,000 (Seasonal Dip)</span>
              <span>+₹20,000 (Revenue Growth)</span>
            </div>
          </div>

          {/* Slider 3: EMI Paydown */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-neutral-400">Pre-Pay Existing Loan EMI / Commit New EMI</span>
              <span className="num-mono font-bold text-white">
                {deltaEmi <= 0 ? '' : '+'}₹{deltaEmi.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={-baseEmi}
              max="5000"
              step="500"
              value={deltaEmi}
              onChange={(e) => setDeltaEmi(Number(e.target.value))}
              className="w-full h-1 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1 font-mono">
              <span>-₹{baseEmi.toLocaleString()} (Full Payoff)</span>
              <span>+₹5,000 (New Equipment Loan)</span>
            </div>
          </div>

          {/* Slider 4: Emergency Reserve */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-neutral-400">Add to Emergency Liquidity Buffer</span>
              <span className="num-mono font-bold text-white">
                +₹{deltaReserve.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25000"
              step="1000"
              value={deltaReserve}
              onChange={(e) => setDeltaReserve(Number(e.target.value))}
              className="w-full h-1 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1 font-mono">
              <span>₹0</span>
              <span>+₹25,000 Reserve</span>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setDeltaExpense(0);
              setDeltaGross(0);
              setDeltaEmi(0);
              setDeltaReserve(0);
            }}
            className="w-full btn-dark text-xs py-2.5"
          >
            Reset All Sliders to Baseline
          </button>
        </div>

        {/* Right Column: Side-by-Side Comparison (Baseline vs Simulated) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Baseline Card */}
            <div className="bg-[#0A0A0A] border border-[#222222] rounded-2xl p-6">
              <span className="text-[11px] font-mono text-neutral-500 uppercase">Official Baseline</span>
              <p className="num-mono text-4xl font-extrabold text-white mt-2">
                {baseFhs}<span className="text-xs text-neutral-500 font-normal">/100</span>
              </p>
              <p className="text-xs text-neutral-400 mt-1 font-mono">Surplus: ₹{baseSurplus.toLocaleString()}</p>
              <div className="mt-4 pt-4 border-t border-[#222222] text-xs">
                <span className="text-neutral-500">Repayment Prob:</span>
                <p className="num-mono font-bold text-white mt-0.5">{baseProb}%</p>
              </div>
            </div>

            {/* Simulated Card */}
            <div className="bg-[#121212] border border-white/30 rounded-2xl p-6 relative overflow-hidden shadow-card-subtle">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-white uppercase font-semibold">Simulated State</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-white text-black">
                  {fhsDelta >= 0 ? '+' : ''}{fhsDelta} PTS
                </span>
              </div>
              <p className="num-mono text-4xl font-extrabold text-white mt-2">
                {simFhs}<span className="text-xs text-neutral-500 font-normal">/100</span>
              </p>
              <p className="text-xs text-neutral-300 mt-1 font-mono">New Surplus: ₹{simSurplus.toLocaleString()}</p>
              <div className="mt-4 pt-4 border-t border-[#222222] text-xs">
                <span className="text-neutral-500">Simulated Prob:</span>
                <p className="num-mono font-bold text-white mt-0.5">
                  {simProb}% ({probDelta >= 0 ? '+' : ''}{probDelta}%)
                </p>
              </div>
            </div>
          </div>

          {/* Actionable Insights Panel */}
          <div className="bg-[#0E0E0E] border border-[#222222] rounded-2xl p-6 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Simulation Analysis & Insights</h4>
            <div className="space-y-2 text-xs text-neutral-300 font-light">
              <p>
                • {deltaExpense < 0
                  ? `Trimming operational expenses by ₹${Math.abs(deltaExpense).toLocaleString()} boosts your net operating margin to ${(surplusRatio * 100).toFixed(1)}%.`
                  : 'Operating expenses modeled at baseline level.'}
              </p>
              <p>
                • {deltaGross > 0
                  ? `Expanding digital customer receipts by ₹${deltaGross.toLocaleString()} enhances cashflow surplus buffer.`
                  : 'Monthly sales volume modeled at baseline levels.'}
              </p>
              <p>
                • {deltaEmi < 0
                  ? `Lowering monthly debt reduces your debt service burden to ${(debtRatio * 100).toFixed(1)}% of surplus.`
                  : 'Debt obligations modeled at current levels.'}
              </p>
            </div>

            <div className="pt-3 border-t border-[#222222] text-[11px] text-neutral-500 italic">
              Note: The What-If simulation operates in an isolated memory buffer. Your baseline underwriting dossier remains 100% immutable.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
