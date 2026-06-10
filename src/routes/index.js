import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { employeeSchema } from "../validations/employee.schema.js";
import { productSchema } from "../validations/product.schema.js";
import { orderSchema } from "../validations/order.schema.js";
import { contactSchema } from "../validations/contact.schema.js";
import { attendanceSchema } from "../validations/attendance.schema.js";

import * as authController from "../controllers/auth.controller.js";
import * as healthController from "../controllers/health.controller.js";
import * as productController from "../controllers/product.controller.js";
import * as orderController from "../controllers/order.controller.js";
import * as contactController from "../controllers/contact.controller.js";
import * as employeeController from "../controllers/employee.controller.js";
import * as attendanceController from "../controllers/attendance.controller.js";

const router = Router();

// Auth (Public)
router.post("/api/v1/auth/login", authController.login);

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

// Orders
router.get("/api/v1/orders", requireAuth, orderController.list);
router.post("/api/v1/orders", requireAuth, validate(orderSchema.create), orderController.create);

// Contacts
router.get("/api/v1/contacts", requireAuth, contactController.list);
router.post("/api/v1/contacts", requireAuth, validate(contactSchema.create), contactController.create);

// Employees
router.get("/api/v1/employees", requireAuth, validate(employeeSchema.list), employeeController.list);
router.post("/api/v1/employees", requireAuth, validate(employeeSchema.create), employeeController.create);
router.post("/api/v1/employees/batch", requireAuth, validate(employeeSchema.batchCreate), employeeController.batchCreate);
router.delete("/api/v1/employees/batch", requireAuth, validate(employeeSchema.batchDelete), employeeController.batchRemove);
router.get("/api/v1/employees/:id", requireAuth, employeeController.getById);
router.patch("/api/v1/employees/:id", requireAuth, validate(employeeSchema.update), employeeController.update);
router.put("/api/v1/employees/:id", requireAuth, validate(employeeSchema.update), employeeController.update);
router.delete("/api/v1/employees/:id", requireAuth, employeeController.remove);

// Attendance
router.get("/api/v1/attendance", requireAuth, attendanceController.list);
router.post("/api/v1/attendance", requireAuth, validate(attendanceSchema.create), attendanceController.create);

export default router;
