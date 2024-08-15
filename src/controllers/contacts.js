import createHttpError from 'http-errors';
import { contactSchema, updateContactSchema } from '../validations/contacts.js';
import {
  getContactById,
  createNewContact,
  updateContactById,
  deleteContactById,
  getContactsPaginated,
} from '../services/contact.js';

export const getContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,
      isFavourite,
    } = req.query;

    const filter = {
      userId: req.user._id,
    };

    if (isFavourite === undefined) {
      delete filter.isFavourite;
    }

    const { contacts, totalItems, totalPages, hasPreviousPage, hasNextPage } =
      await getContactsPaginated(page, perPage, sortBy, sortOrder, filter);

    res.status(200).json({
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
  } catch (error) {
    next(createError(500, 'Failed to retrieve contacts'));
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params; 
 const userId = req.user._id;

  try {
    const contact = await getContactById(contactId, userId);

    if (!contact) {
      return next(
        createHttpError(404, `Contact with id ${contactId} not found`),
      );
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    console.error('Error retrieving contact:', error);
    next(createHttpError(500, 'Failed to retrieve contact'));
  }
};


export const createContact = async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: 400,
        message: 'Validation failed',
        data: {
          error: error.details.map((detail) => ({
            message: detail.message,
            path: detail.path,
          })),
        },
      });
    }

    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    const newContact = await createNewContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId: req.user._id,
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

  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: 'Validation failed',
        data: {
          error: error.details.map((detail) => detail.message),
        },
      });
    }

    const updatedContact = await updateContactById(
      contactId,
      req.user._id,
      req.body,
    );
    if (!updatedContact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
        data: null,
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(createError(500, 'Failed to update contact'));
  }
};

export const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const deletedContact = await deleteContactById(contactId, req.user._id);
    if (!deletedContact) {
      return next(createError(404, 'Contact not found'));
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully deleted contact!',
      data: deletedContact,
    });
  } catch (error) {
    next(createError(500, 'Failed to delete contact'));
  }
};
