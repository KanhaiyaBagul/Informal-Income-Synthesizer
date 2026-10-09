import React, { useState } from 'react';
import { PRESETS } from '../../lib/mockData';

export default function WhatIfSimulator() {
  const [activePersona, setActivePersona] = useState<'ramesh' | 'priya' | 'arun'>('ramesh');
  const base = PRESETS[activePersona];

  // Sliders for delta
  const [deltaExpense, setDeltaExpense] = useState<number>(-4000); // e.g. reduce expenses
  const [deltaGross, setDeltaGross] = useState<number>(3000); // e.g. boost sales
  const [deltaEmi, setDeltaEmi] = useState<number>(-1000); // e.g. pay off debt
  const [deltaReserve, setDeltaReserve] = useState<number>(5000); // add to savings

  // Base state
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

  // Recalculate FHS
  const surplusRatio = simGross > 0 ? (simSurplus / simGross) : 0;
  const debtRatio = simSurplus > 0 ? (simEmi / simSurplus) : 1.0;
  const p1 = Math.min(100, Math.max(0, (surplusRatio / 0.35) * 100)) * 0.30;
  const p2 = (1.0 - Math.min(1.0, base.cv / 0.50)) * 100 * 0.25;
  const p3 = Math.max(0, 100 - (debtRatio * 100)) * 0.20;
  const p4 = Math.min(100, Math.max(0, ((8000 + deltaReserve) / 10000) * 80)) * 0.15;
  const p5 = 85 * 0.10;

  const simFhs = Math.min(100, Math.max(0, Math.round(p1 + p2 + p3 + p4 + p5)));
  const fhsDelta = simFhs - baseFhs;
  const probDelta = Number(((simFhs - baseFhs) * 0.75).toFixed(1));
  const simProb = Math.min(98.5, Math.max(30.0, Number((baseProb + probDelta).toFixed(1))));

  return (
    <div className="space-y-8">
      {/* Persona Toggle Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#16181D] border border-[#22252B] rounded-2xl">
        <div>
          <span className="text-xs font-mono uppercase text-lime">Sandboxed Environment</span>
          <h2 className="text-lg font-bold text-white mt-0.5">Select Baseline Profile to Simulate</h2>
        </div>

        <div className="inline-flex p-1 bg-[#0A0B0D] rounded-full border border-[#22252B]">
          <button
            onClick={() => setActivePersona('ramesh')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
              activePersona === 'ramesh' ? 'bg-lime text-black font-semibold' : 'text-text-secondary hover:text-white'
            }`}
          >
            Ramesh (Chai Stall)
          </button>
          <button
            onClick={() => setActivePersona('priya')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
              activePersona === 'priya' ? 'bg-lime text-black font-semibold' : 'text-text-secondary hover:text-white'
            }`}
          >
            Priya (Delivery Partner)
          </button>
          <button
            onClick={() => setActivePersona('arun')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
              activePersona === 'arun' ? 'bg-lime text-black font-semibold' : 'text-text-secondary hover:text-white'
            }`}
          >
            Arun (Carpenter)
          </button>
        </div>
      </div>

      {/* Main Grid: Controls on left, Side-by-Side Comparison on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Delta Sliders */}
        <div className="lg:col-span-6 bg-[#16181D] border border-[#22252B] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#22252B]">
            <h3 className="text-sm font-bold text-white">Hypothetical Levers</h3>
            <span className="text-xs text-lime font-mono">Zero Mutation Guarantee</span>
          </div>

          {/* Slider 1: Expenses */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-text-secondary">Trim / Increase Monthly Expenses</span>
              <span className={`num-mono font-bold ${deltaExpense <= 0 ? 'text-positive' : 'text-negative'}`}>
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
              className="w-full h-1.5 bg-[#22252B] rounded-lg appearance-none cursor-pointer accent-lime"
            />
            <div className="flex justify-between text-[11px] text-text-muted mt-1">
              <span>-₹10,000 (Savings)</span>
              <span>+₹10,000 (Cost spike)</span>
            </div>
          </div>

          {/* Slider 2: Gross Receipts */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-text-secondary">Expand Monthly Digital UPI Sales</span>
              <span className={`num-mono font-bold ${deltaGross >= 0 ? 'text-positive' : 'text-negative'}`}>
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
              className="w-full h-1.5 bg-[#22252B] rounded-lg appearance-none cursor-pointer accent-lime"
            />
            <div className="flex justify-between text-[11px] text-text-muted mt-1">
              <span>-₹10,000 (Downturn)</span>
              <span>+₹20,000 (Growth)</span>
            </div>
          </div>

          {/* Slider 3: EMI Paydown */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-text-secondary">Pay Down Monthly Loan EMI</span>
              <span className={`num-mono font-bold ${deltaEmi <= 0 ? 'text-positive' : 'text-negative'}`}>
                {deltaEmi >= 0 ? '+' : ''}₹{deltaEmi.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={-baseEmi}
              max="5000"
              step="500"
              value={deltaEmi}
              onChange={(e) => setDeltaEmi(Number(e.target.value))}
              className="w-full h-1.5 bg-[#22252B] rounded-lg appearance-none cursor-pointer accent-lime"
            />
            <div className="flex justify-between text-[11px] text-text-muted mt-1">
              <span>Pay off full EMI</span>
              <span>+₹5,000 new EMI</span>
            </div>
          </div>

          {/* Slider 4: Emergency Reserve */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-text-secondary">Add to Emergency Liquidity Buffer</span>
              <span className="num-mono font-bold text-positive">
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
              className="w-full h-1.5 bg-[#22252B] rounded-lg appearance-none cursor-pointer accent-lime"
            />
            <div className="flex justify-between text-[11px] text-text-muted mt-1">
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
            className="w-full btn-dark text-xs py-2"
          >
            Reset All Sliders to Baseline
          </button>
        </div>

        {/* Right Column: Side-by-Side Comparison (Baseline vs Simulated) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Baseline Card */}
            <div className="bg-[#121316] border border-[#22252B] rounded-2xl p-6">
              <span className="text-[11px] font-mono text-text-muted uppercase">Official Baseline</span>
              <p className="num-mono text-4xl font-extrabold text-white mt-2">{baseFhs}<span className="text-xs text-text-muted font-normal">/100</span></p>
              <p class="text-xs text-text-secondary mt-1">Net Surplus: ₹{baseSurplus.toLocaleString()}</p>
              <div className="mt-4 pt-4 border-t border-[#22252B] text-xs">
                <span className="text-text-muted">Repayment Prob:</span>
                <p className="num-mono font-bold text-white mt-0.5">{baseProb}%</p>
              </div>
            </div>

            {/* Simulated Card */}
            <div className="bg-[#16181D] border border-lime/40 rounded-2xl p-6 relative overflow-hidden shadow-lime-glow">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-lime uppercase font-semibold">Simulated State</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  fhsDelta >= 0 ? 'bg-positive/20 text-positive' : 'bg-negative/20 text-negative'
                }`}>
                  {fhsDelta >= 0 ? '+' : ''}{fhsDelta} PTS
                </span>
              </div>
              <p className="num-mono text-4xl font-extrabold text-lime mt-2">{simFhs}<span className="text-xs text-text-muted font-normal">/100</span></p>
              <p className="text-xs text-white mt-1">New Surplus: ₹{simSurplus.toLocaleString()}</p>
              <div className="mt-4 pt-4 border-t border-[#22252B] text-xs">
                <span className="text-text-muted">Simulated Prob:</span>
                <p className="num-mono font-bold text-lime mt-0.5">
                  {simProb}% ({probDelta >= 0 ? '+' : ''}{probDelta}%)
                </p>
              </div>
            </div>
          </div>

          {/* Actionable Insights Panel */}
          <div className="bg-[#16181D] border border-[#22252B] rounded-2xl p-6 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Simulation Analysis</h4>
            <div className="space-y-2 text-xs text-text-secondary">
              <p>
                • {deltaExpense < 0
                  ? `Reducing business expenses by ₹${Math.abs(deltaExpense).toLocaleString()} directly widens your operating margin to ${(surplusRatio * 100).toFixed(1)}%.`
                  : 'Operating expenses remain steady with baseline.'}
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

            <div className="pt-3 border-t border-[#22252B] text-[11px] text-text-muted italic">
              Disclaimer: Simulator calculations are for financial empowerment and educational exploration. They do not alter your official saved assessment or guarantee formal loan approvals.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
