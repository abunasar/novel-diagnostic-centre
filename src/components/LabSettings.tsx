export default function LabSettings() {
  return (
    <section
      className={"view-panel"}
      id={"view-settings"}
    >
      <div
        className={"card"}
      >
        <div
          className={"card-header"}
        >
          <div
            className={"card-title"}
          >
            <svg
              width={"18"}
              height={"18"}
              viewBox={"0 0 24 24"}
              fill={"none"}
              stroke={"currentColor"}
              strokeWidth={"2"}
            >
              <circle
                cx={"12"}
                cy={"12"}
                r={"3"}
               />
              <path
                d={"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"}
               />
            </svg>
            {" Laboratory Header Details "}
          </div>
        </div>
        <div
          className={"card-body"}
        >
          <form
            id={"lab-settings-form"}
            onSubmit={(event) => event.preventDefault()}
          >
            <div
              className={"form-grid"}
            >
              <div
                className={"form-group"}
                style={{ gridColumn: "span 2" }}
              >
                <label
                  className={"form-label"}
                >
                  {"Laboratory Name"}
                </label>
                <input
                  type={"text"}
                  className={"form-control"}
                  id={"set-lab-name"}
                 />
              </div>
              <div
                className={"form-group"}
                style={{ gridColumn: "span 2" }}
              >
                <label
                  className={"form-label"}
                >
                  {"Tagline / Subtitle"}
                </label>
                <input
                  type={"text"}
                  className={"form-control"}
                  id={"set-lab-tagline"}
                 />
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Registration / Accreditation No."}
                </label>
                <input
                  type={"text"}
                  className={"form-control"}
                  id={"set-lab-reg"}
                 />
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Phone / Mobile Numbers"}
                </label>
                <input
                  type={"text"}
                  className={"form-control"}
                  id={"set-lab-phone"}
                 />
              </div>
              <div
                className={"form-group"}
                style={{ gridColumn: "span 2" }}
              >
                <label
                  className={"form-label"}
                >
                  {"Full Address"}
                </label>
                <input
                  type={"text"}
                  className={"form-control"}
                  id={"set-lab-address"}
                 />
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Email ID"}
                </label>
                <input
                  type={"email"}
                  className={"form-control"}
                  id={"set-lab-email"}
                 />
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Website"}
                </label>
                <input
                  type={"text"}
                  className={"form-control"}
                  id={"set-lab-website"}
                 />
              </div>
            </div>
            <hr
              style={{ margin: "24px 0", border: "none", borderTop: "1px solid var(--border-color)" }}
             />
            <h4
              style={{ fontSize: "15px", fontWeight: "700", marginBottom: "16px", color: "#0f172a" }}
            >
              {"Doctor & Technician Signatures"}
            </h4>
            <div
              className={"form-grid"}
            >
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Consultant Pathologist / Doctor Name"}
                </label>
                <input
                  type={"text"}
                  className={"form-control"}
                  id={"set-doc-name"}
                 />
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Pathologist Degree / Qualifications"}
                </label>
                <input
                  type={"text"}
                  className={"form-control"}
                  id={"set-doc-degree"}
                 />
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Senior Lab Technician Name"}
                </label>
                <input
                  type={"text"}
                  className={"form-control"}
                  id={"set-tech-name"}
                 />
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Technician Degree / Qualifications"}
                </label>
                <input
                  type={"text"}
                  className={"form-control"}
                  id={"set-tech-degree"}
                 />
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                  htmlFor={"set-tech-additional-text"}
                >
                  {"Additional Technician Text (shown below qualification)"}
                </label>
                <input
                  type={"text"}
                  className={"form-control"}
                  id={"set-tech-additional-text"}
                  placeholder={"Optional text"}
                 />
              </div>
            </div>
            <div
              className={"form-group"}
              style={{ marginTop: "20px" }}
            >
              <label
                className={"form-label"}
                id={"set-referring-doctors-label"}
              >
                {"Referred By Doctor List (up to 10)"}
              </label>
              <div
                className={"referring-doctor-list"}
                id={"set-referring-doctors"}
                aria-labelledby={"set-referring-doctors-label"}
               />
              <small
                style={{ color: "#64748b", fontSize: "11.5px" }}
                id={"referring-doctors-help"}
              >
                {" Add each doctor separately. Use + to add another; these names will appear in the report form dropdown. "}
              </small>
            </div>
            <hr
              style={{ margin: "24px 0", border: "none", borderTop: "1px solid var(--border-color)" }}
             />
            <h4
              style={{ fontSize: "15px", fontWeight: "700", marginBottom: "16px", color: "#0f172a" }}
            >
              {"Paper & Letterhead Options"}
            </h4>
            <div
              className={"form-grid"}
            >
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Default Print Mode"}
                </label>
                <select
                  className={"form-control"}
                  id={"set-default-print-mode"}
                >
                  <option
                    value={"header"}
                  >
                    {"Print with Full Lab Header (Plain Paper)"}
                  </option>
                  <option
                    value={"letterhead"}
                  >
                    {"Pre-printed Letterhead Mode (Leaves blank top space)"}
                  </option>
                </select>
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Letterhead Blank Top Margin (for pre-printed stationery)"}
                </label>
                <select
                  className={"form-control"}
                  id={"set-letterhead-margin"}
                >
                  <option
                    value={"35mm"}
                  >
                    {"35 mm"}
                  </option>
                  <option
                    value={"42mm"}
                  >
                    {"42 mm (Standard)"}
                  </option>
                  <option
                    value={"50mm"}
                  >
                    {"50 mm"}
                  </option>
                  <option
                    value={"60mm"}
                  >
                    {"60 mm (Extra space)"}
                  </option>
                </select>
              </div>
            </div>
            <div
              style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}
            >
              <button
                type={"button"}
                className={"btn btn-primary btn-lg"}
                id={"btn-save-settings"}
              >
                {" 💾 Save Lab Settings "}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
