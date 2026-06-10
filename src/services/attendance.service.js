import { attendanceRepository } from "../repositories/attendance.repository.js";
import { employeeRepository } from "../repositories/employee.repository.js";
import { NotFoundError } from "../utils/errors.js";

class AttendanceService {
  async listAttendance(user) {
    return await attendanceRepository.list(user.tenant);
  }

  async upsertAttendance(payload, user) {
    // Security: Verify employee belongs to the same tenant
    const employee = await employeeRepository.getById(payload.employeeId || payload.employee_id, user.tenant);
    if (!employee) {
      throw new NotFoundError("Employee not found or does not belong to your tenant");
    }

    const record = {
      ...payload,
      tenant: user.tenant,
    };
    return await attendanceRepository.upsertAttendance(record);
  }
}

export const attendanceService = new AttendanceService();
