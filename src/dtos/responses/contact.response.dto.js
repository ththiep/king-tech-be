import { BaseResponseDto } from "./base.response.dto.js";

export class ContactResponseDto extends BaseResponseDto {
  constructor(entity) {
    super();
    this.id = entity.id;
    this.tenant = entity.tenant;
    this.name = entity.name;
    this.email = entity.email;
    this.phone = entity.phone;
    this.message = entity.message;
    this.status = entity.status;
    this.createdAt = entity.createdAt || entity.created_at;
    this.updatedAt = entity.updatedAt || entity.updated_at;
  }
}
