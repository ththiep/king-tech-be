import { attendanceService } from "../services/attendance.service.js";
import { ApiResponse } from "../utils/response.js";

export async function list(req, res, next) {
  try {
    const records = await attendanceService.listAttendance(req.user);
    ApiResponse.success(res, records, "Attendance retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const record = await attendanceService.upsertAttendance(req.body, req.user);
    ApiResponse.success(res, record, "Attendance updated successfully", 201);
  } catch (err) {
    next(err);
  }
}
