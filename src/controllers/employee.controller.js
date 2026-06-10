import { employeeService } from "../services/employee.service.js";
import { ApiResponse } from "../utils/response.js";

export async function list(req, res, next) {
  try {
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
    const employee = await employeeService.createEmployee(req.body, req.user);
    ApiResponse.success(res, employee, "Employee created successfully", 201);
  } catch (err) {
    next(err);
  }
}

export async function batchCreate(req, res, next) {
  try {
    const employees = await employeeService.batchCreateEmployees(req.body.employees, req.user);
    ApiResponse.success(res, employees, "Batch created successfully", 201);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id, req.user);
    ApiResponse.success(res, employee, "Employee retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const employee = await employeeService.updateEmployee(req.params.id, req.body, req.user);
    ApiResponse.success(res, employee, "Employee updated successfully");
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await employeeService.deleteEmployee(req.params.id, req.user);
    ApiResponse.success(res, null, "Employee deleted successfully", 204);
  } catch (err) {
    next(err);
  }
}

export async function batchRemove(req, res, next) {
  try {
    await employeeService.batchDeleteEmployees(req.body.ids, req.user);
    ApiResponse.success(res, null, "Batch deleted successfully", 204);
  } catch (err) {
    next(err);
  }
}
