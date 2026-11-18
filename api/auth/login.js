import {
  configureCors,
  createSessionToken,
  credentialsMatch,
  readJsonBody,
  sendError
} from "../../server/http.js";

export default function handler(request, response) {
  if (!configureCors(request, response)) return;
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    sendError(response, 405, "Method not allowed.");
    return;
  }

  const body = readJsonBody(request);
  if (!body || typeof body.username !== "string" || typeof body.password !== "string") {
    sendError(response, 400, "Enter a username and password.");
    return;
  }

  try {
    if (!credentialsMatch(body.username, body.password)) {
      sendError(response, 401, "Incorrect username or password.");
      return;
    }
    response.status(200).json({ token: createSessionToken(body.username) });
  } catch {
    sendError(response, 500, "Login is not configured correctly.");
  }
}
