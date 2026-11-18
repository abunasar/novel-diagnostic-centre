// LabFlow Pro - Main Application Logic
// Implements exact clinical report formatting, typography, red arrows (↓/↑), gray section bars & watermark

export class LabApp {
  constructor() {
    this.currentView = "dashboard";
    this.selectedTestIds = new Set();
    this.settings = null;
    this.dateFilter = "today";
    this.searchQuery = "";
    this.customStartDate = "";
    this.customEndDate = "";
    this.modalZoom = 1.0;
    this.clockInterval = null;
    this.handleKeyDown = null;
    this.eventListeners = [];
    this.destroyed = false;
    this.pendingDeleteConfirmation = null;
    this.previousDeleteFocus = null;
    this.init().catch(error => {
      if (!this.destroyed) {
        this.showToast(error instanceof Error ? error.message : String(error), "error", "Could not load laboratory data");
      }
    });
  }

  destroy() {
    this.destroyed = true;

    if (this.clockInterval !== null) {
      window.clearInterval(this.clockInterval);
      this.clockInterval = null;
    }

    if (this.handleKeyDown) {
      window.removeEventListener("keydown", this.handleKeyDown);
      this.handleKeyDown = null;
    }

    this.eventListeners.forEach(({ target, type, listener, options }) => {
      target.removeEventListener(type, listener, options);
    });
    this.eventListeners = [];

    if (this.pendingDeleteConfirmation) {
      this.finishDeleteConfirmation(false);
    }
  }

  listen(target, type, listener, options) {
    if (this.destroyed) return;
    target.addEventListener(type, listener, options);
    this.eventListeners.push({ target, type, listener, options });
  }

  async init() {
    this.settings = await window.labDB.getSettings();
    if (this.destroyed) return;
    this.updateDatabaseStatus(window.labDB.isConnected());
    this.applySettingsToUI();
    this.setupNavigation();
    this.renderTestCheckboxes();
    this.resetReportForm();
    this.setupEventListeners();
    this.startLiveClock();

    await this.refreshDashboard();
    await this.refreshRecordsTable();
  }

  updateDatabaseStatus(connected) {
    const storagePill = document.getElementById("database-status");
    const storageText = storagePill && storagePill.querySelector(".offline-text");
    const connectionStatus = document.getElementById("database-connection-status");
    if (storageText) {
      storageText.textContent = connected ? "MongoDB Connected" : "MongoDB Not Connected";
    }
    if (storagePill) {
      storagePill.classList.toggle("connected", connected);
      storagePill.title = connected
        ? "Reports and laboratory settings are stored in MongoDB."
        : "Sign in to connect to the laboratory database.";
    }
    if (connectionStatus) {
      connectionStatus.textContent = connected
        ? "Connected to MongoDB. Reports and laboratory settings are stored in the cloud."
        : "MongoDB is not connected. Sign in to access the laboratory database.";
    }
  }

  startLiveClock() {
    const clockEl = document.getElementById("topbar-live-clock");
    if (!clockEl) return;
    const update = () => {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      clockEl.textContent = now.toLocaleDateString('en-US', options);
    };
    update();
    this.clockInterval = window.setInterval(update, 1000);
  }

  setupNavigation() {
    document.querySelectorAll(".nav-link").forEach(link => {
      this.listen(link, "click", (e) => {
        e.preventDefault();
        const targetView = link.getAttribute("data-view");
        if (targetView === "new-report" && this.currentView !== "new-report" && this.getVal("report-edit-id")) {
          this.resetReportForm();
        }

        // Auto close mobile drawer on nav click
        const sidebar = document.getElementById("sidebar");
        const backdrop = document.getElementById("sidebar-backdrop");
        if (sidebar && sidebar.classList.contains("open")) {
          sidebar.classList.remove("open");
          if (backdrop) backdrop.classList.remove("active");
        }

        this.navigate(targetView);
      });
    });

    const btnTopNew = document.getElementById("btn-top-new-report");
    if (btnTopNew) {
      this.listen(btnTopNew, "click", () => {
        this.resetReportForm();
        this.navigate("new-report");
      });
    }

    const btnDashboardNew = document.getElementById("btn-dashboard-new-report");
    if (btnDashboardNew) {
      this.listen(btnDashboardNew, "click", () => {
        this.resetReportForm();
        this.navigate("new-report");
      });
    }

    document.querySelectorAll("[data-dashboard-view]").forEach(button => {
      this.listen(button, "click", () => {
        const targetView = button.getAttribute("data-dashboard-view");
        if (targetView) this.navigate(targetView);
      });
    });

    const btnViewAll = document.getElementById("btn-view-all-records");
    if (btnViewAll) this.listen(btnViewAll, "click", () => this.navigate("records"));
  }

  navigate(viewName) {
    this.currentView = viewName;

    document.querySelectorAll(".nav-link").forEach(l => {
      l.classList.toggle("active", l.getAttribute("data-view") === viewName);
    });

    document.querySelectorAll(".view-panel").forEach(panel => {
      panel.classList.toggle("active", panel.id === `view-${viewName}`);
    });

    const titleEl = document.getElementById("page-title-text");
    const titles = {
      dashboard: "Dashboard",
      "new-report": "New Test Report",
      records: "Date-wise Diagnostic Records",
      settings: "Laboratory & Doctor Settings",
      backup: "Data Safety & Backup"
    };
    if (titleEl) titleEl.textContent = titles[viewName] || "LabFlow Pro";

    if (viewName === "dashboard") {
      this.refreshDashboard();
    } else if (viewName === "records") {
      this.refreshRecordsTable();
    } else if (viewName === "settings") {
      this.applySettingsToUI();
    }
  }

  applySettingsToUI(preserveReferralDoctor = true) {
    if (!this.settings) return;
    const s = this.settings;
    let reg = typeof s.regNo === "string" ? s.regNo.trim() : "";
    if (reg.toLowerCase().includes("nabl")) reg = "Reg. No.: 1047-05/00";

    this.setVal("set-lab-name", s.labName !== undefined ? s.labName : "NOVEL DIAGNOSTIC CENTRE");
    this.setVal("set-lab-tagline", s.labTagline !== undefined ? s.labTagline : "Centre For Patho Biochem (COMPUTERIZED)");
    this.setVal("set-lab-reg", reg);
    this.setVal("set-lab-phone", s.phone !== undefined ? s.phone : "7858915582, 7060572350");
    this.setVal("set-lab-address", s.address !== undefined ? s.address : "Hira Market, College Road, Churipatti, Kishanganj (Bihar)");
    this.setVal("set-lab-email", s.email !== undefined ? s.email : "novel.diagnostic@gmail.com");
    this.setVal("set-lab-website", s.website !== undefined ? s.website : "");
    this.setVal("set-doc-name", s.pathologistName !== undefined ? s.pathologistName : "Dr. ASIF REZA");
    this.setVal("set-doc-degree", s.pathologistDegree !== undefined ? s.pathologistDegree : "M.B.B.S MD(PAT) DTCD(PAT)");
    this.setVal("set-tech-name", s.technicianName !== undefined ? s.technicianName : "ALTAF ALAM");
    this.setVal("set-tech-degree", s.technicianDegree !== undefined ? s.technicianDegree : "B.Sc MLT (M.G.M)");
    this.setVal("set-tech-additional-text", s.technicianAdditionalText !== undefined ? s.technicianAdditionalText : "");
    this.renderReferringDoctorFields(Array.isArray(s.referringDoctors) ? s.referringDoctors : []);
    this.setVal("set-default-print-mode", s.enableHeaderPrint ? "header" : "letterhead");
    this.setVal("set-letterhead-margin", s.letterheadTopMargin || "42mm");
    const defaultDoctor = `${s.pathologistName || ""} ${s.pathologistDegree || ""}`.trim();
    this.renderReferringDoctorOptions(preserveReferralDoctor ? undefined : "");
  }

