import { BaseResponseDto } from "./base.response.dto.js";

export class SettingResponseDto extends BaseResponseDto {
  constructor(entity) {
    super();
    this.tenant = entity.tenant;
    this.departments = entity.departments;
    this.workStatuses = entity.workStatuses || entity.work_statuses;
    this.attendanceStatuses = entity.attendanceStatuses || entity.attendance_statuses;
    this.updatedAt = entity.updatedAt || entity.updated_at;
  }
}
