import assert from "node:assert/strict";
import test from "node:test";
import {
  configureCors,
  createSessionToken,
  credentialsMatch,
  hasValidSession
} from "../server/http.js";

const originalEnvironment = {
  APP_AUTH_SECRET: process.env.APP_AUTH_SECRET,
  APP_ORIGINS: process.env.APP_ORIGINS,
  APP_USERNAME: process.env.APP_USERNAME,
  APP_PASSWORD: process.env.APP_PASSWORD
};

test.before(() => {
  process.env.APP_AUTH_SECRET = "test-secret-with-at-least-32-characters";
  process.env.APP_ORIGINS = "https://example.github.io";
  process.env.APP_USERNAME = "laboratory-admin";
  process.env.APP_PASSWORD = "test-password-long-enough";
});

test.after(() => {
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test("allows only explicitly configured frontend origins", () => {
  const headers = {};
  const response = {
    setHeader(name, value) {
      headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
    }
  };

  assert.equal(configureCors({
    method: "GET",
    headers: { origin: "https://example.github.io" }
  }, response), true);
  assert.equal(headers["Access-Control-Allow-Origin"], "https://example.github.io");
  assert.equal(configureCors({
    method: "GET",
    headers: { origin: "https://attacker.example" }
  }, response), false);
  assert.equal(response.statusCode, 403);
});

test("accepts a signed, unexpired session for the configured username", () => {
  const token = createSessionToken(process.env.APP_USERNAME);
  assert.equal(hasValidSession({ headers: { authorization: `Bearer ${token}` } }), true);
});

test("rejects altered session tokens", () => {
  const [payload, signature] = createSessionToken(process.env.APP_USERNAME).split(".");
  const alteredPayload = `${payload[0] === "a" ? "b" : "a"}${payload.slice(1)}`;
  assert.equal(hasValidSession({
    headers: { authorization: `Bearer ${alteredPayload}.${signature}` }
  }), false);
  assert.equal(hasValidSession({
    headers: { authorization: `Bearer ${createSessionToken(process.env.APP_USERNAME)}.extra` }
  }), false);
});

test("compares login credentials exactly", () => {
  assert.equal(credentialsMatch("laboratory-admin", "test-password-long-enough"), true);
  assert.equal(credentialsMatch("laboratory-admin", "wrong-password-long-enough"), false);
  assert.equal(credentialsMatch("other-user", "test-password-long-enough"), false);
});
