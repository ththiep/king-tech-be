import test from "node:test";
import assert from "node:assert/strict";
import { employeeSchema } from "../src/validations/employee.schema.js";
import { productSchema } from "../src/validations/product.schema.js";

test("employeeSchema validations", async (t) => {
  await t.test("should pass valid employee create payload", () => {
    const validBody = {
      code: "EMP001",
      name: "John Doe",
      title: "Software Engineer",
      department: "IT",
      email: "john.doe@kingtech.com",
      baseSalary: 1000
    };
    
    const result = employeeSchema.create.safeParse({ body: validBody });
    assert.ok(result.success);
    assert.equal(result.data.body.status, "active"); // default value
  });

  await t.test("should fail employee create if code is missing", () => {
    const invalidBody = {
      name: "John Doe",
      title: "Software Engineer",
      department: "IT",
      email: "john.doe@kingtech.com"
    };

    const result = employeeSchema.create.safeParse({ body: invalidBody });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some(issue => issue.path.includes("code")));
  });

  await t.test("should fail employee create if email format is invalid", () => {
    const invalidBody = {
      code: "EMP001",
      name: "John Doe",
      title: "Software Engineer",
      department: "IT",
      email: "invalid-email"
    };

    const result = employeeSchema.create.safeParse({ body: invalidBody });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some(issue => issue.path.includes("email")));
  });

  await t.test("should fail employee create if baseSalary is negative", () => {
    const invalidBody = {
      code: "EMP001",
      name: "John Doe",
      title: "Software Engineer",
      department: "IT",
      email: "john.doe@kingtech.com",
      baseSalary: -500
    };

    const result = employeeSchema.create.safeParse({ body: invalidBody });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some(issue => issue.path.includes("baseSalary")));
  });
});

test("productSchema validations", async (t) => {
  await t.test("should pass valid product create payload", () => {
    const validBody = {
      name: "Wireless Mouse",
      price: 25.5,
      stock: 100
    };

    const result = productSchema.create.safeParse({ body: validBody });
    assert.ok(result.success);
    assert.equal(result.data.body.status, "active"); // default value
    assert.equal(result.data.body.stock, 100);
  });

  await t.test("should fail product create if price is negative", () => {
    const invalidBody = {
      name: "Wireless Mouse",
      price: -5
    };

    const result = productSchema.create.safeParse({ body: invalidBody });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some(issue => issue.path.includes("price")));
  });
});
