import type { LabApp } from "../../js/app.js";
import type { labDB } from "../../js/mongo-db.js";

declare global {
  interface Window {
    app?: LabApp;
    labDB: typeof labDB;
  }
}

export {};
