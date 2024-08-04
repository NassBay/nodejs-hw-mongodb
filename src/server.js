import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import pretty from 'pino-pretty';
import cookieParser from 'cookie-parser';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  const logger = pino(pretty());
  app.use(pinoHttp({ logger }));

  app.use(authRouter); 
  app.use(contactsRouter); 

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the DB' });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export { setupServer };
