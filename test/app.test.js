import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../src/app.js";
import { config } from "../src/config/index.js";

test("health endpoint responds with ok", async () => {
  const response = await request(app).get("/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.service, "king-tech-be");
});

test("orders endpoint is explicitly inactive by default", async () => {
  const token = jwt.sign(
    { id: "user-123", tenant: "kingtech", role: "admin" },
    config.jwtSecret
  );

  const response = await request(app)
    .post("/api/v1/orders")
    .set("Authorization", `Bearer ${token}`)
    .send({
      customerName: "Test Customer",
      items: [{ productId: "prod-1", productName: "Product", quantity: 1, price: 10 }],
      totalAmount: 10
    });

  assert.equal(response.status, 503);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, "module_inactive");
});
