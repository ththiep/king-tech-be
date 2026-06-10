import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as healthController from "../controllers/health.controller.js";
import * as productController from "../controllers/product.controller.js";
import * as orderController from "../controllers/order.controller.js";
import * as contactController from "../controllers/contact.controller.js";
import * as employeeController from "../controllers/employee.controller.js";
import * as attendanceController from "../controllers/attendance.controller.js";

const router = Router();

// Auth
router.post("/api/v1/auth/login", authController.login);

// Health / Meta
router.get("/health", healthController.healthCheck);
router.get("/api/v1/health", healthController.healthCheck);
router.get("/api/v1/meta", healthController.getMeta);

// Products
router.get("/api/v1/products", productController.list);
router.post("/api/v1/products", productController.create);
router.get("/api/v1/products/:id", productController.getById);
router.patch("/api/v1/products/:id", productController.update);
router.put("/api/v1/products/:id", productController.update);

// Orders
router.get("/api/v1/orders", orderController.list);
router.post("/api/v1/orders", orderController.create);

// Contacts
router.get("/api/v1/contacts", contactController.list);
router.post("/api/v1/contacts", contactController.create);

// Employees
router.get("/api/v1/employees", employeeController.list);
router.post("/api/v1/employees", employeeController.create);
router.get("/api/v1/employees/:id", employeeController.getById);
router.patch("/api/v1/employees/:id", employeeController.update);
router.put("/api/v1/employees/:id", employeeController.update);
router.delete("/api/v1/employees/:id", employeeController.remove);

// Attendance
router.get("/api/v1/attendance", attendanceController.list);
router.post("/api/v1/attendance", attendanceController.create);

export default router;
