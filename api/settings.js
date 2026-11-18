import { getDatabase } from "../server/db.js";
import {
  configureCors,
  readJsonBody,
  requireSession,
  sendError
} from "../server/http.js";

export default async function handler(request, response) {
  if (!configureCors(request, response)) return;
  if (!["GET", "PUT"].includes(request.method)) {
    response.setHeader("Allow", "GET, PUT, OPTIONS");
    sendError(response, 405, "Method not allowed.");
    return;
  }
  if (!requireSession(request, response)) return;

  try {
    const settings = (await getDatabase()).collection("settings");
    if (request.method === "GET") {
      const document = await settings.findOne({ _id: "lab_profile" });
      response.status(200).json({ settings: document?.data || null });
      return;
    }

    const body = readJsonBody(request);
    if (!body?.settings || typeof body.settings !== "object" || Array.isArray(body.settings)) {
      sendError(response, 400, "A settings object is required.");
      return;
    }
    await settings.updateOne(
      { _id: "lab_profile" },
      { $set: { data: body.settings } },
      { upsert: true }
    );
    response.status(200).json({ success: true });
  } catch (error) {
    console.error("MongoDB settings operation failed:", error?.name || "unknown error");
    sendError(response, 500, "Could not access settings. Check the MongoDB configuration.");
  }
}
