import { useEffect } from "react";
import { LabApp } from "../js/app.js";
import AppHeader from "./components/AppHeader";
import BackupAndExport from "./components/BackupAndExport";
import Dashboard from "./components/Dashboard";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import LabSettings from "./components/LabSettings";
import NotificationRegion from "./components/NotificationRegion";
import PatientReportForm from "./components/PatientReportForm";
import PrintPreviewModal from "./components/PrintPreviewModal";
import RecordsPage from "./components/RecordsPage";

export default function App() {
  useEffect(() => {
    const app = new LabApp();
    window.app = app;

    return () => {
      app.destroy();
      if (window.app === app) delete window.app;
    };
  }, []);

  return (
    <>
      <div className="app-container">
        <AppHeader />
        <div className="main-wrapper">
          <main className="content-area">
            <Dashboard />
            <PatientReportForm />
            <RecordsPage />
            <LabSettings />
            <BackupAndExport />
          </main>
        </div>
      </div>
      <PrintPreviewModal />
      <DeleteConfirmationModal />
      <NotificationRegion />
    </>
  );
}
