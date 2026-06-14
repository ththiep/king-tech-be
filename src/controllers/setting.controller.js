import { ApiResponse } from "../utils/response.js";
import { SettingResponseDto } from "../dtos/responses/setting.response.dto.js";

export async function getSettings(req, res, next) {
  try {
    const settingService = req.container.resolve('settingService');
    const result = await settingService.getSettings(req.user);
    ApiResponse.success(res, SettingResponseDto.fromEntity(result), "Settings retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const settingService = req.container.resolve('settingService');
    const result = await settingService.updateSettings(req.body, req.user);
    ApiResponse.success(res, SettingResponseDto.fromEntity(result), "Settings updated successfully");
  } catch (err) {
    next(err);
  }
}
