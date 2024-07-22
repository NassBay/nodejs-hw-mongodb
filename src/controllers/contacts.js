// src/controllers/contacts.js
import createError from 'http-errors';
import {
  getContactById,
  getAllContacts,
  createNewContact,
  updateContactById,
  deleteContactById,
} from '../services/contact.js';

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(createError(500, 'Failed to retrieve contacts'));
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    if (!contact) {
      return next(createError(404, 'Contact not found'));
    }
    res.status(200).json({
      status: 'success',
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(createError(500, 'Failed to retrieve contact'));
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
      return next(createError(400, 'Missing required fields'));
    }

    const newContact = await createNewContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(createError(500, 'Failed to create contact'));
  }
};

export const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  try {
    const updatedContact = await updateContactById(contactId, {
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });
    if (!updatedContact) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 'success',
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(createError(500, 'Failed to update contact'));
  }
};

export const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const deletedContact = await deleteContactById(contactId);
    if (!deletedContact) {
      return next(createError(404, 'Contact not found'));
    }
    res.status(204).send();
  } catch (error) {
    next(createError(500, 'Failed to delete contact'));
  }
};
