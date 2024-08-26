import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';
import chatRoutes from './routes/chat.js';
import professorRoutes from './routes/professor.js';
import scrapingRoutes from './routes/scraping.js';
import './config/pinecone.js';
import './config/googleCloud.js';

global.fetch = fetch;

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cors());
app.use(express.json());
app.use('/', chatRoutes);
app.use('/', professorRoutes);
app.use('/', scrapingRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Professor rating app listening at http://localhost:${port}`);
  });
}

export default app;