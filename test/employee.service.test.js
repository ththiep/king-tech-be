import test from "node:test";
import assert from "node:assert/strict";
import * as xlsx from "xlsx";
import { EmployeeService } from "../src/services/employee.service.js";

function buildWorkbookBuffer(rows) {
  const workbook = xlsx.utils.book_new();
  const sheet = xlsx.utils.json_to_sheet(rows);
  xlsx.utils.book_append_sheet(workbook, sheet, "Employees");
  return xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
}

test("employee import validates rows before writing to repository", async () => {
  let repositoryCalled = false;
  const service = new EmployeeService({
    employeeRepository: {
      batchCreate: async () => {
        repositoryCalled = true;
        return [];
      }
    },
    auditLogService: {
      logAction: async () => {}
    }
  });

  const buffer = buildWorkbookBuffer([
    {
      "Mã nhân viên": "NV001",
      "Họ tên": "Nguyen Van A",
      Email: "not-an-email",
      "Phòng ban": "Ky thuat",
      "Chức vụ": "Nhan vien",
      "Lương cơ bản": 10000000
    }
  ]);

  await assert.rejects(
    () => service.importEmployees(buffer, { id: "admin-1", tenant: "kingtech" }),
    /Dữ liệu import không hợp lệ/
  );
  assert.equal(repositoryCalled, false);
});

test("employee import accepts valid rows and preserves optional fields", async () => {
  let insertedPayload = null;
  const service = new EmployeeService({
    employeeRepository: {
      batchCreate: async (employees) => {
        insertedPayload = employees;
        return employees;
      }
    },
    auditLogService: {
      logAction: async () => {}
    }
  });

  const buffer = buildWorkbookBuffer([
    {
      "Mã nhân viên": "NV002",
      "Họ tên": "Tran Thi B",
      Email: "b@example.com",
      "Số điện thoại": "0900000000",
      "Phòng ban": "Nhan su",
      "Chức vụ": "Chuyen vien",
      "Lương cơ bản": 12000000
    }
  ]);

  const result = await service.importEmployees(buffer, { id: "admin-1", tenant: "kingtech" });

  assert.equal(result.length, 1);
  assert.equal(insertedPayload[0].phone, "0900000000");
  assert.equal(insertedPayload[0].status, "active");
  assert.equal(insertedPayload[0].baseSalary, 12000000);
});
