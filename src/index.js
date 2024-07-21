import dotenv from 'dotenv';
import { setupServer } from './server.js';
import initMongoConnection from './db/initMongoConnection.js';
import './models/contact.js'; 


dotenv.config();

const startServer = async () => {
  try {
   
    await initMongoConnection();

    const app = setupServer();


    const PORT = process.env.PORT;

    app.listen(PORT, 'localhost', () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
