export default function PatientReportForm() {
  return (
    <section
      className={"view-panel"}
      id={"view-new-report"}
    >
      <form
        id={"report-form"}
        onSubmit={(event) => event.preventDefault()}
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
                <path
                  d={"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}
                 />
                <circle
                  cx={"12"}
                  cy={"7"}
                  r={"4"}
                 />
              </svg>
              {" 1. Patient Demographics "}
            </div>
          </div>
          <div
            className={"card-body"}
          >
            <input
              type={"hidden"}
              id={"report-edit-id"}
              defaultValue={""}
             />
            <div
              className={"form-grid"}
            >
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Patient Code / Lab ID"}
                </label>
                <input
                  type={"text"}
                  className={"form-control"}
                  id={"patient-lab-id"}
                 />
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Reported On Date"}
                </label>
                <input
                  type={"date"}
                  className={"form-control"}
                  id={"patient-report-date"}
                 />
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Received On Date"}
                </label>
                <input
                  type={"date"}
                  className={"form-control"}
                  id={"patient-collection-date"}
                 />
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Patient Full Name *"}
                </label>
                <input
                  type={"text"}
                  className={"form-control"}
                  id={"patient-name"}
                  required={true}
                 />
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                  htmlFor={"patient-age"}
                >
                  {"Age & Unit *"}
                </label>
                <div
                  className={"age-input-group"}
                >
                  <input
                    type={"number"}
                    className={"form-control"}
                    id={"patient-age"}
                    min={"0"}
                    max={"130"}
                    step={"any"}
                    required={true}
                   />
                  <select
                    className={"form-control"}
                    id={"patient-age-unit"}
                  >
                    <option
                      value={"Years"}
                    >
                      {"Years"}
                    </option>
                    <option
                      value={"Months"}
                    >
                      {"Months"}
                    </option>
                    <option
                      value={"Days"}
                    >
                      {"Days"}
                    </option>
                  </select>
                </div>
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Gender"}
                </label>
                <select
                  className={"form-control"}
                  id={"patient-gender"}
                >
                  <option
                    value={"Male"}
                  >
                    {"Male"}
                  </option>
                  <option
                    value={"Female"}
                  >
                    {"Female"}
                  </option>
                  <option
                    value={"Other"}
                  >
                    {"Other"}
                  </option>
                </select>
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                >
                  {"Contact / Phone Number"}
                </label>
                <input
                  type={"text"}
                  className={"form-control"}
                  id={"patient-phone"}
                 />
              </div>
              <div
                className={"form-group"}
              >
                <label
                  className={"form-label"}
                  htmlFor={"patient-doctor"}
                >
                  {"Referred By Doctor *"}
                </label>
                <select
                  className={"form-control"}
                  id={"patient-doctor"}
                  required={true}
                >
                  <option
                    value={""}
                  >
                    {"Select Doctor"}
                  </option>
                  <option
                    value={"Self"}
                  >
                    {"Self"}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
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
                <polygon
                  points={"12 2 2 7 12 12 22 7 12 2"}
                 />
                <polyline
                  points={"2 17 12 22 22 17"}
                 />
                <polyline
                  points={"2 12 12 17 22 12"}
                 />
              </svg>
              {" 2. Select Test Profiles "}
            </div>
            <span
              id={"test-selection-hint"}
              style={{ fontSize: "12px", color: "#64748b" }}
            >
              {"(Multiple tests can be selected together)"}
            </span>
          </div>
          <div
            className={"card-body"}
          >
            <div
              className={"test-selection-box"}
              id={"test-checkboxes-container"}
             />
          </div>
        </div>
        <div
          id={"test-parameters-container"}
         />
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
                <path
                  d={"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}
                 />
                <line
                  x1={"16"}
                  y1={"13"}
                  x2={"8"}
                  y2={"13"}
                 />
                <line
                  x1={"16"}
                  y1={"17"}
                  x2={"8"}
                  y2={"17"}
                 />
                <polyline
                  points={"10 9 9 9 8 9"}
                 />
              </svg>
              {" 3. Pathological Remarks & Doctor's Interpretation "}
            </div>
          </div>
          <div
            className={"card-body"}
          >
            <div
              className={"form-group"}
            >
              <textarea
                className={"form-control"}
                id={"report-doctor-remarks"}
                rows={2}
                placeholder={"Enter clinical interpretation, pathologist comments, or recommendations (optional)..."}
               />
            </div>
          </div>
        </div>
        <div
          style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginBottom: "40px" }}
        >
          <button
            type={"button"}
            className={"btn btn-secondary btn-lg"}
            id={"btn-reset-report-form"}
          >
            {" Reset Form "}
          </button>
          <button
            type={"button"}
            className={"btn btn-primary btn-lg"}
            id={"btn-save-report-only"}
          >
            <svg
              width={"18"}
              height={"18"}
              viewBox={"0 0 24 24"}
              fill={"none"}
              stroke={"currentColor"}
              strokeWidth={"1.8"}
              strokeLinecap={"round"}
              strokeLinejoin={"round"}
              aria-hidden={"true"}
            >
              <path d={"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"} />
              <path d={"M17 21v-8H7v8"} />
              <path d={"M7 3v5h8"} />
            </svg>
            <span className={"button-label"}>{"Save Record"}</span>
          </button>
          <button
            type={"button"}
            className={"btn btn-success btn-lg"}
            id={"btn-save-and-print"}
          >
            <svg
              width={"18"}
              height={"18"}
              viewBox={"0 0 24 24"}
              fill={"none"}
              stroke={"currentColor"}
              strokeWidth={"1.8"}
              strokeLinecap={"round"}
              strokeLinejoin={"round"}
              aria-hidden={"true"}
            >
              <path d={"M6 9V3h12v6"} />
              <path d={"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"} />
              <path d={"M6 14h12v7H6z"} />
              <path d={"M18 12h.01"} />
            </svg>
            <span className={"button-label"}>{"Save & Print"}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
