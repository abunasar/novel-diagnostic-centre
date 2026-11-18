export default function AppHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <header
      className={"app-header no-print"}
    >
      <div
        className={"header-main-row"}
      >
        <div
          className={"header-brand-wrap"}
        >
          <div
            className={"brand-icon"}
          >
            <img
              src={"assets/lab-logo.png"}
              alt={"Lab Logo"}
              className={"brand-logo-img"}
             />
          </div>
          <div
            className={"brand-info"}
          >
            <div
              className={"brand-title"}
            >
              {"Novel Diagnostic Centre"}
            </div>
            <div
              className={"brand-sub"}
            >
              {"Laboratory Management System"}
            </div>
          </div>
        </div>
        <div
          className={"header-center-info"}
        >
          <div
            className={"header-clock"}
            id={"topbar-live-clock"}
          >
            {"Laboratory Management System"}
          </div>
        </div>
        <div
          className={"offline-pill"}
          id={"database-status"}
          title={"Reports and laboratory settings are stored in MongoDB"}
        >
          <span
            className={"offline-pulse"}
           />
          <span
            className={"offline-text"}
          >
            {"MongoDB Connected"}
          </span>
        </div>
        <button className={"btn btn-secondary btn-sm"} type={"button"} onClick={onLogout}>
          {"Sign out"}
        </button>
      </div>
      <div
        className={"header-nav-row"}
      >
        <nav
          className={"nav-pill-track"}
          role={"tablist"}
          aria-label={"Main Navigation"}
        >
          <a
            className={"nav-link active"}
            data-view={"dashboard"}
            role={"tab"}
            aria-selected={"true"}
          >
            <span>
              {"Dashboard"}
            </span>
          </a>
          <a
            className={"nav-link"}
            data-view={"records"}
            role={"tab"}
            aria-selected={"false"}
          >
            <span>
              {"Date-Wise Records"}
            </span>
          </a>
          <a
            className={"nav-link"}
            data-view={"settings"}
            role={"tab"}
            aria-selected={"false"}
          >
            <span>
              {"Lab Settings"}
            </span>
          </a>
          <a
            className={"nav-link"}
            data-view={"backup"}
            role={"tab"}
            aria-selected={"false"}
          >
            <span>
              {"Backup & Export"}
            </span>
          </a>
        </nav>
        <span
          id={"page-title-text"}
          style={{ display: "none" }}
        >
          {"Dashboard"}
        </span>
      </div>
    </header>
  );
}
