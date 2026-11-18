const TOKEN_KEY = "labflow_session_token";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const DEFAULT_SETTINGS = {
  labName: "NOVEL DIAGNOSTIC CENTRE",
  labTagline: "Centre For Patho Biochem (COMPUTERIZED)",
  regNo: "Reg. No.: 1047-05/00",
  address: "Hira Market, College Road, Churipatti, Kishanganj (Bihar)",
  phone: "7858915582, 7060572350",
  email: "novel.diagnostic@gmail.com",
  website: "www.noveldiagnostic.com",
  technicianName: "ALTAF ALAM",
  technicianDegree: "B.Sc MLT (M.G.M)",
  technicianAdditionalText: "",
  pathologistName: "Dr. ASIF REZA",
  pathologistDegree: "M.B.B.S MD(PAT) DTCD(PAT)",
  referringDoctors: [],
  enableHeaderPrint: true,
  letterheadTopMargin: "42mm",
  currency: "₹",
  footerNote: "This report is based on computerized analyzer findings. For clinical correlation please consult your attending physician."
};

class LabDB {
  isConnected() {
    return Boolean(sessionStorage.getItem(TOKEN_KEY));
  }

  async request(path, { method = "GET", body, authenticated = true } = {}) {
    if (!API_BASE_URL) {
      const setupHint = import.meta.env.DEV
        ? "Set VITE_API_URL in .env.local to your Vercel API URL, then restart start.bat."
        : "Set the VITE_API_URL GitHub Actions variable and redeploy the site.";
      throw new Error(`Backend URL is not configured. ${setupHint}`);
    }

    const headers = { "Content-Type": "application/json" };
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (authenticated && token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL.replace(/\/+$/, "")}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });

    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error(`Backend returned an invalid response (${response.status}).`);
    }

    if (!response.ok) {
      if (response.status === 401) {
        const hadSession = Boolean(token);
        sessionStorage.removeItem(TOKEN_KEY);
        if (hadSession) window.dispatchEvent(new Event("labflow:session-expired"));
      }
      throw new Error(result.error || `Backend request failed (${response.status}).`);
    }
    return result;
  }

  async login(username, password) {
    const result = await this.request("/api/auth/login", {
      method: "POST",
      body: { username, password },
      authenticated: false
    });
    if (typeof result.token !== "string" || !result.token) {
      throw new Error("The backend did not return a valid login session.");
    }
    sessionStorage.setItem(TOKEN_KEY, result.token);
  }

  async restoreSession() {
    if (!this.isConnected()) return false;
    try {
      await this.request("/api/auth/me");
      return true;
    } catch (error) {
      if (!sessionStorage.getItem(TOKEN_KEY)) return false;
      throw error;
    }
  }

  logout() {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  async getSettings() {
    const { settings } = await this.request("/api/settings");
    return { ...DEFAULT_SETTINGS, ...(settings || {}) };
  }

  async saveSettings(settings) {
    const currentSettings = await this.getSettings();
    const updatedAt = Math.max(Date.now(), (Number(currentSettings.updatedAt) || 0) + 1);
    await this.request("/api/settings", {
      method: "PUT",
      body: { settings: { ...settings, updatedAt } }
    });
    return true;
  }

  async getReportByLabNo(labNo) {
    if (!labNo) return null;
    const normalized = labNo.trim().toLowerCase();
    const reports = await this.getAllReports();
    return reports.find(report => report.labNo && report.labNo.trim().toLowerCase() === normalized) || null;
  }

  async getNextLabNo() {
    const all = await this.getAllReports();
    let maxSequence = 0;

    for (const report of all) {
      const text = (report.labNo || "").trim();
      const prefixed = text.match(/^NDC-(\d{6})-(\d{5,})$/i);
      const legacyFormat = text.match(/^\d{6}-(\d{5,})$/);
      const numericOnly = text.match(/^(\d+)/);
      const sequence = prefixed
        ? Number.parseInt(prefixed[2], 10)
        : legacyFormat
          ? Number.parseInt(legacyFormat[1], 10)
          : numericOnly && Number.parseInt(numericOnly[1], 10) > 1047
            ? Number.parseInt(numericOnly[1], 10) - 1047
            : 0;
      maxSequence = Math.max(maxSequence, sequence);
    }

    const now = new Date();
    const datePart = [
      String(now.getDate()).padStart(2, "0"),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getFullYear()).slice(-2)
    ].join("");
    return `NDC-${datePart}-${String(maxSequence + 1).padStart(5, "0")}`;
  }

  async saveReport(report) {
    const { report: saved } = await this.request("/api/reports", {
      method: "POST",
      body: { report }
    });
    return saved;
  }

  async getReport(id) {
    const { report } = await this.request(`/api/reports/${encodeURIComponent(id)}`);
    return report;
  }

  async deleteReport(id) {
    await this.request(`/api/reports/${encodeURIComponent(id)}`, { method: "DELETE" });
    return true;
  }

  async getAllReports() {
    const { reports } = await this.request("/api/reports");
    if (!Array.isArray(reports)) {
      throw new Error("The backend returned an invalid reports list.");
    }
    return this._deduplicateReports(reports);
  }

  _deduplicateReports(list) {
    const latestByKey = new Map();
    for (const report of list || []) {
      const labNo = typeof report.labNo === "string" ? report.labNo.trim().toLowerCase() : "";
      const key = labNo || report.id || `${report.patientName || "p"}_${report.reportDate || "d"}`;
      const existing = latestByKey.get(key);
      if (!existing || this._reportTimestamp(report) >= this._reportTimestamp(existing)) {
        latestByKey.set(key, report);
      }
    }
    return Array.from(latestByKey.values()).sort((a, b) =>
      new Date(b.reportDate || b.createdAt || 0) - new Date(a.reportDate || a.createdAt || 0)
    );
  }

  _reportTimestamp(report) {
    return Date.parse(report.updatedAt || report.createdAt || report.reportDate || "") || 0;
  }

  async filterReports({ dateFilter = "all", startDate = "", endDate = "", query = "" } = {}) {
    const all = await this.getAllReports();
    const now = new Date();
    const formatDate = date => [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
    const today = formatDate(now);
    const yesterday = formatDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
    const weekStart = formatDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6));

    return all.filter(report => {
      const reportDate = (report.reportDate || report.createdAt || "").split("T")[0];
      if (dateFilter === "today" && reportDate !== today) return false;
      if (dateFilter === "yesterday" && reportDate !== yesterday) return false;
      if (dateFilter === "this_week" && (reportDate < weekStart || reportDate > today)) return false;
      if (dateFilter === "this_month" && !reportDate.startsWith(today.slice(0, 7))) return false;
      if (dateFilter === "custom" && startDate && reportDate < startDate) return false;
      if (dateFilter === "custom" && endDate && reportDate > endDate) return false;
      if (query && query.trim()) {
        const q = query.trim().toLowerCase();
        const tests = (report.tests || []).map(test => (test.name || "").toLowerCase()).join(" ");
        const fields = [
          report.patientName,
          report.patientPhone,
          report.labNo || report.id,
          report.referredBy,
          tests
        ].map(value => (value || "").toLowerCase());
        if (!fields.some(value => value.includes(q))) return false;
      }
      return true;
    });
  }

  async getDashboardStats() {
    const all = await this.getAllReports();
    const today = new Date().toISOString().split("T")[0];
    const thisMonth = today.slice(0, 7);
    let todayCount = 0;
    let monthCount = 0;
    let abnormalCount = 0;
    const testTypeCounts = {};
    for (const report of all) {
      const reportDate = (report.reportDate || report.createdAt || "").split("T")[0];
      if (reportDate === today) todayCount++;
      if (reportDate.startsWith(thisMonth)) monthCount++;
      let hasAbnormal = false;
      for (const test of report.tests || []) {
        testTypeCounts[test.name] = (testTypeCounts[test.name] || 0) + 1;
        for (const parameter of test.parameters || []) {
          if (parameter.isAbnormal) hasAbnormal = true;
        }
      }
      if (hasAbnormal) abnormalCount++;
    }
    return {
      totalReports: all.length,
      todayReports: todayCount,
      monthReports: monthCount,
      abnormalCount,
      topTests: Object.entries(testTypeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))
    };
  }

  async exportBackup() {
    return JSON.stringify({
      version: "2.0",
      exportDate: new Date().toISOString(),
      reports: await this.getAllReports(),
      settings: await this.getSettings()
    }, null, 2);
  }

  _parseDataFile(content) {
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      throw new Error("The selected file is not valid JSON: " + error.message);
    }
    if (Array.isArray(parsed)) parsed = { reports: parsed, settings: null };
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.reports)) {
      throw new Error("The JSON file must contain a reports array.");
    }
    if (parsed.reports.some(report => !report || typeof report !== "object" || Array.isArray(report))) {
      throw new Error("The JSON data file contains an invalid reports list.");
    }
    return parsed;
  }

  async importBackup(jsonString) {
    try {
      const imported = this._parseDataFile(jsonString);
      for (const report of imported.reports) {
        await this.saveReport(report);
      }
      if (imported.settings && typeof imported.settings === "object") {
        await this.saveSettings(imported.settings);
      }
      return { success: true, count: imported.reports.length };
    } catch (error) {
      console.error("Backup import error:", error);
      return { success: false, error: error.message };
    }
  }
}

export const labDB = new LabDB();
window.labDB = labDB;
