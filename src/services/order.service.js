import { NotFoundError, BadRequestError } from "../utils/errors.js";
import { randomUUID } from "node:crypto";

export class OrderService {
  constructor({ orderRepository, productRepository }) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
  }
  async listOrders(user) {
    return await this.orderRepository.list(user.tenant);
  }

  async createOrder(payload, user) {
    const items = payload.items || [];
    
    // Verify all products and check stock
    for (const item of items) {
      const product = await this.productRepository.getById(item.productId, user.tenant);
      if (!product) {
        throw new NotFoundError(`Product not found: ${item.productName || item.productId}`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestError(`Product '${product.name}' has insufficient stock (Available: ${product.stock}, Requested: ${item.quantity})`);
      }
    }

    // Deduct stock for each product
    for (const item of items) {
      const product = await this.productRepository.getById(item.productId, user.tenant);
      const newStock = product.stock - item.quantity;
      await this.productRepository.updateById(item.productId, user.tenant, { stock: newStock });
    }

    const newOrder = {
      ...payload,
      id: payload.id || randomUUID(),
      tenant: user.tenant,
    };
    return await this.orderRepository.create(newOrder);
  }
}


