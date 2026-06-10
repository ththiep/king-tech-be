import { createClient } from "@supabase/supabase-js";
import { config } from "../config/index.js";
import { randomUUID } from "node:crypto";

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
    const err = new Error(error.message);
    err.statusCode = 500;
    err.code = error.code;
    throw err;
  }
}

// --- PRODUCTS ---
export async function listProducts() {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  handleSupabaseError(error);
  return data;
}

export async function createProduct(payload) {
  const product = { ...payload, id: payload.id || randomUUID() };
  const { data, error } = await supabase.from("products").insert(product).select().single();
  handleSupabaseError(error);
  return data;
}

export async function getProductById(id) {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  handleSupabaseError(error);
  return data;
}

export async function updateProduct(id, payload) {
  const { data, error } = await supabase.from("products").update(payload).eq("id", id).select().maybeSingle();
  handleSupabaseError(error);
  return data;
}

// --- ORDERS ---
export async function listOrders() {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  handleSupabaseError(error);
  return data;
}

export async function createOrder(payload) {
  const order = { ...payload, id: payload.id || randomUUID() };
  const { data, error } = await supabase.from("orders").insert(order).select().single();
  handleSupabaseError(error);
  return data;
}

// --- CONTACTS ---
export async function listContacts() {
  const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
  handleSupabaseError(error);
  return data;
}

export async function createContact(payload) {
  const contact = { ...payload, id: payload.id || randomUUID() };
  const { data, error } = await supabase.from("contacts").insert(contact).select().single();
  handleSupabaseError(error);
  return data;
}

// --- EMPLOYEES ---
export async function listEmployees() {
  const { data, error } = await supabase.from("employees").select("*").order("created_at", { ascending: false });
  handleSupabaseError(error);
  return data;
}

export async function createEmployee(payload) {
  const employee = { ...payload, id: payload.id || `emp-${Date.now()}`, uuid: randomUUID() };
  const { data, error } = await supabase.from("employees").insert(employee).select().single();
  handleSupabaseError(error);
  return data;
}

export async function getEmployeeById(id) {
  const { data, error } = await supabase.from("employees").select("*").eq("id", id).maybeSingle();
  handleSupabaseError(error);
  return data;
}

export async function updateEmployee(id, payload) {
  const { data, error } = await supabase.from("employees").update(payload).eq("id", id).select().maybeSingle();
  handleSupabaseError(error);
  return data;
}

export async function deleteEmployee(id) {
  const { error } = await supabase.from("employees").delete().eq("id", id);
  handleSupabaseError(error);
  return true;
}

// --- ATTENDANCE ---
export async function listAttendance() {
  const { data, error } = await supabase.from("attendance_records").select("*").order("date", { ascending: false });
  handleSupabaseError(error);
  return data;
}

export async function upsertAttendance(payload) {
  // Upsert by primary key (employee_id, date)
  const { data, error } = await supabase.from("attendance_records").upsert(payload, { onConflict: "employee_id, date" }).select().maybeSingle();
  handleSupabaseError(error);
  return data;
}
