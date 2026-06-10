import { listOrders, createOrder } from "../models/db.js";
import { ApiResponse } from "../utils/response.js";

export async function list(req, res, next) {
  try {
    const orders = await listOrders();
    ApiResponse.success(res, orders, "Orders retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const order = await createOrder(req.body || {});
    ApiResponse.success(res, order, "Order created successfully", 201);
  } catch (err) {
    next(err);
  }
}
