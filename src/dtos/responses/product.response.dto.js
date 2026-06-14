import { BaseResponseDto } from "./base.response.dto.js";

export class ProductResponseDto extends BaseResponseDto {
  constructor(entity) {
    super();
    this.id = entity.id;
    this.tenant = entity.tenant;
    this.code = entity.code;
    this.name = entity.name;
    this.category = entity.category;
    this.price = entity.price;
    this.inventory = entity.inventory;
    this.description = entity.description;
    this.isActive = entity.isActive !== undefined ? entity.isActive : entity.is_active;
    this.createdAt = entity.createdAt || entity.created_at;
    this.updatedAt = entity.updatedAt || entity.updated_at;
  }
}
