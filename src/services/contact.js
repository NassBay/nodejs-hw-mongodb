// src/services/contact.js
import Contact from '../models/contact.js';

export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return null;
    }
    return contact;
  } catch (error) {
    throw new Error('Error fetching contact');
  }
};

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    throw new Error('Error fetching contacts');
  }
};

export const createNewContact = async (contactData) => {
  try {
    const newContact = new Contact(contactData);
    await newContact.save();
    return newContact;
  } catch (error) {
    throw new Error('Error creating contact');
  }
};

export const updateContactById = async (contactId, updateData) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      updateData,
      { new: true },
    );
    return updatedContact;
  } catch (error) {
    throw new Error('Error updating contact');
  }
};

export const deleteContactById = async (contactId) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    return deletedContact;
  } catch (error) {
    throw new Error('Error deleting contact');
  }
};
