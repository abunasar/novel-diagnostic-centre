import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_LIFETIME_SECONDS = 8 * 60 * 60;

export function sendError(response, status, message) {
  response.status(status).json({ error: message });
}

export function configureCors(request, response) {
  response.setHeader("Cache-Control", "no-store");
  const allowedOrigins = (process.env.APP_ORIGINS || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);
  const requestOrigin = request.headers.origin;

  if (allowedOrigins.length === 0) {
    sendError(response, 500, "The API origin is not configured.");
    return false;
  }
  if (requestOrigin && !allowedOrigins.includes(requestOrigin)) {
    sendError(response, 403, "This app origin is not allowed.");
    return false;
  }

  if (requestOrigin) {
    response.setHeader("Access-Control-Allow-Origin", requestOrigin);
    response.setHeader("Vary", "Origin");
  }
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return false;
  }
  return true;
}

function getAuthSecret() {
  const secret = process.env.APP_AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("APP_AUTH_SECRET must be at least 32 characters.");
  }
  return secret;
}

function safeEqual(first, second) {
  const left = Buffer.from(first);
  const right = Buffer.from(second);
  return left.length === right.length && timingSafeEqual(left, right);
}

function sign(payload) {
  return createHmac("sha256", getAuthSecret()).update(payload).digest("base64url");
}

export function createSessionToken(username) {
  const payload = Buffer.from(JSON.stringify({
    sub: username,
    exp: Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_SECONDS
  })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function hasValidSession(request) {
  const authorization = request.headers.authorization || "";
  const match = /^Bearer ([A-Za-z0-9._-]+)$/.exec(authorization);
  if (!match) return false;

  const parts = match[1].split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return false;
  const [payload, signature] = parts;
  let expected;
  try {
    expected = sign(payload);
  } catch {
    return false;
  }
  if (!safeEqual(signature, expected)) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return session.sub === process.env.APP_USERNAME &&
      Number.isFinite(session.exp) &&
      session.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function requireSession(request, response) {
  if (hasValidSession(request)) return true;
  sendError(response, 401, "Please sign in again.");
  return false;
}

export function readJsonBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body);
    } catch {
      return null;
    }
  }
  return null;
}

export function credentialsMatch(username, password) {
  const expectedUsername = process.env.APP_USERNAME || "";
  const expectedPassword = process.env.APP_PASSWORD || "";
  if (!expectedUsername || !expectedPassword || expectedPassword.length < 12) return false;
  const usernameMatches = safeEqual(username, expectedUsername);
  const passwordMatches = safeEqual(password, expectedPassword);
  return usernameMatches && passwordMatches;
}
