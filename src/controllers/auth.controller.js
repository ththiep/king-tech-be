import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { supabase, handleSupabaseError } from "../models/db.js";
import { ApiResponse } from "../utils/response.js";

export async function login(req, res, next) {
  try {
    const { tenant, email, password } = req.body || {};

    if (!tenant || !email || !password) {
      const error = new Error("Tenant, email, and password are required");
      error.statusCode = 400;
      throw error;
    }

    // Find admin by email and tenant
    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("tenant", tenant)
      .eq("email", email)
      .maybeSingle();

    handleSupabaseError(error);

    if (!admin) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    // Generate JWT token
    const payload = {
      id: admin.id,
      tenant: admin.tenant,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: "1d" });

    // Exclude password_hash from the returned user object
    const { password_hash, ...adminInfo } = admin;

    ApiResponse.success(
      res,
      {
        user: adminInfo,
        accessToken,
      },
      "Admin logged in successfully"
    );
  } catch (err) {
    next(err);
  }
}
