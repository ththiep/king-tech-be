import { settingService } from "../services/setting.service.js";
import { ApiResponse } from "../utils/response.js";

export async function getSettings(req, res, next) {
  try {
    const result = await settingService.getSettings(req.user);
    ApiResponse.success(res, result, "Settings retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const result = await settingService.updateSettings(req.body, req.user);
    ApiResponse.success(res, result, "Settings updated successfully");
  } catch (err) {
    next(err);
  }
}
