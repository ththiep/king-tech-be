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

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

const DEV_ONLY_JWT_SECRET = "development_only_unsafe_jwt_secret";
const LEGACY_DEFAULT_JWT_SECRET = "default_super_secret_key_change_me";

export function buildConfig(envSource = process.env) {
  const currentEnv = envSource.NODE_ENV || "development";
  const isProduction = currentEnv === "production";

  const jwtSecret = envSource.JWT_SECRET || (isProduction ? "" : DEV_ONLY_JWT_SECRET);
  const requiredProductionKeys = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "JWT_SECRET",
  ];

  if (isProduction) {
    const missingKeys = requiredProductionKeys.filter((key) => !envSource[key]);
    if (missingKeys.length > 0) {
      throw new Error(`Missing required production environment variables: ${missingKeys.join(", ")}`);
    }

    if (jwtSecret === DEV_ONLY_JWT_SECRET || jwtSecret === LEGACY_DEFAULT_JWT_SECRET) {
      throw new Error("JWT_SECRET must be explicitly configured for production");
    }
  }

  return {
    port: toNumber(envSource.PORT, 3000),
    host: envSource.HOST || "0.0.0.0",
    env: currentEnv,
    corsOrigin: envSource.CORS_ORIGIN || "*",
    supabaseUrl: envSource.SUPABASE_URL || "",
    supabaseKey: envSource.SUPABASE_SERVICE_ROLE_KEY || "",
    jwtSecret,
    features: {
      orders: toBoolean(envSource.ORDER_MODULE_ACTIVE, false),
    },
  };
}

export const config = buildConfig(process.env);
