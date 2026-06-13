import { settingRepository } from "../repositories/setting.repository.js";

const DEFAULT_SETTINGS = {
  departments: [
    { id: "d1000000-0000-0000-0000-000000000000", labelVi: "Kinh doanh", labelEn: "Sales", tone: "neutral" },
    { id: "d2000000-0000-0000-0000-000000000000", labelVi: "Kỹ thuật", labelEn: "Engineering", tone: "neutral" },
    { id: "d3000000-0000-0000-0000-000000000000", labelVi: "Nhân sự", labelEn: "HR", tone: "neutral" },
    { id: "d4000000-0000-0000-0000-000000000000", labelVi: "Kế toán", labelEn: "Accounting", tone: "neutral" },
    { id: "d5000000-0000-0000-0000-000000000000", labelVi: "Marketing", labelEn: "Marketing", tone: "neutral" }
  ],
  workStatuses: [
    { id: "w1000000-0000-0000-0000-000000000000", labelVi: "Đang làm", labelEn: "Working", tone: "success" },
    { id: "w2000000-0000-0000-0000-000000000000", labelVi: "Thử việc", labelEn: "Probation", tone: "info" },
    { id: "w3000000-0000-0000-0000-000000000000", labelVi: "Bán thời gian", labelEn: "Part-time", tone: "warning" },
    { id: "w4000000-0000-0000-0000-000000000000", labelVi: "Đã nghỉ", labelEn: "Resigned", tone: "danger" }
  ],
  attendanceStatuses: [
    { id: "a1000000-0000-0000-0000-000000000000", labelVi: "Có mặt", labelEn: "Present", tone: "success" },
    { id: "a2000000-0000-0000-0000-000000000000", labelVi: "Đi trễ", labelEn: "Late", tone: "warning" },
    { id: "a3000000-0000-0000-0000-000000000000", labelVi: "Nghỉ phép", labelEn: "Leave", tone: "info" },
    { id: "a4000000-0000-0000-0000-000000000000", labelVi: "Vắng", labelEn: "Absent", tone: "danger" },
    { id: "a5000000-0000-0000-0000-000000000000", labelVi: "Nửa ngày", labelEn: "Half Day", tone: "warning" }
  ]
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
