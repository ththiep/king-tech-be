import { createClient } from "@supabase/supabase-js";
import { config } from "../config/index.js";
import { randomUUID } from "node:crypto";
import { keysToSnakeCase, keysToCamelCase } from "../utils/transform.js";

if (!config.supabaseUrl || !config.supabaseKey) {
  console.warn("WARNING: Supabase URL or Key is missing. Database operations will fail.");
}

export const supabase = createClient(config.supabaseUrl || "http://dummy", config.supabaseKey || "dummy", {
  auth: {
    persistSession: false,
  },
});

export function handleSupabaseError(error) {
  if (error) {
    console.error("[Supabase Error Details]:", JSON.stringify(error, null, 2));
    const err = new Error(error.message);
    err.statusCode = 500;
    err.code = error.code;
    throw err;
  }
}


