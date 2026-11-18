import { getDatabase } from "../../server/db.js";
import {
  configureCors,
  requireSession,
  sendError
} from "../../server/http.js";

export default async function handler(request, response) {
  if (!configureCors(request, response)) return;
  if (!["GET", "DELETE"].includes(request.method)) {
    response.setHeader("Allow", "GET, DELETE, OPTIONS");
    sendError(response, 405, "Method not allowed.");
    return;
  }
  if (!requireSession(request, response)) return;

  const id = request.query.id;
  if (typeof id !== "string" || !id) {
    sendError(response, 400, "A report ID is required.");
    return;
  }

  try {
    const reports = (await getDatabase()).collection("reports");
    if (request.method === "GET") {
      const report = await reports.findOne({ id }, { projection: { _id: 0, labNoKey: 0 } });
      if (!report) {
        sendError(response, 404, "Report not found.");
        return;
      }
      response.status(200).json({ report });
      return;
    }

    await reports.deleteOne({ id });
    response.status(200).json({ success: true });
  } catch (error) {
    console.error("MongoDB report operation failed:", error?.name || "unknown error");
    sendError(response, 500, "Could not access reports. Check the MongoDB configuration.");
  }
}
