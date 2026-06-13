import { ApiResponse } from "../utils/response.js";

export async function list(req, res, next) {
  try {
    const employeeService = req.container.resolve('employeeService');
    const { page, limit, search, sortBy, order, department, status } = req.query;
    
    const result = await employeeService.listEmployees(req.user, {
      page, limit, search, sortBy, order,
      filters: { department, status }
    });
    
    res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      data: result.data,
      meta: result.meta
    });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const employeeService = req.container.resolve('employeeService');
    const employee = await employeeService.createEmployee(req.body, req.user);
    ApiResponse.success(res, employee, "Employee created successfully", 201);
  } catch (err) {
    next(err);
  }
}

export async function batchCreate(req, res, next) {
  try {
    const employeeService = req.container.resolve('employeeService');
    const employees = await employeeService.batchCreateEmployees(req.body.employees, req.user);
    ApiResponse.success(res, employees, "Batch created successfully", 201);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const employeeService = req.container.resolve('employeeService');
    const employee = await employeeService.getEmployeeById(req.params.id, req.user);
    ApiResponse.success(res, employee, "Employee retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const employeeService = req.container.resolve('employeeService');
    const employee = await employeeService.updateEmployee(req.params.id, req.body, req.user);
    ApiResponse.success(res, employee, "Employee updated successfully");
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const employeeService = req.container.resolve('employeeService');
    await employeeService.deleteEmployee(req.params.id, req.user);
    ApiResponse.success(res, null, "Employee deleted successfully", 204);
  } catch (err) {
    next(err);
  }
}

export async function batchRemove(req, res, next) {
  try {
    const employeeService = req.container.resolve('employeeService');
    await employeeService.batchDeleteEmployees(req.body.ids, req.user);
    ApiResponse.success(res, null, "Batch deleted successfully", 204);
  } catch (err) {
    next(err);
  }
}

export async function exportCSV(req, res, next) {
  try {
    const employeeService = req.container.resolve('employeeService');
    const result = await employeeService.listEmployees(req.user, {
      page: 1,
      limit: 5000,
    });
    
    const employees = result.data || [];
    
    // Build CSV content
    const headers = ["ID", "Code", "Name", "Title", "Department", "Email", "Phone", "Status", "Base Salary", "Allowance", "Joined At"];
    const csvRows = [headers.join(",")];
    
    for (const emp of employees) {
      const row = [
        emp.id,
        emp.code,
        `"${(emp.name || "").replace(/"/g, '""')}"`,
        `"${(emp.title || "").replace(/"/g, '""')}"`,
        `"${(emp.department || "").replace(/"/g, '""')}"`,
        emp.email,
        emp.phone || "",
        emp.status,
        emp.baseSalary || 0,
        emp.allowance || 0,
        emp.joinedAt || ""
      ];
      csvRows.push(row.join(","));
    }
    
    const csvContent = "\uFEFF" + csvRows.join("\n"); // Add BOM for UTF-8 Excel support
    
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=employees.csv");
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
}

export async function importData(req, res, next) {
  try {
    const employeeService = req.container.resolve('employeeService');
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng đính kèm file Excel hoặc CSV (field: 'file')"
      });
    }

    const createdEmployees = await employeeService.importEmployees(req.file.buffer, req.user);
    
    ApiResponse.success(res, createdEmployees, `Import thành công ${createdEmployees.length} nhân viên.`, 201);
  } catch (err) {
    next(err);
  }
}

export async function importTemplate(req, res, next) {
  try {
    const headers = ["Mã nhân viên", "Họ tên", "Email", "Số điện thoại", "Phòng ban", "Chức vụ", "Lương cơ bản"];
    const exampleRow = ["NV001", "Nguyễn Văn A", "nva@example.com", "0901234567", "Kỹ thuật", "Nhân viên", "10000000"];
    
    const csvContent = "\uFEFF" + headers.join(",") + "\n" + exampleRow.join(",");
    
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=employees_import_template.csv");
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
}

