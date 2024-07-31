import Contact from '../models/contact.js';

export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId).lean(); // `lean()` for performance
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
    const contacts = await Contact.find().lean(); 
    return contacts;
  } catch (error) {
    throw new Error('Error fetching contacts');
  }
};

export const createNewContact = async (contactData) => {
  try {
    const newContact = new Contact(contactData);
    await newContact.save();
    return newContact.toObject(); 
  } catch (error) {
    throw new Error('Error creating contact');
  }
};

export const updateContactById = async (contactId, updateData) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      updateData,
      { new: true, runValidators: true }, 
    ).lean();
    return updatedContact;
  } catch (error) {
    throw new Error('Error updating contact');
  }
};

export const deleteContactById = async (contactId) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId).lean(); // `lean()` for performance
    return deletedContact;
  } catch (error) {
    throw new Error('Error deleting contact');
  }
};

export const getContactsPaginated = async (
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
) => {
  try {
    const pageNumber = parseInt(page, 10);
    const itemsPerPage = parseInt(perPage, 10);

    const skip = (pageNumber - 1) * itemsPerPage;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const contactQuery = Contact.find();

    if (filter.contactType) {
      contactQuery.where('contactType').equals(filter.contactType);
    }

    if (filter.isFavourite !== undefined) {
      contactQuery.where('isFavourite').equals(filter.isFavourite);
    }

    const [contacts, totalItems] = await Promise.all([
      contactQuery
        .sort(sortOptions)
        .skip(skip)
        .limit(itemsPerPage)
        .lean()
        .exec(),
      Contact.countDocuments(contactQuery.getQuery()),
    ]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      contacts,
      totalItems,
      totalPages,
      hasPreviousPage: pageNumber > 1,
      hasNextPage: pageNumber < totalPages,
    };
  } catch (error) {
    throw new Error('Error fetching paginated contacts');
  }
};
