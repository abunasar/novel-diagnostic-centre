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
- **MongoDB Cloud Storage**: Patient reports and lab settings are stored in MongoDB Atlas and accessed through a login-protected API.

---

### 3. Pixel-Perfect A4 Report Printing
- Formatted strictly for standard **A4 paper (210mm x 297mm)**.
- **Two Printing Modes**:
  1. **Full Header Print**: Prints complete laboratory header (Name, Accreditation, Address, Phone, Email) for plain white A4 paper.
  2. **Pre-Printed Letterhead Mode**: Leaves top margin blank so reports print seamlessly on clinic letterhead stationery.
- Includes centered watermark, shaded gray test section banners (`** REPORT OF COMPLETE BLOOD COUNT (CBC) **`), sub-groupings (`TOTAL COUNT`, `DIFFERENTIAL COUNT OF W.B.C`, `OTHER PARAMETERS`), and signatures for Technologists and Pathologists.

---

## 🚀 How to Run

1. **Launch**: Double-click `start.bat`. If Node.js/npm are missing, it downloads a portable Node.js LTS runtime, installs missing packages, then starts the app (internet required on first setup).
2. For manual development, install Node.js 20 or later, then run `npm install` followed by `npm run dev` after setting `VITE_API_URL` in `.env.local` and adding `http://localhost:5173` to `APP_ORIGINS` in Vercel.
3. **Sign in** using the username and password configured in the Vercel environment.
4. **Configure Lab**: Open **Lab Settings** to customize your Lab Name, Address, Contact, and Doctor/Technician details.
5. **Generate Report**: Go to **New Report**, fill patient details, select tests, enter results, and click **Save & Print A4**.
6. **Print A4**: Click **Print A4 Now** (or press `Ctrl + P`), select **A4** paper size, and print.

### React + TypeScript development

The application starts from `src/main.tsx`; reusable page components are under
`src/components/` and use the `.tsx` extension. Run `npm run typecheck` to check the
TypeScript code, `npm run test:api` to test API authentication, and `npm run build` to
create the production bundle. Reports and laboratory settings are loaded and saved through
the authenticated MongoDB API.

The application UI is implemented in the `.tsx` component files. The app uses a Vercel
API with MongoDB Atlas for reports and laboratory settings. Login sessions are kept in
the current browser tab and expire after eight hours.

## GitHub Pages deployment

The frontend is published to GitHub Pages by GitHub Actions when changes are pushed to
`main`. Set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**.
If your default branch is not `main`, update `.github/workflows/deploy.yml`.

### Configure MongoDB and the API

1. Create a MongoDB Atlas database and a database user with access only to the app's
   database. Configure Atlas network access for the Vercel deployment; avoid opening
   access to every IP unless you understand and accept that exposure.
2. Import the project into Vercel. Its `api/` functions provide the protected database
   API; the first deployment creates an empty database (the existing local JSON file is
   not imported).
3. Add these Vercel environment variables for the deployment:
   - `MONGODB_URI`: Atlas connection string.
   - `MONGODB_DB`: database name.
   - `APP_USERNAME`: login username.
   - `APP_PASSWORD`: strong password of at least 12 characters.
   - `APP_AUTH_SECRET`: random secret of at least 32 characters.
   - `APP_ORIGINS`: comma-separated allowed origins, e.g.
     `https://OWNER.github.io,https://YOUR-PROJECT.vercel.app` (optionally include
     `http://localhost:5173` for local development; no paths or trailing slashes).
   - `VITE_API_URL`: this Vercel deployment URL, e.g. `https://YOUR-PROJECT.vercel.app`.
4. Add a GitHub Actions repository variable named `VITE_API_URL` with the Vercel
   deployment URL, e.g. `https://YOUR-PROJECT.vercel.app` (no trailing slash).
5. Redeploy both services after setting their variables. Push to `main` to publish the
   frontend; the Vercel deployment serves the API.

Never put MongoDB credentials in frontend code or GitHub Pages variables. Keep
`MONGODB_URI`, `APP_PASSWORD`, and `APP_AUTH_SECRET` only in Vercel's encrypted
environment settings. The root-level `Report Database.json` is ignored by Git and is not
uploaded or imported; use the in-app backup restore only after intentionally reviewing
the backup contents.
