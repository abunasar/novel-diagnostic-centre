import type { LabApp } from "../../js/app.js";

declare global {
  interface Window {
    app?: LabApp;
  }
}

export {};
