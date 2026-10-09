# Granular Project Roadmap & Actionable Task Breakdown

**Project:** Explainable Alternative Credit Scoring & Informal Income Synthesizer  
**Execution Strategy:** **Option 1 — ML & Engine First (The Brain Pipeline)**  
**Status Tracking:** `[ ]` Not Started | `[/]` In Progress | `[x]` Completed

---

## Strategic Phase Overview

```
+--------------------------------------------------------------------------------------------------+
|                                    EXECUTION ROADMAP                                             |
+----------------------------------+----------------------------------+----------------------------+
| PHASE 1: DATA & ML BRAIN CORE    | PHASE 2: FASTAPI BACKEND         | PHASE 3: ASTRO 5.x SHELL   |
| Synthetic data, XGBoost model,   | Income Synthesizer, FHS scoring, | Obsidian-Lime tokens,      |
| SHAP Explainer, Fairlearn audit. | SHAP service, Scenario sandbox.  | layouts, Astro components. |
+----------------------------------+----------------------------------+----------------------------+
| PHASE 4: LANDING PAGE & TEASER   | PHASE 5: APPLICANT DASHBOARD     | PHASE 6: PASSPORT & POLISH |
| Hero, quick-bite features,       | Meiro-style analytics, SHAP      | Policy reasons, ReportLab  |
| interactive Score Teaser island. | waterfall, What-If simulator.    | PDF, end-to-end demo test. |
+----------------------------------+----------------------------------+----------------------------+
```

---

## Phase 1: Data & Machine Learning Core (The Brain)

### [x] Task 1.1: Setup Backend Environment & Dependencies
- **Status:** COMPLETED. Installed `xgboost`, `shap`, `fairlearn`, `reportlab`, `pandas`, `fastapi`, and verified imports.

### [x] Task 1.2: Generate Authentic Synthetic Vendor Datasets
- **Status:** COMPLETED. Generated `sample_street_vendor_ramesh.csv`, `sample_gig_delivery_priya.csv`, `sample_volatile_freelancer_arun.csv`, and `training_cohort_5000.csv`.

### [x] Task 1.3: Train Calibrated XGBoost Alternative Credit Risk Model
- **Status:** COMPLETED. Trained calibrated XGBoost classifier and exported artifacts (`risk_model_xgboost.joblib`, `calibrated_pipeline.joblib`, `model_metrics.json`).

### [x] Task 1.4: Build SHAP TreeExplainer & Feature Attribution Exporter
- **Status:** COMPLETED. Exported `shap_explainer.joblib`, `baseline_value.json` and verified additive mathematical consistency.

### [x] Task 1.5: Build Fairlearn Demographic Parity & Bias Audit Engine
- **Status:** COMPLETED. Audited across gender, geography, and business categories; exported `fairness_audit_report.json`.

### [x] Task 1.6: Implement Deterministic Financial Health Score (FHS) Engine
- **Status:** COMPLETED. Implemented `financial_health_service.py` with 5-pillar mathematical formula and unit tests.

---

## Phase 2: FastAPI Backend Services & API Gateway

### [x] Task 2.1: Transaction Service & Informal Income Synthesizer
- **Status:** COMPLETED. Built `transaction_service.py` & `income_service.py` supporting presets and custom CSV uploads.

### [x] Task 2.2: Unified Assessment Orchestrator Endpoint
- **Status:** COMPLETED. Built `backend/main.py` with `/api/assessments/preset` and `/api/assessments/upload`.

### [x] Task 2.3: Isolated What-If Scenario Sandbox Service
- **Status:** COMPLETED. Built `scenario_service.py` & `/api/scenarios` with zero mutation guarantee.

### [x] Task 2.4: Policy Underwriting Rules & Digital Passport PDF Service
- **Status:** COMPLETED. Built `decision_service.py`, `passport_service.py` (ReportLab), and `/api/reports/{id}/download`.

---

## Phase 3: Astro 5.x Frontend Foundation & Meiro UI System

### [x] Task 3.1: Initialize Astro 5.x Project with Tailwind & React Islands
- **Status:** COMPLETED. Astro 5.x project configured with `@astrojs/tailwind` and `@astrojs/react`.

