export default function Dashboard() {
  return (
    <section
      className={"view-panel active"}
      id={"view-dashboard"}
    >
      <div
        className={"dashboard-hero"}
      >
        <div
          className={"dashboard-hero-content"}
        >
          <span
            className={"dashboard-hero-eyebrow"}
          >
            {"LABORATORY OVERVIEW"}
          </span>
          <h1>
            {"Overview"}
          </h1>
          <p>
            {"Manage patient reports and keep track of your laboratory activity."}
          </p>
          <button
            className={"dashboard-hero-button"}
            id={"btn-dashboard-new-report"}
          >
            <svg
              width={"16"}
              height={"16"}
              viewBox={"0 0 24 24"}
              fill={"none"}
              stroke={"currentColor"}
              strokeWidth={"2.4"}
              aria-hidden={"true"}
            >
              <line
                x1={"12"}
                y1={"5"}
                x2={"12"}
                y2={"19"}
               />
              <line
                x1={"5"}
                y1={"12"}
                x2={"19"}
                y2={"12"}
               />
            </svg>
            {" New Report "}
          </button>
        </div>
        <div
          className={"dashboard-hero-metrics"}
        >
          <div
            className={"dashboard-hero-summary"}
          >
            <div
              className={"dashboard-hero-summary-main"}
            >
              <div
                className={"dashboard-hero-summary-label"}
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
                  <path
                    d={"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2h12a2 2 0 0 0 2-2V8z"}
                   />
                  <polyline
                    points={"14 2 14 8 20 8"}
                   />
                </svg>
                {" Total reports "}
              </div>
              <strong
                className={"dashboard-hero-summary-value"}
                id={"stat-total-reports"}
              >
                {"0"}
              </strong>
              <span
                className={"dashboard-hero-summary-caption"}
              >
                {"Patient reports recorded"}
              </span>
            </div>
            <div
              className={"dashboard-hero-summary-icon"}
            >
              <svg
                width={"18"}
                height={"18"}
                viewBox={"0 0 24 24"}
                fill={"none"}
                stroke={"currentColor"}
                strokeWidth={"1.8"}
                aria-hidden={"true"}
              >
                <path
                  d={"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2h12a2 2 0 0 0 2-2V8z"}
                 />
                <polyline
                  points={"14 2 14 8 20 8"}
                 />
              </svg>
            </div>
          </div>
          <div
            className={"stat-card green"}
          >
            <div>
              <div
                className={"stat-val"}
                id={"stat-today-reports"}
              >
                {"0"}
              </div>
              <div
                className={"stat-lbl"}
              >
                {"Today's Reports"}
              </div>
            </div>
            <div
              className={"stat-icon"}
            >
              <svg
                width={"22"}
                height={"22"}
                viewBox={"0 0 24 24"}
                fill={"none"}
                stroke={"currentColor"}
                strokeWidth={"2"}
              >
                <rect
                  x={"3"}
                  y={"4"}
                  width={"18"}
                  height={"18"}
                  rx={"2"}
                  ry={"2"}
                 />
                <line
                  x1={"16"}
                  y1={"2"}
                  x2={"16"}
                  y2={"6"}
                 />
                <line
                  x1={"8"}
                  y1={"2"}
                  x2={"8"}
                  y2={"6"}
                 />
                <line
                  x1={"3"}
                  y1={"10"}
                  x2={"21"}
                  y2={"10"}
                 />
              </svg>
            </div>
          </div>
          <div
            className={"stat-card purple"}
          >
            <div>
              <div
                className={"stat-val"}
                id={"stat-month-reports"}
              >
                {"0"}
              </div>
              <div
                className={"stat-lbl"}
              >
                {"This Month"}
              </div>
            </div>
            <div
              className={"stat-icon"}
            >
              <svg
                width={"22"}
                height={"22"}
                viewBox={"0 0 24 24"}
                fill={"none"}
                stroke={"currentColor"}
                strokeWidth={"2"}
              >
                <path
                  d={"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"}
                 />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div
        className={"dashboard-lower-grid"}
      >
        <section
          className={"card dashboard-recent-card"}
          aria-labelledby={"dashboard-recent-title"}
        >
          <div
            className={"dashboard-panel-header"}
          >
            <div
              className={"dashboard-panel-heading"}
            >
              <span
                className={"dashboard-panel-icon"}
                aria-hidden={"true"}
              >
                <svg
                  width={"18"}
                  height={"18"}
                  viewBox={"0 0 24 24"}
                  fill={"none"}
                  stroke={"currentColor"}
                  strokeWidth={"1.8"}
                >
                  <circle
                    cx={"12"}
                    cy={"12"}
                    r={"10"}
                   />
                  <polyline
                    points={"12 6 12 12 16 14"}
                   />
                </svg>
              </span>
              <span>
                <h2
                  className={"dashboard-panel-title"}
                  id={"dashboard-recent-title"}
                >
                  {"Recent Patient Reports"}
                </h2>
                <span
                  className={"dashboard-panel-subtitle"}
                >
                  {"Latest reports from your laboratory"}
                </span>
              </span>
            </div>
            <button
              className={"btn btn-secondary btn-sm dashboard-view-more"}
              id={"btn-view-all-records"}
            >
              {" View More "}
              <svg
                width={"14"}
                height={"14"}
                viewBox={"0 0 24 24"}
                fill={"none"}
                stroke={"currentColor"}
                strokeWidth={"2"}
                aria-hidden={"true"}
              >
                <path
                  d={"M5 12h14"}
                 />
                <path
                  d={"m12 5 7 7-7 7"}
                 />
              </svg>
            </button>
          </div>
          <div
            className={"dashboard-recent-list"}
            id={"dashboard-recent-list"}
          >
            <div
              className={"dashboard-empty-state"}
            >
              <span
                className={"dashboard-empty-icon"}
                aria-hidden={"true"}
              >
                {"+"}
              </span>
              <strong>
                {"No reports yet"}
              </strong>
              <span>
                {"Create a new report to see patient activity here."}
              </span>
            </div>
          </div>
        </section>
        <aside
          className={"card dashboard-quick-card"}
          aria-labelledby={"dashboard-quick-title"}
        >
          <div
            className={"dashboard-panel-header"}
          >
            <div
              className={"dashboard-panel-heading"}
            >
              <span
                className={"dashboard-panel-icon"}
                aria-hidden={"true"}
              >
                <svg
                  width={"18"}
                  height={"18"}
                  viewBox={"0 0 24 24"}
                  fill={"none"}
                  stroke={"currentColor"}
                  strokeWidth={"1.8"}
                >
                  <rect
                    x={"3"}
                    y={"3"}
                    width={"7"}
                    height={"7"}
                    rx={"1"}
                   />
                  <rect
                    x={"14"}
                    y={"3"}
                    width={"7"}
                    height={"7"}
                    rx={"1"}
                   />
                  <rect
                    x={"3"}
                    y={"14"}
                    width={"7"}
                    height={"7"}
                    rx={"1"}
                   />
                  <rect
                    x={"14"}
                    y={"14"}
                    width={"7"}
                    height={"7"}
                    rx={"1"}
                   />
                </svg>
              </span>
              <span>
                <h2
                  className={"dashboard-panel-title"}
                  id={"dashboard-quick-title"}
                >
                  {"Quick Access"}
                </h2>
                <span
                  className={"dashboard-panel-subtitle"}
                >
                  {"Common laboratory tasks"}
                </span>
              </span>
            </div>
          </div>
          <div
            className={"dashboard-quick-links"}
          >
            <button
              className={"dashboard-quick-link"}
              data-dashboard-view={"records"}
            >
              <span
                className={"dashboard-quick-link-icon blue"}
              >
                <svg
                  width={"17"}
                  height={"17"}
                  viewBox={"0 0 24 24"}
                  fill={"none"}
                  stroke={"currentColor"}
                  strokeWidth={"1.8"}
                  aria-hidden={"true"}
                >
                  <rect
                    x={"3"}
                    y={"4"}
                    width={"18"}
                    height={"18"}
                    rx={"2"}
                   />
                  <line
                    x1={"16"}
                    y1={"2"}
                    x2={"16"}
                    y2={"6"}
                   />
                  <line
                    x1={"8"}
                    y1={"2"}
                    x2={"8"}
                    y2={"6"}
                   />
                  <line
                    x1={"3"}
                    y1={"10"}
                    x2={"21"}
                    y2={"10"}
                   />
                </svg>
              </span>
              <span
                className={"dashboard-quick-link-copy"}
              >
                <strong>
                  {"Date-wise records"}
                </strong>
                <small>
                  {"Search and review patient reports"}
                </small>
              </span>
              <span
                className={"dashboard-quick-arrow"}
                aria-hidden={"true"}
              >
                {"›"}
              </span>
            </button>
            <button
              className={"dashboard-quick-link"}
              data-dashboard-view={"settings"}
            >
              <span
                className={"dashboard-quick-link-icon green"}
              >
                <svg
                  width={"17"}
                  height={"17"}
                  viewBox={"0 0 24 24"}
                  fill={"none"}
                  stroke={"currentColor"}
                  strokeWidth={"1.8"}
                  aria-hidden={"true"}
                >
                  <circle
                    cx={"12"}
                    cy={"12"}
                    r={"3"}
                   />
                  <path
                    d={"m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4L17 17.4a1.7 1.7 0 0 0-2.9 1.2v.2a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 1 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 1 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V2.9a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 1 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2 2.9z"}
                   />
                </svg>
              </span>
              <span
                className={"dashboard-quick-link-copy"}
              >
                <strong>
                  {"Lab settings"}
                </strong>
                <small>
                  {"Manage laboratory and doctor details"}
                </small>
              </span>
              <span
                className={"dashboard-quick-arrow"}
                aria-hidden={"true"}
              >
                {"›"}
              </span>
            </button>
            <button
              className={"dashboard-quick-link"}
              data-dashboard-view={"backup"}
            >
              <span
                className={"dashboard-quick-link-icon purple"}
              >
                <svg
                  width={"17"}
                  height={"17"}
                  viewBox={"0 0 24 24"}
                  fill={"none"}
                  stroke={"currentColor"}
                  strokeWidth={"1.8"}
                  aria-hidden={"true"}
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
              </span>
              <span
                className={"dashboard-quick-link-copy"}
              >
                <strong>
                  {"Backup & export"}
                </strong>
                <small>
                  {"Protect and export your lab data"}
                </small>
              </span>
              <span
                className={"dashboard-quick-arrow"}
                aria-hidden={"true"}
              >
                {"›"}
              </span>
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
