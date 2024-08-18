
// src/routers/contacts.js
import { Router } from 'express';
import path from 'node:path';
import {
  getContacts,
  getContactByIdController,
  createContact,
  updateContact,
  deleteContact,
  changeUserPhotoController,
} from '../controllers/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { contactSchema, updateContactSchema } from '../validations/contacts.js';
import { upload } from "../middlewares/upload.js"
import multer from 'multer';

const router = Router();

router.use(authenticate);

router.get('/contacts', ctrlWrapper(getContacts));
router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post(
  '/contacts',
  upload.single('photo'),
  validateBody(contactSchema),
  ctrlWrapper(createContact),
);
router.patch(
  '/contacts/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact),
);

router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContact));

router.patch(
  '/contacts/:contactId/photo',
  isValidId,
  upload.single('photo'),
  ctrlWrapper(changeUserPhotoController),
);

export default router;
