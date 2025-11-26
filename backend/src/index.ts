import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './api/routes';
import { errorHandler } from './api/middleware/error.middleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

app.use('/api', routes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export { app, server };