import { BaseRepository } from "./base.repository.js";
import { keysToSnakeCase, keysToCamelCase } from "../utils/transform.js";

class ContactRepository extends BaseRepository {
  constructor() {
    super("contacts");
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

export const contactRepository = new ContactRepository();
