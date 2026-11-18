import { configureCors, requireSession, sendError } from "../../server/http.js";

export default function handler(request, response) {
  if (!configureCors(request, response)) return;
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET, OPTIONS");
    sendError(response, 405, "Method not allowed.");
    return;
  }
  if (!requireSession(request, response)) return;
  response.status(200).json({ authenticated: true });
}
