import { useState, type FormEvent } from "react";
import { labDB } from "../../js/mongo-db.js";

export default function LoginScreen({
  onLogin,
  error
}: {
  onLogin: (username: string, password: string) => Promise<void>;
  error: string;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setLoginError("");
    try {
      await onLogin(username, password);
    } catch (reason) {
      setLoginError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px", background: "#f4f7fb" }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: "400px", padding: "32px", borderRadius: "14px", background: "#fff", boxShadow: "0 12px 40px #0f172a18" }}>
        <img src={"./assets/lab-logo.png"} alt={""} style={{ display: "block", width: "64px", height: "64px", objectFit: "contain", margin: "0 auto 16px" }} />
        <h1 style={{ margin: "0 0 8px", textAlign: "center", fontSize: "22px" }}>Novel Diagnostic Centre</h1>
        <p style={{ margin: "0 0 24px", textAlign: "center", color: "#64748b" }}>Sign in to the laboratory database</p>
        {(error || loginError) && (
          <p role={"alert"} style={{ color: "#b91c1c", background: "#fef2f2", padding: "10px", borderRadius: "6px" }}>
            {loginError || error}
          </p>
        )}
        <label htmlFor={"login-username"} style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Username</label>
        <input
          id={"login-username"}
          name={"username"}
          autoComplete={"username"}
          required
          value={username}
          onChange={event => setUsername(event.target.value)}
          style={{ boxSizing: "border-box", width: "100%", padding: "11px", marginBottom: "16px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
        />
        <label htmlFor={"login-password"} style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Password</label>
        <input
          id={"login-password"}
          name={"password"}
          type={"password"}
          autoComplete={"current-password"}
          required
          value={password}
          onChange={event => setPassword(event.target.value)}
          style={{ boxSizing: "border-box", width: "100%", padding: "11px", marginBottom: "20px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
        />
        <button className={"btn btn-primary"} type={"submit"} disabled={submitting} style={{ width: "100%" }}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
        <p style={{ margin: "16px 0 0", color: "#64748b", fontSize: "12px", textAlign: "center" }}>
          {"Secure access to the MongoDB database"}
        </p>
      </form>
    </main>
  );
}
