import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();

export const ACCESS_TOKEN_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds
export const REFRESH_TOKEN_TTL = 24 * 60 * 60 * 1000; // 1 day in milliseconds

export const SMTP = {
  HOST: process.env.SMTP_HOST,
  PORT: process.env.SMTP_PORT,
  USER: process.env.SMTP_USER,
  PASSWORD: process.env.SMTP_PASSWORD,
  FROM: process.env.SMTP_FROM,
};

export const CLOUDINARY = {
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  ENABLE: process.env.ENABLE_CLOUDINARY,
};

export const TEMPLATE_DIR = path.resolve('src', 'templates');
