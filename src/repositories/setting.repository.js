import { BaseRepository } from "./base.repository.js";

export class SettingRepository extends BaseRepository {
  constructor() {
    super("settings");
  }

  async getByTenant(tenant) {
    try {
      const { data, error } = await this.db
        .from(this.tableName)
        .select("*")
        .eq("tenant", tenant)
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST103' || (error.message && error.message.includes('relation "settings" does not exist'))) {
          console.warn("WARNING: Settings table does not exist in database. Falling back to default settings.");
          return null;
        }
        this.handleError(error);
      }
      return data;
    } catch (err) {
      if (err.message && err.message.includes('relation "settings" does not exist')) {
        console.warn("WARNING: Settings table does not exist in database. Falling back to default settings.");
        return null;
      }
      throw err;
    }
  }

  async upsertByTenant(tenant, payload) {
    const { data, error } = await this.db
      .from(this.tableName)
      .upsert({
        tenant,
        departments: payload.departments,
        work_statuses: payload.workStatuses,
        attendance_statuses: payload.attendanceStatuses,
        updated_at: new Date().toISOString()
      }, { onConflict: "tenant" })
      .select()
      .single();

    if (error) {
      if (error.message && error.message.includes('relation "settings" does not exist')) {
        throw new Error("Settings table does not exist in database. Please run schema-update-settings.sql in Supabase SQL editor.");
      }
      this.handleError(error);
    }
    return data;
  }
}


