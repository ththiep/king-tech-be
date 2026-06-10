import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { ApiResponse } from "../utils/response.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return ApiResponse.error(res, "Unauthorized: No token provided", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    // Attach user info to request
    req.user = decoded;
    next();
  } catch (err) {
    return ApiResponse.error(res, "Unauthorized: Invalid or expired token", 401);
  }
}