### [x] Task 3.2: Implement Obsidian-Lime Design Tokens & Global Styles
- **Status:** COMPLETED. Built `global.css` and `tailwind.config.cjs` using Meiro palette (`#0A0B0D`, `#D2FC38`).

### [x] Task 3.3: Build Core Reusable Astro Presentation Components
- **Status:** COMPLETED. Built `Navbar.astro`, `Footer.astro`, `Hero.astro`, and `BaseLayout.astro`.

---

## Phase 4: High-Converting Landing Page & Quick-Feature Showcase

### [x] Task 4.1: Build Landing Page Hero Section with Live Trust Ticker
- **Status:** COMPLETED. Built `Hero.astro` with high contrast, trust ticker, and institutional copy.

### [x] Task 4.2: Build Interactive Score Teaser Island (React Island)
- **Status:** COMPLETED. Built `ScoreTeaser.tsx` with persona toggles and reactive real-time sliders.

### [x] Task 4.3: Build 6-Core Innovation Feature Grid
- **Status:** COMPLETED. Built `FeatureGrid.astro` highlighting Synthesizer, FHS, SHAP, Fairness, Sandbox, and Passport.

### [x] Task 4.4: Build Workflow Steps & Vendor Journey Showcase
- **Status:** COMPLETED. Built `HowItWorks.astro` and `VendorStory.astro` (Ramesh case study).

### [x] Task 4.5: Assemble and Polish Landing Page (`index.astro`)
- **Status:** COMPLETED. `index.astro` assembled and compiled with zero build errors.

---

## Phase 5: Applicant Dashboard, SHAP Waterfall & What-If Simulator

### [x] Task 5.1: Build Meiro-Style Applicant Dashboard (`dashboard.astro`)
- **Status:** COMPLETED. Built `dashboard.astro` with Meiro KPI cards, monthly ledger table, and FHS bands.

### [x] Task 5.2: Build SHAP Waterfall Attribution Island & Screen
- **Status:** COMPLETED. Built SHAP feature attribution forces bars and grounded natural language explanations.

### [x] Task 5.3: Build What-If Financial Sandbox Screen (`simulator.astro`)
- **Status:** COMPLETED. Built `simulator.astro` & `WhatIfSimulator.tsx` with dual-column before/after slider comparison.

### [x] Task 5.4: Build Fairlearn Model Governance Portal (`fairness.astro`)
- **Status:** COMPLETED. Built `fairness.astro` with demographic parity metrics and cohort selection rate table.

---

## Phase 6: Underwriting Decisions, Digital Passport & Final Polish

### [x] Task 6.1: Build Transparent Decision Page
- **Status:** COMPLETED. Integrated 5 policy rules checklist and reason codes into `dashboard.astro`.

### [x] Task 6.2: Build Digital Financial Passport Viewer & PDF Export (`passport.astro`)
- **Status:** COMPLETED. Built `passport.astro` preview dossier and direct download hook to ReportLab PDF generator.

### [x] Task 6.3: End-to-End Integration, Testing & Live Demo Verification
- **Status:** COMPLETED. Verified backend API tests (100% 200 OK) and frontend static build (5 pages built in 5.33s).
- **Objective:** Configure the exact color palette, typography, and utility classes as defined in `memory.md`.
- **Technology:** Tailwind CSS, CSS Custom Variables, Google Fonts (`Outfit` & `JetBrains Mono`).
- **Files to create:** `frontend/src/styles/global.css`, `frontend/tailwind.config.cjs`.
- **Acceptance Criteria:** Colors (`#0A0B0D`, `#121316`, `#16181D`, `#D2FC38`), pill buttons, and monospace metric styles render accurately.

---

### [ ] Task 3.3: Build Core Reusable Astro Presentation Components
- **Objective:** Create zero-JS Astro components: `MetricCard.astro`, `PillBadge.astro`, `Button.astro`, `Card.astro`, `Sidebar.astro`, `Topbar.astro`.
- **Files to create:** `frontend/src/components/astro/*`, `frontend/src/layouts/*`.
- **Acceptance Criteria:** Components render with high contrast, tactile pill borders, and proper props.

---

## Phase 4: High-Converting Landing Page & Quick-Feature Showcase

