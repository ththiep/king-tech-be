export class BaseResponseDto {
  /**
   * Khởi tạo một DTO đơn từ entity.
   */
  static fromEntity(entity) {
    if (!entity) return null;
    return new this(entity);
  }

  /**
   * Khởi tạo một mảng DTO từ mảng entities.
   */
  static fromEntities(entities) {
    if (!entities || !Array.isArray(entities)) return [];
    return entities.map((entity) => this.fromEntity(entity));
  }
}
