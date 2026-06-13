import { BaseRepository } from "./base.repository.js";
import { keysToSnakeCase, keysToCamelCase } from "../utils/transform.js";

export class OrderRepository extends BaseRepository {
  constructor() {
    super("orders");
  }

  async list(tenant) {
    const { data, error } = await this.query(tenant).order("created_at", { ascending: false });
    this.handleError(error);
    return keysToCamelCase(data) || [];
  }

  async create(payload) {
    const data = await this.insert(keysToSnakeCase(payload));
    return keysToCamelCase(data);
  }
}


