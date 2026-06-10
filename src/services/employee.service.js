import { employeeRepository } from "../repositories/employee.repository.js";
import { NotFoundError } from "../utils/errors.js";
import { randomUUID } from "node:crypto";

class EmployeeService {
  async listEmployees(user, queryOptions) {
    const { tenant } = user;
    const { data, count } = await employeeRepository.list(tenant, queryOptions);
    
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
    const employee = await employeeRepository.getById(id, user.tenant);
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
    return await employeeRepository.create(newEmployee);
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
    return await employeeRepository.batchCreate(employees);
  }

  async updateEmployee(id, payload, user) {
    // Check if exists
    await this.getEmployeeById(id, user);

    const updates = {
      ...payload,
      updatedBy: user.id,
    };
    return await employeeRepository.updateById(id, user.tenant, updates);
  }

  async deleteEmployee(id, user) {
    // Check if exists
    await this.getEmployeeById(id, user);
    
    await employeeRepository.softDelete(id, user.tenant, user.id);
  }

  async batchDeleteEmployees(ids, user) {
    await employeeRepository.batchSoftDelete(ids, user.tenant, user.id);
  }
}

export const employeeService = new EmployeeService();
