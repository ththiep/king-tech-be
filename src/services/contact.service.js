import { randomUUID } from "node:crypto";

export class ContactService {
  constructor({ contactRepository }) {
    this.contactRepository = contactRepository;
  }
  async listContacts(user) {
    return await this.contactRepository.list(user.tenant);
  }

  async createContact(payload, user) {
    const newContact = {
      ...payload,
      id: payload.id || randomUUID(),
      tenant: user.tenant,
    };
    return await this.contactRepository.create(newContact);
  }
}


