import { config } from "../config/index.js";
import { ApiResponse } from "../utils/response.js";

function buildMeta() {
  return {
    service: "king-tech-be",
    env: config.env,
    timestamp: new Date().toISOString(),
    version: "v1",
  };
}

export function healthCheck(req, res) {
  ApiResponse.success(res, buildMeta(), "System is healthy");
}

export function getMeta(req, res) {
  ApiResponse.success(res, buildMeta(), "Meta fetched successfully");
}
