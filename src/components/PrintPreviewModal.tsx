export default function PrintPreviewModal() {
  return (
    <div
      className={"modal-overlay"}
      id={"print-modal"}
    >
      <div
        className={"modal-dialog"}
      >
        <div
          className={"modal-header no-print"}
        >
          <div
            className={"modal-title"}
          >
            <span
              style={{ fontSize: "18px" }}
            >
              {"🖨️"}
            </span>
            <div>
              <div
                style={{ fontWeight: "700", fontSize: "14.5px" }}
              >
                {"Diagnostic Report Preview"}
              </div>
              <div
                style={{ fontSize: "11px", color: "#64748b" }}
              >
                {"Review your report before printing"}
              </div>
            </div>
          </div>
          <div
            className={"modal-header-actions"}
          >
            <div
              className={"zoom-controls"}
            >
              <button
                type={"button"}
                className={"btn-zoom"}
                id={"btn-zoom-out"}
                title={"Zoom Out"}
              >
                {"−"}
              </button>
              <span
                className={"zoom-level"}
                id={"zoom-level-text"}
              >
                {"100%"}
              </span>
              <button
                type={"button"}
                className={"btn-zoom"}
                id={"btn-zoom-in"}
                title={"Zoom In"}
              >
                {"+"}
              </button>
              <button
                type={"button"}
                className={"btn-zoom-fit"}
                id={"btn-zoom-fit"}
                title={"Fit Screen"}
              >
                {"Fit"}
              </button>
            </div>
            <label
              className={"letterhead-toggle-label"}
            >
              <input
                type={"checkbox"}
                id={"modal-letterhead-toggle"}
                style={{ width: "15px", height: "15px" }}
               />
              <span>
                {"Letterhead Mode (Blank Header)"}
              </span>
            </label>
          </div>
        </div>
        <div
          className={"modal-body"}
          id={"modal-body-scroll"}
        >
          <div
            className={"a4-sheet"}
            id={"a4-render-sheet"}
           />
        </div>
        <div
          className={"modal-footer no-print"}
        >
          <div
            style={{ display: "flex", gap: "8px" }}
          >
            <button
              className={"btn btn-secondary"}
              id={"btn-close-print-modal-bottom"}
            >
              {"Close"}
            </button>
            <button
              className={"btn btn-primary"}
              id={"btn-modal-trigger-print-bottom"}
            >
              {"Print Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
