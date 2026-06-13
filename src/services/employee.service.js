import { NotFoundError, BadRequestError } from "../utils/errors.js";
import { randomUUID } from "node:crypto";
import * as xlsx from "xlsx";

export class EmployeeService {
  constructor({ employeeRepository, auditLogService }) {
    this.employeeRepository = employeeRepository;
    this.auditLogService = auditLogService;
  }
  async listEmployees(user, queryOptions) {
    const { tenant } = user;
    const { data, count } = await this.employeeRepository.list(tenant, queryOptions);
    
    return {
      data,
      meta: {
        total: count,
        page: Number(queryOptions.page) || 1,
        limit: Number(queryOptions.limit) || 20,
        totalPages: Math.ceil(count / (Number(queryOptions.limit) || 20)),
      }
    };
  }

  async getEmployeeById(id, user) {
    const employee = await this.employeeRepository.getById(id, user.tenant);
    if (!employee) {
      throw new NotFoundError("Employee not found");
    }
    return employee;
  }

  async createEmployee(payload, user) {
    const newEmployee = {
      ...payload,
      id: payload.id || `emp-${Date.now()}`,
      uuid: randomUUID(),
      tenant: user.tenant,
      createdBy: user.id,
      updatedBy: user.id,
    };
    const created = await this.employeeRepository.create(newEmployee);
    
    await this.auditLogService.logAction({
      tenant: user.tenant,
      userId: user.id,
      action: "CREATE",
      resource: "EMPLOYEE",
      resourceId: created.id,
      newValues: created
    });

    return created;
  }

  async batchCreateEmployees(employeesPayload, user) {
    const employees = employeesPayload.map((p, index) => ({
      ...p,
      id: p.id || `emp-${Date.now()}-${index}`,
      uuid: randomUUID(),
      tenant: user.tenant,
      createdBy: user.id,
      updatedBy: user.id,
    }));
    const createdEmployees = await this.employeeRepository.batchCreate(employees);
    
    // Log từng nhân viên (hoặc có thể gom nhóm nếu muốn tối ưu, nhưng ở đây log rời rạc cho dễ truy vết)
    await Promise.all(createdEmployees.map(emp => 
      this.auditLogService.logAction({
        tenant: user.tenant,
        userId: user.id,
        action: "CREATE",
        resource: "EMPLOYEE",
        resourceId: emp.id,
        newValues: emp
      })
    ));

    return createdEmployees;
  }

  async updateEmployee(id, payload, user) {
    // Check if exists
    const oldEmployee = await this.getEmployeeById(id, user);

    const updates = {
      ...payload,
      updatedBy: user.id,
    };
    
    const updated = await this.employeeRepository.updateById(id, user.tenant, updates);

    await this.auditLogService.logAction({
      tenant: user.tenant,
      userId: user.id,
      action: "UPDATE",
      resource: "EMPLOYEE",
      resourceId: id,
      oldValues: oldEmployee,
      newValues: updated
    });

    return updated;
  }

  async deleteEmployee(id, user) {
    // Check if exists
    const oldEmployee = await this.getEmployeeById(id, user);
    
    await this.employeeRepository.softDelete(id, user.tenant, user.id);

    await this.auditLogService.logAction({
      tenant: user.tenant,
      userId: user.id,
      action: "DELETE",
      resource: "EMPLOYEE",
      resourceId: id,
      oldValues: oldEmployee
    });
  }

  async batchDeleteEmployees(ids, user) {
    // Chỗ này cần lấy ra danh sách các employee cũ để ghi log
    const { data: oldEmployees } = await this.employeeRepository.list(user.tenant, { filters: { id: ids }, limit: ids.length });
    
    await this.employeeRepository.batchSoftDelete(ids, user.tenant, user.id);

    await Promise.all((oldEmployees || []).map(emp => 
      this.auditLogService.logAction({
        tenant: user.tenant,
        userId: user.id,
        action: "DELETE",
        resource: "EMPLOYEE",
        resourceId: emp.id,
        oldValues: emp
      })
    ));
  }

  async importEmployees(fileBuffer, user) {
    try {
      // Đọc buffer bằng thư viện xlsx
      const workbook = xlsx.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      
      // Convert sheet thành array JSON (lấy hàng 1 làm key)
      const rawData = xlsx.utils.sheet_to_json(sheet);
      
      if (!rawData || rawData.length === 0) {
        throw new BadRequestError("File không có dữ liệu hợp lệ.");
      }

      // Chuẩn hóa keys: xóa BOM (\uFEFF), khoảng trắng thừa và chuyển về chữ thường
      const normalizedData = rawData.map(row => {
        const newRow = {};
        for (const [key, value] of Object.entries(row)) {
          const cleanKey = key.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().toLowerCase();
          newRow[cleanKey] = value;
        }
        return newRow;
      });

      // Mapping dữ liệu từ Excel sang format của DB
      const employeesPayload = normalizedData.map(row => {
        return {
          code: row["mã nhân viên"] || row["code"],
          name: row["họ tên"] || row["name"],
          email: row["email"],
          phone: row["số điện thoại"] || row["phone"],
          department: row["phòng ban"] || row["department"] || "Chưa xác định",
          title: row["chức vụ"] || row["title"] || row["position"],
          baseSalary: (row["lương cơ bản"] || row["base salary"]) ? Number(row["lương cơ bản"] || row["base salary"]) : 0,
          status: "active" // Default active
        };
      });

      // Lọc bỏ những row không có Tên hoặc Email
      const validPayloads = employeesPayload.filter(emp => emp.name && emp.email);

      if (validPayloads.length === 0) {
        throw new BadRequestError("Không tìm thấy dữ liệu hợp lệ (yêu cầu có Tên và Email).");
      }

      // Tái sử dụng hàm batchCreateEmployees
      return await this.batchCreateEmployees(validPayloads, user);

    } catch (error) {
      if (error instanceof BadRequestError) throw error;
      throw new BadRequestError(`Lỗi xử lý file Excel/CSV: ${error.message}`);
    }
  }
}


