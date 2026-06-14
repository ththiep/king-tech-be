import { BaseResponseDto } from "./base.response.dto.js";

export class AttendanceResponseDto extends BaseResponseDto {
  constructor(entity) {
    super();
    this.id = entity.id;
    this.tenant = entity.tenant;
    this.employeeId = entity.employeeId || entity.employee_id;
    this.date = entity.date;
    this.status = entity.status;
    this.checkIn = entity.checkIn || entity.check_in;
    this.checkOut = entity.checkOut || entity.check_out;
    this.notes = entity.notes;
    this.createdAt = entity.createdAt || entity.created_at;
    this.updatedAt = entity.updatedAt || entity.updated_at;
  }
}
