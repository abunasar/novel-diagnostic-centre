export default function BackupAndExport() {
  return (
    <section className={"view-panel"} id={"view-backup"}>
      <div className={"card"}>
        <div className={"card-header"}>
          <div className={"card-title"}>
            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"}>
              <path d={"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"} />
              <polyline points={"7 10 12 15 17 10"} />
              <line x1={"12"} y1={"15"} x2={"12"} y2={"3"} />
            </svg>
            {" MongoDB, Backup & Recovery "}
          </div>
        </div>
        <div className={"card-body"}>
          <p style={{ fontSize: "13.5px", color: "#475569", marginBottom: "20px" }}>
            {"Patient reports and laboratory settings are stored in the connected MongoDB database. Download regular backups and keep them in a secure location."}
          </p>
          <div className={"card"} style={{ marginBottom: "20px", background: "#f8fafc" }}>
            <div className={"card-body"}>
              <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0284c7", marginBottom: "8px" }}>
                {"Database connection"}
              </h4>
              <p id={"database-connection-status"} style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "0" }}>
                {"MongoDB is not connected. Sign in to access the laboratory database."}
              </p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <div style={{ border: "1px solid var(--border-color)", borderRadius: "8px", padding: "20px", background: "#f8fafc" }}>
              <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0284c7", marginBottom: "8px" }}>
                {"1. Export full backup"}
              </h4>
              <p style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "16px" }}>
                {"Download all patient reports and lab settings as a JSON backup file."}
              </p>
              <button className={"btn btn-primary"} id={"btn-download-backup"}>
                {"Download Backup File (.json)"}
              </button>
            </div>
            <div style={{ border: "1px solid var(--border-color)", borderRadius: "8px", padding: "20px", background: "#f8fafc" }}>
              <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#059669", marginBottom: "8px" }}>
                {"2. Restore backup"}
              </h4>
              <p style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "16px" }}>
                {"Restore diagnostic reports and settings from a previously downloaded backup."}
              </p>
              <input type={"file"} id={"backup-file-input"} accept={".json"} style={{ display: "none" }} />
              <button className={"btn btn-success"} id={"btn-trigger-import"}>
                {"Select & Restore Backup File"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
