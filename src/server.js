import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import pretty from 'pino-pretty';
import { getContactByIdController, getContacts } from './controllers/contactsController.js';

const setupServer = () => {
  const app = express();


  app.use(express.json());


  app.use(cors());


  const logger = pino(pretty());
  app.use(pinoHttp({ logger }));


  app.get('/contacts', getContacts); 
  app.get('/contacts/:contactId', getContactByIdController); 

 
  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  return app;
};

export { setupServer };
