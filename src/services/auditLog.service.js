import { randomUUID } from "node:crypto";

export class AuditLogService {
  constructor({ auditLogRepository }) {
    this.auditLogRepository = auditLogRepository;
  }
  /**
   * Ghi nhận một hành động vào hệ thống nhật ký
   * @param {Object} payload
   * @param {string} payload.tenant
   * @param {string} payload.userId
   * @param {string} payload.action (CREATE, UPDATE, DELETE)
   * @param {string} payload.resource (Tên resource, ví dụ: EMPLOYEE)
   * @param {string} payload.resourceId (ID của resource)
   * @param {Object|null} payload.oldValues (Dữ liệu cũ, null nếu là CREATE)
   * @param {Object|null} payload.newValues (Dữ liệu mới, null nếu là DELETE)
   */
  async logAction({ tenant, userId, action, resource, resourceId, oldValues = null, newValues = null }) {
    try {
      const logEntry = {
        id: `log-${Date.now()}-${randomUUID().slice(0, 8)}`,
        tenant,
        userId,
        action,
        resource,
        resourceId,
        oldValues,
        newValues
      };
      
      // Chúng ta fire-and-forget thao tác ghi log để không block luồng chính.
      // Dùng await ở đây có thể làm chậm API, nhưng đảm bảo tính nhất quán (nếu muốn).
      // Ở đây dùng await nhưng bọc trong try/catch để không làm sập chức năng chính nếu lỗi log.
      await this.auditLogRepository.createLog(logEntry);
    } catch (error) {
      console.error("AuditLog Error:", error.message);
      // Không ném lỗi ra ngoài để luồng chính vẫn tiếp tục chạy
    }
  }

  async listLogs(user, queryOptions) {
    const { tenant } = user;
    const { data, count } = await this.auditLogRepository.list(tenant, queryOptions);
    
    return {
      data,
      meta: {
        total: count,
        page: Number(queryOptions.page) || 1,
        limit: Number(queryOptions.limit) || 50,
        totalPages: Math.ceil(count / (Number(queryOptions.limit) || 50)),
      }
    };
  }
}


