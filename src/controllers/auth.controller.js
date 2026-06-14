import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { supabase, handleSupabaseError } from "../models/db.js";
import { ApiResponse } from "../utils/response.js";
import { AuthResponseDto } from "../dtos/responses/auth.response.dto.js";

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

    const authDto = AuthResponseDto.fromEntity(admin);

    ApiResponse.success(
      res,
      {
        user: authDto,
        accessToken,
      },
      "Admin logged in successfully"
    );
  } catch (err) {
    next(err);
  }
}

export async function register(req, res, next) {
  try {
    const { tenant, email, password, name, role } = req.body || {};

    if (!tenant || !email || !password) {
      const error = new Error("Tenant, email, and password are required");
      error.statusCode = 400;
      throw error;
    }

    // Check if admin already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from("admins")
      .select("id")
      .eq("tenant", tenant)
      .eq("email", email)
      .maybeSingle();

    handleSupabaseError(checkError);

    if (existingAdmin) {
      const error = new Error("Admin with this email already exists in this tenant");
      error.statusCode = 400;
      throw error;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newPayload = {
      tenant,
      email,
      password_hash,
      name: name || email.split("@")[0],
      role: role || "admin"
    };

    const { data: newAdmin, error: insertError } = await supabase
      .from("admins")
      .insert(newPayload)
      .select()
      .single();

    handleSupabaseError(insertError);

    // Generate JWT token
    const tokenPayload = {
      id: newAdmin.id,
      tenant: newAdmin.tenant,
      email: newAdmin.email,
      role: newAdmin.role,
    };

    const accessToken = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: "1d" });

    const authDto = AuthResponseDto.fromEntity(newAdmin);

    ApiResponse.success(
      res,
      {
        user: authDto,
        accessToken,
      },
      "Admin registered successfully",
      201
    );
  } catch (err) {
    next(err);
  }
}

