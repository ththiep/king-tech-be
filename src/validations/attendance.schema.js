import { z } from "zod";

export const attendanceSchema = {
  // POST /api/v1/attendance
  create: z.object({
    body: z.object({
      employeeId: z.string().min(1, "Employee ID is required"),
      date: z.string().min(1, "Date is required"),
      checkIn: z.string().optional(),
      checkOut: z.string().optional(),
      status: z.enum(["present", "absent", "late", "half_day", "leave"]).default("present"),
      note: z.string().optional(),
    }),
  }),
};
