import React, { useState } from 'react';
import { PRESETS } from '../../lib/mockData';

export default function ScoreTeaser() {
  const [activePreset, setActivePreset] = useState<'ramesh' | 'priya' | 'arun'>('ramesh');
  
  // Custom slider adjustments
  const p = PRESETS[activePreset];
  const [gross, setGross] = useState<number>(p.gross);
  const [expenses, setExpenses] = useState<number>(p.expenses);
  const [emi, setEmi] = useState<number>(p.emi);

  // Handle preset change
  const handlePresetChange = (key: 'ramesh' | 'priya' | 'arun') => {
    setActivePreset(key);
    const newP = PRESETS[key];
    setGross(newP.gross);
    setExpenses(newP.expenses);
    setEmi(newP.emi);
  };

  // Instant reactive score calculation
  const surplus = Math.max(0, gross - expenses);
  const surplusRatio = gross > 0 ? (surplus / gross) : 0;
  const debtRatio = surplus > 0 ? (emi / surplus) : 1.0;
  
  // Real-time FHS approximation
  const p1 = Math.min(100, Math.max(0, (surplusRatio / 0.35) * 100)) * 0.30;
  const p2 = (1.0 - Math.min(1.0, p.cv / 0.50)) * 100 * 0.25;
  const p3 = Math.max(0, 100 - (debtRatio * 100)) * 0.20;
  const p4 = 75 * 0.15; // Reserve buffer
  const p5 = 85 * 0.10; // Coverage
  const calculatedFhs = Math.round(p1 + p2 + p3 + p4 + p5);
  
  // Calibrated prob approx
  const calculatedProb = Math.min(96, Math.max(25, Math.round(55 + (calculatedFhs - 60) * 0.85)));

  return (
    <div className="w-full bg-[#16181D] border border-[#22252B] rounded-2xl p-6 sm:p-8 shadow-card-subtle relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-lime/5 rounded-full blur-3xl pointer-events-none" />

      {/* Persona Toggle Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#22252B]">
        <div>
          <span className="text-xs font-semibold text-lime uppercase tracking-wider">Live Interactive Sandbox</span>
          <h3 className="text-lg font-bold text-white mt-0.5">Test Real Micro-Borrower Profiles</h3>
        </div>

        <div className="inline-flex p-1 bg-[#0A0B0D] rounded-full border border-[#22252B]">
          <button
            onClick={() => handlePresetChange('ramesh')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
              activePreset === 'ramesh'
                ? 'bg-lime text-black font-semibold shadow-sm'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Ramesh (Chai Stall)
          </button>
          <button
            onClick={() => handlePresetChange('priya')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
              activePreset === 'priya'
                ? 'bg-lime text-black font-semibold shadow-sm'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Priya (Delivery)
          </button>
          <button
            onClick={() => handlePresetChange('arun')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
              activePreset === 'arun'
                ? 'bg-lime text-black font-semibold shadow-sm'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Arun (Carpenter)
          </button>
        </div>
      </div>

      {/* Main Grid: Sliders on left, Live Output Card on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left: Input Sliders */}
        <div className="lg:col-span-7 space-y-6">
          {/* Monthly Gross Receipts Slider */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-secondary font-medium">Monthly UPI Receipts</span>
              <span className="num-mono text-white font-bold text-base">₹{gross.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="15000"
              max="90000"
              step="1000"
              value={gross}
              onChange={(e) => setGross(Number(e.target.value))}
              className="w-full h-1.5 bg-[#22252B] rounded-lg appearance-none cursor-pointer accent-lime"
            />
            <div className="flex justify-between text-[11px] text-text-muted mt-1">
              <span>₹15,000</span>
              <span>₹90,000</span>
            </div>
          </div>

          {/* Monthly Operating Expenses Slider */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-secondary font-medium">Operating Expenses</span>
              <span className="num-mono text-white font-bold text-base">₹{expenses.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="500"
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value))}
              className="w-full h-1.5 bg-[#22252B] rounded-lg appearance-none cursor-pointer accent-lime"
            />
            <div className="flex justify-between text-[11px] text-text-muted mt-1">
              <span>₹5,000</span>
              <span>₹50,000</span>
            </div>
          </div>

          {/* Existing Loan EMI Slider */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-secondary font-medium">Monthly Debt / EMI</span>
              <span className="num-mono text-white font-bold text-base">₹{emi.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="15000"
              step="500"
              value={emi}
              onChange={(e) => setEmi(Number(e.target.value))}
              className="w-full h-1.5 bg-[#22252B] rounded-lg appearance-none cursor-pointer accent-lime"
            />
            <div className="flex justify-between text-[11px] text-text-muted mt-1">
              <span>₹0 (Debt-free)</span>
              <span>₹15,000</span>
            </div>
          </div>

          {/* Persona Insights Tag */}
          <div className="p-3 bg-[#0A0B0D] rounded-xl border border-[#22252B] flex items-center justify-between text-xs">
            <span className="text-text-secondary">Enterprise Archetype:</span>
            <span className="font-semibold text-white">{p.business}</span>
          </div>
        </div>

        {/* Right: Real-Time Scorecard */}
        <div className="lg:col-span-5 bg-[#0A0B0D] border border-[#22252B] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">Financial Health Score</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                calculatedFhs >= 75 ? 'bg-positive/10 text-positive border border-positive/20' :
                calculatedFhs >= 60 ? 'bg-lime/10 text-lime border border-lime/20' :
                'bg-caution/10 text-caution border border-caution/20'
              }`}>
                {calculatedFhs >= 75 ? 'PRIME' : calculatedFhs >= 60 ? 'RESILIENT' : 'MODERATE'}
              </span>
            </div>

            {/* Giant Score Value */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="num-mono text-5xl font-extrabold text-white">{calculatedFhs}</span>
              <span className="text-text-muted text-base font-medium">/ 100</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#22252B] rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-lime transition-all duration-300 rounded-full"
                style={{ width: `${calculatedFhs}%` }}
              />
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#22252B]/60">
                <span className="text-text-secondary">Net Operating Surplus:</span>
                <span className="num-mono font-bold text-white">₹{surplus.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#22252B]/60">
                <span className="text-text-secondary">Operating Margin:</span>
                <span className="num-mono font-bold text-lime">{(surplusRatio * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#22252B]/60">
                <span className="text-text-secondary">Repayment Confidence:</span>
                <span className="num-mono font-bold text-white">{calculatedProb}% (XGBoost)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#22252B]">
            <a
              href="/dashboard"
              className="w-full btn-lime text-xs py-2.5 flex items-center justify-center gap-2"
            >
              Inspect Full Assessment & SHAP ➔
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
