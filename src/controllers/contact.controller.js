import { listContacts, createContact } from "../models/db.js";
import { ApiResponse } from "../utils/response.js";

export async function list(req, res, next) {
  try {
    const contacts = await listContacts();
    ApiResponse.success(res, contacts, "Contacts retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const contact = await createContact(req.body || {});
    ApiResponse.success(res, contact, "Contact created successfully", 201);
  } catch (err) {
    next(err);
  }
}
