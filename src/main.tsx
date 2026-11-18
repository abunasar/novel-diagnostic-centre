import { createRoot } from "react-dom/client";
import App from "./App";
import "../css/app.css";
import "../js/templates.js";
import "../js/mongo-db.js";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("React root element #root was not found.");
}

createRoot(rootElement).render(<App />);
