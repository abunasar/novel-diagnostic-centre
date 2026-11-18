export default function RecordsPage() {
  return (
    <section
      className={"view-panel"}
      id={"view-records"}
    >
      <div
        className={"filter-bar"}
      >
        <div
          className={"filter-group"}
        >
          <span
            className={"filter-label"}
          >
            <svg
              width={"16"}
              height={"16"}
              viewBox={"0 0 24 24"}
              fill={"none"}
              stroke={"currentColor"}
              strokeWidth={"1.8"}
              aria-hidden={"true"}
            >
              <rect
                x={"3"}
                y={"5"}
                width={"18"}
                height={"16"}
                rx={"2"}
               />
              <path
                d={"M16 3v4M8 3v4M3 10h18"}
               />
            </svg>
            <span>
              {"Date filter"}
            </span>
          </span>
          <div
            className={"date-filter-options"}
            role={"group"}
            aria-label={"Filter records by date"}
          >
            <button
              className={"date-pill active"}
              data-date-filter={"today"}
              aria-pressed={"true"}
            >
              {"Today"}
            </button>
            <button
              className={"date-pill"}
              data-date-filter={"this_week"}
              aria-pressed={"false"}
            >
              {"Last 7 Days"}
            </button>
            <button
              className={"date-pill"}
              data-date-filter={"custom"}
              aria-pressed={"false"}
            >
              {"Custom Date"}
            </button>
          </div>
        </div>
        <div
          className={"search-box"}
        >
          <svg
            width={"16"}
            height={"16"}
            viewBox={"0 0 24 24"}
            fill={"none"}
            stroke={"currentColor"}
            strokeWidth={"2"}
          >
            <circle
              cx={"11"}
              cy={"11"}
              r={"8"}
             />
            <line
              x1={"21"}
              y1={"21"}
              x2={"16.65"}
              y2={"16.65"}
             />
          </svg>
          <input
            type={"text"}
            className={"form-control"}
            id={"records-search-input"}
            placeholder={"Search Patient, Lab ID, Phone, Doctor..."}
           />
        </div>
      </div>
      <div
        id={"custom-date-range-bar"}
        className={"custom-date-range-bar"}
        style={{ display: "none" }}
      >
        <div
          className={"custom-date-field"}
        >
          <label
            className={"custom-date-label"}
            htmlFor={"custom-start-date"}
          >
            {"From date"}
          </label>
          <input
            type={"date"}
            className={"form-control"}
            id={"custom-start-date"}
           />
        </div>
        <span
          className={"custom-date-through"}
        >
          {"To "}
          <strong
            id={"custom-end-date-label"}
          >
            {"Latest available date"}
          </strong>
          {" (automatic)"}
        </span>
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
              <path
                d={"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}
               />
              <polyline
                points={"14 2 14 8 20 8"}
               />
            </svg>
            <span>
              {"Saved Diagnostic Records"}
            </span>
            <span
              id={"records-count-badge"}
              className={"badge badge-normal"}
              style={{ marginLeft: "8px" }}
            >
              {"0 records"}
            </span>
          </div>
          <div
            style={{ display: "flex", gap: "8px" }}
          >
            <button
              className={"btn btn-secondary btn-sm"}
              id={"btn-export-csv"}
              title={"Download Excel compatible CSV file"}
            >
              <svg
                width={"15"}
                height={"15"}
                viewBox={"0 0 24 24"}
                fill={"none"}
                stroke={"currentColor"}
                strokeWidth={"1.8"}
                strokeLinecap={"round"}
                strokeLinejoin={"round"}
                aria-hidden={"true"}
              >
                <path d={"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"} />
                <polyline points={"7 10 12 15 17 10"} />
                <line x1={"12"} y1={"15"} x2={"12"} y2={"3"} />
              </svg>
              {" Export to CSV "}
            </button>
          </div>
        </div>
        <div
          className={"card-body"}
          style={{ padding: "0" }}
        >
          <div
            className={"table-responsive"}
          >
            <table
              className={"data-table"}
            >
              <thead>
                <tr>
                  <th>
                    {"Date"}
                  </th>
                  <th>
                    {"Patient Code"}
                  </th>
                  <th>
                    {"Patient Name"}
                  </th>
                  <th>
                    {"Age / Gender"}
                  </th>
                  <th>
                    {"Phone"}
                  </th>
                  <th>
                    {"Referred By"}
                  </th>
                  <th>
                    {"Tests Performed"}
                  </th>
                  <th
                    style={{ textAlign: "right", minWidth: "190px" }}
                  >
                    {"Actions"}
                  </th>
                </tr>
              </thead>
              <tbody
                id={"records-table-body"}
               />
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
