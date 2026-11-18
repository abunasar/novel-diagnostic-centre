import { randomUUID } from "node:crypto";
import { getDatabase } from "../../server/db.js";
import {
  configureCors,
  readJsonBody,
  requireSession,
  sendError
} from "../../server/http.js";

export default async function handler(request, response) {
  if (!configureCors(request, response)) return;
  if (!["GET", "POST"].includes(request.method)) {
    response.setHeader("Allow", "GET, POST, OPTIONS");
    sendError(response, 405, "Method not allowed.");
    return;
  }
  if (!requireSession(request, response)) return;

  try {
    const database = await getDatabase();
    const reports = database.collection("reports");

    if (request.method === "GET") {
      const results = await reports.find({}, { projection: { _id: 0, labNoKey: 0 } })
        .sort({ reportDate: -1, createdAt: -1 })
        .toArray();
      response.status(200).json({ reports: results });
      return;
    }

    const body = readJsonBody(request);
    if (!body?.report || typeof body.report !== "object" || Array.isArray(body.report)) {
      sendError(response, 400, "A report object is required.");
      return;
    }
    const report = { ...body.report };
    delete report._id;
    delete report.labNoKey;
    if (report.id !== undefined && typeof report.id !== "string") {
      sendError(response, 400, "The report ID must be a string.");
      return;
    }
    if (report.labNo !== undefined && typeof report.labNo !== "string") {
      sendError(response, 400, "The report number must be a string.");
      return;
    }
    if (typeof report.labNo === "string" && report.labNo.trim()) {
      report.labNo = report.labNo.trim();
    }
    if (report.labNo && report.labNo.length > 100) {
      sendError(response, 400, "The report number is too long.");
      return;
    }

    const existing = report.labNo
      ? await reports.findOne({ labNoKey: report.labNo.toLowerCase() }, { projection: { _id: 0 } })
      : await reports.findOne({ id: report.id }, { projection: { _id: 0 } });
    if (existing) {
      report.id = existing.id;
      report.createdAt = report.createdAt || existing.createdAt;
    }
    if (typeof report.id !== "string" || !report.id) report.id = randomUUID();
    if (!report.createdAt) report.createdAt = new Date().toISOString();
    report.updatedAt = new Date().toISOString();
    const document = { ...report };
    if (report.labNo) document.labNoKey = report.labNo.toLowerCase();

    await reports.replaceOne({ id: report.id }, document, { upsert: true });
    delete report.labNoKey;
    response.status(200).json({ report });
  } catch (error) {
    console.error("MongoDB report operation failed:", error?.name || "unknown error");
    sendError(response, 500, "Could not access reports. Check the MongoDB configuration.");
  }
}
