import { BaseRepository } from "./base.repository.js";
import { keysToSnakeCase, keysToCamelCase } from "../utils/transform.js";

export class EmployeeRepository extends BaseRepository {
  constructor() {
    super("employees");
  }

  async list(tenant, options = {}) {
    const { page = 1, limit = 20, search, sortBy = "created_at", order = "desc", filters = {} } = options;
    
    let query = this.queryWithCount(tenant);

    if (filters.department) query = query.eq("department", filters.department);
    if (filters.status) query = query.eq("status", filters.status);

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,code.ilike.%${search}%`);
    }

    const sortCol = sortBy === "createdAt" ? "created_at" : Object.keys(keysToSnakeCase({[sortBy]: 1}))[0] || sortBy;
    query = query.order(sortCol, { ascending: order === "asc" });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    this.handleError(error);

    return { data: keysToCamelCase(data) || [], count: count || 0 };
  }

  async getById(id, tenant) {
    const { data, error } = await this.query(tenant).eq("id", id).maybeSingle();
    this.handleError(error);
    return keysToCamelCase(data);
  }

  async create(payload) {
    const data = await this.insert(keysToSnakeCase(payload));
    return keysToCamelCase(data);
  }

  async batchCreate(payloads) {
    const data = await this.insertMany(payloads.map(keysToSnakeCase));
    return keysToCamelCase(data);
  }

  async updateById(id, tenant, payload) {
    const data = await this.update(id, tenant, keysToSnakeCase(payload));
    return keysToCamelCase(data);
  }

  async softDelete(id, tenant, userId) {
    return this.updateById(id, tenant, { deletedAt: new Date().toISOString(), updatedBy: userId });
  }

  async batchSoftDelete(ids, tenant, userId) {
    const { error } = await this.db
      .from(this.tableName)
      .update({ deleted_at: new Date().toISOString(), updated_by: userId })
      .eq("tenant", tenant)
      .in("id", ids);
    this.handleError(error);
    return true;
  }
}


