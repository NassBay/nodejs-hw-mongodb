// src/routers/contacts.js
import { Router } from 'express';
import {
  getContacts,
  getContactByIdController,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContacts));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.post('/contacts', ctrlWrapper(createContact));
router.patch('/contacts/:contactId', ctrlWrapper(updateContact));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContact));

export default router;
