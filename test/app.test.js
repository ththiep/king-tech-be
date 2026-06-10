import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";

test("health endpoint responds with ok", async () => {
  const response = await request(app).get("/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.service, "king-tech-be");
});

test.skip("products endpoint returns seeded data (requires Supabase)", async () => {
  const response = await request(app).get("/api/v1/products");
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.data));
  assert.ok(response.body.data.length >= 2);
});

test.skip("employees endpoint returns an array (requires Supabase)", async () => {
  const response = await request(app).get("/api/v1/employees");
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.data));
});
