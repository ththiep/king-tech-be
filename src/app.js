import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import { AppError } from "./utils/errors.js";
import routes from "./routes/index.js";
import { randomUUID } from "node:crypto";
import { ApiResponse } from "./utils/response.js";

export const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: "1mb" }));

// Inject Request ID
app.use((req, res, next) => {
  req.id = req.headers["x-request-id"] || randomUUID();
  res.setHeader("X-Request-Id", req.id);
  next();
});

// API Routes
app.use("/", routes);

// 404 Handler
app.use((req, res) => {
  ApiResponse.error(
    res,
    `Route not found: ${req.method} ${req.path}`,
    404,
    { code: "not_found" }
  );
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path} ->`, err);

  const statusCode = err.statusCode || 500;
  
  // Clean message for client
  let message = "Internal server error";
  if (err.name === 'AppError') {
    message = err.message;
  } else if (statusCode < 500) {
    message = err.message || "Request failed";
  }

  const errorDetails = { code: err.code || "request_error" };
  if (config.env !== "production") {
    errorDetails.stack = err.stack;
    errorDetails.originalMessage = err.message;
  }

  ApiResponse.error(
    res,
    message,
    statusCode,
    errorDetails
  );
});
