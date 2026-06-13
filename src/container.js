import { createContainer, asClass, InjectionMode } from 'awilix';

// Repositories
import { AttendanceRepository } from './repositories/attendance.repository.js';
import { AuditLogRepository } from './repositories/auditLog.repository.js';
import { ContactRepository } from './repositories/contact.repository.js';
import { EmployeeRepository } from './repositories/employee.repository.js';
import { OrderRepository } from './repositories/order.repository.js';
import { ProductRepository } from './repositories/product.repository.js';
import { SettingRepository } from './repositories/setting.repository.js';

// Services
import { AttendanceService } from './services/attendance.service.js';
import { AuditLogService } from './services/auditLog.service.js';
import { ContactService } from './services/contact.service.js';
import { EmployeeService } from './services/employee.service.js';
import { OrderService } from './services/order.service.js';
import { ProductService } from './services/product.service.js';
import { SettingService } from './services/setting.service.js';
import { UploadService } from './services/upload.service.js';

const container = createContainer({
  injectionMode: InjectionMode.PROXY
});

container.register({
  // Repositories
  attendanceRepository: asClass(AttendanceRepository).singleton(),
  auditLogRepository: asClass(AuditLogRepository).singleton(),
  contactRepository: asClass(ContactRepository).singleton(),
  employeeRepository: asClass(EmployeeRepository).singleton(),
  orderRepository: asClass(OrderRepository).singleton(),
  productRepository: asClass(ProductRepository).singleton(),
  settingRepository: asClass(SettingRepository).singleton(),

  // Services
  attendanceService: asClass(AttendanceService).singleton(),
  auditLogService: asClass(AuditLogService).singleton(),
  contactService: asClass(ContactService).singleton(),
  employeeService: asClass(EmployeeService).singleton(),
  orderService: asClass(OrderService).singleton(),
  productService: asClass(ProductService).singleton(),
  settingService: asClass(SettingService).singleton(),
  uploadService: asClass(UploadService).singleton(),
});

export { container };
