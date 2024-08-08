import Contact from '../models/contact.js';

export const getContactsPaginated = async (
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
) => {
  const skip = (page - 1) * perPage;
  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(perPage);

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return { contacts, totalItems, totalPages, hasPreviousPage, hasNextPage };
};

export const getContactById = async (id, userId) => {
  return Contact.findOne({ _id: id, userId });
};

export const createNewContact = async (contactData) => {
  const contact = new Contact(contactData);
  await contact.save();
  return contact;
};

export const updateContactById = async (id, userId, updateData) => {
  return Contact.findOneAndUpdate({ _id: id, userId }, updateData, {
    new: true,
  });
};

export const deleteContactById = async (id, userId) => {
  return Contact.findOneAndDelete({ _id: id, userId });
};
