import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || "development";

// Load specific environment file
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });
// Fallback to default .env if exists
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const config = {
  port: toNumber(process.env.PORT, 3000),
  host: process.env.HOST || "0.0.0.0",
  env: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  jwtSecret: process.env.JWT_SECRET || "default_super_secret_key_change_me",
};
