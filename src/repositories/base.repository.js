import { supabase } from "../models/db.js";
import { InternalServerError } from "../utils/errors.js";

export class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = supabase;
  }

  handleError(error) {
    if (error) {
      // Gracefully handle 416 Range Not Satisfiable (PGRST103)
      if (error.code === 'PGRST103' || (error.message && error.message.toLowerCase().includes('range not satisfiable'))) {
        return;
      }
      console.error(`[Supabase Error - ${this.tableName}]:`, JSON.stringify(error, null, 2));
      throw new InternalServerError(error.message);
    }
  }

  query(tenant) {
    return this.db.from(this.tableName).select("*").eq("tenant", tenant).is("deleted_at", null);
  }

  queryWithCount(tenant) {
    return this.db.from(this.tableName).select("*", { count: "exact" }).eq("tenant", tenant).is("deleted_at", null);
  }

  async insert(payload) {
    const { data, error } = await this.db.from(this.tableName).insert(payload).select().single();
    this.handleError(error);
    return data;
  }

  async insertMany(payloads) {
    const { data, error } = await this.db.from(this.tableName).insert(payloads).select();
    this.handleError(error);
    return data;
  }

  async update(id, tenant, payload) {
    const { data, error } = await this.db
      .from(this.tableName)
      .update(payload)
      .eq("id", id)
      .eq("tenant", tenant)
      .is("deleted_at", null)
      .select()
      .maybeSingle();
      
    this.handleError(error);
    return data;
  }
}
