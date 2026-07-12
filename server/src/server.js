import app from './app.js';
import dotenv from 'dotenv';
import { initMongo } from './services/dbService.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✓ TransFlow Server is running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
  await initMongo();
});
