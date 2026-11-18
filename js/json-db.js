// Stores reports in a user-selected JSON file outside browser storage.
class LabDB {
  constructor() {
    this.dataFileHandle = null;
    this.data = {
      version: "2.0",
      reports: [],
      settings: null,
      migration: {}
    };
    this.initPromise = Promise.resolve(true);
  }

  isDataFileConnected() {
    return Boolean(this.dataFileHandle);
  }

  async connectDataFile(createNew = false) {
    let handle;
    if (createNew) {
      if (typeof window.showSaveFilePicker !== "function") {
        throw new Error("JSON file storage needs a recent Chrome or Edge browser.");
      }
      handle = await window.showSaveFilePicker({
        suggestedName: "Report Database.json",
        types: [{
          description: "JSON data file",
          accept: { "application/json": [".json"] }
        }]
      });
    } else {
      if (typeof window.showOpenFilePicker !== "function") {
        throw new Error("JSON file storage needs a recent Chrome or Edge browser.");
      }
      const handles = await window.showOpenFilePicker({
        multiple: false,
        types: [{
          description: "JSON data file",
          accept: { "application/json": [".json"] }
        }]
      });
      handle = handles[0];
    }

    let permission = await handle.queryPermission({ mode: "readwrite" });
    if (permission !== "granted") {
      permission = await handle.requestPermission({ mode: "readwrite" });
    }
    if (permission !== "granted") {
      throw new Error("Write permission was not granted for the selected JSON file.");
    }

    const file = await handle.getFile();
    let storedData = null;
    if (file.size > 0) {
      storedData = this._parseDataFile(await file.text());
    }

    const documentData = storedData || {
      version: "2.0",
      reports: [],
      settings: null,
      migration: {}
    };

    if (!documentData.migration || !documentData.migration.legacyDataImportedAt) {
      const legacyData = await this._readLegacyData();
      documentData.reports = this._deduplicateReports([
        ...documentData.reports,
        ...legacyData.reports
      ]);
      if (!documentData.settings) {
        documentData.settings = legacyData.settings;
      }
      documentData.migration = {
        ...documentData.migration,
        legacyDataImportedAt: new Date().toISOString()
      };
    }

    documentData.version = "2.0";
    documentData.reports = this._deduplicateReports(documentData.reports);
    this._validateReports(documentData.reports);
    await this._writeData(documentData, handle);
    this.dataFileHandle = handle;
    this.data = documentData;
    this._cacheSettings(documentData.settings);
    return { name: handle.name, count: documentData.reports.length };
  }

  _parseDataFile(content) {
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      throw new Error("The selected file is not valid JSON: " + error.message);
    }

