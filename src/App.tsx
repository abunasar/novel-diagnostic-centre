import { useEffect, useState } from "react";
import { labDB } from "../js/mongo-db.js";
import { LabApp } from "../js/app.js";
import AppHeader from "./components/AppHeader";
import BackupAndExport from "./components/BackupAndExport";
import Dashboard from "./components/Dashboard";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import LoginScreen from "./components/LoginScreen";
import LabSettings from "./components/LabSettings";
import NotificationRegion from "./components/NotificationRegion";
import PatientReportForm from "./components/PatientReportForm";
import PrintPreviewModal from "./components/PrintPreviewModal";
import RecordsPage from "./components/RecordsPage";

export default function App() {
  const [authState, setAuthState] = useState<"checking" | "signed-out" | "signed-in">("checking");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let active = true;
    const handleExpiredSession = () => {
      labDB.logout();
      setAuthError("Your session expired. Please sign in again.");
      setAuthState("signed-out");
    };
    window.addEventListener("labflow:session-expired", handleExpiredSession);
    labDB.restoreSession()
      .then(authenticated => {
        if (active) setAuthState(authenticated ? "signed-in" : "signed-out");
      })
      .catch(error => {
        if (!active) return;
        setAuthError(error instanceof Error ? error.message : String(error));
        setAuthState("signed-out");
      });

    return () => {
      active = false;
      window.removeEventListener("labflow:session-expired", handleExpiredSession);
    };
  }, []);

  async function handleLogin(username: string, password: string) {
    await labDB.login(username, password);
    setAuthError("");
    setAuthState("signed-in");
  }

  function handleLogout() {
    labDB.logout();
    setAuthError("");
    setAuthState("signed-out");
  }

  if (authState === "checking") {
    return <main role={"status"} style={{ padding: "48px", textAlign: "center" }}>Checking database session...</main>;
  }
  if (authState === "signed-out") {
    return <LoginScreen onLogin={handleLogin} error={authError} />;
  }

  return <AuthenticatedApp onLogout={handleLogout} />;
}

function AuthenticatedApp({ onLogout }: { onLogout: () => void }) {
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
        <AppHeader onLogout={onLogout} />
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
