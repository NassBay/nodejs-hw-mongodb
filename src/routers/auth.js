import express from 'express';
import {
  register,
  login,
  logout,
  refresh,
  sendResetEmail,
  resetPassword
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  emailSchema,
  resetPasswordSchema
} from '../validations/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js'




const router = express.Router();
const jsonParser = express.json();



router.post(
  '/auth/register',
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(register),
);

router.post(
  '/auth/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(login),
);

router.post('/auth/logout', ctrlWrapper(logout));

router.post('/auth/refresh', ctrlWrapper(refresh));

router.post(
  '/auth/send-reset-email',
  validateBody(emailSchema),
  ctrlWrapper(sendResetEmail),
);

router.post(
  '/auth/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPassword),
);
export default router;