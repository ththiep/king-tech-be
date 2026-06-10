import { productService } from "../services/product.service.js";
import { ApiResponse } from "../utils/response.js";

export async function list(req, res, next) {
  try {
    const products = await productService.listProducts(req.user);
    ApiResponse.success(res, products, "Products retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const product = await productService.createProduct(req.body, req.user);
    ApiResponse.success(res, product, "Product created successfully", 201);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id, req.user);
    ApiResponse.success(res, product, "Product retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.user);
    ApiResponse.success(res, product, "Product updated successfully");
  } catch (err) {
    next(err);
  }
}
