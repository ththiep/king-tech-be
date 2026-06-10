import { listEmployees, createEmployee, getEmployeeById, updateEmployee, deleteEmployee } from "../models/db.js";
import { ApiResponse } from "../utils/response.js";

export async function list(req, res, next) {
  try {
    const employees = await listEmployees();
    ApiResponse.success(res, employees, "Employees retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const employee = await createEmployee(req.body || {});
    ApiResponse.success(res, employee, "Employee created successfully", 201);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const employee = await getEmployeeById(req.params.id);
    if (!employee) {
      const error = new Error("Employee not found");
      error.statusCode = 404;
      throw error;
    }
    ApiResponse.success(res, employee, "Employee retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const employee = await updateEmployee(req.params.id, req.body || {});
    if (!employee) {
      const error = new Error("Employee not found");
      error.statusCode = 404;
      throw error;
    }
    ApiResponse.success(res, employee, "Employee updated successfully");
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await deleteEmployee(req.params.id);
    ApiResponse.success(res, null, "Employee deleted successfully", 204);
  } catch (err) {
    next(err);
  }
}
