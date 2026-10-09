import React, { useState } from 'react';
import { PRESETS } from '../../lib/mockData';

export default function WhatIfSimulator() {
  const [activePersona, setActivePersona] = useState<'ramesh' | 'priya' | 'arun'>('ramesh');
  const base = PRESETS[activePersona];

  // Sliders for delta
  const [deltaExpense, setDeltaExpense] = useState<number>(-4000);
  const [deltaGross, setDeltaGross] = useState<number>(3000);
  const [deltaEmi, setDeltaEmi] = useState<number>(-1000);
  const [deltaReserve, setDeltaReserve] = useState<number>(5000);

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#0E0E0E] border border-[#222222] rounded-2xl">
        <div>
          <span className="text-xs font-mono uppercase text-neutral-400">Sandboxed Environment</span>
          <h2 className="text-lg font-bold text-white mt-0.5">Select Baseline Profile to Simulate</h2>
        </div>

        <div className="inline-flex p-1 bg-black rounded-full border border-[#262626]">
          <button
            onClick={() => setActivePersona('ramesh')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
              activePersona === 'ramesh' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Ramesh (Chai Stall)
          </button>
          <button
            onClick={() => setActivePersona('priya')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
              activePersona === 'priya' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Priya (Delivery Partner)
          </button>
          <button
            onClick={() => setActivePersona('arun')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
              activePersona === 'arun' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
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
            <h3 className="text-sm font-bold text-white">Hypothetical Levers</h3>
            <span className="text-xs text-neutral-400 font-mono">Zero Mutation Guarantee</span>
          </div>

          {/* Slider 1: Expenses */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-neutral-400">Trim / Increase Monthly Expenses</span>
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
              <span>-₹10,000 (Savings)</span>
              <span>+₹10,000 (Cost spike)</span>
            </div>
          </div>

          {/* Slider 2: Gross Receipts */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-neutral-400">Expand Monthly Digital UPI Sales</span>
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
              <span>-₹10,000 (Downturn)</span>
              <span>+₹20,000 (Growth)</span>
            </div>
          </div>

          {/* Slider 3: EMI Paydown */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-neutral-400">Pay Down Monthly Loan EMI</span>
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
              <span>Pay off full EMI</span>
              <span>+₹5,000 new EMI</span>
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
            className="w-full btn-dark text-xs py-2"
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
              <p className="num-mono text-4xl font-extrabold text-white mt-2">{baseFhs}<span className="text-xs text-neutral-500 font-normal">/100</span></p>
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
              <p className="num-mono text-4xl font-extrabold text-white mt-2">{simFhs}<span className="text-xs text-neutral-500 font-normal">/100</span></p>
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
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Simulation Analysis</h4>
            <div className="space-y-2 text-xs text-neutral-300 font-light">
              <p>
                • {deltaExpense < 0
                  ? `Reducing business expenses by ₹${Math.abs(deltaExpense).toLocaleString()} directly widens your operating margin to ${(surplusRatio * 100).toFixed(1)}%.`
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
              Disclaimer: Simulator calculations are for financial empowerment and educational exploration. They do not alter your official saved assessment or guarantee formal loan approvals.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
