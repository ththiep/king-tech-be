import { listAttendance, upsertAttendance } from "../models/db.js";
import { ApiResponse } from "../utils/response.js";

export async function list(req, res, next) {
  try {
    const records = await listAttendance();
    ApiResponse.success(res, records, "Attendance records retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const record = await upsertAttendance(req.body || {});
    ApiResponse.success(res, record, "Attendance record saved successfully", 201);
  } catch (err) {
    next(err);
  }
}
