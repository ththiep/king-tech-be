import { BaseResponseDto } from "./base.response.dto.js";

export class AuthResponseDto extends BaseResponseDto {
  constructor(entity) {
    super();
    this.id = entity.id;
    this.email = entity.email;
    this.name = entity.name;
    this.role = entity.role;
    this.tenant = entity.tenant;
    this.createdAt = entity.createdAt || entity.created_at;
    
    // Explicitly ignoring password_hash and deleted_at
  }
}