  renderReferringDoctorFields(doctors) {
    const container = document.getElementById("set-referring-doctors");
    if (!container) return;

    const names = Array.isArray(doctors)
      ? doctors.map(name => typeof name === "string" ? name : "")
      : [];
    if (names.length === 0) names.push("");

    container.innerHTML = "";
    names.forEach((name, index) => {
      const row = document.createElement("div");
      row.className = "referring-doctor-row";

      const input = document.createElement("input");
      input.type = "text";
      input.className = "form-control referring-doctor-input";
      input.value = name;
      input.placeholder = `Doctor ${index + 1} name`;
      input.setAttribute("aria-label", `Referring doctor ${index + 1}`);
      row.appendChild(input);

      if (names.length > 1) {
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "referring-doctor-action remove";
        removeButton.setAttribute("aria-label", `Remove doctor ${index + 1}`);
        removeButton.title = "Remove doctor";
        removeButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14" /></svg>';
        removeButton.addEventListener("click", () => {
          const currentNames = Array.from(container.querySelectorAll(".referring-doctor-input"))
            .map(field => field.value);
          currentNames.splice(index, 1);
          this.renderReferringDoctorFields(currentNames);
        });
        row.appendChild(removeButton);
      }

      if (index === names.length - 1) {
        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "referring-doctor-action add";
        addButton.setAttribute("aria-label", "Add another referring doctor");
        addButton.title = names.length >= 10 ? "Maximum of 10 doctors reached" : "Add another doctor";
        addButton.disabled = names.length >= 10;
        addButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>';
        addButton.addEventListener("click", () => {
          if (names.length >= 10) return;

          const currentNames = Array.from(container.querySelectorAll(".referring-doctor-input"))
            .map(field => field.value);
          currentNames.push("");
          this.renderReferringDoctorFields(currentNames);
          const inputs = container.querySelectorAll(".referring-doctor-input");
          inputs[inputs.length - 1].focus();
        });
        row.appendChild(addButton);
      }

      container.appendChild(row);
    });
  }

  renderReferringDoctorOptions(selectedValue) {
    const select = document.getElementById("patient-doctor");
    if (!select) return;

    const settingsDoctors = this.settings && Array.isArray(this.settings.referringDoctors)
      ? this.settings.referringDoctors
      : [];
    const defaultDoctor = this.settings && this.settings.pathologistName
      ? `${this.settings.pathologistName} ${this.settings.pathologistDegree || ""}`.trim()
      : "";
    const selected = (selectedValue !== undefined ? selectedValue : (select.value || "")).trim();
    const names = ["Self", ...settingsDoctors, defaultDoctor, selected];
    const uniqueNames = [];
    const seenNames = new Set();

    names.forEach(name => {
      if (typeof name !== "string") return;
      const cleanName = name.trim();
      const key = cleanName.toLowerCase();
      if (cleanName && !seenNames.has(key)) {
        seenNames.add(key);
        uniqueNames.push(cleanName);
      }
    });

    select.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select Doctor";
    select.appendChild(placeholder);

    uniqueNames.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
    select.value = uniqueNames.includes(selected) ? selected : "";
  }

  async saveLabSettingsFromUI() {
    const referringDoctors = [];
    const seenDoctors = new Set();
    const doctorList = document.getElementById("set-referring-doctors");
    const doctorInputs = doctorList
      ? doctorList.querySelectorAll(".referring-doctor-input")
      : [];
    doctorInputs.forEach(input => {
      const name = input.value.trim();
      const key = name.toLowerCase();
      if (name && !seenDoctors.has(key)) {
        seenDoctors.add(key);
        referringDoctors.push(name);
      }
    });

    if (referringDoctors.length > 10) {
      this.showToast("Please enter no more than 10 referring doctors.", "warning");
      const lastAllowedInput = doctorInputs[10];
      if (lastAllowedInput) lastAllowedInput.focus();
      return;
    }

    const s = {
      labName: this.getVal("set-lab-name").trim() || "NOVEL DIAGNOSTIC CENTRE",
      labTagline: this.getVal("set-lab-tagline").trim(),
      regNo: this.getVal("set-lab-reg").trim(),
      phone: this.getVal("set-lab-phone").trim(),
      address: this.getVal("set-lab-address").trim(),
      email: this.getVal("set-lab-email").trim(),
      website: this.getVal("set-lab-website").trim(),
      pathologistName: this.getVal("set-doc-name").trim(),
      pathologistDegree: this.getVal("set-doc-degree").trim(),
      technicianName: this.getVal("set-tech-name").trim(),
      technicianDegree: this.getVal("set-tech-degree").trim(),
      technicianAdditionalText: this.getVal("set-tech-additional-text").trim(),
      referringDoctors,
      enableHeaderPrint: this.getVal("set-default-print-mode") === "header",
      letterheadTopMargin: this.getVal("set-letterhead-margin") || "42mm",
      footerNote: "This report is based on computerized analyzer findings."
    };

    try {
      await window.labDB.saveSettings(s);
    } catch (err) {
      this.showToast(err instanceof Error ? err.message : String(err), "error", "Save failed");
      return;
    }

    this.settings = s;
    this.applySettingsToUI(false);
    this.showToast("Laboratory settings have been saved.", "success", "Settings saved");
  }

