import { ApiResponse } from "../utils/response.js";

export async function list(req, res, next) {
  try {
    const contactService = req.container.resolve('contactService');
    const contacts = await contactService.listContacts(req.user);
    ApiResponse.success(res, contacts, "Contacts retrieved successfully");
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const contactService = req.container.resolve('contactService');
    const contact = await contactService.createContact(req.body, req.user);
    ApiResponse.success(res, contact, "Contact created successfully", 201);
  } catch (err) {
    next(err);
  }
}
