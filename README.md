# Explainable Alternative Credit Scoring & Informal Income Synthesizer

> **Project type:** FinTech / Alternative Credit Scoring / Explainable
> AI (XAI)\
> **Project status:** Planning and prototype blueprint\
> **Primary goal:** Help micro-entrepreneurs, street vendors,
> freelancers, and gig workers present a more complete picture of their
> financial health when they do not have conventional salary slips or
> extensive credit histories.

------------------------------------------------------------------------

## Table of Contents

1.  [Project Overview](#1-project-overview)
2.  [Problem Statement](#2-problem-statement)
3.  [Vision and Objectives](#3-vision-and-objectives)
4.  [Target Users](#4-target-users)
5.  [Core Features](#5-core-features)
    -   [Financial Health Score](#51-financial-health-score)
    -   [AI-Powered Explanation](#52-ai-powered-explanation)
    -   [AI Fairness and Bias Checker](#53-ai-fairness-and-bias-checker)
    -   [SHAP Explanation Dashboard](#54-shap-explanation-dashboard)
    -   [What-If Financial Simulator](#55-what-if-financial-simulator)
    -   [Transparent Approval and Rejection
        Reasons](#56-transparent-approval-and-rejection-reasons)
    -   [Digital Financial Passport](#57-digital-financial-passport)
    -   [Informal Income Synthesizer](#58-informal-income-synthesizer)
6.  [End-to-End Application
    Workflow](#6-end-to-end-application-workflow)
7.  [User Interface and Page
    Structure](#7-user-interface-and-page-structure)
8.  [Technology Stack](#8-technology-stack)
9.  [System Architecture](#9-system-architecture)
10. [Frontend Implementation Plan](#10-frontend-implementation-plan)
11. [Backend Modules and
    Responsibilities](#11-backend-modules-and-responsibilities)
12. [Proposed API Design](#12-proposed-api-design)
13. [Database Design](#13-database-design)
14. [Machine-Learning Strategy](#14-machine-learning-strategy)
15. [Data Requirements and
    Processing](#15-data-requirements-and-processing)
16. [Security, Privacy, Fairness, and Responsible
    Use](#16-security-privacy-fairness-and-responsible-use)
17. [Suggested Project Structure](#17-suggested-project-structure)
18. [Development Roadmap](#18-development-roadmap)
19. [Testing and Acceptance
    Criteria](#19-testing-and-acceptance-criteria)
20. [Local Development Setup](#20-local-development-setup)
21. [Demo Scenario](#21-demo-scenario)
22. [Limitations and Future
    Enhancements](#22-limitations-and-future-enhancements)
23. [Glossary](#23-glossary)

------------------------------------------------------------------------

## 1. Project Overview

**Explainable Alternative Credit Scoring & Informal Income Synthesizer**
is a financial assessment platform designed to help people whose
earnings may not fit a conventional salaried-employment model. Examples
include small shop owners, street vendors, self-employed workers, gig
workers, freelancers, and micro-entrepreneurs.

The platform processes consented financial information, estimates
informal income from available evidence, calculates a Financial Health
Score, and---when suitable labelled data and a validated model are
available---estimates credit risk. It then explains the results,
provides model-level fairness audit information, enables hypothetical
financial simulations, presents transparent assessment or eligibility
reasons, and generates a downloadable Digital Financial Passport.

The application is intended to make financial assessments **more
understandable, traceable, and useful**. It is not intended to guarantee
loan approval or replace the final decision of an authorized lender.

### Core idea

The system should not simply show a number. It should answer:

-   What does the available financial data indicate?
-   How was the Financial Health Score calculated?
-   What is the estimated income, and how reliable is that estimate?
-   Which features contributed to the credit-risk model's prediction?
-   Has the model been evaluated for potential group disparities?
-   How might hypothetical financial changes affect the model's output?
-   What recorded criteria led to a lending recommendation?
-   Can the user download and control a report of the assessment?

### Important distinction between outputs

The application keeps these concepts separate:

1.  **Financial Health Score:** A designed score summarizing selected
    aspects of financial stability, such as income consistency, cash
    flow, savings, and debt burden.
2.  **Credit Risk Estimate:** A model output estimating the risk of a
    defined repayment outcome over a defined period. This requires
    suitable historical repayment labels and model validation.
3.  **Eligibility Assessment:** A comparison of available information
    and model outputs with configured criteria.
4.  **Lending Decision:** A decision made by the authorized lender or
    decision-maker, where applicable.

A high Financial Health Score does not automatically imply low credit
risk or guaranteed loan approval.

------------------------------------------------------------------------

## 2. Problem Statement

Many micro-entrepreneurs and gig workers receive income irregularly, are
paid in cash or through multiple payment channels, and may not have
formal payslips or a long credit-bureau history. A conventional
assessment process may not adequately represent their actual financial
activity.

At the same time, a score produced by a machine-learning model may be
difficult for an applicant to understand. If the platform cannot explain
the important factors behind a prediction or investigate potential bias,
it may be hard to establish trust in the assessment.

The project addresses these issues by combining alternative financial
indicators, informal-income estimation, explainability, model fairness
evaluation, interactive simulations, transparent reason reporting, and a
portable financial report.

### Proposed solution

Build a web application that:

1.  Collects financial data with appropriate consent.
2.  Validates and categorizes transaction records.
3.  Estimates informal income and its uncertainty.
4.  Calculates a documented Financial Health Score.
5.  Estimates credit risk only when an appropriate model and data are
    available.
6.  Uses SHAP to explain individual model predictions.
7.  Audits model performance and potential disparities across relevant
    groups.
8.  Allows users to run isolated What-If scenarios.
9.  Shows the actual reasons behind configured eligibility outcomes or
    recorded decisions.
10. Generates a user-controlled Digital Financial Passport PDF.

------------------------------------------------------------------------

## 3. Vision and Objectives

### Objective 1 --- Financial Health Score

Assess selected indicators of financial stability and present them in a
consistent, understandable format. The score should be reproducible,
documented, and accompanied by the indicators and data limitations that
influenced it.

### Objective 2 --- AI-Powered Explanation

Translate verified financial metrics, model contributions, and recorded
decision reasons into clear language. Generated text must be grounded in
actual system outputs and must not invent financial facts.

### Objective 3 --- AI Fairness and Bias Checker

Evaluate whether model performance or outcomes differ across relevant
groups. Provide metrics, sample sizes, limitations, audit dates, model
versions, and remediation tracking. A fairness audit is an investigation
aid, not a guarantee that a model is fair.

### Objective 4 --- SHAP Explanation Dashboard

Use SHAP (SHapley Additive exPlanations) to show which features
contributed to a model's prediction and the direction of those
contributions, using the correct model version and output scale.

### Objective 5 --- What-If Financial Simulator

Allow users to change hypothetical financial values and rerun the
relevant scoring pipeline. Show baseline and scenario outputs side by
side without modifying the original assessment.

### Objective 6 --- Transparent Approval and Rejection Reasons

Display the actual criteria evaluated, recorded reason codes, missing
information, and relevant next steps. Clearly distinguish a model
prediction, an eligibility assessment, and a lender's actual decision.

### Objective 7 --- Digital Financial Passport

Generate a user-controlled PDF that combines selected financial
indicators, score results, income estimates, explanations, relevant
decision information, model metadata, and limitations.

### Supporting engine --- Informal Income Synthesizer

Estimate recurring income from available transaction evidence.
Distinguish gross receipts from net earnings, exclude known transfers
and refunds where possible, and show uncertainty or data-quality
limitations.

------------------------------------------------------------------------

## 4. Target Users

### Primary users

-   Street vendors and small shop owners.
-   Micro-entrepreneurs and self-employed people.
-   Gig workers and delivery partners.
-   Freelancers and independent contractors.
-   People with irregular or multiple income sources.
-   People who want a clearer summary of their financial activity.

### Secondary users

-   Authorized financial reviewers.
-   Lending or credit-risk analysts.
-   Model developers and data scientists.
-   Responsible-AI or model-governance reviewers.
-   Project evaluators who need to inspect the prototype.

Different user roles should have different permissions. Applicant-facing
users should not automatically have access to restricted fairness-audit
data, sensitive group attributes, or other people's records.

------------------------------------------------------------------------

## 5. Core Features

## 5.1 Financial Health Score

### Purpose

Summarize selected aspects of a person's financial stability in a score,
such as a score from 0 to 100. The score is a project-defined indicator,
not an established universal financial-health standard.

### Inputs

Depending on data availability and user consent, the system may use:

-   Average monthly income or receipts.
-   Month-to-month income variability.
-   Monthly expenses.
-   Net cash flow.
-   Savings balance or reserve information.
-   Existing debt obligations.
-   Repayment history, if reliable data is available.
-   Data coverage and completeness indicators.

### Processing flow

1.  Retrieve the validated financial source and assessment period.
2.  Calculate monthly summaries.
3.  Derive indicators such as net cash flow and savings rate.
4.  Normalize eligible indicators to documented scales.
5.  Apply a documented scoring formula.
6.  Record the formula or score version and its inputs.
7.  Return the score, component indicators, and relevant limitations.
8.  Display the result in the dashboard.

Example calculations:

`Net Cash Flow = Income - Expenses`

`Savings Rate = (Income - Expenses) / Income × 100`

The savings-rate calculation must handle zero or negative income.
Monthly surplus and the actual savings balance are different concepts
and should not be confused.

A prototype may use a configurable weighted formula:

`Health Score = Sum(weight_i × normalized_indicator_i)`

The weights should sum to 1 when the component indicators use a 0--100
scale. These weights are design assumptions until they have been
appropriately reviewed and validated.

### UI components

-   Financial Health Score card.
-   Indicator breakdown.
-   Income and expense trend charts.
-   Cash-flow summary.
-   Data quality or completeness notice.
-   Assessment period and timestamp.
-   Explanation links for individual indicators.

### Technologies

-   Python and Pandas for calculations and transaction aggregation.
-   FastAPI for the scoring endpoint.
-   PostgreSQL for assessment history and score versions.
-   React and Tailwind CSS for the interface.
-   Recharts for trends and comparisons.

### Expected output

A score, component indicators, assessment period, data-quality notices,
and an explanation of how the score was derived.

------------------------------------------------------------------------

## 5.2 AI-Powered Explanation

### Purpose

Explain financial metrics and model results in understandable language.

### Inputs

-   Calculated financial indicators.
-   Financial Health Score and its component breakdown.
-   Credit-risk prediction, if available.
-   SHAP values and their feature names.
-   Recorded decision reasons.
-   Data-quality and uncertainty notices.

### Processing flow

1.  Collect the relevant structured outputs.
2.  Select the most important verified factors.
3.  Generate text using templates or a constrained language model.
4.  Validate that every statement is supported by the underlying data.
5.  Return the explanation and the factors supporting it.
6.  Display the explanation beside the relevant score or chart.

### Example

A grounded explanation might say:

> Your records show positive cash flow and reasonably consistent
> deposits. Your existing debt obligations are relatively high compared
> with the income estimate, which may reduce the model's estimated
> repayment capacity.

This example should only be shown when the actual records support those
statements.

### UI components

-   Plain-language summary card.
-   Positive and negative contributing-factor lists.
-   Links to the financial metrics being described.
-   Data limitations and confidence notes.
-   Expandable technical details.
-   Explanation generation or loading status.

### Technologies

-   Python for assembling structured evidence.
-   SHAP for model-grounded contributions.
-   Optional LLM for language generation.
-   FastAPI for the explanation endpoint.
-   React for displaying the result.

For the initial prototype, deterministic templates are a good starting
point. If an LLM is added, it must not change a score, invent a
rejection reason, or present uncertain information as verified fact.

------------------------------------------------------------------------

## 5.3 AI Fairness and Bias Checker

### Purpose

Investigate whether the model's errors, predictions, or decision
outcomes differ across relevant groups.

### Data requirements

A useful audit requires:

-   A defined evaluation dataset.
-   Actual outcomes for the target task, where applicable.
-   Model predictions and decision thresholds.
-   Appropriate group attributes for a lawful, restricted audit.
-   Sufficient sample sizes to interpret group metrics.
-   Model version and evaluation date.

Synthetic data can demonstrate the workflow but cannot establish
real-world fairness.

### Processing flow

1.  Select the model version and evaluation dataset.
2.  Generate predictions using the model being evaluated.
3.  Compare predictions with observed outcomes.
4.  Calculate selected fairness and performance metrics.
5.  Show group-level values, sample sizes, and uncertainty.
6.  Identify potential disparities requiring investigation.
7.  Document corrective actions and reevaluate any updated model.
8.  Store the audit summary and model version.

### Metrics that may be considered

-   Demographic parity difference.
-   Equal opportunity difference.
-   False-positive and false-negative rates.
-   Calibration.
-   Overall model performance by group.

The meaning of a positive prediction must be defined before interpreting
a metric. Different fairness criteria may conflict, so one metric cannot
prove that a model is fair.

### UI components

-   Audit status and date.
-   Model version.
-   Overall performance summary.
-   Group-comparison charts.
-   Sample sizes and limitations.
-   Potential-disparity warnings.
-   Remediation notes and audit history.

### Technologies

-   Fairlearn for selected group-fairness assessments.
-   Scikit-learn for performance metrics.
-   Pandas for dataset preparation.
-   FastAPI for authorized audit results.
-   PostgreSQL for audit metadata and history.
-   React and Recharts for the reviewer dashboard.

### Important boundary

The fairness checker is a model-governance feature. It should not
automatically tell an individual applicant that their own assessment is
fair just because aggregate metrics passed a chosen threshold. Sensitive
audit attributes must be access-controlled and must not be used casually
to lower a person's score.

------------------------------------------------------------------------

## 5.4 SHAP Explanation Dashboard

### Purpose

Explain how input features contribute to a particular machine-learning
prediction.

SHAP values explain a model's output under a specified explanation
setup. They are not causal proof that changing a feature in real life
will cause the same change in repayment behavior.

### Processing flow

1.  Load the approved model and matching preprocessing pipeline.
2.  Prepare the applicant's input using the same feature transformation
    as model training.
3.  Obtain the prediction.
4.  Calculate SHAP values for the appropriate model output.
5.  Identify important positive and negative contributions.
6.  Return feature names, values, contributions, and output-scale
    metadata.
7.  Render a waterfall plot or ranked contribution chart.
8.  Provide a grounded plain-language explanation.

For a scalar model output, the common additive form is:

`Model Output = Baseline Output + Sum of SHAP Contributions`

The scale may be raw output, log-odds, or probability, depending on the
explainer and configuration. The interface must label it accurately.

### UI components

-   Prediction summary.
-   Baseline output.
-   SHAP waterfall visualization.
-   Ranked feature-contribution list.
-   Feature values for the applicant.
-   Plain-language explanations.
-   Model version and explanation scale.

### Technologies

-   SHAP for feature attribution.
-   Scikit-learn or XGBoost for the model.
-   FastAPI for prediction and explanation responses.
-   React for layout and interactions.
-   A supported SHAP visualization or a carefully implemented custom
    chart.

Never substitute invented chart values for SHAP output. Prediction and
explanation must use the same model version.

------------------------------------------------------------------------

## 5.5 What-If Financial Simulator

### Purpose

Let a user explore hypothetical changes to their financial inputs and
compare the resulting assessment with their original baseline.

### Inputs that may be supported

-   Monthly income or receipts.
-   Monthly expenses.
-   Savings balance.
-   Existing debt obligations.
-   Other financial indicators supported by the scoring pipeline.

The UI must validate values and preserve distinctions between
independent inputs and derived metrics.

### Processing flow

1.  Load an existing assessment as the baseline.
2.  Initialize scenario inputs from the approved baseline features.
3.  Let the user change supported values.
4.  Validate the proposed scenario.
5.  Submit the scenario to the backend.
6.  Recalculate dependent financial indicators.
7.  Rerun the same approved scoring pipeline.
8.  Compare baseline and scenario results.
9.  Explain the differences.
10. Discard or save the scenario separately, according to the user's
    choice.

### UI components

-   Editable inputs or sliders.
-   Baseline result cards.
-   Hypothetical result cards.
-   Before-and-after chart.
-   Difference indicators.
-   Scenario explanation.
-   Reset-to-baseline control.
-   Optional save-scenario button.

### Technologies

-   React for state and inputs.
-   React Hook Form and Zod for form validation.
-   FastAPI for scenario evaluation.
-   Python for calculations and model inference.
-   SHAP where appropriate to explain a scenario prediction.
-   Recharts for comparisons.
-   PostgreSQL for scenarios explicitly saved by the user.

The simulator must not mutate the saved baseline assessment. Results are
hypothetical and do not guarantee a lender's decision.

------------------------------------------------------------------------

## 5.6 Transparent Approval and Rejection Reasons

### Purpose

Explain the actual basis of a configured eligibility result or recorded
lending decision.

The system must distinguish a financial-health score, a credit-risk
prediction, an eligibility assessment, and a lender's final decision.

### Processing flow

1.  Load the appropriate assessment and model output.
2.  Load the applicable policy or demonstration criteria.
3.  Evaluate each criterion.
4.  Record which criteria passed or failed.
5.  Generate reason codes from the actual rule results.
6.  Include data-quality limitations and any need for additional
    information.
7.  Display the status and supporting reasons.
8.  Store the policy version, model version, status, reasons, and
    timestamp.

### Example statuses

-   Eligible under configured criteria.
-   Not eligible under configured criteria.
-   More information required.
-   Manual review required.
-   Assessment unavailable because required data is missing.

### UI components

-   Decision status.
-   Criteria checklist.
-   Reason-code list.
-   Missing-data notice.
-   Explanation of the relevant model output.
-   Recommended next steps.
-   Review or appeal information where applicable.

### Technologies

-   Python for decision rules.
-   FastAPI for the decision service.
-   PostgreSQL for decision history.
-   SHAP for model prediction explanation where appropriate.
-   React for the decision screen.

The interface must display recorded reasons rather than inventing
reasons from a chart. Demo rules must be labelled as demo rules unless
they represent an actual lender's authorized criteria.

------------------------------------------------------------------------

## 5.7 Digital Financial Passport

### Purpose

Create a user-controlled, downloadable report of the selected
assessment.

The passport is a project-generated financial report, not a government
identity document or official credit-bureau report.

### Suggested report contents

1.  Report metadata and assessment period.
2.  Applicant-selected profile details.
3.  Financial Health Score and component indicators.
4.  Informal income estimate and uncertainty.
5.  Cash-flow and expense summary.
6.  Credit-risk estimate, if available.
7.  SHAP explanation and relevant charts.
8.  Relevant model-audit status and limitations.
9.  Recorded decision status and reasons, if applicable.
10. Financial improvement suggestions.
11. Model version, report generation date, and intended-use disclaimer.

### Processing flow

1.  User selects the assessment and clicks Generate Passport.
2.  Backend verifies authorization.
3.  Backend retrieves the exact saved assessment version.
4.  Report service assembles approved report content.
5.  ReportLab generates the PDF.
6.  Backend returns an authorized download or secure short-lived link.
7.  User downloads the report.
8.  User chooses whether and how to share it.

### UI components

-   Report preview.
-   Included-section list.
-   Generate button.
-   Loading and failure states.
-   Download button.
-   Report history.
-   User-controlled sharing options where implemented.

### Technologies

-   ReportLab for PDF generation.
-   FastAPI for authorization and report endpoints.
-   PostgreSQL for report metadata.
-   Private storage for persisted report files, if needed.
-   React for preview and download.

The report must use the saved assessment version. It should not silently
rerun a newer model when generating an older assessment's report.

------------------------------------------------------------------------

## 5.8 Informal Income Synthesizer

### Purpose

Estimate recurring income from available financial evidence when the
user does not have conventional salary slips.

### Inputs

-   Transaction date.
-   Transaction amount.
-   Transaction direction, if known.
-   Category or description, if available.
-   Source and period.
-   Known transfers, refunds, and reversals.
-   Business expenses where available.
-   Record-coverage information.

### Processing flow

1.  Accept consented CSV or user-entered financial records.
2.  Validate dates, amounts, columns, and formats.
3.  Detect duplicates and obvious inconsistencies.
4.  Categorize receipts, expenses, transfers, refunds, and unknown
    records.
5.  Aggregate observed transactions by month.
6.  Estimate recurring receipts using documented statistical methods.
7.  Distinguish gross receipts from estimated net earnings.
8.  Calculate variability and data coverage.
9.  Return the estimate with limitations and an appropriate reliability
    indicator.
10. Pass the derived features to the scoring engines.

### Initial implementation

Start with transparent methods:

-   Monthly totals.
-   Rolling averages.
-   Median summaries.
-   Month-to-month variability.
-   Data coverage.
-   Explicit transaction-category rules.
-   Missing-period warnings.

Avoid claiming a precise statistical confidence interval unless the
method supports one. A qualitative reliability indicator may be more
appropriate for an initial prototype.

Do not manufacture missing financial history. Unknown transactions
should remain unknown until appropriately resolved or handled by a
documented method.

------------------------------------------------------------------------

## 6. End-to-End Application Workflow

The complete workflow connects the features into one application.

1.  **Onboarding:** The user registers and receives information about
    data use.
2.  **Consent:** The user authorizes the specific data processing
    required.
3.  **Data collection:** The user enters financial details or uploads
    transaction records.
4.  **Validation:** The backend checks data quality, duplicates, missing
    periods, and invalid records.
5.  **Income estimation:** The income service calculates observed
    receipts and estimates recurring income.
6.  **Feature engineering:** The backend calculates the financial
    indicators required by the scoring models.
7.  **Financial Health Score:** The documented scoring method calculates
    the score.
8.  **Credit-risk assessment:** A validated model estimates risk if
    appropriate labelled data and an approved model are available.
9.  **Explainability:** SHAP generates model contributions; templates or
    a constrained LLM produce plain-language explanations.
10. **Fairness status:** The application retrieves the relevant
    model-audit status. Model-level audits also run during development
    and ongoing monitoring.
11. **What-If simulation:** The user changes hypothetical values and the
    backend reruns the relevant assessment without modifying the
    baseline.
12. **Decision explanation:** Configured criteria or a recorded lender
    decision are displayed with evidence-based reasons.
13. **Digital Passport:** The user generates a report from the saved
    assessment.
14. **History and access:** The application preserves assessment
    versions and enforces access controls.

### Failure and unavailable states

The application must also handle:

-   Invalid or unsupported files.
-   Incomplete financial records.
-   Uncertain transaction categories.
-   Insufficient data for an income estimate.
-   Missing repayment labels for credit-risk training.
-   Unavailable model outputs.
-   Missing or stale fairness audits.
-   SHAP explanation failures.
-   Scenario validation errors.
-   PDF generation errors.
-   Unauthorized report or assessment access.

A missing output must be shown as unavailable or requiring review, not
replaced with a fabricated result.

------------------------------------------------------------------------

## 7. User Interface and Page Structure

### Shared application shell

The authenticated application should use a consistent layout:

-   **Sidebar:** Dashboard, Financial Data, Explain My Score, Fairness
    and Trust, What-If Simulator, Decision Explanation, Digital
    Passport.
-   **Top bar:** Page title, assessment status, profile menu, and
    optional notifications.
-   **Main content:** The selected feature's page.
-   **Responsive behavior:** Sidebar collapses on small screens and
    content stacks vertically.

### Page 1 --- Login and registration

Fields, password controls, validation messages, consent information, and
login/register actions.

### Page 2 --- Financial Data

CSV upload, transaction preview, category correction, validation
warnings, and confirmation.

### Page 3 --- Dashboard

Financial Health Score, income estimate, cash flow, income trend,
assessment status, and recent reports.

### Page 4 --- Explain My Score

Plain-language explanation, SHAP chart, contributing factors, model
version, and limitations.

### Page 5 --- Fairness and Trust

Authorized model audit summary, group metrics, sample sizes, audit date,
and remediation status.

### Page 6 --- What-If Simulator

Editable financial values, baseline/scenario comparison, charts, and
scenario explanations.

### Page 7 --- Decision Explanation

Eligibility status, criteria outcomes, recorded reasons, missing
information, and next steps.

### Page 8 --- Digital Financial Passport

Report preview, included sections, generate button, download status, and
report history.

### UI states that every page should support

-   Initial/loading state.
-   Successful data state.
-   Empty state.
-   Validation-error state.
-   API-error state.
-   Permission-denied state.
-   Unavailable-data state.
-   Mobile/responsive state.

------------------------------------------------------------------------

## 8. Technology Stack

  Technology              Responsibility
  ----------------------- -------------------------------------------------------
  React + TypeScript      Frontend pages, components, typed UI logic
  Tailwind CSS            Layout, styling, responsive design
  React Router            Client-side navigation
  Recharts                Financial trends and comparison charts
  Lucide React            Icons
  TanStack Query          API fetching, caching, and loading/error state
  React Hook Form + Zod   Form state and client-side validation
  Python                  Financial calculations and model workflows
  FastAPI                 Backend APIs and request validation
  Pandas                  Transaction cleaning and aggregation
  Scikit-learn            Baseline models, preprocessing, and evaluation
  XGBoost                 Optional structured-data model, subject to validation
  SHAP                    Feature attribution for model predictions
  Fairlearn               Group-fairness evaluation
  PostgreSQL              Persistent application and assessment data
  ReportLab               PDF generation
  Pytest                  Backend and calculation tests
  Git/GitHub              Version control and collaboration

Start with a **modular monolith**: one FastAPI backend containing
separate modules for each responsibility. This is simpler to build and
test than multiple microservices and can be split later if justified.

------------------------------------------------------------------------

## 9. System Architecture

### Frontend layer

Responsible for:

-   Displaying information.
-   Collecting and validating inputs for usability.
-   Navigating between pages.
-   Sending authenticated requests.
-   Rendering API results.
-   Showing loading, error, and unavailable states.

The frontend must not contain database credentials, private model files,
or authoritative lending rules.

### API and application layer

FastAPI is responsible for:

-   Authentication and authorization.
-   Consent checks.
-   File-upload validation.
-   Assessment orchestration.
-   Request and response schemas.
-   Calling the appropriate processing modules.
-   Applying decision policies.
-   Generating authorized report downloads.

### Data-processing layer

Python modules process transactions, derive indicators, estimate income,
and prepare model features.

### ML and explainability layer

Contains separate modules for:

-   Financial health calculations.
-   Credit-risk prediction.
-   SHAP explanations.
-   Fairness evaluation.
-   Model version management.

The fairness audit should primarily evaluate models using an appropriate
evaluation dataset. It is not simply a per-user score calculation.

### Persistence layer

PostgreSQL stores users, consent records, data-source metadata,
assessment versions, financial metrics, scores, explanations, decisions,
scenarios, fairness-audit summaries, and report metadata.

Raw financial files and generated reports should be stored privately if
retained.

------------------------------------------------------------------------

## 10. Frontend Implementation Plan

### Recommended folders

``` text
frontend/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── queryClient.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppSidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── PageLayout.tsx
│   │   └── ui/
│   ├── features/
│   │   ├── auth/
│   │   ├── financial-data/
│   │   ├── dashboard/
│   │   ├── financial-health/
│   │   ├── explanations/
│   │   ├── fairness/
│   │   ├── simulator/
│   │   ├── decisions/
│   │   └── passport/
│   ├── lib/
│   │   ├── apiClient.ts
│   │   └── formatters.ts
│   ├── types/
│   │   └── api.ts
│   └── main.tsx
├── package.json
└── .env.example
```

### Shared frontend components

Create reusable components rather than rebuilding them for every page:

-   `AppSidebar`
-   `Topbar`
-   `PageLayout`
-   `MetricCard`
-   `ScoreIndicator`
-   `IncomeTrendChart`
-   `DataQualityNotice`
-   `LoadingState`
-   `EmptyState`
-   `ErrorState`
-   `ExplanationPanel`
-   `DecisionReasonList`
-   `ReportDownloadButton`

### API client

Create one shared API client that handles the backend base URL,
authentication strategy, response parsing, and common errors. Define
TypeScript types for API responses rather than using untyped objects
throughout the application.

If cookie-based authentication is used, configure secure cookies and
CSRF protection appropriately. Do not put secrets in frontend
environment variables because browser-exposed variables are not private.

### Frontend implementation order

1.  Create the React + TypeScript project.
2.  Configure Tailwind CSS and shared layout.
3.  Configure routing and authentication.
4.  Build financial data upload and preview.
5.  Connect the dashboard to real API results.
6.  Implement SHAP and AI explanations.
7.  Add fairness and decision pages.
8.  Implement What-If simulation.
9.  Add Digital Passport generation and download.
10. Test loading, error, empty, unauthorized, and mobile states.

------------------------------------------------------------------------

## 11. Backend Modules and Responsibilities

A suggested backend organization:

``` text
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── auth.py
│   │   ├── consents.py
│   │   ├── financial_sources.py
│   │   ├── assessments.py
│   │   ├── explanations.py
│   │   ├── fairness.py
│   │   ├── scenarios.py
│   │   ├── decisions.py
│   │   └── reports.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── permissions.py
│   ├── schemas/
│   ├── models/
│   ├── services/
│   │   ├── transaction_service.py
│   │   ├── income_service.py
│   │   ├── financial_health_service.py
│   │   ├── credit_risk_service.py
│   │   ├── shap_service.py
│   │   ├── explanation_service.py
│   │   ├── fairness_service.py
│   │   ├── scenario_service.py
│   │   ├── decision_service.py
│   │   └── passport_service.py
│   └── tests/
├── requirements.txt
└── .env.example
```

### Service boundaries

-   **Transaction service:** Validates, normalizes, and categorizes
    source records.
-   **Income service:** Calculates income estimates and reliability
    indicators.
-   **Financial health service:** Computes the documented score and
    component metrics.
-   **Credit-risk service:** Loads an approved model and calculates risk
    estimates.
-   **SHAP service:** Explains the matching model's output.
-   **Explanation service:** Creates evidence-grounded natural-language
    summaries.
-   **Fairness service:** Runs or retrieves authorized model-level audit
    results.
-   **Scenario service:** Recalculates a hypothetical assessment without
    altering the baseline.
-   **Decision service:** Applies versioned criteria and records reason
    codes.
-   **Passport service:** Creates a PDF from a selected saved assessment
    version.

Keep calculation logic out of API route handlers where possible. Route
handlers should validate requests, check permissions, call services, and
return typed responses.

------------------------------------------------------------------------

## 12. Proposed API Design

These are proposed endpoints for implementation.

  ----------------------------------------------------------------------------------------
  Method                  Endpoint                                 Purpose
  ----------------------- ---------------------------------------- -----------------------
  POST                    `/api/auth/register`                     Register a user

  POST                    `/api/auth/login`                        Authenticate a user

  POST                    `/api/consents`                          Record consent for a
                                                                   defined purpose

  POST                    `/api/financial-sources/upload`          Upload financial CSV

  POST                    `/api/financial-sources/{id}/validate`   Validate uploaded data

  POST                    `/api/assessments`                       Create an assessment

  GET                     `/api/assessments/{id}`                  Retrieve an authorized
                                                                   assessment

  GET                     `/api/assessments/{id}/explanation`      Retrieve explanation
                                                                   results

  POST                    `/api/scenarios`                         Run a hypothetical
                                                                   scenario

  GET                     `/api/decisions/{id}`                    Retrieve recorded
                                                                   decision reasons

  GET                     `/api/fairness/audits`                   Retrieve authorized
                                                                   audit summaries

  POST                    `/api/reports`                           Generate a Digital
                                                                   Passport

  GET                     `/api/reports/{id}/download`             Download an authorized
                                                                   report
  ----------------------------------------------------------------------------------------

Every endpoint must check access permissions. A user must not be able to
access another person's data by changing an ID in a URL.

Request and response models should explicitly define types, validation
rules, optional fields, and unavailable states. The backend must derive
scores from validated sources rather than trusting a client-submitted
score.

------------------------------------------------------------------------

## 13. Database Design

Suggested logical tables:

  -----------------------------------------------------------------------
  Table                               Purpose
  ----------------------------------- -----------------------------------
  `users`                             Account details and authentication
                                      metadata

  `consents`                          Purpose, scope, status, and
                                      timestamp of consent

  `financial_sources`                 Metadata for uploaded or entered
                                      financial data

  `transactions`                      Normalized financial transactions,
                                      where retention is needed

  `assessments`                       Assessment ID, owner, date, status,
                                      and model version

  `financial_metrics`                 Derived financial indicators

  `scores`                            Financial Health Score and
                                      credit-risk outputs

  `explanations`                      Feature contributions and
                                      explanation metadata

  `fairness_audits`                   Model-level audit metrics,
                                      versions, and dates

  `scenarios`                         Separately stored hypothetical
                                      inputs and outputs

  `decisions`                         Policy version, status, reasons,
                                      and decision metadata

  `reports`                           Report metadata and private file
                                      reference
  -----------------------------------------------------------------------

### Data integrity rules

-   Link each output to an assessment ID.
-   Store model and policy versions.
-   Do not overwrite historical assessment results when a model changes.
-   Keep restricted fairness-audit data separate from applicant-facing
    profiles.
-   Limit retention of raw transactions.
-   Keep report files private and authorize each download.
-   Use database migrations to track schema changes.
-   Record enough metadata to reconstruct how a historical assessment
    was produced.

------------------------------------------------------------------------

## 14. Machine-Learning Strategy

### Model A --- Financial Health Score

Start with a transparent, documented formula. Choose indicators,
normalization rules, missing-data behavior, and weights explicitly.
Validate the score's intended meaning before presenting it as a
real-world assessment.

### Model B --- Informal Income Estimation

Start with monthly aggregation, robust averages, medians, variability,
and data coverage. More advanced forecasting can be added only when the
available time series and validation strategy justify it.

### Model C --- Credit Risk

Start with logistic regression as a baseline. Compare it with a model
such as XGBoost only when a suitable dataset contains historical
repayment outcomes and a defined target.

Evaluate with appropriate held-out data, calibration checks, and
performance metrics. Avoid data leakage between training and test data.

### Model D --- Fairness Evaluation

Evaluate group-level performance, selected fairness metrics, error
rates, and calibration where suitable. Document limitations and
investigate disparities before approving a model.

### Data limitation

A dataset containing only income and expenses is not enough to teach a
model whether borrowers actually repay loans. Synthetic profiles are
useful for a prototype's UI and workflow, but they do not establish
real-world model accuracy or fairness.

Do not use arbitrary labels such as "high income means good borrower" as
a substitute for observed repayment outcomes.

------------------------------------------------------------------------

## 15. Data Requirements and Processing

### Suggested transaction fields

-   Transaction date.
-   Amount.
-   Debit or credit direction, if known.
-   Transaction category, if available.
-   Description or merchant label, if appropriate.
-   Source identifier.
-   Currency.
-   Data-quality or categorization status.

### Data-processing stages

1.  Validate file type, structure, size, and required columns.
2.  Normalize dates, currency, signs, and amounts.
3.  Detect duplicate records.
4.  Identify refunds, reversals, and known internal transfers.
5.  Categorize transactions and flag uncertain categories.
6.  Aggregate monthly totals.
7.  Calculate financial indicators.
8.  Estimate income and report its limitations.
9.  Create the model feature vector using the approved preprocessing
    pipeline.
10. Store derived results with source and assessment references.

Do not assume every incoming transfer is income. Transfers between a
person's own accounts, refunds, borrowed money, and one-time asset sales
may need different treatment.

------------------------------------------------------------------------

## 16. Security, Privacy, Fairness, and Responsible Use

Financial data is sensitive. Security and responsible-use controls must
be designed into the application.

### Authentication and authorization

-   Use secure password hashing or a trusted identity provider.
-   Use a properly configured session or token strategy.
-   Check ownership and role permissions on every protected request.
-   Apply CSRF protections if cookie-based authentication is used.
-   Never expose database credentials or private model files to the
    browser.

### Consent and data handling

-   Explain the purpose of each data-processing operation.
-   Collect only the data required for the selected purpose.
-   Restrict access to raw transaction records.
-   Define retention and deletion policies.
-   Provide appropriate consent-withdrawal and data-management
    mechanisms.
-   Use HTTPS and private storage.
-   Avoid exposing unnecessary details in logs or downloadable reports.

### File security

-   Validate uploads on the backend.
-   Apply file-size limits.
-   Reject malformed records safely.
-   Prevent spreadsheet formula injection in exported data.
-   Avoid executing or trusting uploaded content.

### Responsible model behavior

-   Clearly label estimated income.
-   Distinguish financial health from credit risk.
-   Do not invent rejection reasons.
-   Do not infer that a person is untrustworthy from missing data alone.
-   Show uncertainty and model limitations.
-   Keep model explanations tied to the correct model version.
-   Restrict sensitive audit attributes.
-   Document the purpose and limitations of the scoring method.

For an India-focused product, review applicable Indian data-protection
requirements and relevant lending rules before real-world use. This
README describes a prototype design and does not establish regulatory
compliance.

------------------------------------------------------------------------

## 17. Suggested Project Structure

A repository can contain separate frontend and backend applications:

``` text
explainable-credit-scoring/
├── README.md
├── .gitignore
├── docs/
│   ├── architecture.md
│   ├── feature-specification.md
│   ├── api-specification.md
│   └── data-dictionary.md
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── app/
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── ml/
│   ├── notebooks/
│   ├── training/
│   ├── evaluation/
│   └── model-card.md
├── data/
│   ├── sample/
│   └── README.md
└── reports/
    └── .gitkeep
```

Do not commit real personal financial records, credentials, production
model secrets, or private reports to Git.

------------------------------------------------------------------------

## 18. Development Roadmap

### Phase 1 --- Foundation and data processing

Implement React, FastAPI, PostgreSQL, authentication, consent, CSV
upload, and transaction validation.

**Milestone:** A user can upload records and review validated data.

### Phase 2 --- Income estimation and Financial Health Score

Implement monthly aggregation, income estimates, cash-flow indicators,
documented score calculations, and the main dashboard.

**Milestone:** The dashboard displays reproducible metrics and a
Financial Health Score.

### Phase 3 --- Credit-risk model and SHAP

Prepare suitable data, train a baseline model if repayment labels are
available, evaluate it, and integrate SHAP.

**Milestone:** The application can show a model-grounded risk estimate
and explanation.

### Phase 4 --- Fairness and transparent decisions

Implement fairness metrics, audit history, versioned demonstration
criteria, reason codes, and decision records.

**Milestone:** Users can understand the assessment and authorized
reviewers can inspect model-audit results.

### Phase 5 --- What-If Simulator

Implement controlled inputs, isolated scenarios, model reruns,
comparisons, and explanations.

**Milestone:** Hypothetical changes produce separate results without
changing the saved baseline.

### Phase 6 --- Digital Financial Passport

Create the PDF template, integrate saved assessment results, and
implement secure report generation.

**Milestone:** A user can generate and download the report in one click.

### Phase 7 --- Testing and demonstration

Test calculations, permissions, data validation, model outputs, fairness
metrics, scenario isolation, and report consistency.

**Milestone:** A reproducible end-to-end prototype.

------------------------------------------------------------------------

## 19. Testing and Acceptance Criteria

### Financial data

-   Invalid records are rejected or flagged.
-   Missing values are not silently treated as zero.
-   Duplicate handling is documented.
-   Transfers and refunds are not automatically classified as earnings.

### Income estimation

-   Observed receipts are distinguished from estimated net earnings.
-   Incomplete periods are identified.
-   Uncertainty or data-quality limitations are displayed.

### Financial Health Score

-   Results are reproducible.
-   Calculation weights and normalization are documented.
-   Edge cases, including zero or negative income, are handled.

### AI explanations

-   Statements match the supplied evidence.
-   Unsupported financial claims are not generated.
-   Unavailable outputs are communicated clearly.

### SHAP

-   Explanations match the relevant model version.
-   The output scale is correctly labelled.
-   Feature names and preprocessing are consistent with model training.

### Fairness

-   Metrics include group sizes and relevant limitations.
-   Missing audits are not displayed as passed audits.
-   Results are tied to a specific model version and evaluation dataset.

### What-If simulation

-   Scenarios do not modify the original assessment.
-   Invalid inputs are rejected.
-   Results use the same approved scoring pipeline as the baseline.

### Decisions

-   Displayed reasons match actual rule outcomes or recorded lender
    decisions.
-   The system distinguishes assessment status from final loan approval.
-   Policy and model versions are recorded.

### Digital Passport

-   The report uses the selected saved assessment version.
-   Unauthorized users cannot download the report.
-   The PDF contains the correct metadata and limitations.

### Security

-   Users cannot access another user's records by changing identifiers.
-   Credentials and secrets are not committed to the repository.
-   Uploads and report downloads enforce access controls.

------------------------------------------------------------------------

## 20. Local Development Setup

The following is a proposed setup for the planned architecture. It is
not a claim that a working implementation already exists.

### Prerequisites

-   Node.js and npm.
-   Python.
-   PostgreSQL.
-   Git.
-   A code editor such as VS Code.

### Frontend setup

Create a React + TypeScript application using a suitable Vite template,
then install the UI and data-fetching dependencies.

Example:

``` bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install react-router-dom @tanstack/react-query recharts lucide-react
npm install react-hook-form zod @hookform/resolvers
```

Install and configure Tailwind CSS using the instructions for the
Tailwind version selected for the project. Optional UI component
libraries can be added after the base layout is working.

### Backend setup

Create a virtual environment and install the initial dependencies:

``` bash
cd backend
python -m venv .venv
```

Activate the environment for your operating system, then install the
required packages, including FastAPI, Uvicorn, Pandas, SQLAlchemy, a
PostgreSQL driver, Scikit-learn, SHAP, Fairlearn, ReportLab, and Pytest.

A project-specific `requirements.txt` should pin tested compatible
versions before deployment.

### Environment configuration

Create local environment files from `.env.example`. Configure the
frontend API base URL and backend database connection without committing
secrets.

### Development order

1.  Confirm that the frontend starts.
2.  Confirm that the FastAPI server starts.
3.  Configure the database and migrations.
4.  Connect a basic health endpoint.
5.  Implement authentication and source upload.
6.  Add the scoring and explanation modules.
7.  Test each feature independently.
8.  Run the full workflow using synthetic demonstration data.

Production deployment additionally requires proper HTTPS, secret
management, database migrations, logging, backups, and operational
monitoring.

------------------------------------------------------------------------

## 21. Demo Scenario

Use a synthetic example to demonstrate the end-to-end experience.

### Example applicant

A hypothetical street vendor has four months of recorded business
receipts:

-   Month 1: ₹35,000.
-   Month 2: ₹42,000.
-   Month 3: ₹31,000.
-   Month 4: ₹40,000.

The mean of these observed receipts is ₹37,000 per month. This is not
automatically the vendor's net income because business expenses,
transfers, refunds, and missing transactions must still be considered.

### Demo flow

1.  The applicant registers and reviews the data-use information.
2.  The applicant uploads the synthetic transaction CSV.
3.  The platform displays validation results.
4.  The income service calculates the observed receipt summary and its
    limitations.
5.  The Financial Health Score service calculates its documented score.
6.  If a suitable demo credit-risk model is available, the application
    displays its output and SHAP explanation.
7.  The fairness page displays the audit status of the model and the
    limits of the synthetic dataset.
8.  The applicant changes hypothetical expenses in the simulator.
9.  The system recalculates and compares the scenario without changing
    the baseline.
10. The decision screen displays the configured demo criteria and their
    actual outcomes.
11. The applicant generates the Digital Financial Passport.

Clearly label synthetic data, illustrative scores, and demonstration
policies. Do not present the demonstration as proof of real-world credit
accuracy, fairness, or lending eligibility.

------------------------------------------------------------------------

## 22. Limitations and Future Enhancements

### Initial prototype limitations

-   Synthetic data cannot validate real-world credit-risk performance.
-   A Financial Health Score is only as meaningful as its documented
    indicators and validation.
-   Informal income estimates depend on the quality and coverage of
    financial records.
-   SHAP explains model behavior but does not establish causality.
-   Fairness metrics depend on suitable data, metric choices, and
    context.
-   What-If simulations are hypothetical, not guarantees of real-world
    outcomes.
-   A generated financial passport is not an official credit report.
-   A configured eligibility result is not necessarily a lender's final
    decision.

### Potential future enhancements

-   Additional supported transaction formats.
-   Improved transaction categorization with human review.
-   Better income-estimation methods when sufficient longitudinal data
    exists.
-   Model monitoring and drift detection.
-   Versioned model approval and rollback.
-   More robust fairness monitoring.
-   Localization and accessible multilingual explanations.
-   User-controlled report sharing with expiry and revocation.
-   Secure integrations with authorized financial-data providers where
    appropriate.
-   More detailed assessment history and comparison.
-   Stronger operational monitoring and deployment automation.

Each enhancement should be evaluated against data availability, privacy,
user value, and the ability to test the result reliably.

------------------------------------------------------------------------

## 23. Glossary

  -----------------------------------------------------------------------
  Term                                Meaning
  ----------------------------------- -----------------------------------
  Alternative credit scoring          Credit-risk assessment using
                                      relevant information beyond
                                      conventional credit-history data

  Financial Health Score              A project-defined score summarizing
                                      selected financial-stability
                                      indicators

  Credit risk                         The risk associated with a borrower
                                      failing to meet repayment
                                      obligations

  Informal income estimate            An estimate derived from available
                                      financial evidence, not necessarily
                                      verified net income

  Feature engineering                 Transforming raw records into
                                      inputs suitable for a model

  SHAP                                A method for attributing a model's
                                      prediction to input features

  Fairness audit                      An evaluation of model performance
                                      or outcomes across relevant groups

  What-If simulation                  A hypothetical recalculation using
                                      modified inputs

  Reason code                         A structured identifier for a
                                      documented decision reason

  Model version                       An identifiable release of a
                                      trained model and its associated
                                      configuration

  Digital Financial Passport          A user-controlled report generated
                                      by this application

  Data provenance                     Information about where data came
                                      from and how it was processed
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## Final Project Summary

The Explainable Alternative Credit Scoring & Informal Income Synthesizer
is planned as an integrated financial assessment platform with seven
user-facing objectives and a supporting income-estimation engine.

Its core value is the combination of **financial assessment,
explainability, fairness evaluation, interactive simulation, transparent
decision reasons, and a user-controlled report**.

The recommended implementation order is:

**Financial data collection → Income estimation → Financial Health Score
→ Credit-risk assessment → SHAP and AI explanations → Fairness audits →
What-If simulation → Transparent decision reporting → Digital Financial
Passport.**

Build the application as a modular monolith first, keep outputs
traceable to the data and model versions that produced them, and use
synthetic data for demonstrations until appropriate real-world
validation data and governance are available.
#   I n f o r m a l - I n c o m e - S y n t h e s i z e r  
 