import { BaseRepository } from "./base.repository.js";
import { keysToSnakeCase, keysToCamelCase } from "../utils/transform.js";

class AttendanceRepository extends BaseRepository {
  constructor() {
    super("attendance_records");
  }

  async list(tenant) {
    // Note: If attendance records don't have deleted_at, BaseRepository's query() might fail.
    // Assuming they have deleted_at because we use BaseRepository.
    const { data, error } = await this.query(tenant).order("date", { ascending: false });
    this.handleError(error);
    return keysToCamelCase(data) || [];
  }

  async upsertAttendance(payload) {
    // Custom upsert logic not in BaseRepository
    const { data, error } = await this.db
      .from(this.tableName)
      .upsert(keysToSnakeCase(payload), { onConflict: "employee_id, date" })
      .select()
      .maybeSingle();
    this.handleError(error);
    return keysToCamelCase(data);
  }
}

export const attendanceRepository = new AttendanceRepository();
