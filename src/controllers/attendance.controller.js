import { ApiResponse } from "../utils/response.js";
import { AttendanceResponseDto } from "../dtos/responses/attendance.response.dto.js";

export async function list(req, res, next) {
  try {
    const attendanceService = req.container.resolve('attendanceService');
    const records = await attendanceService.listAttendance(req.user);
    ApiResponse.success(res, AttendanceResponseDto.fromEntities(records), "Attendance retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const attendanceService = req.container.resolve('attendanceService');
    const record = await attendanceService.upsertAttendance(req.body, req.user);
    ApiResponse.success(res, AttendanceResponseDto.fromEntity(record), "Attendance updated successfully", 201);
  } catch (err) {
    next(err);
  }
}
