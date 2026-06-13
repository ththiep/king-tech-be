import { NotFoundError } from "../utils/errors.js";
import { randomUUID } from "node:crypto";

export class ProductService {
  constructor({ productRepository }) {
    this.productRepository = productRepository;
  }
  async listProducts(user) {
    return await this.productRepository.list(user.tenant);
  }

  async getProductById(id, user) {
    const product = await this.productRepository.getById(id, user.tenant);
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
    return await this.productRepository.create(newProduct);
  }

  async updateProduct(id, payload, user) {
    await this.getProductById(id, user); // check existence
    return await this.productRepository.updateById(id, user.tenant, payload);
  }
}


