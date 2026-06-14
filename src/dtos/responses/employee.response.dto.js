import { BaseResponseDto } from "./base.response.dto.js";

export class EmployeeResponseDto extends BaseResponseDto {
  constructor(entity) {
    super();
    this.id = entity.id;
    this.tenant = entity.tenant;
    this.code = entity.code;
    this.name = entity.name;
    this.email = entity.email;
    this.phone = entity.phone;
    this.dob = entity.dob;
    this.gender = entity.gender;
    this.department = entity.department;
    this.title = entity.title || entity.position; // fallback for old field name if any
    this.joinDate = entity.joinDate || entity.join_date;
    this.baseSalary = entity.baseSalary || entity.base_salary;
    this.status = entity.status;
    this.notes = entity.notes;
    this.createdAt = entity.createdAt || entity.created_at;
    this.updatedAt = entity.updatedAt || entity.updated_at;
    
    // Explicitly ignoring deleted_at
  }
}
