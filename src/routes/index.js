import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { employeeSchema } from "../validations/employee.schema.js";
import { productSchema } from "../validations/product.schema.js";
import { orderSchema } from "../validations/order.schema.js";
import { contactSchema } from "../validations/contact.schema.js";
import { attendanceSchema } from "../validations/attendance.schema.js";
import { createRateLimiter } from "../middlewares/rateLimit.js";
import { uploadExcelMiddleware } from "../middlewares/upload.middleware.js";
import { config } from "../config/index.js";
import { ApiResponse } from "../utils/response.js";

import * as authController from "../controllers/auth.controller.js";
import * as healthController from "../controllers/health.controller.js";
import * as productController from "../controllers/product.controller.js";
import * as orderController from "../controllers/order.controller.js";
import * as contactController from "../controllers/contact.controller.js";
import * as employeeController from "../controllers/employee.controller.js";
import * as attendanceController from "../controllers/attendance.controller.js";
import * as uploadController from "../controllers/upload.controller.js";
import * as settingController from "../controllers/setting.controller.js";

const authLimiter = createRateLimiter({ windowMs: 1 * 60 * 1000, max: 10, message: "Too many login attempts. Please try again in a minute." });
const uploadLimiter = createRateLimiter({ windowMs: 1 * 60 * 1000, max: 20, message: "Too many uploads. Please try again in a minute." });

const inactiveModule = (moduleName) => (req, res) => ApiResponse.error(
  res,
  `${moduleName} module is not active`,
  503,
  { code: "module_inactive", module: moduleName }
);

const router = Router();

// Auth (Public)
router.post("/api/v1/auth/register", authLimiter, authController.register);
router.post("/api/v1/auth/login", authLimiter, authController.login);

// Health / Meta (Public)
router.get("/health", healthController.healthCheck);
router.get("/api/v1/health", healthController.healthCheck);
router.get("/api/v1/meta", healthController.getMeta);

// --- PROTECTED ROUTES ---

// Products
router.get("/api/v1/products", requireAuth, productController.list);
router.post("/api/v1/products", requireAuth, validate(productSchema.create), productController.create);
router.get("/api/v1/products/:id", requireAuth, productController.getById);
router.patch("/api/v1/products/:id", requireAuth, validate(productSchema.update), productController.update);
router.put("/api/v1/products/:id", requireAuth, validate(productSchema.update), productController.update);

// Orders (currently inactive; enable with ORDER_MODULE_ACTIVE=true)
if (config.features.orders) {
  router.get("/api/v1/orders", requireAuth, orderController.list);
  router.post("/api/v1/orders", requireAuth, validate(orderSchema.create), orderController.create);
} else {
  router.get("/api/v1/orders", requireAuth, inactiveModule("orders"));
  router.post("/api/v1/orders", requireAuth, inactiveModule("orders"));
}

// Contacts
router.get("/api/v1/contacts", requireAuth, contactController.list);
router.post("/api/v1/contacts", requireAuth, validate(contactSchema.create), contactController.create);

// Employees
router.get("/api/v1/employees", requireAuth, validate(employeeSchema.list), employeeController.list);
router.post("/api/v1/employees", requireAuth, validate(employeeSchema.create), employeeController.create);
router.post("/api/v1/employees/batch", requireAuth, validate(employeeSchema.batchCreate), employeeController.batchCreate);
router.get("/api/v1/employees/import-template", requireAuth, employeeController.importTemplate);
router.post("/api/v1/employees/import", requireAuth, uploadExcelMiddleware.single("file"), employeeController.importData);
router.delete("/api/v1/employees/batch", requireAuth, validate(employeeSchema.batchDelete), employeeController.batchRemove);
router.get("/api/v1/employees/export", requireAuth, employeeController.exportCSV);
router.get("/api/v1/employees/:id", requireAuth, employeeController.getById);
router.patch("/api/v1/employees/:id", requireAuth, validate(employeeSchema.update), employeeController.update);
router.put("/api/v1/employees/:id", requireAuth, validate(employeeSchema.update), employeeController.update);
router.delete("/api/v1/employees/:id", requireAuth, employeeController.remove);

// Uploads
router.post("/api/v1/upload", requireAuth, uploadLimiter, uploadController.upload);

// Attendance
router.get("/api/v1/attendance", requireAuth, attendanceController.list);
router.post("/api/v1/attendance", requireAuth, validate(attendanceSchema.create), attendanceController.create);

// Settings
router.get("/api/v1/settings", requireAuth, settingController.getSettings);
router.post("/api/v1/settings", requireAuth, settingController.updateSettings);

export default router;
