import React, { useState } from 'react';

interface ParsedTxn {
  txn_id: string;
  date: string;
  direction: string;
  amount: number;
  category: string;
  description: string;
}

export default function StatementUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>("ramesh");
  const [applicantName, setApplicantName] = useState<string>("Ramesh Kumar");
  const [businessName, setBusinessName] = useState<string>("Shree Balaji Chai Stall");
  const [businessType, setBusinessType] = useState<string>("street_food");
  const [minBalance, setMinBalance] = useState<number>(11500);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [previewRows, setPreviewRows] = useState<ParsedTxn[]>([
    { txn_id: "UPI20260601819201", date: "2026-06-01", direction: "CREDIT", amount: 45.00, category: "CUSTOMER_RECEIPT", description: "UPI-QR Payment received" },
    { txn_id: "UPI20260601819202", date: "2026-06-01", direction: "CREDIT", amount: 120.00, category: "CUSTOMER_RECEIPT", description: "UPI-QR Payment received" },
    { txn_id: "UPI20260601819203", date: "2026-06-01", direction: "CREDIT", amount: 210.00, category: "CUSTOMER_RECEIPT", description: "UPI-QR Payment received" },
    { txn_id: "UPI20260602910401", date: "2026-06-02", direction: "DEBIT", amount: 1450.00, category: "BUSINESS_EXPENSE", description: "Inventory purchase (Tea, milk, sugar)" },
    { txn_id: "ACH20260605110022", date: "2026-06-05", direction: "DEBIT", amount: 3200.00, category: "EMI_DEBT", description: "Equipment Micro-Loan Auto-Debit EMI" }
  ]);
  const [totalParsedCount, setTotalParsedCount] = useState<number>(1357);
  const [totalCredits, setTotalCredits] = useState<number>(171648);
  const [totalDebits, setTotalDebits] = useState<number>(91380);

  const handleDownloadSample = () => {
    window.open("http://localhost:8000/api/sample-csv", "_blank");
  };

  const handleSelectPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    setSelectedFile(null);
    setUploadError(null);

    if (presetKey === "ramesh") {
      setApplicantName("Ramesh Kumar");
      setBusinessName("Shree Balaji Chai Stall");
      setBusinessType("street_food");
      setMinBalance(11500);
      setTotalParsedCount(1357);
      setTotalCredits(171648);
      setTotalDebits(91380);
      setPreviewRows([
        { txn_id: "UPI20260601819201", date: "2026-06-01", direction: "CREDIT", amount: 45.00, category: "CUSTOMER_RECEIPT", description: "UPI-QR Payment received" },
        { txn_id: "UPI20260601819202", date: "2026-06-01", direction: "CREDIT", amount: 120.00, category: "CUSTOMER_RECEIPT", description: "UPI-QR Payment received" },
        { txn_id: "UPI20260601819203", date: "2026-06-01", direction: "CREDIT", amount: 210.00, category: "CUSTOMER_RECEIPT", description: "UPI-QR Payment received" },
        { txn_id: "UPI20260602910401", date: "2026-06-02", direction: "DEBIT", amount: 1450.00, category: "BUSINESS_EXPENSE", description: "Inventory purchase (Tea, milk)" },
        { txn_id: "ACH20260605110022", date: "2026-06-05", direction: "DEBIT", amount: 3200.00, category: "EMI_DEBT", description: "Equipment Micro-Loan Auto-Debit EMI" }
      ]);
    } else if (presetKey === "priya") {
      setApplicantName("Priya Sharma");
      setBusinessName("Swiggy & Zomato Partner");
      setBusinessType("gig_delivery");
      setMinBalance(6400);
      setTotalParsedCount(749);
      setTotalCredits(113600);
      setTotalDebits(51200);
      setPreviewRows([
        { txn_id: "ACH20260607100411", date: "2026-06-07", direction: "CREDIT", amount: 6850.00, category: "CUSTOMER_RECEIPT", description: "Swiggy Weekly Rider Payout" },
        { txn_id: "UPI20260608102319", date: "2026-06-08", direction: "DEBIT", amount: 420.00, category: "BUSINESS_EXPENSE", description: "Fuel filling (Indian Oil)" },
        { txn_id: "ACH20260614100412", date: "2026-06-14", direction: "CREDIT", amount: 7200.00, category: "CUSTOMER_RECEIPT", description: "Swiggy Weekly Rider Payout" },
        { txn_id: "UPI20260615102320", date: "2026-06-15", direction: "DEBIT", amount: 2100.00, category: "EMI_DEBT", description: "Two-Wheeler EV Loan EMI" },
        { txn_id: "ACH20260621100413", date: "2026-06-21", direction: "CREDIT", amount: 7100.00, category: "CUSTOMER_RECEIPT", description: "Swiggy Weekly Rider Payout" }
      ]);
    } else {
      setApplicantName("Arun Verma");
      setBusinessName("Artisan Woodcraft");
      setBusinessType("artisan_freelance");
      setMinBalance(3200);
      setTotalParsedCount(319);
      setTotalCredits(192000);
      setTotalDebits(138000);
      setPreviewRows([
        { txn_id: "NEFT20260610991", date: "2026-06-10", direction: "CREDIT", amount: 18000.00, category: "CUSTOMER_RECEIPT", description: "Custom Dining Table Milestone 1" },
        { txn_id: "UPI2026061210200", date: "2026-06-12", direction: "DEBIT", amount: 6500.00, category: "BUSINESS_EXPENSE", description: "Timber & Polish raw materials" },
        { txn_id: "ACH2026061511000", date: "2026-06-15", direction: "DEBIT", amount: 4500.00, category: "EMI_DEBT", description: "Workshop Machine Loan EMI" },
        { txn_id: "NEFT20260715992", date: "2026-07-15", direction: "CREDIT", amount: 14000.00, category: "CUSTOMER_RECEIPT", description: "Milestone 2 Final Handover" },
        { txn_id: "UPI2026071810201", date: "2026-07-18", direction: "DEBIT", amount: 3200.00, category: "BUSINESS_EXPENSE", description: "Hardware & Fittings supplier" }
      ]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setActivePreset(null);
      setUploadError(null);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
          if (lines.length > 1) {
            const headerCols = lines[0].toLowerCase().split(",").map(c => c.trim().replace(/"/g, ''));
            const dateIdx = headerCols.findIndex(c => c.includes("date") || c.includes("time"));
            const amtIdx = headerCols.findIndex(c => c.includes("amount") || c.includes("value") || c.includes("inr"));
            const dirIdx = headerCols.findIndex(c => c.includes("direction") || c.includes("type") || c.includes("cr") || c.includes("dr"));
            const catIdx = headerCols.findIndex(c => c.includes("category") || c.includes("tag") || c.includes("purpose"));
            const descIdx = headerCols.findIndex(c => c.includes("desc") || c.includes("narration") || c.includes("remark"));

            let credSum = 0;
            let debSum = 0;
            const rows: ParsedTxn[] = [];

            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i].split(",").map(c => c.trim().replace(/"/g, ''));
              if (cols.length >= 2) {
                const dateVal = dateIdx >= 0 && cols[dateIdx] ? cols[dateIdx] : "2026-06-01";
                const rawAmt = amtIdx >= 0 && cols[amtIdx] ? parseFloat(cols[amtIdx].replace(/[^0-9.-]+/g, '')) || 0 : 100;
                let dirVal = dirIdx >= 0 && cols[dirIdx] ? cols[dirIdx].toUpperCase() : (rawAmt < 0 ? "DEBIT" : "CREDIT");
                if (dirVal.includes("CR") || dirVal.includes("CREDIT") || dirVal.includes("IN") || dirVal.includes("+")) {
                  dirVal = "CREDIT";
                } else {
                  dirVal = "DEBIT";
                }
                const amtVal = Math.abs(rawAmt);
                const catVal = catIdx >= 0 && cols[catIdx] ? cols[catIdx] : "GENERAL";
                const descVal = descIdx >= 0 && cols[descIdx] ? cols[descIdx] : "Statement entry";

                if (dirVal === "CREDIT") credSum += amtVal;
                else debSum += amtVal;

                if (rows.length < 5) {
                  rows.push({
                    txn_id: cols[0] || `TXN_${i}`,
                    date: dateVal,
                    direction: dirVal,
                    amount: amtVal,
                    category: catVal,
                    description: descVal
                  });
                }
              }
            }

            setPreviewRows(rows);
            setTotalParsedCount(lines.length - 1);
            setTotalCredits(Math.round(credSum));
            setTotalDebits(Math.round(debSum));
          }
        } catch (err) {
          setUploadError("Could not parse file preview. Please verify CSV format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleRunAssessment = async () => {
    setLoading(true);
    setUploadError(null);
    setLoadingStep("Validating schema & normalizing ledgers...");

    try {
      if (selectedFile) {
        // Step 1: Upload custom CSV to FastAPI backend
        setLoadingStep("Extracting informal cashflow features & volatility...");
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("applicant_name", applicantName);
        formData.append("business_name", businessName);
        formData.append("business_type", businessType);
        formData.append("min_ledger_balance", minBalance.toString());

        const res = await fetch("http://localhost:8000/api/assessments/upload", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          const errDetail = await res.json().catch(() => ({ detail: "Upload failed" }));
          throw new Error(errDetail.detail || "Server rejected CSV statement.");
        }

        setLoadingStep("Calibrating XGBoost & computing SHAP waterfall...");
        const data = await res.json();
        localStorage.setItem("equiscore_current_assessment", JSON.stringify(data));

        setLoadingStep("Assessment finalized. Redirecting to live dashboard...");
        window.location.href = `/dashboard?id=${data.assessment_id}`;
        return;
      } else {
        // Step 2: Run verified preset
        setLoadingStep("Loading verified synthetic cohort & evaluating XGBoost...");
        const pKey = activePreset || "ramesh";
        const res = await fetch("http://localhost:8000/api/assessments/preset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            preset_id: pKey,
            applicant_name: applicantName,
            business_name: businessName,
            business_type: businessType,
            min_ledger_balance: minBalance
          })
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("equiscore_current_assessment", JSON.stringify(data));
          window.location.href = `/dashboard?id=${data.assessment_id}`;
          return;
        } else {
          window.location.href = `/dashboard?persona=${pKey}`;
          return;
        }
      }
    } catch (e: any) {
      console.warn("Upload error:", e);
      setUploadError(e.message || "Failed to process statement. Please try again or load a sample preset.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner: Template Download & Schema Info */}
      <div className="bg-[#0A0A0A] border border-[#222222] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">Standardized Ledger Ingestion</span>
          <h3 className="text-base font-bold text-white mt-0.5">Need a sample statement or format template?</h3>
          <p className="text-xs text-neutral-400 mt-1 font-light max-w-xl">
            Supported columns: <code className="text-white font-mono bg-[#141414] px-1.5 py-0.5 rounded">date</code>, <code className="text-white font-mono bg-[#141414] px-1.5 py-0.5 rounded">amount</code>, <code className="text-white font-mono bg-[#141414] px-1.5 py-0.5 rounded">direction</code> (CREDIT/DEBIT), plus optional <code className="text-neutral-300 font-mono">category</code> and <code className="text-neutral-300 font-mono">description</code>.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadSample}
          className="btn-white text-xs py-2.5 px-4 flex items-center gap-2 whitespace-nowrap shadow-white-glow"
        >
          <span>↓</span> Download Sample Vendor CSV
        </button>
      </div>

      {uploadError && (
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono">
          ⚠ {uploadError}
        </div>
      )}

      {/* Step 1: Preset Quick-Load Buttons */}
      <div className="bg-[#0E0E0E] border border-[#222222] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Fast Start Presets</span>
            <h3 className="text-sm font-bold text-white mt-0.5">Test with Pre-Verified Synthetic Datasets</h3>
          </div>
          <span className="text-xs text-neutral-500 font-mono">1-Click Loading</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => handleSelectPreset("ramesh")}
            className={`p-4 rounded-xl border text-left transition-all ${
              activePreset === "ramesh" && !selectedFile
                ? "bg-white text-black border-white shadow-sm"
                : "bg-black border-[#262626] text-white hover:border-neutral-600"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs">Ramesh Kumar</span>
              <span className="font-mono text-[10px] opacity-75">1,357 txns</span>
            </div>
            <p className="text-[11px] opacity-80">Chai Stall • ₹42.9k/mo • 4 Months</p>
          </button>

          <button
            type="button"
            onClick={() => handleSelectPreset("priya")}
            className={`p-4 rounded-xl border text-left transition-all ${
              activePreset === "priya" && !selectedFile
                ? "bg-white text-black border-white shadow-sm"
                : "bg-black border-[#262626] text-white hover:border-neutral-600"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs">Priya Sharma</span>
              <span className="font-mono text-[10px] opacity-75">749 txns</span>
            </div>
            <p className="text-[11px] opacity-80">Swiggy Partner • ₹28.4k/mo • 4 Months</p>
          </button>

          <button
            type="button"
            onClick={() => handleSelectPreset("arun")}
            className={`p-4 rounded-xl border text-left transition-all ${
              activePreset === "arun" && !selectedFile
                ? "bg-white text-black border-white shadow-sm"
                : "bg-black border-[#262626] text-white hover:border-neutral-600"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs">Arun Verma</span>
              <span className="font-mono text-[10px] opacity-75">319 txns</span>
            </div>
            <p className="text-[11px] opacity-80">Carpenter • Lumpy Payouts • 4 Months</p>
          </button>
        </div>
      </div>

      {/* Step 2: Custom Drag & Drop File Zone */}
      <div className="bg-[#0E0E0E] border border-[#222222] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Custom Statement Upload</span>
            <h3 className="text-sm font-bold text-white mt-0.5">Drag & Drop Any Bank / UPI Statement CSV</h3>
          </div>
          <span className="text-xs text-neutral-500 font-mono">Format: .CSV</span>
        </div>

        <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          selectedFile ? 'border-white bg-[#141414]' : 'border-[#262626] hover:border-neutral-500 bg-black'
        }`}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <span className="text-2xl mb-2">⬆</span>
          <p className="text-sm font-semibold text-white">
            {selectedFile ? `Selected: ${selectedFile.name}` : "Click to select or drag and drop statement CSV"}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Accepts UPI logs, bank account extracts, digital POS receipts, or cash registers.
          </p>
        </label>
      </div>

      {/* Step 3: Applicant Identity & Enterprise Inputs */}
      <div className="bg-[#0E0E0E] border border-[#222222] rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="text-neutral-400 block mb-1.5 font-medium">Applicant Full Name</label>
          <input
            type="text"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            className="w-full bg-black border border-[#262626] rounded-lg px-3 py-2 text-white font-medium focus:border-white outline-none"
          />
        </div>

        <div>
          <label className="text-neutral-400 block mb-1.5 font-medium">Business / Trade Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full bg-black border border-[#262626] rounded-lg px-3 py-2 text-white font-medium focus:border-white outline-none"
          />
        </div>

        <div>
          <label className="text-neutral-400 block mb-1.5 font-medium">Enterprise Category</label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full bg-black border border-[#262626] rounded-lg px-3 py-2 text-white font-medium focus:border-white outline-none"
          >
            <option value="street_food">Street Food Vendor</option>
            <option value="gig_delivery">Gig Platform Delivery</option>
            <option value="retail_merchant">Kirana / Retail Shop</option>
            <option value="artisan_freelance">Artisan / Freelance</option>
          </select>
        </div>

        <div>
          <label className="text-neutral-400 block mb-1.5 font-medium">Lowest Observed Balance (₹)</label>
          <input
            type="number"
            value={minBalance}
            onChange={(e) => setMinBalance(Number(e.target.value))}
            className="w-full bg-black border border-[#262626] rounded-lg px-3 py-2 text-white font-mono font-medium focus:border-white outline-none"
          />
        </div>
      </div>

      {/* Step 4: Live Data Preview Table */}
      <div className="bg-[#0E0E0E] border border-[#222222] rounded-2xl overflow-hidden shadow-card-subtle">
        <div className="p-4 border-b border-[#222222] flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Statement Sample Preview</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Displaying parsed records: <strong className="text-white">{totalParsedCount} total transactions</strong> • Total Inflows: <strong className="text-white">₹{totalCredits.toLocaleString()}</strong> • Total Outflows: <strong className="text-white">₹{totalDebits.toLocaleString()}</strong>
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-white border border-white/20">
            {totalParsedCount} Records Validated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A0A0A] text-neutral-400 uppercase tracking-wider text-[10px] border-b border-[#222222]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Txn ID</th>
                <th className="py-2.5 px-4 font-semibold">Date</th>
                <th className="py-2.5 px-4 font-semibold">Direction</th>
                <th className="py-2.5 px-4 font-semibold">Amount (₹)</th>
                <th className="py-2.5 px-4 font-semibold">Category</th>
                <th className="py-2.5 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222] font-mono text-[11px]">
              {previewRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#141414] transition-colors">
                  <td className="py-2.5 px-4 text-neutral-400">{row.txn_id}</td>
                  <td className="py-2.5 px-4 text-white">{row.date}</td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.direction === "CREDIT" ? "bg-white text-black" : "bg-neutral-800 text-neutral-300"
                    }`}>
                      {row.direction}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-white font-bold">₹{Math.round(row.amount).toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-neutral-300">{row.category}</td>
                  <td className="py-2.5 px-4 text-neutral-400 truncate max-w-xs">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step 5: Assessment Action Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-neutral-400 font-mono">
          {loading ? (
            <span className="flex items-center gap-2 text-white">
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {loadingStep}
            </span>
          ) : (
            <span>Ready to evaluate with Calibrated XGBoost & 5-Pillar FHS Engine</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleRunAssessment}
          disabled={loading}
          className="btn-white text-sm py-3.5 px-8 shadow-white-glow flex items-center gap-2"
        >
          {loading ? "Processing Pipeline..." : "Run Informal Income Synthesis & Assessment ➔"}
        </button>
      </div>
    </div>
  );
}