### [ ] Task 4.1: Build Landing Page Hero Section with Live Trust Ticker
- **Files to create:** `frontend/src/components/astro/Hero.astro`, `frontend/src/components/astro/Navbar.astro`.
- **Acceptance Criteria:** Value proposition clear in 5 seconds; dual pill CTAs; institutional trust badges.

---

### [ ] Task 4.2: Build Interactive Score Teaser Island (React Island)
- **Files to create:** `frontend/src/components/react/InteractiveScoreTeaser.tsx`.
- **Acceptance Criteria:** Preset buttons for Ramesh (Chai Vendor), Priya (Delivery Partner), Arun (Freelancer); live reactive sliders with instant score updates at 60fps.

---

### [ ] Task 4.3: Build 6-Core Innovation Feature Grid
- **Files to create:** `frontend/src/components/astro/FeatureGrid.astro`.
- **Acceptance Criteria:** High information density cards for Synthesizer, FHS, SHAP, Fairness, Sandbox, and Passport.

---

### [ ] Task 4.4: Build Workflow Steps, Vendor Story & Footer
- **Files to create:** `frontend/src/components/astro/HowItWorks.astro`, `frontend/src/components/astro/VendorStory.astro`, `frontend/src/components/astro/Footer.astro`.
- **Acceptance Criteria:** 4-step borrower workflow clearly visualized; realistic vendor case study.

---

### [ ] Task 4.5: Assemble and Polish Landing Page (`index.astro`)
- **Files to modify:** `frontend/src/pages/index.astro`.
- **Acceptance Criteria:** Fast load time, 100% responsive, zero visual defects.

---

## Phase 5: Applicant Dashboard, SHAP Waterfall & What-If Simulator

### [ ] Task 5.1: Build Meiro-Style Applicant Dashboard (`dashboard.astro`)
- **Files to create:** `frontend/src/pages/dashboard.astro`, `frontend/src/components/astro/MonthlyTrendChart.astro`, `frontend/src/components/astro/ActivityTable.astro`.
- **Acceptance Criteria:** Top KPI row with FHS, Monthly Receipts, Net Cashflow, and Coverage; matching the screenshot's dark tabular layout.

---

### [ ] Task 5.2: Build SHAP Waterfall Attribution Island & Screen (`explain.astro`)
- **Files to create:** `frontend/src/pages/explain.astro`, `frontend/src/components/react/ShapChart.tsx`.
- **Acceptance Criteria:** Horizontal waterfall chart showing baseline $\phi_0$, positive green factors, negative red factors, and grounded text.

---

### [ ] Task 5.3: Build What-If Financial Sandbox Screen (`simulator.astro`)
- **Files to create:** `frontend/src/pages/simulator.astro`, `frontend/src/components/react/WhatIfSandbox.tsx`.
- **Acceptance Criteria:** Dual-column before/after slider simulator with real-time score delta pill.

---

### [ ] Task 5.4: Build Fairlearn Model Governance Portal (`fairness.astro`)
- **Files to create:** `frontend/src/pages/fairness.astro`, `frontend/src/components/react/FairnessAuditor.tsx`.
- **Acceptance Criteria:** Disparity charts across gender, geography, and vendor categories; audit status badges.

---

## Phase 6: Underwriting Decisions, Digital Passport & Final Polish

### [ ] Task 6.1: Build Transparent Decision Page (`decision.astro`)
- **Files to create:** `frontend/src/pages/decision.astro`.
- **Acceptance Criteria:** Criteria checklist with pass/fail badges, reason codes, and next-step roadmap.

---

### [ ] Task 6.2: Build Digital Financial Passport Viewer & PDF Export (`passport.astro`)
- **Files to create:** `frontend/src/pages/passport.astro`.
- **Acceptance Criteria:** Digital dossier preview and one-click PDF download with verification QR code.

---

### [ ] Task 6.3: End-to-End Integration, Testing & Live Demo Verification
- **Files to create/modify:** `backend/tests/*`, `frontend/src/lib/api.ts`.
- **Acceptance Criteria:** Full workflow operates smoothly from statement upload -> synthesis -> score -> explain -> simulate -> passport download.
