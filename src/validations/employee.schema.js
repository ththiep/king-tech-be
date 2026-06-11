import { z } from "zod";

// Dùng chung cho phân trang, lọc, sắp xếp
export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(1000).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const employeeSchema = {
  // GET /api/v1/employees
  list: z.object({
    query: paginationQuerySchema.extend({
      department: z.string().optional(),
      status: z.string().optional(),
    }),
  }),

  // POST /api/v1/employees
  create: z.object({
    body: z.object({
      code: z.string().min(1, "Employee code is required"),
      name: z.string().min(2, "Name must be at least 2 characters"),
      title: z.string().min(1, "Title is required"),
      department: z.string().min(1, "Department is required"),
      email: z.string().email("Invalid email format"),
      phone: z.string().optional(),
      status: z.string().default("active"),
      baseSalary: z.coerce.number().min(0, "Salary cannot be negative").default(0),
      allowance: z.coerce.number().min(0).default(0),
      joinedAt: z.string().optional(),
      avatar: z.string().url("Avatar must be a valid URL").optional().or(z.literal("")),
      nationalId: z.string().optional(),
      dateOfBirth: z.string().optional(),
      contractCode: z.string().optional(),
    }),
  }),

  // POST /api/v1/employees/batch
  batchCreate: z.object({
    body: z.object({
      employees: z.array(
        z.object({
          code: z.string().min(1),
          name: z.string().min(2),
          title: z.string().min(1),
          department: z.string().min(1),
          email: z.string().email(),
          baseSalary: z.coerce.number().min(0).default(0),
        })
      ).min(1, "Must provide at least 1 employee for batch insert"),
    }),
  }),

  // PUT /api/v1/employees/:id
  update: z.object({
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      name: z.string().min(2).optional(),
      title: z.string().optional(),
      department: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      status: z.string().optional(),
      baseSalary: z.coerce.number().min(0).optional(),
      allowance: z.coerce.number().min(0).optional(),
    }),
  }),

  // DELETE /api/v1/employees/batch
  batchDelete: z.object({
    body: z.object({
      ids: z.array(z.string()).min(1, "Must provide at least 1 id to delete"),
    }),
  }),
};
