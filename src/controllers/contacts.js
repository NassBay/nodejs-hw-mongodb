// src/controllers/contacts.js
import {
  getContactById,
  createNewContact,
  updateContactById,
  deleteContactById,
  getContactsPaginated,
} from '../services/contact.js';

export const getContacts = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const filter = {
    contactType: type,
    isFavourite: isFavourite === 'true',
  };

  if (isFavourite === undefined) {
    delete filter.isFavourite;
  }

  const { contacts, totalItems, totalPages, hasPreviousPage, hasNextPage } =
    await getContactsPaginated(page, perPage, sortBy, sortOrder, filter);

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: parseInt(page, 10),
      perPage: parseInt(perPage, 10),
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
};

export const getContactByIdController = async (req, res) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  res.json(contact);
};

export const createContact = async (req, res) => {
  const newContact = await createNewContact(req.body);
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const updatedContact = await updateContactById(
    req.params.contactId,
    req.body,
  );
  if (!updatedContact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  res.json(updatedContact);
};

export const deleteContact = async (req, res) => {
  const deletedContact = await deleteContactById(req.params.contactId);
  if (!deletedContact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  res.json(deletedContact);
};
