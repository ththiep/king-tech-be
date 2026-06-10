import { contactRepository } from "../repositories/contact.repository.js";
import { randomUUID } from "node:crypto";

class ContactService {
  async listContacts(user) {
    return await contactRepository.list(user.tenant);
  }

  async createContact(payload, user) {
    const newContact = {
      ...payload,
      id: payload.id || randomUUID(),
      tenant: user.tenant,
    };
    return await contactRepository.create(newContact);
  }
}

export const contactService = new ContactService();
