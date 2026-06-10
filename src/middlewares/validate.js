import { ApiResponse } from "../utils/response.js";
import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Express 5.x compatibility: req.query and req.body are getters
    // We cannot reassign them directly (req.query = ...), so we modify their contents instead.
    if (validatedData.body) {
      Object.keys(req.body).forEach(k => delete req.body[k]);
      Object.assign(req.body, validatedData.body);
    }
    
    if (validatedData.query) {
      Object.keys(req.query).forEach(k => delete req.query[k]);
      Object.assign(req.query, validatedData.query);
    }

    if (validatedData.params) {
      Object.keys(req.params).forEach(k => delete req.params[k]);
      Object.assign(req.params, validatedData.params);
    }

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Format Zod errors nicely
      const errors = error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      
      return ApiResponse.error(res, "Validation failed", 400, { errors });
    }
    next(error);
  }
};
