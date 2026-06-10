import { productRepository } from "../repositories/product.repository.js";
import { NotFoundError } from "../utils/errors.js";
import { randomUUID } from "node:crypto";

class ProductService {
  async listProducts(user) {
    return await productRepository.list(user.tenant);
  }

  async getProductById(id, user) {
    const product = await productRepository.getById(id, user.tenant);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    return product;
  }

  async createProduct(payload, user) {
    const newProduct = {
      ...payload,
      id: payload.id || randomUUID(),
      tenant: user.tenant,
    };
    return await productRepository.create(newProduct);
  }

  async updateProduct(id, payload, user) {
    await this.getProductById(id, user); // check existence
    return await productRepository.updateById(id, user.tenant, payload);
  }
}

export const productService = new ProductService();