  renderTestCheckboxes() {
    const container = document.getElementById("test-checkboxes-container");
    if (!container) return;
    container.innerHTML = "";

    const templates = window.TEST_TEMPLATES || {};
    for (const [id, tpl] of Object.entries(templates)) {
      const card = document.createElement("div");
      card.className = `test-select-card ${this.selectedTestIds.has(id) ? "selected" : ""}`;
      card.id = `card-select-${id}`;

      card.innerHTML = `
        <input type="checkbox" id="chk-${id}" value="${id}" ${this.selectedTestIds.has(id) ? "checked" : ""}>
        <div>
          <div class="test-select-name">${tpl.name}</div>
          <div class="test-select-meta">${tpl.category} • ${tpl.parameters.length} parameters</div>
        </div>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.tagName !== "INPUT") {
          const chk = card.querySelector("input");
          if (!chk || chk.disabled) return;
          chk.checked = !chk.checked;
          this.toggleTestSelection(id, chk.checked);
        }
      });

      card.querySelector("input").addEventListener("change", (e) => {
        this.toggleTestSelection(id, e.target.checked);
      });

      container.appendChild(card);
    }
  }

  toggleTestSelection(testId, isSelected) {
    if (this.getVal("report-edit-id")) return;

    if (isSelected) {
      this.selectedTestIds.add(testId);
    } else {
      this.selectedTestIds.delete(testId);
    }

    const card = document.getElementById(`card-select-${testId}`);
    if (card) card.classList.toggle("selected", isSelected);

    this.renderSelectedParameters();
  }

  setTestProfilesLocked(locked) {
    const container = document.getElementById("test-checkboxes-container");
    if (!container) return;

    container.classList.toggle("is-readonly", locked);
    container.setAttribute("aria-disabled", String(locked));
    container.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.disabled = locked;
    });

    const hint = document.getElementById("test-selection-hint");
    if (hint) {
      hint.textContent = locked
        ? "Test profiles cannot be changed while editing; edit results below."
        : "(Multiple tests can be selected together)";
    }
  }

  renderSelectedParameters() {
    const container = document.getElementById("test-parameters-container");
    if (!container) return;
    container.innerHTML = "";

    const templates = window.TEST_TEMPLATES || {};

    this.selectedTestIds.forEach(testId => {
      const tpl = templates[testId];
      if (!tpl) return;

      const block = document.createElement("div");
      block.className = "test-param-block";
      block.dataset.testId = testId;

      let parameterContent = "";

      if (tpl.id === "widal") {
        const parameterById = new Map(tpl.parameters.map(parameter => [parameter.id, parameter]));
        const selectHtml = parameter => `
          <select class="param-value-input form-control" data-param-id="${parameter.id}" ${parameter.required ? "required" : ""}>
            <option value="" selected>Select result</option>
            ${parameter.options.map(option => `<option value="${option}">${option}</option>`).join("")}
          </select>
        `;
        const summaryHtml = tpl.parameters.slice(0, 2).map(parameter => `
          <label class="widal-summary-field">
            <span>${parameter.name} *</span>
            ${selectHtml(parameter)}
          </label>
        `).join("");
        const rowsHtml = tpl.widalRows.map(row => `
          <tr>
            <th scope="row">${row.label}</th>
            ${tpl.widalDilutions.map(dilution => {
              const paramId = `widal_${row.key}_${dilution.split(":")[1]}`;
              return `<td>${selectHtml(parameterById.get(paramId))}</td>`;
            }).join("")}
          </tr>
        `).join("");

        parameterContent = `
          <div class="widal-summary-fields">${summaryHtml}</div>
          <div class="table-responsive">
            <table class="widal-result-table">
              <thead>
                <tr>
                  <th scope="col">GRADING</th>
                  ${tpl.widalDilutions.map(dilution => `<th scope="col">${dilution}</th>`).join("")}
                </tr>
              </thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </div>
        `;
      } else {
        let paramRows = "";
        let currentGroup = null;

        tpl.parameters.forEach(p => {
          if (p.group && p.group !== currentGroup) {
            currentGroup = p.group;
            paramRows += `
              <tr style="background: #f1f5f9;">
                <td colspan="4" style="font-weight: 800; font-size: 11.5px; text-transform: uppercase; color: #000000; padding: 6px 14px;">
                  ${currentGroup}
                </td>
              </tr>
            `;
          }

          const defaultVal = p.defaultValue !== undefined ? p.defaultValue : "";
          let inputHtml = "";

          if (p.type === "select" && Array.isArray(p.options)) {
            const placeholder = defaultVal ? "" : '<option value="" selected>Select result</option>';
            const opts = p.options.map(opt => `<option value="${opt}" ${opt === defaultVal ? "selected" : ""}>${opt}</option>`).join("");
            inputHtml = `<select class="param-value-input form-control" data-param-id="${p.id}" ${p.required ? "required" : ""}>${placeholder}${opts}</select>`;
          } else {
            inputHtml = `
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="${p.type === 'number' ? 'number' : 'text'}" 
                       step="any"
                       class="param-value-input" 
                       data-param-id="${p.id}" 
                       data-min="${p.min !== undefined ? p.min : ''}" 
                       data-max="${p.max !== undefined ? p.max : ''}" 
                       value="${defaultVal}"
                       placeholder="Result">
                <span class="badge badge-normal param-flag-badge" style="display:none;" id="flag-${testId}-${p.id}">NORMAL</span>
              </div>
            `;
          }

          paramRows += `
            <tr data-param-row="${p.id}">
              <td style="font-weight: 600; width: 35%; padding-left: ${p.group ? '22px' : '14px'};">${p.name}</td>
              <td style="width: 30%;">${inputHtml}</td>
              <td style="width: 15%; color: #64748b; font-weight: 600;">${p.unit || "-"}</td>
              <td style="width: 20%; color: #475569; font-size: 12px;">${p.refRange || "-"}</td>
            </tr>
          `;
        });

        parameterContent = `
          <div class="table-responsive">
            <table class="test-param-table">
              <thead>
                <tr>
                  <th>INVESTIGATION</th>
                  <th>RESULT</th>
                  <th>UNITS</th>
                  <th>NORMAL RANGE</th>
                </tr>
              </thead>
              <tbody>${paramRows}</tbody>
            </table>
          </div>
        `;
      }

      block.innerHTML = `
        <div class="test-param-header">
          <div class="test-param-title">
            <span style="color: #0284c7;">●</span>
            <span>${tpl.name}</span>
          </div>
          <span style="font-size: 12px; color: #64748b;">Method: ${tpl.method || "Standard"}</span>
        </div>
        ${parameterContent}
      `;

      container.appendChild(block);

      block.querySelectorAll(".param-value-input").forEach(input => {
        this.evaluateParamValue(input, testId);

        const onValueChange = () => {
          this.evaluateParamValue(input, testId);
          this.handleAutoCalculations(testId, input.dataset.paramId);
        };

        input.addEventListener("input", onValueChange);
        input.addEventListener("change", onValueChange);
        input.addEventListener("keyup", onValueChange);
      });

      // Run automatic calculations on initial render
      this.handleAutoCalculations(testId);
    });
  }

  // Automatic medical calculation formulas (Hb %, PCV, RBC from Hb & MCH, MCV, MCHC, LFT, Lipid)
  handleAutoCalculations(testId, changedParamId) {
    const block = document.querySelector(`.test-param-block[data-test-id="${testId}"]`);
    if (!block) return;

    const getNum = (id) => {
      const inp = block.querySelector(`[data-param-id="${id}"]`);
      return inp ? parseFloat(inp.value) : NaN;
    };
    const setNum = (id, val) => {
      const inp = block.querySelector(`[data-param-id="${id}"]`);
      if (inp && val !== undefined && val !== null && !isNaN(val)) {
        inp.value = val;
        this.evaluateParamValue(inp, testId);
      }
    };

    if (testId === "cbc") {
      const hb = getNum("hb");
      let rbc = getNum("rbc");
      let pcv = getNum("hct_pcv");
      let mch = getNum("mch");

      // CASE A: User changed Hb (or on initial load)
      if (changedParamId === "hb" || !changedParamId) {
        if (!isNaN(hb) && hb > 0) {
          // 1. Hb % = (Actual Hb / 14.6) * 100
          const hbPct = ((hb / 14.6) * 100).toFixed(2);
          setNum("hb_pct", hbPct);

          // 2. PCV / HCT ~ Hb * 3 (Rule of Three in Haematology)
          const autoPcv = (hb * 3).toFixed(1);
          setNum("hct_pcv", autoPcv);
          pcv = parseFloat(autoPcv);

          // 3. RBC = (Hb * 10) / MCH (Formula: e.g. 10.3 * 10 / 30 = 3.43)
          if (!isNaN(mch) && mch > 0) {
            const autoRbc = ((hb * 10) / mch).toFixed(2);
            setNum("rbc", autoRbc);
            rbc = parseFloat(autoRbc);
          } else if (!isNaN(rbc) && rbc > 0) {
            const autoMch = ((hb * 10) / rbc).toFixed(1);
            setNum("mch", autoMch);
            mch = parseFloat(autoMch);
          }

          // 4. MCV = (PCV * 10) / RBC
          if (!isNaN(pcv) && pcv > 0 && !isNaN(rbc) && rbc > 0) {
            const autoMcv = ((pcv * 10) / rbc).toFixed(1);
            setNum("mcv", autoMcv);
          }

          // 5. MCHC = (Hb * 100) / PCV
          if (!isNaN(pcv) && pcv > 0) {
            const autoMchc = ((hb * 100) / pcv).toFixed(1);
            setNum("mchc", autoMchc);
          }
        }
      }
      // CASE B: User changed MCH (Formula: RBC = (Hb * 10) / MCH)
      else if (changedParamId === "mch") {
        if (!isNaN(hb) && hb > 0 && !isNaN(mch) && mch > 0) {
          const autoRbc = ((hb * 10) / mch).toFixed(2);
          setNum("rbc", autoRbc);
          rbc = parseFloat(autoRbc);

          if (!isNaN(pcv) && pcv > 0 && !isNaN(rbc) && rbc > 0) {
            const autoMcv = ((pcv * 10) / rbc).toFixed(1);
            setNum("mcv", autoMcv);
          }
        }
      }
      // CASE C: User directly typed RBC
      else if (changedParamId === "rbc") {
        if (!isNaN(rbc) && rbc > 0) {
          if (!isNaN(hb) && hb > 0) {
            const mchVal = (hb * 10) / rbc;
            const autoMch = (Math.abs(mchVal - Math.round(mchVal)) < 0.05) ? Math.round(mchVal) : mchVal.toFixed(1);
            setNum("mch", autoMch);
          }
          if (!isNaN(pcv) && pcv > 0) {
            const autoMcv = ((pcv * 10) / rbc).toFixed(1);
            setNum("mcv", autoMcv);
          }
        }
      }
      // CASE D: User directly typed HCT / PCV
      else if (changedParamId === "hct_pcv") {
        if (!isNaN(pcv) && pcv > 0) {
          if (!isNaN(rbc) && rbc > 0) {
            const autoMcv = ((pcv * 10) / rbc).toFixed(1);
            setNum("mcv", autoMcv);
          }
          if (!isNaN(hb) && hb > 0) {
            const autoMchc = ((hb * 100) / pcv).toFixed(1);
            setNum("mchc", autoMchc);
          }
        }
      }
    } else if (testId === "lft") {
      const prot = getNum("total_protein");
      const alb = getNum("albumin");
      if (!isNaN(prot) && !isNaN(alb) && prot >= alb) {
        const glob = (prot - alb).toFixed(1);
        setNum("globulin", glob);
        if (parseFloat(glob) > 0) {
          setNum("ag_ratio", (alb / parseFloat(glob)).toFixed(2));
        }
      }
    } else if (testId === "lipid_profile") {
      const tg = getNum("triglycerides");
      const chol = getNum("total_chol");
      const hdl = getNum("hdl");
      if (!isNaN(tg) && tg > 0) {
        setNum("vldl", (tg / 5).toFixed(1));
      }
      if (!isNaN(chol) && !isNaN(hdl) && hdl > 0) {
        setNum("chol_hdl_ratio", (chol / hdl).toFixed(1));
      }
      if (!isNaN(chol) && !isNaN(hdl) && !isNaN(tg) && tg < 400) {
        const autoLdl = (chol - hdl - (tg / 5)).toFixed(1);
        if (parseFloat(autoLdl) > 0) setNum("ldl", autoLdl);
      }
    }
  }

  evaluateParamValue(inputEl, testId) {
    const val = parseFloat(inputEl.value);
    const min = parseFloat(inputEl.dataset.min);
    const max = parseFloat(inputEl.dataset.max);
    const paramId = inputEl.dataset.paramId;
    const badge = document.getElementById(`flag-${testId}-${paramId}`);

    inputEl.classList.remove("is-high", "is-low");

    if (isNaN(val) || (isNaN(min) && isNaN(max))) {
      if (badge) badge.style.display = "none";
      return;
    }

    if (!isNaN(max) && val > max) {
      inputEl.classList.add("is-high");
      if (badge) {
        badge.style.display = "inline-flex";
        badge.className = "badge badge-high";
        badge.textContent = "HIGH ▲";
      }
    } else if (!isNaN(min) && val < min) {
      inputEl.classList.add("is-low");
      if (badge) {
        badge.style.display = "inline-flex";
        badge.className = "badge badge-low";
        badge.textContent = "LOW ▼";
      }
    } else {
      if (badge) {
        badge.style.display = "inline-flex";
        badge.className = "badge badge-normal";
        badge.textContent = "NORMAL";
      }
    }
  }

  async resetReportForm() {
    const today = new Date().toISOString().split("T")[0];

    this.setVal("report-edit-id", "");
    this.setVal("patient-lab-id", "");
    this.setVal("patient-report-date", today);
    this.setVal("patient-collection-date", today);
    this.setVal("patient-name", "");
    this.setVal("patient-age", "");
    this.setVal("patient-age-unit", "Years");
    this.setVal("patient-gender", "Male");
    this.setVal("patient-phone", "");

    this.setVal("patient-doctor", "");
    this.setVal("patient-sample-type", "EDTA Blood & Serum");
    this.setVal("report-doctor-remarks", "");

    this.setTestProfilesLocked(false);
    this.selectedTestIds = new Set();
    document.querySelectorAll(".test-select-card").forEach(c => {
      const chk = c.querySelector("input");
      if (chk) {
        chk.checked = this.selectedTestIds.has(chk.value);
        c.classList.toggle("selected", chk.checked);
      }
    });

    this.renderSelectedParameters();

    const nextLabNo = await window.labDB.getNextLabNo();
    if (!this.getVal("patient-lab-id").trim()) {
      this.setVal("patient-lab-id", nextLabNo);
    }
  }

  fillDummyPatient() {
    // Demo patient fill removed
  }

  async collectReportDataFromForm() {
    let labNo = this.getVal("patient-lab-id").trim();
    const patientName = this.getVal("patient-name").trim().toUpperCase();
    const age = this.getVal("patient-age").trim();
    const ageUnit = this.getVal("patient-age-unit");
    const gender = this.getVal("patient-gender");
    let reportDate = this.getVal("patient-report-date");
    let collectionDate = this.getVal("patient-collection-date") || reportDate;
    const phone = this.getVal("patient-phone").trim();
    const referredBy = this.getVal("patient-doctor").trim();
    const sampleType = this.getVal("patient-sample-type").trim();
    const remarks = this.getVal("report-doctor-remarks").trim();
    const editId = this.getVal("report-edit-id");

    if (!patientName) {
      this.showToast("Please enter the patient name before saving.", "warning", "Patient name required");
      const pInp = document.getElementById("patient-name");
      if (pInp) pInp.focus();
      return null;
    }

    const ageInput = document.getElementById("patient-age");
    if (!age || (ageInput && !ageInput.checkValidity())) {
      this.showToast("Please enter a valid patient age.", "warning", "Patient age required");
      if (ageInput) ageInput.focus();
      return null;
    }

    if (!referredBy) {
      this.showToast("Please select who referred this patient.", "warning", "Referral required");
      const referredByInput = document.getElementById("patient-doctor");
      if (referredByInput) referredByInput.focus();
      return null;
    }

    this.selectedTestIds = new Set(
      Array.from(document.querySelectorAll(".test-select-card input:checked"))
        .map(input => input.value)
    );

    if (this.selectedTestIds.size === 0) {
      this.showToast("Please select at least one test profile before saving.", "warning", "Test profile required");
      const firstTest = document.querySelector(".test-select-card input");
      if (firstTest) firstTest.focus();
      return null;
    }

    // Auto-fill optional fields if left empty
    if (!labNo) {
      labNo = await window.labDB.getNextLabNo();
      this.setVal("patient-lab-id", labNo);
    }
    if (!reportDate) {
      reportDate = new Date().toISOString().split("T")[0];
      this.setVal("patient-report-date", reportDate);
    }
    if (!collectionDate) {
      collectionDate = reportDate;
    }

    const templates = window.TEST_TEMPLATES || {};
    const tests = [];
    let hasAbnormal = false;
    let missingRequiredResult = null;
    let missingRequiredInput = null;

    this.selectedTestIds.forEach(testId => {
      const tpl = templates[testId];
      if (!tpl) return;

      const block = document.querySelector(`.test-param-block[data-test-id="${testId}"]`);
      if (!block) return;

      const collectedParams = [];

      tpl.parameters.forEach(p => {
        const input = block.querySelector(`[data-param-id="${p.id}"]`);
        const val = input ? input.value : "";
        let isAbnormal = false;
        let arrow = "";

        if (p.required && !val && !missingRequiredResult) {
          missingRequiredResult = p.name;
          missingRequiredInput = input;
        }

        if (p.type === "number") {
          const num = parseFloat(val);
          const min = parseFloat(p.min);
          const max = parseFloat(p.max);
          if (!isNaN(num)) {
            if (!isNaN(max) && num > max) {
              isAbnormal = true;
              arrow = "↑";
              hasAbnormal = true;
            } else if (!isNaN(min) && num < min) {
              isAbnormal = true;
              arrow = "↓";
              hasAbnormal = true;
            }
          }
        }

        collectedParams.push({
          id: p.id,
          name: p.name,
          value: val,
          unit: p.unit || "",
          refRange: p.refRange || "",
          group: p.group || null,
          isAbnormal,
          arrow
        });
      });

      tests.push({
        id: tpl.id,
        name: tpl.name,
        reportTitle: tpl.reportTitle || `REPORT OF ${tpl.name}`,
        category: tpl.category,
        method: tpl.method || "Standard",
        sampleType: tpl.sampleType,
        parameters: collectedParams
      });
    });

    if (missingRequiredResult) {
      this.showToast(`Please select a result for ${missingRequiredResult}.`, "warning", "Test result required");
      if (missingRequiredInput) missingRequiredInput.focus();
      return null;
    }

    return {
      id: editId || undefined,
      labNo,
      patientName,
      patientAge: `${age} ${ageUnit}`,
      patientGender: gender,
      patientPhone: phone,
      referredBy,
      sampleType: sampleType || "Blood / Serum",
      reportDate,
      collectionDate,
      remarks,
      hasAbnormal,
      tests
    };
  }

  async saveReport(andPrint = false) {
    if (this.isSaving) return;
    this.isSaving = true;

    const btnSave = document.getElementById("btn-save-report-only");
    const btnSavePrint = document.getElementById("btn-save-and-print");
    const btnSaveLabel = btnSave && btnSave.querySelector(".button-label");
    const btnSavePrintLabel = btnSavePrint && btnSavePrint.querySelector(".button-label");
    if (btnSave) {
      btnSave.disabled = true;
      if (btnSaveLabel) btnSaveLabel.textContent = "Saving...";
    }
    if (btnSavePrint) {
      btnSavePrint.disabled = true;
      if (btnSavePrintLabel) btnSavePrintLabel.textContent = "Saving...";
    }

    try {
      const reportData = await this.collectReportDataFromForm();
      if (!reportData) return;

      const saved = await window.labDB.saveReport(reportData);
      // CRITICAL FIX: Set report-edit-id immediately so repeated clicks update THIS record
      this.setVal("report-edit-id", saved.id);

      await this.refreshDashboard();
      await this.refreshRecordsTable();

      this.showToast(`Report ${saved.labNo} for ${saved.patientName} was saved successfully.`, "success", "Report saved");

      if (andPrint) {
        this.openA4PrintPreview(saved);
      } else {
        await this.resetReportForm();
        this.navigate("records");
      }
    } catch (err) {
      this.showToast("Error saving report: " + err.message, "error", "Save failed");
    } finally {
      this.isSaving = false;
      if (btnSave) {
        btnSave.disabled = false;
        if (btnSaveLabel) btnSaveLabel.textContent = "Save Record";
      }
      if (btnSavePrint) {
        btnSavePrint.disabled = false;
        if (btnSavePrintLabel) btnSavePrintLabel.textContent = "Save & Print";
      }
    }
  }

  showToast(message, type = "success", title) {
    const variants = {
      success: {
        title: "Success",
        icon: '<path d="M20 6 9 17l-5-5"/>'
      },
      warning: {
        title: "Attention",
        icon: '<path d="M12 9v4m0 4h.01"/><path d="M10.3 3.9 1.8 18.1A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z"/>'
      },
      error: {
        title: "Something went wrong",
        icon: '<path d="m18 6-12 12M6 6l12 12"/>'
      },
      info: {
        title: "Notice",
        icon: '<path d="M12 16v-4m0-4h.01"/><circle cx="12" cy="12" r="10"/>'
      }
    };
    const variant = variants[type] ? type : "info";
    const config = variants[variant];
    let region = document.getElementById("app-notification-region");
    if (!region) {
      region = document.createElement("div");
      region.id = "app-notification-region";
      region.className = "notification-region";
      region.setAttribute("aria-label", "Notifications");
      document.body.appendChild(region);
    }

    const toast = document.createElement("article");
    toast.className = `app-toast app-toast--${variant}`;
    const isUrgent = variant === "error" || variant === "warning";
    toast.setAttribute("role", isUrgent ? "alert" : "status");
    toast.setAttribute("aria-live", isUrgent ? "assertive" : "polite");
    toast.innerHTML = `
      <span class="app-toast__content">
        <strong class="app-toast__title"></strong>
        <span class="app-toast__message"></span>
      </span>
      <span class="app-toast__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">${config.icon}</svg>
      </span>
      <span class="app-toast__timer" aria-hidden="true"></span>
    `;
    toast.querySelector(".app-toast__title").textContent = title || config.title;
    toast.querySelector(".app-toast__message").textContent = String(message);

    const duration = 5000;
    toast.style.setProperty("--toast-duration", `${duration}ms`);
    let dismissTimer;
    const dismiss = () => {
      clearTimeout(dismissTimer);
      if (!toast.isConnected) return;
      toast.classList.add("is-leaving");
      setTimeout(() => toast.remove(), 220);
    };

    toast.classList.add("is-visible");
    region.appendChild(toast);
    dismissTimer = setTimeout(dismiss, duration);
  }

  openA4PrintPreview(report) {
    const modal = document.getElementById("print-modal");
    const container = document.getElementById("a4-render-sheet");
    if (!modal || !container) return;

    this.renderA4Sheet(report, container);

    const toggle = document.getElementById("modal-letterhead-toggle");
    if (toggle) {
      toggle.checked = true;
      this.setLetterheadMode(toggle.checked);
    }

    // Auto-fit zoom on mobile/tablets
    const screenWidth = window.innerWidth;
    if (screenWidth < 850) {
      const scale = Math.max(0.4, Math.min(1.0, (screenWidth - 36) / 820));
      this.setModalZoom(scale);
    } else {
      this.setModalZoom(1.0);
    }

    modal.classList.add("active");
  }

  setModalZoom(zoom) {
    this.modalZoom = Math.max(0.35, Math.min(1.8, Math.round(zoom * 100) / 100));
    const sheet = document.getElementById("a4-render-sheet");
    const zoomText = document.getElementById("zoom-level-text");
    if (sheet) {
      sheet.style.transform = `scale(${this.modalZoom})`;
      sheet.style.transformOrigin = "top center";
      if (this.modalZoom > 1) {
        sheet.style.marginBottom = `${(this.modalZoom - 1) * 900}px`;
      } else {
        sheet.style.marginBottom = "20px";
      }
    }
    if (zoomText) {
      zoomText.textContent = `${Math.round(this.modalZoom * 100)}%`;
    }
  }

  renderA4Sheet(report, container) {
    const s = this.settings || {};
    const labName = s.labName || "NOVEL DIAGNOSTIC CENTRE";
    const labTagline = s.labTagline || "Centre For Patho Biochem (COMPUTERIZED)";
    let regVal = typeof s.regNo === "string" ? s.regNo.trim() : "";
    if (regVal.toLowerCase().includes("nabl")) regVal = "Reg. No.: 1047-05/00";
    const displayRegNo = !regVal
      ? ""
      : (regVal.toLowerCase().startsWith("reg") || regVal.toLowerCase().startsWith("no."))
      ? regVal
      : `Reg. No.: ${regVal}`;

    const phone = s.phone || "7858915582, 7060572350";
    const email = s.email || "novel.diagnostic@gmail.com";
    const address = s.address || "Hira Market, College Road, Churipatti, Kishanganj (Bihar)";
    const docName = s.pathologistName || "Dr. ASIF REZA";
    const docDegree = s.pathologistDegree || "M.B.B.S MD(PAT) DTCD(PAT)";
    const techName = s.technicianName || "ALTAF ALAM";
    const techDegree = s.technicianDegree || "B.Sc MLT (M.G.M)";
    const techAdditionalText = String(s.technicianAdditionalText || "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[character]);

    // Date format DD/MM/YYYY
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const parts = dateStr.split("-");
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return dateStr;
    };

    const repDateFormatted = formatDate(report.reportDate);
    const colDateFormatted = formatDate(report.collectionDate) || repDateFormatted;

    // Test sections HTML
    let testSectionsHtml = "";

    (report.tests || []).forEach(test => {
      if (test.id === "widal") {
        const widalTemplate = window.TEST_TEMPLATES && window.TEST_TEMPLATES.widal;
        if (widalTemplate) {
          const parametersById = new Map((test.parameters || []).map(parameter => [parameter.id, parameter]));
          const getValue = id => {
            const parameter = parametersById.get(id);
            return parameter ? parameter.value || "" : "";
          };
          const legacyOverall = getValue("widal_result");
          const overallResult = getValue("widal_overall_result") ||
            (legacyOverall.includes("Positive") ? "Positive (+ve)"
              : legacyOverall.includes("Negative") ? "Negative (-ve)"
                : legacyOverall.includes("Borderline") ? "Borderline" : "—");
          const mpResult = getValue("mp_kit_result") || "—";
          const rowsHtml = widalTemplate.widalRows.map(row => {
            const legacyTiter = getValue(row.legacyId);
            const thresholdMatch = /^1:(\d+)$/.exec(legacyTiter);
            const cellsHtml = widalTemplate.widalDilutions.map(dilution => {
              const paramId = `widal_${row.key}_${dilution.split(":")[1]}`;
              const currentParameter = parametersById.get(paramId);
              const value = currentParameter
                ? currentParameter.value || "—"
                : thresholdMatch && Number(dilution.split(":")[1]) <= Number(thresholdMatch[1]) ? "+ve" : "-ve";
              return `<td>${value}</td>`;
            }).join("");
            return `<tr><th scope="row">${row.label}</th>${cellsHtml}</tr>`;
          }).join("");
          const reportTitle = widalTemplate.reportTitle;

          testSectionsHtml += `
            <div class="test-section-bar">
              ** ${reportTitle.replace(/^\*\*|\*\*$/g, '').trim()} **
            </div>
            <div class="widal-report-summary">
              <div><strong>MP (KIT):-</strong><span>${mpResult}</span></div>
              <div><strong>WIDAL TEST:-</strong><span>${overallResult}</span></div>
            </div>
            <table class="widal-report-table">
              <thead>
                <tr>
                  <th scope="col">GRADING</th>
                  ${widalTemplate.widalDilutions.map(dilution => `<th scope="col">${dilution}</th>`).join("")}
                </tr>
              </thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          `;
          return;
        }
      }

      let rowsHtml = "";
      let lastGroup = null;

      (test.parameters || []).forEach(p => {
        if (p.group && p.group !== lastGroup) {
          lastGroup = p.group;
          rowsHtml += `
            <tr>
              <td colspan="4" class="subgroup-heading">
                ${lastGroup}
              </td>
            </tr>
          `;
        }

        let valDisplay = p.value || "";
        let valClass = "val-normal";

        if (p.isAbnormal) {
          valClass = "val-abnormal";
          const arrowSymbol = p.arrow || "↓";
          valDisplay = `${arrowSymbol}${p.value}`;
        }

        rowsHtml += `
          <tr>
            <td style="width: 40%; font-weight: ${p.group ? '500' : '600'}; padding-left: ${p.group ? '10px' : '4px'};">
              ${p.name}
            </td>
            <td class="${valClass}" style="width: 16%;">
              ${valDisplay}
            </td>
            <td style="width: 18%;">
              ${p.unit || ''}
            </td>
            <td style="width: 26%;">
              ${p.refRange || ''}
            </td>
          </tr>
        `;
      });

      const sectionTitle = test.reportTitle || `REPORT OF ${test.name}`;

      testSectionsHtml += `
        <div class="test-section-bar">
          ** ${sectionTitle.replace(/^\*\*|\*\*$/g, '').trim()} **
        </div>
        <table class="report-data-table">
          <thead>
            <tr>
              <th class="col-inv">INVESTIGATION</th>
              <th class="col-result">RESULT</th>
              <th class="col-units">UNITS</th>
              <th class="col-range">NORMAL RANGE</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      `;
    });

    container.innerHTML = `
      <!-- Background Watermark (Circular Lab Logo) -->
      <div class="report-watermark">
        <img src="assets/lab-watermark.png" alt="Lab Watermark">
      </div>

      <!-- 1. Lab Header -->
      <div class="report-header">
        <div class="report-header-left">
          <img src="assets/lab-logo.png" class="report-logo-img" alt="Lab Logo">
          <div>
            <div class="report-lab-name">${labName}</div>
            <div class="report-lab-tagline">${labTagline}</div>
            ${displayRegNo ? `<div class="report-lab-reg">${displayRegNo}</div>` : ""}
          </div>
        </div>
        <div class="report-header-right">
          <div><strong>📞 Phone:</strong> ${phone}</div>
          <div><strong>✉ Email:</strong> ${email}</div>
          <div style="max-width: 240px; font-size: 10px; margin-top: 2px;">📍 ${address}</div>
        </div>
      </div>

      <!-- 2. Patient Demographics Box (Exact Match: Light Blue Tint) -->
      <div class="report-patient-box">
        <table class="patient-details-table">
          <tr>
            <td class="p-label" style="width: 110px;">Patient Name:-</td>
            <td class="p-val-name">${report.patientName}</td>
            <td class="p-label" style="text-align: right; width: 110px;">Patient Code :-</td>
            <td class="p-val" style="width: 140px;">${report.labNo}</td>
          </tr>
          <tr>
            <td class="p-label">Age / Sex :-</td>
            <td class="p-val">${report.patientAge} / ${report.patientGender}</td>
            <td class="p-label" style="text-align: right;">Received On :-</td>
            <td class="p-val">${colDateFormatted}</td>
          </tr>
          <tr>
            <td class="p-label">Referred by :-</td>
            <td class="p-val">${report.referredBy}</td>
            <td class="p-label" style="text-align: right;">Reported On :-</td>
            <td class="p-val">${repDateFormatted}</td>
          </tr>
        </table>
      </div>

      <!-- 3. Tests & Results Content -->
      <div style="flex: 1; position: relative; z-index: 2;">
        ${testSectionsHtml}

        ${report.remarks ? `
          <div style="font-size: 11px; border: 1px dashed #94a3b8; padding: 5px 8px; margin: 6px 0; border-radius: 4px;">
            <strong>Remarks / Interpretation:</strong> ${report.remarks}
          </div>
        ` : ''}

        <!-- End of Report -->
        <div class="end-of-report-line">
          **** END OF REPORT ****
        </div>

        <!-- Health Wish Line -->
        <div class="health-wish-line">
          We wish a good health : ${labName}, ${address}
        </div>
      </div>

      <!-- 4. Signatures & Footer -->
      <div class="report-footer">
        <div class="report-signatures">
          <div class="sig-box" style="text-align: left;">
            <div class="sig-space"></div>
            <div class="sig-name" style="text-transform: uppercase;">${techName}</div>
            <div class="sig-title">${techDegree}</div>
            ${techAdditionalText ? `<div class="sig-title">${techAdditionalText}</div>` : ""}
          </div>

          <div class="sig-box" style="text-align: right; display: flex; flex-direction: column; justify-content: flex-end;">
            <div class="sig-space"></div>
            <div style="font-size: 12px; font-style: italic; color: #000000; font-weight: 700; padding-bottom: 4px;">Lab Technician</div>
          </div>
        </div>

        <div class="report-disclaimer">
          All Biochemical Test is done by Semi Auto Analyzer.<br>
          • Due to any typing mistake or printing error, get it rectified immediately. • It is not for medico legal use.<br>
          • It is not a final diagnosis, advised clinical co-relation and further investigation for clinically indicated.
        </div>
      </div>
    `;
  }

  triggerBrowserPrint() {
    window.print();
  }

  setLetterheadMode(enabled) {
    const toggle = document.getElementById("modal-letterhead-toggle");
    const sheet = document.getElementById("a4-render-sheet");
    if (toggle) toggle.checked = enabled;
    if (sheet) sheet.classList.toggle("letterhead-mode", enabled);
  }

  closePrintModal() {
    const modal = document.getElementById("print-modal");
    if (modal) modal.classList.remove("active");
  }

  getTestShortName(test) {
    const template = window.TEST_TEMPLATES && window.TEST_TEMPLATES[test.id];
    return (template && template.shortName) || test.shortName || test.name || "Test";
  }

  async refreshRecordsTable() {
    const tbody = document.getElementById("records-table-body");
    const countBadge = document.getElementById("records-count-badge");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px;">Loading records...</td></tr>`;

    const reports = await window.labDB.filterReports({
      dateFilter: this.dateFilter,
      startDate: this.customStartDate,
      endDate: this.customEndDate,
      query: this.searchQuery
    });

    if (countBadge) countBadge.textContent = `${reports.length} records`;

    if (reports.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 40px; color: #64748b;">
            <div style="font-size: 28px; margin-bottom: 8px;">📋</div>
            <div>No diagnostic records match your selected filter.</div>
          </td>
        </tr>
      `;
      return;
    }

    let rowsHtml = "";
    reports.forEach(r => {
      const testsHtml = (r.tests || []).map(t => `<span class="badge badge-test">${this.getTestShortName(t)}</span>`).join(" ");

      rowsHtml += `
        <tr>
          <td style="font-weight: 600; white-space: nowrap;">${r.reportDate || '-'}</td>
          <td style="font-weight: 700; color: #0284c7;">${r.labNo}</td>
          <td style="font-weight: 700;">${r.patientName}</td>
          <td>${r.patientAge} / ${r.patientGender}</td>
          <td style="color: #64748b;">${r.patientPhone || '-'}</td>
          <td>${r.referredBy || 'Self'}</td>
          <td>${testsHtml}</td>
          <td style="text-align: right; white-space: nowrap;">
            <div class="record-actions">
              <button class="btn btn-primary btn-sm" onclick="window.app.printReportById('${r.id}')" title="Print report">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                Print
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.app.editReportById('${r.id}')" title="Edit">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                </svg>
                Edit
              </button>
              <button class="btn btn-danger btn-sm" onclick="window.app.deleteReportById('${r.id}')" title="Delete" aria-label="Delete report">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="m19 6-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = rowsHtml;
  }

  async refreshDashboard() {
    const stats = await window.labDB.getDashboardStats();
    this.setText("stat-total-reports", stats.totalReports);
    this.setText("stat-today-reports", stats.todayReports);
    this.setText("stat-month-reports", stats.monthReports);
    this.setText("stat-abnormal-reports", stats.abnormalCount);

    const recentBody = document.getElementById("dashboard-recent-list");
    if (!recentBody) return;

    const all = await window.labDB.getAllReports();
    const recents = all.slice().sort((a, b) => {
      const timeA = Date.parse(a.createdAt || a.updatedAt || a.reportDate || "") || 0;
      const timeB = Date.parse(b.createdAt || b.updatedAt || b.reportDate || "") || 0;
      return timeB - timeA || String(b.labNo || "").localeCompare(String(a.labNo || ""), undefined, { numeric: true });
    }).slice(0, 6);

    if (recents.length === 0) {
      recentBody.innerHTML = `
        <div class="dashboard-empty-state">
          <span class="dashboard-empty-icon" aria-hidden="true">+</span>
          <strong>No reports yet</strong>
          <span>Create a new report to see patient activity here.</span>
        </div>
      `;
      return;
    }

    const rowsHtml = recents.map(r => {
      const initials = (r.patientName || "").trim().split(/\s+/).slice(0, 2)
        .map(part => part[0] || "").join("").toUpperCase() || "?";
      const testsHtml = (r.tests || []).map(t => `<span class="badge badge-test">${this.getTestShortName(t)}</span>`).join(" ");
      return `
        <div class="dashboard-report-row">
          <div class="dashboard-patient-avatar" aria-hidden="true">${initials}</div>
          <div class="dashboard-report-info">
            <div class="dashboard-report-heading">
              <strong class="dashboard-patient-name">${r.patientName || "Unnamed patient"}</strong>
              <span class="dashboard-report-date">${r.reportDate || "-"}</span>
            </div>
            <div class="dashboard-report-meta">
              <span>${r.labNo || "No patient code"}</span>
              <span>${r.patientAge || "-"} / ${r.patientGender || "-"}</span>
              <span>Referred by ${r.referredBy || "Self"}</span>
            </div>
            <div class="dashboard-report-tests">${testsHtml || '<span class="dashboard-no-tests">No tests listed</span>'}</div>
          </div>
          <button class="btn btn-secondary btn-sm dashboard-print-button" onclick="window.app.printReportById('${r.id}')" title="Print report">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print
          </button>
        </div>
      `;
    });
    recentBody.innerHTML = rowsHtml.join("");
  }

  async printReportById(id) {
    if (!window.labDB.isConnected()) {
      this.showToast("Sign in again to load and print saved reports.", "warning");
      return;
    }
    const rep = await window.labDB.getReport(id);
    if (rep) {
      this.openA4PrintPreview(rep);
    }
  }

  async editReportById(id) {
    if (!window.labDB.isConnected()) {
      this.showToast("Sign in again to load saved reports.", "warning");
      return;
    }
    const rep = await window.labDB.getReport(id);
    if (!rep) return;

    this.navigate("new-report");
    this.setVal("report-edit-id", rep.id);
    this.setVal("patient-lab-id", rep.labNo);
    this.setVal("patient-report-date", rep.reportDate || "");
    this.setVal("patient-collection-date", rep.collectionDate || "");
    this.setVal("patient-name", (rep.patientName || "").toUpperCase());

    const ageParts = (rep.patientAge || "").split(" ");
    this.setVal("patient-age", ageParts[0] || "");
    this.setVal("patient-age-unit", ageParts[1] || "Yrs");

    this.setVal("patient-gender", rep.patientGender || "Male");
    this.setVal("patient-phone", rep.patientPhone || "");
    this.renderReferringDoctorOptions(rep.referredBy || "");
    this.setVal("patient-doctor", rep.referredBy || "");
    this.setVal("patient-sample-type", rep.sampleType || "");
    this.setVal("report-doctor-remarks", rep.remarks || "");

    this.selectedTestIds = new Set((rep.tests || []).map(t => t.id));
    document.querySelectorAll(".test-select-card").forEach(c => {
      const chk = c.querySelector("input");
      if (chk) {
        chk.checked = this.selectedTestIds.has(chk.value);
        c.classList.toggle("selected", chk.checked);
      }
    });
    this.setTestProfilesLocked(true);

    this.renderSelectedParameters();

    setTimeout(() => {
      (rep.tests || []).forEach(t => {
        const block = document.querySelector(`.test-param-block[data-test-id="${t.id}"]`);
        if (!block) return;
        const savedParameters = t.parameters || [];
        const savedParametersById = new Map(savedParameters.map(parameter => [parameter.id, parameter]));
        savedParameters.forEach(p => {
          const input = block.querySelector(`[data-param-id="${p.id}"]`);
          if (input) {
            input.value = p.value;
            this.evaluateParamValue(input, t.id);
          }
        });

        if (t.id === "widal") {
          const legacyOverall = savedParametersById.get("widal_result");
          if (!savedParametersById.has("widal_overall_result") && legacyOverall) {
            const overallInput = block.querySelector('[data-param-id="widal_overall_result"]');
            const result = legacyOverall.value || "";
            if (overallInput) {
              overallInput.value = result.includes("Positive") ? "Positive (+ve)"
                : result.includes("Negative") ? "Negative (-ve)"
                  : result.includes("Borderline") ? "Borderline" : "";
            }
          }

          const widalTemplate = window.TEST_TEMPLATES && window.TEST_TEMPLATES.widal;
          if (widalTemplate) {
            widalTemplate.widalRows.forEach(row => {
              const legacyParameter = savedParametersById.get(row.legacyId);
              const thresholdMatch = /^1:(\d+)$/.exec(legacyParameter ? legacyParameter.value || "" : "");
              widalTemplate.widalDilutions.forEach(dilution => {
                const paramId = `widal_${row.key}_${dilution.split(":")[1]}`;
                if (savedParametersById.has(paramId)) return;
                const input = block.querySelector(`[data-param-id="${paramId}"]`);
                if (input) {
                  input.value = thresholdMatch && Number(dilution.split(":")[1]) <= Number(thresholdMatch[1]) ? "+ve" : "-ve";
                }
              });
            });
          }
        }
      });
    }, 50);
  }

  async deleteReportById(id) {
    const confirmed = await this.requestDeleteConfirmation();
    if (!confirmed) return;

    await window.labDB.deleteReport(id);
    await this.refreshDashboard();
    await this.refreshRecordsTable();

    const searchInput = document.getElementById("records-search-input");
    if (searchInput) searchInput.focus();
  }

  requestDeleteConfirmation() {
    const modal = document.getElementById("delete-confirmation-modal");
    const cancelButton = document.getElementById("btn-cancel-delete");
    if (!modal || this.pendingDeleteConfirmation) return Promise.resolve(false);

    this.previousDeleteFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    return new Promise(resolve => {
      this.pendingDeleteConfirmation = resolve;
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      if (cancelButton) cancelButton.focus();
    });
  }

  finishDeleteConfirmation(confirmed) {
    if (!this.pendingDeleteConfirmation) return;

    const modal = document.getElementById("delete-confirmation-modal");
    const resolve = this.pendingDeleteConfirmation;
    this.pendingDeleteConfirmation = null;
    if (modal) {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    }

    resolve(confirmed);
    if (!confirmed && this.previousDeleteFocus && this.previousDeleteFocus.isConnected) {
      this.previousDeleteFocus.focus();
    }
    this.previousDeleteFocus = null;
  }

  async exportRecordsToCsv() {
    const reports = await window.labDB.filterReports({
      dateFilter: this.dateFilter,
      startDate: this.customStartDate,
      endDate: this.customEndDate,
      query: this.searchQuery
    });

    if (reports.length === 0) {
      this.showToast("There are no reports matching the current filters.", "warning", "No records found");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Lab ID,Report Date,Patient Name,Age,Gender,Phone,Referred Doctor,Tests\n";

    reports.forEach(r => {
      const tests = (r.tests || []).map(t => t.name).join("; ");
      const row = [
        `"${r.labNo}"`,
        `"${r.reportDate}"`,
        `"${r.patientName}"`,
        `"${r.patientAge}"`,
        `"${r.patientGender}"`,
        `"${r.patientPhone || ''}"`,
        `"${r.referredBy || ''}"`,
        `"${tests}"`
      ];
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Lab_Records_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async downloadBackupJson() {
    if (!window.labDB.isConnected()) {
      this.showToast("Sign in again before downloading a full backup.", "warning");
      return;
    }
    const json = await window.labDB.exportBackup();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LabFlow_Backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async restoreBackupFromJsonFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      const res = await window.labDB.importBackup(content);
      if (res.success) {
        this.showToast(`${res.count} reports restored successfully.`, "success", "Backup restored");
        await this.refreshDashboard();
        await this.refreshRecordsTable();
      } else {
        this.showToast("Backup load error: " + res.error, "error", "Restore failed");
      }
    };
    reader.readAsText(file);
  }

  // Demo sample reports removed
  async loadSampleReports() {
    // Demo report loading removed
  }

  setupEventListeners() {
    const btnSaveOnly = document.getElementById("btn-save-report-only");
    if (btnSaveOnly) this.listen(btnSaveOnly, "click", () => this.saveReport(false));

    const btnSavePrint = document.getElementById("btn-save-and-print");
    if (btnSavePrint) this.listen(btnSavePrint, "click", () => this.saveReport(true));

    const patientNameInput = document.getElementById("patient-name");
    if (patientNameInput) {
      this.listen(patientNameInput, "input", () => {
        const cursorPosition = patientNameInput.selectionStart;
        const uppercaseName = patientNameInput.value.toUpperCase();
        if (patientNameInput.value !== uppercaseName) {
          patientNameInput.value = uppercaseName;
          if (cursorPosition !== null) {
            const uppercaseCursorPosition = patientNameInput.value
              .slice(0, cursorPosition)
              .length;
            patientNameInput.setSelectionRange(uppercaseCursorPosition, uppercaseCursorPosition);
          }
        }
      });
    }

    const btnReset = document.getElementById("btn-reset-report-form");
    if (btnReset) this.listen(btnReset, "click", () => {
      if (confirm("Are you sure you want to reset the form?")) this.resetReportForm();
    });

    const btnCloseModalBottom = document.getElementById("btn-close-print-modal-bottom");
    if (btnCloseModalBottom) this.listen(btnCloseModalBottom, "click", () => this.closePrintModal());

    const btnPrintNowBottom = document.getElementById("btn-modal-trigger-print-bottom");
    if (btnPrintNowBottom) this.listen(btnPrintNowBottom, "click", () => this.triggerBrowserPrint());

    // Mobile Hamburger Menu Drawer Toggle
    const btnMobileMenu = document.getElementById("btn-mobile-menu");
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");

    const toggleSidebar = (open) => {
      if (!sidebar) return;
      const isOpen = open !== undefined ? open : !sidebar.classList.contains("open");
      sidebar.classList.toggle("open", isOpen);
      if (backdrop) backdrop.classList.toggle("active", isOpen);
    };

    if (btnMobileMenu) this.listen(btnMobileMenu, "click", () => toggleSidebar());
    if (backdrop) this.listen(backdrop, "click", () => toggleSidebar(false));

    // Responsive Modal Zoom Controls
    const btnZoomIn = document.getElementById("btn-zoom-in");
    if (btnZoomIn) this.listen(btnZoomIn, "click", () => this.setModalZoom(this.modalZoom + 0.1));

    const btnZoomOut = document.getElementById("btn-zoom-out");
    if (btnZoomOut) this.listen(btnZoomOut, "click", () => this.setModalZoom(this.modalZoom - 0.1));

    const btnZoomFit = document.getElementById("btn-zoom-fit");
    if (btnZoomFit) {
      this.listen(btnZoomFit, "click", () => {
        const modalBody = document.getElementById("modal-body-scroll");
        if (modalBody) {
          const availableWidth = modalBody.clientWidth - 40;
          const scale = Math.max(0.35, Math.min(1.2, availableWidth / 800));
          this.setModalZoom(scale);
        }
      });
    }

    const letterheadToggle = document.getElementById("modal-letterhead-toggle");
    if (letterheadToggle) {
      this.listen(letterheadToggle, "change", (event) => {
        this.setLetterheadMode(event.target.checked);
      });
    }

    document.querySelectorAll(".date-pill").forEach(pill => {
      this.listen(pill, "click", async () => {
        document.querySelectorAll(".date-pill").forEach(p => {
          const isActive = p === pill;
          p.classList.toggle("active", isActive);
          p.setAttribute("aria-pressed", String(isActive));
        });

        const filter = pill.getAttribute("data-date-filter");
        this.dateFilter = filter;

        const customBar = document.getElementById("custom-date-range-bar");
        if (customBar) customBar.style.display = filter === "custom" ? "flex" : "none";

        if (filter === "custom") {
          await this.configureCustomDateFilter();
        } else {
          await this.refreshRecordsTable();
        }
      });
    });

    const customStartDate = document.getElementById("custom-start-date");
    if (customStartDate) {
      this.listen(customStartDate, "change", async (event) => {
        if (!event.target.value) {
          event.target.value = this.customStartDate;
          return;
        }

        this.customStartDate = event.target.value;
        await this.refreshRecordsTable();
      });
    }

    const searchInput = document.getElementById("records-search-input");
    if (searchInput) {
      this.listen(searchInput, "input", (e) => {
        this.searchQuery = e.target.value;
        this.refreshRecordsTable();
      });
    }

    const btnCsv = document.getElementById("btn-export-csv");
    if (btnCsv) this.listen(btnCsv, "click", () => this.exportRecordsToCsv());

    const btnSaveSettings = document.getElementById("btn-save-settings");
    if (btnSaveSettings) this.listen(btnSaveSettings, "click", () => this.saveLabSettingsFromUI());

    const btnBackup = document.getElementById("btn-download-backup");
    if (btnBackup) this.listen(btnBackup, "click", () => this.downloadBackupJson());

    const btnTriggerImport = document.getElementById("btn-trigger-import");
    const fileInput = document.getElementById("backup-file-input");
    if (btnTriggerImport && fileInput) {
      this.listen(btnTriggerImport, "click", () => fileInput.click());
      this.listen(fileInput, "change", (e) => {
        if (e.target.files && e.target.files[0]) {
          this.restoreBackupFromJsonFile(e.target.files[0]);
        }
      });
    }

    const deleteConfirmationModal = document.getElementById("delete-confirmation-modal");
    const deleteConfirmationDialog = document.getElementById("delete-confirmation-dialog");
    const btnCancelDelete = document.getElementById("btn-cancel-delete");
    const btnConfirmDelete = document.getElementById("btn-confirm-delete");
    if (btnCancelDelete) {
      this.listen(btnCancelDelete, "click", () => this.finishDeleteConfirmation(false));
    }
    if (btnConfirmDelete) {
      this.listen(btnConfirmDelete, "click", () => this.finishDeleteConfirmation(true));
    }
    if (deleteConfirmationModal) {
      this.listen(deleteConfirmationModal, "click", event => {
        if (event.target === deleteConfirmationModal) this.finishDeleteConfirmation(false);
      });
    }

    this.handleKeyDown = (e) => {
      if (deleteConfirmationModal && deleteConfirmationModal.classList.contains("active")) {
        if (e.key === "Escape") {
          e.preventDefault();
          this.finishDeleteConfirmation(false);
          return;
        }
        if (e.key === "Tab" && deleteConfirmationDialog) {
          const focusable = Array.from(deleteConfirmationDialog.querySelectorAll("button:not(:disabled)"));
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        const modal = document.getElementById("print-modal");
        if (modal && modal.classList.contains("active")) {
          // Native print
        }
      }
    };
    window.addEventListener("keydown", this.handleKeyDown);
  }

  async configureCustomDateFilter() {
    const startDateInput = document.getElementById("custom-start-date");
    if (!startDateInput) return;

    const reports = await window.labDB.getAllReports();
    const now = new Date();
    const today = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-");
    const availableDates = reports
      .map(report => (report.reportDate || report.createdAt || "").split("T")[0])
      .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date) && date <= today)
      .sort();
    const firstAvailableDate = availableDates[0] || "";
    const latestAvailableDate = availableDates[availableDates.length - 1] || "";

    startDateInput.disabled = !firstAvailableDate;
    startDateInput.min = firstAvailableDate;
    startDateInput.max = latestAvailableDate;
    this.customEndDate = latestAvailableDate;

    if (!latestAvailableDate) {
      this.customStartDate = "";
      startDateInput.value = "";
      this.setText("custom-end-date-label", "No records available");
    } else {
      if (
        !this.customStartDate ||
        this.customStartDate < firstAvailableDate ||
        this.customStartDate > latestAvailableDate
      ) {
        this.customStartDate = firstAvailableDate;
      }

      startDateInput.value = this.customStartDate;
      this.setText(
        "custom-end-date-label",
        `${latestAvailableDate.slice(8, 10)}/${latestAvailableDate.slice(5, 7)}/${latestAvailableDate.slice(0, 4)}`
      );
    }

    await this.refreshRecordsTable();
  }

  getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
  }
  setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }
  setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
}

