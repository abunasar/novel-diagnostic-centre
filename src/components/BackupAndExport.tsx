export default function BackupAndExport() {
  return (
    <section
      className={"view-panel"}
      id={"view-backup"}
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
                d={"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}
               />
              <polyline
                points={"7 10 12 15 17 10"}
               />
              <line
                x1={"12"}
                y1={"15"}
                x2={"12"}
                y2={"3"}
               />
            </svg>
            {" Data Safety, Backup & Recovery "}
          </div>
        </div>
        <div
          className={"card-body"}
        >
          <p
            style={{ fontSize: "13.5px", color: "#475569", marginBottom: "20px" }}
          >
            {" Patient reports are saved in a JSON file on your computer, outside Chrome storage. Reconnect the file after reopening the app or resetting Chrome. The first connection imports existing browser records into the selected file. "}
          </p>
          <div
            className={"card"}
            style={{ marginBottom: "20px", background: "#f8fafc" }}
          >
            <div className={"card-body"}>
              <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0284c7", marginBottom: "8px" }}>
                {"JSON Data File"}
              </h4>
              <p id={"data-file-connection-status"} style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "16px" }}>
                {"Database Not Connected. Connect your existing file or create one to save and print reports."}
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button className={"btn btn-primary"} id={"btn-connect-json-file"}>
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
                    style={{ marginRight: "8px", verticalAlign: "middle" }}
                  >
                    <path d={"M3 7.5A2.5 2.5 0 0 1 5.5 5h4l2 2h7A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z"} />
                    <path d={"M12 9v7"} />
                    <path d={"m9 15 3 3 3-3"} />
                  </svg>
                  {" Connect Existing JSON File "}
                </button>
                <button className={"btn btn-secondary"} id={"btn-create-json-file"}>
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
                    style={{ marginRight: "8px", verticalAlign: "middle" }}
                  >
                    <path d={"M3 7.5A2.5 2.5 0 0 1 5.5 5h4l2 2h7A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z"} />
                    <path d={"M12 9v6"} />
                    <path d={"M9 12h6"} />
                  </svg>
                  {" Create JSON Data File "}
                </button>
              </div>
            </div>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}
          >
            <div
              style={{ border: "1px solid var(--border-color)", borderRadius: "8px", padding: "20px", background: "#f8fafc" }}
            >
              <h4
                style={{ fontSize: "15px", fontWeight: "700", color: "#0284c7", marginBottom: "8px" }}
              >
                {"1. Export Full Backup"}
              </h4>
              <p
                style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "16px" }}
              >
                {" Download all patient records, test reports, and lab profile configurations into a secure JSON backup file. "}
              </p>
              <button
                className={"btn btn-primary"}
                id={"btn-download-backup"}
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
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                >
                  <path d={"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"} />
                  <polyline points={"7 10 12 15 17 10"} />
                  <line x1={"12"} y1={"15"} x2={"12"} y2={"3"} />
                </svg>
                {" Download Backup File (.json) "}
              </button>
            </div>
            <div
              style={{ border: "1px solid var(--border-color)", borderRadius: "8px", padding: "20px", background: "#f8fafc" }}
            >
              <h4
                style={{ fontSize: "15px", fontWeight: "700", color: "#059669", marginBottom: "8px" }}
              >
                {"2. Restore Backup "}
              </h4>
              <p
                style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "16px" }}
              >
                {" Restore diagnostic reports and settings from a previously saved JSON backup file. "}
              </p>
              <input
                type={"file"}
                id={"backup-file-input"}
                accept={".json"}
                style={{ display: "none" }}
               />
              <button
                className={"btn btn-success"}
                id={"btn-trigger-import"}
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
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                >
                  <path d={"M3 12v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"} />
                  <path d={"M12 3v11"} />
                  <path d={"m7 18 5 5 5-5"} />
                </svg>
                {" Select & Restore Backup File "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
