# LabFlow Pro - Medical Laboratory Management & A4 Report System

A clinical-grade Diagnostic Laboratory Management & A4 Report Generation System built for pathology, biochemistry, haematology, and clinical laboratories.

---

## 🌟 Key Features

### 1. Multi-Profile Diagnostic Report Generation
- **Haematology**: Complete Blood Count (CBC / Hemogram — Hb, RBC, TLC, DLC, Platelets, MCV, MCH, MCHC, ESR), Blood Group & Rh Factor.
- **Biochemistry**:
  - Blood Glucose (FBS, PPBS, RBS, HbA1c, eAG)
  - Lipid Profile (Total Cholesterol, Triglycerides, HDL, LDL, VLDL, Ratios)
  - Liver Function Test (LFT — Bilirubin, SGOT/AST, SGPT/ALT, Alkaline Phosphatase, Total Protein, Albumin, Globulin, A/G Ratio)
  - Renal Function Test (KFT / RFT — Blood Urea, BUN, Serum Creatinine, Uric Acid, Calcium, Electrolytes Na/K/Cl)
- **Endocrinology**: Thyroid Profile (T3, T4, TSH, Free T3, Free T4)
- **Clinical Pathology**: Urine Routine & Microscopic Examination (Physical, Chemical, Microscopic)
- **Serology & Rapid Cards**: Widal Test (Typhoid) with dilution-wise grading and serological summary, Dengue Duo (NS1 + IgM/IgG), Malaria Card, HIV, HBsAg, HCV, VDRL, CRP, RA Factor.
- **Vitamins**: Vitamin D3, Vitamin B12.
- **Real-Time Abnormal High/Low Alerts**: Automatically checks entered numerical results against biological reference ranges and flags out-of-range values in bold red with arrows (**↓** for low, **↑** for high).

---

### 2. Date-Wise Record Keeping & Storage
- **Date Filters**:
  - **Today**: Filter all patient records created today.
  - **Yesterday**: View yesterday's diagnostic records.
  - **Last 7 Days**: Review the past week of patient data.
  - **This Month**: Filter records for the current calendar month.
  - **Custom Range**: Filter by any specified date range (From Date → To Date).
- **Instant Search**: Search records by Patient Name, Phone Number, Patient Code / Lab ID, or Referred Doctor.
- **Record Actions**: Print A4, Edit existing records, or Delete.
- **Excel/CSV Export**: Export filtered patient records directly to CSV.
- **Local JSON File Storage**: Patient reports and lab settings are saved to a JSON file selected on the computer, outside Chrome's browser storage.

---

### 3. Pixel-Perfect A4 Report Printing
- Formatted strictly for standard **A4 paper (210mm x 297mm)**.
- **Two Printing Modes**:
  1. **Full Header Print**: Prints complete laboratory header (Name, Accreditation, Address, Phone, Email) for plain white A4 paper.
  2. **Pre-Printed Letterhead Mode**: Leaves top margin blank so reports print seamlessly on clinic letterhead stationery.
- Includes centered watermark, shaded gray test section banners (`** REPORT OF COMPLETE BLOOD COUNT (CBC) **`), sub-groupings (`TOTAL COUNT`, `DIFFERENTIAL COUNT OF W.B.C`, `OTHER PARAMETERS`), and signatures for Technologists and Pathologists.

---

## 🚀 How to Run

1. Install Node.js 20 or later.
2. **Launch**: Double-click `start.bat`, or run `npm install` followed by `npm run dev`.
3. **Configure Lab**: Open **Lab Settings** to customize your Lab Name, Address, Contact, and Doctor/Technician details.
4. **Connect Data File**: In **Backup & Export**, connect an existing JSON file or create one. Reconnect it whenever the app is reopened; the first connection migrates reports from the previous browser database.
5. **Generate Report**: Go to **New Report**, fill patient details, select tests, enter results, and click **Save & Print A4**.
6. **Print A4**: Click **Print A4 Now** (or press `Ctrl + P`), select **A4** paper size, and print.

### React + TypeScript development

The application starts from `src/main.tsx`; reusable page components are under
`src/components/` and use the `.tsx` extension. Run `npm run typecheck` to check the
TypeScript code and `npm run build` to create the production bundle. The existing reporting
engine loads saved reports from the connected JSON file, preserving report workflows and
A4 printing.

The application UI is implemented in the `.tsx` component files. JSON file access is
provided by Chrome/Edge's File System Access API and requires the app to be served from
localhost or HTTPS. Keep the JSON file in a backed-up location; the browser will ask you
to reconnect it after a restart or browser reset. The first connection migrates reports
from the previous IndexedDB and LocalStorage stores into that file.

## GitHub Pages deployment

This repository includes a GitHub Actions workflow that builds and deploys the site to
GitHub Pages whenever changes are pushed to `main` (or when manually triggered from the
Actions tab). In the repository settings, set **Pages → Build and deployment → Source**
to **GitHub Actions**. If your default branch is not `main`, update the branch in
`.github/workflows/deploy.yml`.

GitHub Pages hosts only the static application; it does not provide a server or shared
database. Reports remain in the JSON file selected by the user or in that browser's local
storage and are not uploaded to Pages by the app. **Do not commit real patient reports or
other personal/medical data.** The root-level `Report Database.json` is ignored by Git;
if it was committed earlier, remove it from the repository and its history before
publishing publicly.
