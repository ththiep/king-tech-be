import { BaseRepository } from "./base.repository.js";
import { keysToSnakeCase, keysToCamelCase } from "../utils/transform.js";

class ProductRepository extends BaseRepository {
  constructor() {
    super("products");
  }

  async list(tenant) {
    const { data, error } = await this.query(tenant).order("created_at", { ascending: false });
    this.handleError(error);
    return keysToCamelCase(data) || [];
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

  async updateById(id, tenant, payload) {
    const data = await this.update(id, tenant, keysToSnakeCase(payload));
    return keysToCamelCase(data);
  }
}

export const productRepository = new ProductRepository();
