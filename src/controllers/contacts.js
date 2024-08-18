
import fs from 'fs/promises';
import path from 'node:path';
import createHttpError from 'http-errors';
import { contactSchema, updateContactSchema } from '../validations/contacts.js';
import {
  getContactById,
  createNewContact,
  updateContactById,
  deleteContactById,
  getContactsPaginated,
  changeUserPhoto,
} from '../services/contact.js';

import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { CLOUDINARY } from '../constants/index.js';

export const getContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
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

      let photo = req.body.photo;

      if (req.file) {
        const response = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path);
        photo = response.secure_url;
      }

    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    const newContact = await createNewContact({
      name,
      phoneNumber,
      email,
      photo,
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
   let updatedData = req.body;

   if (req.file) {
     const response = await uploadToCloudinary(req.file.path);
     await fs.unlink(req.file.path);
     updatedData.photo = response.secure_url;
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




export const changeUserPhotoController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 400, message: 'No file uploaded' });
    }

    console.log('Uploaded file:', req.file);

    if (CLOUDINARY.ENABLE === 'true') {
      const response = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);

      await changeUserPhoto(req.user._id, response.secure_url);
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'uploads', 'photos', req.file.filename),
      );

      await changeUserPhoto(
        req.user._id,
        `http://localhost:3000/contacts/${req.user._id}/photo/${req.file.filename}`,
      );
      console.log(changeUserPhoto);
    }

    res
      .status(200)
      .json({ status: 200, message: 'Photo changed successfully' });
  } catch (error) {
    console.error('Error changing user photo:', error);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: error.message,
    });
  }
};
