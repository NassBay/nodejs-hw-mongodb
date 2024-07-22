// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import pretty from 'pino-pretty';
import contactsRouter from './routers/contacts.js';
import createError from 'http-errors';
import errorHandler from './middlewares/errorHandler.js';

const setupServer = () => {
  const app = express();

  app.use(express.json());

  app.use(cors());

  const logger = pino(pretty());
  app.use(pinoHttp({ logger }));

  app.use('/api', contactsRouter);

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the API' });
  });


  app.use((req, res, next) => {
    next(createError(404, 'Not found'));
  });

  
  app.use(errorHandler);

  return app;
};

export { setupServer };
