import { ApiResponse } from "../utils/response.js";
import { OrderResponseDto } from "../dtos/responses/order.response.dto.js";

export async function list(req, res, next) {
  try {
    const orderService = req.container.resolve('orderService');
    const orders = await orderService.listOrders(req.user);
    ApiResponse.success(res, OrderResponseDto.fromEntities(orders), "Orders retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const orderService = req.container.resolve('orderService');
    const order = await orderService.createOrder(req.body, req.user);
    ApiResponse.success(res, OrderResponseDto.fromEntity(order), "Order created successfully", 201);
  } catch (err) {
    next(err);
  }
}
