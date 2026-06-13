import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { requireAuth } from "../src/middlewares/auth.js";
import { config } from "../src/config/index.js";

test("auth middleware", async (t) => {
  await t.test("should pass with valid Bearer token", () => {
    const payload = { id: "user-123", tenant: "kingtech", role: "admin" };
    const token = jwt.sign(payload, config.jwtSecret);

    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };
    
    const res = {};

    requireAuth(req, res, next);

    assert.ok(nextCalled);
    assert.equal(req.user.id, "user-123");
    assert.equal(req.user.tenant, "kingtech");
  });

  await t.test("should return 401 if authorization header is missing", () => {
    const req = {
      headers: {}
    };
    
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    let statusCode = null;
    let responseBody = null;
    
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        responseBody = body;
        return this;
      }
    };

    requireAuth(req, res, next);

    assert.ok(!nextCalled);
    assert.equal(statusCode, 401);
    assert.equal(responseBody.success, false);
    assert.equal(responseBody.message, "Unauthorized: No token provided");
  });

  await t.test("should return 401 if token is invalid", () => {
    const req = {
      headers: {
        authorization: "Bearer invalid-token-value"
      }
    };
    
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    let statusCode = null;
    let responseBody = null;
    
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        responseBody = body;
        return this;
      }
    };

    requireAuth(req, res, next);

    assert.ok(!nextCalled);
    assert.equal(statusCode, 401);
    assert.equal(responseBody.success, false);
    assert.equal(responseBody.message, "Unauthorized: Invalid or expired token");
  });
});

import { createRateLimiter } from "../src/middlewares/rateLimit.js";

test("rate limiter middleware", async (t) => {
  await t.test("should pass when requests are below limit", () => {
    const limiter = createRateLimiter({ windowMs: 10000, max: 2 });
    const req = { ip: "127.0.0.1" };
    let nextCalled = 0;
    const next = () => {
      nextCalled++;
    };
    const res = {};

    limiter(req, res, next);
    limiter(req, res, next);

    assert.equal(nextCalled, 2);
  });

  await t.test("should return 429 when request limit is exceeded", () => {
    const limiter = createRateLimiter({ windowMs: 10000, max: 2, message: "Limit exceeded" });
    const req = { ip: "127.0.0.2" };
    let nextCalled = 0;
    const next = () => {
      nextCalled++;
    };
    
    let statusCode = null;
    let responseBody = null;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        responseBody = body;
        return this;
      }
    };

    // First 2 requests pass
    limiter(req, res, next);
    limiter(req, res, next);
    
    // 3rd request is blocked
    limiter(req, res, next);

    assert.equal(nextCalled, 2);
    assert.equal(statusCode, 429);
    assert.equal(responseBody.success, false);
    assert.equal(responseBody.message, "Limit exceeded");
  });
});
