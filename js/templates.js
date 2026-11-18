// Standard Diagnostic Laboratory Test Templates
// Configured with sub-groupings and reference intervals matching standard clinical laboratory formatting

const WIDAL_DILUTIONS = ["1:20", "1:40", "1:80", "1:160", "1:320"];
const WIDAL_ROWS = [
  { key: "o", label: "“O” typhi", legacyId: "s_typhi_o" },
  { key: "h", label: "“H” typhi", legacyId: "s_typhi_h" },
  { key: "ah", label: "“AH” typhi", legacyId: "s_paratyphi_ah" },
  { key: "bh", label: "“BH” typhi", legacyId: "s_paratyphi_bh" }
];

const TEST_TEMPLATES = {
  cbc: {
    id: "cbc",
    name: "COMPLETE BLOOD COUNT (CBC)",
    shortName: "CBC",
    reportTitle: "REPORT OF COMPLETE BLOOD COUNT (CBC)",
    category: "Haematology",
    sampleType: "EDTA Whole Blood",
    method: "Automated Cell Counter / Microscopy",
    parameters: [
      { id: "hb", name: "Hemoglobin", unit: "g/dl", min: 12.0, max: 16.0, refRange: "12.0 - 16.0 g/dl", type: "number", defaultValue: "10.3", group: null },
      { id: "hb_pct", name: "Hb. %", unit: "%", min: 70, max: 100, refRange: "", type: "number", defaultValue: "70.56", group: null },

      // TOTAL COUNT Group
      { id: "platelets", name: "Platelets", unit: "Lac/cumm", min: 1.5, max: 4.5, refRange: "1.5 - 4.5 Lac/cumm", type: "number", defaultValue: "1.54", group: "TOTAL COUNT" },
      { id: "rbc", name: "Erythrocytes (RBC)", unit: "milli./cumm", min: 4.0, max: 5.8, refRange: "4.0 - 5.8 mill/cumm", type: "number", defaultValue: "3.43", group: "TOTAL COUNT" },
      { id: "wbc", name: "Leucocytes(WBC)", unit: "/cumm", min: 4000, max: 11000, refRange: "4000 - 11000/cumm", type: "number", defaultValue: "10800", group: "TOTAL COUNT" },

      // DIFFERENTIAL COUNT Group
      { id: "neutrophil", name: "Neutrophil", unit: "%", min: 40, max: 70, refRange: "40 - 70 %", type: "number", defaultValue: "68", group: "DIFFERENTIAL COUNT OF W.B.C" },
      { id: "lymphocyte", name: "Lymphocyte", unit: "%", min: 20, max: 40, refRange: "20 - 40 %", type: "number", defaultValue: "28", group: "DIFFERENTIAL COUNT OF W.B.C" },
      { id: "monocyte", name: "Monocyte", unit: "%", min: 1, max: 5, refRange: "01 - 05 %", type: "number", defaultValue: "01", group: "DIFFERENTIAL COUNT OF W.B.C" },
      { id: "eosinophil", name: "Eosinophil", unit: "%", min: 1, max: 6, refRange: "01 - 06 %", type: "number", defaultValue: "03", group: "DIFFERENTIAL COUNT OF W.B.C" },
      { id: "basophils", name: "Basophils", unit: "%", min: 0, max: 1, refRange: "00 - 01 %", type: "number", defaultValue: "00", group: "DIFFERENTIAL COUNT OF W.B.C" },

      // OTHER PARAMETERS Group
      { id: "hct_pcv", name: "HCT(PCV)", unit: "%", min: 35, max: 55, refRange: "35 - 55 %", type: "number", defaultValue: "30.9", group: "OTHER PARAMETERS" },
      { id: "mcv", name: "MCV", unit: "fl", min: 76, max: 100, refRange: "76 - 100 fl", type: "number", defaultValue: "90.1", group: "OTHER PARAMETERS" },
      { id: "mch", name: "MCH", unit: "pg", min: 27, max: 32, refRange: "27 - 32 pg", type: "number", defaultValue: "30", group: "OTHER PARAMETERS" },
      { id: "mchc", name: "MCHC", unit: "g/dl", min: 30, max: 35, refRange: "30 - 35 g/dl", type: "number", defaultValue: "33.3", group: "OTHER PARAMETERS" }
    ],
    defaultRemarks: ""
  },

  blood_group: {
    id: "blood_group",
    name: "BLOOD GROUP & RH FACTOR",
    shortName: "BLOOD GROUP",
    reportTitle: "REPORT OF BLOOD GROUP & RH FACTOR",
    category: "Haematology",
    sampleType: "EDTA Whole Blood",
    method: "Slide Agglutination",
    parameters: [
      { id: "abo_group", name: "ABO Blood Group", unit: "", refRange: "", type: "select", options: ["A", "B", "AB", "O"], defaultValue: "", required: true },
      { id: "rh_factor", name: "Rh Factor", unit: "", refRange: "", type: "select", options: ["Positive (+)", "Negative (-)"], defaultValue: "", required: true }
    ],
    defaultRemarks: ""
  },

  biochemistry: {
    id: "biochemistry",
    name: "BIO-CHEMICAL EXAMINATION",
    shortName: "BIOCHEM",
    reportTitle: "REPORT OF BIO-CHEMICAL EXAMINATION",
    category: "Biochemistry",
    sampleType: "Fluoride Plasma / Serum",
    method: "Semi Auto Analyzer / Enzymatic",
    parameters: [
      { id: "rbs", name: "Blood Sugar Random", unit: "mg/dl", min: 70, max: 140, refRange: "70 - 140 mg/dl", type: "number", defaultValue: "103" },
      { id: "sgpt", name: "SGPT", unit: "IU/L", min: 5, max: 35, refRange: "5 - 35 IU/L", type: "number", defaultValue: "34" },
      { id: "sgot", name: "SGOT", unit: "IU/L", min: 8, max: 40, refRange: "8 - 40 IU/L", type: "number", defaultValue: "25" },
      { id: "alp", name: "Alkaline Phosphatase", unit: "IU / L", min: 60, max: 142, refRange: "60 - 142 U / L", type: "number", defaultValue: "123" },
      { id: "fbs", name: "Blood Sugar Fasting (FBS)", unit: "mg/dl", min: 70, max: 100, refRange: "70 - 100 mg/dl", type: "number", defaultValue: "" },
      { id: "ppbs", name: "Blood Sugar P.P. (PPBS)", unit: "mg/dl", min: 70, max: 140, refRange: "< 140 mg/dl", type: "number", defaultValue: "" }
    ],
    defaultRemarks: ""
  },

  lipid_profile: {
    id: "lipid_profile",
    name: "LIPID PROFILE",
    shortName: "LIPID",
    reportTitle: "REPORT OF LIPID PROFILE",
    category: "Biochemistry",
    sampleType: "Serum (12 hrs Fasting)",
    method: "Enzymatic Colorimetric",
    parameters: [
      { id: "total_chol", name: "Serum Total Cholesterol", unit: "mg/dl", min: 0, max: 200, refRange: "< 200 mg/dl", type: "number", defaultValue: "178" },
      { id: "triglycerides", name: "Serum Triglycerides", unit: "mg/dl", min: 0, max: 150, refRange: "< 150 mg/dl", type: "number", defaultValue: "135" },
      { id: "hdl", name: "HDL Cholesterol", unit: "mg/dl", min: 40, max: 60, refRange: "> 40 mg/dl", type: "number", defaultValue: "48" },
      { id: "ldl", name: "LDL Cholesterol", unit: "mg/dl", min: 0, max: 100, refRange: "< 100 mg/dl", type: "number", defaultValue: "103" },
      { id: "vldl", name: "VLDL Cholesterol", unit: "mg/dl", min: 5, max: 30, refRange: "5 - 30 mg/dl", type: "number", defaultValue: "27" },
      { id: "chol_hdl_ratio", name: "Total Chol / HDL Ratio", unit: "Ratio", min: 3.0, max: 5.0, refRange: "3.3 - 4.4", type: "number", defaultValue: "3.7" }
    ],
    defaultRemarks: ""
  },

  lft: {
    id: "lft",
    name: "LIVER FUNCTION TEST (LFT)",
    shortName: "LFT",
    reportTitle: "REPORT OF LIVER FUNCTION TEST (LFT)",
    category: "Biochemistry",
    sampleType: "Serum",
    method: "Spectrophotometry / Enzymatic",
    parameters: [
      { id: "bili_total", name: "Bilirubin (Total)", unit: "mg/dl", min: 0.2, max: 1.2, refRange: "0.2 - 1.2 mg/dl", type: "number", defaultValue: "0.8" },
      { id: "bili_direct", name: "Bilirubin (Direct)", unit: "mg/dl", min: 0.0, max: 0.3, refRange: "0.0 - 0.3 mg/dl", type: "number", defaultValue: "0.2" },
      { id: "sgot", name: "SGOT (AST)", unit: "IU/L", min: 8, max: 40, refRange: "8 - 40 IU/L", type: "number", defaultValue: "28" },
      { id: "sgpt", name: "SGPT (ALT)", unit: "IU/L", min: 5, max: 35, refRange: "5 - 35 IU/L", type: "number", defaultValue: "32" },
      { id: "alp", name: "Alkaline Phosphatase", unit: "IU / L", min: 60, max: 142, refRange: "60 - 142 U / L", type: "number", defaultValue: "85" },
      { id: "total_protein", name: "Total Protein", unit: "g/dl", min: 6.4, max: 8.3, refRange: "6.4 - 8.3 g/dl", type: "number", defaultValue: "7.4" },
      { id: "albumin", name: "Serum Albumin", unit: "g/dl", min: 3.5, max: 5.2, refRange: "3.5 - 5.2 g/dl", type: "number", defaultValue: "4.2" }
    ],
    defaultRemarks: ""
  },

  kft: {
    id: "kft",
    name: "RENAL / KIDNEY FUNCTION TEST (KFT)",
    shortName: "KFT",
    reportTitle: "REPORT OF KIDNEY FUNCTION TEST (KFT)",
    category: "Biochemistry",
    sampleType: "Serum",
    method: "Urease / Jaffe Kinetic",
    parameters: [
      { id: "blood_urea", name: "Blood Urea", unit: "mg/dl", min: 15, max: 45, refRange: "15 - 45 mg/dl", type: "number", defaultValue: "26" },
      { id: "creatinine", name: "Serum Creatinine", unit: "mg/dl", min: 0.6, max: 1.2, refRange: "0.6 - 1.2 mg/dl", type: "number", defaultValue: "0.9" },
      { id: "uric_acid", name: "Serum Uric Acid", unit: "mg/dl", min: 3.5, max: 7.2, refRange: "3.5 - 7.2 mg/dl", type: "number", defaultValue: "5.1" },
      { id: "calcium", name: "Serum Calcium", unit: "mg/dl", min: 8.5, max: 10.5, refRange: "8.5 - 10.5 mg/dl", type: "number", defaultValue: "9.4" }
    ],
    defaultRemarks: ""
  },

  thyroid: {
    id: "thyroid",
    name: "THYROID PROFILE (T3, T4, TSH)",
    shortName: "TFT",
    reportTitle: "REPORT OF THYROID PROFILE",
    category: "Endocrinology",
    sampleType: "Serum",
    method: "CLIA / EIA Method",
    parameters: [
      { id: "t3", name: "Triiodothyronine (Total T3)", unit: "ng/dl", min: 60, max: 200, refRange: "60 - 200 ng/dl", type: "number", defaultValue: "115" },
      { id: "t4", name: "Thyroxine (Total T4)", unit: "µg/dl", min: 4.5, max: 12.0, refRange: "4.5 - 12.0 µg/dl", type: "number", defaultValue: "8.4" },
      { id: "tsh", name: "Thyroid Stimulating Hormone (TSH)", unit: "µIU/ml", min: 0.35, max: 4.94, refRange: "0.35 - 4.94 µIU/ml", type: "number", defaultValue: "2.45" }
    ],
    defaultRemarks: ""
  },

  widal: {
    id: "widal",
    name: "WIDAL SLIDE AGGLUTINATION TEST",
    shortName: "WIDAL",
    reportTitle: "SEROLOGICAL REPORT",
    category: "Serology",
    sampleType: "Serum",
    method: "Slide Agglutination",
    widalDilutions: WIDAL_DILUTIONS,
    widalRows: WIDAL_ROWS,
    parameters: [
      { id: "mp_kit_result", name: "MP (KIT)", type: "select", options: ["Negative (-ve)", "Positive (+ve)"], defaultValue: "", required: true },
      { id: "widal_overall_result", name: "WIDAL TEST", type: "select", options: ["Negative (-ve)", "Positive (+ve)", "Borderline"], defaultValue: "", required: true },
      ...WIDAL_ROWS.flatMap(row => WIDAL_DILUTIONS.map(dilution => ({
        id: `widal_${row.key}_${dilution.split(":")[1]}`,
        name: `${row.label} ${dilution}`,
        type: "select",
        options: ["+ve", "-ve"],
        defaultValue: "",
        required: true
      })))
    ],
    defaultRemarks: ""
  },

  urine_re: {
    id: "urine_re",
    name: "URINE ROUTINE & MICROSCOPIC",
    shortName: "URINE R/M",
    reportTitle: "REPORT OF URINE EXAMINATION",
    category: "Clinical Pathology",
    sampleType: "Midstream Urine",
    method: "Chemical Strip & Microscopy",
    parameters: [
      { id: "color", name: "Colour", unit: "", refRange: "Pale Yellow", type: "text", defaultValue: "Pale Yellow", group: "PHYSICAL EXAMINATION" },
      { id: "appearance", name: "Appearance", unit: "", refRange: "Clear", type: "text", defaultValue: "Clear", group: "PHYSICAL EXAMINATION" },
      { id: "reaction_ph", name: "Reaction (pH)", unit: "", min: 4.5, max: 8.0, refRange: "4.5 - 8.0", type: "text", defaultValue: "6.0", group: "PHYSICAL EXAMINATION" },
      { id: "urine_protein", name: "Albumin / Protein", unit: "", refRange: "Nil", type: "select", options: ["Nil", "Trace", "+", "++", "+++"], defaultValue: "Nil", group: "CHEMICAL EXAMINATION" },
      { id: "urine_sugar", name: "Sugar", unit: "", refRange: "Nil", type: "select", options: ["Nil", "Trace", "+", "++", "+++"], defaultValue: "Nil", group: "CHEMICAL EXAMINATION" },
      { id: "pus_cells", name: "Pus Cells", unit: "/HPF", refRange: "0 - 4 /HPF", type: "text", defaultValue: "1 - 2", group: "MICROSCOPIC EXAMINATION" },
      { id: "epithelial", name: "Epithelial Cells", unit: "/HPF", refRange: "0 - 5 /HPF", type: "text", defaultValue: "2 - 3", group: "MICROSCOPIC EXAMINATION" },
      { id: "urine_rbc", name: "R.B.C.", unit: "/HPF", refRange: "Nil", type: "text", defaultValue: "Nil", group: "MICROSCOPIC EXAMINATION" }
    ],
    defaultRemarks: ""
  }
};

window.TEST_TEMPLATES = TEST_TEMPLATES;
export { TEST_TEMPLATES, WIDAL_DILUTIONS, WIDAL_ROWS };
