import test from "node:test";
import assert from "node:assert/strict";
import {
  toSnakeCase,
  toCamelCase,
  keysToSnakeCase,
  keysToCamelCase,
} from "../src/utils/transform.js";
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
} from "../src/utils/errors.js";
import { container } from "../src/container.js";
import { buildConfig } from "../src/config/index.js";

test("transform utilities", async (t) => {
  await t.test("toSnakeCase converts camelCase to snake_case", () => {
    assert.equal(toSnakeCase("camelCase"), "camel_case");
    assert.equal(toSnakeCase("myAwesomeVariable"), "my_awesome_variable");
    assert.equal(toSnakeCase("simple"), "simple");
  });

  await t.test("toCamelCase converts snake_case to camelCase", () => {
    assert.equal(toCamelCase("snake_case"), "snakeCase");
    assert.equal(toCamelCase("my_awesome_variable"), "myAwesomeVariable");
    assert.equal(toCamelCase("simple"), "simple");
  });

  await t.test("keysToSnakeCase converts all keys of an object to snake_case", () => {
    const input = {
      firstName: "John",
      lastName: "Doe",
      contactInfo: {
        phoneNumber: "123456",
        emailAddress: "john@example.com",
      },
    };
    const expected = {
      first_name: "John",
      last_name: "Doe",
      contact_info: {
        phone_number: "123456",
        email_address: "john@example.com",
      },
    };
    assert.deepEqual(keysToSnakeCase(input), expected);
  });

  await t.test("keysToCamelCase converts all keys of an object to camelCase", () => {
    const input = {
      first_name: "John",
      last_name: "Doe",
      contact_info: {
        phone_number: "123456",
        email_address: "john@example.com",
      },
    };
    const expected = {
      firstName: "John",
      lastName: "Doe",
      contactInfo: {
        phoneNumber: "123456",
        emailAddress: "john@example.com",
      },
    };
    assert.deepEqual(keysToCamelCase(input), expected);
  });

  await t.test("keysToSnakeCase and keysToCamelCase handle arrays", () => {
    const input = [{ firstName: "John" }, { lastName: "Doe" }];
    const expected = [{ first_name: "John" }, { last_name: "Doe" }];
    assert.deepEqual(keysToSnakeCase(input), expected);
    assert.deepEqual(keysToCamelCase(expected), input);
  });
});

test("custom error classes", async (t) => {
  await t.test("AppError inherits from Error and sets properties correctly", () => {
    const error = new AppError("Test message", 418);
    assert.ok(error instanceof Error);
    assert.equal(error.message, "Test message");
    assert.equal(error.statusCode, 418);
    assert.equal(error.name, "AppError");
  });

  await t.test("BadRequestError sets 400 status code", () => {
    const error = new BadRequestError("Invalid input");
    assert.equal(error.statusCode, 400);
    assert.equal(error.message, "Invalid input");
  });

  await t.test("UnauthorizedError sets 401 status code", () => {
    const error = new UnauthorizedError();
    assert.equal(error.statusCode, 401);
    assert.equal(error.message, "Unauthorized");
  });

  await t.test("ForbiddenError sets 403 status code", () => {
    const error = new ForbiddenError();
    assert.equal(error.statusCode, 403);
    assert.equal(error.message, "Forbidden");
  });

  await t.test("NotFoundError sets 404 status code", () => {
    const error = new NotFoundError();
    assert.equal(error.statusCode, 404);
    assert.equal(error.message, "Not Found");
  });

  await t.test("InternalServerError sets 500 status code", () => {
    const error = new InternalServerError();
    assert.equal(error.statusCode, 500);
    assert.equal(error.message, "Internal Server Error");
  });
});

test("configuration", async (t) => {
  await t.test("orders feature flag is inactive by default", () => {
    const result = buildConfig({ NODE_ENV: "development" });
    assert.equal(result.features.orders, false);
  });

  await t.test("orders feature flag can be enabled explicitly", () => {
    const result = buildConfig({ NODE_ENV: "development", ORDER_MODULE_ACTIVE: "true" });
    assert.equal(result.features.orders, true);
  });

  await t.test("production requires an explicit JWT secret", () => {
    assert.throws(
      () => buildConfig({
        NODE_ENV: "production",
        SUPABASE_URL: "https://example.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY: "service-role-key"
      }),
      /JWT_SECRET/
    );
  });
});

test("upload service", async (t) => {
  const uploadService = container.resolve('uploadService');
  await t.test("uploadBase64Image returns input string as is if not base64", async () => {
    const normalUrl = "https://example.com/avatar.png";
    const result = await uploadService.uploadBase64Image(normalUrl, "tenant1");
    assert.equal(result, normalUrl);

    const empty = "";
    const resultEmpty = await uploadService.uploadBase64Image(empty, "tenant1");
    assert.equal(resultEmpty, empty);
  });
});
