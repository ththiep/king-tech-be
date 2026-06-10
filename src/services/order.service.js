import { orderRepository } from "../repositories/order.repository.js";
import { randomUUID } from "node:crypto";

class OrderService {
  async listOrders(user) {
    return await orderRepository.list(user.tenant);
  }

  async createOrder(payload, user) {
    const newOrder = {
      ...payload,
      id: payload.id || randomUUID(),
      tenant: user.tenant,
    };
    return await orderRepository.create(newOrder);
  }
}

export const orderService = new OrderService();
