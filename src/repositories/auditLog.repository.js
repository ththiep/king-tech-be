import { BaseRepository } from "./base.repository.js";
import { keysToSnakeCase, keysToCamelCase } from "../utils/transform.js";

export class AuditLogRepository extends BaseRepository {
  constructor() {
    super("audit_logs");
  }

  async createLog(payload) {
    const data = await this.insert(keysToSnakeCase(payload));
    return keysToCamelCase(data);
  }

  async list(tenant, options = {}) {
    const { page = 1, limit = 50, resource, userId, action } = options;
    
    let query = this.queryWithCount(tenant);

    if (resource) query = query.eq("resource", resource);
    if (userId) query = query.eq("user_id", userId);
    if (action) query = query.eq("action", action);

    query = query.order("created_at", { ascending: false });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    this.handleError(error);

    return { data: keysToCamelCase(data) || [], count: count || 0 };
  }
}


