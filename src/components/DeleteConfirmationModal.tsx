export default function DeleteConfirmationModal() {
  return (
    <div
      className={"confirm-overlay"}
      id={"delete-confirmation-modal"}
      aria-hidden={"true"}
    >
      <section
        className={"confirm-dialog"}
        id={"delete-confirmation-dialog"}
        role={"alertdialog"}
        aria-modal={"true"}
        aria-labelledby={"delete-confirmation-title"}
        aria-describedby={"delete-confirmation-description"}
        tabIndex={-1}
      >
        <div className={"confirm-dialog-icon"} aria-hidden={"true"}>
          <svg
            width={"24"}
            height={"24"}
            viewBox={"0 0 24 24"}
            fill={"none"}
            stroke={"currentColor"}
            strokeWidth={"1.8"}
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
          >
            <path d={"M3 6h18"} />
            <path d={"M8 6V4h8v2"} />
            <path d={"m19 6-1 14H6L5 6"} />
            <path d={"M10 11v5M14 11v5"} />
          </svg>
        </div>
        <h2 id={"delete-confirmation-title"}>{"Delete this report?"}</h2>
        <p id={"delete-confirmation-description"}>
          {"This action cannot be undone. The report will be permanently removed."}
        </p>
        <div className={"confirm-dialog-actions"}>
          <button
            type={"button"}
            className={"btn btn-secondary"}
            id={"btn-cancel-delete"}
          >
            {"Cancel"}
          </button>
          <button
            type={"button"}
            className={"btn btn-danger"}
            id={"btn-confirm-delete"}
          >
            {"Delete report"}
          </button>
        </div>
      </section>
    </div>
  );
}