    if (Array.isArray(parsed)) {
      parsed = { version: "1.0", reports: parsed, settings: null, migration: {} };
    }
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.reports)) {
      throw new Error("The JSON file must contain a reports array.");
    }
    this._validateReports(parsed.reports);
    return {
      ...parsed,
      reports: parsed.reports,
      settings: parsed.settings && typeof parsed.settings === "object" ? parsed.settings : null,
      migration: parsed.migration && typeof parsed.migration === "object" ? parsed.migration : {}
    };
  }

  _validateReports(reports) {
    if (!Array.isArray(reports) || reports.some(report => !report || typeof report !== "object" || Array.isArray(report))) {
      throw new Error("The JSON data file contains an invalid reports list.");
    }
  }

  async _readLegacyData() {
    const reports = this._getReportsLocalStorage();
    let localSettings = null;
    try {
      const savedSettings = localStorage.getItem("lab_profile_settings");
      localSettings = savedSettings ? JSON.parse(savedSettings) : null;
    } catch (error) {
      throw new Error("Could not read the previous laboratory settings: " + error.message);
    }

    const indexedDBFactory = window.indexedDB;
    if (!indexedDBFactory) {
      return { reports, settings: localSettings };
    }

    if (typeof indexedDBFactory.databases === "function") {
      const databases = await indexedDBFactory.databases();
      if (!databases.some(database => database.name === "LabFlowDB")) {
        return { reports, settings: localSettings };
      }
    }

    const legacy = await new Promise((resolve, reject) => {
      const request = indexedDBFactory.open("LabFlowDB");
      let databaseDidNotExist = false;
      request.onupgradeneeded = event => {
        if (event.oldVersion === 0) {
          databaseDidNotExist = true;
          event.target.transaction.abort();
        }
      };
      request.onsuccess = event => {
        const db = event.target.result;
        const result = { reports: [], settings: null };
        const stores = [];
        if (db.objectStoreNames.contains("reports")) stores.push("reports");
        if (db.objectStoreNames.contains("settings")) stores.push("settings");
        if (stores.length === 0) {
          db.close();
          resolve(result);
          return;
        }

        const transaction = db.transaction(stores, "readonly");
        if (stores.includes("reports")) {
          const reportsRequest = transaction.objectStore("reports").getAll();
          reportsRequest.onsuccess = () => {
            result.reports = reportsRequest.result || [];
          };
        }
        if (stores.includes("settings")) {
          const settingsRequest = transaction.objectStore("settings").get("lab_profile");
          settingsRequest.onsuccess = () => {
            result.settings = settingsRequest.result && settingsRequest.result.data
              ? settingsRequest.result.data
              : null;
          };
        }
        transaction.oncomplete = () => {
          db.close();
          resolve(result);
        };
        transaction.onerror = () => {
          db.close();
          reject(transaction.error || new Error("Could not read old IndexedDB records."));
        };
        transaction.onabort = () => {
          db.close();
          reject(transaction.error || new Error("Reading old IndexedDB records was aborted."));
        };
      };
      request.onerror = event => {
        if (databaseDidNotExist) {
          resolve({ reports: [], settings: null });
          return;
        }
        reject(event.target.error || new Error("Could not open the old report database."));
      };
    });

    const legacySettings = this._newerSettings(localSettings, legacy.settings);
    return {
      reports: reports.concat(legacy.reports),
      settings: legacySettings
    };
  }

  _newerSettings(first, second) {
    if (!first) return second || null;
    if (!second) return first;
    return (Number(second.updatedAt) || 0) > (Number(first.updatedAt) || 0)
      ? second
      : first;
  }

  _cacheSettings(settings) {
    if (!settings) return;
    try {
      localStorage.setItem("lab_profile_settings", JSON.stringify(settings));
    } catch (error) {
      console.warn("Could not cache laboratory settings in browser storage:", error);
    }
  }

  async _writeData(data = this.data, handle = this.dataFileHandle) {
    if (!handle) {
      throw new Error("Connect or create a JSON data file before saving records.");
    }
    const writable = await handle.createWritable();
    try {
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
    } catch (error) {
      let message = error.message;
      try {
        await writable.abort();
      } catch (abortError) {
        message += "; cleanup failed: " + abortError.message;
      }
      throw new Error("Could not save the JSON data file: " + message);
    }
  }

  async getSettings() {
    const defaults = {
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

    let localSettings = {};
    try {
      const local = localStorage.getItem("lab_profile_settings");
      if (local) localSettings = JSON.parse(local);
    } catch (error) {
      throw new Error("Could not read laboratory settings: " + error.message);
    }
    return { ...defaults, ...localSettings, ...(this.data.settings || {}) };
  }

  async saveSettings(settings) {
    const currentSettings = await this.getSettings();
    const updatedAt = Math.max(Date.now(), (Number(currentSettings.updatedAt) || 0) + 1);
    const settingsToSave = { ...settings, updatedAt };
    const updatedData = { ...this.data, settings: settingsToSave };
    await this._writeData(updatedData);
    this.data = updatedData;
    this._cacheSettings(settingsToSave);
    return true;
  }

  async getReportByLabNo(labNo) {
    if (!labNo) return null;
    const normalized = labNo.trim().toLowerCase();
    const all = await this.getAllReports();
    return all.find(report => report.labNo && report.labNo.trim().toLowerCase() === normalized) || null;
  }

  async getNextLabNo() {
    const all = await this.getAllReports();
    let maxSequence = 0;

    const extractSequence = (labNo) => {
      if (!labNo) return 0;
      const text = labNo.trim();
      const prefixed = text.match(/^NDC-(\d{6})-(\d{5,})$/i);
      if (prefixed) return parseInt(prefixed[2], 10);

      const legacyFormat = text.match(/^\d{6}-(\d{5,})$/);
      if (legacyFormat) return parseInt(legacyFormat[1], 10);

      const numericOnly = text.match(/^(\d+)/);
      if (numericOnly) {
        const legacyNumber = parseInt(numericOnly[1], 10);
        if (legacyNumber > 1047) return legacyNumber - 1047;
      }

      return 0;
    };

    for (const report of all) {
      maxSequence = Math.max(maxSequence, extractSequence(report.labNo));
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
    await this.initPromise;
    const reports = await this.getAllReports();
    if (report.labNo && report.labNo.trim()) {
      const cleanLabNo = report.labNo.trim().toLowerCase();
      const existing = reports.find(record =>
        (record.labNo && record.labNo.trim().toLowerCase() === cleanLabNo) ||
        (report.id && record.id === report.id)
      );
      if (existing) {
        report.id = existing.id;
        if (!report.createdAt) report.createdAt = existing.createdAt;
      }
    }
    if (!report.id) {
      report.id = "REP-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(Math.random() * 900 + 100);
    }
    if (!report.createdAt) report.createdAt = new Date().toISOString();
    report.updatedAt = new Date().toISOString();

    const index = reports.findIndex(record => record.id === report.id);
    if (index >= 0) reports[index] = report;
    else reports.unshift(report);
    const updatedData = { ...this.data, reports: this._deduplicateReports(reports) };
    await this._writeData(updatedData);
    this.data = updatedData;
    return report;
  }

  _getReportsLocalStorage() {
    try {
      const data = localStorage.getItem("lab_reports_db");
      if (!data) return [];
      const reports = JSON.parse(data);
      this._validateReports(reports);
      return reports;
    } catch (error) {
      throw new Error("Could not read the previous browser records: " + error.message);
    }
  }

  async getReport(id) {
    return (await this.getAllReports()).find(report => report.id === id) || null;
  }

  async deleteReport(id) {
    const reports = (await this.getAllReports()).filter(report => report.id !== id);
    const updatedData = { ...this.data, reports };
    await this._writeData(updatedData);
    this.data = updatedData;
    return true;
  }

  async getAllReports() {
    await this.initPromise;
    if (this.dataFileHandle) {
      const file = await this.dataFileHandle.getFile();
      if (file.size === 0) {
        throw new Error("The connected JSON data file is empty. Reconnect a valid data file.");
      }
      const latestData = this._parseDataFile(await file.text());
      this.data = { ...this.data, ...latestData };
    }
    return this._deduplicateReports(this.data.reports || []);
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

  async importBackup(jsonString) {
    try {
      if (!this.isDataFileConnected()) {
        throw new Error("Connect a JSON data file before restoring a backup.");
      }
      const imported = this._parseDataFile(jsonString);
      const updatedData = {
        ...this.data,
        reports: this._deduplicateReports([...(this.data.reports || []), ...imported.reports]),
        settings: imported.settings || this.data.settings
      };
      await this._writeData(updatedData);
      this.data = updatedData;
      this._cacheSettings(updatedData.settings);
      return { success: true, count: imported.reports.length };
    } catch (error) {
      console.error("Backup import error:", error);
      return { success: false, error: error.message };
    }
  }
}

export const labDB = new LabDB();
window.labDB = labDB;
