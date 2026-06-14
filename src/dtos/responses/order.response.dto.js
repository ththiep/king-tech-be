import { BaseResponseDto } from "./base.response.dto.js";

export class OrderResponseDto extends BaseResponseDto {
  constructor(entity) {
    super();
    this.id = entity.id;
    this.tenant = entity.tenant;
    this.orderCode = entity.orderCode || entity.order_code;
    this.customerName = entity.customerName || entity.customer_name;
    this.customerPhone = entity.customerPhone || entity.customer_phone;
    this.customerAddress = entity.customerAddress || entity.customer_address;
    this.totalAmount = entity.totalAmount || entity.total_amount;
    this.status = entity.status;
    this.notes = entity.notes;
    this.createdAt = entity.createdAt || entity.created_at;
    this.updatedAt = entity.updatedAt || entity.updated_at;
  }
}
