export class CreateEmployeeRequestDto {
  constructor(payload) {
    this.code = payload.code;
    this.name = payload.name;
    this.email = payload.email;
    this.phone = payload.phone;
    this.dob = payload.dob;
    this.gender = payload.gender;
    this.department = payload.department;
    this.title = payload.title;
    this.joinDate = payload.joinDate;
    this.baseSalary = payload.baseSalary;
    this.status = payload.status;
    this.notes = payload.notes;
  }
}

export class UpdateEmployeeRequestDto {
  constructor(payload) {
    if (payload.code !== undefined) this.code = payload.code;
    if (payload.name !== undefined) this.name = payload.name;
    if (payload.email !== undefined) this.email = payload.email;
    if (payload.phone !== undefined) this.phone = payload.phone;
    if (payload.dob !== undefined) this.dob = payload.dob;
    if (payload.gender !== undefined) this.gender = payload.gender;
    if (payload.department !== undefined) this.department = payload.department;
    if (payload.title !== undefined) this.title = payload.title;
    if (payload.joinDate !== undefined) this.joinDate = payload.joinDate;
    if (payload.baseSalary !== undefined) this.baseSalary = payload.baseSalary;
    if (payload.status !== undefined) this.status = payload.status;
    if (payload.notes !== undefined) this.notes = payload.notes;
  }
}
