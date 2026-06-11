import { settingRepository } from "../repositories/setting.repository.js";

const DEFAULT_SETTINGS = {
  departments: ["Kinh doanh", "Kỹ thuật", "Nhân sự", "Kế toán", "Marketing"],
  workStatuses: {
    active: { labelVi: "Đang làm", labelEn: "Active", tone: "success" },
    on_leave: { labelVi: "Nghỉ phép", labelEn: "On Leave", tone: "warning" },
    inactive: { labelVi: "Tạm nghỉ", labelEn: "Inactive", tone: "danger" },
  },
  attendanceStatuses: {
    present: { labelVi: "Có mặt", labelEn: "Present", tone: "success" },
    late: { labelVi: "Đi trễ", labelEn: "Late", tone: "warning" },
    leave: { labelVi: "Nghỉ phép", labelEn: "Leave", tone: "info" },
    absent: { labelVi: "Vắng", labelEn: "Absent", tone: "danger" },
    half_day: { labelVi: "Nửa ngày", labelEn: "Half Day", tone: "warning" },
  }
};

class SettingService {
  async getSettings(user) {
    const { tenant } = user;
    const dbRecord = await settingRepository.getByTenant(tenant);
    
    if (!dbRecord) {
      return {
        tenant,
        ...DEFAULT_SETTINGS
      };
    }

    return {
      tenant: dbRecord.tenant,
      departments: dbRecord.departments || DEFAULT_SETTINGS.departments,
      workStatuses: dbRecord.work_statuses || DEFAULT_SETTINGS.workStatuses,
      attendanceStatuses: dbRecord.attendance_statuses || DEFAULT_SETTINGS.attendanceStatuses
    };
  }

  async updateSettings(payload, user) {
    const { tenant } = user;
    const dbRecord = await settingRepository.upsertByTenant(tenant, {
      departments: payload.departments,
      workStatuses: payload.workStatuses,
      attendanceStatuses: payload.attendanceStatuses
    });

    return {
      tenant: dbRecord.tenant,
      departments: dbRecord.departments,
      workStatuses: dbRecord.work_statuses,
      attendanceStatuses: dbRecord.attendance_statuses
    };
  }
}

export const settingService = new SettingService();
