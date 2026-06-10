import { listProducts, createProduct, getProductById, updateProduct } from "../models/db.js";
import { ApiResponse } from "../utils/response.js";

export async function list(req, res, next) {
  try {
    const products = await listProducts();
    ApiResponse.success(res, products, "Products retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const product = await createProduct(req.body || {});
    ApiResponse.success(res, product, "Product created successfully", 201);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
    ApiResponse.success(res, product, "Product retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const product = await updateProduct(req.params.id, req.body || {});
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
    ApiResponse.success(res, product, "Product updated successfully");
  } catch (err) {
    next(err);
  }
}
